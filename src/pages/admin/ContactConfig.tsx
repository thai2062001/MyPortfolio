"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Save,
  Plus,
  Trash2,
  Settings,
  ListFilter,
  CheckCircle2,
  XCircle,
  GripVertical,
  ChevronRight,
  Sparkles,
  Info,
  Target,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { 
  getContactPurposeOptions, 
  getContactFormSettings, 
  updateContactFormSettings,
  upsertContactPurposeOption,
  deleteContactPurposeOption
} from "@/lib/supabase-contact-queries";
import type { ContactPurposeOption, ContactFormSettings } from "@/types/admin";
import { cn } from "@/lib/utils";

const ContactConfig = () => {
  const { lang, translations, t } = useLang();
  const [activeTab, setActiveTab] = useState<"settings" | "purposes">("settings");
  const [settings, setSettings] = useState<ContactFormSettings | null>(null);
  const [purposes, setPurposes] = useState<ContactPurposeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [options, formSettings] = await Promise.all([
        getContactPurposeOptions(false), // Get all, including inactive
        getContactFormSettings(),
      ]);
      setPurposes(options);
      setSettings(formSettings);
    } catch (error) {
      toast.error("Failed to load contact configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      await updateContactFormSettings(settings);
      toast.success("Settings saved successfully.");
    } catch (error) {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPurpose = () => {
    const newPurpose: Partial<ContactPurposeOption> = {
      value: "new_purpose_" + Date.now(),
      label_en: "New Purpose",
      label_ja: "",
      label_vi: "",
      order_index: purposes.length,
      is_active: true,
    };
    setPurposes([...purposes, newPurpose as ContactPurposeOption]);
  };

  const handleSavePurpose = async (purpose: ContactPurposeOption) => {
    try {
      setSaving(true);
      const updated = await upsertContactPurposeOption(purpose);
      setPurposes(purposes.map(p => p.id === purpose.id ? updated : p));
      toast.success("Contact purpose saved.");
    } catch (error) {
      toast.error("Failed to save purpose.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePurpose = async (id: string) => {
    if (!confirm("Are you sure you want to delete this purpose?")) return;
    try {
      await deleteContactPurposeOption(id);
      setPurposes(purposes.filter(p => p.id !== id));
      toast.success("Contact purpose deleted.");
    } catch (error) {
      toast.error("Failed to delete purpose.");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage animate-pulse">
            Loading Configuration...
          </p>
        </div>
      </AdminLayout>
    );
  }

  const t_local = translations[lang];

  return (
    <AdminLayout>
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-heading tracking-tight">
              {t("Contact Configuration", "お問い合わせ設定", "Cấu hình liên hệ")}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm tracking-wide">
              {t("Manage how the contact form behaves on your website.", "ウェブサイトでのお問い合わせフォームの動作を管理します。", "Quản lý cách biểu mẫu liên hệ hoạt động trên trang web của bạn.")}
            </p>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex gap-4 p-1.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl w-fit shadow-sm max-w-full overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
              activeTab === "settings" ? "bg-sage text-white shadow-lg shadow-sage/20" : "text-muted-foreground hover:bg-sage/5 hover:text-sage"
            )}
          >
            <Settings size={14} />
            {t("Form Settings", "フォーム設定", "Cài đặt biểu mẫu")}
          </button>
          <button
            onClick={() => setActiveTab("purposes")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
              activeTab === "purposes" ? "bg-sage text-white shadow-lg shadow-sage/20" : "text-muted-foreground hover:bg-sage/5 hover:text-sage"
            )}
          >
            <ListFilter size={14} />
            {t("Inquiry Types", "問い合わせタイプ", "Loại yêu cầu")}
          </button>
        </div>

        <div className="animate-in slide-in-from-bottom-4 duration-500">
          {activeTab === "settings" && settings && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-8 space-y-10">
                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[3rem] p-8 md:p-12 shadow-sm space-y-12">
                  <div className="space-y-8">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-heading flex items-center gap-4">
                      <span className="w-2 h-2 rounded-full bg-sage shadow-[0_0_15px_rgba(132,153,137,0.5)]"></span>
                      {t("General Settings", "全般設定", "Cài đặt chung")}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">
                          {t("Show Purpose Field", "目的フィールドを表示", "Hiển thị mục đích")}
                        </label>
                        <button
                          onClick={() => setSettings({ ...settings, is_purpose_enabled: !settings.is_purpose_enabled })}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-500",
                            settings.is_purpose_enabled ? "bg-sage/5 border-sage/20 text-sage" : "bg-white border-border/10 text-muted-foreground grayscale opacity-60"
                          )}
                        >
                          <span className="text-xs font-bold uppercase tracking-widest">
                            {settings.is_purpose_enabled ? t("Enabled", "有効", "Bật") : t("Disabled", "無効", "Tắt")}
                          </span>
                          {settings.is_purpose_enabled ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        </button>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">
                          {t("Require Purpose", "目的を必須にする", "Bắt buộc chọn mục đích")}
                        </label>
                        <button
                          disabled={!settings.is_purpose_enabled}
                          onClick={() => setSettings({ ...settings, is_purpose_required: !settings.is_purpose_required })}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-500",
                            settings.is_purpose_required ? "bg-sage/5 border-sage/20 text-sage" : "bg-white border-border/10 text-muted-foreground grayscale opacity-60",
                            !settings.is_purpose_enabled && "opacity-20 cursor-not-allowed"
                          )}
                        >
                          <span className="text-xs font-bold uppercase tracking-widest">
                            {settings.is_purpose_required ? t("Mandatory", "必須", "Bắt buộc") : t("Optional", "任意", "Tùy chọn")}
                          </span>
                          {settings.is_purpose_required ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">
                          {t("Placeholder (English)", "プレースホルダー (英語)", "Gợi ý (Tiếng Anh)")}
                        </label>
                        <div className="relative group">
                          <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={16} />
                          <Input
                            value={settings.purpose_placeholder_en || ""}
                            onChange={(e) => setSettings({ ...settings, purpose_placeholder_en: e.target.value })}
                            className="h-12 pl-12 bg-white/60 border-none rounded-xl text-xs font-serif italic shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">
                          {t("Placeholder (Japanese)", "プレースホルダー (日本語)", "Gợi ý (Tiếng Nhật)")}
                        </label>
                        <div className="relative group">
                          <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={16} />
                          <Input
                            value={settings.purpose_placeholder_ja || ""}
                            onChange={(e) => setSettings({ ...settings, purpose_placeholder_ja: e.target.value })}
                            className="h-12 pl-12 bg-white/60 border-none rounded-xl text-xs font-serif italic shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">
                          {t("Placeholder (Vietnamese)", "プレースホルダー (ベトナム語)", "Gợi ý (Tiếng Việt)")}
                        </label>
                        <div className="relative group">
                          <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={16} />
                          <Input
                            value={settings.purpose_placeholder_vi || ""}
                            onChange={(e) => setSettings({ ...settings, purpose_placeholder_vi: e.target.value })}
                            className="h-12 pl-12 bg-white/60 border-none rounded-xl text-xs font-serif italic shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="w-full h-14 md:h-16 bg-heading hover:bg-heading/90 text-white rounded-2xl shadow-xl shadow-heading/20 font-bold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 overflow-hidden group"
                    >
                      <Save size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="uppercase tracking-[0.2em] text-[10px]">{saving ? t("Saving...", "保存中...", "Đang lưu...") : t("Save Settings", "設定を保存", "Lưu cài đặt")}</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4">
                <div className="bg-sage/5 border border-sage/10 p-8 md:p-12 rounded-[3.5rem] space-y-8 h-full">
                  <div className="p-4 bg-white/40 rounded-2xl border border-white/60">
                    <Sparkles className="text-sage mb-4" size={24} />
                    <h4 className="text-sm font-bold uppercase tracking-widest text-sage mb-2">{t("Form Logic", "フォームロジック", "Logic biểu mẫu")}</h4>
                    <p className="text-[11px] text-muted-foreground italic font-serif leading-relaxed">
                      {t("These settings control how the contact form behaves on your website. Choosing a clear purpose help with better categorization of incoming inquiries.", "これらの設定は、ウェブサイトでのお問い合わせフォームの動作を制御します。明確な目的を選択すると、受信した問い合わせの分類が容易になります。", "Các cài đặt này kiểm soát cách biểu mẫu liên hệ hoạt động trên trang web của bạn. Việc chọn mục đích rõ ràng giúp phân loại các yêu cầu gửi đến tốt hơn.")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "purposes" && (
            <div className="space-y-8 md:space-y-12">
              <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-4 md:p-6 border border-white/60 rounded-[2rem] shadow-sm">
                <div>
                  <h3 className="text-lg md:text-xl font-serif font-bold text-heading">
                    {t("Manage Inquiry Types", "問い合わせタイプの管理", "Quản lý loại yêu cầu")}
                  </h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                    {purposes.length} Options Defined
                  </p>
                </div>
                <Button
                  onClick={handleAddPurpose}
                  className="h-12 px-6 bg-sage text-white hover:bg-sage/90 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-sage/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Plus size={16} /> {t("Add Type", "タイプを追加", "Thêm loại")}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {purposes.sort((a,b) => (a.order_index ?? 0) - (b.order_index ?? 0)).map((purpose, index) => (
                  <div
                    key={purpose.id || `new-${index}`}
                    className="group bg-white/60 backdrop-blur-xl border border-white/40 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden"
                  >
                    <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="w-10 h-10 bg-sage/5 rounded-xl flex items-center justify-center text-sage cursor-grab active:cursor-grabbing">
                          <GripVertical size={16} />
                        </div>
                        <div className="w-10 h-10 bg-white border border-sage/20 rounded-xl flex items-center justify-center text-heading font-serif">
                          {index + 1}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                            {t("Internal Key", "内部キー", "Mã nội bộ")}
                          </label>
                          <Input
                            value={purpose.value || ""}
                            onChange={(e) => setPurposes(purposes.map(p => p.id === purpose.id ? { ...p, value: e.target.value } : p))}
                            className="h-11 bg-white/50 border-none rounded-xl text-xs font-mono shadow-inner"
                            placeholder="e.g. general"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                            {t("English Label", "英語のラベル", "Nhãn tiếng Anh")}
                          </label>
                          <Input
                            value={purpose.label_en || ""}
                            onChange={(e) => setPurposes(purposes.map(p => p.id === purpose.id ? { ...p, label_en: e.target.value } : p))}
                            className="h-11 bg-white/50 border-none rounded-xl text-xs font-serif italic"
                            placeholder="English Name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                            {t("Japanese Label", "日本語のラベル", "Nhãn tiếng Nhật")}
                          </label>
                          <Input
                            value={purpose.label_ja || ""}
                            onChange={(e) => setPurposes(purposes.map(p => p.id === purpose.id ? { ...p, label_ja: e.target.value } : p))}
                            className="h-11 bg-white/50 border-none rounded-xl text-xs font-serif italic"
                            placeholder="Japanese Name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                            {t("Vietnamese Label", "ベトナム語のラベル", "Nhãn tiếng Việt")}
                          </label>
                          <Input
                            value={purpose.label_vi || ""}
                            onChange={(e) => setPurposes(purposes.map(p => p.id === purpose.id ? { ...p, label_vi: e.target.value } : p))}
                            className="h-11 bg-white/50 border-none rounded-xl text-xs font-serif italic"
                            placeholder="Vietnamese Name"
                          />
                        </div>

                        <div className="flex items-end gap-3 h-[44px]">
                          <button
                            onClick={() => setPurposes(purposes.map(p => p.id === purpose.id ? { ...p, is_active: !p.is_active } : p))}
                            className={cn(
                              "flex-1 h-full flex items-center justify-center gap-2 rounded-xl border transition-all duration-300",
                              purpose.is_active ? "bg-sage/10 border-sage/20 text-sage" : "bg-muted-foreground/5 border-border/10 text-muted-foreground"
                            )}
                          >
                            <Target size={12} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{purpose.is_active ? "Active" : "Hidden"}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                        <Button
                          onClick={() => handleSavePurpose(purpose)}
                          className="w-12 h-12 p-0 bg-white hover:bg-heading hover:text-white border border-border/10 rounded-xl transition-all shadow-sm flex items-center justify-center"
                        >
                          <Save size={18} />
                        </Button>
                        <Button
                          onClick={() => purpose.id && handleDeletePurpose(purpose.id)}
                          variant="ghost"
                          className="w-12 h-12 p-0 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {purposes.length === 0 && (
                  <div className="py-20 text-center bg-white/40 border border-white/60 rounded-[3rem] opacity-40 italic font-serif">
                    No inquiry types defined.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactConfig;
