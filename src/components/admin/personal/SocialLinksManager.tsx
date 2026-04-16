import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Share2, Eye, EyeOff, Edit2, Trash2 } from "lucide-react";
import { SocialLink } from "@/types/admin";
import { cn } from "@/lib/utils";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { useLang } from "@/contexts/LangContext";

interface SocialLinksManagerProps {
  socialLinks: SocialLink[];
  onAdd: () => void;
  onEdit: (link: SocialLink) => void;
  onUpdate: (id: string, updates: Partial<SocialLink>) => void;
  onDelete: (id: string) => void;
}

export const SocialLinksManager = ({
  socialLinks,
  onAdd,
  onEdit,
  onUpdate,
  onDelete,
}: SocialLinksManagerProps) => {
  const [showMediaPicker, setShowMediaPicker] = useState<string | null>(null);
  const { t } = useLang();

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex items-center justify-between border-b border-sage/10 pb-6">
        <h4 className="text-sm font-bold uppercase tracking-widest text-heading text-left">
          {t("Manage Links", "リンク管理", "Quản lý liên kết")}
        </h4>
        <Button
          onClick={onAdd}
          className="h-12 px-6 bg-sage/10 text-sage hover:bg-sage hover:text-white rounded-xl transition-all flex items-center gap-2 text-xs font-bold"
        >
          <Plus size={16} /> {t("Add New", "新規追加", "Thêm mới")}
        </Button>
      </div>

      <div className="space-y-3">
        {socialLinks.map((link) => (
          <div
            key={link.id}
            className="group flex flex-col md:flex-row items-center lg:gap-6 gap-4 p-4 md:p-5 bg-white/40 hover:bg-white border border-sage/5 hover:border-sage/20 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-500 hover:shadow-xl"
          >
            {/* ICON PICKER */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowMediaPicker(link.id)}
                className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center overflow-hidden border border-sage/10 hover:border-sage transition-all relative group/icon shadow-sm"
              >
                {link.icon_url ? (
                  <img
                    src={link.icon_url}
                    alt=""
                    className="w-8 h-8 md:w-10 md:h-10 object-contain group-hover/icon:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <Share2 size={20} className="text-sage/40" />
                )}
                <div className="absolute inset-0 bg-sage/60 opacity-0 group-hover/icon:opacity-100 transition-opacity flex items-center justify-center">
                  <Plus size={16} className="text-white" />
                </div>
              </button>

              <MediaPickerModal
                open={showMediaPicker === link.id}
                onOpenChange={(open) => !open && setShowMediaPicker(null)}
                onSelect={(url) => {
                  onUpdate(link.id, { icon_url: url });
                  setShowMediaPicker(null);
                }}
                allowedTypes={["icon", "svg"]}
                title={`${t("Branding", "ブランディング", "Thương hiệu")}: ${link.platform_name}`}
              />
            </div>

            {/* IDENTITY INFO */}
            <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <div className="md:w-48 text-left">
                <p className="text-base font-serif font-bold text-heading truncate">
                  {link.platform_name}
                </p>
              </div>
              <div className="hidden md:block w-px h-4 bg-sage/10"></div>
              <div className="text-left">
                <p className="text-xs font-serif italic text-muted-foreground truncate">
                  {link.display_name}
                </p>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-sage/5 pt-3 md:pt-0 w-full md:w-auto justify-end">
              <button
                onClick={() =>
                  onUpdate(link.id, { is_published: !link.is_published })
                }
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm",
                  link.is_published
                    ? "bg-sage/10 text-sage"
                    : "bg-muted/10 text-muted-foreground/30 hover:text-sage"
                )}
                title={link.is_published ? t("Visible", "表示", "Hiển thị") : t("Hidden", "非表示", "Bị ẩn")}
              >
                {link.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>

              <button
                onClick={() => onEdit(link)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/5 text-muted-foreground/40 hover:bg-sage/10 hover:text-sage transition-all"
                title={t("Edit Details", "詳細を編集", "Chỉnh sửa chi tiết")}
              >
                <Edit2 size={16} />
              </button>

              <button
                onClick={() => onDelete(link.id)}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground/20 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
