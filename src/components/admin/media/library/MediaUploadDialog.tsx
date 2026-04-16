import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Folder, Upload, Plus, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MediaFolder } from "@/types/media";
import { useLang } from "@/contexts/LangContext";

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: MediaFolder[];
  uploadFolderId: string | null;
  setUploadFolderId: (id: string | null) => void;
  uploadMode: { icon: boolean };
  setUploadMode: (mode: { icon: boolean }) => void;
  isUploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MediaUploadDialog = ({
  open,
  onOpenChange,
  folders,
  uploadFolderId,
  setUploadFolderId,
  uploadMode,
  setUploadMode,
  isUploading,
  onFileUpload,
}: MediaUploadDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLang();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideDefaultClose className="max-w-2xl p-0 overflow-hidden rounded-[2rem] md:rounded-[3rem] border-none shadow-2xl bg-white/95 backdrop-blur-2xl text-left">
        <DialogHeader className="p-6 md:p-10 pb-0 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="space-y-1">
            <DialogTitle className="font-serif text-2xl font-bold text-heading">
              {t("Resource Integration", "リソース統合", "Tích hợp tài nguyên")}
            </DialogTitle>
            <DialogDescription className="text-xs tracking-wide">
              {t("Ingest resources into the media archive for deployment.", "デプロイに向けてリソースをアーカイブに読み込みます。", "Nạp tài nguyên vào kho lưu trữ để triển khai.")}
            </DialogDescription>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-10 h-10 rounded-xl hover:bg-heading hover:text-white flex items-center justify-center text-muted-foreground transition-all duration-300 group/close shrink-0"
          >
            <X size={20} className="group-hover/close:rotate-90 transition-transform duration-300" />
          </button>
        </DialogHeader>
        <div className="space-y-6 md:space-y-10 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-6 md:px-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                {t("Selected Folder", "選択中のフォルダー", "Thư mục đã chọn")}
              </label>
              <div className="relative">
                <Select
                  value={uploadFolderId || "default"}
                  onValueChange={(value) => setUploadFolderId(value === "default" ? null : value)}
                >
                  <SelectTrigger className="w-full h-14 pl-12 pr-10 bg-muted/20 border-none rounded-2xl font-bold text-xs focus:ring-2 focus:ring-sage/20 outline-none text-left flex items-center shadow-none transition-all relative group">
                    <Folder
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/40 group-focus:text-sage transition-colors"
                      size={16}
                    />
                    <SelectValue placeholder={t("Default (Common)", "デフォルト (Common)", "Mặc định (Chung)")} />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 size-4 group-hover:text-muted-foreground transition-colors" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl bg-white/95 backdrop-blur-xl p-2 animate-in fade-in zoom-in duration-200">
                    <SelectItem value="default" className="rounded-xl py-3 focus:bg-sage/10 focus:text-sage transition-colors font-bold text-xs">
                      {t("Default (Common)", "デフォルト (Common)", "Mặc định (Chung)")}
                    </SelectItem>
                    {folders.map((f) => (
                      <SelectItem 
                        key={f.id} 
                        value={f.id}
                        className="rounded-xl py-3 focus:bg-sage/10 focus:text-sage transition-colors font-bold text-xs"
                      >
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                {t("Upload Mode", "アップロードモード", "Chế độ tải lên")}
              </label>
              <div className="flex bg-muted/20 rounded-2xl p-1">
                <button
                  onClick={() => setUploadMode({ icon: false })}
                  className={cn(
                    "flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                    !uploadMode.icon
                      ? "bg-white text-sage shadow-md"
                      : "text-muted-foreground hover:text-sage/60"
                  )}
                >
                  {t("Standard Asset", "標準アセット", "Tài nguyên chuẩn")}
                </button>
                <button
                  onClick={() => setUploadMode({ icon: true })}
                  className={cn(
                    "flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                    uploadMode.icon
                      ? "bg-white text-sage shadow-md"
                      : "text-muted-foreground hover:text-sage/60"
                  )}
                >
                  {t("Icon / SVG", "アイコン / SVG", "Biểu tượng / SVG")}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 md:p-14 border-2 border-dashed border-sage/20 rounded-[2rem] md:rounded-[2.5rem] bg-sage/[0.02] hover:bg-sage/[0.05] transition-all group mx-6 md:mx-10 mb-6">
            <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform">
              <Upload size={32} className="text-sage" />
            </div>
            <h4 className="font-serif text-xl font-bold text-heading">
              {t("Upload Your Assets", "アセットのアップロード", "Tải lên tài nguyên của bạn")}
            </h4>
            <p className="text-xs text-muted-foreground mt-2 text-center max-w-[250px]">
              {t("Select one or more images to upload.", "アップロードする画像を1つ以上選択してください。", "Chọn một hoặc nhiều hình ảnh để tải lên.")}
            </p>
            {isUploading ? (
              <div className="mt-10 h-16 flex items-center justify-center">
                <LoadingSpinner text={t("Uploading...", "アップロード中...", "Đang tải lên...")} />
              </div>
            ) : (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mt-10 bg-sage text-white rounded-2xl px-12 h-16 shadow-2xl shadow-sage/30 font-bold uppercase tracking-widest text-xs gap-3"
              >
                <Plus size={20} />
                {t("Select Resources", "リソースを選択", "Chọn tài nguyên")}
              </Button>
            )}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={onFileUpload}
              className="hidden"
              accept="image/*,video/*"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
