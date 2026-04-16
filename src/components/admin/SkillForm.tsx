"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  X, Save, Wand2, Globe2, ImageIcon, Settings2, FileText, 
  SlidersHorizontal, ShieldCheck, Sparkles, CheckCircle2, 
  Eye, EyeOff, Zap, Brain, Rocket, Info,
  Box,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaInput } from "@/components/admin/media/MediaInput";
import { SkillImageGallery } from "@/components/admin/SkillImageGallery";
import { translateFields } from "@/lib/translate";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/contexts/LangContext";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Skill, SkillCategory } from "@/types/skills";
import { AdminDialogForm, AdminTabConfig } from "./shared/AdminDialogForm";
import { AdminFormSection, AdminField } from "./shared/AdminFormSection";
import { AdminStatusToggle } from "./shared/AdminStatusToggle";
import { cn } from "@/lib/utils";

interface SkillFormProps {
  skillId: string | null;
  categories: SkillCategory[];
  onClose: () => void;
  onSave: () => void;
}

export const SkillForm = ({ skillId, categories, onClose, onSave }: SkillFormProps) => {
  const { lang, t, translations } = useLang();
  const [activeTab, setActiveTab ] = useState("core");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [formData, setFormData] = useState<Partial<Skill>>({
    slug: "",
    category_id: "",
    skill_name: "",
    skill_name_ja: "",
    skill_name_vi: "",
    short_description: "",
    short_description_ja: "",
    short_description_vi: "",
    overview: "",
    overview_ja: "",
    overview_vi: "",
    application: "",
    application_ja: "",
    application_vi: "",
    use_cases: "",
    use_cases_ja: "",
    use_cases_vi: "",
    difficulty_level: "Beginner",
    difficulty_level_ja: "",
    difficulty_level_vi: "",
    experience_level: "",
    experience_level_ja: "",
    experience_level_vi: "",
    estimated_time: "",
    estimated_time_ja: "",
    estimated_time_vi: "",
    icon_url: "",
    cover_image_url: "",
    order_index: 0,
    is_published: true,
    show_highlights: true,
    show_applications: true,
    show_tools: true,
    show_steps: true,
  });

  useEffect(() => {
    if (skillId) {
      fetchSkill();
    }
  }, [skillId]);

  const fetchSkill = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("id", skillId)
        .single();

      if (error) throw error;
      if (data) setFormData(data);
    } catch (error) {
      toast.error(t("Failed to load skill details", "スキルの詳細を読み込めませんでした", "Không thể tải chi tiết kỹ năng"));
    } finally {
      setLoading(false);
    }
  };

  const handleAutoTranslate = async () => {
    try {
      setIsTranslating(true);
      const sourceFields = {
        skill_name: formData.skill_name || "",
        short_description: formData.short_description || "",
        overview: formData.overview || "",
        application: formData.application || "",
        use_cases: formData.use_cases || "",
        difficulty_level: formData.difficulty_level || "",
        experience_level: formData.experience_level || "",
        estimated_time: formData.estimated_time || "",
      };

      const [translatedJa, translatedVi] = await Promise.all([
        translateFields(sourceFields, "ja"),
        translateFields(sourceFields, "vi")
      ]);

      setFormData({
        ...formData,
        skill_name_ja: translatedJa.skill_name || formData.skill_name_ja,
        short_description_ja: translatedJa.short_description || formData.short_description_ja,
        overview_ja: translatedJa.overview || formData.overview_ja,
        application_ja: translatedJa.application || formData.application_ja,
        use_cases_ja: translatedJa.use_cases || formData.use_cases_ja,
        difficulty_level_ja: translatedJa.difficulty_level || formData.difficulty_level_ja,
        experience_level_ja: translatedJa.experience_level || formData.experience_level_ja,
        estimated_time_ja: translatedJa.estimated_time || formData.estimated_time_ja,
        
        skill_name_vi: translatedVi.skill_name || formData.skill_name_vi,
        short_description_vi: translatedVi.short_description || formData.short_description_vi,
        overview_vi: translatedVi.overview || formData.overview_vi,
        application_vi: translatedVi.application || formData.application_vi,
        use_cases_vi: translatedVi.use_cases || formData.use_cases_vi,
        difficulty_level_vi: translatedVi.difficulty_level || formData.difficulty_level_vi,
        experience_level_vi: translatedVi.experience_level || formData.experience_level_vi,
        estimated_time_vi: translatedVi.estimated_time || formData.estimated_time_vi,
      });

      toast.success(t("Magic! Global sync complete.", "素晴らしい！グローバル同期が完了しました。", "Kỳ diệu! Hoàn tất đồng bộ toàn cầu."));
    } catch (error) {
      toast.error(t("Translation failed.", "翻訳に失敗しました。", "Dịch thất bại."));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.skill_name || !formData.slug || !formData.category_id) {
      toast.error("Skill name, slug, and category are required");
      return;
    }

    try {
      setSaving(true);
      if (skillId) {
        const { error } = await supabase.from("skills").update(formData).eq("id", skillId);
        if (error) throw error;
        toast.success(t("Skill refinements published.", "スキルの洗練が公開されました。", "Đã xuất bản các cải tiến kỹ năng."));
      } else {
        const { error } = await supabase.from("skills").insert([formData]);
        if (error) throw error;
        toast.success(t("New skill successfully integrated.", "新しいスキルが正常に統合されました。", "Tích hợp kỹ năng mới thành công."));
      }
      onSave();
    } catch (error) {
      toast.error(t("Error saving skill", "スキルの保存中にエラーが発生しました", "Lỗi khi lưu kỹ năng"));
    } finally {
      setSaving(false);
    }
  };

  const tabs = useMemo((): AdminTabConfig[] => [
    {
      id: "core",
      label: t("Core", "コア", "Cốt lõi"),
      fullLabel: t("General", "一般", "Chung"),
      icon: Settings2,
      content: (
        <div className="space-y-12 max-w-2xl">
          <AdminFormSection title={t("Core Metadata", "コアメタデータ", "Siêu dữ liệu cốt lõi")}>
            <AdminField label={t("Skill Nomenclature (EN)", "スキルの名称 (EN)", "Danh pháp kỹ năng (EN)")}>
              <Input
                value={formData.skill_name || ""}
                onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold"
              />
            </AdminField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminField label={t("System Slug", "システムスラグ", "Slug hệ thống")}>
                <Input value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="h-14 px-6 bg-muted/10 border-none rounded-xl font-mono text-xs" />
              </AdminField>
              <AdminField label={t("Category", "カテゴリー", "Danh mục")}>
                <select
                  value={formData.category_id || ""}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold focus:outline-none"
                >
                   <option value="">{t("Select Cluster", "クラスターを選択", "Chọn cụm")}</option>
                   {categories.map(c => <option key={c.id} value={c.id}>{lang === 'en' ? c.name_en : lang === 'ja' ? c.name_ja : (c.name_vi || c.name_en)}</option>)}
                </select>
              </AdminField>
            </div>
          </AdminFormSection>
          
          <AdminFormSection title={t("Configuration", "構成", "Cấu hình")}>
             <AdminStatusToggle
                label={t("Public Presence", "公開プレゼンス", "Hiện diện công khai")}
                isPublished={formData.is_published || false}
                onToggle={(val) => setFormData({...formData, is_published: val})}
                description={{
                  active: t("Strategic node is fully broadcasted into the public matrix.", "戦略的ノードはパブリックマトリックスに完全にブロードキャストされています。", "Nút chiến lược đang được phát sóng hoàn toàn trong ma trận công khai."),
                  inactive: t("Node remains in encrypted development / private prototype mode.", "ノードは暗号化された開発/プライベートプロトタイプモードのままです。", "Nút vẫn ở chế độ phát triển mã hóa / nguyên mẫu riêng tư.")
                }}
             />
             <AdminField label={t("Sequential Priority", "順序の優先度", "Ưu tiên tuần tự")}>
                <Input type="number" value={formData.order_index || 0} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})} className="h-14 px-6 bg-white border border-sage/20 rounded-xl font-bold" />
             </AdminField>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "narrative",
      label: t("Story", "ストーリー", "Câu chuyện"),
      fullLabel: t("Strategic Narrative", "戦略的ナラティブ", "Câu chuyện chiến lược"),
      icon: FileText,
      content: (
        <div className="space-y-12 max-w-2xl">
          <AdminFormSection title={t("Narrative Summary", "ナラティブの概要", "Tóm tắt câu chuyện")}>
            <AdminField label={t("Short Intro / Hook (EN)", "短いイントロ / フック (EN)", "Giới thiệu ngắn / Hook (EN)")}>
              <Input value={formData.short_description || ""} onChange={(e) => setFormData({...formData, short_description: e.target.value})} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
            </AdminField>
            <AdminField label={t("Detailed Methodology Overview (EN)", "詳細な方法論の概要 (EN)", "Tổng quan phương pháp luận chi tiết (EN)")}>
              <Textarea value={formData.overview || ""} onChange={(e) => setFormData({...formData, overview: e.target.value})} rows={10} className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold" />
            </AdminField>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "localization",
      label: "i18n",
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
              {isTranslating ? t("SYNC...", "同期中...", "ĐANG ĐỒNG BỘ...") : t("MAGIC AUTO-SYNC", "マジック自動同期", "TỰ ĐỘNG ĐỒNG BỘ THẦN KỲ")}
            </Button>
          </div>

          <AdminFormSection title={t("Japanese Narrative Layer", "日本語のナラティブレイヤー", "Lớp câu chuyện tiếng Nhật")}>
            <AdminField label={t("Skill Name (JP)", "スキル名 (JP)", "Tên kỹ năng (JP)")}>
              <Input value={formData.skill_name_ja || ""} onChange={(e) => setFormData({...formData, skill_name_ja: e.target.value})} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
            </AdminField>
            <AdminField label={t("Short Intro (JP)", "短いイントロ (JP)", "Giới thiệu ngắn (JP)")}>
              <Input value={formData.short_description_ja || ""} onChange={(e) => setFormData({...formData, short_description_ja: e.target.value})} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
            </AdminField>
            <AdminField label={t("Overview (JP)", "概要 (JP)", "Tổng quan (JP)")}>
              <Textarea value={formData.overview_ja || ""} onChange={(e) => setFormData({...formData, overview_ja: e.target.value})} rows={8} className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold" />
            </AdminField>
          </AdminFormSection>

          <AdminFormSection title={t("Vietnamese Narrative Layer", "ベトナム語のナラティブレイヤー", "Lớp câu chuyện tiếng Việt")}>
            <AdminField label={t("Skill Name (VI)", "スキル名 (VI)", "Tên kỹ năng (VI)")}>
              <Input value={formData.skill_name_vi || ""} onChange={(e) => setFormData({...formData, skill_name_vi: e.target.value})} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
            </AdminField>
            <AdminField label={t("Short Intro (VI)", "短いイントロ (VI)", "Giới thiệu ngắn (VI)")}>
              <Input value={formData.short_description_vi || ""} onChange={(e) => setFormData({...formData, short_description_vi: e.target.value})} className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
            </AdminField>
            <AdminField label={t("Overview (VI)", "概要 (VI)", "Tổng quan (VI)")}>
              <Textarea value={formData.overview_vi || ""} onChange={(e) => setFormData({...formData, overview_vi: e.target.value})} rows={8} className="p-6 bg-white/70 border border-sage/20 rounded-2xl font-serif italic text-sm font-bold" />
            </AdminField>
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
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <AdminFormSection title={t("Node Identity Assets", "ノードのアイデンティティ資産", "Tài sản định danh nút")}>
                <MediaInput label={t("Vector Icon", "ベクターアイコン", "Biểu tượng Vector")} value={formData.icon_url || ""} onChange={(url) => setFormData({...formData, icon_url: url})} allowedTypes={['icon', 'svg']} />
                <MediaInput label={t("Environmental Cover", "環境カバー", "Ảnh bìa môi trường")} value={formData.cover_image_url || ""} onChange={(url) => setFormData({...formData, cover_image_url: url})} allowedTypes={['image']} />
              </AdminFormSection>
              
              <AdminFormSection title={t("Experience Gallery", "経験ギャラリー", "Bộ sưu tập trải nghiệm")}>
                {skillId ? (
                   <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-black/[0.02]">
                     <SkillImageGallery skillId={skillId} />
                   </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-sage/20 rounded-[2.5rem] bg-white text-center opacity-40">
                     <ImageIcon size={48} className="text-muted-foreground/30 mb-4" />
                     <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{t("Initialize node to activate gallery cloud", "ギャラリークラウドを有効にするにはノードを初期化してください", "Khởi tạo nút để kích hoạt đám mây bộ sưu tập")}</p>
                  </div>
                )}
              </AdminFormSection>
           </div>
        </div>
      )
    },
    {
      id: "metrics",
      label: t("Metrics", "メトリック", "Số liệu"),
      fullLabel: t("Impact Parameters", "影響パラメータ", "Thông số tác động"),
      icon: SlidersHorizontal,
      content: (
        <div className="space-y-12 max-w-2xl">
          <AdminFormSection title={t("Technical Depth Layout", "テクニカルデプスレイアウト", "Bố cục độ sâu kỹ thuật")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <AdminField label={t("Depth Level (EN)", "深度レベル (EN)", "Mức độ sâu (EN)")}>
                  <select value={formData.difficulty_level || "Beginner"} onChange={(e) => setFormData({...formData, difficulty_level: e.target.value})} className="w-full h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold appearance-none">
                    <option value="Beginner">{t("Beginner", "初級", "Người mới bắt đầu")}</option>
                    <option value="Intermediate">{t("Intermediate", "中級", "Trung cấp")}</option>
                    <option value="Advanced">{t("Advanced", "上級", "Nâng cao")}</option>
                    <option value="Expert">{t("Expert", "エキスパート", "Chuyên gia")}</option>
                  </select>
               </AdminField>
               <AdminField label={t("Tenure (EN)", "保有期間 (EN)", "Thâm niên (EN)")}>
                  <Input value={formData.experience_level || ""} onChange={(e) => setFormData({...formData, experience_level: e.target.value})} placeholder="e.g. 5+ Years" className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
               </AdminField>
            </div>
            <AdminField label={t("Temporal Accumulation (EN)", "時間的蓄積 (EN)", "Tích lũy thời gian (EN)")}>
               <Input value={formData.estimated_time || ""} onChange={(e) => setFormData({...formData, estimated_time: e.target.value})} placeholder="e.g. Mastered over a decade" className="h-14 px-6 bg-white/70 border border-sage/20 rounded-xl font-bold" />
            </AdminField>
          </AdminFormSection>
        </div>
      )
    },
    {
      id: "protocols",
      label: t("Config", "設定", "Cấu hình"),
      fullLabel: t("Interface Settings", "インターフェース設定", "Cài đặt giao diện"),
      icon: ShieldCheck,
      content: (
        <div className="space-y-12 max-w-2xl">
          <AdminFormSection title={t("Section Deployment Toggles", "セクション展開トグル", "Chuyển đổi triển khai mục")}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: "show_highlights", label: t("Neural Highlights", "ニューラルハイライト", "Điểm nổi bật thần kinh"), desc: t("Core visual anchor points", "コアビジュアルアンカーポイント", "Các điểm neo hình ảnh cốt lõi") },
                  { id: "show_applications", label: t("Strategic Apps", "戦略的アプリ", "Ứng dụng chiến lược"), desc: t("Systematic logic application", "体系的なロジックアプリケーション", "Ứng dụng logic có hệ thống") },
                  { id: "show_tools", label: t("Neural Stack", "ニューラルスタック", "Ngăn xếp thần kinh"), desc: t("Software & Hardware cluster", "ソフトウェア＆ハードウェアクラスター", "Cụm phần mềm & phần cứng") },
                  { id: "show_steps", label: t("Operational Flow", "運用フロー", "Luồng hoạt động"), desc: t("Methodological progression", "方法論的な進歩", "Tiến trình phương pháp luận") }
                ].map(item => (
                  <div 
                    key={item.id}
                    className={cn(
                      "flex items-center gap-5 p-5 rounded-[1.8rem] border transition-all cursor-pointer",
                      formData[item.id as keyof Skill] ? "bg-sage/5 border-sage/20 shadow-md" : "bg-slate-50 border-black/[0.01] opacity-60"
                    )}
                    onClick={() => setFormData({...formData, [item.id]: !formData[item.id as keyof Skill]})}
                  >
                     <div className={cn("w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all", formData[item.id as keyof Skill] ? "bg-sage text-white shadow-lg" : "bg-slate-200 text-slate-400 shadow-none")}>
                        <CheckCircle2 size={18} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-heading leading-tight">{item.label}</p>
                        <p className="text-[8px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider leading-tight">{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </AdminFormSection>
        </div>
      )
    }
  ], [formData, categories, lang, isTranslating]);

  return (
    <AdminDialogForm
      open={true}
      onOpenChange={(open) => !open && onClose()}
      title={skillId ? t("Layout Node Refinement", "レイアウトノードの洗練", "Cải thiện nút bố cục") : t("New Experience Synthesis", "新しい経験の合成", "Tổng hợp trải nghiệm mới")}
      description={t("Refine the architectural parameters and narrative depth of this expertise node.", "この専門知識ノードのアーキテクチャパラメータとナラティブの深さを洗練させます。", "Cải thiện các thông số kiến trúc và chiều sâu câu chuyện của nút chuyên môn này.")}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSubmit}
      saving={saving}
      saveLabel={skillId ? t("Refine Node", "ノードを洗練", "Cải thiện nút") : t("Synthesize Layout", "レイアウトを合成", "Tổng hợp bố cục")}
      footerMetadata={skillId ? `${t("Syncing Node ID", "同期中のノードID", "Đang đồng bộ ID nút")}: ${skillId}` : t("Awaiting New Data Structure", "新しいデータ構造を待機中", "Đang chờ cấu trúc dữ liệu mới")}
    />
  );
};
