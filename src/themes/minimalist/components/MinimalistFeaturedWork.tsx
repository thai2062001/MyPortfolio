import { motion } from "framer-motion";
import { Project } from "@/core/types/database";
import { Link } from "react-router-dom";
import { FADE_UP_VARIANTS, NORDIC_TRANSITION, NORDIC_STAGGER_CONTAINER, NORDIC_FADE_UP } from "../constants/animations";
import { MinimalButton } from "./shared/MinimalButton";

interface MinimalistFeaturedWorkProps {
  title: string;
  subtitle: string;
  projects?: Project[];
  viewAllText: string;
}

export const MinimalistFeaturedWork = ({ title, subtitle, projects, viewAllText }: MinimalistFeaturedWorkProps) => {
  return (
    <section className="py-32 px-6 md:px-10 bg-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[30vw] h-[30vw] bg-secondary/5 organic-blob -translate-y-1/2" />

      <div className="max-w-[1320px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-24 gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_UP_VARIANTS}
            className="lg:col-span-8"
          >
            <span className="text-label text-primary mb-6 block">Selected Work</span>
            <h2 className="text-display font-display text-main max-w-2xl mb-8">
              {title}
            </h2>
            <p className="text-body-large text-main/60 max-w-xl italic">
              {subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/portfolio">
               <MinimalButton variant="outline" size="md">
                 {viewAllText}
               </MinimalButton>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          variants={NORDIC_STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24"
        >
          {projects?.slice(0, 4)?.map((project, idx) => {
            // Hiển thị tên danh mục từ object project_categories nếu có
            const categoryName = project.project_categories?.name || "Premium Project";
            
            return (
              <motion.div
                key={project.id}
                variants={NORDIC_FADE_UP}
                className={`${idx % 2 === 1 ? "md:mt-24" : ""}`}
              >
                <Link 
                  to={`/project/${project.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-sand mb-8 ambient-shadow">
                    <img 
                      src={project.cover_image_url || ''} 
                      alt={project.title}
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      loading="lazy"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-start flex-wrap gap-4">
                      <div className="space-y-1">
                        <span className="text-label text-primary/60 text-[10px]">{categoryName}</span>
                        <h3 className="text-h1 font-display text-[28px] group-hover:text-primary transition-colors leading-tight">
                          {project.title}
                        </h3>
                      </div>
                      <span className="text-label text-[11px] text-main/30 pt-4">{project.year || '2026'}</span>
                     </div>
                     <p className="text-main/60 line-clamp-2 max-w-lg italic">
                      {project.short_description}
                     </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
