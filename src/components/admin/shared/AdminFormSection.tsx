import React from "react";

interface AdminFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ElementType;
}

export const AdminFormSection = ({
  title,
  description,
  children,
  icon: Icon,
}: AdminFormSectionProps) => {
  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex md:flex-row flex-col-reverse md:items-center justify-between border-b border-border/40 pb-6 md:pb-8">
        <div>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-heading capitalize flex items-center gap-2 md:gap-3">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-sage shadow-[0_0_10px_rgba(132,153,137,0.5)]"></span>
            {Icon && <Icon size={20} className="text-sage" />}
            {title}
          </h3>
          {description && (
            <p className="text-[10px] md:text-xs text-muted-foreground mt-2 font-serif italic tracking-wide">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </div>
    </div>
  );
};

interface AdminFieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const AdminField = ({
  label,
  description,
  children,
  className = "",
}: AdminFieldProps) => {
  return (
    <div className={`space-y-3 md:space-y-4 ${className}`}>
      <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2 md:ml-3">
        {label}
      </label>
      {children}
      {description && (
        <p className="text-[9px] md:text-[10px] text-muted-foreground/60 italic ml-2 md:ml-3">
          {description}
        </p>
      )}
    </div>
  );
};
