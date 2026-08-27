import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  jsonb,
  timestamp,
  pgEnum,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("upload"), // upload, diagram, training, complete
  dataRows: integer("data_rows").default(0),
  variables: jsonb("variables").$type<Variable[]>().default([]),
  causalLinks: jsonb("causal_links").$type<CausalLink[]>().default([]),
  trainedModel: jsonb("trained_model").$type<TrainedModel | null>().default(null),
  results: jsonb("results").$type<ProjectResults | null>().default(null),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Free plan: 24h expiration
});

export const uploadedData = pgTable("uploaded_data", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  filename: text("filename").notNull(),
  data: jsonb("data").$type<Record<string, any>[]>().notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Types for JSON fields
export interface Variable {
  id: string;
  name: string;
  type: 'target' | 'input' | 'mediator' | 'external';
  color: string;
  position?: { x: number; y: number };
  description?: string;
  unit?: string;
  category?: 'production' | 'supply_chain' | 'market' | 'technology' | 'financial';
}

export interface CausalLink {
  id: string;
  source: string;
  target: string;
  strength: number; // 0-100
}

export interface TrainedModel {
  accuracy: number;
  modelType: string;
  trainedAt: string;
  parameters: Record<string, any>;
}

export interface ProjectResults {
  forecast: {
    values: number[];
    dates: string[];
    confidence: { upper: number[]; lower: number[] };
  };
  variableImpact: Record<string, number>;
  correlations: Record<string, Record<string, number>>;
  summary: string;
  metrics: {
    revenueForcast: string;
    modelAccuracy: number;
    causalStrength: number;
  };
}

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertUploadedDataSchema = createInsertSchema(uploadedData).omit({
  id: true,
  uploadedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertUploadedData = z.infer<typeof insertUploadedDataSchema>;
export type UploadedData = typeof uploadedData.$inferSelect;

// Keep existing user schema for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const questionRoleEnum = pgEnum("question_role", [
  "Leadership / executive",
  "Data / analytics",
  "Product / strategy",
  "Researcher / academic",
  "Other",
]);

export const questionStatusEnum = pgEnum("question_status", [
  "new",
  "in_review",
  "answered",
  "published",
  "declined",
]);

export const emailEventTypeEnum = pgEnum("email_event_type", [
  "confirmation",
  "answered_notification",
]);

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    questionText: text("question_text").notNull(),
    email: text("email").notNull(),
    firstName: text("first_name"),
    company: text("company"),
    role: questionRoleEnum("role"),
    keepAnonymous: boolean("keep_anonymous").notNull().default(false),
    marketingConsent: boolean("marketing_consent").notNull().default(false),
    status: questionStatusEnum("status").notNull().default("new"),
    answerText: text("answer_text"),
    answeredAt: timestamp("answered_at"),
    publishedSlug: text("published_slug"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index("questions_status_idx").on(table.status),
    createdAtIdx: index("questions_created_at_idx").on(table.createdAt),
    publishedSlugIdx: uniqueIndex("questions_published_slug_idx").on(table.publishedSlug),
  }),
);

export const emailEvents = pgTable("email_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  type: emailEventTypeEnum("type").notNull(),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
});

export const insertQuestionSchema = z.object({
  questionText: z.string().trim().min(10).max(5000),
  email: z.string().trim().email().max(320),
  firstName: z.string().trim().max(120).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  role: z.enum(questionRoleEnum.enumValues).optional().nullable(),
  keepAnonymous: z.boolean().default(false),
  marketingConsent: z.boolean().default(false),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type EmailEvent = typeof emailEvents.$inferSelect;
