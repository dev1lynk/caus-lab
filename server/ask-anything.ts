import { db } from "./db";
import { emailEvents } from "@shared/schema";
import nodemailer from "nodemailer";

const smtpTransporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

interface TeamNotificationInput {
  questionText: string;
  email: string;
  firstName: string | null;
  company: string | null;
  role: string | null;
}

export async function sendTeamNotificationEmail(input: TeamNotificationInput): Promise<boolean> {
  if (!smtpTransporter) {
    console.warn("[email] SMTP not configured, skipping team notification");
    return false;
  }

  const text = [
    `New enquiry from ${input.firstName || "(no name given)"}`,
    `Email: ${input.email}`,
    input.company ? `Company: ${input.company}` : null,
    input.role ? `Role: ${input.role}` : null,
    "",
    "Question:",
    input.questionText,
  ].filter(Boolean).join("\n");

  try {
    await smtpTransporter.sendMail({
      from: process.env.SMTP_USER,
      to: "euston@causlab.com, dennis@causlab.com",
      subject: "New enquiry on causlab.com",
      text,
    });
    return true;
  } catch (error) {
    console.error("[email] Failed to send team notification:", error);
    return false;
  }
}

type EmailType = "confirmation" | "answered_notification";

interface EmailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendQuestionEmail(input: EmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[email fallback]", {
      to: input.to,
      subject: input.subject,
      text: input.text,
    });
    return true;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "CAUS <onboarding@resend.dev>",
        to: [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html || `<p>${input.text.replace(/\n/g, "<br />")}</p>`,
      }),
    });

    if (!response.ok) {
      console.error("[email] Resend rejected email:", response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("[email] Resend request failed:", error);
    return false;
  }
}

export async function sendAndAuditQuestionEmail(
  questionId: string,
  type: EmailType,
  input: EmailInput,
): Promise<boolean> {
  const sent = await sendQuestionEmail(input);
  if (sent && db) {
    await db.insert(emailEvents).values({ questionId, type });
  }
  return sent;
}