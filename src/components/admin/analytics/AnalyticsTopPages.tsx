/**
 * Analytics Top Pages
 * Bar chart showing most visited pages with premium aesthetic
 */

import { useLang } from "@/contexts/LangContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TopPage } from "@/lib/analytics/queries";

interface AnalyticsTopPagesProps {
  data: TopPage[];
}

const COLORS = ["#4338ca", "#4f46e5", "#6366f1", "#818cf8", "#a5b4fc"];

export const AnalyticsTopPages = ({ data }: AnalyticsTopPagesProps) => {
  const { t } = useLang();

  // Clean up page keys for better display
  const formatPageKey = (key: string) => {
    if (key === "/") return "Home";
    if (key.startsWith("/project/")) return key.replace("/project/", "Project: ");
    return key.replace("/", " ").trim();
  };

  const chartData = data.map(d => ({
    ...d,
    displayKey: formatPageKey(d.page_key)
  }));

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col h-full">
      <div className="mb-6 z-10 relative text-left">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
          {t("Top Pages", "トップページ", "Trang xem nhiều")}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {t("Most popular destinations", "最も人気のあるページ", "Các điểm đến phổ biến nhất")}
        </p>
      </div>

      <div className="flex-1 min-h-[250px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis 
                type="number" 
                stroke="#6b7280" 
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="displayKey" 
                type="category" 
                stroke="#6b7280" 
                tick={{ fontSize: 12, fill: "#4b5563", fontWeight: 500 }}
                width={120}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  padding: '10px 14px',
                  fontWeight: 500,
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="views" radius={[0, 8, 8, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:brightness-110 transition-all duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            {t("No data available", "データなし", "Chưa có dữ liệu")}
          </div>
        )}
      </div>
    </div>
  );
};
