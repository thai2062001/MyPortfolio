"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MediaInput } from "@/components/admin/media/MediaInput";
import {
  Plus,
  Edit2,
  Trash2,
  Brain,
  Cpu,
  Zap,
  ChevronRight,
  Globe2,
  Sparkles,
  Image as ImageIcon,
  Wrench,
  ListChecks,
  Workflow,
  FileText,
  Wand2,
} from "lucide-react";
import type {
  Skill,
  SkillHighlight,
  SkillApplication,
  SkillTool,
  SkillStep,
} from "@/types/skills";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { translateFields } from "@/lib/translate";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminDialogForm, AdminTabConfig } from "@/components/admin/shared/AdminDialogForm";
import { AdminFormSection, AdminField } from "@/components/admin/shared/AdminFormSection";
import { AdminLoading } from "@/components/admin/shared/AdminLoading";
import { cn } from "@/lib/utils";

interface SkillDetailsData {
  skill: Skill;
  highlights: SkillHighlight[];
  applications: SkillApplication[];
  tools: SkillTool[];
  steps: SkillStep[];
}

const SkillDetailsAdmin = () => {
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [skillsData, setSkillsData] = useState<SkillDetailsData[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>(
    searchParams.get("skillId") || "",
  );
  const [loading, setLoading] = useState(true);

  // Form state
  const [editingItem, setEditingItem] = useState<{
    type: "highlight" | "application" | "tool" | "step";
    id: string | null;
  } | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (skillsData.length > 0 && !selectedSkillId) {
      const urlId = searchParams.get("skillId");
      if (urlId && skillsData.some((d) => d.skill.id === urlId)) {
        setSelectedSkillId(urlId);
      } else if (skillsData.length > 0) {
        setSelectedSkillId(skillsData[0].skill.id);
      }
    }
  }, [skillsData]);

  useEffect(() => {
    if (selectedSkillId) {
      setSearchParams({ skillId: selectedSkillId }, { replace: true });
    }
  }, [selectedSkillId, setSearchParams]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const { data: skills, error: skillsError } = await supabase
        .from("skills")
        .select("*")
        .order("skill_name", { ascending: true });

      if (skillsError) throw skillsError;

      const allData: SkillDetailsData[] = [];

      for (const skill of skills || []) {
        const [highlightsRes, applicationsRes, toolsRes, stepsRes] =
          await Promise.all([
            supabase.from("skill_highlights").select("*").eq("skill_id", skill.id).order("order_index", { ascending: true }),
            supabase.from("skill_applications").select("*").eq("skill_id", skill.id).order("order_index", { ascending: true }),
            supabase.from("skill_tools").select("*").eq("skill_id", skill.id).order("order_index", { ascending: true }),
            supabase.from("skill_steps").select("*").eq("skill_id", skill.id).order("order_index", { ascending: true }),
          ]);

        allData.push({
          skill,
          highlights: highlightsRes.data || [],
          applications: applicationsRes.data || [],
          tools: toolsRes.data || [],
          steps: stepsRes.data || [],
        });
      }

      setSkillsData(allData);
    } catch (error) {
      toast.error(t("Error fetching data matrix.", "データマトリックスの取得エラー。", "Lỗi khi tải ma trận dữ liệu."));
    } finally {
      setLoading(false);
    }
  };

  const selectedData = skillsData.find((d) => d.skill.id === selectedSkillId);

  const handleEdit = (type: "highlight" | "application" | "tool" | "step", item: any) => {
    setEditingItem({ type, id: item.id });
    setFormData(item);
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleAddNew = (type: "highlight" | "application" | "tool" | "step") => {
    const counts = {
      highlight: selectedData?.highlights.length || 0,
      application: selectedData?.applications.length || 0,
      tool: selectedData?.tools.length || 0,
      step: selectedData?.steps.length || 0,
    };
    setEditingItem({ type, id: null });
    setFormData({ order_index: counts[type] });
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingItem || !selectedSkillId) return;
    const { type, id } = editingItem;
    const table = type === "highlight" ? "skill_highlights" : type === "application" ? "skill_applications" : type === "tool" ? "skill_tools" : "skill_steps";

    try {
      setSaving(true);
      if (id) {
        const { error } = await supabase.from(table).update(formData).eq("id", id);
        if (error) throw error;
        toast.success(t(`${type} refined.`, `${type}が洗練されました。`, `Đã cập nhật ${type}.`));
      } else {
        const { error } = await supabase.from(table).insert([{ ...formData, skill_id: selectedSkillId }]);
        if (error) throw error;
        toast.success(t(`New ${type} initialized.`, `新しい${type}が初期化されました。`, `Đã khởi tạo ${type} mới.`));
      }
      setIsDialogOpen(false);
      await refetchSection(type);
    } catch (error) {
      toast.error(t(`Error saving ${type}.`, `${type}の保存エラー。`, `Lỗi khi lưu ${type}.`));
    } finally {
      setSaving(false);
    }
  };

  const refetchSection = async (type: "highlight" | "application" | "tool" | "step") => {
    const table = type === "highlight" ? "skill_highlights" : type === "application" ? "skill_applications" : type === "tool" ? "skill_tools" : "skill_steps";
    const { data } = await supabase.from(table).select("*").eq("skill_id", selectedSkillId).order("order_index", { ascending: true });
    setSkillsData(prev => prev.map(item => item.skill.id === selectedSkillId ? { ...item, [type + 's']: data || [] } : item));
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.itemId || !editingItem) return;
    const { type } = editingItem;
    const table = type === "highlight" ? "skill_highlights" : type === "application" ? "skill_applications" : type === "tool" ? "skill_tools" : "skill_steps";
    try {
      const { error } = await supabase.from(table).delete().eq("id", deleteConfirm.itemId);
      if (error) throw error;
      toast.success(t(`${type} purged.`, `${type}が消去されました。`, `Đã xóa ${type}.`));
      deleteConfirm.closeConfirm();
      await refetchSection(type);
    } catch (error) {
      toast.error(t("Purge failure.", "消去に失敗しました。", "Xóa thất bại."));
    }
  };

  const updateVisibility = async (field: string, value: boolean) => {
    if (!selectedSkillId) return;
    try {
      const { error } = await supabase.from("skills").update({ [field]: value }).eq("id", selectedSkillId);
      if (error) throw error;
      setSkillsData(prev => prev.map(item => item.skill.id === selectedSkillId ? { ...item, skill: { ...item.skill, [field]: value } } : item));
      toast.success(t("Atmosphere modified.", "雰囲気が変更されました。", "Đã thay đổi trạng thái hiển thị."));
    } catch (error) {
      toast.error(t("Error.", "エラー。", "Lỗi."));
    }
  };

  const handleAutoTranslate = async () => {
    try {
      setIsTranslating(true);
      const fieldsToTranslate: any = {};
      if (formData.title || formData.step_title || formData.tool_name) {
        fieldsToTranslate.title = formData.title || formData.step_title || formData.tool_name;
      }
      if (formData.description || formData.step_description) {
        fieldsToTranslate.description = formData.description || formData.step_description;
      }

      const translatedJa = await translateFields(fieldsToTranslate, "ja");
      const translatedVi = await translateFields(fieldsToTranslate, "vi");
      
      const newFormData = { ...formData };
      if (formData.title) {
        newFormData.title_ja = translatedJa.title;
        newFormData.title_vi = translatedVi.title;
      }
      if (formData.step_title) {
        newFormData.step_title_ja = translatedJa.title;
        newFormData.step_title_vi = translatedVi.title;
      }
      if (formData.tool_name) {
        newFormData.tool_name_ja = translatedJa.title;
        newFormData.tool_name_vi = translatedVi.title;
      }
      if (formData.description) {
        newFormData.description_ja = translatedJa.description;
        newFormData.description_vi = translatedVi.description;
      }
      if (formData.step_description) {
        newFormData.step_description_ja = translatedJa.description;
        newFormData.step_description_vi = translatedVi.description;
      }
      
      setFormData(newFormData);
      toast.success(t("Magic! Global sync complete.", "魔法！グローバル同期が完了しました。", "Ảo thuật! Đã đồng bộ toàn cầu thành công."));
    } catch (error) {
      toast.error(t("Translation failed.", "翻訳に失敗しました。", "Dịch thất bại."));
    } finally {
      setIsTranslating(false);
    }
  };

  const tabs = useMemo((): AdminTabConfig[] => {
    if (!editingItem) return [];
    
    const type = editingItem.type;
    const isHighlight = type === "highlight";
    const isTool = type === "tool";
    const isStep = type === "step";
    const isApp = type === "application";

    const coreTab: AdminTabConfig = {
      id: "general",
      label: t("Core", "コア", "Cốt lõi"),
      fullLabel: t("Core Narrative", "コア・ナラティブ", "Nội dung cốt lõi"),
      icon: FileText,
      content: (
        <div className="space-y-12 max-w-2xl">
          <AdminFormSection title={t(`${type.charAt(0).toUpperCase() + type.slice(1)} Metadata`, `${type}メタデータ`, `Siêu dữ liệu ${type}`)}>
            <AdminField label={isStep ? t("Step Title", "手順のタイトル", "Tiêu đề bước") : isTool ? t("Tool Name", "ツール名", "Tên công cụ") : t("Title (EN)", "タイトル (EN)", "Tiêu đề (EN)")}>
              <Input
                value={formData.title || formData.step_title || formData.tool_name || ""}
                onChange={(e) => setFormData({ ...formData, [isStep ? "step_title" : isTool ? "tool_name" : "title"]: e.target.value })}
                className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold"
              />
            </AdminField>
            
            {!isTool && (
              <AdminField label={t("Description (EN)", "説明 (EN)", "Mô tả (EN)")}>
                <Textarea
                  value={formData.description || formData.step_description || ""}
                  onChange={(e) => setFormData({ ...formData, [isStep ? "step_description" : "description"]: e.target.value })}
                  rows={5}
                  className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold"
                />
              </AdminField>
            )}

            <AdminField label={t("Layout Order", "レイアウト順序", "Thứ tự hiển thị")}>
              <Input
                type="number"
                value={formData.order_index || 0}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold"
              />
            </AdminField>
          </AdminFormSection>
        </div>
      )
    };

    const localizationTab: AdminTabConfig = {
      id: "localization",
      label: t("i18n", "言語", "Ngôn ngữ"),
      fullLabel: t("Translations", "翻訳", "Bản dịch"),
      icon: Globe2,
      content: (
        <div className="space-y-12 max-w-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-sage/5 p-10 rounded-[3rem] border border-sage/10 relative overflow-hidden group shadow-sm gap-8">
            <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-sage shadow-xl">
                <Globe2 size={32} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sage uppercase tracking-[0.2em] mb-1">{t("Pacific linguistic protocol", "太平洋言語プロトコル", "Hệ thống đa ngôn ngữ")}</h4>
              </div>
            </div>
            <Button onClick={handleAutoTranslate} disabled={isTranslating} className="w-full sm:w-auto h-16 px-12 bg-sage text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-widest shadow-2xl shadow-sage/30">
              {isTranslating ? <LoadingSpinner /> : <Wand2 size={20} />}
              {isTranslating ? t("SYNC...", "同期中...", "ĐANG ĐỒNG BỘ...") : t("MAGIC AUTO-SYNC", "マジック同期", "ĐỒNG BỘ THẦN KỲ")}
            </Button>
          </div>

          <AdminFormSection title={t("Japanese Narrative Layer", "日本語ナラティブレイヤー", "Lớp nội dung tiếng Nhật")}>
            <AdminField label={isStep ? t("Step Title (JP)", "手順のタイトル (JP)", "Tiêu đề bước (JP)") : isTool ? t("Tool Name (JP)", "ツール名 (JP)", "Tên công cụ (JP)") : t("Title (JP)", "タイトル (JP)", "Tiêu đề (JP)")}>
              <Input
                value={formData.title_ja || formData.step_title_ja || formData.tool_name_ja || ""}
                onChange={(e) => setFormData({ ...formData, [isStep ? "step_title_ja" : isTool ? "tool_name_ja" : "title_ja"]: e.target.value })}
                className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold"
              />
            </AdminField>
            
            {!isTool && (
              <AdminField label={t("Description (JP)", "説明 (JP)", "Mô tả (JP)")}>
                <Textarea
                  value={formData.description_ja || formData.step_description_ja || ""}
                  onChange={(e) => setFormData({ ...formData, [isStep ? "step_description_ja" : "description_ja"]: e.target.value })}
                  rows={5}
                  className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold"
                />
              </AdminField>
            )}
          </AdminFormSection>

          <AdminFormSection title={t("Vietnamese Narrative Layer", "ベトナム語ナラティブレイヤー", "Lớp nội dung tiếng Việt")}>
            <AdminField label={isStep ? t("Step Title (VI)", "手順のタイトル (VI)", "Tiêu đề bước (VI)") : isTool ? t("Tool Name (VI)", "ツール名 (VI)", "Tên công cụ (VI)") : t("Title (VI)", "タイトル (VI)", "Tiêu đề (VI)")}>
              <Input
                value={formData.title_vi || formData.step_title_vi || formData.tool_name_vi || ""}
                onChange={(e) => setFormData({ ...formData, [isStep ? "step_title_vi" : isTool ? "tool_name_vi" : "title_vi"]: e.target.value })}
                className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold"
              />
            </AdminField>
            
            {!isTool && (
              <AdminField label={t("Description (VI)", "説明 (VI)", "Mô tả (VI)")}>
                <Textarea
                  value={formData.description_vi || formData.step_description_vi || ""}
                  onChange={(e) => setFormData({ ...formData, [isStep ? "step_description_vi" : "description_vi"]: e.target.value })}
                  rows={5}
                  className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold"
                 />
              </AdminField>
            )}
          </AdminFormSection>
        </div>
      )
    };

    const mediaTab: AdminTabConfig | null = (isHighlight || isTool) ? {
      id: "media",
      label: t("Media", "メディア", "Thư viện"),
      fullLabel: t("Visual Assets", "ビジュアルアセット", "Tài nguyên hình ảnh"),
      icon: ImageIcon,
      content: (
        <div className="space-y-12 max-w-xl">
          <AdminFormSection title={t("Visual Core", "ビジュアルコア", "Hình ảnh cốt lõi")}>
            <MediaInput
              label={isTool ? t("Tool Icon", "ツールアイコン", "Icon công cụ") : t("Highlight Image", "ハイライト画像", "Ảnh nổi bật")}
              value={isTool ? (formData.icon_url || "") : (formData.image_url || "")}
              onChange={(url) => setFormData({ ...formData, [isTool ? "icon_url" : "image_url"]: url })}
            />
            {isTool && (
               <AdminField label={t("Documentation Link (Optional)", "ドキュメントリンク (任意)", "Link tài liệu (Tùy chọn)")}>
                  <Input
                    value={formData.tool_url || ""}
                    onChange={(e) => setFormData({ ...formData, tool_url: e.target.value })}
                    placeholder="https://..."
                    className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold"
                  />
               </AdminField>
            )}
          </AdminFormSection>
        </div>
      )
    } : null;

    return [coreTab, mediaTab, localizationTab].filter(Boolean) as AdminTabConfig[];
  }, [editingItem, formData, isTranslating]);

  if (loading) return <AdminLayout><AdminLoading message={t("Loading Skills...", "スキルを読み込み中...", "Đang tải kỹ năng...")} /></AdminLayout>;

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={confirmDelete}
        itemName={deleteConfirm.itemName}
      />

      <div className="flex flex-col lg:flex-row gap-6 md:gap-10 lg:h-[calc(100vh-140px)] animate-in fade-in duration-700">
        {/* LEFT SIDEBAR - SKILL SELECTOR */}
        <div className="w-full lg:w-80 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl md:rounded-[3rem] overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 md:p-10 border-b border-border/10 bg-sage/5">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-heading">{translations[lang].skillsGrid}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1 md:mt-2">{skillsData.length} {translations[lang].activeNodes}</p>
          </div>
          <div className="flex-1 lg:overflow-y-auto p-3 md:p-4 md:space-y-2 no-scrollbar lg:custom-scrollbar flex lg:flex-col gap-2 overflow-x-auto">
            {skillsData.map((data) => (
              <button
                key={data.skill.id}
                onClick={() => setSelectedSkillId(data.skill.id)}
                className={cn(
                  "flex-shrink-0 lg:w-full group flex items-center justify-between px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300",
                  selectedSkillId === data.skill.id
                    ? "bg-sage text-white shadow-xl shadow-sage/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-sage/5 hover:text-sage bg-white/50 lg:bg-transparent"
                )}
              >
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div className={cn("w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-[10px] transition-all", selectedSkillId === data.skill.id ? "bg-white/20" : "bg-sage/5 group-hover:bg-sage/10")}>
                    {data.skill.skill_name.charAt(0)}
                  </div>
                  <span className="text-xs md:text-sm font-bold truncate max-w-[120px] md:max-w-none">{data.skill.skill_name}</span>
                </div>
                <ChevronRight size={14} className={cn("hidden lg:block transition-opacity", selectedSkillId === data.skill.id ? "opacity-100" : "opacity-0")} />
              </button>
            ))}
          </div>
        </div>

        {/* MAIN PANEL */}
        <div className="flex-1 lg:overflow-y-auto lg:pr-6 custom-scrollbar space-y-8 md:space-y-12 pb-12">
          {selectedData ? (
            <>
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl md:rounded-[3.5rem] p-6 md:p-12 shadow-sm relative group overflow-hidden">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-4 md:px-5 py-1.5 md:py-2 rounded-full border border-sage/20 bg-sage/5 text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-sage">Experience Architect</span>
                      <span className={cn("w-1.5 h-1.5 rounded-full bg-sage", selectedData.skill.is_published ? "animate-pulse" : "opacity-30")}></span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-serif font-bold text-heading tracking-tight">
                      {lang === 'ja' ? (selectedData.skill.skill_name_ja || selectedData.skill.skill_name) : 
                       lang === 'vi' ? (selectedData.skill.skill_name_vi || selectedData.skill.skill_name) : 
                       selectedData.skill.skill_name}
                    </h1>
                  </div>

                  <div className="flex flex-wrap gap-2 md:gap-4">
                    {[
                      { label: t("Highlights", "ハイライト", "Điểm nổi bật"), field: "show_highlights" },
                      { label: t("Case Study", "ケーススタディ", "Nghiên cứu điển hình"), field: "show_steps" },
                      { label: t("Applications", "アプリケーション", "Ứng dụng"), field: "show_applications" },
                      { label: t("Tools", "ツール", "Công cụ"), field: "show_tools" },
                    ].map((ctrl) => (
                      <button
                        key={ctrl.field}
                        onClick={() => updateVisibility(ctrl.field, !(selectedData.skill as any)[ctrl.field])}
                        className={cn(
                          "px-4 md:px-5 py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all border",
                          (selectedData.skill as any)[ctrl.field]
                            ? "bg-sage text-white border-sage shadow-lg shadow-sage/10"
                            : "bg-white/40 text-muted-foreground border-border/20 grayscale opacity-60 hover:opacity-100"
                        )}
                      >
                        {ctrl.label} {(selectedData.skill as any)[ctrl.field] ? "ON" : "OFF"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* GRID OF SECTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                {/* HIGHLIGHTS */}
                <DetailSection
                  title={t("Highlights", "ハイライト", "Điểm nổi bật")}
                  icon={Zap}
                  items={selectedData.highlights}
                  onAdd={() => handleAddNew("highlight")}
                  onEdit={(item) => handleEdit("highlight", item)}
                  onDelete={(id, title) => { setEditingItem({ type: "highlight", id }); deleteConfirm.openConfirm(id, title); }}
                  renderItem={(h) => (
                    <div className="space-y-0.5 md:space-y-1 overflow-hidden pr-2">
                      <h4 className="text-xs md:text-sm font-bold text-heading truncate">
                        {lang === 'ja' ? (h.title_ja || h.title) : lang === 'vi' ? (h.title_vi || h.title) : h.title}
                      </h4>
                      <p className="text-[9px] md:text-[10px] font-serif italic text-muted-foreground line-clamp-1">
                        {lang === 'ja' ? (h.description_ja || h.description) : lang === 'vi' ? (h.description_vi || h.description) : h.description}
                      </p>
                    </div>
                  )}
                />

                {/* TOOLS */}
                <DetailSection
                  title={t("Stack", "スタック", "Công cụ")}
                  icon={Wrench}
                  items={selectedData.tools}
                  onAdd={() => handleAddNew("tool")}
                  onEdit={(item) => handleEdit("tool", item)}
                  onDelete={(id, title) => { setEditingItem({ type: "tool", id }); deleteConfirm.openConfirm(id, title); }}
                  renderItem={(tool: any) => (
                    <div className="flex items-center gap-4 overflow-hidden pr-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-sage/5 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        {tool.icon_url ? <img src={tool.icon_url} className="w-5 h-5 md:w-6 md:h-6 object-contain" alt="" /> : <Cpu size={14} className="text-sage" />}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs md:text-sm font-bold text-heading truncate">
                           {lang === 'ja' ? (tool.tool_name_ja || tool.tool_name) : lang === 'vi' ? (tool.tool_name_vi || tool.tool_name) : tool.tool_name}
                        </h4>
                        <p className="text-[8px] md:text-[9px] font-mono text-muted-foreground truncate">{tool.tool_url ? t("External Node", "外部ノード", "Nút bên ngoài") : t("System Node", "システムノード", "Nút hệ thống")}</p>
                      </div>
                    </div>
                  )}
                />

                {/* APPLICATIONS */}
                <DetailSection
                  title={t("Strategic", "戦略的", "Chiến lược")}
                  icon={Workflow}
                  items={selectedData.applications}
                  onAdd={() => handleAddNew("application")}
                  onEdit={(item) => handleEdit("application", item)}
                  onDelete={(id, title) => { setEditingItem({ type: "application", id }); deleteConfirm.openConfirm(id, title); }}
                  renderItem={(a) => (
                    <div className="space-y-0.5 md:space-y-1 overflow-hidden pr-2">
                      <h4 className="text-xs md:text-sm font-bold text-heading truncate">
                         {lang === 'ja' ? (a.title_ja || a.title) : lang === 'vi' ? (a.title_vi || a.title) : a.title}
                      </h4>
                      <p className="text-[9px] md:text-[10px] font-serif italic text-muted-foreground line-clamp-1">
                         {lang === 'ja' ? (a.description_ja || a.description) : lang === 'vi' ? (a.description_vi || a.description) : a.description}
                      </p>
                    </div>
                  )}
                />

                {/* STEPS */}
                <DetailSection
                  title={t("Sequence", "手順", "Quy trình")}
                  icon={ListChecks}
                  items={selectedData.steps}
                  onAdd={() => handleAddNew("step")}
                  onEdit={(item) => handleEdit("step", item)}
                  onDelete={(id, title) => { setEditingItem({ type: "step", id }); deleteConfirm.openConfirm(id, title); }}
                  renderItem={(s, idx) => (
                    <div className="flex items-center gap-4 overflow-hidden pr-2">
                       <div className="w-7 h-7 bg-sage text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 rounded-full">{idx + 1}</div>
                       <div className="overflow-hidden">
                        <h4 className="text-xs md:text-sm font-bold text-heading truncate">
                           {lang === 'ja' ? (s.step_title_ja || s.step_title) : lang === 'vi' ? (s.step_title_vi || s.step_title) : s.step_title}
                        </h4>
                        <p className="text-[9px] md:text-[10px] font-serif italic text-muted-foreground line-clamp-1">
                           {lang === 'ja' ? (s.step_description_ja || s.step_description) : lang === 'vi' ? (s.step_description_vi || s.step_description) : s.step_description}
                        </p>
                      </div>
                    </div>
                  )}
                />
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-6 bg-white/40 backdrop-blur-xl border border-white/40 rounded-[3rem] p-20 text-center">
              <Brain size={100} className="text-muted-foreground/10" />
              <p className="text-xl font-serif italic text-muted-foreground">{t("Select a skill node from the grid to architect its detailed atmosphere.", "グリッドからスキルノードを選択して、その詳細な雰囲気を構築してください。", "Chọn một năng lực từ lưới để thiết lập chi tiết nội dung.")}</p>
            </div>
          )}
        </div>

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingItem?.id ? t("Refine Node", "ノードを洗練", "Tinh chỉnh nút") : t("Initialize Node", "ノードを初期化", "Khởi tạo nút")}
          description={t(`Architecting the ${editingItem?.type} protocol layer.`, `${editingItem?.type}プロトコルレイヤーを構築中。`, `Đang thiết lập lớp nội dung ${editingItem?.type}.`)}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={saving}
          footerMetadata={editingItem?.id ? `Syncing Node ID: ${editingItem.id}` : "Awaiting New Data Structure"}
        />
      </div>
    </AdminLayout>
  );
};

// Sub-component for sections to reduce repetition
const DetailSection = ({ title, icon: Icon, items, onAdd, onEdit, onDelete, renderItem }: any) => {
  const { t } = useLang();
  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl md:rounded-[3rem] p-6 md:p-10 shadow-sm space-y-6 md:space-y-8 flex flex-col hover:shadow-2xl transition-all duration-700">
      <div className="flex items-center justify-between border-b border-border/10 pb-4 md:pb-6">
        <div className="flex items-center gap-3 md:gap-4 text-left">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-sage/5 rounded-xl md:rounded-2xl flex items-center justify-center text-sage">
            <Icon size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-serif font-bold text-heading">{title}</h3>
            <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{items.length} {t("nodes", "ノード", "nút")}</p>
          </div>
        </div>
        <Button onClick={onAdd} className="w-9 h-9 md:w-10 md:h-10 bg-sage/10 text-sage hover:bg-sage hover:text-white rounded-lg md:rounded-xl transition-all flex items-center justify-center">
          <Plus size={18} />
        </Button>
      </div>
      <div className="flex-1 space-y-4 md:space-y-6">
        {items.length === 0 ? (
          <div className="py-10 md:py-16 text-center border-2 border-dashed border-sage/10 rounded-[2rem] bg-sage/5">
             <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("No data available in this cluster.", "このクラスターにはデータがありません。", "Không có dữ liệu trong cụm này.")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item: any, idx: number) => (
              <div key={item.id} className="group p-4 md:p-6 bg-white/50 border border-border/5 rounded-xl md:rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500 flex items-center justify-between">
                {renderItem(item, idx)}
                <div className="flex gap-1.5 md:gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(item)} className="w-8 h-8 rounded-lg bg-sage/5 text-sage flex items-center justify-center hover:bg-sage hover:text-white transition-all shadow-sm">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => onDelete(item.id, item.title || item.step_title || item.tool_name)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillDetailsAdmin;
