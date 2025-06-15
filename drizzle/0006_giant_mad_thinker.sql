ALTER TABLE "academic_subjects" ALTER COLUMN "board_university_id_fk" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "academic_subjects" ADD COLUMN "passing_marks" integer;--> statement-breakpoint
ALTER TABLE "academic_subjects" ADD CONSTRAINT "academic_subjects_board_university_id_fk_board_universities_id_fk" FOREIGN KEY ("board_university_id_fk") REFERENCES "public"."board_universities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_universities" DROP COLUMN "passing_marks";