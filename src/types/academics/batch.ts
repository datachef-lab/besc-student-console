import { AcademicClass } from "./academic-class";
import { Course } from "./course";
import { Section } from "./section";
import { Shift } from "./shfit";

export interface DbBatch {
    readonly id?: number;
    courseId: number | null;
    classId: number | null;
    sectionId: number | null;
    shiftId: number | null;
    sessionId: number | null;
    instituteId: number | null;
}

export default interface Batch extends Omit<DbBatch, "courseId" | "classId" | "shiftId" | "sectionId"> {
    course: Course | null;
    academicClass: AcademicClass | null;
    section: Section | null;
    shift: Shift | null;
}