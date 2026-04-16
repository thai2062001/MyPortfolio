import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface MinimalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  children: React.ReactNode;
}

export const MinimalButton = React.forwardRef<HTMLButtonElement, MinimalButtonProps>(
  ({ className, variant = 'primary', size = 'md', showIcon = true, children, ...props }, ref) => {
    
    // Base styles following Organic Neo-Nordic rules
    const baseStyles = "relative inline-flex items-center justify-center gap-3 rounded-full font-sans font-bold uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden group active:scale-95";
    
    const variants = {
      primary: "bg-main text-white hover:bg-primary hover:shadow-xl hover:shadow-primary/20",
      outline: "bg-transparent border border-main/10 text-main hover:border-primary hover:text-primary",
      ghost: "bg-transparent text-main/60 hover:text-primary"
    };

    const sizes = {
      sm: "px-6 py-3 text-[10px]",
      md: "px-10 py-5 text-[11px]",
      lg: "px-14 py-7 text-[12px]"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-white">
          {children}
          {showIcon && (
            <ArrowUpRight 
              size={size === 'sm' ? 14 : 18} 
              className="transition-transform duration-500 group-hover:rotate-45" 
            />
          )}
        </span>
        
        {/* Hover background slide effect for primary/outline - Subtle Nordic touch */}
        {variant !== 'ghost' && (
          <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[0.22,1,0.36,1] -z-0" />
        )}
      </button>
    );
  }
);

MinimalButton.displayName = "MinimalButton";
