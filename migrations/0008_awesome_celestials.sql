DO $$ BEGIN
 CREATE TYPE "public"."monitorModel" AS ENUM('gpt-4o-mini-2024-07-18', 'gpt-4o-2024-05-13', 'claude-3-haiku-20240307', 'claude-3-5-sonnet-20240620');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "monitor" ADD COLUMN "model" "monitorModel" DEFAULT 'gpt-4o-mini-2024-07-18' NOT NULL;