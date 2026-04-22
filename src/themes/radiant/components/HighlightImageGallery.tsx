import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SkillHighlightImage } from "@/types/skills";

interface HighlightImageGalleryProps {
  images: SkillHighlightImage[];
  highlightTitle: string;
}

export const HighlightImageGallery = ({
  images,
  highlightTitle,
}: HighlightImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [showLightbox, setShowLightbox] = useState(false);
  const isMobile = useIsMobile();

  const currentImage = images[selectedIndex];

  const handlePrevious = () => {
    setDirection(-1);
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), {
    stiffness: 150,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), {
    stiffness: 150,
    damping: 25,
  });

  if (images.length < 2) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      rotate: direction > 0 ? 2 : -2,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      rotate: direction < 0 ? 2 : -2,
    }),
  };

  return (
    <>
      <div className="relative group perspective-1000 -mx-6 md:mx-0">
        {/* Stacked Cards Background Effect - Hidden on mobile */}
        {images.length > 1 && (
          <div className="hidden md:block">
            <div className="absolute top-6 -right-6 w-full h-full bg-white/5 rounded-3xl border border-white/5 -z-10 translate-x-3 translate-y-3" />
            <div className="absolute top-12 -right-12 w-full h-full bg-white/5 rounded-3xl border border-white/5 -z-20 translate-x-6 translate-y-6" />
          </div>
        )}

        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={isMobile ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative bg-white/10 md:bg-white/5 backdrop-blur-none md:backdrop-blur-sm rounded-none md:rounded-3xl overflow-hidden md:shadow-2xl border-y md:border border-white/10 w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:h-[800px] cursor-default group/card"
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={selectedIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                rotate: { duration: 0.4 },
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={optimizeCloudinary(currentImage.image_url, { quality: "best" })}
                alt={currentImage.alt_text || highlightTitle}
                className="w-full h-full object-contain bg-black/40"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/card:opacity-40 transition-opacity duration-500" />
            </motion.div>
          </AnimatePresence>

          {/* Custom Maximize Prompt - Hidden on mobile */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30 scale-0 group-hover/card:scale-100 transition-transform duration-500 hidden md:block">
              <Maximize2 size={24} className="text-white" />
            </div>
            <button
              onClick={() => setShowLightbox(true)}
              className="absolute inset-0 w-full h-full pointer-events-auto cursor-pointer"
            />
          </div>

          {/* Navigation Controls (Desktop Glassmorphism) - Hidden on mobile */}
          <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 items-center gap-6 px-6 py-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === selectedIndex ? "w-8 bg-white" : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Caption Tag */}
          {currentImage.caption && (
            <div className="absolute top-4 md:top-6 left-4 md:left-6 max-w-[80%] px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-white/20 md:bg-white/10 backdrop-blur-none md:backdrop-blur-md border border-white/20 z-20">
              <p className="font-body text-[10px] md:text-xs italic text-white/90 truncate">
                {currentImage.caption}
              </p>
            </div>
          )}

          {/* Counter Tag (Desktop) - Hidden on mobile */}
          <div className="hidden md:block absolute top-6 right-6 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white tracking-widest uppercase z-20">
            {selectedIndex + 1} // {images.length}
          </div>
        </motion.div>

        {/* Mobile Navigation Row - Visible only on mobile */}
        {images.length > 1 && (
          <div className="flex md:hidden items-center justify-between mt-6 px-4">
             <button
              onClick={handlePrevious}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-white active:bg-white/20 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex flex-col items-center gap-2">
               <div className="flex gap-1.5">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === selectedIndex ? "w-6 bg-white" : "w-1.5 bg-white/20"
                      }`}
                    />
                  ))}
               </div>
               <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                {selectedIndex + 1} // {images.length}
               </span>
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-white active:bg-white/20 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal (unchanged) */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            {/* Close Button */}
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>

            {/* Main Image */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <img
                src={optimizeCloudinary(currentImage.image_url, { quality: "best" })}
                alt={currentImage.alt_text || highlightTitle}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>

            {/* Caption in Lightbox */}
            {currentImage.caption && (
              <div className="mt-4 text-white text-center">
                <p className="font-body text-sm italic">
                  {currentImage.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
