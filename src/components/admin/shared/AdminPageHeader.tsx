import { Plus, Search, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

interface ActionConfig {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  secondaryActions?: ActionConfig[];
  searchPlaceholder?: string;
  searchConfig?: {
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
  };
  tabs?: {
    activeTab: string;
    onTabChange: (id: string) => void;
    tabs: { id: string; label: string; icon?: LucideIcon }[];
  };
  headerActions?: ReactNode;
}

export const AdminPageHeader = ({
  title,
  description,
  searchTerm,
  onSearchChange,
  primaryAction,
  secondaryAction,
  secondaryActions,
  searchPlaceholder = "Search...",
  searchConfig,
  tabs,
  headerActions,
}: AdminPageHeaderProps) => {
  const effectiveSearchValue = searchConfig ? searchConfig.value : (searchTerm || "");
  const effectiveSearchPlaceholder = searchConfig?.placeholder || searchPlaceholder;
  const handleSearchChange = searchConfig ? searchConfig.onChange : onSearchChange;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-heading tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-xs md:text-sm tracking-wide">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 w-full lg:w-auto">
          {headerActions && (
            <div className="flex items-center gap-2 p-1 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl w-full sm:w-auto overflow-x-auto no-scrollbar">
              {headerActions}
            </div>
          )}
          
          {handleSearchChange && (
            <div className="relative group w-full lg:w-64">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-sage transition-colors"
                size={16}
              />
              <Input
                placeholder={effectiveSearchPlaceholder}
                value={effectiveSearchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-12 w-full pl-12 bg-white/40 border-none rounded-xl text-xs font-bold shadow-sm"
              />
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-start lg:justify-end">
            {secondaryActions?.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={action.onClick}
                className="flex-1 sm:flex-none h-12 md:h-14 px-5 bg-white/40 border-white/60 text-heading rounded-xl md:rounded-2xl font-bold transition-all hover:bg-white/60 flex items-center justify-center gap-2"
              >
                {action.icon && <action.icon size={18} />}
                <span className="hidden lg:inline">{action.label}</span>
              </Button>
            ))}

            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                className="flex-1 sm:flex-none h-12 md:h-14 px-6 bg-white/40 border-white/60 text-heading rounded-xl md:rounded-2xl font-bold transition-all hover:bg-white/60 flex items-center justify-center gap-3"
              >
                {secondaryAction.icon && <secondaryAction.icon size={18} />}
                {secondaryAction.label}
              </Button>
            )}
            
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                className="flex-1 sm:flex-none h-12 md:h-14 px-8 md:px-10 bg-sage hover:bg-sage/90 text-white rounded-xl md:rounded-2xl shadow-xl shadow-sage/20 font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
              >
                {primaryAction.icon ? (
                  <primaryAction.icon
                    size={20}
                    className="group-hover:rotate-90 transition-transform duration-500"
                  />
                ) : (
                  <Plus
                    size={20}
                    className="group-hover:rotate-90 transition-transform duration-500"
                  />
                )}
                {primaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>

      {tabs && (
        <div className="flex items-center gap-2 p-1.5 bg-white/30 backdrop-blur-md rounded-2xl w-fit border border-white/40">
          {tabs.tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => tabs.onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                tabs.activeTab === tab.id
                  ? "bg-heading text-white shadow-lg"
                  : "text-muted-foreground hover:bg-white/50"
              }`}
            >
              {tab.icon && <tab.icon size={14} />}
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
