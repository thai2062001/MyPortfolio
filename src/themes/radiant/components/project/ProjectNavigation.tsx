import { ArrowLeft, ArrowRight } from "lucide-react";

interface ProjectShort {
  slug: string;
  title: string;
  cover_image_url?: string;
}

interface ProjectNavigationProps {
  prevProject: ProjectShort | null;
  nextProject: ProjectShort | null;
  onNavigate: (slug: string) => void;
  t: (key: string, defaultValue: string) => string;
}

export const ProjectNavigation = ({
  prevProject,
  nextProject,
  onNavigate,
  t,
}: ProjectNavigationProps) => {
  if (!prevProject && !nextProject) return null;
  
  return (
    <section className="bg-background border-t border-heading/5">
      <div className="flex flex-col md:flex-row items-stretch min-h-[400px]">
        {/* Prev Project */}
        {prevProject ? (
          <button
            onClick={() => onNavigate(prevProject.slug)}
            className="group flex-1 relative flex flex-col justify-center items-center md:items-start p-12 md:p-24 overflow-hidden border-b md:border-b-0 md:border-r border-heading/5"
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 bg-white group-hover:bg-background transition-colors duration-700">
               {prevProject.cover_image_url && (
                 <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-1000 scale-105 group-hover:scale-110 transition-transform duration-[2s]">
                   <img 
                     src={prevProject.cover_image_url} 
                     alt="" 
                     className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000"
                   />
                 </div>
               )}
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border border-heading/10 flex items-center justify-center bg-white/50 backdrop-blur-sm group-hover:bg-heading group-hover:text-white group-hover:border-heading transition-all duration-700 shadow-sm">
                <ArrowLeft size={24} strokeWidth={1} />
              </div>
              <div>
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase font-black text-heading/30 mb-4">
                  {t("Prev Chapter", "PREV CHAPTER")}
                </p>
                <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-heading tracking-tighter leading-none max-w-2xl group-hover:translate-x-2 transition-transform duration-700">
                  {prevProject.title}
                </h3>
              </div>
            </div>
          </button>
        ) : (
          <div className="hidden md:block flex-1 bg-white/50" />
        )}

        {/* Next Project */}
        {nextProject ? (
          <button
            onClick={() => onNavigate(nextProject.slug)}
            className="group flex-1 relative flex flex-col justify-center items-center md:items-end p-12 md:p-24 overflow-hidden text-center md:text-right"
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 bg-white group-hover:bg-background transition-colors duration-700">
               {nextProject.cover_image_url && (
                 <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-1000 scale-105 group-hover:scale-110 transition-transform duration-[2s]">
                   <img 
                     src={nextProject.cover_image_url} 
                     alt="" 
                     className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000"
                   />
                 </div>
               )}
            </div>

            <div className="relative z-10 flex flex-col md:flex-row-reverse items-center gap-10">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border border-heading/10 flex items-center justify-center bg-white/50 backdrop-blur-sm group-hover:bg-heading group-hover:text-white group-hover:border-heading transition-all duration-700 shadow-sm">
                <ArrowRight size={24} strokeWidth={1} />
              </div>
              <div>
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase font-black text-heading/30 mb-4">
                  {t("Next Chapter", "NEXT CHAPTER")}
                </p>
                <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-heading tracking-tighter leading-none max-w-2xl group-hover:-translate-x-2 transition-transform duration-700">
                  {nextProject.title}
                </h3>
              </div>
            </div>
          </button>
        ) : (
          <div className="hidden md:block flex-1 bg-white/50" />
        )}
      </div>
    </section>
  );
};
