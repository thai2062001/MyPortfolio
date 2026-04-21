import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Share2,
  Sparkles,
  User,
  Fingerprint,
  Upload,
  ShieldCheck,
} from "lucide-react";
import {
  getAllSocialLinks,
  updateSocialLink,
  createSocialLink,
  deleteSocialLink,
} from "@/lib/supabase-queries";
import { useLang } from "@/contexts/LangContext";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { uploadMedia } from "@/lib/cloudinary";
import { createMediaAsset } from "@/lib/supabase-media";
import { PersonalInfo, SocialLink } from "@/types/admin";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminDialogForm } from "@/components/admin/shared/AdminDialogForm";
import { PersonalInfoForm } from "@/components/admin/personal/PersonalInfoForm";
import { SocialLinksManager } from "@/components/admin/personal/SocialLinksManager";
import { SocialLinkDialog } from "@/components/admin/personal/SocialLinkDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";

const PersonalInfoPage = () => {
  const queryClient = useQueryClient();
  const { lang, translations, t } = useLang();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("contact");
  const [saving, setSaving] = useState(false);
  const deleteConfirm = useDeleteConfirm();

  // Load Personal Info with TanStack Query (Point 1)
  const { data: personalInfo, isLoading: loading } = useQuery({
    queryKey: ["personal-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personal_info")
        .select("*")
        .eq("id", 1)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data as PersonalInfo || { id: 1, full_name: "", bio: "", phone_number: "", email: "", address: "" };
    },
  });

  // Local state for the form
  const [formData, setFormData] = useState<PersonalInfo>({
    id: 1,
    full_name: "",
    bio: "",
    phone_number: "",
    email: "",
    address: "",
  });

  // Sync personalInfo to formData when it loads or dialog opens
  useEffect(() => {
    if (personalInfo) {
      setFormData(personalInfo);
    }
  }, [personalInfo, isDialogOpen]);

  // Optimistic Update Mutation (Point 2)
  const updateInfoMutation = useMutation({
    mutationFn: async (newData: PersonalInfo) => {
      const { error } = await supabase
        .from("personal_info")
        .upsert({ ...newData, id: 1 });
      if (error) throw error;
      return newData;
    },
    // When mutate is called:
    onMutate: async (newData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["personal-info"] });

      // Snapshot the previous value
      const previousInfo = queryClient.getQueryData(["personal-info"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["personal-info"], newData);

      // Return a context object with the snapshotted value
      return { previousInfo };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newData, context) => {
      queryClient.setQueryData(["personal-info"], context?.previousInfo);
      toast.error("Failed to save. Changes rolled back.");
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["personal-info"] });
    },
    onSuccess: () => {
      toast.success("Info updated instantly.");
      setIsDialogOpen(false);
    },
  });

  // SOCIAL FORM STATE
  const [editingSocialLink, setEditingSocialLink] = useState<Partial<SocialLink> | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const handleSaveContact = () => {
    updateInfoMutation.mutate(formData);
  };

  const handleAddSocial = () => {
    setEditingSocialLink({
      platform_name: "",
      display_name: "",
      url: "https://",
      icon_url: "",
      is_published: true,
    });
    setIsSocialModalOpen(true);
  };

  const handleEditSocial = (link: SocialLink) => {
    setEditingSocialLink(link);
    setIsSocialModalOpen(true);
  };

  const fetchSocialLinks = async () => {
    try {
      const links = await getAllSocialLinks();
      setSocialLinks(links);
    } catch (error) {
      console.error("Error fetching Social Links:", error);
    }
  };

  const handleConfirmSocialSave = async () => {
    if (!editingSocialLink?.platform_name) {
      toast.error("Please provide a platform name.");
      return;
    }

    try {
      setSaving(true);
      if ("id" in editingSocialLink && editingSocialLink.id) {
        await updateSocialLink(editingSocialLink.id as string, editingSocialLink);
        setSocialLinks(
          socialLinks.map((l) =>
            l.id === editingSocialLink.id ? (editingSocialLink as SocialLink) : l
          )
        );
        toast.success("Link updated successfully.");
      } else {
        const newLink = await createSocialLink({
          platform_name: editingSocialLink.platform_name,
          display_name: editingSocialLink.display_name || "@handle",
          url: editingSocialLink.url || "https://",
          order_index: socialLinks.length,
          is_published: editingSocialLink.is_published ?? true,
          icon_url: editingSocialLink.icon_url || null,
        });
        setSocialLinks([...socialLinks, newLink]);
        toast.success("Social link added successfully.");
      }
      setIsSocialModalOpen(false);
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("This platform already exists.");
      } else {
        toast.error("Operation failed.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDraftFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const metadata = await uploadMedia(file, { isIcon: true });
      await createMediaAsset({
        ...metadata,
        title: file.name,
      });

      setEditingSocialLink({ ...editingSocialLink!, icon_url: metadata.secure_url! });
      toast.success("Icon uploaded successfully.");
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSocial = async (id: string, updates: Partial<SocialLink>) => {
    try {
      await updateSocialLink(id, updates);
      setSocialLinks(
        socialLinks.map((link) => (link.id === id ? { ...link, ...updates } : link))
      );
      toast.success("Link updated.");
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  const handleDeleteSocial = async () => {
    if (!deleteConfirm.itemId) return;
    try {
      setSaving(true);
      await deleteSocialLink(deleteConfirm.itemId);
      setSocialLinks(socialLinks.filter((link) => link.id !== deleteConfirm.itemId));
      toast.success("Link deleted.");
      deleteConfirm.closeConfirm();
    } catch (error) {
      toast.error("Delete failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage animate-pulse">
            {translations[lang].loading}
          </p>
        </div>
      </AdminLayout>
    );
  }

  const dialogTabs = [
    {
      id: "contact",
      label: t("Contact", "お問い合わせ", "Liên hệ"),
      fullLabel: t("Contact Information", "連絡先情報", "Thông tin liên hệ"),
      icon: Mail,
      content: <PersonalInfoForm formData={formData} setFormData={setFormData} />,
    },
    {
      id: "social",
      label: "Social",
      fullLabel: t("Social Media Profiles", "ソーシャルメディア", "Hồ sơ mạng xã hội"),
      icon: Share2,
      content: (
        <SocialLinksManager
          socialLinks={socialLinks}
          onAdd={handleAddSocial}
          onEdit={handleEditSocial}
          onUpdate={handleUpdateSocial}
          onDelete={(id) => deleteConfirm.openConfirm(id, socialLinks.find(l => l.id === id)?.platform_name || t("Social Node", "ソーシャルノード", "Liên kết mạng xã hội"))}
        />
      ),
    },
    {
      id: "security",
      label: t("Security", "セキュリティ", "Bảo mật"),
      fullLabel: t("Security Information", "セキュリティ情報", "Thông tin bảo mật"),
      icon: ShieldCheck,
      content: (
        <div className="space-y-12 max-w-2xl text-left">
          <div className="bg-sage/5 p-12 rounded-[3.5rem] border border-sage/10 relative overflow-hidden">
            <ShieldCheck className="absolute -bottom-6 -right-6 text-sage/10" size={120} />
            <h4 className="text-xl font-serif font-bold text-heading mb-4">{t("Security Note", "セキュリティノート", "Lưu ý bảo mật")}</h4>
            <p className="text-sm text-muted-foreground italic font-serif leading-relaxed">
              {t(
                "Your data is securely stored in Supabase. All personal identifiers are protected behind encryption layers. No manual configuration is needed for node security.",
                "データはSupabaseに安全に保存されています。すべての個人識別情報は暗号化レイヤーで保護されています。セキュリティに関する手動設定は不要です。",
                "Dữ liệu của bạn được lưu trữ an toàn trong Supabase. Tất cả thông tin định danh cá nhân đều được bảo vệ sau các lớp mã hóa. Không cần cấu hình thủ công cho bảo mật nút."
              )}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={handleDeleteSocial}
        itemName={deleteConfirm.itemName}
        isLoading={saving}
      />

      <div className="space-y-10 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={translations[lang].personalInfoTitle}
          description={translations[lang].personalInfoDescription}
          primaryAction={{
            label: t("Edit Info", "情報を編集", "Sửa thông tin"),
            onClick: () => setIsDialogOpen(true),
            icon: Fingerprint,
          }}
        />

        {/* DASHBOARD PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* CORE CONTACT PREVIEW */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[3.5rem] p-16 shadow-sm hover:shadow-2xl transition-all duration-700 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <User size={180} />
            </div>

            <div className="relative z-10 space-y-12 text-left">
              <div className="space-y-4">
                <p className="text-xs tracking-[0.3em] font-bold text-sage uppercase">
                  {t("Contact Details", "連絡先の詳細", "Chi tiết liên hệ")}
                </p>
                <div className="space-y-1">
                  <h1 className="text-4xl font-serif font-bold text-heading">{formData.full_name || "Digital Identity"}</h1>
                  <h2 className="text-xl font-serif text-muted-foreground italic flex items-center gap-2">
                    {t("Contact Info", "連絡先情報", "Thông tin liên hệ")}
                  </h2>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-8 group/item">
                  <div className="w-16 h-16 bg-sage/5 rounded-2xl flex items-center justify-center text-sage group-hover/item:bg-sage group-hover/item:text-white transition-all duration-500 shadow-sm border border-sage/10 shrink-0">
                    <Mail size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {t("Email", "メールアドレス", "Email")}
                    </p>
                    <p className="text-lg font-serif italic text-heading mt-1 truncate">
                      {formData.email || "email@example.com"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 group/item">
                  <div className="w-16 h-16 bg-sage/5 rounded-2xl flex items-center justify-center text-sage group-hover/item:bg-sage group-hover/item:text-white transition-all duration-500 shadow-sm border border-sage/10 shrink-0">
                    <Phone size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {t("Phone", "電話番号", "Điện thoại")}
                    </p>
                    <p className="text-lg font-serif italic text-heading mt-1">
                      {formData.phone_number || "+000 0000 000"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 group/item">
                  <div className="w-16 h-16 bg-sage/5 rounded-2xl flex items-center justify-center text-sage group-hover/item:bg-sage group-hover/item:text-white transition-all duration-500 shadow-sm border border-sage/10 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {t("Address", "住所", "Địa chỉ")}
                    </p>
                    <p className="text-lg font-serif italic text-heading mt-1 truncate">
                      {formData.address || "Global Sync"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links PREVIEW */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[3.5rem] p-16 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4 text-left">
              <p className="text-xs tracking-[0.3em] font-bold text-sage uppercase">
                {t("Social Media", "ソーシャルメディア", "Mạng xã hội")}
              </p>
              <h2 className="text-3xl font-serif font-bold text-heading">{translations[lang].socialLinks}</h2>
            </div>

            <div className="flex flex-wrap gap-6 my-10">
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => (
                  <div key={link.id} className="relative group/vec">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm hover:shadow-xl border ${
                        link.is_published
                          ? "bg-white border-sage/20 hover:border-sage/40 hover:-translate-y-1.5"
                          : "bg-muted/5 text-muted-foreground border-border/10 grayscale opacity-50"
                      }`}
                    >
                      {link.icon_url ? (
                        <img
                          src={link.icon_url}
                          alt={link.platform_name}
                          className="w-7 h-7 object-contain transition-transform duration-500 group-hover/vec:scale-110"
                        />
                      ) : (
                        <Share2 size={24} className={link.is_published ? "text-sage" : ""} />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm font-serif italic text-muted-foreground">
                  {t("No Social Links linked to the digital presence.", "ソーシャルネットワークにリンクされたプロファイルはありません。", "Chưa có liên kết mạng xã hội nào.")}
                </p>
              )}
            </div>

            <div className="p-8 bg-sage/5 rounded-[2rem] border border-sage/10 italic text-[11px] text-sage flex items-center gap-4 text-left">
              <Sparkles size={16} className="animate-pulse shrink-0" />
              <span className="leading-relaxed">
                {t("These changes will be reflected globally across your portfolio.", "これらの変更はポートフォリオ全体にグローバルに反映されます。", "Những thay đổi này sẽ được áp dụng rộng rãi trên toàn bộ portfolio.")}
              </span>
            </div>
          </div>
        </div>

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={t("Edit Personal Info", "個人情報を編集", "Sửa thông tin cá nhân")}
          description={t("Update your contact information and social links.", "連絡先情報とソーシャルリンクを更新します。", "Cập nhật thông tin liên hệ và liên kết mạng xã hội của bạn.")}
          tabs={dialogTabs}
          activeTab={activeSection}
          onTabChange={setActiveSection}
          onSave={handleSaveContact}
          saving={updateInfoMutation.isPending}
          sidebarTitle={t("General", "一般", "Chung")}
          sidebarSubtitle={t("Settings", "設定", "Thiết lập")}
          sidebarIcon={Fingerprint}
          saveLabel={translations[lang].save}
        />

        <SocialLinkDialog
          open={isSocialModalOpen}
          onOpenChange={setIsSocialModalOpen}
          editingLink={editingSocialLink}
          setEditingLink={setEditingSocialLink}
          onSave={handleConfirmSocialSave}
          isSaving={saving}
          onDeviceUpload={() => document.getElementById("new-social-file-input")?.click()}
          onLibraryPick={() => setShowMediaPicker("draft")}
        />

        <input
          id="new-social-file-input"
          type="file"
          className="hidden"
          onChange={handleDraftFileUpload}
          accept="image/*"
        />

        <MediaPickerModal
          open={showMediaPicker === "draft"}
          onOpenChange={(open) => !open && setShowMediaPicker(null)}
          onSelect={(url) => {
            setEditingSocialLink({ ...editingSocialLink!, icon_url: url });
            setShowMediaPicker(null);
          }}
          allowedTypes={["icon", "svg"]}
          title="Select Icon"
        />
      </div>
    </AdminLayout>
  );
};

export default PersonalInfoPage;
