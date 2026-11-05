import { NextResponse } from "next/server";

import {
  clientIpFromHeaders,
  createRateLimiter,
  escapeHtml,
  validateContactPayload,
} from "@/lib/contact-form";

// Module-level so the counter survives across warm invocations of one instance.
const allowSubmission = createRateLimiter();

export async function POST(request: Request) {
  if (!allowSubmission(clientIpFromHeaders(request.headers))) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions, please try again later" },
      { status: 429 },
    );
  }

  const formData = await request.formData();
  const payload = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    company: formData.get("company")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    submittedAt: new Date().toISOString(),
  };

  // Validate required fields, size caps and email shape
  const validationError = validateContactPayload(payload);
  if (validationError) {
    return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.VELOCITY_CONTACT_EMAIL ?? "hello@velocity-builders.com";

  let delivered = false;

  // Option 1: Make.com / Zapier webhook
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "velocity-builders-website", ...payload }),
      });
      if (res.ok) delivered = true;
      else console.error("Webhook delivery failed:", res.status, await res.text());
    } catch (err) {
      console.error("Webhook error:", err);
    }
  }

  // Option 2: Resend email API
  if (!delivered && resendKey) {
    const safe = {
      name: escapeHtml(payload.name),
      email: escapeHtml(payload.email),
      company: escapeHtml(payload.company || "—"),
      message: escapeHtml(payload.message).replace(/\r?\n/g, "<br />"),
    };
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Velocity Builders <noreply@velocity-builders.com>",
          to: [contactEmail],
          subject: `New Contact Form: ${payload.name} — ${payload.company || "No company"}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${safe.name}</p>
            <p><strong>Email:</strong> ${safe.email}</p>
            <p><strong>Company:</strong> ${safe.company}</p>
            <p><strong>Message:</strong></p>
            <p>${safe.message}</p>
            <hr />
            <p style="color: #666; font-size: 12px;">Submitted ${payload.submittedAt}</p>
          `,
          text: [
            "New Contact Form Submission",
            "",
            `Name: ${payload.name}`,
            `Email: ${payload.email}`,
            `Company: ${payload.company || "—"}`,
            "",
            "Message:",
            payload.message,
            "",
            `Submitted ${payload.submittedAt}`,
          ].join("\n"),
        }),
      });
      if (res.ok) delivered = true;
      else console.error("Resend delivery failed:", res.status, await res.text());
    } catch (err) {
      console.error("Resend error:", err);
    }
  }

  // Fallback: structured log (visible in Vercel function logs)
  if (!delivered) {
    console.warn(
      "⚠️ CONTACT FORM — No delivery method configured. Set CONTACT_WEBHOOK_URL or RESEND_API_KEY.",
      JSON.stringify(payload, null, 2)
    );
  }

  // Always return success to the user — submission is captured in logs at minimum
  return NextResponse.json({ ok: true, delivered });
}
