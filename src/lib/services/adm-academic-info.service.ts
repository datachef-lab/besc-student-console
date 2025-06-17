import {dbPostgres} from "@/db";
import { AdmissionAcademicInfo, admissionAcademicInfo } from "@/db/schema";
import { AdmissionAcademicInfoDto } from "@/types/admissions";
import { and, eq, ilike } from "drizzle-orm";
import { createSubject, deleteSubject, findSubjectsByAcademicInfoId } from "./adm-student-subject.service";

export async function createAcademicInfo(givenDto: AdmissionAcademicInfoDto) {
    const { subjects, ...base } = givenDto;

    let existingEntry = await checkExistingEntry(givenDto);
    if (!existingEntry) { // Create a new academic info entry
        const [newAcademicInfo] = await dbPostgres
            .insert(admissionAcademicInfo)
            .values(base)
            .returning();
        existingEntry = newAcademicInfo;
    }

    // Add the subjects to the academic info entry
    for (const subject of subjects) {
        subject.admissionAcademicInfoId = existingEntry.id;
        await createSubject(subject);
    }

    const dto = await formatAcademicInfo(existingEntry);

    return dto;
}

export async function findAcademicInfoById(id: number) {
    const [academicInfo] = await dbPostgres
        .select()
        .from(admissionAcademicInfo)
        .where(eq(admissionAcademicInfo.id, id));

    if (!academicInfo) {
        return null;
    }

    const dto = await formatAcademicInfo(academicInfo);

    return dto;
}

export async function findAcademicInfoByApplicationFormId(applicationFormId: number) {
    const [academicInfo] = await dbPostgres
        .select()
        .from(admissionAcademicInfo)
        .where(eq(admissionAcademicInfo.applicationFormId, applicationFormId));

    const dto = await formatAcademicInfo(academicInfo);

    return dto;
}

export async function updateAcademicInfo(givenDto: AdmissionAcademicInfoDto) {
    const foundAcademicInfo = await findAcademicInfoById(givenDto.id!);
    if (!foundAcademicInfo) {
        return null;
    }
    const { subjects, ...base } = givenDto;
    const [updatedAcademicInfo] = await dbPostgres
        .update(admissionAcademicInfo)
        .set(base)
        .where(eq(admissionAcademicInfo.id, givenDto.id!))
        .returning();
    // Update the subjects for the academic info entry
    for (const subject of subjects) {
        subject.admissionAcademicInfoId = updatedAcademicInfo.id;
        await createSubject(subject);
    }
    const dto = await formatAcademicInfo(updatedAcademicInfo);
    return dto;
}

export async function deleteAcademicInfo(id: number) {
    const foundAcademicInfo = await findAcademicInfoById(id);
    if (!foundAcademicInfo) {
        return null;
    }
    // Delete the subjects associated with the academic info
    for (const subject of foundAcademicInfo.subjects) {
        await deleteSubject(subject.id!);
    }
    // Delete the academic info entry
    await dbPostgres
        .delete(admissionAcademicInfo)
        .where(eq(admissionAcademicInfo.id, id));

    return true;
}

export async function formatAcademicInfo(academicInfo: AdmissionAcademicInfo): Promise<AdmissionAcademicInfoDto> {
    const subjects = await findSubjectsByAcademicInfoId(academicInfo.id!);

    return {
        ...academicInfo,
        subjects: subjects || [],
    };
}

export async function checkExistingEntry(givenDto: AdmissionAcademicInfoDto) {
    const [existingEntry] = await dbPostgres
        .select()
        .from(admissionAcademicInfo)
        .where(
            and(
                eq(admissionAcademicInfo.applicationFormId, givenDto.applicationFormId),
                eq(admissionAcademicInfo.boardUniversityId, givenDto.boardUniversityId),
                eq(admissionAcademicInfo.boardResultStatus, givenDto.boardResultStatus),
                ilike(admissionAcademicInfo.cuRegistrationNumber, givenDto.cuRegistrationNumber!.trim()),

                ilike(admissionAcademicInfo.streamType, givenDto.streamType!.trim()),
            )
        );

    return existingEntry;
}