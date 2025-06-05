import { NextResponse } from "next/server";
import dbPostgres from "@/db";
import { academicSubjects } from "@/db/schema";

export async function GET() {
  try {
    const subjects = await dbPostgres.select().from(academicSubjects);
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Error fetching academic subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch academic subjects" },
      { status: 500 }
    );
  }
} 