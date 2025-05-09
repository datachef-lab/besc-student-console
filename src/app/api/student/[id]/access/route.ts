import { NextRequest, NextResponse } from "next/server";
import { query } from "@/db";
import { DbStudent } from "@/types/academics/student";

// PUT endpoint to update student access permissions
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Validate authorization (basic check)
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Not authorized to perform this action" },
                { status: 401 }
            );
        }

        const studentId = parseInt(params.id);
        if (isNaN(studentId)) {
            return NextResponse.json(
                { error: "Invalid student ID format" },
                { status: 400 }
            );
        }

        // Get the updated student data from request body
        const studentData = await request.json();

        // Validate student exists
        const [existingStudent] = await query<DbStudent[]>(
            `SELECT id FROM studentpersonaldetails WHERE id = ?`,
            [studentId]
        );

        if (!existingStudent) {
            return NextResponse.json(
                { error: "Student not found" },
                { status: 404 }
            );
        }

        // Extract the relevant fields for updating
        const { isSuspended, restrictedFeatures } = studentData;

        // Convert restrictedFeatures array to JSON string for storage
        const restrictedFeaturesJson = restrictedFeatures
            ? JSON.stringify(restrictedFeatures)
            : null;

        // Update student access permissions in database
        await query(
            `UPDATE studentpersonaldetails 
       SET 
        isSuspended = ?,
        restrictedFeatures = ?
       WHERE id = ?`,
            [
                isSuspended || false,
                restrictedFeaturesJson,
                studentId
            ]
        );

        // Fetch the updated student data
        const [updatedStudent] = await query<DbStudent[]>(
            `SELECT id, name, codeNumber, institutionalemail, isSuspended, restrictedFeatures
       FROM studentpersonaldetails 
       WHERE id = ?`,
            [studentId]
        );

        return NextResponse.json(updatedStudent, { status: 200 });
    } catch (error) {
        console.error("Error updating student access:", error);
        return NextResponse.json(
            { error: "Failed to update student access" },
            { status: 500 }
        );
    }
} 