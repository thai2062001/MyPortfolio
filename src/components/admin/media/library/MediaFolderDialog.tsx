import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Folder, ChevronDown } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { MediaFolder } from "@/types/media";

interface MediaFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  folders: MediaFolder[];
  formData: { name: string; description: string; parent_id: string | null };
  setFormData: (data: any) => void;
  onSave: () => void;
}

export const MediaFolderDialog = ({
  open,
  onOpenChange,
  editingId,
  folders,
  formData,
  setFormData,
  onSave,
}: MediaFolderDialogProps) => {
  const { t } = useLang();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideDefaultClose className="max-w-md p-0 overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border-none shadow-2xl bg-white/95 backdrop-blur-2xl text-left">
        <DialogHeader className="p-6 md:p-10 pb-0 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <DialogTitle className="font-serif text-2xl font-bold text-heading">
              {editingId 
                ? t("Refine Media Pod", "メディアフォルダーを編集", "Chỉnh sửa Media Pod") 
                : t("Integrate New Pod", "新しいポッドを統合", "Tạo Media Pod mới")
              }
            </DialogTitle>
            <DialogDescription className="text-xs tracking-wide">
              {t("Expand the media taxonomy grid with new logical vectors.", "新しい論理ベクトルでメディア分類グリッドを拡張します。", "Mở rộng phân loại media với các dữ liệu logic mới.")}
            </DialogDescription>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-10 h-10 rounded-xl hover:bg-heading hover:text-white flex items-center justify-center text-muted-foreground transition-all duration-300 group/close shrink-0"
          >
            <X size={20} className="group-hover/close:rotate-90 transition-transform duration-300" />
          </button>
        </DialogHeader>
        <div className="space-y-6 md:space-y-8 py-8 px-6 md:px-10">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              {t("Folder Name", "フォルダー名", "Tên thư mục")}
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t("e.g. Architectural Projects", "例: 建築プロジェクト", "Ví dụ: Dự án kiến trúc")}
              className="h-14 bg-muted/20 border-none rounded-2xl font-bold"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              {t("Parent Folder", "親フォルダー", "Thư mục cha")}
            </label>
            <div className="relative">
              <Select
                value={formData.parent_id || "none"}
                onValueChange={(value) => setFormData({ ...formData, parent_id: value === "none" ? null : value })}
              >
                <SelectTrigger className="w-full h-14 pl-12 pr-10 bg-muted/20 border-none rounded-2xl font-bold text-xs focus:ring-2 focus:ring-sage/20 outline-none text-left flex items-center shadow-none transition-all relative group">
                  <Folder
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/40 group-focus:text-sage transition-colors"
                    size={16}
                  />
                  <SelectValue placeholder={t("None (Top Level)", "なし (トップレベル)", "Không (Cấp cao nhất)")} />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 size-4 group-hover:text-muted-foreground transition-colors" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl bg-white/95 backdrop-blur-xl p-2 animate-in fade-in zoom-in duration-200">
                  <SelectItem value="none" className="rounded-xl py-3 focus:bg-sage/10 focus:text-sage transition-colors font-bold text-xs">
                    {t("None (Top Level)", "なし (トップレベル)", "Không (Cấp cao nhất)")}
                  </SelectItem>
                  {folders.map((f) => (
                    f.id !== editingId && (
                      <SelectItem 
                        key={f.id} 
                        value={f.id}
                        className="rounded-xl py-3 focus:bg-sage/10 focus:text-sage transition-colors font-bold text-xs"
                      >
                        {f.name}
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              {t("Description", "説明", "Mô tả")}
            </label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t("Brief description...", "短い説明...", "Mô tả ngắn...")}
              className="h-14 bg-muted/20 border-none rounded-2xl font-bold"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 p-6 md:p-10 pt-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold text-xs h-12"
          >
            {t("ABORT", "中止", "HỦY")}
          </Button>
          <Button
            onClick={onSave}
            className="bg-sage text-white rounded-2xl px-10 h-14 shadow-xl shadow-sage/20 font-bold uppercase tracking-widest text-xs"
          >
            {editingId 
              ? t("Update Folder", "フォルダーを更新", "Cập nhật thư mục") 
              : t("Create Folder", "フォルダーを作成", "Tạo thư mục")
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
