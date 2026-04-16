import { motion } from "framer-motion";
import React from "react";

interface ProjectMetaProps {
  label: string;
  value: string | undefined;
}

const ProjectMetaItem = ({ label, value }: ProjectMetaProps) => {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1.5 md:gap-3">
       <span className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-bold text-sage/60">
         {label}
       </span>
       <span className="font-body text-base md:text-lg text-heading font-medium tracking-tight">
         {value}
       </span>
    </div>
  );
};

interface ProjectMetaSectionProps {
  client: string;
  duration: string;
  role: string;
  year: string;
  tags?: { id: string; name_en: string; name_ja?: string }[];
  lang?: string;
  t: (key: string, defaultValue: string) => string;
}

export const ProjectMeta = ({ client, duration, role, year, tags = [], lang = "en", t }: ProjectMetaSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
      className="py-12 md:py-16 border-y border-heading/10"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-12 items-start">
        
        {/* Core Info Items - Now consistent and clean */}
        <ProjectMetaItem label={t("Client", "CLIENT")} value={client} />
        <ProjectMetaItem label={t("Focus", "ROLE")} value={role} />
        <ProjectMetaItem label={t("Timeline", "PERIOD")} value={duration} />
        <ProjectMetaItem label={t("Chapter", "YEAR")} value={year} />

        {/* Identity Section (Tags) - Integrated into the flow */}
        {tags.length > 0 && (
          <div className="flex flex-col gap-1.5 md:gap-3 col-span-2 md:col-span-4 lg:col-span-1 border-t md:border-t-0 border-heading/5 pt-8 md:pt-0">
            <span className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-bold text-sage/60">
              {t("Identity", "IDENTITY")}
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {tags.map((tag) => (
                <span 
                  key={tag.id}
                  className="font-sans text-[11px] md:text-[12px] tracking-wide text-heading/50 hover:text-vibe-pink transition-colors duration-300 cursor-default"
                >
                  <span className="text-vibe-pink/40 mr-1">#</span>
                  {lang === "ja" && tag.name_ja ? tag.name_ja : tag.name_en}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};
