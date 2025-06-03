CREATE TYPE "public"."admission_form_status" AS ENUM('DRAFT', 'PAYMENT_DUE', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'WAITING_FOR_APPROVAL', 'WAITING_FOR_PAYMENT', 'WAITING_FOR_DOCUMENTS', 'DOCUMENTS_VERIFIED', 'DOCUMENTS_PENDING', 'DOCUMENTS_REJECTED');--> statement-breakpoint
CREATE TYPE "public"."admission_steps" AS ENUM('GENERAL_INFORMATION', 'ACADEMIC_INFORMATION', 'COURSE_APPLICATION', 'ADDITIONAL_INFORMATION', 'DOCUMENTS', 'PAYMENT', 'REVIEW', 'SUBMITTED');--> statement-breakpoint
CREATE TYPE "public"."board_result_status_type" AS ENUM('PASS', 'FAIL IN THEORY', 'FAIL IN PRACTICAL', 'FAIL');--> statement-breakpoint
CREATE TYPE "public"."board_result_type" AS ENUM('FAIL', 'PASS');--> statement-breakpoint
CREATE TYPE "public"."class_type" AS ENUM('YEAR', 'SEMESTER');--> statement-breakpoint
CREATE TYPE "public"."college_department" AS ENUM('IT', 'LIBRARY', 'ADMINISTRATION', 'HUMAN_RESOURCES', 'MARKETING', 'RESEARCH', 'COMMUNICATION', 'FINANCE', 'LEGAL', 'OPERATIONS', 'SALES', 'CUSTOMER_SERVICE');--> statement-breakpoint
CREATE TYPE "public"."community_type" AS ENUM('GUJARATI', 'NON-GUJARATI');--> statement-breakpoint
CREATE TYPE "public"."degree_level_type" AS ENUM('SECONDARY', 'HIGHER_SECONDARY', 'UNDER_GRADUATE', 'POST_GRADUATE');--> statement-breakpoint
CREATE TYPE "public"."degree_programme_type" AS ENUM('HONOURS', 'GENERAL');--> statement-breakpoint
CREATE TYPE "public"."disability_type" AS ENUM('VISUAL', 'HEARING_IMPAIRMENT', 'VISUAL_IMPAIRMENT', 'ORTHOPEDIC', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."framework_type" AS ENUM('CCF', 'CBCS');--> statement-breakpoint
CREATE TYPE "public"."gender_type" AS ENUM('MALE', 'FEMALE', 'TRANSGENDER');--> statement-breakpoint
CREATE TYPE "public"."locality_type" AS ENUM('RURAL', 'URBAN');--> statement-breakpoint
CREATE TYPE "public"."marksheet_source" AS ENUM('FILE_UPLOAD', 'ADDED');--> statement-breakpoint
CREATE TYPE "public"."paper_mode_type" AS ENUM('THEORETICAL', 'PRACTICAL', 'VIVA', 'ASSIGNMENT', 'PROJECT', 'MCQ');--> statement-breakpoint
CREATE TYPE "public"."parent_type" AS ENUM('BOTH', 'FATHER_ONLY', 'MOTHER_ONLY');--> statement-breakpoint
CREATE TYPE "public"."payment_mode" AS ENUM('UPI', 'WALLET', 'NET_BANKING', 'CREDIT_CARD', 'DEBIT_CARD', 'PAYTM_BALANCE');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."person_title_type" AS ENUM('MR', 'MRS', 'MS', 'DR', 'PROF', 'REV', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."place_of_stay_type" AS ENUM('OWN', 'HOSTEL', 'FAMILY_FRIENDS', 'PAYING_GUEST', 'RELATIVES');--> statement-breakpoint
CREATE TYPE "public"."stream_type" AS ENUM('SCIENCE', 'COMMERCE', 'ARTS');--> statement-breakpoint
CREATE TYPE "public"."subject_category_type" AS ENUM('SPECIAL', 'COMMON', 'HONOURS', 'GENERAL', 'ELECTIVE');--> statement-breakpoint
CREATE TYPE "public"."subject_status" AS ENUM('PASS', 'FAIL', 'P', 'F', 'F(IN)', 'F(PR)', 'F(TH)');--> statement-breakpoint
CREATE TYPE "public"."transport_type" AS ENUM('BUS', 'TRAIN', 'METRO', 'AUTO', 'TAXI', 'CYCLE', 'WALKING', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('ADMIN', 'STUDENT', 'TEACHER');--> statement-breakpoint
CREATE TABLE "academic_subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"board_university_id_fk" integer,
	"name" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "address" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_id_fk" integer,
	"state_id_fk" integer,
	"city_id_fk" integer,
	"address_line" varchar(1000),
	"landmark" varchar(255),
	"locality_type" "locality_type",
	"phone" varchar(255),
	"pincode" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admission_academic_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_form_id_fk" integer NOT NULL,
	"board_university_id_fk" integer NOT NULL,
	"board_result_status" "board_result_status_type" NOT NULL,
	"uid" varchar(255),
	"index_number" varchar(255),
	"institute_id_fk" integer NOT NULL,
	"other_institute" varchar(500),
	"language_medium_id_fk" integer NOT NULL,
	"year_of_passing" integer NOT NULL,
	"stream_type" "stream_type" NOT NULL,
	"is_registered_for_ug_in_cu" boolean DEFAULT false,
	"cu_registration_number" varchar(255),
	"previously_registered_course_id_fk" integer,
	"other_previously_registered_course" varchar(500),
	"previous_college_id_fk" integer,
	"other_college" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admission_additional_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"alternate_mobile_number" varchar(255),
	"blood_group_id_fk" integer NOT NULL,
	"religion_id_fk" integer NOT NULL,
	"category_id_fk" integer NOT NULL,
	"is_physically_challenged" boolean DEFAULT false,
	"disability_type" "disability_type",
	"is_single_parent" boolean DEFAULT false,
	"father_title" "person_title_type",
	"father_name" varchar(255),
	"mother_title" "person_title_type",
	"mother_name" varchar(255),
	"is_either_parent_staff" boolean DEFAULT false,
	"name_of_staff_parent" varchar(255),
	"department_of_staff_parent" "college_department",
	"has_smartphone" boolean DEFAULT false,
	"has_laptop_or_desktop" boolean DEFAULT false,
	"has_internet_access" boolean DEFAULT false,
	"annual_income_id_fk" integer NOT NULL,
	"apply_under_ncc_category" boolean DEFAULT false,
	"apply_under_sports_category" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admission_course_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_form_id_fk" integer NOT NULL,
	"course_id_fk" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admission_general_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_form_id_fk" integer NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"middle_name" varchar(255),
	"last_name" varchar(255),
	"date_of_birth" date NOT NULL,
	"nationality_id_fk" integer,
	"other_nationality" varchar(255),
	"is_gujarati" boolean DEFAULT false,
	"category_id_fk" integer,
	"religion_id_fk" integer,
	"gender" "gender_type" DEFAULT 'MALE',
	"degree_id_fk" integer,
	"password" varchar(255) NOT NULL,
	"whatsapp_number" varchar(15),
	"mobile_number" varchar(15) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"remarks" text
);
--> statement-breakpoint
CREATE TABLE "annual_incomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"range" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_id_fk" integer NOT NULL,
	"form_status" "admission_form_status" NOT NULL,
	"admission_step" "admission_steps" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"remarks" text
);
--> statement-breakpoint
CREATE TABLE "blood_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blood_group_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "board_universities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(700) NOT NULL,
	"degree_id" integer,
	"passing_marks" integer,
	"code" varchar(255),
	"address_id_fk" integer,
	"sequence" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "board_universities_name_unique" UNIQUE("name"),
	CONSTRAINT "board_universities_sequence_unique" UNIQUE("sequence")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"document_required" boolean,
	"code" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"document_required" boolean DEFAULT false NOT NULL,
	"code" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cities_name_unique" UNIQUE("name"),
	CONSTRAINT "cities_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "colleges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(500) NOT NULL,
	"code" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"sequence" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "countries_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(500) NOT NULL,
	"short_name" varchar(500),
	"code_prefix" varchar(10),
	"university_code" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "degree" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"level" "degree_level_type",
	"sequence" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "degree_name_unique" UNIQUE("name"),
	CONSTRAINT "degree_sequence_unique" UNIQUE("sequence")
);
--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(700) NOT NULL,
	"degree_id" integer NOT NULL,
	"address_id" integer,
	"sequence" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "institutions_name_unique" UNIQUE("name"),
	CONSTRAINT "institutions_sequence_unique" UNIQUE("sequence")
);
--> statement-breakpoint
CREATE TABLE "language_medium" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "language_medium_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "nationality" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"sequence" integer,
	"code" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "nationality_sequence_unique" UNIQUE("sequence")
);
--> statement-breakpoint
CREATE TABLE "occupations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "occupations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_form_id_fk" integer NOT NULL,
	"order_id" varchar(100) NOT NULL,
	"transaction_id" varchar(100),
	"amount" numeric(10, 2) NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"payment_mode" "payment_mode",
	"bank_txn_id" varchar(100),
	"gateway_name" varchar(50),
	"txn_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"remarks" text
);
--> statement-breakpoint
CREATE TABLE "religion" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"sequence" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "religion_name_unique" UNIQUE("name"),
	CONSTRAINT "religion_sequence_unique" UNIQUE("sequence")
);
--> statement-breakpoint
CREATE TABLE "states" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "states_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "streams" (
	"id" serial PRIMARY KEY NOT NULL,
	"framework" "framework_type",
	"degree_id_fk" integer NOT NULL,
	"degree_programme" "degree_programme_type",
	"duration" integer,
	"number_of_semesters" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_academic_subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_academic_info_id_fk" integer NOT NULL,
	"academic_subject_id_fk" integer NOT NULL,
	"full_marks" numeric(10, 2) NOT NULL,
	"total_marks" numeric(10, 2) NOT NULL,
	"result_status" "board_result_status_type" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_city_id_fk_cities_id_fk" FOREIGN KEY ("city_id_fk") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_country_id_fk_countries_id_fk" FOREIGN KEY ("country_id_fk") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_state_id_fk_states_id_fk" FOREIGN KEY ("state_id_fk") REFERENCES "public"."states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_academic_info" ADD CONSTRAINT "admission_academic_info_application_form_id_fk_application_forms_id_fk" FOREIGN KEY ("application_form_id_fk") REFERENCES "public"."application_forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_academic_info" ADD CONSTRAINT "admission_academic_info_board_university_id_fk_board_universities_id_fk" FOREIGN KEY ("board_university_id_fk") REFERENCES "public"."board_universities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_academic_info" ADD CONSTRAINT "admission_academic_info_institute_id_fk_institutions_id_fk" FOREIGN KEY ("institute_id_fk") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_academic_info" ADD CONSTRAINT "admission_academic_info_language_medium_id_fk_language_medium_id_fk" FOREIGN KEY ("language_medium_id_fk") REFERENCES "public"."language_medium"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_academic_info" ADD CONSTRAINT "admission_academic_info_previously_registered_course_id_fk_courses_id_fk" FOREIGN KEY ("previously_registered_course_id_fk") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_academic_info" ADD CONSTRAINT "admission_academic_info_previous_college_id_fk_colleges_id_fk" FOREIGN KEY ("previous_college_id_fk") REFERENCES "public"."colleges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_additional_info" ADD CONSTRAINT "admission_additional_info_blood_group_id_fk_blood_group_id_fk" FOREIGN KEY ("blood_group_id_fk") REFERENCES "public"."blood_group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_additional_info" ADD CONSTRAINT "admission_additional_info_religion_id_fk_religion_id_fk" FOREIGN KEY ("religion_id_fk") REFERENCES "public"."religion"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_additional_info" ADD CONSTRAINT "admission_additional_info_category_id_fk_categories_id_fk" FOREIGN KEY ("category_id_fk") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_additional_info" ADD CONSTRAINT "admission_additional_info_annual_income_id_fk_annual_incomes_id_fk" FOREIGN KEY ("annual_income_id_fk") REFERENCES "public"."annual_incomes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_course_applications" ADD CONSTRAINT "admission_course_applications_application_form_id_fk_application_forms_id_fk" FOREIGN KEY ("application_form_id_fk") REFERENCES "public"."application_forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_course_applications" ADD CONSTRAINT "admission_course_applications_course_id_fk_courses_id_fk" FOREIGN KEY ("course_id_fk") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_general_info" ADD CONSTRAINT "admission_general_info_application_form_id_fk_application_forms_id_fk" FOREIGN KEY ("application_form_id_fk") REFERENCES "public"."application_forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_general_info" ADD CONSTRAINT "admission_general_info_nationality_id_fk_nationality_id_fk" FOREIGN KEY ("nationality_id_fk") REFERENCES "public"."nationality"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_general_info" ADD CONSTRAINT "admission_general_info_category_id_fk_categories_id_fk" FOREIGN KEY ("category_id_fk") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_general_info" ADD CONSTRAINT "admission_general_info_religion_id_fk_religion_id_fk" FOREIGN KEY ("religion_id_fk") REFERENCES "public"."religion"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_general_info" ADD CONSTRAINT "admission_general_info_degree_id_fk_degree_id_fk" FOREIGN KEY ("degree_id_fk") REFERENCES "public"."degree"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_forms" ADD CONSTRAINT "application_forms_admission_id_fk_admissions_id_fk" FOREIGN KEY ("admission_id_fk") REFERENCES "public"."admissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_universities" ADD CONSTRAINT "board_universities_address_id_fk_address_id_fk" FOREIGN KEY ("address_id_fk") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_universities" ADD CONSTRAINT "board_universities_degree_id_degree_id_fk" FOREIGN KEY ("degree_id") REFERENCES "public"."degree"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_degree_id_degree_id_fk" FOREIGN KEY ("degree_id") REFERENCES "public"."degree"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_application_form_id_fk_application_forms_id_fk" FOREIGN KEY ("application_form_id_fk") REFERENCES "public"."application_forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "states" ADD CONSTRAINT "states_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "streams" ADD CONSTRAINT "streams_degree_id_fk_degree_id_fk" FOREIGN KEY ("degree_id_fk") REFERENCES "public"."degree"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_academic_subjects" ADD CONSTRAINT "student_academic_subjects_admission_academic_info_id_fk_admission_academic_info_id_fk" FOREIGN KEY ("admission_academic_info_id_fk") REFERENCES "public"."admission_academic_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_academic_subjects" ADD CONSTRAINT "student_academic_subjects_academic_subject_id_fk_academic_subjects_id_fk" FOREIGN KEY ("academic_subject_id_fk") REFERENCES "public"."academic_subjects"("id") ON DELETE no action ON UPDATE no action;