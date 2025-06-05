import { NextResponse } from 'next/server';
import { db } from '@/db';
import { boardUniversities, degree, address } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const boardUniversitySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  degreeId: z.number().optional(),
  passingMarks: z.number().optional(),
  code: z.string().optional(),
  addressId: z.number().optional(),
  sequence: z.number().optional(),
});

export async function GET() {
  try {
    const allBoardUniversities = await db.select().from(boardUniversities);
    return NextResponse.json({ success: true, data: allBoardUniversities });
  } catch (error: any) {
    console.error('Error fetching board universities:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch board universities', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = boardUniversitySchema.parse(body);

    const [newBoardUniversity] = await db
      .insert(boardUniversities)
      .values({ 
        name: validatedData.name,
        degreeId: validatedData.degreeId,
        passingMarks: validatedData.passingMarks,
        code: validatedData.code,
        addressId: validatedData.addressId,
        sequence: validatedData.sequence,
      })
      .returning();

    return NextResponse.json({ success: true, data: newBoardUniversity });
  } catch (error: any) {
    console.error('Error creating board university:', error);
    return NextResponse.json({ success: false, message: 'Failed to create board university', error: error.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = boardUniversitySchema.parse(body);

    const [updatedBoardUniversity] = await db
      .update(boardUniversities)
      .set({
        name: validatedData.name,
        degreeId: validatedData.degreeId,
        passingMarks: validatedData.passingMarks,
        code: validatedData.code,
        addressId: validatedData.addressId,
        sequence: validatedData.sequence,
        updatedAt: new Date(),
      })
      .where(eq(boardUniversities.id, parseInt(id)))
      .returning();

    if (!updatedBoardUniversity) {
      return NextResponse.json({ success: false, message: 'Board university not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedBoardUniversity });
  } catch (error: any) {
    console.error('Error updating board university:', error);
    return NextResponse.json({ success: false, message: 'Failed to update board university', error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const [deletedBoardUniversity] = await db
      .delete(boardUniversities)
      .where(eq(boardUniversities.id, parseInt(id)))
      .returning();

    if (!deletedBoardUniversity) {
      return NextResponse.json({ success: false, message: 'Board university not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedBoardUniversity });
  } catch (error: any) {
    console.error('Error deleting board university:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete board university', error: error.message }, { status: 500 });
  }
} 