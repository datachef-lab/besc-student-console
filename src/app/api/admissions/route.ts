import { NextRequest, NextResponse } from "next/server";
import {
  createAdmission,
  deleteAdmission,
  findAdmissionById,
  findAdmissionByYear,
  findAllAdmissions,
  updateAdmission,
} from "@/lib/services/admission.service";

// GET /api/admission?id=1 or ?year=2024 or ?page=1&size=10&isClosed=false&isArchived=true
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    const year = searchParams.get("year");
    const page = searchParams.get("page");
    const size = searchParams.get("size");
    const isClosed = searchParams.get("isClosed");
    const isArchived = searchParams.get("isArchived");

    if (id) {
      const admission = await findAdmissionById(Number(id));
      return NextResponse.json(admission ?? {});
    }

    if (year) {
      const admission = await findAdmissionByYear(Number(year));
      return NextResponse.json(admission ?? {});
    }

    const admissions = await findAllAdmissions(
      page ? Number(page) : 1,
      size ? Number(size) : 10,
      {
        isClosed: isClosed !== null ? isClosed === "true" : false,
        isArchived: isArchived !== null ? isArchived === "true" : false,
      }
    );
    return NextResponse.json(admissions);
  } catch (error) {
    console.error("GET /api/admission error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admissions" },
      { status: 500 }
    );
  }
}

// POST /api/admission
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newAdmission = await createAdmission(data);
    if (!newAdmission) {
      return NextResponse.json(
        { error: "Admission already exists for this year" },
        { status: 409 }
      );
    }
    return NextResponse.json(newAdmission, { status: 201 });
  } catch (error) {
    console.error("POST /api/admission error:", error);
    return NextResponse.json(
      { error: "Failed to create admission" },
      { status: 500 }
    );
  }
}

// PATCH /api/admission?id=1
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Admission ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updated = await updateAdmission(Number(id), body);

    if (!updated) {
      return NextResponse.json(
        { error: "Admission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admission error:", error);
    return NextResponse.json(
      { error: "Failed to update admission" },
      { status: 500 }
    );
  }
}

// DELETE /api/admission?id=1
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Admission ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteAdmission(Number(id));

    if (!deleted) {
      return NextResponse.json(
        { error: "Admission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("DELETE /api/admission error:", error);
    return NextResponse.json(
      { error: "Failed to delete admission" },
      { status: 500 }
    );
  }
}
