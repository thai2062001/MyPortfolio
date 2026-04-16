import { useState, useEffect } from "react";
import { Plus, Library, Star, X, Image as ImageIcon, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { MediaPickerModal } from "./media/MediaPickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HighlightImage {
  id: string;
  highlight_id: string;
  image_url: string;
  alt_text?: string;
  caption?: string;
  is_cover: boolean;
  order_index: number;
}

interface SkillHighlightGalleryProps {
  highlightId: string;
  onImagesChange?: (images: HighlightImage[]) => void;
}

export const SkillHighlightGallery = ({
  highlightId,
  onImagesChange,
}: SkillHighlightGalleryProps) => {
  const [images, setImages] = useState<HighlightImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ alt_text: "", caption: "" });
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    if (highlightId) {
      fetchImages();
    }
  }, [highlightId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("skill_highlight_images")
        .select("*")
        .eq("highlight_id", highlightId)
        .order("created_at", { ascending: true }); // Back to chronological order

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

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this image from highlight?")) return;

    try {
      const { error } = await supabase
        .from("skill_highlight_images")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Image removed");
      fetchImages();
    } catch (error) {
      toast.error("Failed to remove image");
    }
  };

  const handleSetCover = async (id: string) => {
    try {
      await supabase
        .from("skill_highlight_images")
        .update({ is_cover: false })
        .eq("highlight_id", highlightId);

      const { error } = await supabase
        .from("skill_highlight_images")
        .update({ is_cover: true })
        .eq("id", id);

      if (error) throw error;
      toast.success("Cover image set");
      fetchImages();
    } catch (error) {
      toast.error("Failed to set cover");
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
      toast.success("Metadata updated");
      setEditingId(null);
      fetchImages();
    } catch (error) {
      toast.error("Failed to update metadata");
    }
  };

  const handleLibrarySelect = async (url: string, asset?: any) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("skill_highlight_images")
        .insert([{
          highlight_id: highlightId,
          image_url: url,
          alt_text: asset?.alt_text || "",
          caption: asset?.caption || "",
          is_cover: false
        }]);

      if (error) throw error;
      toast.success("Image integrated from Media Hub.");
      fetchImages();
    } catch (error) {
      toast.error("Integration failed.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (image: HighlightImage) => {
    setEditingId(image.id);
    setEditData({
      alt_text: image.alt_text || "",
      caption: image.caption || "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage/10 rounded-2xl flex items-center justify-center text-sage">
            <Library size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-heading">Highlight Gallery</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Asset Cluster</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setIsPickerOpen(true)}
          variant="outline"
          className="w-full sm:w-auto border-sage/20 text-sage hover:bg-sage/5 rounded-xl text-[10px] font-bold uppercase tracking-widest h-11 px-6"
        >
          <Plus size={14} className="mr-2" />
          Media Hub
        </Button>

        <MediaPickerModal 
          open={isPickerOpen}
          onOpenChange={setIsPickerOpen}
          onSelect={handleLibrarySelect}
          title="Select Highlight Images"
          allowMultiple={false}
        />
      </div>

      {loading && !images.length ? (
        <div className="text-center py-12 text-muted-foreground animate-pulse text-xs tracking-widest">
          Syncing highlight cluster...
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-border/20 rounded-[3rem] bg-sage/[0.02] flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-muted-foreground/20 shadow-sm">
            <ImageIcon size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-heading uppercase tracking-widest">Cluster Empty</p>
            <p className="text-[10px] text-muted-foreground">Select assets from Media Hub to populate.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 py-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white border border-border/10 rounded-[1.5rem] overflow-hidden transition-all hover:bg-sage/[0.02] group"
            >
              <div className="flex gap-4 p-4 pr-5">
                {/* Image Section */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || "Asset"}
                    className="w-full h-full object-cover rounded-2xl border border-sage/5 shadow-sm"
                  />
                  {image.is_cover && (
                    <div className="absolute -top-2 -left-2 bg-amber-500 text-white p-1.5 rounded-full shadow-lg z-10">
                      <Star size={10} fill="currentColor" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <h4 className="text-[13px] font-bold text-heading truncate uppercase tracking-tight">
                      {image.alt_text || "Untitled Asset"}
                    </h4>
                    {image.caption ? (
                      <p className="text-[11px] text-muted-foreground line-clamp-1 italic leading-relaxed">
                        {image.caption}
                      </p>
                    ) : (
                      <p className="text-[9px] text-muted-foreground/30 uppercase tracking-[0.2em]">Pending Metadata</p>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <Button 
                      onClick={() => startEdit(image)} 
                      variant="ghost" 
                      size="sm"
                      className={`h-8 px-3 rounded-lg flex items-center gap-2 transition-all ${editingId === image.id ? 'bg-sage text-white shadow-md shadow-sage/20' : 'text-muted-foreground hover:text-sage hover:bg-sage/10'}`}
                    >
                      <Edit3 size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Edit</span>
                    </Button>
                    
                    {!image.is_cover && (
                      <Button 
                        onClick={() => handleSetCover(image.id)} 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-3 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-50 transition-all font-bold"
                      >
                        <Star size={12} />
                        <span className="text-[9px] uppercase tracking-widest">Cover</span>
                      </Button>
                    )}

                    <Button 
                      onClick={() => handleDelete(image.id)} 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-3 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all font-bold"
                    >
                      <Trash2 size={12} />
                      <span className="text-[9px] uppercase tracking-widest">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              {editingId === image.id && (
                <div className="px-6 pb-8 pt-4 space-y-6 animate-in slide-in-from-top-1 duration-300">
                  <div className="h-px bg-gradient-to-r from-sage/10 via-transparent to-transparent mb-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-sage ml-1">Alt Text</label>
                      <Input
                        value={editData.alt_text}
                        onChange={(e) => setEditData({ ...editData, alt_text: e.target.value })}
                        className="h-11 bg-white border-sage/20 rounded-xl text-xs focus:border-sage focus:ring-1 focus:ring-sage/10 shadow-sm transition-all"
                        placeholder="Identity..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-sage ml-1">Caption</label>
                      <Input
                        value={editData.caption}
                        onChange={(e) => setEditData({ ...editData, caption: e.target.value })}
                        className="h-11 bg-white border-sage/20 rounded-xl text-xs focus:border-sage focus:ring-1 focus:ring-sage/10 shadow-sm transition-all"
                        placeholder="Context..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => handleUpdateMetadata(image.id)} className="bg-sage text-white rounded-xl px-8 h-10 text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-sage/20">
                      Save Changes
                    </Button>
                    <Button onClick={() => setEditingId(null)} variant="outline" className="rounded-xl px-8 h-10 text-[11px] font-bold uppercase tracking-widest border-sage/10">
                      Cancel
                    </Button>
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
