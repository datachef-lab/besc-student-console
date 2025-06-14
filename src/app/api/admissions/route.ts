import { NextResponse } from "next/server";
import { createAdmission, findAllAdmissionSummary, admissionStats } from "@/lib/services/admission.service";
import { createAdmissionSchema } from "@/db/schema";
import { ZodError } from "zod";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const size = parseInt(searchParams.get("size") || "10");

        const [admissions, stats] = await Promise.all([
            findAllAdmissionSummary(page, size),
            admissionStats()
        ]);

        return NextResponse.json({
            admissions,
            stats,
            page,
            size
        });
    } catch (error) {
        console.error("Error fetching admissions:", error);
        return NextResponse.json(
            { error: "Failed to fetch admissions" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = createAdmissionSchema.parse(body);
        const admission = await createAdmission(validatedData);

        if (!admission) {
            return NextResponse.json(
                { error: "Admission for this year already exists" },
                { status: 400 }
            );
        }

        return NextResponse.json(admission);
    } catch (error) {
        console.error("Error creating admission:", error);
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid admission data", details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create admission" },
            { status: 500 }
        );
    }
}
