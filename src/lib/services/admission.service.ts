import dbPostgres from "@/db";
import { Admission, admissions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createAdmission(admission: Admission) {
    const [foundAdmission] = await dbPostgres
        .select()
        .from(admissions)
        .where(eq(admissions.year, admission.year));

    if (foundAdmission) return null;

    const [newAdmission] = await dbPostgres
        .insert(admissions)
        .values(admission)
        .returning();

    return newAdmission;
}

export async function findAdmissionByYear(year: number) {
    const [foundAdmission] = await dbPostgres
        .select()
        .from(admissions)
        .where(eq(admissions.year, year));

    if (!foundAdmission) return null;

    return foundAdmission;
}

export async function findAdmissionById(id: number) {
    const [foundAdmission] = await dbPostgres
        .select()
        .from(admissions)
        .where(eq(admissions.id, id));

    if (!foundAdmission) return null;

    return foundAdmission;
}

export async function findAllAdmissions(page: number = 1, size: number = 10, filters?: { isClosed: boolean, isArchived: boolean }) {
    const query = dbPostgres
        .select()
        .from(admissions)
        .limit(size)
        .offset((page - 1) * size);

    if (filters?.isClosed !== undefined) {
        query.where(eq(admissions.isClosed, filters.isClosed));
    }

    if (filters?.isArchived !== undefined) {
        query.where(eq(admissions.isArchived, filters.isArchived));
    }

    const admissionsList = await query;

    return admissionsList;
}

export async function updateAdmission(id: number, admission: Partial<Admission>) {
    const [foundAdmission] = await dbPostgres
        .select()
        .from(admissions)
        .where(eq(admissions.id, id));

    if (!foundAdmission) return null;

    const [updatedAdmission] = await dbPostgres
        .update(admissions)
        .set(admission)
        .where(eq(admissions.id, id));

    return updatedAdmission;
}

export async function deleteAdmission(id: number) {
    const [foundAdmission] = await dbPostgres
        .select()
        .from(admissions)
        .where(eq(admissions.id, id));

    if (!foundAdmission) return null;

    // TODO: Delete all the application forms
    

    // Delete the admission for the given `id`
    const [deletedAdmission] = await dbPostgres
        .delete(admissions)
        .where(eq(admissions.id, id));

    return deletedAdmission;
}