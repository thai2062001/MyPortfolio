/**
 * Session Detail Modal - Fullscreen
 * Shows detailed user journey for a session in fullscreen with premium aesthetics
 */

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLang } from "@/contexts/LangContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Copy, ArrowLeft, Clock, MonitorSmartphone, MousePointerClick, Hourglass, CalendarDays, ExternalLink } from "lucide-react";

interface SessionDetailModalProps {
  sessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  referrerPage?: string;
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

export const SessionDetailModal = ({
  sessionId,
  isOpen,
  onClose,
  referrerPage,
}: SessionDetailModalProps) => {
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
      <DialogContent className="max-w-[95vw] xl:max-w-[1200px] max-h-[92vh] p-0 gap-0 outline-none w-full bg-transparent border-none shadow-none rounded-[32px]">
        <DialogTitle className="sr-only">
          {t("Session Details", "セッション詳細", "Chi tiết phiên")}
        </DialogTitle>
        <div className="flex flex-col h-[90vh] w-full bg-gray-50/95 backdrop-blur-3xl overflow-hidden rounded-[32px] border border-gray-200/50 shadow-2xl relative">
          
          {/* Subtle grain background */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

          {/* Header - Fixed */}
          <div className="px-6 py-4 border-b border-gray-200/50 bg-white/50 flex-shrink-0 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              {referrerPage && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-10 w-10 p-0 rounded-full hover:bg-gray-200/50 hover:text-indigo-600 transition-colors"
                  title={`${t("Back to", "戻る", "Quay lại")} ${referrerPage}`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse" />
                  {t("Session Telemetry", "セッション詳細", "Dữ liệu đo lường phiên")}
                </h2>
                {referrerPage && (
                  <span className="text-sm font-medium text-gray-500">
                    {t("Routing from:", "ルーティング元:", "Định tuyến từ:")} <span className="text-indigo-600">{referrerPage}</span>
                  </span>
                )}
              </div>
            </div>
            
            {/* Minimal Close button automatically added by DialogContent normally, but we hid default header style */}
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 z-10 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                   <p className="text-gray-500 font-medium text-sm tracking-wide uppercase">
                    {t("Loading telemetry...", "読み込み中...", "Đang tải dữ liệu đo lường...")}
                  </p>
                </div>
              </div>
            ) : session ? (
              <div className="space-y-6 max-w-6xl mx-auto">
                {/* Session Summary Glass Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                   {/* Background gradient blob for the card */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex items-center gap-2 mb-6">
                    <MonitorSmartphone className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-base font-bold text-gray-900 uppercase tracking-widest">
                      {t("Overview Metrics", "セッション概要", "Số liệu tổng quan")}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                    {/* Timestamps */}
                    <div className="md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 h-full">
                       <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          <p className="text-[10px] font-semibold uppercase tracking-wider">{t("Arrival", "到着", "Thời điểm đến")}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 border-l-2 border-indigo-500 pl-3 py-1">
                          {formatDate(session.first_seen)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                          <Clock className="w-3.5 h-3.5" />
                          <p className="text-[10px] font-semibold uppercase tracking-wider">{t("Departure", "離脱", "Thời điểm rời")}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 border-l-2 border-pink-500 pl-3 py-1">
                          {formatDate(session.last_seen)}
                        </p>
                      </div>
                    </div>

                    {/* Traffic Source & Device */}
                    <div className="md:col-span-1 lg:col-span-1 flex flex-col justify-center gap-4 bg-white/50 p-4 rounded-2xl border border-gray-100 h-full">
                       <div>
                           <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{t("Traffic Source", "トラフィックソース", "Nguồn lưu lượng")}</p>
                          <Badge variant={getBadgeVariant(getTrafficSourceColor(session.traffic_source))} className="shadow-none tracking-widest text-[10px] uppercase font-bold px-3 py-1">
                            {getTrafficSourceLabel(session.traffic_source)}
                          </Badge>
                       </div>
                       <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{t("Platform", "プラットフォーム", "Nền tảng")}</p>
                          <Badge variant={getBadgeVariant(getDeviceTypeColor(session.device_type))} className="shadow-none tracking-widest text-[10px] uppercase font-bold px-3 py-1">
                            {getDeviceTypeLabel(session.device_type)}
                          </Badge>
                       </div>
                    </div>

                    {/* Technical Specs & Stats */}
                    <div className="md:col-span-1 lg:col-span-1 flex flex-col justify-center gap-5 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/50 h-full">
                       <div className="flex items-center gap-3">
                          <MonitorSmartphone className="w-4 h-4 text-indigo-500" />
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{t("Viewport", "ビューポート", "Khung nhìn")}</p>
                            <p className="text-sm font-bold text-gray-900 truncate">{session.screen_width} <span className="text-gray-400 font-normal mx-0.5">x</span> {session.screen_height}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <MousePointerClick className="w-4 h-4 text-emerald-500" />
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{t("Activity", "アクティビティ", "Hoạt động")}</p>
                            <p className="text-sm font-bold text-gray-900">{session.total_pages_viewed} {t("Pages", "ページ", "Trang")}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <Hourglass className="w-4 h-4 text-amber-500" />
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{t("Duration", "期間", "Thời lượng")}</p>
                            <p className="text-sm font-bold text-gray-900">{formatTime(session.total_time_spent)}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Page Journey Table */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-white/50">
                    <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2 uppercase">
                      {t("Navigation Path", "ページジャーニー", "Hành trình điều hướng")} <span className="text-gray-400 font-normal">({journey.length})</span>
                    </h3>
                  </div>

                  {journey.length > 0 ? (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden lg:block overflow-x-auto">
                        <Table className="w-full">
                          <TableHeader className="bg-gray-50/50">
                            <TableRow className="border-b-gray-100">
                              <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-gray-500 w-12 text-center py-4">#</TableHead>
                              <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-gray-500 py-4">{t("Time", "時間", "Thời gian")}</TableHead>
                              <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-gray-500 py-4">{t("Page Context", "ページ", "Bối cảnh trang")}</TableHead>
                              <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-gray-500 py-4">{t("Path", "パス", "Đường dẫn")}</TableHead>
                              <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-gray-500 py-4">{t("Referrer", "リファラー", "Người giới thiệu")}</TableHead>
                              <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-gray-500 text-right py-4">{t("Dwell Time", "時間（秒）", "Thời gian lưu lại")}</TableHead>
                              <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-gray-500 text-right py-4">{t("Scroll", "スクロール％", "Cuộn")}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {journey.map((page) => (
                              <TableRow
                                key={`${page.created_at}-${page.page_key}`}
                                className="group border-b-gray-50 hover:bg-indigo-50/30 transition-colors"
                              >
                                <TableCell className="font-bold text-indigo-600/50 group-hover:text-indigo-600 text-center py-4">
                                  {page.order}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-sm text-gray-600 py-4">
                                  {formatDate(page.created_at)}
                                </TableCell>
                                <TableCell className="py-4">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800">
                                    {page.page_key}
                                  </span>
                                </TableCell>
                                <TableCell className="py-4 max-w-[200px]">
                                  <a href={page.page_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 truncate transition-colors" title={page.page_url}>
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{truncateUrl(page.page_url, 40)}</span>
                                  </a>
                                </TableCell>
                                <TableCell className="py-4 max-w-[150px]">
                                  <div className="text-xs text-gray-400 truncate" title={page.referrer}>
                                    {page.referrer ? truncateUrl(page.referrer, 30) : <span className="italic">{t("Direct", "直接", "Trực tiếp")}</span>}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right py-4">
                                  <span className="inline-block bg-indigo-50 text-indigo-700 font-mono font-medium px-2 py-0.5 rounded-md text-xs">
                                    {formatTime(page.time_on_page_seconds)}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right py-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all duration-1000 ${page.max_scroll_percent > 75 ? 'bg-emerald-500' : page.max_scroll_percent > 30 ? 'bg-amber-400' : 'bg-gray-300'}`}
                                        style={{ width: `${page.max_scroll_percent}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 w-8">{page.max_scroll_percent}%</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Mobile & Tablet Card View */}
                      <div className="lg:hidden divide-y divide-gray-100">
                        {journey.map((page) => (
                          <div
                            key={`${page.created_at}-${page.page_key}`}
                            className="p-5 hover:bg-gray-50/50 transition-colors space-y-4"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold ring-1 ring-indigo-100 shadow-sm">
                                  {page.order}
                                </span>
                                <div className="space-y-0.5">
                                  <h4 className="font-bold text-gray-900 text-sm tracking-tight">{page.page_key}</h4>
                                  <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(page.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1.5">
                                <span className="bg-indigo-50 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider">
                                  {formatTime(page.time_on_page_seconds)}
                                </span>
                                <div className="flex items-center gap-1.5">
                                   <div className="w-12 bg-gray-100 rounded-full h-1 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${page.max_scroll_percent > 75 ? 'bg-emerald-500' : page.max_scroll_percent > 30 ? 'bg-amber-400' : 'bg-gray-300'}`}
                                      style={{ width: `${page.max_scroll_percent}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] font-bold text-gray-500">{page.max_scroll_percent}%</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100/50">
                                <div className="space-y-1">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{t("Path", "パス", "Đường dẫn")}</p>
                                  <a
                                    href={page.page_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium break-all hover:underline"
                                  >
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                    {truncateUrl(page.page_url, 50)}
                                  </a>
                                </div>

                                <div className="space-y-1 pt-1 border-t border-gray-200/50">
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{t("Referrer", "リファラー", "Người giới thiệu")}</p>
                                  <p className="text-xs text-gray-600 font-medium truncate">
                                    {page.referrer ? truncateUrl(page.referrer, 40) : <span className="italic text-gray-400">{t("Direct Visit", "直接アクセス", "Truy cập trực tiếp")}</span>}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                      <p className="text-sm font-medium">{t("No navigation history found", "履歴がありません", "Không tìm thấy lịch sử điều hướng")}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                 <p className="text-gray-400 font-medium">{t("Session telemetry unavailable.", "セッション・テレメトリは利用不可です。", "Dữ liệu đo lường phiên không khả dụng.")}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
