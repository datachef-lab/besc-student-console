export interface DbFeesReceipt {
    readonly id?: number;
    receiptType: number;
    collegePayMode: number;
    fromOtherCollege: number | null;
    paidAtCounter: number | null;
    noOfInstallments: number | null;
    installmentNo: number | null;
    date: Date;
    studentId: number;
    bookno: number;
    academicyearId: number;
    payModeNo: number | null;
    drewweeBank: string | null;
    excessFees: number | null;
    flag: boolean | number;
    voucherId: number;
    cancelVoucherId: number;
    advPayement: boolean;
    isAdvPayement: boolean;
    cancelled: boolean;
    cancelremarks: string | null
    prevpayment: number;
    challanno: string;
    userid: number;
    entrydate: Date | null;
    canceldt: Date | null;
    feesReceiptSubId: number;
    index_col: number;
    feesReceiptIdFk: number;
    headId: number;
    amountPay: number;
    amount: number;
    structureId: number;
}