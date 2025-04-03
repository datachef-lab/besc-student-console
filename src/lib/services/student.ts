import { mysqlConnection } from "@/db";
import { DbStudent, Student } from "@/types/academics/student";
import { RowDataPacket } from "mysql2";
import { findNationalityById } from "./nationality";

export async function findStudentByEmail(email: string): Promise<Student | null> {
    const [rows] = await mysqlConnection!.query<RowDataPacket[]>(
        `SELECT * FROM studentpersonaldetails WHERE institutionalemail = ?`,
        [email]
    );

    if (rows.length === 0) {
        return null;
    }

    const formattedStudent = formatResponse(rows[0] as DbStudent);

    return formattedStudent;
}

export async function findStudentByUid(uid: string): Promise<Student | null> {
    const [rows] = await mysqlConnection!.query<RowDataPacket[]>(
        `SELECT * FROM studentpersonaldetails WHERE codeNumber = ?`,
        [uid]
    );

    if (rows.length === 0) {
        return null;
    }

    const formattedStudent = formatResponse(rows[0] as DbStudent);

    return formattedStudent; // Return student data if found, else return null
}

export async function formatResponse(student: DbStudent | null) {
    if (!student) {
        return null;
    }

    const nationality = await findNationalityById(student.nationalityId);

    let formattedStudent: Student = {
        ...student,
        nationalityName: '',
        pos: null,
        code: null
    }

    if (nationality) {
        const { pos, code, nationalityName } = nationality;
        formattedStudent = { ...formattedStudent, pos, code, nationalityName, }
    }

    return formattedStudent; // Return student data if found, else return null
}