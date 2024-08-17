ALTER TABLE "monitor-event" ADD COLUMN "data_changed" boolean;--> statement-breakpoint
ALTER TABLE "monitor-event" ADD COLUMN "data" jsonb;--> statement-breakpoint
ALTER TABLE "monitor-event" ADD COLUMN "previous_data" jsonb;--> statement-breakpoint
ALTER TABLE "monitor-event" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;