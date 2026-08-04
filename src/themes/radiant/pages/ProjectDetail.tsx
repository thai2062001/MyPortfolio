import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useTransform, useScroll, useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronRight, ChevronDown, Sparkles, Zap, BarChart3, Target, Award } from "lucide-react";
import { useRef } from "react";
import { Helmet } from "react-helmet-async";

import Navbar from "@/themes/radiant/components/Navbar.tsx";
import { Footer } from "@/themes/radiant/components/Footer.tsx";
import { useLang } from "@/contexts/LangContext";
import { useProjectDetails } from "@/core/hooks/usePortfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import PremiumLoader from "@/components/ui/PremiumLoader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { supabase } from "@/lib/supabase";

import { ProjectMeta } from "@/themes/radiant/components/project/ProjectMeta";
import { ProjectGallery } from "@/themes/radiant/components/project/ProjectGallery";
import { ProjectVideoTestimonial } from "@/themes/radiant/components/project/ProjectVideoTestimonial";
import { ProjectNavigation } from "@/themes/radiant/components/project/ProjectNavigation";
import ReadingProgressBar from "../components/blog/ReadingProgressBar";
import { getLocalizedField, formatLocalizedDate, SupportedLang } from "@/lib/content-utils";

// --- Helpers Outside Component for Performance ---
const cleanNumbering = (text: string) => text.replace(/^\d+[\.\)\s\-\:]+/, '').trim();

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

const ParallaxCover = memo(({ src, alt, onReady, isStatic }: { src: string; alt: string; onReady?: () => void; isStatic: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
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
      className="relative w-full h-[400px] md:h-[800px] rounded-[2.5rem] md:rounded-[5rem] overflow-hidden bg-[#111] shadow-2xl"
    >
      <motion.img 
        style={(!prefersReducedMotion && !isStatic) ? { y, scale } : {}} 
        src={optimizeCloudinary(src, { width: 1600, quality: "best" })} 
        alt={alt} 
        onLoad={onReady} 
        className="absolute inset-0 w-full h-full object-cover scale-[1.01] brightness-[0.96]" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
});

ParallaxCover.displayName = "ParallaxCover";

const StaticCover = memo(({ src, alt, onReady }: { src: string; alt: string; onReady?: () => void }) => {
  return (
    <div className="relative w-full h-[400px] md:h-[800px] rounded-[2.5rem] md:rounded-[5rem] overflow-hidden bg-[#111] shadow-2xl">
      <img
        src={optimizeCloudinary(src, { width: 1600, quality: "best" })}
        alt={alt}
        onLoad={onReady}
        className="absolute inset-0 w-full h-full object-cover scale-[1.01] brightness-[0.96]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />
    </div>
  );
});

StaticCover.displayName = "StaticCover";

const ChallengeSection = memo(({ project, lang, t, isStatic }: any) => {
  const currentLang = lang as SupportedLang;
  
  // High-resilience localized field retrieval
  const currentChallengeRaw = (
    getLocalizedField(project, 'challenge', currentLang) || 
    project.challenge_en || 
    project.challenge || 
    ""
  ).trim();
  
  const currentChallenge = cleanNumbering(currentChallengeRaw);
  
  if (!currentChallengeRaw) return null;

  const structuredChallenge = useMemo(() => {
    try {
      const trimmed = currentChallengeRaw.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : null;
      }
    } catch (e) {}
    return null;
  }, [currentChallengeRaw]);

  const scrollToSolution = () => {
    document.getElementById('solution-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Variant A: Structured Grid
  if (structuredChallenge && structuredChallenge.length > 0) {
    return (
      <section id="challenge-section" className="py-20 md:py-32 relative bg-[#141414] overflow-hidden border-y border-white/5">
        <div className="hidden md:block absolute top-0 right-0 w-[800px] h-[800px] bg-vibe-pink/[0.02] rounded-full blur-[120px] pointer-events-none" />
        
        {/* Navigation Portal */}
        <motion.button 
          onClick={scrollToSolution}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-8 group cursor-pointer"
        >
          <div className="h-32 w-px bg-white/10 group-hover:h-48 group-hover:bg-vibe-pink/50 transition-all duration-700" />
          <span className="font-sans text-[10px] tracking-[0.8em] font-black uppercase text-white/20 group-hover:text-white transition-colors duration-500 [writing-mode:vertical-lr] rotate-180">
            {t("To Solution", "解決策へ", "Tới Giải pháp")}
          </span>
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-vibe-pink/50 group-hover:scale-110 transition-all duration-700">
             <ChevronDown size={14} className="text-white/20 group-hover:text-vibe-pink group-hover:translate-y-1 transition-all duration-500" />
          </div>
        </motion.button>

        <div className="w-full px-6 md:px-12 lg:px-20 mx-auto max-w-[1920px] relative z-10">
          <div className="mb-16 md:mb-20 space-y-4 text-center md:text-left">
            <span className="font-sans text-[10px] tracking-[0.5em] uppercase font-bold text-vibe-pink/60">{t("Obstacles", "課題", "Thách thức")}</span>
            <h2 className="font-display text-5xl md:text-7xl text-white tracking-tighter italic">{t("The Challenge", "課題", "Đề bài")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden">
            {structuredChallenge.map((item: any, i: number) => (
              <div key={i} className={`bg-[#141414] p-8 md:p-12 transition-all duration-700 border-white/5 border ${!isStatic ? 'group hover:bg-white/[0.01]' : ''}`}>
                <div className="space-y-4">
                  <span className="font-mono text-[11px] text-vibe-pink/60">0{i+1}</span>
                  <h4 className="font-serif text-xl md:text-2xl text-white tracking-tight">{cleanNumbering(item.title || "")}</h4>
                  <p className="font-body text-sm md:text-base text-white/60 leading-relaxed font-light">{cleanNumbering(item.content || "")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Variant B: Immersive Parallax (if images available)
  if (project.project_images?.length >= 2) {
    return (
      <section id="challenge-section" className="relative py-24 md:py-64 flex items-center justify-center overflow-hidden bg-[#111]">
        {/* Navigation Portal for Variant B */}
        <motion.button 
          onClick={scrollToSolution}
          className="hidden lg:flex absolute right-12 bottom-24 z-50 items-center gap-6 group cursor-pointer"
        >
          <span className="font-sans text-xs tracking-[0.5em] font-black uppercase text-white/40 group-hover:text-white transition-colors duration-500">
             Discover Solution
          </span>
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:border-vibe-pink group-hover:bg-vibe-pink/10 transition-all duration-700">
             <ChevronDown size={20} className="text-white group-hover:translate-y-1 transition-transform" />
          </div>
        </motion.button>

        <motion.div initial={!isStatic ? { scale: 1.15 } : { scale: 1 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: isStatic ? 0.3 : 2.5 }} className="absolute inset-0 z-0">
          <img src={optimizeCloudinary(project.project_images[1].image_url, { width: 1920, quality: "best" })} alt="" className="w-full h-full object-cover opacity-40 grayscale-[0.3]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-transparent to-[#111] opacity-95" />
          {!isStatic && <div className="absolute inset-0 backdrop-blur-[4px]" />}
        </motion.div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center space-y-10">
          <motion.div initial={isStatic ? { opacity: 1 } : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: isStatic ? 0.3 : 1.2 }} className="space-y-4">
            <span className="font-sans text-[10px] tracking-[0.5em] uppercase font-black text-vibe-pink/60">The Friction</span>
            <h2 className="font-display text-5xl md:text-8xl text-white tracking-tighter italic">{t("The Challenge", "課題", "Đề bài")}</h2>
          </motion.div>
          <div className="w-16 h-px bg-white/10 mx-auto" />
          <p className="font-body text-lg md:text-2xl text-white/70 leading-relaxed font-light italic">{currentChallenge}</p>
        </div>
      </section>
    );
  }

  // Fallback: Minimalist Core
  return (
    <section id="challenge-section" className="py-24 md:py-48 bg-[#161616] text-center border-y border-white/5">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <h2 className="font-display text-5xl md:text-7xl text-white italic">{t("The Challenge", "課題", "Đề bài")}</h2>
        <p className="font-body text-xl text-white/70 leading-relaxed italic">{currentChallenge}</p>
        <button onClick={scrollToSolution} className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30 hover:text-vibe-pink transition-colors">
          ↓ Start Synthesis
        </button>
      </div>
    </section>
  );
});

ChallengeSection.displayName = "ChallengeSection";

const SolutionSection = memo(({ project, lang, t, isStatic, isTablet }: any) => {
  const currentLang = lang as SupportedLang;
  
  // High-resilience localized field retrieval
  const currentSolutionRaw = (
    getLocalizedField(project, 'solution', currentLang) || 
    project.solution_en || 
    project.solution || 
    ""
  ).trim();
  
  const currentSolution = cleanNumbering(currentSolutionRaw);

  if (!currentSolutionRaw) return null;

  const structuredData = useMemo(() => {
    try {
      const trimmed = currentSolutionRaw.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : null;
      }
    } catch (e) {}
    return null;
  }, [currentSolutionRaw]);

  return (
    <section id="solution-section" className="py-20 md:py-48 relative bg-vibe-pink/[0.02] border-y border-vibe-pink/10 overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-20 mx-auto max-w-[1920px] relative z-10 text-center md:text-left">
        <motion.div initial={isStatic ? { opacity: 1 } : { opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col items-center md:items-start gap-6 mb-12 md:mb-16 text-center md:text-left w-full">
           <div className="w-full flex flex-col items-center gap-6">
              <span className="font-artistic text-3xl md:text-5xl text-vibe-pink block italic">{t("The Synthesis", "解決策", "Giải pháp Sáng tạo")}</span>
              <div className="w-px h-16 bg-vibe-pink/20" />
           </div>
        </motion.div>

        {structuredData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {structuredData.map((item: any, i: number) => (
              <motion.div 
                key={i} 
                initial={isStatic ? { opacity: 1 } : { opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }} 
                transition={{ delay: isStatic ? 0 : i * 0.08, duration: 0.6 }}
                whileHover={!isStatic ? "hover" : undefined}
                className="group relative bg-white/80 md:bg-white/40 md:backdrop-blur-xl border border-vibe-pink/10 p-6 md:p-8 xl:p-10 rounded-[2.5rem] xl:rounded-[3rem] flex flex-col items-center md:items-start text-center md:text-left transition-all duration-500 hover:border-vibe-pink/30 hover:bg-white/60 hover:shadow-2xl hover:shadow-vibe-pink/5"
              >
                <div className="absolute inset-0 rounded-[2.5rem] xl:rounded-[3rem] bg-gradient-to-br from-vibe-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="flex items-center gap-4 mb-10 relative z-10">
                  <motion.div 
                    variants={{
                      hover: { scale: 1.1, backgroundColor: "rgba(255, 0, 122, 0.05)", borderColor: "rgba(255, 0, 122, 0.4)" }
                    }}
                    className="w-16 h-16 rounded-full border border-vibe-pink/20 flex items-center justify-center text-vibe-pink font-display text-xl transition-colors duration-500"
                  >
                    0{i+1}
                  </motion.div>
                  
                  <motion.div 
                    variants={{
                      hover: { width: isTablet ? 60 : 120, opacity: 1 }
                    }}
                    initial={{ width: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="h-[1px] bg-gradient-to-r from-vibe-pink to-transparent relative"
                  >
                    <div className="absolute right-0 -top-[2px] w-1.5 h-1.5 rounded-full bg-vibe-pink shadow-[0_0_10px_rgba(255,0,122,0.5)]" />
                  </motion.div>
                </div>
                
                <motion.h4 
                  variants={{
                    hover: { y: -5 }
                  }}
                  className="font-serif text-xl md:text-2xl xl:text-3xl text-heading mb-6 relative z-10 transition-transform duration-500"
                >
                  {cleanNumbering(item.title || "")}
                </motion.h4>
                
                <p className="font-body text-sm md:text-base xl:text-lg text-heading/70 leading-relaxed font-light relative z-10 group-hover:text-heading transition-colors duration-500">
                  {cleanNumbering(item.content || "")}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-display text-2xl md:text-6xl text-heading italic leading-tight">{currentSolution}</h3>
          </div>
        )}
      </div>
    </section>
  );
});

SolutionSection.displayName = "SolutionSection";

// --- Main Optimized Component ---

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const isMobile = useIsMobile();
  const isTabletOrMobile = useIsTablet(); // < 1024px
  
  const [isReady, setIsReady] = useState(false);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  const { data: project, isLoading: isProjectLoading } = useProjectDetails(slug!);

  const handleNavigate = useCallback((targetSlug: string) => {
    setIsReady(false);
    setTimeout(() => {
      navigate(`/project/${targetSlug}`);
    }, 600);
  }, [navigate]);

  // Fetch navigation data only once
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase.from('projects').select('slug, title, is_published').eq('is_published', true).order('year', { ascending: false });
      if (data && isMounted) setAllProjects(data);
    })();
    return () => { isMounted = false; };
  }, []);

  // Performance: Scroll & Readiness
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsReady(false);
  }, [slug]);

  useEffect(() => {
    if (!isProjectLoading) {
      const timer = setTimeout(() => setIsReady(true), 1200);
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
            <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.02] mix-blend-multiply bg-[url('https://res.cloudinary.com/dpdzbuiml/image/upload/v1776056500/grain_texture_lyx1jx.png')] bg-repeat" />
          )}

          <ScrollProgress />

          {/* 1. Hero Reveal Section */}
          <section className="pt-56 md:pt-72 pb-16 md:pb-20 relative z-10 overflow-hidden">
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
             <div className="border-y border-heading/10">
                <ProjectMeta client={project.client} duration={project.duration} role={project.role} year={project.year} tags={project.tags} lang={lang} t={t} />
             </div>
          </section>

          {/* Focal Image */}
          {project.cover_image_url && (
            <section className="container mx-auto px-6 max-w-6xl relative z-10 mb-24 md:mb-48">
              {isTabletOrMobile ? (
                <StaticCover src={project.cover_image_url} alt={projectTitle} onReady={handleImageReady} />
              ) : (
                <ParallaxCover src={project.cover_image_url} alt={projectTitle} onReady={handleImageReady} isStatic={isTabletOrMobile} />
              )}
            </section>
          )}

          {/* 2. Overview Component */}
          {projectOverview && (
            <section className="py-20 md:py-40">
               <div className="container mx-auto px-6 max-w-6xl space-y-16 md:space-y-24">
                 <div className="flex flex-col items-center text-center space-y-8 md:space-y-10 max-w-4xl mx-auto">
                    <motion.div initial={isTabletOrMobile ? { opacity: 1 } : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
                       <span className="font-sans text-[10px] tracking-[0.5em] uppercase font-bold text-heading/30 italic">Perspective</span>
                       <h2 className="font-display text-4xl md:text-7xl text-heading tracking-tighter italic">{t("Project Overview", "プロジェクト概要", "Tổng quan")}</h2>
                       <p className="font-body text-lg md:text-xl text-heading/70 leading-relaxed font-light whitespace-pre-wrap italic">
                         {projectOverview}
                       </p>
                    </motion.div>
                 </div>

                 <motion.div initial={isTabletOrMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="w-full">
                    {project.project_images?.[0] ? (
                      <div className="rounded-[2.5rem] md:rounded-[4.5rem] overflow-hidden shadow-2xl aspect-video bg-[#111]">
                         <img src={optimizeCloudinary(project.project_images[0].image_url, { width: 1400 })} alt="Strategy" className="w-full h-full object-cover scale-[1.01] brightness-[0.98]" />
                      </div>
                    ) : (
                      <div className="rounded-[2.5rem] md:rounded-[4.5rem] bg-[#1a1a1a] aspect-video w-full flex items-center justify-center">
                         <span className="font-artistic text-4xl text-white/5 italic">Creation Flow</span>
                      </div>
                    )}
                 </motion.div>
               </div>
            </section>
          )}

          {/* 3. The Challenge Section */}
          <ChallengeSection project={project} lang={lang} t={t} isStatic={isTabletOrMobile} />

          {/* 4. The Solution Section */}
          <SolutionSection project={project} lang={lang} t={t} isStatic={isTabletOrMobile} isTablet={isTabletOrMobile} />

          {/* 5. Strategy & Impact Section */}
          <section className="py-24 md:py-32 bg-white">
             <div className="container mx-auto px-6 max-w-4xl space-y-32 md:space-y-48">
                {approaches.length > 0 && (
                  <div className="space-y-16">
                     <div className="space-y-6 text-left">
                        <div className="flex items-center gap-4 justify-start">
                           <span className="w-12 h-px bg-sage/30" />
                           <span className="font-sans text-[10px] tracking-[0.4em] uppercase font-black text-sage/60">{t("Methodology", "手法", "Phương pháp luận")}</span>
                        </div>
                        <h2 className="font-display text-6xl md:text-8xl text-heading tracking-tighter leading-[0.9] italic">
                          {t("The", "その", "Những")} <span className="text-sage">Approach.</span>
                        </h2>
                     </div>
                     
                     <div className="space-y-6">
                        {approaches.map((step: any, i: number) => (
                           <motion.div 
                              key={i} 
                              initial={isTabletOrMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }} 
                              whileInView={{ opacity: 1, x: 0 }} 
                              viewport={{ once: true, margin: "-50px" }} 
                              transition={{ delay: i * 0.08, duration: 0.6 }}
                              className="group relative p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-heading/5 hover:border-sage/20 transition-all duration-500 overflow-hidden"
                           >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sage/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                              
                              <div className="flex items-start gap-6 md:gap-8">
                                 <span className="font-display text-4xl md:text-5xl text-sage/30 group-hover:text-sage transition-colors duration-500 shrink-0">0{i+1}.</span>
                                 <p className="font-serif text-lg md:text-xl text-heading/80 leading-relaxed italic group-hover:text-heading transition-colors duration-500">
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
                            <span className="font-sans text-[10px] tracking-[0.4em] uppercase font-black text-vibe-pink/60">{t("Outcome", "成果", "Thành quả")}</span>
                         </div>
                         <h2 className="font-display text-6xl md:text-8xl text-heading tracking-tighter leading-[0.9] italic">
                           {t("The", "その", "Những")} <span className="text-vibe-pink">Results.</span>
                         </h2>
                      </div>
                      
                      {/* BEFORE/AFTER COMPARISON WIDGET */}
                      {results.some(r => r.value?.includes('|') || r.value?.includes('->') || r.value?.includes('→') || r.label?.includes('|') || r.label?.includes('->') || r.label?.includes('→')) ? (
                        <div className="max-w-4xl mx-auto bg-white border border-black/[0.03] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.06)] rounded-[2rem] overflow-hidden grid grid-cols-2">
                          
                          {/* LEFT COLUMN: BEFORE */}
                          <div className="p-6 md:p-16 space-y-12 bg-white text-left">
                            <span className="font-display text-3xl md:text-4xl text-heading/60 italic block leading-none">
                              Before
                            </span>
                            
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
                                  <div key={idx} className="space-y-1 md:space-y-2">
                                    <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-heading font-light tracking-tight">
                                      {beforeVal}
                                    </p>
                                    <p className="font-body text-[11px] sm:text-xs md:text-sm text-heading/45 font-light leading-relaxed">
                                      {beforeLbl}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* RIGHT COLUMN: AFTER */}
                          <div className="p-6 md:p-16 bg-vibe-pink/[0.04] border-l border-vibe-pink/10 space-y-12 text-left">
                            <span className="font-display text-3xl md:text-4xl text-vibe-pink italic block leading-none">
                              After
                            </span>
                            
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
                                    <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#3b1c21] font-light tracking-tight">
                                      {afterVal || beforeVal}
                                    </p>
                                    <p className="font-body text-[11px] sm:text-xs md:text-sm text-[#70494f] font-light leading-relaxed">
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

          {/* 6. Visual Gallery */}
          {project.project_images && project.project_images.length > 2 && (
             <section className="bg-[#111] text-white py-24 md:py-64 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-[1600px] relative z-10 text-center space-y-16 md:space-y-20">
                   <div className="space-y-4">
                     <span className="font-sans text-[10px] tracking-[0.6em] uppercase font-bold text-white/30 italic">Archive</span>
                     <h2 className="font-display text-5xl md:text-9xl tracking-tighter leading-none text-white italic">Curated <span className="text-vibe-pink">Visuals.</span></h2>
                   </div>
                   <ProjectGallery images={project.project_images.slice(2)} isMobile={isTabletOrMobile} t={t} />
                </div>
             </section>
          )}

          {/* 7. Quote Section */}
          {testimonial && (
            <section className="py-20 md:py-64 bg-[#fcfaf7]">
               <div className="container mx-auto px-6 max-w-5xl text-center">
                  <ProjectVideoTestimonial testimonial={testimonial} t={t} />
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
