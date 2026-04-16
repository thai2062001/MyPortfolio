import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ImageIcon,
  Plus,
  Trash2,
  Check,
  RectangleHorizontal,
  RectangleVertical,
  Type,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelinePhaseImage {
  id: string;
  phase_id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  image_orientation: 'landscape' | 'portrait';
  is_cover: boolean;
  order_index: number;
}

interface TimelinePhaseGalleryProps {
  images: TimelinePhaseImage[];
  onAddImages: () => void;
  onUpdateImage: (id: string, updates: Partial<TimelinePhaseImage>) => void;
  onDeleteImage: (id: string) => void;
  onSetAsCover: (id: string) => void;
}

export const TimelinePhaseGallery = ({
  images,
  onAddImages,
  onUpdateImage,
  onDeleteImage,
  onSetAsCover,
}: TimelinePhaseGalleryProps) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-sage/5 p-8 rounded-[2.5rem] border border-sage/10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sage shadow-xl">
            <ImageIcon size={28} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-sage uppercase tracking-widest">Visual Assets Cluster</h4>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">
              {images.length} / 12 Protocol Nodes Active
            </p>
          </div>
        </div>
        <Button
          onClick={onAddImages}
          className="h-14 px-10 bg-sage text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-sage/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} />
          Integrate Assets
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {images.map((img) => (
          <div
            key={img.id}
            className={cn(
              "group relative bg-white/50 backdrop-blur-xl border border-white/40 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col",
              img.is_cover && "ring-2 ring-sage ring-offset-4 ring-offset-white/50"
            )}
          >
            <div className="aspect-video relative overflow-hidden group/img shrink-0">
              <img
                src={img.image_url}
                alt=""
                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <Button
                  onClick={() => onSetAsCover(img.id)}
                  disabled={img.is_cover}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    img.is_cover ? "bg-sage text-white" : "bg-white text-heading hover:bg-sage hover:text-white"
                  )}
                >
                  <Check size={20} />
                </Button>
                <Button
                  onClick={() => onDeleteImage(img.id)}
                  className="w-12 h-12 bg-white text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={20} />
                </Button>
              </div>
              {img.is_cover && (
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-sage text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md">
                  Timeline Cover
                </div>
              )}
            </div>

            <div className="flex-1 p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-border/10 pb-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Protocol orientation</span>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => onUpdateImage(img.id, { image_orientation: 'landscape' })}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-xl transition-all",
                      img.image_orientation === 'landscape' ? "bg-sage text-white shadow-lg" : "bg-muted/20 text-muted-foreground hover:bg-sage/10"
                    )}
                  >
                    <RectangleHorizontal size={18} />
                  </button>
                  <button
                    onClick={() => onUpdateImage(img.id, { image_orientation: 'portrait' })}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-xl transition-all",
                      img.image_orientation === 'portrait' ? "bg-sage text-white shadow-lg" : "bg-muted/20 text-muted-foreground hover:bg-sage/10"
                    )}
                  >
                    <RectangleVertical size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative group/field">
                  <Type className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/field:text-sage transition-colors" size={16} />
                  <Input
                    value={img.alt_text || ""}
                    onChange={(e) => onUpdateImage(img.id, { alt_text: e.target.value })}
                    placeholder="System Alt-text..."
                    className="h-12 pl-14 pr-6 bg-muted/20 border-none rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="relative group/field">
                  <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/field:text-sage transition-colors" size={16} />
                  <Input
                    value={img.caption || ""}
                    onChange={(e) => onUpdateImage(img.id, { caption: e.target.value })}
                    placeholder="Historical Caption..."
                    className="h-12 pl-14 pr-6 bg-muted/20 border-none rounded-xl text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="py-24 border-2 border-dashed border-border/50 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
          <ImageIcon size={48} className="text-muted-foreground/20" />
          <p className="font-serif italic text-muted-foreground">No visual assets integrated into this phase protocol yet.</p>
          <Button
            variant="ghost"
            onClick={onAddImages}
            className="text-sage font-bold uppercase tracking-widest text-[10px]"
          >
            Deploy initial nodes
          </Button>
        </div>
      )}
    </div>
  );
};
