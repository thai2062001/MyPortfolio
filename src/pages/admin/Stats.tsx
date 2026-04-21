"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { SiteStat } from "@/types/admin";
import { useLang } from "@/contexts/LangContext";
import {
  BarChart3,
  Settings2,
  BarChart,
  Languages,
  Sparkles,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { ResponsiveDataTable } from "@/components/admin/shared/ResponsiveDataTable";
import { AdminDialogForm } from "@/components/admin/shared/AdminDialogForm";
import { AdminStatForm } from "@/components/admin/shared/AdminStatForm";
import { StatsSectionSettingsForm } from "@/components/admin/stats/StatsSectionSettingsForm";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const StatsPage = () => {
  const { lang, translations, t } = useLang();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"items" | "settings">("items");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeFormTab, setActiveFormTab] = useState("config");
  const [searchTerm, setSearchTerm] = useState("");

  // Selection
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  const {
    data: stats,
    loading,
    saving,
    upsertData,
    deleteData,
  } = useAdminCRUD<SiteStat>({
    tableName: "site_stats",
    defaultOrderBy: { column: "order_index", ascending: true },
  });

  const [formData, setFormData] = useState<Partial<SiteStat>>({
    stat_key: "",
    value_text: "",
    label_en: "",
    label_ja: "",
    label_vi: "",
    description_en: "",
    description_ja: "",
    description_vi: "",
    icon_url: "",
    order_index: 0,
    is_published: true,
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      stat_key: "",
      value_text: "",
      label_en: "",
      label_ja: "",
      label_vi: "",
      description_en: "",
      description_ja: "",
      description_vi: "",
      icon_url: "",
      order_index: stats.length,
      is_published: true,
    });
    setActiveFormTab("config");
    setIsDialogOpen(true);
  };

  const handleEdit = (stat: SiteStat) => {
    setEditingId(stat.id);
    setFormData({ ...stat });
    setActiveFormTab("config");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const success = await upsertData(formData, editingId || undefined);
    if (success) setIsDialogOpen(false);
  };

  const handleFillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      stat_key: "sample_projects",
      value_text: "50+",
      label_en: "Projects Deployed",
      description_en: "Global scale full stack projects successfully delivered to production.",
      icon_url: "https://example.com/icon.svg",
      is_published: true,
    }));
    toast.success(t("Sample data injected!", "サンプルデータが入力されました！", "Dữ liệu mẫu đã được điền!"));
  };

  // Bulk Actions
  const handleBulkStatus = async (published: boolean) => {
    if (!selectedIds.length) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("site_stats")
        .update({ is_published: published })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(
        t(
          `Updated ${selectedIds.length} metrics.`,
          `${selectedIds.length}件のメトリックを更新しました。`,
          `Đã cập nhật ${selectedIds.length} số liệu.`,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["site_stats"] });
      setSelectedIds([]);
    } catch {
      toast.error(
        t(
          "Bulk update failed.",
          "一括更新に失敗しました。",
          "Cập nhật hàng loạt thất bại.",
        ),
      );
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (
      !window.confirm(
        t(
          `Delete ${selectedIds.length} metrics?`,
          `${selectedIds.length}件のメトリックを削除しますか？`,
          `Xóa ${selectedIds.length} số liệu?`,
        ),
      )
    )
      return;

    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("site_stats")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(
        t(
          `Deleted ${selectedIds.length} metrics.`,
          `${selectedIds.length}件のメトリックを削除しました。`,
          `Đã xóa ${selectedIds.length} số liệu.`,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["site_stats"] });
      setSelectedIds([]);
    } catch {
      toast.error(
        t(
          "Bulk delete failed.",
          "一括削除に失敗しました。",
          "Xóa hàng loạt thất bại.",
        ),
      );
    } finally {
      setIsBulkPending(false);
    }
  };

  const columns = [
    {
      header: t("Metric", "メトリック", "Số liệu"),
      key: "label_en",
      render: (row: SiteStat) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center text-sage overflow-hidden">
            {row.icon_url ? (
              <img
                src={row.icon_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <BarChart3 size={18} />
            )}
          </div>
          <div className="text-left">
            <div className="text-xl font-serif font-bold text-sage leading-tight">
              {row.value_text}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              {lang === "ja"
                ? row.label_ja || row.label_en
                : lang === "vi"
                  ? row.label_vi || row.label_en
                  : row.label_en}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: t("Sync Status", "同期ステータス", "Trạng thái đồng bộ"),
      key: "is_published",
      render: (row: SiteStat) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${row.is_published ? "bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]" : "bg-amber-400"}`}
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {row.is_published
              ? t("Active", "有効", "Hoạt động")
              : t("Archived", "アーカイブ済み", "Lưu trữ")}
          </span>
        </div>
      ),
    },
    {
      header: t("Order", "順序", "Thứ tự"),
      key: "order_index",
      render: (row: SiteStat) => (
        <span className="text-[10px] font-bold text-muted-foreground">
          #{row.order_index}
        </span>
      ),
    },
  ];

  const statFormTabs = [
    {
      id: "config",
      label: t("Protocol", "プロトコル", "Giao thức"),
      icon: BarChart,
    },
    {
      id: "linguistic",
      label: t("Linguistic", "言語", "Ngôn ngữ"),
      icon: Languages,
    },
    {
      id: "visuals",
      label: t("Visuals", "ビジュアル", "Hình ảnh"),
      icon: Sparkles,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <AdminPageHeader
          title={translations[lang].statsManagementTitle}
          description={translations[lang].statsManagementDescription}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={
            activeTab === "items"
              ? {
                  label: t("Integrate Node", "ノードを統合", "Tích hợp nút"),
                  onClick: handleAdd,
                }
              : undefined
          }
          tabs={{
            activeTab,
            onTabChange: (tab) => setActiveTab(tab as any),
            tabs: [
              {
                id: "items",
                label: t("Metric Nodes", "メトリックノード", "Nút số liệu"),
                icon: BarChart3,
              },
              {
                id: "settings",
                label: t("Header Settings", "ヘッダー設定", "Cài đặt tiêu đề"),
                icon: Settings2,
              },
            ],
          }}
          headerActions={
            activeTab === "items" && (
              <AnimatePresence>
                {selectedIds.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2 px-3 border-r border-sage/10 mr-1">
                      <div className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center text-[10px] font-black">
                        {selectedIds.length}
                      </div>
                      <button
                        onClick={() => setSelectedIds([])}
                        className="text-[10px] font-bold uppercase tracking-widest text-sage/60 hover:text-sage"
                      >
                        Clear
                      </button>
                    </div>

                    <button
                      onClick={() => handleBulkStatus(true)}
                      disabled={isBulkPending}
                      className="p-2 rounded-xl text-sage hover:bg-sage/10 transition-all disabled:opacity-50"
                      title="Publish"
                    >
                      <CheckCircle2 size={18} />
                    </button>

                    <button
                      onClick={() => handleBulkStatus(false)}
                      disabled={isBulkPending}
                      className="p-2 rounded-xl text-amber-500 hover:bg-amber-50 transition-all disabled:opacity-50"
                      title="Archive"
                    >
                      <XCircle size={18} />
                    </button>

                    <button
                      onClick={handleBulkDelete}
                      disabled={isBulkPending}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )
          }
        />

        {activeTab === "items" ? (
          <div className="space-y-8">
            <ResponsiveDataTable
              data={stats}
              columns={columns}
              loading={loading}
              searchTerm={searchTerm}
              searchFields={["label_en", "label_ja", "value_text", "stat_key"]}
              selectable
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onEdit={handleEdit}
              onDelete={(item) => deleteData(item.id)}
              emptyState={{
                title: t(
                  "No metrics match your pursuit.",
                  "メトリックが見つかりません。",
                  "Không tìm thấy số liệu nào khớp với tìm kiếm.",
                ),
                icon: BarChart3,
                onReset: () => setSearchTerm(""),
              }}
            />

            <AdminDialogForm
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              title={
                editingId
                  ? t("Edit Metric", "メトリックを編集", "Chỉnh sửa số liệu")
                  : t("Add Metric", "メトリックを追加", "Thêm số liệu")
              }
              description={t(
                "Configure the statistical narrative node architecture.",
                "統計的なナラティブノードのアーキテクチャを構成します。",
                "Cấu hình kiến trúc nút kể chuyện bằng thống kê.",
              )}
              tabs={statFormTabs}
              activeTab={activeFormTab}
              onTabChange={setActiveFormTab}
              onSave={handleSave}
              saving={saving}
            >
              <AdminStatForm
                formData={formData}
                setFormData={setFormData}
                activeSection={activeFormTab}
                setActiveSection={setActiveFormTab}
                editingId={editingId}
                onFillSampleData={!editingId ? handleFillSampleData : undefined}
              />
            </AdminDialogForm>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-8 duration-700">
            <StatsSectionSettingsForm />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default StatsPage;
