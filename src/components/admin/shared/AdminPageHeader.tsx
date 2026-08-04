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
    <div className="space-y-6">
      {/* Top Row: Title + Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1 text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-heading tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-xs md:text-sm tracking-wide">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          {secondaryActions?.map((action, idx) => (
            <Button
              key={idx}
              variant="outline"
              onClick={action.onClick}
              className="flex-1 sm:flex-none h-12 px-5 bg-white border border-sage/20 text-heading rounded-xl font-bold transition-all hover:bg-sage/5 hover:text-sage flex items-center justify-center gap-2 shadow-sm"
            >
              {action.icon && <action.icon size={16} />}
              <span>{action.label}</span>
            </Button>
          ))}

          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="flex-1 sm:flex-none h-12 px-6 bg-white border border-sage/20 text-heading rounded-xl font-bold transition-all hover:bg-sage/5 hover:text-sage flex items-center justify-center gap-3 shadow-sm"
            >
              {secondaryAction.icon && <secondaryAction.icon size={16} />}
              {secondaryAction.label}
            </Button>
          )}
          
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              className="flex-1 sm:flex-none h-12 px-8 bg-sage hover:bg-sage/90 text-white rounded-xl shadow-lg shadow-sage/10 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              {primaryAction.icon ? (
                <primaryAction.icon
                  size={16}
                  className="group-hover:rotate-90 transition-transform duration-500"
                />
              ) : (
                <Plus
                  size={16}
                  className="group-hover:rotate-90 transition-transform duration-500"
                />
              )}
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Search & Tabs (Optional) */}
      {(handleSearchChange || tabs || headerActions) && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-sage/5">
          <div className="flex items-center gap-4 flex-1 md:max-w-md">
            {handleSearchChange && (
              <div className="relative group w-full">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-sage transition-colors"
                  size={16}
                />
                <Input
                  placeholder={effectiveSearchPlaceholder}
                  value={effectiveSearchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-12 w-full pl-12 bg-white/80 border border-sage/10 rounded-xl text-xs font-bold shadow-sm focus:border-sage/30 focus:bg-white transition-all"
                />
              </div>
            )}
            
            {headerActions && (
              <div className="flex items-center gap-2 p-1 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl overflow-x-auto no-scrollbar">
                {headerActions}
              </div>
            )}
          </div>

          {tabs && (
            <div className="flex items-center gap-2 p-1.5 bg-white/30 backdrop-blur-md rounded-2xl w-fit border border-white/40 overflow-x-auto no-scrollbar">
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
      )}
    </div>
  );
};
