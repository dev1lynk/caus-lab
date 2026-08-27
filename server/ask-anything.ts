import type { Express, Request, Response } from "express";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import {
  insertQuestionSchema,
  questions,
  type Question,
} from "@shared/schema";
import { db } from "./db";
import { sendAndAuditQuestionEmail } from "./email";
import { z } from "zod";

const questionStatuses = ["new", "in_review", "answered", "published", "declined"] as const;
const questionStatusSchema = z.enum(questionStatuses);
const adminCookieName = "caus_admin_session";
const adminSessionDurationMs = 8 * 60 * 60 * 1000;
const submissionWindowMs = 60 * 60 * 1000;
const maxSubmissionsPerWindow = 5;

const submissionTimestamps = new Map<string, number[]>();
let publishedCache: { expiresAt: number; questions: PublicQuestion[] } | null = null;

export interface PublicQuestion {
  id: string;
  questionText: string;
  firstName: string | null;
  company: string | null;
  keepAnonymous: boolean;
  answerText: string;
  publishedSlug: string;
  createdAt: string;
}

function publicQuestion(question: Question): PublicQuestion {
  return {
    id: question.id,
    questionText: question.questionText,
    firstName: question.keepAnonymous ? null : question.firstName,
    company: question.keepAnonymous ? null : question.company,
    keepAnonymous: question.keepAnonymous,
    answerText: question.answerText || "",
    publishedSlug: question.publishedSlug || "",
    createdAt: (question.createdAt || new Date()).toISOString(),
  };
}

function getCookie(req: Request, name: string): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookie = cookieHeader.split(";").find((part) => part.trim().startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.trim().slice(name.length + 1)) : null;
}

function sessionSignature(timestamp: string): string {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "caus-dev-session-secret";
  return createHmac("sha256", secret).update(timestamp).digest("hex");
}

function isAdminAuthenticated(req: Request): boolean {
  const value = getCookie(req, adminCookieName);
  if (!value) return false;
  const [timestamp, signature] = value.split(".");
  if (!timestamp || !signature || !/^\d+$/.test(timestamp)) return false;
  if (Date.now() - Number(timestamp) > adminSessionDurationMs) return false;

  const expected = sessionSignature(timestamp);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length
    && timingSafeEqual(actualBuffer, expectedBuffer);
}

function setAdminCookie(res: Response): void {
  const timestamp = String(Date.now());
  const value = encodeURIComponent(`${timestamp}.${sessionSignature(timestamp)}`);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${adminCookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${adminSessionDurationMs / 1000}${secure}`,
  );
}

function clearAdminCookie(res: Response): void {
  res.setHeader(
    "Set-Cookie",
    `${adminCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  );
}

function requireAdmin(req: Request, res: Response): boolean {
  if (!isAdminAuthenticated(req)) {
    res.status(401).json({ message: "Admin authentication required" });
    return false;
  }
  return true;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissionTimestamps.get(ip) || []).filter(
    (timestamp) => now - timestamp < submissionWindowMs,
  );
  if (recent.length >= maxSubmissionsPerWindow) {
    submissionTimestamps.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissionTimestamps.set(ip, recent);
  return false;
}

function makeSlugBase(questionText: string): string {
  const normalized = questionText
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .toLowerCase()
    .trim();
  const words = normalized.split(/\s+/).filter(Boolean).slice(0, 8);
  return words.join("-").replace(/-+/g, "-").slice(0, 70) || "causal-ai-question";
}

async function createPublishedSlug(questionText: string): Promise<string> {
  if (!db) throw new Error("DATABASE_URL is not configured");
  const base = makeSlugBase(questionText);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const slug = `${base}-${randomBytes(3).toString("hex")}`;
    const existing = await db
      .select({ id: questions.id })
      .from(questions)
      .where(eq(questions.publishedSlug, slug))
      .limit(1);
    if (existing.length === 0) return slug;
  }

  return `${base}-${Date.now().toString(36)}`;
}

function clearPublishedCache(): void {
  publishedCache = null;
}

function isAllowedStatusTransition(from: Question["status"], to: Question["status"]): boolean {
  if (to === "declined" || from === to) return true;
  const nextStatuses: Record<Question["status"], Question["status"][]> = {
    new: ["in_review"],
    in_review: ["answered"],
    answered: ["published"],
    published: [],
    declined: ["new"],
  };
  return nextStatuses[from].includes(to);
}

export function registerAskAnythingRoutes(app: Express): void {
  app.post("/api/questions", async (req, res) => {
    if (!db) {
      return res.status(503).json({ message: "Question service is not configured yet" });
    }

    if (req.body?.website) {
      return res.status(400).json({ message: "Unable to submit question" });
    }

    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (isRateLimited(ip)) {
      return res.status(429).json({
        message: "We've received a lot of questions from this connection. Please try again later.",
      });
    }

    try {
      const input = insertQuestionSchema.parse({
        questionText: req.body?.questionText,
        email: req.body?.email,
        firstName: req.body?.firstName || "",
        company: req.body?.company || "",
        role: req.body?.role || null,
        keepAnonymous: Boolean(req.body?.keepAnonymous),
        marketingConsent: Boolean(req.body?.marketingConsent),
      });

      const [question] = await db
        .insert(questions)
        .values({
          ...input,
          firstName: input.firstName || null,
          company: input.company || null,
        })
        .returning();

      await sendAndAuditQuestionEmail(question.id, "confirmation", {
        to: question.email,
        subject: "We've got your question — CAUS",
        text: "We've got your question — we read every one personally and will follow up if it's a good fit for a public answer.\n\nYour question:\n" + question.questionText,
      });

      return res.status(201).json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Please check the highlighted fields.",
          fieldErrors: error.flatten().fieldErrors,
        });
      }
      console.error("[ask] failed to save question:", error);
      return res.status(500).json({ message: "We couldn't save your question. Please try again." });
    }
  });

  app.get("/api/questions", async (_req, res) => {
    if (!db) {
      return res.status(503).json({ message: "Question service is not configured yet" });
    }

    try {
      if (publishedCache && publishedCache.expiresAt > Date.now()) {
        return res.json(publishedCache.questions);
      }

      const rows = await db
        .select()
        .from(questions)
        .where(eq(questions.status, "published"))
        .orderBy(desc(questions.createdAt));
      const publicRows = rows.map(publicQuestion);
      publishedCache = { expiresAt: Date.now() + 60_000, questions: publicRows };
      return res.json(publicRows);
    } catch (error) {
      console.error("[questions] failed to list published questions:", error);
      return res.status(500).json({ message: "Unable to load published questions" });
    }
  });

  app.get("/api/questions/:slug", async (req, res) => {
    if (!db) {
      return res.status(503).json({ message: "Question service is not configured yet" });
    }

    try {
      const [question] = await db
        .select()
        .from(questions)
        .where(and(eq(questions.publishedSlug, req.params.slug), eq(questions.status, "published")))
        .limit(1);
      if (!question) return res.status(404).json({ message: "Question not found" });
      return res.json(publicQuestion(question));
    } catch (error) {
      console.error("[questions] failed to load question:", error);
      return res.status(500).json({ message: "Unable to load this question" });
    }
  });

  app.post("/api/admin/login", (req, res) => {
    const configuredPassword = process.env.ADMIN_PASSWORD;
    if (!configuredPassword) {
      return res.status(503).json({ message: "ADMIN_PASSWORD is not configured" });
    }

    const submittedPassword = typeof req.body?.password === "string" ? req.body.password : "";
    const submittedBuffer = Buffer.from(submittedPassword);
    const configuredBuffer = Buffer.from(configuredPassword);
    const valid = submittedBuffer.length === configuredBuffer.length
      && timingSafeEqual(submittedBuffer, configuredBuffer);
    if (!valid) return res.status(401).json({ message: "Incorrect password" });

    setAdminCookie(res);
    return res.json({ authenticated: true });
  });

  app.get("/api/admin/session", (req, res) => {
    res.json({ authenticated: isAdminAuthenticated(req) });
  });

  app.post("/api/admin/logout", (req, res) => {
    clearAdminCookie(res);
    res.json({ authenticated: false });
  });

  app.get("/api/admin/questions", async (req, res) => {
    if (!requireAdmin(req, res) || !db) return;

    const status = typeof req.query.status === "string" ? req.query.status : "all";
    if (status !== "all" && !questionStatuses.includes(status as typeof questionStatuses[number])) {
      return res.status(400).json({ message: "Invalid status filter" });
    }

    try {
      const rows = status === "all"
        ? await db.select().from(questions).orderBy(desc(questions.createdAt))
        : await db.select().from(questions).where(eq(questions.status, status as typeof questionStatuses[number])).orderBy(desc(questions.createdAt));
      return res.json(rows);
    } catch (error) {
      console.error("[admin] failed to list questions:", error);
      return res.status(500).json({ message: "Unable to load admin questions" });
    }
  });

  app.patch("/api/admin/questions/:id", async (req, res) => {
    if (!requireAdmin(req, res) || !db) return;

    const updateSchema = z.object({
      status: questionStatusSchema,
      answerText: z.string().max(10000).optional().nullable(),
    });

    try {
      const input = updateSchema.parse(req.body);
      const [existing] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, req.params.id))
        .limit(1);
      if (!existing) return res.status(404).json({ message: "Question not found" });
      if (!isAllowedStatusTransition(existing.status, input.status)) {
        return res.status(400).json({ message: `Questions can’t move directly from ${existing.status.replace("_", " ")} to ${input.status.replace("_", " ")}.` });
      }

      const answerText = input.answerText?.trim() || null;
      if ((input.status === "answered" || input.status === "published") && !answerText && !existing.answerText) {
        return res.status(400).json({ message: "Add an answer before using this status." });
      }

      const enteringAnswered = input.status === "answered" && existing.status !== "answered";
      const enteringPublished = input.status === "published" && existing.status !== "published";
      const publishedSlug = input.status === "published"
        ? existing.publishedSlug || await createPublishedSlug(existing.questionText)
        : existing.publishedSlug;

      const [updated] = await db
        .update(questions)
        .set({
          status: input.status,
          answerText: answerText || existing.answerText,
          answeredAt: enteringAnswered ? new Date() : existing.answeredAt,
          publishedSlug,
        })
        .where(eq(questions.id, req.params.id))
        .returning();

      if (enteringAnswered && updated.answerText) {
        await sendAndAuditQuestionEmail(updated.id, "answered_notification", {
          to: updated.email,
          subject: "An answer to your CAUS question",
          text: `Thanks for asking CAUS.\n\nYour question:\n${updated.questionText}\n\nOur answer:\n${updated.answerText}`,
        });
      }
      if (enteringPublished) clearPublishedCache();
      return res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid question update", fieldErrors: error.flatten().fieldErrors });
      }
      console.error("[admin] failed to update question:", error);
      return res.status(500).json({ message: "Unable to update question" });
    }
  });
}