ALTER TABLE "monitor-event" DROP CONSTRAINT "monitor-event_monitorId_monitor_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitor-event" ADD CONSTRAINT "monitor-event_monitorId_monitor_id_fk" FOREIGN KEY ("monitorId") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
