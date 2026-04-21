import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon, Save, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminTabConfig {
  id: string;
  label: string;
  fullLabel?: string;
  icon?: LucideIcon;
  content?: ReactNode; // Optional: can use children instead
}

export interface AdminDialogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  tabs?: AdminTabConfig[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onSave: () => void;
  saving?: boolean;
  children?: ReactNode;
  sidebarTitle?: string;
  sidebarSubtitle?: string;
  sidebarIcon?: LucideIcon;
  saveLabel?: string;
  footerMetadata?: string;
}

export const AdminDialogForm = ({
  open,
  onOpenChange,
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  onSave,
  saving,
  children,
  sidebarTitle = "Settings",
  sidebarSubtitle = "Configuration",
  sidebarIcon: SidebarIcon = Sparkles,
  saveLabel = "Save Changes",
  footerMetadata = "Admin Dashboard v4.0.2",
}: AdminDialogFormProps) => {
  const activeTabContent = tabs?.find((tab) => tab.id === activeTab)?.content;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideDefaultClose className="max-w-[95vw] sm:max-w-7xl h-[90vh] p-0 overflow-hidden bg-white/95 backdrop-blur-3xl border-white/60 shadow-2xl rounded-[2rem] md:rounded-[3rem] focus:outline-none">
        {/* Root: Full height flex row */}
        <div className="flex flex-row h-full overflow-hidden">

          {/* ── Sidebar ── */}
          {tabs && (
            <div className="hidden md:flex w-72 lg:w-80 shrink-0 bg-sage/5 border-r border-sage/10 flex-col overflow-hidden">
              {/* Brand */}
              <div className="p-8 flex items-center gap-5 shrink-0">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-xl shadow-sage/10 flex items-center justify-center text-sage shrink-0">
                  <SidebarIcon size={22} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-black text-sage uppercase tracking-[0.2em] leading-tight truncate">
                    {sidebarTitle}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase opacity-60 truncate">
                    {sidebarSubtitle}
                  </p>
                </div>
              </div>

              {/* Nav — scrollable if many tabs */}
              <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 min-h-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 text-left",
                      activeTab === tab.id
                        ? "bg-heading text-white shadow-xl shadow-heading/20"
                        : "text-muted-foreground hover:bg-white hover:shadow-md"
                    )}
                  >
                    {tab.icon && <tab.icon size={15} className="shrink-0" />}
                    <span className="truncate">{tab.fullLabel || tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Footer label */}
              <div className="px-8 pb-8 pt-4 border-t border-sage/10 shrink-0">
                <p className="text-[9px] text-muted-foreground/40 font-mono leading-relaxed uppercase">
                  {footerMetadata}<br />
                  Secure Connection
                </p>
              </div>
            </div>
          )}

          {/* ── Mobile Tab Bar (horizontal scroll) ── */}
          {tabs && (
            <div className="md:hidden absolute top-0 left-0 right-0 z-10 bg-white/95 border-b border-sage/10 flex overflow-x-auto gap-1 px-4 py-3 shrink-0 no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all shrink-0",
                    activeTab === tab.id
                      ? "bg-heading text-white shadow-lg"
                      : "text-muted-foreground bg-sage/5 hover:bg-sage/10"
                  )}
                >
                  {tab.icon && <tab.icon size={12} />}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* ── Main Content Area ── */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-white/40">
            {/* Header */}
            <div className={cn(
              "px-6 md:px-10 border-b border-sage/5 flex flex-row items-center justify-between shrink-0",
              tabs ? "pt-16 pb-5 md:pt-6 md:pb-6" : "py-6 md:py-8"
            )}>
              <div className="space-y-1 text-left min-w-0 pr-4">
                <DialogTitle className="text-xl md:text-2xl font-serif font-black text-heading tracking-tight truncate">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="text-xs text-muted-foreground/60 tracking-wider line-clamp-1">
                    {description}
                  </DialogDescription>
                )}
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-10 h-10 rounded-xl hover:bg-heading hover:text-white flex items-center justify-center text-muted-foreground transition-all duration-300 group/close shrink-0 z-[60]"
              >
                <X size={18} className="group-hover/close:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Scrollable Content — THE KEY FIX: min-h-0 + overflow-y-auto */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 md:p-10">
              {activeTabContent || children}
            </div>

            {/* Footer */}
            <div className="px-6 md:px-10 py-5 border-t border-sage/5 flex items-center justify-between bg-white/60 shrink-0 gap-4">
              <button
                onClick={() => onOpenChange(false)}
                className="hidden md:flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-bold text-muted-foreground hover:text-heading transition-colors"
              >
                Close
              </button>

              <Button
                onClick={onSave}
                disabled={saving}
                className="h-12 md:h-14 px-8 md:px-12 bg-sage hover:bg-sage/90 text-white rounded-2xl shadow-xl shadow-sage/20 font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 disabled:scale-100 flex items-center gap-3 w-full md:w-auto"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saveLabel}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
