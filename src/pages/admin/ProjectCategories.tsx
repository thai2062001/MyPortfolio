import { useState, memo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ProjectCategory } from "@/types/admin";
import {
  Hash,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { ResponsiveDataTable } from "@/components/admin/shared/ResponsiveDataTable";
import { AdminDialogForm } from "@/components/admin/shared/AdminDialogForm";
import { AdminTaxonomyForm } from "@/components/admin/shared/AdminTaxonomyForm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ProjectCategories = () => {
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("identity");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const queryClient = useQueryClient();

  const { data: categories, loading, saving, upsertData, deleteData, deleting } = useAdminCRUD<ProjectCategory>({
    tableName: "project_categories",
    defaultOrderBy: { column: "order_index", ascending: true }
  });

  // Bulk status update
  const bulkStatusUpdateMutation = useMutation({
    mutationFn: async ({ ids, isPublished }: { ids: (string | number)[], isPublished: boolean }) => {
      const { error } = await supabase
        .from("project_categories")
        .update({ is_published: isPublished })
        .in("id", ids);
      if (error) throw error;
      return { ids, isPublished };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project_categories"] });
      toast.success(t(
        `Bulk updated ${variables.ids.length} categories`,
        `${variables.ids.length}件のカテゴリーを一括更新しました`,
        `Đã cập nhật hàng loạt ${variables.ids.length} danh mục`
      ));
      setSelectedIds([]);
    },
    onError: () => toast.error("Bulk update failure")
  });

  // Bulk delete
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: (string | number)[]) => {
      const { error } = await supabase
        .from("project_categories")
        .delete()
        .in("id", ids);
      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: ["project_categories"] });
      toast.success(t(
        `Bulk deleted ${ids.length} categories`,
        `${ids.length}件のカテゴリーを一括削除しました`,
        `Đã xóa hàng loạt ${ids.length} danh mục`
      ));
      setSelectedIds([]);
    },
    onError: () => toast.error("Bulk delete failure")
  });

  const [formData, setFormData] = useState<Partial<ProjectCategory>>({
    slug: "",
    name_en: "",
    name_ja: "",
    name_vi: "",
    order_index: 0,
    is_published: true,
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      slug: "",
      name_en: "",
      name_ja: "",
      name_vi: "",
      order_index: categories.length,
      is_published: true,
    });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleEdit = (category: ProjectCategory) => {
    setEditingId(category.id);
    setFormData({ ...category });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const success = await upsertData(formData, editingId || undefined);
    if (success) setIsDialogOpen(false);
  };

  const handleFillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      slug: "sample-project-cat",
      name_en: "Web Development",
      is_active: true,
    }));
    toast.success(t("Sample data injected!", "サンプルデータが入力されました！", "Dữ liệu mẫu đã được điền!"));
  };

  const handleDelete = async () => {
    if (deleteConfirm.itemId) {
      const success = await deleteData(deleteConfirm.itemId);
      if (success) deleteConfirm.closeConfirm();
    }
  };

  const columns = [
    {
      header: t("Category", "カテゴリー", "Danh mục"),
      key: "name_en",
      render: (row: ProjectCategory) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center text-sage">
            <Hash size={18} />
          </div>
          <div className="text-left">
            <div className="font-bold text-heading">
              {lang === 'ja' ? row.name_ja || row.name_en : lang === 'vi' ? row.name_vi || row.name_en : row.name_en}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">ID: {row.slug}</div>
          </div>
        </div>
      )
    },
    {
      header: translations[lang].status,
      key: "is_published",
      render: (row: ProjectCategory) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.is_published ? 'bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]' : 'bg-amber-400'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {row.is_published ? t("Deployed", "デプロイ済み", "Đã triển khai") : t("Vaulted", "保管済み", "Đã lưu trữ")}
          </span>
        </div>
      )
    },
    {
      header: translations[lang].orderIndex,
      key: "order_index",
      render: (row: ProjectCategory) => (
        <span className="text-[10px] font-bold text-muted-foreground font-mono px-2 py-1 bg-stone-50 rounded-lg">#{row.order_index}</span>
      )
    }
  ];

  const taxonomyTabs = [
    { id: "identity", label: t("Core", "コア", "Cốt lõi"), icon: Hash },
    { id: "visuals", label: t("Media", "メディア", "Phương tiện"), icon: Sparkles },
    { id: "protocols", label: t("Indexing", "インデックス", "Chỉ mục"), icon: ShieldCheck }
  ];

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={handleDelete}
        itemName={deleteConfirm.itemName}
        isLoading={deleting}
      />

      <div className="space-y-12 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={t("Project Categories", "プロジェクトカテゴリー", "Danh mục dự án")}
          description={t("Set topological boundaries for optimal project classification.", "最適なプロジェクト分類のためのトポロジー境界を設定します。", "Thiết lập ranh giới dự án để phân loại tối ưu.")}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: t("Add Category", "カテゴリーを追加", "Thêm danh mục mới"),
            onClick: handleAdd
          }}
          headerActions={
            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-1 p-1"
                >
                  <div className="h-10 flex items-center gap-2 px-3 bg-sage/10 rounded-xl mr-1">
                    <div className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center font-black text-[10px]">
                      {selectedIds.length}
                    </div>
                  </div>

                  <button
                    onClick={() => bulkStatusUpdateMutation.mutate({ ids: selectedIds, isPublished: true })}
                    disabled={bulkStatusUpdateMutation.isPending}
                    className="h-10 px-3 rounded-xl hover:bg-sage/10 text-sage transition-all flex items-center gap-2"
                    title={t("Publish", "公開", "Hiển thị")}
                  >
                    <Eye size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Deploy</span>
                  </button>

                  <button
                    onClick={() => bulkStatusUpdateMutation.mutate({ ids: selectedIds, isPublished: false })}
                    disabled={bulkStatusUpdateMutation.isPending}
                    className="h-10 px-3 rounded-xl hover:bg-slate-100 text-slate-500 transition-all flex items-center gap-2"
                    title={t("Vault", "保管", "Lưu trữ")}
                  >
                    <EyeOff size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Vault</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(t(`Delete ${selectedIds.length} categories?`, `${selectedIds.length}件削除しますか？`, `Xóa ${selectedIds.length} danh mục?`))) {
                        bulkDeleteMutation.mutate(selectedIds);
                      }
                    }}
                    disabled={bulkDeleteMutation.isPending}
                    className="h-10 px-3 rounded-xl hover:bg-red-50 text-red-500 transition-all flex items-center gap-2"
                    title={t("Delete", "削除", "Xóa")}
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="w-px h-6 bg-slate-200 mx-1" />
                  
                  <button 
                    onClick={() => setSelectedIds([])}
                    className="h-10 px-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          }
        />

        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-sm">
          <ResponsiveDataTable
            data={categories}
            columns={columns}
            loading={loading}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            searchTerm={searchTerm}
            searchFields={["name_en", "name_ja", "name_vi", "slug"]}
            onEdit={handleEdit}
            onDelete={(item) => deleteConfirm.openConfirm(item.id, lang === 'ja' ? item.name_ja || item.name_en : lang === 'vi' ? item.name_vi || item.name_en : item.name_en)}
            emptyState={{
              title: t("No categories match your search.", "検索に一致するカテゴリーはありません。", "Không tìm thấy danh mục nào khớp với tìm kiếm."),
              icon: LayoutGrid,
              onReset: () => setSearchTerm("")
            }}
          />
        </div>

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? t("Edit Domain", "ドメインを編集", "Chỉnh sửa Tên miền") : t("Register Domain", "ドメインを登録", "Đăng ký Tên miền")}
          description={t("Set topological boundaries for optimal project classification.", "最適なプロジェクト分類のためのトポロジー境界を設定します。", "Thiết lập ranh giới cấu trúc để phân loại dự án tối ưu.")}
          tabs={taxonomyTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={saving}
          saveLabel={t("Synchronize", "同期する", "Đồng bộ hóa")}
        >
          <AdminTaxonomyForm
            formData={formData}
            setFormData={setFormData}
            activeSection={activeTab}
            setActiveSection={setActiveTab}
            editingId={editingId}
            onFillSampleData={!editingId ? handleFillSampleData : undefined}
            config={{
              hasI18n: true,
              hasDescription: true,
              hasIcon: true,
              statusField: "is_active",
              slugLabel: "Domain Matrix ID"
            }}
          />
        </AdminDialogForm>
      </div>
    </AdminLayout>
  );
};

export default memo(ProjectCategories);
