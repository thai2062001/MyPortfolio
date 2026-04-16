import { useState, useEffect, useRef } from "react";
import { Plus, Library, Star, X, Edit3, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { MediaPickerModal } from "./media/MediaPickerModal";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SkillImage {
  id: string;
  skill_id: string;
  image_url: string;
  alt_text?: string;
  caption?: string;
  is_cover: boolean;
  order_index: number;
}

interface SkillImageGalleryProps {
  skillId: string;
  onImagesChange?: (images: SkillImage[]) => void;
}

export const SkillImageGallery = ({
  skillId,
  onImagesChange,
}: SkillImageGalleryProps) => {
  const [images, setImages] = useState<SkillImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ alt_text: "", caption: "" });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (skillId) {
      fetchImages();
    }
  }, [skillId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("skill_images")
        .select("*")
        .eq("skill_id", skillId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setImages(data || []);
      onImagesChange?.(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images");
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

    setUploading(true);
    let uploadedCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;

        try {
          const webpBlob = await convertToWebP(file);
          const webpFile = new File([webpBlob], `${Date.now()}-${i}.webp`, { type: "image/webp" });

          const formData = new FormData();
          formData.append("file", webpFile);
          formData.append("upload_preset", "portfolio_icons");
          formData.append("folder", "portfolio/skills");

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
          );

          if (!response.ok) throw new Error("Upload failed");
          const data = await response.json();
          const imageUrl = data.secure_url;

          const { error } = await supabase
            .from("skill_images")
            .insert([{
              skill_id: skillId,
              image_url: imageUrl,
              alt_text: "",
              caption: "",
              is_cover: false
            }]);

          if (error) throw error;
          uploadedCount++;
        } catch (error) {
          console.error("Upload error:", error);
        }
      }
      if (uploadedCount > 0) {
        toast.success(`${uploadedCount} image(s) uploaded`);
        fetchImages();
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      const { error } = await supabase.from("skill_images").delete().eq("id", id);
      if (error) throw error;
      toast.success("Image deleted");
      fetchImages();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleSetCover = async (id: string) => {
    try {
      await supabase.from("skill_images").update({ is_cover: false }).eq("skill_id", skillId);
      const { error } = await supabase.from("skill_images").update({ is_cover: true }).eq("id", id);
      if (error) throw error;
      toast.success("Cover image updated");
      fetchImages();
    } catch (error) {
      toast.error("Failed to set cover");
    }
  };

  const handleUpdateMetadata = async (id: string) => {
    try {
      const { error } = await supabase
        .from("skill_images")
        .update({ alt_text: editData.alt_text, caption: editData.caption })
        .eq("id", id);
      if (error) throw error;
      toast.success("Metadata updated");
      setEditingId(null);
      fetchImages();
    } catch (error) {
      toast.error("Failed to update metadata");
    }
  };

  const startEdit = (image: SkillImage) => {
    setEditingId(image.id);
    setEditData({ alt_text: image.alt_text || "", caption: image.caption || "" });
  };

  const handleLibrarySelect = async (url: string, asset?: any) => {
    try {
      const { error } = await supabase.from("skill_images").insert([{
        skill_id: skillId,
        image_url: url,
        alt_text: asset?.alt_text || "",
        caption: asset?.caption || "",
        is_cover: false
      }]);
      if (error) throw error;
      toast.success("Image added from Media Hub");
      fetchImages();
    } catch (error) {
      toast.error("Failed to add image.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <label className="flex-1">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            className="w-full h-11 border-sage/20 text-sage rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2"
          >
            {uploading ? <LoadingSpinner /> : <Plus size={14} />}
            Upload Image
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" multiple />
        </label>
        <Button 
          onClick={() => setIsPickerOpen(true)}
          className="h-11 px-6 bg-sage text-white rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2"
        >
          <Library size={14} />
          Media Hub
        </Button>
      </div>

      <MediaPickerModal 
        open={isPickerOpen} 
        onOpenChange={setIsPickerOpen} 
        onSelect={handleLibrarySelect} 
        title="Select Skill Images" 
        allowMultiple={false} 
      />

      {loading ? (
        <div className="text-center py-8 text-muted-foreground animate-pulse text-xs tracking-widest">Syncing cluster...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border/20 rounded-[2rem] flex flex-col items-center gap-3">
          <ImageIcon size={32} className="text-muted-foreground/20" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Gallery Empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 py-4">
          {images.map((image) => (
            <div key={image.id} className="bg-white border border-border/10 rounded-[1.5rem] overflow-hidden group transition-all hover:bg-sage/[0.02]">
              <div className="flex gap-5 p-5 pr-6">
                {/* Image Section */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <img 
                    src={image.image_url} 
                    alt="" 
                    className="w-full h-full object-cover rounded-2xl border border-sage/5 shadow-sm" 
                  />
                  {image.is_cover && (
                    <div className="absolute -top-2 -left-2 bg-amber-500 text-white p-1.5 rounded-full shadow-lg z-10">
                      <Star size={10} fill="currentColor" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="space-y-1">
                    <h4 className="text-[13px] font-bold text-heading truncate uppercase tracking-tight">
                      {image.alt_text || "Untitled Asset"}
                    </h4>
                    {image.caption ? (
                      <p className="text-[11px] text-muted-foreground line-clamp-1 italic font-newsreader leading-relaxed">
                        {image.caption}
                      </p>
                    ) : (
                      <p className="text-[9px] text-muted-foreground/30 uppercase tracking-[0.2em]">Pending Content</p>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <Button 
                      onClick={() => startEdit(image)} 
                      variant="ghost" 
                      size="sm"
                      className={`h-7 px-3 rounded-lg flex items-center gap-2 transition-all ${editingId === image.id ? 'bg-sage text-white shadow-md shadow-sage/20' : 'text-muted-foreground hover:text-sage hover:bg-sage/10'}`}
                    >
                      <Edit3 size={11} />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Edit</span>
                    </Button>
                    
                    {!image.is_cover && (
                      <Button 
                        onClick={() => handleSetCover(image.id)} 
                        variant="ghost" 
                        size="sm"
                        className="h-7 px-3 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-50 transition-all font-bold"
                      >
                        <Star size={11} />
                        <span className="text-[8px] uppercase tracking-widest">Cover</span>
                      </Button>
                    )}

                    <Button 
                      onClick={() => handleDelete(image.id)} 
                      variant="ghost" 
                      size="sm"
                      className="h-7 px-3 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all font-bold"
                    >
                      <Trash2 size={11} />
                      <span className="text-[8px] uppercase tracking-widest">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              {editingId === image.id && (
                <div className="px-6 pb-6 pt-3 space-y-5 animate-in slide-in-from-top-1 duration-200">
                  <div className="h-px bg-sage/20 mx-auto w-full mb-5" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-sage ml-1">Alt Text</label>
                      <Input 
                         value={editData.alt_text} 
                         onChange={(e) => setEditData({...editData, alt_text: e.target.value})} 
                         placeholder="Asset title..." 
                         className="h-10 bg-white border-sage/20 rounded-xl text-xs focus:border-sage focus:ring-1 focus:ring-sage/10 shadow-sm transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-sage ml-1">Caption</label>
                      <Input 
                        value={editData.caption} 
                        onChange={(e) => setEditData({...editData, caption: e.target.value})} 
                        placeholder="Description..." 
                        className="h-10 bg-white border-sage/20 rounded-xl text-xs focus:border-sage focus:ring-1 focus:ring-sage/10 shadow-sm transition-all" 
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleUpdateMetadata(image.id)} size="sm" className="bg-sage text-white rounded-xl h-9 px-6 text-[10px] font-bold uppercase tracking-widest shadow-md shadow-sage/10">Save</Button>
                    <Button onClick={() => setEditingId(null)} size="sm" variant="outline" className="rounded-xl h-9 px-6 text-[10px] font-bold uppercase tracking-widest border-sage/20">Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
