/**
 * Session Detail Drawer
 * Shows detailed user journey for a session
 */

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Copy } from "lucide-react";

interface SessionDetailDrawerProps {
  sessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
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
      return "destructive";
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

export const SessionDetailDrawer = ({
  sessionId,
  isOpen,
  onClose,
}: SessionDetailDrawerProps) => {
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[600px] md:w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Session Details</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading session details...</p>
            </div>
          </div>
        ) : session ? (
          <div className="space-y-6 mt-6">
            {/* Session Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Session Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Visitor ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-gray-100 px-3 py-2 rounded flex-1 break-all">
                      {session.visitor_id}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(session.visitor_id, "visitor")
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copiedId === "visitor" && (
                      <span className="text-xs text-green-600">Copied!</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Session ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-gray-100 px-3 py-2 rounded flex-1 break-all">
                      {session.session_id}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(session.session_id, "session")
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copiedId === "session" && (
                      <span className="text-xs text-green-600">Copied!</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">First Seen</p>
                  <p className="text-sm font-medium">
                    {formatDate(session.first_seen)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Seen</p>
                  <p className="text-sm font-medium">
                    {formatDate(session.last_seen)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Traffic Source</p>
                  <Badge
                    variant={getBadgeVariant(
                      getTrafficSourceColor(session.traffic_source),
                    )}
                  >
                    {getTrafficSourceLabel(session.traffic_source)}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Device Type</p>
                  <Badge
                    variant={getBadgeVariant(
                      getDeviceTypeColor(session.device_type),
                    )}
                  >
                    {getDeviceTypeLabel(session.device_type)}
                  </Badge>
                </div>

                {session.screen_width && session.screen_height && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Screen Size</p>
                    <p className="text-sm font-medium">
                      {session.screen_width}x{session.screen_height}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pages</p>
                  <p className="text-sm font-medium">
                    {session.total_pages_viewed}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Time Spent</p>
                  <p className="text-sm font-medium">
                    {formatTime(session.total_time_spent)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Page Journey */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Page Journey
              </h3>
              {journey.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Page</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead className="text-right">Time (s)</TableHead>
                        <TableHead className="text-right">Scroll %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {journey.map((page) => (
                        <TableRow key={`${page.created_at}-${page.page_key}`}>
                          <TableCell className="text-sm font-medium">
                            {page.order}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(page.created_at)}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {page.page_key}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div
                              className="text-gray-600 truncate"
                              title={page.page_url}
                            >
                              {truncateUrl(page.page_url, 30)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-right">
                            {formatTime(page.time_on_page_seconds)}
                          </TableCell>
                          <TableCell className="text-sm text-right">
                            {page.max_scroll_percent}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-500">
                  No pages in journey
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-500">
            No session data found
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
