import { BatchPaper } from "./batch-paper";
import { DbSession } from "./session";

export interface DbBatch {
    readonly id?: number;
    courseId: number | null;
    classId: number | null;
    sectionId: number | null;
    shiftId: number | null;
    sessionId: number | null;
    instituteId: number | null;
}

export default interface Batch extends DbBatch {
    courseName: string;
    classname: string;
    sectionName: string;
    shiftName: string;
    session: DbSession;
    batchPapers?: BatchPaper[];
}