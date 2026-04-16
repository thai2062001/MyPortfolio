import { useEffect, useState } from "react";
import { HardDrive, Image, Video, FileIcon, Sparkles } from "lucide-react";
import { getStorageStats } from "@/lib/media-usage-detector";
import { formatFileSize } from "@/lib/media-optimizer";
import { useLang } from "@/contexts/LangContext";
import { cn } from "@/lib/utils";

export const StorageStatsCard = () => {
  const { t } = useLang();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const data = await getStorageStats();
    setStats(data);
    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-sage/10 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-sage/10 rounded w-1/2"></div>
      </div>
    );
  }

  const usagePercent =
    stats.totalSize > 0
      ? Math.round((stats.activeSize / stats.totalSize) * 100)
      : 0;

  const typeIcons: Record<string, any> = {
    image: Image,
    video: Video,
    icon: Sparkles,
    svg: FileIcon,
    other: FileIcon,
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center">
            <HardDrive className="text-sage" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-heading text-sm">
              {t("Storage Usage", "ストレージ使用量", "Dung lượng lưu trữ")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {stats.totalAssets} {t("assets", "アセット", "tài nguyên")}
            </p>
          </div>
        </div>
      </div>

      {/* Total Size */}
      <div>
        <div className="flex items-end justify-between mb-2">
          <span className="text-3xl font-bold text-heading">
            {formatFileSize(stats.totalSize)}
          </span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {t("Total", "合計", "Tổng")}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-sage/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-sage rounded-full transition-all duration-500"
            style={{ width: `${usagePercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-muted-foreground">
            {formatFileSize(stats.activeSize)}{" "}
            {t("active", "アクティブ", "hoạt động")}
          </span>
          <span className="text-muted-foreground">{usagePercent}%</span>
        </div>
      </div>

      {/* By Type */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("By Type", "タイプ別", "Theo loại")}
        </p>
        <div className="space-y-2">
          {Object.entries(stats.byType).map(([type, data]: [string, any]) => {
            const Icon = typeIcons[type] || FileIcon;
            const percent =
              stats.totalSize > 0
                ? Math.round((data.size / stats.totalSize) * 100)
                : 0;

            return (
              <div key={type} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    type === "image" && "bg-blue-50 text-blue-500",
                    type === "video" && "bg-purple-50 text-purple-500",
                    type === "icon" && "bg-amber-50 text-amber-500",
                    type === "svg" && "bg-emerald-50 text-emerald-500",
                    type === "other" && "bg-slate-50 text-slate-500",
                  )}
                >
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-heading capitalize">
                      {type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {data.count}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-sage/10 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          type === "image" && "bg-blue-500",
                          type === "video" && "bg-purple-500",
                          type === "icon" && "bg-amber-500",
                          type === "svg" && "bg-emerald-500",
                          type === "other" && "bg-slate-500",
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatFileSize(data.size)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
