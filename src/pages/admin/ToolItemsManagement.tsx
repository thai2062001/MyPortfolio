"use client";

import { useState, memo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ExpertiseToolItem } from "@/types/admin";
import {
  Plus,
  Box,
  Wrench,
  Settings2,
  FileText,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { ResponsiveDataTable } from "@/components/admin/shared/ResponsiveDataTable";
import { AdminDialogForm } from "@/components/admin/shared/AdminDialogForm";
import { ToolItemForm } from "@/components/admin/expertise/ToolItemForm";
import { toast } from "sonner";
import { translateFields } from "@/lib/translate";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

const ToolItemsManagement = () => {
  const { lang, translations, t } = useLang();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("identity");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  const { data: tools, loading, saving, upsertData, deleteData } = useAdminCRUD<ExpertiseToolItem>({
    tableName: "expertise_tool_items",
    defaultOrderBy: { column: "order_index", ascending: true }
  });

  const [formData, setFormData] = useState<Partial<ExpertiseToolItem>>({
    tool_name: "",
    tool_name_ja: "",
    tool_name_vi: "",
    description: "",
    description_ja: "",
    description_vi: "",
    tool_url: "",
    icon_url: "",
    order_index: 0,
    is_published: true,
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      tool_name: "",
      tool_name_ja: "",
      tool_name_vi: "",
      description: "",
      description_ja: "",
      description_vi: "",
      tool_url: "",
      icon_url: "",
      order_index: tools.length,
      is_published: true,
    });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleEdit = (tool: ExpertiseToolItem) => {
    setEditingId(tool.id);
    setFormData({ ...tool });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const success = await upsertData(formData, editingId || undefined);
    if (success) setIsDialogOpen(false);
  };

  const handleMagicSync = async () => {
    if (!formData.tool_name || !formData.description) {
      toast.error(t("English parameters required for synchronization.", "同期には英語のパラメータが必要です。", "Yêu cầu nội dung tiếng Anh để đồng bộ."));
      return;
    }
    try {
      setIsTranslating(true);
      const translatedJa = await translateFields({
        name: formData.tool_name,
        description: formData.description
      }, "ja");
      const translatedVi = await translateFields({
        name: formData.tool_name,
        description: formData.description
      }, "vi");
      setFormData(prev => ({
        ...prev,
        tool_name_ja: translatedJa.name,
        description_ja: translatedJa.description,
        tool_name_vi: translatedVi.name,
        description_vi: translatedVi.description
      }));
      toast.success(t("Translation synced successfully.", "翻訳が正常に同期されました。", "Đã đồng bộ bản dịch thành công."));
    } catch (error) {
      toast.error(t("Magic Sync failure.", "マジックシークの失敗。", "Lỗi đồng bộ tự động."));
    } finally {
      setIsTranslating(false);
    }
  };

  // Bulk Actions
  const handleBulkStatus = async (published: boolean) => {
    if (!selectedIds.length) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("expertise_tool_items")
        .update({ is_published: published })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Updated ${selectedIds.length} instruments.`, `${selectedIds.length}件の計器を更新しました。`, `Đã cập nhật ${selectedIds.length} công cụ.`));
      queryClient.invalidateQueries({ queryKey: ["expertise_tool_items"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk update failed.", "一括更新に失敗しました。", "Cập nhật hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(t(`Delete ${selectedIds.length} instruments?`, `${selectedIds.length}件の計器を削除しますか？`, `Xóa ${selectedIds.length} công cụ?`))) return;
    
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("expertise_tool_items")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Deleted ${selectedIds.length} instruments.`, `${selectedIds.length}件の計器を削除しました。`, `Đã xóa ${selectedIds.length} công cụ.`));
      queryClient.invalidateQueries({ queryKey: ["expertise_tool_items"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk delete failed.", "一括削除に失敗しました。", "Xóa hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const columns = [
    {
      header: t("Instrument Node", "計器ノード", "Nút công cụ"),
      key: "tool_name",
      render: (row: ExpertiseToolItem) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center p-2.5 border border-sage/5 overflow-hidden">
            {row.icon_url ? (
              <img src={row.icon_url} alt="" className="w-full h-full object-contain" />
            ) : (
              <Wrench size={20} className="text-muted-foreground/30" />
            )}
          </div>
          <div className="max-w-xs text-left">
            <div className="font-bold text-heading line-clamp-1">{lang === 'ja' ? row.tool_name_ja || row.tool_name : lang === 'vi' ? row.tool_name_vi || row.tool_name : row.tool_name}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{row.tool_url ? t("Production Active", "プロダクションアクティブ", "Đang hoạt động") : t("Internal Resource", "内部リソース", "Nguồn lực nội bộ")}</div>
          </div>
        </div>
      )
    },
    {
      header: t("Status", "ステータス", "Trạng thái"),
      key: "is_published",
      render: (row: ExpertiseToolItem) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.is_published ? 'bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]' : 'bg-amber-400'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {row.is_published ? t("Integrated", "統合済み", "Đã tích hợp") : t("Shadowed", "シャドウ化", "Đang ẩn")}
          </span>
        </div>
      )
    }
  ];

  const adminTabs = [
    { id: "identity", label: t("Configuration", "構成", "Cấu hình"), icon: Settings2 },
    { id: "content", label: t("Narrative (EN)", "物語 (EN)", "Nội dung (EN)"), icon: FileText },
    { id: "localization", label: t("Translations", "翻訳", "Bản dịch"), icon: Globe2 },
    { id: "deployment", label: t("Safety", "安全性", "An toàn"), icon: ShieldCheck }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <AdminPageHeader
          title={translations[lang].toolCluster}
          description={translations[lang].toolClusterDescription}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: t("Integrate Instrument", "計器を統合", "Tích hợp công cụ"),
            onClick: handleAdd,
            icon: Plus
          }}
          headerActions={
            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md"
                >
                   <div className="flex items-center gap-2 px-3 border-r border-sage/10 mr-1">
                      <div className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center text-[10px] font-black">{selectedIds.length}</div>
                      <button onClick={() => setSelectedIds([])} className="text-[10px] font-bold uppercase tracking-widest text-sage/60 hover:text-sage">Clear</button>
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
                    title="Hide"
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
          }
        />

        <ResponsiveDataTable
          data={tools}
          columns={columns}
          loading={loading}
          searchTerm={searchTerm}
          searchFields={["tool_name", "tool_name_ja", "description", "description_ja"]}
          onEdit={handleEdit}
          onDelete={(item) => deleteData(item.id)}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          emptyState={{
            title: t("No digital instruments match your query.", "クエリに一致するデジタル計器はありません。", "Không có công cụ kỹ thuật số nào khớp với tìm kiếm của bạn."),
            icon: Wrench,
            onReset: () => setSearchTerm("")
          }}
        />

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? t("Refine Instrument", "計器を洗練", "Tinh chỉnh công cụ") : t("Integrate Instrument", "計器を統合", "Tích hợp công cụ")}
          description={t("Refine and architect the parameters of the digital tool cluster node.", "デジタルツールクラスターノードのパラメータを精査し、構築します。", "Tinh chỉnh và xây dựng các tham số của nút cụm công cụ kỹ thuật số.")}
          tabs={adminTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={saving}
          sidebarTitle={t("Instrument", "計器", "Công cụ")}
          sidebarSubtitle={t("Tool Settings", "ツール設定", "Cài đặt công cụ")}
          sidebarIcon={Wrench}
        >
          <ToolItemForm
            formData={formData}
            setFormData={setFormData}
            activeSection={activeTab}
            isTranslating={isTranslating}
            onAutoTranslate={handleMagicSync}
          />
        </AdminDialogForm>
      </div>
    </AdminLayout>
  );
};

export default memo(ToolItemsManagement);
