import { NextResponse } from 'next/server';
import { findAdmissionByYear } from '@/lib/services/admission.service';

export async function GET(req: Request, { params }: { params: { year: string } }) {
    const year = params.year;

    try {
        const admission = await findAdmissionByYear(Number(year));
        if (!admission) {
            return NextResponse.json({ error: 'Admission not found' }, { status: 404 });
        }
        return NextResponse.json(admission);
    } catch (error) {
        console.error('Error fetching admission:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
