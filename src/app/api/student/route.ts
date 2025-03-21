import { NextRequest, NextResponse } from "next/server";
import { findStudentByEmail } from "@/lib/services/student";
import { findBatchByStudentId } from "@/lib/services/batch";

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        const student = await findStudentByEmail(email);
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const batch = await findBatchByStudentId(student.id as number);
        return NextResponse.json({ student, batch });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
