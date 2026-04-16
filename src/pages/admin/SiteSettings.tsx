import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { getSiteSettings, upsertSiteSettings } from "@/lib/supabase-queries";
import {
  Settings2,
  Globe2,
  Type,
  Database,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminDialogForm } from "@/components/admin/shared/AdminDialogForm";
import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm";
import { FontLibrary } from "@/components/admin/settings/FontLibrary";
import { FontDialog } from "@/components/admin/settings/FontDialog";
import { Font } from "@/types/admin";

const SiteSettingsPage = () => {
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [fonts, setFonts] = useState<Font[]>([]);

  // Font Dialog State
  const [isFontDialogOpen, setIsFontDialogOpen] = useState(false);
  const [editingFont, setEditingFont] = useState<Partial<Font> | null>(null);
  const [fontSaving, setFontSaving] = useState(false);

  const [formData, setFormData] = useState<any>({
    site_name: "",
    default_language: "en",
    global_font_family: "Inter",
    global_font_import_url: "",
    global_font_import_css: "",
    global_font_fallback: "sans-serif",
    global_custom_css: "",
    body_font_id: null,
    heading_font_id: null,
  });

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchSettings(), fetchFonts()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchSettings = async () => {
    try {
      const settings = await getSiteSettings();
      if (settings) {
        setFormData((prev: any) => ({
          ...prev,
          ...settings,
          heading_font_id: settings.heading_font_id || null,
          body_font_id: settings.body_font_id || null,
        }));
      }
    } catch (error) {
      console.error("Failed to sync System Manifest:", error);
      toast.error(translations[lang].failedSyncSystemManifest);
    }
  };

  const fetchFonts = async () => {
    try {
      const { data, error } = await supabase
        .from("fonts")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setFonts(data || []);
    } catch (error) {
      console.error("Font fetch failure:", error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await upsertSiteSettings(formData);
      toast.success(t("Settings saved.", "設定が保存されました。", "Đã lưu cài đặt."));
      window.dispatchEvent(new CustomEvent("portfolio-font-update"));
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(t("Failed to save settings.", "設定の保存に失敗しました。", "Lỗi khi lưu cài đặt."));
    } finally {
      setSaving(false);
    }
  };

  const handleOpenFontDialog = (font: Partial<Font> | null = null) => {
    setEditingFont(
      font || {
        name: "",
        font_family: "",
        font_type: "sans-serif",
        import_url: "",
        import_css: "",
        fallback: "sans-serif",
        is_active: true,
      },
    );
    setIsFontDialogOpen(true);
  };

  const handleSaveFont = async () => {
    if (!editingFont?.import_url) {
      toast.error(t("Google Font URL is required.", "GoogleフォントのURLが必要です。", "Yêu cầu URL Google Font."));
      return;
    }

    let fontData = { ...editingFont };

    if (editingFont.import_url.includes("fonts.googleapis.com")) {
      try {
        const url = new URL(editingFont.import_url);
        const familyParam = url.searchParams.get("family");
        if (familyParam) {
          const fontName = familyParam.split(":")[0].replace(/\+/g, " ");
          fontData = {
            ...fontData,
            name: fontName,
            font_family: `'${fontName}', sans-serif`,
            import_css: `@import url('${editingFont.import_url}');`,
            font_type: "sans-serif",
            fallback: "sans-serif",
          };
        }
      } catch (e) {
        console.error("URL Parsing Error:", e);
      }
    }

    if (!fontData.name) {
      toast.error(
        t("Could not determine Font Name from URL. Please ensure it's a valid Google Font CSS link.", "URLからフォント名を特定できませんでした。有効なGoogleフォントのCSSリンクであることを確認してください。", "Không thể xác định tên phông chữ từ URL. Vui lòng đảm bảo đó là liên kết Google Font CSS hợp lệ.")
      );
      return;
    }

    try {
      setFontSaving(true);
      if (fontData.id) {
        const { error } = await supabase
          .from("fonts")
          .update(fontData)
          .eq("id", fontData.id);
        if (error) throw error;
        toast.success(t("Font updated.", "フォントが更新されました。", "Đã cập nhật phông chữ."));
      } else {
        const { error } = await supabase.from("fonts").insert([fontData]);
        if (error) throw error;
        toast.success(t("Font added.", "フォントが追加されました。", "Đã thêm phông chữ."));
      }
      await fetchFonts();
      setIsFontDialogOpen(false);
    } catch (error) {
      toast.error(t("Failed to sync fonts.", "フォントの同期に失敗しました。", "Lỗi đồng bộ phông chữ."));
    } finally {
      setFontSaving(false);
    }
  };

  const handleDeleteFont = (font: Font) => {
    deleteConfirm.openConfirm(font.id, font.name);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.itemId) return;
    try {
      setDeleting(true);
      const { error } = await supabase
        .from("fonts")
        .delete()
        .eq("id", deleteConfirm.itemId)
      if (error) throw error;
      toast.success(t("Font deleted.", "フォントが削除されました。", "Đã xóa phông chữ."));
      await fetchFonts();
      deleteConfirm.closeConfirm();
    } catch (error) {
      toast.error(t("Failed to purge font.", "フォントの削除に失敗しました。", "Lỗi khi xóa phông chữ."));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage animate-pulse">
            {translations[lang].syncingSystemManifest}
          </p>
        </div>
      </AdminLayout>
    );
  }

  const dialogTabs = [
    { 
      id: "general", 
      label: t("General", "一般", "Chung"), 
      fullLabel: t("General Settings", "全般設定", "Cài đặt chung"), 
      icon: Globe2,
      content: <SiteSettingsForm formData={formData} setFormData={setFormData} activeSection="general" fonts={fonts} />
    },
    { 
      id: "typography", 
      label: t("Typography", "タイポグラフィ", "Kiểu chữ"), 
      fullLabel: t("Site Typography", "タイポグラフィ", "Thanh chữ trang web"), 
      icon: Type,
      content: <SiteSettingsForm formData={formData} setFormData={setFormData} activeSection="typography" fonts={fonts} />
    },
    { 
      id: "fonts", 
      label: t("Library", "ライブラリ", "Thư viện"), 
      fullLabel: t("Font Library", "フォントライブラリ", "Thư viện phông chữ"), 
      icon: Database,
      content: (
        <FontLibrary 
          fonts={fonts} 
          headingFontId={formData.heading_font_id} 
          bodyFontId={formData.body_font_id}
          onOpenFontDialog={handleOpenFontDialog}
          onDeleteFont={handleDeleteFont}
          onApplyHeading={(id) => {
            setFormData({ ...formData, heading_font_id: id });
            toast.success(t("Heading typography recalibrated.", "見出しのタイポグラフィが調整されました。", "Đã hiệu chuẩn kiểu chữ tiêu đề."));
          }}
          onApplyBody={(id) => {
            setFormData({ ...formData, body_font_id: id });
            toast.success(t("Body typography recalibrated.", "本文のタイポグラフィが調整されました。", "Đã hiệu chuẩn kiểu chữ nội dung."));
          }}
        />
      )
    },
    { 
      id: "advanced", 
      label: t("Advanced", "詳細設定", "Nâng cao"), 
      fullLabel: t("Advanced Core Settings", "詳細なコア設定", "Cài đặt cốt lõi nâng cao"), 
      icon: Terminal,
      content: <SiteSettingsForm formData={formData} setFormData={setFormData} activeSection="advanced" fonts={fonts} />
    },
  ];

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={handleConfirmDelete}
        itemName={deleteConfirm.itemName}
        isLoading={deleting}
      />

      <div className="space-y-12 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={translations[lang].siteSettings}
          description={translations[lang].siteSettingsDescription}
          primaryAction={{
            label: t("Edit Settings", "設定を編集", "Chỉnh sửa cài đặt"),
            onClick: () => setIsDialogOpen(true),
            icon: Settings2,
          }}
        />

        {/* DASHBOARD PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GLOBAL IDENTITY CARD */}
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-sm hover:shadow-2xl transition-all duration-700 relative group overflow-hidden">
            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <p className="text-xs tracking-[0.3em] font-bold text-sage uppercase">
                  {t("Global Settings", "グローバル設定", "Cài đặt toàn cục")}
                </p>
                <h2 className="text-3xl font-serif font-bold text-heading">
                  {t("General Info", "一般情報", "Thông tin chung")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 border-t border-border/10 pt-10">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {t("Site Name", "サイト名", "Tên trang web")}
                    </p>
                    <p className="text-xl font-serif font-bold text-heading mt-2">
                      {formData.site_name || "Portfolio System"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {t("Default Language", "デフォルト言語", "Ngôn ngữ mặc định")}
                    </p>
                    <p className="text-lg font-serif italic text-sage mt-2 capitalize">
                      {formData.default_language === "en"
                        ? t("English (Global)", "英語 (グローバル)", "Tiếng Anh (Toàn cầu)")
                        : t("Japanese", "日本語", "Tiếng Nhật")}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {t("Font Family", "フォントファミリー", "Phông chữ")}
                    </p>
                    <div className="mt-4 flex items-center gap-4 px-6 py-3 bg-sage/5 rounded-2xl border border-sage/10 text-sage">
                      <Type size={18} />
                      <span
                        className="text-sm font-bold tracking-tight"
                        style={{ fontFamily: formData.global_font_family }}
                      >
                        {formData.global_font_family}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SYSTEM STATUS CARD */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[3.5rem] p-12 shadow-sm flex flex-col justify-between group">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-sage/5 rounded-2xl flex items-center justify-center text-sage">
                  <ShieldCheck size={28} />
                </div>
                <div className="flex -space-x-1 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-sage/60"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-sage/30"></div>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-serif font-bold text-heading">
                  {translations[lang].status}
                </h3>
                <p className="text-xs text-muted-foreground mt-3 italic font-serif leading-relaxed line-clamp-3">
                  {t("Connected to database. All updates are synchronized.", "データベースに接続されました。すべての更新が同期されます。", "Đã kết nối cơ sở dữ liệu. Tất cả cập nhật đều được đồng bộ.")}
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t("Grid Operational", "グリッド稼働中", "Hệ thống hoạt động")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={t("Edit Settings", "設定を編集", "Chỉnh sửa cài đặt")}
          description={t("Update your site's name, language, and typography.", "サイト名、言語、タイポグラフィを更新します。", "Cập nhật tên trang web, ngôn ngữ và kiểu chữ của bạn.")}
          tabs={dialogTabs}
          activeTab={activeSection}
          onTabChange={setActiveSection}
          onSave={handleSaveSettings}
          saving={saving}
          sidebarTitle={t("System", "システム", "Hệ thống")}
          sidebarSubtitle={t("Global Settings", "グローバル設定", "Cài đặt toàn cục")}
          sidebarIcon={Settings2}
          saveLabel={translations[lang].save}
        />

        <FontDialog
          open={isFontDialogOpen}
          onOpenChange={setIsFontDialogOpen}
          editingFont={editingFont}
          setEditingFont={setEditingFont}
          onSave={handleSaveFont}
          isSaving={fontSaving}
        />
      </div>
    </AdminLayout>
  );
};

export default SiteSettingsPage;
