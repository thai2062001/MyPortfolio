import { useState, useEffect, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTestimonials, usePersonalInfo } from "@/core/hooks/usePortfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import SectionHeader from "./shared/SectionHeader";
import AmbientAccent from "./shared/AmbientAccent";

const TestimonialsSection = memo(() => {
  const { lang, t } = useLang();
  const isMobile = useIsMobile();
  const testimonialsQuery = useTestimonials();
  const { data: personalInfo } = usePersonalInfo();
  
  const testimonials = testimonialsQuery.data || [];
  const loading = testimonialsQuery.isLoading;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateButtons = useCallback((api: any) => {
    if (!api) return;
    const lastSlideIndex = Math.max(0, testimonials.length - 1);
    const currentIndex = api.selectedScrollSnap();

    setCanScrollPrev(currentIndex > 0);
    setCanScrollNext(currentIndex < lastSlideIndex);
  }, [testimonials.length]);

  useEffect(() => {
    if (!emblaApi) return;

    const handleStateChange = () => updateButtons(emblaApi);
    handleStateChange();

    emblaApi.on("select", handleStateChange);
    emblaApi.on("reInit", handleStateChange);
    emblaApi.on("settle", handleStateChange);

    return () => {
      emblaApi.off("select", handleStateChange);
      emblaApi.off("reInit", handleStateChange);
      emblaApi.off("settle", handleStateChange);
    };
  }, [emblaApi, updateButtons]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

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

  const handleOpenContact = () => {
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  return (
    <section className="py-24 md:py-48 bg-background relative overflow-hidden" id="kind-words">
      {/* Optimized Ambient Background */}
      <AmbientAccent position="center-left" color="bg-vibe-pink" size={1000} opacity={0.05} blur={180} />
      
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
            className="lg:col-span-4 bg-heading rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden group shadow-2xl min-h-[500px]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-vibe-pink/10 transition-colors duration-700" />
            
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
                  onClick={handleOpenContact}
                  initial="initial"
                  whileHover={!isMobile ? "hover" : undefined}
                  whileTap={!isMobile ? "tap" : undefined}
                  variants={{
                    initial: { y: 0 },
                    hover: { 
                      y: -4,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                    },
                    tap: { scale: 0.98, y: 0 }
                  }}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/10 py-5 px-8 rounded-full font-bold text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 relative overflow-hidden group/btn"
                >
                  {/* The White Background Fill Layer */}
                  {!isMobile && (
                    <motion.div 
                      variants={{
                        initial: { x: "-100%" },
                        hover: { x: 0 }
                      }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 bg-white"
                    />
                  )}

                  {/* Button Text */}
                  <motion.span 
                    variants={{
                      initial: { color: "rgba(255, 255, 255, 0.8)" },
                      hover: { color: "#00170b" }
                    }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 transition-colors duration-300 font-sans"
                  >
                    {lang === "en" ? "Leave a review" : lang === "ja" ? "レビューを書く" : "Để lại đánh giá"}
                  </motion.span>
                  
                  {/* Subtle glass reflection on top */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-50 group-hover/btn:opacity-0 transition-opacity duration-300" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: TESTIMONIALS GRID (PC) & CAROUSEL (Mobile) */}
          <div className="lg:col-span-8">
            {/* Desktop View: Pure Static Grid */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
              {testimonials.map((testimonial, idx) => (
                <motion.div 
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <div className="bg-white/50 backdrop-blur-sm border border-black/5 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between hover:bg-sage hover:shadow-2xl hover:border-sage transition-all duration-500 group h-full cursor-default select-none">
                    <div className="space-y-6">
                       <p className="font-body text-sm md:text-base text-heading/70 leading-relaxed italic font-light group-hover:text-white/90 transition-colors duration-500">
                          "{lang === "en" ? testimonial.quote_en : lang === "ja" ? testimonial.quote_ja : (testimonial as any).quote_vi || testimonial.quote_en}"
                       </p>
                    </div>

                    <div className="flex items-center gap-4 mt-10">
                       <div className="w-12 h-12 rounded-full overflow-hidden border border-black/5 group-hover:border-white/20 transition-colors duration-500 bg-black/5 flex items-center justify-center">
                          {testimonial.portrait_url ? (
                            <img 
                              src={optimizeCloudinary(testimonial.portrait_url)} 
                              alt={testimonial.author_name} 
                              className="w-full h-full object-cover transition-all duration-500 pointer-events-none"
                            />
                          ) : (
                            <User className="w-6 h-6 text-heading/20 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                          )}
                       </div>
                       <div className="flex flex-col">
                          <span className="font-display text-lg text-heading leading-none mb-1 group-hover:text-white transition-colors duration-500">{testimonial.author_name}</span>
                          <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-black/30 group-hover:text-white/60 transition-colors duration-500">
                            {lang === "en" ? testimonial.role_en : lang === "ja" ? testimonial.role_ja : (testimonial as any).role_vi || testimonial.role_en}
                          </span>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile View: Swipable Carousel */}
            <div className="lg:hidden flex flex-col gap-6">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-6">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="flex-none pl-6 w-full h-full">
                      <div className="bg-white/80 md:bg-white/50 md:backdrop-blur-sm border border-black/5 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between hover:md:bg-sage transition-all duration-500 group h-full select-none">
                        <div className="space-y-6">
                           <p className="font-body text-sm md:text-base text-heading/70 leading-relaxed italic font-light group-hover:md:text-white/90 transition-colors duration-500">
                              "{lang === "en" ? testimonial.quote_en : lang === "ja" ? testimonial.quote_ja : (testimonial as any).quote_vi || testimonial.quote_en}"
                           </p>
                        </div>
                        <div className="flex items-center gap-4 mt-10">
                           <div className="w-12 h-12 rounded-full overflow-hidden border border-black/5 group-hover:md:border-white/20 transition-colors duration-500 bg-black/5 flex items-center justify-center">
                              {testimonial.portrait_url ? (
                                <img 
                                  src={optimizeCloudinary(testimonial.portrait_url)} 
                                  alt={testimonial.author_name} 
                                  className="w-full h-full object-cover transition-all duration-500 pointer-events-none"
                                />
                              ) : (
                                <User className="w-6 h-6 text-heading/20 group-hover:md:text-white transition-colors duration-500" strokeWidth={1.5} />
                              )}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-display text-lg text-heading leading-none mb-1 group-hover:md:text-white transition-colors duration-500">{testimonial.author_name}</span>
                              <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-black/30 group-hover:md:text-white/60 transition-colors duration-500">
                                {lang === "en" ? testimonial.role_en : lang === "ja" ? testimonial.role_ja : (testimonial as any).role_vi || testimonial.role_en}
                              </span>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation Controls */}
              <div className="flex items-center justify-between px-2 mt-2">
                <div className="flex gap-1.5">
                  {testimonials.slice(0, 5).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 h-1.5 rounded-full bg-sage/20" 
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${canScrollPrev ? 'border-sage text-sage bg-white' : 'border-gray-100 text-gray-200 opacity-50 cursor-not-allowed'}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                  </button>
                  <button 
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${canScrollNext ? 'border-sage text-sage bg-white' : 'border-gray-100 text-gray-200 opacity-50 cursor-not-allowed'}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";

export default TestimonialsSection;
