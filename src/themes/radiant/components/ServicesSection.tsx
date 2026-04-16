import { motion } from "framer-motion";
import { Target, PenTool, BarChart3, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { memo, useMemo } from "react";
import SectionHeader from "./shared/SectionHeader";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

const ServicesSection = memo(() => {
  const { lang, t } = useLang();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const services = useMemo(() => [
    {
      icon: Target,
      title: t("Digital Strategy", "デジタル戦略", "Chiến lược số"),
      description: t(
        "Comprehensive digital roadmaps that align brand positioning with market opportunity, maximizing reach and engagement.",
        "ブランドポジショニングと市場機会を整合させ、エンゲージメントを最大化する包括的なデジタルロードマップ。",
        "Lộ trình kỹ thuật số toàn diện, tối ưu hóa định vị thương hiệu và cơ hội thị trường."
      ),
      color: "sage" as const,
    },
    {
      icon: PenTool,
      title: t("Content Production", "コンテンツ制作", "Sản xuất nội dung"),
      description: t(
        "From editorial narratives to video campaigns, crafting compelling content that captures attention and drives action.",
        "エディトリアル記事から動画まで、注目を集め意味のあるアクションを促す魅力的なコンテンツを制作。",
        "Từ những câu chuyện biên tập đến các chiến dịch video, tạo nội dung thu hút và thúc đẩy hành động."
      ),
      color: "gold" as const,
    },
    {
      icon: BarChart3,
      title: t("Performance Marketing", "パフォーマンスマーケティング", "Marketing hiệu suất"),
      description: t(
        "Data-driven campaign management with a relentless focus on ROI, leveraging analytics to scale growth.",
        "ROIに徹底的にフォーカスしたデータ駆動型キャンペーン管理。分析を活用して成長を拡大。",
        "Quản lý chiến dịch dựa trên dữ liệu, tập trung vào ROI và sử dụng phân tích để mở rộng quy mô."
      ),
      color: "sage" as const,
    },
  ], [t]);

  return (
    <section className="py-24 md:py-48 pb-12 md:pb-24 bg-surface/50 relative overflow-hidden" id="services">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sage/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          align={isTablet ? "center" : "between"}
          className="mb-24 md:mb-32"
          eyebrow={t("Core Expertise", "コア・エクスパティーズ", "Chuyên môn lõi")}
          title={t("Tailored Strategic Impact.", "戦略的インパクトを、 あなたに。", "Tác động chiến lược ưu việt.")}
          description={t(
            "Synthesizing high-level strategy with artisanal execution to create monumental value in the digital landscape.",
            "高度な戦略と熟練の執行を融合させ、デジタル領域で圧倒的な価値を創造します。",
            "Kết hợp chiến lược cấp cao với thực thi tinh vi để tạo ra giá trị to lớn trong bối cảnh kỹ thuật số."
          )}
          eyebrowClassName="font-sans text-[10px] tracking-[0.4em] uppercase text-gold font-bold"
          titleClassName="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl text-heading leading-[1.05] tracking-tight py-2"
          descriptionClassName="font-body text-base md:text-xl text-muted-foreground/60 leading-relaxed font-light italic"
          highlightWords={["Impact", "あなたに", "phi"]}
          highlightClassName="font-artistic italic text-sage lowercase"
        />

        <motion.div 
          variants={staggerContainer(0.12, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 xl:gap-12"
        >
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              variants={fadeIn("up", 0.1 * i, isMobile)}
              className="group ethereal-glass relative rounded-[3rem] p-10 md:p-12 xl:p-14 space-y-8 md:space-y-10 border border-border/50 hover:shadow-2xl hover:bg-white hover:-translate-y-3 transition-all duration-700 ease-[0.22,1,0.36,1] flex flex-col items-start text-left h-full will-change-transform"
            >
              <div
                className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-12 ${
                  s.color === "sage" ? "bg-sage/10 text-sage" : "bg-gold/10 text-gold"
                }`}
              >
                <s.icon size={28} strokeWidth={1.5} />
              </div>
              
              <div className="space-y-4 md:space-y-6 flex-grow">
                <h3 className="text-2xl md:text-3xl font-serif text-heading font-medium tracking-tight">
                  {s.title}
                </h3>
                <p className="text-muted-foreground/70 font-body text-sm md:text-base leading-relaxed font-light italic">
                  {s.description}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4 text-heading/40 font-sans text-[10px] tracking-[0.4em] uppercase font-black transition-colors group-hover:text-sage">
                 {t("Details", "詳細", "Chi tiết")}
                 <div className="w-10 h-px bg-heading/10 group-hover:bg-sage transition-all group-hover:w-16" />
                 <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;
