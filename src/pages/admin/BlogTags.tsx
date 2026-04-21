"use client";

import { useState, memo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { BlogTag } from "@/types/admin";
import {
  Tag as TagIcon,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { ResponsiveDataTable } from "@/components/admin/shared/ResponsiveDataTable";
import { AdminDialogForm } from "@/components/admin/shared/AdminDialogForm";
import { AdminTaxonomyForm } from "@/components/admin/shared/AdminTaxonomyForm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const BlogTags = () => {
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("identity");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  const { data: tags, loading, saving, upsertData, deleteData, deleting } = useAdminCRUD<BlogTag>({
    tableName: "blog_tags",
    defaultOrderBy: { column: "order_index", ascending: true }
  });

  const [formData, setFormData] = useState<Partial<BlogTag>>({
    slug: "",
    name_en: "",
    name_ja: "",
    name_vi: "",
    order_index: 0,
    is_active: true,
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      slug: "",
      name_en: "",
      name_ja: "",
      name_vi: "",
      order_index: tags.length,
      is_active: true,
    });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleEdit = (tag: BlogTag) => {
    setEditingId(tag.id);
    setFormData({ ...tag });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const success = await upsertData(formData, editingId || undefined);
    if (success) setIsDialogOpen(false);
  };

  const handleFillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      slug: "sample-tag-ai",
      name_en: "Artificial Intelligence",
      is_active: true,
    }));
    toast.success(t("Sample data injected!", "サンプルデータが入力されました！", "Dữ liệu mẫu đã được điền!"));
  };

  const handleDelete = async () => {
    if (deleteConfirm.itemId) {
      const success = await deleteData(deleteConfirm.itemId);
      if (success) deleteConfirm.closeConfirm();
    }
  };

  // Bulk Actions
  const handleBulkStatus = async (active: boolean) => {
    if (!selectedIds.length) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("blog_tags")
        .update({ is_active: active })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Updated ${selectedIds.length} tags.`, `${selectedIds.length}件のタグを更新しました。`, `Đã cập nhật ${selectedIds.length} thẻ.`));
      queryClient.invalidateQueries({ queryKey: ["blog_tags"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk update failed.", "一括更新に失敗しました。", "Cập nhật hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(t(`Delete ${selectedIds.length} tags?`, `${selectedIds.length}件のタグを削除しますか？`, `Xóa ${selectedIds.length} thẻ?`))) return;
    
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("blog_tags")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Deleted ${selectedIds.length} tags.`, `${selectedIds.length}件のタグを削除しました。`, `Đã xóa ${selectedIds.length} thẻ.`));
      queryClient.invalidateQueries({ queryKey: ["blog_tags"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk delete failed.", "一括削除に失敗しました。", "Xóa hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const columns = [
    {
      header: t("Tag", "タグ", "Thẻ"),
      key: "name_en",
      render: (row: BlogTag) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center text-sage">
            <TagIcon size={18} />
          </div>
          <div className="text-left">
            <div className="font-bold text-heading">
              {lang === 'ja' ? row.name_ja || row.name_en : lang === 'vi' ? row.name_vi || row.name_en : row.name_en}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">URL: {row.slug}</div>
          </div>
        </div>
      )
    },
    {
      header: translations[lang].status,
      key: "is_active",
      render: (row: BlogTag) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.is_active ? 'bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]' : 'bg-amber-400'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {row.is_active ? t("Active", "有効", "Hoạt động") : t("Inactive", "無効", "Ngừng hoạt động")}
          </span>
        </div>
      )
    },
    {
      header: translations[lang].orderIndex,
      key: "order_index",
      render: (row: BlogTag) => (
        <span className="text-[10px] font-bold text-muted-foreground font-mono px-2 py-1 bg-stone-50 rounded-lg">#{row.order_index}</span>
      )
    }
  ];

  const taxonomyTabs = [
    { id: "identity", label: t("Core", "コア", "Cốt lõi"), icon: TagIcon },
    { id: "visuals", label: t("Media", "メディア", "Phương tiện"), icon: Sparkles },
    { id: "protocols", label: t("Indexing", "インデックス", "Chỉ mục"), icon: ShieldCheck }
  ];

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={handleDelete}
        itemName={deleteConfirm.itemName}
        isLoading={deleting}
      />

      <div className="space-y-10 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={translations[lang].blogTags}
          description="Refine your narrative indexing through descriptive tags."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: t("Add Tag", "タグを追加", "Thêm thẻ"),
            onClick: handleAdd
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
                    title="Activate"
                   >
                    <CheckCircle2 size={18} />
                   </button>
                   
                   <button 
                    onClick={() => handleBulkStatus(false)} 
                    disabled={isBulkPending}
                    className="p-2 rounded-xl text-amber-500 hover:bg-amber-50 transition-all disabled:opacity-50"
                    title="Deactivate"
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

        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-sm">
          <ResponsiveDataTable
            data={tags}
            columns={columns}
            loading={loading}
            searchTerm={searchTerm}
            searchFields={["name_en", "name_ja", "name_vi", "slug"]}
            onEdit={handleEdit}
            onDelete={(item) => deleteConfirm.openConfirm(item.id, lang === 'ja' ? item.name_ja || item.name_en : lang === 'vi' ? item.name_vi || item.name_en : item.name_en)}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            emptyState={{
              title: t("No blog tags found.", "ブログタグが見つかりません。", "Không tìm thấy thẻ blog nào."),
              icon: TagIcon,
              onReset: () => setSearchTerm("")
            }}
          />
        </div>

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? t("Edit Tag", "タグを編集", "Sửa thẻ") : t("Add Tag", "タグを追加", "Thêm thẻ")}
          description={t("Define keywords to organize your blog content.", "ブログコンテンツを整理するためのキーワードを定義します。", "Định nghĩa các từ khóa để sắp xếp nội dung blog của bạn.")}
          tabs={taxonomyTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={saving}
          saveLabel={translations[lang].save}
        >
          <AdminTaxonomyForm
            formData={formData}
            setFormData={setFormData}
            activeSection={activeTab}
            setActiveSection={setActiveTab}
            editingId={editingId}
            onFillSampleData={!editingId ? handleFillSampleData : undefined}
            config={{
              hasI18n: true,
              statusField: "is_active"
            }}
          />
        </AdminDialogForm>
      </div>
    </AdminLayout>
  );
};

export default memo(BlogTags);
