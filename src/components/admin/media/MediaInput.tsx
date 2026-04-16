import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaPickerModal } from "./MediaPickerModal";
import { ImageIcon, Upload, Library, X, Maximize2, Loader2 } from "lucide-react";
import { AssetType } from "@/types/media";
import { cn } from "@/lib/utils";
import { uploadMedia } from "@/lib/cloudinary";
import { toast } from "sonner";

import { createMediaAsset } from "@/lib/supabase-media";

interface MediaInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  allowedTypes?: AssetType[];
  placeholder?: string;
  description?: string;
  className?: string;
}

export const MediaInput = ({
  label,
  value,
  onChange,
  allowedTypes = ['image', 'svg', 'icon'],
  placeholder = "https://...",
  description,
  className
}: MediaInputProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const isIconType = allowedTypes.includes('icon') && !allowedTypes.includes('image');
      const metadata = await uploadMedia(file, { isIcon: isIconType });
      
      await createMediaAsset({
        ...metadata,
        title: file.name
      });

      onChange(metadata.secure_url!);
      toast.success("Resource integrated.");
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {label}
        </label>
        {value && (
          <button 
            type="button" 
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="text-[10px] font-black text-sage hover:underline flex items-center gap-1.5 uppercase tracking-widest"
          >
            <Maximize2 size={10} />
            {isPreviewOpen ? "Hide" : "Preview"}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Input & Thumbnail Row */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-black/[0.03] group transition-all focus-within:bg-white focus-within:shadow-sm">
          {value && (
            <div className="relative group/thumb w-12 h-12 rounded-xl bg-white overflow-hidden border border-black/[0.05] flex-shrink-0">
              <img src={value} className="w-full h-full object-cover transition-transform group-hover/thumb:scale-110" alt="Thumb" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                title="Remove image"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
          )}
          <div className="flex-1 relative flex items-center">
            <div className="absolute left-2 text-slate-300 group-focus-within:text-sage transition-colors">
              <ImageIcon size={16} />
            </div>
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="h-10 bg-transparent border-none shadow-none text-xs font-bold pl-8 pr-8 focus-visible:ring-0 w-full"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-2 w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm bg-white"
                title="Clear asset URL"
              >
                <X size={14} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            variant="ghost"
            className="h-10 text-[10px] font-black uppercase tracking-widest bg-white border border-black/[0.05] hover:bg-sage/5 hover:text-sage rounded-xl transition-all"
          >
            <Library size={14} className="mr-2" />
            Library
          </Button>
 
          <div className="relative">
            <Button
              type="button"
              disabled={isUploading}
              onClick={() => document.getElementById(`quick-upload-${label}`)?.click()}
              className="w-full h-10 bg-sage text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-sage/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              <span>{isUploading ? "Uploading..." : "Upload Resource"}</span>
            </Button>
            <input
              id={`quick-upload-${label}`}
              type="file"
              className="hidden"
              onChange={handleQuickUpload}
              accept="image/*"
            />
          </div>
        </div>
      </div>

      {description && <p className="text-[9px] text-slate-400 font-medium italic px-1">{description}</p>}

      {/* Structured Preview - No longer absolute/floating to avoid overlap */}
      {value && isPreviewOpen && (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-white border border-black/[0.03] p-2 flex items-center justify-center animate-in slide-in-from-top-2 duration-300">
          <img src={value} className="max-w-full max-h-full object-contain rounded-lg" alt="Preview" />
          <button 
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <MediaPickerModal
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        onSelect={(url) => onChange(url)}
        allowedTypes={allowedTypes}
        title={`Select ${label}`}
      />
    </div>
  );
};
