import { useState, useRef, useEffect } from "react";
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
import { Crop, Move } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { cn } from "@/lib/utils";

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageFile: File;
  onCropComplete: (croppedFile: File) => void;
  initialCropArea?: { x: number; y: number; width: number; height: number };
  initialAspectRatio?: number | null;
  onCropStateChange?: (state: {
    cropArea: { x: number; y: number; width: number; height: number };
    aspectRatio: number | null;
  }) => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ImageCropDialog = ({
  open,
  onOpenChange,
  imageFile,
  onCropComplete,
  initialCropArea,
  initialAspectRatio = null,
  onCropStateChange,
}: ImageCropDialogProps) => {
  const { t } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 300,
    height: 300,
  });
  const [dragMode, setDragMode] = useState<"none" | "move" | "resize-tl" | "resize-tr" | "resize-bl" | "resize-br">("none");
  const [hoverMode, setHoverMode] = useState<"none" | "move" | "resize-tl" | "resize-tr" | "resize-bl" | "resize-br">("none");
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(initialAspectRatio);

  useEffect(() => {
    if (imageFile && open) {
      setLoading(true);
      const url = URL.createObjectURL(imageFile);
      const img = new Image();
      img.onload = () => {
        setImage(img);
        
        if (initialCropArea) {
          setCropArea(initialCropArea);
        } else {
          // Initialize crop area to center
          const size = Math.min(img.width, img.height) * 0.7;
          setCropArea({
            x: (img.width - size) / 2,
            y: (img.height - size) / 2,
            width: size,
            height: size,
          });
        }
        setLoading(false);
      };
      img.onerror = () => {
        console.error("Failed to load image");
        setLoading(false);
      };
      img.src = url;
      return () => {
        URL.revokeObjectURL(url);
        setImage(null);
      };
    }
  }, [imageFile, open, initialCropArea]);

  useEffect(() => {
    drawCanvas();
  }, [image, cropArea]);

  const drawCanvas = () => {
    if (!canvasRef.current || !image || loading) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate scale to fit canvas
    const maxSize = 600;
    const scale = Math.min(maxSize / image.width, maxSize / image.height);
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw full image
    try {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.error("Error drawing image:", error);
      return;
    }

    // Draw dark overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scaled crop area
    const scaledCrop = {
      x: cropArea.x * scale,
      y: cropArea.y * scale,
      width: cropArea.width * scale,
      height: cropArea.height * scale,
    };

    // Clear crop area to show original image
    ctx.clearRect(
      scaledCrop.x,
      scaledCrop.y,
      scaledCrop.width,
      scaledCrop.height,
    );

    // Redraw image in crop area
    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      scaledCrop.x,
      scaledCrop.y,
      scaledCrop.width,
      scaledCrop.height,
    );

    // Draw crop border
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      scaledCrop.x,
      scaledCrop.y,
      scaledCrop.width,
      scaledCrop.height,
    );

    // Draw corner handles
    const handleSize = 14;
    const handles = [
      { x: scaledCrop.x, y: scaledCrop.y }, // tl
      { x: scaledCrop.x + scaledCrop.width, y: scaledCrop.y }, // tr
      { x: scaledCrop.x, y: scaledCrop.y + scaledCrop.height }, // bl
      { x: scaledCrop.x + scaledCrop.width, y: scaledCrop.y + scaledCrop.height }, // br
    ];

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    handles.forEach((handle) => {
      ctx.fillRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize,
      );
      ctx.strokeRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize,
      );
    });

    // Draw grid lines (rule of thirds)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for (let i = 1; i < 3; i++) {
      // Vertical
      ctx.beginPath();
      ctx.moveTo(scaledCrop.x + (scaledCrop.width / 3) * i, scaledCrop.y);
      ctx.lineTo(
        scaledCrop.x + (scaledCrop.width / 3) * i,
        scaledCrop.y + scaledCrop.height,
      );
      ctx.stroke();

      // Horizontal
      ctx.beginPath();
      ctx.moveTo(scaledCrop.x, scaledCrop.y + (scaledCrop.height / 3) * i);
      ctx.lineTo(
        scaledCrop.x + scaledCrop.width,
        scaledCrop.y + (scaledCrop.height / 3) * i,
      );
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = canvas.width / image.width;
    const scaledCrop = {
      x: cropArea.x * scale,
      y: cropArea.y * scale,
      width: cropArea.width * scale,
      height: cropArea.height * scale,
    };

    const handleHitSize = 20;

    // Check corners
    if (Math.abs(x - scaledCrop.x) < handleHitSize && Math.abs(y - scaledCrop.y) < handleHitSize) {
      setDragMode("resize-tl");
      setDragStart({ x, y });
      return;
    }
    if (Math.abs(x - (scaledCrop.x + scaledCrop.width)) < handleHitSize && Math.abs(y - scaledCrop.y) < handleHitSize) {
      setDragMode("resize-tr");
      setDragStart({ x, y });
      return;
    }
    if (Math.abs(x - scaledCrop.x) < handleHitSize && Math.abs(y - (scaledCrop.y + scaledCrop.height)) < handleHitSize) {
      setDragMode("resize-bl");
      setDragStart({ x, y });
      return;
    }
    if (Math.abs(x - (scaledCrop.x + scaledCrop.width)) < handleHitSize && Math.abs(y - (scaledCrop.y + scaledCrop.height)) < handleHitSize) {
      setDragMode("resize-br");
      setDragStart({ x, y });
      return;
    }

    if (
      x >= scaledCrop.x &&
      x <= scaledCrop.x + scaledCrop.width &&
      y >= scaledCrop.y &&
      y <= scaledCrop.y + scaledCrop.height
    ) {
      setDragMode("move");
      setDragStart({ x: x - scaledCrop.x, y: y - scaledCrop.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scale = canvas.width / image.width;

    const scaledCrop = {
      x: cropArea.x * scale,
      y: cropArea.y * scale,
      width: cropArea.width * scale,
      height: cropArea.height * scale,
    };

    const handleHitSize = 20;

    // Update hover mode if not dragging
    if (dragMode === "none") {
      if (Math.abs(x - scaledCrop.x) < handleHitSize && Math.abs(y - scaledCrop.y) < handleHitSize) {
        setHoverMode("resize-tl");
      } else if (Math.abs(x - (scaledCrop.x + scaledCrop.width)) < handleHitSize && Math.abs(y - scaledCrop.y) < handleHitSize) {
        setHoverMode("resize-tr");
      } else if (Math.abs(x - scaledCrop.x) < handleHitSize && Math.abs(y - (scaledCrop.y + scaledCrop.height)) < handleHitSize) {
        setHoverMode("resize-bl");
      } else if (Math.abs(x - (scaledCrop.x + scaledCrop.width)) < handleHitSize && Math.abs(y - (scaledCrop.y + scaledCrop.height)) < handleHitSize) {
        setHoverMode("resize-br");
      } else if (
        x >= scaledCrop.x &&
        x <= scaledCrop.x + scaledCrop.width &&
        y >= scaledCrop.y &&
        y <= scaledCrop.y + scaledCrop.height
      ) {
        setHoverMode("move");
      } else {
        setHoverMode("none");
      }
      return;
    }

    // Handle dragging
    if (dragMode === "move") {
      const newX = Math.max(
        0,
        Math.min((x - dragStart.x) / scale, image.width - cropArea.width),
      );
      const newY = Math.max(
        0,
        Math.min((y - dragStart.y) / scale, image.height - cropArea.height),
      );
      setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
      return;
    }

    // Handle resizing
    setCropArea((prev) => {
      let { x: cx, y: cy, width: cw, height: ch } = prev;
      const dx = (x - dragStart.x) / scale;
      const dy = (y - dragStart.y) / scale;
      const minSize = 50 / scale;

      if (dragMode === "resize-br") {
        cw = Math.max(minSize, Math.min(image.width - cx, cw + dx));
        if (aspectRatio) {
          ch = cw / aspectRatio;
          if (cy + ch > image.height) {
            ch = image.height - cy;
            cw = ch * aspectRatio;
          }
        } else {
          ch = Math.max(minSize, Math.min(image.height - cy, ch + dy));
        }
      } else if (dragMode === "resize-tl") {
        const potentialWidth = cw - dx;
        const potentialX = cx + dx;
        if (potentialX >= 0 && potentialWidth >= minSize) {
          cw = potentialWidth;
          cx = potentialX;
        }
        
        if (aspectRatio) {
          const potentialHeight = cw / aspectRatio;
          const potentialY = cy + (ch - potentialHeight);
          if (potentialY >= 0 && potentialHeight >= minSize) {
            ch = potentialHeight;
            cy = potentialY;
          } else {
            cx = prev.x;
            cw = prev.width;
          }
        } else {
          const potentialHeight = ch - dy;
          const potentialY = cy + dy;
          if (potentialY >= 0 && potentialHeight >= minSize) {
            ch = potentialHeight;
            cy = potentialY;
          }
        }
      } else if (dragMode === "resize-tr") {
        cw = Math.max(minSize, Math.min(image.width - cx, cw + dx));
        if (aspectRatio) {
          const potentialHeight = cw / aspectRatio;
          const potentialY = cy + (ch - potentialHeight);
          if (potentialY >= 0 && potentialHeight >= minSize) {
            ch = potentialHeight;
            cy = potentialY;
          } else {
            cw = prev.width;
          }
        } else {
          const potentialHeight = ch - dy;
          const potentialY = cy + dy;
          if (potentialY >= 0 && potentialHeight >= minSize) {
            ch = potentialHeight;
            cy = potentialY;
          }
        }
      } else if (dragMode === "resize-bl") {
        const potentialWidth = cw - dx;
        const potentialX = cx + dx;
        if (potentialX >= 0 && potentialWidth >= minSize) {
          cw = potentialWidth;
          cx = potentialX;
        }

        if (aspectRatio) {
          ch = cw / aspectRatio;
          if (cy + ch > image.height) {
            ch = image.height - cy;
            cw = ch * aspectRatio;
            cx = prev.x + (prev.width - cw);
          }
        } else {
          ch = Math.max(minSize, Math.min(image.height - cy, ch + dy));
        }
      }

      setDragStart({ x, y });
      return { x: cx, y: cy, width: cw, height: ch };
    });
  };

  const handleMouseUp = () => {
    setDragMode("none");
  };

  const handleMouseLeave = () => {
    setDragMode("none");
    setHoverMode("none");
  };

  const getCursorClass = () => {
    const activeMode = dragMode !== "none" ? dragMode : hoverMode;
    switch (activeMode) {
      case "move": return "cursor-move";
      case "resize-tl":
      case "resize-br": return "cursor-nwse-resize";
      case "resize-tr":
      case "resize-bl": return "cursor-nesw-resize";
      default: return "cursor-default";
    }
  };

  const handleCropSizeChange = (
    dimension: "width" | "height",
    value: number,
  ) => {
    if (!image) return;

    if (aspectRatio) {
      // When aspect ratio is locked
      if (dimension === "width") {
        const newWidth = Math.min(value, image.width);
        const newHeight = newWidth / aspectRatio;

        if (newHeight <= image.height) {
          // Center the crop area
          setCropArea({
            x: (image.width - newWidth) / 2,
            y: (image.height - newHeight) / 2,
            width: newWidth,
            height: newHeight,
          });
        } else {
          // Height would exceed image, constrain by height instead
          const constrainedHeight = image.height;
          const constrainedWidth = constrainedHeight * aspectRatio;
          setCropArea({
            x: (image.width - constrainedWidth) / 2,
            y: 0,
            width: constrainedWidth,
            height: constrainedHeight,
          });
        }
      } else {
        const newHeight = Math.min(value, image.height);
        const newWidth = newHeight * aspectRatio;

        if (newWidth <= image.width) {
          // Center the crop area
          setCropArea({
            x: (image.width - newWidth) / 2,
            y: (image.height - newHeight) / 2,
            width: newWidth,
            height: newHeight,
          });
        } else {
          // Width would exceed image, constrain by width instead
          const constrainedWidth = image.width;
          const constrainedHeight = constrainedWidth / aspectRatio;
          setCropArea({
            x: 0,
            y: (image.height - constrainedHeight) / 2,
            width: constrainedWidth,
            height: constrainedHeight,
          });
        }
      }
    } else {
      // Free crop - just adjust the dimension from the current position
      setCropArea((prev) => {
        const newValue = Math.min(
          value,
          dimension === "width" ? image.width - prev.x : image.height - prev.y,
        );
        return { ...prev, [dimension]: newValue };
      });
    }
  };

  const setAspectRatioPreset = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (ratio && image) {
      // Calculate maximum crop area for this aspect ratio
      let newWidth: number;
      let newHeight: number;

      // Try to fit width first
      if (image.width / image.height > ratio) {
        // Image is wider than target ratio
        newHeight = image.height;
        newWidth = newHeight * ratio;
      } else {
        // Image is taller than target ratio
        newWidth = image.width;
        newHeight = newWidth / ratio;
      }

      // Center the crop area
      setCropArea({
        x: (image.width - newWidth) / 2,
        y: (image.height - newHeight) / 2,
        width: newWidth,
        height: newHeight,
      });
    } else if (!ratio && image) {
      // Free crop - keep current size but allow free adjustment
      // No changes needed to cropArea if already set
    }
  };

  const getCroppedImage = async (): Promise<File> => {
    if (!image) throw new Error("No image loaded");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    // Draw cropped portion
    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Failed to create blob");
        const file = new File([blob], imageFile.name, {
          type: imageFile.type,
        });
        resolve(file);
      }, imageFile.type);
    });
  };

  const handleConfirm = async () => {
    try {
      const croppedFile = await getCroppedImage();
      onCropComplete(croppedFile);
      onCropStateChange?.({ cropArea, aspectRatio });
      onOpenChange(false);
    } catch (error) {
      console.error("Crop failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="text-sage" size={20} />
            {t(
              "Crop & Adjust Image",
              "画像のクロップと調整",
              "Cắt & Điều chỉnh ảnh",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              "Drag the corners to resize, or drag the center to move.",
              "角をドラッグしてサイズを変更し、中央をドラッグして移動します。",
              "Kéo các góc để thay đổi kích thước, hoặc kéo chính giữa để di chuyển.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6">
          {/* Canvas Preview */}
          <div className="flex-1 flex items-center justify-center bg-slate-900 rounded-xl p-4 min-h-[400px]">
            {loading ? (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto" />
                <p className="text-sm text-white/60 font-bold">
                  {t(
                    "Loading image...",
                    "画像を読み込み中...",
                    "Đang tải ảnh...",
                  )}
                </p>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                className={cn(
                  "max-w-full max-h-full rounded-lg shadow-2xl",
                  getCursorClass(),
                )}
              />
            )}
          </div>

          {/* Controls */}
          <div className="w-full lg:w-80 space-y-4 overflow-y-auto custom-scrollbar">
            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t("Aspect Ratio", "アスペクト比", "Tỷ lệ khung hình")}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Free", value: null },
                  { label: "1:1", value: 1 },
                  { label: "4:3", value: 4 / 3 },
                  { label: "16:9", value: 16 / 9 },
                  { label: "3:2", value: 3 / 2 },
                  { label: "2:3", value: 2 / 3 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setAspectRatioPreset(preset.value)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-bold transition-all",
                      aspectRatio === preset.value
                        ? "bg-sage text-white shadow-md"
                        : "bg-white text-muted-foreground border border-sage/10 hover:bg-sage/10",
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Size */}
            {image && (
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t("Crop Size", "クロップサイズ", "Kích thước cắt")}
                </Label>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-[10px] text-muted-foreground">
                        {t("Width", "幅", "Rộng")}
                      </Label>
                      <span className="text-xs font-bold text-heading">
                        {Math.round(cropArea.width)}px
                      </span>
                    </div>
                    <Slider
                      value={[cropArea.width]}
                      onValueChange={([value]) =>
                        handleCropSizeChange("width", value)
                      }
                      min={100}
                      max={image.width}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  {!aspectRatio && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-[10px] text-muted-foreground">
                          {t("Height", "高さ", "Cao")}
                        </Label>
                        <span className="text-xs font-bold text-heading">
                          {Math.round(cropArea.height)}px
                        </span>
                      </div>
                      <Slider
                        value={[cropArea.height]}
                        onValueChange={([value]) =>
                          handleCropSizeChange("height", value)
                        }
                        min={100}
                        max={image.height}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  )}
                  {aspectRatio && (
                    <div className="bg-sage/5 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] text-muted-foreground">
                          {t("Height", "高さ", "Cao")}{" "}
                          {t("(auto)", "(自動)", "(tự động)")}
                        </Label>
                        <span className="text-xs font-bold text-sage">
                          {Math.round(cropArea.height)}px
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-sage/5 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-sage">
                <Move size={12} />
                {t("Tip", "ヒント", "Mẹo")}
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t(
                  "Drag the corners of the green box to resize, or drag the center to move the crop area.",
                  "緑色のボックスの角をドラッグしてサイズを変更し、中央をドラッグして移動します。",
                  "Kéo các góc của hộp màu xanh để thay đổi kích thước, hoặc kéo chính giữa để di chuyển vùng cắt.",
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("Cancel", "キャンセル", "Hủy")}
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-sage text-white"
            disabled={loading || !image}
          >
            <Crop className="mr-2" size={14} />
            {t("Apply Crop", "クロップを適用", "Áp dụng cắt")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
