import { motion } from "framer-motion";
import { Project } from "@/core/types/database";

interface MinimalistProjectGridProps {
  projects?: Project[];
  lang: string;
}

export const MinimalistProjectGrid = ({ projects, lang }: MinimalistProjectGridProps) => {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#ffffff] border-t border-[#e2e2e2]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
        {projects?.map((project, idx) => (
          <motion.a
            href={`/project/${project.slug}`}
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
            className="group block cursor-pointer"
          >
            <div className="aspect-[16/10] overflow-hidden bg-[#f5f5f1] mb-8 relative border border-transparent group-hover:border-[#e2e2e2] transition-colors">
              <img 
                src={project.cover_image_url || ''} 
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700 ease-[0.16,1,0.3,1]"
              />
            </div>
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-mono text-[#000000] uppercase tracking-widest">
                CATEGORY / {project.project_categories?.name || 'UNCATEGORIZED'}
              </span>
              <span className="text-xs font-mono text-[#777777] uppercase tracking-widest">
                YEAR / {project.year || 'RECENT'}
              </span>
            </div>
            <h3 className="text-3xl lg:text-4xl font-black text-[#000000] mb-4 leading-[1.05]">
              {project.title}
            </h3>
            <p className="text-[#424242] text-lg leading-relaxed max-w-md line-clamp-3">
              {lang === 'en' ? project.short_description : project.short_description_ja}
            </p>
          </motion.a>
        ))}
      </div>
    </section>
  );
};
