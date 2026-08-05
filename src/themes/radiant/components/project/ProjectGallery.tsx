import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { optimizeCloudinary } from "@/lib/cloudinary";

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";
};

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

// --- Isolated Touch-Swipeable Mobile/Tablet Carousel ---
const MobileGallery = memo(({
  images,
}: {
  images: ProjectImage[];
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    skipSnaps: false,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const updateButtons = useCallback((api: any) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    const handleStateChange = () => {
      onSelect();
      updateButtons(emblaApi);
    };
    handleStateChange();
    emblaApi.on("select", handleStateChange);
    emblaApi.on("reInit", handleStateChange);
    return () => {
      emblaApi.off("select", handleStateChange);
      emblaApi.off("reInit", handleStateChange);
    };
  }, [emblaApi, onSelect, updateButtons]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Embla Viewport */}
      <div className="overflow-hidden w-full touch-pan-y rounded-[2rem] bg-[#111]" ref={emblaRef}>
        <div className="flex">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="flex-none w-full relative aspect-[4/5] overflow-hidden"
            >
              <img
                src={optimizeCloudinary(img.image_url, { width: 800 })}
                alt={img.alt_text}
                loading={idx === 0 ? "eager" : "lazy"}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with caption */}
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12 text-left pointer-events-none">
                  <p className="font-body text-sm text-white/90 leading-relaxed italic">
                    "{img.caption}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators & Navigation Info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-white/40 tracking-wider">
            {selectedIndex + 1} <span className="mx-1">/</span> {images.length}
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                canScrollPrev 
                  ? "border-white/20 text-white hover:bg-white/10" 
                  : "border-white/5 text-white/10 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                canScrollNext 
                  ? "border-white/20 text-white hover:bg-white/10" 
                  : "border-white/5 text-white/10 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        
        {/* Simple dot indicators */}
        <div className="flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                selectedIndex === idx ? "bg-vibe-pink w-3.5" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

MobileGallery.displayName = "MobileGallery";

export const ProjectGallery = ({
  images,
  isMobile,
  t,
}: ProjectGalleryProps) => {
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

  // Keyboard navigation for desktop slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sortedImages.length > 1) {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sortedImages.length, handlePrev, handleNext]);

  // Preload next and previous images to prevent blank/flickering load state when switching
  useEffect(() => {
    if (sortedImages.length <= 1) return;
    const nextIndex = (currentIndex + 1) % sortedImages.length;
    const prevIndex = (currentIndex - 1 + sortedImages.length) % sortedImages.length;

    [nextIndex, prevIndex].forEach((idx) => {
      const img = new Image();
      img.src = optimizeCloudinary(sortedImages[idx].image_url, { width: 1600, quality: "best" });
      if (sortedImages[idx].image_url.includes("res.cloudinary.com")) {
        const imgMobile = new Image();
        imgMobile.src = optimizeCloudinary(sortedImages[idx].image_url, { width: 600 });
      }
    });
  }, [currentIndex, sortedImages]);

  if (!images || images.length === 0) return null;

  const activeImage = sortedImages[currentIndex];

  // Animation variants for Desktop Slider
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
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
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 1,
    }),
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="w-full relative z-10">
        {isMobile ? (
          <MobileGallery
            images={sortedImages}
          />
        ) : (
          <>
            {/* Desktop Slider Area */}
            <div className="relative aspect-[16/9] w-full rounded-[4rem] overflow-hidden shadow-2xl bg-[#111] isolate">
              <AnimatePresence initial={false} custom={direction}>
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
                    loading="lazy"
                    onError={handleImageError}
                    className="w-full h-full object-cover scale-[1.01] transition-transform duration-700 ease-[0.22, 1, 0.36, 1]"
                  />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-20 flex flex-col justify-end z-20 pointer-events-none">
                    <div className="space-y-6 max-w-4xl">
                      {/* Floating Captions */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 1.2 }}
                        className="pointer-events-auto"
                      >
                        {activeImage.caption && (
                          <div className="inline-block bg-black/40 backdrop-blur-sm px-10 py-6 rounded-[2rem] border border-white/10 shadow-2xl mb-8">
                            <p className="font-body text-2xl font-light text-white/90 leading-relaxed italic">
                              "{activeImage.caption}"
                            </p>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress System & Bottom Controls */}
            {sortedImages.length > 1 && (
              <div className="mt-24 flex flex-col items-center gap-12">
                <div className="flex items-center justify-center gap-8 w-full max-w-4xl mx-auto">
                  <button
                    onClick={handlePrev}
                    className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-all duration-300 shrink-0"
                  >
                    <ChevronLeft size={24} strokeWidth={2} />
                  </button>

                  <div className="flex flex-wrap justify-center gap-6">
                    {sortedImages.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => jumpToSlide(idx)}
                        className={`relative group transition-all duration-500 ${
                          currentIndex === idx ? "scale-105" : "opacity-30 hover:opacity-100"
                        }`}
                      >
                        <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border border-white/10 shadow-lg">
                          <img 
                            src={optimizeCloudinary(img.image_url, { width: 200, quality: "auto" })} 
                            alt="" 
                            loading="lazy"
                            onError={handleImageError}
                            className="w-full h-full object-cover" 
                          />
                          {currentIndex === idx && (
                            <motion.div
                              className="absolute inset-0 bg-black/20 flex items-center justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <div className="w-6 h-6 rounded-full border border-white/60 flex items-center justify-center animate-spin-slow">
                                <div className="w-1 h-1 rounded-full bg-white" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-all duration-300 shrink-0"
                  >
                    <ChevronRight size={24} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
