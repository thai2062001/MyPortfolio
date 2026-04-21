"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ProjectTag } from "@/types/admin";
import {
  Hash,
  Sparkles,
  ShieldCheck,
  Tag as TagIcon,
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
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ProjectTags = () => {
  const { lang, translations, t } = useLang();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("identity");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  const { data: tags, loading, saving, upsertData, deleteData } = useAdminCRUD<ProjectTag>({
    tableName: "project_tags",
    defaultOrderBy: { column: "order_index", ascending: true }
  });

  const [formData, setFormData] = useState<Partial<ProjectTag>>({
    slug: "",
    name_en: "",
    name_ja: "",
    name_vi: "",
    description: "",
    icon_url: "",
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
      description: "",
      icon_url: "",
      order_index: tags.length,
      is_active: true,
    });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleEdit = (tag: ProjectTag) => {
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
      slug: "sample-tag-react",
      name_en: "React",
      is_active: true,
    }));
    toast.success(t("Sample data injected!", "サンプルデータが入力されました！", "Dữ liệu mẫu đã được điền!"));
  };

  // ── Bulk Actions ────────────────────────────────────────────────────────────

  const handleBulkActivate = async () => {
    if (!selectedIds.length) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("project_tags")
        .update({ is_active: true })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(
        `Activated ${selectedIds.length} tags.`,
        `${selectedIds.length}件のタグを有効にしました。`,
        `Đã kích hoạt ${selectedIds.length} nhãn.`
      ));
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["project_tags"] });
    } catch {
      toast.error(t("Failed to activate tags.", "タグの有効化に失敗しました。", "Kích hoạt nhãn thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (!selectedIds.length) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("project_tags")
        .update({ is_active: false })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(
        `Deactivated ${selectedIds.length} tags.`,
        `${selectedIds.length}件のタグを無効にしました。`,
        `Đã vô hiệu hóa ${selectedIds.length} nhãn.`
      ));
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["project_tags"] });
    } catch {
      toast.error(t("Failed to deactivate tags.", "タグの無効化に失敗しました。", "Vô hiệu hóa nhãn thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    const confirmed = window.confirm(t(
      `Delete ${selectedIds.length} tags? This cannot be undone.`,
      `${selectedIds.length}件のタグを削除しますか？この操作は取り消せません。`,
      `Xóa ${selectedIds.length} nhãn? Hành động này không thể hoàn tác.`
    ));
    if (!confirmed) return;

    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("project_tags")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(
        `Deleted ${selectedIds.length} tags.`,
        `${selectedIds.length}件のタグを削除しました。`,
        `Đã xóa ${selectedIds.length} nhãn.`
      ));
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["project_tags"] });
    } catch {
      toast.error(t("Failed to delete tags.", "タグの削除に失敗しました。", "Xóa nhãn thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  // ── Columns ─────────────────────────────────────────────────────────────────

  const columns = [
    {
      header: t("Tag", "タグ", "Nhãn"),
      key: "name_en",
      render: (row: ProjectTag) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center text-sage overflow-hidden">
            {row.icon_url ? (
              <img src={row.icon_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <TagIcon size={18} />
            )}
          </div>
          <div className="text-left">
            <div className="font-bold text-heading">{lang === 'ja' ? row.name_ja || row.name_en : lang === 'vi' ? row.name_vi || row.name_en : row.name_en}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">ID: {row.slug}</div>
          </div>
        </div>
      )
    },
    {
      header: translations[lang].status,
      key: "is_active",
      render: (row: ProjectTag) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.is_active ? 'bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]' : 'bg-amber-400'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {row.is_active ? t("Active", "有効", "Hoạt động") : t("Disabled", "無効", "Vô hiệu")}
          </span>
        </div>
      )
    },
    {
      header: translations[lang].orderIndex,
      key: "order_index",
      render: (row: ProjectTag) => (
        <span className="text-[10px] font-bold text-muted-foreground">#{row.order_index}</span>
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
      <div className="space-y-8 animate-in fade-in duration-700">
        <AdminPageHeader
          title={translations[lang].projectTags}
          description={translations[lang].projectTagsDescription}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: t("Integrate Tag", "タグを統合", "Tích hợp nhãn"),
            onClick: handleAdd
          }}
        />

        {/* ── Bulk Action Toolbar ─────────────────────────────────────────── */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] px-6 py-4 shadow-sm flex flex-wrap items-center gap-3"
            >
              {/* Count badge */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="w-7 h-7 rounded-full bg-sage text-white flex items-center justify-center font-black text-[11px] shadow-md shadow-sage/30">
                  {selectedIds.length}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-heading/60">
                  {t("selected", "件選択中", "đã chọn")}
                </span>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-[9px] font-bold uppercase tracking-widest text-sage/50 hover:text-sage transition-colors ml-1"
                >
                  {t("Clear", "解除", "Bỏ chọn")}
                </button>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-sage/15 mx-1" />

              {/* Activate */}
              <button
                onClick={handleBulkActivate}
                disabled={isBulkPending}
                className="h-10 px-4 rounded-xl bg-white border border-sage/20 text-sage font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-sage hover:text-white hover:border-sage transition-all shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 size={13} />
                <span className="hidden sm:inline">{t("Activate", "有効化", "Kích hoạt")}</span>
              </button>

              {/* Deactivate */}
              <button
                onClick={handleBulkDeactivate}
                disabled={isBulkPending}
                className="h-10 px-4 rounded-xl bg-white border border-amber-200 text-amber-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm disabled:opacity-50"
              >
                <XCircle size={13} />
                <span className="hidden sm:inline">{t("Deactivate", "無効化", "Vô hiệu hóa")}</span>
              </button>

              {/* Delete */}
              <button
                onClick={handleBulkDelete}
                disabled={isBulkPending}
                className="h-10 px-4 rounded-xl bg-red-50 border border-red-100 text-red-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm disabled:opacity-50"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">{t("Delete", "削除", "Xóa")}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Data Table ─────────────────────────────────────────────────── */}
        <ResponsiveDataTable
          data={tags}
          columns={columns}
          loading={loading}
          searchTerm={searchTerm}
          searchFields={["name_en", "name_ja", "slug"]}
          onEdit={handleEdit}
          onDelete={(item) => deleteData(item.id)}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          emptyState={{
            title: t("No tags match your search.", "検索に一致するタグはありません。", "Không tìm thấy nhãn nào khớp với tìm kiếm."),
            icon: TagIcon,
            onReset: () => setSearchTerm("")
          }}
        />

        {/* ── Dialog Form ────────────────────────────────────────────────── */}
        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? t("Refine Tag", "タグを洗練", "Tinh chỉnh nhãn") : t("Integrate Tag", "タグを統合", "Tích hợp nhãn")}
          description={t("Refine and architect the project tag vector.", "プロジェクトタグのベクトルを洗練し、構築します。", "Tinh chỉnh và kiến tạo tập hợp nhãn dự án.")}
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
              hasDescription: true,
              hasIcon: true,
              statusField: "is_active",
              slugLabel: t("Unique Identification Slug", "ユニークな識別スラッグ", "Slug định danh duy nhất")
            }}
          />
        </AdminDialogForm>
      </div>
    </AdminLayout>
  );
};

export default ProjectTags;
