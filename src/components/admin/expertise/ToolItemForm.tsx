import React from "react";
import { AdminField } from "../shared/AdminFormSection";
import { AdminStatusToggle } from "../shared/AdminStatusToggle";
import { MediaInput } from "../media/MediaInput";
import { Globe2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLang } from "@/contexts/LangContext";

interface ToolItemFormProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  isTranslating: boolean;
  onAutoTranslate: () => void;
}

export const ToolItemForm = ({
  formData,
  setFormData,
  activeSection,
  isTranslating,
  onAutoTranslate,
}: ToolItemFormProps) => {
  const { t } = useLang();
  return (
    <div className="space-y-10 text-left">
      {activeSection === "identity" && (
        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MediaInput
            label={t("Instrument Asset (Icon)", "計器資産（アイコン）", "Tài sản công cụ (Biểu tượng)")}
            value={formData.icon_url || ""}
            onChange={(url) => setFormData({ ...formData, icon_url: url })}
            description={t("Premium Vector Glyph recommended for tool identity.", "ツールの識別にはプレミアムベクターグリフを推奨します。", "Khuyến khích sử dụng Glyph Vector cao cấp để định danh công cụ.")}
          />
          <AdminField label={t("Production Gateway (URL)", "プロダクションゲートウェイ (URL)", "Cổng thực hiện (URL)")}>
            <div className="relative">
              <Link2
                className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                size={18}
              />
              <input
                value={formData.tool_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tool_url: e.target.value })
                }
                placeholder="https://framer.host/your-design"
                className="w-full h-16 pl-14 pr-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </div>
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
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminField label={t("Instrument Nomenclature (EN)", "計器の名称 (EN)", "Danh pháp công cụ (EN)")}>
            <input
              value={formData.tool_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, tool_name: e.target.value })
              }
              placeholder="Adobe Creative Cloud Architecture"
              className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-xl font-serif font-bold shadow-sm"
            />
          </AdminField>
          <AdminField label={t("Strategic Context (EN)", "戦略的な文脈 (EN)", "Bối cảnh chiến lược (EN)")}>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Define the role of this instrument in your creative process..."
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
                  {t("Global Reach Module", "グローバルリーチモジュール", "Mô-đun tiếp cận toàn cầu")}
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
            <AdminField label={t("Instrument Name (JP)", "計器名 (JP)", "Tên công cụ (JP)")}>
              <input
                value={formData.tool_name_ja || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tool_name_ja: e.target.value })
                }
                placeholder="ツール名..."
                className="w-full h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold"
              />
            </AdminField>
            <AdminField label={t("Instrument Name (VI)", "計器名 (VI)", "Tên công cụ (VI)")}>
              <input
                value={formData.tool_name_vi || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tool_name_vi: e.target.value })
                }
                placeholder="Tên công cụ..."
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
                placeholder="戦略的説明..."
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
                placeholder="Mô tả chiến lược..."
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
            label={t("Public Visibility", "公開の可視性", "Hiển thị công khai")}
            description={
              formData.is_published
                ? t("Instrument is published to the public cluster.", "計器はパブリッククラスターに公開されています。", "Công cụ đã được xuất bản vào cụm công khai.")
                : t("Instrument currently in internal shadow mode.", "計器は現在、内部シャドウモードです。", "Công cụ hiện đang ở chế độ ẩn nội bộ.")
            }
            isActive={formData.is_published || false}
            onChange={(checked) =>
              setFormData({ ...formData, is_published: checked })
            }
          />
        </div>
      )}
    </div>
  );
};
