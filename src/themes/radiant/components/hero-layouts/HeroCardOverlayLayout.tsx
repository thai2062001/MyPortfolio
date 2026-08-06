import { motion } from "framer-motion";
import { memo, useState, useMemo, useRef, useEffect } from "react";
import type { HeroSectionWithLayout } from "@/types/admin";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { ScrollIndicator } from "../shared/ScrollIndicator";
import { getLocalizedFields, SupportedLang } from "@/lib/content-utils";

interface HeroCardOverlayLayoutProps {
  content: HeroSectionWithLayout;
  config: Record<string, any>;
  onNavigate: (to: string) => void;
  lang: string;
}

export const HeroCardOverlayLayout = memo(({
  content,
  config,
  onNavigate,
  lang,
}: HeroCardOverlayLayoutProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const currentLang = lang as SupportedLang;

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);
  
  const fields = useMemo(() => getLocalizedFields(content, [
    'badge',
    'title_line_1',
    'title_line_2',
    'description',
    'primary_button_label',
    'secondary_button_label'
  ], currentLang), [content, currentLang]);

  const textAlign = config.textAlign || "left";
  const isCentered = textAlign === "center";

  return (
    <section className="relative min-h-screen min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#0A0C0B]">
      {/* Immersive Background Image Container with Blur-up */}
      <div className="absolute inset-0 z-0 bg-[#0A0C0B]">
        {content.hero_image_url && (
          <motion.img 
            ref={imgRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 0.6 : 0 }}
            transition={{ duration: 1.2 }}
            onLoad={() => setImageLoaded(true)}
            src={optimizeCloudinary(content.hero_image_url, { 
              width: typeof window !== 'undefined' && window.innerWidth < 768 ? 1080 : 1920 
            })} 
            alt="" 
            // @ts-expect-error - fetchpriority is a new attribute
            fetchpriority="high"
            className={`w-full h-full object-cover object-center md:object-[center_20%] transition-all duration-[800ms] will-change-transform ${
              imageLoaded ? "blur-0 scale-100" : "blur-sm md:blur-md scale-105"
            }`}
          />
        )}
      </div>

      {/* Layered Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

      {/* Content Card - Renders Immediately */}
      <div className="container mx-auto px-6 relative z-20 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={`relative max-w-3xl w-full p-10 md:p-16 lg:p-20 rounded-[3rem] bg-white/95 md:bg-white/85 backdrop-blur-none md:backdrop-blur-2xl border border-white/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden group will-change-transform ${
            isCentered ? "text-center mx-auto" : "text-left"
          }`}
        >
          {/* Subtle Decorative Accent */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-sage/40" />

          {/* Badge & Line */}
          <div className={`flex items-center gap-4 mb-10 ${isCentered ? "justify-center" : "justify-start"}`}>
            <span className="font-display text-[12px] md:text-sm tracking-[0.4em] uppercase text-sage font-bold">
              {fields.badge}
            </span>
             <div className="h-px w-10 bg-sage/30 md:w-20" />
          </div>

          <div className="space-y-8 md:space-y-10">
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light leading-[1] text-heading tracking-tight will-change-transform">
              {fields.title_line_1}
              <br />
              <span className="italic font-normal text-sage/70 drop-shadow-sm">
                {fields.title_line_2}
              </span>
            </h1>

            <p className="font-body text-base md:text-xl text-heading/60 font-light leading-relaxed max-w-2xl">
              {fields.description}
            </p>

            <div className={`flex flex-col sm:flex-row items-center gap-6 md:gap-8 pt-6 ${isCentered ? "justify-center" : "justify-start"}`}>
              {fields.primary_button_label && (
                <button
                  onClick={() => onNavigate(content.primary_button_url || "/portfolio")}
                  className="group relative px-12 py-5 bg-heading text-white font-display text-[12px] tracking-[0.3em] uppercase font-bold overflow-hidden transition-all duration-500 w-full sm:w-auto text-center rounded-full hover:scale-105 active:scale-95 shadow-2xl shadow-heading/20"
                >
                  <span className="relative z-10">
                    {fields.primary_button_label}
                  </span>
                  <div className="absolute inset-0 bg-sage translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </button>
              )}
              
              {fields.secondary_button_label && (
                <button
                  onClick={() => onNavigate(content.secondary_button_url || "/#contact")}
                  className="group relative px-12 py-5 bg-transparent border border-heading/20 text-heading font-display text-[12px] tracking-[0.3em] uppercase font-bold overflow-hidden transition-all duration-500 w-full sm:w-auto text-center rounded-full hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                    {fields.secondary_button_label}
                  </span>
                  <div className="absolute inset-0 bg-heading translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
});

HeroCardOverlayLayout.displayName = "HeroCardOverlayLayout";
