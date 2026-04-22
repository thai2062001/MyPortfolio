import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { createPortal } from "react-dom";
import { optimizeCloudinary } from "@/lib/cloudinary";

interface ProjectImage {
  id: string;
  image_url: string;
  alt_text: string;
  caption: string;
  order_index: number;
}

interface ProjectGalleryProps {
  images: ProjectImage[] | undefined;
  isMobile: boolean;
  t: (key: string, defaultValue: string) => string;
}

export const ProjectGallery = ({
  images,
  isMobile,
  t,
}: ProjectGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const sortedImages = images
    ? [...images].sort((a, b) => a.order_index - b.order_index)
    : [];

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setDirection(-1);
      setCurrentIndex((prev) =>
        prev === 0 ? sortedImages.length - 1 : prev - 1,
      );
    },
    [sortedImages.length],
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setDirection(1);
      setCurrentIndex((prev) =>
        prev === sortedImages.length - 1 ? 0 : prev + 1,
      );
    },
    [sortedImages.length],
  );

  const jumpToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex !== null) {
        if (e.key === "ArrowLeft") {
          setSelectedImageIndex((prev) =>
            prev === 0 ? sortedImages.length - 1 : prev! - 1,
          );
        }
        if (e.key === "ArrowRight") {
          setSelectedImageIndex((prev) =>
            prev === sortedImages.length - 1 ? 0 : prev! + 1,
          );
        }
        if (e.key === "Escape") setSelectedImageIndex(null);
      } else if (sortedImages.length > 1) {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, sortedImages.length, handlePrev, handleNext]);

  // Prevent scroll when lightbox open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedImageIndex]);

  if (!images || images.length === 0) return null;

  const activeImage = sortedImages[currentIndex];

  // Animation variants - Adaptive for Mobile/PC
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isMobile ? "100%" : 500) : (isMobile ? "-100%" : -500),
      opacity: 0,
      scale: 1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? (isMobile ? "100%" : 500) : (isMobile ? "-100%" : -500),
      opacity: 0,
      scale: 1,
    }),
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="w-full relative z-10">
        {/* Main Slider Area */}
        <div className="relative aspect-[3/4] md:aspect-[16/9] w-full rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl bg-[#111] cursor-pointer group isolate">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.6 },
                opacity: { duration: 0.4 },
              }}
              className="absolute inset-0 w-full h-full"
              onClick={() => setSelectedImageIndex(currentIndex)}
            >
              <img
                src={optimizeCloudinary(activeImage.image_url, { width: 1600, quality: "best" })}
                srcSet={activeImage.image_url.includes("res.cloudinary.com") ? [
                  `${optimizeCloudinary(activeImage.image_url, { width: 600 })} 600w`,
                  `${optimizeCloudinary(activeImage.image_url, { width: 1200 })} 1200w`,
                  `${optimizeCloudinary(activeImage.image_url, { width: 2000 })} 2000w`,
                  `${optimizeCloudinary(activeImage.image_url, { width: 2400 })} 2400w`,
                ].join(", ") : undefined}
                sizes="(max-width: 768px) 100vw, 1600px"
                alt={activeImage.alt_text || "Project Image"}
                className="w-full h-full object-cover scale-[1.01] group-hover:scale-[1.03] transition-transform duration-700 ease-[0.22, 1, 0.36, 1]"
              />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-10 md:p-20 flex flex-col justify-end z-20 pointer-events-none">
                <div className="space-y-6 max-w-4xl">
                  {/* Floating Captions */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1.2 }}
                    className="pointer-events-auto"
                  >
                    {activeImage.caption && (
                      <div className="inline-block bg-black/60 md:bg-black/40 md:backdrop-blur-sm px-10 py-6 rounded-[2rem] border border-white/10 shadow-2xl mb-8">
                        <p className="font-body text-xl md:text-2xl font-light text-white/90 leading-relaxed italic">
                          "{activeImage.caption}"
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Only Floating Controls */}
          {isMobile && sortedImages.length > 1 && (
            <div className="absolute inset-x-0 bottom-6 px-6 flex justify-between z-30">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white shadow-xl"
              >
                <ChevronLeft size={20} strokeWidth={1} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white shadow-xl"
              >
                <ChevronRight size={20} strokeWidth={1} />
              </button>
            </div>
          )}

          {/* Maximize Icon */}
          {!isMobile && (
             <div className="absolute top-10 right-10 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div 
                className="w-20 h-20 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(currentIndex);
                }}
              >
                <Maximize2 size={24} strokeWidth={1} />
              </div>
            </div>
          )}
        </div>

        {/* Progress System & Bottom Controls */}
        {sortedImages.length > 1 && (
          <div className="mt-16 md:mt-24 flex flex-col items-center gap-12">
            <div className="flex items-center justify-center gap-4 md:gap-8 w-full max-w-4xl mx-auto">
              {!isMobile && (
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-all duration-300 shrink-0"
                >
                  <ChevronLeft size={24} strokeWidth={2} />
                </button>
              )}

              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {sortedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => jumpToSlide(idx)}
                    className={`relative group transition-all duration-500 ${
                      currentIndex === idx ? "scale-105" : "opacity-30 hover:opacity-100"
                    }`}
                  >
                    <div className="relative w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-lg">
                      <img src={optimizeCloudinary(img.image_url, { width: 200, quality: "auto" })} alt="" className="w-full h-full object-cover" />
                      {currentIndex === idx && (
                        <motion.div
                          className="absolute inset-0 bg-black/20 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                           <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-white/60 flex items-center justify-center animate-spin-slow">
                              <div className="w-1 h-1 rounded-full bg-white" />
                           </div>
                        </motion.div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {!isMobile && (
                <button
                  onClick={handleNext}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-all duration-300 shrink-0"
                >
                  <ChevronRight size={24} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal via Portal */}
      {!isMobile && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedImageIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100005] flex items-center justify-center bg-[#111]/98 backdrop-blur-none md:backdrop-blur-md p-6 md:p-20"
              onClick={() => setSelectedImageIndex(null)}
            >
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-10 right-10 w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all z-[100006]"
                onClick={() => setSelectedImageIndex(null)}
              >
                <X size={28} strokeWidth={1.5} />
              </motion.button>

              {/* Lightbox Nav */}
              {sortedImages.length > 1 && (
                <>
                  <div className="fixed inset-y-0 left-10 flex items-center z-[100007]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(prev => prev === 0 ? sortedImages.length - 1 : prev! - 1);
                      }}
                      className="w-20 h-20 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center pointer-events-auto"
                    >
                      <ChevronLeft size={48} strokeWidth={1} />
                    </button>
                  </div>

                  <div className="fixed inset-y-0 right-10 flex items-center z-[100007]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(prev => prev === sortedImages.length - 1 ? 0 : prev! + 1);
                      }}
                      className="w-20 h-20 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center pointer-events-auto"
                    >
                      <ChevronRight size={48} strokeWidth={1} />
                    </button>
                  </div>
                </>
              )}

              {/* Lightbox Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-w-8xl w-full h-full flex flex-col items-center justify-center gap-12 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  if (x < rect.width / 2) {
                    setSelectedImageIndex(prev => prev === 0 ? sortedImages.length - 1 : prev! - 1);
                  } else {
                    setSelectedImageIndex(prev => prev === sortedImages.length - 1 ? 0 : prev! + 1);
                  }
                }}
              >
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={optimizeCloudinary(sortedImages[selectedImageIndex].image_url, { quality: "best", width: 2400 })}
                  alt={sortedImages[selectedImageIndex].alt_text}
                  className="w-full max-w-full h-full max-h-[90vh] object-contain shadow-2xl"
                />

                <div className="text-center space-y-6 max-w-4xl">
                  {sortedImages[selectedImageIndex].caption && (
                    <p className="font-display text-2xl md:text-3xl text-white/90 leading-tight italic">
                      "{sortedImages[selectedImageIndex].caption}"
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
