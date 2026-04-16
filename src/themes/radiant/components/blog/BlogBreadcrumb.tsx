import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

interface BlogBreadcrumbProps {
  category?: {
    id: string;
    name_en: string;
    name_ja?: string;
    name_vi?: string;
  };
  title: string;
}

const BlogBreadcrumb: React.FC<BlogBreadcrumbProps> = ({ category, title }) => {
  const { lang, t } = useLang();

  const categoryName = category ? (
    lang === 'ja' ? category.name_ja || category.name_en :
    lang === 'vi' ? category.name_vi || category.name_en :
    category.name_en
  ) : null;

  return (
    <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40 mb-8 overflow-hidden whitespace-nowrap">
      <Link to="/" className="hover:text-sage transition-colors flex items-center gap-1">
        <Home size={12} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      <ChevronRight size={10} />
      
      <Link to="/blog" className="hover:text-sage transition-colors">
        Blog
      </Link>

      {categoryName && (
        <>
          <ChevronRight size={10} />
          <span className="text-muted-foreground/60">{categoryName}</span>
        </>
      )}

      <ChevronRight size={10} />
      
      <span className="text-muted-foreground/80 truncate max-w-[150px] md:max-w-none">
        {title}
      </span>
    </nav>
  );
};

export default BlogBreadcrumb;
