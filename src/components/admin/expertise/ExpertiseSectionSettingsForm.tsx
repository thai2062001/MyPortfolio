import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Globe2, Wand2, ShieldCheck, EyeOff } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ExpertiseSection } from "@/types/admin";
import { cn } from "@/lib/utils";

interface ExpertiseSectionSettingsFormProps {
  formData: Partial<ExpertiseSection>;
  setFormData: (data: Partial<ExpertiseSection>) => void;
  activeSection: string;
  isTranslating?: boolean;
  onAutoTranslate?: () => void;
}

export const ExpertiseSectionSettingsForm = ({
  formData,
  setFormData,
  activeSection,
  isTranslating = false,
  onAutoTranslate,
}: ExpertiseSectionSettingsFormProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      {activeSection === "branding" && (
        <div className="space-y-12 max-w-2xl text-left">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Expertise Eyebrow (Badge)
            </label>
            <Input
              value={formData.eyebrow || ""}
              onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
              placeholder="PROFICIENCIES"
              className="h-16 px-8 bg-white/70 border border-sage/20 rounded-2xl text-base font-bold shadow-sm focus:bg-white focus:border-sage transition-all"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Atmosphere Title
            </label>
            <Input
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Expertise & Tools"
              className="h-16 px-8 bg-white/70 border border-sage/20 rounded-2xl text-xl font-serif font-bold shadow-sm focus:bg-white focus:border-sage transition-all"
            />
          </div>
        </div>
      )}

      {activeSection === "strategic" && (
        <div className="space-y-12 max-w-3xl text-left">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Strategic Cluster Heading
            </label>
            <Input
              value={formData.strategic_title || ""}
              onChange={(e) => setFormData({ ...formData, strategic_title: e.target.value })}
              placeholder="Strategic Skills"
              className="h-16 px-8 bg-white/70 border border-sage/20 rounded-2xl text-xl font-serif font-bold shadow-sm focus:bg-white focus:border-sage transition-all"
            />
          </div>
          <div className="space-y-4 pt-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Strategic Narrative
            </label>
            <Textarea
              value={formData.strategic_description || ""}
              onChange={(e) => setFormData({ ...formData, strategic_description: e.target.value })}
              placeholder="Conceptual architecture and operational excellence narrative..."
              rows={6}
              className="p-8 bg-white/70 border border-sage/20 rounded-[2.5rem] text-sm leading-relaxed shadow-sm font-serif italic text-heading/80 resize-none transition-all focus:bg-white focus:border-sage font-bold"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Strategic Sub-protocol (Helper Text)
            </label>
            <Input
              value={formData.strategic_helper_text || ""}
              onChange={(e) => setFormData({ ...formData, strategic_helper_text: e.target.value })}
              placeholder="Internal methodological refinements..."
              className="h-14 px-8 bg-white/70 border border-sage/20 rounded-xl text-xs font-bold focus:bg-white focus:border-sage transition-all"
            />
          </div>
        </div>
      )}

      {activeSection === "technical" && (
        <div className="space-y-12 max-w-2xl text-left">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Technical Cluster Heading
            </label>
            <Input
              value={formData.tools_title || ""}
              onChange={(e) => setFormData({ ...formData, tools_title: e.target.value })}
              placeholder="Technical Tools"
              className="h-16 px-8 bg-white/70 border border-sage/20 rounded-2xl text-xl font-serif font-bold shadow-sm focus:bg-white focus:border-sage transition-all"
            />
          </div>
          <div className="space-y-4 pt-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Interactivity Cue (Helper Text)
            </label>
            <Input
              value={formData.tools_helper_text || ""}
              onChange={(e) => setFormData({ ...formData, tools_helper_text: e.target.value })}
              placeholder="Hover over a tool to see how it drives results ↓"
              className="h-16 px-8 bg-white/70 border border-sage/20 rounded-2xl text-xs font-bold focus:bg-white focus:border-sage transition-all"
            />
          </div>
        </div>
      )}

      {activeSection === "localization" && (
        <div className="space-y-12 max-w-4xl text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-sage/5 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-sage/10 relative overflow-hidden group shadow-sm gap-8">
            <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full sm:w-auto">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-sage shadow-xl group-hover:rotate-[360deg] transition-transform duration-1000 flex-shrink-0">
                <Globe2 size={24} className="md:w-8 md:h-8" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-bold text-sage uppercase tracking-[0.2em] mb-1">
                  Pacific linguistic protocol
                </h4>
                <p className="text-[10px] text-muted-foreground hidden md:block">
                  Synchronizing expertise for global impact.
                </p>
              </div>
            </div>
            {onAutoTranslate && (
              <Button
                onClick={onAutoTranslate}
                disabled={isTranslating}
                className="w-full sm:w-auto h-12 md:h-16 px-8 md:px-12 bg-sage text-white rounded-xl md:rounded-[1.5rem] font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-xl md:shadow-2xl shadow-sage/30 flex items-center justify-center gap-3 md:gap-4 hover:scale-105 active:scale-95 transition-all relative z-10"
              >
                {isTranslating ? <LoadingSpinner /> : <Wand2 size={18} className="md:w-5 md:h-5" />}
                {isTranslating ? "SYNC..." : "MAGIC AUTO-SYNC"}
              </Button>
            )}
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  Eyebrow (JP)
                </label>
                <Input
                  value={formData.eyebrow_ja || ""}
                  onChange={(e) => setFormData({ ...formData, eyebrow_ja: e.target.value })}
                  placeholder="プロフィシエンシー"
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-2xl text-base font-bold focus:bg-white focus:border-sage transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  Eyebrow (VI)
                </label>
                <Input
                  value={formData.eyebrow_vi || ""}
                  onChange={(e) => setFormData({ ...formData, eyebrow_vi: e.target.value })}
                  placeholder="NĂNG LỰC"
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-2xl text-base font-bold focus:bg-white focus:border-sage transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  Title (JP)
                </label>
                <Input
                  value={formData.title_ja || ""}
                  onChange={(e) => setFormData({ ...formData, title_ja: e.target.value })}
                  placeholder="専門知識とツール"
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-2xl text-base font-bold focus:bg-white focus:border-sage transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  Title (VI)
                </label>
                <Input
                  value={formData.title_vi || ""}
                  onChange={(e) => setFormData({ ...formData, title_vi: e.target.value })}
                  placeholder="Chuyên môn & Công cụ"
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-2xl text-base font-bold focus:bg-white focus:border-sage transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  Strategic Title (JP)
                </label>
                <Input
                  value={formData.strategic_title_ja || ""}
                  onChange={(e) => setFormData({ ...formData, strategic_title_ja: e.target.value })}
                  placeholder="戦略的スキル"
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl text-xs font-bold focus:bg-white focus:border-sage transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                   Strategic Title (VI)
                </label>
                <Input
                  value={formData.strategic_title_vi || ""}
                  onChange={(e) => setFormData({ ...formData, strategic_title_vi: e.target.value })}
                  placeholder="Kỹ năng chiến lược"
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl text-xs font-bold focus:bg-white focus:border-sage transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  Tools Title (JP)
                </label>
                <Input
                  value={formData.tools_title_ja || ""}
                  onChange={(e) => setFormData({ ...formData, tools_title_ja: e.target.value })}
                  placeholder="技術ツール"
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl text-xs font-bold focus:bg-white focus:border-sage transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                   Tools Title (VI)
                </label>
                <Input
                  value={formData.tools_title_vi || ""}
                  onChange={(e) => setFormData({ ...formData, tools_title_vi: e.target.value })}
                  placeholder="Công cụ kỹ thuật"
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl text-xs font-bold focus:bg-white focus:border-sage transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  Strategic Narrative (JP)
                </label>
                <Textarea
                  value={formData.strategic_description_ja || ""}
                  onChange={(e) => setFormData({ ...formData, strategic_description_ja: e.target.value })}
                  rows={4}
                  className="p-8 bg-white/70 border border-sage/20 rounded-[2.5rem] text-sm font-serif italic focus:bg-white focus:border-sage transition-all font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                   Strategic Narrative (VI)
                </label>
                <Textarea
                  value={formData.strategic_description_vi || ""}
                  onChange={(e) => setFormData({ ...formData, strategic_description_vi: e.target.value })}
                  rows={4}
                  className="p-8 bg-white/70 border border-sage/20 rounded-[2.5rem] text-sm font-serif italic focus:bg-white focus:border-sage transition-all font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  Tools Helper (JP)
                </label>
                <Input
                  value={formData.tools_helper_text_ja || ""}
                  onChange={(e) => setFormData({ ...formData, tools_helper_text_ja: e.target.value })}
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl text-xs font-bold focus:bg-white focus:border-sage transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                   Tools Helper (VI)
                </label>
                <Input
                  value={formData.tools_helper_text_vi || ""}
                  onChange={(e) => setFormData({ ...formData, tools_helper_text_vi: e.target.value })}
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl text-xs font-bold focus:bg-white focus:border-sage transition-all"
                />
              </div>
            </div>
        </div>
      )}

      {activeSection === "status" && (
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
              <h4 className="text-lg md:text-xl font-bold text-heading">Public Atmosphere Deployment</h4>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-2 md:mt-3 leading-relaxed">
                {formData.is_published
                  ? "The Proficiencies section is fully integrated into the global live matrix."
                  : "Current atmosphere is archived in shadow mode."}
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
