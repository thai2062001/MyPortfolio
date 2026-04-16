import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AdminLoading } from "./AdminLoading";
import { CheckCircle2 } from "lucide-react";

interface AdminCardGridProps<T> {
  data: T[];
  renderCard: (item: T, index: number, isSelected?: boolean, toggleSelect?: (e: React.MouseEvent) => void) => ReactNode;
  loading?: boolean;
  emptyState?: ReactNode;
  className?: string;
  gridClassName?: string;
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
}

/**
 * A specialized grid component for displaying records as cards instead of tables.
 * Optimized for gallery-style content like Clients, Projects, or Testimonials.
 */
export function AdminCardGrid<T extends { id: string | number }>({
  data = [],
  renderCard,
  loading,
  emptyState,
  className,
  gridClassName,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
}: AdminCardGridProps<T>) {
  
  const toggleSelect = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectionChange) return;
    
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (loading) {
    return <AdminLoading message="Syncing Cluster Data..." />;
  }

  if (!data || data.length === 0) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          {emptyState || (
            <div className="py-24 text-center text-muted-foreground border border-dashed border-sage/20 rounded-[3rem] bg-white/40 backdrop-blur-md">
              <p className="font-serif italic text-lg text-slate-400">No records found within the current parameters.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className={cn("w-full relative", className)}>
      <motion.div
        layout
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8",
          gridClassName
        )}
      >
        <AnimatePresence mode="popLayout">
          {data.map((item, index) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="h-full relative group/card"
              >
                {/* Selection Checkbox Overlay */}
                {selectable && (
                  <div 
                    onClick={(e) => toggleSelect(item.id, e)}
                    className={cn(
                      "absolute top-4 left-4 z-30 w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm opacity-0 group-hover/card:opacity-100",
                      isSelected 
                        ? "bg-sage border-sage text-white opacity-100" 
                        : "bg-white/80 backdrop-blur-md border-sage/20 hover:border-sage/40"
                    )}
                  >
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 size={14} />
                      </motion.div>
                    )}
                  </div>
                )}
                
                {renderCard(item, index, isSelected, (e) => toggleSelect(item.id, e))}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
