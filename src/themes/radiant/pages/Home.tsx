import { useMemo } from "react";
import { useLang } from "@/contexts/LangContext";
import { useSectionRenderer } from "@/core/hooks/useSectionRenderer";
import { renderSectionsByOrder } from "@/lib/sectionRenderer";
import PageLayout from "@/themes/radiant/components/PageLayout";

const Index = () => {
  const { lang } = useLang();
  const { sections, isLoading } = useSectionRenderer("home");

  const renderedSections = useMemo(() => {
    if (isLoading || sections.length === 0) return null;
    return renderSectionsByOrder(sections);
  }, [sections, isLoading]);

  return (
    <PageLayout
      isLoading={isLoading}
      loaderText={lang === "en" ? "Loading Experience" : "読み込み中..."}
      manualReadySignal={true} // Home page has Cinematic Hero that signals readiness
      seoTitle="Home | Digital Strategy & Growth"
      seoDescription="Expert digital strategy, marketing performance, and growth consulting for brands."
    >
      {renderedSections}
    </PageLayout>
  );
};

export default Index;
