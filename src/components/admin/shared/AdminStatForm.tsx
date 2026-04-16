"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaInput } from "../media/MediaInput";
import { AdminStatusToggle } from "./AdminStatusToggle";
import { translateFields } from "@/lib/translate";
import { toast } from "sonner";
import { Wand2, Zap, Hash, BarChart3, Languages, SlidersHorizontal, Sparkles } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

interface AdminStatFormProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  editingId?: string | null;
}

export const AdminStatForm = ({
  formData,
  setFormData,
  activeSection,
  setActiveSection,
  editingId
}: AdminStatFormProps) => {
  const { lang, t, translations } = useLang();
  const [isTranslating, setIsTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    if (!formData.label_en) {
      toast.error(t("English label required for translation.", "翻訳には英語のラベルが必要です。", "Cần có nhãn tiếng Anh để dịch."));
      return;
    }

    try {
      setIsTranslating(true);
      const sourceFields = {
        label: formData.label_en,
        description: formData.description_en,
      };
      const translatedJa = await translateFields(sourceFields as any, "ja");
      const translatedVi = await translateFields(sourceFields as any, "vi");
      setFormData((prev: any) => ({ 
        ...prev, 
        label_ja: translatedJa.label || prev.label_ja,
        description_ja: translatedJa.description || prev.description_ja,
        label_vi: translatedVi.label || prev.label_vi,
        description_vi: translatedVi.description || prev.description_vi
      }));
      toast.success(t("Magic! Translated to Japanese and Vietnamese.", "素晴らしい！日本語とベトナム語に翻訳しました。", "Kỳ diệu! Đã dịch sang tiếng Nhật và tiếng Việt."));
    } catch (error) {
      toast.error(t("Translation failure.", "翻訳に失敗しました。", "Dịch thất bại."));
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {activeSection === "config" && (
        <div className="space-y-10 max-w-xl">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              {t("Metric Magnitude (Value)", "メトリックの大きさ（値）", "Giá trị số liệu (Value)")}
            </label>
            <Input
              value={formData.value_text}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, value_text: e.target.value }))}
              placeholder="e.g. 50k+"
              className="h-18 px-8 bg-sage/[0.03] border-2 border-sage/10 rounded-[1.5rem] text-2xl font-serif font-bold text-sage focus:border-sage/30 transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                {t("Internal Identifier (Key)", "内部識別子（キー）", "Định danh nội bộ (Key)")}
              </label>
              <div className="relative">
                <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                <Input
                  value={formData.stat_key}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, stat_key: e.target.value }))}
                  placeholder="metric_id"
                  className="h-14 pl-14 pr-6 bg-muted/20 border-none rounded-2xl text-xs font-bold shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                {t("Chronological Order", "時系列順", "Thứ tự thời gian")}
              </label>
              <Input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, order_index: parseInt(e.target.value) }))}
                className="h-14 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </div>
          </div>

          <AdminStatusToggle
            label={t("Active Grid Integration", "アクティブグリッド統合", "Tích hợp lưới hoạt động")}
            description={formData.is_published 
              ? t("Node is live in the global matrix.", "ノードはグローバルマトリックスでライブです。", "Nút hiện đang hoạt động trong ma trận toàn cầu.") 
              : t("Node is vaulted and suppressed.", "ノードは保管され、抑制されています。", "Nút hiện đang được lưu trữ và ẩn đi.")}
            isActive={formData.is_published}
            onChange={(val) => setFormData((prev: any) => ({ ...prev, is_published: val }))}
          />
        </div>
      )}

      {activeSection === "linguistic" && (
        <div className="space-y-10 max-w-xl animate-in slide-in-from-right-8 duration-700">
          <div className="space-y-8">
            <div className="space-y-4">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                 {t("English Nomenclature (Label)", "英語の名称（ラベル）", "Danh pháp tiếng Anh (Label)")}
               </label>
               <Input
                 value={formData.label_en}
                 onChange={(e) => setFormData((prev: any) => ({ ...prev, label_en: e.target.value }))}
                 placeholder="Projects Completed"
                 className="h-14 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
               />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between ml-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t("Japanese Nomenclature", "日本語の名称", "Danh pháp tiếng Nhật")}
                </label>
                <button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={isTranslating || !formData.label_en}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-sage hover:text-sage/80 transition-colors disabled:opacity-50"
                >
                  {isTranslating ? (
                    <div className="w-3 h-3 border-2 border-sage/20 border-t-sage rounded-full animate-spin"></div>
                  ) : (
                    <Wand2 size={12} />
                  )}
                  {t("Magic Sync", "マジック同期", "Đồng bộ thần kỳ")}
                </button>
              </div>
              <Input
                value={formData.label_ja}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, label_ja: e.target.value }))}
                placeholder="完了したプロジェクト"
                className="h-14 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                {t("Vietnamese Nomenclature", "ベトナム語の名称", "Danh pháp tiếng Việt")}
              </label>
              <Input
                value={formData.label_vi}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, label_vi: e.target.value }))}
                placeholder="Dự án hoàn thành"
                className="h-14 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                {t("Metric Narrative (Description EN)", "メトリックの説明 (EN)", "Mô tả số liệu (EN)")}
              </label>
              <Textarea
                value={formData.description_en}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, description_en: e.target.value }))}
                placeholder="Brief context for this metric node..."
                className="min-h-[100px] p-6 bg-muted/20 border-none rounded-2xl text-sm font-serif italic shadow-sm resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                {t("Metric Narrative (Description JP)", "メトリックの説明 (JP)", "Mô tả số liệu (JP)")}
              </label>
              <Textarea
                value={formData.description_ja}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, description_ja: e.target.value }))}
                placeholder="メトリックの短いコンテキスト..."
                className="min-h-[100px] p-6 bg-muted/20 border-none rounded-2xl text-sm font-serif italic shadow-sm resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                {t("Metric Narrative (Description VI)", "メトリックの説明 (VI)", "Mô tả số liệu (VI)")}
              </label>
              <Textarea
                value={formData.description_vi}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, description_vi: e.target.value }))}
                placeholder="Bối cảnh ngắn gọn cho chỉ số này..."
                className="min-h-[100px] p-6 bg-muted/20 border-none rounded-2xl text-sm font-serif italic shadow-sm resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === "visuals" && (
        <div className="space-y-10 max-w-xl animate-in slide-in-from-right-8 duration-700">
           <MediaInput 
             label={t("Visual Identifier (Icon)", "可視識別子（アイコン）", "Định danh hình ảnh (Icon)")}
             value={formData.icon_url || ""}
             onChange={(url) => setFormData((prev: any) => ({ ...prev, icon_url: url }))}
             allowedTypes={['icon', 'svg']}
             description={t("Visual token representing the metric vector. Supports SVG and Iconography.", "メトリックベクトルを表す視覚的トークン。SVGとアイコンをサポートします。", "Mã báo hình ảnh đại diện cho vectơ số liệu. Hỗ trợ SVG và Iconography.")}
           />
        </div>
      )}
    </div>
  );
};
