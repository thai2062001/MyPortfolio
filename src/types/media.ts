export type AssetType = 'image' | 'icon' | 'svg' | 'video' | 'other';

export interface MediaFolder {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  order_index: number;
  is_active: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  children?: MediaFolder[]; // For tree structure
}

export interface MediaAsset {
  id: string;
  folder_id: string | null;
  file_name: string;
  original_file_name: string | null;
  file_extension: string | null;
  mime_type: string | null;
  asset_type: AssetType;
  provider: string;
  public_id: string;
  url: string;
  secure_url: string;
  width: number | null;
  height: number | null;
  file_size: number | null;
  alt_text: string | null;
  title: string | null;
  caption: string | null;
  tags: string[];
  is_svg: boolean;
  is_icon: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  folder_name?: string;
  folder_slug?: string;
}
