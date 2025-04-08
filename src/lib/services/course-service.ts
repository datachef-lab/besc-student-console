import { query } from "@/db";
import { Course } from "@/types/academics/course";

export async function findAllCourse() {
    const sqlQuery = `SELECT * FROM course;`;
    const [courses] = await query(sqlQuery) as [Course[], unknown];

    return courses;
}