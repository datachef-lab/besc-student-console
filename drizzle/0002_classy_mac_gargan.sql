CREATE TYPE "public"."sports_level" AS ENUM('NATIONAL', 'STATE', 'DISTRICT', 'OTHERS');--> statement-breakpoint
CREATE TABLE "sports_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sports_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"additional_info_id_fk" integer NOT NULL,
	"sports_category_id_fk" integer NOT NULL,
	"level" "sports_level" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "admission_general_info" DROP CONSTRAINT "admission_general_info_degree_id_fk_degree_id_fk";
--> statement-breakpoint
ALTER TABLE "admission_academic_info" ADD COLUMN "roll_number" varchar(255);--> statement-breakpoint
ALTER TABLE "admission_academic_info" ADD COLUMN "school_number" varchar(255);--> statement-breakpoint
ALTER TABLE "admission_academic_info" ADD COLUMN "center_number" varchar(255);--> statement-breakpoint
ALTER TABLE "admission_academic_info" ADD COLUMN "admit_card_id" varchar(255);--> statement-breakpoint
ALTER TABLE "admission_general_info" ADD COLUMN "degreeLevel" "degree_level_type" DEFAULT 'UNDER_GRADUATE' NOT NULL;--> statement-breakpoint
ALTER TABLE "admission_general_info" ADD COLUMN "residence_of_kolkata" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "sports_info" ADD CONSTRAINT "sports_info_additional_info_id_fk_admission_additional_info_id_fk" FOREIGN KEY ("additional_info_id_fk") REFERENCES "public"."admission_additional_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sports_info" ADD CONSTRAINT "sports_info_sports_category_id_fk_sports_categories_id_fk" FOREIGN KEY ("sports_category_id_fk") REFERENCES "public"."sports_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_academic_info" DROP COLUMN "uid";--> statement-breakpoint
ALTER TABLE "admission_academic_info" DROP COLUMN "index_number";--> statement-breakpoint
ALTER TABLE "admission_general_info" DROP COLUMN "degree_id_fk";--> statement-breakpoint
ALTER TABLE "public"."admission_additional_info" ALTER COLUMN "department_of_staff_parent" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."college_department";--> statement-breakpoint
CREATE TYPE "public"."college_department" AS ENUM('The Bhawanipur Design Academy', 'The Bhawanipur Education Society College', 'The Bhawanipur Gujarati Education Society', 'The Bhawanipur Gujarati Education Society School-ICSE', 'The Bhawanipur Gujarati Education Society School-ISC');--> statement-breakpoint
ALTER TABLE "public"."admission_additional_info" ALTER COLUMN "department_of_staff_parent" SET DATA TYPE "public"."college_department" USING "department_of_staff_parent"::"public"."college_department";--> statement-breakpoint
ALTER TABLE "public"."admission_academic_info" ALTER COLUMN "stream_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."stream_type";--> statement-breakpoint
CREATE TYPE "public"."stream_type" AS ENUM('SCIENCE', 'COMMERCE', 'HUMANITIES');--> statement-breakpoint
ALTER TABLE "public"."admission_academic_info" ALTER COLUMN "stream_type" SET DATA TYPE "public"."stream_type" USING "stream_type"::"public"."stream_type";