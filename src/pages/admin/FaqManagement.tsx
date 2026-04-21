"use client";

import { useState, useEffect, memo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Faq } from "@/types/admin";
import { PageSection, PageType } from "@/core/types/sections";
import {
  MessageSquare,
  HelpCircle,
  Settings2,
  FileText,
  Globe2,
  ShieldCheck,
  LayoutGrid,
  Plus,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { ResponsiveDataTable } from "@/components/admin/shared/ResponsiveDataTable";
import { AdminDialogForm } from "@/components/admin/shared/AdminDialogForm";
import { FaqForm } from "@/components/admin/faq/FaqForm";
import { toast } from "sonner";
import { translateFields } from "@/lib/translate";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

const FaqManagement = () => {
  const { lang, translations, t } = useLang();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("identity");
  const [searchTerm, setSearchTerm] = useState("");
  const [placements, setPlacements] = useState<Record<PageType, boolean>>({
    home: false,
    portfolio: false,
  });
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  const deleteConfirm = useDeleteConfirm();

  const { data: faqs, loading, saving, deleting, upsertData, deleteData } = useAdminCRUD<Faq>({
    tableName: "faqs",
    defaultOrderBy: { column: "order_index", ascending: true }
  });

  const [formData, setFormData] = useState<Partial<Faq>>({
    question_en: "",
    question_ja: "",
    question_vi: "",
    answer_en: "",
    answer_ja: "",
    answer_vi: "",
    category: "general",
    order_index: 0,
    is_published: true,
  });

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const { data } = await supabase
        .from("page_sections")
        .select("*")
        .eq("section_type", "faq");

      const newPlacements: Record<PageType, boolean> = {
        home: false,
        portfolio: false,
      };
      data?.forEach((section: PageSection) => {
        if (section.page_type === "home" || section.page_type === "portfolio") {
          newPlacements[section.page_type] = section.is_published;
        }
      });
      setPlacements(newPlacements);
      setPageSections(data || []);
    } catch (error) {
      console.error("Error fetching placements:", error);
    }
  };

  const togglePlacement = async (pageType: PageType) => {
    const isCurrentlyActive = placements[pageType];
    const newStatus = !isCurrentlyActive;

    try {
      const existingSection = pageSections.find(
        (s) => s.page_type === pageType,
      );
      if (existingSection) {
        await supabase
          .from("page_sections")
          .update({ is_published: newStatus, is_visible: newStatus })
          .eq("id", existingSection.id);
      } else {
        await supabase.from("page_sections").insert([
          {
            section_key: `${pageType}_faq`,
            section_name: "FAQ Section",
            section_type: "faq",
            page_type: pageType,
            order_index: 999,
            is_published: newStatus,
            is_visible: newStatus,
            data_source: "faqs",
            source_table: "faqs",
          },
        ]);
      }
      setPlacements((prev) => ({ ...prev, [pageType]: newStatus }));
      fetchPlacements();
      toast.success(t("Global Deployment sequence updated.", "全体的なデプロイシーケンスが更新されました。", "Cấu hình hiển thị toàn cầu đã được cập nhật."));
    } catch (error) {
      toast.error(t("Placement synchronization failed.", "配置の同期に失敗しました。", "Lỗi đồng bộ cấu hình hiển thị."));
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      question_en: "",
      question_ja: "",
      question_vi: "",
      answer_en: "",
      answer_ja: "",
      answer_vi: "",
      category: "general",
      order_index: faqs.length,
      is_published: true,
    });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setFormData({ ...faq });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const success = await upsertData(formData, editingId || undefined);
    if (success) {
      setIsDialogOpen(false);
      toast.success(editingId 
        ? t("Enquiry refined successfully.", "お問い合わせ内容を更新しました。", "Cập nhật yêu cầu thành công.") 
        : t("Enquiry integrated successfully.", "新しいお問い合わせを追加しました。", "Thêm yêu cầu mới thành công."));
    }
  };

  const handleFillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      question_en: "How do you ensure project success?",
      answer_en: "Through rigorous strategic planning and continuous intelligence integration throughout the lifecycle.",
      category: "general",
      is_published: true,
    }));
    toast.success(t("Sample data injected!", "サンプルデータが入力されました！", "Dữ liệu mẫu đã được điền!"));
  };

  const handleMagicSync = async () => {
    if (!formData.question_en || !formData.answer_en) {
      toast.error(t("English parameters required for synchronization.", "同期には英語のパラメータが必要です。", "Yêu cầu nội dung tiếng Anh để đồng bộ."));
      return;
    }
    try {
      setIsTranslating(true);
      const translatedJa = await translateFields({
        question: formData.question_en,
        answer: formData.answer_en
      }, "ja");
      const translatedVi = await translateFields({
        question: formData.question_en,
        answer: formData.answer_en
      }, "vi");
      setFormData(prev => ({
        ...prev,
        question_ja: translatedJa.question,
        answer_ja: translatedJa.answer,
        question_vi: translatedVi.question,
        answer_vi: translatedVi.answer
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
        .from("faqs")
        .update({ is_published: published })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Updated ${selectedIds.length} enquiries.`, `${selectedIds.length}件のお問い合わせを更新しました。`, `Đã cập nhật ${selectedIds.length} yêu cầu.`));
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk update failed.", "一括更新に失敗しました。", "Cập nhật hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(t(`Delete ${selectedIds.length} enquiries?`, `${selectedIds.length}件のお問い合わせを削除しますか？`, `Xóa ${selectedIds.length} yêu cầu?`))) return;
    
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("faqs")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Deleted ${selectedIds.length} enquiries.`, `${selectedIds.length}件のお問い合わせを削除しました。`, `Đã xóa ${selectedIds.length} yêu cầu.`));
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk delete failed.", "一括削除に失敗しました。", "Xóa hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const columns = [
    {
      header: t("Enquiry", "お問い合わせ", "Yêu cầu"),
      key: "question_en",
      render: (row: Faq) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center text-sage">
            <MessageSquare size={18} />
          </div>
          <div className="max-w-md text-left">
            <div className="font-bold text-heading line-clamp-1">
              {lang === 'ja' ? row.question_ja || row.question_en : lang === 'vi' ? row.question_vi || row.question_en : row.question_en}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{row.category} cluster</div>
          </div>
        </div>
      )
    },
    {
      header: t("Status", "ステータス", "Trạng thái"),
      key: "is_published",
      render: (row: Faq) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.is_published ? 'bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]' : 'bg-amber-400'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {row.is_published ? t("Published", "公開済み", "Đã xuất bản") : t("Vaulted", "保管済み", "Lưu trữ")}
          </span>
        </div>
      )
    },
    {
      header: t("Order", "順序", "Thứ tự"),
      key: "order_index",
      render: (row: Faq) => (
        <span className="text-[10px] font-bold text-muted-foreground">#{row.order_index}</span>
      )
    }
  ];

  const adminTabs = [
    { id: "identity", label: t("Configuration", "構成", "Cấu hình"), icon: Settings2 },
    { id: "content", label: t("Narrative (EN)", "ナラティブ (EN)", "Nội dung (EN)"), icon: FileText },
    { id: "localization", label: t("Translations", "翻訳", "Bản dịch"), icon: Globe2 },
    { id: "deployment", label: t("Safety", "安全性", "Bảo mật"), icon: ShieldCheck }
  ];

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={() => deleteData(deleteConfirm.itemId!)}
        itemName={deleteConfirm.itemName}
        isLoading={deleting}
      />
      <div className="space-y-8 animate-in fade-in duration-700">
        <AdminPageHeader
          title={translations[lang].enquiryHub}
          description={translations[lang].enquiryHubDescription}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: t("Integrate Enquiry", "お問い合わせを追加", "Thêm yêu cầu"),
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
                    title="Vault"
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

        <div className="flex justify-end gap-4 items-center">
          <div className="bg-white/50 backdrop-blur-md border border-white/40 rounded-[2rem] p-4 flex items-center justify-around w-full max-w-[200px]">
            {(["home", "portfolio"] as PageType[]).map((page) => (
              <button
                key={page}
                onClick={() => togglePlacement(page)}
                className={`flex flex-col items-center gap-1 group transition-all p-2 rounded-xl hover:bg-white/50 ${placements[page] ? "text-sage" : "text-muted-foreground opacity-60"}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${placements[page] ? "bg-sage text-white shadow-lg" : "bg-muted/50 group-hover:bg-muted font-bold"}`}
                >
                  <LayoutGrid size={14} />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-tighter">
                  {page}
                </span>
              </button>
            ))}
          </div>
        </div>

        <ResponsiveDataTable
          data={faqs}
          columns={columns}
          loading={loading}
          searchTerm={searchTerm}
          searchFields={["question_en", "question_ja", "question_vi", "answer_en", "answer_ja", "answer_vi"]}
          onEdit={handleEdit}
          onDelete={(item) => deleteConfirm.openConfirm(item.id, item.question_en)}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          emptyState={{
            title: t("No enquiries match your pursuit.", "お問い合わせが見つかりません。", "Không tìm thấy yêu cầu nào phù hợp."),
            icon: HelpCircle,
            onReset: () => setSearchTerm("")
          }}
        />

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? t("Refine Enquiry", "お問い合わせを精査", "Tinh chỉnh yêu cầu") : t("Integrate Enquiry", "お問い合わせを追加", "Thêm yêu cầu")}
          description={t("Refine and architect the FAQ narrative node.", "FAQのナラティブノードを精査し、構築します。", "Tinh chỉnh và xây dựng nút nội dung FAQ.")}
          tabs={adminTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={saving}
          sidebarTitle="Enquiry"
          sidebarSubtitle="FAQ Protocol"
          sidebarIcon={HelpCircle}
        >
          <FaqForm
            formData={formData}
            setFormData={setFormData}
            activeSection={activeTab}
            isTranslating={isTranslating}
            onAutoTranslate={handleMagicSync}
            onFillSampleData={!editingId ? handleFillSampleData : undefined}
          />
        </AdminDialogForm>
      </div>
    </AdminLayout>
  );
};

export default memo(FaqManagement);
