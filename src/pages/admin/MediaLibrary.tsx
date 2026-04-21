"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getMediaFolders,
  getMediaAssets,
  createMediaFolder,
  updateMediaFolder,
  deleteMediaFolder,
  createMediaAsset,
  deleteMediaAsset,
  updateMediaAsset,
} from "@/lib/supabase-media";
import { uploadMedia } from "@/lib/cloudinary";
import { MediaFolder, MediaAsset, AssetType } from "@/types/media";
import {
  FolderPlus,
  Folder,
  Plus,
  Search,
  Loader2,
  FileIcon,
  Menu,
  Trash2,
  Scissors,
  CheckCircle2,
  XCircle,
  Zap,
  AlertTriangle,
  MoveRight,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { MediaFolderSidebar } from "@/components/admin/media/library/MediaFolderSidebar";
import { MediaAssetGrid } from "@/components/admin/media/library/MediaAssetGrid";
import { MediaAssetDetails } from "@/components/admin/media/library/MediaAssetDetails";
import { MediaFolderDialog } from "@/components/admin/media/library/MediaFolderDialog";
import { MediaUploadDialog } from "@/components/admin/media/library/MediaUploadDialog";
import {
  MediaOptimizationDialog,
  OptimizationSettings,
} from "@/components/admin/media/library/MediaOptimizationDialog";
import { UnusedMediaDialog } from "@/components/admin/media/library/UnusedMediaDialog";
import { BulkMoveDialog } from "@/components/admin/media/library/BulkMoveDialog";
import { StorageStatsCard } from "@/components/admin/media/library/StorageStatsCard";
import { BatchProcessDialog } from "@/components/admin/media/library/BatchProcessDialog";
import { useLang } from "@/contexts/LangContext";
import { BulkActionToolbar } from "@/components/admin/shared/BulkActionToolbar";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  optimizeImage,
  validateImageFile,
  getImageDimensions,
} from "@/lib/media-optimizer";

const MediaLibrary = () => {
  const { t } = useLang();
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType | "all">(
    "all",
  );

  // Selection
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  // Modals state
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [folderFormData, setFolderFormData] = useState({
    name: "",
    description: "",
    parent_id: null as string | null,
  });

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFolderId, setUploadFolderId] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<{ icon: boolean }>({
    icon: false,
  });

  // New Enhancement Modals
  const [isOptimizationDialogOpen, setIsOptimizationDialogOpen] =
    useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [optimizationSettings, setOptimizationSettings] =
    useState<OptimizationSettings>({
      enabled: true,
      maxWidth: 2400,
      maxHeight: 2400,
      quality: 85,
    });
  const [isUnusedDialogOpen, setIsUnusedDialogOpen] = useState(false);
  const [isBulkMoveDialogOpen, setIsBulkMoveDialogOpen] = useState(false);
  const [showStorageStats, setShowStorageStats] = useState(false);
  const [isBatchProcessDialogOpen, setIsBatchProcessDialogOpen] =
    useState(false);

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const selectedAsset = assets.find((a) => a.id === selectedAssetId);
  const [isEditingAsset, setIsEditingAsset] = useState(false);
  const [assetFormData, setAssetFormData] = useState({
    title: "",
    alt_text: "",
    caption: "",
  });

  const deleteConfirm = useDeleteConfirm();
  const bulkDeleteConfirm = useDeleteConfirm();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    // Skip the first run as fetchInitialData handles it, 
    // and skip if we're still doing the initial load
    if (loading) return;

    fetchAssets(
      selectedFolderId,
      assetTypeFilter === "all" ? undefined : assetTypeFilter,
      true // We are switching folder or filter, so clear the grid
    );
    setSelectedAssetIds([]); // Clear selection when switching folders or filters
  }, [selectedFolderId, assetTypeFilter]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const fetchedFolders = await getMediaFolders();
      setFolders(fetchedFolders);

      // Default to common folder if exists
      const common = fetchedFolders.find((f) => f.slug === "common");
      
      // Setting this will trigger the useEffect, but we also want to wait for the initial asset fetch
      if (common) {
        setSelectedFolderId(common.id);
        await fetchAssets(common.id);
      } else {
        await fetchAssets(null);
      }
    } catch (error) {
      toast.error(
        t(
          "Failed to sync media matrix.",
          "メディア同期に失敗しました。",
          "Đồng bộ hóa phương tiện thất bại.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async (folderId?: string | null, type?: string, isSwitchingFolder = false) => {
    try {
      setIsRefreshing(true);
      // Only clear assets if we are actually switching folders to prevent flash
      if (isSwitchingFolder) {
        setAssets([]); 
      }
      
      const fetchedAssets = await getMediaAssets(folderId || undefined, type);
      setAssets(fetchedAssets);
    } catch (error) {
      console.error("Asset matrix sync failed:", error);
      toast.error(t("Failed to sync assets.", "アセットの同期に失敗しました。", "Đồng bộ hóa tài nguyên thất bại."));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderFormData.name) return;
    try {
      const slug = folderFormData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      await createMediaFolder({
        ...folderFormData,
        slug,
        is_active: true,
        is_system: false,
      });
      toast.success(
        t(
          "New Media Pod integrated.",
          "新しいメディアフォルダーが作成されました。",
          "Đã tích hợp Media Pod mới.",
        ),
      );
      setIsFolderDialogOpen(false);
      const fetchedFolders = await getMediaFolders();
      setFolders(fetchedFolders);
    } catch (error: any) {
      if (error.code === "23505")
        toast.error(
          t(
            "A folder with this name/slug already exists.",
            "この名前のフォルダーは既に存在します。",
            "Thư mục có tên này đã tồn tại.",
          ),
        );
      else
        toast.error(
          t(
            "Error during expansion.",
            "エラーが発生しました。",
            "Lỗi trong quá trình mở rộng.",
          ),
        );
    }
  };

  const handleUpdateFolder = async () => {
    if (!editingFolderId || !folderFormData.name) return;
    try {
      await updateMediaFolder(editingFolderId, folderFormData);
      toast.success(
        t(
          "Media Pod refined.",
          "メディアフォルダーが更新されました。",
          "Đã tinh chỉnh Media Pod.",
        ),
      );
      setIsFolderDialogOpen(false);
      const fetchedFolders = await getMediaFolders();
      setFolders(fetchedFolders);
    } catch (error) {
      toast.error(
        t(
          "Update protocol failed.",
          "更新に失敗しました。",
          "Giao thức cập nhật thất bại.",
        ),
      );
    }
  };

  const handleDeleteFolder = async () => {
    if (!deleteConfirm.itemId) return;
    try {
      const common = folders.find((f) => f.slug === "common");
      if (!common) throw new Error("Central pod (common) missing.");

      await deleteMediaFolder(deleteConfirm.itemId, common.id);
      toast.success(
        t(
          "Media Pod purged. Resources moved to Central Pod.",
          "フォルダーを削除し、リソースをメインに移動しました。",
          "Đã xóa Media Pod. Tài nguyên đã được chuyển về Pod Trung tâm.",
        ),
      );
      deleteConfirm.closeConfirm();
      const fetchedFolders = await getMediaFolders();
      setFolders(fetchedFolders);
      if (selectedFolderId === deleteConfirm.itemId)
        setSelectedFolderId(common.id);
    } catch (error) {
      toast.error(
        t(
          "Purge aborted. Dependency conflict.",
          "削除に失敗しました。",
          "Hủy bỏ việc xóa. Xung đột phụ thuộc.",
        ),
      );
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // For single file, show optimization dialog with preview and crop
    if (files.length === 1) {
      setPendingFiles(files);
      setIsOptimizationDialogOpen(true);
    } else {
      // For multiple files, open batch process dialog with files
      setPendingFiles(files);
      setIsUploadDialogOpen(false);
      setIsBatchProcessDialogOpen(true);
    }
  };

  const processUpload = async (
    files: File[],
    settings: OptimizationSettings,
    croppedFile?: File,
  ) => {
    setIsUploading(true);
    let successCount = 0;

    let targetFolderId = uploadFolderId || selectedFolderId;
    if (!targetFolderId) {
      const common = folders.find((f) => f.slug === "common");
      targetFolderId = common?.id || null;
    }

    const currentFolder = folders.find((f) => f.id === targetFolderId);

    // If we have a cropped file, use it instead of the first file
    const filesToProcess = croppedFile ? [croppedFile] : files;

    for (const file of filesToProcess) {
      try {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(validation.error || `Invalid file: ${file.name}`);
          continue;
        }

        // Optimize if enabled and is image (not SVG)
        let processedFile = file;
        if (
          settings.enabled &&
          file.type.startsWith("image/") &&
          !file.type.includes("svg")
        ) {
          try {
            processedFile = await optimizeImage(file, {
              maxWidth: settings.maxWidth,
              maxHeight: settings.maxHeight,
              quality: settings.quality / 100,
              format: "jpeg",
            });

            const originalSize = file.size;
            const optimizedSize = processedFile.size;
            const savings = originalSize - optimizedSize;
            const savingsPercent = Math.round((savings / originalSize) * 100);

            console.log(`Optimized ${file.name}: ${savingsPercent}% smaller`);
          } catch (error) {
            console.error("Optimization failed, using original:", error);
            processedFile = file;
          }
        }

        // Upload to Cloudinary
        const metadata = await uploadMedia(processedFile, {
          folder: currentFolder?.slug || "common",
          isIcon: uploadMode.icon,
        });

        // Save to database
        await createMediaAsset({
          ...metadata,
          folder_id: targetFolderId,
          title: file.name,
        });

        successCount++;
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        toast.error(
          t(
            `Ingestion failed for ${file.name}`,
            `${file.name}のアップロードに失敗しました。`,
            `Không thể nạp tệp cho ${file.name}`,
          ),
        );
      }
    }

    if (successCount > 0) {
      toast.success(
        t(
          `${successCount} resources integrated into grid.`,
          `${successCount}個のリソースがグリッドに統合されました。`,
          `${successCount} tài nguyên đã được tích hợp vào lưới.`,
        ),
      );
      fetchAssets(
        selectedFolderId,
        assetTypeFilter === "all" ? undefined : assetTypeFilter,
      );
    }

    setIsUploading(false);
    setIsUploadDialogOpen(false);
    setPendingFiles([]);
  };

  const handleUpdateAsset = async () => {
    if (!selectedAssetId) return;
    try {
      await updateMediaAsset(selectedAssetId, assetFormData);
      toast.success(
        t(
          "Metadata refined.",
          "メタデータが更新されました。",
          "Đã tinh chỉnh siêu dữ liệu.",
        ),
      );
      setIsEditingAsset(false);
      fetchAssets(
        selectedFolderId,
        assetTypeFilter === "all" ? undefined : assetTypeFilter,
      );
    } catch (error) {
      toast.error(
        t(
          "Metadata update failed.",
          "メタデータの更新に失敗しました。",
          "Cập nhật siêu dữ liệu thất bại.",
        ),
      );
    }
  };

  const assetDeleteConfirm = useDeleteConfirm();

  const handleConfirmDeleteAsset = async () => {
    if (!assetDeleteConfirm.itemId) return;
    try {
      await deleteMediaAsset(assetDeleteConfirm.itemId);
      toast.success(
        t("Resource purged.", "リソースを削除しました。", "Đã xóa tài nguyên."),
      );
      if (selectedAssetId === assetDeleteConfirm.itemId)
        setSelectedAssetId(null);
      assetDeleteConfirm.closeConfirm();
      fetchAssets(
        selectedFolderId,
        assetTypeFilter === "all" ? undefined : assetTypeFilter,
      );
    } catch (error) {
      toast.error(
        t(
          "Purge protocol failed.",
          "削除に失敗しました。",
          "Giao thức xóa thất bại.",
        ),
      );
    }
  };

  // Bulk Actions
  const handleToggleAssetSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedAssetIds.includes(id)) {
      setSelectedAssetIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedAssetIds((prev) => [...prev, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAssetIds.length === filteredAssets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(filteredAssets.map((a) => a.id));
    }
  };

  const handleBulkDeleteAssets = () => {
    if (selectedAssetIds.length === 0) return;
    bulkDeleteConfirm.openConfirm(
      t(
        `${selectedAssetIds.length} resources`,
        `${selectedAssetIds.length}個のリソース`,
        `${selectedAssetIds.length} tài nguyên`
      )
    );
  };

  const handleConfirmBulkDeleteAssets = async () => {
    setIsBulkPending(true);
    try {
      // Loop delete as our helper deleteMediaAsset might handle cloud cleanup too
      for (const id of selectedAssetIds) {
        await deleteMediaAsset(id);
      }
      toast.success(
        t(
          `Purged ${selectedAssetIds.length} resources.`,
          `${selectedAssetIds.length}個のリソースを削除しました。`,
          `Đã xóa ${selectedAssetIds.length} tài nguyên.`,
        ),
      );
      setSelectedAssetIds([]);
      fetchAssets(
        selectedFolderId,
        assetTypeFilter === "all" ? undefined : assetTypeFilter,
      );
      bulkDeleteConfirm.closeConfirm();
    } catch (error) {
      toast.error(
        t(
          "Bulk purge failed.",
          "一括削除に失敗しました。",
          "Xóa hàng loạt thất bại.",
        ),
      );
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkMoveAssets = async (targetFolderId: string) => {
    if (selectedAssetIds.length === 0) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("media_assets")
        .update({ folder_id: targetFolderId })
        .in("id", selectedAssetIds);
      if (error) throw error;
      toast.success(
        t(
          `Moved ${selectedAssetIds.length} resources.`,
          `${selectedAssetIds.length}個のリソースを移動しました。`,
          `Đã di chuyển ${selectedAssetIds.length} tài nguyên.`,
        ),
      );
      setSelectedAssetIds([]);
      setIsBulkMoveDialogOpen(false);
      fetchAssets(
        selectedFolderId,
        assetTypeFilter === "all" ? undefined : assetTypeFilter,
      );
    } catch (error) {
      toast.error(
        t(
          "Movement protocol failed.",
          "移動に失敗しました。",
          "Giao thức di chuyển thất bại.",
        ),
      );
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDeleteUnused = async (assetIds: string[]) => {
    for (const id of assetIds) {
      await deleteMediaAsset(id);
    }
    fetchAssets(
      selectedFolderId,
      assetTypeFilter === "all" ? undefined : assetTypeFilter,
    );
  };

  const handleBatchProcess = async (
    processedFiles: Array<{
      file: File;
      originalName: string;
      newName: string;
      preview: string;
      status: string;
    }>,
  ) => {
    setIsUploading(true);

    let targetFolderId = uploadFolderId || selectedFolderId;
    if (!targetFolderId) {
      const common = folders.find((f) => f.slug === "common");
      targetFolderId = common?.id || null;
    }

    const currentFolder = folders.find((f) => f.id === targetFolderId);
    let successCount = 0;

    for (const processedFile of processedFiles) {
      try {
        // Upload to Cloudinary
        const metadata = await uploadMedia(processedFile.file, {
          folder: currentFolder?.slug || "common",
          isIcon: false,
        });

        // Save to database
        await createMediaAsset({
          ...metadata,
          folder_id: targetFolderId,
          title: processedFile.newName,
        });

        successCount++;
      } catch (error) {
        console.error(`Upload failed for ${processedFile.newName}:`, error);
      }
    }

    if (successCount > 0) {
      toast.success(
        t(
          `${successCount} resources integrated into grid.`,
          `${successCount}個のリソースがグリッドに統合されました。`,
          `${successCount} tài nguyên đã được tích hợp vào lưới.`,
        ),
      );
      fetchAssets(
        selectedFolderId,
        assetTypeFilter === "all" ? undefined : assetTypeFilter,
      );
    }

    setIsUploading(false);
    setIsBatchProcessDialogOpen(false);
  };

  const filteredAssets = assets.filter(
    (a) =>
      a.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.title && a.title.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const bulkActions = [
    {
      label: t("Move", "移動", "Di chuyển"),
      icon: MoveRight,
      onClick: () => setIsBulkMoveDialogOpen(true),
    },
    {
      label: t("Delete", "削除", "Xóa"),
      icon: Trash2,
      onClick: handleBulkDeleteAssets,
      variant: "destructive" as const,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 h-auto md:h-[calc(100vh-140px)] min-h-[700px] flex flex-col">
        <AdminPageHeader
          title={t("Media Library", "メディアライブラリ", "Thư viện Media")}
          description={t(
            "Centralized resource management and deployment hub.",
            "リソース管理とデプロイの中心。機器の管理を行います。",
            "Trung tâm quản lý và triển khai tài nguyên tập trung.",
          )}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: t("Upload Images", "画像をアップロード", "Tải ảnh lên"),
            onClick: () => {
              setUploadFolderId(selectedFolderId);
              setIsUploadDialogOpen(true);
            },
            icon: Plus,
          }}
          secondaryAction={{
            label: t("New Folder", "新しいフォルダー", "Thư mục mới"),
            onClick: () => {
              setEditingFolderId(null);
              setFolderFormData({
                name: "",
                description: "",
                parent_id: selectedFolderId,
              });
              setIsFolderDialogOpen(true);
            },
            icon: FolderPlus,
          }}
          secondaryActions={[
            {
              label: t("Batch Process", "バッチ処理", "Xử lý hàng loạt"),
              onClick: () => setIsBatchProcessDialogOpen(true),
              icon: Scissors,
            },
            {
              label: t("Storage Stats", "ストレージ統計", "Thống kê lưu trữ"),
              onClick: () => setShowStorageStats(!showStorageStats),
              icon: BarChart3,
            },
            {
              label: t("Find Unused", "未使用を検索", "Tìm không dùng"),
              onClick: () => setIsUnusedDialogOpen(true),
              icon: AlertTriangle,
            },
          ]}
        />

        {/* Bulk Actions - Reserved Space to prevent jumping */}
        <div className="flex px-1 h-20 items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className={cn(
              "h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-sage/20 hover:border-sage/40 transition-all shadow-sm",
              selectedAssetIds.length === filteredAssets.length &&
                filteredAssets.length > 0
                ? "bg-sage text-white border-none shadow-sage/20"
                : "bg-white/50 text-muted-foreground",
            )}
          >
            {selectedAssetIds.length === filteredAssets.length &&
            filteredAssets.length > 0
              ? t("Deselect All", "すべて bỏ chọn", "Bỏ chọn tất cả")
              : t("Select All", "すべて選択", "Chọn tất cả")}
          </Button>

          {selectedAssetIds.length > 0 && (
            <div className="flex items-center gap-4 px-6 py-3 bg-sage rounded-[1.5rem] text-white shadow-xl shadow-sage/20 animate-in fade-in slide-in-from-left-2 duration-500 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-sage flex items-center justify-center font-bold text-xs shadow-sm">
                  {selectedAssetIds.length}
                </div>
                <div className="flex flex-col -space-y-0.5">
                  <span className="text-[10px] font-black text-white uppercase tracking-wider whitespace-nowrap">
                    {selectedAssetIds.length > 1 ? t("Items selected", "選択済み", "Đã chọn") : t("Item selected", "選択済み", "Đã chọn")}
                  </span>
                  <button 
                    onClick={() => setSelectedAssetIds([])}
                    className="text-[9px] font-black text-white/60 uppercase tracking-widest hover:text-white transition-colors text-left"
                  >
                    {t("Clear", "クリア", "BỎ CHỌN")}
                  </button>
                </div>
              </div>
              
              <div className="w-px h-8 bg-white/10 mx-1" />
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBulkMoveDialogOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-white/70 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
                >
                  <span className="text-white/30 text-xs">→</span>
                  {t("Move", "移動", "MOVE")}
                </button>
                
                <button
                  onClick={handleBulkDeleteAssets}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-red-500/80 transition-all text-[10px] font-black uppercase tracking-[0.15em] border border-white/20 shadow-lg whitespace-nowrap"
                >
                  <Trash2 size={14} className="text-white" />
                  {t("Delete", "削除", "DELETE")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Folder Selector Pattern (Consistent with Picker) */}
        <div className="md:hidden flex items-center gap-2 p-1 overflow-x-auto no-scrollbar pb-2">
          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFolderId(f.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[10px] whitespace-nowrap shrink-0",
                selectedFolderId === f.id
                  ? "bg-sage text-white shadow-md"
                  : "text-muted-foreground bg-white/50 border border-sage/5 hover:bg-sage/10",
              )}
            >
              <Folder size={12} />
              {f.name}
            </button>
          ))}
        </div>

        {/* Browser Layout */}
        <div className="flex-1 border border-white/40 bg-white/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-sm">
          <div className="hidden md:block">
            <MediaFolderSidebar
              folders={folders}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
              onEditFolder={(f) => {
                setEditingFolderId(f.id);
                setFolderFormData({
                  name: f.name,
                  description: f.description || "",
                  parent_id: f.parent_id,
                });
                setIsFolderDialogOpen(true);
              }}
              onDeleteFolder={deleteConfirm.openConfirm}
            />
          </div>

          {/* ASSETS GRID VIEW */}
          <div className="flex-1 flex flex-col min-w-0 bg-white/20">
            {/* Toolbar */}
            <div className="p-6 border-b border-sage/10 flex flex-col items-stretch lg:flex-row lg:items-center justify-between gap-6">
              <div className="relative w-full lg:max-w-xs">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t(
                    "Search archive...",
                    "アーカイブを検索...",
                    "Tìm kiếm kho lưu trữ...",
                  )}
                  className="w-full pl-11 h-11 bg-white border-none rounded-xl text-xs font-bold shadow-sm outline-none px-4"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {["all", "image", "video", "svg", "icon"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setAssetTypeFilter(type as any)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                      assetTypeFilter === type
                        ? "bg-heading text-white shadow-lg"
                        : "bg-white text-muted-foreground border border-sage/5 hover:bg-sage/10 hover:text-sage shadow-sm",
                    )}
                  >
                    {t(type, type, type.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <MediaAssetGrid
                assets={filteredAssets}
                selectedAssetId={selectedAssetId}
                onSelectAsset={setSelectedAssetId}
                selectedAssetIds={selectedAssetIds}
                onToggleSelect={handleToggleAssetSelect}
                isSelectionMode={selectedAssetIds.length > 0}
              />
              
              {/* Refreshing Overlay */}
              <AnimatePresence>
                {isRefreshing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 bg-white/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
                  >
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-sage/10 flex flex-col items-center gap-3 animate-in zoom-in-95 duration-200">
                      <Loader2 className="w-6 h-6 text-sage animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-sage">
                        {t("Syncing Matrix...", "同期中...", "Đang đồng bộ...")}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ASSET DETAILS PANEL - Desktop Side Panel (Persistent) / Mobile Drawer */}
          <div className="hidden lg:block w-[400px] border-l border-sage/5 bg-white/50 flex-shrink-0 transition-all duration-500 overflow-hidden h-full">
            {selectedAsset ? (
              <MediaAssetDetails
                asset={selectedAsset}
                onClose={() => setSelectedAssetId(null)}
                isEditing={isEditingAsset}
                setIsEditing={setIsEditingAsset}
                assetFormData={assetFormData}
                setAssetFormData={setAssetFormData}
                onUpdate={handleUpdateAsset}
                onDelete={(id) =>
                  assetDeleteConfirm.openConfirm(id, selectedAsset.file_name)
                }
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-20 group">
                <div className="w-20 h-20 rounded-[2rem] bg-sage/10 flex items-center justify-center transition-transform duration-700 group-hover:scale-110 group-hover:bg-sage/20">
                  <FileIcon size={32} className="text-sage" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-heading">
                    {t("Selection Node", "ノード選択", "CHỌN TÀI NGUYÊN")}
                  </p>
                  <p className="text-[10px] italic text-muted-foreground leading-relaxed">
                    {t(
                      "Select a resource from the matrix to view its metadata.",
                      "マトリックスからリソースを選択して詳細を表示します。",
                      "Chọn một tài nguyên từ lưới để xem thông tin chi tiết."
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile/Tablet Drawer View (Always available via Sheet) */}
          <Sheet
            open={
              !!selectedAsset &&
              !window.matchMedia("(min-width: 1024px)").matches
            }
            onOpenChange={(open) => !open && setSelectedAssetId(null)}
          >
            <SheetContent
              side="right"
              className="p-0 border-none w-full sm:max-w-md h-full"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>
                  {t(
                    "Asset Details",
                    "アセットの詳細",
                    "Chi tiết tài nguyên",
                  )}
                </SheetTitle>
                <SheetDescription>
                  {t(
                    "View and edit media asset metadata",
                    "メディアアセットのメタデータを表示および編集する",
                    "Xem và chỉnh sửa siêu dữ liệu của tài nguyên media",
                  )}
                </SheetDescription>
              </SheetHeader>
              {selectedAsset && (
                <MediaAssetDetails
                  asset={selectedAsset}
                  onClose={() => setSelectedAssetId(null)}
                  isEditing={isEditingAsset}
                  setIsEditing={setIsEditingAsset}
                  assetFormData={assetFormData}
                  setAssetFormData={setAssetFormData}
                  onUpdate={handleUpdateAsset}
                  onDelete={(id) =>
                    assetDeleteConfirm.openConfirm(
                      id,
                      selectedAsset.file_name,
                    )
                  }
                  showCloseButton={false}
                />
              )}
            </SheetContent>
          </Sheet>
        </div>

        <MediaFolderDialog
          open={isFolderDialogOpen}
          onOpenChange={setIsFolderDialogOpen}
          editingId={editingFolderId}
          folders={folders}
          formData={folderFormData}
          setFormData={setFolderFormData}
          onSave={editingFolderId ? handleUpdateFolder : handleCreateFolder}
        />

        <MediaUploadDialog
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          folders={folders}
          uploadFolderId={uploadFolderId}
          setUploadFolderId={setUploadFolderId}
          uploadMode={uploadMode}
          setUploadMode={setUploadMode}
          isUploading={isUploading}
          onFileUpload={handleFileUpload}
        />

        <DeleteConfirmDialog
          open={deleteConfirm.isOpen}
          onOpenChange={deleteConfirm.closeConfirm}
          onConfirm={handleDeleteFolder}
          itemName={deleteConfirm.itemName}
          isLoading={false}
        />

        <DeleteConfirmDialog
          open={assetDeleteConfirm.isOpen}
          onOpenChange={assetDeleteConfirm.closeConfirm}
          onConfirm={handleConfirmDeleteAsset}
          itemName={assetDeleteConfirm.itemName}
          isLoading={false}
        />

        <DeleteConfirmDialog
          open={bulkDeleteConfirm.isOpen}
          onOpenChange={bulkDeleteConfirm.closeConfirm}
          onConfirm={handleConfirmBulkDeleteAssets}
          itemName={bulkDeleteConfirm.itemName}
          isLoading={isBulkPending}
        />

        <MediaOptimizationDialog
          open={isOptimizationDialogOpen}
          onOpenChange={setIsOptimizationDialogOpen}
          onConfirm={(settings, croppedFile) => {
            setOptimizationSettings(settings);
            processUpload(pendingFiles, settings, croppedFile);
          }}
          file={pendingFiles[0]}
          fileInfo={
            pendingFiles[0]
              ? {
                  name: pendingFiles[0].name,
                  size: pendingFiles[0].size,
                }
              : undefined
          }
        />

        <UnusedMediaDialog
          open={isUnusedDialogOpen}
          onOpenChange={setIsUnusedDialogOpen}
          assets={assets}
          onDelete={handleBulkDeleteUnused}
        />

        <BulkMoveDialog
          open={isBulkMoveDialogOpen}
          onOpenChange={setIsBulkMoveDialogOpen}
          folders={folders}
          currentFolderId={selectedFolderId}
          selectedCount={selectedAssetIds.length}
          onMove={handleBulkMoveAssets}
        />

        <BatchProcessDialog
          open={isBatchProcessDialogOpen}
          onOpenChange={setIsBatchProcessDialogOpen}
          onProcess={handleBatchProcess}
          initialFiles={pendingFiles.length > 1 ? pendingFiles : undefined}
        />

        {showStorageStats && (
          <div className="fixed bottom-6 right-6 w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="relative">
              <button
                onClick={() => setShowStorageStats(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-muted-foreground hover:text-heading transition-colors z-10"
              >
                <XCircle size={14} />
              </button>
              <StorageStatsCard />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MediaLibrary;
