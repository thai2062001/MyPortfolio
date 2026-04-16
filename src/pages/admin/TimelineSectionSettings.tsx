import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import {
  History,
  Layout,
  Globe2,
  ShieldCheck,
  MessageSquare,
  EyeOff,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { translateFields } from "@/lib/translate";
import {
  getTimelineSectionSettings,
  upsertTimelineSectionSettings,
} from "@/lib/supabase-queries";
import type { TimelineSectionSettings } from "@/types/admin";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminDialogForm } from "@/components/admin/shared/AdminDialogForm";
import { TimelineSectionSettingsForm } from "@/components/admin/timeline/TimelineSectionSettingsForm";
import { cn } from "@/lib/utils";

const TimelineSectionSettingsPage = () => {
  const { lang, translations, t } = useLang();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("general");

  const [formData, setFormData] = useState<Partial<TimelineSectionSettings>>({
    eyebrow_en: "JOURNEY",
    title_en: "Career Timeline",
    description_en: "",
    eyebrow_ja: "ジャーニー",
    eyebrow_vi: "HÀNH TRÌNH",
    title_ja: "キャリアタイムライン",
    title_vi: "Lịch sử sự nghiệp",
    description_ja: "",
    description_vi: "",
    is_published: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settings = await getTimelineSectionSettings();
      if (settings) {
        setFormData({
          eyebrow_en: settings.eyebrow_en || "JOURNEY",
          title_en: settings.title_en || "Career Timeline",
          description_en: settings.description_en || "",
          eyebrow_ja: settings.eyebrow_ja || "ジャーニー",
          title_ja: settings.title_ja || "キャリアタイムライン",
          description_ja: settings.description_ja || "",
          eyebrow_vi: settings.eyebrow_vi || "HÀNH TRÌNH",
          title_vi: settings.title_vi || "Lịch sử sự nghiệp",
          description_vi: settings.description_vi || "",
          is_published:
            settings.is_published !== undefined ? settings.is_published : true,
        });
      }
    } catch (error) {
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await upsertTimelineSectionSettings(formData);
      toast.success(translations[lang].timelineAtmosphereRefined);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error during save.");
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
        toast.error("English parameters required for translation.");
        return;
      }

      const translatedJa = await translateFields(sourceFields as any, "ja");
      const translatedVi = await translateFields(sourceFields as any, "vi");
      setFormData({
        ...formData,
        eyebrow_ja: translatedJa.eyebrow,
        title_ja: translatedJa.title,
        description_ja: translatedJa.description,
        eyebrow_vi: translatedVi.eyebrow,
        title_vi: translatedVi.title,
        description_vi: translatedVi.description,
      });

      toast.success("Magic! Global sync complete.");
    } catch (error) {
      toast.error("Translation failure.");
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage animate-pulse">
            {t("Loading Timeline...", "タイムラインを読み込み中...", "Đang tải dòng thời gian...")}
          </p>
        </div>
      </AdminLayout>
    );
  }

  const dialogTabs = [
    {
      id: "general",
      label: t("General", "全般", "Cơ bản"),
      fullLabel: t("General Settings", "全般設定", "Cài đặt chung"),
      icon: Layout,
      content: (
        <TimelineSectionSettingsForm
          formData={formData}
          setFormData={setFormData}
          activeSection="general"
        />
      ),
    },
    {
      id: "narrative",
      label: t("Narrative", "ナラティブ", "Mô tả"),
      fullLabel: t("Section Description", "セクションの説明", "Mô tả mục"),
      icon: MessageSquare,
      content: (
        <TimelineSectionSettingsForm
          formData={formData}
          setFormData={setFormData}
          activeSection="narrative"
        />
      ),
    },
    {
      id: "localization",
      label: t("Languages", "言語", "Ngôn ngữ"),
      fullLabel: t("Translations (i18n)", "翻訳 (i18n)", "Bản dịch (i18n)"),
      icon: Globe2,
      content: (
        <TimelineSectionSettingsForm
          formData={formData}
          setFormData={setFormData}
          activeSection="localization"
          isTranslating={isTranslating}
          onAutoTranslate={handleAutoTranslate}
        />
      ),
    },
    {
      id: "status",
      label: t("Visibility", "可視性", "Hiển thị"),
      fullLabel: t("Publish Status", "公開ステータス", "Trạng thái xuất bản"),
      icon: ShieldCheck,
      content: (
        <TimelineSectionSettingsForm
          formData={formData}
          setFormData={setFormData}
          activeSection="status"
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-12 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={t("Timeline Header Settings", "タイムラインヘッダー設定", "Cài đặt tiêu đề dòng thời gian")}
          description={t("Manage the title and description of the timeline section.", "タイムラインセクションのタイトルと説明を管理します。", "Quản lý tiêu đề và mô tả của phần dòng thời gian.")}
          primaryAction={{
            label: t("Edit Section", "セクションを編集", "Sửa mục"),
            onClick: () => setIsDialogOpen(true),
            icon: History,
          }}
        />

        {/* DASHBOARD PREVIEW */}
        <div className="grid grid-cols-1 gap-12 text-center md:text-left">
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[3.5rem] p-16 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden relative group">
            <div className="absolute top-10 right-10 z-20 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div
                className={cn(
                  "px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border shadow-sm",
                  formData.is_published
                    ? "bg-sage text-white border-sage"
                    : "bg-white text-muted-foreground border-border"
                )}
              >
                {formData.is_published ? <Globe2 size={12} /> : <EyeOff size={12} />}
                {formData.is_published ? t("Visible", "表示", "Hiển thị") : t("Hidden", "非表示", "Ẩn")}
              </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-xs tracking-[0.3em] font-bold text-sage uppercase">
                {lang === 'ja' ? formData.eyebrow_ja || formData.eyebrow_en : lang === 'vi' ? formData.eyebrow_vi || formData.eyebrow_en : formData.eyebrow_en || "JOURNEY"}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-heading">
                {lang === 'ja' ? formData.title_ja || formData.title_en : lang === 'vi' ? formData.title_vi || formData.title_en : formData.title_en || "Career Timeline"}
              </h2>
              <p className="max-w-lg mx-auto md:mx-0 font-light leading-relaxed font-serif italic text-muted-foreground">
                {lang === 'ja' ? formData.description_ja || formData.description_en : lang === 'vi' ? formData.description_vi || formData.description_en : formData.description_en ||
                  t("A comprehensive overview of the milestones that shaped my professional architecture.", "私のプロフェッショナルな体系を形成したマイルストーンの包括的な概要。", "Tổng quan toàn diện về các cột mốc đã định hình nên con đường sự nghiệp của tôi.")}
              </p>
            </div>
          </div>
        </div>

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={t("Edit Timeline Header", "タイムラインヘッダーを編集", "Sửa tiêu đề dòng thời gian")}
          description={t("Update the global heading and description for your timeline section.", "タイムラインセクションのグローバルな見出しと説明を更新します。", "Cập nhật tiêu đề và mô tả toàn cầu cho phần dòng thời gian của bạn.")}
          tabs={dialogTabs}
          activeTab={activeSection}
          onTabChange={setActiveSection}
          onSave={handleSave}
          saving={saving}
          sidebarTitle={t("Journey", "ジャーニー", "Hành trình")}
          sidebarSubtitle={t("History", "履歴", "Lịch sử")}
          sidebarIcon={History}
          saveLabel={t("Save Settings", "設定を保存", "Lưu cài đặt")}
        />
      </div>
    </AdminLayout>
  );
};

export default TimelineSectionSettingsPage;
