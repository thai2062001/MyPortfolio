import { memo } from "react";
import { useIsTablet } from "@/hooks/use-mobile";

interface AmbientAccentProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center-left" | "center-right";
  color?: string;
  size?: number | string;
  opacity?: number;
  blur?: number | string;
  className?: string;
}

const AmbientAccent = memo(({
  position = "top-right",
  color = "bg-primary",
  size = 600,
  opacity = 0.05,
  blur = 180,
  className = "",
}: AmbientAccentProps) => {
  const isTablet = useIsTablet();
  
  const getPositionClass = () => {
    switch (position) {
      case "top-right": return "top-0 right-0 -translate-y-1/3 translate-x-1/3";
      case "top-left": return "top-0 left-0 -translate-y-1/3 -translate-x-1/3";
      case "bottom-right": return "bottom-0 right-0 translate-y-1/3 translate-x-1/3";
      case "bottom-left": return "bottom-0 left-0 translate-y-1/3 -translate-x-1/3";
      case "center-left": return "top-1/2 left-0 -translate-y-1/2 -translate-x-1/2";
      case "center-right": return "top-1/2 right-0 -translate-y-1/2 translate-x-1/2";
      default: return "";
    }
  };

  const style = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    opacity: opacity,
    filter: `blur(${isTablet ? Math.min(Number(blur), 80) : blur}px)`,
    willChange: 'transform',
  };

  return (
    <div 
      className={`absolute rounded-full pointer-events-none ${color} ${getPositionClass()} ${className}`}
      style={style}
    />
  );
});

AmbientAccent.displayName = "AmbientAccent";

export default AmbientAccent;
