"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { AboutContent, AboutImage, AboutTag } from "@/types/admin";
import {
  Plus,
  FileText,
  Globe2,
  Sparkles,
  Image as ImageIcon,
  Tag as TagIcon,
  ShieldCheck,
  Layers,
  EyeOff,
  Edit3,
  Trash2,
} from "lucide-react";
import { AboutImageGallery } from "@/components/admin/AboutImageGallery";
import { useLang } from "@/contexts/LangContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { translateFields } from "@/lib/translate";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminDialogForm, AdminTabConfig } from "@/components/admin/shared/AdminDialogForm";
import { AdminLoading } from "@/components/admin/shared/AdminLoading";
import { AboutContentForm } from "@/components/admin/about/AboutContentForm";

const AboutContentPage = () => {
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [isTranslating, setIsTranslating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTags, setAllTags] = useState<AboutTag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const { data: sections, loading, saving, deleting, fetchData, upsertData, deleteData } = useAdminCRUD<AboutContent>({
    tableName: "about_content",
    defaultOrderBy: { column: "order_index", ascending: true }
  });

  const [formData, setFormData] = useState({
    section_key: "",
    title_en: "",
    title_ja: "",
    title_vi: "",
    content_en: "",
    content_ja: "",
    content_vi: "",
    cta_primary_label_en: "View Projects",
    cta_primary_label_ja: "プロジェクトを見る",
    cta_primary_label_vi: "Xem dự án",
    cta_secondary_label_en: "Download CV",
    cta_secondary_label_ja: "CVをダウンロード",
    cta_secondary_label_vi: "Tải CV",
    resume_url: "",
    order_index: 0,
    is_published: true,
  });

  useEffect(() => {
    fetchAllTags();
  }, []);

  const fetchAllTags = async () => {
    try {
      const { data, error } = await supabase
        .from("about_tags")
        .select("*")
        .eq("is_active", true)
        .order("order_index");
      if (error) throw error;
      setAllTags(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleOpenAdd = () => {
    setFormData({ 
      section_key: "", 
      title_en: "", 
      title_ja: "", 
      title_vi: "", 
      content_en: "", 
      content_ja: "", 
      content_vi: "", 
      cta_primary_label_en: "View Projects",
      cta_primary_label_ja: "プロジェクトを見る",
      cta_primary_label_vi: "Xem dự án",
      cta_secondary_label_en: "Download CV",
      cta_secondary_label_ja: "CVをダウンロード",
      cta_secondary_label_vi: "Tải CV",
      resume_url: "",
      order_index: sections.length, 
      is_published: true 
    });
    setEditingId(null);
    setActiveTab("general");
    setSelectedTagIds([]);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = async (section: AboutContent) => {
    setFormData({
      section_key: section.section_key || "",
      title_en: section.title_en || "",
      title_ja: section.title_ja || "",
      title_vi: section.title_vi || "",
      content_en: section.content_en || "",
      content_ja: section.content_ja || "",
      content_vi: section.content_vi || "",
      cta_primary_label_en: section.cta_primary_label_en || "View Projects",
      cta_primary_label_ja: section.cta_primary_label_ja || "プロジェクトを見る",
      cta_primary_label_vi: section.cta_primary_label_vi || "Xem dự án",
      cta_secondary_label_en: section.cta_secondary_label_en || "Download CV",
      cta_secondary_label_ja: section.cta_secondary_label_ja || "CVをダウンロード",
      cta_secondary_label_vi: section.cta_secondary_label_vi || "Tải CV",
      resume_url: section.resume_url || "",
      order_index: section.order_index,
      is_published: section.is_published,
    });
    setEditingId(section.id);
    setActiveTab("general");
    setIsDialogOpen(true);
    try {
      const { data, error } = await supabase.from("about_content_tags").select("tag_id").eq("about_id", section.id);
      if (error) throw error;
      setSelectedTagIds(data?.map((p) => p.tag_id) || []);
    } catch (error) {
      console.error("Error fetching section tags:", error);
    }
  };

  const syncTags = async (aboutId: string) => {
    await supabase.from("about_content_tags").delete().eq("about_id", aboutId);
    if (selectedTagIds.length > 0) {
      const inserts = selectedTagIds.map((tagId) => ({ about_id: aboutId, tag_id: tagId }));
      await supabase.from("about_content_tags").insert(inserts);
    }
  };

  const handleSave = async () => {
    const result = await upsertData(formData, editingId || undefined);
    if (result) {
      await syncTags(result.id);
      setIsDialogOpen(false);
    }
  };

  const handleAutoTranslate = async () => {
    if (!formData.title_en) {
      toast.error(t("English parameters required for sync.", "同期には英語のパラメータが必要です。", "Yêu cầu nội dung tiếng Anh để đồng bộ."));
      return;
    }
    try {
      setIsTranslating(true);
      const translatedJa = await translateFields({ title: formData.title_en, content: formData.content_en } as any, "ja");
      const translatedVi = await translateFields({ title: formData.title_en, content: formData.content_en } as any, "vi");
      setFormData((prev) => ({ 
        ...prev, 
        title_ja: translatedJa.title, 
        content_ja: translatedJa.content,
        title_vi: translatedVi.title,
        content_vi: translatedVi.content
      }));
      toast.success(t("Narrative globally synchronized.", "物語がグローバルに同期されました。", "Nội dung đã được đồng bộ toàn cầu."));
    } catch {
      toast.error(t("Linguistic sync failure.", "言語同期に失敗しました。", "Lỗi đồng bộ ngôn ngữ."));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const filteredSections = sections.filter(
    (s) => s.title_en.toLowerCase().includes(searchTerm.toLowerCase()) || s.section_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs: AdminTabConfig[] = [
    { id: "general", label: t("Core", "コア", "Cốt lõi"), fullLabel: t("Core Narrative", "コアな物語", "Nội dung cốt lõi"), icon: FileText },
    { id: "media", label: t("Media", "メディア", "Phương tiện"), fullLabel: t("Visual Asset Layer", "視覚資産レイヤー", "Lớp tài sản hình ảnh"), icon: ImageIcon },
    { id: "taxonomy", label: t("Tags", "タグ", "Nhãn"), fullLabel: t("Taxonomy Grid", "タクソノミーグリッド", "Phân loại"), icon: TagIcon },
    { id: "localization", label: "i18n", fullLabel: t("Translations", "翻訳", "Bản dịch"), icon: Globe2 },
    { id: "status", label: translations[lang].status, fullLabel: t("Deployment Configuration", "デプロイ構成", "Cấu hình hiển thị"), icon: ShieldCheck },
  ];

  // Media slot — passes the gallery or placeholder into the form
  const mediaSlot = editingId ? (
    <AboutImageGallery aboutId={editingId} onImagesChange={() => fetchData()} />
  ) : (
    <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 bg-muted/20 rounded-[3rem] border border-dashed border-border/40 px-10">
      <p className="text-sm text-muted-foreground font-serif italic max-w-sm">
        {t("Visual assets must be associated with an existing narrative node. Please save your current progress first.", "視覚資産は既存のナラティブノードに関連付ける必要があります。まず現在の進行状況を保存してください。", "Tài sản hình ảnh phải được liên kết với một mục nội dung hiện có. Vui lòng lưu tiến trình hiện tại của bạn trước.")}
      </p>
      <Button onClick={handleSave} className="bg-sage text-white rounded-2xl px-10 h-14 font-bold uppercase tracking-widest text-[10px]">
        {t("Save & Initialize Media Layer", "保存してメディアレイヤーを初期化", "Lưu & Khởi tạo lớp phương tiện")}
      </Button>
    </div>
  );

  if (loading) return <AdminLayout><AdminLoading message={translations[lang].loading} /></AdminLayout>;

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={() => deleteData(deleteConfirm.itemId!)}
        itemName={deleteConfirm.itemName}
        isLoading={deleting}
      />

      <div className="space-y-12 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={translations[lang].aboutMe}
          description={t("Refining the biographical narrative layers that architect your professional profile.", "プロフェッショナルなプロフィールを構築する伝記的ナラティブレイヤーを洗練します。", "Tinh chỉnh các lớp dẫn chuyện tiểu sử kiến tạo hồ sơ chuyên nghiệp của bạn.")}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{ label: t("New Narrative Node", "新しいナラティブノード", "Thêm nội dung mới"), onClick: handleOpenAdd }}
        />

        {/* GRID PREVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="group bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 hover:shadow-2xl transition-all duration-700 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="px-5 py-2 rounded-full bg-sage/5 border border-sage/10 text-[9px] font-bold uppercase tracking-widest text-sage flex items-center gap-2">
                    <Layers size={10} />
                    {section.section_key}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    <button onClick={() => handleOpenEdit(section)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-muted-foreground hover:bg-sage hover:text-white transition-all shadow-sm border border-border/10">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => deleteConfirm.openConfirm(section.id, section.title_en)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all shadow-sm border border-border/10">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-bold text-heading line-clamp-2">
                    {lang === 'ja' ? section.title_ja : lang === 'vi' ? section.title_vi || section.title_en : section.title_en}
                  </h3>
                  <p className="text-xs font-serif italic text-muted-foreground line-clamp-4 leading-relaxed">
                    {lang === 'ja' ? section.content_ja : lang === 'vi' ? section.content_vi || section.content_en : section.content_en}
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-border/10">
                <div className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest ${section.is_published ? "text-green-500" : "text-muted-foreground"}`}>
                  {section.is_published ? <Globe2 size={12} /> : <EyeOff size={12} />}
                  {section.is_published ? t("Live On Grid", "グリッド上で公開中", "Đang hiển thị") : translations[lang].draft}
                </div>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-sage text-white flex items-center justify-center text-[8px] font-bold border-2 border-white shadow-sm">EN</div>
                  <div className="w-6 h-6 rounded-full bg-heading text-white flex items-center justify-center text-[8px] font-bold border-2 border-white shadow-sm">JA</div>
                  <div className="w-6 h-6 rounded-full bg-sage/80 text-white flex items-center justify-center text-[8px] font-bold border-2 border-white shadow-sm">VI</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? t("Refine Narrative", "物語の洗練", "Tinh chỉnh nội dung") : t("Narrative Architect", "物語の構築", "Kiến tạo nội dung")}
          description={t("Refine and architect the narrative node story.", "ナラティブノードのストーリーを洗練し、構築します。", "Tinh chỉnh và kiến tạo câu chuyện cho mục nội dung này.")}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={saving}
          saveLabel={editingId ? translations[lang].save : t("Add", "追加", "Thêm")}
          sidebarTitle={t("Narrative", "物語", "Dẫn chuyện")}
          sidebarSubtitle={t("Story Protocol", "ストーリープロトコル", "Giao thức câu chuyện")}
          sidebarIcon={Sparkles}
        >
          <AboutContentForm
            formData={formData}
            setFormData={setFormData}
            activeSection={activeTab}
            isTranslating={isTranslating}
            onAutoTranslate={handleAutoTranslate}
            allTags={allTags}
            selectedTagIds={selectedTagIds}
            onTagToggle={handleTagToggle}
            lang={lang}
            mediaSlot={mediaSlot}
          />
        </AdminDialogForm>
      </div>
    </AdminLayout>
  );
};

export default AboutContentPage;
