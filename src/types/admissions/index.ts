import { AdmissionAcademicInfo, AdmissionAdditionalInfo, AdmissionCourseApplication, AdmissionGeneralInfo, ApplicationForm, Payment, StudentAcademicSubjects } from "@/db/schema";

export interface AdmissionAcademicInfoDto extends AdmissionAcademicInfo {
    subjects: StudentAcademicSubjects[];
}

export interface ApplicationFormDto extends ApplicationForm {
    generalInfo: AdmissionGeneralInfo | null;
    academicInfo: AdmissionAcademicInfoDto | null;
    courseApplication: AdmissionCourseApplication | null;
    additonalInfo: AdmissionAdditionalInfo | null;
    paymentInfo: Payment | null;
}