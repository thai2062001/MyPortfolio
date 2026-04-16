import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Star, Loader2, GripHorizontal, Layout, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { supabase } from "@/lib/supabase";
import { getImageUrlWithFallback } from "@/lib/utils";
import type { AboutImage } from "@/types/admin";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface AboutImageGalleryProps {
  aboutId: string;
  onImagesChange?: (images: AboutImage[]) => void;
}

const SortableImageCard = ({ 
  image, 
  onDelete, 
  onSetCover, 
  onEdit,
  isEditing,
  editData,
  onEditDataChange,
  onSaveEdit,
  onCancelEdit
}: { 
  image: AboutImage; 
  onDelete: (id: string) => void; 
  onSetCover: (id: string) => void;
  onEdit: (image: AboutImage) => void;
  isEditing: boolean;
  editData: { alt_text: string; caption: string };
  onEditDataChange: (data: { alt_text: string; caption: string }) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`relative group bg-white rounded-2xl overflow-hidden border transition-all duration-300 ${
        image.is_cover ? "border-sage ring-2 ring-sage/20 scale-[1.02] z-10" : "border-border/40"
      } ${isDragging ? "shadow-2xl" : "hover:shadow-xl"}`}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={getImageUrlWithFallback(image.image_url)}
          alt={image.alt_text || "Gallery image"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Drag Handle Overlay */}
        <div 
          {...attributes} 
          {...listeners}
          className="absolute inset-0 cursor-grab active:cursor-grabbing z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity"
        >
          <GripHorizontal className="text-white drop-shadow-lg" size={32} />
        </div>

        {/* Labels & Controls */}
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 pointer-events-none">
          {image.is_cover && (
            <div className="px-3 py-1 bg-sage text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <Star size={10} fill="currentColor" /> MAIN COVER
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0 pointer-events-auto">
          {!image.is_cover && (
            <button 
              onClick={() => onSetCover(image.id)} 
              className="w-8 h-8 bg-white/90 hover:bg-sage hover:text-white rounded-xl shadow-lg flex items-center justify-center transition-all text-sage"
              title="Set as Main Cover"
            >
              <Star size={14} />
            </button>
          )}
          <button 
            onClick={() => onEdit(image)} 
            className="w-8 h-8 bg-white/90 hover:bg-heading hover:text-white rounded-xl shadow-lg flex items-center justify-center transition-all text-heading"
          >
            <Layout size={14} />
          </button>
          <button 
            onClick={() => onDelete(image.id)} 
            className="w-8 h-8 bg-white/90 hover:bg-red-500 hover:text-white rounded-xl shadow-lg flex items-center justify-center transition-all text-red-500"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {isEditing ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Input
              value={editData.alt_text}
              onChange={(e) => onEditDataChange({...editData, alt_text: e.target.value})}
              placeholder="Alt text (SEO)"
              className="text-xs h-9 bg-muted/20 border-none rounded-xl"
            />
            <Textarea
              value={editData.caption}
              onChange={(e) => onEditDataChange({...editData, caption: e.target.value})}
              placeholder="Caption (Story details)"
              className="text-xs min-h-[60px] bg-muted/20 border-none rounded-xl resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={() => onSaveEdit(image.id)} size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest bg-sage flex-1 rounded-xl">Save</Button>
              <Button onClick={onCancelEdit} size="sm" variant="ghost" className="h-8 text-[10px] uppercase font-bold tracking-widest flex-1 rounded-xl">Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Index: {image.order_index}
               </span>
            </div>
            {image.alt_text && <p className="text-xs font-bold text-heading line-clamp-1">{image.alt_text}</p>}
            {image.caption && <p className="text-[10px] text-muted-foreground line-clamp-2 italic font-serif leading-relaxed">{image.caption}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export const AboutImageGallery = ({ aboutId, onImagesChange }: AboutImageGalleryProps) => {
  const [images, setImages] = useState<AboutImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ alt_text: "", caption: "" });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (aboutId) {
      fetchImages();
    }
  }, [aboutId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("about_images")
        .select("*")
        .eq("about_id", aboutId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load narrative visuals");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (url: string) => {
    try {
      setUploading(true);
      // ⭐ Auto-set first image as cover if none exists
      const shouldBeCover = images.length === 0;

      const { data: insertedData, error: insertError } = await supabase
        .from("about_images")
        .insert([{
          about_id: aboutId,
          image_url: url,
          alt_text: "",
          caption: "",
          is_cover: shouldBeCover,
          order_index: images.length,
        }])
        .select();

      if (insertError) throw insertError;
      if (insertedData) {
        setImages((prev) => [...prev, insertedData[0]]);
        toast.success("Visual node synthesized successfully");
        onImagesChange?.([...images, insertedData[0]]);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to integrate visual node");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Legacy support for direct upload if needed through MediaPickerModal's upload button
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("about_images").delete().eq("id", id);
      if (error) throw error;

      const updated = images.filter((img) => img.id !== id);
      
      // If deleted was cover, auto-set first of remaining as cover
      const deletedWasCover = images.find(img => img.id === id)?.is_cover;
      if (deletedWasCover && updated.length > 0) {
        await supabase.from("about_images").update({ is_cover: true }).eq("id", updated[0].id);
        updated[0].is_cover = true;
      }

      setImages(updated);
      onImagesChange?.(updated);
      toast.success("Visual node purged");
    } catch (error) {
      toast.error("Failed to purge visual node");
    }
  };

  const handleSetCover = async (id: string) => {
    try {
      // Clear all covers for this section
      await supabase.from("about_images").update({ is_cover: false }).eq("about_id", aboutId);
      // Set new cover
      await supabase.from("about_images").update({ is_cover: true }).eq("id", id);

      const updated = images.map((img) => ({
        ...img,
        is_cover: img.id === id,
      }));
      setImages(updated);
      onImagesChange?.(updated);
      toast.success("Main narrative cover updated");
    } catch (error) {
      toast.error("Failed to update cover");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over?.id);
      const newImages = arrayMove(images, oldIndex, newIndex);
      
      setImages(newImages);
      
      // Persist order
      try {
        const updates = newImages.map((img, index) => ({
          id: img.id,
          order_index: index,
        }));
        
        for (const update of updates) {
          await supabase.from("about_images").update({ order_index: update.order_index }).eq("id", update.id);
        }
        onImagesChange?.(newImages);
      } catch (error) {
        toast.error("Order sync failure");
      }
    }
  };

  const handleUpdateMetadata = async (id: string) => {
    try {
      const { error } = await supabase
        .from("about_images")
        .update({
          alt_text: editData.alt_text,
          caption: editData.caption,
        })
        .eq("id", id);

      if (error) throw error;

      const updated = images.map((img) =>
        img.id === id ? { ...img, alt_text: editData.alt_text, caption: editData.caption } : img
      );
      setImages(updated);
      onImagesChange?.(updated);
      setEditingId(null);
      toast.success("Visual metadata refined");
    } catch (error) {
      toast.error("Metadata sync failure");
    }
  };

  const startEdit = (image: AboutImage) => {
    setEditingId(image.id);
    setEditData({ alt_text: image.alt_text || "", caption: image.caption || "" });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-sage/[0.03] p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-sage/10 relative overflow-hidden group shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-2">
            <h4 className="text-xl md:text-2xl font-serif font-bold text-heading flex items-center gap-3">
              <Upload size={20} className="text-sage" />
              Visual Synthesis
            </h4>
            <p className="text-[10px] md:text-xs text-muted-foreground font-serif italic max-w-md">
              Integrate high-fidelity visual assets into the Content. Supports multiple uploads with auto-WebP optimization.
            </p>
          </div>
          <Button
            onClick={() => setIsPickerOpen(true)}
            disabled={uploading}
            className="flex items-center justify-center gap-4 px-10 py-8 bg-white border-2 border-dashed border-sage/20 rounded-2xl cursor-pointer hover:border-sage/50 hover:bg-sage/5 transition-all active:scale-95 group/label text-heading hover:text-sage"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-sage" size={24} />
            ) : (
              <Plus
                className="text-sage group-hover/label:rotate-90 transition-transform duration-500"
                size={24}
              />
            )}
            <span className="text-sm font-bold uppercase tracking-widest leading-none">
              {uploading ? "Synthesizing..." : "Inject Assets"}
            </span>
          </Button>

          <MediaPickerModal
            open={isPickerOpen}
            onOpenChange={setIsPickerOpen}
            onSelect={handleImageSelect}
            title="Narrative Assets"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-sage/30" size={40} />
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground animate-pulse">Syncing Visual nodes...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="py-32 text-center bg-muted/20 rounded-[3rem] border border-dashed border-border/40">
           <ImageIcon className="mx-auto text-muted-foreground/30 mb-4" size={48} />
           <p className="text-sm font-serif italic text-muted-foreground">The Content is currently devoid of visual assets.</p>
        </div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={images.map(img => img.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {images.map((image) => (
                <SortableImageCard 
                  key={image.id} 
                  image={image} 
                  onDelete={handleDelete}
                  onSetCover={handleSetCover}
                  onEdit={startEdit}
                  isEditing={editingId === image.id}
                  editData={editData}
                  onEditDataChange={setEditData}
                  onSaveEdit={handleUpdateMetadata}
                  onCancelEdit={() => setEditingId(null)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
