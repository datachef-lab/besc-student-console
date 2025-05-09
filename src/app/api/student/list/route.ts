import { NextRequest, NextResponse } from "next/server";
import { findAllStudents } from "@/lib/services/student-service";
import { validateAdmin } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
    try {
        // Get pagination parameters from the URL
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const size = parseInt(searchParams.get("size") || "20");

        // Validate the requester is an admin
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get students from database
        const students = await findAllStudents(page, size);

        return NextResponse.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json(
            { error: "Failed to fetch students" },
            { status: 500 }
        );
    }
} 