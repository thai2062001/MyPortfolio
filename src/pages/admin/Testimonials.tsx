"use client";

import { useState, memo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Testimonial } from "@/types/admin";
import {
  Plus,
  Edit3,
  Trash2,
  User,
  MessageSquare,
  Globe2,
  Image as ImageIcon,
  Quote,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { translateFields } from "@/lib/translate";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminDialogForm, AdminTabConfig } from "@/components/admin/shared/AdminDialogForm";
import { AdminLoading } from "@/components/admin/shared/AdminLoading";
import { AdminCardGrid } from "@/components/admin/shared/AdminCardGrid";
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const Testimonials = () => {
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("persona");
  const [isTranslating, setIsTranslating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  const { data: testimonials, loading, saving, deleting, upsertData, deleteData } = useAdminCRUD<Testimonial>({
    tableName: "testimonials",
    defaultOrderBy: { column: "order_index", ascending: true }
  });

  const [formData, setFormData] = useState({
    author_name: "",
    role_en: "",
    role_ja: "",
    role_vi: "",
    quote_en: "",
    quote_ja: "",
    quote_vi: "",
    portrait_url: "",
    video_url: null as string | null,
    order_index: 0,
    is_published: true,
  });

  const handleOpenAdd = () => {
    setFormData({ 
      author_name: "", 
      role_en: "", 
      role_ja: "", 
      role_vi: "",
      quote_en: "", 
      quote_ja: "", 
      quote_vi: "",
      portrait_url: "", 
      video_url: null, 
      order_index: testimonials.length, 
      is_published: true 
    });
    setEditingId(null);
    setActiveTab("persona");
    setIsDialogOpen(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      author_name: testimonial.author_name,
      role_en: testimonial.role_en,
      role_ja: testimonial.role_ja,
      role_vi: testimonial.role_vi || "",
      quote_en: testimonial.quote_en,
      quote_ja: testimonial.quote_ja,
      quote_vi: testimonial.quote_vi || "",
      portrait_url: testimonial.portrait_url,
      video_url: testimonial.video_url,
      order_index: testimonial.order_index,
      is_published: testimonial.is_published,
    });
    setEditingId(testimonial.id);
    setActiveTab("persona");
    setIsDialogOpen(true);
  };

  const handleAutoTranslate = async () => {
    if (!formData.role_en || !formData.quote_en) {
      toast.error("Please provide English content to translate.");
      return;
    }
    try {
      setIsTranslating(true);
      const translatedJa = await translateFields({ role: formData.role_en, quote: formData.quote_en }, "ja");
      const translatedVi = await translateFields({ role: formData.role_en, quote: formData.quote_en }, "vi");
      setFormData((prev) => ({ 
        ...prev, 
        role_ja: translatedJa.role, 
        quote_ja: translatedJa.quote,
        role_vi: translatedVi.role,
        quote_vi: translatedVi.quote
      }));
      toast.success(t("Magic! Translated to Japanese and Vietnamese.", "魔法！日本語とベトナム語に翻訳されました。", "Ảo thuật! Đã dịch sang tiếng Nhật và tiếng Việt."));
    } catch {
      toast.error(t("Translation failed.", "翻訳に失敗しました。", "Dịch thất bại."));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = async () => {
    if (!formData.author_name || !formData.quote_en || !formData.role_en) {
      toast.error(t("Essential identity parameters (Name, Role, Quote) are required.", "基本的な身元パラメータ（名前、役割、引用）が必要です。", "Vui lòng nhập đầy đủ Tên, Chức vụ and Nội dung."));
      return;
    }
    const result = await upsertData(formData, editingId || undefined);
    if (result) setIsDialogOpen(false);
  };

  const handleFillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      author_name: "Alex Rivera",
      role_en: "Senior UI/UX Designer",
      quote_en: "This has completely transformed the way we handle our frontend architecture. Unparalleled quality and attention to detail.",
      portrait_url: "https://example.com/portrait.jpg",
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
        .from("testimonials")
        .update({ is_published: published })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Updated ${selectedIds.length} testimonials.`, `${selectedIds.length}件の証言を更新しました。`, `Đã cập nhật ${selectedIds.length} phản hồi.`));
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk update failed.", "一括更新に失敗しました。", "Cập nhật hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(t(`Delete ${selectedIds.length} testimonials?`, `${selectedIds.length}件の証言を削除しますか？`, `Xóa ${selectedIds.length} phản hồi?`))) return;
    
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Deleted ${selectedIds.length} testimonials.`, `${selectedIds.length}件の証言を削除しました。`, `Đã xóa ${selectedIds.length} phản hồi.`));
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk delete failed.", "一括削除に失敗しました。", "Xóa hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const filteredTestimonials = testimonials.filter(
    (t) => t.author_name.toLowerCase().includes(searchTerm.toLowerCase()) || t.quote_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs: AdminTabConfig[] = [
    { id: "persona", label: t("Identity", "身元", "Danh tính"), fullLabel: t("General", "一般", "Chung"), icon: User },
    { id: "narrative", label: t("Words", "言葉", "Lời văn"), fullLabel: t("Content", "コンテンツ", "Nội dung"), icon: MessageSquare },
    { id: "localization", label: "i18n", fullLabel: t("Translations", "翻訳", "Bản dịch"), icon: Globe2 },
    { id: "media", label: t("Media", "メディア", "Phương tiện"), fullLabel: t("Media", "メディア", "Phương tiện"), icon: ImageIcon },
    { id: "status", label: t("Status", "ステータス", "Trạng thái"), fullLabel: t("Publish Settings", "公開設定", "Cài đặt hiển thị"), icon: ShieldCheck },
  ];

  if (loading) return <AdminLayout><AdminLoading message={translations[lang].loading} /></AdminLayout>;

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={() => deleteData(deleteConfirm.itemId!)}
        itemName={deleteConfirm.itemName}
        isLoading={deleting}
      />

      <div className="space-y-12 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={translations[lang].kindWordsArchive}
          description={translations[lang].kindWordsArchiveDescription}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{ label: t("Integrate Words", "言葉を統合", "Tích hợp phản hồi"), onClick: handleOpenAdd, icon: Plus }}
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

        <AdminCardGrid
          data={filteredTestimonials}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          renderCard={(testimonial, _, isSelected) => (
            <div key={testimonial.id} className={cn(
                "group relative bg-white/60 backdrop-blur-xl border rounded-[3rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col",
                isSelected ? "border-sage bg-sage/5" : "border-white/40"
            )}>
              <div className="absolute top-8 right-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button onClick={() => handleEdit(testimonial)} className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center text-heading hover:text-sage transition-all hover:scale-110 active:scale-95">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => deleteConfirm.openConfirm(testimonial.id, testimonial.author_name)} className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-all hover:scale-110 active:scale-95">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="mb-8 flex items-center gap-6">
                <div className="w-20 h-20 bg-white shadow-2xl rounded-full overflow-hidden border-4 border-white group-hover:scale-110 transition-transform duration-700 flex-shrink-0">
                  {testimonial.portrait_url
                    ? <img src={testimonial.portrait_url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground"><User size={32} /></div>
                  }
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-xl font-serif font-bold text-heading group-hover:text-sage transition-colors truncate">{testimonial.author_name}</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground truncate">
                    {lang === 'ja' ? testimonial.role_ja || testimonial.role_en : lang === 'vi' ? testimonial.role_vi || testimonial.role_en : testimonial.role_en}
                  </p>
                </div>
              </div>
              <div className="relative flex-1">
                <Quote className="absolute -left-4 -top-4 text-sage/10" size={48} />
                <p className="text-sm text-muted-foreground leading-relaxed italic font-serif relative z-10 line-clamp-4">
                  "{lang === 'ja' ? testimonial.quote_ja || testimonial.quote_en : lang === 'vi' ? testimonial.quote_vi || testimonial.quote_en : testimonial.quote_en}"
                </p>
              </div>
              <div className="mt-10 pt-6 border-t border-border/40 flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("Priority", "優先度", "Độ ưu tiên")} #{testimonial.order_index}</span>
                {!testimonial.is_published && <span className="text-[8px] font-bold uppercase text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">{t("Private Archive", "プライベートアーカイブ", "Lưu trữ riêng tư")}</span>}
              </div>
            </div>
          )}
          emptyState={
            <div className="py-32 flex flex-col items-center justify-center space-y-4 bg-white/40 backdrop-blur-md rounded-[3rem] border border-dashed border-border/50 w-full">
              <Quote size={48} className="text-muted-foreground/20 animate-pulse" />
              <p className="text-muted-foreground font-serif text-lg italic mt-4">{t("No kind words match your query.", "クエリに一致する言葉はありません。", "Không có phản hồi nào khớp với tìm kiếm.")}</p>
              <Button variant="link" onClick={() => setSearchTerm("")} className="text-sage">{t("Reset Archive", "アーカイブをリセット", "Đặt lại bộ lọc")}</Button>
            </div>
          }
        />

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? t("Refine Word", "言葉を洗練", "Tinh chỉnh phản hồi") : t("Integrate Words", "言葉を統合", "Tích hợp phản hồi")}
          description={t("Refine and architect the testimonial node.", "推薦者のノードを洗練し、構築します。", "Tinh chỉnh và kiến tạo nút phản hồi từ khách hàng.")}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={saving}
          saveLabel={translations[lang].save}
          sidebarTitle={t("Testimonial", "証言", "Phản hồi")}
          sidebarSubtitle={t("Validation", "検証", "Xác thực")}
          sidebarIcon={Quote}
        >
          <TestimonialForm
            formData={formData}
            setFormData={setFormData}
            activeSection={activeTab}
            isTranslating={isTranslating}
            onAutoTranslate={handleAutoTranslate}
            onFillSampleData={!editingId ? handleFillSampleData : undefined}
          />
        </AdminDialogForm>
      </div>
    </AdminLayout>
  );
};

export default memo(Testimonials);
