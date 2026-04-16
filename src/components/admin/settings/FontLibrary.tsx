import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Database } from "lucide-react";
import { Font } from "@/types/admin";
import { toast } from "sonner";

interface FontLibraryProps {
  fonts: Font[];
  headingFontId: string | null;
  bodyFontId: string | null;
  onOpenFontDialog: (font?: Font) => void;
  onDeleteFont: (font: Font) => void;
  onApplyHeading: (id: string) => void;
  onApplyBody: (id: string) => void;
}

export const FontLibrary = ({
  fonts,
  headingFontId,
  bodyFontId,
  onOpenFontDialog,
  onDeleteFont,
  onApplyHeading,
  onApplyBody,
}: FontLibraryProps) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h4 className="text-xl font-serif font-bold text-heading">
            Typography Library
          </h4>
          <p className="text-xs text-muted-foreground italic">
            Managing custom font assets for the site architecture.
          </p>
        </div>
        <Button
          onClick={() => onOpenFontDialog()}
          className="bg-sage/10 hover:bg-sage/20 text-sage h-12 px-6 rounded-xl flex items-center gap-2 font-bold"
        >
          <Plus size={18} />
          Integrate Font
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fonts.map((font) => (
          <div
            key={font.id}
            className="bg-white border border-border/40 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group flex flex-col h-full text-left"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h5
                    className="font-bold text-heading whitespace-nowrap"
                    style={{ fontFamily: font.font_family }}
                  >
                    {font.name}
                  </h5>
                  {(headingFontId === font.id || bodyFontId === font.id) && (
                    <div className="flex gap-1">
                      {headingFontId === font.id && (
                        <span className="bg-heading text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          Heading
                        </span>
                      )}
                      {bodyFontId === font.id && (
                        <span className="bg-sage text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          Body
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {font.font_family}
                </p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => onOpenFontDialog(font)}
                  className="p-2 text-muted-foreground hover:text-sage hover:bg-sage/5 rounded-lg transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDeleteFont(font)}
                  className="p-2 text-muted-foreground hover:text-red-50 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${font.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}
              >
                {font.is_active ? "Active" : "Standby"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">
                {font.font_type || "Sans"}
              </span>
            </div>

            <div className="mt-auto pt-6 border-t border-border/10 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApplyHeading(font.id)}
                className={`flex-1 h-9 px-3 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${headingFontId === font.id ? "border-heading bg-heading/5 text-heading" : "hover:border-heading hover:text-heading"}`}
              >
                Apply to Heading
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApplyBody(font.id)}
                className={`flex-1 h-9 px-3 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${bodyFontId === font.id ? "border-sage bg-sage/5 text-sage" : "hover:border-sage hover:text-sage"}`}
              >
                Apply to Body
              </Button>
            </div>
          </div>
        ))}
        {fonts.length === 0 && (
          <div className="col-span-full py-24 border-2 border-dashed border-border/50 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
            <Database size={48} className="text-muted-foreground/20" />
            <p className="font-serif italic text-muted-foreground">No font assets integrated into the library yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
