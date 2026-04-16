import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Zap, Image as ImageIcon, Info, Crop, Eye } from "lucide-react";
import { formatFileSize } from "@/lib/media-optimizer";
import { useLang } from "@/contexts/LangContext";
import { ImageCropDialog } from "./ImageCropDialog";

interface MediaOptimizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: OptimizationSettings, file?: File) => void;
  file?: File;
  fileInfo?: {
    name: string;
    size: number;
    width?: number;
    height?: number;
  };
}

export interface OptimizationSettings {
  enabled: boolean;
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

export const MediaOptimizationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  file,
  fileInfo,
}: MediaOptimizationDialogProps) => {
  const { t } = useLang();

  const [settings, setSettings] = useState<OptimizationSettings>({
    enabled: true,
    maxWidth: 2400,
    maxHeight: 2400,
    quality: 85,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [croppedFile, setCroppedFile] = useState<File | undefined>(undefined);
  const [cropState, setCropState] = useState<{
    cropArea: { x: number; y: number; width: number; height: number };
    aspectRatio: number | null;
  } | undefined>(undefined);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const currentFile = croppedFile || file;
  const currentSize = croppedFile?.size || fileInfo?.size || 0;

  const estimatedSize = currentSize
    ? Math.floor(currentSize * (settings.quality / 100))
    : 0;
  const savings = currentSize ? currentSize - estimatedSize : 0;
  const savingsPercent = currentSize
    ? Math.round((savings / currentSize) * 100)
    : 0;

  const handleCropComplete = (newFile: File) => {
    setCroppedFile(newFile);
    const url = URL.createObjectURL(newFile);
    setImagePreview(url);
  };

  const handleConfirm = () => {
    onConfirm(settings, croppedFile);
    onOpenChange(false);
    // Reset state
    setCroppedFile(undefined);
    setCropState(undefined);
    setShowPreview(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="text-sage" size={20} />
            {t("Image Optimization", "画像最適化", "Tối ưu hóa ảnh")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "Optimize images before upload to improve performance and save storage.",
              "アップロード前に画像を最適化してパフォーマンスを向上させ、ストレージを節約します。",
              "Tối ưu hóa ảnh trước khi tải lên để cải thiện hiệu suất và tiết kiệm dung lượng.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t("Preview", "プレビュー", "Xem trước")}
                </Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="h-8 text-xs"
                  >
                    <Eye size={12} className="mr-1" />
                    {showPreview
                      ? t("Hide", "非表示", "Ẩn")
                      : t("Show", "表示", "Hiện")}
                  </Button>
                  {file && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsCropDialogOpen(true)}
                      className="h-8 text-xs"
                    >
                      <Crop size={12} className="mr-1" />
                      {t("Crop", "クロップ", "Cắt")}
                    </Button>
                  )}
                </div>
              </div>

              {showPreview && (
                <div className="relative aspect-video bg-slate-50 rounded-xl overflow-hidden border-2 border-sage/10">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  {croppedFile && (
                    <div className="absolute top-2 right-2 bg-sage text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
                      {t("Cropped", "クロップ済み", "Đã cắt")}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <Label htmlFor="optimization-enabled" className="text-sm font-bold">
              {t("Enable Optimization", "最適化を有効にする", "Bật tối ưu hóa")}
            </Label>
            <Switch
              id="optimization-enabled"
              checked={settings.enabled}
              onCheckedChange={(enabled) =>
                setSettings({ ...settings, enabled })
              }
            />
          </div>

          {settings.enabled && (
            <>
              {/* Max Width */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t("Max Width", "最大幅", "Chiều rộng tối đa")}:{" "}
                  {settings.maxWidth}px
                </Label>
                <Slider
                  value={[settings.maxWidth]}
                  onValueChange={([value]) =>
                    setSettings({ ...settings, maxWidth: value })
                  }
                  min={800}
                  max={4000}
                  step={100}
                  className="w-full"
                />
              </div>

              {/* Max Height */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t("Max Height", "最大高さ", "Chiều cao tối đa")}:{" "}
                  {settings.maxHeight}px
                </Label>
                <Slider
                  value={[settings.maxHeight]}
                  onValueChange={([value]) =>
                    setSettings({ ...settings, maxHeight: value })
                  }
                  min={800}
                  max={4000}
                  step={100}
                  className="w-full"
                />
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t("Quality", "品質", "Chất lượng")}: {settings.quality}%
                </Label>
                <Slider
                  value={[settings.quality]}
                  onValueChange={([value]) =>
                    setSettings({ ...settings, quality: value })
                  }
                  min={50}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* File Info */}
              {currentSize > 0 && (
                <div className="bg-sage/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sage">
                    <Info size={14} />
                    {t(
                      "Optimization Preview",
                      "最適化プレビュー",
                      "Xem trước tối ưu hóa",
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        {croppedFile
                          ? t("Cropped", "クロップ後", "Sau cắt")
                          : t("Original", "元のサイズ", "Gốc")}
                      </p>
                      <p className="font-bold text-heading">
                        {formatFileSize(currentSize)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        {t("Optimized", "最適化後", "Đã tối ưu")}
                      </p>
                      <p className="font-bold text-sage">
                        {formatFileSize(estimatedSize)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        {t("Savings", "節約", "Tiết kiệm")}
                      </p>
                      <p className="font-bold text-emerald-600">
                        {formatFileSize(savings)} ({savingsPercent}%)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("Cancel", "キャンセル", "Hủy")}
          </Button>
          <Button onClick={handleConfirm} className="bg-sage text-white">
            {t("Continue Upload", "アップロードを続ける", "Tiếp tục tải lên")}
          </Button>
        </div>
      </DialogContent>

      {/* Crop Dialog */}
      {file && (
        <ImageCropDialog
          open={isCropDialogOpen}
          onOpenChange={setIsCropDialogOpen}
          imageFile={file}
          onCropComplete={handleCropComplete}
          initialCropArea={cropState?.cropArea}
          initialAspectRatio={cropState?.aspectRatio}
          onCropStateChange={setCropState}
        />
      )}
    </Dialog>
  );
};
