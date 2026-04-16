import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface HighlightImageUploadProps {
  onUploadSuccess: (data: {
    image_url: string;
    alt_text: string;
    caption: string;
    is_cover: boolean;
  }) => void;
  onCancel: () => void;
}

export const HighlightImageUpload = ({
  onUploadSuccess,
  onCancel,
}: HighlightImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [isCover, setIsCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      formData.append("folder", "portfolio/skill-highlights");

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
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!preview) {
      toast.error("Please upload an image first");
      return;
    }

    onUploadSuccess({
      image_url: preview,
      alt_text: altText,
      caption: caption,
      is_cover: isCover,
    });

    // Reset form
    setPreview(null);
    setAltText("");
    setCaption("");
    setIsCover(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Image *</label>
        {preview ? (
          <div className="space-y-2">
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 truncate">{preview}</p>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                <span className="text-sm text-gray-600">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  Click to upload image
                </span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Converts to WebP automatically • Max 5MB
        </p>
      </div>

      {/* Alt Text */}
      <div>
        <label className="block text-sm font-medium mb-1">Alt Text</label>
        <Input
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the image..."
          className="text-sm"
        />
      </div>

      {/* Caption */}
      <div>
        <label className="block text-sm font-medium mb-1">Caption</label>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Optional caption..."
          rows={2}
          className="text-sm"
        />
      </div>

      {/* Cover Image Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_cover"
          checked={isCover}
          onChange={(e) => setIsCover(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <label htmlFor="is_cover" className="text-sm font-medium">
          Set as cover image
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={!preview || uploading}
          className="flex-1 bg-sage hover:bg-sage/90"
        >
          Add Image
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
