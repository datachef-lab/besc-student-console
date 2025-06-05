import { AdmissionAcademicInfo, AdmissionAdditionalInfo, AdmissionCourseApplication, AdmissionGeneralInfo, ApplicationForm, Payment, SportsInfo, StudentAcademicSubjects } from "@/db/schema";

export interface AdmissionAcademicInfoDto extends AdmissionAcademicInfo {
    subjects: StudentAcademicSubjects[];
}


export interface AdmissionAdditionalInfoDto extends AdmissionAdditionalInfo {
    sportsInfo: SportsInfo[];
}

export interface ApplicationFormDto extends ApplicationForm {
    generalInfo: AdmissionGeneralInfo | null;
    academicInfo: AdmissionAcademicInfoDto | null;
    courseApplication: AdmissionCourseApplication[] | null;
    additonalInfo: AdmissionAdditionalInfoDto | null;
    paymentInfo: Payment | null;
}