import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
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
}

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";
};

export const ProjectGallery = memo(({ images, isMobile }: ProjectGalleryProps) => {
  const sortedImages = useMemo(
    () => images ? [...images].sort((a, b) => a.order_index - b.order_index) : [],
    [images]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    duration: 30,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Keyboard navigation
  useEffect(() => {
    if (isMobile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!emblaApi || sortedImages.length <= 1) return;
      if (e.key === "ArrowLeft") emblaApi.scrollPrev();
      if (e.key === "ArrowRight") emblaApi.scrollNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi, sortedImages.length, isMobile]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Embla Viewport — Embla keeps all slides in DOM, GPU translate handles transitions */}
      <div
        className="overflow-hidden w-full touch-pan-y rounded-[2.5rem] md:rounded-[4rem] bg-[#111] shadow-2xl isolate"
        ref={emblaRef}
      >
        <div className="flex">
          {sortedImages.map((img, idx) => (
            <div
              key={img.id}
              className={`flex-none w-full relative overflow-hidden ${
                isMobile ? "aspect-[4/5]" : "aspect-[16/9]"
              }`}
            >
              <img
                src={optimizeCloudinary(img.image_url, { width: isMobile ? 800 : 1600, quality: "best" })}
                srcSet={img.image_url.includes("res.cloudinary.com") ? [
                  `${optimizeCloudinary(img.image_url, { width: 600 })} 600w`,
                  `${optimizeCloudinary(img.image_url, { width: 1200 })} 1200w`,
                  `${optimizeCloudinary(img.image_url, { width: 1600 })} 1600w`,
                  `${optimizeCloudinary(img.image_url, { width: 2000 })} 2000w`,
                ].join(", ") : undefined}
                sizes={isMobile ? "100vw" : "(max-width: 768px) 100vw, 1600px"}
                alt={img.alt_text || "Project Image"}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                onError={handleImageError}
                className="w-full h-full object-cover brightness-[0.98]"
              />

              {/* Caption overlay */}
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 md:p-16 pt-12 md:pt-24 text-left pointer-events-none z-20">
                  <p className="font-body text-base md:text-2xl font-light text-white/90 leading-relaxed italic inline-block bg-black/30 backdrop-blur-sm px-6 md:px-10 py-3 md:py-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-2xl">
                    "{img.caption}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {sortedImages.length > 1 && (
        <div className="mt-8 md:mt-16 flex items-center justify-center gap-4 md:gap-8 w-full max-w-4xl mx-auto">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-all duration-300 shrink-0"
          >
            <ChevronLeft size={isMobile ? 20 : 24} strokeWidth={2} />
          </button>

          {/* Dots (mobile) / Thumbnails (desktop) */}
          {isMobile ? (
            <div className="flex gap-2">
              {sortedImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    selectedIndex === idx ? "bg-vibe-pink w-3.5" : "bg-white/20 w-1.5"
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {sortedImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`relative group transition-all duration-500 ${
                    selectedIndex === idx ? "scale-105" : "opacity-30 hover:opacity-100"
                  }`}
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={optimizeCloudinary(img.image_url, { width: 200, quality: "auto" })}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                    {selectedIndex === idx && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-white/60 flex items-center justify-center animate-spin-slow">
                          <div className="w-1 h-1 rounded-full bg-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => emblaApi?.scrollNext()}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-all duration-300 shrink-0"
          >
            <ChevronRight size={isMobile ? 20 : 24} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
});

ProjectGallery.displayName = "ProjectGallery";
