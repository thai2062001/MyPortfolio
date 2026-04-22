import { useState, memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, FileDown } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { useAboutContent, usePersonalInfo } from "@/core/hooks/usePortfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { fadeIn, staggerContainer } from "@/lib/animations";
import SectionHeader from "./shared/SectionHeader";
import { TransitionCurtain } from "./shared/PageCurtain";
import { getLocalizedField, getLocalizedFields, SupportedLang } from "@/lib/content-utils";

const AboutSection = memo(() => {
  const { lang, t } = useLang();
  const currentLang = lang as SupportedLang;
  const navigate = useNavigate();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const isTablet = useIsTablet();
  const isMobile = useIsMobile();

  const aboutQuery = useAboutContent();
  const piQuery = usePersonalInfo();
  
  const sections = aboutQuery.data || [];
  const loading = aboutQuery.isLoading || piQuery.isLoading;

  const mainSection = useMemo(() => sections[0], [sections]);

  const localizationData = useMemo(() => {
    if (!mainSection) return null;
    const fields = getLocalizedFields(mainSection, ['content', 'title', 'cta_primary_label', 'cta_secondary_label'], currentLang);
    return {
      title: fields.title,
      content: fields.content,
      ctaPrimary: fields.cta_primary_label,
      ctaSecondary: fields.cta_secondary_label,
      resumeUrl: (mainSection as any).resume_url,
      tags: (mainSection as any).about_content_tags?.map((t: any) => ({
        ...t.about_tags,
        name: getLocalizedField(t.about_tags, 'name', currentLang)
      })) || []
    };
  }, [mainSection, currentLang]);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 md:py-48 px-6 bg-[#FEFEFE]">
        <div className="container mx-auto max-w-7xl animate-pulse">
           <div className="h-4 bg-gray-100 w-24 mb-10 rounded-full" />
           <div className="h-20 bg-gray-100 w-3/4 mb-10 rounded-2xl" />
           <div className="h-64 bg-gray-100 w-full rounded-[3rem]" />
        </div>
      </section>
    );
  }

  if (!mainSection || !localizationData) return null;
  
  const mainGallery = (mainSection as any).about_images || [];
  const coverObj = mainGallery.find((img: any) => img.is_cover) || mainGallery[0];
  const mainImage = optimizeCloudinary(coverObj?.image_url || "", { width: 1000 });
  const otherImages = mainGallery.filter((img: any) => img.id !== coverObj?.id);
  const totalImages = mainGallery.length;
  const pi = piQuery.data;

  return (
    <section className="relative py-16 md:py-48 px-6 bg-[#FEFEFE] overflow-hidden" id="about">
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-24 items-start"
        >
          {/* Collage Images Column */}
          <div className="lg:col-span-6 relative order-1 lg:order-1 will-change-transform">
            <div className="relative w-full aspect-square md:aspect-[4/5] lg:aspect-square xl:aspect-[4/5] flex items-center justify-center">
              
              {/* LAYOUT 1: SINGLE IMAGE */}
              {totalImages === 1 && (
                <motion.div 
                   variants={fadeIn("up", 0.1, isMobile)}
                   className="relative w-[85%] md:w-[70%] lg:w-[85%] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-10 p-2.5 bg-on-surface/[0.03] border border-on-surface/[0.05] will-change-transform"
                >
                  <div className="w-full h-full rounded-xl overflow-hidden">
                    <img 
                      src={mainImage} 
                      alt="About" 
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100 will-change-transform" 
                    />
                  </div>
                </motion.div>
              )}

              {/* LAYOUT 2: DUAL OVERLAP */}
              {totalImages === 2 && (
                <div className="relative w-full h-full flex items-center justify-center lg:justify-start">
                  <motion.div 
                    variants={fadeIn("right", 0.1, isMobile)}
                    className="relative w-[70%] md:w-[60%] lg:w-[70%] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl z-10 will-change-transform"
                  >
                    <img src={mainImage} alt="About Main" loading="lazy" className="w-full h-full object-cover will-change-transform" />
                  </motion.div>
                  
                  <motion.div 
                    variants={fadeIn("left", 0.3, isMobile)}
                    style={{ rotate: 5 }}
                    className="absolute bottom-[-10%] right-[2%] lg:right-[-5%] w-[60%] md:w-[50%] lg:w-[60%] aspect-square rounded-2xl p-2 bg-white shadow-2xl z-20 border-[6px] border-white will-change-transform"
                   >
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <img src={optimizeCloudinary(otherImages[0].image_url, { width: 600 })} alt="About Secondary" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  </motion.div>
                </div>
              )}

              {/* LAYOUT 3: COLLAGE (3+ IMAGES) */}
              {totalImages >= 3 && (
                <div className="relative w-full h-full flex items-center justify-center lg:scale-95 xl:scale-100 will-change-transform">
                  <motion.div 
                    variants={fadeIn("up", 0.1, isMobile)}
                    className="relative w-[75%] lg:w-[70%] xl:w-[65%] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl z-10 will-change-transform"
                  >
                    <img src={mainImage} alt="About Hero" loading="lazy" className="w-full h-full object-cover grayscale-[5%] hover:grayscale-0 transition-all duration-1000 scale-[1.02] hover:scale-100 will-change-transform" />
                  </motion.div>

                  <motion.div 
                    variants={fadeIn("right", 0.3, isMobile)}
                    style={{ rotate: -6 }}
                    className="absolute top-[-2%] lg:top-[0%] left-[-2%] lg:left-[-5%] xl:left-[0%] w-[45%] aspect-square rounded-2xl p-2 bg-white shadow-xl z-20 transform hover:rotate-0 transition-all duration-700 border-4 border-white will-change-transform"
                  >
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <img src={optimizeCloudinary(otherImages[0].image_url, { width: 500 })} alt="Process" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  </motion.div>

                  <motion.div 
                    variants={fadeIn("left", 0.4, isMobile)}
                    style={{ rotate: 3 }}
                    className="absolute bottom-[-2%] lg:bottom-[0%] right-[-2%] lg:right-[-5%] xl:right-[0%] w-[50%] aspect-square rounded-2xl p-2 bg-white shadow-2xl z-20 transform hover:rotate-0 transition-all duration-700 border-4 border-white will-change-transform"
                  >
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <img src={optimizeCloudinary(otherImages[1].image_url, { width: 500 })} alt="Atmosphere" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* LEFT CONTENT: Headline & Stats */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 order-2 lg:order-2">
            <SectionHeader
               eyebrow={
                 <div className="inline-flex items-center gap-3 bg-heading text-white px-6 py-2 rounded-full text-[10px] tracking-[0.3em] font-display font-bold uppercase">
                    <span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" />
                    {t("About Me", "私について", "Về tôi")}
                 </div>
               }
               title={localizationData.title}
               description={localizationData.content}
               highlightWords={["code", "design", "growth"]}
               eyebrowClassName="font-display text-[11px] uppercase tracking-[0.3em] text-on-surface/40 font-bold"
               titleClassName="font-display text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-6xl 2xl:text-8xl font-extrabold tracking-tight text-on-surface leading-tight md:leading-[1.05]"
               descriptionClassName="font-body text-base md:text-lg lg:text-base xl:text-lg text-on-surface-variant max-w-xl leading-relaxed italic"
               className="gap-2 lg:gap-4"
            />

            <motion.div variants={fadeIn("up", 0.4, isMobile)} className="flex flex-wrap gap-x-4 gap-y-3 max-w-xl pb-2">
              {localizationData.tags?.map((tag: any) => {
                if (!tag || !tag.is_active) return null;
                return (
                  <div key={tag.id} className="flex items-center gap-2.5 px-3.5 py-1.5 bg-on-surface/[0.03] border border-on-surface/[0.06] rounded-full hover:bg-on-surface/[0.05] transition-all duration-300 cursor-default group">
                    <span className="w-1 h-1 rounded-full bg-on-surface/40 group-hover:bg-primary transition-colors shrink-0" />
                    <span className="text-[13px] font-display font-medium text-on-surface/70 group-hover:text-on-surface transition-colors">
                      {tag.name}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            <motion.div variants={fadeIn("up", 0.5, isMobile)} className="pt-0 flex flex-col sm:flex-row items-center gap-4 md:gap-4">
              <button
                onClick={() => (isTablet || isMobile) ? navigate("/portfolio") : setPendingUrl("/portfolio")}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-4 bg-heading text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-display text-[12px] tracking-[0.4em] uppercase font-bold overflow-hidden transition-all duration-1000 hover:scale-105 active:scale-95 shadow-2xl shadow-heading/10"
              >
                <span className="relative z-10 whitespace-nowrap">{localizationData.ctaPrimary || t("View Projects", "プロジェクトを見る", "Xem dự án")}</span>
                <ArrowUpRight size={18} className="relative z-10 group-hover:rotate-45 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-sage scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-1000 ease-out" />
              </button>

              <a
                href={localizationData.resumeUrl || (pi as any)?.resume_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-4 bg-white text-heading border border-heading/10 px-8 py-4 md:px-10 md:py-5 rounded-full font-display text-[12px] tracking-[0.4em] uppercase font-bold overflow-hidden transition-all duration-1000 hover:scale-105 active:scale-95 shadow-xl hover:shadow-heading/5"
              >
                <span className="relative z-10 whitespace-nowrap">{localizationData.ctaSecondary || t("Download CV", "CVをダウンロード", "Tải CV")}</span>
                <FileDown size={18} className="relative z-10 group-hover:translate-y-1 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-heading/5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-1000 ease-out" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <TransitionCurtain isActive={!!pendingUrl} onComplete={() => navigate(pendingUrl!)} />
    </section>
  );
});

AboutSection.displayName = "AboutSection";
export default AboutSection;
