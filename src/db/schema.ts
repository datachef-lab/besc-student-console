
import { pgTable, foreignKey, serial, integer, varchar, timestamp, unique, boolean, date, numeric, text, pgEnum } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod";
import z from "zod";



export const boardResultType = pgEnum("board_result_type", ['FAIL', 'PASS'])

export const classType = pgEnum("class_type", ['YEAR', 'SEMESTER'])
export const communityType = pgEnum("community_type", ['GUJARATI', 'NON-GUJARATI'])
export const degreeLevelType = pgEnum("degree_level_type", ['SECONDARY', 'HIGHER_SECONDARY', 'UNDER_GRADUATE', 'POST_GRADUATE'])
export const degreeProgrammeType = pgEnum("degree_programme_type", ['HONOURS', 'GENERAL'])
export const disabilityType = pgEnum("disability_type", ['VISUAL', 'HEARING_IMPAIRMENT', 'VISUAL_IMPAIRMENT', 'ORTHOPEDIC', 'OTHER'])
export const frameworkType = pgEnum("framework_type", ['CCF', 'CBCS'])
export const genderType = pgEnum("gender_type", ['MALE', 'FEMALE', 'TRANSGENDER'])
export const localityType = pgEnum("locality_type", ['RURAL', 'URBAN'])
export const marksheetSource = pgEnum("marksheet_source", ['FILE_UPLOAD', 'ADDED'])
export const paperModeType = pgEnum("paper_mode_type", ['THEORETICAL', 'PRACTICAL', 'VIVA', 'ASSIGNMENT', 'PROJECT', 'MCQ'])
export const parentType = pgEnum("parent_type", ['BOTH', 'FATHER_ONLY', 'MOTHER_ONLY'])
export const placeOfStayType = pgEnum("place_of_stay_type", ['OWN', 'HOSTEL', 'FAMILY_FRIENDS', 'PAYING_GUEST', 'RELATIVES'])
export const subjectCategoryType = pgEnum("subject_category_type", ['SPECIAL', 'COMMON', 'HONOURS', 'GENERAL', 'ELECTIVE'])
export const subjectStatus = pgEnum("subject_status", ['PASS', 'FAIL', 'P', 'F', 'F(IN)', 'F(PR)', 'F(TH)'])
export const transportType = pgEnum("transport_type", ['BUS', 'TRAIN', 'METRO', 'AUTO', 'TAXI', 'CYCLE', 'WALKING', 'OTHER'])
export const userType = pgEnum("user_type", ['ADMIN', 'STUDENT', 'TEACHER'])


/**
 * The admission management system for this besc-student-console module
 */
export const admissionFormStatus = pgEnum("admission_form_status", [
    'DRAFT',
    'PAYMENT_DUE',
    'PAYMENT_SUCCESS',
    'PAYMENT_FAILED',
    'SUBMITTED',
    'APPROVED',
    'REJECTED',
    'CANCELLED',
    'WAITING_FOR_APPROVAL',
    'WAITING_FOR_PAYMENT',
    'WAITING_FOR_DOCUMENTS',
    'DOCUMENTS_VERIFIED',
    'DOCUMENTS_PENDING',
    'DOCUMENTS_REJECTED',
])

export const admissionSteps = pgEnum("admission_steps", [
    "GENERAL_INFORMATION",
    "ACADEMIC_INFORMATION",
    "COURSE_APPLICATION",
    "ADDITIONAL_INFORMATION",
    "DOCUMENTS",
    "PAYMENT",
    "REVIEW",
    "SUBMITTED",
]);

export const collegeDepartment = pgEnum("college_department", [
    "IT",
    "LIBRARY",
    "ADMINISTRATION",
    "HUMAN_RESOURCES",
    "MARKETING",
    "RESEARCH",
    "COMMUNICATION",
    "FINANCE",
    "LEGAL",
    "OPERATIONS",
    "SALES",
    "CUSTOMER_SERVICE",
]);

export const paymentStatus = pgEnum("payment_status", [
    "PENDING", "SUCCESS", "FAILED", "REFUNDED"
]);

export const personTitleType = pgEnum("person_title_type", [
    "MR", "MRS", "MS", "DR", "PROF", "REV", "OTHER"
]);

export const paymentMode = pgEnum("payment_mode", [
    "UPI", "WALLET", "NET_BANKING", "CREDIT_CARD", "DEBIT_CARD", "PAYTM_BALANCE"
]);

export const boardResultStatusType = pgEnum("board_result_status_type", [
    'PASS',
    'FAIL',
    "COMPARTMENTAL",
]);

export const subjectResultStatusType = pgEnum("board_result_status_type", [
    'PASS',
    'FAIL IN THEORY',
    'FAIL IN PRACTICAL',
    "FAIL",
]);

export const streamType = pgEnum("stream_type", [
    'SCIENCE',
    'COMMERCE',
    "ARTS",
]);

export const admissions = pgTable("admissions", {
    id: serial().primaryKey().notNull(),
    year: integer("year").notNull(),
    isClosed: boolean("is_closed").default(false).notNull(),
    isArchived: boolean("archived").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    remarks: text("remarks"),
});
export const createAdmissionSchema = createInsertSchema(admissions);
export type Admission = z.infer<typeof createAdmissionSchema>;

export const applicationForms = pgTable("application_forms", {
    id: serial().primaryKey().notNull(),
    admissionId: integer("admission_id_fk")
        .references(() => admissions.id)
        .notNull(),
    formStatus: admissionFormStatus("form_status").notNull(),
    admissionStep: admissionSteps("admission_step").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    remarks: text("remarks"),
});
export const createApplicationFormSchema = createInsertSchema(applicationForms);
export type ApplicationForm = z.infer<typeof createApplicationFormSchema>;

export const payments = pgTable("payments", {
    id: serial("id").primaryKey(),
    applicationFormId: integer("application_form_id_fk")
        .references(() => applicationForms.id)
        .notNull(),

    orderId: varchar("order_id", { length: 100 }).notNull(),
    transactionId: varchar("transaction_id", { length: 100 }),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),

    status: paymentStatus("status").notNull().default("PENDING"),
    paymentMode: paymentMode("payment_mode"),
    bankTxnId: varchar("bank_txn_id", { length: 100 }),
    gatewayName: varchar("gateway_name", { length: 50 }),
    txnDate: timestamp("txn_date"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    remarks: text("remarks"),
});
export const createPaymentSchema = createInsertSchema(payments);
export type Payment = z.infer<typeof createPaymentSchema>;

export const admissionGeneralInfo = pgTable("admission_general_info", {
    id: serial("id").primaryKey(),
    applicationFormId: integer("application_form_id_fk")
        .references(() => applicationForms.id)
        .notNull(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    middleName: varchar("middle_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    dateOfBirth: date("date_of_birth").notNull(),
    nationalityId: integer("nationality_id_fk").references(() => nationality.id),
    otherNationality: varchar("other_nationality", { length: 255 }),
    isGujarati: boolean("is_gujarati").default(false),
    categoryId: integer("category_id_fk").references(() => categories.id),
    religionId: integer("religion_id_fk").references(() => religion.id),
    gender: genderType().default("MALE"),
    degreeId: integer("degree_id_fk").references(() => degree.id),
    password: varchar("password", { length: 255 }).notNull(),
    whatsappNumber: varchar("whatsapp_number", { length: 15 }),
    mobileNumber: varchar("mobile_number", { length: 15 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
export const createAdmissionGeneralInfoSchema = createInsertSchema(admissionGeneralInfo);
export type AdmissionGeneralInfo = z.infer<typeof createAdmissionGeneralInfoSchema>;

export const admissionAcademicInfo = pgTable("admission_academic_info", {
    id: serial("id").primaryKey(),
    applicationFormId: integer("application_form_id_fk")
        .references(() => applicationForms.id)
        .notNull(),
    boardUniversityId: integer("board_university_id_fk")
        .references(() => boardUniversities.id)
        .notNull(),
    boardResultStatus: boardResultStatusType("board_result_status").notNull(),
    uid: varchar("uid", { length: 255 }),
    indexNumber: varchar("index_number", { length: 255 }),
    instituteId: integer("institute_id_fk")
        .references(() => institutions.id)
        .notNull(),
    otherInstitute: varchar("other_institute", { length: 500 }),
    languageMediumId: integer("language_medium_id_fk")
        .references(() => languageMedium.id)
        .notNull(),
    yearOfPassing: integer("year_of_passing").notNull(),
    streamType: streamType("stream_type").notNull(),
    isRegisteredForUGInCU: boolean("is_registered_for_ug_in_cu").default(false),
    cuRegistrationNumber: varchar("cu_registration_number", { length: 255 }),
    previouslyRegisteredCourseId: integer("previously_registered_course_id_fk")
        .references(() => courses.id),
    otherPreviouslyRegisteredCourse: varchar("other_previously_registered_course", { length: 500 }),
    previousCollegeId: integer("previous_college_id_fk")
        .references(() => colleges.id),
    otherCollege: varchar("other_college", { length: 500 }),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
export const createAdmissionAcademicInfoSchema = createInsertSchema(admissionAcademicInfo);
export type AdmissionAcademicInfo = z.infer<typeof createAdmissionAcademicInfoSchema>;

export const studentAcademicSubjects = pgTable("student_academic_subjects", {
    id: serial("id").primaryKey(),
    admissionAcademicInfoId: integer("admission_academic_info_id_fk")
        .references(() => admissionAcademicInfo.id)
        .notNull(),
    academicSubjectId: integer("academic_subject_id_fk")
        .references(() => academicSubjects.id)
        .notNull(),
    fullMarks: numeric("full_marks", { precision: 10, scale: 2 }).notNull(),
    totalMarks: numeric("total_marks", { precision: 10, scale: 2 }).notNull(),
    resultStatus: subjectResultStatusType("result_status").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
export const createStudentAcademicSubjectsSchema = createInsertSchema(studentAcademicSubjects);
export type StudentAcademicSubjects = z.infer<typeof createStudentAcademicSubjectsSchema>;

export const academicSubjects = pgTable("academic_subjects", {
    id: serial("id").primaryKey(),
    boardUniversityId: integer("board_university_id_fk"),
    name: varchar("name", { length: 500 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
export const createAcademicSubjects = createInsertSchema(academicSubjects);
export type AcademicSubjects = z.infer<typeof createAcademicSubjects>;

export const colleges = pgTable("colleges", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 500 }).notNull(),
    code: varchar("code", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
export const createCollegesSchema = createInsertSchema(colleges);
export type Colleges = z.infer<typeof createCollegesSchema>;

export const admissionCourseApplication = pgTable("admission_course_applications", {
    id: serial("id").primaryKey(),
    applicationFormId: integer("application_form_id_fk")
        .references(() => applicationForms.id)
        .notNull(),
    courseId: integer("course_id_fk")
        .references(() => courses.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
export const createAdmissionCourseApplicationSchema = createInsertSchema(admissionCourseApplication);
export type AdmissionCourseApplication = z.infer<typeof createAdmissionCourseApplicationSchema>;

export const admissionAdditionalInfo = pgTable("admission_additional_info", {
    id: serial("id").primaryKey(),
    applicationFormId: integer("application_form_id_fk")
        .references(() => applicationForms.id)
        .notNull(),
    alternateMobileNumber: varchar("alternate_mobile_number", { length: 255 }),
    bloodGroupId: integer("blood_group_id_fk")
        .references(() => bloodGroup.id)
        .notNull(),
    religionId: integer("religion_id_fk")
        .references(() => religion.id)
        .notNull(),
    categoryId: integer("category_id_fk")
        .references(() => categories.id)
        .notNull(),
    isPhysicallyChallenged: boolean("is_physically_challenged").default(false),
    disabilityType: disabilityType("disability_type"),
    isSingleParent: boolean("is_single_parent").default(false),
    fatherTitle: personTitleType("father_title"),
    fatherName: varchar("father_name", { length: 255 }),
    motherTitle: personTitleType("mother_title"),
    motherName: varchar("mother_name", { length: 255 }),
    isEitherParentStaff: boolean("is_either_parent_staff").default(false),
    nameOfStaffParent: varchar("name_of_staff_parent", { length: 255 }),
    departmentOfStaffParent: collegeDepartment("department_of_staff_parent"),
    hasSmartphone: boolean("has_smartphone").default(false),
    hasLaptopOrDesktop: boolean("has_laptop_or_desktop").default(false),
    hasInternetAccess: boolean("has_internet_access").default(false),
    annualIncomeId: integer("annual_income_id_fk")
        .references(() => annualIncomes.id)
        .notNull(),
    applyUnderNCCCategory: boolean("apply_under_ncc_category").default(false),
    applyUnderSportsCategory: boolean("apply_under_sports_category").default(false),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
export const createAdmissionAdditionalInfoSchema = createInsertSchema(admissionAdditionalInfo);
export type AdmissionAdditionalInfo = z.infer<typeof createAdmissionAdditionalInfoSchema>;
















/**
 * These schemas are already existing in the database.
 */



export const address = pgTable("address", {
    id: serial().primaryKey().notNull(),
    countryIdFk: integer("country_id_fk"),
    stateIdFk: integer("state_id_fk"),
    cityIdFk: integer("city_id_fk"),
    addressLine: varchar("address_line", { length: 1000 }),
    landmark: varchar({ length: 255 }),
    localityType: localityType("locality_type"),
    phone: varchar({ length: 255 }),
    pincode: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
        columns: [table.cityIdFk],
        foreignColumns: [cities.id],
        name: "address_city_id_fk_cities_id_fk"
    }),
    foreignKey({
        columns: [table.countryIdFk],
        foreignColumns: [countries.id],
        name: "address_country_id_fk_countries_id_fk"
    }),
    foreignKey({
        columns: [table.stateIdFk],
        foreignColumns: [states.id],
        name: "address_state_id_fk_states_id_fk"
    }),
]);

export const cities = pgTable("cities", {
    id: serial().primaryKey().notNull(),
    stateId: integer("state_id").notNull(),
    name: varchar({ length: 255 }).notNull(),
    documentRequired: boolean("document_required").default(false).notNull(),
    code: varchar({ length: 10 }).notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
        columns: [table.stateId],
        foreignColumns: [states.id],
        name: "cities_state_id_states_id_fk"
    }),
    unique("cities_name_unique").on(table.name),
    unique("cities_code_unique").on(table.code),
]);

// export const batches = pgTable("batches", {
//     id: serial().primaryKey().notNull(),
//     courseIdFk: integer("course_id_fk").notNull(),
//     classIdFk: integer("class_id_fk").notNull(),
//     sectionIdFk: integer("section_id_fk"),
//     shiftIdFk: integer("shift_id_fk"),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
//     sessionIdFk: integer("session_id_fk"),
// }, (table) => [
//     foreignKey({
//         columns: [table.classIdFk],
//         foreignColumns: [classes.id],
//         name: "batches_class_id_fk_classes_id_fk"
//     }),
//     foreignKey({
//         columns: [table.courseIdFk],
//         foreignColumns: [courses.id],
//         name: "batches_course_id_fk_courses_id_fk"
//     }),
//     foreignKey({
//         columns: [table.sectionIdFk],
//         foreignColumns: [sections.id],
//         name: "batches_section_id_fk_sections_id_fk"
//     }),
//     foreignKey({
//         columns: [table.sessionIdFk],
//         foreignColumns: [sessions.id],
//         name: "batches_session_id_fk_sessions_id_fk"
//     }),
//     foreignKey({
//         columns: [table.shiftIdFk],
//         foreignColumns: [shifts.id],
//         name: "batches_shift_id_fk_shifts_id_fk"
//     }),
// ]);

// export const academicIdentifiers = pgTable("academic_identifiers", {
//     id: serial().primaryKey().notNull(),
//     studentIdFk: integer("student_id_fk").notNull(),
//     rfid: varchar({ length: 255 }),
//     streamIdFk: integer("stream_id_fk"),
//     shiftIdFk: integer("shift_id_fk"),
//     cuFormNumber: varchar("cu_form_number", { length: 255 }),
//     uid: varchar({ length: 255 }),
//     oldUid: varchar("old_uid", { length: 255 }),
//     registrationNumber: varchar("registration_number", { length: 255 }),
//     rollNumber: varchar("roll_number", { length: 255 }),
//     sectionIdFk: integer("section_id_fk"),
//     classRollNumber: varchar("class_roll_number", { length: 255 }),
//     apaarId: varchar("apaar_id", { length: 255 }),
//     abcId: varchar("abc_id", { length: 255 }),
//     apprid: varchar({ length: 255 }),
//     checkRepeat: boolean("check_repeat"),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.sectionIdFk],
//         foreignColumns: [sections.id],
//         name: "academic_identifiers_section_id_fk_sections_id_fk"
//     }),
//     foreignKey({
//         columns: [table.shiftIdFk],
//         foreignColumns: [shifts.id],
//         name: "academic_identifiers_shift_id_fk_shifts_id_fk"
//     }),
//     foreignKey({
//         columns: [table.streamIdFk],
//         foreignColumns: [streams.id],
//         name: "academic_identifiers_stream_id_fk_streams_id_fk"
//     }),
//     foreignKey({
//         columns: [table.studentIdFk],
//         foreignColumns: [students.id],
//         name: "academic_identifiers_student_id_fk_students_id_fk"
//     }),
//     unique("academic_identifiers_student_id_fk_unique").on(table.studentIdFk),
// ]);

// export const accommodation = pgTable("accommodation", {
//     id: serial().primaryKey().notNull(),
//     studentIdFk: integer("student_id_fk"),
//     placeOfStay: placeOfStayType("place_of_stay"),
//     addressIdFk: integer("address_id_fk"),
//     startDate: date("start_date"),
//     endDate: date("end_date"),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.addressIdFk],
//         foreignColumns: [address.id],
//         name: "accommodation_address_id_fk_address_id_fk"
//     }),
//     foreignKey({
//         columns: [table.studentIdFk],
//         foreignColumns: [students.id],
//         name: "accommodation_student_id_fk_students_id_fk"
//     }),
//     unique("accommodation_student_id_fk_unique").on(table.studentIdFk),
// ]);

export const boardUniversities = pgTable("board_universities", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 700 }).notNull(),
    degreeId: integer("degree_id"),
    passingMarks: integer("passing_marks"),
    code: varchar({ length: 255 }),
    addressId: integer("address_id_fk").references(() => address.id),
    sequence: integer(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
        columns: [table.degreeId],
        foreignColumns: [degree.id],
        name: "board_universities_degree_id_degree_id_fk"
    }),
    unique("board_universities_name_unique").on(table.name),
    unique("board_universities_sequence_unique").on(table.sequence),
]);

// export const admissions = pgTable("admissions", {
//     id: serial().primaryKey().notNull(),
//     studentIdFk: integer("student_id_fk").notNull(),
//     applicationNumber: varchar("application_number", { length: 255 }),
//     applicantSignature: varchar("applicant_signature", { length: 255 }),
//     yearOfAdmission: integer("year_of_admission"),
//     admissionDate: date("admission_date"),
//     admissionCode: varchar("admission_code", { length: 255 }),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.studentIdFk],
//         foreignColumns: [students.id],
//         name: "admissions_student_id_fk_students_id_fk"
//     }),
//     unique("admissions_student_id_fk_unique").on(table.studentIdFk),
// ]);

// export const batchPapers = pgTable("batch_papers", {
//     id: serial().primaryKey().notNull(),
//     batchIdFk: integer("batch_id_fk").notNull(),
//     paperIdFk: integer("paper_id_fk").notNull(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.batchIdFk],
//         foreignColumns: [batches.id],
//         name: "batch_papers_batch_id_fk_batches_id_fk"
//     }),
//     foreignKey({
//         columns: [table.paperIdFk],
//         foreignColumns: [papers.id],
//         name: "batch_papers_paper_id_fk_papers_id_fk"
//     }),
// ]);

export const annualIncomes = pgTable("annual_incomes", {
    id: serial().primaryKey().notNull(),
    range: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const bloodGroup = pgTable("blood_group", {
    id: serial().primaryKey().notNull(),
    type: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("blood_group_type_unique").on(table.type),
]);

export const categories = pgTable("categories", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    documentRequired: boolean("document_required"),
    code: varchar({ length: 10 }).notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("categories_name_unique").on(table.name),
    unique("categories_code_unique").on(table.code),
]);

// export const disabilityCodes = pgTable("disability_codes", {
//     id: serial().primaryKey().notNull(),
//     code: varchar({ length: 255 }).notNull(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     unique("disability_codes_code_unique").on(table.code),
// ]);

export const countries = pgTable("countries", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    sequence: integer(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("countries_name_unique").on(table.name),
]);

// export const classes = pgTable("classes", {
//     id: serial().primaryKey().notNull(),
//     name: varchar({ length: 500 }).notNull(),
//     type: classType().notNull(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// });

export const courses = pgTable("courses", {
    id: serial().primaryKey().notNull(),

    name: varchar({ length: 500 }).notNull(),
    shortName: varchar("short_name", { length: 500 }),
    codePrefix: varchar("code_prefix", { length: 10 }),
    universityCode: varchar("university_code", { length: 10 }),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

// export const documents = pgTable("documents", {
//     id: serial().primaryKey().notNull(),
//     name: varchar({ length: 255 }).notNull(),
//     description: varchar({ length: 255 }),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     unique("documents_name_unique").on(table.name),
// ]);

// export const familyDetails = pgTable("family_details", {
//     id: serial().primaryKey().notNull(),
//     studentIdFk: integer("student_id_fk").notNull(),
//     parentType: parentType("parent_type"),
//     fatherDetailsPersonIdFk: integer("father_details_person_id_fk"),
//     motherDetailsPersonIdFk: integer("mother_details_person_id_fk"),
//     guardianDetailsPersonIdFk: integer("guardian_details_person_id_fk"),
//     annualIncomeIdFk: integer("annual_income_id_fk"),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.annualIncomeIdFk],
//         foreignColumns: [annualIncomes.id],
//         name: "family_details_annual_income_id_fk_annual_incomes_id_fk"
//     }),
//     foreignKey({
//         columns: [table.fatherDetailsPersonIdFk],
//         foreignColumns: [person.id],
//         name: "family_details_father_details_person_id_fk_person_id_fk"
//     }),
//     foreignKey({
//         columns: [table.guardianDetailsPersonIdFk],
//         foreignColumns: [person.id],
//         name: "family_details_guardian_details_person_id_fk_person_id_fk"
//     }),
//     foreignKey({
//         columns: [table.motherDetailsPersonIdFk],
//         foreignColumns: [person.id],
//         name: "family_details_mother_details_person_id_fk_person_id_fk"
//     }),
//     foreignKey({
//         columns: [table.studentIdFk],
//         foreignColumns: [students.id],
//         name: "family_details_student_id_fk_students_id_fk"
//     }),
//     unique("family_details_student_id_fk_unique").on(table.studentIdFk),
// ]);

export const languageMedium = pgTable("language_medium", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("language_medium_name_unique").on(table.name),
]);

// export const emergencyContacts = pgTable("emergency_contacts", {
//     id: serial().primaryKey().notNull(),
//     studentIdFk: integer("student_id_fk"),
//     personName: varchar("person_name", { length: 255 }),
//     relationToStudent: varchar("relation_to_student", { length: 255 }),
//     email: varchar({ length: 255 }),
//     phone: varchar({ length: 255 }),
//     officePhone: varchar("office_phone", { length: 255 }),
//     residentialPhone: varchar("residential_phone", { length: 255 }),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.studentIdFk],
//         foreignColumns: [students.id],
//         name: "emergency_contacts_student_id_fk_students_id_fk"
//     }),
// ]);

// export const health = pgTable("health", {
//     id: serial().primaryKey().notNull(),
//     studentIdFk: integer("student_id_fk"),
//     bloodGroupIdFk: integer("blood_group_id_fk"),
//     eyePowerLeft: numeric("eye_power_left"),
//     eyePowerRight: numeric("eye_power_right"),
//     height: numeric(),
//     width: numeric(),
//     pastMedicalHistory: text("past_medical_history"),
//     pastSurgicalHistory: text("past_surgical_history"),
//     drugAllergy: text("drug_allergy"),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.bloodGroupIdFk],
//         foreignColumns: [bloodGroup.id],
//         name: "health_blood_group_id_fk_blood_group_id_fk"
//     }),
//     foreignKey({
//         columns: [table.studentIdFk],
//         foreignColumns: [students.id],
//         name: "health_student_id_fk_students_id_fk"
//     }),
//     unique("health_student_id_fk_unique").on(table.studentIdFk),
// ]);

// export const offeredSubjects = pgTable("offered_subjects", {
//     id: serial().primaryKey().notNull(),
//     subjectMetadataIdFk: integer("subject_metadata_id_fk").notNull(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.subjectMetadataIdFk],
//         foreignColumns: [subjectMetadatas.id],
//         name: "offered_subjects_subject_metadata_id_fk_subject_metadatas_id_fk"
//     }),
// ]);

// export const sessions = pgTable("sessions", {
//     id: serial().primaryKey().notNull(),
//     name: varchar({ length: 255 }).notNull(),
//     from: date().notNull(),
//     to: date().notNull(),
//     isCurrentSession: boolean("is_current_session").default(false).notNull(),
//     codePrefix: varchar("code_prefix", { length: 255 }),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// });

// export const marksheets = pgTable("marksheets", {
//     id: serial().primaryKey().notNull(),
//     studentIdFk: integer("student_id_fk").notNull(),
//     semester: integer().notNull(),
//     year: integer().notNull(),
//     sgpa: numeric(),
//     cgpa: numeric(),
//     classification: varchar({ length: 255 }),
//     remarks: varchar({ length: 255 }),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
//     source: marksheetSource(),
//     file: varchar({ length: 700 }),
//     createdByUserId: integer("created_by_user_id").notNull(),
//     updatedByUserId: integer("updated_by_user_id").notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.createdByUserId],
//         foreignColumns: [users.id],
//         name: "marksheets_created_by_user_id_users_id_fk"
//     }),
//     foreignKey({
//         columns: [table.studentIdFk],
//         foreignColumns: [students.id],
//         name: "marksheets_student_id_fk_students_id_fk"
//     }),
//     foreignKey({
//         columns: [table.updatedByUserId],
//         foreignColumns: [users.id],
//         name: "marksheets_updated_by_user_id_users_id_fk"
//     }),
// ]);

export const nationality = pgTable("nationality", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    sequence: integer(),
    code: integer(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("nationality_sequence_unique").on(table.sequence),
]);

// export const papers = pgTable("papers", {
//     id: serial().primaryKey().notNull(),
//     offeredSubjectId: integer("offered_subject_id").notNull(),
//     name: varchar({ length: 500 }),
//     shortName: varchar("short_name", { length: 500 }),
//     mode: paperModeType(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
//     displayName: varchar("display_name", { length: 500 }),
// }, (table) => [
//     foreignKey({
//         columns: [table.offeredSubjectId],
//         foreignColumns: [offeredSubjects.id],
//         name: "papers_offered_subject_id_offered_subjects_id_fk"
//     }),
// ]);

// export const person = pgTable("person", {
//     id: serial().primaryKey().notNull(),
//     name: varchar({ length: 255 }),
//     email: varchar({ length: 255 }),
//     phone: varchar({ length: 255 }),
//     aadhaarCardNumber: varchar("aadhaar_card_number", { length: 255 }),
//     image: varchar({ length: 255 }),
//     qualificationIdFk: integer("qualification_id_fk"),
//     occupationIdFk: integer("occupation_id_fk"),
//     officeAddresIdFk: integer("office_addres_id_fk"),
//     officePhone: varchar("office_phone", { length: 255 }),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.occupationIdFk],
//         foreignColumns: [occupations.id],
//         name: "person_occupation_id_fk_occupations_id_fk"
//     }),
//     foreignKey({
//         columns: [table.officeAddresIdFk],
//         foreignColumns: [address.id],
//         name: "person_office_addres_id_fk_address_id_fk"
//     }),
//     foreignKey({
//         columns: [table.qualificationIdFk],
//         foreignColumns: [qualifications.id],
//         name: "person_qualification_id_fk_qualifications_id_fk"
//     }),
// ]);

export const occupations = pgTable("occupations", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("occupations_name_unique").on(table.name),
]);

// export const qualifications = pgTable("qualifications", {
//     id: serial().primaryKey().notNull(),
//     name: varchar({ length: 255 }).notNull(),
//     sequence: integer(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     unique("qualifications_name_unique").on(table.name),
//     unique("qualifications_sequence_unique").on(table.sequence),
// ]);

// export const personalDetails = pgTable("personal_details", {
//     id: serial().primaryKey().notNull(),
//     studentIdFk: integer("student_id_fk").notNull(),
//     nationalityIdFk: integer("nationality_id_fk"),
//     otherNationalityIdFk: integer("other_nationality_id_fk"),
//     aadhaarCardNumber: varchar("aadhaar_card_number", { length: 16 }),
//     religionIdFk: integer("religion_id_fk"),
//     categoryIdFk: integer("category_id_fk"),
//     motherTongueLanguageMediumIdFk: integer("mother_tongue_language_medium_id_fk"),
//     dateOfBirth: date("date_of_birth"),
//     gender: genderType(),
//     email: varchar({ length: 255 }),
//     alternativeEmail: varchar("alternative_email", { length: 255 }),
//     mailingAddressIdFk: integer("mailing_address_id_fk"),
//     residentialAddressIdFk: integer("residential_address_id_fk"),
//     disability: disabilityType(),
//     disablityCodeIdFk: integer("disablity_code_id_fk"),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.categoryIdFk],
//         foreignColumns: [categories.id],
//         name: "personal_details_category_id_fk_categories_id_fk"
//     }),
//     foreignKey({
//         columns: [table.disablityCodeIdFk],
//         foreignColumns: [disabilityCodes.id],
//         name: "personal_details_disablity_code_id_fk_disability_codes_id_fk"
//     }),
//     foreignKey({
//         columns: [table.mailingAddressIdFk],
//         foreignColumns: [address.id],
//         name: "personal_details_mailing_address_id_fk_address_id_fk"
//     }),
//     foreignKey({
//         columns: [table.motherTongueLanguageMediumIdFk],
//         foreignColumns: [languageMedium.id],
//         name: "personal_details_mother_tongue_language_medium_id_fk_language_m"
//     }),
//     foreignKey({
//         columns: [table.nationalityIdFk],
//         foreignColumns: [nationality.id],
//         name: "personal_details_nationality_id_fk_nationality_id_fk"
//     }),
//     foreignKey({
//         columns: [table.otherNationalityIdFk],
//         foreignColumns: [nationality.id],
//         name: "personal_details_other_nationality_id_fk_nationality_id_fk"
//     }),
//     foreignKey({
//         columns: [table.religionIdFk],
//         foreignColumns: [religion.id],
//         name: "personal_details_religion_id_fk_religion_id_fk"
//     }),
//     foreignKey({
//         columns: [table.residentialAddressIdFk],
//         foreignColumns: [address.id],
//         name: "personal_details_residential_address_id_fk_address_id_fk"
//     }),
//     foreignKey({
//         columns: [table.studentIdFk],
//         foreignColumns: [students.id],
//         name: "personal_details_student_id_fk_students_id_fk"
//     }),
// ]);

export const religion = pgTable("religion", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    sequence: integer(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("religion_name_unique").on(table.name),
    unique("religion_sequence_unique").on(table.sequence),
]);

// export const pickupPoint = pgTable("pickup_point", {
//     id: serial().primaryKey().notNull(),
//     name: varchar({ length: 255 }),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// });

export const streams = pgTable("streams", {
    id: serial().primaryKey().notNull(),
    framework: frameworkType(),
    degreeIdFk: integer("degree_id_fk").notNull(),
    degreeProgramme: degreeProgrammeType("degree_programme"),
    duration: integer(),
    numberOfSemesters: integer("number_of_semesters"),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
        columns: [table.degreeIdFk],
        foreignColumns: [degree.id],
        name: "streams_degree_id_fk_degree_id_fk"
    }),
]);

// export const shifts = pgTable("shifts", {
//     id: serial().primaryKey().notNull(),
//     name: varchar({ length: 500 }).notNull(),
//     codePrefix: varchar("code_prefix", { length: 10 }).notNull(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// });

export const states = pgTable("states", {
    id: serial().primaryKey().notNull(),
    countryId: integer("country_id").notNull(),
    name: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
        columns: [table.countryId],
        foreignColumns: [countries.id],
        name: "states_country_id_countries_id_fk"
    }),
    unique("states_name_unique").on(table.name),
]);

// export const studentPapers = pgTable("student_papers", {
//     id: serial().primaryKey().notNull(),
//     studentIdFk: integer("student_id_fk").notNull(),
//     batchPaperIdFk: integer("batch_paper_id_fk").notNull(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.batchPaperIdFk],
//         foreignColumns: [batchPapers.id],
//         name: "student_papers_batch_paper_id_fk_batch_papers_id_fk"
//     }),
//     foreignKey({
//         columns: [table.studentIdFk],
//         foreignColumns: [students.id],
//         name: "student_papers_student_id_fk_students_id_fk"
//     }),
// ]);

// export const subjectMetadatas = pgTable("subject_metadatas", {
//     id: serial().primaryKey().notNull(),
//     streamIdFk: integer("stream_id_fk").notNull(),
//     semester: integer().notNull(),
//     specializationIdFk: integer("specialization_id_fk"),
//     category: subjectCategoryType(),
//     subjectTypeIdFk: integer("subject_type_id_fk"),
//     irpCode: varchar("irp_code", { length: 255 }),
//     marksheetCode: varchar("marksheet_code", { length: 255 }).notNull(),
//     isOptional: boolean("is_optional").default(false),
//     credit: integer(),
//     fullMarksTheory: integer("full_marks_theory"),
//     fullMarksInternal: integer("full_marks_internal"),
//     fullMarksPractical: integer("full_marks_practical"),
//     fullMarksProject: integer("full_marks_project"),
//     fullMarksViva: integer("full_marks_viva"),
//     fullMarks: integer("full_marks").notNull(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
//     irpName: varchar("irp_name", { length: 500 }),
//     name: varchar({ length: 500 }),
//     theoryCredit: integer("theory_credit"),
//     practicalCredit: integer("practical_credit"),
//     internalCredit: integer("internal_credit"),
//     projectCredit: integer("project_credit"),
//     vivalCredit: integer("vival_credit"),
// }, (table) => [
//     foreignKey({
//         columns: [table.specializationIdFk],
//         foreignColumns: [specializations.id],
//         name: "subject_metadatas_specialization_id_fk_specializations_id_fk"
//     }),
//     foreignKey({
//         columns: [table.streamIdFk],
//         foreignColumns: [streams.id],
//         name: "subject_metadatas_stream_id_fk_streams_id_fk"
//     }),
//     foreignKey({
//         columns: [table.subjectTypeIdFk],
//         foreignColumns: [subjectTypes.id],
//         name: "subject_metadatas_subject_type_id_fk_subject_types_id_fk"
//     }),
// ]);

// export const transportDetails = pgTable("transport_details", {
//     id: serial().primaryKey().notNull(),
//     studentIdFk: integer("student_id_fk"),
//     transportIdFk: integer("transport_id_fk"),
//     pickupPointIdFk: integer("pickup_point_id_fk"),
//     seatNumber: varchar("seat_number", { length: 255 }),
//     pickupTime: time("pickup_time"),
//     dropOffTime: time("drop_off_time"),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.pickupPointIdFk],
//         foreignColumns: [pickupPoint.id],
//         name: "transport_details_pickup_point_id_fk_pickup_point_id_fk"
//     }),
//     foreignKey({
//         columns: [table.studentIdFk],
//         foreignColumns: [students.id],
//         name: "transport_details_student_id_fk_students_id_fk"
//     }),
//     foreignKey({
//         columns: [table.transportIdFk],
//         foreignColumns: [transport.id],
//         name: "transport_details_transport_id_fk_transport_id_fk"
//     }),
// ]);

// export const subjects = pgTable("subjects", {
//     id: serial().primaryKey().notNull(),
//     marksheetIdFk: integer("marksheet_id_fk"),
//     subjectMetadataIdFk: integer("subject_metadata_id_fk"),
//     year1: integer().notNull(),
//     year2: integer(),
//     internalMarks: integer("internal_marks"),
//     practicalMarks: integer("practical_marks"),
//     theoryMarks: integer("theory_marks"),
//     totalMarks: integer("total_marks"),
//     status: subjectStatus(),
//     ngp: numeric(),
//     tgp: numeric(),
//     letterGrade: varchar("letter_grade", { length: 255 }),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
//     internalYear: integer("internal_year"),
//     internalCredit: integer("internal_credit"),
//     practicalYear: integer("practical_year"),
//     practicalCredit: integer("practical_credit"),
//     theoryYear: integer("theory_year"),
//     theoryCredit: integer("theory_credit"),
//     vivalMarks: integer("vival_marks"),
//     vivalYear: integer("vival_year"),
//     vivalCredit: integer("vival_credit"),
//     projectMarks: integer("project_marks"),
//     projectYear: integer("project_year"),
//     projectCredit: integer("project_credit"),
//     totalCredits: integer("total_credits"),
// }, (table) => [
//     foreignKey({
//         columns: [table.marksheetIdFk],
//         foreignColumns: [marksheets.id],
//         name: "subjects_marksheet_id_fk_marksheets_id_fk"
//     }),
//     foreignKey({
//         columns: [table.subjectMetadataIdFk],
//         foreignColumns: [subjectMetadatas.id],
//         name: "subjects_subject_metadata_id_fk_subject_metadatas_id_fk"
//     }),
// ]);

// export const subjectTypes = pgTable("subject_types", {
//     id: serial().primaryKey().notNull(),
//     irpName: varchar("irp_name", { length: 500 }),
//     irpShortName: varchar("irp_short_name", { length: 500 }),
//     marksheetName: varchar("marksheet_name", { length: 500 }),
//     marksheetShortName: varchar("marksheet_short_name", { length: 500 }),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// });

// export const transport = pgTable("transport", {
//     id: serial().primaryKey().notNull(),
//     routeName: varchar("route_name", { length: 255 }),
//     mode: transportType().default('OTHER').notNull(),
//     vehicleNumber: varchar("vehicle_number", { length: 255 }),
//     driverName: varchar("driver_name", { length: 255 }),
//     providerDetails: varchar("provider_details", { length: 255 }),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// });

// export const academicHistory = pgTable("academic_history", {
//     id: serial().primaryKey().notNull(),
//     studentIdFk: integer("student_id_fk").notNull(),
//     lastInstitutionIdFk: integer("last_institution_id_fk"),
//     lastBoardUniversityIdFk: integer("last_board_university_id_fk"),
//     studiedUpToClass: integer("studied_up_to_class"),
//     passedYear: integer("passed_year"),
//     specializationId: integer("specialization_id"),
//     lastResultIdFk: integer("last_result_id_fk"),
//     remarks: varchar({ length: 255 }),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.lastBoardUniversityIdFk],
//         foreignColumns: [boardUniversities.id],
//         name: "academic_history_last_board_university_id_fk_board_universities"
//     }),
//     foreignKey({
//         columns: [table.lastInstitutionIdFk],
//         foreignColumns: [institutions.id],
//         name: "academic_history_last_institution_id_fk_institutions_id_fk"
//     }),
//     foreignKey({
//         columns: [table.lastResultIdFk],
//         foreignColumns: [boardResultStatus.id],
//         name: "academic_history_last_result_id_fk_board_result_status_id_fk"
//     }),
//     foreignKey({
//         columns: [table.specializationId],
//         foreignColumns: [specializations.id],
//         name: "academic_history_specialization_id_specializations_id_fk"
//     }),
//     foreignKey({
//         columns: [table.studentIdFk],
//         foreignColumns: [students.id],
//         name: "academic_history_student_id_fk_students_id_fk"
//     }),
// ]);

export const institutions = pgTable("institutions", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 700 }).notNull(),
    degreeId: integer("degree_id").notNull(),
    addressId: integer("address_id"),
    sequence: integer(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    foreignKey({
        columns: [table.addressId],
        foreignColumns: [address.id],
        name: "institutions_address_id_address_id_fk"
    }),
    foreignKey({
        columns: [table.degreeId],
        foreignColumns: [degree.id],
        name: "institutions_degree_id_degree_id_fk"
    }),
    unique("institutions_name_unique").on(table.name),
    unique("institutions_sequence_unique").on(table.sequence),
]);

// export const boardResultStatus = pgTable("board_result_status", {
//     id: serial().primaryKey().notNull(),
//     name: varchar({ length: 255 }).notNull(),
//     spclType: varchar("spcl_type", { length: 255 }).notNull(),
//     result: boardResultType(),
//     sequene: integer(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     unique("board_result_status_sequene_unique").on(table.sequene),
// ]);

// export const specializations = pgTable("specializations", {
//     id: serial().primaryKey().notNull(),
//     name: varchar({ length: 255 }).notNull(),
//     sequence: integer(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     unique("specializations_name_unique").on(table.name),
// ]);

// export const students = pgTable("students", {
//     id: serial().primaryKey().notNull(),
//     userIdFk: integer("user_id_fk").notNull(),
//     community: communityType(),
//     handicapped: boolean().default(false),
//     specializationIdFk: integer("specialization_id_fk"),
//     lastPassedYear: integer("last_passed_year"),
//     notes: text(),
//     active: boolean(),
//     alumni: boolean(),
//     leavingDate: timestamp("leaving_date", { mode: 'string' }),
//     leavingReason: text("leaving_reason"),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     foreignKey({
//         columns: [table.specializationIdFk],
//         foreignColumns: [specializations.id],
//         name: "students_specialization_id_fk_specializations_id_fk"
//     }),
//     foreignKey({
//         columns: [table.userIdFk],
//         foreignColumns: [users.id],
//         name: "students_user_id_fk_users_id_fk"
//     }),
// ]);

// export const sections = pgTable("sections", {
//     id: serial().primaryKey().notNull(),
//     name: varchar({ length: 500 }).notNull(),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// });

export const degree = pgTable("degree", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    level: degreeLevelType(),
    sequence: integer(),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("degree_name_unique").on(table.name),
    unique("degree_sequence_unique").on(table.sequence),
]);

// export const users = pgTable("users", {
//     id: serial().primaryKey().notNull(),
//     name: varchar({ length: 255 }).notNull(),
//     email: varchar({ length: 500 }).notNull(),
//     password: varchar({ length: 255 }).notNull(),
//     phone: varchar({ length: 255 }),
//     whatsappNumber: varchar("whatsapp_number", { length: 255 }),
//     image: varchar({ length: 255 }),
//     type: userType().default('STUDENT'),
//     disabled: boolean().default(false),
//     createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
//     unique("users_email_unique").on(table.email),
// ]);
