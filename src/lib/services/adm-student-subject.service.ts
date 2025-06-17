import {dbPostgres} from "@/db"
import { studentAcademicSubjects, StudentAcademicSubjects } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export async function createSubject(subject: StudentAcademicSubjects) {
    const [existingEntry] = await dbPostgres
        .select()
        .from(studentAcademicSubjects)
        .where(
            and(
                eq(studentAcademicSubjects.admissionAcademicInfoId, subject.admissionAcademicInfoId),
                eq(studentAcademicSubjects.academicSubjectId, subject.academicSubjectId),
            )
        );

    if (existingEntry) {
        return { subject: existingEntry, message: "Subject already exists for this academic info." };
    }

    const [newSubject] = await dbPostgres
        .insert(studentAcademicSubjects)
        .values(subject)
        .returning();

    return {
        subject: newSubject,
        message: "New Subject Created!"
    }
}

export async function findSubjectById(id: number) {
    const [subject] = await dbPostgres
        .select()
        .from(studentAcademicSubjects)
        .where(eq(studentAcademicSubjects.id, id));

    return subject || null;
}

// Read all for a specific academic info
export async function findSubjectsByAcademicInfoId(admissionAcademicInfoId: number) {
    const subjects = await dbPostgres
        .select()
        .from(studentAcademicSubjects)
        .where(eq(studentAcademicSubjects.admissionAcademicInfoId, admissionAcademicInfoId));

    return subjects;
}

export async function updateSubject(subject: StudentAcademicSubjects) {
    if (!subject.id) throw new Error("Subject ID is required for update.");

    const [updated] = await dbPostgres
        .update(studentAcademicSubjects)
        .set(subject)
        .where(eq(studentAcademicSubjects.id, subject.id))
        .returning();

    return updated;
}

// Delete
export async function deleteSubject(id: number) {
    const deleted = await dbPostgres
        .delete(studentAcademicSubjects)
        .where(eq(studentAcademicSubjects.id, id));

    return deleted.length > 0;
}