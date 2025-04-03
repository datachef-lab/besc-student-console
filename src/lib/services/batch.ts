import { mysqlConnection } from "@/db";
import Batch from "@/types/academics/batch";
import { BatchPaper } from "@/types/academics/batch-paper";

import { RowDataPacket } from "mysql2";

export async function findAllBatches(page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize; // Starting point for pagination

    const [rows] = await mysqlConnection!.query<RowDataPacket[]>(
        `SELECT * 
        FROM studentpaperlinkingmain 
        ORDER BY id DESC 
        LIMIT ? 
        OFFSET ?`,
        [pageSize, offset]
    );

    return rows; // Return the paginated batch data in descending order
}

export async function findBatchesByStudentId(studentId: number) {
    // Step 1: Fetch the paper-list from `studentpaperlinkingpaperlist`
    const [batchPapers] = await mysqlConnection!.query<RowDataPacket[]>(`
        SELECT 
            batchPaper.id,
            batchPaper.index_col,
            batchPaper.parent_id AS batchId,
            batchPaper.subjectTypeId,
            batchPaper.subjectId,
            batchPaper.paperId,

            sbjtyp.subjectTypeName,
            sbj.subjectName,
            pl.paperName

        FROM studentpaperlinkingpaperlist batchPaper
        JOIN studentpaperlinkingstudentlist studentPaperLink 
            ON studentPaperLink.parent_id = batchPaper.id
        JOIN subjecttype sbjtyp 
            ON sbjtyp.id = batchPaper.subjectTypeId
        JOIN subject sbj 
            ON sbj.id = batchPaper.subjectId
        JOIN paperlist pl 
            ON pl.id = batchPaper.paperId
        WHERE studentPaperLink.studentId = ?`,
        [studentId]
    ) as [BatchPaper[], unknown];


    if (batchPapers.length === 0) return null;

    // Step 2: Find the distintc batchId
    const distinctBatchIds = [...new Set(batchPapers.map((paper) => paper.batchId))];

    // Step 3: Fetch all the batches
    const batches: Batch[] = [];
    for (let i = 0; i < distinctBatchIds.length; i++) {
        const [batchRows] = await mysqlConnection!.query<RowDataPacket[]>(`
            SELECT
                sm.id,
                sm.courseId,
                sm.classId,
                sm.sectionId,
                sm.shiftId,
                sm.sessionId,

                crs.courseName,
                c.classname,
                sec.sectionName.
                shft.shiftName,
                sess.session

            FROM studentpaperlinkingmain sm
            JOIN course crs
                ON crs.id = sm.courseId
            JOIN classes c
                ON c.id = sm.classId
            JOIN section sec
                ON sec.id = sm.sectionId
            JOIN shift shft
                ON shft.id = sm.shiftId
            JOIN session sess
                ON sess.id = sm.sessionId
            WHERE sm.id = ?`,
            [distinctBatchIds[i]]
        ) as [Batch[], unknown];

        batchRows[0].batchPapers = batchPapers.filter(ele => ele.batchId === distinctBatchIds[i]);
        batches.push(batchRows[0]);
    }

    console.log(batches);

    return batches;








    // // Step 2: Fetch the distinct `parent_id` from `studentpaperlinkingpaperlist`
    // const batchIds = new Set<number>();
    // for (let i = 0; i < rows.length; i++) {
    //     const [batchPaperTmpRows] = await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT DISTINCT parent_id as batchId
    //         FROM studentpaperlinkingpaperlist 
    //         WHERE ID = ${rows[i].batchPaperId}
    //     `) as [{ batchId: number }[], unknown];

    //     for (let j = 0; j < batchPaperTmpRows.length; j++) {
    //         batchIds.add(batchPaperTmpRows[j].batchId);
    //     }
    // }

    // if (batchIds.size === 0) return null; // No batch found

    // // Step 3: Fetch all the batches
    // const batchIdArray = Array.from(batchIds);
    // console.log("batch ids:", batchIdArray);
    // const [batchRows] = await mysqlConnection.query<RowDataPacket[]>(`
    //     SELECT * 
    //     FROM studentpaperlinkingmain 
    //     WHERE id IN (${batchIdArray.join(",")})
    // `) as [DbBatch[], unknown];

    // if (batchRows.length === 0) return null;

    // const formattedBatchArr: Batch[] = [];
    // for (let i = 0; i < batchRows.length; i++) {
    //     const { classId, courseId, sectionId, shiftId, sessionId, ...props } = batchRows[i];

    //     const formattedBatch: Batch = {
    //         ...props,
    //         course: null,
    //         academicClass: null,
    //         section: null,
    //         shift: null,
    //         session: null,
    //     }

    //     if (classId) {
    //         const [classes] = await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT * 
    //         FROM classes 
    //         WHERE id = ${classId}
    //     `) as [AcademicClass[], unknown];

    //         if (classes.length > 0) {
    //             formattedBatch.academicClass = classes[0];
    //         }
    //     }

    //     if (sessionId) {
    //         const [sessions] = await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT * 
    //         FROM currentsessionmaster 
    //         WHERE id = ${classId}
    //     `) as [DbSession[], unknown];

    //         if (sessions.length > 0) {
    //             formattedBatch.session = sessions[0];
    //         }
    //     }

    //     if (courseId) {
    //         const [courses] = await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT * 
    //         FROM course 
    //         WHERE id = ${courseId}
    //     `) as [Course[], unknown];

    //         if (courses.length > 0) {
    //             formattedBatch.course = courses[0];
    //         }
    //     }
    //     if (sectionId) {
    //         const [sections] = await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT * 
    //         FROM section 
    //         WHERE id = ${sectionId}
    //     `) as [Section[], unknown];

    //         if (sections.length > 0) {
    //             formattedBatch.section = sections[0];
    //         }
    //     }
    //     if (shiftId) {
    //         const [shifts] = await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT * 
    //         FROM shift 
    //         WHERE id = ${sectionId}
    //     `) as [Shift[], unknown];

    //         if (shifts.length > 0) {
    //             formattedBatch.shift = shifts[0];
    //         }
    //     }

    //     formattedBatchArr.push(formattedBatch);
    // }

    // // TODO: Sort the array based on session;
    // // Sort by session's fromDate in descending order (latest session first)
    // formattedBatchArr.sort((a, b) => {
    //     if (!a.session || !b.session) return 0; // Handle missing session cases
    //     return new Date(b.session.fromDate).getTime() - new Date(a.session.fromDate).getTime();
    // });

    // console.log("formattedBatchArr:", formattedBatchArr, "length:", formattedBatchArr.length);

    // return formattedBatchArr;

}



