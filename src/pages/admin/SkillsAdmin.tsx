"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Search,
  LayoutGrid,
  Image as ImageIcon,
  ChevronDown,
  ListFilter,
  GripVertical,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import type { Skill, SkillCategory } from "@/types/skills";
import { SkillForm } from "@/components/admin/SkillForm";
import { ResponsiveDataTable } from "@/components/admin/shared/ResponsiveDataTable";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminLoading } from "@/components/admin/shared/AdminLoading";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SkillsAdmin = () => {
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setIsRefreshing(true);

      const [skillsRes, categoriesRes] = await Promise.all([
        supabase.from("skills").select("*").order("order_index", { ascending: true }),
        supabase.from("skill_categories").select("*").order("order_index", { ascending: true }),
      ]);

      setSkills(skillsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      toast.error(t("Error fetching data.", "データの取得中にエラーが発生しました。", "Lỗi khi tải dữ liệu."));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      toast.success(t("Skill node decommissioned.", "スキルノードが廃止されました。", "Đã ngừng hoạt động nút kỹ năng."));
      fetchData(true);
    } catch (error) {
      toast.error(t("Error purging node.", "ノードの削除中にエラーが発生しました。", "Lỗi khi xóa nút."));
    }
  };

  // ── Bulk Actions ────────────────────────────────────────────────────────────

  const handleBulkActivate = async () => {
    if (!selectedIds.length) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("skills")
        .update({ is_published: true })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(
        `Published ${selectedIds.length} skills.`,
        `${selectedIds.length}件のスキルを公開しました。`,
        `Đã xuất bản ${selectedIds.length} kỹ năng.`
      ));
      setSelectedIds([]);
      fetchData(true);
    } catch {
      toast.error(t("Failed to publish skills.", "スキルの公開に失敗しました。", "Xuất bản kỹ năng thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (!selectedIds.length) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("skills")
        .update({ is_published: false })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(
        `Hidden ${selectedIds.length} skills.`,
        `${selectedIds.length}件のスキルを非表示にしました。`,
        `Đã ẩn ${selectedIds.length} kỹ năng.`
      ));
      setSelectedIds([]);
      fetchData(true);
    } catch {
      toast.error(t("Failed to hide skills.", "スキルの非表示に失敗しました。", "Ẩn kỹ năng thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    const confirmed = window.confirm(t(
      `Delete ${selectedIds.length} skills? This cannot be undone.`,
      `${selectedIds.length}件のスキルを削除しますか？この操作は取り消せません。`,
      `Xóa ${selectedIds.length} kỹ năng? Hành động này không thể hoàn tác.`
    ));
    if (!confirmed) return;

    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(
        `Deleted ${selectedIds.length} skills.`,
        `${selectedIds.length}件のスキルを削除しました。`,
        `Đã xóa ${selectedIds.length} kỹ năng.`
      ));
      setSelectedIds([]);
      fetchData(true);
    } catch {
      toast.error(t("Failed to delete skills.", "スキルの削除に失敗しました。", "Xóa kỹ năng thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, skill: Skill) => {
    setDraggedItem(String(skill.id));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetSkill: Skill) => {
    e.preventDefault();
    const targetSkillId = String(targetSkill.id);
    if (!draggedItem || draggedItem === targetSkillId) {
      setDraggedItem(null);
      return;
    }
    setIsReordering(true);
    try {
      const draggedIndex = skills.findIndex((s) => String(s.id) === draggedItem);
      const targetIndex = skills.findIndex((s) => String(s.id) === targetSkillId);
      if (draggedIndex === -1 || targetIndex === -1) return;
      
      const newSkills = [...skills];
      const [movedSkill] = newSkills.splice(draggedIndex, 1);
      newSkills.splice(targetIndex, 0, movedSkill);
      
      setSkills(newSkills.map((s, i) => ({ ...s, order_index: i })));
      
      for (let i = 0; i < newSkills.length; i++) {
        await supabase.from("skills").update({ order_index: i }).eq("id", newSkills[i].id);
      }
      toast.success(t("Sequential order updated.", "順序が更新されました。", "Đã cập nhật thứ tự tuần tự."));
    } catch (error) {
      toast.error(t("Error reordering matrix.", "マトリックスの並べ替え中にエラーが発生しました。", "Lỗi khi sắp xếp lại ma trận."));
      fetchData();
    } finally {
      setDraggedItem(null);
      setIsReordering(false);
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesSearch = s.skill_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory && filterCategory !== "all" ? s.category_id === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return t("No Category", "カテゴリーなし", "Không có danh mục");
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return t("No Category", "カテゴリーなし", "Không có danh mục");
    
    // Robust name resolution with fallbacks
    const nameEn = category.name_en || (category as any).name;
    const nameJa = category.name_ja || nameEn;
    const nameVi = category.name_vi || nameEn;

    return lang === "en" ? nameEn : (lang === "ja" ? nameJa : nameVi) || t("Untitled Cluster", "無題のクラスター", "Cụm chưa đặt tên");
  };

  const columns = [
    {
      header: t("Depth Order", "深度順", "Thứ tự chiều sâu"),
      key: "order_index",
      width: "120px",
      render: (skill: Skill, index: number) => (
        <div className="flex items-center gap-3">
          <GripVertical size={14} className="text-muted-foreground/30" />
          <span className="font-mono text-[10px] font-bold text-muted-foreground/60 tracking-widest">NO.{index + 1}</span>
        </div>
      ),
    },
    {
      header: t("Experience Node", "経験ノード", "Nút trải nghiệm"),
      key: "skill_name",
      width: "350px",
      render: (skill: Skill) => (
        <div className="flex items-center gap-5 min-w-[280px]">
          <div className="w-16 h-12 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-sage/10 shadow-sm group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
            {skill.cover_image_url ? (
              <img 
                src={skill.cover_image_url} 
                alt="" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-sage/5">
                <Activity size={18} className="text-sage opacity-40" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-serif text-sm text-heading leading-tight truncate font-bold">{skill.skill_name}</h4>
            <span className="text-[9px] font-bold uppercase tracking-widest text-sage border-b border-sage/5 mt-1 inline-block">{getCategoryName(skill.category_id)}</span>
          </div>
        </div>
      ),
    },
    {
      header: translations[lang].status,
      key: "is_published",
      width: "150px",
      render: (skill: Skill) => (
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 w-fit rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm border border-black/5",
          skill.is_published ? "bg-white text-sage" : "bg-red-50 text-red-400"
        )}>
          {skill.is_published ? <Eye size={10} className="fill-current opacity-20" /> : <EyeOff size={10} />}
          {skill.is_published ? t("Published", "公開済み", "Đã xuất bản") : t("Hidden", "非表示", "Bị ẩn")}
        </div>
      ),
    },
    {
      header: t("Actions", "アクション", "Hành động"),
      key: "actions",
      width: "120px",
      headerClassName: "text-right",
      className: "text-right",
      render: (skill: Skill) => (
        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button onClick={() => handleEdit(skill)} className="h-9 w-9 flex items-center justify-center rounded-xl bg-white shadow-md border border-sage/10 text-heading hover:text-sage hover:scale-110 active:scale-95 transition-all"><Edit3 size={15} /></button>
          <button onClick={() => deleteConfirm.openConfirm(skill.id, skill.skill_name)} className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 border border-red-100 shadow-sm hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 transition-all"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  const renderSkillCard = (skill: Skill, index: number) => (
    <div className="group bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col gap-6 relative overflow-hidden">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-white rounded-[2rem] shadow-inner border border-sage/5 overflow-hidden flex items-center justify-center">
          {skill.cover_image_url ? (
            <img src={skill.cover_image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          ) : (
            <Activity size={24} className="text-muted-foreground/20" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
             <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-sage">{t("Node", "ノード", "Nút")} #{index + 1}</span>
             <div className={cn(
               "w-2 h-2 rounded-full",
               skill.is_published ? "bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]" : "bg-red-400"
             )} />
          </div>
          <h3 className="text-xl font-serif font-bold text-heading group-hover:text-sage transition-colors truncate">{skill.skill_name}</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{getCategoryName(skill.category_id)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-sage/5">
        <div className={cn(
          "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
          skill.is_published ? "bg-sage/5 text-sage" : "bg-red-50 text-red-400"
        )}>
          {skill.is_published ? t("Published", "公開済み", "Đã xuất bản") : t("Hidden", "非表示", "Bị ẩn")}
        </div>
        <div className="flex gap-2">
           <button onClick={() => handleEdit(skill)} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-heading hover:text-sage hover:scale-110 active:scale-95 transition-all"><Edit3 size={16} /></button>
           <button onClick={() => deleteConfirm.openConfirm(skill.id, skill.skill_name)} className="w-10 h-10 rounded-xl bg-red-50 text-red-400 shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 transition-all"><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );

  if (loading) return <AdminLayout><AdminLoading message={translations[lang].loading} /></AdminLayout>;

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={() => handleDelete(deleteConfirm.itemId!)}
        itemName={deleteConfirm.itemName}
      />

      <div className="space-y-12 animate-in fade-in duration-700 pb-12 transition-all">
        <AdminPageHeader
          title={translations[lang].expertiseMatrix}
          description={t("Curate and architect your strategic experience parameters.", "戦略的な経験パラメータをキュレートし、構築します。", "Quản lý và kiến tạo các thông số trải nghiệm chiến lược của bạn.")}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: t("Integrate Node", "ノードを統合", "Tích hợp nút"),
            onClick: () => { setEditingId(null); setShowForm(true); }
          }}
        />

        <div className="space-y-6">
          <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
            <div className="flex flex-wrap items-end gap-6">
               <div className="flex flex-col gap-1.5 w-full lg:w-72">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-2">{t("Category", "カテゴリー", "Danh mục")}</span>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="w-full h-12 px-5 bg-white border border-sage/10 rounded-xl font-bold text-xs shadow-sm focus:ring-2 focus:ring-sage/20 transition-all">
                      <SelectValue placeholder={t("All Categories", "すべてのカテゴリー", "Tất cả danh mục")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-sage/10 shadow-2xl bg-white/95 backdrop-blur-xl">
                      <SelectItem value="all" className="rounded-xl focus:bg-sage/10 focus:text-heading text-heading font-bold text-xs py-3">{t("All Categories", "すべてのカテゴリー", "Tất cả danh mục")}</SelectItem>
                      {categories.map((cat) => {
                        const displayName = lang === "en" 
                          ? (cat.name_en || (cat as any).name) 
                          : (lang === "ja" ? cat.name_ja || cat.name_en || (cat as any).name : cat.name_vi || cat.name_en || (cat as any).name);

                        return (
                          <SelectItem key={cat.id} value={cat.id} className="rounded-xl focus:bg-sage/10 focus:text-heading text-heading font-bold text-xs py-3">
                            {displayName || t("Untitled Cluster", "無題のクラスター", "Cụm chưa đặt tên")}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
               </div>

               {/* Bulk Actions Toolbar */}
               <AnimatePresence>
                 {selectedIds.length > 0 && (
                   <motion.div
                     initial={{ opacity: 0, x: -12 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -12 }}
                     transition={{ duration: 0.2 }}
                     className="flex items-end gap-2 ml-2"
                   >
                     {/* Divider */}
                     <div className="h-12 w-px bg-sage/15 self-end" />

                     {/* Selected badge */}
                     <div className="h-12 flex items-center gap-2.5 px-3.5 bg-sage/10 rounded-xl shrink-0">
                       <div className="w-6 h-6 rounded-full bg-sage text-white flex items-center justify-center font-black text-[10px] shadow-sm">
                         {selectedIds.length}
                       </div>
                       <button
                         onClick={() => setSelectedIds([])}
                         className="text-[9px] font-bold uppercase tracking-widest text-sage/60 hover:text-sage transition-colors"
                       >
                         {t("Clear", "解除", "Xóa")}
                       </button>
                     </div>

                     {/* Action buttons */}
                     <button
                       onClick={handleBulkActivate}
                       disabled={isBulkPending}
                       className="h-12 px-5 rounded-xl bg-white border border-sage/15 text-sage font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-sage hover:text-white hover:border-sage transition-all shadow-sm disabled:opacity-50"
                     >
                       <CheckCircle2 size={13} />
                       <span className="hidden sm:inline">{t("Activate", "有効化", "Kích hoạt")}</span>
                     </button>

                     <button
                       onClick={handleBulkDeactivate}
                       disabled={isBulkPending}
                       className="h-12 px-5 rounded-xl bg-white border border-sage/15 text-muted-foreground font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-700 hover:text-white hover:border-slate-700 transition-all shadow-sm disabled:opacity-50"
                     >
                       <XCircle size={13} />
                       <span className="hidden sm:inline">{t("Hide", "非表示", "Ẩn")}</span>
                     </button>

                     <button
                       onClick={handleBulkDelete}
                       disabled={isBulkPending}
                       className="h-12 px-5 rounded-xl bg-red-50 border border-red-100 text-red-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm disabled:opacity-50"
                     >
                       <Trash2 size={13} />
                       <span className="hidden sm:inline">{t("Delete", "削除", "Xóa")}</span>
                     </button>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>

          <div className="-mx-4 md:mx-0">
            <ResponsiveDataTable
              columns={columns}
              data={filteredSkills}
              draggable
              selectable
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              renderCard={renderSkillCard}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              draggedItemId={draggedItem}
              emptyState={
                <div className="py-24 text-center bg-white/40 backdrop-blur-xl border border-dashed border-border/50 rounded-[3rem]">
                  <LayoutGrid size={32} className="text-muted-foreground/20 mx-auto mb-6 animate-pulse" />
                  <p className="text-xl font-serif text-heading font-bold italic">{t("No expertise nodes found", "専門知識ノードが見つかりません", "Không tìm thấy nút chuyên môn nào")}</p>
                  <p className="text-muted-foreground mt-2 text-sm italic">{t("Adjust filters or integrate a new node.", "フィルターを調整するか、新しいノードを統合してください。", "Điều chỉnh bộ lọc hoặc tích hợp một nút mới.")}</p>
                </div>
              }
            />
          </div>
        </div>
      </div>


      {showForm && (
        <SkillForm
          skillId={editingId}
          categories={categories}
          onClose={() => { setShowForm(false); setEditingId(null); }}
          onSave={() => { setShowForm(false); setEditingId(null); fetchData(true); }}
        />
      )}
    </AdminLayout>
  );
};

export default SkillsAdmin;
