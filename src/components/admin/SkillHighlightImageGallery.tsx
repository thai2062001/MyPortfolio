import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Star, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { getImageUrlWithFallback } from "@/lib/utils";
import type { SkillHighlight, SkillHighlightImage } from "@/types/skills";

interface SkillHighlightImageGalleryProps {
  skillId: string;
  highlights: SkillHighlight[];
  onImagesChange?: (images: SkillHighlightImage[]) => void;
  refreshTrigger?: number;
}

export const SkillHighlightImageGallery = ({
  skillId,
  highlights,
  onImagesChange,
  refreshTrigger = 0,
}: SkillHighlightImageGalleryProps) => {
  const [images, setImages] = useState<SkillHighlightImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    alt_text: "",
    caption: "",
  });
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (skillId && highlights.length > 0) {
      fetchImages();
      // Auto-select first highlight if none selected
      if (!selectedHighlightId && highlights.length > 0) {
        setSelectedHighlightId(highlights[0].id);
      }
    }
  }, [skillId, highlights, refreshTrigger]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const highlightIds = highlights.map((h) => h.id);
      if (highlightIds.length === 0) {
        setImages([]);
        return;
      }

      const { data, error } = await supabase
        .from("skill_highlight_images")
        .select("*")
        .in("highlight_id", highlightIds)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setImages(data || []);
      onImagesChange?.(data || []);
    } catch (error) {
      console.error("Error fetching highlight images:", error);
      toast.error("Failed to load highlight images");
    } finally {
      setLoading(false);
    }
  };

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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!selectedHighlightId) {
      toast.error("Please select a highlight first");
      return;
    }

    setUploading(true);
    let uploadedCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith("image/")) continue;
        if (file.size > 5 * 1024 * 1024) continue;

        try {
          const webpBlob = await convertToWebP(file);
          const webpFile = new File([webpBlob], `${Date.now()}-${i}.webp`, {
            type: "image/webp",
          });

          const formData = new FormData();
          formData.append("file", webpFile);
          formData.append("upload_preset", "portfolio_icons");
          formData.append("folder", "portfolio/skills/highlights");

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            },
          );

          if (!response.ok) throw new Error("Upload failed");

          const data = await response.json();
          const imageUrl = data.secure_url;

          // ⭐ IMMEDIATE PERSISTENCE ⭐
          const { data: insertedData, error: insertError } = await supabase
            .from("skill_highlight_images")
            .insert([
              {
                highlight_id: selectedHighlightId,
                image_url: imageUrl,
                alt_text: "",
                caption: "",
                is_cover: false,
                order_index: images.length + uploadedCount,
              },
            ])
            .select();

          if (insertError) throw insertError;
          if (insertedData) {
            setImages((prev) => [...prev, insertedData[0]]);
            uploadedCount++;
          }
        } catch (error) {
          console.error("Upload/Save error:", error);
        }
      }

      if (uploadedCount > 0) {
        toast.success(`${uploadedCount} image(s) saved successfully`);
        onImagesChange?.([...images]); // Notify parent
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      const { error } = await supabase
        .from("skill_highlight_images")
        .delete()
        .eq("id", id);

      if (error) throw error;

      const updated = images.filter((img) => img.id !== id);
      setImages(updated);
      onImagesChange?.(updated);
      toast.success("Image deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleSetCover = async (id: string) => {
    const image = images.find((img) => img.id === id);
    if (!image) return;

    try {
      await supabase
        .from("skill_highlight_images")
        .update({ is_cover: false })
        .eq("highlight_id", image.highlight_id);

      const { error: setCoverError } = await supabase
        .from("skill_highlight_images")
        .update({ is_cover: true })
        .eq("id", id);

      if (setCoverError) throw setCoverError;

      const updated = images.map((img) => ({
        ...img,
        is_cover: img.id === id && img.highlight_id === image.highlight_id,
      }));
      setImages(updated);
      onImagesChange?.(updated);
      toast.success("Cover image updated");
    } catch (error) {
      console.error("Error setting cover:", error);
      toast.error("Failed to set cover image");
    }
  };

  const handleUpdateMetadata = async (id: string) => {
    try {
      const { error } = await supabase
        .from("skill_highlight_images")
        .update({
          alt_text: editData.alt_text,
          caption: editData.caption,
        })
        .eq("id", id);

      if (error) throw error;

      const updated = images.map((img) =>
        img.id === id
          ? { ...img, alt_text: editData.alt_text, caption: editData.caption }
          : img,
      );
      setImages(updated);
      onImagesChange?.(updated);
      setEditingId(null);
      toast.success("Metadata updated");
    } catch (error) {
      console.error("Error updating metadata:", error);
      toast.error("Failed to update metadata");
    }
  };

  const startEdit = (image: SkillHighlightImage) => {
    setEditingId(image.id);
    setEditData({
      alt_text: image.alt_text || "",
      caption: image.caption || "",
    });
  };

  const getHighlightName = (highlightId: string) => {
    const highlight = highlights.find((h) => h.id === highlightId);
    return highlight?.title || "Unassigned";
  };

  return (
    <div className="space-y-4">
      <div className="bg-sage/5 p-4 rounded-lg border border-sage/20">
        <label className="block text-xs md:text-sm font-semibold text-sage mb-2">
          1. Select Target Highlight *
        </label>
        <select
          value={selectedHighlightId}
          onChange={(e) => setSelectedHighlightId(e.target.value)}
          className="w-full mb-4 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage"
        >
          <option value="">-- Choose highlight --</option>
          {highlights.map((h) => (
            <option key={h.id} value={h.id}>
              {h.title}
            </option>
          ))}
        </select>

        <label className="block text-xs md:text-sm font-semibold text-sage mb-2">
          2. Upload Images
        </label>
        <label 
          className={`flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-lg transition-colors ${
            !selectedHighlightId 
              ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50" 
              : "cursor-pointer border-sage/30 bg-white hover:border-sage/50"
          }`}
        >
          {uploading ? <Loader2 className="animate-spin w-5 h-5" /> : <Upload className="w-5 h-5 text-gray-600" />}
          <span className="text-sm text-gray-600">
            {uploading ? "Saving to Database..." : !selectedHighlightId ? "Select highlight above first" : "Click to upload multiple images"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || !selectedHighlightId}
            className="hidden"
            multiple
          />
        </label>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 text-sm">Loading images...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm italic">No highlight images assigned to this skill.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((image) => (
            <div key={image.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video relative group">
                <img
                  src={getImageUrlWithFallback(image.image_url)}
                  alt={image.alt_text || "Highlight image"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleDelete(image.id)} className="p-1.5 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700">
                    <X size={14} />
                  </button>
                </div>
                {image.is_cover && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-[10px] font-bold rounded shadow-sm flex items-center gap-1">
                    <Star size={10} fill="white" /> COVER
                  </div>
                )}
              </div>

              <div className="p-3 space-y-2">
                {editingId === image.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editData.alt_text}
                      onChange={(e) => setEditData({...editData, alt_text: e.target.value})}
                      placeholder="Alt text"
                      className="text-xs h-8"
                    />
                    <Textarea
                      value={editData.caption}
                      onChange={(e) => setEditData({...editData, caption: e.target.value})}
                      placeholder="Caption"
                      className="text-xs min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateMetadata(image.id)} size="sm" className="h-7 text-xs bg-sage">Save</Button>
                      <Button onClick={() => setEditingId(null)} size="sm" variant="outline" className="h-7 text-xs">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase text-sage px-1.5 py-0.5 bg-sage/10 rounded">
                        {getHighlightName(image.highlight_id)}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(image)} className="text-gray-400 hover:text-blue-600 transition-colors">
                          <AlertCircle size={14} />
                        </button>
                        {!image.is_cover && (
                          <button onClick={() => handleSetCover(image.id)} className="text-gray-400 hover:text-yellow-500 transition-colors">
                            <Star size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {image.alt_text && <p className="text-xs text-gray-600 font-medium line-clamp-1">{image.alt_text}</p>}
                    {image.caption && <p className="text-[10px] text-gray-400 line-clamp-2">{image.caption}</p>}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
