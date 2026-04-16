import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrbitalItem {
  id: string;
  name: string;
  type: 'skill' | 'tool';
  icon?: string;
}

interface ExpertiseOrbitalProps {
  title?: string;
  description?: string;
  items: OrbitalItem[];
  iconUrl?: string;
}

const ExpertiseOrbital: React.FC<ExpertiseOrbitalProps> = ({ 
  title = "Expertise & Tools", 
  description = "Digital experiences that engage users and help your startup stand out from day one",
  items,
  iconUrl
}) => {
  const isMobile = useIsMobile();

  // Expanded positions for more items (Skills + Tools)
  const desktopPositions = [
    { x: 20, y: 15 }, 
    { x: 50, y: 10 }, 
    { x: 80, y: 18 }, 
    { x: 12, y: 45 }, 
    { x: 88, y: 42 }, 
    { x: 15, y: 75 }, 
    { x: 42, y: 88 }, 
    { x: 70, y: 82 }, 
    { x: 82, y: 68 },
    // Additional positions for tools
    { x: 30, y: 25 },
    { x: 70, y: 28 },
    { x: 10, y: 30 },
    { x: 90, y: 20 },
    { x: 25, y: 85 },
    { x: 75, y: 55 },
    { x: 5, y: 60 },
    { x: 92, y: 70 },
    { x: 45, y: 20 },
    { x: 55, y: 85 },
    { x: 8, y: 80 },
    { x: 95, y: 50 },
    { x: 35, y: 12 },
    { x: 65, y: 12 },
  ];

  // Map items to positions
  const displayedItems = useMemo(() => items.slice(0, desktopPositions.length), [items]);

  return (
    <div className="relative w-full min-h-[700px] md:min-h-[900px] flex items-center justify-center overflow-hidden py-24 px-6 bg-[#F8F7F4]">
      {/* Background soft accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border border-[#D9E4FF]/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full border border-[#D9E4FF]/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full border border-[#D9E4FF]/10" />
      </div>

      <div className="relative z-10 max-w-4xl text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          {iconUrl ? (
            <img src={iconUrl} alt="Expertise Icon" className="w-16 h-16 md:w-24 md:h-24 object-contain" />
          ) : (
            <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
               <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* UFO Body Top */}
                  <path d="M50 25C68 25 80 32 80 38H20C20 32 32 25 50 25Z" fill="#1A2B56"/>
                  {/* UFO Glass Dome */}
                  <path d="M50 15C58 15 65 20 65 28C65 30 63 32 60 33H40C37 32 35 30 35 28C35 20 42 15 50 15Z" fill="#1A2B56" fillOpacity="0.8"/>
                  <circle cx="50" cy="22" r="4" fill="#FF7A00"/>
                  {/* UFO Lower Body */}
                  <rect x="15" y="38" width="70" height="8" rx="4" fill="#1A2B56"/>
                  {/* Platform / Stand */}
                  <path d="M35 46L25 65H75L65 46" stroke="#1A2B56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <ellipse cx="50" cy="70" rx="35" ry="8" stroke="#1A2B56" strokeWidth="1.5" strokeOpacity="0.3"/>
                  <path d="M25 65L20 72M75 65L80 72" stroke="#1A2B56" strokeWidth="2" strokeLinecap="round"/>
               </svg>
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-display italic text-4xl md:text-6xl lg:text-7xl text-[#1A2B56] leading-[1.1] mb-6"
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-sans text-lg md:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>
      </div>

      {/* Floating Items - Desktop */}
      {!isMobile && displayedItems.map((item, index) => {
        const pos = desktopPositions[index] || { x: 50, y: 50 };
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ 
              opacity: 1, 
              scale: 1, 
              transition: { 
                delay: 0.05 * index, 
                duration: 1,
                ease: [0.34, 1.56, 0.64, 1] 
              }
            }}
            viewport={{ once: true }}
            animate={{
              y: [0, -15, 0],
              x: [0, index % 2 === 0 ? 8 : -8, 0],
              rotate: [0, index % 2 === 0 ? 1 : -1, 0],
              transition: {
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ 
              left: `${pos.x}%`, 
              top: `${pos.y}%`,
            }}
          >
            <motion.div 
              whileHover={{ 
                scale: 1.1,
                y: -5,
                transition: { duration: 0.3 }
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm md:text-base font-medium whitespace-nowrap shadow-[0_4px_20px_rgba(26,43,86,0.05)] hover:shadow-[0_10px_30px_rgba(26,43,86,0.12)] transition-all cursor-pointer border border-white/80 group ${
                item.type === 'tool' ? 'bg-white text-[#1A2B56]' : 'bg-[#D9E4FF] text-[#1A2B56]'
              }`}
            >
              {item.type === 'tool' && item.icon && (
                <img src={item.icon} alt="" className="w-5 h-5 object-contain" />
              )}
              <span className="relative z-10 transition-colors duration-300">
                {item.name}
              </span>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Items - Mobile */}
      {isMobile && (
        <div className="absolute bottom-10 left-0 w-full px-6 flex flex-wrap justify-center gap-3 max-h-[40%] overflow-y-auto thin-scrollbar">
          {displayedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * index }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border border-white/50 ${
                item.type === 'tool' ? 'bg-white text-[#1A2B56]' : 'bg-[#D9E4FF] text-[#1A2B56]'
              }`}
            >
              {item.type === 'tool' && item.icon && (
                <img src={item.icon} alt="" className="w-4 h-4 object-contain" />
              )}
              {item.name}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertiseOrbital;
