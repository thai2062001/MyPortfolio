import { memo, useMemo } from "react";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useLang } from "@/contexts/LangContext";
import { getLocalizedField, SupportedLang } from "@/lib/content-utils";
import { useIsTablet } from "@/hooks/use-mobile";

interface ProjectCardProps {
  slug: string;
  title: string;
  cover_image_url: string;
  tall: boolean;
  category_name?: string;
  short_description?: string;
  tags?: { id: string; name_en: string; name_ja?: string; name_vi?: string }[];
  onClick?: (slug: string) => void;
  onLoad?: () => void;
  priority?: boolean;
  loading?: "lazy" | "eager";
}

const ProjectCard = memo(({
  slug,
  title,
  cover_image_url,
  tall,
  category_name,
  short_description,
  tags = [],
  onClick,
  onLoad,
  priority = false,
  loading = "lazy",
}: ProjectCardProps) => {
  const { lang } = useLang();
  const currentLang = lang as SupportedLang;
  const isTablet = useIsTablet();

  const localizedTitle = useMemo(() => {
    // If title comes from database with lang suffixes, we'd use getLocalizedField
    // But ProjectCard often gets pre-calculated title or title_en.
    // Let's assume title passed is the base title and we might need to check if it's already localized
    return title; 
  }, [title]);

  const { mainTitle, lastWord } = useMemo(() => {
    const titleArray = (localizedTitle || "").split(" ");
    const last = titleArray.length > 1 ? titleArray.pop() : "";
    return { mainTitle: titleArray.join(" "), lastWord: last };
  }, [localizedTitle]);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(slug);
    }
  };

  const srcSet = useMemo(() => {
    if (!cover_image_url || !cover_image_url.includes("res.cloudinary.com")) return undefined;
    const widths = [400, 800, 1200];
    return widths.map(width => `${optimizeCloudinary(cover_image_url, { width })} ${width}w`).join(", ");
  }, [cover_image_url]);

  const sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px";

  const aspectRatioClass = tall ? "md:aspect-[4/5]" : "md:aspect-[4/4]";

  return (
    <div
      className="group relative cursor-pointer isolation-isolate"
      onClick={handleClick}
    >
      <div className={`relative overflow-hidden rounded-2xl bg-stone-100 transition-all duration-500 md:duration-1000 ease-[0.22,1,0.36,1] border border-white/40 md:group-hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] md:group-hover:-translate-y-3 transform-gpu backface-hidden`} style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
        <div className={`relative aspect-[4/5] ${aspectRatioClass} overflow-hidden bg-muted transform-gpu`} style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
          <img
            src={optimizeCloudinary(cover_image_url, { width: isTablet ? 600 : 800 })}
            srcSet={srcSet}
            sizes={sizes}
            alt={localizedTitle}
            loading={loading}
            // @ts-expect-error - fetchpriority is relatively new
            fetchpriority={priority ? "high" : "auto"}
            onLoad={onLoad}
            className="absolute inset-0 w-full h-full object-cover scale-[1.02] md:scale-[1.03] md:group-hover:scale-110 transition-transform duration-500 md:duration-[2000ms] ease-out brightness-[0.98] md:group-hover:brightness-100 will-change-transform"
          />
           
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-80 md:group-hover:opacity-100 transition-opacity duration-500 md:duration-700 pointer-events-none" />
          
          <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6 z-10 transition-transform duration-500 md:duration-700 ease-out md:group-hover:translate-y-[-0.5rem]">
            <div className="ethereal-glass bg-white/85 md:bg-white/60 backdrop-blur-sm md:backdrop-blur-xl rounded-xl p-6 md:p-8 space-y-4 shadow-[0_12px_24px_rgba(0,0,0,0.12)] md:shadow-[0_20px_40px_rgba(0,0,0,0.15)] md:group-hover:border-sage/40 transition-colors duration-500 md:duration-700 transform-gpu">
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="w-6 h-px bg-gray-500 opacity-40 transition-all duration-500 md:duration-700 md:group-hover:w-10" />
                      <p className="font-artistic text-[18px] md:text-[20px] text-vibe-pink">
                        {category_name || "Project"}
                      </p>
                    </div>
                 </div>
                 
                 <h3 className="font-display text-2xl md:text-3xl lg:text-4xl text-heading leading-tight tracking-tight">
                    {mainTitle}{" "}
                    {lastWord && (
                      <span className="font-artistic text-sage italic lowercase ml-1">{lastWord}</span>
                    )}
                 </h3>

                 {tags.length > 0 && (
                   <div className="flex flex-wrap gap-2 pt-1">
                      {tags.slice(0, 3).map((tag) => (
                         <span key={tag.id} className="font-sans text-[9px] tracking-[0.1em] uppercase py-1.5 px-3 rounded-full bg-white/70 border border-black/10 text-gray-800 font-bold whitespace-nowrap">
                            {getLocalizedField(tag, 'name', currentLang)}
                         </span>
                      ))}
                      {tags.length > 3 && (
                        <span className="font-sans text-[8px] text-gray-400">+{tags.length - 3}</span>
                      )}
                   </div>
                 )}
              </div>

              <div className="opacity-100 transition-all duration-500 ease-in-out overflow-hidden block">
                <div className="overflow-hidden">
                  <div className="pt-2 pb-2 space-y-5">
                     {short_description && (
                       <p className="font-body text-[14px] text-heading line-clamp-2 max-w-[95%] font-semibold leading-relaxed">
                          {short_description}
                       </p>
                     )}
                     
                      <div className="flex items-center gap-4 text-sage group/cta cursor-pointer">
                         <span className="font-sans text-[10px] tracking-[0.3em] uppercase font-extrabold">Discover</span>
                         <div className="relative w-8 h-[1px] bg-sage/20 overflow-hidden">
                          <div className="absolute inset-0 bg-sage transition-transform duration-500 translate-x-[-100%] md:group-hover/cta:translate-x-0" />
                         </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
