import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export interface ContactNotification {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
}

export const useContactNotifications = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<ContactNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch initial unread count
    const fetchUnreadCount = useCallback(async () => {
        try {
            const { count, error } = await supabase
                .from("contact_messages")
                .select("*", { count: "exact", head: true })
                .eq("is_read", false);

            if (error) throw error;
            setUnreadCount(count || 0);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch recent unread notifications
    const fetchRecentNotifications = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("contact_messages")
                .select("id, name, email, subject, message, created_at")
                .eq("is_read", false)
                .order("created_at", { ascending: false })
                .limit(5);

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, []);

    // Subscribe to real-time changes
    useEffect(() => {
        fetchUnreadCount();
        fetchRecentNotifications();

        // Subscribe to new messages
        const channel = supabase
            .channel("contact_messages_changes", {
                config: {
                    broadcast: { self: true },
                },
            })
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "contact_messages",
                },
                (payload) => {
                    // New message inserted
                    setUnreadCount((prev) => prev + 1);
                    const newMessage = payload.new as ContactNotification;
                    setNotifications((prev) => [newMessage, ...prev.slice(0, 4)]);
                },
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "contact_messages",
                },
                (payload) => {
                    const updatedMessage = payload.new as any;
                    // If a message was marked as read
                    if (updatedMessage.is_read) {
                        setUnreadCount((prev) => Math.max(0, prev - 1));
                        setNotifications((prev) =>
                            prev.filter((n) => n.id !== updatedMessage.id),
                        );
                    }
                },
            )
            .subscribe((status) => {
                // Subscription active
            });

        // Polling fallback - check for new messages every 5 seconds
        pollingIntervalRef.current = setInterval(() => {
            fetchUnreadCount();
            fetchRecentNotifications();
        }, 5000);

        return () => {
            channel.unsubscribe();
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [fetchUnreadCount, fetchRecentNotifications]);

    const markAsRead = async (messageId: string) => {
        try {
            const { error } = await supabase
                .from("contact_messages")
                .update({ is_read: true })
                .eq("id", messageId);

            if (error) throw error;
            setUnreadCount((prev) => Math.max(0, prev - 1));
            setNotifications((prev) => prev.filter((n) => n.id !== messageId));
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const { error } = await supabase
                .from("contact_messages")
                .update({ is_read: true })
                .eq("is_read", false);

            if (error) throw error;
            setUnreadCount(0);
            setNotifications([]);
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    return {
        unreadCount,
        notifications,
        loading,
        markAsRead,
        markAllAsRead,
        refetch: fetchUnreadCount,
    };
};
