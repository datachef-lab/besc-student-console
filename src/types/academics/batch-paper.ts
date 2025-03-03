import { PaperSubject } from "./paper-subject";

export interface DbBatchPaper {
    readonly id?: number;
    index_col: number | null;
    parent_id: number;
    subjectTypeId: number;
    subjectId: number;
    paperId: number;
}

export interface BatchPaper extends Omit<DbBatchPaper, "parent_id" | "subjectTypeId" | "subjectId" | "paperId"> {
    batchId: number;
    paper: PaperSubject;
}