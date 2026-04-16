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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentLang = lang as SupportedLang;

  const fields = useMemo(() => getLocalizedFields(content, [
    'title_line_1',
    'description',
    'primary_button_label'
  ], currentLang), [content, currentLang]);

  // Consider the video URL - use from content if it looks like a video, otherwise fallback to hardcoded
  const videoUrl = useMemo(() => optimizeCloudinary(
    content.hero_image_url?.includes('.mp4') || content.hero_image_url?.includes('video/upload')
      ? content.hero_image_url
      : "https://res.cloudinary.com/dpdzbuiml/video/upload/q_auto/f_auto/v1775532590/Cinematic_Woman_Scene_A_woman_sits_at_a_desk_in_a_field_of_flowers_8LsdavUH_xeukdy.mp4"
  ), [content.hero_image_url]);

  useEffect(() => {
    if (videoLoaded) {
      window.dispatchEvent(new CustomEvent('hero-ready'));
    }
  }, [videoLoaded]);

  // Generate a poster image URL from the video URL
  const posterUrl = useMemo(() => videoUrl
    .replace("/video/upload/", "/video/upload/so_0,f_jpg,q_auto,w_1280/")
    .replace(".mp4", ".jpg"), [videoUrl]);

  return (
    <section className="relative h-screen min-h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center bg-[#00040d]">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={posterUrl}
        crossOrigin="anonymous"
        onLoadedMetadata={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover bg-black transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        src={videoUrl}
      />

      {/* Subtle overlays for readability */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: videoLoaded ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: videoLoaded ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 bg-black/10 pointer-events-none"
      />

      {/* Content Overlay - Optionally hidden or minimal as per theme design */}
      <div className="relative z-10 w-full max-w-5xl px-6 text-center" />

      <ScrollIndicator />
    </section>
  );
});

HeroCenteredLayout.displayName = "HeroCenteredLayout";
