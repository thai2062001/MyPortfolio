import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Folder, MoveRight, Loader2 } from "lucide-react";
import { MediaFolder } from "@/types/media";
import { useLang } from "@/contexts/LangContext";
import { cn } from "@/lib/utils";

interface BulkMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: MediaFolder[];
  currentFolderId: string | null;
  selectedCount: number;
  onMove: (targetFolderId: string) => Promise<void>;
}

export const BulkMoveDialog = ({
  open,
  onOpenChange,
  folders,
  currentFolderId,
  selectedCount,
  onMove,
}: BulkMoveDialogProps) => {
  const { t } = useLang();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);

  const handleMove = async () => {
    if (!selectedFolderId) return;

    setMoving(true);
    try {
      await onMove(selectedFolderId);
      onOpenChange(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setMoving(false);
    }
  };

  const availableFolders = folders.filter((f) => f.id !== currentFolderId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MoveRight className="text-sage" size={20} />
            {t("Move Assets", "アセットを移動", "Di chuyển tài nguyên")}
          </DialogTitle>
          <DialogDescription>
            {t(
              `Move ${selectedCount} selected assets to a different folder.`,
              `選択した${selectedCount}個のアセットを別のフォルダーに移動します。`,
              `Di chuyển ${selectedCount} tài nguyên đã chọn sang thư mục khác.`,
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t(
              "Select Destination Folder",
              "移動先フォルダーを選択",
              "Chọn thư mục đích",
            )}
          </p>

          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {availableFolders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {t(
                  "No other folders available.",
                  "他のフォルダーはありません。",
                  "Không có thư mục nào khác.",
                )}
              </div>
            ) : (
              availableFolders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl transition-all border-2",
                    selectedFolderId === folder.id
                      ? "border-sage bg-sage/5 shadow-md"
                      : "border-transparent bg-white hover:border-sage/30",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      selectedFolderId === folder.id
                        ? "bg-sage text-white"
                        : "bg-sage/10 text-sage",
                    )}
                  >
                    <Folder size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-heading text-sm">
                      {folder.name}
                    </p>
                    {folder.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {folder.description}
                      </p>
                    )}
                  </div>
                  {selectedFolderId === folder.id && (
                    <div className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("Cancel", "キャンセル", "Hủy")}
          </Button>
          <Button
            onClick={handleMove}
            disabled={!selectedFolderId || moving}
            className="bg-sage text-white"
          >
            {moving ? (
              <>
                <Loader2 className="animate-spin mr-2" size={14} />
                {t("Moving...", "移動中...", "Đang di chuyển...")}
              </>
            ) : (
              <>
                <MoveRight className="mr-2" size={14} />
                {t("Move", "移動", "Di chuyển")} ({selectedCount})
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
