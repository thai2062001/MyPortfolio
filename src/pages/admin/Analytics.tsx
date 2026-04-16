"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLang } from "@/contexts/LangContext";
import { AnalyticsSummaryCards } from "@/components/admin/analytics/AnalyticsSummaryCards";
import { AnalyticsViewsChart } from "@/components/admin/analytics/AnalyticsViewsChart";
import { AnalyticsTopPages } from "@/components/admin/analytics/AnalyticsTopPages";
import { AnalyticsSourceChart } from "@/components/admin/analytics/AnalyticsSourceChart";
import { AnalyticsDeviceChart } from "@/components/admin/analytics/AnalyticsDeviceChart";
import { AnalyticsRecentVisitsTable } from "@/components/admin/analytics/AnalyticsRecentVisitsTable";
import { AnalyticsSessionsTable } from "@/components/admin/analytics/AnalyticsSessionsTable";
import { SessionDetailModal } from "@/components/admin/analytics/SessionDetailModal";
import { SessionDetailCard } from "@/components/admin/analytics/SessionDetailCard";
import {
  getAnalyticsSummary,
  getViewsByDay,
  getTopPages,
  getTrafficSourceBreakdown,
  getDeviceBreakdown,
  getRecentVisits,
  AnalyticsSummary,
  ViewsByDay,
  TopPage,
  TrafficSourceBreakdown,
  DeviceBreakdown,
  RecentVisit,
} from "@/lib/analytics/queries";
import {
  getSessionsSummary,
  SessionSummary,
} from "@/lib/analytics/session-queries";
import { getDateRange, DateRangeType } from "@/lib/analytics/date-range";
import { 
  BarChart3, Activity, Users, Clock, MousePointer2, 
  Globe2, Sparkles, SlidersHorizontal, Layout, Calendar
} from "lucide-react";

const Analytics = () => {
  const { lang, translations, t } = useLang();
  const [dateRange, setDateRange] = useState<DateRangeType>("today");
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== "undefined" ? window.innerWidth >= 768 : true);

  const [activeTab, setActiveTab] = useState<string>(() => {
    return sessionStorage.getItem("analyticsTab") || "overview";
  });

  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalViews: 0,
    todayViews: 0,
    uniqueVisitors: 0,
    avgTimeOnPage: 0,
    avgScrollDepth: 0,
  });

  const [viewsByDay, setViewsByDay] = useState<ViewsByDay[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSourceBreakdown[]>([]);
  const [devices, setDevices] = useState<DeviceBreakdown[]>([]);
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [startDate, endDate] = getDateRange(dateRange);

      const [
        summaryData,
        viewsData,
        pagesData,
        sourcesData,
        devicesData,
        visitsData,
        sessionsData,
      ] = await Promise.all([
        getAnalyticsSummary(startDate, endDate),
        getViewsByDay(startDate, endDate),
        getTopPages(startDate, endDate),
        getTrafficSourceBreakdown(startDate, endDate),
        getDeviceBreakdown(startDate, endDate),
        getRecentVisits(startDate, endDate),
        getSessionsSummary(startDate, endDate),
      ]);

      setSummary(summaryData);
      setViewsByDay(viewsData);
      setTopPages(pagesData);
      setTrafficSources(sourcesData);
      setDevices(devicesData);
      setRecentVisits(visitsData);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSessionDetail = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsDetailDrawerOpen(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    sessionStorage.setItem("analyticsTab", tab);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000 pb-12">
        {/* IMMERSIVE HEADER */}
        <div className="relative overflow-hidden rounded-3xl md:rounded-[3.5rem] bg-white/60 backdrop-blur-xl border border-white/40 p-8 md:p-16 shadow-sm group">
           <div className="absolute inset-0 bg-gradient-to-br from-sage/10 via-transparent to-transparent pointer-events-none" />
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-sage/5 rounded-full blur-[100px] pointer-events-none" />
           
           <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-10">
              <div className="space-y-4 md:space-y-6">
                 <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex h-2.5 w-2.5 relative">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage"></span>
                    </div>
                    <p className="text-[10px] md:text-xs font-bold text-sage uppercase tracking-[0.2em] md:tracking-[0.3em]">
                       {t("Live Telemetry Protocol", "ライブ・テレメトリ・プロトコル", "Giao thức đo lường trực tiếp")}
                    </p>
                 </div>
                 <div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-heading tracking-tight leading-tight md:leading-none">
                       {t("Analytics", "アナリティクス", "Phân tích")}
                    </h1>
                    <p className="text-sm md:text-lg text-muted-foreground mt-4 md:mt-6 font-serif italic max-w-xl leading-relaxed">
                       {t(
                         "Synthesizing digital footprints and user journey matrices across all global nodes.",
                         "グローバルなすべてのノードにわたるデジタル・フットプリントとユーザー・ジャーニー・マトリックスを合成します。",
                         "Tổng hợp dấu chân kỹ thuật số và ma trận hành trình người dùng trên tất cả các điểm quy chiếu toàn cầu."
                       )}
                    </p>
                 </div>
              </div>

              {/* DATE RANGE FILTER */}
              <div className="flex bg-white/40 p-1.5 rounded-[1.5rem] md:rounded-[2rem] border border-white/60 shadow-sm backdrop-blur-md self-stretch lg:self-center overflow-x-auto hide-scrollbar scrollbar-none">
                {(["today", "last7days", "last30days", "alltime"] as DateRangeType[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`text-[10px] md:text-[11px] font-bold uppercase tracking-widest whitespace-nowrap px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] transition-all duration-500 flex items-center gap-2 md:gap-3 ${
                      dateRange === range
                        ? "bg-sage text-white shadow-xl shadow-sage/30 scale-105"
                        : "text-muted-foreground hover:text-sage hover:bg-sage/5"
                    }`}
                  >
                    <Calendar size={12} className={dateRange === range ? 'animate-pulse' : ''} />
                    {t(
                      range === "today" ? "Today" : range === "last7days" ? "7D" : range === "last30days" ? "30D" : "All",
                      range === "today" ? "今日" : range === "last7days" ? "7日" : range === "last30days" ? "30日" : "全体",
                      range === "today" ? "Hôm nay" : range === "last7days" ? "7 ngày" : range === "last30days" ? "30 ngày" : "Tất cả"
                    ).toUpperCase()}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
             <div className="w-16 h-16 border-4 border-sage/10 border-t-sage rounded-full animate-spin"></div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage animate-pulse">
                {t("Decompressing Telemetry...", "テレメトリを解凍中...", "Đang giải nén dữ liệu đo lường...")}
              </p>
          </div>
        ) : (
          <div className="space-y-12">
             {/* SUMMARY CARDS */}
             <AnalyticsSummaryCards 
                summary={summary} 
                todayViews={summary.todayViews} 
                isDesktop={isDesktop} 
             />

             {/* TABS */}
             <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-14 md:h-16 lg:h-20 bg-white/40 p-1.5 rounded-2xl md:rounded-[2rem] border border-white/60 shadow-sm backdrop-blur-md mb-8 md:mb-10 lg:mb-12">
                   <TabsTrigger value="overview" className="rounded-xl md:rounded-[1.2rem] lg:rounded-[1.5rem] text-[10px] md:text-[11px] font-bold uppercase tracking-widest data-[state=active]:bg-sage data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-sage/20 transition-all duration-500">
                      {t("Layout", "レイアウト", "Bố cục")}
                   </TabsTrigger>
                   <TabsTrigger value="sessions" className="rounded-xl md:rounded-[1.2rem] lg:rounded-[1.5rem] text-[10px] md:text-[11px] font-bold uppercase tracking-widest data-[state=active]:bg-sage data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-sage/20 transition-all duration-500">
                      {t("Nodes", "ノード", "Nút dữ liệu")}
                   </TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="lg:col-span-2">
                        <AnalyticsViewsChart data={viewsByDay} />
                      </div>
                      <AnalyticsTopPages data={topPages} />
                      <AnalyticsSourceChart data={trafficSources} />
                      <AnalyticsDeviceChart data={devices} />
                   </div>
                   <AnalyticsRecentVisitsTable data={recentVisits} />
                </TabsContent>

                {/* SESSIONS TAB */}
                <TabsContent value="sessions" className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                   <AnalyticsSessionsTable data={sessions} onViewDetail={handleViewSessionDetail} />
                </TabsContent>
             </Tabs>
          </div>
        )}

        {/* SESSION DETAIL */}
        {isDesktop ? (
          <SessionDetailModal
            sessionId={selectedSessionId}
            isOpen={isDetailDrawerOpen}
            onClose={() => setIsDetailDrawerOpen(false)}
            referrerPage={t("Analytics", "アナリティクス", "Phân tích")}
          />
        ) : (
          <SessionDetailCard
            sessionId={selectedSessionId}
            isOpen={isDetailDrawerOpen}
            onClose={() => setIsDetailDrawerOpen(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Analytics;
