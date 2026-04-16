"use client";

import { useState, memo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { StrategicSkill } from "@/types/admin";
import {
  Zap,
  Star,
  Settings2,
  FileText,
  Globe2,
  ShieldCheck,
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
import { StrategicSkillForm } from "@/components/admin/expertise/StrategicSkillForm";
import { toast } from "sonner";
import { translateFields } from "@/lib/translate";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

const StrategicSkillsManagement = () => {
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

  const { data: skills, loading, saving, upsertData, deleteData } = useAdminCRUD<StrategicSkill>({
    tableName: "expertise_strategic_skills",
    defaultOrderBy: { column: "order_index", ascending: true }
  });

  const [formData, setFormData] = useState<Partial<StrategicSkill>>({
    slug: "",
    skill_name: "",
    skill_name_ja: "",
    skill_name_vi: "",
    description: "",
    description_ja: "",
    description_vi: "",
    icon_name: "Zap",
    icon_url: "",
    order_index: 0,
    is_published: true,
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      slug: "",
      skill_name: "",
      skill_name_ja: "",
      skill_name_vi: "",
      description: "",
      description_ja: "",
      description_vi: "",
      icon_name: "Zap",
      icon_url: "",
      order_index: skills.length,
      is_published: true,
    });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleEdit = (skill: StrategicSkill) => {
    setEditingId(skill.id);
    setFormData({ ...skill });
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const success = await upsertData(formData, editingId || undefined);
    if (success) setIsDialogOpen(false);
  };

  const handleMagicSync = async () => {
    if (!formData.skill_name || !formData.description) {
      toast.error(t("English parameters required for synchronization.", "同期には英語のパラメータが必要です。", "Yêu cầu nội dung tiếng Anh để đồng bộ."));
      return;
    }
    try {
      setIsTranslating(true);
      const translatedJa = await translateFields({
        name: formData.skill_name,
        description: formData.description
      }, "ja");
      const translatedVi = await translateFields({
        name: formData.skill_name,
        description: formData.description
      }, "vi");
      setFormData(prev => ({
        ...prev,
        skill_name_ja: translatedJa.name,
        description_ja: translatedJa.description,
        skill_name_vi: translatedVi.name,
        description_vi: translatedVi.description
      }));
      toast.success(t("Translation synced successfully.", "翻訳が正常に同期されました。", "Đã đồng bộ bản dịch thành công."));
    } catch (error) {
      toast.error(t("Magic Sync failure.", "マジック同期に失敗しました。", "Lỗi đồng bộ tự động."));
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
        .from("expertise_strategic_skills")
        .update({ is_published: published })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Updated ${selectedIds.length} assets.`, `${selectedIds.length}件の資産を更新しました。`, `Đã cập nhật ${selectedIds.length} năng lực.`));
      queryClient.invalidateQueries({ queryKey: ["expertise_strategic_skills"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk update failed.", "一括更新に失敗しました。", "Cập nhật hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(t(`Delete ${selectedIds.length} assets?`, `${selectedIds.length}件の資産を削除しますか？`, `Xóa ${selectedIds.length} năng lực?`))) return;
    
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("expertise_strategic_skills")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Deleted ${selectedIds.length} assets.`, `${selectedIds.length}件の資産を削除しました。`, `Đã xóa ${selectedIds.length} năng lực.`));
      queryClient.invalidateQueries({ queryKey: ["expertise_strategic_skills"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk delete failed.", "一括削除に失敗しました。", "Xóa hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const columns = [
    {
      header: t("Strategic Asset", "戦略的資産", "Tài sản chiến lược"),
      key: "skill_name",
      render: (row: StrategicSkill) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sage/10 rounded-2xl flex items-center justify-center text-sage overflow-hidden p-2 border border-sage/5">
            {row.icon_url ? (
              <img src={row.icon_url} alt="" className="w-full h-full object-contain" />
            ) : (
              <Zap size={20} />
            )}
          </div>
          <div className="max-w-xs text-left">
            <div className="font-bold text-heading line-clamp-1">
              {lang === 'ja' ? row.skill_name_ja || row.skill_name : lang === 'vi' ? row.skill_name_vi || row.skill_name : row.skill_name}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{t("Priority", "優先度", "Độ ưu tiên")} #{row.order_index}</div>
          </div>
        </div>
      )
    },
    {
      header: translations[lang].status,
      key: "is_published",
      render: (row: StrategicSkill) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.is_published ? 'bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]' : 'bg-amber-400'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {row.is_published ? t("Operational", "稼働中", "Đang vận hành") : t("Hidden", "非表示", "Bị ẩn")}
          </span>
        </div>
      )
    }
  ];

  const adminTabs = [
    { id: "identity", label: t("Configuration", "構成", "Cấu hình"), icon: Settings2 },
    { id: "content", label: t("Narrative (EN)", "ナラティブ (EN)", "Nội dung (EN)"), icon: FileText },
    { id: "localization", label: t("Translations", "翻訳", "Bản dịch"), icon: Globe2 },
    { id: "deployment", label: t("Safety", "安全性", "An toàn"), icon: ShieldCheck }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <AdminPageHeader
          title={translations[lang].strategicSkills}
          description={translations[lang].strategicSkillsDescription}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: t("Integrate Asset", "資産を統合", "Tích hợp năng lực"),
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
          data={skills}
          columns={columns}
          loading={loading}
          searchTerm={searchTerm}
          searchFields={["skill_name", "slug", "skill_name_ja", "description", "description_ja"]}
          onEdit={handleEdit}
          onDelete={(item) => deleteData(item.id)}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          emptyState={{
            title: t("No strategic assets match your pursuit.", "追求に一致する戦略的資産はありません。", "Không tìm thấy năng lực chiến lược nào phù hợp."),
            icon: Star,
            onReset: () => setSearchTerm("")
          }}
        />

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? t("Refine Asset", "資産を洗練", "Tinh chỉnh năng lực") : t("Integrate Asset", "資産を統合", "Tích hợp năng lực")}
          description={t("Refine and architect the strategic skill node.", "戦略的スキルノードを洗練し、構築します。", "Tinh chỉnh và kiến tạo nút năng lực chiến lược.")}
          tabs={adminTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={saving}
          saveLabel={translations[lang].save}
          sidebarTitle={t("Asset", "資産", "Năng lực")}
          sidebarSubtitle={t("Skill Settings", "スキル設定", "Thiết lập kỹ năng")}
          sidebarIcon={Zap}
        >
          <StrategicSkillForm
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

export default memo(StrategicSkillsManagement);
