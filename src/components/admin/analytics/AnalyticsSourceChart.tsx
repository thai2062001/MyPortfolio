/**
 * Analytics Traffic Source Chart
 * Elegant Donut chart showing traffic sources
 */

import { useLang } from "@/contexts/LangContext";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrafficSourceBreakdown } from "@/lib/analytics/queries";

interface AnalyticsSourceChartProps {
  data: TrafficSourceBreakdown[];
}

const COLORS = [
  "#4b7c59", // Sage
  "#10b981", // Emerald
  "#6366f1", // Indigo
  "#f59e0b", // Amber
  "#ec4899", // Pink
];

export const AnalyticsSourceChart = ({ data }: AnalyticsSourceChartProps) => {
  const { t } = useLang();

  // Create customized label rendering
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
  
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col h-full">
      <div className="mb-6 z-10 relative text-left">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
          {t("Traffic Source", "トラフィックソース", "Nguồn lưu lượng")}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {t("Origins of your visitors", "ビジターの流入元", "Nguồn gốc của khách truy cập")}
        </p>
      </div>

      <div className="flex-1 min-h-[250px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                stroke="white"
                strokeWidth={3}
                labelLine={false}
                label={renderCustomizedLabel}
                fill="#8884d8"
                dataKey="views"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-300 outline-none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  padding: '10px 14px',
                  fontWeight: 500,
                  fontSize: "13px",
                }}
                itemStyle={{ color: '#111827' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", fontWeight: 500, color: '#6b7280' }} 
              />
            </PieChart>
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
