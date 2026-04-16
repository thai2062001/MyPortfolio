import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import PageLayout from "@/themes/radiant/components/PageLayout";
import { useLang } from "@/contexts/LangContext";
import { portfolioApi } from "@/core/api/portfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { getLocalizedField, SupportedLang } from "@/lib/content-utils";
import { staggerContainer, fadeIn } from "@/lib/animations";

const SkillCategory = () => {
  const { lang, t } = useLang();
  const currentLang = lang as SupportedLang;
  const { slug } = useParams<{ slug: string }>();

  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['skill-category', slug],
    queryFn: () => portfolioApi.getSkillCategoryBySlug(slug!),
    enabled: !!slug,
  });

  const { data: skills = [], isLoading: isSkillsLoading } = useQuery({
    queryKey: ['skills-by-category', category?.id],
    queryFn: () => portfolioApi.getSkillsByCategory(category!.id),
    enabled: !!category?.id,
  });

  const loading = isCategoryLoading || isSkillsLoading;

  const categoryName = getLocalizedField(category, 'name', currentLang);
  const categoryDesc = getLocalizedField(category, 'description', currentLang);

  if (!loading && !category) {
    return (
      <PageLayout
        isLoading={loading}
        loaderText={t("Searching domain...", "ドメインを検索中...", "Đang tìm kiếm...")}
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="font-display text-3xl text-heading italic">
              {t("Category not found", "カテゴリーが見つかりません", "Không tìm thấy danh mục")}
            </h1>
            <Link to="/skills" className="font-sans text-xs uppercase tracking-widest text-sage border-b border-sage/20 pb-1 hover:border-sage transition-all">
              {t("Back to Skills", "スキルに戻る", "Quay lại Kỹ năng")}
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      seoTitle={`${categoryName || "Expertise"} | Skills`}
      seoDescription={categoryDesc}
      isLoading={loading}
      loaderText={t("Entering Archive...", "アーカイブに入る...", "Đang vào kho lưu trữ...")}
    >
      <main className="min-h-screen">
        {/* Header */}
        <section className="pt-32 md:pt-48 pb-16 relative overflow-hidden bg-stone-50/30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sage/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
          
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/skills"
                className="group inline-flex items-center gap-2 text-sage/60 hover:text-sage mb-12 transition-all duration-300 font-sans text-[10px] uppercase font-bold tracking-widest"
              >
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                {t("Back to Expertises", "専門知識に戻る", "Quay lại Chuyên môn")}
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                <div className="space-y-8 max-w-4xl">
                  {category?.icon_url && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-sage/5 flex items-center justify-center p-4 border border-sage/10"
                    >
                      <img
                        src={optimizeCloudinary(category.icon_url, { width: 160 })}
                        alt={categoryName}
                        className="w-full h-full object-contain"
                      />
                    </motion.div>
                  )}
                  <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-light text-heading tracking-tighter leading-tight italic">
                    {categoryName}
                  </h1>
                </div>
                {categoryDesc && (
                  <p className="font-body text-lg md:text-xl text-muted-foreground/80 max-w-xl leading-relaxed italic font-light lg:mb-4">
                    {categoryDesc}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Grid */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6 max-w-6xl">
            {skills.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-muted-foreground italic">
                  {t("No skills refined in this domain yet.", "このドメインではまだスキルが洗練されていません。", "Chưa có kỹ năng nào được đúc kết trong lĩnh vực này.")}
                </p>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer(0.05, 0.05)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
              >
                {skills.map((skill, index) => {
                  const skillName = getLocalizedField(skill, 'skill_name', currentLang);
                  const skillShortDesc = getLocalizedField(skill, 'short_description', currentLang);
                  
                  return (
                    <motion.div
                      key={skill.id}
                      variants={fadeIn("up", 0)}
                    >
                      <Link
                        to={`/skills/${category?.slug}/${skill.slug}`}
                        className="group block h-full"
                      >
                        <div className="h-full bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-700 ease-[0.22,1,0.36,1] hover:border-sage/20 relative">
                          {skill.cover_image_url && (
                            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                              <img
                                src={optimizeCloudinary(skill.cover_image_url, { width: 600 })}
                                alt={skillName}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>
                          )}
                          <div className="p-10 space-y-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between gap-4">
                                <h3 className="font-display text-2xl text-heading group-hover:text-sage transition-colors duration-500 line-clamp-2">
                                  {skillName}
                                </h3>
                                {skill.difficulty_level && (
                                  <span className="font-sans text-[9px] uppercase tracking-widest font-black text-sage bg-sage/5 px-3 py-1.5 rounded-full shrink-0">
                                    {skill.difficulty_level}
                                  </span>
                                )}
                              </div>
                              {skillShortDesc && (
                                <p className="font-body text-xs text-muted-foreground/80 leading-relaxed font-light line-clamp-3 italic">
                                  {skillShortDesc}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 text-sage group/link pt-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{t("Learn More", "詳細を見る", "Tìm hiểu thêm")}</span>
                              <div className="relative w-8 h-px bg-sage/20 overflow-hidden">
                                <div className="absolute inset-0 bg-sage transition-transform duration-500 -translate-x-full group-hover:translate-x-0" />
                              </div>
                              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </PageLayout>
  );
};
export default SkillCategory;
