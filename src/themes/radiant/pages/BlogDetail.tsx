import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef, memo } from "react";
import { useBlogPost } from "@/core/hooks/usePortfolio";
import { useLang } from "@/contexts/LangContext";
import PageLayout from "@/themes/radiant/components/PageLayout";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Check, Copy, Link as LinkIcon, RefreshCw, Bookmark, Tag } from "lucide-react";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import AmbientAccent from "../components/shared/AmbientAccent";
import { useBlogPosts } from "@/core/hooks/usePortfolio";
import BlogCard from "../components/BlogCard";
import { toast } from "sonner";
import ReactDOMServer from "react-dom/server";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Specialized components
import ReadingProgressBar from "../components/blog/ReadingProgressBar";
import BlogBreadcrumb from "../components/blog/BlogBreadcrumb";
import BlogAuthorBox from "../components/BlogAuthorBox";
import BlogCTA from "../components/BlogCTA";
import BackToTopButton from "../components/BackToTopButton";
import BlogImageLightbox from "../components/blog/BlogImageLightbox";
import InlineArticleCTA from "../components/blog/InlineArticleCTA";
import { getLocalizedField, formatLocalizedDate, SupportedLang } from "@/lib/content-utils";

const ZaloIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.353 12c0-4.632 4.319-8.387 9.647-8.387 5.328 0 9.647 3.755 9.647 8.387 0 4.632-4.319 8.387-9.647 8.387a11.127 11.127 0 0 1-1.895-.164l-3.326 2.015c-.454.275-.802-.132-.596-.575l1-2.153C4.24 18.067 2.353 15.26 2.353 12z" fill="currentColor"/>
    <path d="M9.54 14.864V9.136h5.362v1.076h-3.8l3.8 3.576v1.076H9.54z" fill="white"/>
  </svg>
);

const BlogDetail = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const currentLang = lang as SupportedLang;
  
  const { data: post, isLoading } = useBlogPost(slug || "");
  const { data: allPosts = [] } = useBlogPosts(false);
  
  const [isCopied, setIsCopied] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const title = useMemo(() => getLocalizedField(post, 'title', currentLang), [post, currentLang]);
  const rawContent = useMemo(() => getLocalizedField(post, 'content', currentLang), [post, currentLang]);
  const excerpt = useMemo(() => getLocalizedField(post, 'excerpt', currentLang), [post, currentLang]);

  const relatedPosts = useMemo(() => {
    if (!post || !allPosts.length) return [];
    const otherPosts = allPosts.filter(p => p.id !== post.id);
    const sameCategory = otherPosts.filter(p => p.category_id === post.category_id);
    const differentCategory = otherPosts.filter(p => p.category_id !== post.category_id);
    return [...sameCategory, ...differentCategory].slice(0, 3);
  }, [post, allPosts]);

  // Split content for Inline CTA to improve engagement
  const contentParts = useMemo(() => {
    if (!rawContent) return { first: "", second: "" };
    const pTags = rawContent.split("</p>");
    if (pTags.length > 6) {
      const splitPoint = Math.floor(pTags.length * 0.4);
      const first = pTags.slice(0, splitPoint).join("</p>") + "</p>";
      const second = pTags.slice(splitPoint).join("</p>");
      return { first, second };
    }
    return { first: rawContent, second: "" };
  }, [rawContent]);

  // Setup anchors and lightbox post-render
  useEffect(() => {
    if (!contentRef.current || !rawContent) return;

    const headings = contentRef.current.querySelectorAll("h2, h3");
    headings.forEach((heading) => {
      const text = heading.textContent || "";
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      heading.id = id;
      heading.classList.add("group/heading", "relative", "flex", "items-center", "gap-3");
      
      if (!heading.querySelector(".anchor-link")) {
        const anchor = document.createElement("a");
        anchor.href = `#${id}`;
        anchor.className = "anchor-link opacity-0 group-hover/heading:opacity-100 transition-opacity text-sage/40 hover:text-sage";
        anchor.innerHTML = ReactDOMServer.renderToString(<LinkIcon size={18} />);
        anchor.onclick = (e) => {
          e.preventDefault();
          const url = `${window.location.origin}${window.location.pathname}#${id}`;
          navigator.clipboard.writeText(url);
          toast.success("Section link copied!");
          window.location.hash = id;
          heading.scrollIntoView({ behavior: 'smooth' });
        };
        heading.prepend(anchor);
      }
    });

    const images = contentRef.current.querySelectorAll("img");
    images.forEach((img) => {
      img.classList.add("cursor-zoom-in", "transition-transform", "hover:scale-[1.01]", "rounded-2xl", "shadow-lg");
      img.onclick = () => setLightboxSrc(img.src);
    });

    if (window.location.hash) {
      const targetId = window.location.hash.slice(1);
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 500);
      }
    }
  }, [rawContent]);

  const currentFullUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const shareUrl = encodeURIComponent(currentFullUrl);
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const zaloShareUrl = `https://sp.zalo.me/share/base?url=${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentFullUrl);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) return <PageLayout isLoading={true} loaderText="Opening Article..."><div /></PageLayout>;
  if (!post) {
    return (
      <PageLayout isLoading={false} loaderText="Redirecting..." seoTitle="Article Not Found">
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-display text-4xl mb-6 text-heading">Article not found</h1>
            <Button onClick={() => navigate("/blog")} variant="outline" className="rounded-full px-8">Return to Blog</Button>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  const category = post.blog_categories as any;
  const categoryName = getLocalizedField(category, 'name', currentLang) || "Article";
  const publishedDateFormatted = formatLocalizedDate(post.published_at || post.created_at, currentLang);
  const updatedDateFormatted = formatLocalizedDate(post.updated_at || post.created_at, currentLang);
  
  const isUpdated = (() => {
    const pub = new Date(post.published_at || post.created_at || "").getTime();
    const upd = new Date(post.updated_at || post.created_at || "").getTime();
    return upd - pub > 24 * 60 * 60 * 1000;
  })();

  const { mainTitle, lastWord } = (() => {
    const titleArray = (title || "").split(" ");
    const last = titleArray.length > 1 ? titleArray.pop() : "";
    return { mainTitle: titleArray.join(" "), lastWord: last };
  })();

  const ShareContent = () => (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex justify-center items-center gap-12">
        <a href={fbShareUrl} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2.5">
          <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-lg shadow-[#1877F2]/20 group-hover:scale-110 transition-all duration-300">
            <Facebook size={24} fill="currentColor" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 group-hover:text-[#1877F2]">Facebook</span>
        </a>
        
        <a href={zaloShareUrl} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2.5">
          <div className="w-14 h-14 rounded-full bg-[#0068FF] flex items-center justify-center text-white shadow-lg shadow-[#0068FF]/20 group-hover:scale-110 transition-all duration-300">
            <ZaloIcon size={24} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 group-hover:text-[#0068FF]">Zalo</span>
        </a>
      </div>

      <div className="relative group">
        <div className="flex items-center gap-0 w-full overflow-hidden rounded-full border border-stone-200 bg-stone-50 focus-within:border-sage/50 transition-colors">
          <div className="flex-1 truncate text-[11px] text-muted-foreground/50 pl-5 font-mono">
            {currentFullUrl}
          </div>
          <Button 
            onClick={handleCopyLink}
            className="rounded-full h-11 px-6 bg-sage hover:bg-sage/90 text-[10px] font-bold uppercase tracking-[0.1em] text-white shrink-0 shadow-lg shadow-sage/10 transition-transform active:scale-95"
          >
            <AnimatePresence mode="wait">
              {isCopied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                  <Check size={14} />
                </motion.div>
              ) : (
                <motion.div key="copy" className="flex items-center gap-2" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                  <Copy size={14} />
                  <span>{t("Copy", "コピー", "Sao chép")}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout 
      isLoading={false} 
      loaderText="Loading..." 
      seoTitle={`${title} | Blog`} 
      seoDescription={excerpt}
      disableSnap={true}
    >
      <ReadingProgressBar />
      
      <main className="relative bg-surface min-h-screen pb-32 overflow-x-hidden pt-1">
        <AmbientAccent position="top-right" color="bg-sage" size={800} opacity={0.05} />
        
        <div className="relative pt-32 md:pt-40 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn("down", 0.1)} initial="hidden" animate="show">
              <BlogBreadcrumb category={category} title={title || ""} />
            </motion.div>

            <motion.div variants={fadeIn("down", 0.15)} initial="hidden" animate="show" className="mb-12">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)} 
                className="group hover:bg-white/50 rounded-full px-6 gap-2 text-muted-foreground hover:text-sage transition-all"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t("Back", "戻る", "Quay lại")}</span>
              </Button>
            </motion.div>

            <div className="space-y-6">
              <motion.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show" className="inline-flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-white border border-stone-200 text-[9px] font-bold uppercase tracking-[0.2em] text-sage shadow-sm uppercase">{categoryName}</span>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40 font-mono">
                  <Bookmark size={10} />
                  <span>{post.reading_time || 5} MIN</span>
                </div>
              </motion.div>

              <motion.h1 
                variants={fadeIn("up", 0.3)} 
                initial="hidden" 
                animate="show" 
                className="font-display text-4xl md:text-6xl lg:text-7xl text-heading leading-[1.1] md:leading-[1.05] tracking-tight"
              >
                {mainTitle} <span className="font-artistic text-sage italic lowercase inline-block transform translate-y-1">{lastWord}</span>
              </motion.h1>
              
              <motion.div 
                variants={fadeIn("up", 0.4)}
                initial="hidden" 
                animate="show"
                className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 md:pt-8 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 border-t border-stone-200/60"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-sage/40" />
                  {t("Published", "公開日", "Ngày đăng")} {publishedDateFormatted}
                </div>
                
                {isUpdated && (
                  <div className="flex items-center gap-2">
                    <RefreshCw size={12} className="text-sage/40" />
                    {t("Updated", "更新日", "Cập nhật")} {updatedDateFormatted}
                  </div>
                )}

                <div className="flex items-center gap-3 md:ml-auto">
                   <Dialog>
                     <DialogTrigger asChild>
                       <Button variant="ghost" size="sm" className="rounded-full px-5 gap-2 text-muted-foreground hover:text-sage transition-all border border-transparent hover:border-stone-200 hover:bg-white">
                         <Share2 size={12} />
                         <span className="text-[9px] font-bold uppercase tracking-widest">{t("Share", "シェア", "Chia sẻ")}</span>
                       </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-[380px] rounded-[2.5rem] border-none shadow-3xl bg-white/95 backdrop-blur-xl p-8 outline-none">
                       <DialogHeader className="mb-2">
                         <DialogTitle className="font-display text-3xl text-center italic text-heading tracking-tight underline decoration-sage/20 underline-offset-8">Share this story</DialogTitle>
                       </DialogHeader>
                       <ShareContent />
                     </DialogContent>
                   </Dialog>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div 
          variants={fadeIn("up", 0.5)} 
          initial="hidden" 
          animate="show" 
          className="mx-auto max-w-6xl px-6 md:px-12 mb-20"
        >
          <div className="aspect-[21/9] rounded-[3rem] overflow-hidden border border-white shadow-2xl bg-stone-100 group">
            <img 
              src={optimizeCloudinary(post.cover_image_url || "", { width: 1600 })} 
              alt={title || ""} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
          </div>
        </motion.div>

        <article className="mx-auto max-w-4xl px-6 md:px-8 relative">
          <motion.div variants={fadeIn("up", 0.6)} initial="hidden" animate="show">
            <div ref={contentRef} className="prose prose-stone prose-lg max-w-none break-words
              prose-headings:font-display prose-headings:text-heading 
              prose-p:font-body prose-p:text-muted-foreground/90 prose-p:leading-relaxed
              prose-strong:text-heading prose-a:text-sage prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-16
              prose-blockquote:italic prose-blockquote:font-display prose-blockquote:text-2xl prose-blockquote:text-sage/80
              prose-blockquote:border-none prose-blockquote:px-8 prose-blockquote:py-4 prose-blockquote:bg-stone-100/30 prose-blockquote:rounded-2xl
            ">
              <div dangerouslySetInnerHTML={{ __html: contentParts.first || "" }} />
              
              {contentParts.second && (
                <>
                  <InlineArticleCTA />
                  <div dangerouslySetInnerHTML={{ __html: contentParts.second || "" }} />
                </>
              )}
            </div>

            <BlogAuthorBox />
          </motion.div>
          
          <motion.div 
            variants={fadeIn("up", 0.7)} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            className="mt-24 pt-12 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <Tag size={16} className="text-sage" />
                <span className="font-sans text-[11px] uppercase tracking-widest font-bold text-muted-foreground/60">
                   Topic: <span className="text-secondary-foreground">{categoryName}</span>
                </span>
            </div>
            <div className="flex items-center gap-4">
               <Dialog>
                 <DialogTrigger asChild>
                   <Button variant="outline" className="rounded-full px-8 gap-3 text-muted-foreground hover:text-sage transition-all border-stone-200 hover:bg-white active:scale-95">
                     <Share2 size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Share this story</span>
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[380px] rounded-[2.5rem] border-none shadow-3xl bg-white/95 backdrop-blur-xl p-8 outline-none">
                   <DialogHeader className="mb-2">
                     <DialogTitle className="font-display text-3xl text-center italic text-heading tracking-tight underline decoration-sage/20 underline-offset-8">Share this story</DialogTitle>
                   </DialogHeader>
                   <ShareContent />
                 </DialogContent>
               </Dialog>
            </div>
          </motion.div>
        </article>

        <BlogCTA />

        {relatedPosts.length > 0 && (
          <div className="mt-32 bg-stone-100/50 py-24 border-t border-stone-200/60">
            <div className="container max-w-6xl mx-auto px-6">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                <div className="space-y-4 text-center lg:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage">Keep Reading</span>
                  <h2 className="font-display text-4xl md:text-6xl text-heading italic">You might also <span className="font-artistic">love</span></h2>
                </div>
                <Button variant="ghost" onClick={() => navigate("/blog")} className="rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-sage">{t("View All Stories", "すべての記事を見る", "Xem tất cả bài viết")}</Button>
              </div>
              <motion.div 
                variants={staggerContainer(0.1, 0.05)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
              >
                {relatedPosts.map((relatedPost, idx) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} index={idx} />
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </main>
      <BackToTopButton />
      <BlogImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </PageLayout>
  );
});

export default BlogDetail;
