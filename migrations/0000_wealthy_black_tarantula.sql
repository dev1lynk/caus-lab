CREATE TYPE "public"."email_event_type" AS ENUM('confirmation', 'answered_notification');--> statement-breakpoint
CREATE TYPE "public"."question_role" AS ENUM('Leadership / executive', 'Data / analytics', 'Product / strategy', 'Researcher / academic', 'Other');--> statement-breakpoint
CREATE TYPE "public"."question_status" AS ENUM('new', 'in_review', 'answered', 'published', 'declined');--> statement-breakpoint
CREATE TABLE "email_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"type" "email_event_type" NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'upload' NOT NULL,
	"data_rows" integer DEFAULT 0,
	"variables" jsonb DEFAULT '[]'::jsonb,
	"causal_links" jsonb DEFAULT '[]'::jsonb,
	"trained_model" jsonb DEFAULT 'null'::jsonb,
	"results" jsonb DEFAULT 'null'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_text" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"company" text,
	"role" "question_role",
	"keep_anonymous" boolean DEFAULT false NOT NULL,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"status" "question_status" DEFAULT 'new' NOT NULL,
	"answer_text" text,
	"answered_at" timestamp,
	"published_slug" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploaded_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"filename" text NOT NULL,
	"data" jsonb NOT NULL,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "questions_status_idx" ON "questions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "questions_created_at_idx" ON "questions" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "questions_published_slug_idx" ON "questions" USING btree ("published_slug");