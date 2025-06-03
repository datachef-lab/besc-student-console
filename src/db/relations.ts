import { relations } from "drizzle-orm/relations";
import { cities, address, countries, states, courses, streams, boardUniversities, degree, institutions, payments, applicationForms, admissionGeneralInfo, nationality, categories, religion, admissionAcademicInfo, languageMedium, colleges, studentAcademicSubjects, academicSubjects, admissionCourseApplication, bloodGroup, admissionAdditionalInfo, annualIncomes, admissions, } from "./schema";

export const paymentRelations = relations(payments, ({ one }) => ({
    applicationForm: one(applicationForms, {
        fields: [payments.applicationFormId],
        references: [applicationForms.id]
    })
}));

export const applicationFormRelations = relations(applicationForms, ({ one }) => ({
    admission: one(admissions, {
        fields: [applicationForms.admissionId],
        references: [admissions.id]
    })
}));

export const admissionGeneralInfoRelations = relations(admissionGeneralInfo, ({ one }) => ({
    applicationForm: one(applicationForms, {
        fields: [admissionGeneralInfo.applicationFormId],
        references: [applicationForms.id]
    }),
    nationality: one(nationality, {
        fields: [admissionGeneralInfo.nationalityId],
        references: [nationality.id]
    }),
    category: one(categories, {
        fields: [admissionGeneralInfo.categoryId],
        references: [categories.id]
    }),
    religion: one(religion, {
        fields: [admissionGeneralInfo.religionId],
        references: [religion.id]
    }),
    degree: one(degree, {
        fields: [admissionGeneralInfo.degreeId],
        references: [degree.id]
    }),
}));

export const admissionAcademicInfoRelations = relations(admissionAcademicInfo, ({ one }) => ({
    applicationForm: one(applicationForms, {
        fields: [admissionAcademicInfo.applicationFormId],
        references: [applicationForms.id]
    }),
    boardUniversity: one(boardUniversities, {
        fields: [admissionAcademicInfo.boardUniversityId],
        references: [boardUniversities.id]
    }),
    institute: one(institutions, {
        fields: [admissionAcademicInfo.instituteId],
        references: [institutions.id]
    }),
    languageMedium: one(languageMedium, {
        fields: [admissionAcademicInfo.languageMediumId],
        references: [languageMedium.id]
    }),
    previouslyRegisteredCourse: one(courses, {
        fields: [admissionAcademicInfo.previouslyRegisteredCourseId],
        references: [courses.id]
    }),
    previousCollege: one(colleges, {
        fields: [admissionAcademicInfo.previousCollegeId],
        references: [colleges.id]
    }),
}));

export const studentAcademicSubjectsRelations = relations(studentAcademicSubjects, ({ one }) => ({
    admissionAcademicInfo: one(admissionAcademicInfo, {
        fields: [studentAcademicSubjects.admissionAcademicInfoId],
        references: [admissionAcademicInfo.id]
    }),
    academicSubject: one(academicSubjects, {
        fields: [studentAcademicSubjects.academicSubjectId],
        references: [academicSubjects.id]
    }),
}));

export const academicSubjectsRelations = relations(academicSubjects, ({ one }) => ({
    boardUniversity: one(boardUniversities, {
        fields: [academicSubjects.boardUniversityId],
        references: [boardUniversities.id]
    })
}));

export const admissionCourseApplicationRelations = relations(admissionCourseApplication, ({ one }) => ({
    applicationForm: one(applicationForms, {
        fields: [admissionCourseApplication.applicationFormId],
        references: [applicationForms.id]
    }),
    course: one(courses, {
        fields: [admissionCourseApplication.courseId],
        references: [courses.id]
    }),
}));

export const admissionAdditionalInfoRelations = relations(admissionAdditionalInfo, ({ one }) => ({
    bloodGroup: one(bloodGroup, {
        fields: [admissionAdditionalInfo.bloodGroupId],
        references: [bloodGroup.id]
    }),
    religion: one(religion, {
        fields: [admissionAdditionalInfo.religionId],
        references: [religion.id]
    }),
    categoryId: one(categories, {
        fields: [admissionAdditionalInfo.categoryId],
        references: [categories.id]
    }),
    annualIncome: one(annualIncomes, {
        fields: [admissionAdditionalInfo.annualIncomeId],
        references: [annualIncomes.id]
    })
}));








export const addressRelations = relations(address, ({ one, many }) => ({
    city: one(cities, {
        fields: [address.cityIdFk],
        references: [cities.id]
    }),
    country: one(countries, {
        fields: [address.countryIdFk],
        references: [countries.id]
    }),
    state: one(states, {
        fields: [address.stateIdFk],
        references: [states.id]
    }),
    institutions: many(institutions),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
    addresses: many(address),
    state: one(states, {
        fields: [cities.stateId],
        references: [states.id]
    }),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
    addresses: many(address),
    states: many(states),
}));

export const statesRelations = relations(states, ({ one, many }) => ({
    addresses: many(address),
    cities: many(cities),
    country: one(countries, {
        fields: [states.countryId],
        references: [countries.id]
    }),
}));

export const streamsRelations = relations(streams, ({ one, many }) => ({

    courses: many(courses),
    degree: one(degree, {
        fields: [streams.degreeIdFk],
        references: [degree.id]
    }),

}));


export const boardUniversitiesRelations = relations(boardUniversities, ({ one }) => ({
    address: one(address, {
        fields: [boardUniversities.addressId],
        references: [address.id]
    }),
    degree: one(degree, {
        fields: [boardUniversities.degreeId],
        references: [degree.id]
    }),
}));

export const degreeRelations = relations(degree, ({ many }) => ({
    boardUniversities: many(boardUniversities),
    streams: many(streams),
    institutions: many(institutions),
}));

