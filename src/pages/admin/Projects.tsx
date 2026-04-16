"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Project, ProjectCategory } from "@/types/admin";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  GripVertical,
  Star,
  ExternalLink,
  LayoutGrid,
} from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";
import { useLang } from "@/contexts/LangContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ResponsiveDataTable } from "@/components/admin/shared/ResponsiveDataTable";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminLoading } from "@/components/admin/shared/AdminLoading";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Projects = () => {
  const queryClient = useQueryClient();
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProjectIds, setSelectedProjectIds] = useState<(string | number)[]>([]);

  // Load Projects (Point 1)
  const { data: projects = [], isLoading: loading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  // Load Categories
  const { data: categories = [] } = useQuery({
    queryKey: ["project_categories_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_categories")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as ProjectCategory[];
    },
  });

  // Mutation: Toggle Publish (Point 2)
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string, isPublished: boolean }) => {
      const { error } = await supabase.from("projects").update({ is_published: !isPublished }).eq("id", id);
      if (error) throw error;
      return { id, isPublished: !isPublished };
    },
    onMutate: async ({ id, isPublished }) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previous = queryClient.getQueryData<Project[]>(["projects"]);
      queryClient.setQueryData<Project[]>(["projects"], (old) => 
        old?.map(p => p.id === id ? { ...p, is_published: !isPublished } : p)
      );
      return { previous };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(["projects"], context?.previous);
      toast.error("Failed to update status.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    onSuccess: (res) => toast.success(t(`Project is now ${res.isPublished ? "live" : "hidden"}.`, `プロジェクトが${res.isPublished ? "公開" : "非公開"}になりました。`, `Dự án hiện đang ${res.isPublished ? "hiển thị" : "bị ẩn"}.`)),
  });

  // Mutation: Toggle Featured (Point 2)
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string, isFeatured: boolean }) => {
      const { error } = await supabase.from("projects").update({ is_featured: !isFeatured }).eq("id", id);
      if (error) throw error;
      return { id, isFeatured: !isFeatured };
    },
    onMutate: async ({ id, isFeatured }) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previous = queryClient.getQueryData<Project[]>(["projects"]);
      queryClient.setQueryData<Project[]>(["projects"], (old) => 
        old?.map(p => p.id === id ? { ...p, is_featured: !isFeatured } : p)
      );
      return { previous };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(["projects"], context?.previous);
      toast.error(t("Failed to update featured status.", "おすすめステータスの更新に失敗しました。", "Lỗi khi cập nhật trạng thái nổi bật."));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    onSuccess: (res) => toast.success(t(`Project ${res.isFeatured ? "staged for feature" : "unfeatured"}.`, `プロジェクトを${res.isFeatured ? "おすすめに設定" : "おすすめから解除"}しました。`, `Dự án đã ${res.isFeatured ? "được đặt làm nổi bật" : "bỏ nổi bật"}.`)),
  });

  // Mutation: Delete (Point 2)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previous = queryClient.getQueryData<Project[]>(["projects"]);
      queryClient.setQueryData<Project[]>(["projects"], (old) => old?.filter(p => p.id !== id));
      return { previous };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(["projects"], context?.previous);
      toast.error(t("The deletion operation failed.", "削除操作に失敗しました。", "Thao tác xóa thất bại."));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    onSuccess: () => toast.success(translations[lang].deleteSuccess || "Project removed successfully."),
  });

  // Bulk Mutations
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: (string | number)[]) => {
      const { error } = await supabase.from("projects").delete().in("id", ids);
      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setSelectedProjectIds([]);
      toast.success(t(`Deleted ${ids.length} projects.`, `${ids.length}件のプロジェクトを削除しました。`, `Đã xóa ${ids.length} dự án.`));
    },
    onError: () => toast.error(t("Failed to delete projects.", "プロジェクトの削除に失敗しました。", "Xóa dự án thất bại.")),
  });

  const bulkStatusUpdateMutation = useMutation({
    mutationFn: async ({ ids, isPublished }: { ids: (string | number)[], isPublished: boolean }) => {
      const { error } = await supabase.from("projects").update({ is_published: isPublished }).in("id", ids);
      if (error) throw error;
      return { ids, isPublished };
    },
    onSuccess: ({ ids, isPublished }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setSelectedProjectIds([]);
      toast.success(t(
        `${ids.length} projects are now ${isPublished ? "live" : "hidden"}.`,
        `${ids.length}件のプロジェクトを${isPublished ? "公開" : "非公開"}にしました。`,
        `Đã ${isPublished ? "hiển thị" : "ẩn"} ${ids.length} dự án.`
      ));
    },
  });

  const bulkFeaturedUpdateMutation = useMutation({
    mutationFn: async ({ ids, isFeatured }: { ids: (string | number)[], isFeatured: boolean }) => {
      const { error } = await supabase.from("projects").update({ is_featured: isFeatured }).in("id", ids);
      if (error) throw error;
      return { ids, isFeatured };
    },
    onSuccess: ({ ids, isFeatured }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setSelectedProjectIds([]);
      toast.success(t(
        `${ids.length} projects updated.`,
        `${ids.length}件のプロジェクトを更新しました。`,
        `Đã cập nhật ${ids.length} dự án.`
      ));
    },
  });

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setShowForm(true);
  };

  const filteredProjects = useMemo(() => {
    let result = [...projects];
    if (searchTerm) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.title_ja?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCategory && filterCategory !== "all") {
      result = result.filter(p => p.category_id === filterCategory);
    }
    if (filterStatus === "published") {
      result = result.filter(p => p.is_published);
    } else if (filterStatus === "draft") {
      result = result.filter(p => !p.is_published);
    }
    return result;
  }, [projects, searchTerm, filterCategory, filterStatus]);



  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return t("Uncategorized", "未分類", "Chưa phân loại");
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return t("Uncategorized", "未分類", "Chưa phân loại");
    
    const nameEn = category.name_en || (category as any).name;
    const nameJa = category.name_ja || nameEn;
    const nameVi = category.name_vi || nameEn;
    
    return lang === "en" ? nameEn : (lang === "ja" ? nameJa : nameVi) || t("Untitled", "無題", "Chưa đặt tên");
  };

  const columns = [
    {
      header: translations[lang].orderIndex,
      key: "order_index",
      width: "120px",
      render: (project: Project, index: number) => (
        <div className="flex items-center gap-3">
          <GripVertical size={14} className="text-muted-foreground/30" />
          <span className="font-mono text-[10px] font-bold text-muted-foreground/60 tracking-widest">NO.{index + 1}</span>
        </div>
      ),
    },
    {
      header: t("Project Title", "プロジェクト名", "Tên dự án"),
      key: "title",
      width: "400px",
      render: (project: Project) => (
        <div className="flex items-center gap-5 min-w-[280px]">
          <div className="w-16 h-12 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-sage/10 shadow-sm group-hover:scale-110 transition-transform duration-500">
            {project.cover_image_url ? (
              <img src={project.cover_image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted-foreground/20 italic">{t("No Preview", "プレビューなし", "Không có xem trước")}</div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-serif text-sm text-heading leading-tight truncate font-bold">{project.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-sage truncate max-w-[120px]">{getCategoryName(project.category_id)}</span>
              <span className="text-[9px] text-muted-foreground font-mono shrink-0">• {project.year}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: t("Featured", "おすすめ", "Nổi bật"),
      key: "is_featured",
      width: "140px",
      render: (project: Project) => (
        <button
          onClick={() => toggleFeaturedMutation.mutate({ id: project.id, isFeatured: project.is_featured })}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border shadow-sm ${
            project.is_featured ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-white text-muted-foreground/40 border-black/5 hover:border-amber-100 hover:text-amber-500"
          }`}
        >
          <Star size={10} className={project.is_featured ? "fill-current" : ""} />
          {project.is_featured ? t("Featured", "おすすめ", "Nổi bật") : t("No", "いいえ", "Không")}
        </button>
      ),
    },
    {
      header: translations[lang].status,
      key: "is_published",
      width: "140px",
      render: (project: Project) => (
        <button
          onClick={() => togglePublishMutation.mutate({ id: project.id, isPublished: project.is_published })}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border shadow-sm ${
            project.is_published ? "bg-white text-sage border-sage/10" : "bg-red-50 text-red-400 border-red-100"
          }`}
        >
          {project.is_published ? <Eye size={10} className="fill-current opacity-20" /> : <EyeOff size={10} />}
          {project.is_published ? t("Active", "有効", "Hoạt động") : translations[lang].draft}
        </button>
      ),
    },
    {
      header: translations[lang].actions,
      key: "actions",
      width: "140px",
      headerClassName: "text-right",
      className: "text-right",
      render: (project: Project) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <a href={`/project/${project.slug}`} target="_blank" rel="noopener noreferrer" className="h-9 w-9 flex items-center justify-center rounded-xl bg-white shadow-md border border-sage/10 text-heading hover:text-sage hover:scale-110 active:scale-95 transition-all"><ExternalLink size={15} /></a>
          <button onClick={() => handleEdit(project)} className="h-9 w-9 flex items-center justify-center rounded-xl bg-white shadow-md border border-sage/10 text-heading hover:text-sage hover:scale-110 active:scale-95 transition-all"><Edit2 size={15} /></button>
          <button onClick={() => deleteConfirm.openConfirm(project.id, project.title)} className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 border border-red-100 shadow-sm hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 transition-all"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  const renderProjectCard = (project: Project, index: number) => (
    <div className="group bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col gap-6 relative overflow-hidden">
      <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-inner border border-white/20">
        {project.cover_image_url ? (
          <img src={project.cover_image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-sage/5 text-sage/20 font-serif italic">{t("No Preview", "プレビューなし", "Không có xem trước")}</div>
        )}
        <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold text-sage shadow-sm uppercase tracking-tighter">
          #{index + 1}
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
           {project.is_featured && <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-lg"><Star size={12} fill="currentColor" /></div>}
           <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shadow-lg", project.is_published ? "bg-sage text-white" : "bg-red-50 text-red-400")}><Eye size={12} /></div>
        </div>
      </div>
      
      <div className="space-y-3 px-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-widest text-sage bg-sage/5 px-3 py-1 rounded-full">{getCategoryName(project.category_id)}</span>
          <span className="text-[9px] text-muted-foreground font-mono font-bold tracking-widest uppercase">{project.year}</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-heading group-hover:text-sage transition-colors line-clamp-1">{project.title}</h3>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-sage/5">
        <div className="flex gap-2">
           <button onClick={(e) => { e.stopPropagation(); toggleFeaturedMutation.mutate({ id: project.id, isFeatured: project.is_featured }); }} className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", project.is_featured ? "bg-amber-50 text-amber-500 shadow-inner" : "bg-white text-muted-foreground/30 hover:text-amber-500 shadow-sm")}><Star size={16} fill={project.is_featured ? "currentColor" : "none"} /></button>
           <button onClick={(e) => { e.stopPropagation(); togglePublishMutation.mutate({ id: project.id, isPublished: project.is_published }); }} className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", project.is_published ? "bg-sage/5 text-sage" : "bg-red-50 text-red-400")}><Eye size={16} /></button>
        </div>
        <div className="flex gap-2">
           <button onClick={(e) => { e.stopPropagation(); handleEdit(project); }} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-heading hover:text-sage hover:scale-110 active:scale-95 transition-all"><Edit2 size={16} /></button>
           <button onClick={(e) => { e.stopPropagation(); deleteConfirm.openConfirm(project.id, project.title); }} className="w-10 h-10 rounded-xl bg-red-50 text-red-400 shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 transition-all"><Trash2 size={16} /></button>
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
        onConfirm={() => deleteMutation.mutate(deleteConfirm.itemId!)}
        itemName={deleteConfirm.itemName}
        isLoading={deleteMutation.isPending}
      />

      <div className="space-y-12 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={translations[lang].projectsManagement}
          description={t("Manage your portfolio projects.", "ポートフォリオプロジェクトを管理します。", "Quản lý các dự án trong portfolio của bạn.")}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: t("Add Project", "プロジェクトを追加", "Thêm dự án"),
            onClick: () => { setEditingId(null); setShowForm(true); }
          }}
        />



        <div className="space-y-6">
          <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-5 md:p-6 shadow-sm">
            <div className="flex flex-wrap items-end gap-4">
              {/* Category filter */}
              <div className="flex flex-col gap-1.5 w-44">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-2">{t("Category", "カテゴリー", "Danh mục")}</span>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full h-11 px-4 bg-white border border-sage/10 rounded-xl font-bold text-xs shadow-sm">
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
                          {displayName || t("Untitled", "無題", "Chưa đặt tên")}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Status filter */}
              <div className="flex flex-col gap-1.5 w-36">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground px-2">{translations[lang].status}</span>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full h-11 px-4 bg-white border border-sage/10 rounded-xl font-bold text-xs shadow-sm">
                    <SelectValue placeholder={translations[lang].status} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-sage/10 shadow-2xl bg-white/95 backdrop-blur-xl">
                    <SelectItem value="all" className="rounded-xl focus:bg-sage/10 focus:text-heading text-heading font-bold text-xs py-3">{t("All Status", "すべてのステータス", "Tất cả trạng thái")}</SelectItem>
                    <SelectItem value="published" className="rounded-xl focus:bg-sage/10 focus:text-heading text-heading font-bold text-xs py-3">{translations[lang].published}</SelectItem>
                    <SelectItem value="draft" className="rounded-xl focus:bg-sage/10 focus:text-heading text-heading font-bold text-xs py-3">{translations[lang].draft}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions — hiện inline khi có item được chọn */}
              <AnimatePresence>
                {selectedProjectIds.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-end gap-2 ml-2"
                  >
                    {/* Divider */}
                    <div className="h-11 w-px bg-sage/15 self-end" />

                    {/* Selected badge */}
                    <div className="h-11 flex items-center gap-2 px-3 bg-sage/10 rounded-xl shrink-0">
                      <div className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center font-black text-[10px]">
                        {selectedProjectIds.length}
                      </div>
                      <button
                        onClick={() => setSelectedProjectIds([])}
                        className="text-[9px] font-bold uppercase tracking-widest text-sage/60 hover:text-sage transition-colors"
                      >
                        Clear
                      </button>
                    </div>

                    {/* Action buttons */}
                    <button
                      onClick={() => bulkStatusUpdateMutation.mutate({ ids: selectedProjectIds, isPublished: true })}
                      disabled={bulkStatusUpdateMutation.isPending}
                      className="h-11 px-4 rounded-xl bg-white border border-sage/15 text-sage font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-sage hover:text-white hover:border-sage transition-all shadow-sm disabled:opacity-50"
                    >
                      <Eye size={13} />
                      <span className="hidden sm:inline">{t("Publish", "公開", "Hiển thị")}</span>
                    </button>

                    <button
                      onClick={() => bulkStatusUpdateMutation.mutate({ ids: selectedProjectIds, isPublished: false })}
                      disabled={bulkStatusUpdateMutation.isPending}
                      className="h-11 px-4 rounded-xl bg-white border border-sage/15 text-muted-foreground font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-700 hover:text-white hover:border-slate-700 transition-all shadow-sm disabled:opacity-50"
                    >
                      <EyeOff size={13} />
                      <span className="hidden sm:inline">{t("Draft", "非公開", "Nháp")}</span>
                    </button>

                    <button
                      onClick={() => bulkFeaturedUpdateMutation.mutate({ ids: selectedProjectIds, isFeatured: true })}
                      disabled={bulkFeaturedUpdateMutation.isPending}
                      className="h-11 px-4 rounded-xl bg-white border border-amber-200 text-amber-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm disabled:opacity-50"
                    >
                      <Star size={13} />
                      <span className="hidden sm:inline">{t("Feature", "おすすめ", "Nổi bật")}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(t(`Delete ${selectedProjectIds.length} projects?`, `${selectedProjectIds.length}件削除しますか？`, `Xóa ${selectedProjectIds.length} dự án?`))) {
                          bulkDeleteMutation.mutate(selectedProjectIds);
                        }
                      }}
                      disabled={bulkDeleteMutation.isPending}
                      className="h-11 px-4 rounded-xl bg-red-50 border border-red-100 text-red-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="-mx-4 md:mx-0">
            <ResponsiveDataTable
              columns={columns}
              data={filteredProjects}
              draggable
              selectable
              selectedIds={selectedProjectIds}
              onSelectionChange={setSelectedProjectIds}
              renderCard={renderProjectCard}
              emptyState={
                <div className="py-24 text-center bg-white/40 backdrop-blur-xl border border-dashed border-border/50 rounded-[3rem]">
                  <LayoutGrid size={32} className="text-muted-foreground/20 mx-auto mb-6 animate-pulse" />
                  <p className="text-xl font-serif text-heading font-bold italic">{t("No projects found", "プロジェクトが見つかりません", "Không tìm thấy dự án nào")}</p>
                  <p className="text-muted-foreground mt-2 text-sm italic">{t("Adjust your filters or add a new project.", "フィルターを調整するか、新しいプロジェクトを追加してください。", "Điều chỉnh bộ lọc hoặc thêm dự án mới.")}</p>
                </div>
              }
            />
          </div>
        </div>
      </div>


      {showForm && (
        <ProjectForm
          projectId={editingId}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false);
            queryClient.invalidateQueries({ queryKey: ["projects"] });
          }}
        />
      )}
    </AdminLayout>
  );
};

export default Projects;
