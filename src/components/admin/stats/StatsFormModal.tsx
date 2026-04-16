"use client";

import { useEffect, useState, useRef } from "react";
import { SiteStat } from "@/types/admin";
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
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Save, X, Globe2, Wand2, Plus, Settings2, Languages } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { translateFields } from "@/lib/translate";
import { useLang } from "@/contexts/LangContext";
import { toast } from "sonner";
import { MediaInput } from "@/components/admin/media/MediaInput";

interface StatsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  editingStat: SiteStat | null;
  nextOrderIndex: number;
}

export const StatsFormModal = ({
  isOpen,
  onClose,
  onSave,
  editingStat,
  nextOrderIndex,
}: StatsFormModalProps) => {
  const { lang, translations } = useLang();
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const uploadRef = useRef<{ reset: () => void }>(null);

  const [formData, setFormData] = useState({
    stat_key: "",
    value_text: "",
    label_en: "",
    label_ja: "",
    description_en: "",
    description_ja: "",
    icon_url: "",
    order_index: 0,
    is_published: true,
  });

  useEffect(() => {
    if (editingStat) {
      setFormData({
        stat_key: editingStat.stat_key || "",
        value_text: editingStat.value_text,
        label_en: editingStat.label_en,
        label_ja: editingStat.label_ja || "",
        description_en: editingStat.description_en || "",
        description_ja: editingStat.description_ja || "",
        icon_url: editingStat.icon_url || "",
        order_index: editingStat.order_index,
        is_published: editingStat.is_published,
      });
    } else {
      setFormData({
        stat_key: "",
        value_text: "",
        label_en: "",
        label_ja: "",
        description_en: "",
        description_ja: "",
        icon_url: "",
        order_index: nextOrderIndex,
        is_published: true,
      });
    }
  }, [editingStat, nextOrderIndex, isOpen]);

  const handleSave = async () => {
    if (!formData.value_text || !formData.label_en) {
      toast.error("Value and English Label are required");
      return;
    }

    try {
      setSaving(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving stat:", error);
      toast.error("Failed to save stat");
    } finally {
      setSaving(false);
    }
  };

  const handleAutoTranslate = async () => {
    try {
      setIsTranslating(true);
      const sourceFields = {
        label: formData.label_en,
        description: formData.description_en,
      };

      if (!sourceFields.label) {
        toast.error("English label is required for translation");
        return;
      }

      const translated = await translateFields(sourceFields as any, "ja");
      setFormData({
        ...formData,
        label_ja: translated.label || formData.label_ja,
        description_ja: translated.description || formData.description_ja,
      });
      toast.success("Stat details translated successfully");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate fields");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl p-0 overflow-hidden bg-white/95 backdrop-blur-3xl border-none rounded-none md:rounded-[3rem] shadow-2xl flex flex-col gap-0 [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Stat Architect</DialogTitle>
          <DialogDescription>
            Configure the statistical narrative node.
          </DialogDescription>
        </DialogHeader>

        {/* MOBILE CLOSE BUTTON */}
        <div className="absolute right-6 top-6 z-50 md:hidden">
            <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-heading active:scale-90 transition-transform"
            >
                <X size={20} />
            </button>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-black/5 bg-sage/[0.02]">
             <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-2xl md:text-3xl font-serif font-bold text-heading">
                     {editingStat ? "Refine Stat" : "New Stat Node"}
                   </h2>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2">
                     Metric Protocol Layer
                   </p>
                </div>
                <button 
                    onClick={onClose}
                    className="hidden md:flex w-12 h-12 rounded-full hover:bg-black/5 items-center justify-center transition-all text-muted-foreground hover:text-heading"
                >
                    <X size={24} />
                </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar pb-32 md:pb-12">
            <Tabs defaultValue="config" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-12 h-14 bg-slate-100/50 p-2 rounded-2xl border border-black/5">
                <TabsTrigger value="config" className="rounded-xl text-xs font-bold gap-2 data-[state=active]:bg-white data-[state=active]:text-sage data-[state=active]:shadow-sm">
                  <Settings2 size={14} />
                  Metric Config
                </TabsTrigger>
                <TabsTrigger value="content" className="rounded-xl text-xs font-bold gap-2 data-[state=active]:bg-white data-[state=active]:text-sage data-[state=active]:shadow-sm">
                  <Languages size={14} />
                  Linguistic Data
                </TabsTrigger>
              </TabsList>

              <TabsContent value="config" className="space-y-10 focus-visible:ring-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                      Stat Key (Internal ID)
                    </label>
                    <Input
                      value={formData.stat_key}
                      onChange={(e) => setFormData({ ...formData, stat_key: e.target.value })}
                      placeholder="e.g., ad_impressions"
                      className="h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                      Spatial Index (Order)
                    </label>
                    <Input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                      className="h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                    Value Text (Live Metric)
                  </label>
                  <Input
                    value={formData.value_text}
                    onChange={(e) => setFormData({ ...formData, value_text: e.target.value })}
                    placeholder="e.g., 3m+, 27+, 98%, 50k+"
                    className="h-18 px-8 bg-sage/[0.03] border-2 border-sage/10 rounded-[1.5rem] text-2xl font-serif font-bold text-sage focus:border-sage/30 transition-all shadow-sm"
                  />
                </div>

                <div className="pt-8 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                   {/* ICON UPLOAD */}
                   <div className="space-y-4">
                      <MediaInput 
                        label="Visual Token (Icon)"
                        value={formData.icon_url || ""}
                        onChange={(url) => setFormData({ ...formData, icon_url: url })}
                        allowedTypes={['icon', 'svg']}
                        description="Metric Icon Asset for visual identity."
                      />
                   </div>

                   {/* PUBLISH STATUS */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                        Sync Status
                      </label>
                      <div
                        className={`flex items-center gap-4 p-5 rounded-[1.5rem] border transition-all cursor-pointer ${formData.is_published ? "bg-sage/5 border-sage/20 shadow-sm" : "bg-muted/30 border-border/40"}`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            is_published: !formData.is_published,
                          })
                        }
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.is_published ? "bg-sage text-white shadow-md shadow-sage/30" : "bg-muted-foreground/20 text-muted-foreground"}`}
                        >
                          {formData.is_published ? <Globe2 size={16} /> : <X size={16} />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[11px] font-bold text-heading uppercase tracking-wide">
                            {formData.is_published ? "Active Hub" : "Archived"}
                          </h4>
                        </div>
                      </div>
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-10 focus-visible:ring-0">
                <div className="space-y-8">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-heading flex items-center gap-2">
                         <Plus size={14} className="text-sage" />
                         Linguistic Data
                      </h3>
                      <Button
                        onClick={handleAutoTranslate}
                        disabled={isTranslating}
                        variant="ghost"
                        className="h-8 px-3 rounded-lg flex items-center gap-2 text-[10px] font-bold text-sage hover:bg-sage/5"
                      >
                        {isTranslating ? <LoadingSpinner /> : <Wand2 size={12} />}
                        Magic Sync (JA)
                      </Button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                            Label (EN)
                          </label>
                          <Input
                            value={formData.label_en}
                            onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                            placeholder="Ad impressions managed"
                            className="h-12 px-6 bg-muted/20 border-none rounded-xl text-xs font-bold shadow-sm"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                            Description (EN)
                          </label>
                          <Textarea
                            value={formData.description_en}
                            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                            className="p-6 bg-muted/10 border-none rounded-2xl text-xs resize-none h-32 font-serif italic"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                            Label (JA)
                          </label>
                          <Input
                            value={formData.label_ja}
                            onChange={(e) => setFormData({ ...formData, label_ja: e.target.value })}
                            className="h-12 px-6 bg-muted/20 border-none rounded-xl text-xs font-bold shadow-sm"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                            Description (JA)
                          </label>
                          <Textarea
                            value={formData.description_ja}
                            onChange={(e) => setFormData({ ...formData, description_ja: e.target.value })}
                            className="p-6 bg-muted/10 border-none rounded-2xl text-xs resize-none h-32 font-serif italic"
                          />
                        </div>
                      </div>
                   </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="p-8 md:p-12 bg-sage/[0.02] border-t border-black/5 absolute bottom-0 left-0 right-0 md:relative md:bg-sage/[0.02]">
            <div className="flex w-full items-center justify-end gap-4">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="h-14 px-8 text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-black/5"
                >
                    Discard Changes
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-14 md:h-16 px-12 bg-sage hover:bg-sage/90 text-white rounded-[1.5rem] shadow-xl shadow-sage/20 font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                    {saving ? <LoadingSpinner /> : <Save size={18} />}
                    <span className="uppercase tracking-[0.15em] text-xs">
                        {saving ? "Deploying..." : (editingStat ? "Update Node" : "Initialize Node")}
                    </span>
                </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
