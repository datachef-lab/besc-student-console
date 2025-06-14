import { NextResponse } from "next/server";
import { dbPostgres } from "@/db/index";
import { admissions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const { isClosed } = body as { isClosed: boolean };

    console.log("in adm close request, isClosed:", isClosed)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid Admission ID" },
        { status: 400 }
      );
    }

    const [updatedAdmission] = await dbPostgres
      .update(admissions)
      .set({ isClosed, updatedAt: new Date() })
      .where(eq(admissions.id, id))
      .returning();

    if (!updatedAdmission) {
      return NextResponse.json(
        { error: "Admission not found or could not be closed" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Admission closed successfully", admission: updatedAdmission },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error closing admission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 