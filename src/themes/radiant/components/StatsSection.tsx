import { motion, useMotionValue, animate, useInView } from "framer-motion";
import { useEffect, useRef, memo } from "react";
import { useLang } from "@/contexts/LangContext";
import { usePortfolioData } from "@/core/hooks/usePortfolio";
import { fadeIn, staggerContainer } from "@/lib/animations";

const Counter = ({ valueText }: { valueText: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  
  const match = valueText.match(/([\d,.]+)(.*)/);
  const target = match ? parseFloat(match[1].replace(/,/g, "")) : 0;
  const suffix = match ? match[2] : "";
  
  const count = useMotionValue(0);

  useEffect(() => {
    if (isInView && ref.current) {
      const animation = animate(count, target, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = Math.round(latest).toLocaleString() + suffix;
          }
        }
      });
      return animation.stop;
    }
  }, [isInView, target, count, suffix]);

  if (!match) return <span>{valueText}</span>;

  return (
    <span ref={ref} className="tabular-nums font-headline italic">
      0{suffix}
    </span>
  );
};

const StatsSection = memo(() => {
  const { lang } = useLang();
  const { siteStats, siteStatsSettings } = usePortfolioData();
  
  const stats = siteStats.data || [];
  const settings = siteStatsSettings.data;
  const loading = siteStats.isLoading || siteStatsSettings.isLoading;

  if (loading || stats.length === 0 || (settings && !settings.is_published)) {
    return null;
  }

  return (
    <section id="stats" className="py-16 md:py-32 bg-surface relative overflow-hidden">
      {/* Optimized Background Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sage/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl 2xl:max-w-screen-2xl">
        <motion.div 
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-0 relative"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              variants={fadeIn("up", 0)}
              className={`flex flex-col items-center text-center px-8 relative group ${
                i !== 0 ? "lg:border-l lg:border-border/30" : ""
              }`}
            >
              <div className="space-y-6">
                <div className="text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-[10rem] font-headline italic text-heading tracking-tighter leading-none transition-transform duration-500 group-hover:scale-105 font-medium">
                  <Counter valueText={stat.value_text} />
                </div>
                
                <div className="space-y-2">
                    <p className="text-[10px] md:text-[11px] font-bold text-sage uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto">
                        {lang === "ja" ? (stat.label_ja || stat.label_en) : stat.label_en}
                    </p>
                    <div className="h-[1px] w-6 bg-border mx-auto group-hover:w-12 transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

StatsSection.displayName = "StatsSection";
export default StatsSection;
