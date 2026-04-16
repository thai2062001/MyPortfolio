import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Tag,
  Globe2,
  Wand2,
  ShieldCheck,
  EyeOff,
  Building2,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface TimelinePhaseFormProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  isTranslating?: boolean;
  onAutoTranslate?: () => void;
}

export const TimelinePhaseForm = ({
  formData,
  setFormData,
  activeSection,
  isTranslating = false,
  onAutoTranslate,
}: TimelinePhaseFormProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {activeSection === "general" && (
        <div className="space-y-10 max-w-2xl text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                Period
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                  size={18}
                />
                <Input
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      period: e.target.value,
                    })
                  }
                  placeholder="2020 — Present"
                  className="h-16 pl-14 pr-6 bg-muted/20 border-none rounded-2xl text-base font-serif font-bold shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                Location
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                  size={18}
                />
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: e.target.value,
                    })
                  }
                  placeholder="Tokyo, Japan"
                  className="h-16 pl-14 pr-6 bg-muted/20 border-none rounded-2xl text-base font-serif font-bold shadow-sm"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Tag / Category
            </label>
            <div className="relative">
              <Tag
                className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                size={18}
              />
              <Input
                value={formData.tag_en}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tag_en: e.target.value,
                  })
                }
                placeholder="Senior Design / Master Residency"
                className="h-16 pl-14 pr-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === "narrative" && (
        <div className="space-y-10 max-w-4xl text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-border/10 pb-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                Phase Title
              </label>
              <Input
                value={formData.title_en}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title_en: e.target.value,
                  })
                }
                placeholder="Lead Architectural Strategist"
                className="h-16 px-8 bg-muted/20 border-none rounded-2xl text-xl font-serif font-bold shadow-sm"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                Company
              </label>
              <Input
                value={formData.company_en}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company_en: e.target.value,
                  })
                }
                placeholder="Omni Dynamics Corp"
                className="h-16 px-8 bg-muted/20 border-none rounded-2xl text-lg font-serif font-bold shadow-sm"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Description
            </label>
            <Textarea
              value={formData.description_en}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description_en: e.target.value,
                })
              }
              placeholder="Summary of key achievements and responsibilities..."
              rows={8}
              className="p-10 bg-muted/20 border-none rounded-[3rem] text-sm leading-relaxed shadow-sm resize-none focus:ring-2 focus:ring-sage/20 transition-all font-serif italic text-heading/80"
            />
          </div>
        </div>
      )}

      {activeSection === "localization" && (
        <div className="space-y-10 max-w-4xl animate-in slide-in-from-right-8 duration-700 text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-sage/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-sage/10 relative overflow-hidden group shadow-sm gap-6">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-sage shadow-xl group-hover:scale-110 transition-transform duration-500">
                <Globe2 size={24} className="md:w-7 md:h-7" />
              </div>
              <h4 className="text-xs md:text-sm font-bold text-sage uppercase tracking-[0.2em]">
                Internationalization
              </h4>
            </div>
            {onAutoTranslate && (
              <Button
                onClick={onAutoTranslate}
                disabled={isTranslating}
                className="h-12 md:h-14 px-8 md:px-10 bg-sage text-white rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all relative z-10 w-full sm:w-auto"
              >
                {isTranslating ? <LoadingSpinner /> : <Wand2 size={18} className="md:w-5 md:h-5" />}
                {isTranslating ? "TRANSLATING..." : "AUTO-TRANSLATE"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                Title (Japanese)
              </label>
              <Input
                value={formData.title_ja}
                onChange={(e) =>
                  setFormData({ ...formData, title_ja: e.target.value })
                }
                placeholder="建築戦略リード"
                className="h-16 px-8 bg-muted/20 border-none rounded-2xl text-lg font-serif font-bold shadow-sm"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                Company (Japanese)
              </label>
              <Input
                value={formData.company_ja}
                onChange={(e) =>
                  setFormData({ ...formData, company_ja: e.target.value })
                }
                placeholder="株式会社オムニダイナミクス"
                className="h-16 px-8 bg-muted/20 border-none rounded-2xl text-lg font-serif font-bold shadow-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                Tag (Japanese)
              </label>
              <Input
                value={formData.tag_ja}
                onChange={(e) =>
                  setFormData({ ...formData, tag_ja: e.target.value })
                }
                placeholder="シニアデザインプロトコル"
                className="h-16 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Description (Japanese)
            </label>
            <Textarea
              value={formData.description_ja}
              onChange={(e) =>
                setFormData({ ...formData, description_ja: e.target.value })
              }
              rows={6}
              className="p-10 bg-muted/20 border-none rounded-[3rem] text-sm leading-relaxed shadow-sm font-serif italic"
            />
          </div>
        </div>
      )}

      {activeSection === "settings" && (
        <div className="space-y-12 max-w-2xl text-left">
          <div
            className={cn(
              "flex flex-col sm:flex-row items-center gap-6 md:gap-10 p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border transition-all cursor-pointer",
              formData.is_published ? "bg-sage/5 border-sage/20 shadow-2xl" : "bg-muted/30 border-border/40"
            )}
            onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
          >
            <div
              className={cn(
                "w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-[1.8rem] flex items-center justify-center transition-all shadow-xl flex-shrink-0",
                formData.is_published ? "bg-sage text-white animate-pulse" : "bg-muted-foreground/20 text-muted-foreground"
              )}
            >
              {formData.is_published ? <Globe2 size={24} className="md:w-8 md:h-8" /> : <EyeOff size={24} className="md:w-8 md:h-8" />}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h4 className="text-lg md:text-xl font-bold text-heading">Publish Timeline Phase</h4>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-2 md:mt-3 leading-relaxed">
                {formData.is_published
                  ? "This phase is visible on the public website."
                  : "This phase is hidden from the public website."}
              </p>
            </div>
            <div className="sm:ml-auto">
              <div
                className={cn(
                  "w-12 h-6 md:w-14 md:h-8 rounded-full relative transition-all duration-500",
                  formData.is_published ? "bg-sage" : "bg-muted-foreground/30"
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-4 h-4 md:w-6 md:h-6 bg-white rounded-full transition-all duration-500 shadow-md",
                    formData.is_published ? "left-7 md:left-7" : "left-1"
                  )}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
