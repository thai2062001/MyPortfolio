import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useTransform, useScroll, useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronRight, ChevronDown, Sparkles, Zap, BarChart3, Target, Award } from "lucide-react";
import { useRef } from "react";
import { Helmet } from "react-helmet-async";

import Navbar from "@/themes/radiant/components/Navbar.tsx";
import { Footer } from "@/themes/radiant/components/Footer.tsx";
import { useLang } from "@/contexts/LangContext";
import { useProjectDetails, useProjects } from "@/core/hooks/usePortfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import PremiumLoader from "@/components/ui/PremiumLoader";
import ScrollProgress from "@/components/ui/ScrollProgress";

import { ProjectMeta } from "@/themes/radiant/components/project/ProjectMeta";
import { ProjectGallery } from "@/themes/radiant/components/project/ProjectGallery";
import { ProjectVideoTestimonial } from "@/themes/radiant/components/project/ProjectVideoTestimonial";
import { ProjectNavigation } from "@/themes/radiant/components/project/ProjectNavigation";
import ReadingProgressBar from "../components/blog/ReadingProgressBar";
import { getLocalizedField, formatLocalizedDate, SupportedLang } from "@/lib/content-utils";

// --- Helpers Outside Component for Performance ---
const cleanNumbering = (text: string) => text.replace(/^\d+[\.\)\s\-\:]+/, '').trim();
const LABEL_CLASS = "font-artistic text-2xl tracking-normal normal-case font-normal";

// --- Optimized Sub-Components ---

const BreadcrumbNav = memo(({ title, isMobile }: { title: string; isMobile: boolean }) => {
  return (
    <motion.nav 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 1 }}
      className="flex items-center justify-start gap-2 mb-10 w-full"
    >
      <Link to="/" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-heading/70 hover:text-vibe-pink transition-colors">
        Home
      </Link>
      <span className="text-heading/70 text-[8px]">/</span>
      <Link to="/portfolio" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-heading/70 hover:text-vibe-pink transition-colors">
        Portfolio
      </Link>
      <span className="text-heading/70 text-[8px]">/</span>
      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-vibe-pink/90 truncate max-w-[150px] md:max-w-none">
        {title}
      </span>
    </motion.nav>
  );
});

BreadcrumbNav.displayName = "BreadcrumbNav";

// Fallback image handler
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop";
};

const ParallaxCover = memo(({ src, alt, onReady, isStatic }: { src: string; alt: string; onReady?: () => void; isStatic: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobileOrTablet = useIsTablet();
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);

  return (
    <motion.div 
      ref={containerRef} 
      initial={isStatic ? { opacity: 1 } : { opacity: 0, scale: 0.98 }} 
      whileInView={{ opacity: 1, scale: 1 }} 
      viewport={{ once: true }} 
      transition={{ duration: isStatic ? 0.3 : 1.4, ease: [0.22, 1, 0.36, 1] }} 
      className="relative w-full h-[400px] md:h-[800px] rounded-[2.5rem] md:rounded-[5rem] overflow-hidden bg-[#111] shadow-2xl will-change-transform"
    >
      <motion.img 
        style={(!prefersReducedMotion && !isStatic) ? { y, scale } : {}} 
        src={optimizeCloudinary(src, { width: isMobileOrTablet ? 800 : 1600, quality: "best" })} 
        alt={alt} 
        onLoad={onReady} 
        onError={handleImageError}
        loading="eager"
        {...({ fetchPriority: "high" } as any)}
        className="absolute inset-0 w-full h-full object-cover scale-[1.01] brightness-[0.96] will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
});

ParallaxCover.displayName = "ParallaxCover";

const StaticCover = memo(({ src, alt, onReady }: { src: string; alt: string; onReady?: () => void }) => {
  const isMobileOrTablet = useIsTablet();
  return (
    <div className="relative w-full h-[400px] md:h-[800px] rounded-[2.5rem] md:rounded-[5rem] overflow-hidden bg-[#111] shadow-2xl">
      <img
        src={optimizeCloudinary(src, { width: isMobileOrTablet ? 800 : 1600, quality: "best" })}
        alt={alt}
        onLoad={onReady}
        onError={handleImageError}
        loading="eager"
        {...({ fetchPriority: "high" } as any)}
        className="absolute inset-0 w-full h-full object-cover scale-[1.01] brightness-[0.96]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />
    </div>
  );
});

StaticCover.displayName = "StaticCover";

const TechStackSection = memo(({ tags, lang, t }: { tags: any[]; lang: string; t: any }) => {
  if (!tags || tags.length === 0) return null;
  
  const currentLang = lang as SupportedLang;
  const tagDetails: Record<string, { desc: string; descEn: string; cat: string }> = {
    'kuroco': { desc: 'Headless CMS API-driven quản lý nội dung.', descEn: 'Headless CMS driving data API.', cat: 'CMS / Backend' },
    'nestjs': { desc: 'Framework Node.js xây dựng API Restful mạnh mẽ.', descEn: 'Robust NestJS Node.js API.', cat: 'Backend API' },
    'scss': { desc: 'Ngôn ngữ tiền xử lý CSS thiết kế giao diện linh hoạt.', descEn: 'Styling preprocessor.', cat: 'Frontend Styling' },
    'swagger api': { desc: 'Tài liệu hóa và chuẩn hóa giao tiếp API.', descEn: 'API documentation & standardization.', cat: 'API Specs' },
    'next.js': { desc: 'Framework React tối ưu hóa SEO và hiệu năng tải trang.', descEn: 'React framework optimized for SEO & speed.', cat: 'Frontend Framework' },
    'typescript': { desc: 'Siêu tập tĩnh của JS giúp tăng độ tin cậy của code.', descEn: 'Static typing for code reliability.', cat: 'Language' },
  };

  return (
    <section className="py-20 bg-white border-t border-black/[0.03] relative z-10">
      <div className="container mx-auto px-6 max-w-6xl space-y-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-4 justify-start">
             <span className="w-12 h-px bg-sage/30" />
             <span className={`${LABEL_CLASS} text-sage/60`}>{t("Stack", "TECHNOLOGIES", "Công nghệ")}</span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl text-heading tracking-tighter leading-none italic">
            System <span className="text-sage">Architecture.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tags.map((tag: any, idx: number) => {
            const tagName = (tag.name_en || tag.name || "").trim().toLowerCase();
            const matchingDetail = Object.entries(tagDetails).find(([key]) => tagName.includes(key))?.[1];
            
            // Get category: priority is database field (if defined in the future) then config file
            const dbCat = getLocalizedField(tag, 'category', currentLang) || tag.category;
            const cat = dbCat || matchingDetail?.cat || "Technology";
            
            // Get description: priority is database description then config file fallback
            const dbDesc = getLocalizedField(tag, 'description', currentLang) || tag.description;
            const desc = dbDesc || (lang === "vi" 
              ? (matchingDetail?.desc || "Công nghệ lõi tích hợp tối ưu hóa hiệu năng.")
              : (matchingDetail?.descEn || "Core technology integrated for performance."));

             return (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03, duration: 0.4 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02, 
                  borderColor: "rgba(102, 120, 107, 0.4)",
                  boxShadow: "0 20px 40px -15px rgba(102, 120, 107, 0.12)"
                }}
                className="group relative p-8 rounded-[2rem] bg-[#fcfaf7] border border-black/[0.04] cursor-default overflow-hidden transition-colors duration-250"
              >
                {/* Subtle Ambient Hover Glow */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-sage/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <span className="text-[10px] font-display font-bold tracking-wider text-sage/75 uppercase block mb-4 not-italic relative z-10">
                  {cat}
                </span>
                <h4 className="font-display text-xl text-heading font-black mb-2 tracking-tight group-hover:text-sage transition-colors duration-200 relative z-10">
                  {tag.name_en || tag.name}
                </h4>
                <p className="font-body text-xs text-heading/50 leading-relaxed font-light relative z-10">
                  {desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
TechStackSection.displayName = "TechStackSection";

const ChallengeSolutionSection = memo(({ project, lang, t, isStatic }: any) => {
  const currentLang = lang as SupportedLang;

  const currentChallengeRaw = (
    getLocalizedField(project, 'challenge', currentLang) || 
    project.challenge_en || 
    project.challenge || 
    ""
  ).trim();

  const currentSolutionRaw = (
    getLocalizedField(project, 'solution', currentLang) || 
    project.solution_en || 
    project.solution || 
    ""
  ).trim();

  if (!currentChallengeRaw && !currentSolutionRaw) return null;

  const structuredChallenge = (() => {
    try {
      if (currentChallengeRaw.startsWith('[') || currentChallengeRaw.startsWith('{')) {
        return JSON.parse(currentChallengeRaw);
      }
    } catch (e) {}
    return null;
  })();

  const structuredSolution = (() => {
    try {
      if (currentSolutionRaw.startsWith('[') || currentSolutionRaw.startsWith('{')) {
        return JSON.parse(currentSolutionRaw);
      }
    } catch (e) {}
    return null;
  })();

  return (
    <section className="border-y border-black/[0.03] overflow-hidden w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
        {/* CHALLENGE COLUMN - Dark & Dramatic */}
        <div className="lg:col-span-6 bg-[#141414] text-white py-20 px-6 md:px-12 lg:px-20 relative overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5">
          <div className="hidden lg:block absolute top-0 right-0 w-[400px] h-[400px] bg-vibe-pink/[0.03] rounded-full blur-[100px] pointer-events-none" />
          
          <div className="space-y-12">
            <div className="space-y-4">
              <span className={`${LABEL_CLASS} text-vibe-pink/60`}>
                {t("Obstacles", "OBSTACLES", "Thách thức")}
              </span>
              <h2 className="font-display text-5xl md:text-7xl text-white tracking-tighter italic">
                The <span className="text-vibe-pink">Challenge.</span>
              </h2>
            </div>

            {structuredChallenge && Array.isArray(structuredChallenge) ? (
              <div className="space-y-6">
                {structuredChallenge.map((item: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:border-vibe-pink/30 hover:bg-white/[0.05] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] group cursor-default shadow-lg shadow-black/10">
                      <div className="flex gap-6 items-center">
                        <span className="font-display text-4xl font-light text-vibe-pink/50 select-none">0{i+1}</span>
                        <div className="space-y-3">
                          <h4 className="font-display text-lg md:text-xl text-white font-bold tracking-tight">
                            {cleanNumbering(item.title || "")}
                          </h4>
                          <p className="font-body text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
                            {cleanNumbering(item.content || "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="font-body text-base md:text-lg text-zinc-300 leading-relaxed italic">
                {cleanNumbering(currentChallengeRaw)}
              </p>
            )}
          </div>
        </div>

        {/* SOLUTION COLUMN - Bright & Technical */}
        <div className="lg:col-span-6 bg-[#fcfaf7] py-20 px-6 md:px-12 lg:px-20 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className={`${LABEL_CLASS} text-sage/60`}>
                {t("Synthesis", "SYNTHESIS", "Giải pháp")}
              </span>
              <h2 className="font-display text-5xl md:text-7xl text-heading tracking-tighter italic">
                The <span className="text-sage">Solution.</span>
              </h2>
            </div>

            {structuredSolution && Array.isArray(structuredSolution) ? (
              <div className="space-y-6">
                {structuredSolution.map((item: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="p-8 rounded-[2rem] bg-white border border-black/[0.06] transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-sage/[0.03] hover:border-sage/35 hover:shadow-[0_20px_40px_rgba(102,120,107,0.08)] group cursor-default shadow-sm">
                      <div className="flex gap-6 items-center">
                        <span className="font-display text-4xl font-light text-sage/40 select-none">0{i+1}</span>
                        <div className="space-y-3">
                          <h4 className="font-display text-lg md:text-xl text-heading font-bold tracking-tight">
                            {cleanNumbering(item.title || "")}
                          </h4>
                          <p className="font-body text-xs md:text-sm text-[#555] leading-relaxed font-light">
                            {cleanNumbering(item.content || "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="font-body text-base md:text-lg text-heading/70 leading-relaxed italic">
                {cleanNumbering(currentSolutionRaw)}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});
ChallengeSolutionSection.displayName = "ChallengeSolutionSection";

// --- Main Optimized Component ---

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const isMobile = useIsMobile();
  const isTabletOrMobile = useIsTablet(); // < 1024px
  
  const [isReady, setIsReady] = useState(false);

  const { data: project, isLoading: isProjectLoading } = useProjectDetails(slug!);
  const { data: allProjectsData } = useProjects(false);
  const allProjects = allProjectsData || [];

  const handleNavigate = useCallback((targetSlug: string) => {
    setIsReady(false);
    setTimeout(() => {
      navigate(`/project/${targetSlug}`);
    }, 600);
  }, [navigate]);

  // Performance: Scroll & Readiness
  useEffect(() => {
    // Scroll asynchronously in a requestAnimationFrame to avoid visual jank during page transitions
    const handleScroll = () => {
      window.scrollTo({ top: 0, behavior: "instant" as any });
    };
    requestAnimationFrame(() => {
      requestAnimationFrame(handleScroll);
    });
    setIsReady(false);
  }, [slug]);

  useEffect(() => {
    if (!isProjectLoading) {
      const timer = setTimeout(() => setIsReady(true), 400);
      return () => clearTimeout(timer);
    }
  }, [isProjectLoading]);

  const handleImageReady = useCallback(() => {
    setTimeout(() => setIsReady(true), 150);
  }, []);

  const { prevProject, nextProject } = useMemo(() => {
    if (allProjects.length <= 1) return { prevProject: null, nextProject: null };
    const idx = allProjects.findIndex((p: any) => p.slug === slug);
    if (idx === -1) return { prevProject: null, nextProject: null };
    
    return {
      prevProject: idx > 0 ? allProjects[idx - 1] : allProjects[allProjects.length - 1],
      nextProject: idx < allProjects.length - 1 ? allProjects[idx + 1] : allProjects[0]
    };
  }, [allProjects, slug]);

  const currentLang = lang as SupportedLang;
  const projectTitle = useMemo(() => getLocalizedField(project, 'title', currentLang), [project, currentLang]);
  const projectDescription = useMemo(() => getLocalizedField(project, 'description', currentLang), [project, currentLang]);
  const projectOverview = useMemo(() => getLocalizedField(project, 'overview', currentLang), [project, currentLang]);

  const approaches = useMemo(() => 
    project?.project_approaches
      ?.sort((a: any, b: any) => a.order_index - b.order_index)
      .map((a: any) => ({ content: cleanNumbering(getLocalizedField(a, 'approach', currentLang)) })) || [], 
  [project?.project_approaches, currentLang]);

  const results = useMemo(() => 
    project?.project_results
      ?.sort((a: any, b: any) => a.order_index - b.order_index)
      .map((r: any) => ({ value: r.value, label: cleanNumbering(getLocalizedField(r, 'label', currentLang)) })) || [], 
  [project?.project_results, currentLang]);

  const resultIcons = [Zap, BarChart3, Target, Award, Sparkles];
  const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

  const testimonial = useMemo(() => project?.project_testimonials?.[0] || null, [project?.project_testimonials]);
  const isActuallyLoading = isProjectLoading || !isReady;

  if (!isProjectLoading && !project) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fcfaf7]">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-serif text-heading">{t("Project Not Found", "プロジェクトが見 tự chọn")}</h1>
          <Link to="/portfolio" className="text-sage hover:text-gold transition-colors text-sm tracking-widest uppercase">← {t("Back to Portfolio", "戻る")}</Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project?.title || "Project"} | Portfolio</title>
        <meta name="description" content={project?.short_description || ""} />
      </Helmet>

      <Navbar />

      <AnimatePresence mode="wait">
        {isActuallyLoading && isTabletOrMobile && (
          <PremiumLoader text={lang === "vi" ? "Mở không gian dự án..." : "Opening Creative Space..."} />
        )}
      </AnimatePresence>

      <motion.div initial={{ y: 0 }} animate={{ y: isActuallyLoading ? 0 : "-100%" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 z-[10000] bg-[#fcfaf7] pointer-events-none" />

      {project && (
        <main className="bg-[#fcfaf7] relative overflow-hidden min-h-screen selection:bg-sage/20">
          {(!isTabletOrMobile) && (
            <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.02] mix-blend-multiply bg-[url('https://res.cloudinary.com/dpdzbuiml/image/upload/v1785488719/common/grain-noise.png')] bg-repeat" />
          )}

          <ScrollProgress />

          {/* 1. Hero Reveal Section */}
          <section className="pt-12 md:pt-56 pb-16 md:pb-20 relative z-10 overflow-hidden">
            <div className="container mx-auto px-6 max-w-5xl flex flex-col items-center">
              
              {/* Left-Aligned Breadcrumb relative to the 5xl container */}
              <BreadcrumbNav title={project.title} isMobile={isMobile} />

              <motion.div initial={isTabletOrMobile ? { opacity: 1 } : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="space-y-6 text-center w-full">
                <div className="inline-flex items-center gap-3 md:gap-4 justify-center">
                  <div className="w-6 md:w-8 h-px bg-vibe-pink/40" />
                  <span className="font-artistic text-xl md:text-3xl text-vibe-pink italic">{project.project_categories?.name}</span>
                  <div className="w-6 md:w-8 h-px bg-vibe-pink/40" />
                </div>
                
                <h1 className="font-display text-5xl md:text-9xl text-heading leading-[0.9] tracking-tighter mx-auto max-w-5xl text-center">
                   {lang !== "en" ? projectTitle : (
                      <>
                        {projectTitle.split(" ").slice(0, -1).join(" ")}{" "}
                        <span className="font-artistic italic text-sage/70 lowercase text-6xl md:text-[11rem] block md:inline">
                          {projectTitle.split(" ").pop()}
                        </span>
                      </>
                   )}
                </h1>

                {projectDescription && (
                  <motion.p initial={isTabletOrMobile ? { opacity: 1 } : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1.5 }} className="font-body text-lg md:text-2xl text-heading/50 max-w-2xl text-center mx-auto font-light italic leading-relaxed">
                    {projectDescription}
                  </motion.p>
                )}
              </motion.div>
            </div>
          </section>

          {/* Data Meta */}
          <section className="relative z-20 pb-20 md:pb-24 container mx-auto px-6 max-w-6xl">
             <ProjectMeta client={project.client} duration={project.duration} role={project.role} year={project.year} tags={project.tags} lang={lang} t={t} />
          </section>

          {/* 2. Overview Component */}
          {projectOverview && (
            <section className="pt-16 pb-20 md:pt-16 md:pb-40">
               <div className="container mx-auto px-6 max-w-6xl space-y-16 md:space-y-24">
                 <div className="flex flex-col items-center text-center space-y-8 md:space-y-10 max-w-4xl mx-auto">
                    <motion.div initial={isTabletOrMobile ? { opacity: 1 } : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
                       <span className={`${LABEL_CLASS} text-heading/40`}>Perspective</span>
                       <h2 className="font-display text-4xl md:text-7xl text-heading tracking-tighter italic">{t("Project Overview", "プロジェクト概要", "Tổng quan")}</h2>
                       <p className="font-body text-lg md:text-xl text-heading/70 leading-relaxed font-light whitespace-pre-wrap italic">
                         {projectOverview}
                       </p>
                    </motion.div>
                 </div>

                 {project.cover_image_url ? (
                   <div className="w-full relative z-10">
                     {isTabletOrMobile ? (
                       <StaticCover src={project.cover_image_url} alt={projectTitle} onReady={handleImageReady} />
                     ) : (
                       <ParallaxCover src={project.cover_image_url} alt={projectTitle} onReady={handleImageReady} isStatic={isTabletOrMobile} />
                     )}
                   </div>
                 ) : (
                   <motion.div initial={isTabletOrMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="w-full">
                      <div className="rounded-[2.5rem] md:rounded-[4.5rem] bg-[#1a1a1a] aspect-video w-full flex items-center justify-center">
                         <span className="font-artistic text-4xl text-white/5 italic">Creation Flow</span>
                      </div>
                   </motion.div>
                 )}
               </div>
            </section>
          )}

          {/* Tech Stack Section */}
          <TechStackSection tags={project.tags} lang={lang} t={t} />

          {/* 3. Challenge & Solution Section */}
          <ChallengeSolutionSection project={project} lang={lang} t={t} isStatic={isTabletOrMobile} />

          {/* 5. Strategy & Impact Section */}
          <section className="py-24 md:py-32 bg-white">
             <div className="container mx-auto px-6 max-w-4xl space-y-32 md:space-y-48">
                {approaches.length > 0 && (
                  <div className="space-y-16">
                     <div className="space-y-6 text-left">
                        <div className="flex items-center gap-4 justify-start">
                           <span className="w-12 h-px bg-sage/30" />
                           <span className={`${LABEL_CLASS} text-sage/60`}>{t("Methodology", "手法", "Phương pháp luận")}</span>
                        </div>
                        <h2 className="font-display text-6xl md:text-8xl text-heading tracking-tighter leading-[0.9] italic">
                          {t("The", "その", "Những")} <span className="text-sage">Approach.</span>
                        </h2>
                     </div>
                     
                     <div className="space-y-6">
                        {approaches.map((step: any, i: number) => (
                           <motion.div 
                              key={i} 
                              initial={isTabletOrMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} 
                              whileInView={{ opacity: 1, y: 0 }} 
                              viewport={{ once: true, margin: "-20px" }} 
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="group relative p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-heading/5 xl:hover:border-sage/20 transition-all duration-500 overflow-hidden"
                           >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sage/5 to-transparent rounded-bl-full opacity-0 xl:group-hover:opacity-100 transition-opacity duration-700" />
                              
                              <div className="flex items-start gap-6 md:gap-8">
                                 <span className="font-display text-4xl md:text-5xl text-sage shrink-0">0{i+1}.</span>
                                 <p className="font-serif text-lg md:text-xl text-heading leading-relaxed italic">
                                    {step.content}
                                 </p>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </div>
                )}
                {results.length > 0 && (
                  <div className="space-y-16">
                      <div className="space-y-6 text-left">
                         <div className="flex items-center gap-4 justify-start">
                            <span className="w-12 h-px bg-vibe-pink/30" />
                            <span className={`${LABEL_CLASS} text-vibe-pink/60`}>{t("Outcome", "成果", "Thành quả")}</span>
                         </div>
                         <h2 className="font-display text-6xl md:text-8xl text-heading tracking-tighter leading-[0.9] italic">
                           {t("The", "その", "Những")} <span className="text-vibe-pink">Results.</span>
                         </h2>
                      </div>
                      
                      {/* BEFORE/AFTER COMPARISON WIDGET */}
                      {results.some(r => r.value?.includes('|') || r.value?.includes('->') || r.value?.includes('→') || r.label?.includes('|') || r.label?.includes('->') || r.label?.includes('→')) ? (
                        <div className="max-w-4xl mx-auto bg-white border border-black/[0.08] shadow-[0_30px_80px_-25px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden grid grid-cols-1 md:grid-cols-2 relative group transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.005] hover:border-vibe-pink/35 hover:shadow-[0_40px_100px_-20px_rgba(255,0,122,0.06)]">
                          {/* Absolute Center Divider for Desktop */}
                          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-black/[0.05] z-10" />

                          {/* LEFT COLUMN: BEFORE */}
                          <div className="p-8 md:p-16 space-y-12 bg-[#faf9f6]/50 text-left relative">
                            <div className="flex items-center justify-between">
                              <span className="font-display text-2xl md:text-3xl text-heading/40 italic block leading-none">
                                Before
                              </span>
                              <span className="w-2.5 h-2.5 rounded-full bg-heading/20 animate-pulse" />
                            </div>
                            
                            <div className="space-y-10 md:space-y-12">
                              {results.map((r: any, idx: number) => {
                                const splitBeforeAfter = (text: string) => {
                                  if (!text) return ["", ""];
                                  if (text.includes('|')) return text.split('|').map(s => s.trim());
                                  if (text.includes('->')) return text.split('->').map(s => s.trim());
                                  if (text.includes('→')) return text.split('→').map(s => s.trim());
                                  return [text.trim(), ""];
                                };
                                const [beforeVal] = splitBeforeAfter(r.value);
                                const [beforeLbl] = splitBeforeAfter(r.label);
                                
                                return (
                                  <div key={idx} className="space-y-1 md:space-y-2 group/item">
                                    <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-heading/60 font-light tracking-tight transition-all duration-300">
                                      {beforeVal}
                                    </p>
                                    <p className="font-body text-[11px] sm:text-xs md:text-sm text-heading/40 font-light leading-relaxed">
                                      {beforeLbl}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* RIGHT COLUMN: AFTER */}
                          <div className="p-8 md:p-16 bg-vibe-pink/[0.01] md:bg-vibe-pink/[0.02] border-t md:border-t-0 md:border-l border-black/[0.08] space-y-12 text-left relative">
                            <div className="flex items-center justify-between">
                              <span className="font-display text-2xl md:text-3xl text-vibe-pink font-bold italic block leading-none">
                                After
                              </span>
                              <span className="px-3 py-1 rounded-full bg-vibe-pink/10 text-vibe-pink text-[11px] font-label font-bold tracking-wider uppercase">
                                Optimized
                              </span>
                            </div>
                            
                            <div className="space-y-10 md:space-y-12">
                              {results.map((r: any, idx: number) => {
                                const splitBeforeAfter = (text: string) => {
                                  if (!text) return ["", ""];
                                  if (text.includes('|')) return text.split('|').map(s => s.trim());
                                  if (text.includes('->')) return text.split('->').map(s => s.trim());
                                  if (text.includes('→')) return text.split('→').map(s => s.trim());
                                  return [text.trim(), ""];
                                };
                                const [beforeVal] = splitBeforeAfter(r.value);
                                const [beforeLbl] = splitBeforeAfter(r.label);
                                const [, afterVal] = splitBeforeAfter(r.value);
                                const [, afterLbl] = splitBeforeAfter(r.label);
                                
                                return (
                                  <div key={idx} className="space-y-1 md:space-y-2">
                                    <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-heading font-black tracking-tight">
                                      {afterVal || beforeVal}
                                    </p>
                                    <p className="font-body text-[11px] sm:text-xs md:text-sm text-heading/70 font-medium leading-relaxed">
                                      {afterLbl || beforeLbl}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                        </div>
                      ) : (
                        // Standard Grid Cards (if no splits)
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                           {results.map((r: any, i: number) => {
                              let rawLabel = r.label || "";
                              let mainLabel = rawLabel;
                              let subDesc = "";
                              
                              const pipeParts = rawLabel.split('|');
                              if (pipeParts.length > 1) {
                                mainLabel = pipeParts[0].trim();
                                subDesc = pipeParts[1].trim();
                              } else {
                                const newlineParts = rawLabel.split('\n');
                                if (newlineParts.length > 1) {
                                  mainLabel = newlineParts[0].trim();
                                  subDesc = newlineParts[1].trim();
                                } else {
                                  const commaIndex = rawLabel.indexOf(', ');
                                  if (commaIndex !== -1) {
                                    mainLabel = rawLabel.substring(0, commaIndex).trim();
                                    subDesc = rawLabel.substring(commaIndex + 2).trim();
                                  }
                                }
                              }

                              const Icon = resultIcons[i % resultIcons.length];

                              return (
                                 <motion.div 
                                    key={i} 
                                    initial={isTabletOrMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} 
                                    whileInView={{ opacity: 1, y: 0 }} 
                                    viewport={{ once: true, margin: "-50px" }} 
                                    transition={{ delay: i * 0.08, duration: 0.6 }}
                                    className="group relative py-16 px-8 md:py-24 md:px-12 min-h-[380px] md:min-h-[480px] lg:min-h-[520px] rounded-[3rem] flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500 bg-white border border-black/[0.03] shadow-[0_20px_50px_-25px_rgba(0,0,0,0.05)] hover:border-vibe-pink/20 hover:shadow-2xl hover:shadow-vibe-pink/5"
                                 >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-vibe-pink/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    
                                    {/* Center Icon */}
                                    <div className="w-10 h-10 rounded-full bg-vibe-pink/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                       <Icon className="text-vibe-pink" size={18} />
                                    </div>
                                    
                                    {r.value ? (
                                      <>
                                        {/* Large Serif metric value - dark text color */}
                                        <p className="font-display text-5xl md:text-6xl lg:text-7xl text-heading mb-6 tracking-tighter group-hover:scale-105 transition-transform duration-500">
                                          {r.value}
                                        </p>
                                        
                                        {/* Main Label */}
                                        <p className="font-body text-base font-semibold text-heading/80 px-4 leading-relaxed mb-2">
                                          {mainLabel}
                                        </p>
                                        
                                        {/* Sub-description */}
                                        {subDesc && (
                                          <p className="font-body text-xs text-heading/45 px-4 leading-relaxed font-light">
                                            {subDesc}
                                          </p>
                                        )}
                                      </>
                                    ) : (
                                      <div className="space-y-6">
                                        <p className="font-serif text-2xl sm:text-3xl md:text-[2.2rem] lg:text-[2.4rem] text-heading/80 leading-[1.3] md:leading-[1.25] italic font-light px-2 group-hover:text-heading transition-colors duration-500">
                                          {mainLabel}
                                        </p>
                                        {subDesc && (
                                          <p className="font-body text-xs text-heading/45 px-4 leading-relaxed font-light">
                                            {subDesc}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                 </motion.div>
                              );
                           })}
                        </div>
                      )}
                  </div>
                )}
             </div>
          </section>

          {/* 7. Quote Section */}
          {testimonial && (
            <section className="py-20 md:py-64 bg-[#fcfaf7]">
               <div className="container mx-auto px-6 max-w-5xl text-center">
                  <ProjectVideoTestimonial testimonial={testimonial} t={t} />
               </div>
            </section>
          )}

          {/* 6. Visual Gallery */}
          {project.project_images && project.project_images.length > 0 && (
             <section className="bg-[#111] text-white py-24 md:py-64 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-[1600px] relative z-10 text-center space-y-16 md:space-y-20">
                   <div className="space-y-4">
                      <span className={`${LABEL_CLASS} text-white/40`}>Archive</span>
                     <h2 className="font-display text-5xl md:text-9xl tracking-tighter leading-none text-white italic">Curated <span className="text-vibe-pink">Visuals.</span></h2>
                   </div>
                   <ProjectGallery images={project.project_images} isMobile={isTabletOrMobile} />
                </div>
             </section>
          )}

          {/* Navigation Section */}
          {(prevProject || nextProject) && (
            <section className="border-t border-heading/10 bg-white py-24 md:py-32">
               <div className="container mx-auto px-6 max-w-6xl">
                  <ProjectNavigation 
                    prevProject={prevProject} 
                    nextProject={nextProject} 
                    onNavigate={handleNavigate} 
                    t={t} 
                  />
               </div>
            </section>
          )}
        </main>
      )}

      <Footer />
    </>
  );
};

export default memo(ProjectDetail);
