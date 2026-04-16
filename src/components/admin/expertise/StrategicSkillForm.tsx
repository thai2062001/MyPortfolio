import React from "react";
import { AdminField } from "../shared/AdminFormSection";
import { AdminStatusToggle } from "../shared/AdminStatusToggle";
import { MediaInput } from "../media/MediaInput";
import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLang } from "@/contexts/LangContext";

interface StrategicSkillFormProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  isTranslating: boolean;
  onAutoTranslate: () => void;
}

export const StrategicSkillForm = ({
  formData,
  setFormData,
  activeSection,
  isTranslating,
  onAutoTranslate,
}: StrategicSkillFormProps) => {
  const { lang, t, translations } = useLang();
  return (
    <div className="space-y-10 text-left">
      {activeSection === "identity" && (
        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MediaInput
            label={t("Strategic Icon (SVG Asset)", "戦略的アイコン（SVG）", "Biểu tượng chiến lược (SVG)")}
            value={formData.icon_url || ""}
            onChange={(url) => setFormData({ ...formData, icon_url: url })}
            description={t("Premium Vector Glyph recommended.", "プレミアムベクターグリフを推奨します。", "Nghiệm thu glyph vector cao cấp.")}
          />
          <AdminField label={t("Persistent Slug", "永続的なスラッグ", "Slug định danh")}>
            <input
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="e.g. motion-architecture"
              className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              required
            />
          </AdminField>
          <AdminField label={t("Fallback Lucide Icon", "フォールバックのLucideアイコン", "Biểu tượng Lucide dự phòng")}>
            <input
              value={formData.icon_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, icon_name: e.target.value })
              }
              placeholder="Zap, Stars, Hexagon..."
              className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
            />
          </AdminField>
          <AdminField label={t("Sequence Priority", "順序の優先度", "Thứ tự ưu tiên")}>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order_index: parseInt(e.target.value),
                })
              }
              className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
            />
          </AdminField>
        </div>
      )}

      {activeSection === "content" && (
        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminField label={t("Asset Designation (EN)", "資産の指定 (EN)", "Tên năng lực (EN)")}>
            <input
              value={formData.skill_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, skill_name: e.target.value })
              }
              placeholder="Motion Content Architecture"
              className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-xl font-serif font-bold shadow-sm"
            />
          </AdminField>
          <AdminField label={t("Strategic Description (EN)", "戦略的な説明 (EN)", "Mô tả chiến lược (EN)")}>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Narration of the asset's role in the creative cluster..."
              rows={8}
              className="w-full p-8 bg-muted/20 border-none rounded-[2rem] text-sm leading-relaxed shadow-sm font-serif italic font-bold resize-none"
            />
          </AdminField>
        </div>
      )}

      {activeSection === "localization" && (
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between bg-sage/5 p-6 rounded-[2rem] border border-sage/10 mb-8">
            <div className="flex items-center gap-4">
              <Globe2 className="text-sage" size={24} />
              <div>
               <h4 className="text-xs font-bold text-sage uppercase tracking-widest">
                  {t("Pacific linguistic protocol", "太平洋言語プロトコル", "Giao thức ngôn ngữ Thái Bình Dương")}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  {t("Synchronizing narrative for global impact.", "グローバルなインパクトのためにナラティブを同期しています。", "Đang đồng bộ hóa nội dung cho tác động toàn cầu.")}
                </p>
              </div>
            </div>
            <Button
              onClick={onAutoTranslate}
              disabled={isTranslating}
              className="bg-sage text-white rounded-xl px-6 h-12 font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2"
            >
              {isTranslating ? <LoadingSpinner /> : <Globe2 size={14} />}
              {t("MAGIC SYNC", "マジック同期", "ĐỒNG BỘ THẦN KỲ")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdminField label={t("Asset Name (JP)", "資産名 (JP)", "Tên năng lực (JP)")}>
              <input
                value={formData.skill_name_ja || ""}
                onChange={(e) =>
                  setFormData({ ...formData, skill_name_ja: e.target.value })
                }
                placeholder="資産名..."
                className="w-full h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold"
              />
            </AdminField>
            <AdminField label={t("Asset Name (VI)", "資産名 (VI)", "Tên năng lực (VI)")}>
              <input
                value={formData.skill_name_vi || ""}
                onChange={(e) =>
                  setFormData({ ...formData, skill_name_vi: e.target.value })
                }
                placeholder="Tên năng lực..."
                className="w-full h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold"
              />
            </AdminField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdminField label={t("Strategic Description (JP)", "戦略的な説明 (JP)", "Mô tả chiến lược (JP)")}>
              <textarea
                value={formData.description_ja || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description_ja: e.target.value })
                }
                placeholder="日本語の説明を入力..."
                rows={8}
                className="w-full p-8 bg-muted/20 border-none rounded-[2rem] text-sm leading-relaxed shadow-sm font-serif italic font-bold resize-none"
              />
            </AdminField>
            <AdminField label={t("Strategic Description (VI)", "戦略的な説明 (VI)", "Mô tả chiến lược (VI)")}>
              <textarea
                value={formData.description_vi || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description_vi: e.target.value })
                }
                placeholder="Nhập mô tả tiếng Việt..."
                rows={8}
                className="w-full p-8 bg-muted/20 border-none rounded-[2rem] text-sm leading-relaxed shadow-sm font-serif italic font-bold resize-none"
              />
            </AdminField>
          </div>
        </div>
      )}

      {activeSection === "deployment" && (
        <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminStatusToggle
            label={t("Interface Exposure", "インターフェース曝露", "Tiếp xúc giao diện")}
            isPublished={formData.is_published ?? false}
            onToggle={(val) =>
              setFormData({ ...formData, is_published: val })
            }
            description={{
              active: t("This Asset is operational and visible in the public cluster.", "この資産は稼働しており、パブリッククラスターに表示されています。", "Năng lực này đang hoạt động và có thể hiển thị trong cụm công khai."),
              inactive: t("Asset currently in shadow mode.", "資産は現在シャドウモードです。", "Năng lực này hiện đang ở chế độ ẩn."),
            }}
          />
        </div>
      )}
    </div>
  );
};
