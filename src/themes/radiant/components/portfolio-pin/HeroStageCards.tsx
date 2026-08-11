import { memo, useMemo } from "react";
import { optimizeCloudinary } from "@/lib/cloudinary";

interface HeroStageCardsProps {
  projects?: any[];
}

export const HeroStageCards = memo(({ projects }: HeroStageCardsProps) => {
  // Link ảnh gốc mặc định làm phương án dự phòng
  const defaultImageUrl = "https://res.cloudinary.com/dpdzbuiml/image/upload/w_1920,c_fit,dpr_auto,q_auto,f_auto/v1785488719/common/shbirsq5uksig3pt9rgd.webp";

  const { cardMainImage, cardSubImage } = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { cardMainImage: defaultImageUrl, cardSubImage: defaultImageUrl };
    }

    // 1. Loại bỏ project ở index 1 (project active mặc định trong carousel)
    const activeIndex = 1;
    const remainingProjects = projects.filter((_, idx) => idx !== activeIndex);

    if (remainingProjects.length === 0) {
      const singleCover = projects[0]?.cover_image_url || defaultImageUrl;
      return { cardMainImage: singleCover, cardSubImage: singleCover };
    }

    // 2. Chọn cố định 2 index dựa trên độ dài danh sách (để không bị đổi ngẫu nhiên mỗi render)
    const idx1 = 0; // Luôn chọn phần tử đầu tiên
    const idx2 = remainingProjects.length > 1 ? remainingProjects.length - 1 : 0; // Chọn phần tử cuối

    const mainImg = remainingProjects[idx1]?.cover_image_url 
      ? optimizeCloudinary(remainingProjects[idx1].cover_image_url, { width: 1000 })
      : defaultImageUrl;

    const subImg = remainingProjects[idx2]?.cover_image_url
      ? optimizeCloudinary(remainingProjects[idx2].cover_image_url, { width: 1000 })
      : defaultImageUrl;

    return { cardMainImage: mainImg, cardSubImage: subImg };
  }, [projects]);

  return (
    <div className="relative w-full max-w-5xl h-[600px] flex items-center justify-center">
      {/* CARD 2: CARD PHỤ XẾP LỆCH PHÍA SAU-PHẢI */}
      <div className="pin-card-sub absolute w-[56%] md:w-[42%] xl:w-[52%] max-w-3xl aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/15 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] bg-black z-10 will-change-transform">
        <img
          src={cardSubImage}
          alt="Stage Preview Behind"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0B]/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* CARD 1: CARD CHÍNH Ở TRÊN-TRÁI (CÙNG KÍCH THƯỚC BẰNG NHAU) */}
      <div className="pin-card-main absolute w-[56%] md:w-[42%] xl:w-[52%] max-w-3xl aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/15 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] z-20 will-change-transform bg-black">
        <img
          src={cardMainImage}
          alt="Stage Preview Front"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0B]/30 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
});

HeroStageCards.displayName = "HeroStageCards";
export default HeroStageCards;
