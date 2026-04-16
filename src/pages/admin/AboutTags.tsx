"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { AboutTag } from "@/types/admin";
import {
  Hash,
  Sparkles,
  ShieldCheck,
  Tag as TagIcon,
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

const AboutTags = () => {
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
    data: tags,
    loading,
    saving,
    upsertData,
    deleteData,
  } = useAdminCRUD<AboutTag>({
    tableName: "about_tags",
    defaultOrderBy: { column: "order_index", ascending: true },
  });

  const [formData, setFormData] = useState<Partial<AboutTag>>({
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

  const handleEdit = (tag: AboutTag) => {
    setEditingId(tag.id);
    setFormData({ ...tag });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const success = await upsertData(formData, editingId || undefined);
    if (success) setIsDialogOpen(false);
  };

  // Bulk Actions
  const handleBulkStatus = async (active: boolean) => {
    if (!selectedIds.length) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("about_tags")
        .update({ is_active: active })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(
        t(
          `Updated ${selectedIds.length} tags.`,
          `${selectedIds.length}件のタグを更新しました。`,
          `Đã cập nhật ${selectedIds.length} nhãn.`,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["about_tags"] });
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
          `Delete ${selectedIds.length} tags?`,
          `${selectedIds.length}件のタグを削除しますか？`,
          `Xóa ${selectedIds.length} nhãn?`,
        ),
      )
    )
      return;

    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("about_tags")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(
        t(
          `Deleted ${selectedIds.length} tags.`,
          `${selectedIds.length}件のタグを削除しました。`,
          `Đã xóa ${selectedIds.length} nhãn.`,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["about_tags"] });
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
      header: t("Tag", "タグ", "Nhãn"),
      key: "name_en",
      render: (row: AboutTag) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center text-sage overflow-hidden">
            {row.icon_url ? (
              <img
                src={row.icon_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <TagIcon size={18} />
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
      header: translations[lang].status,
      key: "is_active",
      render: (row: AboutTag) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${row.is_active ? "bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]" : "bg-amber-400"}`}
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {row.is_active
              ? t("Active", "有効", "Hoạt động")
              : t("Disabled", "無効", "Vô hiệu")}
          </span>
        </div>
      ),
    },
    {
      header: translations[lang].orderIndex,
      key: "order_index",
      render: (row: AboutTag) => (
        <span className="text-[10px] font-bold text-muted-foreground">
          #{row.order_index}
        </span>
      ),
    },
  ];

  const taxonomyTabs = [
    { id: "identity", label: t("Core", "コア", "Cốt lõi"), icon: Hash },
    {
      id: "visuals",
      label: t("Media", "メディア", "Phương tiện"),
      icon: Sparkles,
    },
    {
      id: "protocols",
      label: t("Indexing", "インデックス", "Chỉ mục"),
      icon: ShieldCheck,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <AdminPageHeader
          title={translations[lang].aboutTags}
          description={translations[lang].aboutTagsDescription}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: t("Integrate Tag", "タグを統合", "Tích hợp nhãn"),
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

        <ResponsiveDataTable
          data={tags}
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
            title: t(
              "No tags match your search.",
              "検索に一致するタグはありません。",
              "Không tìm thấy nhãn nào khớp với tìm kiếm.",
            ),
            icon: TagIcon,
            onReset: () => setSearchTerm(""),
          }}
        />

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={
            editingId
              ? t("Refine Tag", "タグを洗練", "Tinh chỉnh nhãn")
              : t("Integrate Tag", "タグを統合", "Tích hợp nhãn")
          }
          description={t(
            "Refine and architect the about tag vector.",
            "アバウトタグのベクトルを洗練し、構築します。",
            "Tinh chỉnh và kiến tạo tập hợp nhãn giới thiệu.",
          )}
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
            config={{
              hasI18n: true,
              hasDescription: true,
              hasIcon: true,
              statusField: "is_active",
              slugLabel: t(
                "Unique Identification Slug",
                "ユニークな識別スラッグ",
                "Slug định danh duy nhất",
              ),
            }}
          />
        </AdminDialogForm>
      </div>
    </AdminLayout>
  );
};

export default AboutTags;
