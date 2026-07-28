import React from "react";
import { motion } from "framer-motion";
import { optimizeCloudinary } from "@/lib/cloudinary";

interface Tool {
  id: string;
  name: string;
  icon_url?: string;
}

interface PremiumToolCardProps {
  tool: Tool;
}

const PremiumToolCard: React.FC<PremiumToolCardProps> = ({ tool }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-100/50 h-full min-h-[220px]"
    >
      <div className="mb-8 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
        {tool.icon_url ? (
          <img
            src={optimizeCloudinary(tool.icon_url, { width: 200, height: 200, crop: 'fit' })}
            alt={tool.name}
            loading="lazy"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center">
             <span className="material-symbols-outlined text-4xl text-gray-300">settings</span>
          </div>
        )}
      </div>

      <h3 className="font-display uppercase tracking-widest text-[#1A2B56] text-sm md:text-base font-medium">
        {tool.name}
      </h3>
    </motion.div>
  );
};

export default PremiumToolCard;
