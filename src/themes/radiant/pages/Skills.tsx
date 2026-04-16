import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageLayout from "@/themes/radiant/components/PageLayout";
import { portfolioApi } from "@/core/api/portfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useLang } from "@/contexts/LangContext";
import { getLocalizedField, SupportedLang } from "@/lib/content-utils";
import { staggerContainer, fadeIn } from "@/lib/animations";

const Skills = () => {
  const { lang, t } = useLang();
  const currentLang = lang as SupportedLang;

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['skill-categories'],
    queryFn: portfolioApi.getSkillCategories,
  });

  return (
    <PageLayout
      seoTitle={t("Expertise & Strategic Skills", "専門知識と戦略的スキル", "Chuyên môn & Kỹ năng Chiến lược")}
      seoDescription="Explore a curated collection of professional skills and strategic expertise across design, development, and growth."
    >
      <div className="pt-32 md:pt-48 bg-stone-50/30 pb-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20 md:mb-32 max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[1px] bg-sage" />
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase font-bold text-sage">
                {t("Expertise", "専門知識", "Chuyên môn")}
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-light text-heading tracking-tighter leading-tight italic mb-8">
              Skills & <span className="text-sage/60">Expertise.</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground/80 max-w-2xl leading-relaxed">
              {t(
                "A comprehensive mapping of strategic capabilities and technical fluencies designed for high-impact digital growth.",
                "インパクトのあるデジタル成長のために、戦略的能力と技術的流暢さを包括的にマッピングしました。",
                "Bản đồ toàn diện về năng lực chiến lược và sự thông thạo kỹ thuật được thiết kế để tăng trưởng kỹ thuật số tác động cao."
              )}
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-10 h-64 animate-pulse border border-stone-100" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-2xl text-muted-foreground italic">No specialized skills listed yet.</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer(0.05, 0.05)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  variants={fadeIn("up", 0)}
                >
                  <Link
                    to={`/skills/${category.slug}`}
                    className="group block h-full"
                  >
                    <div className="h-full bg-white border border-stone-100 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all duration-700 ease-[0.22,1,0.36,1] hover:border-sage/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-sage/10 transition-colors" />
                      
                      {category.icon_url && (
                        <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center p-3 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                          <img
                            src={optimizeCloudinary(category.icon_url, { width: 100 })}
                            alt={getLocalizedField(category, 'name', currentLang)}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      
                      <h2 className="font-display text-2xl text-heading mb-4 group-hover:text-sage transition-colors duration-500">
                        {getLocalizedField(category, 'name', currentLang)}
                      </h2>
                      
                      {category.description && (
                        <p className="font-body text-xs text-muted-foreground/80 leading-relaxed line-clamp-3 mb-8">
                          {getLocalizedField(category, 'description', currentLang)}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 text-sage group/link">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{t("Explore", "探索する", "Khám phá")}</span>
                        <div className="relative w-8 h-px bg-sage/20 overflow-hidden">
                          <div className="absolute inset-0 bg-sage transition-transform duration-500 -translate-x-full group-hover:translate-x-0" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Skills;
