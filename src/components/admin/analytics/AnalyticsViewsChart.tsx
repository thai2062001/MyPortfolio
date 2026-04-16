/**
 * Analytics Views Chart
 * Area chart showing views over time with premium gradient styles
 */

import { useLang } from "@/contexts/LangContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ViewsByDay } from "@/lib/analytics/queries";

interface AnalyticsViewsChartProps {
  data: ViewsByDay[];
}

export const AnalyticsViewsChart = ({ data }: AnalyticsViewsChartProps) => {
  const { t } = useLang();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const chartData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            {t("Views Over Time", "時系列ビュー", "Lượt xem theo thời gian")}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t(
              "Tracking traffic volumes dynamically over selected time range",
              "選択した期間内のトラフィック量を動的に追跡します",
              "Theo dõi lưu lượng truy cập động trong khoảng thời gian đã chọn"
            )}
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: "#9ca3af" }} 
            axisLine={false} 
            tickLine={false} 
            dy={10} 
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "#9ca3af" }} 
            axisLine={false} 
            tickLine={false} 
            dx={-10} 
          />
          <Tooltip
            cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "none",
              borderRadius: "12px",
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              padding: '12px 16px',
              fontWeight: 500,
              fontSize: "13px",
            }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#4f46e5" /* Indigo-600 */
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorViews)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
