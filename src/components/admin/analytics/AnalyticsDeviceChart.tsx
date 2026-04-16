/**
 * Analytics Device Chart
 * Elegant Bar chart showing device type breakdown
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
import { DeviceBreakdown } from "@/lib/analytics/queries";

interface AnalyticsDeviceChartProps {
  data: DeviceBreakdown[];
}

const COLORS = ["#10b981", "#6366f1", "#f59e0b"]; // Emerald, Indigo, Amber

export const AnalyticsDeviceChart = ({ data }: AnalyticsDeviceChartProps) => {
  const { t } = useLang();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col h-full">
      <div className="mb-6 z-10 relative text-left">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
          {t("Device Breakdown", "デバイス別内訳", "Phân tích thiết bị")}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {t("Platforms your visitors are using", "ユーザーが使用しているプラットフォーム", "Các nền tảng khách truy cập đang sử dụng")}
        </p>
      </div>
      
      <div className="flex-1 min-h-[250px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="device_type"
                stroke="#6b7280"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#6b7280" 
                tick={{ fontSize: 12, fill: "#9ca3af" }} 
                axisLine={false}
                tickLine={false}
                dx={-10}
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
              <Bar dataKey="views" radius={[8, 8, 8, 8]} barSize={40}>
                {data.map((entry, index) => (
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
