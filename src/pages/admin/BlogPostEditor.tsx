"use client";

import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { BlogPost, BlogCategory, BlogTag } from "@/types/admin";
import {
  Plus, Check, Save, ChevronLeft,
  Settings, FileText, Globe, Image as ImageIcon,
  Calendar, Clock, Send, Star, Wand2, Tag as TagIcon,
  CircleDashed,
  Target,
  Eye
} from "lucide-react";
import BlogPreviewModal from "@/components/admin/blog/BlogPreviewModal";
import { MediaInput } from "@/components/admin/media/MediaInput";
import { useLang } from "@/contexts/LangContext";
import { translateText } from "@/lib/translate";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminFormSection, AdminField } from "@/components/admin/shared/AdminFormSection";
import { AdminLoading } from "@/components/admin/shared/AdminLoading";
import { TiptapEditor } from "@/components/admin/shared/TiptapEditor";
import { DateTimePicker } from "@/components/admin/shared/DateTimePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Sub-component for individual language content to clean up the main JSX
const LanguageTabContent = memo(({
  title,
  titleValue,
  onTitleChange,
  excerptValue,
  onExcerptChange,
  contentValue,
  onContentChange,
  placeholder,
  langLabel
}: {
  title: string;
  titleValue: string;
  onTitleChange: (val: string) => void;
  excerptValue: string;
  onExcerptChange: (val: string) => void;
  contentValue: string;
  onContentChange: (html: string) => void;
  placeholder?: string;
  langLabel: string;
}) => (
  <div className="space-y-12 max-w-4xl animate-in fade-in duration-500">
    <AdminFormSection title={title}>
      <AdminField label={`Title (${langLabel})`}>
        <Input
          value={titleValue}
          onChange={(e) => onTitleChange(e.target.value)}
          className="h-16 px-8 bg-white/70 border border-sage/20 rounded-2xl font-serif font-bold text-lg shadow-sm focus:ring-sage/20 transition-all"
        />
      </AdminField>
      <AdminField label={`Excerpt (Summary - ${langLabel})`}>
        <Textarea
          value={excerptValue}
          onChange={(e) => onExcerptChange(e.target.value)}
          rows={3}
          className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-bold text-sm shadow-sm focus:ring-sage/20 transition-all resize-none"
        />
      </AdminField>
      <AdminField label={`Narrative Content (${langLabel})`}>
        <TiptapEditor
          content={contentValue}
          onChange={onContentChange}
          placeholder={placeholder}
        />
      </AdminField>
    </AdminFormSection>
  </div>
));

LanguageTabContent.displayName = "LanguageTabContent";

const BlogPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { lang, translations, t } = useLang();

  const [activeTab, setActiveTab] = useState<string>("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [post, setPost] = useState<Partial<BlogPost>>({
    slug: "",
    title_en: "",
    title_ja: "",
    title_vi: "",
    excerpt_en: "",
    excerpt_ja: "",
    excerpt_vi: "",
    content_en: "",
    content_ja: "",
    content_vi: "",
    category_id: null,
    cover_image_url: "",
    status: 'draft',
    is_featured: false,
    reading_time: 5,
    seo_title_en: "",
    seo_description_en: "",
    published_at: null,
  });

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Queries
  const { data: categories = [] } = useQuery({
    queryKey: ["blog_categories_list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_categories").select("*").order("order_index");
      if (error) throw error;
      return data as BlogCategory[];
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["blog_tags_list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_tags").select("*").order("order_index");
      if (error) throw error;
      return data as BlogTag[];
    },
  });

  useEffect(() => {
    if (id && id !== "new") {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;
          setPost(data);

          const { data: tagData, error: tagError } = await supabase
            .from("blog_post_tags")
            .select("tag_id")
            .eq("post_id", id);

          if (!tagError && tagData) {
            setSelectedTagIds(tagData.map((t: any) => t.tag_id));
          }
        } catch (error) {
          toast.error("Failed to load post node.");
          navigate("/admin/blog/posts");
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, navigate]);

  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }, []);

  const handleAutoTranslate = async () => {
    if (!post.title_en) {
      toast.error("English content required for synchronization.");
      return;
    }

    try {
      setIsTranslating(true);
      const [titleJa, titleVi, excerptJa, excerptVi, contentJa, contentVi] = await Promise.all([
        translateText(post.title_en, "ja"),
        translateText(post.title_en, "vi"),
        post.excerpt_en ? translateText(post.excerpt_en, "ja") : Promise.resolve(""),
        post.excerpt_en ? translateText(post.excerpt_en, "vi") : Promise.resolve(""),
        post.content_en ? translateText(post.content_en, "ja") : Promise.resolve(""),
        post.content_en ? translateText(post.content_en, "vi") : Promise.resolve(""),
      ]);

      setPost(prev => ({
        ...prev,
        title_ja: titleJa,
        title_vi: titleVi,
        excerpt_ja: excerptJa,
        excerpt_vi: excerptVi,
        content_ja: contentJa,
        content_vi: contentVi,
      }));

      toast.success("Linguistic synthesis completed.");
    } catch (error) {
      toast.error("Translation logic failure.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleFillSampleData = () => {
    setPost(prev => ({
      ...prev,
      slug: "sample-blog-post",
      title_en: "The Future of Web Development with AI",
      excerpt_en: "Exploring how artificial intelligence is shaping the way we build web applications in 2026.",
      content_en: "<h2>Introduction</h2><p>AI is no longer just a buzzword. It's an essential tool for creating modern, complex web applications quickly. From generating boilerplate to refining code structures, AI has changed the landscape entirely.</p><h2>The Next Steps</h2><p>Integrating AI naturally throughout our development process allows developers to focus on higher-level architectural decisions and user experience.</p>",
      cover_image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80",
      status: "draft",
      seo_title_en: "AI Web Development Future",
      seo_description_en: "Learn about the impact of AI on modern web development practices.",
    }));
    toast.success("Sample data injected!", { duration: 2000 });
  };

  const handleSubmit = async () => {
    if (!post.title_en || !post.slug) {
      toast.error("Title and slug are mandatory for indexing.");
      return;
    }

    try {
      setSaving(true);
      const postData = { ...post };
      if (postData.status === 'published' && !postData.published_at) {
        postData.published_at = new Date().toISOString();
      }

      const isNew = !id || id === "new";
      let postId = id;

      if (isNew) {
        const { data, error } = await supabase.from("blog_posts").insert([postData]).select().single();
        if (error) throw error;
        postId = data.id;
      } else {
        const { error } = await supabase.from("blog_posts").update(postData).eq("id", id);
        if (error) throw error;
      }

      if (postId) {
        await supabase.from("blog_post_tags").delete().eq("post_id", postId);
        if (selectedTagIds.length > 0) {
          const tagEntries = selectedTagIds.map(tagId => ({ post_id: postId, tag_id: tagId }));
          await supabase.from("blog_post_tags").insert(tagEntries);
        }
      }

      toast.success("Post node synchronized successfully.");
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
      navigate("/admin/blog/posts");
    } catch (error) {
      toast.error("Database synchronization failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]);
  };

  const tabList = useMemo(() => [
    { id: "general", label: t("General", "全般", "Cơ bản"), icon: Settings },
    { id: "content_en", label: "EN Content", icon: FileText },
    { id: "content_ja", label: "JA Content", icon: Globe },
    { id: "content_vi", label: "VI Content", icon: Globe },
    { id: "media", label: t("Media", "メディア", "Phương tiện"), icon: ImageIcon },
    { id: "seo", label: "SEO", icon: Target }
  ], [t]);

  if (loading) return <AdminLayout><AdminLoading message="Reading Post Metadata..." /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-10 md:pb-20 animate-in fade-in duration-700 px-4 md:px-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-xl border border-white/40 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/admin/blog/posts")}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-sage/10 text-heading hover:text-sage hover:scale-110 active:scale-95 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-heading">
                {id === "new" ? t("New Story", "新しいストーリー", "Câu chuyện mới") : t("Refine Story", "ストーリーを洗練", "Tinh chỉnh câu chuyện")}
              </h1>
              <p className="text-[10px] text-muted-foreground font-black mt-1 uppercase tracking-[0.2em] opacity-40">
                {id === "new" ? "New Publication Node" : `UUID: ${id}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {id === "new" && (
              <Button variant="outline" onClick={handleFillSampleData} className="h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest border-sage/10 bg-white/50 hover:bg-sage/5 hover:text-sage transition-all">
                <Wand2 size={18} className="mr-2" />
                {t("FILL SAMPLE", "サンプルを入力", "ĐIỀN MẪU")}
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest border-sage/10 bg-white/50 hover:bg-sage/5 hover:text-sage transition-all">
              <Eye size={18} className="mr-2" />
              {t("PREVIEW", "プレビュー", "XEM TRƯỚC")}
            </Button>
            <Button onClick={handleSubmit} disabled={saving} className="h-12 md:h-14 px-8 md:px-12 bg-sage text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-[0.2em] shadow-lg shadow-sage/20 hover:scale-105 active:scale-95 transition-all">
              {saving ? <CircleDashed className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
              {saving ? t("INDEXING...", "処理中...", "ĐANG CHỈ MỤC...") : t("SYNC POST", "投稿を保存", "ĐỒNG BỘ BÀI VIẾT")}
            </Button>
          </div>
        </div>

        {/* Dynamic Tab Navigation */}
        <div className="flex items-center gap-2 p-1.5 md:p-2 bg-white/40 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] border border-white/40 shadow-sm overflow-x-auto no-scrollbar">
          {tabList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 rounded-[1.2rem] md:rounded-[1.5rem] text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.15em] transition-all whitespace-nowrap",
                activeTab === tab.id ? "bg-sage text-white shadow-lg shadow-sage/20" : "text-muted-foreground hover:bg-white/60 hover:text-sage"
              )}
            >
              <tab.icon size={12} className="md:w-[14px] md:h-[14px]" strokeWidth={activeTab === tab.id ? 3 : 2} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conditional Tab Rendering */}
        <div className="space-y-12">
          {activeTab === "general" && (
            <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-12 max-w-4xl">
                <AdminFormSection title={t("Institutional Meta", "組織メタデータ", "Siêu dữ liệu tổ chức")}>
                  <AdminField label={t("Publication Title (EN)", "記事タイトル (EN)", "Tiêu đề bài viết (EN)")}>
                    <Input
                      value={post.title_en || ""}
                      onChange={(e) => setPost({ ...post, title_en: e.target.value, slug: !post.slug ? generateSlug(e.target.value) : post.slug })}
                      className="h-16 px-8 bg-white/70 border border-sage/20 rounded-2xl font-serif font-bold text-lg shadow-sm"
                    />
                  </AdminField>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AdminField label={t("Resource Slug", "リソーススラッグ", "Đường dẫn (Slug)")}>
                      <Input value={post.slug || ""} onChange={(e) => setPost({ ...post, slug: e.target.value })} className="h-14 px-6 bg-stone-100 border-none rounded-xl font-mono text-xs" />
                    </AdminField>
                    <AdminField label={t("Category", "カテゴリー", "Danh mục")}>
                      <Select value={post.category_id || ""} onValueChange={(val) => setPost({ ...post, category_id: val })}>
                        <SelectTrigger className="h-14 px-8 bg-white/70 border-sage/20 rounded-xl font-bold text-xs shadow-sm">
                          <SelectValue placeholder={t("Select Category", "カテゴリーを選択", "Chọn danh mục")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-sage/10 shadow-2xl bg-white/95 backdrop-blur-xl">
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id} className="rounded-xl font-bold text-xs py-3">
                              {lang === "en" ? cat.name_en : (lang === "ja" ? cat.name_ja || cat.name_en : cat.name_vi || cat.name_en)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </AdminField>
                  </div>
                </AdminFormSection>

                <AdminFormSection title={t("Workflow & Status", "ワークフローとステータス", "Quy trình & Trạng thái")}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AdminField label={translations[lang].status}>
                      <Select value={post.status || "draft"} onValueChange={(val) => setPost({ ...post, status: val as any })}>
                        <SelectTrigger className="h-14 px-8 bg-white/70 border-sage/20 rounded-xl font-bold text-xs shadow-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-sage/10 shadow-2xl bg-white/95 backdrop-blur-xl">
                          <SelectItem value="draft" className="rounded-xl font-bold text-xs py-3">{t("Draft", "下書き", "Bản nháp")}</SelectItem>
                          <SelectItem value="published" className="rounded-xl font-bold text-xs py-3">{t("Published", "公開済み", "Đã đăng")}</SelectItem>
                          <SelectItem value="scheduled" className="rounded-xl font-bold text-xs py-3">{t("Scheduled", "予定済み", "Đã hẹn giờ")}</SelectItem>
                          <SelectItem value="archived" className="rounded-xl font-bold text-xs py-3">{t("Archived", "アーカイブ済み", "Đã lưu trữ")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </AdminField>
                    <AdminField label={t("Publication Date", "公開日", "Ngày đăng")}>
                      <DateTimePicker value={post.published_at} onChange={(val) => setPost({ ...post, published_at: val })} />
                    </AdminField>
                  </div>

                  {/* Featured Spotlight Toggle */}
                  <div className="group relative overflow-hidden bg-sage/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-sage/10 mt-8 transition-all hover:border-sage/30">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-sage/10 shadow-sm flex items-center justify-center text-sage shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <Star className={cn("transition-all duration-500", post.is_featured ? "fill-sage scale-110" : "fill-none")} size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sage">{t("Featured Status", "おすすめステータス", "Trạng thái nổi bật")}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">Elevate this story to the featured spotlight for maximum discovery.</p>
                      </div>
                      <button
                        onClick={() => setPost({ ...post, is_featured: !post.is_featured })}
                        className={cn("px-6 py-3 rounded-xl text-[9px] font-black tracking-[0.2em] uppercase transition-all duration-500", post.is_featured ? "bg-sage text-white shadow-lg" : "bg-white border text-muted-foreground")}
                      >
                        {post.is_featured ? t("FEATURED", "おすすめ中", "NỔI BẬT") : t("BOOST", "ブースト", "ĐẨY LÊN")}
                      </button>
                    </div>
                  </div>
                </AdminFormSection>

                <AdminFormSection title={t("Taxonomy Tags", "分類タグ", "Thẻ phân loại")}>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                          selectedTagIds.includes(tag.id) ? "bg-sage text-white border-sage shadow-md" : "bg-white text-muted-foreground border-sage/10 hover:border-sage/40"
                        )}
                      >
                        <TagIcon size={10} className="inline mr-1.5" />
                        {lang === 'ja' ? tag.name_ja || tag.name_en : lang === 'vi' ? tag.name_vi || tag.name_en : tag.name_en}
                      </button>
                    ))}
                  </div>
                </AdminFormSection>
              </div>
            </div>
          )}

          {activeTab === "content_en" && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="group relative bg-sage/5 p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-sage/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-10 mb-10 overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 relative z-10 w-full">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-sage shrink-0 group-hover:rotate-12 transition-all">
                    <Globe size={32} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-3xl font-serif font-black text-sage tracking-tight uppercase">{t("Auto Synchronization", "自動同期", "Tự động đồng bộ")}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-xl font-medium leading-relaxed">Instantly synchronize English content across all linguistic layers using neural translation.</p>
                  </div>
                </div>
                <Button onClick={handleAutoTranslate} disabled={isTranslating} className="h-14 md:h-16 px-8 md:px-12 bg-sage text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl shadow-sage/30 hover:scale-105 transition-all">
                  {isTranslating ? <CircleDashed className="animate-spin mr-2" size={18} /> : <Wand2 size={18} className="mr-2" />}
                  {isTranslating ? "SYNCING..." : "CALIBRATE LANGUAGES"}
                </Button>
              </div>

              <LanguageTabContent
                title="English Narrative"
                langLabel="EN"
                titleValue={post.title_en || ""}
                onTitleChange={(val) => setPost({ ...post, title_en: val })}
                excerptValue={post.excerpt_en || ""}
                onExcerptChange={(val) => setPost({ ...post, excerpt_en: val })}
                contentValue={post.content_en || ""}
                onContentChange={(html) => setPost({ ...post, content_en: html })}
                placeholder="Once upon a time in the creative ether..."
              />
            </div>
          )}

          {activeTab === "content_ja" && (
            <LanguageTabContent
              title="Japanese Atmospheric Perspective"
              langLabel="JA"
              titleValue={post.title_ja || ""}
              onTitleChange={(val) => setPost({ ...post, title_ja: val })}
              excerptValue={post.excerpt_ja || ""}
              onExcerptChange={(val) => setPost({ ...post, excerpt_ja: val })}
              contentValue={post.content_ja || ""}
              onContentChange={(html) => setPost({ ...post, content_ja: html })}
            />
          )}

          {activeTab === "content_vi" && (
            <LanguageTabContent
              title="Vietnamese Cultural Perspective"
              langLabel="VI"
              titleValue={post.title_vi || ""}
              onTitleChange={(val) => setPost({ ...post, title_vi: val })}
              excerptValue={post.excerpt_vi || ""}
              onExcerptChange={(val) => setPost({ ...post, excerpt_vi: val })}
              contentValue={post.content_vi || ""}
              onContentChange={(html) => setPost({ ...post, content_vi: html })}
            />
          )}

          {activeTab === "media" && (
            <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-sm space-y-12 max-w-4xl animate-in slide-in-from-bottom-4 duration-500">
              <AdminFormSection title={t("Hero Visual Asset", "ヒーロー視覚資産", "Tài sản thị giác Hero")}>
                <AdminField label={t("Cover Image", "カバー画像", "Ảnh bìa")}>
                  <div className="mt-4">
                    <MediaInput
                      label={t("Cover Image", "カバー画像", "Ảnh bìa")}
                      value={post.cover_image_url || ""}
                      onChange={(url) => setPost({ ...post, cover_image_url: url })}
                    />
                  </div>
                </AdminField>
              </AdminFormSection>
              <AdminFormSection title="Social Metadata Visuals">
                <AdminField label="OG Highlight Image">
                  <div className="mt-4">
                    <MediaInput
                      label="OG Image"
                      value={post.og_image_url || ""}
                      onChange={(url) => setPost({ ...post, og_image_url: url })}
                    />
                  </div>
                </AdminField>
              </AdminFormSection>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-sm space-y-12 max-w-4xl animate-in slide-in-from-bottom-4 duration-500">
              <AdminFormSection title="Neural Discovery Optimization (SEO)">
                <AdminField label="Meta Identity Title">
                  <Input value={post.seo_title_en || ""} onChange={(e) => setPost({ ...post, seo_title_en: e.target.value })} className="h-14 px-8 bg-white/70 border border-sage/20 rounded-xl font-bold font-mono text-xs shadow-sm" />
                </AdminField>
                <AdminField label="Meta Propagation Description">
                  <Textarea value={post.seo_description_en || ""} onChange={(e) => setPost({ ...post, seo_description_en: e.target.value })} rows={4} className="p-6 bg-white/70 border border-sage/20 rounded-2xl text-sm font-bold shadow-sm" />
                </AdminField>
              </AdminFormSection>
            </div>
          )}
        </div>

        {/* Global Preview Modal */}
        <BlogPreviewModal 
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          post={post}
          categories={categories}
          lang={activeTab.includes('_') ? activeTab.split('_')[1] as any : (lang as any)}
        />
      </div>
    </AdminLayout>
  );
};

export default memo(BlogPostEditor);
