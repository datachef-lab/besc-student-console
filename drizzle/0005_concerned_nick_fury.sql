ALTER TABLE "admissions" ALTER COLUMN "start_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "admissions" ALTER COLUMN "last_date" DROP NOT NULL;