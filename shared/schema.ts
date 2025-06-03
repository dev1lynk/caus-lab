import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
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
