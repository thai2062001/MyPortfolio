"use client";

import { SiteStat } from "@/types/admin";
import { 
    Edit3, 
    Trash2, 
    GripVertical, 
    Eye, 
    EyeOff, 
    Layers,
    Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LangContext";

interface StatsListProps {
  stats: SiteStat[];
  onEdit: (stat: SiteStat) => void;
  onDelete: (id: string, name: string) => void;
  onTogglePublish: (stat: SiteStat) => void;
}

export const StatsList = ({
  stats,
  onEdit,
  onDelete,
  onTogglePublish,
}: StatsListProps) => {
  const { lang, translations } = useLang();

  if (stats.length === 0) {
    return (
      <div className="py-20 text-center bg-white/40 backdrop-blur-sm border border-dashed border-black/10 rounded-[2.5rem]">
        <div className="w-16 h-16 bg-sage/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Layers className="text-sage/40" size={32} />
        </div>
        <h3 className="text-lg font-serif font-bold text-heading">No statistics configured</h3>
        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold">
          Metric matrix is currently offline
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="group bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all duration-700 relative overflow-hidden flex flex-col justify-between"
        >
          {/* BACKGROUND DECOR */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white shadow-sm border border-black/5 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                {stat.icon_url ? (
                  <img src={stat.icon_url} alt="" className="w-8 h-8 object-contain" />
                ) : (
                  <ImageIcon size={24} className="text-sage" />
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onTogglePublish(stat)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm border border-border/10 active:scale-95 ${stat.is_published ? "bg-white text-sage hover:bg-sage/5" : "bg-white text-muted-foreground hover:bg-black/5"}`}
                  title={stat.is_published ? "Archive Node" : "Activate Node"}
                >
                  {stat.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => onEdit(stat)}
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-muted-foreground hover:bg-sage hover:text-white transition-all shadow-sm border border-border/10 active:scale-95"
                  title="Edit Node"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDelete(stat.id, stat.value_text)}
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all shadow-sm border border-border/10 active:scale-95"
                  title="Delete Node"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-serif font-bold text-heading tracking-tight">
                  {stat.value_text}
                </h3>
                {stat.stat_key && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        {stat.stat_key}
                    </span>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-bold text-heading">
                    {lang === 'en' ? stat.label_en : (stat.label_ja || stat.label_en)}
                </p>
                {(stat.description_en || stat.description_ja) && (
                    <p className="text-[11px] text-muted-foreground font-serif italic line-clamp-2">
                        {lang === 'en' ? stat.description_en : (stat.description_ja || stat.description_en)}
                    </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
            <button
              onClick={() => onTogglePublish(stat)}
              className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest transition-colors ${stat.is_published ? "text-green-500 hover:text-green-600" : "text-muted-foreground hover:text-heading"}`}
            >
              {stat.is_published ? (
                <>
                  <Eye size={12} />
                  Live Sync
                </>
              ) : (
                <>
                  <EyeOff size={12} />
                  Offline
                </>
              )}
            </button>
            <div className="flex items-center gap-2">
                <GripVertical size={14} className="text-muted-foreground/30" />
                <span className="text-[10px] font-bold text-muted-foreground/50">#{stat.order_index}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
