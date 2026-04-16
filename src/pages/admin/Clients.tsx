"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatUrl } from "@/lib/utils";
import { Client } from "@/types/admin";
import {
  ExternalLink,
  Edit3,
  Trash2,
  Settings2,
  Image as ImageIcon,
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/contexts/LangContext";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminDialogForm, AdminTabConfig } from "@/components/admin/shared/AdminDialogForm";
import { AdminLoading } from "@/components/admin/shared/AdminLoading";
import { AdminCardGrid } from "@/components/admin/shared/AdminCardGrid";
import { ClientForm } from "@/components/admin/clients/ClientForm";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

const Clients = () => {
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("identity");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  const { data: clients, loading, saving, deleting, upsertData, deleteData } = useAdminCRUD<Client>({
    tableName: "clients",
    defaultOrderBy: { column: "order_index", ascending: true }
  });

  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    website_url: "",
    order_index: 0,
    is_published: true,
  });

  const handleOpenAdd = () => {
    setFormData({ name: "", logo_url: "", website_url: "", order_index: clients.length, is_published: true });
    setEditingId(null);
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setFormData({
      name: client.name,
      logo_url: client.logo_url,
      website_url: client.website_url,
      order_index: client.order_index,
      is_published: client.is_published,
    });
    setEditingId(client.id);
    setActiveTab("identity");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error(t("Please provide an institutional name.", "機関名を入力してください。", "Vui lòng nhập tên tổ chức."));
      return;
    }
    if (!formData.logo_url) {
      toast.error(t("An icon or logo is required for the identity node.", "アイデンティティノードにはアイコンまたはロゴが必要です。", "Cần có biểu tượng hoặc logo cho nút định danh."));
      return;
    }

    const dataToSave = {
      ...formData,
      website_url: formData.website_url ? formatUrl(formData.website_url) : "",
    };
    
    try {
      const result = await upsertData(dataToSave, editingId || undefined);
      if (result) {
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Save operation failed:", error);
    }
  };

  // Bulk Actions
  const handleBulkStatus = async (published: boolean) => {
    if (!selectedIds.length) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update({ is_published: published })
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Updated ${selectedIds.length} partners.`, `${selectedIds.length}件のパートナーを更新しました。`, `Đã cập nhật ${selectedIds.length} đối tác.`));
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk update failed.", "一括更新に失敗しました。", "Cập nhật hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(t(`Delete ${selectedIds.length} partners?`, `${selectedIds.length}件のパートナーを削除しますか？`, `Xóa ${selectedIds.length} đối tác?`))) return;
    
    setIsBulkPending(true);
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Deleted ${selectedIds.length} partners.`, `${selectedIds.length}件のパートナーを削除しました。`, `Đã xóa ${selectedIds.length} đối tác.`));
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk delete failed.", "一括削除に失敗しました。", "Xóa hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs: AdminTabConfig[] = [
    { id: "identity", label: t("Identity", "アイデンティティ", "Định danh"), fullLabel: t("Identity Layout", "アイデンティティレイアウト", "Bố cục định danh"), icon: Settings2 },
    { id: "media", label: t("Media", "メディア", "Phương tiện"), fullLabel: t("Visual Asset", "ビジュアル資産", "Tài sản hình ảnh"), icon: ImageIcon },
    { id: "protocols", label: t("Config", "設定", "Cấu hình"), fullLabel: t("System Config", "システム設定", "Cấu hình hệ thống"), icon: ShieldCheck },
  ];

  const renderClientCard = (client: Client, index: number, isSelected?: boolean) => (
    <div className={cn(
        "group relative bg-white/60 backdrop-blur-xl border rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col items-center text-center gap-6",
        isSelected ? "border-sage bg-sage/5 scale-[0.98] shadow-inner" : "border-white/40"
    )}>
      <div className="relative w-full aspect-[3/2] bg-white rounded-[2rem] p-8 flex items-center justify-center shadow-inner border border-sage/5 overflow-hidden">
        <img src={client.logo_url} alt={client.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-all duration-700" />
        <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold text-sage shadow-sm uppercase tracking-tighter border border-sage/10">
          {t("RANK", "ランク", "HẠNG")} #{index + 1}
        </div>
      </div>
      <div className="space-y-4 w-full">
        <h3 className="text-lg font-serif font-bold text-heading group-hover:text-sage transition-colors line-clamp-1 px-2">{client.name}</h3>
        <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border inline-block",
          client.is_published ? "bg-sage/5 text-sage border-sage/10" : "bg-red-50 text-red-300 border-red-100"
        )}>
          {client.is_published ? t("Published", "公開済み", "Đã xuất bản") : t("Encrypted", "暗号化済み", "Đã mã hóa")}
        </div>
      </div>
      <div className="pt-6 border-t border-sage/10 w-full flex items-center justify-between">
        <div className="flex gap-2">
          {client.website_url && (
            <a href={formatUrl(client.website_url)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-muted-foreground hover:text-sage transition-all">
              <ExternalLink size={16} />
            </a>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); handleEdit(client); }} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-heading hover:text-sage hover:scale-110 active:scale-95 transition-all">
            <Edit3 size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); deleteConfirm.openConfirm(client.id, client.name); }} className="w-10 h-10 rounded-xl bg-red-50 text-red-400 shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <AdminLayout><AdminLoading message={t("Syncing Institutional Grid...", "機関グリッドを同期中...", "Đang đồng bộ lưới tổ chức...")} /></AdminLayout>;

  return (
    <AdminLayout>
      <DeleteConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.closeConfirm}
        onConfirm={() => deleteData(deleteConfirm.itemId!)}
        itemName={deleteConfirm.itemName}
        isLoading={deleting}
      />

      <div className="space-y-6 md:space-y-12 animate-in fade-in duration-700 pb-12">
        <AdminPageHeader
          title={translations[lang].institutionalNetwork}
          description={translations[lang].institutionalNetworkDescription}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          primaryAction={{ label: t("Integrate Client", "機関を統合", "Tích hợp tổ chức"), onClick: handleOpenAdd }}
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
                    title="Hide"
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

        <div className="-mx-4 md:mx-0 px-4 md:px-0">
          <AdminCardGrid
            data={filteredClients}
            renderCard={renderClientCard}
            loading={loading}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            emptyState={
              <div className="py-20 md:py-32 flex flex-col items-center justify-center space-y-4 bg-white/40 backdrop-blur-md rounded-2xl md:rounded-[3rem] border border-dashed border-border/50">
                <Building2 size={36} className="md:w-12 md:h-12 text-muted-foreground/20 animate-pulse" />
                <p className="text-muted-foreground font-serif text-sm md:text-lg italic mt-4 px-4 text-center">{t("No institutions found in this cluster.", "このクラスターに機関は見つかりませんでした。", "Không tìm thấy tổ chức nào trong cụm này.")}</p>
                <Button variant="link" onClick={() => setSearchTerm("")} className="text-sage text-xs md:text-sm">{t("Reset Archive", "アーカイブをリセット", "Đặt lại kho lưu trữ")}</Button>
              </div>
            }
          />
        </div>

        <AdminDialogForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? t("Refine Institutional Node", "機関ノードを洗練", "Tinh chỉnh nút tổ chức") : t("Network Architect", "ネットワークアーキテクト", "Kiến trúc sư mạng lưới")}
          description={t("Refine and architect the client network node.", "クライアントネットワークノードを精査し、構築します。", "Tinh chỉnh và xây dựng nút mạng lưới khách hàng.")}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSave={handleSave}
          saving={saving}
          saveLabel={editingId ? t("Refine Institutional", "機関を洗練", "Tinh chỉnh tổ chức") : t("Add", "追加", "Thêm")}
          sidebarTitle={t("Client", "クライアント", "Khách hàng")}
          sidebarSubtitle={t("Network Protocol", "ネットワークプロトコル", "Giao thức mạng lưới")}
          sidebarIcon={Building2}
        >
          <ClientForm
            formData={formData}
            setFormData={setFormData}
            activeSection={activeTab}
          />
        </AdminDialogForm>
      </div>
    </AdminLayout>
  );
};

export default Clients;
