import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const usePortfolioPinTimeline = (
  containerRef: RefObject<HTMLDivElement>,
  isLoaded: boolean,
  isDisabled: boolean
) => {
  useEffect(() => {
    if (isDisabled || !isLoaded || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current!;
      const cardMain = container.querySelector(".pin-card-main");
      const cardSub = container.querySelector(".pin-card-sub");
      const overlay = container.querySelector(".pin-overlay");
      const carouselStage = container.querySelector(".pin-carousel-stage");
      const firstImage = container.querySelector(".pin-carousel-first-image");
      const firstText = container.querySelector(".pin-carousel-first-text");
      const carouselButtons = container.querySelector(".pin-carousel-buttons");

      if (!cardMain || !cardSub || !overlay || !carouselStage) return;

      // ── INITIAL STATES (Giai đoạn 1) ──
      // cardMain: hơi nghiêng, sáng hoàn toàn, nằm lệch trên-trái
      gsap.set(cardMain, {
        xPercent: -5,
        yPercent: -5,
        scale: 1,
        opacity: 1,
        rotation: -4,
        filter: "brightness(1)",
        transformOrigin: "center center",
      });
      // cardSub: nghiêng +6deg, giữ độ sáng nguyên bản
      gsap.set(cardSub, {
        xPercent: 15,
        yPercent: 10,
        scale: 0.9,
        opacity: 1,
        rotation: 6,
        filter: "none",
        transformOrigin: "center center",
      });
      gsap.set(overlay, { opacity: 0 });

      // Carousel initial state: mờ đục, nhỏ hơn ở giữa (scale 0.7), có blur nhẹ
      gsap.set(carouselStage, { 
        opacity: 0,
        scale: 0.7,
        filter: "blur(12px)",
        transformOrigin: "center center",
      });

      if (firstImage) {
        gsap.set(firstImage, {
          scale: 0.85,
          filter: "blur(15px)",
          opacity: 0,
        });
      }

      if (firstText) {
        gsap.set(firstText, {
          y: 30,
          opacity: 0,
        });
      }

      // Buttons: ẩn hoàn toàn ban đầu, pointer-events-none
      // Sẽ hiện ra SAU KHI title animation xong (position 0.88)
      if (carouselButtons) {
        gsap.set(carouselButtons, {
          opacity: 0,
          y: 10,
          pointerEvents: "none",
        });
      }

      // ── CREATE TIMELINE ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ─── GIAI ĐOẠN 2 (0% → 35%): Tách card, GIỮ NGUYÊN SÁNG 100% ───
      tl.to(cardSub, {
        xPercent: 42,
        yPercent: 5,
        rotation: 0,
        opacity: 1,
        filter: "none",
        duration: 0.35,
        ease: "none",
      }, 0);

      tl.to(cardMain, {
        xPercent: -22,
        rotation: 0,
        opacity: 1,
        filter: "none",
        duration: 0.35,
        ease: "none",
      }, 0);

      // ─── GIAI ĐOẠN 3a (35% → 60%): Di chuyển ra mép, GIỮ SÁNG 100% ───
      tl.to(cardMain, {
        xPercent: -95,
        scale: 0.9,
        opacity: 1,
        filter: "none",
        duration: 0.25,
        ease: "none",
      }, 0.35);

      tl.to(cardSub, {
        xPercent: 95,
        scale: 0.9,
        opacity: 1,
        filter: "none",
        duration: 0.25,
        ease: "none",
      }, 0.35);

      // ─── GIAI ĐOẠN 3b (60% → 80%): TRƯỚC KHỦNG TRƯỢT RA MÉP → OPACITY GIẢM VỀ 10% ───
      tl.to(cardMain, {
        xPercent: -145,
        scale: 0.85,
        opacity: 0.1,
        filter: "none",
        duration: 0.2,
        ease: "none",
      }, 0.6);

      tl.to(cardSub, {
        xPercent: 145,
        scale: 0.85,
        opacity: 0.1,
        filter: "none",
        duration: 0.2,
        ease: "none",
      }, 0.6);

      // ─── GIAI ĐOẠN 4 (45% → 85%): Carousel vừa mờ tới rõ, vừa phóng to từ giữa ra ───
      tl.to(carouselStage, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.4,
        ease: "power1.out",
        // Bật pointer-events khi carousel bắt đầu fade vào
        onStart: () => {
          (carouselStage as HTMLElement).style.pointerEvents = "auto";
        },
        // Tắt lại khi scroll ngược (carousel fading out)
        onReverseComplete: () => {
          (carouselStage as HTMLElement).style.pointerEvents = "none";
        },
      }, 0.45);

      if (firstImage) {
        tl.to(firstImage, {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.35,
          ease: "power1.out",
        }, 0.5);
      }

      // ─── Text stagger cuối (75% → 100%) ───
      if (firstText) {
        tl.to(firstText, {
          y: 0,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        }, 0.75);
      }

      // ─── Buttons xuất hiện SAU title (88% → 100%) ───
      // firstText xong tại 0.75 + 0.25 = 1.0
      // Buttons bắt đầu tại 0.88 → hiện ra cùng lúc title đang hoàn thiện
      if (carouselButtons) {
        tl.to(carouselButtons, {
          opacity: 1,
          y: 0,
          duration: 0.14,
          ease: "power2.out",
          onStart: () => {
            (carouselButtons as HTMLElement).style.pointerEvents = "auto";
          },
          onReverseComplete: () => {
            (carouselButtons as HTMLElement).style.pointerEvents = "none";
          },
        }, 0.88);
      }

      // Refresh ScrollTrigger sau khi setup xong
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [containerRef, isLoaded, isDisabled]);
};
