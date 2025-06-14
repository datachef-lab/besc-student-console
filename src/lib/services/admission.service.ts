import {dbPostgres} from "@/db";
import { Admission, admissions, applicationForms, admissionGeneralInfo, categories, religion, annualIncomes, admissionAdditionalInfo, genderType, admissionFormStatus } from "@/db/schema";
import { count, desc, eq, and, sql, ilike, or, SQL } from "drizzle-orm";

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
            submittedAt: applicationForms.createdAt, // Assuming createdAt is submission date
            name: sql<string>`${admissionGeneralInfo.firstName} || ' ' || ${admissionGeneralInfo.lastName}`.as('name'),
            category: categories.name, // Joined from categories table
            religion: religion.name, // Joined from religion table
            annualIncome: annualIncomes.range, // Joined from annualIncomes table
            gender: admissionGeneralInfo.gender,
            isGujarati: admissionGeneralInfo.isGujarati,
        })
        .from(applicationForms)
        .leftJoin(admissionGeneralInfo, eq(applicationForms.id, admissionGeneralInfo.applicationFormId))
        .leftJoin(categories, eq(admissionGeneralInfo.categoryId, categories.id))
        .leftJoin(religion, eq(admissionGeneralInfo.religionId, religion.id))
        .leftJoin(admissionAdditionalInfo, eq(applicationForms.id, admissionAdditionalInfo.applicationFormId))
        .leftJoin(annualIncomes, eq(admissionAdditionalInfo.annualIncomeId, annualIncomes.id));

    let conditions: (SQL<unknown> | undefined)[] = [eq(applicationForms.admissionId, admissionId)];

    // Apply filters
    if (filters.category) {
        conditions.push(eq(categories.name, filters.category));
    }
    if (filters.religion) {
        conditions.push(eq(religion.name, filters.religion));
    }
    if (filters.annualIncome) {
        conditions.push(eq(annualIncomes.range, filters.annualIncome));
    }
    if (filters.gender) {
        conditions.push(eq(admissionGeneralInfo.gender, filters.gender as typeof genderType.enumValues[number]));
    }
    if (filters.isGujarati !== undefined) {
        conditions.push(eq(admissionGeneralInfo.isGujarati, filters.isGujarati));
    }
    if (filters.formStatus) {
        conditions.push(eq(applicationForms.formStatus, filters.formStatus as typeof admissionFormStatus.enumValues[number]));
    }

    // Apply search
    if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        conditions.push(or(
            ilike(admissionGeneralInfo.firstName, searchTerm),
            ilike(admissionGeneralInfo.lastName, searchTerm),
            ilike(sql`${applicationForms.id}::text`, searchTerm)
        ));
    }

    // Explicitly filter out undefined/null conditions before passing to `and`
    const finalConditions = conditions.filter((c): c is SQL<unknown> => c !== undefined && c !== null);

    // Apply all conditions to the main query
    let query = baseQuery.where(and(...finalConditions));

    // Apply all conditions to the total count query
    let totalCountQuery = dbPostgres
        .select({ count: count() })
        .from(applicationForms)
        .leftJoin(admissionGeneralInfo, eq(applicationForms.id, admissionGeneralInfo.applicationFormId))
        .leftJoin(categories, eq(admissionGeneralInfo.categoryId, categories.id))
        .leftJoin(religion, eq(admissionGeneralInfo.religionId, religion.id))
        .leftJoin(admissionAdditionalInfo, eq(applicationForms.id, admissionAdditionalInfo.applicationFormId))
        .leftJoin(annualIncomes, eq(admissionAdditionalInfo.annualIncomeId, annualIncomes.id));

    totalCountQuery.where(and(...finalConditions));

    const [totalCountResult] = await totalCountQuery;
    const totalItems = totalCountResult ? totalCountResult.count : 0;

    const applicationFormsList = await query.limit(size).offset(offset).orderBy(desc(applicationForms.createdAt));

    return {
        applicationForms: applicationFormsList,
        totalItems,
    };
}
