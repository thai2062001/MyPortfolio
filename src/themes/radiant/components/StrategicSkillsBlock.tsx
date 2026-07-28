import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import type { ExpertiseStrategicSkill } from "@/types/admin";
import { optimizeCloudinary } from "@/lib/cloudinary";

interface StrategicSkillsBlockProps {
  skills: ExpertiseStrategicSkill[];
}

const SkillIcon = ({ iconName }: { iconName: string }) => {
  const IconComponent = (Icons as any)[
    iconName.charAt(0).toUpperCase() +
      iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  ];

  if (!IconComponent) {
    return <div className="w-5 h-5 bg-gray-300 rounded" />;
  }

  return <IconComponent size={24} className="text-gray-700" />;
};

export const StrategicSkillsBlock = ({ skills }: StrategicSkillsBlockProps) => {
  const { lang } = useLang();

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="space-y-6"
    >
      {skills.map((skill) => (
        <motion.div
          key={skill.id}
          variants={itemVariants}
          className="flex items-center gap-5"
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            {skill.icon_url ? (
              <img 
                src={optimizeCloudinary(skill.icon_url)} 
                alt="" 
                loading="lazy"
                className="w-6 h-6 object-contain" 
              />
            ) : skill.icon_name ? (
              <SkillIcon iconName={skill.icon_name} />
            ) : (
              <div className="w-5 h-5 bg-gray-300 rounded" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-base leading-tight">
              {lang === "ja"
                ? skill.skill_name_ja || skill.skill_name
                : skill.skill_name}
            </h4>
            {skill.description && (
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1.5 font-medium">
                {lang === "ja"
                  ? skill.description_ja || skill.description
                  : skill.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
