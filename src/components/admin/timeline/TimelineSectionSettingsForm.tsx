import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Globe2, Wand2, ShieldCheck, EyeOff } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TimelineSectionSettings } from "@/types/admin";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

interface TimelineSectionSettingsFormProps {
  formData: Partial<TimelineSectionSettings>;
  setFormData: (data: Partial<TimelineSectionSettings>) => void;
  activeSection: string;
  isTranslating?: boolean;
  onAutoTranslate?: () => void;
}

export const TimelineSectionSettingsForm = ({
  formData,
  setFormData,
  activeSection,
  isTranslating = false,
  onAutoTranslate,
}: TimelineSectionSettingsFormProps) => {
  const { t } = useLang();
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {activeSection === "general" && (
        <div className="space-y-10 max-w-xl text-left">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              {t("Section Badge (Eyebrow)", "セクションバッジ (アイブロウ)", "Nhãn mục (Eyebrow)")}
            </label>
            <Input
              value={formData.eyebrow_en || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eyebrow_en: e.target.value,
                })
              }
              placeholder="JOURNEY"
              className="h-16 px-8 bg-muted/20 border-none rounded-2xl text-base font-bold shadow-sm focus:ring-2 focus:ring-sage/20 transition-all"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              {t("Section Title", "セクションのタイトル", "Tiêu đề mục")}
            </label>
            <Input
              value={formData.title_en || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title_en: e.target.value,
                })
              }
              placeholder="Career Timeline"
              className="h-16 px-8 bg-muted/20 border-none rounded-2xl text-xl font-serif font-bold shadow-sm focus:ring-2 focus:ring-sage/20 transition-all"
            />
          </div>
        </div>
      )}

      {activeSection === "narrative" && (
        <div className="space-y-4 pt-4 max-w-xl text-left">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
            {t("Section Description", "セクションの説明", "Mô tả mục")}
          </label>
          <Textarea
            value={formData.description_en || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                description_en: e.target.value,
              })
            }
            placeholder={t("Historical context and evolution summary...", "歴史的背景と進化の要約...", "Bối cảnh lịch sử và tóm tắt sự phát triển...")}
            rows={6}
            className="p-8 bg-muted/20 border-none rounded-[2.5rem] text-sm leading-relaxed shadow-sm font-serif italic text-heading/80 resize-none focus:ring-2 focus:ring-sage/20 transition-all font-bold"
          />
        </div>
      )}

      {activeSection === "localization" && (
        <div className="space-y-12 max-w-xl animate-in slide-in-from-right-8 duration-700 text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-sage/5 p-6 md:p-8 rounded-[2rem] border border-sage/10 relative overflow-hidden group shadow-sm gap-6">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sage shadow-xl group-hover:rotate-[360deg] transition-transform duration-1000">
                <Globe2 size={24} />
              </div>
              <h4 className="text-[10px] font-bold text-sage uppercase tracking-widest">
                {t("Internationalization", "国際化", "Quốc tế hóa")}
              </h4>
            </div>
            {onAutoTranslate && (
              <Button
                onClick={onAutoTranslate}
                disabled={isTranslating}
                className="h-12 px-8 bg-sage text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all relative z-10 w-full sm:w-auto"
              >
                {isTranslating ? <LoadingSpinner /> : <Wand2 size={16} />}
                {isTranslating ? t("SYNCING...", "同期中...", "ĐANG ĐỒNG BỘ...") : t("AUTO-SYNC", "自動同期", "ĐỒNG BỘ TỰ ĐỘNG")}
              </Button>
            )}
          </div>

          <div className="space-y-8 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  {t("Eyebrow (JP)", "アイブロウ (JP)", "Eyebrow (JP)")}
                </label>
                <Input
                  value={formData.eyebrow_ja || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eyebrow_ja: e.target.value,
                    })
                  }
                  placeholder="ジャーニー"
                  className="h-14 px-7 bg-muted/20 border-none rounded-2xl text-base font-bold shadow-sm focus:ring-2 focus:ring-sage/20 transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  {t("Eyebrow (VI)", "アイブロウ (VI)", "Eyebrow (VI)")}
                </label>
                <Input
                  value={formData.eyebrow_vi || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eyebrow_vi: e.target.value,
                    })
                  }
                  placeholder="HÀNH TRÌNH"
                  className="h-14 px-7 bg-muted/20 border-none rounded-2xl text-base font-bold shadow-sm focus:ring-2 focus:ring-sage/20 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  {t("Title (JP)", "タイトル (JP)", "Tiêu đề (JP)")}
                </label>
                <Input
                  value={formData.title_ja || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title_ja: e.target.value,
                    })
                  }
                  placeholder="キャリアタイムライン"
                  className="h-14 px-7 bg-muted/20 border-none rounded-2xl text-base font-bold shadow-sm focus:ring-2 focus:ring-sage/20 transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  {t("Title (VI)", "タイトル (VI)", "Tiêu đề (VI)")}
                </label>
                <Input
                  value={formData.title_vi || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title_vi: e.target.value,
                    })
                  }
                  placeholder="Lịch sử sự nghiệp"
                  className="h-14 px-7 bg-muted/20 border-none rounded-2xl text-base font-bold shadow-sm focus:ring-2 focus:ring-sage/20 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  {t("Description (JP)", "説明 (JP)", "Mô tả (JP)")}
                </label>
                <Textarea
                  value={formData.description_ja || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description_ja: e.target.value,
                    })
                  }
                  rows={4}
                  className="p-8 bg-muted/20 border-none rounded-[2rem] text-sm font-serif italic font-bold focus:ring-2 focus:ring-sage/20 transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  {t("Description (VI)", "説明 (VI)", "Mô tả (VI)")}
                </label>
                <Textarea
                  value={formData.description_vi || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description_vi: e.target.value,
                    })
                  }
                  rows={4}
                  className="p-8 bg-muted/20 border-none rounded-[2rem] text-sm font-serif italic font-bold focus:ring-2 focus:ring-sage/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "status" && (
        <div className="space-y-12 max-w-xl animate-in slide-in-from-right-8 duration-700 text-left">
          <div
            className={cn(
              "flex flex-col sm:flex-row items-center gap-6 md:gap-8 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border transition-all cursor-pointer",
              formData.is_published ? "bg-sage/5 border-sage/20 shadow-xl" : "bg-muted/30 border-border/40"
            )}
            onClick={() =>
              setFormData({
                ...formData,
                is_published: !formData.is_published,
              })
            }
          >
            <div
              className={cn(
                "w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center transition-all shadow-lg flex-shrink-0",
                formData.is_published ? "bg-sage text-white animate-pulse" : "bg-muted-foreground/20 text-muted-foreground"
              )}
            >
              {formData.is_published ? <Globe2 size={24} /> : <EyeOff size={24} />}
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-bold text-heading uppercase tracking-widest leading-none">
                {t("Publish Section", "セクションを公開", "Xuất bản mục")}
              </h4>
              <p className="text-[10px] md:text-[11px] text-muted-foreground mt-2 md:mt-3 leading-relaxed">
                {formData.is_published 
                  ? t("This section is visible on your public website.", "このセクションはパブリックウェブサイトに表示されます。", "Mục này đang hiển thị trên trang web công khai của bạn.") 
                  : t("This section is hidden from your public website.", "このセクションはパブリックウェブサイトから隠されています。", "Mục này đang bị ẩn khỏi trang web công khai của bạn.")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
