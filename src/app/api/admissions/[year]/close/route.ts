import { NextResponse } from "next/server";
import { updateAdmission, findAdmissionByYear } from "@/lib/services/admission.service";

export async function POST(
    request: Request,
    { params }: { params: { year: string } }
) {
    try {
        const year = parseInt(params.year);
        const admission = await findAdmissionByYear(year);

        if (!admission) {
            return NextResponse.json(
                { error: "Admission not found for this year" },
                { status: 404 }
            );
        }

        const updatedAdmission = await updateAdmission(admission.id, { isClosed: true });

        if (!updatedAdmission) {
            return NextResponse.json(
                { error: "Failed to update admission status" },
                { status: 500 }
            );
        }

        return NextResponse.json(updatedAdmission);
    } catch (error) {
        console.error("Error closing admission:", error);
        return NextResponse.json(
            { error: "Failed to close admission" },
            { status: 500 }
        );
    }
} 