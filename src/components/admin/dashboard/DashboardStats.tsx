import { type ComponentType } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

interface StatCardProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: string;
  colorClass?: string;
}

export const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  colorClass = "text-sage bg-sage/10",
}: StatCardProps) => (
  <div className="group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-sage/5 transition-all duration-500 overflow-hidden">
    <div className="absolute -inset-4 bg-gradient-to-r from-sage/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none" />

    <div className="relative flex items-start justify-between">
      <div className="space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {title}
        </p>
        <div className="flex items-end gap-3">
          <p className="text-4xl font-serif text-slate-900 tracking-tight">{value}</p>
          {trend && (
            <span className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg mb-1 uppercase tracking-wider">
              <ArrowUpRight size={10} className="mr-1" />
              {trend}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs font-bold text-slate-500 opacity-60 uppercase tracking-widest">{subtitle}</p>}
      </div>
      <div className={`p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm ${colorClass}`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

export const DashboardStats = ({ stats }: { stats: any }) => {
  const { t } = useLang();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        icon={Briefcase}
        title={t("Total Projects", "プロジェクト合計", "Tổng số dự án")}
        value={stats.totalProjects}
        subtitle={t("Portfolio Assets", "ポートフォリオ資産", "Tài sản Portfolio")}
        colorClass="text-blue-600 bg-blue-50"
      />
      <StatCard
        icon={Eye}
        title={t("Active Pulse", "公開中", "Hiển thị")}
        value={stats.publishedProjects}
        subtitle={stats.totalProjects > 0 ? `${Math.round((stats.publishedProjects / stats.totalProjects) * 100)}% ${t("Visibility", "公開率", "Hiển thị")}` : `0% ${t("Visibility", "公開率", "Hiển thị")}`}
        colorClass="text-emerald-600 bg-emerald-50"
      />
      <StatCard
        icon={Activity}
        title={t("Daily Traffic", "本日のアクセス", "Lượt truy cập")}
        value={stats.dailyViews}
        subtitle={t("Live Updates", "ライブ更新", "Cập nhật trực tiếp")}
        trend={t("Active", "アクティブ", "Hoạt động")}
        colorClass="text-indigo-600 bg-indigo-50"
      />
      <StatCard
        icon={MessageSquare}
        title={t("Engagement", "エンゲージメント", "Tương tác")}
        value={stats.dailyMessages}
        subtitle={t("New Requests", "新規リクエスト", "Yêu cầu mới")}
        colorClass="text-rose-600 bg-rose-50"
      />
    </div>
  );
};

// Internal Lucide helpers for Dashboard
const Briefcase = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const Eye = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const Activity = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);
const MessageSquare = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
