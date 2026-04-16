import { useLang } from "@/contexts/LangContext";
import PageLayout from "@/themes/radiant/components/PageLayout";
import PortfolioGrid from "@/themes/radiant/components/PortfolioGrid";
import { motion } from "framer-motion";

const ProjectsPage = () => {
  const { t } = useLang();

  return (
    <PageLayout
      seoTitle={t("All Projects | Archive", "すべてのプロジェクト | アーカイブ", "Toàn bộ dự án | Kho lưu trữ")}
      seoDescription="Explore the full archive of selective projects, digital strategy, and creative growth stories."
      manualReadySignal={false}
      isLoading={false}
      loaderText="Loading Portfolio"
    >
      <div className="pt-32 md:pt-48 bg-background pb-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-24"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[1px] bg-vibe-pink" />
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase font-bold text-sage">
                {t("Archive", "アーカイブ", "Lưu trữ")}
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-light text-heading tracking-tighter leading-tight italic">
              Selected <span className="text-vibe-pink/60">Works.</span>
            </h1>
          </motion.div>
        </div>
        
        <PortfolioGrid />
      </div>
    </PageLayout>
  );
};

export default ProjectsPage;
