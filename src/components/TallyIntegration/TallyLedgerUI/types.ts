export interface LedgerItem {
    id: string;
    name: string;
    type: 'group' | 'ledger' | 'category';
    children?: LedgerItem[];
    italic?: boolean;
    // Detailed fields
    address?: string;
    phone?: string;
    email?: string;
    contactPerson?: string;
    gstin?: string;
    pan?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    branch?: string;
    openingBalance?: number;
    openingBalanceType?: 'DEBIT' | 'CREDIT';
    groupId?: string;
    under?: string;
}

export interface TallyFormData {
    name: string;
    alias: string;
    under: string;
    nature: string;
    showNature: boolean;
    isNatureEditable?: boolean;
    showStatutory: boolean;
    subLedger: string;
    debitCredit: string;
    calculation: string;
    invoiceMethod: string;
    // Statutory - HSN
    hsnDetails: string;
    hsnSource: string;
    hsnSac: string;
    hsnDesc: string;
    // Statutory - GST
    gstRateDetails: string;
    gstSource: string;
    gstTaxability: string;
    gstRate: string;
    // Ledger Specific
    mailingName: string;
    address: string;
    provideBankDetails: string;
    panNo: string;
    openingBalance: string;
    affectGrossProfits?: string;
    useAsIncomeExpense?: string;
}
