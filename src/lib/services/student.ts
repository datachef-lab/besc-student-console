import { mysqlConnection } from "@/db";
import { Student } from "@/types/academics/student";
import { RowDataPacket } from "mysql2";

export async function findStudentByEmail(email: string): Promise<Student | null> {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
        `SELECT * FROM studentpersonaldetails WHERE institutionalemail = ?`,
        [email]
    );

    return rows.length > 0 ? (rows[0] as Student) : null; // Return student data if found, else return null
}