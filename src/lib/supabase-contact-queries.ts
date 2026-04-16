import { supabase } from "./supabase";
import type { ContactPurposeOption, ContactFormSettings, ContactMessage } from "@/types/admin";

// ============ CONTACT PURPOSE OPTIONS ============

export const getContactPurposeOptions = async (onlyActive = false): Promise<ContactPurposeOption[]> => {
    let query = supabase
        .from("contact_purpose_options")
        .select("*")
        .order("order_index", { ascending: true });

    if (onlyActive) {
        query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};

export const createContactPurposeOption = async (
    option: Omit<ContactPurposeOption, "id" | "created_at" | "updated_at">
): Promise<ContactPurposeOption> => {
    const { data, error } = await supabase
        .from("contact_purpose_options")
        .insert([option])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateContactPurposeOption = async (
    id: string,
    option: Partial<ContactPurposeOption>
): Promise<ContactPurposeOption> => {
    const { data, error } = await supabase
        .from("contact_purpose_options")
        .update(option)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const upsertContactPurposeOption = async (
    option: ContactPurposeOption
): Promise<ContactPurposeOption> => {
    const { id, ...rest } = option;
    // Check if ID is a temporary ID or if it belongs to an existing record
    if (id && !id.toString().startsWith("new_purpose_")) {
        return updateContactPurposeOption(id, rest);
    } else {
        const { created_at: _ca, updated_at: _ua, id: _id, ...insertData } = rest as any;
        return createContactPurposeOption(insertData);
    }
};

export const deleteContactPurposeOption = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from("contact_purpose_options")
        .delete()
        .eq("id", id);

    if (error) throw error;
};

// ============ CONTACT FORM SETTINGS ============

export const getContactFormSettings = async (): Promise<ContactFormSettings | null> => {
    const { data, error } = await supabase
        .from("contact_form_settings")
        .select("*")
        .eq("id", 1)
        .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
};

export const updateContactFormSettings = async (
    settings: Partial<ContactFormSettings>
): Promise<ContactFormSettings> => {
    const { data, error } = await supabase
        .from("contact_form_settings")
        .update(settings)
        .eq("id", 1)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ============ CONTACT MESSAGES (Extended) ============

export const getContactMessages = async (purposeFilter?: string): Promise<ContactMessage[]> => {
    let query = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

    if (purposeFilter && purposeFilter !== "all") {
        query = query.eq("purpose", purposeFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};

export const markMessageAsRead = async (id: string, isRead: boolean): Promise<void> => {
    const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: isRead })
        .eq("id", id);

    if (error) throw error;
};

export const deleteContactMessage = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

    if (error) throw error;
};
