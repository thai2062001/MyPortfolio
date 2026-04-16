import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Save } from "lucide-react";

interface Font {
  id: string;
  name: string;
  font_family: string;
  font_type: string;
  import_url: string;
  import_css: string;
  fallback: string;
  is_active: boolean;
}

interface FontDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFont: Partial<Font> | null;
  setEditingFont: (font: Partial<Font> | null) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const FontDialog = ({
  open,
  onOpenChange,
  editingFont,
  setEditingFont,
  onSave,
  isSaving,
}: FontDialogProps) => {
  if (!editingFont) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white rounded-[2.5rem] shadow-2xl border-none">
        <div className="p-10 space-y-8 text-left">
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold text-heading">
              Font Architecture
            </h3>
            <p className="text-xs text-muted-foreground">
              Integrating a new typography protocol from the Google grid.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">
                Google Font CSS URL
              </label>
              <Input
                value={editingFont.import_url || ""}
                onChange={(e) =>
                  setEditingFont({ ...editingFont, import_url: e.target.value })
                }
                placeholder="https://fonts.googleapis.com/css2?family=Playfair+Display..."
                className="h-14 px-6 bg-muted/20 border-none rounded-xl text-xs font-mono"
              />
              <p className="text-[9px] text-muted-foreground ml-2 italic">
                * System will attempt to auto-parse font family and name from
                URL.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">
                  Display Name
                </label>
                <Input
                  value={editingFont.name || ""}
                  onChange={(e) =>
                    setEditingFont({ ...editingFont, name: e.target.value })
                  }
                  placeholder="Playfair Display"
                  className="h-12 px-6 bg-muted/10 border-none rounded-xl text-xs font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">
                  CSS Family
                </label>
                <Input
                  value={editingFont.font_family || ""}
                  onChange={(e) =>
                    setEditingFont({
                      ...editingFont,
                      font_family: e.target.value,
                    })
                  }
                  placeholder="'Playfair Display', serif"
                  className="h-12 px-6 bg-muted/10 border-none rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 bg-sage/5 flex items-center justify-end gap-4 border-t border-sage/10">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="px-8 h-12 text-muted-foreground hover:bg-black/5 font-bold rounded-xl text-xs"
          >
            Abort
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="bg-sage hover:bg-sage/90 text-white rounded-xl px-10 h-12 shadow-lg shadow-sage/20 font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {isSaving ? <LoadingSpinner /> : <Save size={16} />}
            <span className="uppercase tracking-widest text-[10px]">
              {isSaving ? "SYNCING..." : "Architect Font"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
