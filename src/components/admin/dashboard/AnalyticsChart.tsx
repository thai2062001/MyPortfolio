import { useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface AnalyticsChartProps {
  viewsByDay: any[];
  analyticsSummary: any;
}

export const AnalyticsChart = ({ viewsByDay, analyticsSummary }: AnalyticsChartProps) => {
  const chartData = useMemo(() => {
    if (viewsByDay.length === 0) {
      const generated: Array<{ name: string; value: number }> = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        generated.push({
          name: date.toLocaleDateString("en-US", { weekday: "short" }),
          value: 0,
        });
      }
      return generated;
    }
    return viewsByDay.map((item) => ({
      name: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
      value: item.views,
    }));
  }, [viewsByDay]);

  const weeklyViews = useMemo(
    () => viewsByDay.reduce((sum, row) => sum + row.views, 0),
    [viewsByDay],
  );

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-black/[0.03] shadow-2xl shadow-black/[0.01] relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 tracking-tight">
            Engagement Velocity
          </h2>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">
            Digital Interaction Architecture
          </p>
        </div>
        <div className="bg-slate-50 border border-black/[0.03] text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
          Window: 7 Days
        </div>
      </div>
      
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4b7c59" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#4b7c59" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="rgba(0,0,0,0.03)" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} 
              axisLine={false} 
              tickLine={false} 
              dy={15}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} 
              axisLine={false} 
              tickLine={false} 
              dx={-10}
            />
            <Tooltip 
              cursor={{ stroke: 'rgba(75, 124, 89, 0.2)', strokeWidth: 2 }}
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.95)', 
                borderRadius: '1.25rem',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                padding: '16px 20px',
                backdropFilter: 'blur(10px)'
              }} 
              itemStyle={{ color: '#4b7c59', fontWeight: 800, fontSize: '12px' }}
              labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#4b7c59" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-10 border-t border-black/[0.03] text-center">
        {[
          { label: "Total Pulse", value: weeklyViews.toLocaleString() },
          {
            label: "Unique Souls",
            value: analyticsSummary.uniqueVisitors.toLocaleString(),
          },
          {
            label: "Session Time",
            value: `${analyticsSummary.avgTimeOnPage}s`,
          },
          {
            label: "Flow Depth",
            value: `${analyticsSummary.avgScrollDepth}%`,
          },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 opacity-60">
              {item.label}
            </p>
            <p className="text-2xl font-serif text-slate-800 tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
