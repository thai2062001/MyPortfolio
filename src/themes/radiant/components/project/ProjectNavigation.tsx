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
            className="group flex-1 relative flex flex-col justify-center items-center md:items-start p-10 md:p-20 overflow-hidden border-b md:border-b-0 md:border-r border-heading/5"
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

            <div className="relative z-10 flex flex-row items-center gap-6 md:gap-8 text-left max-w-full">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-heading/10 flex items-center justify-center bg-white/50 backdrop-blur-sm group-hover:bg-heading group-hover:text-white group-hover:border-heading transition-all duration-700 shadow-sm flex-shrink-0">
                <ArrowLeft size={20} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg md:text-xl text-heading/40 group-hover:text-vibe-pink font-bold italic mb-2 transition-colors duration-500">
                  {t("Prev Chapter", "Prev Chapter")}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-heading tracking-tight leading-[1.15] group-hover:translate-x-2 transition-transform duration-700">
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
            className="group flex-1 relative flex flex-col justify-center items-center md:items-end p-10 md:p-20 overflow-hidden text-center md:text-right"
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

            <div className="relative z-10 flex flex-row-reverse items-center gap-6 md:gap-8 text-right max-w-full">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-heading/10 flex items-center justify-center bg-white/50 backdrop-blur-sm group-hover:bg-heading group-hover:text-white group-hover:border-heading transition-all duration-700 shadow-sm flex-shrink-0">
                <ArrowRight size={20} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg md:text-xl text-heading/40 group-hover:text-vibe-pink font-bold italic mb-2 transition-colors duration-500">
                  {t("Next Chapter", "Next Chapter")}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-heading tracking-tight leading-[1.15] group-hover:-translate-x-2 transition-transform duration-700">
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
