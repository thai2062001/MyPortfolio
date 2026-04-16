import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BulkActionToolbarProps {
  selectedCount: number;
  onClear: () => void;
  actions: {
    label: string;
    icon: any;
    onClick: () => void;
    variant?: "default" | "outline" | "destructive" | "sage";
    isLoading?: boolean;
  }[];
}

export const BulkActionToolbar = ({ selectedCount, onClear, actions }: BulkActionToolbarProps) => {
  const toolbar = (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          // Fixed to viewport bottom-center, ignoring sidebar
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
          style={{ whiteSpace: "nowrap" }}
        >
          <div className="bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center gap-3 pointer-events-auto">
            {/* Counter */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-9 w-9 rounded-full bg-sage text-white flex items-center justify-center font-black text-sm shadow-lg shadow-sage/30 shrink-0">
                {selectedCount}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-xs tracking-tight">
                  Items selected
                </span>
                <button
                  onClick={onClear}
                  className="text-white/40 text-[9px] font-bold uppercase tracking-widest hover:text-sage transition-colors text-left"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-white/10 shrink-0 mx-1" />

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  disabled={action.isLoading}
                  className={cn(
                    "h-10 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shrink-0 transition-all duration-200 disabled:opacity-50",
                    action.variant === "destructive"
                      ? "bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white"
                      : "bg-white/8 text-white/80 hover:bg-sage hover:text-white"
                  )}
                >
                  {action.isLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <action.icon size={14} />
                  )}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render vào document.body để thoát khỏi overflow/stacking context của sidebar
  return typeof document !== "undefined" ? createPortal(toolbar, document.body) : null;
};
