import { icons } from "lucide-react";
import { memo } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { usePortfolioData } from "@/core/hooks/usePortfolio";
import { fadeIn, staggerContainer } from "@/lib/animations";
import SectionHeader from "./shared/SectionHeader";

const LucideIcon = ({ name, className }: { name: string; className?: string }) => {
  const iconName = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("") as keyof typeof icons;

  const IconComponent = icons[iconName] || icons.Bolt;
  return <IconComponent className={className} />;
};

const ProficienciesSection = memo(() => {
  const { lang } = useLang();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { expertiseSection, expertiseSkills } = usePortfolioData();
  
  const expertise = expertiseSection.data;
  const skills = expertiseSkills.data || [];
  const loading = expertiseSection.isLoading || expertiseSkills.isLoading;

  if (loading || !expertise) return (
    <div className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
            <div className="h-10 bg-gray-50 rounded-xl w-1/3 mb-10 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="h-64 bg-gray-50 rounded-[2rem] animate-pulse" />
                ))}
            </div>
        </div>
    </div>
  );

  const itemVariants = {
    hidden: { opacity: 0, y: isTablet ? 20 : 40 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring",
        duration: 1.0,
        bounce: 0.1
      } as any
    }
  };

  const strategicTitle = lang === "en" ? expertise.strategic_title : expertise.strategic_title_ja || expertise.strategic_title;
  const titleArray = strategicTitle.split(" ");
  const lastWord = titleArray.pop();
  const mainTitle = titleArray.join(" ");

  return (
    <section className="py-24 md:py-48 px-6 bg-[#f8f8f8] relative overflow-hidden" id="proficiencies">
      <div className="max-w-screen-2xl mx-auto container">
        <SectionHeader
          align="between"
          className="mb-24 md:mb-32 xl:mb-40"
          eyebrow={
            <div className="inline-flex items-center gap-3 bg-[#111] text-white px-6 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.3em] shrink-0 font-sans">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              {lang === "en" ? expertise.eyebrow : expertise.eyebrow_ja || expertise.eyebrow}
            </div>
          }
          title={
            <>
              {mainTitle}{" "}
              {lastWord && (
                <span className="font-artistic text-sage lowercase ml-2">{lastWord}</span>
              )}
            </>
          }
          titleClassName="font-display text-5xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] text-[#111] py-2"
        />

        <motion.div 
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.id}
              variants={itemVariants}
              className={`bg-[#F6F6F6] rounded-[2.5rem] p-8 md:p-12 flex flex-col h-full group transition-[box-shadow,background-color,border-color] duration-500 border border-transparent relative overflow-hidden will-change-transform ${
                !isTablet ? "hover:border-gray-100 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)]" : ""
              }`}
              whileHover={!isTablet ? { 
                y: -12,
                transition: { duration: 0.3, ease: "easeOut" }
              } : undefined}
            >
              <div className="flex items-start justify-between mb-12 md:mb-16 relative z-10">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.02)] flex items-center justify-center border border-gray-50/50 transition-all duration-500 shrink-0 ${!isTablet ? "group-hover:bg-[#2D5A43]" : ""}`}>
                  <LucideIcon 
                    name={skill.icon_name || "bolt"} 
                    className={`w-5 h-5 md:w-7 md:h-7 text-[#2D5A43] transition-colors duration-500 ${!isTablet ? "group-hover:text-white" : ""}`} 
                  />
                </div>

                {!isTablet && (
                  <div className="flex gap-1 pt-5 shrink-0">
                    {[1, 2, 3, 4, 5, 6].map((dot) => (
                      <div 
                        key={dot}
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                          dot <= (6 - (idx % 3)) ? "bg-red-500" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto space-y-4 md:space-y-5 relative z-10">
                <h3 className={`text-2xl md:text-3xl font-sans font-extrabold text-[#111] tracking-tight transition-colors duration-500 ${!isTablet ? "group-hover:text-[#2D5A43]" : "text-[#2D5A43]"}`}>
                  {lang === "ja" ? skill.skill_name_ja || skill.skill_name : skill.skill_name}
                </h3>
                <p className={`text-gray-500 text-sm md:text-base leading-relaxed font-sans line-clamp-3 transition-opacity duration-500 ${!isTablet ? "opacity-70 group-hover:opacity-100" : "opacity-100"}`}>
                  {lang === "ja" ? skill.description_ja || skill.description : skill.description}
                </p>
              </div>

              {!isTablet && (
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#2D5A43]/[0.02] rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none group-hover:bg-[#2D5A43]/[0.05] transition-all duration-1000" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

ProficienciesSection.displayName = "ProficienciesSection";
export default ProficienciesSection;
