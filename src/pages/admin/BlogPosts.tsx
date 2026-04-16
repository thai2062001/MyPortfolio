"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { BlogPost, BlogCategory } from "@/types/admin";
import {
  Plus, Edit2, Trash2, Search, BookOpen,
  Calendar, Clock, Send, Archive, FileText,
  Filter, LayoutGrid, ChevronRight, CheckCircle2, XCircle
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ResponsiveDataTable } from "@/components/admin/shared/ResponsiveDataTable";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminLoading } from "@/components/admin/shared/AdminLoading";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Optimized Status Badge Component
const StatusBadge = memo(({ status, t }: { status: BlogPost['status'], t: any }) => {
  const configs = {
    published: { color: "emerald", icon: Send, label: t("Published", "公開済み", "Đã đăng") },
    scheduled: { color: "amber", icon: Calendar, label: t("Scheduled", "予定済み", "Đã hẹn giờ") },
    archived: { color: "slate", icon: Archive, label: t("Archived", "アーカイブ済み", "Đã lưu trữ") },
    draft: { color: "blue", icon: Edit2, label: t("Draft", "下書き", "Bản nháp") },
  };

  const config = configs[status] || configs.draft;
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest",
      config.color === "emerald" && "bg-emerald-50 text-emerald-600 border-emerald-100",
      config.color === "amber" && "bg-amber-50 text-amber-600 border-amber-100",
      config.color === "slate" && "bg-slate-100 text-slate-500 border-slate-200",
      config.color === "blue" && "bg-blue-50 text-blue-500 border-blue-100",
    )}>
      <Icon size={10} strokeWidth={3} />
      {config.label}
    </div>
  );
});

StatusBadge.displayName = "StatusBadge";

const BlogPosts = () => {
  const queryClient = useQueryClient();
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // Fetch logic with better error handling
  const { data: posts = [], isLoading: loading } = useQuery({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`*, blog_categories (id, name_en, name_ja, name_vi)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (BlogPost & { blog_categories: BlogCategory })[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["blog_categories_list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_categories").select("*").order("order_index");
      if (error) throw error;
      return data as BlogCategory[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success(translations[lang].deleteSuccess || "Post sequence detached.");
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    },
  });

  // Bulk mutations
  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: (string | number)[], status: BlogPost['status'] }) => {
      const { error } = await supabase.from("blog_posts").update({ status }).in("id", ids);
      if (error) throw error;
      return { ids, status };
    },
    onSuccess: ({ ids, status }) => {
      toast.success(t(
        `Updated ${ids.length} posts to ${status}.`,
        `${ids.length}件の記事を${status}に更新しました。`,
        `Đã cập nhật ${ids.length} bài viết thành ${status}.`
      ));
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    },
    onError: () => toast.error(t("Bulk update failed.", "一括更新に失敗しました。", "Cập nhật hàng loạt thất bại."))
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: (string | number)[]) => {
      const { error } = await supabase.from("blog_posts").delete().in("id", ids);
      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      toast.success(t(`Deleted ${ids.length} posts.`, `${ids.length}件の記事を削除しました。`, `Đã xóa ${ids.length} bài viết.`));
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    },
    onError: () => toast.error(t("Bulk deletion failed.", "一括削除に失敗しました。", "Xóa hàng loạt thất bại."))
  });

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchesSearch = !searchTerm || [p.title_en, p.title_ja, p.title_vi, p.slug]
        .some(val => val?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === "all" || p.category_id === filterCategory;
      const matchesStatus = filterStatus === "all" || p.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, searchTerm, filterCategory, filterStatus]);

  // Memoized columns for table performance
  const columns = useMemo(() => [
    {
      header: translations[lang].title,
      key: "title_en",
      render: (post: BlogPost & { blog_categories: BlogCategory }) => (
        <div className="flex items-center gap-4 min-w-[320px] group/item">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 overflow-hidden flex-shrink-0 border border-sage/10 shadow-sm transition-transform group-hover/item:scale-105 duration-500">
            {post.cover_image_url ? (
              <img src={post.cover_image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <FileText size={20} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-serif text-sm text-heading leading-tight truncate font-bold group-hover/item:text-sage transition-colors">
              {lang === 'ja' ? post.title_ja || post.title_en : lang === 'vi' ? post.title_vi || post.title_en : post.title_en}
            </h4>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[8px] font-black uppercase tracking-[0.1em] text-sage px-2 py-0.5 bg-sage/5 border border-sage/10 rounded-md">
                {post.blog_categories ? (lang === 'ja' ? post.blog_categories.name_ja || post.blog_categories.name_en : lang === 'vi' ? post.blog_categories.name_vi || post.blog_categories.name_en : post.blog_categories.name_en) : "General"}
              </span>
              <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-1 opacity-60">
                <Clock size={8} /> {post.reading_time || 5}min
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: translations[lang].status,
      key: "status",
      render: (post: BlogPost) => <StatusBadge status={post.status} t={t} />
    },
    {
      header: t("Date", "日付", "Ngày"),
      key: "created_at",
      render: (post: BlogPost) => (
        <div className="text-[10px] font-mono text-muted-foreground font-black uppercase tracking-tighter opacity-70">
          {new Date(post.published_at || post.created_at).toLocaleDateString(lang === 'ja' ? 'ja-JP' : lang === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          })}
        </div>
      )
    },
    {
      header: translations[lang].actions,
      key: "actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (post: BlogPost) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={() => navigate(`/admin/blog/posts/edit/${post.id}`)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-lg border border-sage/10 text-heading hover:text-sage hover:scale-110 active:scale-95 transition-all"
            title="Edit Post"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => deleteConfirm.openConfirm(post.id, post.title_en)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 border border-red-100 shadow-sm hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 transition-all"
            title="Delete Post"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], [lang, translations, t, navigate, deleteConfirm]);

  if (loading) return <AdminLayout><AdminLoading message="Querying Publication Nodes..." /></AdminLayout>;

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={() => deleteMutation.mutate(deleteConfirm.itemId!)}
        itemName={deleteConfirm.itemName}
        isLoading={deleteMutation.isPending}
      />

      <div className="space-y-10 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={translations[lang].blogPostsManagement}
          description="Orchestrate your narrative content and publication sequence."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{
            label: t("Compose Story", "作曲", "Soạn thảo"),
            onClick: () => navigate("/admin/blog/posts/new"),
            icon: Plus
          }}
        />

        {/* Filters Section */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-end gap-6 w-full lg:w-auto">
              <div className="space-y-2 w-full sm:w-64">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2 flex items-center gap-2">
                  <Filter size={10} /> {t("Category", "カテゴリー", "Danh mục")}
                </p>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-12 bg-white/60 border-sage/10 rounded-xl font-bold text-xs ring-offset-0 focus:ring-sage/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-sage/10 shadow-2xl bg-white/95 backdrop-blur-xl">
                    <SelectItem value="all" className="rounded-xl font-bold text-xs py-3">All Narratives</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="rounded-xl font-bold text-xs py-3">
                        {lang === "ja" ? cat.name_ja || cat.name_en : lang === "vi" ? cat.name_vi || cat.name_en : cat.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full sm:w-56">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2 flex items-center gap-2">
                  <Clock size={10} /> {translations[lang].status}
                </p>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-12 bg-white/60 border-sage/10 rounded-xl font-bold text-xs ring-offset-0 focus:ring-sage/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-sage/10 shadow-2xl bg-white/95 backdrop-blur-xl">
                    <SelectItem value="all" className="rounded-xl font-bold text-xs py-3">Global Status</SelectItem>
                    {['published', 'draft', 'scheduled', 'archived'].map(s => (
                      <SelectItem key={s} value={s} className="rounded-xl font-bold text-xs py-3 capitalize">{s}</SelectItem>
                    ))}
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
                    <div className="h-12 w-px bg-sage/15 self-end" />
                    
                    <div className="h-12 flex items-center gap-2 px-3.5 bg-sage/10 rounded-xl shrink-0">
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

                    <button
                      onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: 'published' })}
                      disabled={bulkStatusMutation.isPending}
                      className="h-12 px-5 rounded-xl bg-white border border-emerald-100 text-emerald-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                    >
                      <Send size={13} />
                      <span className="hidden sm:inline">{t("Publish", "公開", "Đăng")}</span>
                    </button>

                    <button
                      onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: 'draft' })}
                      disabled={bulkStatusMutation.isPending}
                      className="h-12 px-5 rounded-xl bg-white border border-blue-100 text-blue-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all shadow-sm disabled:opacity-50"
                    >
                      <Edit2 size={13} />
                      <span className="hidden sm:inline">{t("Draft", "下書き", "Nháp")}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(t(`Delete ${selectedIds.length} posts?`, `${selectedIds.length}件の記事を削除しますか？`, `Xóa ${selectedIds.length} bài viết?`))) {
                          bulkDeleteMutation.mutate(selectedIds);
                        }
                      }}
                      disabled={bulkDeleteMutation.isPending}
                      className="h-12 px-5 rounded-xl bg-red-50 border border-red-100 text-red-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="hidden lg:flex items-center gap-4 text-muted-foreground/30">
              <LayoutGrid size={24} strokeWidth={1} />
              <div className="h-8 w-px bg-stone-200" />
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest">{filteredPosts.length}</span>
                <span className="text-[8px] font-bold uppercase opacity-60">Total Nodes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="-mx-4 md:mx-0 shadow-2xl shadow-stone-200/50 rounded-[2.5rem] overflow-hidden">
          <ResponsiveDataTable
            columns={columns}
            data={filteredPosts}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            emptyState={
              <div className="py-32 text-center bg-white/40 backdrop-blur-xl border border-dashed border-stone-200 rounded-[3rem]">
                <BookOpen size={40} className="text-sage/20 mx-auto mb-6 animate-bounce" />
                <h3 className="text-2xl font-serif text-heading font-black italic">{t("No stories found", "物語が見つかりません", "Không tìm thấy câu chuyện")}</h3>
                <p className="text-muted-foreground mt-3 text-sm font-medium">Be the architect of your own narrative.</p>
                <Button onClick={() => navigate("/admin/blog/posts/new")} className="mt-8 bg-sage text-white rounded-full px-8 h-12 text-[10px] font-black uppercase tracking-widest">
                  Create First Node
                </Button>
              </div>
            }
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default memo(BlogPosts);
