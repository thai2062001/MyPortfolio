import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "npm:resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("FROM_EMAIL") ?? Deno.env.get("RESEND_FROM_EMAIL");
    const toEmail = Deno.env.get("TO_EMAIL") ?? Deno.env.get("ADMIN_EMAIL");
    const fromName = Deno.env.get("RESEND_FROM_NAME") ?? "Portfolio Contact";

    if (!resendApiKey || !fromEmail || !toEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required email secrets: RESEND_API_KEY, FROM_EMAIL, TO_EMAIL" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const payload = await req.json();
    const name = String(payload?.name ?? "").trim();
    const email = String(payload?.email ?? "").trim();
    const company = payload?.company ? String(payload.company).trim() : "";
    const purpose = payload?.purpose ? String(payload.purpose).trim() : "";
    const subject = payload?.subject ? String(payload.subject).trim() : "";
    const message = String(payload?.message ?? "").trim();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "name, email, and message are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(resendApiKey);
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company);
    const safePurpose = escapeHtml(purpose);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
    const emailSubject = `New Contact Message from ${name}`;

    const { error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: emailSubject,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        ${safeCompany ? `<p><strong>Company:</strong> ${safeCompany}</p>` : ""}
        ${safePurpose ? `<p><strong>Purpose:</strong> ${safePurpose}</p>` : ""}
        ${safeSubject ? `<p><strong>Subject:</strong> ${safeSubject}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unexpected error",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
