import React from "react";
import { AdminField } from "../shared/AdminFormSection";
import { FaqSectionSettings } from "@/types/admin";
import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface FaqSectionSettingsFormProps {
  formData: Partial<FaqSectionSettings>;
  setFormData: (data: any) => void;
  activeSection: string;
  isTranslating: boolean;
  onAutoTranslate: () => void;
}

export const FaqSectionSettingsForm = ({
  formData,
  setFormData,
  activeSection,
  isTranslating,
  onAutoTranslate,
}: FaqSectionSettingsFormProps) => {
  return (
    <div className="space-y-10 text-left">
      {activeSection === "identity" && (
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminField label="Section Eyebrow (EN)">
            <input
              value={formData.eyebrow_en || ""}
              onChange={(e) =>
                setFormData({ ...formData, eyebrow_en: e.target.value })
              }
              placeholder="FAQ"
              className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
            />
          </AdminField>
          <AdminField label="Section Title (EN)">
            <input
              value={formData.title_en || ""}
              onChange={(e) =>
                setFormData({ ...formData, title_en: e.target.value })
              }
              placeholder="Got Questions?"
              className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-lg font-serif font-bold shadow-sm"
            />
          </AdminField>
          <AdminField label="Section Description (EN)">
            <textarea
              value={formData.description_en || ""}
              onChange={(e) =>
                setFormData({ ...formData, description_en: e.target.value })
              }
              placeholder="Find answers to common questions about my services and workflow."
              rows={4}
              className="w-full p-8 bg-muted/20 border-none rounded-[2rem] text-sm leading-relaxed shadow-sm resize-none"
            />
          </AdminField>
        </div>
      )}

      {activeSection === "localization" && (
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between bg-sage/5 p-6 rounded-[2rem] border border-sage/10 mb-8">
            <div className="flex items-center gap-4">
              <Globe2 className="text-sage" size={24} />
              <div>
                <h4 className="text-xs font-bold text-sage uppercase tracking-widest">
                  Section linguistic protocol
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  Synchronizing section header for global impact.
                </p>
              </div>
            </div>
            <Button
              onClick={onAutoTranslate}
              disabled={isTranslating}
              className="bg-sage text-white rounded-xl px-6 h-12 font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2"
            >
              {isTranslating ? <LoadingSpinner /> : <Globe2 size={14} />}
              MAGIC SYNC
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdminField label="Section Eyebrow (JP)">
              <input
                value={formData.eyebrow_ja || ""}
                onChange={(e) =>
                  setFormData({ ...formData, eyebrow_ja: e.target.value })
                }
                placeholder="よくあるご質問"
                className="w-full h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </AdminField>
            <AdminField label="Section Eyebrow (VI)">
              <input
                value={formData.eyebrow_vi || ""}
                onChange={(e) =>
                  setFormData({ ...formData, eyebrow_vi: e.target.value })
                }
                placeholder="Hỏi đáp"
                className="w-full h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </AdminField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdminField label="Section Title (JP)">
              <input
                value={formData.title_ja || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title_ja: e.target.value })
                }
                className="w-full h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </AdminField>
            <AdminField label="Section Title (VI)">
              <input
                value={formData.title_vi || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title_vi: e.target.value })
                }
                className="w-full h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </AdminField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdminField label="Section Description (JP)">
              <textarea
                value={formData.description_ja || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description_ja: e.target.value })
                }
                rows={4}
                className="w-full p-6 bg-muted/20 border-none rounded-2xl text-sm leading-relaxed shadow-sm resize-none"
              />
            </AdminField>
            <AdminField label="Section Description (VI)">
              <textarea
                value={formData.description_vi || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description_vi: e.target.value })
                }
                rows={4}
                className="w-full p-6 bg-muted/20 border-none rounded-2xl text-sm leading-relaxed shadow-sm resize-none"
              />
            </AdminField>
          </div>
        </div>
      )}
    </div>
  );
};
