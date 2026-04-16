import { useLang } from "@/contexts/LangContext";
import PageLayout from "@/themes/radiant/components/PageLayout";
import { useBlogPosts } from "@/core/hooks/usePortfolio";
import BlogCard from "@/themes/radiant/components/BlogCard";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";
import { useIsTablet } from "@/hooks/use-mobile";

const BlogArchivePage = () => {
  const { t } = useLang();
  const { data: posts = [], isLoading } = useBlogPosts(false);
  const isTablet = useIsTablet();

  return (
    <PageLayout
      seoTitle={t("Narratives & Insights Archive", "物語と洞察のアーカイブ", "Kho lưu trữ Câu chuyện & Thấu cảm")}
      seoDescription="Dive deep into the archives of digital narratives, design philosophies, and strategic growth insights."
      manualReadySignal={false}
    >
      <div className="pt-32 md:pt-48 bg-stone-50/30 pb-32">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20 md:mb-32 max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[1px] bg-sage" />
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase font-bold text-sage">
                {t("The Archive", "アーカイブ", "Kho lưu trữ")}
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-light text-heading tracking-tighter leading-tight italic mb-8">
              Narratives & <span className="text-sage/60">Insights.</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground/80 max-w-2xl leading-relaxed">
              {t(
                "A collection of thoughts, explorations, and documented journeys at the intersection of experience design and strategic growth.",
                "体験デザインと戦略的成長の交差点における、思考、探索、そして記録された旅のコレクション。",
                "Bộ sưu tập những suy nghĩ, khám phá và những hành trình được ghi lại tại điểm giao thoa giữa thiết kế trải nghiệm và tăng trưởng chiến lược."
              )}
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-6">
                  <div className="aspect-[16/10] bg-stone-200 animate-pulse rounded-[2.5rem]" />
                  <div className="space-y-3 px-4 md:px-0">
                    <div className="h-2 w-24 bg-stone-200 animate-pulse rounded" />
                    <div className="h-8 w-full bg-stone-200 animate-pulse rounded" />
                    <div className="h-4 w-2/3 bg-stone-200 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer(0.05, 0.05)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16"
            >
              {posts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </motion.div>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="py-32 text-center">
              <p className="font-display text-2xl text-muted-foreground italic">No stories published yet. Stay tuned.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default BlogArchivePage;
