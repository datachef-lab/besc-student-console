import { NextResponse } from "next/server";
import { findAllCourse } from "@/lib/services/course-service";

export async function GET() {
    try {
        const courses = await findAllCourse();
        // Ensure we're returning an array
        return NextResponse.json(Array.isArray(courses) ? courses : []);
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json(
            { error: "Failed to fetch courses" },
            { status: 500 }
        );
    }
} 