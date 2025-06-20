import {dbPostgres} from "@/db";
import { Admission, admissions, applicationForms, admissionGeneralInfo, categories, religion, annualIncomes, admissionAdditionalInfo, genderType, admissionFormStatus, admissionCourses, courses, boardUniversities, admissionAcademicInfo, admissionCourseApplication } from "@/db/schema";
import { count, desc, eq, and, sql, ilike, or, SQL } from "drizzle-orm";
import { createAdmissionCourse, findAdmissionCoursesByAdmissionId } from "./adm-admision-courses.service";
import { AdmissionDto } from "@/types/admissions";

export async function createAdmission(admission: Admission): Promise<AdmissionDto | null> {
    const [foundAdmission] = await dbPostgres
        .select()
        .from(admissions)
        .where(eq(admissions.year, admission.year));

    if (foundAdmission) return null;

    const [newAdmission] = await dbPostgres
        .insert(admissions)
        .values({
            ...admission,
            startDate: admission.startDate,
            lastDate: admission.lastDate
        })
        .returning();

    return await modelToDto(newAdmission);
}

export async function createAdmissionWithCourses(admission: Admission, courseIds: number[]): Promise<AdmissionDto | null> {
    const [foundAdmission] = await dbPostgres
        .select()
        .from(admissions)
        .where(eq(admissions.year, admission.year));

    if (foundAdmission) return null;

    // Start a transaction
    const result = await dbPostgres.transaction(async (tx) => {
        // Create the admission
        const [newAdmission] = await tx
            .insert(admissions)
            .values({
                ...admission,
                startDate: admission.startDate,
                lastDate: admission.lastDate
            })
            .returning();

        // Create admission course mappings
        const admissionCourseMappings = [];
        for (const courseId of courseIds) {
            const [mapping] = await tx
                .insert(admissionCourses)
                .values({
                    admissionId: newAdmission.id,
                    courseId: courseId,
                    disabled: false,
                    remarks: null
                })
                .returning();
            admissionCourseMappings.push(mapping);
        }

        return {
            admission: newAdmission,
            courseMappings: admissionCourseMappings
        };
    });

    // Convert the result to AdmissionDto
    return await modelToDto(result.admission);
}

export async function findAdmissionByYear(year: number): Promise<AdmissionDto | null> {
    const [foundAdmission] = await dbPostgres
        .select()
        .from(admissions)
        .where(eq(admissions.year, year));

    if (!foundAdmission) return null;

    // Auto-close if end date is past
    const now = new Date();
    const endDate = new Date(foundAdmission.lastDate!);
    if (!foundAdmission.isClosed && endDate < now) {
        await dbPostgres.update(admissions)
            .set({ isClosed: true })
            .where(eq(admissions.id, foundAdmission.id));
        foundAdmission.isClosed = true;
    }

    return await modelToDto(foundAdmission);
}

export async function findAdmissionById(id: number): Promise<AdmissionDto | null> {
    const [foundAdmission] = await dbPostgres
        .select()
        .from(admissions)
        .where(eq(admissions.id, id));

    if (!foundAdmission) return null;

    // Auto-close if end date is past
    const now = new Date();
    const endDate = new Date(foundAdmission.lastDate!);
    if (!foundAdmission.isClosed && endDate < now) {
        await dbPostgres.update(admissions)
            .set({ isClosed: true })
            .where(eq(admissions.id, foundAdmission.id));
        foundAdmission.isClosed = true;
    }

    return await modelToDto(foundAdmission);
}

export async function findAllAdmissions(page: number = 1, size: number = 10, filters?: { isClosed: boolean, isArchived: boolean }): Promise<AdmissionDto[]> {
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

    return await Promise.all(admissionsList.map(async (adm) => await modelToDto(adm)));
}

export async function updateAdmission(id: number, admission: Partial<Admission>): Promise<AdmissionDto | null> {
    const [foundAdmission] = await dbPostgres
        .select()
        .from(admissions)
        .where(eq(admissions.id, id));

    if (!foundAdmission) return null;

    const [updatedAdmission] = await dbPostgres
        .update(admissions)
        .set({
            ...admission,
            startDate: admission.startDate,
            lastDate: admission.lastDate
        })
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

async function modelToDto(adm: Admission) {
    const courses = await findAdmissionCoursesByAdmissionId(adm.id!);
    return {
        ...adm,
        courses
    }
}

export async function admissionStats() {
    const [{admissionYearCount}] = await dbPostgres
        .select({admissionYearCount: count()})
        .from(admissions);
    const [{totalApplications}] = await dbPostgres
        .select({totalApplications: count()}) 
        .from(applicationForms)
    const [{totalPayments}] = await dbPostgres
        .select({totalPayments: count()}) 
        .from(applicationForms)
        .where(eq(applicationForms.formStatus, "PAYMENT_SUCCESS"));
    const [{totalDrafts}] = await dbPostgres
        .select({totalDrafts: count()}) 
        .from(applicationForms)
        .where(eq(applicationForms.formStatus, "DRAFT"));


    return {
        admissionYearCount,
        totalApplications,
        totalPayments,
        totalDrafts
    }

}


export async function findAllAdmissionSummary(page: number = 1, size: number = 10) {
    const offset = (page - 1) * size;

    const admissionsObjs = await dbPostgres
        .select({
            id: admissions.id,
            admissionYear: admissions.year,
            isClosed: admissions.isClosed,

            totalApplications: sql`COUNT(application_forms.id)`.as('totalApplications'),

            totalPayments: sql`
                COUNT(*) FILTER (WHERE application_forms.form_status = 'PAYMENT_SUCCESS')
            `.as('totalPayments'),

            totalDrafts: sql`
                COUNT(*) FILTER (WHERE application_forms.form_status = 'DRAFT')
            `.as('totalDrafts'),
        })
        .from(admissions)
        .leftJoin(applicationForms, eq(applicationForms.admissionId, admissions.id))
        .groupBy(admissions.id, admissions.year)
        .limit(size)
        .offset(offset)
        .orderBy(desc(admissions.year));

    return admissionsObjs;
}

export async function getApplicationFormStats(admissionId: number) {
    const [{ totalApplications }] = await dbPostgres
        .select({ totalApplications: count() })
        .from(applicationForms)
        .where(eq(applicationForms.admissionId, admissionId));

    const [{ paymentsDone }] = await dbPostgres
        .select({ paymentsDone: count() })
        .from(applicationForms)
        .where(
            and(
                eq(applicationForms.admissionId, admissionId),
                eq(applicationForms.formStatus, "PAYMENT_SUCCESS")
            )
        );

    const [{ drafts }] = await dbPostgres
        .select({ drafts: count() })
        .from(applicationForms)
        .where(
            and(
                eq(applicationForms.admissionId, admissionId),
                eq(applicationForms.formStatus, "DRAFT")
            )
        );

    const [{ submitted }] = await dbPostgres
        .select({ submitted: count() })
        .from(applicationForms)
        .where(
            and(
                eq(applicationForms.admissionId, admissionId),
                eq(applicationForms.formStatus, "SUBMITTED")
            )
        );

    const [{ approved }] = await dbPostgres
        .select({ approved: count() })
        .from(applicationForms)
        .where(
            and(
                eq(applicationForms.admissionId, admissionId),
                eq(applicationForms.formStatus, "APPROVED")
            )
        );

    const [{ rejected }] = await dbPostgres
        .select({ rejected: count() })
        .from(applicationForms)
        .where(
            and(
                eq(applicationForms.admissionId, admissionId),
                eq(applicationForms.formStatus, "REJECTED")
            )
        );

    const [{ paymentDue }] = await dbPostgres
        .select({ paymentDue: count() })
        .from(applicationForms)
        .where(
            and(
                eq(applicationForms.admissionId, admissionId),
                eq(applicationForms.formStatus, "PAYMENT_DUE")
            )
        );

    return {
        totalApplications,
        paymentsDone,
        drafts,
        submitted,
        approved,
        rejected,
        paymentDue,
    };
}

interface GetApplicationFormsFilters {
    category?: string;
    religion?: string;
    annualIncome?: string;
    gender?: "MALE" | "FEMALE" | "TRANSGENDER";
    isGujarati?: boolean;
    search?: string;
    formStatus?: string;
    paymentStatus?: string;
    course?: string;
    boardUniversity?: string;
}

export async function getApplicationFormsByAdmissionId(
    admissionId: number,
    page: number = 1,
    size: number = 10,
    filters: GetApplicationFormsFilters = {}
) {
    const offset = (page - 1) * size;

    const baseQuery = dbPostgres
        .select({
            id: applicationForms.id,
            formStatus: applicationForms.formStatus,
            admissionStep: applicationForms.admissionStep,
            submittedAt: applicationForms.createdAt,
            name: sql<string>`${admissionGeneralInfo.firstName} || ' ' || ${admissionGeneralInfo.lastName}`.as('name'),
            category: categories.name,
            religion: sql<string>`COALESCE((SELECT ${religion.name} FROM ${admissionGeneralInfo} LEFT JOIN ${religion} ON ${admissionGeneralInfo.religionId} = ${religion.id} WHERE ${admissionGeneralInfo.applicationFormId} = ${applicationForms.id} LIMIT 1), (SELECT ${religion.name} FROM ${admissionAdditionalInfo} LEFT JOIN ${religion} ON ${admissionAdditionalInfo.religionId} = ${religion.id} WHERE ${admissionAdditionalInfo.applicationFormId} = ${applicationForms.id} LIMIT 1))`.as('religion'),
            annualIncome: annualIncomes.range,
            gender: admissionGeneralInfo.gender,
            isGujarati: admissionGeneralInfo.isGujarati,
            course: sql<string>`(SELECT ${courses.name} FROM ${admissionCourseApplication} LEFT JOIN ${courses} ON ${admissionCourseApplication.admissionCourseId} = ${courses.id} WHERE ${admissionCourseApplication.applicationFormId} = ${applicationForms.id} LIMIT 1)`.as('course'),
            boardUniversity: sql<string>`(SELECT ${boardUniversities.name} FROM ${admissionAcademicInfo} LEFT JOIN ${boardUniversities} ON ${admissionAcademicInfo.boardUniversityId} = ${boardUniversities.id} WHERE ${admissionAcademicInfo.applicationFormId} = ${applicationForms.id} LIMIT 1)`.as('boardUniversity')
        })
        .from(applicationForms)
        .leftJoin(admissionGeneralInfo, eq(applicationForms.id, admissionGeneralInfo.applicationFormId))
        .leftJoin(categories, eq(admissionGeneralInfo.categoryId, categories.id))
        .leftJoin(admissionAdditionalInfo, eq(applicationForms.id, admissionAdditionalInfo.applicationFormId))
        .leftJoin(annualIncomes, eq(admissionAdditionalInfo.annualIncomeId, annualIncomes.id));

    let conditions: SQL<unknown>[] = [eq(applicationForms.admissionId, admissionId)];

    // Apply filters
    if (filters.category) {
        conditions.push(eq(categories.name, filters.category));
    }
    if (filters.religion) {
        conditions.push(
            sql`(SELECT ${religion.name} FROM ${admissionGeneralInfo} LEFT JOIN ${religion} ON ${admissionGeneralInfo.religionId} = ${religion.id} WHERE ${admissionGeneralInfo.applicationFormId} = ${applicationForms.id} LIMIT 1) = ${filters.religion}`
        );
    }
    if (filters.annualIncome) {
        conditions.push(eq(annualIncomes.range, filters.annualIncome));
    }
    if (typeof filters.gender !== 'undefined') {
        conditions.push(eq(admissionGeneralInfo.gender, filters.gender as typeof genderType.enumValues[number]));
    }
    if (typeof filters.isGujarati === 'boolean') {
        conditions.push(eq(admissionGeneralInfo.isGujarati, filters.isGujarati));
    }
    if (filters.formStatus) {
        conditions.push(eq(applicationForms.formStatus, filters.formStatus as typeof admissionFormStatus.enumValues[number]));
    }

    // Add course filter
    if (filters.course) {
        conditions.push(
            sql`(SELECT ${courses.name} FROM ${admissionCourseApplication} LEFT JOIN ${courses} ON ${admissionCourseApplication.admissionCourseId} = ${courses.id} WHERE ${admissionCourseApplication.applicationFormId} = ${applicationForms.id} LIMIT 1) = ${filters.course}`
        );
    }
    // Add boardUniversity filter
    if (filters.boardUniversity) {
        conditions.push(
            sql`(SELECT ${boardUniversities.name} FROM ${admissionAcademicInfo} LEFT JOIN ${boardUniversities} ON ${admissionAcademicInfo.boardUniversityId} = ${boardUniversities.id} WHERE ${admissionAcademicInfo.applicationFormId} = ${applicationForms.id} LIMIT 1) = ${filters.boardUniversity}`
        );
    }

    // Apply search
    if (filters.search && filters.search.trim() !== '') {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        const searchConditions = [
            ilike(admissionGeneralInfo.firstName, searchTerm),
            ilike(admissionGeneralInfo.lastName, searchTerm),
            ilike(sql`${applicationForms.id}::text`, searchTerm),
        ].filter((cond): cond is SQL<unknown> => cond !== undefined);

        if (searchConditions.length > 0) {
            conditions.push(or(...searchConditions) as SQL<unknown>);
        }
    }

    // Main query with conditions
    let query = baseQuery.where(and(...conditions));

    // Count query with same conditions
    let totalCountQuery = dbPostgres
        .select({ count: count() })
        .from(applicationForms)
        .leftJoin(admissionGeneralInfo, eq(applicationForms.id, admissionGeneralInfo.applicationFormId))
        .leftJoin(categories, eq(admissionGeneralInfo.categoryId, categories.id))
        .leftJoin(admissionAdditionalInfo, eq(applicationForms.id, admissionAdditionalInfo.applicationFormId))
        .leftJoin(annualIncomes, eq(admissionAdditionalInfo.annualIncomeId, annualIncomes.id))
        .where(and(...conditions));

    const [totalCountResult] = await totalCountQuery;
    const totalItems = totalCountResult ? totalCountResult.count : 0;

    const applicationFormsList = await query
        .limit(size)
        .offset(offset)
        .orderBy(desc(applicationForms.createdAt));

    return {
        applications: applicationFormsList,
        totalItems,
    };
}

