import { NextResponse } from 'next/server';

import { annualIncomes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import dbPostgres from '@/db';

const annualIncomeSchema = z.object({
  id: z.number().optional(),
  range: z.string().min(1),
});

export async function GET() {
  try {
    const allAnnualIncomes = await dbPostgres.select().from(annualIncomes);
    return NextResponse.json({ success: true, data: allAnnualIncomes });
  } catch (error: any) {
    console.error('Error fetching annual incomes:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch annual incomes', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = annualIncomeSchema.parse(body);

    const [newAnnualIncome] = await dbPostgres
      .insert(annualIncomes)
      .values({ range: validatedData.range })
      .returning();

    return NextResponse.json({ success: true, data: newAnnualIncome });
  } catch (error: any) {
    console.error('Error creating annual income:', error);
    return NextResponse.json({ success: false, message: 'Failed to create annual income', error: error.message }, { status: 400 });
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
    const validatedData = annualIncomeSchema.parse(body);

    const [updatedAnnualIncome] = await dbPostgres
      .update(annualIncomes)
      .set({ range: validatedData.range })
      .where(eq(annualIncomes.id, parseInt(id)))
      .returning();

    if (!updatedAnnualIncome) {
      return NextResponse.json({ success: false, message: 'Annual income not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedAnnualIncome });
  } catch (error: any) {
    console.error('Error updating annual income:', error);
    return NextResponse.json({ success: false, message: 'Failed to update annual income', error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const [deletedAnnualIncome] = await dbPostgres
      .delete(annualIncomes)
      .where(eq(annualIncomes.id, parseInt(id)))
      .returning();

    if (!deletedAnnualIncome) {
      return NextResponse.json({ success: false, message: 'Annual income not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedAnnualIncome });
  } catch (error: any) {
    console.error('Error deleting annual income:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete annual income', error: error.message }, { status: 500 });
  }
} 