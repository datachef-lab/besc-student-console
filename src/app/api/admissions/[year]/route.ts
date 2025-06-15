import { NextResponse } from 'next/server';
import { findAdmissionByYear, getApplicationFormStats, getApplicationFormsByAdmissionId } from '@/lib/services/admission.service';

export async function GET(
    request: Request,
    { params }: { params: { year: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const size = parseInt(searchParams.get("size") || "10");
        const search = searchParams.get("search") || undefined;
        const category = searchParams.get("category") || undefined;
        const religion = searchParams.get("religion") || undefined;
        const annualIncome = searchParams.get("annualIncome") || undefined;
        const gender = (searchParams.get("gender") || undefined) as any; // Cast for enum
        const isGujarati = searchParams.get("isGujarati") ? searchParams.get("isGujarati") === "true" : undefined;
        const formStatus = searchParams.get("formStatus") || undefined;

        const { year: yearParam } = await params;
        const year = parseInt(yearParam);
        const admission = await findAdmissionByYear(year);

        if (!admission) {
            return NextResponse.json(
                { error: "Admission not found for this year" },
                { status: 404 }
            );
        }

        const admissionId = admission.id;

        const [stats, { applicationForms: applications, totalItems }] = await Promise.all([
            getApplicationFormStats(admissionId),
            getApplicationFormsByAdmissionId(admissionId, page, size, {
                search,
                category,
                religion,
                annualIncome,
                gender,
                isGujarati,
                formStatus,
            }),
        ]);

        return NextResponse.json({
            admission,
            stats,
            applications,
            totalItems,
            page,
            size,
        });
    } catch (error) {
        console.error("Error fetching admission details:", error);
        return NextResponse.json(
            { error: "Failed to fetch admission details" },
            { status: 500 }
        );
    }
}
