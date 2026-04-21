import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { fadeIn } from "@/lib/animations";
import { getLocalizedField, SupportedLang } from "@/lib/content-utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface BlogCardProps {
  post: any;
  index: number;
}

const BlogCard = memo(({ post, index }: BlogCardProps) => {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const currentLang = lang as SupportedLang;

  const localization = useMemo(() => ({
    title: getLocalizedField(post, 'title', currentLang),
    excerpt: getLocalizedField(post, 'excerpt', currentLang),
    category: post.blog_categories ? getLocalizedField(post.blog_categories, 'name', currentLang) : null
  }), [post, currentLang]);

  const dateStr = useMemo(() => {
    const date = new Date(post.published_at || post.created_at);
    return date.toLocaleDateString(lang === 'ja' ? 'ja-JP' : lang === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [post.published_at, post.created_at, lang]);

  return (
    <motion.article 
      variants={fadeIn("up", 0.1 * index, isMobile)}
      className="group flex flex-col h-full bg-white rounded-[2.5rem] border border-stone-200/60 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-700 ease-[0.22,1,0.36,1] will-change-transform"
    >
      <div 
        className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-stone-100"
        onClick={() => navigate(`/blog/${post.slug}`)}
      >
        <img 
          src={optimizeCloudinary(post.cover_image_url || "", { width: 800 })} 
          alt={localization.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 will-change-transform"
        />
        <div className="absolute top-6 left-6 flex gap-2">
           <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-heading shadow-sm">
              {localization.category || "Insight"}
           </span>
        </div>
      </div>

      <div className="p-8 md:p-10 flex flex-col flex-grow space-y-6">
        <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
           <div className="flex items-center gap-2">
              <Calendar size={12} className="text-sage" />
              {dateStr}
           </div>
           <div className="flex items-center gap-2">
              <Clock size={12} className="text-sage" />
              {post.reading_time || 5} min read
           </div>
        </div>

        <div className="space-y-4 flex-grow">
          <h3 
            className="text-2xl md:text-3xl font-serif text-heading font-medium leading-[1.2] tracking-tight hover:text-sage transition-colors cursor-pointer group-hover:underline decoration-sage/20 underline-offset-8 break-words"
            onClick={() => navigate(`/blog/${post.slug}`)}
          >
            {localization.title}
          </h3>
          <p className="text-muted-foreground/60 font-body text-sm leading-relaxed line-clamp-2 md:line-clamp-3 italic font-light break-words">
            {localization.excerpt}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-stone-50">
          <button 
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="group/btn flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-heading hover:text-sage transition-all duration-500"
          >
            {t("Read Entry", "記事を読む", "Đọc bài viết")}
            <div className="w-8 h-8 rounded-full border border-stone-100 flex items-center justify-center group-hover/btn:bg-sage group-hover/btn:text-white group-hover/btn:border-sage transition-all duration-500">
               <ArrowUpRight size={14} className="group-hover/btn:rotate-45 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </motion.article>
  );
});

BlogCard.displayName = "BlogCard";
export default BlogCard;
