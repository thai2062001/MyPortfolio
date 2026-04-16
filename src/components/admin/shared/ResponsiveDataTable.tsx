import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
  width?: string;
}

interface EmptyStateConfig {
  title: string;
  icon: LucideIcon;
  message?: string;
  onReset?: () => void;
}

interface ResponsiveDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  renderCard?: (item: T, index: number) => ReactNode;
  isLoading?: boolean;
  loading?: boolean;
  emptyState?: ReactNode | EmptyStateConfig;
  onRowClick?: (item: T) => void;
  rowClassName?: string | ((item: T) => string);
  searchTerm?: string;
  searchFields?: (keyof T | string)[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, item: T) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, item: T) => void;
  draggedItemId?: string | null;
  // Selection
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
}

/**
 * Predicate to check if emptyState is a config object rather than a ReactNode
 */
function isEmptyStateConfig(state: any): state is EmptyStateConfig {
  return (
    state &&
    typeof state === "object" &&
    "title" in state &&
    "icon" in state &&
    !React.isValidElement(state)
  );
}

const DefaultCard = <T extends { id: string | number }>({
  item,
  index,
  columns,
  onEdit,
  onDelete,
  selectable,
  selected,
  onToggle,
}: {
  item: T;
  index: number;
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
}) => (
  <div className={cn(
    "bg-white p-6 rounded-[2.5rem] border shadow-sm space-y-6 text-left group hover:shadow-xl transition-all duration-500 relative",
    selected ? "border-sage/40 ring-1 ring-sage/10 bg-sage/[0.02]" : "border-black/[0.03]"
  )}>
    {selectable && (
      <div className="absolute top-6 right-6 z-10">
        <div 
          onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
          className={cn(
            "w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-300",
            selected 
              ? "bg-sage border-sage shadow-lg shadow-sage/30 scale-110" 
              : "border-sage/20 bg-white hover:border-sage/40"
          )}
        >
          {selected && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="text-white">
                <path d="M1 4L4 7L9 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          )}
        </div>
      </div>
    )}
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-widest text-sage bg-sage/5 px-3 py-1 rounded-full">Node Details</span>
      <div className="w-8 h-8 rounded-lg bg-sage/5 flex items-center justify-center text-xs text-sage font-mono">#{String(item.id || "").slice(0, 4)}</div>
    </div>
    <div className="grid grid-cols-1 gap-5">
       {(columns || []).slice(0, 3).map((col, idx) => (
         <div key={idx} className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-slate-400 underline decoration-sage/20 underline-offset-4 uppercase tracking-widest">{col.header}</span>
            <div className="text-sm font-serif font-bold text-heading truncate">
              {col.render ? col.render(item, index) : (item as any)[col.key]}
            </div>
         </div>
       ))}
    </div>
    
    {(onEdit || onDelete) && (
      <div className="pt-4 border-t border-sage/5 flex items-center justify-end gap-3">
        {onEdit && (
          <button
             onClick={(e) => { e.stopPropagation(); onEdit(item); }}
             className="w-12 h-12 bg-sage/10 text-sage rounded-2xl flex items-center justify-center hover:bg-sage hover:text-white transition-all shadow-sm"
          >
            <Edit3 size={18} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item); }}
            className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    )}
  </div>
);

export function ResponsiveDataTable<T extends { id: string | number }>({
  columns,
  data,
  renderCard,
  isLoading,
  loading,
  emptyState,
  onRowClick,
  rowClassName,
  searchTerm,
  searchFields,
  onEdit,
  onDelete,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  draggedItemId,
  selectable,
  selectedIds = [],
  onSelectionChange,
}: ResponsiveDataTableProps<T>) {
  const isDataLoading = isLoading || loading;
  const [isMediumOrSmaller, setIsMediumOrSmaller] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const checkSize = () => setIsMediumOrSmaller(window.innerWidth < 1280);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const filteredData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (!searchTerm || !Array.isArray(searchFields) || searchFields.length === 0) return data;
    
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => 
      item && searchFields.some(field => {
        const val = (item as any)[field];
        return val && String(val).toLowerCase().includes(lowerSearch);
      })
    );
  }, [data, searchTerm, searchFields]);

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedIds.length === filteredData.length && filteredData.length > 0) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredData.map(item => item.id));
    }
  };

  const handleToggleSelect = (id: string | number) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const effectiveColumns = React.useMemo(() => {
    let result = [...(columns || [])];

    if (selectable) {
      const isAllSelected = filteredData.length > 0 && selectedIds.length === filteredData.length;
      const isSomeSelected = selectedIds.length > 0 && selectedIds.length < filteredData.length;

      const selectionColumn: Column<T> = {
        header: "",
        key: "selection",
        width: "60px",
        headerClassName: "pl-8 pr-0",
        className: "pl-8 pr-0",
        render: (item) => (
          <div 
            onClick={(e) => { e.stopPropagation(); handleToggleSelect(item.id); }}
            className={cn(
              "w-5 h-5 rounded-md border-2 cursor-pointer flex items-center justify-center transition-all duration-300",
              selectedIds.includes(item.id) 
                ? "bg-sage border-sage shadow-md shadow-sage/20 scale-105" 
                : "border-sage/20 bg-white hover:border-sage/40"
            )}
          >
            {selectedIds.includes(item.id) && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <svg width="8" height="6" viewBox="0 0 10 8" fill="none" className="text-white">
                  <path d="M1 4L4 7L9 1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
          </div>
        )
      };

      (selectionColumn as any).headerRender = () => (
        <div 
          onClick={(e) => { e.stopPropagation(); handleSelectAll(); }}
          className={cn(
            "w-5 h-5 rounded-md border-2 cursor-pointer flex items-center justify-center transition-all duration-300",
            isAllSelected 
              ? "bg-sage border-sage shadow-md shadow-sage/20 scale-105" 
              : "border-sage/20 bg-white hover:border-sage/40",
            isSomeSelected && "border-sage bg-sage/10"
          )}
        >
          {isAllSelected && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <svg width="8" height="6" viewBox="0 0 10 8" fill="none" className="text-white">
                <path d="M1 4L4 7L9 1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          )}
          {isSomeSelected && (
            <div className="w-2.5 h-0.5 bg-sage rounded-full" />
          )}
        </div>
      );

      result = [selectionColumn, ...result];
    }

    if (onEdit || onDelete) {
      const actionColumn: Column<T> = {
        header: "Actions",
        key: "actions",
        headerClassName: "text-right pr-8",
        className: "text-right pr-8",
        render: (item) => (
          <div className="flex items-center gap-2 justify-end">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-heading hover:text-sage transition-all hover:scale-105 active:scale-95"
              >
                <Edit3 size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-all hover:scale-105 active:scale-95"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )
      };
      
      result = [...result, actionColumn];
    }
    
    return result;
  }, [columns, onEdit, onDelete, selectable, selectedIds, filteredData]);

  if (isDataLoading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-12 h-1 bg-sage/10 rounded-full overflow-hidden">
          <div className="w-full h-full bg-sage animate-loading-bar" />
        </div>
      </div>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    if (isEmptyStateConfig(emptyState)) {
      const { title, icon: Icon, message, onReset } = emptyState;
      return (
        <div className="py-24 px-8 border border-white/40 bg-white/40 backdrop-blur-xl rounded-[3rem] text-center space-y-6">
          <div className="w-20 h-20 bg-sage/5 rounded-[2rem] flex items-center justify-center text-sage mx-auto">
            {Icon && <Icon size={32} />}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-serif font-bold text-heading">{title}</h3>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>
          {onReset && (
            <Button 
              variant="outline" 
              onClick={onReset}
              className="rounded-xl px-8 border-sage/20 text-sage hover:bg-sage/5"
            >
              Reset Search Layout
            </Button>
          )}
        </div>
      );
    }

    return (emptyState as ReactNode) || (
      <div className="py-24 text-center text-muted-foreground border border-dashed border-sage/20 rounded-[3rem]">
        No records match the current parameters.
      </div>
    );
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isMediumOrSmaller ? (
          <motion.div
            key="card-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 min-[1100px]:grid-cols-2 gap-6 lg:gap-8"
          >
            {filteredData.map((item, index) => {
              const selected = selectedIds.includes(item.id);
              return (
                <div 
                  key={item?.id || index}
                  draggable={draggable}
                  onDragStart={onDragStart ? (e) => onDragStart(e, item) : undefined}
                  onDragOver={onDragOver}
                  onDrop={onDrop ? (e) => onDrop(e, item) : undefined}
                  className={cn(
                    "transition-all duration-500 relative group/card",
                    draggedItemId === String(item?.id) ? "opacity-30 scale-95 blur-sm" : "opacity-100",
                    selected && "scale-[1.02]"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <div className="absolute top-6 right-6 z-30">
                      <div 
                        onClick={(e) => { e.stopPropagation(); handleToggleSelect(item.id); }}
                        className={cn(
                          "w-7 h-7 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-500 shadow-sm",
                          selected 
                            ? "bg-sage border-sage shadow-lg shadow-sage/30 scale-110" 
                            : "border-white/40 bg-white/20 backdrop-blur-md opacity-0 group-hover/card:opacity-100 hover:border-white"
                        )}
                      >
                        {selected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <svg width="12" height="10" viewBox="0 0 10 8" fill="none" className="text-white">
                              <path d="M1 4L4 7L9 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}

                  {selected && (
                    <div className="absolute inset-0 rounded-[2.5rem] ring-2 ring-sage/40 pointer-events-none z-10" />
                  )}

                  {renderCard ? renderCard(item, index) : (
                    <DefaultCard 
                      item={item} 
                      index={index} 
                      columns={columns} 
                      onEdit={onEdit} 
                      onDelete={onDelete} 
                      selectable={false} // Hidden as we represent it here
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="table-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden rounded-[3rem] border border-white/40 bg-white/40 backdrop-blur-xl shadow-2xl"
          >
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-sage/5 border-b border-white/60">
                  {effectiveColumns.map((col, i) => (
                    <th
                      key={i}
                      style={{ width: col.width }}
                      className={cn(
                        "px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400",
                        col.headerClassName
                      )}
                    >
                      {(col as any).headerRender ? (col as any).headerRender() : col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.03]">
                {filteredData.map((item, index) => (
                  <tr
                    key={item?.id || index}
                    draggable={draggable}
                    onDragStart={onDragStart ? (e) => onDragStart(e, item) : undefined}
                    onDragOver={onDragOver}
                    onDrop={onDrop ? (e) => onDrop(e, item) : undefined}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      "group transition-all duration-500 hover:bg-white/80",
                      typeof rowClassName === "function" ? rowClassName(item) : rowClassName,
                      onRowClick && "cursor-pointer",
                      draggedItemId === String(item?.id) && "bg-sage/10 opacity-50 blur-[2px]"
                    )}
                  >
                    {effectiveColumns.map((col, i) => (
                      <td 
                        key={i} 
                        style={{ width: col.width }}
                        className={cn("px-8 py-6 transition-all duration-300", col.className, selectedIds.includes(item.id) && "bg-sage/[0.01]")}
                      >
                        <div className="flex items-center">
                          {col.render ? col.render(item, index) : (
                            <span className="font-serif font-bold text-heading">
                              {(item as any)?.[col.key]}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
