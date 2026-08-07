import { memo, useEffect, useState, useCallback, useRef, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useProjects } from "@/core/hooks/usePortfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useLang } from "@/contexts/LangContext";
import { getLocalizedField, SupportedLang } from "@/lib/content-utils";

// ─── Embla Tween Scale (official pattern) ────────────────────────────────────
// Ref: https://www.embla-carousel.com/examples/predefined/#scale
// KEY FIX: Dùng engine.slideLooper.loopPoints để correct diffToTarget khi
// Embla teleport slide (loop), tránh giật ở transition item đầu ↔ item cuối.
// ─────────────────────────────────────────────────────────────────────────────

const TWEEN_FACTOR_BASE = 0.4;

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

interface ProjectCarouselStageProps {
  onNavigate: (slug: string) => void;
}

export const ProjectCarouselStage = memo(
  ({ onNavigate }: ProjectCarouselStageProps) => {
    const { data: projects, isLoading } = useProjects();
    const { lang } = useLang();
    const currentLang = lang as SupportedLang;

    const rawProjects = useMemo(() => projects || [], [projects]);

    // ─── Embla: loop: true, KHÔNG clone thủ công ───────────────────────────
    const [emblaRef, emblaApi] = useEmblaCarousel({
      align: "center",
      loop: true,
      skipSnaps: false,
      dragFree: false,
      startIndex: 1, // Mặc định active item 2 (index 1)
    });

    const [selectedIndex, setSelectedIndex] = useState(1); // item 2 active mặc định

    // refs để DOM manipulation trực tiếp (không setState mỗi scroll → không re-render)
    const tweenFactor = useRef(0);
    const cardNodes = useRef<(HTMLElement | null)[]>([]);
    // Cache snapList — không tạo array mới mỗi scroll frame
    const snapListCache = useRef<number[]>([]);

    // ─── Lưu ref đến từng .carousel-card ────────────────────────────────────
    const collectCardNodes = useCallback((api: typeof emblaApi) => {
      if (!api) return;
      cardNodes.current = api.slideNodes().map((slide) =>
        slide.querySelector<HTMLElement>(".carousel-card")
      );
    }, []);

    // ─── Tính hệ số tween + cache snapList ─────────────────────────────────
    const updateTweenFactor = useCallback((api: typeof emblaApi) => {
      if (!api) return;
      snapListCache.current = api.scrollSnapList(); // cache, tránh alloc mỗi frame
      tweenFactor.current = TWEEN_FACTOR_BASE * snapListCache.current.length;
    }, []);

    // ─── HÀM CHÍNH: tween scale / opacity / rotateY ────────────────────────
    // FIX loop wrap: loopPoints correction để tránh giật khi wrap-around.
    // PERF: Dùng slidesInView guard khi scroll (60fps smooth).
    //       Khi settle (scroll dừng), full update tất cả — fix bug slide bị
    //       stuck opacity cũ sau khi Embla teleport loop.
    const applyTween = useCallback(
      (api: typeof emblaApi, onlyInView = true) => {
        if (!api) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const engine = (api as any).internalEngine();
        const scrollProgress = api.scrollProgress();
        const slidesInView = onlyInView ? api.slidesInView() : null;
        const snaps = snapListCache.current;
        if (snaps.length === 0) return;

        snaps.forEach((snapPos: number, snapIdx: number) => {
          let diffToTarget = snapPos - scrollProgress;

          const slidesInSnap: number[] = engine.slideRegistry[snapIdx];

          slidesInSnap.forEach((slideIdx: number) => {
            // Guard: chỉ update slides trong viewport khi đang scroll
            // onlyInView=false (settle/select) → bỏ guard, update tất cả
            if (onlyInView && slidesInView && !slidesInView.includes(slideIdx)) return;

            // ── KEY FIX: Loop point correction ──────────────────────────────
            if (engine.options.loop) {
              engine.slideLooper.loopPoints.forEach((loopItem: any) => {
                const target = loopItem.target();
                if (slideIdx === loopItem.index && target !== 0) {
                  const sign = Math.sign(target);
                  if (sign === -1) diffToTarget = snapPos - (1 + scrollProgress);
                  if (sign === 1)  diffToTarget = snapPos + (1 - scrollProgress);
                }
              });
            }

            const tweenRaw = 1 - Math.abs(diffToTarget * tweenFactor.current);
            const tweenValue = clamp(tweenRaw, 0, 1);

            const scale = 0.82 + tweenValue * 0.18;  // 0.82 → 1.0
            const opacity = 0.3 + tweenValue * 0.7;  // 0.3 → 1.0
            const rotateY = (1 - tweenValue) * (diffToTarget > 0 ? 8 : -8);

            const node = cardNodes.current[slideIdx];
            if (node) {
              node.style.transform = `scale(${scale}) perspective(1200px) rotateY(${rotateY}deg)`;
              node.style.opacity = String(opacity);
              node.style.filter = "none";
            }
          });
        });
      },
      []
    );

    const onSelect = useCallback(
      (api: typeof emblaApi) => {
        if (!api) return;
        setSelectedIndex(api.selectedScrollSnap());
      },
      []
    );

    // ─── Gắn events ─────────────────────────────────────────────────────────
    useEffect(() => {
      if (!emblaApi) return;

      collectCardNodes(emblaApi);
      updateTweenFactor(emblaApi);
      applyTween(emblaApi, false); // khởi đầu: update tất cả
      onSelect(emblaApi);

      const onReInit = () => {
        collectCardNodes(emblaApi);
        updateTweenFactor(emblaApi);
        applyTween(emblaApi, false);
        onSelect(emblaApi);
      };
      // scroll: chỉ update slides đang trong viewport → smooth 60fps
      const onScroll = () => applyTween(emblaApi, true);
      // settle: scroll dừng hẳn → full update tất cả slides (fix stuck opacity)
      const onSettle = () => applyTween(emblaApi, false);
      // select: update state + fix style
      const onSelectEv = () => { onSelect(emblaApi); applyTween(emblaApi, false); };

      emblaApi.on("reInit", onReInit);
      emblaApi.on("scroll", onScroll);
      emblaApi.on("settle", onSettle);
      emblaApi.on("select", onSelectEv);

      return () => {
        emblaApi.off("reInit", onReInit);
        emblaApi.off("scroll", onScroll);
        emblaApi.off("settle", onSettle);
        emblaApi.off("select", onSelectEv);
      };
    }, [emblaApi, collectCardNodes, updateTweenFactor, applyTween, onSelect]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    // ─── Loading state ───────────────────────────────────────────────────────
    if (isLoading || rawProjects.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </div>
      );
    }

    const activeProject =
      rawProjects[selectedIndex % rawProjects.length] || rawProjects[0];
    const activeTitle = activeProject
      ? getLocalizedField(activeProject, "title", currentLang)
      : "";

    return (
      <div className="w-full flex flex-col items-center justify-center relative select-none">
        {/* ── Embla Viewport ────────────────────────────────────────────── */}
        <div className="overflow-hidden w-full py-6" ref={emblaRef}>
          <div className="flex items-center">
            {rawProjects.map((p, index) => {
              const localizedTitle = getLocalizedField(p, "title", currentLang);
              const isActive = index === selectedIndex;

              return (
                <div
                  key={p.slug || index}
                  className="flex-[0_0_78%] sm:flex-[0_0_58%] lg:flex-[0_0_44%] min-w-0 px-3 md:px-4"
                >
                  {/*
                   * .carousel-card: target của tween — KHÔNG đặt CSS transition
                   * trên transform/opacity ở đây, vì JS interpolation đảm nhiệm.
                   * PERF: willChange KHÔNG đặt tĩnh — browser tự promote layer
                   * khi cần (transform đang thay đổi). Đặt tĩnh lãng phí VRAM.
                   */}
                  <div
                    className="carousel-card w-full rounded-[1.75rem] overflow-hidden border border-white/10 bg-stone-900 shadow-2xl cursor-pointer"
                    onClick={() =>
                      isActive
                        ? onNavigate(p.slug)
                        : emblaApi?.scrollTo(index)
                    }
                  >
                    <img
                      src={optimizeCloudinary(p.cover_image_url || "", {
                        width: 800,
                      })}
                      alt={localizedTitle}
                      loading={index <= 1 ? "eager" : "lazy"}
                      decoding={index <= 1 ? "sync" : "async"}
                      className="w-full aspect-[4/3] object-cover"
                      // @ts-expect-error – non-standard fetchpriority attr
                      fetchpriority={index <= 1 ? "high" : "auto"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keyframe: chỉ title+tags animate khi slide đổi, buttons đứng yên */}
        <style>{`
          @keyframes carousel-fade-up {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .carousel-info-in {
            animation: carousel-fade-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
        `}</style>

        {/*
         * ── Title + Tags: re-animate mỗi lần đổi slide (key trick) ──────
         * Buttons KHÔNG nằm trong block này → không bị re-animate.
         */}
        {activeProject && (
          <div
            key={`carousel-info-${selectedIndex}`}
            className="carousel-info-in text-center mt-4 space-y-2 px-4 max-w-xl mx-auto pin-carousel-first-text"
          >
            <h3
              className="font-display text-2xl md:text-4xl text-white font-bold tracking-tight cursor-pointer hover:text-white/80 transition-colors duration-200"
              onClick={() => onNavigate(activeProject.slug)}
            >
              {activeTitle}
            </h3>

            {(activeProject as any).project_tags?.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {(activeProject as any).project_tags.map(
                  (tagObj: any, tagIdx: number) => {
                    const tagName = tagObj.tags?.name || tagObj.name;
                    if (!tagName) return null;
                    return (
                      <span
                        key={`${tagObj.tag_id || tagName}-${tagIdx}`}
                        className="text-[11px] md:text-xs font-sans tracking-wider uppercase px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/10 backdrop-blur-sm"
                      >
                        {tagName}
                      </span>
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}

        {/*
         * ── Buttons: đứng yên, KHÔNG re-animate khi slide đổi ───────────
         * Hover style khớp với title: mượt, tinh tế, transition duration ngắn.
         * Giống title dùng opacity/color transition thay vì scale mạnh.
         */}
        <div className="pin-carousel-buttons flex items-center justify-center gap-3 mt-5">
          <button
            onClick={scrollPrev}
            className="group w-10 h-10 rounded-full bg-white/8 border border-white/12 text-white/50 hover:text-white hover:bg-white/16 hover:border-white/25 flex items-center justify-center transition-all duration-300 hover:-translate-x-0.5 active:scale-90"
            aria-label="Previous project"
          >
            <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={scrollNext}
            className="group w-10 h-10 rounded-full bg-white/8 border border-white/12 text-white/50 hover:text-white hover:bg-white/16 hover:border-white/25 flex items-center justify-center transition-all duration-300 hover:translate-x-0.5 active:scale-90"
            aria-label="Next project"
          >
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }
);

ProjectCarouselStage.displayName = "ProjectCarouselStage";
