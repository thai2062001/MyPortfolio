import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowUpRight, Plus } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import {
  AnalyticsSummary,
  ViewsByDay,
  getAnalyticsSummary,
  getViewsByDay,
} from "@/lib/analytics/queries";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { AnalyticsChart } from "@/components/admin/dashboard/AnalyticsChart";
import { SectionNavigator } from "@/components/admin/dashboard/SectionNavigator";

interface Stats {
  totalProjects: number;
  totalCategories: number;
  totalClients: number;
  totalTestimonials: number;
  totalSkills: number;
  publishedProjects: number;
  draftProjects: number;
  dailyViews: number;
  dailyMessages: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalCategories: 0,
    totalClients: 0,
    totalTestimonials: 0,
    totalSkills: 0,
    publishedProjects: 0,
    draftProjects: 0,
    dailyViews: 0,
    dailyMessages: 0,
  });
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary>({
    totalViews: 0,
    todayViews: 0,
    uniqueVisitors: 0,
    avgTimeOnPage: 0,
    avgScrollDepth: 0,
  });
  const [viewsByDay, setViewsByDay] = useState<ViewsByDay[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const canvasEnd = new Date();
        canvasEnd.setHours(23, 59, 59, 999);
        const canvasStart = new Date(canvasEnd);
        canvasStart.setDate(canvasStart.getDate() - 6);
        canvasStart.setHours(0, 0, 0, 0);

        const [
          projectsRes,
          categoriesRes,
          clientsRes,
          testimonialsRes,
          skillsRes,
          todayMessagesRes,
          summary,
          views
        ] = await Promise.all([
          supabase.from("projects").select("id, is_published"),
          supabase.from("project_categories").select("id"),
          supabase.from("clients").select("id"),
          supabase.from("testimonials").select("id"),
          supabase.from("skills").select("id"),
          supabase.from("contact_messages").select("id").gte("created_at", startOfToday.toISOString()),
          getAnalyticsSummary(canvasStart, canvasEnd),
          getViewsByDay(canvasStart, canvasEnd),
        ]);

        const projects = projectsRes.data || [];
        const published = projects.filter((p) => p.is_published).length;

        setStats({
          totalProjects: projects.length,
          totalCategories: categoriesRes.data?.length || 0,
          totalClients: clientsRes.data?.length || 0,
          totalTestimonials: testimonialsRes.data?.length || 0,
          totalSkills: skillsRes.data?.length || 0,
          publishedProjects: published,
          draftProjects: projects.length - published,
          dailyViews: summary.todayViews,
          dailyMessages: todayMessagesRes.data?.length || 0,
        });

        setAnalyticsSummary(summary);
        setViewsByDay(views);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-10 md:space-y-12 animate-in fade-in zoom-in-95 duration-700 ease-out">
        
        {/* Immersive Header */}
        <div className="relative overflow-hidden rounded-[3rem] bg-heading border border-white/5 p-10 md:p-16 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-sage/20 via-transparent to-vibe-pink/10 opacity-40 pointer-events-none" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sage"></span>
                </span>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">
                  {t("Control Center • Live System v2.0", "コントロールセンター • ライブシステム v2.0", "Trung tâm điều khiển • Hệ thống trực tiếp v2.0")}
                </p>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tighter leading-[0.85]">
                {t("Architecture", "アーキテクチャ", "Kiến trúc")} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage via-emerald-400 to-white italic font-artistic lowercase py-2">
                  {t("of presence.", "の存在。", "của sự hiện diện.")}
                </span>
              </h1>
              <p className="text-xl text-white/60 mt-8 leading-relaxed font-medium">
                {t(
                  "Welcome back. Your global portfolio is performing with elegance. Check your pulse metrics below.",
                  "お帰りなさい。あなたのグローバルポートフォリオは優雅に動作しています。以下のメトリクスを確認してください。",
                  "Chào mừng quay trở lại. Danh mục đầu tư toàn cầu của bạn đang vận hành xuất sắc. Kiểm tra các chỉ số bên dưới."
                )}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-5 min-w-[280px]">
              <Button
                onClick={() => navigate("/admin/projects")}
                className="group bg-white hover:bg-sage text-heading hover:text-white shadow-2xl transition-all duration-500 rounded-2xl py-10 px-8 flex items-center justify-between overflow-hidden relative"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-2 bg-heading/5 group-hover:bg-white/20 rounded-xl transition-colors">
                    <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-[11px]">
                    {t("New Manifest", "新規マニフェスト", "Khai báo mới")}
                  </span>
                </div>
                <ArrowUpRight size={20} className="opacity-20 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate("/admin/contact-messages")}
                className="group rounded-2xl py-10 px-8 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-500 flex items-center justify-between text-white"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/5 rounded-xl">
                    <MessageSquare size={22} className="text-sage group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-[11px]">
                    {t("Inbox Streams", "受信ストリーム", "Luồng thư đến")}
                  </span>
                </div>
                <div className="h-6 w-6 rounded-lg bg-sage text-heading text-[10px] font-black flex items-center justify-center shadow-lg">
                  {stats.dailyMessages}
                </div>
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-16 h-1 w-32 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-full h-full bg-sage animate-loading-bar" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <DashboardStats stats={stats} />
              <AnalyticsChart viewsByDay={viewsByDay} analyticsSummary={analyticsSummary} />
            </div>

            <div className="lg:col-span-4">
              <SectionNavigator stats={stats} navigate={navigate} />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
