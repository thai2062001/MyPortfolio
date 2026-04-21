import { motion } from "framer-motion";
import { useState, useRef, useEffect, memo, useMemo } from "react";
import type { HeroSectionWithLayout } from "@/types/admin";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { ScrollIndicator } from "../shared/ScrollIndicator";
import { getLocalizedFields, SupportedLang } from "@/lib/content-utils";

interface HeroCenteredLayoutProps {
  content: HeroSectionWithLayout;
  config: Record<string, any>;
  onNavigate: (to: string) => void;
  lang: string;
}

export const HeroCenteredLayout = memo(({
  content,
  onNavigate,
  lang,
}: HeroCenteredLayoutProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const currentLang = lang as SupportedLang;

  const fields = useMemo(() => getLocalizedFields(content, [
    'title_line_1',
    'description',
    'primary_button_label'
  ], currentLang), [content, currentLang]);

  useEffect(() => {
    if (imageLoaded) {
      window.dispatchEvent(new CustomEvent('hero-ready'));
    }
  }, [imageLoaded]);

  return (
    <section className="relative h-screen min-h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center bg-[#00040d]">
      {/* Background Image */}
      {content.hero_image_url && (
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: imageLoaded ? 1 : 0,
            scale: imageLoaded ? 1 : 1.05
          }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          onLoad={() => setImageLoaded(true)}
          src={optimizeCloudinary(content.hero_image_url, { 
            width: typeof window !== 'undefined' && window.innerWidth < 768 ? 800 : 1920 
          })}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
            imageLoaded ? "blur-0" : "blur-lg"
          }`}
        />
      )}

      {/* Subtle overlays for readability */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 0.4 : 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 0.2 : 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 bg-black/10 pointer-events-none"
      />

      <ScrollIndicator />
    </section>
  );
});

HeroCenteredLayout.displayName = "HeroCenteredLayout";
