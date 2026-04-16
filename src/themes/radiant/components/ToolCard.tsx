import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Tool } from "@/types/tools";
import { optimizeCloudinary } from "@/lib/cloudinary";

interface ToolCardProps {
  tool: Tool;
  iconUrl?: string;
  toolNameJa?: string;
  descriptionJa?: string;
}

const getToolIcon = (toolName: string, iconUrl?: string) => {
  // Fallback: emoji mapping (chỉ dùng khi không có iconUrl)
  const iconMap: Record<string, string> = {
    "Meta Ads": "📱",
    GA4: "📊",
    Canva: "🎨",
    Asana: "✓",
    Slack: "💬",
    Figma: "🎭",
  };
  return iconMap[toolName] || "⚙️";
};

export const ToolCard = ({
  tool,
  iconUrl,
  toolNameJa,
  descriptionJa,
}: ToolCardProps) => {
  const { lang } = useLang();
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative h-full"
      onMouseEnter={!isMobile ? () => setIsHovered(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsHovered(false) : undefined}
      whileHover={!isMobile ? { scale: 1.04 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div
        className={`h-full rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 ${
          isHovered && !isMobile ? "bg-white shadow-xl" : "bg-gray-50 shadow-sm"
        }`}
      >
        {/* Icon */}
        <div className="mb-4 h-12 w-12 flex items-center justify-center">
          {iconUrl ? (
            <img
              src={optimizeCloudinary(iconUrl, { width: 96, height: 96, crop: 'fit' })}
              alt={tool.name}
              width={48}
              height={48}
              className="h-full w-full object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PHBhdGggZD0ibTE1IDktNiA2Ii8+PHBhdGggZD0ibTkgOSA2IDYiLz48L3N2Zz4=";
                target.className = "h-1/2 w-1/2 object-contain opacity-20";
              }}
            />
          ) : (
            <span className="text-4xl">{getToolIcon(tool.name)}</span>
          )}
        </div>

        {/* Tool name */}
        <h3 className="font-semibold text-gray-900 text-sm mb-2">
          {lang === "ja" ? toolNameJa || tool.name : tool.name}
        </h3>

        {/* Description - always show on mobile, fade in on hover on desktop */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isMobile || isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs text-gray-600 leading-relaxed"
        >
          {lang === "ja" ? descriptionJa || tool.category : tool.category}
        </motion.p>
      </div>
    </motion.div>
  );
};
