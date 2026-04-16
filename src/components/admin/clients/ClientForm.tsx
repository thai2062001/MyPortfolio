import { AdminField, AdminFormSection } from "../shared/AdminFormSection";
import { AdminStatusToggle } from "../shared/AdminStatusToggle";
import { MediaInput } from "../media/MediaInput";
import { Building2, Link as LinkIcon } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

interface ClientFormProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
}

export const ClientForm = ({ formData, setFormData, activeSection }: ClientFormProps) => {
  const { t } = useLang();
  return (
    <div className="space-y-10 text-left">
      {activeSection === "identity" && (
        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminFormSection title={t("Institution Nomenclature", "機関の名称", "Danh pháp tổ chức")}>
            <AdminField label={t("Institution Name", "機関名", "Tên tổ chức")}>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
                <input
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Omni Digital Lab"
                  className="w-full h-16 pl-12 bg-muted/20 border-none rounded-2xl text-base font-serif font-bold shadow-sm"
                />
              </div>
            </AdminField>
            <AdminField label={t("Digital Anchor (Website URL)", "デジタルアンカー (Website URL)", "Điểm neo kỹ thuật số (URL Website)")}>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
                <input
                  value={formData.website_url || ""}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-14 pl-12 bg-muted/20 border-none rounded-xl text-xs font-bold shadow-sm"
                />
              </div>
            </AdminField>
          </AdminFormSection>
        </div>
      )}

      {activeSection === "media" && (
        <div className="space-y-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminFormSection title={t("Vector Branding Asset", "ベクターブランディング資産", "Tài sản thương hiệu Vector")}>
            <MediaInput
              label={t("Branding Logo", "ブランディングロゴ", "Logo thương hiệu")}
              value={formData.logo_url || ""}
              onChange={(url) => setFormData({ ...formData, logo_url: url })}
              description={t("High-contrast monochrome or transparent PNG/SVG for optimal integration.", "最適な統合のために、高コントラストのモノクロまたは透明なPNG/SVGを使用してください。", "Sử dụng PNG/SVG đơn sắc hoặc trong suốt có độ tương phản cao để tích hợp tối ưu.")}
            />
          </AdminFormSection>
        </div>
      )}

      {activeSection === "protocols" && (
        <div className="space-y-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminStatusToggle
            label={t("Public Deployment", "公開デプロイメント", "Triển khai công khai")}
            isPublished={formData.is_published ?? true}
            onToggle={(val) => setFormData({ ...formData, is_published: val })}
            description={{
              active: t("Active partnership visibility protocol.", "アクティブなパートナーシップ可視化プロトコル。", "Giao thức hiển thị quan hệ đối tác đang hoạt động."),
              inactive: t("Partnership currently in shadow mode.", "パートナーシップは現在シャドウモードです。", "Quan hệ đối tác hiện đang ở chế độ ẩn."),
            }}
          />
          <AdminFormSection title={t("Layout Indexation", "レイアウトのインデックス作成", "Lập chỉ mục bố cục")}>
            <AdminField label={t("Chronological Priority (Order)", "時系列の優先順位 (順序)", "Ưu tiên theo thời gian (Thứ tự)")}>
              <input
                type="number"
                value={formData.order_index ?? 0}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm"
              />
            </AdminField>
          </AdminFormSection>
        </div>
      )}
    </div>
  );
};
