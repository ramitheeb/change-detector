DO $$ BEGIN
 CREATE TYPE "public"."monitorEvent" AS ENUM('monitor-run');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monitor-event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event" "monitorEvent" NOT NULL,
	"monitorId" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitor-event" ADD CONSTRAINT "monitor-event_monitorId_monitor_id_fk" FOREIGN KEY ("monitorId") REFERENCES "public"."monitor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
