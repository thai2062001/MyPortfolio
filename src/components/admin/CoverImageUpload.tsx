import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface CoverImageUploadProps {
  onUploadSuccess: (url: string) => void;
  currentUrl?: string;
  label?: string;
}

export const CoverImageUpload = forwardRef<
  { reset: () => void },
  CoverImageUploadProps
>(({ onUploadSuccess, currentUrl, label = "Upload Cover Image" }, ref) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setPreview(null);
    },
  }));

  // Update preview when currentUrl changes
  useEffect(() => {
    // Only set preview if currentUrl has a value, otherwise clear it
    if (currentUrl && currentUrl.trim()) {
      setPreview(currentUrl);
    } else {
      setPreview(null);
    }
  }, [currentUrl]);

  const convertToWebP = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Failed to convert to WebP"));
            },
            "image/webp",
            0.8,
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Convert to WebP
      const webpBlob = await convertToWebP(file);
      const webpFile = new File([webpBlob], `${Date.now()}.webp`, {
        type: "image/webp",
      });

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", webpFile);
      formData.append("upload_preset", "portfolio_icons");
      formData.append("folder", "portfolio/skills");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      setPreview(imageUrl);
      onUploadSuccess(imageUrl);
      toast.success("Cover image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload cover image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs md:text-sm font-medium">{label}</label>

      {preview ? (
        <div className="flex items-center gap-2">
          <div className="w-16 h-16 rounded border border-gray-200 flex items-center justify-center bg-gray-50 flex-shrink-0">
            <img
              src={preview}
              alt="Cover preview"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 truncate">{preview}</p>
          </div>
          <Button
            onClick={handleRemove}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 px-3 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
          <Upload className="w-4 h-4 text-gray-600" />
          <span className="text-xs text-gray-600">
            {uploading ? "Uploading..." : "Click to upload image"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      <p className="text-xs text-gray-500">
        Converts to WebP automatically • Max 5MB
      </p>
    </div>
  );
});
