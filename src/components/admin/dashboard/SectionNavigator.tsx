import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Layers, Users, MessageSquare, FileText, CheckCircle } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  badge?: string;
}

export const SectionCard = ({
  icon,
  title,
  subtitle,
  onClick,
  badge,
}: SectionCardProps) => (
  <div 
    onClick={onClick}
    className="cursor-pointer group flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white rounded-3xl p-6 md:p-8 border border-black/[0.03] hover:border-sage/30 hover:shadow-2xl hover:shadow-sage/5 transition-all duration-500 relative overflow-hidden"
  >
    <div className="absolute top-4 right-4">
      {badge && (
        <span className="text-[9px] font-black tracking-[0.1em] text-sage bg-sage/10 px-2.5 py-1 rounded-lg uppercase">
          {badge}
        </span>
      )}
    </div>
    <div className="w-16 h-16 bg-white shadow-sm flex items-center justify-center rounded-[1.25rem] text-3xl mb-5 group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-500 border border-black/[0.02]">
      {icon}
    </div>
    <p className="font-bold text-slate-800 tracking-tight">{title}</p>
    <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.1em] opacity-60">{subtitle}</p>
  </div>
);

export const SectionNavigator = ({ stats, navigate }: { stats: any; navigate: (p: string) => void }) => {
  const { t } = useLang();
  
  return (
    <div className="space-y-8">
      {/* Data Inventory */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-black/[0.03] shadow-lg shadow-black/[0.01]">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-sage/10 rounded-xl text-sage">
            <Layers size={18} />
          </div>
          <h2 className="text-xl font-serif text-slate-900 tracking-tight text-heading">
            {t("Registry", "レジストリ", "Sổ đăng ký")}
          </h2>
        </div>
        
        <div className="space-y-2">
          {[
            { label: t("Categories", "カテゴリー", "Danh mục"), value: stats.totalCategories, icon: Layers },
            { label: t("Partner Clients", "パートナー", "Đối tác"), value: stats.totalClients, icon: Users },
            { label: t("Endorsements", "推薦", "Lời chứng thực"), value: stats.totalTestimonials, icon: MessageSquare },
            { label: t("Working Drafts", "下書き", "Bản nháp"), value: stats.draftProjects, icon: FileText }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-white group-hover:text-sage transition-all shadow-sm">
                  <item.icon size={14} />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{item.label}</span>
              </div>
              <span className="font-black text-slate-900 bg-white border border-black/[0.03] shadow-sm px-4 py-1.5 rounded-xl text-xs">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Assets */}
      <div className="bg-heading rounded-[2.5rem] p-8 text-white shadow-2xl shadow-heading/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mt-20 -mr-20 group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
          <div>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
              {t("Core Competency", "コアコンピテンシー", "Năng lực cốt lõi")}
            </p>
            <h3 className="text-2xl font-serif tracking-tight text-white leading-tight">
              {t("Ecosystem Health", "エコシステムの状態", "Sức khỏe hệ sinh thái")}
            </h3>
          </div>
          
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle size={18} className="text-emerald-400" />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                {t("Verified Skills", "検証済みスキル", "Kỹ năng đã xác minh")}
               </span>
            </div>
            <span className="text-4xl font-serif tracking-tighter">{stats.totalSkills}</span>
          </div>
        </div>
      </div>

      {/* Architect Quick Access */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-black/[0.03] shadow-lg shadow-black/[0.01]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-serif text-slate-900 tracking-tight text-heading">
            {t("Architect", "アーキテクト", "Kiến trúc")}
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/admin/sections")}
            className="text-sage font-black text-[10px] uppercase tracking-widest hover:bg-sage/10 rounded-xl px-4"
          >
            {t("Manage All", "すべて管理", "Quản lý tất cả")}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SectionCard
            icon="👤"
            title={t("Identity", "アイデンティティ", "Danh tính")}
            subtitle={t("About", "紹介", "Giới thiệu")}
            onClick={() => navigate("/admin/sections")}
          />
          <SectionCard
            icon="🔧"
            title={t("Service", "サービス", "Dịch vụ")}
            subtitle={t("Expertise", "専門知識", "Chuyên môn")}
            badge="Live"
            onClick={() => navigate("/admin/sections")}
          />
        </div>
      </div>
    </div>
  );
};
