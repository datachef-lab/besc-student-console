import { query } from "@/db";
import { Course } from "@/types/academics/course";

export async function findAllCourse() {
    const sqlQuery = `SELECT * FROM course ORDER BY position`;
    const courses = await query(sqlQuery) as Course[];
    // console.log("courses", courses);
    return courses;
}