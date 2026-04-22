import { useState, useEffect, memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import { useProjects } from "@/core/hooks/usePortfolio";
import { useIsTablet } from "@/hooks/use-mobile";
import ProjectCard from "./ProjectCard";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { optimizeCloudinary } from "@/lib/cloudinary";
import SectionHeader from "./shared/SectionHeader";

interface PortfolioGridProps {
  onNavigate?: (slug: string) => void;
  featured?: boolean;
}

const PortfolioGrid = memo(({ onNavigate }: PortfolioGridProps) => {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const isTablet = useIsTablet();

  const isArchivePage = location.pathname === "/projects";
  const projectsQuery = useProjects(!isArchivePage);
  const projects = useMemo(() => projectsQuery.data || [], [projectsQuery.data]);
  const isLoading = projectsQuery.isLoading;
  const shouldAnimateGrid = !isTablet;

  const initialCount = isArchivePage ? 8 : 3;
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const hasMore = projects.length > visibleCount;

  // LCP Optimization
  useEffect(() => {
    if (projects.length > 0) {
      projects.slice(0, 3).forEach((project, index) => {
        const optimizedUrl = optimizeCloudinary(project.cover_image_url, { width: 800 });
        const preloadId = `portfolio-preload-${index}`;
        if (!document.getElementById(preloadId)) {
          const link = document.createElement('link');
          link.id = preloadId;
          link.rel = 'preload';
          link.as = 'image';
          link.href = optimizedUrl;
          // @ts-expect-error - fetchpriority is a new attribute
          link.fetchpriority = 'high';
          document.head.appendChild(link);
        }
      });
    }
  }, [projects]);

  // Infinite Scroll for Archive Page
  useEffect(() => {
    if (!hasMore || !isArchivePage) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + 4, projects.length));
        }
      },
      { rootMargin: "400px" }
    );
    
    const target = document.querySelector("#portfolio-observer");
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isArchivePage, projects.length]);

  const visibleProjects = projects.slice(0, visibleCount);

  if (isLoading) {
    return (
      <section className="py-20" id="works">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-6">
              <div className="aspect-[4/5] bg-stone-100 rounded-2xl animate-pulse" />
              <div className="h-20 bg-stone-50 rounded-xl animate-pulse mx-4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-48 lg:py-64 bg-background relative overflow-hidden" id="works">
      <div className="container mx-auto px-6 relative z-10">
        {!isArchivePage && (
          <SectionHeader
            align="between"
            className="mb-12 md:mb-40 lg:mb-48"
            eyebrow={
                <div className="flex items-center gap-4">
                  <span className="w-12 h-[1px] bg-foreground/20" />
                  <span className="font-display text-[11px] tracking-[0.4em] uppercase font-bold text-sage">
                      {t("Works", "作品", "Dự án")}
                  </span>
                </div>
            }
            title={<>A Collection Of <span className="font-artistic italic text-sage/60 lowercase">Impact.</span></>}
            titleClassName="font-display text-5xl md:text-8xl lg:text-9xl font-light text-heading tracking-tighter leading-tight md:leading-[0.85]"
            description={
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl md:text-6xl text-heading/10">{projects.length < 10 ? `0${projects.length}` : projects.length}</span>
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase font-medium text-muted-foreground italic">Stories</span>
                </div>
            }
          />
        )}

        {shouldAnimateGrid ? (
          <motion.div
            variants={staggerContainer(0.05, 0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-32 max-w-[1400px] mx-auto"
          >
            {visibleProjects.map((p, i) => {
              return (
                <motion.div key={p.slug} variants={fadeIn("up", 0)}>
                  <ProjectCard
                    slug={p.slug}
                    title={p.title}
                    cover_image_url={p.cover_image_url}
                    tall={p.tall}
                    category_name={p.project_categories?.name}
                    short_description={p.short_description}
                    tags={p.tags}
                    priority={i < 3}
                    onClick={(slug) => onNavigate ? onNavigate(slug) : navigate(`/project/${slug}`)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-32 max-w-[1400px] mx-auto">
            {visibleProjects.map((p, i) => {
              return (
                <div key={p.slug}>
                  <ProjectCard
                    slug={p.slug}
                    title={p.title}
                    cover_image_url={p.cover_image_url}
                    tall={p.tall}
                    category_name={p.project_categories?.name}
                    short_description={p.short_description}
                    tags={p.tags}
                    priority={i < 3}
                    onClick={(slug) => onNavigate ? onNavigate(slug) : navigate(`/project/${slug}`)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {!isArchivePage && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-32 text-center"
          >
            <button 
              onClick={() => navigate('/projects')}
              className="font-display text-[14px] tracking-[0.5em] uppercase font-bold text-heading hover:text-vibe-pink transition-all duration-300 border-b border-heading/20 hover:border-vibe-pink pb-2"
            >
              {t("View All Projects", "すべてのプロジェクトを表示", "Xem tất cả dự án")}
            </button>
          </motion.div>
        )}

        {isArchivePage && hasMore && (
           <div id="portfolio-observer" className="h-20 w-full flex items-center justify-center mt-32">
              <div className="w-8 h-8 rounded-full border-2 border-sage/20 border-t-sage animate-spin" />
           </div>
        )}
      </div>
    </section>
  );
});

PortfolioGrid.displayName = "PortfolioGrid";
export default PortfolioGrid;
