/**
 * Analytics Recent Visits Table
 * Displays recent visit events with premium styling
 */

import { useLang } from "@/contexts/LangContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecentVisit } from "@/lib/analytics/queries";

interface AnalyticsRecentVisitsTableProps {
  data: RecentVisit[];
}

export const AnalyticsRecentVisitsTable = ({
  data,
}: AnalyticsRecentVisitsTableProps) => {
  const { t, lang } = useLang();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(lang === 'ja' ? 'ja-JP' : lang === 'vi' ? 'vi-VN' : 'en-US', {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSourceTranslation = (source: string) => {
    const s = source.toLowerCase();
    if (s === 'direct') return t("Direct", "直接", "Trực tiếp");
    if (s === 'google') return "Google";
    if (s === 'facebook') return "Facebook";
    if (s === 'instagram') return "Instagram";
    if (s === 'linkedin') return "LinkedIn";
    if (s === 'referral') return t("Referral", "リファラル", "Giới thiệu");
    return source;
  };

  const getDeviceTranslation = (device: string) => {
    const d = device.toLowerCase();
    if (d === 'mobile') return t("Mobile", "モバイル", "Di động");
    if (d === 'tablet') return t("Tablet", "タブレット", "Máy tính bảng");
    if (d === 'desktop') return t("Desktop", "デスクトップ", "Máy tính");
    return device;
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            {t("Recent Visits", "最近のアクセス", "Lượt truy cập gần đây")}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {t("Live feed of visitor events", "ビジターイベントのライブフィード", "Dữ liệu trực tiếp về các sự kiện khách truy cập")}
          </p>
        </div>
      </div>
      
      {data.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-gray-100/50 bg-white">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow className="border-b-gray-100">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4">
                  {t("Timestamp", "タイムスタンプ", "Thời gian")}
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4">
                  {t("Page", "ページ", "Trang")}
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 hidden sm:table-cell">
                  {t("Source", "ソース", "Nguồn")}
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 hidden md:table-cell">
                  {t("Device", "デバイス", "Thiết bị")}
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 hidden lg:table-cell">
                  {t("Screen", "画面", "Màn hình")}
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 hidden sm:table-cell text-right">
                  {t("Duration", "セッション期間", "Thời lượng")}
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 hidden lg:table-cell text-right">
                  {t("Scroll", "平均スクロール深度", "Cuộn")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((visit) => (
                <TableRow key={visit.id} className="hover:bg-gray-50/50 border-b-gray-50 transition-colors">
                  <TableCell className="text-sm text-gray-600 px-4 py-4 font-medium whitespace-nowrap">
                    {formatDate(visit.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 px-4 py-4 font-semibold truncate max-w-[150px]">
                    {visit.page_key}
                  </TableCell>
                  <TableCell className="text-sm px-4 py-4 hidden sm:table-cell">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 whitespace-nowrap">
                      {getSourceTranslation(visit.traffic_source)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm px-4 py-4 hidden md:table-cell">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-gray-100 text-gray-700 whitespace-nowrap">
                      {getDeviceTranslation(visit.device_type)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 px-4 py-4 hidden lg:table-cell whitespace-nowrap">
                    {visit.screen_width}x{visit.screen_height}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 px-4 py-4 hidden sm:table-cell text-right whitespace-nowrap">
                    {visit.time_on_page_seconds || 0}s
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 px-4 py-4 hidden lg:table-cell text-right whitespace-nowrap">
                    {visit.max_scroll_percent || 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm font-medium bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          {t("No visits yet", "アクセスなし", "Chưa có lượt truy cập nào")}
        </div>
      )}
    </div>
  );
};
