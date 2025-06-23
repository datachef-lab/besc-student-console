import { db } from "@/db";
import { admissions } from "@/db/schema";
import { findAdmissionById, findAdmissionByYear } from "@/lib/services/admission.service";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const year = parseInt((await params).year);
    if (isNaN(year)) {
      return NextResponse.json({ message: "Invalid year provided." }, { status: 400 });
    }

    const admission = await findAdmissionByYear(Number(year));

    if (!admission) {
      return NextResponse.json({ message: `Admission for year ${year} not found.` }, { status: 404 });
    }

    return NextResponse.json({ admission });
  } catch (error) {
    console.error("Error fetching admission:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
