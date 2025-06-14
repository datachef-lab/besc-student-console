import {dbPostgres} from "@/db";
import { admissionCourseApplication, AdmissionCourseApplication } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function createAdmissionCourse(givenCourse: AdmissionCourseApplication) {
    const [existingEntry] = await dbPostgres
        .select()
        .from(admissionCourseApplication)
        .where(
            and(
                eq(admissionCourseApplication.applicationFormId, givenCourse.applicationFormId),
                eq(admissionCourseApplication.courseId, givenCourse.courseId),
            )
        );

    if (existingEntry) {
        return { course: existingEntry, message: "Course already exists." };
    }

    const [newCourse] = await dbPostgres
        .insert(admissionCourseApplication)
        .values(givenCourse)
        .returning();

    return {
        course: newCourse,
        message: "New Admission Course Created!"
    };
}

// ✅ Read by ID
export async function findAdmissionCourseById(id: number) {
    const [course] = await dbPostgres
        .select()
        .from(admissionCourseApplication)
        .where(eq(admissionCourseApplication.id, id));

    return course || null;
}

// ✅ Read by Application Form ID
export async function findAdmissionCoursesByApplicationFormId(applicationFormId: number) {
    const courses = await dbPostgres
        .select()
        .from(admissionCourseApplication)
        .where(eq(admissionCourseApplication.applicationFormId, applicationFormId));

    return courses;
}

// ✅ Update
export async function updateAdmissionCourse(course: AdmissionCourseApplication) {
    if (!course.id) return null;

    const [updatedCourse] = await dbPostgres
        .update(admissionCourseApplication)
        .set(course)
        .where(eq(admissionCourseApplication.id, course.id))
        .returning();

    return updatedCourse;
}

// ✅ Delete
export async function deleteAdmissionCourse(id: number) {
    const deleted = await dbPostgres
        .delete(admissionCourseApplication)
        .where(eq(admissionCourseApplication.id, id));

    return deleted.length > 0;
}

export async function findCourseApplicationByApplicationFormId(applicationFormId: number) {
    const results = await dbPostgres
        .select()
        .from(admissionCourseApplication)
        .where(eq(admissionCourseApplication.applicationFormId, applicationFormId));

    return results;
}