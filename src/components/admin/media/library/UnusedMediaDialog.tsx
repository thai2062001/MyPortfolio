import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { MediaAsset } from "@/types/media";
import { findUnusedMedia, UsageResult } from "@/lib/media-usage-detector";
import { formatFileSize } from "@/lib/media-optimizer";
import { useLang } from "@/contexts/LangContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UnusedMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: MediaAsset[];
  onDelete: (assetIds: string[]) => Promise<void>;
}

export const UnusedMediaDialog = ({
  open,
  onOpenChange,
  assets,
  onDelete,
}: UnusedMediaDialogProps) => {
  const { t } = useLang();

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [unusedAssets, setUnusedAssets] = useState<UsageResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      scanForUnused();
    }
  }, [open, assets]);

  const scanForUnused = async () => {
    setLoading(true);
    try {
      const results = await findUnusedMedia(assets);
      const unused = results.filter((r) => !r.isUsed);
      setUnusedAssets(unused);
      setSelectedIds(unused.map((u) => u.assetId));
    } catch (error) {
      toast.error(
        t("Scan failed.", "スキャンに失敗しました。", "Quét thất bại."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    if (
      !window.confirm(
        t(
          `Delete ${selectedIds.length} unused assets? This cannot be undone.`,
          `${selectedIds.length}個の未使用アセットを削除しますか？この操作は元に戻せません。`,
          `Xóa ${selectedIds.length} tài nguyên không sử dụng? Hành động này không thể hoàn tác.`,
        ),
      )
    )
      return;

    setDeleting(true);
    try {
      await onDelete(selectedIds);
      toast.success(
        t(
          `Deleted ${selectedIds.length} unused assets.`,
          `${selectedIds.length}個の未使用アセットを削除しました。`,
          `Đã xóa ${selectedIds.length} tài nguyên không sử dụng.`,
        ),
      );
      onOpenChange(false);
    } catch (error) {
      toast.error(t("Delete failed.", "削除に失敗しました。", "Xóa thất bại."));
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const totalSize = unusedAssets
    .filter((u) => selectedIds.includes(u.assetId))
    .reduce((sum, u) => {
      const asset = assets.find((a) => a.id === u.assetId);
      return sum + (asset?.file_size || 0);
    }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            {t(
              "Unused Media Detection",
              "未使用メディア検出",
              "Phát hiện Media không sử dụng",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              "Find and remove media assets that are not being used anywhere in your site.",
              "サイト内で使用されていないメディアアセットを検索して削除します。",
              "Tìm và xóa các tài nguyên media không được sử dụng ở bất kỳ đâu trên trang web của bạn.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Loader2 className="animate-spin text-sage mx-auto" size={32} />
                <p className="text-sm text-muted-foreground font-bold">
                  {t(
                    "Scanning media library...",
                    "メディアライブラリをスキャン中...",
                    "Đang quét thư viện media...",
                  )}
                </p>
              </div>
            </div>
          ) : unusedAssets.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <CheckCircle2 className="text-emerald-500 mx-auto" size={48} />
                <div>
                  <p className="text-lg font-serif font-bold text-heading">
                    {t(
                      "All media is in use!",
                      "すべてのメディアが使用中です！",
                      "Tất cả media đều đang được sử dụng!",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t(
                      "No unused assets found.",
                      "未使用のアセットは見つかりませんでした。",
                      "Không tìm thấy tài nguyên không sử dụng.",
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Bar */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                      {t(
                        "Unused Assets Found",
                        "未使用アセットが見つかりました",
                        "Đã tìm thấy tài nguyên không sử dụng",
                      )}
                    </p>
                    <p className="text-2xl font-bold text-amber-900 mt-1">
                      {unusedAssets.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                      {t(
                        "Potential Savings",
                        "潜在的な節約",
                        "Tiết kiệm tiềm năng",
                      )}
                    </p>
                    <p className="text-2xl font-bold text-amber-900 mt-1">
                      {formatFileSize(totalSize)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Selection Controls */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-muted-foreground">
                  {selectedIds.length} / {unusedAssets.length}{" "}
                  {t("selected", "選択済み", "đã chọn")}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setSelectedIds(unusedAssets.map((u) => u.assetId))
                    }
                    className="text-xs"
                  >
                    {t("Select All", "すべて選択", "Chọn tất cả")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedIds([])}
                    className="text-xs"
                  >
                    {t("Clear", "クリア", "Xóa")}
                  </Button>
                </div>
              </div>

              {/* Asset Grid */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {unusedAssets.map((result) => {
                    const asset = assets.find((a) => a.id === result.assetId);
                    if (!asset) return null;

                    const isSelected = selectedIds.includes(result.assetId);

                    return (
                      <div
                        key={result.assetId}
                        onClick={() => toggleSelect(result.assetId)}
                        className={cn(
                          "group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border-2",
                          isSelected
                            ? "border-amber-500 shadow-lg scale-95"
                            : "border-transparent hover:border-amber-300",
                        )}
                      >
                        <img
                          src={asset.secure_url}
                          alt={asset.file_name}
                          className="w-full h-full object-cover"
                        />

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle2 size={14} strokeWidth={3} />
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-[9px] font-bold text-white truncate">
                            {asset.file_name}
                          </p>
                          <p className="text-[8px] text-white/70">
                            {formatFileSize(asset.file_size || 0)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {!loading && unusedAssets.length > 0 && (
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              {t("Cancel", "キャンセル", "Hủy")}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={selectedIds.length === 0 || deleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={14} />
                  {t("Deleting...", "削除中...", "Đang xóa...")}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2" size={14} />
                  {t("Delete Selected", "選択項目を削除", "Xóa đã chọn")} (
                  {selectedIds.length})
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
