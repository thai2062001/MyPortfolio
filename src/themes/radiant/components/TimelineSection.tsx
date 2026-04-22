import { memo, useRef, useMemo } from "react";
import { useLang } from "@/contexts/LangContext";
import { motion } from "framer-motion";
import TimelineRow from "@/themes/radiant/components/TimelineRow";
import { usePortfolioData } from "@/core/hooks/usePortfolio";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { getLocalizedField, SupportedLang } from "@/lib/content-utils";

const TimelineSection = memo(() => {
  const { lang, t } = useLang();
  const currentLang = lang as SupportedLang;
  const { timeline: timelineQuery, timelineSettings: settingsQuery } = usePortfolioData();

  const phases = timelineQuery.data || [];
  const settings = settingsQuery.data;
  const loading = timelineQuery.isLoading || settingsQuery.isLoading;

  const sectionRef = useRef<HTMLDivElement>(null);

  const localizationData = useMemo(() => {
    if (!settings) return null;
    return {
      eyebrow: getLocalizedField(settings, 'eyebrow', currentLang) || t("The Chronicle", "ジャーニー", "Biên niên sử"),
      title: getLocalizedField(settings, 'title', currentLang) || t("Chronological", "キャリアタイムライン", "Dòng thời gian"),
      description: getLocalizedField(settings, 'description', currentLang) || t("evolution of craft", "これまでの歩み", "sự tiến hóa của tay nghề")
    };
  }, [settings, currentLang, t]);

  return (
    <section className="py-24 md:py-48 bg-background relative overflow-hidden" id="timeline" ref={sectionRef}>
      {/* Optimized Atmosphere Blurs */}
      <div className="hidden md:block absolute top-0 left-0 w-[600px] h-[600px] bg-vibe-pink/5 rounded-full light-blob -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="hidden md:block absolute top-1/2 right-0 w-[500px] h-[500px] bg-vibe-sky/5 rounded-full light-blob translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto relative z-10 px-6">
        {/* Editorial Header */}
        <motion.div
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-32 xl:mb-40"
        >
          <div className="flex flex-col items-center gap-8">
             <div className="w-px h-24 bg-gradient-to-b from-transparent via-sage/30 to-transparent" />
             <span className="font-artistic text-2xl lg:text-3xl 2xl:text-4xl text-vibe-pink block italic">
                {localizationData?.eyebrow}
             </span>
          </div>

          <h2 className="font-display font-normal text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-9xl leading-none text-heading mb-12 tracking-tighter">
            {localizationData?.title}
            <br className="hidden md:block" />
            <span className="font-artistic italic text-sage lowercase block md:inline mt-6 md:mt-0 tracking-normal xl:ml-6">
               {localizationData?.description}
            </span>
          </h2>
        </motion.div>

        {/* Timeline Flow */}
        <div className="relative">
          {loading ? (
            <div className="flex flex-col items-center py-24 space-y-8">
              <div className="w-16 h-16 border-2 border-sage/10 border-t-vibe-pink rounded-full animate-spin" />
              <p className="font-artistic text-2xl text-sage/40 animate-pulse">
                {t("Summoning the past...", "過去を召喚中...", "Đang khơi gợi ký ức...")}
              </p>
            </div>
          ) : phases.length === 0 ? (
            <div className="text-center py-24 text-sage/20 font-artistic text-3xl italic">
              {t("No timeline phases available", "タイムラインフェーズがありません", "Chưa có mốc thời gian nào")}
            </div>
          ) : (
            <div className="px-0 relative">
              {/* Central Thread */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sage/20 via-sage/40 to-transparent hidden md:block" />
              
              <motion.div
                variants={staggerContainer(0.2, 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.05 }}
              >
                {phases.map((phase, i) => (
                  <TimelineRow
                    key={phase.id}
                    period={phase.period}
                    location={phase.location}
                    title={getLocalizedField(phase, 'title', currentLang)}
                    company={getLocalizedField(phase, 'company', currentLang)}
                    description={getLocalizedField(phase, 'description', currentLang)}
                    images={phase.images}
                    image={phase.image_url}
                    tag={getLocalizedField(phase, 'tag', currentLang)}
                    index={i}
                    isLast={i === phases.length - 1}
                  />
                ))}
              </motion.div>

              {/* End Marker */}
              <motion.div
                variants={fadeIn("up", 0.5)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="relative flex flex-col items-center mt-12 md:mt-24 pb-32"
              >
                <div className="w-px h-32 bg-gradient-to-b from-sage/40 via-sage/20 to-transparent mb-10" />
                <div className="w-4 h-4 rounded-full bg-vibe-pink border-4 border-white shadow-xl mb-12" />
                
                 <div className="flex flex-col items-center gap-12">
                   <p className="font-artistic text-3xl text-vibe-pink/60 lowercase tracking-widest">
                     {t("the narrative continues", "物語は続く", "câu chuyện vẫn tiếp diễn")}
                   </p>
                 </div>
               </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default TimelineSection;
