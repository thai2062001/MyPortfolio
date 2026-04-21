import { useState, memo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ProjectCategory } from "@/types/admin";
import {
  Hash,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ProjectCategories = () => {
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("identity");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: categories, loading, saving, upsertData, deleteData, deleting } = useAdminCRUD<ProjectCategory>({
    tableName: "project_categories",
    defaultOrderBy: { column: "order_index", ascending: true }
  });

  // Bulk status update
  const bulkStatusUpdateMutation = useMutation({
    mutationFn: async ({ ids, isPublished }: { ids: string[], isPublished: boolean }) => {
      const { error } = await supabase
        .from("project_categories")
        .update({ is_published: isPublished })
        .in("id", ids);
      if (error) throw error;
      return { ids, isPublished };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project_categories"] });
      toast.success(t(
        `Bulk updated ${variables.ids.length} categories`,
        `${variables.ids.length}件のカテゴリーを一括更新しました`,
        `Đã cập nhật hàng loạt ${variables.ids.length} danh mục`
      ));
      setSelectedIds([]);
    },
    onError: () => toast.error("Bulk update failure")
  });

  // Bulk delete
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from("project_categories")
        .delete()
        .in("id", ids);
      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: ["project_categories"] });
      toast.success(t(
        `Bulk deleted ${ids.length} categories`,
        `${ids.length}件のカテゴリーを一括削除しました`,
        `Đã xóa hàng loạt ${ids.length} danh mục`
      ));
      setSelectedIds([]);
    },
    onError: () => toast.error("Bulk delete failure")
  });

  const [formData, setFormData] = useState<Partial<ProjectCategory>>({
    slug: "",
    name_en: "",
    name_ja: "",
    name_vi: "",
    order_index: 0,
    is_published: true,
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      slug: "",
      name_en: "",
      name_ja: "",
      name_vi: "",
      order_index: categories.length,
      is_published: true,
    });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleEdit = (category: ProjectCategory) => {
    setEditingId(category.id);
    setFormData({ ...category });
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
      slug: "sample-project-cat",
      name_en: "Web Development",
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

  const columns = [
    {
      header: t("Category", "カテゴリー", "Danh mục"),
      key: "name_en",
      render: (row: ProjectCategory) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center text-sage">
            <Hash size={18} />
          </div>
          <div className="text-left">
            <div className="font-bold text-heading">
              {lang === 'ja' ? row.name_ja || row.name_en : lang === 'vi' ? row.name_vi || row.name_en : row.name_en}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">ID: {row.slug}</div>
          </div>
        </div>
      )
    },
    {
      header: translations[lang].status,
      key: "is_published",
      render: (row: ProjectCategory) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.is_published ? 'bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]' : 'bg-amber-400'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {row.is_published ? t("Deployed", "デプロイ済み", "Đã triển khai") : t("Vaulted", "保管済み", "Đã lưu trữ")}
          </span>
        </div>
      )
    },
    {
      header: translations[lang].orderIndex,
      key: "order_index",
      render: (row: ProjectCategory) => (
        <span className="text-[10px] font-bold text-muted-foreground font-mono px-2 py-1 bg-stone-50 rounded-lg">#{row.order_index}</span>
      )
    }
  ];

  const taxonomyTabs = [
    { id: "identity", label: t("Core", "コア", "Cốt lõi"), icon: Hash },
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
        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-5 md:p-6 shadow-sm mb-6 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 w-full sm:w-64">
             <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-2">Search Vectors</span>
             <div className="relative group">
               <input
                 type="text"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full h-11 pl-11 pr-4 bg-white border border-sage/10 rounded-xl font-bold text-xs shadow-sm focus:border-sage/30 focus:ring-4 focus:ring-sage/5 transition-all outline-none"
                 placeholder="Filter categories..."
               />
               <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-sage transition-colors" size={14} />
             </div>
          </div>

          {/* Bulk Actions Inline */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="flex items-end gap-2 ml-auto sm:ml-2"
              >
                <div className="h-11 w-px bg-sage/15 self-end mx-1 hidden sm:block" />
                
                <div className="h-11 flex items-center gap-2 px-3 bg-sage/10 rounded-xl shrink-0">
                  <div className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center font-black text-[10px]">
                    {selectedIds.length}
                  </div>
                  <button 
                    onClick={() => setSelectedIds([])}
                    className="text-[9px] font-bold uppercase tracking-widest text-sage/60 hover:text-sage transition-colors"
                  >
                    Clear
                  </button>
                </div>

                <button
                  onClick={() => bulkStatusUpdateMutation.mutate({ ids: selectedIds, isPublished: true })}
                  disabled={bulkStatusUpdateMutation.isPending}
                  className="h-11 px-4 rounded-xl bg-white border border-sage/15 text-sage font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-sage hover:text-white hover:border-sage transition-all shadow-sm disabled:opacity-50"
                  title={t("Publish", "公開", "Hiển thị")}
                >
                  <Eye size={13} />
                  <span className="hidden lg:inline">{t("Deploy", "デプロイ", "Triển khai")}</span>
                </button>

                <button
                  onClick={() => bulkStatusUpdateMutation.mutate({ ids: selectedIds, isPublished: false })}
                  disabled={bulkStatusUpdateMutation.isPending}
                  className="h-11 px-4 rounded-xl bg-white border border-sage/15 text-muted-foreground font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-700 hover:text-white hover:border-slate-700 transition-all shadow-sm disabled:opacity-50"
                  title={t("Vault", "保管", "Lưu trữ")}
                >
                  <EyeOff size={13} />
                  <span className="hidden lg:inline">{t("Vault", "保管", "Lưu trữ")}</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(t(`Delete ${selectedIds.length} categories?`, `${selectedIds.length}件削除しますか？`, `Xóa ${selectedIds.length} danh mục?`))) {
                      bulkDeleteMutation.mutate(selectedIds);
                    }
                  }}
                  disabled={bulkDeleteMutation.isPending}
                  className="h-11 px-4 rounded-xl bg-red-50 border border-red-100 text-red-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm disabled:opacity-50"
                  title={t("Delete", "削除", "Xóa")}
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-sm">
          <ResponsiveDataTable
            data={categories}
            columns={columns}
            loading={loading}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            searchTerm={searchTerm}
            searchFields={["name_en", "name_ja", "name_vi", "slug"]}
            onEdit={handleEdit}
            onDelete={(item) => deleteConfirm.openConfirm(item.id, lang === 'ja' ? item.name_ja || item.name_en : lang === 'vi' ? item.name_vi || item.name_en : item.name_en)}
            emptyState={{
              title: t("No categories match your search.", "検索に一致するカテゴリーはありません。", "Không tìm thấy danh mục nào khớp với tìm kiếm."),
              icon: LayoutGrid,
              onReset: () => setSearchTerm("")
            }}
          />
        </div>

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? t("Edit Domain", "ドメインを編集", "Chỉnh sửa Tên miền") : t("Register Domain", "ドメインを登録", "Đăng ký Tên miền")}
          description={t("Set topological boundaries for optimal project classification.", "最適なプロジェクト分類のためのトポロジー境界を設定します。", "Thiết lập ranh giới cấu trúc để phân loại dự án tối ưu.")}
          tabs={taxonomyTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={saving}
          saveLabel={t("Synchronize", "同期する", "Đồng bộ hóa")}
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
              hasDescription: true,
              hasIcon: true,
              statusField: "is_active",
              slugLabel: "Domain Matrix ID"
            }}
          />
        </AdminDialogForm>
      </div>
    </AdminLayout>
  );
};

export default memo(ProjectCategories);
