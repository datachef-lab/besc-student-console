import { AcademicClass } from "./academic-class";
import { Course } from "./course";
import { Section } from "./section";

export interface DbBatch {
    readonly id?: number;
    courseId: number;
    classId: number;
    sectionId: number;
    sessionId: number;
    instituteId: number;
}

export default interface Batch extends Omit<DbBatch, "courseId" | "classId" | "sectionId"> {
    course: Course;
    academicClass: AcademicClass;
    section: Section;
}