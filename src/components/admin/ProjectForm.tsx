"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  Project,
  ProjectCategory,
  ProjectImage,
  ProjectApproach,
  ProjectResult,
  ProjectTestimonial,
} from "@/types/admin";
import { 
  X, Plus, Trash2, Wand2, Image as ImageIcon, ImagePlus,
  Settings, FileText, BarChart3, MessageSquare, Target,
  Save, Eye, EyeOff, Globe, Lock, Star, LayoutGrid,
  ChevronDown, Sparkles, Tag as TagIcon,
  Quote,
  Zap,
  SlidersHorizontal,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { MediaInput } from "./media/MediaInput";
import { MediaPickerModal } from "./media/MediaPickerModal";
import { useLang } from "@/contexts/LangContext";
import { translateFields } from "@/lib/translate";
import { portfolioApi } from "@/core/api/portfolio";
import { ProjectTag } from "@/types/admin";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminDialogForm, AdminTabConfig } from "./shared/AdminDialogForm";
import { AdminFormSection, AdminField } from "./shared/AdminFormSection";
import { AdminStatusToggle } from "./shared/AdminStatusToggle";
import { AdminLoading } from "@/components/admin/shared/AdminLoading";
import { StructuredListEditor } from "./shared/StructuredListEditor";
import { cn } from "@/lib/utils";

interface ProjectFormProps {
  projectId: string | null;
  categories: ProjectCategory[];
  onClose: () => void;
  onSave: () => void;
}

const ProjectForm = ({
  projectId,
  categories,
  onClose,
  onSave,
}: ProjectFormProps) => {
  const { lang, t } = useLang();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showGalleryLibrary, setShowGalleryLibrary] = useState(false);

  const [project, setProject] = useState<Partial<Project>>({
    slug: "",
    title: "",
    category_id: "",
    short_description: "",
    description: "",
    overview: "",
    challenge: "",
    solution: "",
    client: "",
    duration: "",
    role: "",
    year: new Date().getFullYear().toString(),
    cover_image_url: "",
    tall: false,
    is_featured: false,
    is_published: false,
    seo_title: "",
    seo_description: "",
    og_image_url: "",
    title_ja: "",
    title_vi: "",
    short_description_ja: "",
    short_description_vi: "",
    description_ja: "",
    description_vi: "",
    overview_ja: "",
    overview_vi: "",
    challenge_ja: "",
    challenge_vi: "",
    solution_ja: "",
    solution_vi: "",
    seo_title_ja: "",
    seo_title_vi: "",
    seo_description_ja: "",
    seo_description_vi: "",
    order_index: 0,
  });

  const [images, setImages] = useState<ProjectImage[]>([]);
  const [approaches, setApproaches] = useState<ProjectApproach[]>([]);
  const [results, setResults] = useState<ProjectResult[]>([]);
  const [testimonials, setTestimonials] = useState<ProjectTestimonial[]>([]);

  const [availableTags, setAvailableTags] = useState<ProjectTag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const [newApproach, setNewApproach] = useState("");
  const [newResult, setNewResult] = useState({ label: "", value: "" });
  const [newTestimonial, setNewTestimonial] = useState({
    quote: "",
    name: "",
    title: "",
    company: "",
    avatar_url: "",
    video_url: "",
  });

  useEffect(() => {
    fetchAvailableTags();
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchAvailableTags = async () => {
    try {
      const tags = await portfolioApi.getProjectTags();
      setAvailableTags(tags.filter(t => t.is_active));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchProject = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const [
        projectRes,
        imagesRes,
        approachesRes,
        resultsRes,
        testimonialsRes,
        tagsRes,
      ] = await Promise.all([
        supabase.from("projects").select("*").eq("id", projectId).single(),
        supabase.from("project_images").select("*").eq("project_id", projectId).order("order_index"),
        supabase.from("project_approaches").select("*").eq("project_id", projectId).order("order_index"),
        supabase.from("project_results").select("*").eq("project_id", projectId).order("order_index"),
        supabase.from("project_testimonials").select("*").eq("project_id", projectId).order("order_index"),
        portfolioApi.getProjectTagRelations(projectId),
      ]);

      if (projectRes.data) setProject(projectRes.data);
      if (imagesRes.data) setImages(imagesRes.data);
      if (approachesRes.data) setApproaches(approachesRes.data);
      if (resultsRes.data) setResults(resultsRes.data);
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
      if (tagsRes) setSelectedTagIds(tagsRes.map(r => r.tag_id));
    } catch (error) {
      toast.error(t("Failed to load project details", "プロジェクト詳細の読み込みに失敗しました", "Không thể tải chi tiết dự án"));
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  };

  const handleAutoTranslate = async () => {
    try {
      setIsTranslating(true);
      const sourceFields = {
        title: project.title,
        short_description: project.short_description,
        description: project.description,
        overview: project.overview,
        challenge: project.challenge,
        solution: project.solution,
        seo_title: project.seo_title,
        seo_description: project.seo_description,
      };

      const translatedJa = await translateFields(sourceFields, "ja");
      const translatedVi = await translateFields(sourceFields, "vi");

      setProject({
        ...project,
        title_ja: translatedJa.title,
        short_description_ja: translatedJa.short_description,
        description_ja: translatedJa.description,
        overview_ja: translatedJa.overview,
        challenge_ja: translatedJa.challenge,
        solution_ja: translatedJa.solution,
        seo_title_ja: translatedJa.seo_title,
        seo_description_ja: translatedJa.seo_description,
        title_vi: translatedVi.title,
        short_description_vi: translatedVi.short_description,
        description_vi: translatedVi.description,
        overview_vi: translatedVi.overview,
        challenge_vi: translatedVi.challenge,
        solution_vi: translatedVi.solution,
        seo_title_vi: translatedVi.seo_title,
        seo_description_vi: translatedVi.seo_description,
      });

      toast.success(t("Magic! Translated all fields to Japanese and Vietnamese.", "素晴らしい！すべてのフィールドを日本語とベトナム語に翻訳しました。", "Kỳ diệu! Đã dịch tất cả các trường sang tiếng Nhật và tiếng Việt."));
    } catch (error) {
      toast.error(t("Translation mapping failed.", "翻訳マッピングに失敗しました。", "Ánh xạ bản dịch thất bại."));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async () => {
    if (!project.title || !project.slug || !project.category_id) {
      toast.error(t("Title, slug and category are mandatory", "タイトル、スラッグ、カテゴリーは必須です", "Tiêu đề, slug và danh mục là bắt buộc"));
      return;
    }

    try {
      setSaving(true);
      let pId = projectId;
      if (projectId) {
        const { error } = await supabase.from("projects").update(project).eq("id", projectId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("projects").insert([project]).select().single();
        if (error) throw error;
        pId = data.id;
      }

      if (pId) {
        await portfolioApi.syncProjectTags(pId, selectedTagIds);
      }

      toast.success(projectId 
        ? t("Project refined.", "プロジェクトが洗練されました。", "Dự án đã được tinh chỉnh.") 
        : t("New Project synthesized.", "新しいプロジェクトが合成されました。", "Dự án mới đã được tổng hợp."));
      onSave();
    } catch (error) {
      toast.error(t("Failed to save synchronization.", "同期の保存に失敗しました。", "Không thể lưu đồng bộ hóa."));
    } finally {
      setSaving(false);
    }
  };

  const tabs = useMemo((): AdminTabConfig[] => [
    {
      id: "general",
      label: t("Core", "コア", "Cốt lõi"),
      fullLabel: t("General", "全般", "Cơ bản"),
      icon: Settings,
      content: (
        <div className="space-y-12 max-w-2xl">
          <AdminFormSection title={t("General", "全般", "Cơ bản")}>
            <AdminField label={t("Project Title (EN)", "プロジェクトタイトル (EN)", "Tiêu đề dự án (EN)")}>
              <Input
                value={project.title || ""}
                onChange={(e) => setProject({ ...project, title: e.target.value, slug: !project.slug ? generateSlug(e.target.value) : project.slug })}
                className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold"
              />
            </AdminField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminField label={t("Project Slug", "プロジェクトスラッグ", "Đường dẫn (Slug)")}>
                <Input
                  value={project.slug || ""}
                  onChange={(e) => setProject({ ...project, slug: e.target.value })}
                  className="h-14 px-6 bg-muted/10 border-none rounded-xl font-mono text-xs"
                />
              </AdminField>
              <AdminField label={t("Category", "カテゴリー", "Danh mục")}>
                <select
                  value={project.category_id || ""}
                  onChange={(e) => setProject({ ...project, category_id: e.target.value })}
                  className="w-full h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold focus:outline-none"
                >
                  <option value="">{t("Select Category", "カテゴリーを選択", "Chọn danh mục")}</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ja' ? (c.name_ja || c.name_en) : (lang === 'vi' ? (c.name_vi || c.name_en) : c.name_en)}</option>)}
                </select>
              </AdminField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminField label={t("Client Name", "クライアント名", "Tên khách hàng")}>
                <Input value={project.client || ""} onChange={(e) => setProject({ ...project, client: e.target.value })} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
              </AdminField>
              <AdminField label={t("Year", "年", "Năm")}>
                <Input value={project.year || ""} onChange={(e) => setProject({ ...project, year: e.target.value })} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
              </AdminField>
            </div>
          </AdminFormSection>

          <AdminFormSection title={t("Work Engagement", "仕事の関与", "Cam kết công việc")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminField label={t("Duration", "期間", "Thời gian thực hiện")}>
                <Input value={project.duration || ""} onChange={(e) => setProject({ ...project, duration: e.target.value })} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
              </AdminField>
              <AdminField label={t("My Role", "私の役割", "Vai trò của tôi")}>
                <Input value={project.role || ""} onChange={(e) => setProject({ ...project, role: e.target.value })} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
              </AdminField>
            </div>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "narrative",
      label: t("Story", "ストーリー", "Câu chuyện"),
      fullLabel: t("Content", "コンテンツ", "Nội dung"),
      icon: FileText,
      content: (
        <div className="space-y-12 max-w-4xl">
          <AdminFormSection title={t("Atmosphere Content", "雰囲気のコンテンツ", "Nội dung Atmosphere")}>
            <AdminField label={t("Tagline (EN)", "タグライン (EN)", "Slogan (EN)")}>
              <Textarea
                value={project.short_description || ""}
                onChange={(e) => setProject({ ...project, short_description: e.target.value })}
                rows={2}
                className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-bold text-sm"
              />
            </AdminField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <AdminField label={t("Overview (EN)", "概要 (EN)", "Tổng quan (EN)")}>
                <Textarea value={project.overview || ""} onChange={(e) => setProject({ ...project, overview: e.target.value })} rows={10} className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold" />
              </AdminField>
              <AdminField label={t("Main Description (EN)", "主な説明 (EN)", "Mô tả chính (EN)")}>
                <Textarea value={project.description || ""} onChange={(e) => setProject({ ...project, description: e.target.value })} rows={10} className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold" />
              </AdminField>
            </div>
              <div className="grid grid-cols-1 gap-10">
                <StructuredListEditor 
                  label={t("Challenge (EN)", "課題 (EN)", "Thách thức (EN)")}
                  value={project.challenge || ""}
                  onChange={(val) => setProject({ ...project, challenge: val })}
                  placeholder="Define the strategic puzzle..."
                  isChallenge
                />
                <StructuredListEditor 
                  label={t("Solution (EN)", "解決策 (EN)", "Giải pháp (EN)")}
                  value={project.solution || ""}
                  onChange={(val) => setProject({ ...project, solution: val })}
                  placeholder="Describe your creative synthesis..."
                />
              </div>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "localization",
      label: t("i18n", "i18n", "Bản dịch"),
      fullLabel: t("Translations", "翻訳", "Bản dịch"),
      icon: Globe,
      content: (
        <div className="space-y-12 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-sage/5 p-10 rounded-[3rem] border border-sage/10 relative overflow-hidden group shadow-sm gap-8">
            <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-sage shadow-xl">
                <Globe size={32} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sage uppercase tracking-[0.2em] mb-1">{t("Pacific linguistic protocol", "太平洋言語プロトコル", "Hệ thống đa ngôn ngữ")}</h4>
              </div>
            </div>
            <Button onClick={handleAutoTranslate} disabled={isTranslating} className="w-full sm:w-auto h-16 px-12 bg-sage text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-widest shadow-2xl shadow-sage/30">
              {isTranslating ? <LoadingSpinner /> : <Wand2 size={20} />}
              {isTranslating ? t("SYNC...", "同期中...", "ĐANG ĐỒNG BỘ...") : t("MAGIC AUTO-SYNC", "マジック自動同期", "TỰ ĐỘNG ĐỒNG BỘ THẦN KỲ")}
            </Button>
          </div>

          <AdminFormSection title={t("Japanese Atmospheric Layer", "日本語のアトモスフェリックレイヤー", "Lớp Atmosphere tiếng Nhật")}>
             <AdminField label={t("Title (JP)", "タイトル (JP)", "Tiêu đề (JP)")}>
                <Input value={project.title_ja || ""} onChange={(e) => setProject({ ...project, title_ja: e.target.value })} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
              </AdminField>
              <AdminField label={t("Tagline (JP)", "タグライン (JP)", "Slogan (JP)")}>
                <Textarea value={project.short_description_ja || ""} onChange={(e) => setProject({ ...project, short_description_ja: e.target.value })} rows={2} className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-bold text-sm" />
              </AdminField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <AdminField label={t("Overview (JP)", "概要 (JP)", "Tổng quan (JP)")}>
                  <Textarea value={project.overview_ja || ""} onChange={(e) => setProject({ ...project, overview_ja: e.target.value })} rows={8} className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold" />
                </AdminField>
                <AdminField label={t("Description (JP)", "説明 (JP)", "Mô tả (JP)")}>
                  <Textarea value={project.description_ja || ""} onChange={(e) => setProject({ ...project, description_ja: e.target.value })} rows={8} className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold" />
                </AdminField>
              </div>
              <div className="grid grid-cols-1 gap-10">
                <StructuredListEditor 
                  label={t("Challenge (JP)", "課題 (JP)", "Thách thức (JP)")}
                  value={project.challenge_ja || ""}
                  onChange={(val) => setProject({ ...project, challenge_ja: val })}
                  isChallenge
                />
                <StructuredListEditor 
                  label={t("Solution (JP)", "解決策 (JP)", "Giải pháp (JP)")}
                  value={project.solution_ja || ""}
                  onChange={(val) => setProject({ ...project, solution_ja: val })}
                />
              </div>
          </AdminFormSection>

          <AdminFormSection title={t("Vietnamese Atmospheric Layer", "ベトナム語のアトモスフェリックレイヤー", "Lớp Atmosphere tiếng Việt")}>
             <AdminField label={t("Title (VI)", "タイトル (VI)", "Tiêu đề (VI)")}>
                <Input value={project.title_vi || ""} onChange={(e) => setProject({ ...project, title_vi: e.target.value })} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
              </AdminField>
              <AdminField label={t("Tagline (VI)", "タグライン (VI)", "Slogan (VI)")}>
                <Textarea value={project.short_description_vi || ""} onChange={(e) => setProject({ ...project, short_description_vi: e.target.value })} rows={2} className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-bold text-sm" />
              </AdminField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <AdminField label={t("Overview (VI)", "概要 (VI)", "Tổng quan (VI)")}>
                  <Textarea value={project.overview_vi || ""} onChange={(e) => setProject({ ...project, overview_vi: e.target.value })} rows={8} className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold" />
                </AdminField>
                <AdminField label={t("Description (VI)", "説明 (VI)", "Mô tả (VI)")}>
                  <Textarea value={project.description_vi || ""} onChange={(e) => setProject({ ...project, description_vi: e.target.value })} rows={8} className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold" />
                </AdminField>
              </div>
              <div className="grid grid-cols-1 gap-10">
                <StructuredListEditor 
                  label={t("Challenge (VI)", "課題 (VI)", "Thách thức (VI)")}
                  value={project.challenge_vi || ""}
                  onChange={(val) => setProject({ ...project, challenge_vi: val })}
                  isChallenge
                />
                <StructuredListEditor 
                  label={t("Solution (VI)", "解決策 (VI)", "Giải pháp (VI)")}
                  value={project.solution_vi || ""}
                  onChange={(val) => setProject({ ...project, solution_vi: val })}
                />
              </div>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "media",
      label: t("Media", "メディア", "Phương tiện"),
      fullLabel: t("Images", "画像", "Hình ảnh"),
      icon: ImageIcon,
      content: (
        <div className="space-y-12 max-w-4xl">
          <AdminFormSection title={t("Primary Asset", "主要資産", "Tài sản chính")}>
            <MediaInput label={t("Cover Image", "カバー画像", "Ảnh bìa")} value={project.cover_image_url || ""} onChange={(url) => setProject({ ...project, cover_image_url: url })} />
            <div className="bg-sage/5 p-6 rounded-2xl mt-4 border border-sage/10 flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-sage">{t("Layout Protocol", "レイアウトプロトコル", "Giao thức bố cục")}</p>
                 <p className="text-xs text-muted-foreground mt-1">{t("Render this project in portrait mode when featured.", "注目されたときにこのプロジェクトを縦向きで表示します。", "Hiển thị dự án này ở chế độ dọc khi được làm nổi bật.")}</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setProject({...project, tall: !project.tall})}
                className={cn("h-10 px-6 rounded-xl text-[10px] font-black tracking-widest transition-all", project.tall ? "bg-sage text-white shadow-lg" : "bg-white border border-sage/20 text-muted-foreground")}
              >
                {project.tall ? t("PORTRAIT ENABLED", "縦向き有効", "ĐÃ BẬT CHẾ ĐỘ DỌC") : t("STANDARD LANDSCAPE", "標準横向き", "CHẾ ĐỘ NGANG TIÊU CHUẨN")}
              </Button>
            </div>
          </AdminFormSection>

          {projectId && (
            <AdminFormSection title={t("Gallery Cluster", "ギャラリークラスター", "Cụm thư viện ảnh")}>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  <div 
                    onClick={() => setShowGalleryLibrary(true)}
                    className="aspect-square border-2 border-dashed border-sage/20 rounded-[2rem] bg-white flex flex-col items-center justify-center gap-3 hover:bg-sage/5 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-sage/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="text-sage" size={24} />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-sage">{t("Add Assets", "資産を追加", "Thêm tài nguyên")}</p>
                  </div>
                  {images.map(img => (
                    <div key={img.id} className="relative aspect-square rounded-[2rem] overflow-hidden border border-border/10 group bg-white">
                      <img src={img.image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <button 
                        onClick={async () => {
                          await supabase.from("project_images").delete().eq("id", img.id);
                          setImages(images.filter(i => i.id !== img.id));
                        }}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                      >
                         <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
               </div>
               <MediaPickerModal 
                  open={showGalleryLibrary}
                  onOpenChange={setShowGalleryLibrary}
                  allowMultiple={true}
                  onSelect={async (url) => {
                    if (!projectId) return;
                    await supabase.from("project_images").insert([{ project_id: projectId, image_url: url, order_index: images.length }]);
                    fetchProject();
                  }}
                  allowedTypes={['image']}
                />
            </AdminFormSection>
          )}
        </div>
      )
    },
    {
      id: "tags",
      label: t("Tags", "タグ", "Nhãn"),
      fullLabel: t("Tags", "タグ", "Nhãn"),
      icon: TagIcon,
      content: (
        <div className="space-y-12 max-w-4xl">
          <AdminFormSection title={t("Experience Indexing", "エクスペリエンスのインデックス作成", "Chỉ mục trải nghiệm")}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {availableTags.map(tag => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTagIds(isSelected ? selectedTagIds.filter(id => id !== tag.id) : [...selectedTagIds, tag.id])}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl text-left transition-all border",
                      isSelected ? "bg-sage text-white border-sage shadow-xl scale-[1.03]" : "bg-white border-border/10 text-muted-foreground hover:bg-sage/5 hover:text-sage"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", isSelected ? 'bg-white/20' : 'bg-sage/5')}>
                      {tag.icon_url ? <img src={tag.icon_url} alt="" className="w-5 h-5 object-contain" /> : <TagIcon size={14} />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">{lang === 'ja' ? tag.name_ja || tag.name_en : (lang === 'vi' ? tag.name_vi || tag.name_en : tag.name_en)}</span>
                  </button>
                );
              })}
            </div>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "results",
      label: t("Legacy", "レガシー", "Di sản"),
      fullLabel: t("Stats", "統計", "Thống kê"),
      icon: Target,
      content: (
        <div className="space-y-12 max-w-4xl">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <AdminFormSection title={t("Strategic Approach", "戦略的アプローチ", "Tiếp cận chiến lược")}>
                 <div className="flex gap-2">
                    <Input value={newApproach} onChange={(e) => setNewApproach(e.target.value)} placeholder={t("Methodology...", "方法論...", "Phương pháp...")} className="h-12 px-5 bg-white border border-sage/20 rounded-xl font-bold" />
                    <Button onClick={async () => {
                      if (!newApproach || !projectId) return;
                      await supabase.from("project_approaches").insert([{ project_id: projectId, approach: newApproach, order_index: approaches.length }]);
                      setNewApproach("");
                      fetchProject();
                    }} className="bg-sage text-white shrink-0 rounded-xl h-12 w-12"><Plus /></Button>
                 </div>
                 <div className="space-y-3 mt-8">
                    {approaches.map(a => (
                      <div key={a.id} className="flex items-center justify-between p-4 bg-white border border-border/10 rounded-2xl group shadow-sm">
                        <span className="text-xs font-bold text-heading">{a.approach}</span>
                        <button onClick={async () => {
                          await supabase.from("project_approaches").delete().eq("id", a.id);
                          setApproaches(approaches.filter(ap => ap.id !== a.id));
                        }} className="text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                      </div>
                    ))}
                 </div>
              </AdminFormSection>

              <AdminFormSection title={t("Performance Metrics", "パフォーマンス指標", "Chỉ số hiệu suất")}>
                 <div className="bg-white p-6 rounded-2xl border border-border/10 space-y-4 shadow-sm">
                    <Input value={newResult.label} onChange={(e) => setNewResult({...newResult, label: e.target.value})} placeholder={t("Label (ROI, growth...)", "ラベル (ROI、成長など)", "Nhãn (ROI, tăng trưởng...)")} className="h-12 bg-muted/5 border-none" />
                    <div className="flex gap-2">
                      <Input value={newResult.value} onChange={(e) => setNewResult({...newResult, value: e.target.value})} placeholder={t("Value (+45%, 1M...)", "値 (+45%, 1M...)", "Giá trị (+45%, 1M...)")} className="h-12 bg-muted/5 border-none" />
                      <Button onClick={async () => {
                        if (!newResult.label || !projectId) return;
                        await supabase.from("project_results").insert([{ project_id: projectId, ...newResult, order_index: results.length }]);
                        setNewResult({ label: "", value: "" });
                        fetchProject();
                      }} className="bg-sage text-white px-8 rounded-xl font-bold text-[10px] uppercase">{t("Add", "追加", "Thêm")}</Button>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 gap-4 mt-8">
                    {results.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-5 bg-white border border-border/10 rounded-3xl group shadow-sm">
                         <div>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{r.label}</p>
                            <p className="text-xl font-serif font-bold text-sage">{r.value}</p>
                         </div>
                         <button onClick={async () => {
                            await supabase.from("project_results").delete().eq("id", r.id);
                            setResults(results.filter(re => re.id !== r.id));
                         }} className="text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                      </div>
                    ))}
                 </div>
              </AdminFormSection>
           </div>
        </div>
      )
    },
    {
      id: "social",
      label: t("Social", "ソーシャル", "Xã hội"),
      fullLabel: t("Testimonials", "お客様の声", "Đánh giá"),
      icon: MessageSquare,
      content: (
        <div className="space-y-12 max-w-4xl">
          <AdminFormSection title={t("Persona Validation", "ペルソナの検証", "Xác thực cá nhân")}>
            <div className="bg-sage/5 p-10 rounded-[3rem] border border-sage/10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AdminField label={t("Validation Quote", "検証の引用", "Trích dẫn xác thực")}>
                  <Textarea value={newTestimonial.quote} onChange={(e) => setNewTestimonial({...newTestimonial, quote: e.target.value})} rows={5} className="p-6 bg-white border-none rounded-2xl text-sm italic font-serif font-bold" />
                </AdminField>
                <div className="space-y-4">
                   <Input value={newTestimonial.name} onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})} placeholder={t("Persona Name", "ペルソナ名", "Tên cá nhân")} className="h-12 bg-white border-none rounded-xl" />
                   <Input value={newTestimonial.title} onChange={(e) => setNewTestimonial({...newTestimonial, title: e.target.value})} placeholder={t("Persona Role", "ペルソナの役割", "Vai trò")} className="h-12 bg-white border-none rounded-xl" />
                   <Input value={newTestimonial.company} onChange={(e) => setNewTestimonial({...newTestimonial, company: e.target.value})} placeholder={t("Persona Company", "ペルソナの会社", "Công ty")} className="h-12 bg-white border-none rounded-xl" />
                   <Button onClick={async () => {
                     if (!newTestimonial.quote || !projectId) return;
                     await supabase.from("project_testimonials").insert([{ project_id: projectId, ...newTestimonial, order_index: testimonials.length }]);
                     setNewTestimonial({ quote: "", name: "", title: "", company: "", avatar_url: "", video_url: "" });
                     fetchProject();
                   }} className="w-full h-12 bg-sage text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-sage/20">{t("Inject Proof", "証拠を注入", "Thêm bằng chứng")}</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-12">
                {testimonials.map(t => (
                  <div key={t.id} className="p-8 bg-white border border-border/10 rounded-[2.5rem] relative group shadow-sm">
                    <Quote className="text-sage/10 absolute -top-4 -left-4" size={48} />
                    <p className="text-sm font-serif italic font-bold text-heading leading-relaxed line-clamp-4">"{t.quote}"</p>
                    <div className="mt-8 pt-6 border-t border-border/10 flex items-center justify-between">
                       <div>
                          <p className="text-sm font-serif font-bold text-heading">{t.name}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.title} @ {t.company}</p>
                       </div>
                       <button onClick={async () => {
                         await supabase.from("project_testimonials").delete().eq("id", t.id);
                         setTestimonials(testimonials.filter(te => te.id !== t.id));
                       }} className="text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
            </div>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "settings",
      label: t("Config", "設定", "Cấu hình"),
      fullLabel: t("Publish Settings", "公開設定", "Cài đặt xuất bản"),
      icon: ShieldCheck,
      content: (
        <div className="space-y-12 max-w-2xl">
          <AdminStatusToggle
            label={t("Masterpiece Visibility", "傑作の可視性", "Hiển thị kiệt tác")}
            isPublished={project.is_published || false}
            onToggle={(val) => setProject({ ...project, is_published: val })}
            description={{
              active: t("Project is fully integrated into the public portfolio gallery.", "プロジェクトはパブリックポートフォリオギャラリーに完全に統合されています。", "Dự án đã được tích hợp đầy đủ vào bộ sưu tập danh mục đầu tư công khai."),
              inactive: t("Project is currently shadowed in the draft vault.", "プロジェクトは現在、下書き保管庫に隠されています。", "Dự án hiện đang được ẩn trong kho lưu trữ bản nháp.")
            }}
          />
          <AdminStatusToggle
            label={t("Priority Elevation (Featured)", "優先度の昇格 (注目)", "Ưu tiên (Nổi bật)")}
            isPublished={project.is_featured || false}
            onToggle={(val) => setProject({ ...project, is_featured: val })}
            description={{
              active: t("Project is elevated to the featured spotlight.", "プロジェクトは注目のスポットライトに昇格しました。", "Dự án được đưa lên vị trí tiêu điểm nổi bật."),
              inactive: t("Project remains in standard rotation.", "プロジェクトは標準のローテーションのままです。", "Dự án vẫn được giữ trong vòng xoay tiêu chuẩn.")
            }}
          />
          <AdminFormSection title={t("Neural Integration (SEO)", "ニューラル統合 (SEO)", "Tích hợp Neural (SEO)")}>
             <AdminField label={t("SEO Atmospheric Title", "SEOアトモスフェリックタイトル", "Tiêu đề SEO Atmospheric")}>
                <Input value={project.seo_title || ""} onChange={(e) => setProject({ ...project, seo_title: e.target.value })} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
              </AdminField>
              <AdminField label={t("SEO Narrative Description", "SEOナラティブの説明", "Mô tả SEO Narrative")}>
                <Textarea value={project.seo_description || ""} onChange={(e) => setProject({ ...project, seo_description: e.target.value })} rows={4} className="p-6 bg-white/70 border border-sage/20 rounded-2xl text-sm font-bold" />
              </AdminField>
          </AdminFormSection>
        </div>
      )
    }
  ], [project, categories, availableTags, selectedTagIds, images, approaches, results, testimonials, newApproach, newResult, newTestimonial, t, lang]);

  if (loading && projectId) {
    return <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[10000] flex items-center justify-center"><AdminLoading message={t("Synthesizing Project Node...", "プロジェクトノードを合成中...", "Đang tổng hợp nút dự án...")} /></div>;
  }

  return (
    <AdminDialogForm
      open={true}
      onOpenChange={(open) => !open && onClose()}
      title={projectId ? t("Project Architect", "プロジェクトアーキテクト", "Kiến trúc dự án") : t("New Creation Synthesis", "新しい創作の合成", "Tổng hợp sáng tạo mới")}
      description={t("Refine and architect the visual narrative and strategic impact of this project.", "このプロジェクトの視覚的な物語と戦略的な影響を洗練し、構築します。", "Tinh chỉnh và xây dựng câu chuyện hình ảnh cũng như tác động chiến lược của dự án này.")}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSubmit}
      saving={saving}
      saveLabel={projectId ? t("Refine Project", "プロジェクトを洗練する", "Tinh chỉnh dự án") : t("Synthesize Base", "ベースを合成する", "Tổng hợp cơ sở")}
      sidebarTitle={t("SETTINGS", "設定", "CÀI ĐẶT")}
      sidebarSubtitle={t("CONFIGURATION", "構成", "CẤU HÌNH")}
    />
  );
};

export default ProjectForm;
