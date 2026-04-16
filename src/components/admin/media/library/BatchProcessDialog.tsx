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
import {
  Package,
  Loader2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { cn } from "@/lib/utils";
import { formatFileSize, optimizeImage } from "@/lib/media-optimizer";
import { BatchFileEditDialog, FileSettings } from "./BatchFileEditDialog";

interface BatchProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcess: (processedFiles: ProcessedFile[]) => Promise<void>;
  initialFiles?: File[]; // Accept files from parent
}

interface ProcessedFile {
  file: File;
  originalName: string;
  newName: string;
  preview: string;
  status: "pending" | "processing" | "success" | "error";
  error?: string;
  // Individual settings for each file
  settings?: {
    optimizationEnabled: boolean;
    quality: number;
    resizePreset: ResizePreset;
    customWidth?: number;
    customHeight?: number;
    croppedFile?: File;
  };
}

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

export const BatchProcessDialog = ({
  open,
  onOpenChange,
  onProcess,
  initialFiles,
}: BatchProcessDialogProps) => {
  const { t } = useLang();

  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "select" | "configure" | "processing" | "complete"
  >("select");
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null,
  );
  const [isEditingFile, setIsEditingFile] = useState(false);

  // Settings
  const [optimizationEnabled, setOptimizationEnabled] = useState(true);
  const [quality, setQuality] = useState(85);
  const [resizePreset, setResizePreset] = useState<ResizePreset>(
    RESIZE_PRESETS[0],
  );
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(800);
  const [renamePattern, setRenamePattern] = useState("");
  const [addPrefix, setAddPrefix] = useState("");
  const [addSuffix, setAddSuffix] = useState("");
  const [addNumbering, setAddNumbering] = useState(true);

  // Handle initial files from parent
  useEffect(() => {
    if (open && initialFiles && initialFiles.length > 0) {
      const processedFiles: ProcessedFile[] = initialFiles.map(
        (file, index) => {
          const preview = URL.createObjectURL(file);
          return {
            file,
            originalName: file.name,
            newName: generateNewName(file.name, index),
            preview,
            status: "pending",
          };
        },
      );
      setFiles(processedFiles);
      setCurrentStep("configure");
    }
  }, [open, initialFiles]);

  useEffect(() => {
    if (!open) {
      // Reset when dialog closes
      setTimeout(() => {
        setFiles([]);
        setCurrentStep("select");
        setProcessing(false);
      }, 300);
    }
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const processedFiles: ProcessedFile[] = selectedFiles.map((file, index) => {
      const preview = URL.createObjectURL(file);
      return {
        file,
        originalName: file.name,
        newName: generateNewName(file.name, index),
        preview,
        status: "pending",
      };
    });
    setFiles(processedFiles);
    if (processedFiles.length > 0) {
      setCurrentStep("configure");
    }
  };

  const generateNewName = (originalName: string, index: number): string => {
    const ext = originalName.split(".").pop();
    const nameWithoutExt = originalName.replace(`.${ext}`, "");

    let newName = renamePattern || nameWithoutExt;

    if (addPrefix) {
      newName = `${addPrefix}${newName}`;
    }

    if (addNumbering) {
      newName = `${newName}-${String(index + 1).padStart(3, "0")}`;
    }

    if (addSuffix) {
      newName = `${newName}${addSuffix}`;
    }

    return `${newName}.${ext}`;
  };

  const updateFileNames = () => {
    setFiles((prev) =>
      prev.map((file, index) => ({
        ...file,
        newName: generateNewName(file.originalName, index),
      })),
    );
  };

  useEffect(() => {
    if (files.length > 0) {
      updateFileNames();
    }
  }, [renamePattern, addPrefix, addSuffix, addNumbering]);

  const handleFileClick = (index: number) => {
    setSelectedFileIndex(index);
    setIsEditingFile(true);
  };

  const handleSaveFileSettings = (
    index: number,
    settings: FileSettings,
    croppedFile?: File,
  ) => {
    setFiles((prev) =>
      prev.map((f, i) => {
        if (i === index) {
          const updatedFile = croppedFile || f.file;
          const preview = croppedFile
            ? URL.createObjectURL(croppedFile)
            : f.preview;

          // Update file name if changed
          const newName = settings.newName || f.newName;

          return {
            ...f,
            file: updatedFile,
            preview,
            newName,
            settings: {
              optimizationEnabled: settings.optimizationEnabled,
              quality: settings.quality,
              resizePreset: settings.resizePreset,
              customWidth: settings.customWidth,
              customHeight: settings.customHeight,
              croppedFile,
            },
          };
        }
        return f;
      }),
    );
    setIsEditingFile(false);
    setSelectedFileIndex(null);
  };

  const selectedFile =
    selectedFileIndex !== null ? files[selectedFileIndex] : null;

  const handleRemoveFile = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  };

  const handleProcess = async () => {
    setProcessing(true);
    setCurrentStep("processing");

    const processedFiles: ProcessedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i];

      // Update status to processing
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "processing" as const } : f,
        ),
      );

      try {
        let processedFile = fileData.file;

        // Use individual settings if available, otherwise use global settings
        const fileSettings = fileData.settings || {
          optimizationEnabled,
          quality,
          resizePreset,
          customWidth,
          customHeight,
        };

        // Apply optimization
        if (
          fileSettings.optimizationEnabled &&
          fileData.file.type.startsWith("image/")
        ) {
          const resizeWidth =
            fileSettings.resizePreset.name === "Custom"
              ? fileSettings.customWidth
              : fileSettings.resizePreset.width || undefined;
          const resizeHeight =
            fileSettings.resizePreset.name === "Custom"
              ? fileSettings.customHeight
              : fileSettings.resizePreset.height || undefined;

          processedFile = await optimizeImage(fileData.file, {
            maxWidth: resizeWidth,
            maxHeight: resizeHeight,
            quality: fileSettings.quality / 100,
            format: "jpeg",
          });
        }

        // Rename file
        const renamedFile = new File([processedFile], fileData.newName, {
          type: processedFile.type,
        });

        processedFiles.push({
          ...fileData,
          file: renamedFile,
          status: "success",
        });

        // Update status to success
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "success" as const } : f,
          ),
        );
      } catch (error) {
        console.error(`Error processing ${fileData.originalName}:`, error);

        // Update status to error
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: "error" as const,
                  error: "Processing failed",
                }
              : f,
          ),
        );
      }
    }

    setCurrentStep("complete");
    setProcessing(false);

    // Call parent handler with processed files
    const successFiles = processedFiles.filter((f) => f.status === "success");
    if (successFiles.length > 0) {
      await onProcess(successFiles);
    }
  };

  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;
  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="text-sage" size={20} />
            {t(
              "Batch Image Processing",
              "バッチ画像処理",
              "Xử lý ảnh hàng loạt",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              "Upload multiple images and apply the same settings to all.",
              "複数の画像をアップロードし、すべてに同じ設定を適用します。",
              "Tải lên nhiều ảnh và áp dụng cùng cài đặt cho tất cả.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Step: Select Files */}
          {currentStep === "select" && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-20 h-20 bg-sage/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Package className="text-sage" size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-heading mb-2">
                    {t(
                      "Select Multiple Images",
                      "複数の画像を選択",
                      "Chọn nhiều ảnh",
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "Choose all images you want to process together",
                      "一緒に処理したいすべての画像を選択してください",
                      "Chọn tất cả ảnh bạn muốn xử lý cùng lúc",
                    )}
                  </p>
                </div>
                <label className="inline-block">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button className="bg-sage text-white cursor-pointer">
                    <ImageIcon className="mr-2" size={16} />
                    {t("Choose Images", "画像を選択", "Chọn ảnh")}
                  </Button>
                </label>
              </div>
            </div>
          )}

          {/* Step: Configure */}
          {currentStep === "configure" && (
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6">
              {/* Preview Grid */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {t("Selected Images", "選択された画像", "Ảnh đã chọn")} (
                      {files.length})
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(totalSize)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        onClick={() => handleFileClick(index)}
                        className="relative group aspect-square rounded-xl overflow-hidden border-2 border-sage/10 cursor-pointer hover:border-sage transition-all"
                      >
                        <img
                          src={file.preview}
                          alt={file.originalName}
                          className="w-full h-full object-cover"
                        />
                        {file.settings && (
                          <div className="absolute top-2 left-2 w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle2 size={14} strokeWidth={3} />
                          </div>
                        )}
                        <button
                          onClick={(e) => handleRemoveFile(index, e)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XCircle size={14} />
                        </button>
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-[9px] text-white truncate font-bold">
                            {file.newName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <div className="w-full lg:w-80 space-y-4 overflow-y-auto custom-scrollbar">
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
                    <>
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
                    </>
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
                          onChange={(e) =>
                            setCustomWidth(Number(e.target.value))
                          }
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

                {/* Rename */}
                <div className="space-y-3 bg-white/50 rounded-xl p-4">
                  <Label className="text-sm font-bold">
                    {t("Rename Pattern", "名前変更パターン", "Mẫu đổi tên")}
                  </Label>

                  <div>
                    <Label className="text-[10px] text-muted-foreground">
                      {t("Base Name", "ベース名", "Tên cơ sở")}
                    </Label>
                    <Input
                      value={renamePattern}
                      onChange={(e) => setRenamePattern(e.target.value)}
                      placeholder={t(
                        "Leave empty to keep original",
                        "空のままで元の名前を保持",
                        "Để trống giữ tên gốc",
                      )}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">
                        {t("Prefix", "プレフィックス", "Tiền tố")}
                      </Label>
                      <Input
                        value={addPrefix}
                        onChange={(e) => setAddPrefix(e.target.value)}
                        placeholder="img-"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">
                        {t("Suffix", "サフィックス", "Hậu tố")}
                      </Label>
                      <Input
                        value={addSuffix}
                        onChange={(e) => setAddSuffix(e.target.value)}
                        placeholder="-opt"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-xs">
                      {t("Add Numbering", "番号付け", "Đánh số")}
                    </Label>
                    <Switch
                      checked={addNumbering}
                      onCheckedChange={setAddNumbering}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Processing */}
          {currentStep === "processing" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white/50 rounded-xl"
                  >
                    <img
                      src={file.preview}
                      alt={file.originalName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-heading truncate">
                        {file.newName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.file.size)}
                      </p>
                    </div>
                    <div>
                      {file.status === "pending" && (
                        <div className="w-6 h-6 rounded-full bg-slate-100" />
                      )}
                      {file.status === "processing" && (
                        <Loader2 className="animate-spin text-sage" size={20} />
                      )}
                      {file.status === "success" && (
                        <CheckCircle2 className="text-emerald-500" size={20} />
                      )}
                      {file.status === "error" && (
                        <XCircle className="text-red-500" size={20} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {currentStep === "complete" && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="text-emerald-500" size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-heading mb-2">
                    {t("Processing Complete!", "処理完了！", "Xử lý hoàn tất!")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      `Successfully processed ${successCount} of ${files.length} images`,
                      `${files.length}枚中${successCount}枚の画像を正常に処理しました`,
                      `Đã xử lý thành công ${successCount} trong ${files.length} ảnh`,
                    )}
                  </p>
                  {errorCount > 0 && (
                    <p className="text-sm text-red-500 mt-2">
                      {errorCount}{" "}
                      {t("images failed", "枚の画像が失敗", "ảnh thất bại")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          {currentStep === "select" && (
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              {t("Cancel", "キャンセル", "Hủy")}
            </Button>
          )}

          {currentStep === "configure" && (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setFiles([]);
                  setCurrentStep("select");
                }}
              >
                {t("Back", "戻る", "Quay lại")}
              </Button>
              <Button
                onClick={handleProcess}
                className="bg-sage text-white"
                disabled={files.length === 0}
              >
                <Package className="mr-2" size={14} />
                {t("Process All", "すべて処理", "Xử lý tất cả")} ({files.length}
                )
              </Button>
            </>
          )}

          {currentStep === "complete" && (
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-sage text-white"
            >
              {t("Done", "完了", "Hoàn tất")}
            </Button>
          )}
        </div>

        {/* File Edit Dialog */}
        {selectedFile && (
          <BatchFileEditDialog
            open={isEditingFile}
            onOpenChange={setIsEditingFile}
            file={selectedFile.file}
            fileName={selectedFile.newName}
            preview={selectedFile.preview}
            onSave={(settings, croppedFile) =>
              handleSaveFileSettings(selectedFileIndex!, settings, croppedFile)
            }
            initialSettings={selectedFile.settings}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
