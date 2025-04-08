import { query } from "@/db";
import { DbCourseMaterial } from "@/types/academics/course-material";

export async function findCourseMaterialBySubject(subjectId: number) {
    const sqlQuery = `
        SELECT
            cm.id,
            cm.subject_id_fk,
            cm.title,
            cm.url,
            cm.type,
            cm.file_path,
            cm.created_at,
            cm.updated_at
        FROM
            course_material cm
        WHERE
            cm.subject_id_fk = ?
    `;
    const [courseMaterials] = await query(sqlQuery, [subjectId]) as [DbCourseMaterial[], unknown];

    return courseMaterials;
}