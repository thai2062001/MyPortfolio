import React, { ReactNode } from "react";

interface ResponsiveFormLayoutProps {
  children: ReactNode;
  columns?: 1 | 2;
  className?: string;
}

export const ResponsiveFormLayout = ({ 
  children, 
  columns = 2,
  className = "" 
}: ResponsiveFormLayoutProps) => {
  return (
    <div className={`
      grid grid-cols-1 
      ${columns === 2 ? "xl:grid-cols-2" : ""} 
      gap-5 md:gap-6 lg:gap-8 
      ${className}
    `}>
      {children}
    </div>
  );
};

export const FormSection = ({ 
  title, 
  subtitle, 
  children, 
  className = "" 
}: { 
  title: string; 
  subtitle?: string; 
  children: ReactNode;
  className?: string;
}) => (
  <div className={`space-y-4 md:space-y-6 ${className}`}>
    <div className="space-y-1 px-1">
      <h3 className="text-lg md:text-xl font-serif font-bold text-slate-800 tracking-tight">{title}</h3>
      {subtitle && <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>}
    </div>
    <div className="bg-white/50 backdrop-blur-sm border border-black/[0.03] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 lg:p-10 space-y-6 shadow-sm">
      {children}
    </div>
  </div>
);
