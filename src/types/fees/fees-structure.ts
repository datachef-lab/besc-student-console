export interface DbFeesStructure {
    readonly id?: number;
    courseId: number;
    receipttype: number;
    classId: number;
    installmentNo: number;
    sesionId: number;
    lastDate: Date;
    closingDate: Date;
    advanceclassid: number;
    readmitcheck: boolean;
    instfromdt: Date;
    insttodt: Date;
    feesquarterid: number | null;
    admcodegenchk: number | null;
    lastonlinedate: Date | null;
    lastonlinedateto: Date | null;
    admfrmgenchk: number | null;
    advancesessionid: number | null;
    advancecourseid: number | null;
    minamount: number | null;
    shift: number | null;
    feeStructureSubTabId: number;
    index_col: number;
    feeStructureSubTabIdFk: number;
    headid: number; // References feesheadtable
    position: number;
    feestypeid: number;
    instamount: number;
    specialtypename: string | null;
    installmenttypename: string | null;
    lateTypeCalculation: string | null;
    concession: string | null; // Yes or No
}

export interface FeesStructure extends DbFeesStructure {
    courseName: string;
    receiptTypeName: string;
    classname: string;
    sessionName: string;
    iscurrentsession: boolean;
    advanceClassName: string | null;
    advanceSessionName: string | null;
    advanceCourseName: string | null;
    shiftName: string | null;
    feesHeadName: string | null;
}