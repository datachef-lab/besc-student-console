export interface BatchPaper {
    readonly id?: number;
    index_col: number | null;
    parent_id: number;
    subjectTypeId: number;
    subjectId: number;
    paperId: number;
}