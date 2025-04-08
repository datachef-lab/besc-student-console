import { query } from "@/db";
import { AcademicClass } from "@/types/academics/academic-class";

export async function findAllClasses() {
    const sqlQuery = `SELECT * FROM classes;`;
    const [classes] = await query(sqlQuery) as [AcademicClass[], unknown];

    return classes;
}