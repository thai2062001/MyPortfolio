"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { getContactPurposeOptions } from "@/lib/supabase-contact-queries";
import type { ContactPurposeOption } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Trash2,
  Mail,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Calendar,
  BadgeCheck,
  ArrowLeft,
  User,
  Building2,
  Target,
  Info,
  Hash,
  Rocket,
  MoreVertical,
  X,
  CheckSquare,
  Square,
  Eye,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { cn } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminLoading } from "@/components/admin/shared/AdminLoading";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string | null;
  purpose: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  created_at: string;
  updated_at: string;
}

const ContactMessages = () => {
  const { lang, translations, t } = useLang();
  const deleteConfirm = useDeleteConfirm();
  const [searchParams] = useSearchParams();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("messageId") || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "read" | "replied">("all");
  const [filterPurpose, setFilterPurpose] = useState<string>("all");
  const [purposeOptions, setPurposeOptions] = useState<ContactPurposeOption[]>([]);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchPurposeOptions();
  }, []);

  const fetchPurposeOptions = async () => {
    const options = await getContactPurposeOptions();
    setPurposeOptions(options);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const msgs = data || [];
      setMessages(msgs);
      if (msgs.length > 0 && !selectedId) setSelectedId(msgs[0].id);
    } catch (error) {
      toast.error(t("Failed to load messages.", "メッセージの読み込みに失敗しました。", "Không thể tải tin nhắn."));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id: string, isRead: boolean) => {
    try {
      await supabase.from("contact_messages").update({ is_read: !isRead }).eq("id", id);
      setMessages(messages.map((m) => (m.id === id ? { ...m, is_read: !isRead } : m)));
    } catch (error) {
      toast.error(t("Status update failure.", "ステータスの更新に失敗しました。", "Cập nhật trạng thái thất bại."));
    }
  };

  const handleToggleReplied = async (id: string, isReplied: boolean) => {
    try {
      await supabase.from("contact_messages").update({ is_replied: !isReplied }).eq("id", id);
      setMessages(messages.map((m) => m.id === id ? { ...m, is_replied: !isReplied } : m));
    } catch (error) {
      toast.error(t("Status update failure.", "ステータスの更新に失敗しました。", "Cập nhật trạng thái thất bại."));
    }
  };

  // Bulk Actions
  const handleBulkRead = async () => {
    if (!selectedIds.length) return;
    setIsBulkPending(true);
    try {
      const { error } = await supabase.from("contact_messages").update({ is_read: true }).in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Marked ${selectedIds.length} as read.`, `${selectedIds.length}件を既読にしました。`, `Đã đánh dấu ${selectedIds.length} là đã đọc.`));
      setMessages(messages.map(m => selectedIds.includes(m.id) ? { ...m, is_read: true } : m));
      setSelectedIds([]);
    } catch {
      toast.error(t("Bulk update failed.", "一括更新に失敗しました。", "Cập nhật hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(t(`Delete ${selectedIds.length} messages?`, `${selectedIds.length}件削除しますか？`, `Xóa ${selectedIds.length} tin nhắn?`))) return;
    
    setIsBulkPending(true);
    try {
      const { error } = await supabase.from("contact_messages").delete().in("id", selectedIds);
      if (error) throw error;
      toast.success(t(`Deleted ${selectedIds.length} messages.`, `${selectedIds.length}件を削除しました。`, `Đã xóa ${selectedIds.length} tin nhắn.`));
      const newMessages = messages.filter(m => !selectedIds.includes(m.id));
      setMessages(newMessages);
      setSelectedIds([]);
      if (selectedId && selectedIds.includes(selectedId)) {
        setSelectedId(newMessages.length > 0 ? newMessages[0].id : null);
      }
    } catch {
      toast.error(t("Bulk delete failed.", "一括削除に失敗しました。", "Xóa hàng loạt thất bại."));
    } finally {
      setIsBulkPending(false);
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.itemId) return;
    try {
      setDeleting(true);
      await supabase.from("contact_messages").delete().eq("id", deleteConfirm.itemId);
      toast.success(t("Message deleted.", "メッセージを削除しました。", "Đã xóa tin nhắn."));
      const newMessages = messages.filter((m) => m.id !== deleteConfirm.itemId);
      setMessages(newMessages);
      deleteConfirm.closeConfirm();
      if (selectedId === deleteConfirm.itemId) {
        setSelectedId(newMessages.length > 0 ? newMessages[0].id : null);
        setIsMobileDetailOpen(false);
      }
    } catch (error) {
       toast.error(t("Failed to delete message.", "メッセージの削除に失敗しました。", "Không thể xóa tin nhắn."));
    } finally {
      setDeleting(false);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || msg.email.toLowerCase().includes(searchTerm.toLowerCase()) || msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPurpose = filterPurpose === "all" || msg.purpose === filterPurpose;
    if (filterStatus === "unread") return matchesSearch && matchesPurpose && !msg.is_read;
    if (filterStatus === "read") return matchesSearch && matchesPurpose && msg.is_read && !msg.is_replied;
    if (filterStatus === "replied") return matchesSearch && matchesPurpose && msg.is_replied;
    return matchesSearch && matchesPurpose;
  });

  const selectedMessage = messages.find((m) => m.id === selectedId);

  useEffect(() => {
    if (selectedMessage && !selectedMessage.is_read) handleToggleRead(selectedMessage.id, false);
  }, [selectedId]);

  if (loading) return <AdminLayout><AdminLoading message={t("Loading messages...", "メッセージを読み込み中...", "Đang tải tin nhắn...")} /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-700">
        <AdminPageHeader
          title={t("Contact Messages", "お問い合わせ", "Tin nhắn liên hệ")}
          description={t("Manage inbound contact form inquiries.", "お問い合わせフォームの照会を管理します。", "Quản lý các yêu cầu liên hệ từ người dùng.")}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("Search...", "検索...", "Tìm kiếm...")}
          headerActions={
            <div className="flex items-center gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md">
              {[
                { id: "all", label: t("All", "すべて", "Tất cả"), icon: Mail },
                { id: "unread", label: t("Unread", "未読", "Chưa đọc"), icon: Clock },
                { id: "read", label: t("Read", "既読", "Đã đọc"), icon: CheckCircle2 },
                { id: "replied", label: t("Replied", "返信済み", "Đã trả lời"), icon: Send },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterStatus(filter.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all",
                    filterStatus === filter.id ? "bg-sage text-white shadow-lg shadow-sage/20" : "text-muted-foreground hover:bg-sage/5 hover:text-sage"
                  )}
                >
                  <filter.icon size={14} />
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              ))}
            </div>
          }
        />

        <div className="flex-1 mt-6 min-h-0 bg-white/40 backdrop-blur-xl border border-white/40 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
          {/* LIST PANE */}
          <div className="w-full md:w-[400px] border-r border-border/10 flex flex-col min-h-0 bg-white/20">
            {/* Bulk Actions Header */}
            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-sage/5 border-b border-sage/10 overflow-hidden"
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center text-[10px] font-black">{selectedIds.length}</div>
                       <button onClick={() => setSelectedIds([])} className="text-[10px] font-bold uppercase tracking-widest text-sage/60 hover:text-sage">Clear</button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleBulkRead} disabled={isBulkPending} className="p-2 rounded-lg bg-white border border-sage/15 text-sage hover:bg-sage hover:text-white transition-all shadow-sm disabled:opacity-50"><CheckCircle2 size={14} /></button>
                      <button onClick={handleBulkDelete} disabled={isBulkPending} className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-2 space-y-2 md:space-y-1">
              {filteredMessages.length === 0 ? (
                <div className="py-20 text-center opacity-40">
                  <p className="text-sm italic font-serif">{t("No messages found.", "メッセージが見つかりません。", "Không tìm thấy tin nhắn nào.")}</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedId(msg.id);
                      setIsMobileDetailOpen(true);
                    }}
                    className={cn(
                      "group cursor-pointer p-5 md:p-6 rounded-[2rem] transition-all duration-500 relative flex flex-col gap-2",
                      selectedId === msg.id 
                        ? "bg-sage text-white shadow-2xl shadow-sage/20 scale-[0.98] md:scale-100" 
                        : "hover:bg-white bg-white/30 md:bg-transparent"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div className="min-w-0 pr-4 flex items-center gap-3">
                         {/* Selection Checkbox */}
                         <div 
                           onClick={(e) => toggleSelect(msg.id, e)}
                           className={cn(
                             "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                             selectedIds.includes(msg.id) 
                               ? (selectedId === msg.id ? "bg-white border-white text-sage" : "bg-sage border-sage text-white")
                               : (selectedId === msg.id ? "border-white/40" : "border-sage/20")
                           )}
                         >
                            {selectedIds.includes(msg.id) && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={12} /></motion.div>}
                         </div>

                         <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                           selectedId === msg.id ? "bg-white/20 text-white" : "bg-sage/5 text-sage"
                         )}>
                            <User size={18} />
                         </div>
                         <div className="min-w-0">
                            <h4 className={cn("text-sm md:text-base font-serif font-bold line-clamp-1", !msg.is_read && selectedId !== msg.id ? "text-heading" : "text-inherit")}>
                              {msg.name}
                            </h4>
                            <p className={cn("hidden md:block text-[9px] font-mono mt-0.5 truncate opacity-70")}>
                              {msg.email}
                            </p>
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                         <span className={cn("text-[10px] md:text-[9px] font-bold tracking-tighter opacity-80")}>
                           {new Date(msg.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                         </span>
                         {!msg.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-lg animate-pulse"></span>}
                      </div>
                    </div>
                    <p className={cn("hidden md:line-clamp-1 text-xs font-serif italic opacity-70")}>
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DETAIL PANE (Desktop) */}
          <div className="hidden md:flex flex-1 flex-col min-h-0 relative bg-white/10 overflow-hidden">
            {selectedMessage ? (
              <MessageDetailContent 
                message={selectedMessage} 
                onToggleReplied={handleToggleReplied}
                onDelete={deleteConfirm.openConfirm}
              />
            ) : (
              <EmptyState />
            )}
          </div>

          {/* DETAIL DIALOG (Mobile) */}
          <Dialog open={isMobileDetailOpen} onOpenChange={setIsMobileDetailOpen}>
            <DialogContent hideDefaultClose className="md:hidden max-w-[95vw] h-[90vh] p-0 overflow-hidden bg-white/95 backdrop-blur-3xl border-white/60 shadow-2xl rounded-[3rem] focus:outline-none">
              {selectedMessage && (
                <div className="h-full flex flex-col">
                  <DialogHeader className="p-8 border-b border-sage/10 relative shrink-0">
                    <button 
                      onClick={() => setIsMobileDetailOpen(false)}
                      className="absolute top-8 right-8 w-10 h-10 rounded-xl hover:bg-heading hover:text-white flex items-center justify-center text-muted-foreground transition-all duration-300 group/close z-10"
                    >
                      <X size={20} className="group-hover/close:rotate-90 transition-transform duration-300" />
                    </button>
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-sage/5 rounded-[1.5rem] flex items-center justify-center text-sage">
                        <User size={32} />
                      </div>
                      <div className="min-w-0 pr-12">
                        <DialogTitle className="text-2xl font-serif font-bold text-heading truncate">
                           {selectedMessage.name}
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                          {new Date(selectedMessage.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                   <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-40">
                     <div className="grid grid-cols-1 gap-4">
                        <DetailMetric icon={Mail} label={t("Email Address", "メールアドレス", "Địa chỉ Email")} value={selectedMessage.email} />
                        <DetailMetric icon={Building2} label={t("Company", "会社", "Công ty")} value={selectedMessage.company || t("Individual", "個人", "Cá nhân")} />
                        <DetailMetric icon={Target} label={t("Purpose", "目的", "Mục đích")} value={selectedMessage.purpose || t("General Inquiry", "一般のお問い合わせ", "Yêu cầu chung")} />
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sage/40 ml-2">
                          <Hash size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t("Message Content", "メッセージ内容", "Nội dung tin nhắn")}</span>
                        </div>
                        <div className="bg-white/60 p-8 rounded-[2rem] border border-white/60 shadow-inner font-serif italic text-lg text-heading leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-border/10 flex flex-col gap-3 absolute bottom-0 left-0 right-0">
                     <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => handleToggleReplied(selectedMessage.id, selectedMessage.is_replied)}
                          className={cn("flex-1 h-14 rounded-2xl font-bold text-[10px] uppercase tracking-widest", selectedMessage.is_replied ? "bg-sage/10 text-sage border-sage/20" : "bg-white text-muted-foreground")}
                        >
                          {selectedMessage.is_replied ? <BadgeCheck size={16} className="mr-2" /> : <Send size={16} className="mr-2" />}
                          {selectedMessage.is_replied ? t("Replied", "返信済み", "Đã trả lời") : t("Mark Replied", "返信済みにする", "Đã trả lời")}
                        </Button>
                        <Button 
                          onClick={() => deleteConfirm.openConfirm(selectedMessage.id, selectedMessage.name)} 
                          variant="outline" 
                          className="w-14 h-14 p-0 border-red-100 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center shrink-0"
                        >
                          <Trash2 size={20} />
                        </Button>
                     </div>
                      <Button className="h-16 rounded-2xl bg-heading text-white font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-heading/20 flex items-center justify-center gap-3">
                        {t("Reply via Email", "メールで返信", "Phản hồi qua Email")} <Rocket size={16} />
                      </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <DeleteConfirmDialog
          open={deleteConfirm.isOpen}
          onOpenChange={deleteConfirm.closeConfirm}
          onConfirm={confirmDelete}
          itemName={deleteConfirm.itemName}
          isLoading={deleting}
        />
      </div>
    </AdminLayout>
  );
};

const MessageDetailContent = ({ message, onToggleReplied, onDelete }: any) => {
  const { t } = useLang();
  return (
    <>
      <div className="p-6 md:p-10 border-b border-border/10 bg-white/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-sage/5 rounded-2xl flex items-center justify-center text-sage shrink-0"><User size={24} /></div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-3xl font-serif font-bold text-heading truncate">{message.name}</h2>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <span className="truncate max-w-[150px]">{message.email}</span>
                <span className="w-1 h-1 bg-border rounded-full"></span>
                <span>{new Date(message.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
          </div>
        </div>
      </div>

       <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar-thin space-y-10 pb-48">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DetailMetric icon={Building2} label={t("Company", "会社", "Công ty")} value={message.company || t("Individual", "個人", "Cá nhân")} />
            <DetailMetric icon={Target} label={t("Purpose", "目的", "Mục đích")} value={message.purpose || t("General Inquiry", "一般のお問い合わせ", "Yêu cầu chung")} />
            <DetailMetric icon={Info} label={t("Source", "ソース", "Nguồn")} value={t("Portfolio Website", "ポートフォリオサイト", "Website Portfolio")} />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sage/40 ml-2"><Hash size={16} /><span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t("Message Body", "メッセージ本文", "Nội dung tin nhắn")}</span></div>
            <div className="bg-white/60 p-8 md:p-12 rounded-[2.5rem] border border-white/60 shadow-inner font-serif italic text-lg text-heading leading-relaxed whitespace-pre-wrap">{message.message}</div>
          </div>
      </div>

      <div className="p-6 md:p-10 bg-white/80 backdrop-blur-xl border-t border-border/10 flex flex-wrap justify-end gap-4 absolute bottom-0 left-0 right-0 md:relative">
          <Button 
          variant="outline" 
          onClick={() => onToggleReplied(message.id, message.is_replied)}
          className={cn("h-14 px-8 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all", message.is_replied ? "bg-sage/10 text-sage border-sage/20" : "bg-white border-border/50 text-muted-foreground")}
          >
            {message.is_replied ? <BadgeCheck size={16} className="mr-2" /> : <Send size={16} className="mr-2" />}
            {message.is_replied ? t("Replied", "返信済み", "Đã trả lời") : t("Mark Replied", "返信済みにする", "Đã trả lời")}
          </Button>
          <Button onClick={() => onDelete(message.id, message.name)} variant="outline" className="h-14 px-8 border-red-100 text-red-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            <Trash2 size={16} className="mr-2" /> {t("Delete", "削除", "Xóa")}
          </Button>
          <Button className="h-14 px-12 rounded-2xl bg-heading text-white font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-heading/20 group hover:scale-105 transition-all">
            {t("Reply via Email", "メールで返信", "Phản hồi qua Email")} <Rocket size={16} className="ml-3 group-hover:-translate-y-1 transition-transform" />
          </Button>
      </div>
    </>
  );
};

const EmptyState = () => {
  const { t } = useLang();
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6 opacity-30">
      <Mail size={100} className="text-muted-foreground/20" />
      <p className="text-xl font-serif italic text-muted-foreground">{t("Select a message to view details.", "詳細を表示するメッセージを選択してください。", "Chọn một tin nhắn để xem chi tiết.")}</p>
    </div>
  );
};

const DetailMetric = ({ icon: Icon, label, value }: any) => (
  <div className="p-6 bg-white/40 border border-white/60 rounded-[2rem] flex items-center gap-4 group hover:bg-white transition-all shadow-sm">
    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-sage transition-colors"><Icon size={18} /></div>
    <div className="min-w-0">
      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-heading truncate">{value}</p>
    </div>
  </div>
);

export default ContactMessages;
