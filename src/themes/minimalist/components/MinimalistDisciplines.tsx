import { motion } from "framer-motion";
import { Skill } from "@/core/types/database";
import { useLang } from "@/contexts/LangContext";
import { Link } from "react-router-dom";
import { FADE_UP_VARIANTS } from "../constants/animations";

interface MinimalistDisciplinesProps {
  title: string;
  subtitle: string;
  disciplines?: Skill[];
}

export const MinimalistDisciplines = ({ title, subtitle, disciplines }: MinimalistDisciplinesProps) => {
  const { lang } = useLang();

  return (
    <section className="bg-canvas py-32 px-6 md:px-10 overflow-hidden">
      <div className="max-w-[1320px] mx-auto">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-end">
          <motion.div 
            className="lg:col-span-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FADE_UP_VARIANTS}
          >
            <span className="text-label text-primary mb-6 block">Our Expertise</span>
            <h2 className="text-display font-display text-main max-w-4xl">
              {title}
            </h2>
          </motion.div>
        </div>

        {/* Disciplines Grid */}
        <motion.div 
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {disciplines?.map((item: any, idx) => (
            <motion.div
              key={item.id}
              variants={FADE_UP_VARIANTS}
            >
              <Link
                to={`/skill/${item.slug}`}
                className="group flex flex-col h-full bg-surface-sand/40 p-12 lg:p-14 rounded-[48px] border border-white transition-all duration-700 hover:bg-white hover:-translate-y-3 hover:shadow-2xl hover:border-primary/20 shadow-sm"
              >
                <div className="mb-14 flex justify-between items-start">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-700 overflow-hidden border border-main/5">
                      {/* Ưu tiên Icon URL từ database */}
                      {item.icon_url ? (
                        <img 
                          src={item.icon_url} 
                          alt={item.skill_name} 
                          className="w-10 h-10 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                        />
                      ) : (
                        item.icon_name ? (
                          <i className={`${item.icon_name} text-[28px]`}></i>
                        ) : (
                          <span className="text-display text-[32px] opacity-20">{(idx + 1).toString().padStart(2, "0")}</span>
                        )
                      )}
                    </div>
                    {/* Index number small absolute badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-surface-sand flex items-center justify-center text-[10px] font-bold text-main/40 border border-white">
                       {(idx + 1).toString().padStart(2, "0")}
                    </div>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </div>

                <h3 className="text-h1 font-display text-[24px] mb-6 group-hover:text-primary transition-colors duration-500">
                  {lang === "vi" && item.skill_name_vi ? item.skill_name_vi : item.skill_name}
                </h3>
                
                <p className="text-main/60 leading-relaxed mb-auto">
                  {lang === "vi" && item.description_vi
                    ? item.description_vi
                    : item.short_description || item.description}
                </p>

                {/* Sub-skills / Tags if any */}
                <div className="mt-10 pt-8 border-t border-main/5 flex flex-wrap gap-2">
                   <span className="text-label group-hover:text-primary transition-colors">
                     {item.experience_level || "Professional Expertise"}
                   </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
