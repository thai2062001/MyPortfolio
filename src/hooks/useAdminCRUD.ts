import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface UseAdminCRUDOptions<T> {
  tableName: string;
  onSuccess?: (data: T | T[] | null) => void;
  onError?: (error: any) => void;
  idField?: string;
  defaultOrderBy?: { column: keyof T; ascending?: boolean };
}

export const useAdminCRUD = <T extends Record<string, any>>({
  tableName,
  onSuccess,
  onError,
  idField = "id",
  defaultOrderBy,
}: UseAdminCRUDOptions<T>) => {
  const queryClient = useQueryClient();
  const queryKey = [tableName];

  // Point 1: Global Caching with useQuery
  const { data = [], isLoading: loading, refetch: fetchData } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase.from(tableName).select("*");
      
      if (defaultOrderBy) {
        query = query.order(defaultOrderBy.column as string, {
          ascending: defaultOrderBy.ascending ?? true,
        });
      }

      const { data: result, error } = await query;
      if (error) throw error;
      return result as T[];
    },
  });

  // Point 2: Optimistic Updates for Upsert
  const upsertMutation = useMutation({
    mutationFn: async ({ formData, id }: { formData: Partial<T>, id?: string | number }) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .upsert(
          id ? { ...formData, [idField]: id } : formData,
          { onConflict: idField }
        )
        .select()
        .single();

      if (error) throw error;
      return result as T;
    },
    onMutate: async ({ formData, id }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<T[]>(queryKey);

      if (previousData) {
        if (id) {
          // Update
          queryClient.setQueryData<T[]>(queryKey, (old) => 
            old?.map(item => item[idField] === id ? { ...item, ...formData } : item)
          );
        } else {
          // Create (Optimistic Add)
          const newItem = { 
            ...formData, 
            [idField]: 'temp-' + Date.now(),
            created_at: new Date().toISOString()
          } as T;
          
          queryClient.setQueryData<T[]>(queryKey, (old) => {
            const list = old || [];
            // If it has order_index, try to put it at the end or maintain order
            if (typeof newItem.order_index === 'number') {
              return [...list, newItem].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
            }
            return [newItem, ...list];
          });
        }
      }

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error("Protocol error during save.");
      onError?.(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: (result, variables) => {
      toast.success(variables.id ? "System updated successfully." : "Item added to the collection.");
      onSuccess?.(result);
    }
  });

  // Point 2: Optimistic Updates for Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq(idField, id);
      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<T[]>(queryKey);

      if (previousData) {
        queryClient.setQueryData<T[]>(queryKey, (old) => 
          old?.filter(item => item[idField] !== id)
        );
      }

      return { previousData };
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error("Operation failed. Please try again.");
      onError?.(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: () => {
      toast.success("Item removed from the database.");
      onSuccess?.(null);
    }
  });

  const upsertData = useCallback(async (formData: Partial<T>, id?: string | number) => {
    try {
      return await upsertMutation.mutateAsync({ formData, id });
    } catch {
      return null;
    }
  }, [upsertMutation]);

  const deleteData = useCallback(async (id: string | number) => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  }, [deleteMutation]);

  return {
    data,
    setData: (newData: T[]) => queryClient.setQueryData(queryKey, newData),
    loading,
    saving: upsertMutation.isPending,
    deleting: deleteMutation.isPending,
    fetchData,
    upsertData,
    deleteData,
  };
};
