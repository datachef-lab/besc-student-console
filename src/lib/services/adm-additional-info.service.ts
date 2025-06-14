import {dbPostgres} from "@/db";
import { admissionAdditionalInfo, AdmissionAdditionalInfo } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function createAdmissionAdditionalInfo(givenAdditionalInfo: AdmissionAdditionalInfo) {
    // Check if the additional info already exists for the application form
    const [existingEntry] = await dbPostgres
        .select()
        .from(admissionAdditionalInfo)
        .where(
            and(
                eq(admissionAdditionalInfo.applicationFormId, givenAdditionalInfo.applicationFormId),
            )
        )

    if (existingEntry) {
        return { additionalInfo: existingEntry, message: "Additional info already exists for this application." };
    }

    // Insert new additional info
    const [newAdditionalInfo] = await dbPostgres
        .insert(admissionAdditionalInfo)
        .values(givenAdditionalInfo)
        .returning();

    return {
        additionalInfo: newAdditionalInfo,
        message: "New Additional Info Created!"
    };
}

// Read by ID
export async function findAdditionalInfoById(id: number) {
    const [info] = await dbPostgres
        .select()
        .from(admissionAdditionalInfo)
        .where(eq(admissionAdditionalInfo.id, id));
    return info || null;
}

// Read by Application Form ID
export async function findAdditionalInfoByApplicationFormId(applicationFormId: number) {
    const [info] = await dbPostgres
        .select()
        .from(admissionAdditionalInfo)
        .where(eq(admissionAdditionalInfo.applicationFormId, applicationFormId));
    return info || null;
}

// Update
export async function updateAdmissionAdditionalInfo(info: AdmissionAdditionalInfo) {
    if (!info.id) throw new Error("ID is required for update.");
    const [updated] = await dbPostgres
        .update(admissionAdditionalInfo)
        .set(info)
        .where(eq(admissionAdditionalInfo.id, info.id))
        .returning();
    return updated;
}

// Delete
export async function deleteAdmissionAdditionalInfo(id: number) {
    const deleted = await dbPostgres
        .delete(admissionAdditionalInfo)
        .where(eq(admissionAdditionalInfo.id, id));
    return deleted.length > 0;
}