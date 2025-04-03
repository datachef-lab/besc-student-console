import { NextRequest, NextResponse } from "next/server";
import { findStudentByUid } from "@/lib/services/student";
import { findBatchesByStudentId } from "@/lib/services/batch";

export async function GET(req: NextRequest) {
    const uid = req.nextUrl.searchParams.get("uid");

    if (!uid) {
        return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    try {
        const student = await findStudentByUid(uid);
        console.log("in student api:", student);
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const batches = await findBatchesByStudentId(student.id as number);
        return NextResponse.json({ student, batches });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
