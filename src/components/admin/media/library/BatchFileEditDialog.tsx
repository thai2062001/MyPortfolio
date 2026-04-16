import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Settings, Crop } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/media-optimizer";
import { ImageCropDialog } from "./ImageCropDialog";

interface ResizePreset {
  name: string;
  width: number;
  height: number;
}

const RESIZE_PRESETS: ResizePreset[] = [
  { name: "Original", width: 0, height: 0 },
  { name: "Thumbnail", width: 300, height: 300 },
  { name: "Small", width: 640, height: 640 },
  { name: "Medium", width: 1280, height: 1280 },
  { name: "Large", width: 1920, height: 1920 },
  { name: "Custom", width: 800, height: 800 },
];

interface BatchFileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File;
  fileName: string;
  preview: string;
  onSave: (settings: FileSettings, croppedFile?: File) => void;
  initialSettings?: FileSettings;
}

export interface FileSettings {
  optimizationEnabled: boolean;
  quality: number;
  resizePreset: ResizePreset;
  customWidth?: number;
  customHeight?: number;
  newName?: string;
}

export const BatchFileEditDialog = ({
  open,
  onOpenChange,
  file,
  fileName,
  preview,
  onSave,
  initialSettings,
}: BatchFileEditDialogProps) => {
  const { t } = useLang();

  const [optimizationEnabled, setOptimizationEnabled] = useState(
    initialSettings?.optimizationEnabled ?? true,
  );
  const [quality, setQuality] = useState(initialSettings?.quality ?? 85);
  const [resizePreset, setResizePreset] = useState<ResizePreset>(
    initialSettings?.resizePreset ?? RESIZE_PRESETS[0],
  );
  const [customWidth, setCustomWidth] = useState(
    initialSettings?.customWidth ?? 800,
  );
  const [customHeight, setCustomHeight] = useState(
    initialSettings?.customHeight ?? 800,
  );
  const [newName, setNewName] = useState(initialSettings?.newName ?? fileName);
  const [croppedFile, setCroppedFile] = useState<File | undefined>();
  const [cropState, setCropState] = useState<{
    cropArea: { x: number; y: number; width: number; height: number };
    aspectRatio: number | null;
  } | undefined>(undefined);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setOptimizationEnabled(initialSettings?.optimizationEnabled ?? true);
      setQuality(initialSettings?.quality ?? 85);
      setResizePreset(initialSettings?.resizePreset ?? RESIZE_PRESETS[0]);
      setCustomWidth(initialSettings?.customWidth ?? 800);
      setCustomHeight(initialSettings?.customHeight ?? 800);
      setNewName(initialSettings?.newName ?? fileName);
      setCroppedFile(undefined);
      setCropState(undefined);
    }
  }, [open, initialSettings, fileName]);

  const handleSave = () => {
    onSave(
      {
        optimizationEnabled,
        quality,
        resizePreset,
        customWidth,
        customHeight,
        newName,
      },
      croppedFile,
    );
    onOpenChange(false);
  };

  const handleCropComplete = (file: File) => {
    setCroppedFile(file);
  };

  const currentFile = croppedFile || file;
  const currentPreview = croppedFile
    ? URL.createObjectURL(croppedFile)
    : preview;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="text-sage" size={20} />
              {t(
                "Configure Image Settings",
                "画像設定を構成",
                "Cấu hình cài đặt ảnh",
              )}
            </DialogTitle>
            <DialogDescription>
              {t(
                "Customize optimization and crop settings for this image.",
                "この画像の最適化とクロップ設定をカスタマイズします。",
                "Tùy chỉnh cài đặt tối ưu hóa và cắt cho ảnh này.",
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6">
            {/* Preview */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                <img
                  src={currentPreview}
                  alt={fileName}
                  className="w-full h-full object-contain"
                />
                {croppedFile && (
                  <div className="absolute top-2 right-2 bg-sage text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
                    {t("Cropped", "クロップ済み", "Đã cắt")}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setIsCropDialogOpen(true)}
                className="w-full"
              >
                <Crop className="mr-2" size={14} />
                {t("Crop Image", "画像をクロップ", "Cắt ảnh")}
              </Button>
            </div>

            {/* Settings */}
            <div className="w-full lg:w-80 space-y-4 overflow-y-auto custom-scrollbar">
              {/* File Name */}
              <div className="space-y-2 bg-white/50 rounded-xl p-4">
                <Label className="text-sm font-bold">
                  {t("File Name", "ファイル名", "Tên file")}
                </Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-9 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(currentFile.size)}
                </p>
              </div>

              {/* Optimization */}
              <div className="space-y-3 bg-white/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-bold">
                    {t("Optimization", "最適化", "Tối ưu hóa")}
                  </Label>
                  <Switch
                    checked={optimizationEnabled}
                    onCheckedChange={setOptimizationEnabled}
                  />
                </div>

                {optimizationEnabled && (
                  <div>
                    <Label className="text-[10px] text-muted-foreground mb-1 block">
                      {t("Quality", "品質", "Chất lượng")}: {quality}%
                    </Label>
                    <Slider
                      value={[quality]}
                      onValueChange={([value]) => setQuality(value)}
                      min={50}
                      max={100}
                      step={5}
                    />
                  </div>
                )}
              </div>

              {/* Resize Preset */}
              <div className="space-y-3 bg-white/50 rounded-xl p-4">
                <Label className="text-sm font-bold">
                  {t("Resize Preset", "リサイズプリセット", "Preset resize")}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {RESIZE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setResizePreset(preset)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-bold transition-all",
                        resizePreset.name === preset.name
                          ? "bg-sage text-white shadow-md"
                          : "bg-white text-muted-foreground border border-sage/10 hover:bg-sage/10",
                      )}
                    >
                      {preset.name}
                      {preset.width > 0 && (
                        <div className="text-[9px] opacity-70">
                          {preset.width}x{preset.height}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {resizePreset.name === "Custom" && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">
                        Width
                      </Label>
                      <Input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">
                        Height
                      </Label>
                      <Input
                        type="number"
                        value={customHeight}
                        onChange={(e) =>
                          setCustomHeight(Number(e.target.value))
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              {t("Cancel", "キャンセル", "Hủy")}
            </Button>
            <Button onClick={handleSave} className="bg-sage text-white">
              {t("Save Settings", "設定を保存", "Lưu cài đặt")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ImageCropDialog
        open={isCropDialogOpen}
        onOpenChange={setIsCropDialogOpen}
        imageFile={file}
        onCropComplete={handleCropComplete}
        initialCropArea={cropState?.cropArea}
        initialAspectRatio={cropState?.aspectRatio}
        onCropStateChange={setCropState}
      />
    </>
  );
};
