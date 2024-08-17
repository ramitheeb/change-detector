CREATE TABLE IF NOT EXISTS "monitor" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"url" text NOT NULL,
	"name" text NOT NULL,
	"prompt" text NOT NULL,
	"frequencyInMinutes" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitor" ADD CONSTRAINT "monitor_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
