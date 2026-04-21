"use client";

import { useEffect, useState, memo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { TimelinePhase } from "@/types/admin";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import {
  Plus,
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  History,
  Globe2,
  Image as ImageIcon,
  Calendar,
  Building2,
  FileText as FileTextIcon,
  Settings2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { toast } from "sonner";
import { translateFields } from "@/lib/translate";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminDialogForm } from "@/components/admin/shared/AdminDialogForm";
import { ResponsiveDataTable } from "@/components/admin/shared/ResponsiveDataTable";
import { TimelinePhaseForm } from "@/components/admin/timeline/TimelinePhaseForm";
import { TimelinePhaseGallery } from "@/components/admin/timeline/TimelinePhaseGallery";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

interface TimelinePhaseImage {
  id: string;
  phase_id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  image_orientation: 'landscape' | 'portrait';
  is_cover: boolean;
  order_index: number;
}

const TimelineManagement = () => {
  const { lang, translations, t } = useLang();
  const queryClient = useQueryClient();
  const deleteConfirm = useDeleteConfirm();
  
  const [phases, setPhases] = useState<TimelinePhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  const [phaseImages, setPhaseImages] = useState<
    Record<string, TimelinePhaseImage[]>
  >({});

  const [formData, setFormData] = useState({
    period: "",
    location: "",
    title_en: "",
    title_ja: "",
    title_vi: "",
    company_en: "",
    company_ja: "",
    company_vi: "",
    description_en: "",
    description_ja: "",
    description_vi: "",
    image_url: "",
    tag_en: "",
    tag_ja: "",
    tag_vi: "",
    order_index: 0,
    is_published: true,
    default_image_orientation: 'landscape' as 'landscape' | 'portrait',
  });

  useEffect(() => {
    fetchPhases();
  }, []);

  const fetchPhases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("timeline_phases")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setPhases(data || []);

      if (data && data.length > 0) {
        const phaseIds = data.map((p) => p.id);
        const { data: imagesData } = await supabase
          .from("timeline_phase_images")
          .select("*")
          .in("phase_id", phaseIds)
          .order("order_index", { ascending: true });

        if (imagesData) {
          const imagesByPhase: Record<string, TimelinePhaseImage[]> = {};
          imagesData.forEach((img) => {
            if (!imagesByPhase[img.phase_id]) imagesByPhase[img.phase_id] = [];
            imagesByPhase[img.phase_id].push(img);
          });
          setPhaseImages(imagesByPhase);
        }
      }
    } catch (error) {
      toast.error(t("Error loading timeline phases", "タイムラインフェーズの読み込みエラー", "Lỗi khi tải dòng thời gian"));
    } finally {
      setLoading(false);
    }
  };

  const handleAutoTranslate = async () => {
    try {
      setIsTranslating(true);
      const sourceFields = {
        title: formData.title_en,
        company: formData.company_en,
        description: formData.description_en,
        tag: formData.tag_en,
      };

      if (!sourceFields.title && !sourceFields.description) {
        toast.error(t("Please provide English content to translate.", "翻訳する英語のコンテンツを入力してください。", "Vui lòng nhập nội dung tiếng Anh để dịch."));
        return;
      }

      const translatedJa = await translateFields(sourceFields as any, "ja");
      const translatedVi = await translateFields(sourceFields as any, "vi");
      setFormData((prev) => ({
        ...prev,
        title_ja: translatedJa.title,
        company_ja: translatedJa.company,
        description_ja: translatedJa.description,
        tag_ja: translatedJa.tag,
        title_vi: translatedVi.title,
        company_vi: translatedVi.company,
        description_vi: translatedVi.description,
        tag_vi: translatedVi.tag,
      }));
      toast.success(t("Magic! Translated to Japanese and Vietnamese.", "魔法！日本語とベトナム語に翻訳されました。", "Ảo thuật! Đã dịch sang tiếng Nhật và tiếng Việt."));
    } catch (error) {
      toast.error(t("Translation failed.", "翻訳に失敗しました。", "Dịch thất bại."));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = async () => {
    if (!formData.period || !formData.title_en || !formData.description_en) {
      toast.error(t("Essential parameters (Period, Title, Narrative) are required.", "基本的なパラメータ（期間、タイトル、ナラティブ）が必要です。", "Vui lòng nhập đầy đủ các trường Giai đoạn, Tiêu đề và Mô tả."));
      return;
    }

    try {
      setSaving(true);
      let currentId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from("timeline_phases")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("timeline_phases")
          .insert([{ ...formData, order_index: phases.length }])
          .select();
        if (error) throw error;
        if (data?.[0]) currentId = data[0].id;
      }

      if (currentId && phaseImages[currentId]) {
        const imageUpdates = phaseImages[currentId].map(img => 
           supabase
            .from("timeline_phase_images")
            .update({
              alt_text: img.alt_text,
              caption: img.caption,
              image_orientation: img.image_orientation,
              is_cover: img.is_cover
            })
            .eq("id", img.id)
        );
        await Promise.all(imageUpdates);
      }

      toast.success(t("Saved successfully.", "正常に保存されました。", "Lưu thành công."));
      setIsDialogOpen(false);
      fetchPhases();
    } catch (error) {
      toast.error(t("Error during save.", "保存中にエラーが発生しました。", "Lỗi khi lưu."));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (phase: TimelinePhase) => {
    setFormData({
      period: phase.period || "",
      location: phase.location || "",
      title_en: phase.title_en || "",
      title_ja: phase.title_ja || "",
      title_vi: phase.title_vi || "",
      company_en: phase.company_en || "",
      company_ja: phase.company_ja || "",
      company_vi: phase.company_vi || "",
      description_en: phase.description_en || "",
      description_ja: phase.description_ja || "",
      description_vi: phase.description_vi || "",
      image_url: phase.image_url || "",
      tag_en: phase.tag_en || "",
      tag_ja: phase.tag_ja || "",
      tag_vi: phase.tag_vi || "",
      order_index: phase.order_index,
      is_published: phase.is_published,
      default_image_orientation: 'landscape',
    });

    try {
      const { data: imagesData } = await supabase
        .from("timeline_phase_images")
        .select("*")
        .eq("phase_id", phase.id)
        .order("order_index");
      
      if (imagesData) {
        setPhaseImages(prev => ({ ...prev, [phase.id]: imagesData }));
      }
    } catch (err) {
      console.error("Failed to sync fresh assets");
    }

    setEditingId(phase.id);
    setActiveSection("general");
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.itemId) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("timeline_phases")
        .delete()
        .eq("id", deleteConfirm.itemId);
      if (error) throw error;
      toast.success(t("Phase decommissioned.", "フェーズを削除しました。", "Đã xóa giai đoạn."));
      deleteConfirm.closeConfirm();
      fetchPhases();
    } catch (error) {
      toast.error(t("Error purging phase.", "フェーズの削除中にエラーが発生しました。", "Lỗi khi xóa giai đoạn."));
    } finally {
      setDeleting(false);
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const index = phases.findIndex((p) => p.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === phases.length - 1)
    )
      return;

    const newPhases = [...phases];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    const tempIndex = newPhases[index].order_index;
    newPhases[index].order_index = newPhases[swapIndex].order_index;
    newPhases[swapIndex].order_index = tempIndex;
    setPhases([...newPhases].sort((a, b) => a.order_index - b.order_index));

    try {
      await Promise.all([
        supabase
          .from("timeline_phases")
          .update({ order_index: newPhases[index].order_index })
          .eq("id", newPhases[index].id),
        supabase
          .from("timeline_phases")
          .update({ order_index: newPhases[swapIndex].order_index })
          .eq("id", newPhases[swapIndex].id),
      ]);
      toast.success(t("Sequence re-arranged.", "順序を再配置しました。", "Đã sắp xếp lại thứ tự."));
    } catch (error) {
      toast.error(t("Order sync failure.", "順序の同期に失敗しました。", "Lỗi đồng bộ thứ tự."));
      fetchPhases();
    }
  };

  // Bulk Actions
  const handleBulkStatus = async (published: boolean) => {
    if (!selectedIds.length) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("timeline_phases")
        .update({ is_published: published })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Updated ${selectedIds.length} phases.`, `${selectedIds.length}件のフェーズを更新しました。`, `Đã cập nhật ${selectedIds.length} giai đoạn.`));
      fetchPhases();
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk update failed.", "一括更新に失敗しました。", "Cập nhật hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(t(`Delete ${selectedIds.length} phases?`, `${selectedIds.length}件のフェーズを削除しますか？`, `Xóa ${selectedIds.length} giai đoạn?`))) return;
    
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("timeline_phases")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Deleted ${selectedIds.length} phases.`, `${selectedIds.length}件のフェーズを削除しました。`, `Đã xóa ${selectedIds.length} giai đoạn.`));
      fetchPhases();
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk delete failed.", "一括削除に失敗しました。", "Xóa hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const updatePhaseImage = (imageId: string, updates: Partial<TimelinePhaseImage>) => {
    if (!editingId) return;
    setPhaseImages((prev) => {
      const phaseImgs = [...(prev[editingId!] || [])];
      const imgIdx = phaseImgs.findIndex(i => i.id === imageId);
      if (imgIdx > -1) phaseImgs[imgIdx] = { ...phaseImgs[imgIdx], ...updates };
      return { ...prev, [editingId!]: phaseImgs };
    });
  };

  const deletePhaseImage = async (imageId: string) => {
    try {
      await supabase.from("timeline_phase_images").delete().eq("id", imageId);
      toast.success(t("Asset purged.", "アセットを削除しました。", "Đã xóa tài nguyên."));
      fetchPhases();
      if (editingId) {
        setPhaseImages(prev => ({
          ...prev,
          [editingId]: prev[editingId].filter(i => i.id !== imageId)
        }));
      }
    } catch (error) {
      toast.error(t("Purge failure.", "削除に失敗しました。", "Lỗi khi xóa."));
    }
  };

  const setAsCover = (imageId: string) => {
    if (!editingId) return;
    setPhaseImages((prev) => {
      const phaseImgs = [...(prev[editingId!] || [])].map(img => ({
        ...img,
        is_cover: img.id === imageId
      }));
      return { ...prev, [editingId!]: phaseImgs };
    });
  };

  const handleMediaSelect = async (urls: string[]) => {
    if (!editingId) {
       toast.error(t("Please save the phase first before adding images.", "画像を添加する前にフェーズを保存してください。", "Vui lòng lưu giai đoạn trước khi thêm ảnh."));
       setShowMediaPicker(false);
       return;
    }

    try {
      const { data: existingImages } = await supabase
        .from("timeline_phase_images")
        .select("order_index")
        .eq("phase_id", editingId)
        .order("order_index", { ascending: false })
        .limit(1);
      
      let nextIndex = (existingImages?.[0]?.order_index ?? -1) + 1;

      const newImages = urls.map((url, i) => ({
        phase_id: editingId,
        image_url: url,
        order_index: nextIndex + i,
        image_orientation: 'landscape',
        is_cover: false
      }));

      const { data, error } = await supabase
        .from("timeline_phase_images")
        .insert(newImages)
        .select();

      if (error) throw error;
      
      setPhaseImages(prev => ({
        ...prev,
        [editingId]: [...(prev[editingId] || []), ...(data || [])]
      }));
      
      toast.success(t(`${urls.length} nodes integrated.`, `${urls.length}個のノードが統合されました。`, `Đã tích hợp ${urls.length} nút.`));
      setShowMediaPicker(false);
    } catch (error) {
      toast.error(t("Asset integration failed.", "アセットの統合に失敗しました。", "Tích hợp tài nguyên thất bại."));
    }
  };

  const handleFillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      period: "2024 — Present",
      location: "San Francisco, CA",
      title_en: "Senior Frontend Architect",
      company_en: "TechNova Solutions",
      description_en: "Led the migration of a legacy monolithic frontend to a module federated micro-frontend architecture using React and Webpack 5. Improved build times by 40% and team deployment velocity by 200%.",
      tag_en: "Engineering Leadership",
      is_published: true,
      default_image_orientation: 'landscape',
    }));
    toast.success(t("Sample data injected!", "サンプルデータが入力されました！", "Dữ liệu mẫu đã được điền!"));
  };

  const dialogTabs = [
    {
      id: "general",
      label: t("General", "全般", "Cơ bản"),
      fullLabel: t("General Details", "詳細情報", "Chi tiết cơ bản"),
      icon: Calendar,
      content: (
        <TimelinePhaseForm
          formData={formData}
          setFormData={setFormData}
          activeSection="general"
          onFillSampleData={!editingId ? handleFillSampleData : undefined}
        />
      ),
    },
    {
      id: "narrative",
      label: t("Narrative", "ナラティブ", "Mô tả"),
      fullLabel: t("Story & Description", "ストーリーと説明", "Câu chuyện & Mô tả"),
      icon: FileTextIcon,
      content: (
        <TimelinePhaseForm
          formData={formData}
          setFormData={setFormData}
          activeSection="narrative"
        />
      ),
    },
    {
      id: "localization",
      label: t("Languages", "言語", "Ngôn ngữ"),
      fullLabel: t("Translations (i18n)", "翻訳 (i18n)", "Bản dịch (i18n)"),
      icon: Globe2,
      content: (
        <TimelinePhaseForm
          formData={formData}
          setFormData={setFormData}
          activeSection="localization"
          isTranslating={isTranslating}
          onAutoTranslate={handleAutoTranslate}
        />
      ),
    },
    {
      id: "media",
      label: t("Gallery", "ギャラリー", "Thư viện"),
      fullLabel: t("Media", "メディア", "Phương tiện"),
      icon: ImageIcon,
      content: (
        <TimelinePhaseGallery
          images={editingId ? (phaseImages[editingId] || []) : []}
          onAddImages={() => setShowMediaPicker(true)}
          onUpdateImage={updatePhaseImage}
          onDeleteImage={deletePhaseImage}
          onSetAsCover={setAsCover}
        />
      ),
    },
    {
      id: "settings",
      label: t("Settings", "設定", "Cài đặt"),
      fullLabel: t("Publishing Settings", "公開設定", "Cài đặt xuất bản"),
      icon: Settings2,
      content: (
        <TimelinePhaseForm
          formData={formData}
          setFormData={setFormData}
          activeSection="settings"
        />
      ),
    },
  ];

  const columns = [
    {
      header: "Phase",
      key: "id",
      render: (phase: TimelinePhase) => (
        <div className="flex items-center gap-6 text-left">
          <div className="w-24 h-16 bg-white rounded-xl overflow-hidden shadow-inner border border-white shrink-0">
            {(() => {
              const imgs = phaseImages[phase.id] || [];
              const coverImg = imgs.find((i) => i.is_cover) || imgs[0];
              return coverImg ? (
                <img
                  src={coverImg.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground">
                  <ImageIcon size={20} strokeWidth={1} />
                </div>
              );
            })()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-sage uppercase tracking-widest bg-sage/5 px-2 py-0.5 rounded-full border border-sage/10">
                {phase.period}
              </span>
              <h3 className="text-sm font-serif font-bold text-heading">
                {phase.title_en}
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground italic font-serif">
               <span className="flex items-center gap-1">
                <Building2 size={10} /> {phase.company_en}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: t("Status", "ステータス", "Trạng thái"),
      key: "is_published",
      render: (phase: TimelinePhase) => (
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${phase.is_published ? "bg-sage shadow-[0_0_8px_rgba(132,153,137,0.5)]" : "bg-muted-foreground/30"}`}></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {phase.is_published ? t("Live", "公開中", "Công khai") : t("Archive", "アーカイブ", "Lưu trữ")}
          </span>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      header: t("Actions", "アクション", "Hành động"),
      key: "actions",
      render: (phase: TimelinePhase, index: number) => (
        <div className="flex items-center gap-1 justify-end">
           <div className="flex gap-1 mr-2 border-r border-border/10 pr-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleReorder(phase.id, "up"); }}
              disabled={index === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/50 text-muted-foreground hover:bg-sage hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronUp size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleReorder(phase.id, "down"); }}
              disabled={index === phases.length - 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/50 text-muted-foreground hover:bg-sage hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronDown size={16} />
            </button>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(phase); }}
            className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-heading hover:text-sage transition-all hover:scale-105 active:scale-95"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); deleteConfirm.openConfirm(phase.id, phase.title_en); }}
            className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-all hover:scale-105 active:scale-95"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={confirmDelete}
        itemName={deleteConfirm.itemName}
        isLoading={deleting}
      />

      <div className="space-y-12 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={translations[lang].chronologicalArchive}
          description={translations[lang].chronologicalArchiveDescription}
          primaryAction={{
            label: t("Add Phase", "フェーズを追加", "Thêm giai đoạn"),
            onClick: () => {
              setEditingId(null);
              setFormData({
                period: "",
                location: "",
                title_en: "",
                title_ja: "",
                title_vi: "",
                company_en: "",
                company_ja: "",
                company_vi: "",
                description_en: "",
                description_ja: "",
                description_vi: "",
                image_url: "",
                tag_en: "",
                tag_ja: "",
                tag_vi: "",
                order_index: phases.length,
                is_published: true,
                default_image_orientation: 'landscape',
              });
              setIsDialogOpen(true);
            },
            icon: Plus,
          }}
          searchConfig={{
            placeholder: t("Search timeline...", "タイムラインを検索...", "Tìm kiếm dòng thời gian..."),
            value: searchTerm,
            onChange: setSearchTerm,
          }}
          headerActions={
            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md"
                >
                   <div className="flex items-center gap-2 px-3 border-r border-sage/10 mr-1">
                      <div className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center text-[10px] font-black">{selectedIds.length}</div>
                      <button onClick={() => setSelectedIds([])} className="text-[10px] font-bold uppercase tracking-widest text-sage/60 hover:text-sage">Clear</button>
                   </div>
                   
                   <button 
                    onClick={() => handleBulkStatus(true)} 
                    disabled={isBulkPending}
                    className="p-2 rounded-xl text-sage hover:bg-sage/10 transition-all disabled:opacity-50"
                    title="Publish"
                   >
                    <CheckCircle2 size={18} />
                   </button>
                   
                   <button 
                    onClick={() => handleBulkStatus(false)} 
                    disabled={isBulkPending}
                    className="p-2 rounded-xl text-amber-500 hover:bg-amber-50 transition-all disabled:opacity-50"
                    title="Archive"
                   >
                    <XCircle size={18} />
                   </button>
                   
                   <button 
                    onClick={handleBulkDelete} 
                    disabled={isBulkPending}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                    title="Delete"
                   >
                    <Trash2 size={18} />
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          }
        />

        <ResponsiveDataTable
          data={phases.filter(
            (p) =>
              p.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.period.toLowerCase().includes(searchTerm.toLowerCase()),
          )}
          loading={loading}
          columns={columns}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          emptyState={{
            title: t("No Phases Found", "フェーズが見つかりません", "Không tìm thấy giai đoạn nào"),
            icon: History,
            message: t("No chronological data matches your query.", "クエリに一致する履歴データはありません。", "Không có dữ liệu lịch sử nào khớp với truy vấn của bạn."),
            onReset: () => setSearchTerm(""),
          }}
        />

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? t("Edit Timeline Phase", "タイムラインフェーズを編集", "Chỉnh sửa giai đoạn") : t("Add Timeline Phase", "タイムラインフェーズを追加", "Thêm giai đoạn")}
          description={t("Manage timeline details, narratives, and media.", "タイムラインの詳細、ストーリー、メディアを管理します。", "Quản lý chi tiết dòng thời gian, câu chuyện và phương tiện.")}
          tabs={dialogTabs}
          activeTab={activeSection}
          onTabChange={setActiveSection}
          onSave={handleSave}
          saving={saving}
          sidebarTitle={t("Timeline", "タイムライン", "Dòng thời gian")}
          sidebarSubtitle={t("Phase", "フェーズ", "Giai đoạn")}
          sidebarIcon={History}
          saveLabel={t("Save Phase", "フェーズを保存", "Lưu giai đoạn")}
        />

        <MediaPickerModal
          open={showMediaPicker}
          onOpenChange={setShowMediaPicker}
          onSelect={(url) => handleMediaSelect([url])}
          allowMultiple={true}
        />
      </div>
    </AdminLayout>
  );
};

export default memo(TimelineManagement);
