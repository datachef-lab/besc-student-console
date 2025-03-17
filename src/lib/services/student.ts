import { mysqlConnection } from "@/db";
import { DbStudent, Student } from "@/types/academics/student";
import { RowDataPacket } from "mysql2";
import { findNationalityById } from "./nationality";

export async function findStudentByEmail(email: string): Promise<Student | null> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
        `SELECT * FROM studentpersonaldetails WHERE institutionalemail = ?`,
        [email]
    );

    if (rows.length === 0) {
        return null;
    }

    const foundStudent = rows[0] as DbStudent;

    const nationality = await findNationalityById(foundStudent.nationalityId);

    let formattedStudent: Student = {
        ...foundStudent,
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