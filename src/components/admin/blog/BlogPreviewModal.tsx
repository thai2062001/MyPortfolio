import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlogPost, BlogCategory } from "@/types/admin";
import { Calendar, Clock, Bookmark, Tag, X } from "lucide-react";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Partial<BlogPost>;
  categories: BlogCategory[];
  lang: 'en' | 'ja' | 'vi';
}

const BlogPreviewModal = ({
  isOpen,
  onClose,
  post,
  categories,
  lang
}: BlogPreviewModalProps) => {
  const title = lang === 'ja' ? post.title_ja || post.title_en : lang === 'vi' ? post.title_vi || post.title_en : post.title_en;
  const excerpt = lang === 'ja' ? post.excerpt_ja || post.excerpt_en : lang === 'vi' ? post.excerpt_vi || post.excerpt_en : post.excerpt_en;
  const content = lang === 'ja' ? post.content_ja || post.content_en : lang === 'vi' ? post.content_vi || post.content_en : post.content_en;
  
  const category = categories.find(c => c.id === post.category_id);
  const categoryName = category ? (lang === 'en' ? category.name_en : lang === 'ja' ? category.name_ja || category.name_en : category.name_vi || category.name_en) : "Article";

  const dateFormatted = post.published_at 
    ? format(new Date(post.published_at), "MMMM dd, yyyy") 
    : format(new Date(), "MMMM dd, yyyy");

  // Logic for Radiant-style title (main + last word)
  const { mainTitle, lastWord } = (() => {
    const titleStr = title || "";
    const titleArray = titleStr.split(" ");
    const last = titleArray.length > 1 ? titleArray.pop() : "";
    return { mainTitle: titleArray.join(" "), lastWord: last };
  })();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        hideDefaultClose={true}
        className="max-w-[100vw] w-full h-full p-0 border-none bg-stone-50 overflow-y-auto no-scrollbar outline-none rounded-none"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Article Preview</DialogTitle>
        </DialogHeader>
        
        {/* Custom Close Button */}
        <div className="fixed top-8 right-8 z-[1100]">
          <button 
            onClick={onClose}
            className="group w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-stone-200 text-stone-400 hover:border-black hover:text-black hover:scale-110 active:scale-95 transition-all shadow-xl"
          >
            <X size={20} className="transition-colors" />
          </button>
        </div>

        <div className="relative min-h-screen pb-32">
          {/* Header Section (Radiant Style) */}
          <div className="relative pt-32 md:pt-40 pb-16 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-white border border-stone-200 text-[9px] font-bold uppercase tracking-[0.2em] text-[#7A8C70] shadow-sm">
                    {categoryName}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40 font-mono">
                    <Bookmark size={10} />
                    <span>{post.reading_time || 5} MIN</span>
                  </div>
                </div>

                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-[#2D2A26] leading-[1.1] md:leading-[1.05] tracking-tight">
                  {mainTitle}{" "}
                  <span className="font-serif italic text-[#7A8C70] lowercase inline-block transform translate-y-1">
                    {lastWord}
                  </span>
                </h1>

                <div className="flex flex-wrap items-center gap-6 pt-6 md:pt-8 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 border-t border-stone-200/60">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-[#7A8C70]/40" />
                    PREVIEW MODE • {dateFormatted}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-[#7A8C70]/40" />
                    LIVE DRAFT RENDERING
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {post.cover_image_url && (
            <div className="mx-auto max-w-6xl px-6 md:px-12 mb-20">
              <div className="aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white shadow-2xl bg-stone-100">
                <img 
                  src={optimizeCloudinary(post.cover_image_url, { width: 1600 })} 
                  alt={title || ""} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          )}

          {/* Content Area */}
          <article className="mx-auto max-w-4xl px-6 md:px-8 relative">
            <div className="prose prose-stone prose-lg max-w-none break-words
              prose-headings:font-serif prose-headings:text-[#2D2A26]
              prose-p:font-sans prose-p:text-muted-foreground/90 prose-p:leading-relaxed
              prose-strong:text-[#2D2A26] prose-a:text-[#7A8C70] prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-16
              prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-2xl prose-blockquote:text-[#7A8C70]/80
              prose-blockquote:border-none prose-blockquote:px-8 prose-blockquote:py-4 prose-blockquote:bg-stone-100/30 prose-blockquote:rounded-2xl
            ">
              <div dangerouslySetInnerHTML={{ __html: content || "" }} />
            </div>
          </article>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(BlogPreviewModal);
