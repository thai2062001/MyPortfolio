"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { SkillCategory } from "@/types/skills";
import {
  Hash,
  Sparkles,
  ShieldCheck,
  Layers,
  LayoutGrid,
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

const SkillCategoriesAdmin = () => {
  const { lang, translations, t } = useLang();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("identity");
  const [searchTerm, setSearchTerm] = useState("");

  // Selection
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  const {
    data: categories,
    loading,
    saving,
    upsertData,
    deleteData,
  } = useAdminCRUD<SkillCategory>({
    tableName: "skill_categories",
    defaultOrderBy: { column: "order_index", ascending: true },
  });

  const [formData, setFormData] = useState<Partial<SkillCategory>>({
    slug: "",
    name_en: "",
    name_ja: "",
    name_vi: "",
    description: "",
    icon_url: "",
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
      description: "",
      icon_url: "",
      order_index: categories.length,
      is_published: true,
    });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleEdit = (category: SkillCategory) => {
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
      slug: "sample-skill-category",
      name_en: "Frontend Engineering",
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
        .from("skill_categories")
        .update({ is_published: published })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(
        t(
          `Updated ${selectedIds.length} categories.`,
          `${selectedIds.length}件のカテゴリーを更新しました。`,
          `Đã cập nhật ${selectedIds.length} danh mục.`,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["skill_categories"] });
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
          `Delete ${selectedIds.length} categories?`,
          `${selectedIds.length}件のカテゴリーを削除しますか？`,
          `Xóa ${selectedIds.length} danh mục?`,
        ),
      )
    )
      return;

    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("skill_categories")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(
        t(
          `Deleted ${selectedIds.length} categories.`,
          `${selectedIds.length}件のカテゴリーを削除しました。`,
          `Đã xóa ${selectedIds.length} danh mục.`,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["skill_categories"] });
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
      header: "Category",
      key: "name_en",
      render: (row: SkillCategory) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sage/5 rounded-xl flex items-center justify-center text-sage border border-sage/10 group-hover:scale-110 transition-transform duration-500">
            {row.icon_url ? (
              <img
                src={row.icon_url}
                alt=""
                className="w-6 h-6 object-contain"
              />
            ) : (
              <Layers size={18} />
            )}
          </div>
          <div className="text-left">
            <div className="font-bold text-heading">
              {lang === "ja"
                ? row.name_ja || row.name_en
                : lang === "vi"
                  ? row.name_vi || row.name_en
                  : row.name_en}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
              ID: {row.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      key: "is_published",
      render: (row: SkillCategory) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${row.is_published ? "bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]" : "bg-amber-400"}`}
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {row.is_published ? "Published" : "Vaulted"}
          </span>
        </div>
      ),
    },
    {
      header: "Order",
      key: "order_index",
      render: (row: SkillCategory) => (
        <span className="text-[10px] font-bold text-muted-foreground">
          #{row.order_index}
        </span>
      ),
    },
  ];

  const taxonomyTabs = [
    { id: "identity", label: "Core Layer", icon: Hash },
    { id: "visuals", label: "Iconography", icon: Sparkles },
    { id: "protocols", label: "Deployment", icon: ShieldCheck },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <AdminPageHeader
          title={translations[lang].skillTaxonomy}
          description={translations[lang].skillTaxonomyDescription}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: "Integrate Cluster",
            onClick: handleAdd,
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

        <ResponsiveDataTable
          data={categories}
          columns={columns}
          loading={loading}
          searchTerm={searchTerm}
          searchFields={["name_en", "name_ja", "slug"]}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={handleEdit}
          onDelete={(item) => deleteData(item.id)}
          emptyState={{
            title: "No skill categories match your search.",
            icon: LayoutGrid,
            onReset: () => setSearchTerm(""),
          }}
        />

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? "Refine Cluster" : "Integrate Cluster"}
          description="Refine and architect the core methodology node."
          tabs={taxonomyTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={saving}
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
              statusField: "is_published",
              slugLabel: "Slug",
            }}
          />
        </AdminDialogForm>
      </div>
    </AdminLayout>
  );
};

export default SkillCategoriesAdmin;
