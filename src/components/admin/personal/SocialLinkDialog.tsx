import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Upload, Library, Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SocialLink } from "@/types/admin";
import { useLang } from "@/contexts/LangContext";

interface SocialLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingLink: Partial<SocialLink> | null;
  setEditingLink: (link: Partial<SocialLink> | null) => void;
  onSave: () => void;
  isSaving: boolean;
  onDeviceUpload: () => void;
  onLibraryPick: () => void;
}

export const SocialLinkDialog = ({
  open,
  onOpenChange,
  editingLink,
  setEditingLink,
  onSave,
  isSaving,
  onDeviceUpload,
  onLibraryPick,
}: SocialLinkDialogProps) => {
  const { t } = useLang();
  if (!editingLink) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-white/95 backdrop-blur-3xl border border-white/40 rounded-[3.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-500 max-h-[90vh] z-[1000] text-left">
        <DialogHeader className="p-10 pb-2">
          <DialogTitle className="text-2xl font-serif font-bold text-heading">
            {editingLink.id 
              ? t("Refine Social Gateway", "ソーシャルゲートウェイを洗練", "Tinh chỉnh Cổng mạng xã hội")
              : t("Integrate Social Gateway", "ソーシャルゲートウェイを統合", "Tích hợp Cổng mạng xã hội")}
          </DialogTitle>
          <DialogDescription className="text-xs italic font-serif text-muted-foreground mt-1">
            {t("Establish the parameters for your social presence node.", "ソーシャルプレゼンスノードのパラメータを設定します。", "Thiết lập các thông số cho nút hiện diện mạng xã hội của bạn.")}
          </DialogDescription>
        </DialogHeader>

        <div className="p-10 pt-2 pb-8 space-y-8">
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="w-24 h-24 bg-white rounded-3xl border border-sage/10 flex items-center justify-center overflow-hidden shadow-inner group relative">
              {editingLink.icon_url ? (
                <img
                  src={editingLink.icon_url}
                  alt=""
                  className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <Share2 size={32} className="text-sage/40" />
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onDeviceUpload}
                disabled={isSaving}
                className="h-12 px-6 bg-sage text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-sage/20"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {isSaving ? t("Syncing...", "同期中...", "Đang đồng bộ...") : t("Device", "デバイス", "Thiết bị")}
              </button>
              <button
                onClick={onLibraryPick}
                className="h-12 px-6 bg-white border border-sage/10 text-sage rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-sage/5 hover:scale-105 active:scale-95 transition-all"
              >
                <Library size={16} />
                {t("Library", "ライブラリ", "Thư viện")}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  {t("Platform Name", "プラットフォーム名", "Tên nền tảng")}
                </label>
                <Input
                  value={editingLink.platform_name || ""}
                  onChange={(e) =>
                    setEditingLink({
                      ...editingLink,
                      platform_name: e.target.value,
                    })
                  }
                  placeholder="e.g. LinkedIn"
                  className="h-14 px-6 bg-muted/20 border-none rounded-2xl font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  {t("Display Name", "表示名", "Tên hiển thị")}
                </label>
                <Input
                  value={editingLink.display_name || ""}
                  onChange={(e) =>
                    setEditingLink({
                      ...editingLink,
                      display_name: e.target.value,
                    })
                  }
                  placeholder="@handle"
                  className="h-14 px-6 bg-muted/20 border-none rounded-2xl font-bold italic"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                {t("Gateway URL", "ゲートウェイURL", "URL Cổng kết nối")}
              </label>
              <Input
                value={editingLink.url || ""}
                onChange={(e) =>
                  setEditingLink({ ...editingLink, url: e.target.value })
                }
                placeholder="https://"
                className="h-14 px-6 bg-muted/20 border-none rounded-2xl font-bold"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between bg-sage/5 p-6 rounded-[2rem] border border-sage/10">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  editingLink.is_published ? "bg-sage text-white" : "bg-muted text-muted-foreground"
                )}
              >
                <Sparkles size={18} />
              </div>
              <div className="text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-heading block">
                  {t("Visibility Layout", "表示レイアウト", "Bố cục hiển thị")}
                </label>
                <p className="text-[10px] text-muted-foreground">
                  {t("Broadcast to public grid", "公開グリッドに放送", "Phát lên lưới công khai")}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setEditingLink({
                  ...editingLink,
                  is_published: !editingLink.is_published,
                })
              }
              className={cn(
                "w-12 h-6 rounded-full relative transition-all duration-500",
                editingLink.is_published ? "bg-sage shadow-lg shadow-sage/20" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-sm",
                  editingLink.is_published ? "left-7" : "left-1"
                )}
              />
            </button>
          </div>
        </div>

        <DialogFooter className="p-10 pt-2 border-t border-sage/10 gap-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-14 px-10 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
          >
            {t("Abort", "中止", "Hủy bỏ")}
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 h-14 bg-sage hover:bg-sage/90 text-white rounded-[1.5rem] shadow-xl shadow-sage/20 font-bold uppercase tracking-widest text-[10px]"
          >
            {isSaving ? t("Syncing...", "同期中...", "Đang đồng bộ...") : t("Confirm Integration", "統合を確定", "Xác nhận tích hợp")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
