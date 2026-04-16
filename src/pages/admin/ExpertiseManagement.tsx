import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getExpertiseSection,
  upsertExpertiseSection,
} from "@/lib/supabase-queries";
import type { ExpertiseSection } from "@/types/admin";
import {
  Brain,
  Cpu,
  Type,
  Globe2,
  ShieldCheck,
  MousePointer2,
  EyeOff,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { translateFields } from "@/lib/translate";
import { cn } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminDialogForm } from "@/components/admin/shared/AdminDialogForm";
import { ExpertiseSectionSettingsForm } from "@/components/admin/expertise/ExpertiseSectionSettingsForm";

const ExpertiseManagementPage = () => {
  const queryClient = useQueryClient();
  const { lang, translations, t } = useLang();
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("branding");

  // Load Expertise Section Data
  const { data: expertise, isLoading: loading } = useQuery({
    queryKey: ["expertise-section"],
    queryFn: async () => {
      const data = await getExpertiseSection();
      return data as ExpertiseSection;
    },
  });

  // Mutation: Save with Optimistic Update
  const updateExpertiseMutation = useMutation({
    mutationFn: async (data: Partial<ExpertiseSection>) => {
      await upsertExpertiseSection(data);
      return data;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["expertise-section"] });
      const previous = queryClient.getQueryData(["expertise-section"]);
      queryClient.setQueryData(["expertise-section"], newData);
      return { previous };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(["expertise-section"], context?.previous);
      toast.error(t("Error during save.", "保存中にエラーが発生しました。", "Lỗi khi lưu dữ liệu."));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["expertise-section"] }),
    onSuccess: () => {
      toast.success(translations[lang].expertiseAtmosphereRefined || "Expertise atmosphere refined.");
      setIsDialogOpen(false);
    }
  });

  const [formData, setFormData] = useState<Partial<ExpertiseSection>>({});

  useEffect(() => {
    if (expertise) {
      setFormData(expertise);
    }
  }, [expertise, isDialogOpen]);

  const handleSave = () => {
    updateExpertiseMutation.mutate(formData);
  };

  const handleAutoTranslate = async () => {
    try {
      setIsTranslating(true);
      const sourceFields = {
        eyebrow: formData.eyebrow,
        title: formData.title,
        strategic_title: formData.strategic_title,
        strategic_description: formData.strategic_description,
        strategic_helper_text: formData.strategic_helper_text,
        tools_title: formData.tools_title,
        tools_helper_text: formData.tools_helper_text,
      };

      if (!sourceFields.title) {
        toast.error(t("English parameters required for translation.", "翻訳には英語のパラメータが必要です。", "Yêu cầu nội dung tiếng Anh để dịch."));
        return;
      }

      const translatedJa = await translateFields(sourceFields as any, "ja");
      const translatedVi = await translateFields(sourceFields as any, "vi");
      setFormData({
        ...formData,
        eyebrow_ja: translatedJa.eyebrow,
        title_ja: translatedJa.title,
        strategic_title_ja: translatedJa.strategic_title,
        strategic_description_ja: translatedJa.strategic_description,
        strategic_helper_text_ja: translatedJa.strategic_helper_text,
        tools_title_ja: translatedJa.tools_title,
        tools_helper_text_ja: translatedJa.tools_helper_text,
        eyebrow_vi: translatedVi.eyebrow,
        title_vi: translatedVi.title,
        strategic_title_vi: translatedVi.strategic_title,
        strategic_description_vi: translatedVi.strategic_description,
        strategic_helper_text_vi: translatedVi.strategic_helper_text,
        tools_title_vi: translatedVi.tools_title,
        tools_helper_text_vi: translatedVi.tools_helper_text,
      });

      toast.success(t("Magic! Global sync complete.", "魔法！グローバル同期が完了しました。", "Ảo thuật! Đồng bộ toàn cầu hoàn tất."));
    } catch (error) {
      toast.error(t("Translation failure.", "翻訳に失敗しました。", "Lỗi khi dịch thuật."));
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
            {t("Syncing Proficiencies...", "実力を同期中...", "Đang đồng bộ năng lực...")}
          </p>
        </div>
      </AdminLayout>
    );
  }

  const dialogTabs = [
    {
      id: "branding",
      label: t("Branding", "ブランディング", "Xây dựng thương hiệu"),
      fullLabel: t("Identity Layer", "アイデンティティレイヤー", "Lớp định danh"),
      icon: Type,
      content: (
        <ExpertiseSectionSettingsForm
          formData={formData}
          setFormData={setFormData}
          activeSection="branding"
        />
      ),
    },
    {
      id: "strategic",
      label: t("Strategic", "戦略的", "Chiến lược"),
      fullLabel: t("Strategic Layer", "戦略レイヤー", "Lớp chiến lược"),
      icon: Brain,
      content: (
        <ExpertiseSectionSettingsForm
          formData={formData}
          setFormData={setFormData}
          activeSection="strategic"
        />
      ),
    },
    {
      id: "technical",
      label: t("Technical", "テクニカル", "Kỹ thuật"),
      fullLabel: t("Technical Layer", "テクニカルレイヤー", "Lớp kỹ thuật"),
      icon: Cpu,
      content: (
        <ExpertiseSectionSettingsForm
          formData={formData}
          setFormData={setFormData}
          activeSection="technical"
        />
      ),
    },
    {
      id: "localization",
      label: "i18n",
      fullLabel: t("Translations", "翻訳", "Bản dịch"),
      icon: Globe2,
      content: (
        <ExpertiseSectionSettingsForm
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
      label: t("Status", "ステータス", "Trạng thái"),
      fullLabel: t("Deploy Protocol", "デプロイプロトコル", "Giao thức triển khai"),
      icon: ShieldCheck,
      content: (
        <ExpertiseSectionSettingsForm
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
          title={translations[lang].expertiseAtmosphere}
          description={translations[lang].expertiseAtmosphereDescription}
          primaryAction={{
            label: t("Edit Header", "ヘッダーを編集", "Sửa tiêu đề"),
            onClick: () => setIsDialogOpen(true),
            icon: Brain,
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
                {formData.is_published ? t("Atmosphere Live", "アトモスフィア配信中", "Đang trực tuyến") : t("Atmosphere Shadowed", "アトモスフィア非表示", "Đang bị ẩn")}
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-4">
                <p className="text-xs tracking-[0.3em] font-bold text-sage uppercase">
                  {lang === 'ja' ? formData.eyebrow_ja || formData.eyebrow : formData.eyebrow || "PROFICIENCIES"}
                </p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-heading">
                  {lang === 'ja' ? formData.title_ja || formData.title : lang === 'vi' ? formData.title_vi || formData.title : formData.title || "Expertise & Tools"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8 border-t border-border/10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-sage">
                    <Brain size={24} />
                    <h3 className="text-xl font-bold font-serif">
                      {lang === 'ja' ? formData.strategic_title_ja || formData.strategic_title : lang === 'vi' ? formData.strategic_title_vi || formData.strategic_title : formData.strategic_title || "Strategic Skills"}
                    </h3>
                  </div>
                  <p className="text-sm font-light leading-relaxed font-serif italic text-muted-foreground">
                    {lang === 'ja' ? formData.strategic_description_ja || formData.strategic_description : lang === 'vi' ? formData.strategic_description_vi || formData.strategic_description : formData.strategic_description}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-sage">
                    <Cpu size={24} />
                    <h3 className="text-xl font-bold font-serif">
                      {lang === 'ja' ? formData.tools_title_ja || formData.tools_title : lang === 'vi' ? formData.tools_title_vi || formData.tools_title : formData.tools_title || "Technical Tools"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-sage/5 rounded-2xl border border-sage/10 italic text-xs text-sage">
                    <MousePointer2 size={14} className="animate-pulse" />
                    {lang === 'ja' ? formData.tools_helper_text_ja || formData.tools_helper_text : lang === 'vi' ? formData.tools_helper_text_vi || formData.tools_helper_text : formData.tools_helper_text}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={t("Edit Header", "ヘッダーを編集", "Sửa tiêu đề")}
          description={t("Adjust the parameters for your expertise section.", "技術セクションのパラメータを調整します。", "Điều chỉnh các thông số cho phần chuyên môn của bạn.")}
          tabs={dialogTabs}
          activeTab={activeSection}
          onTabChange={setActiveSection}
          onSave={handleSave}
          saving={updateExpertiseMutation.isPending}
          sidebarTitle={t("Expertise", "専門知識", "Chuyên môn")}
          sidebarSubtitle={t("Atmosphere Protocol", "アトモスフィアプロトコル", "Giao thức không gian")}
          sidebarIcon={Brain}
          saveLabel={translations[lang].save}
        />
      </div>
    </AdminLayout>
  );
};

export default ExpertiseManagementPage;
