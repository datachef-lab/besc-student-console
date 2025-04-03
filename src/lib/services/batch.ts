import { mysqlConnection } from "@/db";
import { AcademicClass } from "@/types/academics/academic-class";
import { BatchCustom, DbBatchCustom } from "@/types/academics/batch";
import { DbSession } from "@/types/academics/session";

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
    console.log("in findBatchesByStudentId(), studentId:", studentId);
    // Step 1: Fetch the sessions
    console.log("Step 1: Fetch the sessions");
    const [sessions] = await mysqlConnection!.query<RowDataPacket[]>(`
        SELECT * FROM currentsessionmaster;
    `,) as [DbSession[], unknown];

    // Step 2: Fetch the classes
    console.log("Step 2: Fetch the classes");
    const [classes] = await mysqlConnection!.query<RowDataPacket[]>(`
        SELECT * FROM classes;
    `,) as [AcademicClass[], unknown];

    // Step 3: Fetch the batches and subjects
    const formattedBatchArr: BatchCustom[] = [];
    for (let s = 0; s < sessions.length; s++) {
        for (let c = 0; c < classes.length; c++) {
            console.log(`Fetching for session: ${sessions[s].sessionName} | class: ${classes[c].classname}`);
            const [result] = await mysqlConnection!.query<RowDataPacket[]>(`
                (
                    SELECT
                        DISTINCT co.coursename,
                        cl.classname,
                        s.name,
                        s.codenumber,
                        st.subjecttypename,
                        sb.subjectname,
                        shft.shiftName,
                        sec.sectionName,
                        sess.sessionName,
                        pl.paperName
                    FROM 
                        studentpaperlinkingmain m,
                        studentpaperlinkingpaperlist p,
                        historicalrecord h,
                        studentpersonaldetails s,
                        course co,
                        classes cl,
                        subjecttype st,
                        subject sb,
                        shift shft,
                        section sec,
                        currentsessionmaster sess,
                        paperlist pl
                    WHERE
                        m.sessionid = ${sessions[s].id}
                        AND m.classid = ${classes[c].id}
                        AND m.sessionid = sess.id
                        AND m.shiftId = shft.id
                        AND m.sectionId = sec.id
                        AND s.id = ${studentId}
                        AND m.id = p.parent_id 
                        AND p.allstudents = 1 
                        AND p.paperId = pl.id
                        AND m.courseid = h.courseid 
                        AND m.classid = h.classid 
                        AND m.sectionid = h.sectionid 
                        AND m.shiftid = h.shiftid 
                        AND m.sessionid = h.sessionid 
                        AND h.parent_id = s.id 
                        AND m.courseid = co.id 
                        AND m.classid = cl.id 
                        AND p.subjectTypeId = st.id 
                        AND p.subjectId = sb.id 
                ) UNION (
                    SELECT 
                        DISTINCT co.coursename,
                        cl.classname,
                        s.name,
                        s.codenumber,
                        st.subjecttypename,
                        sb.subjectname,
                        shft.shiftName,
                        sec.sectionName,
                        sess.sessionName,
                        pl.paperName
                    FROM 
                        studentpaperlinkingmain m,
                        studentpaperlinkingpaperlist p,
                        studentpaperlinkingstudentlist ss,
                        historicalrecord h,
                        studentpersonaldetails s,
                        course co,
                        classes cl,
                        subjecttype st,
                        subject sb,
                        shift shft,
                        section sec,
                        currentsessionmaster sess,
                        paperlist pl
                    WHERE 
                        m.sessionid = ${sessions[s].id}
                        AND m.classid = ${classes[c].id}
                        AND m.sessionid = sess.id
                        AND m.shiftId = shft.id
                        AND m.sectionId = sec.id
                        AND s.id = ${studentId}
                        AND m.id = p.parent_id 
                        AND p.allstudents = 0 
                        AND p.paperId = pl.id
                        AND p.id = ss.parent_id 
                        AND m.courseid = h.courseid 
                        AND m.classid = h.classid 
                        AND m.sectionid = h.sectionid 
                        AND m.shiftid = h.shiftid 
                        AND m.sessionid = h.sessionid 
                        AND h.parent_id = s.id 
                        AND m.courseid = co.id 
                        AND m.classid = cl.id 
                        AND p.subjectTypeId = st.id 
                        AND p.subjectId = sb.id 
                        AND ss.studentid = s.id 
                    ) 
                ORDER BY coursename, codenumber, subjectTypeName`
            ) as [DbBatchCustom[], unknown];

            if (result.length === 0) {
                console.log("Continuing...");
                continue;
            };

            const { classname, coursename, sectionName, sessionName, shiftName } = result[0];
            const papers = result.map(ele => {
                const { subjectname, subjecttypename, paperName } = ele;
                return { subjectname, subjecttypename, paperName };
            })
            formattedBatchArr.push({
                classname,
                coursename,
                sectionName,
                sessionName,
                shiftName,
                papers,
            });
            console.log("added row");
        }
    }



    console.log("formattedBatchArr:", formattedBatchArr);




    return formattedBatchArr; // TODO








    // // Step 2: Fetch the distinct `parent_id` from `studentpaperlinkingpaperlist`
    // const batchIds  =  new Set<number>();
    // for (let i  =  0; i < rows.length; i++) {
    //     const [batchPaperTmpRows]  =  await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT DISTINCT parent_id as batchId
    //         FROM studentpaperlinkingpaperlist 
    //         WHERE ID  =  ${rows[i].batchPaperId}
    //     `) as [{ batchId: number }[], unknown];

    //     for (let j  =  0; j < batchPaperTmpRows.length; j++) {
    //         batchIds.add(batchPaperTmpRows[j].batchId);
    //     }
    // }

    // if (batchIds.size  =  =  =  0) return null; // No batch found

    // // Step 3: Fetch all the batches
    // const batchIdArray  =  Array.from(batchIds);
    // console.log("batch ids:", batchIdArray);
    // const [batchRows]  =  await mysqlConnection.query<RowDataPacket[]>(`
    //     SELECT * 
    //     FROM studentpaperlinkingmain 
    //     WHERE id IN (${batchIdArray.join(",")})
    // `) as [DbBatch[], unknown];

    // if (batchRows.length  =  =  =  0) return null;

    // const formattedBatchArr: Batch[]  =  [];
    // for (let i  =  0; i < batchRows.length; i++) {
    //     const { classId, courseId, sectionId, shiftId, sessionId, ...props }  =  batchRows[i];

    //     const formattedBatch: Batch  =  {
    //         ...props,
    //         course: null,
    //         academicClass: null,
    //         section: null,
    //         shift: null,
    //         session: null,
    //     }

    //     if (classId) {
    //         const [classes]  =  await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT * 
    //         FROM classes 
    //         WHERE id  =  ${classId}
    //     `) as [AcademicClass[], unknown];

    //         if (classes.length > 0) {
    //             formattedBatch.academicClass  =  classes[0];
    //         }
    //     }

    //     if (sessionId) {
    //         const [sessions]  =  await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT * 
    //         FROM currentsessionmaster 
    //         WHERE id  =  ${classId}
    //     `) as [DbSession[], unknown];

    //         if (sessions.length > 0) {
    //             formattedBatch.session  =  sessions[0];
    //         }
    //     }

    //     if (courseId) {
    //         const [courses]  =  await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT * 
    //         FROM course 
    //         WHERE id  =  ${courseId}
    //     `) as [Course[], unknown];

    //         if (courses.length > 0) {
    //             formattedBatch.course  =  courses[0];
    //         }
    //     }
    //     if (sectionId) {
    //         const [sections]  =  await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT * 
    //         FROM section 
    //         WHERE id  =  ${sectionId}
    //     `) as [Section[], unknown];

    //         if (sections.length > 0) {
    //             formattedBatch.section  =  sections[0];
    //         }
    //     }
    //     if (shiftId) {
    //         const [shifts]  =  await mysqlConnection.query<RowDataPacket[]>(`
    //         SELECT * 
    //         FROM shift 
    //         WHERE id  =  ${sectionId}
    //     `) as [Shift[], unknown];

    //         if (shifts.length > 0) {
    //             formattedBatch.shift  =  shifts[0];
    //         }
    //     }

    //     formattedBatchArr.push(formattedBatch);
    // }

    // // TODO: Sort the array based on session;
    // // Sort by session's fromDate in descending order (latest session first)
    // formattedBatchArr.sort((a, b)  = > {
    //     if (!a.session || !b.session) return 0; // HANDle missing session cases
    //     return new Date(b.session.fromDate).getTime() - new Date(a.session.fromDate).getTime();
    // });

    // console.log("formattedBatchArr:", formattedBatchArr, "length:", formattedBatchArr.length);

    // return formattedBatchArr;

}



