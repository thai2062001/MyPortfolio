import { supabase } from "./supabase";
import { MediaFolder, MediaAsset } from "@/types/media";

// --- Folders ---

export const getMediaFolders = async (): Promise<MediaFolder[]> => {
  const { data, error } = await supabase
    .from("media_folders")
    .select("*")
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createMediaFolder = async (folder: Partial<MediaFolder>): Promise<MediaFolder> => {
  const { data, error } = await supabase
    .from("media_folders")
    .insert([folder])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMediaFolder = async (id: string, folder: Partial<MediaFolder>): Promise<MediaFolder> => {
  const { data, error } = await supabase
    .from("media_folders")
    .update(folder)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMediaFolder = async (id: string, destinationFolderId: string): Promise<void> => {
  // Move assets to destination folder first
  const { error: moveError } = await supabase
    .from("media_assets")
    .update({ folder_id: destinationFolderId })
    .eq("folder_id", id);

  if (moveError) throw moveError;

  // Delete the folder
  const { error: deleteError } = await supabase
    .from("media_folders")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;
};

export const getFolderBySlug = async (slug: string): Promise<MediaFolder | null> => {
  const { data, error } = await supabase
    .from("media_folders")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// --- Assets ---

export const getMediaAssets = async (folderId?: string, assetType?: string): Promise<MediaAsset[]> => {
  let query = supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (folderId) {
    query = query.eq("folder_id", folderId);
  }

  if (assetType) {
    query = query.eq("asset_type", assetType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

export const createMediaAsset = async (asset: Partial<MediaAsset>): Promise<MediaAsset> => {
  const { data, error } = await supabase
    .from("media_assets")
    .insert([asset])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMediaAsset = async (id: string, asset: Partial<MediaAsset>): Promise<MediaAsset> => {
  const { data, error } = await supabase
    .from("media_assets")
    .update(asset)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMediaAsset = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

export const moveMediaAssets = async (assetIds: string[], folderId: string): Promise<void> => {
  const { error } = await supabase
    .from("media_assets")
    .update({ folder_id: folderId })
    .in("id", assetIds);

  if (error) throw error;
};
