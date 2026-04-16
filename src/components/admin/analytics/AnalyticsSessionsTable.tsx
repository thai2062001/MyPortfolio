/**
 * Analytics Sessions Table
 * Displays user sessions with smooth polished aesthetics
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionSummary } from "@/lib/analytics/session-queries";
import {
  formatDateShort,
  formatTime,
  getTrafficSourceLabel,
  getTrafficSourceColor,
  getDeviceTypeLabel,
  getDeviceTypeColor,
} from "@/lib/analytics/format";
import { Eye } from "lucide-react";

interface AnalyticsSessionsTableProps {
  data: SessionSummary[];
  onViewDetail: (sessionId: string) => void;
}

const getBadgeVariant = (
  color: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (color) {
    case "blue":
      return "default";
    case "green":
      return "secondary";
    case "purple":
      return "default";
    case "orange":
      return "outline";
    case "red":
      return "destructive";
    case "cyan":
      return "default";
    default:
      return "secondary";
  }
};

export const AnalyticsSessionsTable = ({
  data,
  onViewDetail,
}: AnalyticsSessionsTableProps) => {
  const { t } = useLang();

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
      <div className="mb-6 text-left">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          {t("User Sessions", "ユーザーセッション", "Phiên người dùng")}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {t("Detailed breakdown of unique visitors", "ユニークビジターの詳細な内訳", "Phân tích chi tiết về khách truy cập duy nhất")}
        </p>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-gray-100/50 bg-white">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow className="border-b-gray-100">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 w-12 text-center">
                  #
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 hidden md:table-cell">
                  {t("Timestamp", "タイムスタンプ", "Thời gian")}
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 hidden md:table-cell">
                  {t("Source", "ソース", "Nguồn")}
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 hidden lg:table-cell">
                  {t("Device", "デバイス", "Thiết bị")}
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 text-right hidden sm:table-cell">
                  {t("Views", "ビュー", "Lượt xem")}
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 text-right">
                  {t("Duration", "セッション期間", "Thời lượng")}
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-4 text-center">
                  {t("Actions", "アクション", "Hành động")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((session, index) => (
                <TableRow key={session.session_id} className="hover:bg-gray-50/50 border-b-gray-50 transition-colors">
                  <TableCell className="text-sm font-medium text-gray-400 text-center px-4 py-4">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 hidden md:table-cell px-4 py-4 font-medium">
                    {formatDateShort(session.first_seen)}
                  </TableCell>
                  <TableCell className="text-sm hidden md:table-cell px-4 py-4 w-[120px]">
                     <Badge variant={getBadgeVariant(getTrafficSourceColor(session.traffic_source))} className="shadow-none font-bold uppercase tracking-widest text-[10px]">
                       {getSourceTranslation(getTrafficSourceLabel(session.traffic_source))}
                     </Badge>
                   </TableCell>
                   <TableCell className="text-sm hidden lg:table-cell px-4 py-4 w-[120px]">
                     <Badge variant={getBadgeVariant(getDeviceTypeColor(session.device_type))} className="shadow-none font-bold uppercase tracking-widest text-[10px]">
                       {getDeviceTranslation(getDeviceTypeLabel(session.device_type))}
                     </Badge>
                   </TableCell>
                  <TableCell className="text-sm text-gray-900 text-right font-bold px-4 py-4 hidden sm:table-cell">
                    {session.total_pages_viewed}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 text-right font-medium px-4 py-4 mix-blend-multiply whitespace-nowrap">
                    {formatTime(session.total_time_spent)}
                  </TableCell>
                  <TableCell className="text-center px-4 py-4 w-20">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetail(session.session_id)}
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 w-8 rounded-xl"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm font-medium bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          {t(
            "No sessions found",
            "セッションが見つかりません",
            "Không tìm thấy phiên làm việc nào"
          )}
        </div>
      )}
    </div>
  );
};
