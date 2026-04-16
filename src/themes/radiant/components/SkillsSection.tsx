import { useEffect, useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { useSkills, useSkillCategories, useExpertiseSection } from "@/core/hooks/usePortfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { fadeIn, staggerContainer } from "@/lib/animations";
import SectionHeader from "./shared/SectionHeader";
import AmbientAccent from "./shared/AmbientAccent";
import { TransitionCurtain } from "./shared/PageCurtain";
import { getLocalizedField, SupportedLang } from "@/lib/content-utils";

const SkillsSection = memo(() => {
  const { lang, t } = useLang();
  const currentLang = lang as SupportedLang;
  const navigate = useNavigate();
  const isTablet = useIsTablet();
  const isMobile = useIsMobile();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  
  const skillsQuery = useSkills();
  const categoriesQuery = useSkillCategories();
  const expertiseSection = useExpertiseSection();
  
  const skills = useMemo(() => {
    if (!skillsQuery.data || !categoriesQuery.data) return [];
    
    return skillsQuery.data.map(skill => ({
      ...skill,
      category: categoriesQuery.data.find((cat: any) => cat.id === (skill as any).category_id)
    }));
  }, [skillsQuery.data, categoriesQuery.data]);

  const expertise = expertiseSection.data;
  const loading = skillsQuery.isLoading || categoriesQuery.isLoading || expertiseSection.isLoading;

  if (loading || (skills.length === 0 && !loading) || !expertise) return null;

  const cardVariants = {
    hidden: (offset: number) => ({
      opacity: 0,
      y: isMobile ? offset + 15 : offset + 40,
    }),
    show: (offset: number) => ({
      opacity: 1,
      y: offset,
      transition: {
        type: isMobile ? "tween" : "spring",
        ease: [0.22, 1, 0.36, 1],
        duration: isMobile ? 0.6 : 1.2,
        bounce: 0,
      },
    }),
  } as any;

  return (
    <section className="py-24 md:py-48 bg-background relative overflow-hidden" id="skills">
      <AmbientAccent position="top-right" color="bg-accent" size={isTablet ? 400 : 600} opacity={isTablet ? 0.05 : 0.1} />
      <AmbientAccent position="bottom-left" color="bg-vibe-pink" size={isTablet ? 300 : 400} opacity={0.05} />

      <div className="container mx-auto px-6 xl:px-8 2xl:max-w-screen-2xl relative z-10">
        <SectionHeader
          align="center"
          className="mb-24 md:mb-32 xl:mb-40"
          eyebrow={getLocalizedField(expertise, 'eyebrow', currentLang)}
          eyebrowClassName="font-artistic text-2xl md:text-3xl xl:text-4xl text-sage block italic"
          title={getLocalizedField(expertise, 'title', currentLang)}
          titleClassName="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-light text-heading tracking-tighter"
          description={<div className="w-24 h-1 bg-gradient-to-r from-transparent via-sage/40 to-transparent mt-4 mx-auto" />}
        />

        <motion.div 
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 xl:gap-16"
        >
          {skills.map((skill: any, i) => {
            const staggerOffset = !isTablet ? (i % 3 === 1 ? 48 : 0) : 0;
            const skillName = skill.skill_name; 
            const categoryName = getLocalizedField(skill.category, 'name', currentLang) || t('Skillset', 'スキルセット', 'Bộ kỹ năng');
            const description = getLocalizedField(skill, 'short_description', currentLang) || 
                               getLocalizedField(skill, 'overview', currentLang) || 
                               getLocalizedField(skill, 'application', currentLang);
            
            return (
              <motion.div
                key={skill.id}
                custom={staggerOffset}
                variants={cardVariants}
                whileHover={!isTablet ? { 
                  y: staggerOffset - 12, 
                  scale: 1.02,
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                } : undefined}
                whileTap={!isTablet ? { scale: 0.98 } : undefined}
                onClick={() => {
                  if (skill.category) {
                    const url = `/skills/${skill.category.slug}/${skill.slug}`;
                    isTablet ? navigate(url) : setPendingUrl(url);
                  }
                }}
                className={`ethereal-glass group cursor-pointer relative rounded-[3.5rem] md:rounded-[4rem] xl:rounded-[5rem] overflow-hidden transition-[box-shadow,background-color,border-color] duration-500 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.04)] h-full will-change-transform ${
                  !isTablet ? "hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)]" : ""
                }`}
              >
                <div className="p-8 md:p-10 lg:p-12 xl:p-14 space-y-8 md:space-y-10 flex flex-col h-full min-h-[400px] md:min-h-[450px] relative z-20">
                  <div className={`absolute top-0 right-0 w-48 h-48 -translate-y-1/4 translate-x-1/4 opacity-5 transition-opacity duration-1000 pointer-events-none ${!isTablet ? "group-hover:opacity-10" : "opacity-8"}`}>
                      {skill.icon_url && (
                        <img 
                          src={optimizeCloudinary(skill.icon_url, { width: 300 })} 
                          alt="" 
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain rotate-12 will-change-transform" 
                        />
                      )}
                  </div>

                  <div className="space-y-4">
                      <span className="font-sans text-[10px] tracking-[0.4em] uppercase font-bold text-sage opacity-60">
                        {categoryName}
                      </span>
                      <h3 className={`font-display text-2xl md:text-3xl text-heading font-bold leading-none transition-colors duration-500 ${!isTablet ? "group-hover:text-vibe-pink" : ""}`}>
                        {skillName}
                      </h3>
                  </div>

                  <p className="font-body text-base text-foreground/50 leading-relaxed font-light line-clamp-4 flex-grow italic">
                      {description}
                  </p>

                  <div className="pt-6">
                      <div className={`inline-flex items-center gap-4 transition-all duration-500 ${!isTablet ? "group-hover:gap-6" : ""}`}>
                        <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-pearl-light transition-transform duration-500 ${!isTablet ? "group-hover:scale-110" : ""}`}>
                            <span className="material-symbols-outlined text-sage text-xl opacity-60">north_east</span>
                        </div>
                        <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-heading/40">
                          {t("Explore Layer", "レイヤーを探索", "Khám phá")}
                        </span>
                      </div>
                  </div>
                </div>

                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-opacity duration-500 ${!isTablet ? "opacity-0 group-hover:opacity-100" : "opacity-30"}`} />
              </motion.div>
          )})}
        </motion.div>
      </div>

      <TransitionCurtain isActive={!!pendingUrl} onComplete={() => navigate(pendingUrl!)} />
    </section>
  );
});

SkillsSection.displayName = "SkillsSection";
export default SkillsSection;
