import React from "react";
import { Eye, EyeOff } from "lucide-react";

export interface AdminStatusToggleProps {
  label: string;
  isPublished?: boolean;
  isActive?: boolean;
  onToggle?: (value: boolean) => void;
  onChange?: (value: boolean) => void;
  description?: string | { active: string; inactive: string };
  icon?: React.ElementType;
}

export const AdminStatusToggle = ({
  label,
  isPublished,
  isActive,
  onToggle,
  onChange,
  description,
  icon: Icon,
}: AdminStatusToggleProps) => {
  const activeStatus = isActive ?? isPublished ?? false;
  const handleChange = onChange ?? onToggle ?? (() => {});
  const activeDesc = typeof description === "string" ? description : description?.active || "Currently live and visible.";
  const inactiveDesc = typeof description === "string" ? description : description?.inactive || "Hidden from public view.";

  return (
    <div
      className={`flex items-center gap-6 md:gap-10 p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border transition-all cursor-pointer ${
        activeStatus
          ? "bg-sage/5 border-sage/20 shadow-2xl"
          : "bg-muted/30 border-border/40 hover:bg-muted/40"
      }`}
      onClick={() => handleChange(!activeStatus)}
    >
      <div
        className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-[1.8rem] flex items-center justify-center transition-all shadow-xl flex-shrink-0 ${
          activeStatus
            ? "bg-sage text-white"
            : "bg-muted-foreground/20 text-muted-foreground"
        }`}
      >
        {activeStatus ? (
           Icon ? <Icon size={24} className="md:w-8 md:h-8" /> : <Eye size={24} className="md:w-8 md:h-8" />
        ) : (
          <EyeOff size={24} className="md:w-8 md:h-8" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-lg md:text-xl font-bold text-heading uppercase tracking-widest">
          {label}
        </h4>
        <p className="text-[10px] md:text-xs text-muted-foreground mt-2 md:mt-3 leading-relaxed">
          {activeStatus ? activeDesc : inactiveDesc}
        </p>
      </div>
    </div>
  );
};
