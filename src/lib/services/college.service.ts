import { dbPostgres } from "@/db";
import { Colleges, colleges } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createCollege(givenCollege: Colleges) {
    return await dbPostgres.insert(colleges).values(givenCollege).returning();
}

export async function getColleges() {
    return await dbPostgres.select().from(colleges).where(eq(colleges.disabled, false));
}

export async function getCollegeById(id: number) {
    return await dbPostgres.select().from(colleges).where(eq(colleges.id, id)).limit(1);
}

export async function updateCollege(id: number, givenCollege: Partial<Colleges>) {
    return await dbPostgres
        .update(colleges)
        .set(givenCollege)
        .where(eq(colleges.id, id))
        .returning();
}

export async function deleteCollege(id: number) {
    return await dbPostgres
        .update(colleges)
        .set({ disabled: true })
        .where(eq(colleges.id, id))
        .returning();
}