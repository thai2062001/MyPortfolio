import { useBlogPosts } from "@/core/hooks/usePortfolio";
import { useLang } from "@/contexts/LangContext";
import SectionHeader from "./shared/SectionHeader";
import BlogCard from "./BlogCard";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useIsTablet } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { memo, useMemo } from "react";

const BlogSection = memo(() => {
  const { data: posts = [], isLoading } = useBlogPosts(false);
  const { t } = useLang();
  const isTablet = useIsTablet();
  const navigate = useNavigate();

  const displayPosts = useMemo(() => posts.slice(0, 3), [posts]);

  if (isLoading) return null;
  
  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-24 md:py-32 lg:py-48 relative overflow-hidden bg-stone-50/10">
      <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-sage/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 left-0 w-[300px] h-[300px] bg-vibe-pink/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="container relative z-10 mx-auto px-6">
        <SectionHeader
          eyebrow={t("Intellectual Current", "知的な流れ", "Dòng chảy trí tuệ")}
          title={t("Narratives & Insights", "物語と洞察", "Câu chuyện & Thấu cảm")}
          description={t(
            "Exploring the synthesis of technology, design, and strategic impact.",
            "テクノロジー、デザイン、そして戦略的インパクトの融合を探求します。",
            "Khám phá sự giao thoa giữa công nghệ, thiết kế và tác động chiến lược."
          )}
          align="between"
          eyebrowClassName="font-sans text-[10px] tracking-[0.4em] uppercase text-sage font-bold"
          titleClassName="font-display text-4xl md:text-5xl lg:text-7xl xl:text-8xl text-heading leading-[1.05] tracking-tight"
          descriptionClassName="font-body text-base text-muted-foreground/60 leading-relaxed font-light italic max-w-sm"
          className="mb-24 md:mb-32"
          highlightWords={["Insights", "洞察", "Thấu cảm"]}
          highlightClassName="font-artistic text-sage italic lowercase"
        />

        <motion.div 
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 xl:gap-20"
        >
          {displayPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </motion.div>

        <motion.div 
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={`mt-24 flex ${isTablet ? 'justify-center' : 'justify-end'}`}
        >
          <Button 
            variant="ghost"
            onClick={() => navigate("/blog")}
            className="group h-16 px-10 rounded-full border border-sage/20 bg-white/50 backdrop-blur-md hover:bg-sage hover:text-white transition-all duration-700 gap-6 shadow-sm hover:scale-105 active:scale-95"
          >
            <span className="font-display text-lg md:text-xl tracking-tight normal-case">
              {t("Explore Archive", "アーカイブを探索", "Khám phá kho lưu trữ")}
            </span>
            <div className="w-8 h-8 rounded-full bg-sage/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowRight size={14} className="group-hover:translate-x-1 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

BlogSection.displayName = "BlogSection";
export default BlogSection;
