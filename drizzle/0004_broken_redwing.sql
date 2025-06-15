ALTER TABLE "admissions" ALTER COLUMN "start_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "admissions" ALTER COLUMN "start_date" DROP NOT NULL;