"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SiteStatsSectionSettings } from "@/types/admin";
import { useLang } from "@/contexts/LangContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Save, Wand2, Languages, Sparkles, Globe2 } from "lucide-react";
import { translateFields } from "@/lib/translate";
import { AdminFormSection, AdminField } from "@/components/admin/shared/AdminFormSection";
import { AdminStatusToggle } from "@/components/admin/shared/AdminStatusToggle";

export const StatsSectionSettingsForm = () => {
  const { lang, t, translations } = useLang();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [formData, setFormData] = useState({
    is_published: true,
    eyebrow_en: "",
    eyebrow_ja: "",
    eyebrow_vi: "",
    title_en: "",
    title_ja: "",
    title_vi: "",
    description_en: "",
    description_ja: "",
    description_vi: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_stats_section_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setFormData({
          is_published: data.is_published,
          eyebrow_en: data.eyebrow_en || "",
          eyebrow_ja: data.eyebrow_ja || "",
          eyebrow_vi: data.eyebrow_vi || "",
          title_en: data.title_en || "",
          title_ja: data.title_ja || "",
          title_vi: data.title_vi || "",
          description_en: data.description_en || "",
          description_ja: data.description_ja || "",
          description_vi: data.description_vi || "",
        });
      }
    } catch (error) {
      toast.error(t("Failed to load section settings matrix.", "セクション設定の取得に失敗しました。", "Không thể tải bộ cài đặt của mục này."));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("site_stats_section_settings")
        .upsert({ id: 1, ...formData });

      if (error) throw error;
      toast.success(t("Atmosphere configuration synchronized.", "雰囲気の構成が同期されました。", "Đã đồng bộ hóa cấu hình không gian."));
    } catch (error) {
      toast.error(t("Error during synchronization.", "同期中にエラーが発生しました。", "Lỗi trong quá trình đồng bộ hóa."));
    } finally {
      setSaving(false);
    }
  };

  const handleAutoTranslate = async () => {
    try {
      setIsTranslating(true);
      const sourceFields = {
        eyebrow: formData.eyebrow_en,
        title: formData.title_en,
        description: formData.description_en,
      };

      if (!sourceFields.title) {
        toast.error(t("English title required for translation.", "翻訳には英語のタイトルが必要です。", "Cần có tiêu đề tiếng Anh để dịch."));
        return;
      }

      const [translatedJa, translatedVi] = await Promise.all([
        translateFields(sourceFields as any, "ja"),
        translateFields(sourceFields as any, "vi")
      ]);

      setFormData({
        ...formData,
        eyebrow_ja: translatedJa.eyebrow || formData.eyebrow_ja,
        title_ja: translatedJa.title || formData.title_ja,
        description_ja: translatedJa.description || formData.description_ja,
        eyebrow_vi: translatedVi.eyebrow || formData.eyebrow_vi,
        title_vi: translatedVi.title || formData.title_vi,
        description_vi: translatedVi.description || formData.description_vi,
      });
      toast.success(t("Magic! Translated to Japanese and Vietnamese.", "素晴らしい！日本語とベトナム語に翻訳しました。", "Kỳ diệu! Đã dịch sang tiếng Nhật và tiếng Việt."));
    } catch (error) {
      toast.error(t("Translation failure.", "翻訳に失敗しました。", "Dịch thất bại."));
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage animate-pulse">{t("Syncing Atmosphere...", "雰囲気を同期中...", "Đang đồng bộ không gian...")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-24">
      <AdminFormSection 
        title={t("Linguistic Atmosphere", "言語の雰囲気", "Không gian ngôn ngữ")} 
        description={t("Configure the narrative layers for the statistics section.", "統計セクションのナラティブレイヤーを構成します。", "Cấu hình các lớp câu chuyện cho phần thống kê.")}
        icon={Languages}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* English Column */}
          <div className="space-y-8">
            <h3 className="text-[11px] font-bold text-sage uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={14} />
              {t("English Layer", "英語レイヤー", "Lớp tiếng Anh")}
            </h3>
            
            <div className="space-y-6">
              <AdminField label={t("Eyebrow Label", "アイブロウラベル", "Nhãn Eyebrow")}>
                <Input
                  value={formData.eyebrow_en}
                  onChange={(e) => setFormData({ ...formData, eyebrow_en: e.target.value })}
                  placeholder="PROFICIENCIES"
                  className="h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
                />
              </AdminField>

              <AdminField label={t("Section Title", "セクションのタイトル", "Tiêu đề mục")}>
                <Input
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="Strategic expertise that..."
                  className="h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
                />
              </AdminField>

              <AdminField label={t("Narrative Description", "ナラティブの説明", "Mô tả câu chuyện")}>
                <Textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder={t("Detailed section description...", "セクションの詳細な説明...", "Mô tả chi tiết mục...")}
                  className="min-h-[120px] p-6 bg-muted/20 border-none rounded-2xl text-sm font-serif italic shadow-sm resize-none"
                />
              </AdminField>
            </div>
          </div>

          <div className="space-y-12">
            {/* Japanese Column */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-heading uppercase tracking-[0.2em] flex items-center gap-2">
                  <Sparkles size={14} />
                  {t("Japanese Layer", "日本語レイヤー", "Lớp tiếng Nhật")}
                </h3>
                <button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={isTranslating || !formData.title_en}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-sage hover:text-sage/80 transition-colors disabled:opacity-50"
                >
                  {isTranslating ? (
                    <div className="w-3 h-3 border-2 border-sage/20 border-t-sage rounded-full animate-spin"></div>
                  ) : (
                    <Wand2 size={12} />
                  )}
                  {t("Magic Sync", "マジック同期", "Đồng bộ thần kỳ")}
                </button>
              </div>
              
              <div className="space-y-6">
                <AdminField label={t("Eyebrow Label (JP)", "アイブロウラベル (JP)", "Nhãn Eyebrow (JP)")}>
                  <Input
                    value={formData.eyebrow_ja}
                    onChange={(e) => setFormData({ ...formData, eyebrow_ja: e.target.value })}
                    className="h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
                  />
                </AdminField>

                <AdminField label={t("Section Title (JP)", "セクションのタイトル (JP)", "Tiêu đề mục (JP)")}>
                  <Input
                    value={formData.title_ja}
                    onChange={(e) => setFormData({ ...formData, title_ja: e.target.value })}
                    className="h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
                  />
                </AdminField>

                <AdminField label={t("Narrative Description (JP)", "ナラティブの説明 (JP)", "Mô tả câu chuyện (JP)")}>
                  <Textarea
                    value={formData.description_ja}
                    onChange={(e) => setFormData({ ...formData, description_ja: e.target.value })}
                    className="min-h-[120px] p-6 bg-muted/20 border-none rounded-2xl text-sm font-serif italic shadow-sm resize-none"
                  />
                </AdminField>
              </div>
            </div>

            {/* Vietnamese Column */}
            <div className="space-y-8">
              <h3 className="text-[11px] font-bold text-heading uppercase tracking-[0.2em] flex items-center gap-2">
                <Sparkles size={14} />
                {t("Vietnamese Layer", "ベトナム語レイヤー", "Lớp tiếng Việt")}
              </h3>
              
              <div className="space-y-6">
                <AdminField label={t("Eyebrow Label (VI)", "アイブロウラベル (VI)", "Nhãn Eyebrow (VI)")}>
                  <Input
                    value={formData.eyebrow_vi}
                    onChange={(e) => setFormData({ ...formData, eyebrow_vi: e.target.value })}
                    className="h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
                  />
                </AdminField>

                <AdminField label={t("Section Title (VI)", "セクションのタイトル (VI)", "Tiêu đề mục (VI)")}>
                  <Input
                    value={formData.title_vi}
                    onChange={(e) => setFormData({ ...formData, title_vi: e.target.value })}
                    className="h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
                  />
                </AdminField>

                <AdminField label={t("Narrative Description (VI)", "ナラティブの説明 (VI)", "Mô tả câu chuyện (VI)")}>
                  <Textarea
                    value={formData.description_vi}
                    onChange={(e) => setFormData({ ...formData, description_vi: e.target.value })}
                    className="min-h-[120px] p-6 bg-muted/20 border-none rounded-2xl text-sm font-serif italic shadow-sm resize-none"
                  />
                </AdminField>
              </div>
            </div>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection 
        title={t("Protocol Settings", "プロトコル設定", "Cài đặt giao thức")} 
        description={t("Global visibility and deployment parameters.", "グローバルな可視性と展開のパラメータ。", "Các tham số triển khai và hiển thị toàn cầu.")}
        icon={Globe2}
      >
        <AdminStatusToggle
          label={t("Section Visibility", "セクションの可視性", "Hiển thị mục")}
          description={formData.is_published 
            ? t("Section is integrated and live.", "セクションは統合され、ライブ状態です。", "Mục đã được tích hợp và đang hoạt động.") 
            : t("Section is suppressed from public view.", "セクションはパブリックビューから抑制されています。", "Mục bị ẩn khỏi chế độ xem công khai.")}
          isActive={formData.is_published}
          onChange={(val) => setFormData({ ...formData, is_published: val })}
        />
      </AdminFormSection>

      <div className="flex justify-end pt-12 border-t border-black/5">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-sage hover:bg-sage/90 text-white rounded-2xl px-12 h-16 shadow-2xl shadow-sage/30 font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4 group"
        >
          {saving ? <LoadingSpinner /> : <Save size={20} className="group-hover:rotate-12 transition-transform" />}
          <span className="uppercase tracking-[0.2em] text-xs">
            {saving ? t("Deploying...", "展開中...", "Đang triển khai...") : t("Synchronize Atmosphere", "雰囲気を同期", "Đồng bộ hóa không gian")}
          </span>
        </Button>
      </div>
    </div>
  );
};
