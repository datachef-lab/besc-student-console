import dbPostgres from "@/db";
import { admissionGeneralInfo, AdmissionGeneralInfo } from "@/db/schema";
import { and, eq, ilike } from "drizzle-orm";

export async function createGeneralInfo(generalInfo: AdmissionGeneralInfo) {
    const existingEntry = await checkExistingEntry(generalInfo);
    if (existingEntry) {
        return { generalInfo: existingEntry, message: "General info already exists for this student." };
    }
    const [newGeneralInfo] = await dbPostgres
        .insert(admissionGeneralInfo)
        .values(generalInfo)
        .returning();

    return {
        generalInfo: newGeneralInfo, message: "New General Info Created!"
    }

}

export async function findGeneralInfoById(id: number) {
    const [generalInfo] = await dbPostgres
        .select()
        .from(admissionGeneralInfo)
        .where(eq(admissionGeneralInfo.id, id));

    if (!generalInfo) {
        return null;
    }

    return generalInfo;
}

export async function findGeneralInfoByApplicationFormId(applicationFormId: number) {
    const [generalInfo] = await dbPostgres
        .select()
        .from(admissionGeneralInfo)
        .where(eq(admissionGeneralInfo.applicationFormId, applicationFormId));

    if (!generalInfo) {
        return null;
    }

    return generalInfo;
}

export async function updateGeneralInfo(generalInfo: AdmissionGeneralInfo) {
    const foundGeneralInfo = await findGeneralInfoById(generalInfo.id!);
    if (!foundGeneralInfo) {
        return null;

    }
    const [updatedGeneralInfo] = await dbPostgres
        .update(admissionGeneralInfo)
        .set(generalInfo)
        .where(eq(admissionGeneralInfo.id, generalInfo.id!))
        .returning();

    return updatedGeneralInfo;
}

export async function checkExistingEntry(generalInfo: AdmissionGeneralInfo) {
    const [existingEntry] = await dbPostgres
        .select()
        .from(admissionGeneralInfo)
        .where(
            and(
                ilike(admissionGeneralInfo.firstName, generalInfo.firstName.trim()),
                ilike(admissionGeneralInfo.middleName, generalInfo.middleName!.trim()),
                ilike(admissionGeneralInfo.lastName, generalInfo.lastName!.trim()),
                eq(admissionGeneralInfo.dateOfBirth, generalInfo.dateOfBirth!),
                eq(admissionGeneralInfo.mobileNumber, generalInfo.mobileNumber!),
                eq(admissionGeneralInfo.gender, generalInfo.gender!),
                // eq(admissionGeneralInfo.degreeId, generalInfo.degreeId!),
            )
        );

    if (existingEntry) {
        return existingEntry;
    }

    return null;
}

export async function deleteGeneralInfo(id: number) {
    const foundGeneralInfo = await findGeneralInfoById(id);
    if (!foundGeneralInfo) {
        return null;
    }

    await dbPostgres
        .delete(admissionGeneralInfo)
        .where(eq(admissionGeneralInfo.id, id));

    return true;
}