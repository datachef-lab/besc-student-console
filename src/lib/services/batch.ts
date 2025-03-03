import { mysqlConnection } from "@/db";
import { AcademicClass } from "@/types/academics/academic-class";
import Batch, { DbBatch } from "@/types/academics/batch";
import { DbBatchPaper } from "@/types/academics/batch-paper";
import { Course } from "@/types/academics/course";
import { Section } from "@/types/academics/section";
import { Shift } from "@/types/academics/shfit";
import { StudentPaper } from "@/types/academics/student-paper";
import { RowDataPacket } from "mysql2";

export async function findAllBatches(page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize; // Starting point for pagination

    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
        `SELECT * 
        FROM studentpaperlinkingmain 
        ORDER BY id DESC 
        LIMIT ? 
        OFFSET ?`,
        [pageSize, offset]
    );

    return rows; // Return the paginated batch data in descending order
}

export async function findBatchByStudentId(studentId: number) {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(`
        SELECT * 
        FROM studentpaperlinkingstudentlist 
        WHERE studentId = ${studentId}
    `) as [StudentPaper[], unknown];

    if (rows.length === 0) return null;

    const [batchPaperTmpRows] = await mysqlConnection.query<RowDataPacket[]>(`
        SELECT * 
        FROM studentpaperlinkingpaperlist 
        WHERE ID = ${rows[0].parent_id}
    `) as [DbBatchPaper[], unknown];

    if (batchPaperTmpRows.length === 0) return null;

    const [batchTmpRows] = await mysqlConnection.query<RowDataPacket[]>(`
        SELECT * 
        FROM studentpaperlinkingmain 
        WHERE id = ${batchPaperTmpRows[0].parent_id}
    `) as [DbBatch[], unknown];

    if (batchTmpRows.length === 0) return null;

    const { classId, courseId, sectionId, shiftId, ...props } = batchTmpRows[0];

    const formattedBatch: Batch = {
        ...props,
        course: null,
        academicClass: null,
        section: null,
        shift: null
    }

    if (classId) {
        const [classes] = await mysqlConnection.query<RowDataPacket[]>(`
            SELECT * 
            FROM classes 
            WHERE id = ${classId}
        `) as [AcademicClass[], unknown];

        if (classes.length > 0) {
            formattedBatch.academicClass = classes[0];
        }
    }
    if (courseId) {
        const [courses] = await mysqlConnection.query<RowDataPacket[]>(`
            SELECT * 
            FROM course 
            WHERE id = ${courseId}
        `) as [Course[], unknown];

        if (courses.length > 0) {
            formattedBatch.course = courses[0];
        }
    }
    if (sectionId) {
        const [sections] = await mysqlConnection.query<RowDataPacket[]>(`
            SELECT * 
            FROM section 
            WHERE id = ${sectionId}
        `) as [Section[], unknown];

        if (sections.length > 0) {
            formattedBatch.section = sections[0];
        }
    }
    if (shiftId) {
        const [shifts] = await mysqlConnection.query<RowDataPacket[]>(`
            SELECT * 
            FROM shift 
            WHERE id = ${sectionId}
        `) as [Shift[], unknown];

        if (shifts.length > 0) {
            formattedBatch.shift = shifts[0];
        }
    }

    return formattedBatch;

}
