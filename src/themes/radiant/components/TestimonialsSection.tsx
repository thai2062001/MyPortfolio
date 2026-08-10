import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { useTestimonials, usePersonalInfo } from "@/core/hooks/usePortfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import SectionHeader from "./shared/SectionHeader";
import AmbientAccent from "./shared/AmbientAccent";
import { TestimonialsModal } from "./TestimonialsModal";
import { fadeIn, staggerContainer } from "@/lib/animations";

// --- Isolated Mobile Carousel Component for Performance ---
const MobileCarousel = memo(({ testimonials, lang }: { testimonials: any[]; lang: string }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Use Embla's built-in canScrollPrev/Next — more accurate than manual index comparison
  const updateState = useCallback((api: any) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    updateState(emblaApi);
    emblaApi.on("select", updateState);
    emblaApi.on("reInit", updateState);
    return () => {
      emblaApi.off("select", updateState);
      emblaApi.off("reInit", updateState);
    };
  }, [emblaApi, updateState]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="flex flex-col gap-6">
      {/* transform-gpu only on the flex container — Embla translates this, not individual slides */}
      <div className="overflow-hidden touch-pan-y" ref={emblaRef}>
        <div className="flex -ml-6 transform-gpu will-change-transform">
          {testimonials.map((testimonial: any) => (
            <div key={testimonial.id} className="flex-none pl-6 w-full">
              <div className="bg-white border border-black/5 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between group h-full select-none">
                <div className="space-y-6">
                  <p className="text-sm md:text-base text-heading/70 leading-relaxed">
                    "{lang === "en" ? testimonial.quote_en : lang === "ja" ? testimonial.quote_ja : testimonial.quote_vi || testimonial.quote_en}"
                  </p>
                </div>
                <div className="flex flex-col mt-10">
                  <span className="font-display font-semibold text-lg text-heading leading-none mb-1">{testimonial.author_name}</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-black/30">
                    {lang === "en" ? testimonial.role_en : lang === "ja" ? testimonial.role_ja : testimonial.role_vi || testimonial.role_en}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Controls */}
      <div className="flex items-center justify-between px-2 mt-2">
        {/* Active dot indicators */}
        <div className="flex gap-1.5">
          {testimonials.slice(0, 5).map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selectedIndex === i ? "bg-sage w-3.5" : "bg-sage/20 w-1.5"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
              canScrollPrev
                ? "border-sage text-sage bg-white"
                : "border-black/10 text-black/20 bg-white cursor-not-allowed"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
              canScrollNext
                ? "border-sage text-sage bg-white"
                : "border-black/10 text-black/20 bg-white cursor-not-allowed"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

MobileCarousel.displayName = "MobileCarousel";

const TestimonialsSection = memo(() => {
  const { lang, t } = useLang();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const testimonialsQuery = useTestimonials();
  const { data: personalInfo } = usePersonalInfo();
  const [isTestimonialsModalOpen, setIsTestimonialsModalOpen] = useState(false);
  
  // useMemo prevents new array reference on every re-render, so MobileCarousel memo works correctly
  const testimonials = useMemo(() => testimonialsQuery.data || [], [testimonialsQuery.data]);
  const loading = testimonialsQuery.isLoading;

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
             <div className="h-[400px] bg-gray-100 rounded-[2.5rem]" />
             <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-[250px] bg-gray-50 rounded-[2rem]" />
                ))}
             </div>
           </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const handleOpenTestimonials = () => {
    setIsTestimonialsModalOpen(true);
  };

  return (
    <section className="py-24 md:py-48 bg-background relative overflow-hidden" id="kind-words">
      {/* AmbientAccent: desktop only — blur filter is expensive on mobile GPUs */}
      {!isTablet && (
        <AmbientAccent
          position="center-left"
          color="bg-vibe-pink"
          size={1000}
          opacity={0.05}
          blur={180}
        />
      )}
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <SectionHeader
          align="center"
          className="mb-20 md:mb-32"
          eyebrow={lang === "en" ? "Kind Words" : lang === "ja" ? "お客様の声" : "Lời khen tặng"}
          eyebrowClassName="font-artistic text-vibe-pink text-2xl md:text-3xl block mb-4"
          title={
            <>
              {lang === "en" ? "What they say about" : lang === "ja" ? "共に創り上げた" : "Những gì họ nói về"} <br/>
              <span className="font-artistic text-sage lowercase">
                {lang === "en" ? "the results." : lang === "ja" ? "素晴らしい成果" : "kết quả đạt được."}
              </span>
            </>
          }
          titleClassName="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-heading"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: PROFESSIONAL MOTTO CARD */}
          <motion.div 
            className="lg:col-span-4 bg-heading rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden group shadow-lg md:shadow-2xl min-h-[500px]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Subtle glow effect — hidden on mobile to reduce paint cost */}
            <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-vibe-pink/10 transition-colors duration-700" />
            
            <div className="relative z-10 flex flex-col h-full items-center text-center justify-between py-2">
              {/* Decorative Quote Mark */}
              <div className="flex items-center justify-center mb-0 transition-all duration-700">
                <span className="text-sage text-7xl md:text-8xl font-display leading-none opacity-40">“</span>
              </div>

              <div className="space-y-12 flex-1 flex flex-col justify-center">
                <h3 className="font-display text-4xl md:text-5xl lg:text-5xl tracking-tight leading-[1.3] italic text-white/90">
                  Code builds the vision. <br/>
                  <span className="text-sage drop-shadow-[0_0_15px_rgba(112,164,136,0.3)]">Innovation</span> drives the impact.
                </h3>

                <div className="pt-6 flex flex-col items-center gap-4 w-full">
                  <div className="flex items-center gap-4 w-full justify-center px-2">
                    <div className="h-px flex-1 max-w-[30px] bg-white/10 hidden sm:block" />
                    <span className="font-artistic text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap">
                      {personalInfo?.full_name || "Bá Thái"}
                    </span>
                    <div className="h-px flex-1 max-w-[30px] bg-white/10 hidden sm:block" />
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-white/30">
                       Marketing Executive
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                      <span className="text-[7px] tracking-[0.2em] uppercase font-mono text-white/40">
                         Verified Identity
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-12 w-full px-4">
                <motion.button 
                  onClick={handleOpenTestimonials}
                  whileHover={!isMobile ? { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" } : undefined}
                  whileTap={!isMobile ? { scale: 0.98, y: 0 } : undefined}
                  className="group/btn relative w-full bg-white/10 backdrop-blur-md border border-white/10 py-5 px-8 rounded-full transition-all duration-300 overflow-hidden text-center"
                >
                  {/* The Sage Background Fill Layer */}
                  {!isMobile && (
                    <div className="absolute inset-0 bg-sage translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                  )}

                  {/* Button Text */}
                  <span className="relative z-10 transition-colors duration-500 font-display text-xl md:text-2xl tracking-tight normal-case text-white">
                    {lang === "en" ? "View All Reviews" : lang === "ja" ? "すべてのレビューを表示" : "Xem tất cả đánh giá"}
                  </span>
                  
                  {/* Subtle glass reflection on top */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-0 transition-opacity duration-300" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: TESTIMONIALS GRID (PC) & CAROUSEL (Mobile) */}
          <div className="lg:col-span-8">
            {/* Desktop View: Pure Static Grid */}
            {!isTablet && (
              <motion.div 
                variants={staggerContainer(0.08, 0)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="lg:grid lg:grid-cols-2 lg:gap-6"
              >
              {testimonials.map((testimonial, idx) => (
                <motion.div 
                  key={testimonial.id}
                  variants={fadeIn("up", 0.2)}
                >
                  <div className="bg-white/50 backdrop-blur-sm border border-black/5 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between hover:bg-sage hover:shadow-2xl hover:border-sage transition-all duration-500 group h-full cursor-default select-none">
                    <div className="space-y-6">
                       <p className="text-sm md:text-base text-heading/70 leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                          "{lang === "en" ? testimonial.quote_en : lang === "ja" ? testimonial.quote_ja : (testimonial as any).quote_vi || testimonial.quote_en}"
                       </p>
                    </div>

                    <div className="flex flex-col mt-10">
                       <span className="font-display font-semibold text-lg text-heading leading-none mb-1 group-hover:text-white transition-colors duration-500">{testimonial.author_name}</span>
                       <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-black/30 group-hover:text-white/60 transition-colors duration-500">
                          {lang === "en" ? testimonial.role_en : lang === "ja" ? testimonial.role_ja : (testimonial as any).role_vi || testimonial.role_en}
                       </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              </motion.div>
            )}

            {/* Mobile View: Swipable Carousel */}
            {isTablet && (
              <MobileCarousel
                testimonials={testimonials}
                lang={lang}
              />
            )}
          </div>
        </div>
        <TestimonialsModal 
          isOpen={isTestimonialsModalOpen} 
          onClose={() => setIsTestimonialsModalOpen(false)} 
        />
      </div>
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";

export default TestimonialsSection;
