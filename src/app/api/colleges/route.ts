import { NextRequest, NextResponse } from "next/server";
import { createCollege, deleteCollege, getCollegeById, getColleges, updateCollege } from "@/lib/services/college.service";
import { createCollegesSchema } from "@/db/schema";
import { z } from "zod";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        if (id) {
            const college = await getCollegeById(parseInt(id));
            if (!college.length) {
                return NextResponse.json({ error: "College not found" }, { status: 404 });
            }
            return NextResponse.json(college[0]);
        }

        // Fetch all colleges
        const allColleges = await getColleges();
        const totalCount = allColleges.length;

        // Paginate
        const start = (page - 1) * limit;
        const end = start + limit;
        const colleges = allColleges.slice(start, end);

        return NextResponse.json({ colleges, totalCount });
    } catch (error) {
        console.error("Error in GET /api/colleges:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = createCollegesSchema.parse(body);
        const college = await createCollege(validatedData);
        return NextResponse.json(college, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error in POST /api/colleges:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "College ID is required" }, { status: 400 });
        }

        const body = await request.json();
        const validatedData = createCollegesSchema.partial().parse(body);
        const college = await updateCollege(parseInt(id), validatedData);

        if (!college.length) {
            return NextResponse.json({ error: "College not found" }, { status: 404 });
        }

        return NextResponse.json(college[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error in PUT /api/colleges:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "College ID is required" }, { status: 400 });
        }

        const college = await deleteCollege(parseInt(id));

        if (!college.length) {
            return NextResponse.json({ error: "College not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "College deleted successfully" });
    } catch (error) {
        console.error("Error in DELETE /api/colleges:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 