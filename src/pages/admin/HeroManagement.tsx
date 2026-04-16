"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getHeroSection,
  upsertHeroSection,
  getHeroLayouts,
} from "@/lib/supabase-queries";
import type { HeroSectionWithLayout, HeroLayout } from "@/types/admin";
import {
  Wand2,
  Layout,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  Settings2,
  Sparkles,
  X,
  Globe2,
  EyeOff,
  SlidersHorizontal,
  Zap,
  ShieldCheck,
  Palette,
  Monitor,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { HeroPreview } from "@/components/admin/HeroPreview";
import { translateFields } from "@/lib/translate";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MediaInput } from "@/components/admin/media/MediaInput";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminDialogForm, AdminTabConfig } from "@/components/admin/shared/AdminDialogForm";
import { AdminFormSection, AdminField } from "@/components/admin/shared/AdminFormSection";
import { AdminStatusToggle } from "@/components/admin/shared/AdminStatusToggle";
import { AdminLoading } from "@/components/admin/shared/AdminLoading";
import { cn } from "@/lib/utils";

const HeroManagementPage = () => {
  const queryClient = useQueryClient();
  const { lang, translations, t } = useLang();
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");

  const [formData, setFormData] = useState<Partial<HeroSectionWithLayout>>({
    selected_layout_key: "split-left-image-right",
    layout_config: {},
  });
  const [layouts, setLayouts] = useState<HeroLayout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<HeroLayout | null>(null);
  const [layoutConfig, setLayoutConfig] = useState<Record<string, any>>({});

  // Point 1: Global Cache for Hero Section
  const { data: heroData, isLoading: loading } = useQuery({
    queryKey: ["hero-section"],
    queryFn: async () => {
      const data = await getHeroSection();
      return data as HeroSectionWithLayout;
    },
  });

  // Load Layouts
  const { data: layoutsData } = useQuery({
    queryKey: ["hero-layouts"],
    queryFn: async () => {
      return await getHeroLayouts();
    },
  });

  // Point 2: Mutation for Saving
  const updateHeroMutation = useMutation({
    mutationFn: async (data: Partial<HeroSectionWithLayout>) => {
      await upsertHeroSection(data);
      return data;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["hero-section"] });
      const previous = queryClient.getQueryData(["hero-section"]);
      queryClient.setQueryData(["hero-section"], newData);
      return { previous };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(["hero-section"], context?.previous);
      toast.error(t("Protocol error during save.", "保存中のプロトコルエラー。", "Lỗi giao thức khi lưu."));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["hero-section"] }),
    onSuccess: () => {
      toast.success(t("Hero section updated successfully.", "ヒーローセクションが正常に更新されました。", "Đã cập nhật mục Hero thành công."));
      setIsDialogOpen(false);
    }
  });

  // Sync state
  useEffect(() => {
    if (heroData) {
      setFormData(heroData);
      setLayoutConfig(heroData.layout_config || {});
    }
    if (layoutsData) {
      setLayouts(layoutsData);
      const currentLayout = layoutsData.find(
        (l) => l.layout_key === (heroData?.selected_layout_key || "split-left-image-right")
      );
      setSelectedLayout(currentLayout || layoutsData[0]);
    }
  }, [heroData, layoutsData, isDialogOpen]);

  const handleAutoTranslate = async () => {
    try {
      setIsTranslating(true);
      const sourceFields = {
        badge: formData.badge_en,
        title_line_1: formData.title_line_1_en,
        title_line_2: formData.title_line_2_en,
        description: formData.description_en,
        primary_button_label: formData.primary_button_label_en,
        secondary_button_label: formData.secondary_button_label_en,
        hero_image_alt: formData.hero_image_alt_en,
      };

      if (!sourceFields.title_line_1) {
        toast.error(t("English parameters required for translation.", "翻訳には英語のパラメータが必要です。", "Yêu cầu nội dung tiếng Anh để dịch."));
        return;
      }

      const translatedJa = await translateFields(sourceFields as any, "ja");
      const translatedVi = await translateFields(sourceFields as any, "vi");
      setFormData({
        ...formData,
        badge_ja: translatedJa.badge,
        title_line_1_ja: translatedJa.title_line_1,
        title_line_2_ja: translatedJa.title_line_2,
        description_ja: translatedJa.description,
        primary_button_label_ja: translatedJa.primary_button_label,
        secondary_button_label_ja: translatedJa.secondary_button_label,
        hero_image_alt_ja: translatedJa.hero_image_alt,
        badge_vi: translatedVi.badge,
        title_line_1_vi: translatedVi.title_line_1,
        title_line_2_vi: translatedVi.title_line_2,
        description_vi: translatedVi.description,
        primary_button_label_vi: translatedVi.primary_button_label,
        secondary_button_label_vi: translatedVi.secondary_button_label,
        hero_image_alt_vi: translatedVi.hero_image_alt,
      });

      toast.success(t("Multicultural synchronization complete.", "多文化同期が完了しました。", "Đồng bộ hóa đa ngôn ngữ hoàn tất."));
    } catch (error) {
      toast.error(t("The translation gateway failed.", "翻訳ゲートウェイが失敗しました。", "Cổng dịch thuật gặp lỗi."));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = () => {
    updateHeroMutation.mutate(formData);
  };

  const handleLayoutSelect = (layout: HeroLayout) => {
    setSelectedLayout(layout);
    setFormData({ ...formData, selected_layout_key: layout.layout_key });
    setLayoutConfig(layout.default_config || {});
  };

  const handleLayoutConfigChange = (key: string, value: any) => {
    const newConfig = { ...layoutConfig, [key]: value };
    setLayoutConfig(newConfig);
    setFormData({ ...formData, layout_config: newConfig });
  };

  const tabs: AdminTabConfig[] = [
    {
      id: "identity",
      label: translations[lang].overview || "Core",
      fullLabel: t("Core Details", "基本的な詳細", "Chi tiết cốt lõi"),
      icon: Type,
      content: (
        <div className="space-y-12 max-w-2xl">
          <AdminFormSection title={t("Titles & Text", "タイトルとテキスト", "Tiêu đề & Văn bản")}>
            <AdminField label={t("Hero Badge (Eyebrow)", "ヒーローバッジ", "Nhãn phụ Hero")} description={t("Subtle label positioning above the main title.", "メインタイトルの上に表示されるラベル。", "Nhãn phụ hiển thị phía trên tiêu đề chính.")}>
              <Input
                value={formData.badge_en || ""}
                onChange={(e) => setFormData({ ...formData, badge_en: e.target.value })}
                placeholder="SENIOR MARKETING ARCHITECT"
                className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold shadow-sm"
              />
            </AdminField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminField label={t("Title Line Primary", "メインタイトル", "Tiêu đề chính")}>
                <Input
                  value={formData.title_line_1_en || ""}
                  onChange={(e) => setFormData({ ...formData, title_line_1_en: e.target.value })}
                  placeholder="Impactful"
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-serif font-bold shadow-sm"
                />
              </AdminField>
              <AdminField label={t("Title Line Secondary", "サブタイトル", "Tiêu đề phụ")}>
                <Input
                  value={formData.title_line_2_en || ""}
                  onChange={(e) => setFormData({ ...formData, title_line_2_en: e.target.value })}
                  placeholder="Innovator."
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-serif font-bold shadow-sm"
                />
              </AdminField>
            </div>
            <AdminField label={translations[lang].content}>
              <Textarea
                value={formData.description_en || ""}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                placeholder="Bright Strategies for Brand Acceleration..."
                rows={5}
                className="p-6 bg-white/70 border border-sage/20 rounded-2xl md:rounded-[2.5rem] text-sm leading-relaxed shadow-sm font-serif italic text-heading/80 resize-none font-bold"
              />
            </AdminField>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "actions",
      label: t("Actions", "アクション", "Hành động"),
      fullLabel: t("Buttons", "ボタン", "Nút bấm"),
      icon: Zap,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl">
          <AdminFormSection title={t("Primary Button", "メインボタン", "Nút chính")} icon={Zap}>
            <AdminField label={t("Label", "ラベル", "Nhãn")}>
              <Input
                value={formData.primary_button_label_en || ""}
                onChange={(e) => setFormData({ ...formData, primary_button_label_en: e.target.value })}
                placeholder="Engage Project"
                className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold"
              />
            </AdminField>
            <AdminField label={t("Deployment URI", "デプロイURI", "Đường dẫn")}>
              <div className="relative">
                <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
                <Input
                  value={formData.primary_button_url || ""}
                  onChange={(e) => setFormData({ ...formData, primary_button_url: e.target.value })}
                  placeholder="/portfolio"
                  className="h-14 pl-12 pr-6 bg-white/70 border border-sage/20 rounded-xl text-xs font-bold"
                />
              </div>
            </AdminField>
          </AdminFormSection>

          <AdminFormSection title={t("Secondary Button", "サブボタン", "Nút phụ")} icon={SlidersHorizontal}>
            <AdminField label={t("Label", "ラベル", "Nhãn")}>
              <Input
                value={formData.secondary_button_label_en || ""}
                onChange={(e) => setFormData({ ...formData, secondary_button_label_en: e.target.value })}
                placeholder="Connect"
                className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold"
              />
            </AdminField>
            <AdminField label={t("Deployment URI", "デプロイURI", "Đường dẫn")}>
              <div className="relative">
                <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
                <Input
                  value={formData.secondary_button_url || ""}
                  onChange={(e) => setFormData({ ...formData, secondary_button_url: e.target.value })}
                  placeholder="/contact"
                  className="h-14 pl-12 pr-6 bg-white/70 border border-sage/20 rounded-xl text-xs font-bold"
                />
              </div>
            </AdminField>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "media",
      label: translations[lang].mediaLibrary || "Media",
      fullLabel: translations[lang].mediaLibrary || "Media",
      icon: ImageIcon,
      content: (
        <div className="space-y-12 max-w-3xl">
          <AdminFormSection title={t("Images", "画像", "Hình ảnh")}>
            <MediaInput
              label={t("Hero Image", "ヒーロー画像", "Ảnh Hero")}
              value={formData.hero_image_url || ""}
              onChange={(url) => setFormData({ ...formData, hero_image_url: url })}
              description={t("Upload an image to show in the hero section.", "ヒーローセクションに表示する画像をアップロードします。", "Tải ảnh lên để hiển thị trong mục hero.")}
            />
            <AdminField label={t("Image Alt Text", "画像代替テキスト", "Văn bản thay thế ảnh")}>
              <Input
                value={formData.hero_image_alt_en || ""}
                onChange={(e) => setFormData({ ...formData, hero_image_alt_en: e.target.value })}
                placeholder="Describing the core visual atmosphere..."
                className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl md:rounded-2xl text-sm font-medium shadow-sm"
              />
            </AdminField>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "layout",
      label: t("Layout", "レイアウト", "Bố cục"),
      fullLabel: t("Layout Presets", "レイアウトプリセット", "Mẫu bố cục"),
      icon: Layout,
      content: (
        <AdminFormSection title={t("Layout Presets", "レイアウトプリセット", "Mẫu bố cục")} description={t("Select the layout for the hero section.", "ヒーローセクションのレイアウトを選択します。", "Chọn bố cục cho mục hero.")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {layouts.map((layout) => (
              <div
                key={layout.id}
                onClick={() => handleLayoutSelect(layout)}
                className={cn(
                  "group relative p-4 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden",
                  selectedLayout?.id === layout.id
                    ? "border-sage bg-sage/[0.03] shadow-2xl scale-[1.02]"
                    : "border-transparent bg-white shadow-sm hover:border-sage/30 hover:shadow-xl"
                )}
              >
                <div className="aspect-video rounded-[1.8rem] overflow-hidden mb-6 border border-border/10 relative">
                  {layout.preview_image_url ? (
                    <img
                      src={layout.preview_image_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/20">
                      <Monitor className="text-muted-foreground/30 w-8 h-8" />
                    </div>
                  )}
                  {selectedLayout?.id === layout.id && (
                    <div className="absolute inset-0 bg-sage/20 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-sage shadow-2xl">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-heading mb-1">{layout.layout_name}</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic line-clamp-2">{layout.description}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminFormSection>
      )
    },
    {
      id: "params",
      label: t("Config", "設定", "Cấu hình"),
      fullLabel: t("Settings", "設定", "Thiết lập"),
      icon: SlidersHorizontal,
      content: (
        <AdminFormSection title={t("Layout Settings", "レイアウト設定", "Cấu hình bố cục")} description={t("Adjust specific layout parameters.", "特定のレイアウトパラメータを調整します。", "Điều chỉnh các thông số bố cục cụ thể.")}>
          {!selectedLayout ? (
            <div className="py-24 text-center space-y-6">
              <Palette className="text-muted-foreground/20 mx-auto w-12 h-12" />
              <p className="text-muted-foreground font-serif italic text-lg">{t("No layout selected.", "レイアウトが選択されていません。", "Chưa chọn bố cục.")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {Object.entries(selectedLayout.default_config || {}).map(([key, defaultValue]) => {
                const currentValue = layoutConfig[key] ?? defaultValue;
                const valueType = typeof defaultValue;

                return (
                  <div key={key} className="p-8 bg-white border border-border/20 rounded-[2.5rem] shadow-sm space-y-6 hover:border-sage/30 transition-all">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>

                    {valueType === "boolean" ? (
                      <div
                        className={cn("flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all", currentValue ? "bg-sage/5 border-sage/20" : "bg-muted/10 border-transparent")}
                        onClick={() => handleLayoutConfigChange(key, !currentValue)}
                      >
                        <span className="text-xs font-bold text-heading">{currentValue ? t("Active", "有効", "Kích hoạt") : t("Stable", "安定", "Tắt")}</span>
                        <div className={cn("w-12 h-6 rounded-full relative transition-all", currentValue ? "bg-sage" : "bg-muted-foreground/30")}>
                          <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", currentValue ? "left-7" : "left-1")}></div>
                        </div>
                      </div>
                    ) : valueType === "number" ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[10px] font-serif italic text-muted-foreground">{t("Range: 0 - 1.0", "範囲: 0 - 1.0", "Khoảng: 0 - 1.0")}</span>
                          <span className="text-sm font-bold text-sage">{currentValue.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={currentValue}
                          onChange={(e) => handleLayoutConfigChange(key, parseFloat(e.target.value))}
                          className="w-full accent-sage h-1.5 bg-muted/30 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                    ) : (
                      <Input
                        value={currentValue}
                        onChange={(e) => handleLayoutConfigChange(key, e.target.value)}
                        className="h-12 px-6 bg-muted/5 border-none rounded-xl text-xs font-bold"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </AdminFormSection>
      )
    },
    {
      id: "localization",
      label: "i18n",
      fullLabel: t("Translations", "翻訳", "Bản dịch"),
      icon: Globe2,
      content: (
        <div className="space-y-12 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-sage/5 p-10 rounded-[3rem] border border-sage/10 relative overflow-hidden group shadow-sm gap-8">
            <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-sage shadow-xl">
                <Globe2 size={32} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sage uppercase tracking-[0.2em] mb-1">{t("Translation Settings", "翻訳設定", "Thiết lập bản dịch")}</h4>
              </div>
            </div>
            <Button onClick={handleAutoTranslate} disabled={isTranslating} className="w-full sm:w-auto h-16 px-12 bg-sage text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-widest shadow-2xl shadow-sage/30 flex items-center justify-center gap-2">
              {isTranslating ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
              {isTranslating ? t("SYNCING...", "同期中...", "ĐANG ĐỒNG BỘ...") : t("AUTO TRANSLATE", "自動翻訳", "TỰ ĐỘNG DỊCH")}
            </Button>
          </div>

          <AdminFormSection title={t("Japanese Narrative Layer", "日本語ナラティブレイヤー", "Lớp nội dung tiếng Nhật")}>
             <AdminField label="Hero Badge (JP)">
                <Input
                  value={formData.badge_ja || ""}
                  onChange={(e) => setFormData({ ...formData, badge_ja: e.target.value })}
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold"
                />
              </AdminField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AdminField label="Title Line 1 (JP)">
                  <Input
                    value={formData.title_line_1_ja || ""}
                    onChange={(e) => setFormData({ ...formData, title_line_1_ja: e.target.value })}
                    className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-serif font-bold shadow-sm"
                  />
                </AdminField>
                <AdminField label="Title Line 2 (JP)">
                  <Input
                    value={formData.title_line_2_ja || ""}
                    onChange={(e) => setFormData({ ...formData, title_line_2_ja: e.target.value })}
                    className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-serif font-bold shadow-sm"
                  />
                </AdminField>
              </div>
              <AdminField label="Narrative (JP)">
                <Textarea
                  value={formData.description_ja || ""}
                  onChange={(e) => setFormData({ ...formData, description_ja: e.target.value })}
                  rows={5}
                  className="p-6 bg-white/70 border border-sage/20 rounded-[2.5rem] text-sm font-serif italic font-bold leading-relaxed"
                />
              </AdminField>
          </AdminFormSection>

          <AdminFormSection title={t("Vietnamese Narrative Layer", "ベトナム語ナラティブレイヤー", "Lớp nội dung tiếng Việt")}>
             <AdminField label="Hero Badge (VI)">
                <Input
                  value={formData.badge_vi || ""}
                  onChange={(e) => setFormData({ ...formData, badge_vi: e.target.value })}
                  className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold"
                />
              </AdminField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AdminField label="Title Line 1 (VI)">
                  <Input
                    value={formData.title_line_1_vi || ""}
                    onChange={(e) => setFormData({ ...formData, title_line_1_vi: e.target.value })}
                    className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-serif font-bold shadow-sm"
                  />
                </AdminField>
                <AdminField label="Title Line 2 (VI)">
                  <Input
                    value={formData.title_line_2_vi || ""}
                    onChange={(e) => setFormData({ ...formData, title_line_2_vi: e.target.value })}
                    className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-serif font-bold shadow-sm"
                  />
                </AdminField>
              </div>
              <AdminField label="Narrative (VI)">
                <Textarea
                  value={formData.description_vi || ""}
                  onChange={(e) => setFormData({ ...formData, description_vi: e.target.value })}
                  rows={5}
                  className="p-6 bg-white/70 border border-sage/20 rounded-[2.5rem] text-sm font-serif italic font-bold leading-relaxed"
                />
              </AdminField>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "status",
      label: translations[lang].status,
      fullLabel: t("Visibility", "表示", "Hiển thị"),
      icon: ShieldCheck,
      content: (
        <div className="max-w-2xl">
          <AdminStatusToggle
            label={t("Publish Status", "公開ステータス", "Trạng thái hiển thị")}
            isPublished={formData.is_published || false}
            onToggle={(val) => setFormData({ ...formData, is_published: val })}
            description={{
              active: t("This hero section is visible to the public.", "このヒーローセクションは一般に公開されています。", "Mục hero này đang hiển thị công khai."),
              inactive: t("Hero section is currently hidden.", "ヒーローセクションは現在非表示です。", "Mục hero hiện đang bị ẩn.")
            }}
          />
        </div>
      )
    }
  ];

  if (loading) return <AdminLayout><AdminLoading message={translations[lang].loading} /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-12 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={translations[lang].heroSection}
          description={t("Manage your main hero section and visual content.", "メインのヒーローセクションとビジュアル内容を管理します。", "Quản lý mục hero chính và nội dung hình ảnh của bạn.")}
          primaryAction={{
            label: translations[lang].siteSettingsTitle || "Settings",
            onClick: () => setIsDialogOpen(true),
            icon: Settings2
          }}
        />

        {/* HERO DASHBOARD PREVIEW */}
        <div className="grid grid-cols-1 gap-12">
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[3.5rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden relative group">
            <div className="absolute top-10 right-10 z-20 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
               <div className={cn(
                 "px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border shadow-sm",
                 formData.is_published ? "bg-sage text-white border-sage" : "bg-white text-muted-foreground border-border"
               )}>
                  {formData.is_published ? <Globe2 size={12} /> : <EyeOff size={12} />}
                  <span>{formData.is_published ? translations[lang].published : translations[lang].draft}</span>
               </div>
            </div>

            <div className="bg-muted/10 rounded-[3rem] overflow-hidden border border-border/10 shadow-inner">
              <HeroPreview data={formData} layoutConfig={layoutConfig} />
            </div>

            <div className="p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-t border-border/20 mt-4">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-sage shadow-xl flex-shrink-0">
                  <Layout size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">{t("Current Layout", "現在のレイアウト", "Bố cục hiện tại")}</p>
                  <h3 className="text-xl font-serif font-bold text-heading">{selectedLayout?.layout_name || "Custom Layering"}</h3>
                </div>
              </div>

              <div className="flex flex-row items-center gap-12 w-full lg:w-auto">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t("Title Content", "タイトル内容", "Nội dung tiêu đề")}</p>
                  <p className="text-sm font-bold text-heading truncate max-w-[200px]">{formData.title_line_1_en} {formData.title_line_2_en}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t("Main CTA", "メインCTA", "Nút hành động chính")}</p>
                  <p className="text-sm font-bold text-sage truncate max-w-[150px]">{formData.primary_button_label_en || t("No Action", "アクションなし", "Không có hành động")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={t("Edit Hero Section", "ヒーローセクションを編集", "Chỉnh sửa mục Hero")}
          description={t("Edit the details of your hero section.", "ヒーローセクションの詳細を編集します。", "Chỉnh sửa chi tiết mục hero của bạn.")}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={updateHeroMutation.isPending}
          saveLabel={translations[lang].save}
        />
      </div>
    </AdminLayout>
  );
};

export default HeroManagementPage;
