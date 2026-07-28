import { motion, AnimatePresence } from "framer-motion";
import { X, User, Quote } from "lucide-react";
import { useState, useCallback, useEffect, memo } from "react";
import { createPortal } from "react-dom";
import { useLang } from "@/contexts/LangContext";
import { useTestimonials } from "@/core/hooks/usePortfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { fadeIn, staggerContainer } from "@/lib/animations";

interface TestimonialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestimonialsModal = memo(({ isOpen, onClose }: TestimonialsModalProps) => {
  const { lang, t } = useLang();
  const { data: testimonials = [], isLoading } = useTestimonials();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000000] flex items-center justify-center p-0 md:p-10 lg:p-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop - Removing heavy blur to fix "stuttering" */}
          <motion.div
            className="absolute inset-0 bg-heading/40 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            className="relative w-full h-full lg:max-h-[92vh] lg:max-w-6xl ethereal-glass lg:border-white rounded-none lg:rounded-[5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 md:top-12 md:right-12 text-heading/20 hover:text-heading hover:bg-black/5 transition-all duration-300 p-2 md:p-4 rounded-full z-50 bg-white/50 backdrop-blur-md"
            >
              <X size={20} className="md:w-8 md:h-8" strokeWidth={1.5} />
            </button>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto thin-scrollbar p-6 pt-20 pb-20 md:px-16 md:pt-24 md:pb-32">
              <div className="max-w-4xl mx-auto space-y-16">
                
                {/* Header */}
                <div className="space-y-4 text-center">
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="flex items-center justify-center gap-3"
                   >
                     <span className="w-8 h-px bg-vibe-pink/30" />
                     <span className="font-artistic text-2xl md:text-3xl text-vibe-pink">
                       {lang === "en" ? "Kind Words" : lang === "ja" ? "お客様の声" : "Lời khen tặng"}
                     </span>
                     <span className="w-8 h-px bg-vibe-pink/30" />
                   </motion.div>
                   
                   <motion.h3 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.1 }}
                     className="font-display text-4xl md:text-6xl text-heading font-light tracking-tighter leading-tight"
                   >
                      Voices of <br className="md:hidden" />
                      <span className="font-artistic italic text-sage lowercase opacity-80">Trust & Impact.</span>
                   </motion.h3>
                </div>

                {/* Testimonials List */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                  variants={staggerContainer(0.05, 0.1)}
                  initial="hidden"
                  animate="show"
                >
                  {isLoading ? (
                    // Skeleton simple
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="h-64 bg-black/5 rounded-[2.5rem] animate-pulse" />
                    ))
                  ) : testimonials.length > 0 ? (
                    testimonials.map((testimonial: any, idx: number) => (
                      <motion.div 
                        key={testimonial.id}
                        variants={fadeIn("up")}
                        className="bg-white/80 border border-black/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
                      >
                        <div className="absolute top-6 right-8 opacity-5 text-heading">
                          <Quote size={60} strokeWidth={1} />
                        </div>

                        <div className="relative z-10 space-y-8 flex-1 flex flex-col justify-between">
                          <p className="font-body text-base md:text-lg text-heading/80 leading-relaxed italic font-light">
                            "{lang === "en" ? testimonial.quote_en : lang === "ja" ? testimonial.quote_ja : testimonial.quote_vi || testimonial.quote_en}"
                          </p>

                          <div className="flex items-center gap-5 mt-6 pt-6 border-t border-black/5">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-black/10 bg-black/5 flex items-center justify-center shadow-inner">
                              {testimonial.portrait_url ? (
                                <img 
                                  src={optimizeCloudinary(testimonial.portrait_url)} 
                                  alt={testimonial.author_name} 
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-7 h-7 text-heading/20" strokeWidth={1.5} />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-display text-xl text-heading leading-tight mb-0.5">{testimonial.author_name}</span>
                              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-vibe-pink/80">
                                {lang === "en" ? testimonial.role_en : lang === "ja" ? testimonial.role_ja : testimonial.role_vi || testimonial.role_en}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center text-heading/30 font-display text-2xl">
                      No reviews found in the archive.
                    </div>
                  )}
                </motion.div>
                
                {/* Footer Decor */}
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-heading/10 to-transparent mx-auto mt-20" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
});

TestimonialsModal.displayName = "TestimonialsModal";
