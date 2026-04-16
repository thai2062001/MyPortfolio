import { AdminField, AdminFormSection } from "../shared/AdminFormSection";
import { AdminStatusToggle } from "../shared/AdminStatusToggle";
import { MediaInput } from "../media/MediaInput";
import { Globe2, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";


interface TestimonialFormProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  isTranslating: boolean;
  onAutoTranslate: () => void;
}

export const TestimonialForm = ({
  formData,
  setFormData,
  activeSection,
  isTranslating,
  onAutoTranslate,
}: TestimonialFormProps) => {
  return (
    <div className="space-y-10 text-left">
      {activeSection === "persona" && (
        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminFormSection title="Testimonial Details">
            <AdminField label="Full Name">
              <input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Sarah Mitchell"
                className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-xl font-serif font-bold shadow-sm"
              />
            </AdminField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminField label="Role">
                <input
                  value={formData.role_en || ""}
                  onChange={(e) => setFormData({ ...formData, role_en: e.target.value })}
                  placeholder="Lead Innovation Architect"
                  className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm"
                />
              </AdminField>
              <AdminField label="Order">
                <input
                  type="number"
                  value={formData.order_index ?? 0}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm"
                />
              </AdminField>
            </div>
          </AdminFormSection>
        </div>
      )}

      {activeSection === "narrative" && (
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminFormSection title="Kind Words Manifest">
            <AdminField label="Quote (EN)">
              <textarea
                value={formData.quote_en || ""}
                onChange={(e) => setFormData({ ...formData, quote_en: e.target.value })}
                placeholder="Testimonial narration focusing on architectural excellence and impact..."
                rows={10}
                className="w-full p-8 bg-muted/20 border-none rounded-[2.5rem] text-sm leading-relaxed shadow-sm font-serif italic font-bold resize-none"
              />
            </AdminField>
          </AdminFormSection>
        </div>
      )}

      {activeSection === "localization" && (
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-sage/5 p-8 rounded-[2.5rem] border border-sage/10 gap-6">
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sage shadow-xl">
                <Globe2 size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sage uppercase tracking-[0.2em]">Pacific linguistic protocol</h4>
              </div>
            </div>
            <Button
              onClick={onAutoTranslate}
              disabled={isTranslating}
              className="w-full sm:w-auto h-14 px-10 bg-sage text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
            >
              {isTranslating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              {isTranslating ? "SYNCING..." : "MAGIC AUTO-SYNC"}
            </Button>
          </div>
          <AdminFormSection title="Regional Manifests">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminField label="Role Designation (JP)">
                <input
                  value={formData.role_ja || ""}
                  onChange={(e) => setFormData({ ...formData, role_ja: e.target.value })}
                  placeholder="役職を入力..."
                  className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm"
                />
              </AdminField>
              <AdminField label="Role Designation (VI)">
                <input
                  value={formData.role_vi || ""}
                  onChange={(e) => setFormData({ ...formData, role_vi: e.target.value })}
                  placeholder="Chức vụ..."
                  className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm"
                />
              </AdminField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <AdminField label="Refined Quote (JP)">
                <textarea
                  value={formData.quote_ja || ""}
                  onChange={(e) => setFormData({ ...formData, quote_ja: e.target.value })}
                  placeholder="日本語の感想..."
                  rows={8}
                  className="w-full p-8 bg-muted/20 border-none rounded-[2.5rem] text-sm font-serif italic font-bold leading-relaxed resize-none"
                />
              </AdminField>
              <AdminField label="Refined Quote (VI)">
                <textarea
                  value={formData.quote_vi || ""}
                  onChange={(e) => setFormData({ ...formData, quote_vi: e.target.value })}
                  placeholder="Cảm nhận tiếng Việt..."
                  rows={8}
                  className="w-full p-8 bg-muted/20 border-none rounded-[2.5rem] text-sm font-serif italic font-bold leading-relaxed resize-none"
                />
              </AdminField>
            </div>
          </AdminFormSection>
        </div>
      )}

      {activeSection === "media" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminFormSection title="Identity Portrait">
            <MediaInput
              label="Persona Visual"
              value={formData.portrait_url || ""}
              onChange={(url) => setFormData({ ...formData, portrait_url: url })}
            />
          </AdminFormSection>
          <AdminFormSection title="Video Protocol">
            <MediaInput
              label="Video Validation"
              value={formData.video_url || ""}
              onChange={(url) => setFormData({ ...formData, video_url: url })}
              allowedTypes={["video"]}
              description="Integrated synchronization for global CDN assets."
            />
          </AdminFormSection>
        </div>
      )}

      {activeSection === "status" && (
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminStatusToggle
            label="Public Validation"
            isPublished={formData.is_published ?? true}
            onToggle={(val) => setFormData({ ...formData, is_published: val })}
            description={{
              active: "Persona is visible in the global Kind Words matrix.",
              inactive: "Persona archived in the private validation vault.",
            }}
          />
        </div>
      )}
    </div>
  );
};
