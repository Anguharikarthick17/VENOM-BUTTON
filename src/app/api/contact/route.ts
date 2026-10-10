import { NextRequest, NextResponse } from "next/server";
import {
  checkDuplicateInquiry,
  saveInquiryToDatabase,
  InquiryRecord,
} from "@/lib/db";

export interface ContactInquiryPayload {
  name: string;
  email: string;
  company?: string;
  service: string;
  budget: string;
  timeline: string;
  description: string;
}

async function sendEmailNotification(
  inquiryId: string,
  data: ContactInquiryPayload
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL_TO || "contact@genzlog.com";
  const fromEmail = process.env.CONTACT_EMAIL_FROM || "inquiries@genzlog.com";

  if (!apiKey) {
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: data.email,
        subject: `[GENZLOG Lead ${inquiryId}] ${data.service} — ${data.name} (${data.budget})`,
        text: `New GENZLOG Project Inquiry\n\nInquiry ID: ${inquiryId}\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || "N/A"}\nService: ${data.service}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\n\nProject Requirements:\n${data.description}\n\nTimestamp: ${new Date().toISOString()}`,
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("[Contact API] Resend email dispatch error:", err);
    return false;
  }
}

async function sendWebhookNotification(
  inquiryId: string,
  data: ContactInquiryPayload
): Promise<boolean> {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) return false;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🚀 *New GENZLOG Inquiry* \`${inquiryId}\`\n*Client:* ${data.name} (${data.email})\n*Company:* ${data.company || "N/A"}\n*Service:* ${data.service}\n*Budget:* ${data.budget}\n*Timeline:* ${data.timeline}\n*Notes:* ${data.description}`,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[Contact API] Webhook dispatch error:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactInquiryPayload = await req.json();

    // 1. Rigorous Server-side Input Validation
    const errors: Record<string, string> = {};
    if (!body.name || !body.name.trim()) {
      errors.name = "Full name is required";
    } else if (body.name.trim().length > 100) {
      errors.name = "Full name cannot exceed 100 characters";
    }

    if (!body.email || !body.email.trim()) {
      errors.email = "Email address is required";
    } else if (body.email.trim().length > 120) {
      errors.email = "Email address cannot exceed 120 characters";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
      errors.email = "A valid email address is required";
    }

    if (!body.description || !body.description.trim()) {
      errors.description = "Project description is required";
    } else if (body.description.trim().length < 10) {
      errors.description = "Please provide at least 10 characters describing your project";
    } else if (body.description.trim().length > 3000) {
      errors.description = "Project description cannot exceed 3,000 characters";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          persisted: false,
          emailSent: false,
          message: "Please correct the errors in the form.",
          errors,
        },
        { status: 400 }
      );
    }

    // 2. Duplicate Detection
    const dupCheck = await checkDuplicateInquiry(body.email, body.description);
    if (dupCheck.isDuplicate && dupCheck.existingId) {
      return NextResponse.json(
        {
          success: true,
          inquiryId: dupCheck.existingId,
          persisted: true,
          duplicate: true,
          emailSent: false,
          message: `A recent inquiry with these exact details is already registered (ID: ${dupCheck.existingId}). We will contact you within 24 hours.`,
        },
        { status: 200 }
      );
    }

    // 3. Prepare Inquiry Record
    const inquiryId = `GZ-${Date.now().toString(36).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const record: InquiryRecord = {
      id: inquiryId,
      name: body.name.trim(),
      email: body.email.trim(),
      company: body.company ? body.company.trim() : null,
      service: body.service || "Business Website",
      budget: body.budget || "₹10,000–₹15,000 (Basic Business Website)",
      timeline: body.timeline || "2–4 Weeks (Standard)",
      description: body.description.trim(),
      created_at: timestamp,
      user_agent: req.headers.get("user-agent") || "unknown",
      ip: req.headers.get("x-forwarded-for") || "unknown",
    };

    // 4. Persist to Hosted Database
    const saveResult = await saveInquiryToDatabase(record);

    if (!saveResult.success) {
      console.error("[Contact API] Database storage failure:", saveResult.error);
      return NextResponse.json(
        {
          success: false,
          persisted: false,
          emailSent: false,
          message:
            "Our inquiry server was temporarily unable to record your submission. Please email us directly at contact@genzlog.com.",
        },
        { status: 500 }
      );
    }

    // 5. Separate Delivery Mechanism: Email & Webhook
    // Note: Email failure MUST NOT delete or alter the successfully stored inquiry
    let emailSent = false;
    try {
      const [emailStatus] = await Promise.all([
        sendEmailNotification(inquiryId, body),
        sendWebhookNotification(inquiryId, body),
      ]);
      emailSent = emailStatus;
    } catch (deliveryErr) {
      console.warn("[Contact API] Notification delivery error (inquiry safely preserved in DB):", deliveryErr);
    }

    let message = "Inquiry saved securely! Our team reviews incoming project leads daily.";
    if (emailSent) {
      message = "Inquiry registered! Saved in database and email notification delivered to our team.";
    }

    return NextResponse.json(
      {
        success: true,
        inquiryId,
        persisted: true,
        emailSent,
        provider: saveResult.provider,
        message,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Contact API] Unexpected internal error:", err);
    return NextResponse.json(
      {
        success: false,
        persisted: false,
        emailSent: false,
        message: "An internal server error occurred. Please contact contact@genzlog.com.",
      },
      { status: 500 }
    );
  }
}
