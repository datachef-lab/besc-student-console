import dbPostgres from "@/db";
import { admissionGeneralInfo, AdmissionGeneralInfo, ApplicationForm, applicationForms } from "@/db/schema";
import { ApplicationFormDto } from "@/types/admissions";
import { and, eq, ilike } from "drizzle-orm";

export async function createApplicationForm(form: ApplicationForm, generalInfo: AdmissionGeneralInfo) {
    // Check if the form already exists for the given admission year for the given student
    const existingEntry = await checkExistingEntry(generalInfo);
    if (existingEntry) {
        return { applicationForm: null, message: "Application form already exists for this student. Try login to continue." };
    }
    // Create a new application form
    const [newApplicationForm] = await dbPostgres
        .insert(applicationForms)
        .values(form)
        .returning();

    // Create a new admission general info entry
    generalInfo.applicationFormId = newApplicationForm.id;
    await createGeneralInfo(generalInfo);

    const dto = await formatAppform(newApplicationForm);

    return { applicationForm: dto, message: "New Application Form Created!" };
}

export async function formatAppform(form: ApplicationForm): Promise<ApplicationFormDto | null> {
    if (!form) return null;

    return null; // TODO

}

async function checkExistingEntry(generalInfo: AdmissionGeneralInfo) {
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
                eq(admissionGeneralInfo.degreeId, generalInfo.degreeId!),
            )
        );

    if (existingEntry) {
        return existingEntry;
    }

    return null;
}