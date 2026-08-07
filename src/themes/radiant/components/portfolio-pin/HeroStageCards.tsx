import { memo } from "react";

export const HeroStageCards = memo(() => {
  // Link ảnh do user cung cấp
  const imageUrl = "https://res.cloudinary.com/dpdzbuiml/image/upload/w_1920,c_fit,dpr_auto,q_auto,f_auto/v1785488719/common/shbirsq5uksig3pt9rgd.webp";

  return (
    <div className="relative w-full max-w-5xl h-[600px] flex items-center justify-center">
      {/* CARD 2: CARD PHỤ XẾP LỆCH PHÍA SAU-PHẢI */}
      <div className="pin-card-sub absolute w-[80%] md:w-[75%] max-w-3xl aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/15 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] bg-black z-10 will-change-transform">
        <img
          src={imageUrl}
          alt="Stage Preview Behind"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0B]/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* CARD 1: CARD CHÍNH Ở TRÊN-TRÁI (CÙNG KÍCH THƯỚC BẰNG NHAU) */}
      <div className="pin-card-main absolute w-[80%] md:w-[75%] max-w-3xl aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/15 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] z-20 will-change-transform bg-black">
        <img
          src={imageUrl}
          alt="Stage Preview Front"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0B]/30 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
});

HeroStageCards.displayName = "HeroStageCards";
export default HeroStageCards;
