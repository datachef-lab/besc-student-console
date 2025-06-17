CREATE TYPE "public"."otp_type" AS ENUM('FOR_PHONE', 'FOR_EMAIL');--> statement-breakpoint
ALTER TYPE "public"."stream_type" ADD VALUE 'ARTS';--> statement-breakpoint
CREATE TABLE "otps" (
	"id" serial PRIMARY KEY NOT NULL,
	"otp" varchar(6) NOT NULL,
	"recipient" varchar(255) NOT NULL,
	"type" "otp_type" NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TYPE "public"."place_of_stay_type";--> statement-breakpoint
CREATE TYPE "public"."place_of_stay_type" AS ENUM('OWN', 'HOSTEL', 'PAYING_GUEST', 'RELATIVES');