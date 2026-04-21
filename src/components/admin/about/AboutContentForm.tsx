import { ReactNode } from "react";
import { AdminField, AdminFormSection } from "../shared/AdminFormSection";
import { AdminStatusToggle } from "../shared/AdminStatusToggle";
import { Globe2, Wand2, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

interface AboutContentFormProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  isTranslating: boolean;
  onAutoTranslate: () => void;
  // Tag section props
  allTags: any[];
  selectedTagIds: string[];
  onTagToggle: (tagId: string) => void;
  lang: string;
  // Media section
  mediaSlot?: ReactNode;
}

export const AboutContentForm = ({
  formData,
  setFormData,
  activeSection,
  isTranslating,
  onAutoTranslate,
  allTags,
  selectedTagIds,
  onTagToggle,
  lang,
  mediaSlot,
}: AboutContentFormProps) => {
  const { t } = useLang();
  return (
    <div className="space-y-10 text-left">
      {activeSection === "general" && (
        <div className="space-y-10 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminFormSection title={t("Narrative Hierarchy", "物語の階層", "Cấu trúc nội dung")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminField label={t("Section Key (ID)", "セクションキー (ID)", "Mã phần (ID)")} description={t("Internal identifier for placement.", "配置用の内部識別子。", "Định danh nội bộ để sắp xếp.")}>
                <input
                  value={formData.section_key || ""}
                  onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                  placeholder="e.g. hero-story"
                  className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm"
                />
              </AdminField>
              <AdminField label={t("Spatial Index (Order)", "空間インデックス (順序)", "Chỉ số sắp xếp")}>
                <input
                  type="number"
                  value={formData.order_index ?? 0}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-serif italic font-bold shadow-sm"
                />
              </AdminField>
            </div>
          </AdminFormSection>

          <AdminFormSection title={t("Immersive Content", "没入型コンテンツ", "Nội dung chuyên sâu")}>
            <AdminField label={t("Primary Heading (EN)", "メインの見出し (EN)", "Tiêu đề chính (EN)")}>
              <input
                value={formData.title_en || ""}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="Biographical Heading..."
                className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-2xl font-serif font-bold shadow-sm"
              />
            </AdminField>
            <AdminField label={t("Primary Heading (VI)", "メインの見出し (VI)", "Tiêu đề chính (VI)")}>
              <input
                value={formData.title_vi || ""}
                onChange={(e) => setFormData({ ...formData, title_vi: e.target.value })}
                placeholder="Tiêu đề tiểu sử..."
                className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-2xl font-serif font-bold shadow-sm"
              />
            </AdminField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminField label={t("Narrative Synthesis (EN)", "物語の統合 (EN)", "Tổng hợp nội dung (EN)")}>
                <textarea
                  value={formData.content_en || ""}
                  onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                  placeholder="Architectural biography and professional philosophy..."
                  rows={8}
                  className="w-full p-8 bg-muted/20 border-none rounded-[2.5rem] text-sm leading-relaxed shadow-sm font-serif italic font-bold resize-none"
                />
              </AdminField>
              <AdminField label={t("Narrative Synthesis (VI)", "物語の統合 (VI)", "Tổng hợp nội dung (VI)")}>
                <textarea
                  value={formData.content_vi || ""}
                  onChange={(e) => setFormData({ ...formData, content_vi: e.target.value })}
                  placeholder="Tiểu sử và triết lý chuyên môn..."
                  rows={8}
                  className="w-full p-8 bg-muted/20 border-none rounded-[2.5rem] text-sm leading-relaxed shadow-sm font-serif italic font-bold resize-none"
                />
              </AdminField>
            </div>
          </AdminFormSection>

          <AdminFormSection title={t("Interaction Design (CTA)", "インタラクションデザイン (CTA)", "Thiết kế tương tác (CTA)")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AdminField label={t("Primary Button Label (EN)", "プライマリボタンラベル (EN)", "Nhãn nút chính (EN)")}>
                <input
                  value={formData.cta_primary_label_en || ""}
                  onChange={(e) => setFormData({ ...formData, cta_primary_label_en: e.target.value })}
                  placeholder="View Projects"
                  className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm"
                />
              </AdminField>
              <AdminField label={t("Primary Button Label (VI)", "プライマリボタンラベル (VI)", "Nhãn nút chính (VI)")}>
                <input
                  value={formData.cta_primary_label_vi || ""}
                  onChange={(e) => setFormData({ ...formData, cta_primary_label_vi: e.target.value })}
                  placeholder="Xem dự án"
                  className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm"
                />
              </AdminField>
              <AdminField label={t("Secondary Button Label (EN)", "セカンダリボタンラベル (EN)", "Nhãn nút phụ (EN)")}>
                <input
                  value={formData.cta_secondary_label_en || ""}
                  onChange={(e) => setFormData({ ...formData, cta_secondary_label_en: e.target.value })}
                  placeholder="Download CV"
                  className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm"
                />
              </AdminField>
              <AdminField label={t("Secondary Button Label (VI)", "セカンダリボタンラベル (VI)", "Nhãn nút phụ (VI)")}>
                <input
                  value={formData.cta_secondary_label_vi || ""}
                  onChange={(e) => setFormData({ ...formData, cta_secondary_label_vi: e.target.value })}
                  placeholder="Tải CV"
                  className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm"
                />
              </AdminField>
              <AdminField label={t("Resume/CV URL", "履歴書/CVのURL", "Đường dẫn CV")} className="md:col-span-2">
                <input
                  value={formData.resume_url || ""}
                  onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-mono text-xs shadow-sm"
                />
              </AdminField>
            </div>
          </AdminFormSection>
        </div>
      )}

      {activeSection === "media" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {mediaSlot}
        </div>
      )}

      {activeSection === "taxonomy" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminFormSection title={t("Global Classification", "グローバル分類", "Phân loại toàn cầu")} description={t("Identify taxonomy protocols for filtered exploration.", "フィルター探索用の分類プロトコルを識別します。", "Xác định các giao thức phân loại để lọc và tìm kiếm.")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onTagToggle(tag.id)}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl border transition-all text-left",
                    selectedTagIds.includes(tag.id)
                      ? "bg-sage/5 border-sage/40 shadow-md ring-1 ring-sage/20"
                      : "bg-white border-border/30 hover:border-sage/20 shadow-sm"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    selectedTagIds.includes(tag.id) ? "bg-sage text-white" : "bg-muted/50 text-muted-foreground"
                  )}>
                    {tag.icon_url
                      ? <img src={tag.icon_url} alt="" className="w-6 h-6 object-contain" />
                      : <TagIcon size={18} />
                    }
                  </div>
                  <div>
                    <h4 className={cn("text-xs font-bold truncate", selectedTagIds.includes(tag.id) ? "text-sage" : "text-heading")}>
                      {lang === "en" ? tag.name_en : lang === "vi" ? tag.name_vi || tag.name_en : tag.name_ja}
                    </h4>
                    <p className="text-[9px] text-muted-foreground mt-0.5 font-mono uppercase tracking-tighter truncate">
                      /{tag.slug}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </AdminFormSection>
        </div>
      )}

      {activeSection === "localization" && (
        <div className="space-y-10 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-sage/5 p-8 rounded-[2.5rem] border border-sage/10 gap-6">
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sage shadow-xl">
                <Globe2 size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sage uppercase tracking-[0.2em]">{t("Pacific linguistic protocol", "太平洋言語プロトコル", "Hệ thống đa ngôn ngữ")}</h4>
              </div>
            </div>
            <Button
              onClick={onAutoTranslate}
              disabled={isTranslating}
              className="w-full sm:w-auto h-14 px-10 bg-sage text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3"
            >
              {isTranslating ? <LoadingSpinner /> : <Wand2 size={16} />}
              {isTranslating ? t("SYNC...", "同期中...", "ĐANG ĐỒNG BỘ...") : t("MAGIC AUTO-SYNC", "マジック自動同期", "ĐỒNG BỘ TỰ ĐỘNG")}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdminFormSection title={t("Japanese Narrative Layer", "日本語ナラティブレイヤー", "Lớp nội dung tiếng Nhật")}>
              <AdminField label={t("Title (JP)", "タイトル (JP)", "Tiêu đề (JP)")}>
                <input
                  value={formData.title_ja || ""}
                  onChange={(e) => setFormData({ ...formData, title_ja: e.target.value })}
                  className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-xl font-bold font-serif shadow-sm"
                />
              </AdminField>
              <AdminField label={t("Content (JP)", "コンテンツ (JP)", "Nội dung (JP)")}>
                <textarea
                  value={formData.content_ja || ""}
                  onChange={(e) => setFormData({ ...formData, content_ja: e.target.value })}
                  rows={8}
                  className="w-full p-8 bg-muted/20 border-none rounded-[2.5rem] text-sm font-serif italic font-bold leading-relaxed resize-none"
                />
              </AdminField>
            </AdminFormSection>
            <AdminFormSection title={t("Vietnamese Narrative Layer", "ベトナム語ナラティブレイヤー", "Lớp nội dung tiếng Việt")}>
              <AdminField label={t("Title (VI)", "タイトル (VI)", "Tiêu đề (VI)")}>
                <input
                  value={formData.title_vi || ""}
                  onChange={(e) => setFormData({ ...formData, title_vi: e.target.value })}
                  className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-xl font-bold font-serif shadow-sm"
                />
              </AdminField>
              <AdminField label={t("Content (VI)", "コンテンツ (VI)", "Nội dung (VI)")}>
                <textarea
                  value={formData.content_vi || ""}
                  onChange={(e) => setFormData({ ...formData, content_vi: e.target.value })}
                  rows={8}
                  className="w-full p-8 bg-muted/20 border-none rounded-[2.5rem] text-sm font-serif italic font-bold leading-relaxed resize-none"
                />
              </AdminField>
            </AdminFormSection>
          </div>
        </div>
      )}

      {activeSection === "status" && (
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminStatusToggle
            label={t("Public Atmosphere Deployment", "パブリックな雰囲気の展開", "Triển khai không khí công khai")}
            isPublished={formData.is_published ?? true}
            onToggle={(val) => setFormData({ ...formData, is_published: val })}
            description={{
              active: t("This narrative node is fully integrated into the global live matrix.", "この物語ノードはグローバルなライブマトリックスに完全に統合されています。", "Mục nội dung này đã được tích hợp hoàn toàn vào ma trận trực tuyến toàn cầu."),
              inactive: t("Current narrative is archived in shadow mode.", "現在の物語はシャドウモードでアーカイブされています。", "Nội dung hiện tại đang được lưu trữ ở chế độ ẩn."),
            }}
          />
        </div>
      )}
    </div>
  );
};
