CREATE TABLE "admission_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_id_fk" integer NOT NULL,
	"course_id_fk" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"remarks" text
);
--> statement-breakpoint
ALTER TABLE "admission_course_applications" DROP CONSTRAINT "admission_course_applications_course_id_fk_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "admission_course_applications" ADD COLUMN "admission_course_id_fk" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "amount" integer;--> statement-breakpoint
ALTER TABLE "admission_courses" ADD CONSTRAINT "admission_courses_admission_id_fk_admissions_id_fk" FOREIGN KEY ("admission_id_fk") REFERENCES "public"."admissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_courses" ADD CONSTRAINT "admission_courses_course_id_fk_courses_id_fk" FOREIGN KEY ("course_id_fk") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_course_applications" ADD CONSTRAINT "admission_course_applications_admission_course_id_fk_admission_courses_id_fk" FOREIGN KEY ("admission_course_id_fk") REFERENCES "public"."admission_courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_course_applications" DROP COLUMN "course_id_fk";