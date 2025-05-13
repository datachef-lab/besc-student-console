import { updateAccessControl } from "@/lib/services/access-control";
import { NextResponse } from "next/server";


// PUT endpoint to update student access permissions
export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        // Validate authorization (basic check)
        const { id } = context.params;

        const { status, access_course, access_library, access_exams } = await request.json();

        const updatedStudent = await updateAccessControl({
            id: parseInt(id), status, access_course, access_library, access_exams,
        });

        return NextResponse.json(updatedStudent, { status: 200 });

    } catch (error) {
        console.error("Error updating student access:", error);

        return NextResponse.json(
            { error: "Failed to update student access" },
            { status: 500 }
        );
    }
} 