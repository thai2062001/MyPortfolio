import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { useState, useEffect, useMemo, useRef, memo } from "react";
import type { HeroSectionWithLayout } from "@/types/admin";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ScrollIndicator } from "../shared/ScrollIndicator";
import { getLocalizedFields, SupportedLang } from "@/lib/content-utils";

interface HeroSplitLayoutProps {
  content: HeroSectionWithLayout;
  config: Record<string, any>;
  onNavigate: (to: string) => void;
  lang: string;
}

export const HeroSplitLayout = memo(({
  content,
  config,
  onNavigate,
  lang,
}: HeroSplitLayoutProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const currentLang = lang as SupportedLang;

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      window.dispatchEvent(new CustomEvent('hero-ready'));
    }
  }, [imageLoaded]);
  
  const fields = useMemo(() => getLocalizedFields(content, [
    'badge',
    'title_line_1',
    'title_line_2',
    'description',
    'primary_button_label',
    'secondary_button_label',
    'hero_image_alt'
  ], currentLang), [content, currentLang]);

  const imagePosition = config.imagePosition || "right";
  const isRating = fields.badge?.toLowerCase().includes("rated");

  return (
    <section className="min-h-screen min-h-[100svh] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-24 flex items-center py-4 md:py-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl 2xl:max-w-screen-2xl mx-auto w-full bg-[#0a2923] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-black/20 flex flex-col justify-center will-change-transform"
      >
        <div className="grid md:grid-cols-2 items-center min-h-[80vh]">
          {/* Content Column */}
          <motion.div 
            variants={staggerContainer(0.12, 0.4)}
            initial="hidden"
            animate="show"
            className={`p-6 md:p-12 lg:p-14 flex flex-col justify-center space-y-6 ${imagePosition === "right" ? "order-1" : "order-2"}`}
          >
            <div className="space-y-4">
              {fields.badge && (
                <motion.div variants={fadeIn("up", 0.1)} className="flex items-center gap-3">
                  {isRating && (
                    <div className="flex gap-1 text-white">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  )}
                  <span className="text-white/80 text-[12px] md:text-sm font-bold tracking-[0.3em] uppercase font-display">
                    {fields.badge}
                  </span>
                </motion.div>
              )}
              
              <motion.h1 variants={fadeIn("up", 0.2)} className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-display leading-[1.05] text-white will-change-transform tracking-tighter">
                {fields.title_line_1}
                {fields.title_line_2 && (
                  <span className="block italic text-vibe-pink lowercase mt-2 sm:mt-4">{fields.title_line_2}</span>
                )}
              </motion.h1>
            </div>

            <motion.p variants={fadeIn("up", 0.3)} className="text-white/70 text-base md:text-xl font-light leading-relaxed max-w-xl font-body italic">
              {fields.description}
            </motion.p>

            <motion.div variants={fadeIn("up", 0.4)} className="flex flex-wrap items-center gap-6 md:gap-10 pt-4">
              <button
                onClick={() => onNavigate(content.primary_button_url || "/portfolio")}
                className="group relative bg-white text-[#0a2923] px-8 py-5 rounded-full font-bold flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 font-display tracking-widest text-[12px] uppercase overflow-hidden"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-500 flex items-center gap-4">
                  {fields.primary_button_label}
                  <div className="bg-[#0a2923] group-hover:bg-white/20 text-white rounded-full p-1.5 group-hover:translate-x-1.5 transition-all duration-500">
                    <ArrowRight size={16} />
                  </div>
                </span>
                <div className="absolute inset-0 bg-sage translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </button>
              
              <button
                onClick={() => onNavigate(content.secondary_button_url || "/#contact")}
                className="group relative bg-transparent border border-white/20 text-white/80 px-8 py-5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 font-display tracking-widest text-[12px] uppercase overflow-hidden"
              >
                <span className="relative z-10 group-hover:text-[#0a2923] transition-colors duration-500">
                  {fields.secondary_button_label}
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </button>
            </motion.div>
          </motion.div>

          {/* Image Column */}
          <div className={`relative h-full min-h-[400px] md:min-h-0 p-4 md:p-8 lg:p-10 ${imagePosition === "right" ? "order-2" : "order-1"}`}>
            {content.hero_image_url && (
              <div className="w-full h-full relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-white/5 shadow-inner">
                <motion.img
                  ref={imgRef}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ 
                    opacity: imageLoaded ? 1 : 0,
                    scale: imageLoaded ? 1 : 1.05
                  }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  onLoad={() => setImageLoaded(true)}
                  src={optimizeCloudinary(content.hero_image_url, { 
                    width: typeof window !== 'undefined' && window.innerWidth < 768 ? 1080 : 1200 
                  })}
                  alt={fields.hero_image_alt}
                  // @ts-ignore
                  fetchpriority="high"
                  className={`w-full h-full object-cover transition-all duration-1000 will-change-transform grayscale-[10%] hover:grayscale-0 ${
                    imageLoaded ? "blur-0" : "blur-xl"
                  }`}
                />
                <div className="absolute inset-0 rounded-2xl md:rounded-[2rem] ring-1 ring-inset ring-white/10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-40" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <ScrollIndicator />
    </section>
  );
});

HeroSplitLayout.displayName = "HeroSplitLayout";
