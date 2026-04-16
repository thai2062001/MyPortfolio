import { useState, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  currentUrl?: string;
  label?: string;
}

export const CloudinaryUpload = forwardRef<
  { reset: () => void },
  CloudinaryUploadProps
>(({ onUploadSuccess, currentUrl, label = "Upload Icon" }, ref) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setPreview(null);
    },
  }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - ONLY SVG
    if (file.type !== "image/svg+xml") {
      toast.error("Only SVG files are allowed");
      return;
    }

    // Validate file size (max 500KB)
    if (file.size > 500 * 1024) {
      toast.error("File size must be less than 500KB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "portfolio_icons"); // Cloudinary preset

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
      toast.success("Icon uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload icon");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess("");
  };

  const openTheSvgOrg = () => {
    window.open("https://thesvg.org", "_blank", "width=800,height=600");
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium">{label}</label>

      {preview ? (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded border border-gray-200 flex items-center justify-center bg-gray-50">
            <img
              src={preview}
              alt="Icon preview"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="flex-1 text-xs text-gray-600 truncate">{preview}</div>
          <Button
            onClick={handleRemove}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
          <Upload className="w-4 h-4 text-gray-600" />
          <span className="text-xs text-gray-600">
            {uploading ? "Uploading..." : "Click to upload SVG"}
          </span>
          <input
            type="file"
            accept=".svg,image/svg+xml"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      <div className="space-y-1">
        <p className="text-xs text-gray-500">SVG only • Max 500KB</p>
        <Button
          onClick={openTheSvgOrg}
          variant="outline"
          size="sm"
          className="w-full text-xs h-7 gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          Download SVG from thesvg.org
        </Button>
      </div>
    </div>
  );
});
