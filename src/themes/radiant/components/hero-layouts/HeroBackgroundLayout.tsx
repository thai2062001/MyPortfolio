import { motion } from "framer-motion";
import { useState, useEffect, useMemo, memo } from "react";
import type { HeroSectionWithLayout } from "@/types/admin";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { ScrollIndicator } from "../shared/ScrollIndicator";
import { getLocalizedFields, SupportedLang } from "@/lib/content-utils";

interface HeroBackgroundLayoutProps {
  content: HeroSectionWithLayout;
  config: Record<string, any>;
  onNavigate: (to: string) => void;
  lang: string;
}

export const HeroBackgroundLayout = memo(({
  content,
  config,
  onNavigate,
  lang,
}: HeroBackgroundLayoutProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const currentLang = lang as SupportedLang;

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
    'secondary_button_label'
  ], currentLang), [content, currentLang]);

  const textAlign = config.textAlign || "left";
  const isCentered = textAlign === "center";
  const overlayOpacity = config.overlayOpacity ?? 0.6;

  return (
    <section className="relative min-h-screen min-h-[100svh] w-full flex items-center overflow-hidden bg-[#0A0C0B]">
      {/* Immersive Background Container with Image Support */}
      <div className="absolute inset-0 z-0 bg-[#000]">
        {content.hero_image_url && (
          <motion.img
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: imageLoaded ? 1 : 0,
              scale: imageLoaded ? 1 : 1.1 
            }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            onLoad={() => setImageLoaded(true)}
            src={optimizeCloudinary(content.hero_image_url, { 
              width: typeof window !== 'undefined' && window.innerWidth < 768 ? 800 : 1920 
            })}
            alt=""
            // @ts-expect-error - fetchpriority is a new attribute
            fetchpriority="high"
            className={`w-full h-full object-cover object-[center_30%] transition-all duration-[1500ms] will-change-transform ${
              imageLoaded ? "blur-0" : "blur-lg"
            }`}
          />
        )}
      </div>

      {/* Layered Overlays */}
      <div
        className="absolute inset-0 z-10 bg-black/30 transition-opacity duration-1000"
        style={{ opacity: overlayOpacity }}
      />

      <div
        className={`absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent ${
          isCentered ? "md:bg-gradient-to-b md:from-black/60 md:via-transparent md:to-black/60" : ""
        }`}
      />

      {/* Text/CTA Content - Renders Immediately */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-20">
        <div className={`flex flex-col ${isCentered ? "items-center text-center mx-auto" : "items-start text-left"} max-w-4xl`}>

          {fields.badge?.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px w-8 bg-gold md:w-12" />
              <p className="font-display text-[12px] md:text-sm tracking-[0.4em] uppercase text-gold font-bold">
                {fields.badge}
              </p>
            </motion.div>
          )}

          {(fields.title_line_1?.trim() || fields.title_line_2?.trim()) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 md:space-y-6 mb-8 will-change-transform"
            >
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light leading-[0.9] text-white tracking-tight">
                {fields.title_line_1}
                {fields.title_line_2?.trim() && (
                  <>
                    <br />
                    <span className="italic font-normal text-white/90 lowercase">
                      {fields.title_line_2}
                    </span>
                  </>
                )}
              </h1>
            </motion.div>
          )}

          {fields.description?.trim() && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-body text-base md:text-xl lg:text-2xl text-white/80 font-light leading-relaxed max-w-2xl mb-12 italic"
            >
              {fields.description}
            </motion.p>
          )}

          {(fields.primary_button_label?.trim() || fields.secondary_button_label?.trim()) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 w-full sm:w-auto"
            >
              {fields.primary_button_label && (
                <button
                  onClick={() => onNavigate(content.primary_button_url || "/portfolio")}
                  className="group relative px-12 py-5 bg-white text-[#0A0C0B] font-display text-[12px] tracking-[0.3em] uppercase font-bold overflow-hidden transition-all duration-300 w-full sm:w-auto text-center hover:scale-105 active:scale-95 shadow-2xl shadow-black/20"
                >
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                    {fields.primary_button_label}
                  </span>
                  <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </button>
              )}

              {fields.secondary_button_label && (
                <button
                  onClick={() => onNavigate(content.secondary_button_url || "/#contact")}
                  className="px-12 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-display text-[12px] tracking-[0.3em] uppercase font-bold hover:bg-white/15 hover:border-white/40 transition-all duration-300 w-full sm:w-auto text-center hover:scale-105 active:scale-95"
                >
                  {fields.secondary_button_label}
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
});

HeroBackgroundLayout.displayName = "HeroBackgroundLayout";

