import { useLang } from "@/contexts/LangContext";
import type { HeroSectionWithLayout } from "@/types/admin";
import { getHeroLayout } from "@/themes/radiant/components/hero-layouts";

interface HeroPreviewProps {
  data: Partial<HeroSectionWithLayout>;
  layoutConfig: Record<string, any>;
}

export const HeroPreview = ({ data, layoutConfig }: HeroPreviewProps) => {
  const { lang } = useLang();

  const langSuffix = lang === "en" ? "_en" : "_ja";
  const layoutKey = data.selected_layout_key || "split-left-image-right";
  const LayoutComponent = getHeroLayout(layoutKey);

  if (!LayoutComponent) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-600">
        Layout not found
      </div>
    );
  }

  // Merge data with layout config for preview
  const previewData: HeroSectionWithLayout = {
    ...(data as HeroSectionWithLayout),
    layout_config: layoutConfig,
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <LayoutComponent
        content={previewData}
        config={layoutConfig}
        langSuffix={langSuffix}
      />
    </div>
  );
};
