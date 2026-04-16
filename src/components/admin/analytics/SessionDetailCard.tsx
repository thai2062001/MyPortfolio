/**
 * Session Detail Card - Mobile Modal
 * Shows detailed user journey for a session in a card modal on mobile with premium aesthetics
 */

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLang } from "@/contexts/LangContext";
import { Badge } from "@/components/ui/badge";
import {
  getSessionDetail,
  getSessionPageJourney,
  SessionSummary,
  PageInJourney,
} from "@/lib/analytics/session-queries";
import {
  formatDate,
  formatTime,
  truncateUrl,
  getTrafficSourceLabel,
  getTrafficSourceColor,
  getDeviceTypeLabel,
  getDeviceTypeColor,
} from "@/lib/analytics/format";
import { Copy, MonitorSmartphone, Clock, ExternalLink, MousePointerClick } from "lucide-react";

interface SessionDetailCardProps {
  sessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const getBadgeVariant = (
  color: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (color) {
    case "blue": return "default";
    case "green": return "secondary";
    case "purple": return "default";
    case "orange": return "outline";
    case "red": return "destructive";
    case "cyan": return "default";
    default: return "secondary";
  }
};

export const SessionDetailCard = ({
  sessionId,
  isOpen,
  onClose,
}: SessionDetailCardProps) => {
  const { t } = useLang();
  const [session, setSession] = useState<SessionSummary | null>(null);
  const [journey, setJourney] = useState<PageInJourney[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [sessionData, journeyData] = await Promise.all([
          getSessionDetail(sessionId),
          getSessionPageJourney(sessionId),
        ]);
        setSession(sessionData);
        setJourney(journeyData);
      } catch (error) {
        console.error("Error fetching session detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, sessionId]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] p-0 gap-0 outline-none rounded-3xl bg-gray-50 border-none shadow-2xl overflow-hidden mt-6 mb-6">
        <DialogTitle className="sr-only">
          {t("Session Details", "セッション詳細", "Chi tiết phiên")}
        </DialogTitle>
        <div className="flex flex-col h-full w-full bg-white/70 backdrop-blur-3xl overflow-hidden max-h-[85vh] relative">
          
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] pointer-events-none mix-blend-overlay" />

          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 bg-white/50 flex-shrink-0 z-10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              {t("Telemetry", "データ測定", "Dữ liệu đo lường")}
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 z-10 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  {t("Loading...", "読み込み中...")}
                </p>
              </div>
            ) : session ? (
              <div className="space-y-6">
                
                {/* Summary Card */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none" />
                  
                  <h3 className="text-[11px] font-bold text-indigo-600 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <MonitorSmartphone className="w-3.5 h-3.5" />
                    {t("Summary", "概要", "Tóm tắt")}
                  </h3>
                  
                  <div className="grid gap-4">
                    {/* Metadata & Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase mb-1">{t("Source", "ソース", "Nguồn")}</p>
                        <Badge variant={getBadgeVariant(getTrafficSourceColor(session.traffic_source))} className="text-[10px] uppercase font-bold py-1 px-3 shadow-none tracking-widest bg-indigo-50 text-indigo-700 border-none">
                          {getTrafficSourceLabel(session.traffic_source)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase mb-1">{t("Platform", "プラットフォーム", "Nền tảng")}</p>
                        <Badge variant={getBadgeVariant(getDeviceTypeColor(session.device_type))} className="text-[10px] uppercase font-bold py-1 px-3 shadow-none tracking-widest bg-amber-50 text-amber-700 border-none">
                          {getDeviceTypeLabel(session.device_type)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                           <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{t("Duration", "期間", "Thời lượng")}</p>
                          <p className="text-sm font-bold text-gray-900">{formatTime(session.total_time_spent)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                           <MousePointerClick className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{t("Activity", "アクティビティ", "Hoạt động")}</p>
                          <p className="text-sm font-bold text-gray-900">{session.total_pages_viewed} {t("Pages", "ページ", "Trang")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Journey Timeline */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                  <h3 className="text-[11px] font-bold text-gray-800 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {t("Journey Path", "ジャーニー", "Hành trình")} <span className="bg-gray-100 px-1.5 py-0.5 rounded-full text-[10px]">{journey.length}</span>
                  </h3>
                  
                  {journey.length > 0 ? (
                    <div className="relative pl-3 border-l-2 border-indigo-100 space-y-6">
                      {journey.map((page, i) => (
                        <div key={`${page.created_at}-${page.page_key}`} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-[18px] top-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full" />
                          
                          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                             <div className="flex justify-between items-start mb-2">
                               <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 text-[10px] font-semibold border-none">
                                  {page.page_key}
                               </Badge>
                               <span className="text-[10px] font-medium text-gray-400">{formatDate(page.created_at).split(',')[1]}</span>
                             </div>
                             
                             <a href={page.page_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 hover:text-indigo-600" title={page.page_url}>
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{truncateUrl(page.page_url, 35)}</span>
                             </a>

                             <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200/60">
                                <div>
                                  <p className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">{t("Dwell Time", "時間（秒）", "Thời gian lưu lại")}</p>
                                  <span className="text-xs font-mono font-medium text-gray-700">{formatTime(page.time_on_page_seconds)}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">{t("Scroll", "スクロール％", "Cuộn")}</p>
                                    <span className="text-[10px] font-medium text-gray-500">{page.max_scroll_percent}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1">
                                    <div
                                      className={`h-full rounded-full ${page.max_scroll_percent > 70 ? 'bg-emerald-500' : page.max_scroll_percent > 30 ? 'bg-amber-400' : 'bg-gray-400'}`}
                                      style={{ width: `${page.max_scroll_percent}%` }}
                                    />
                                  </div>
                                </div>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-xs font-medium uppercase tracking-wider">{t("No path found", "履歴なし", "Không tìm thấy đường dẫn")}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                 <p className="text-gray-400 text-sm font-medium">{t("Telemetry unavailable.", "データなし", "Dữ liệu đo lường không khả dụng.")}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
