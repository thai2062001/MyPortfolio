import { useEffect, useState, useMemo, memo } from "react";
import { useLang } from "@/contexts/LangContext";
import { useSectionRenderer } from "@/core/hooks/useSectionRenderer";
import { renderSectionsByOrder } from "@/lib/sectionRenderer";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "@/themes/radiant/components/PageLayout";
import { TransitionCurtain } from "../components/shared/PageCurtain";
import AmbientAccent from "../components/shared/AmbientAccent";

const Portfolio = () => {
  const { lang } = useLang();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { sections, isLoading } = useSectionRenderer("portfolio");
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const renderedSections = useMemo(() => {
    if (isLoading || sections.length === 0) return null;
    return renderSectionsByOrder(sections, {
      onNavigate: (slug: string) => {
        if (isMobile) {
          navigate(`/project/${slug}`);
        } else {
          setPendingUrl(`/project/${slug}`);
        }
      }
    });
  }, [sections, isLoading, isMobile, navigate]);

  return (
    <PageLayout 
      isLoading={isLoading} 
      loaderText={lang === "en" ? "Curating Portfolio" : "ポートフォリオを準備中..."}
      manualReadySignal={false}
      disableSnap={true}
      seoTitle="Portfolio | Digital Strategy & Growth"
      seoDescription="Explore a collection of high-impact digital projects focusing on performance marketing, brand strategy, and growth."
    >
      <div className="relative bg-background overflow-hidden min-h-screen">
        {!isTablet && (
          <>
            <AmbientAccent position="top-right" color="bg-vibe-sky" size={1000} opacity={0.05} />
            <AmbientAccent position="center-left" color="bg-vibe-pink" size={800} opacity={0.05} blur={150} />
          </>
        )}
        
        <div className="relative">
          {renderedSections}
        </div>
      </div>

      <TransitionCurtain isActive={!!pendingUrl} onComplete={() => navigate(pendingUrl!)} />
    </PageLayout>
  );
};

export default Portfolio;
