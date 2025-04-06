import { DbStudent, Student } from "@/types/academics/student";
import { RowDataPacket } from "mysql2";
import { findNationalityById } from "./nationality";
import { query } from "@/db";

export async function findStudentByEmail(email: string): Promise<Student | null> {
    try {
        const rows = await query<RowDataPacket[]>(
            `SELECT * FROM studentpersonaldetails WHERE institutionalemail = ?`,
            [email]
        );

        if (!rows || rows.length === 0) {
            return null;
        }

        const formattedStudent = await formatResponse(rows[0] as DbStudent);
        return formattedStudent;
    } catch (error) {
        console.error("Error finding student by email:", error);
        return null;
    }
}

export async function findStudentByUid(uid: string): Promise<Student | null> {
    try {
        // Don't log the function itself
        console.log("Looking up student with UID:", uid);

        const rows = await query<RowDataPacket[]>(
            `SELECT * FROM studentpersonaldetails WHERE codeNumber = ?`,
            [uid]
        );

        console.log("Query results:", rows);

        if (!rows || rows.length === 0) {
            console.log(`No student found with UID: ${uid}`);
            return null;
        }

        const formattedStudent = await formatResponse(rows[0] as DbStudent);
        return formattedStudent;
    } catch (error) {
        console.error("Error finding student by UID:", error);
        return null;
    }
}

export async function formatResponse(student: DbStudent | null) {
    if (!student) {
        return null;
    }

    try {
        const nationality = await findNationalityById(student.nationalityId);

        let formattedStudent: Student = {
            ...student,
            nationalityName: '',
            pos: null,
            code: null
        };

        if (nationality) {
            const { pos, code, nationalityName } = nationality;
            formattedStudent = { ...formattedStudent, pos, code, nationalityName };
        }

        return formattedStudent;
    } catch (error) {
        console.error("Error formatting student response:", error);
        // Still return the student data even if nationality lookup fails
        return {
            ...student,
            nationalityName: '',
            pos: null,
            code: null
        };
    }
}