"use client";

import { useState, useEffect } from "react";
import { AdminFormSection } from "./AdminFormSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaInput } from "../media/MediaInput";
import { AdminStatusToggle } from "./AdminStatusToggle";
import { translateFields, translateText } from "@/lib/translate";
import { toast } from "sonner";
import { Wand2, Zap, Hash, Type, Globe2, ShieldCheck, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LangContext";

interface AdminTaxonomyFormProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  editingId?: string | null;
  config: {
    hasI18n?: boolean;
    hasDescription?: boolean;
    hasIcon?: boolean;
    statusField?: string; // 'is_published' or 'is_active'
    slugLabel?: string;
  };
}

export const AdminTaxonomyForm = ({
  formData,
  setFormData,
  activeSection,
  setActiveSection,
  editingId,
  config
}: AdminTaxonomyFormProps) => {
  const { t } = useLang();
  const [isTranslating, setIsTranslating] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const nameField = config.hasI18n ? "name_en" : "name";
    
    setFormData((prev: any) => ({
      ...prev,
      [nameField]: value,
      slug: prev.slug || generateSlug(value)
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleAutoTranslate = async () => {
    if (!formData.name_en) {
      toast.error("English nomenclature required for translation.");
      return;
    }

    try {
      setIsTranslating(true);
      const translatedJa = await translateText(formData.name_en, "ja");
      const translatedVi = await translateText(formData.name_en, "vi");
      setFormData((prev: any) => ({ 
        ...prev, 
        name_ja: translatedJa,
        name_vi: translatedVi 
      }));
      toast.success("Magic! Translated to Japanese and Vietnamese.");
    } catch (error) {
      toast.error("Translation failure.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {activeSection === "identity" && (
        <div className="space-y-10 max-w-xl">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              {config.hasI18n ? t("English Nomenclature", "英語の名称", "Danh pháp tiếng Anh") : t("Vector Nomenclature", "ベクトルの名称", "Danh pháp Vector")}
            </label>
            <Input
              value={config.hasI18n ? formData.name_en : formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Strategic Design"
              className="h-16 px-8 bg-muted/20 border-none rounded-2xl text-base font-serif font-bold shadow-sm"
            />
          </div>

          {config.hasI18n && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between ml-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {t("Japanese Nomenclature", "日本語の名称", "Danh pháp tiếng Nhật")}
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={isTranslating || !formData.name_en}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-sage hover:text-sage/80 transition-colors disabled:opacity-50"
                  >
                    {isTranslating ? (
                      <div className="w-3 h-3 border-2 border-sage/20 border-t-sage rounded-full animate-spin"></div>
                    ) : (
                      <Wand2 size={12} />
                    )}
                    {t("Auto Translate", "自動翻訳", "Tự động dịch")}
                  </button>
                </div>
                <Input
                  value={formData.name_ja}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, name_ja: e.target.value }))}
                  placeholder="ブランディング"
                  className="h-16 px-8 bg-muted/20 border-none rounded-2xl text-base font-serif font-bold shadow-sm"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  {t("Vietnamese Nomenclature", "ベトナム語の名称", "Danh pháp tiếng Việt")}
                </label>
                <Input
                  value={formData.name_vi}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, name_vi: e.target.value }))}
                  placeholder="Thương hiệu"
                  className="h-16 px-8 bg-muted/20 border-none rounded-2xl text-base font-serif font-bold shadow-sm"
                />
              </div>
            </>
          )}

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              {config.slugLabel || t("Unique Identification Slug", "一意の識別子スラッグ", "Đường dẫn định danh duy nhất")}
            </label>
            <div className="relative">
              <Zap
                className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                size={18}
              />
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="id-slug"
                className="h-16 pl-14 pr-6 bg-muted/20 border-none rounded-2xl text-xs font-bold shadow-sm"
              />
            </div>
          </div>

          {config.hasDescription && (
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                {t("Strategic Context (Description)", "戦略的文脈（説明）", "Bối cảnh chiến lược (Mô tả)")}
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                placeholder={t("Brief context for this node...", "このノードの短いコンテキスト...", "Bối cảnh ngắn gọn cho mục này...")}
                className="min-h-[120px] p-6 bg-muted/20 border-none rounded-2xl text-sm font-serif italic shadow-sm resize-none"
              />
            </div>
          )}
        </div>
      )}

      {activeSection === "visuals" && config.hasIcon && (
        <div className="space-y-10 max-w-xl animate-in slide-in-from-right-8 duration-700">
          <MediaInput 
            label={t("Visual Identification (Icon)", "可視識別子（アイコン）", "Nhận dạng hình ảnh (Biểu tượng)")}
            value={formData.icon_url || ""}
            onChange={(url) => setFormData((prev: any) => ({ ...prev, icon_url: url }))}
            allowedTypes={['icon', 'svg']}
            description={t("Visual identifier for the node group. Supports SVG and Iconography.", "ノードグループの可視識別子。SVGとアイコンをサポートします。", "Định danh hình ảnh cho nhóm mục này. Hỗ trợ SVG và Iconography.")}
          />
        </div>
      )}

      {activeSection === "protocols" && (
        <div className="space-y-10 max-w-xl animate-in slide-in-from-right-8 duration-700">
          <AdminStatusToggle
            label={config.statusField === "is_published" ? t("Public Deployment", "公開デプロイ", "Triển khai công khai") : t("Activation Status", "アクティブ化の状態", "Trạng thái hoạt động")}
            description={
              formData[config.statusField || 'is_published']
                ? t("Node is currently integrated into the public taxonomy grid.", "ノードは現在、公開タクソノミーグリッドに統合されています。", "Mục hiện đang được tích hợp vào lưới phân loại công khai.")
                : t("Node is vaulted and suppressed from the global matrix.", "ノードは保管され、グローバルマトリックスから抑制されています。", "Mục hiện đang được lưu trữ và ẩn khỏi ma trận toàn cầu.")
            }
            isActive={formData[config.statusField || 'is_published']}
            onChange={(val) => setFormData((prev: any) => ({ ...prev, [config.statusField || 'is_published']: val }))}
          />

          <div className="p-10 bg-sage/[0.03] border border-sage/10 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-3 text-sage">
              <SlidersHorizontal size={20} />
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">
                {t("Layout Indexation", "レイアウトのインデックス作成", "Chỉ mục bố cục")}
              </h4>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                {t("Chronological Priority (Order)", "時系列の優先度", "Độ ưu tiên thời gian")}
              </label>
              <Input
                type="number"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    order_index: parseInt(e.target.value),
                  }))
                }
                className="h-14 px-8 bg-white border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
