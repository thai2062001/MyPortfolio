import React from "react";
import { X, ExternalLink, Info, Edit3, Copy, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MediaAsset } from "@/types/media";
import { toast } from "sonner";
import { useLang } from "@/contexts/LangContext";
import { cn } from "@/lib/utils";

interface MediaAssetDetailsProps {
  asset: MediaAsset;
  onClose: () => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  assetFormData: { title: string; alt_text: string; caption: string };
  setAssetFormData: (data: any) => void;
  onUpdate: () => void;
  onDelete: (id: string) => void;
  showCloseButton?: boolean;
}

export const MediaAssetDetails = ({
  asset,
  onClose,
  isEditing,
  setIsEditing,
  assetFormData,
  setAssetFormData,
  onUpdate,
  onDelete,
  showCloseButton = true,
}: MediaAssetDetailsProps) => {
  const { t } = useLang();

  const isDirty = 
    assetFormData.title !== (asset.title || "") || 
    assetFormData.alt_text !== (asset.alt_text || "") || 
    assetFormData.caption !== (asset.caption || "");

  return (
    <div className="w-full md:w-[400px] h-full border-t md:border-t-0 md:border-l border-sage/10 bg-white flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-500 text-left">
      <div className="p-6 border-b border-sage/10 flex items-center justify-between shrink-0">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-heading">
          {t("File Details", "ファイルの詳細", "Chi tiết tệp")}
        </h3>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-heading hover:text-white flex items-center justify-center text-muted-foreground transition-all duration-300 group/close shrink-0"
          >
            <X size={18} className="group-hover/close:rotate-90 transition-transform duration-300" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar pb-32">
        {/* Visual Preview */}
        <div className="space-y-4">
          <div className="aspect-video rounded-2xl overflow-hidden bg-sage/[0.03] border border-sage/10 relative group">
            <img
              src={asset.secure_url}
              className="w-full h-full object-contain"
              alt=""
            />
            <div className="absolute right-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(asset.secure_url);
                  toast.success(t("URL copied", "URLをコピーしました", "Đã sao chép URL"));
                }}
                className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-sage hover:bg-sage hover:text-white transition-all"
                title={t("Copy URL", "URLをコピー", "Sao chép URL")}
              >
                <Copy size={14} />
              </button>
              <a
                href={asset.secure_url}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-sage hover:bg-sage hover:text-white transition-all"
                title={t("Open Original", "オリジナルを開く", "Mở ảnh gốc")}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Metadata Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center text-sage">
              <Info size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {t("File Info", "ファイル情報", "Thông tin tệp")}
              </p>
              <h4 className="text-xs font-bold text-heading truncate pr-2" title={asset.file_name}>
                {asset.file_name}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-sage/[0.03] rounded-xl border border-sage/5">
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">
                {t("Dimensions", "寸法", "Kích thước")}
              </p>
              <p className="text-xs font-bold text-heading">
                {asset.width}x{asset.height}
              </p>
            </div>
            <div className="p-3 bg-sage/[0.03] rounded-xl border border-sage/5">
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">
                {t("Size", "サイズ", "Dung lượng")}
              </p>
              <p className="text-xs font-bold text-heading">
                {Math.round((asset.file_size || 0) / 1024)} KB
              </p>
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-6 pt-6 border-t border-sage/10">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
              {t("Asset Name", "アセット名", "Tên tài nguyên")}
            </label>
            <Input
              value={isEditing ? assetFormData.title : asset.title || ""}
              disabled={!isEditing}
              onChange={(e) =>
                setAssetFormData((prev: any) => ({ ...prev, title: e.target.value }))
              }
              className={cn(
                "h-11 rounded-xl text-xs font-bold transition-all duration-300",
                isEditing 
                  ? "bg-white border border-sage/30 shadow-sm ring-2 ring-sage/5" 
                  : "bg-sage/[0.03] border-none"
              )}
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
              {t("Alt Text", "代替テキスト", "Văn bản thay thế (Alt)")}
            </label>
            <Input
              value={isEditing ? assetFormData.alt_text : asset.alt_text || ""}
              disabled={!isEditing}
              onChange={(e) =>
                setAssetFormData((prev: any) => ({
                  ...prev,
                  alt_text: e.target.value,
                }))
              }
              className={cn(
                "h-11 rounded-xl text-xs font-bold transition-all duration-300",
                isEditing 
                  ? "bg-white border border-sage/30 shadow-sm ring-2 ring-sage/5" 
                  : "bg-sage/[0.03] border-none"
              )}
            />
          </div>
        </div>
      </div>

      {/* Floating Sticky Actions */}
      <div className="p-6 border-t border-sage/10 bg-white/80 backdrop-blur-xl mt-auto">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              onClick={onUpdate}
              disabled={!isDirty}
              className={cn(
                "flex-1 h-11 rounded-xl text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-all duration-300",
                isDirty 
                  ? "bg-sage text-white shadow-lg shadow-sage/20" 
                  : "bg-sage/40 text-white/80 cursor-not-allowed border-none"
              )}
            >
              <CheckCircle2 size={14} />
              {t("Save Changes", "変更を保存", "Lưu thay đổi")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="w-11 h-11 border-sage/20 text-sage rounded-xl flex items-center justify-center p-0"
              title={t("Cancel", "キャンセル", "Hủy")}
            >
              <X size={14} />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => {
                setIsEditing(true);
                setAssetFormData({
                  title: asset.title || "",
                  alt_text: asset.alt_text || "",
                  caption: asset.caption || "",
                });
              }}
              className="h-11 bg-white border border-sage/20 hover:bg-sage/5 hover:text-sage text-heading rounded-xl text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2"
            >
              <Edit3 size={14} />
              {t("Edit", "編集", "Sửa")}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(asset.secure_url);
                toast.success(t("URL copied to clipboard.", "URLをクリップボードにコピーしました。", "Đã sao chép URL."));
              }}
              className="h-11 bg-white border border-sage/20 hover:bg-sage/5 hover:text-sage text-heading rounded-xl text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2"
            >
              <Copy size={14} />
              {t("URL", "URL", "Copy Link")}
            </Button>
            <Button
              onClick={() => onDelete(asset.id)}
              variant="ghost"
              className="col-span-2 h-11 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 mt-1"
            >
              <Trash2 size={14} />
              {t("Delete File", "ファイルを削除", "Xóa tệp")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
