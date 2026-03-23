CREATE TYPE "public"."doc_status" AS ENUM('RECEIVED', 'IN_REVIEW', 'IN_PROCESS', 'APPROVED', 'REJECTED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."doc_type" AS ENUM('VISA', 'KITAS', 'PASSPORT');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('STAFF', 'ADMIN');--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resi_number" varchar(255) NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"type" "doc_type" NOT NULL,
	"status" "doc_status" DEFAULT 'RECEIVED' NOT NULL,
	"file_url" text NOT NULL,
	"staff_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "documents_resi_number_unique" UNIQUE("resi_number")
);
--> statement-breakpoint
CREATE TABLE "tracking_histories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"status" "doc_status" NOT NULL,
	"description" text,
	"changed_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" "role" DEFAULT 'STAFF' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_staff_id_users_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_histories" ADD CONSTRAINT "tracking_histories_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;