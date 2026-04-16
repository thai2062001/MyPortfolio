/**
 * Analytics Summary Cards
 * Displays key metrics at the top of the analytics dashboard
 */

import { Card } from "@/components/ui/card";
import { Eye, Users, Clock, TrendingUp, Calendar } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { AnalyticsSummary } from "@/lib/analytics/queries";
import { formatTime } from "@/lib/analytics/format";

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummary;
  todayViews: number;
  isDesktop?: boolean;
}

export const AnalyticsSummaryCards = ({
  summary,
  todayViews,
  isDesktop = true,
}: AnalyticsSummaryCardsProps) => {
  const { t } = useLang();

  const cards = [
    {
      title: t("Total Views", "総ビュー数", "Tổng lượt xem"),
      value: summary.totalViews.toLocaleString(),
      icon: Eye,
      baseColor: "sage",
      colorClass: "text-sage bg-sage/10",
      gradient: "from-sage/5",
    },
    {
      title: t("Today Views", "本日のビュー数", "Lượt xem hôm nay"),
      value: todayViews.toLocaleString(),
      icon: Calendar,
      baseColor: "emerald",
      colorClass: "text-emerald-600 bg-emerald-50",
      gradient: "from-emerald-600/5",
    },
    {
      title: t("Unique Visitors", "ユニークビジター", "Người dùng duy nhất"),
      value: summary.uniqueVisitors.toLocaleString(),
      icon: Users,
      baseColor: "blue",
      colorClass: "text-blue-600 bg-blue-50",
      gradient: "from-blue-600/5",
    },
    {
      title: t("Avg Time", "平均滞在時間", "Thời gian TB"),
      value: formatTime(summary.avgTimeOnPage),
      icon: Clock,
      baseColor: "purple",
      colorClass: "text-purple-600 bg-purple-50",
      gradient: "from-purple-600/5",
    },
    {
      title: t("Avg Scroll", "平均スクロール深度", "Cuộn trung bình"),
      value: `${summary.avgScrollDepth}%`,
      icon: TrendingUp,
      baseColor: "orange",
      colorClass: "text-orange-600 bg-orange-50",
      gradient: "from-orange-600/5",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8 group/parent">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title} 
            className="group relative bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden outline-none"
          >
            {/* Subtle hover gradient blob */}
            <div className={`absolute -inset-4 bg-gradient-to-r ${card.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none`} />
            
            <div className="relative flex flex-col justify-between h-full text-left">
              <div className="flex items-start justify-between">
                <p className="text-gray-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider line-clamp-1">
                  {card.title}
                </p>
                <div className={`p-2 rounded-lg md:p-2.5 md:rounded-xl transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ${card.colorClass}`}>
                  <Icon size={isDesktop ? 18 : 16} />
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
