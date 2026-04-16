import React from "react";
import { Grid, FileIcon, ArrowRight, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaAsset } from "@/types/media";
import { useLang } from "@/contexts/LangContext";
import { motion, AnimatePresence } from "framer-motion";

interface MediaAssetGridProps {
  assets: MediaAsset[];
  selectedAssetId: string | null;
  onSelectAsset: (id: string) => void;
  // Multi-selection support
  selectedAssetIds?: string[];
  onToggleSelect?: (id: string, e: React.MouseEvent) => void;
  isSelectionMode?: boolean;
}

export const MediaAssetGrid = ({
  assets,
  selectedAssetId,
  onSelectAsset,
  selectedAssetIds = [],
  onToggleSelect,
  isSelectionMode = false,
}: MediaAssetGridProps) => {
  const { t } = useLang();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
      {assets.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
          <Grid size={48} className="text-sage" />
          <div>
            <h4 className="font-serif text-lg">{t("Grid Empty", "グリッドが空です", "Lưới trống")}</h4>
            <p className="text-xs">{t("No resources found in this matrix.", "このマトリックス内にはリソースが見つかりませんでした。", "Không tìm thấy tài nguyên nào trong vùng này.")}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {assets.map((asset) => {
            const isSelected = selectedAssetIds.includes(asset.id);
            const isHighlighted = selectedAssetId === asset.id;
            
            return (
              <div
                key={asset.id}
                onClick={(e) => {
                  if (isSelectionMode) {
                    onToggleSelect?.(asset.id, e);
                  } else {
                    onSelectAsset(asset.id);
                  }
                }}
                className={cn(
                  "group relative aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 border-2 bg-white",
                  isHighlighted || isSelected
                    ? "border-sage shadow-xl ring-2 ring-sage/20"
                    : "border-transparent shadow-sm hover:shadow-md",
                )}
              >
                {/* Media Preview */}
                <div
                  className={cn(
                    "w-full h-full transition-all duration-500",
                    isSelected ? "opacity-40 grayscale-0" : "opacity-100",
                  )}
                >
                  {asset.asset_type === "image" ||
                  asset.asset_type === "svg" ||
                  asset.asset_type === "icon" ? (
                    <img
                      src={asset.secure_url}
                      alt={asset.alt_text || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : asset.asset_type === "video" ? (
                    <div className="w-full h-full flex items-center justify-center bg-black/5">
                      <FileIcon size={32} className="text-sage/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <ArrowRight size={18} className="text-sage ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-sage/5">
                      <FileText size={32} className="text-sage/40" />
                    </div>
                  )}
                </div>

                {/* Selection Checkbox - Always available on hover */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect?.(asset.id, e);
                  }}
                  className={cn(
                    "absolute top-4 left-4 z-20 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                    isSelected
                      ? "bg-sage border-sage text-white opacity-100"
                      : "bg-white/80 border-sage/20 opacity-0 group-hover:opacity-100",
                  )}
                >
                  {isSelected && <Check size={14} />}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <p className="text-[10px] font-bold text-white truncate uppercase tracking-widest text-left">
                    {asset.file_name}
                  </p>
                  <p className="text-[10px] text-white/60 truncate italic text-left">
                    {asset.file_extension?.toUpperCase()} •{" "}
                    {Math.round((asset.file_size || 0) / 1024)}KB
                  </p>
                </div>

                {/* Selected Indicator (Original logic kept for highlight) */}
                {isHighlighted && !isSelected && (
                  <div className="absolute top-4 right-4 z-10 pointer-events-none">
                    <div className="w-6 h-6 rounded-full bg-sage/20 text-sage flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-300">
                      <div className="w-2 h-2 rounded-full bg-sage" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
