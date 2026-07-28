import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import PageLayout from "@/themes/radiant/components/PageLayout";
import ContactSection from "@/themes/radiant/components/ContactSection";
import ApplicationCard from "@/themes/radiant/components/ApplicationCard";
import { HighlightImageGallery } from "@/themes/radiant/components/HighlightImageGallery";
import { portfolioApi } from "@/core/api/portfolio";
import { Trophy, BarChart, Zap, Sparkles } from "lucide-react";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLang } from "@/contexts/LangContext";
import { getLocalizedField, SupportedLang } from "@/lib/content-utils";
import { fadeIn, staggerContainer } from "@/lib/animations";

const ToolCardMobile = ({ tool, currentLang }: { tool: any; currentLang: string }) => {
  return (
    <div className="relative h-full">
      <div className="relative bg-white/95 border border-white rounded-[2rem] p-6 shadow-lg flex flex-col items-center text-center h-full">
        <div className="w-16 h-16 bg-white shadow-[0_10px_24px_rgba(0,0,0,0.08)] rounded-2xl flex items-center justify-center p-4 mb-5 border border-sage/10">
          {tool.icon_url ? (
            <img
              src={optimizeCloudinary(tool.icon_url)}
              alt={tool.tool_name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sage">
              <Zap size={28} />
            </div>
          )}
        </div>

        <div className="space-y-3 flex-1">
          <h5 className="font-display text-lg font-bold text-slate-900 tracking-tight">
            {getLocalizedField(tool, 'tool_name', currentLang)}
          </h5>
          <p className="font-body text-sm text-slate-500 leading-relaxed font-light line-clamp-4 italic">
            {getLocalizedField(tool, 'description', currentLang)}
          </p>
        </div>

        {tool.tool_url && (
          <a
            className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest font-bold text-sage py-3 px-6 rounded-2xl bg-sage/5 active:scale-95 mt-5"
            href={tool.tool_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Launch Protocol
          </a>
        )}
      </div>
    </div>
  );
};

const ToolCardDesktop = ({ tool, index, currentLang }: { tool: any; index: number; currentLang: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="relative group h-full transition-transform duration-500 hover:-translate-y-2"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-sage/20 rounded-[2.5rem] translate-y-3 blur-[2px]" />
      
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          show: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.8,
              ease: "easeOut"
            }
          }
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative bg-white/95 backdrop-blur-2xl border-2 border-white rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center cursor-default h-full"
      >
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.8) 0%, transparent 60%)`
            ),
            transform: "translateZ(1px)",
          }}
          className="absolute inset-3 rounded-[2rem] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <div 
          style={{ transform: "translateZ(80px)", transformStyle: "preserve-3d" }}
          className="flex flex-col items-center w-full relative z-10 h-full"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sage/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-sage/20 transition-colors pointer-events-none" />
          
          <div 
            style={{ transform: "translateZ(40px)" }}
            className="w-20 h-20 bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] rounded-3xl flex items-center justify-center p-5 mb-8 border border-sage/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10"
          >
            {tool.icon_url ? (
              <img
                src={optimizeCloudinary(tool.icon_url)}
                alt={tool.tool_name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sage">
                <Zap size={32} />
              </div>
            )}
          </div>

          <div 
            style={{ transform: "translateZ(30px)" }}
            className="space-y-4 mb-8 flex-1 relative z-10"
          >
            <h5 className="font-display text-xl font-bold text-slate-900 group-hover:text-sage transition-colors duration-500 tracking-tight">
              {getLocalizedField(tool, 'tool_name', currentLang)}
            </h5>
            <div className="h-px w-10 bg-sage/20 mx-auto group-hover:w-20 transition-all duration-700" />
            <p className="font-body text-sm text-slate-500 leading-relaxed font-light line-clamp-4 italic">
              {getLocalizedField(tool, 'description', currentLang)}
            </p>
          </div>

          {tool.tool_url && (
            <motion.a
              style={{ transform: "translateZ(50px)" }}
              className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest font-bold text-sage py-3 px-8 rounded-2xl bg-sage/5 hover:bg-sage hover:text-white transition-all transform hover:scale-110 shadow-lg shadow-sage/5 active:scale-95"
              href={tool.tool_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Launch Protocol
            </motion.a>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const SkillDetailPage = () => {
  const { skillSlug } = useParams<{ skillSlug: string }>();
  const isMobile = useIsMobile();
  const { lang, t } = useLang();
  const currentLang = lang as SupportedLang;

  const { data: skillDetail, isLoading } = useQuery({
    queryKey: ['skill-full-detail', skillSlug],
    queryFn: async () => {
      if (!skillSlug) return null;
      
      const skill = await portfolioApi.getSkillBySlug(skillSlug);
      if (!skill) return null;

      const [highlights, applications, tools, steps] = await Promise.all([
        portfolioApi.getSkillHighlights(skill.id),
        portfolioApi.getSkillApplications(skill.id),
        portfolioApi.getSkillTools(skill.id),
        portfolioApi.getSkillSteps(skill.id)
      ]);
      
      // Load images for each highlight in parallel
      const imagesPromises = highlights.map(h => 
        portfolioApi.getHighlightImages(h.id).then(images => ({ id: h.id, images }))
      );
      const imagesResults = await Promise.all(imagesPromises);
      const highlightImages = imagesResults.reduce((acc, curr) => {
        acc[curr.id] = curr.images;
        return acc;
      }, {} as Record<string, any[]>);

      return {
        skill,
        highlights,
        highlightImages,
        applications,
        tools,
        steps
      };
    },
    enabled: !!skillSlug,
  });

  const skill = skillDetail?.skill;
  const highlights = skillDetail?.highlights || [];
  const highlightImages = skillDetail?.highlightImages || {};
  const applications = skillDetail?.applications || [];
  const tools = skillDetail?.tools || [];
  const steps = skillDetail?.steps || [];

  const skillName = useMemo(() => getLocalizedField(skill, 'skill_name', currentLang), [skill, currentLang]);
  const skillOverview = useMemo(() => getLocalizedField(skill, 'overview', currentLang), [skill, currentLang]);
  const skillShortDesc = useMemo(() => getLocalizedField(skill, 'short_description', currentLang), [skill, currentLang]);

  if (!isLoading && !skill)
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl text-primary">{t("Skill not found", "スキルが見つかりません", "Không tìm thấy kỹ năng")}</h1>
          </div>
        </div>
      </PageLayout>
    );

  return (
    <PageLayout
      seoTitle={`${skillName || "Skill"} | Expertise`}
      seoDescription={skillShortDesc || skillOverview}
      isLoading={isLoading}
      loaderText="Opening Specialized Space..."
    >
      <div className="bg-surface text-on-surface space-y-0">
      {skill && (
        <>
          <section className="relative overflow-hidden bg-[#fcfaf7]">
            {/* Decorative elements */}
            <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-sage/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="hidden md:block absolute bottom-0 left-0 w-[500px] h-[500px] bg-sage/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-32 md:pt-48 pb-20 md:pb-32 flex flex-col gap-12 md:gap-16 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="flex flex-col gap-8 md:gap-10"
              >
                <div className="flex flex-col gap-4 max-w-4xl">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/70 md:bg-white/50 md:backdrop-blur-md border border-black/5 shadow-sm w-fit">
                    <div className="w-2 h-2 rounded-full bg-sage" />
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
                      Skill Specialization
                    </span>
                  </div>
                  <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-light text-slate-900 tracking-tight leading-[0.95]">
                    {skillName}
                  </h1>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
                  <p className="font-body text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed font-light first-letter:text-4xl first-letter:font-display first-letter:mr-1 first-letter:float-left">
                    {skillShortDesc || skillOverview}
                  </p>

                  {(skill.difficulty_level || skill.experience_level || skill.estimated_time) && (
                    <div className="flex flex-wrap gap-4 shrink-0 lg:mb-1">
                      {skill.difficulty_level && (
                        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow group">
                          <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-white transition-colors">
                            <BarChart size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Level</span>
                            <span className="text-sm font-bold text-slate-700">{skill.difficulty_level}</span>
                          </div>
                        </div>
                      )}
                      {skill.experience_level && (
                        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow group">
                          <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-white transition-colors">
                            <Trophy size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Exp</span>
                            <span className="text-sm font-bold text-slate-700">{skill.experience_level}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full"
          >
            {skill.cover_image_url && (
              <div className="relative group/banner">
                <div className="hidden md:block absolute -inset-4 bg-sage/5 rounded-[3rem] blur-3xl -z-10 group-hover/banner:bg-sage/10 transition-colors duration-700" />
                <div className="relative bg-white p-3 rounded-[3rem] shadow-2xl shadow-sage/10 border border-black/5 overflow-hidden group">
                  <img
                    alt={skill.skill_name}
                    className="w-full aspect-video sm:aspect-[21/9] lg:aspect-[21/9] object-cover rounded-[2.5rem] transition-transform duration-1000 group-hover:scale-105"
                    src={optimizeCloudinary(skill.cover_image_url)}
                  />
                  <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-black/5" />
                  
                  {/* Majestic Banner Badge */}
                  <div className="absolute bottom-10 left-10 hidden md:flex items-center gap-4 bg-white/90 backdrop-blur-xl p-5 pr-8 rounded-3xl shadow-2xl border border-black/5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-sage flex items-center justify-center text-white shadow-lg shadow-sage/30">
                      <Sparkles size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-0.5">Global Capability</p>
                      <p className="text-lg font-bold text-slate-800 leading-tight">Elite Specialization</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
        {skillOverview && (
          <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 bg-stone-50/50">
            <div className="max-w-4xl">
              <p className="font-body text-xl text-slate-600 leading-relaxed whitespace-pre-line font-light italic">
                {skillOverview}
              </p>
            </div>
          </section>
        )}
        {skill.show_applications !== false && applications.length > 0 && (
          <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-32">
            <div className="mb-16">
              <h3 className="font-headline text-5xl font-bold text-primary mb-4">
                Application &amp; Strategic Use Cases
              </h3>
              <div className="h-px w-24 bg-primary-container"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {applications.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        )}
        {skill.show_highlights !== false && highlights.length > 0 && (
          <section
            className="relative py-32 md:py-48 overflow-hidden"
            style={{ backgroundColor: "#4C5C2D" }}
          >
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="mb-32"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="inline-flex items-center gap-4 mb-6"
                >
                  <div className="w-12 h-px bg-white/40" />
                  <span className="font-label text-sm uppercase tracking-[0.3em] font-medium text-white/70">
                    Capabilities
                  </span>
                </motion.div>
                <motion.h3
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="font-headline text-6xl md:text-8xl font-bold text-white tracking-tighter"
                >
                  Key Highlights
                </motion.h3>
              </motion.div>

              <div className="flex flex-col gap-16 md:gap-32 lg:gap-64">
                {highlights.map((h, i) => {
                  const images = highlightImages[h.id] || [];
                  const coverImage = images.find((img) => img.is_cover);
                  const displayImage = coverImage || images[0];
                  const hasMultipleImages = images.length >= 2;
                  const isEven = i % 2 === 0;

                  return (
                    <motion.div
                      key={i}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.15 }}
                      variants={{
                        hidden: {},
                        show: {
                          transition: {
                            staggerChildren: 0.15
                          }
                        }
                      }}
                      className="relative flex flex-col gap-12 md:gap-16"
                    >
                      <div className="absolute -top-16 -left-8 font-display text-[15rem] md:text-[25rem] font-black text-white/[0.03] leading-none select-none pointer-events-none hidden md:block">
                        {String(i + 1).padStart(2, "0")}
                      </div>

                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                        }}
                        className="w-full max-w-4xl relative z-20"
                      >
                        <div className="space-y-4 mb-6">
                          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/20 md:bg-white/10 md:backdrop-blur-md border border-white/20">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-white">
                              Principle {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <h4 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] text-white tracking-tighter italic">
                            {getLocalizedField(h, 'title', currentLang)}
                          </h4>
                        </div>

                        <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-white/80 mb-8 md:mb-10 font-light max-w-3xl italic">
                          {getLocalizedField(h, 'description', currentLang)}
                        </p>
                      </motion.div>

                      {/* Image Side - Full Width Majestic Viewing */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 40 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }
                        }}
                        className="w-full"
                      >
                        {displayImage ? (
                          hasMultipleImages ? (
                            <HighlightImageGallery
                              images={images}
                              highlightTitle={h.title}
                            />
                          ) : (
                            <div className="relative group perspective-1000">
                              <div className="hidden md:block absolute inset-0 bg-black/20 rounded-3xl blur-3xl group-hover:blur-[60px] transition-all duration-700 opacity-40 translate-y-12" />
                              <div className="relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                <img
                                  src={optimizeCloudinary(displayImage.image_url)}
                                  alt={displayImage.alt_text || h.title}
                                  className="w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[600px] object-contain bg-black/40"
                                />
                                {displayImage.caption && (
                                  <div className="absolute bottom-8 right-8 px-6 py-3 bg-black/60 md:bg-black/40 md:backdrop-blur-xl border border-white/10 rounded-2xl max-w-[70%]">
                                    <p className="font-body text-sm italic text-white/90">
                                      {displayImage.caption}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="w-full h-[400px] bg-white/[0.02] rounded-3xl border border-dashed border-white/10 flex items-center justify-center text-white/20 italic">
                            Visual documentation not available
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Abstract Background Shapes */}
            <div className="hidden md:block absolute top-1/4 right-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px] -mr-64 pointer-events-none" />
            <div className="hidden md:block absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px] -ml-64 pointer-events-none" />
          </section>
        )}
        {skill.show_tools !== false && tools.length > 0 && (
          <section className="relative overflow-hidden bg-[#f8f9f5] py-32">
            {/* Ambient Background Glow */}
            <div className="hidden md:block absolute top-0 left-1/4 w-[600px] h-[600px] bg-sage/5 rounded-full blur-[140px] -mt-64 pointer-events-none" />
            <div className="hidden md:block absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-sage/5 rounded-full blur-[140px] -mb-64 pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-24"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/70 md:bg-white/50 md:backdrop-blur-md border border-black/5 shadow-sm mb-6">
                  <div className="w-2 h-2 rounded-full bg-sage" />
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
                    Instrument Cluster
                  </span>
                </div>
                <h3 className="font-display text-5xl md:text-6xl font-light text-slate-900 tracking-tight leading-tight mb-6">
                  Tools & <span className="text-sage italic">Technologies</span>
                </h3>
                <p className="font-body text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                  The precision instrument layer leveraged to architect high-performance results and operational excellence.
                </p>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.08
                    }
                  }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                style={{ perspective: "1500px" }}
              >
                {tools.map((tool, i) => (
                  isMobile ? (
                    <ToolCardMobile
                      key={tool.id || i}
                      tool={tool}
                      currentLang={currentLang}
                    />
                  ) : (
                    <ToolCardDesktop
                      key={tool.id || i}
                      tool={tool}
                      index={i}
                      currentLang={currentLang}
                    />
                  )
                ))}
              </motion.div>
            </div>
          </section>
        )}
        {skill.show_steps !== false && (
          <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-32 bg-stone-50/50">
            <div className="mb-24 text-center md:text-left">
              <h3 className="font-display text-5xl md:text-7xl text-heading mb-4 italic">
                {t("The Methodology", "方法論", "Phương pháp luận")}
              </h3>
              <p className="font-body text-slate-500 max-w-xl font-light">
                {t("A structured approach to mastering this skill.", "このスキルを習得するための構造化されたアプローチ。", "Phương pháp tiếp cận có cấu trúc để làm chủ kỹ năng này.")}
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-stone-200 -translate-x-1/2 hidden md:block"></div>
              <div className="flex flex-col gap-16">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className={`flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`${i % 2 === 0 ? "md:w-1/2 md:pr-16 text-left md:text-right" : "md:w-1/2 md:pl-16"}`}
                    >
                      <h5 className="font-display text-2xl text-heading mb-2 italic">
                        {getLocalizedField(step, 'step_title', currentLang)}
                      </h5>
                      <p className="font-body text-slate-500 font-light">
                        {getLocalizedField(step, 'step_description', currentLang)}
                      </p>
                    </div>
                    <div className="relative z-10 w-12 h-12 bg-sage text-white rounded-2xl flex items-center justify-center font-display text-xl font-bold md:mx-auto shrink-0 shadow-lg shadow-sage/20">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div
                      className={`${i % 2 === 0 ? "md:w-1/2 md:pl-16 hidden md:block" : "md:w-1/2 md:pr-16 hidden md:block"}`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        <ContactSection 
          customTitle={t(
            "Interested in this skill?", 
            "このスキルにご興味がありますか？", 
            "Bạn quan tâm đến kỹ năng này?"
          )}
          customDescription={t(
            "If this expertise aligns with your project needs, I would love to discuss how I can help bring your vision to life.",
            "この専門性があなたのプロジェクトのニーズに合致する場合は, あなたのビジョンを形にするお手伝いができることを嬉しく思います。",
            "Nếu kỹ năng này phù hợp với nhu cầu dự án của bạn, tôi rất sẵn lòng thảo luận về cách tôi có thể giúp bạn hiện thực hóa tầm nhìn của mình."
          )}
          customEyebrow={t(
            "Next Chapter",
            "次のステップ",
            "Chương tiếp theo"
          )}
        />
        </>
      )}
      </div>
    </PageLayout>
  );
};

export default SkillDetailPage;
