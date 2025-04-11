export interface DbInstallment {
    readonly id?: number;
    stdid: number;
    structid: number; // It's a foriegn key references feestructuremaintab
    amount: number;
    instdt: Date;
    amtwords: string | null;
    feespaid: boolean;
    feespaydt: Date;
    feesreceiptid: number;
    cancel: boolean | null;
    remarks: string | null;
    fg: number | null;
    draftdetails: string | null;
    chkenrol: string | null;
    installmentSubId: number;
    index_col: number;
    installmentSubIdFk: number;
    headid: number;
    fees: number | null;
}