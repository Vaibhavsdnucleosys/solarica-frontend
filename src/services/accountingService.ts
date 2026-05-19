
import { API_URL, getAuthHeaders } from '../config';
import { api } from './api';

// HARDCODED COMPANY ID (Test Company Pvt Ltd) due to user request to remove multi-tenant logic
export const DEFAULT_COMPANY_ID = 'cmlki7878000j0j5wtddkza0e';

// Types aligning with the backend response
export interface Ledger {
    id: string;
    name: string;
    openingBalance: number;
    openingBalanceType: 'DEBIT' | 'CREDIT';
    currentBalance: number;
    currentBalanceType: 'DEBIT' | 'CREDIT';
    groupId: string;
    isSystem: boolean;
    isCashAccount?: boolean;
    isBankAccount?: boolean;
    isPartyAccount?: boolean;
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
    group?: {
        name: string;
        nature: string;
    };
}

export interface AccountGroup {
    id: string;
    name: string;
    parentId?: string;
    children?: AccountGroup[];
    ledgers?: Ledger[];
    nature: string;
    level: number;
    isSystem: boolean;
    _count?: {
        children: number;
        ledgers: number;
    };
}

// Report Interfaces
export interface TrialBalanceData {
    summary: {
        [key: string]: {
            groups: any[];
            totalDebit: number;
            totalCredit: number;
        };
    };
    grandTotals: {
        debit: number;
        credit: number;
        difference: number;
        isBalanced: boolean;
    };
}

export interface ProfitLossData {
    sections: {
        directIncome: any[];
        directExpense: any[];
        indirectIncome: any[];
        indirectExpense: any[];
    };
    calculations: {
        totalDirectIncome: number;
        totalDirectExpense: number;
        grossProfit: number;
        totalIndirectIncome: number;
        totalIndirectExpense: number;
        netProfit: number;
        isLoss: boolean;
    };
}

// Schedule III Balance Sheet Line Item
export interface BalanceSheetLineItem {
    items: { id: string; name: string; amount: number }[];
    total: number;
    noteNo: number | null;
}

// Schedule III (Companies Act 2013) Balance Sheet Format
export interface BalanceSheetData {
    companyName: string;
    asOnDate: string;
    previousYearDate: string;

    equityAndLiabilities: {
        shareholdersFunds: {
            shareCapital: BalanceSheetLineItem;
            reservesAndSurplus: BalanceSheetLineItem;
            moneyReceivedAgainstShareWarrants: BalanceSheetLineItem;
            total: number;
        };
        shareApplicationMoneyPendingAllotment: { total: number; noteNo: number | null };
        nonCurrentLiabilities: {
            longTermBorrowings: BalanceSheetLineItem;
            deferredTaxLiabilities: BalanceSheetLineItem;
            otherLongTermLiabilities: BalanceSheetLineItem;
            longTermProvisions: BalanceSheetLineItem;
            total: number;
        };
        currentLiabilities: {
            shortTermBorrowings: BalanceSheetLineItem;
            tradePayables: BalanceSheetLineItem;
            otherCurrentLiabilities: BalanceSheetLineItem;
            shortTermProvisions: BalanceSheetLineItem;
            total: number;
        };
        total: number;
    };

    assets: {
        nonCurrentAssets: {
            fixedAssets: {
                tangibleAssets: BalanceSheetLineItem;
                intangibleAssets: BalanceSheetLineItem;
                capitalWorkInProgress: BalanceSheetLineItem;
                intangibleAssetsUnderDevelopment: BalanceSheetLineItem;
                fixedAssetsHeldForSale: BalanceSheetLineItem;
                total: number;
            };
            nonCurrentInvestments: BalanceSheetLineItem;
            deferredTaxAssets: BalanceSheetLineItem;
            longTermLoansAndAdvances: BalanceSheetLineItem;
            otherNonCurrentAssets: BalanceSheetLineItem;
            total: number;
        };
        currentAssets: {
            currentInvestments: BalanceSheetLineItem;
            inventories: BalanceSheetLineItem;
            tradeReceivables: BalanceSheetLineItem;
            cashAndCashEquivalents: BalanceSheetLineItem;
            shortTermLoansAndAdvances: BalanceSheetLineItem;
            otherCurrentAssets: BalanceSheetLineItem;
            total: number;
        };
        total: number;
    };

    totals: {
        totalEquityAndLiabilities: number;
        totalAssets: number;
        isBalanced: boolean;
        difference: number;
    };
}

export interface LedgerStatementData {
    ledger: {
        name: string;
        openingBalance: number;
        openingType: 'DEBIT' | 'CREDIT';
    };
    statement: any[];
    closingBalance: number;
    closingType: 'DEBIT' | 'CREDIT';
}

export interface DayBookData {
    date: string;
    vouchers: any[];
    summary: {
        count: number;
        totalDebit: number;
        totalCredit: number;
    };
}

// Fetch user's companies
export const getCompanies = async () => {
    const response = await api.get(`/accounting/companies`);
    return response.data.data;
};

// Fetch the hierarchical Chart of Accounts
export const getChartOfAccounts = async (companyId: string) => {
    const response = await api.get(`/accounting/groups/chart/${companyId}`);
    return response.data.data;
};

// Create a new Ledger
export const createLedger = async (companyId: string, ledgerData: any) => {
    const payload = {
        companyId,
        ...ledgerData
    };
    const response = await api.post(`/accounting/ledgers`, payload);
    return response.data;
};

// Get flattened groups list (for selection)
export const getAccountGroups = async (companyId: string) => {
    const response = await api.get(`/accounting/groups/list/${companyId}`);
    return response.data.data;
};

export const updateLedger = async (ledgerId: string, ledgerData: any) => {
    const response = await api.put(`/accounting/ledgers/${ledgerId}`, ledgerData);
    return response.data;
};

export const deleteLedger = async (ledgerId: string) => {
    const response = await api.delete(`/accounting/ledgers/${ledgerId}`);
    return response.data;
};

export const getPayrollConfig = async (companyId: string) => {
    const response = await api.get(`/payroll/${companyId}/statutory/config`);
    return response.data.data;
};

export const activatePayroll = async (companyId: string) => {
    const response = await api.post(`/payroll/${companyId}/activate`);
    return response.data;
};

export const createCompany = async (companyData: any) => {
    const response = await api.post(`/accounting/companies`, companyData);
    return response.data;
};

export const getAllLedgers = async (companyId: string) => {
    const response = await api.get(`/accounting/ledgers/company/${companyId}`);
    return response.data.data;
};

// --- PAYROLL MASTERS ---

export const updateStatutoryConfig = async (companyId: string, data: any) => {
    const response = await api.put(`/payroll/${companyId}/statutory/config`, data);
    return response.data;
};

export const getEmployeeGroups = async (companyId: string) => {
    const response = await api.get(`/payroll/${companyId}/employee-groups`);
    return response.data.data;
};

export const createEmployeeGroup = async (companyId: string, data: any) => {
    const response = await api.post(`/payroll/${companyId}/employee-groups`, data);
    return response.data;
};

export const getEmployeeGroup = async (companyId: string, groupId: string) => {
    const response = await api.get(`/payroll/${companyId}/employee-groups/${groupId}`);
    return response.data.data;
};

export const updateEmployeeGroup = async (companyId: string, groupId: string, data: any) => {
    const response = await api.put(`/payroll/${companyId}/employee-groups/${groupId}`, data);
    return response.data;
};

export const deleteEmployeeGroup = async (companyId: string, groupId: string) => {
    const response = await api.delete(`/payroll/${companyId}/employee-groups/${groupId}`);
    return response.data;
};

export const getPayrollEmployees = async (companyId: string) => {
    const response = await api.get(`/payroll/${companyId}/employees`);
    return response.data.data;
};

export const createPayrollEmployee = async (companyId: string, data: any) => {
    const response = await api.post(`/payroll/${companyId}/employees`, data);
    return response.data;
};

export const getPayrollEmployee = async (companyId: string, employeeId: string) => {
    const response = await api.get(`/payroll/${companyId}/employees/${employeeId}`);
    return response.data.data;
};

export const updatePayrollEmployee = async (companyId: string, employeeId: string, data: any) => {
    const response = await api.put(`/payroll/${companyId}/employees/${employeeId}`, data);
    return response.data;
};

export const deletePayrollEmployee = async (companyId: string, employeeId: string) => {
    const response = await api.delete(`/payroll/${companyId}/employees/${employeeId}`);
    return response.data;
};

export const getPayHeads = async (companyId: string) => {
    const response = await api.get(`/payroll/${companyId}/pay-heads`);
    return response.data.data;
};

export const createPayHead = async (companyId: string, data: any) => {
    const response = await api.post(`/payroll/${companyId}/pay-heads`, data);
    return response.data;
};

export const getPayHead = async (companyId: string, id: string) => {
    const response = await api.get(`/payroll/${companyId}/pay-heads/${id}`);
    return response.data.data;
};

export const updatePayHead = async (companyId: string, id: string, data: any) => {
    const response = await api.put(`/payroll/${companyId}/pay-heads/${id}`, data);
    return response.data;
};

export const deletePayHead = async (companyId: string, id: string) => {
    const response = await api.delete(`/payroll/${companyId}/pay-heads/${id}`);
    return response.data;
};

export const getSalaryStructures = async (companyId: string) => {
    const response = await api.get(`/payroll/${companyId}/salary-structures`);
    return response.data.data;
};

export const createSalaryStructure = async (companyId: string, data: any) => {
    const response = await api.post(`/payroll/${companyId}/salary-structures`, data);
    return response.data;
};

export const deleteSalaryStructureItem = async (companyId: string, itemId: string) => {
    const response = await api.delete(`/payroll/${companyId}/salary-structures/items/${itemId}`);
    return response.data;
};

export const getLatestSalaryStructure = async (companyId: string, params: { employeeId?: string, employeeGroupId?: string, effectiveFrom: string }) => {
    const response = await api.get(`/payroll/${companyId}/salary-structures/latest`, { params });
    return response.data;
};

// --- PAYROLL CONTROL ---

export const getPayrollLockStatus = async (companyId: string, month: number, year: number, employeeGroupId?: string) => {
    const response = await api.get(`/payroll/${companyId}/lock/lock-status`, {
        params: { month, year, employeeGroupId: employeeGroupId || undefined }
    });
    return response.data.data;
};

export const lockPayroll = async (companyId: string, month: number, year: number, employeeGroupId?: string) => {
    const response = await api.post(`/payroll/${companyId}/lock/lock/${month}/${year}`, {
        employeeGroupId: employeeGroupId || 'all'
    });
    return response.data;
};

export const unlockPayroll = async (companyId: string, month: number, year: number, employeeGroupId?: string) => {
    const response = await api.post(`/payroll/${companyId}/lock/unlock/${month}/${year}`, {
        employeeGroupId: employeeGroupId || 'all'
    });
    return response.data;
};

export const processSalary = async (companyId: string, data: { month: number, year: number, employeeIds?: string[], employeeGroupId?: string }) => {
    const response = await api.post(`/payroll/${companyId}/salary/process`, data);
    return response.data;
};

export const approveSalary = async (companyId: string, data: { month: number, year: number, employeeIds?: string[], employeeGroupId?: string }) => {
    const response = await api.post(`/payroll/${companyId}/salary/approve`, data);
    return response.data;
};

// --- PAYROLL REPORTS ---

export const getPFSummaryReport = async (companyId: string, month: number, year: number, employeeGroupId?: string) => {
    const response = await api.get(`/payroll/${companyId}/pf/reports/summary`, {
        params: { month, year, employeeGroupId }
    });
    return response.data.data;
};

export const getPFEmployeeWiseReport = async (companyId: string, month: number, year: number) => {
    const response = await api.get(`/payroll/${companyId}/pf/reports/employee-wise`, {
        params: { month, year }
    });
    return response.data.data;
};

export const getPTMonthlyReport = async (companyId: string, month: number, year: number, employeeGroupId?: string) => {
    const response = await api.get(`/payroll/${companyId}/pt/reports/monthly`, {
        params: { month, year, employeeGroupId }
    });
    return response.data.data;
};

export const getPTStatementReport = async (companyId: string, month: number, year: number) => {
    const response = await api.get(`/payroll/${companyId}/pt/reports/statement`, {
        params: { month, year }
    });
    return response.data.data;
};

export const downloadPFSummaryExcel = async (companyId: string, month: number, year: number, employeeGroupId?: string) => {
    const response = await api.get(`/payroll/${companyId}/pf/reports/summary/excel`, {
        params: { month, year, employeeGroupId },
        responseType: 'blob'
    });
    return response.data;
};

export const downloadPTMonthlyExcel = async (companyId: string, month: number, year: number, employeeGroupId?: string) => {
    const response = await api.get(`/payroll/${companyId}/pt/reports/monthly/excel`, {
        params: { month, year, employeeGroupId },
        responseType: 'blob'
    });
    return response.data;
};

// VOUCHER API CALLS

export const createVoucher = async (companyId: string, voucherData: any) => {
    // Path: /api/accounting/vouchers/company/:companyId
    const response = await api.post(`/accounting/vouchers/company/${companyId}`, voucherData);
    return response.data;
};

export const listVouchers = async (companyId: string, params?: { startDate?: string; endDate?: string; status?: string; voucherTypeId?: string }) => {
    // Path: /api/accounting/vouchers/company/:companyId
    const response = await api.get(`/accounting/vouchers/company/${companyId}`, { params });
    return response.data.data;
};

export const getVoucher = async (id: string) => {
    const response = await api.get(`/accounting/vouchers/${id}`);
    return response.data.data;
};

export const updateVoucher = async (id: string, voucherData: any) => {
    const response = await api.put(`/accounting/vouchers/${id}`, voucherData);
    return response.data;
};

export const deleteVoucher = async (id: string) => {
    const response = await api.delete(`/accounting/vouchers/${id}`);
    return response.data;
};

// VOUCHER TYPE API CALLS

export const getVoucherTypes = async (companyId: string) => {
    const response = await api.get(`/accounting/voucher-types/company/${companyId}`);
    return response.data.data;
};

export const getNextVoucherNumber = async (voucherTypeId: string) => {
    const response = await api.get(`/accounting/voucher-types/${voucherTypeId}/next-number`);
    return response.data.data;
};

export const createVoucherType = async (companyId: string, data: any) => {
    const response = await api.post(`/accounting/voucher-types/company/${companyId}`, data);
    return response.data;
};

export const updateVoucherType = async (id: string, data: any) => {
    const response = await api.put(`/accounting/voucher-types/${id}`, data);
    return response.data;
};

// REPORT API CALLS

export const getTrialBalance = async (companyId: string): Promise<TrialBalanceData> => {
    const response = await api.get(`/accounting/reports/trial-balance/${companyId}`);
    return response.data.data;
};

export const getProfitLoss = async (companyId: string, startDate?: string, endDate?: string): Promise<ProfitLossData> => {
    const response = await api.get(`/accounting/reports/profit-loss/${companyId}`, {
        params: { startDate, endDate }
    });
    return response.data.data;
};

export const getBalanceSheet = async (companyId: string): Promise<BalanceSheetData> => {
    const response = await api.get(`/accounting/reports/balance-sheet/${companyId}`);
    return response.data.data;
};

export const getLedgerStatement = async (ledgerId: string, startDate?: string, endDate?: string): Promise<LedgerStatementData> => {
    const response = await api.get(`/accounting/reports/ledger-statement/${ledgerId}`, {
        params: { startDate, endDate }
    });
    return response.data.data;
};

export const getDayBook = async (companyId: string, date?: string) => {
    const response = await api.get(`/accounting/reports/day-book/${companyId}`, {
        params: { date }
    });
    return response.data.data;
};

// BANK RECONCILIATION API CALLS

/**
 * Mark a single voucher entry as reconciled by setting its bankDate
 */
export const markEntryReconciled = async (entryId: string, bankDate: string | null) => {
    const response = await api.patch(`/accounting/reconciliation/entry/${entryId}/mark`, {
        bankDate,
        isReconciled: !!bankDate
    });
    return response.data;
};

/**
 * Bulk mark multiple entries as reconciled
 */
export const bulkMarkReconciled = async (entries: Array<{ entryId: string; bankDate: string | null }>) => {
    const response = await api.post(`/accounting/reconciliation/bulk-mark`, { entries });
    return response.data;
};

/**
 * Get unreconciled transactions for a bank ledger
 */
export const getUnreconciledTransactions = async (ledgerId: string, startDate?: string, endDate?: string) => {
    const response = await api.get(`/accounting/reconciliation/ledger/${ledgerId}/unreconciled`, {
        params: { startDate, endDate }
    });
    return response.data.data;
};

/**
 * Get reconciliation summary for a bank ledger
 */
export interface ReconciliationSummary {
    balanceAsPerBooks: number;
    amountsNotReflectedInBank: number;
    balanceAsPerBank: number;
    reconciledCount: number;
    unreconciledCount: number;
}

export const getReconciliationSummary = async (ledgerId: string): Promise<ReconciliationSummary> => {
    const response = await api.get(`/accounting/reconciliation/ledger/${ledgerId}/summary`);
    return response.data.data;
};

/**
 * Add adjustment entry (bank charges, interest, etc.) from reconciliation screen
 */
export interface AdjustmentEntryData {
    companyId: string;
    voucherTypeId: string;
    amount: number;
    entryType: 'DEBIT' | 'CREDIT';
    narration?: string;
    instrumentType?: string; // 'BANK_CHARGE', 'INTEREST', etc.
    instrumentNumber?: string;
    bankDate?: string;
    voucherDate?: string;
    contraLedgerId: string; // The offsetting ledger
}

export const addAdjustmentEntry = async (ledgerId: string, data: AdjustmentEntryData) => {
    const response = await api.post(`/accounting/reconciliation/ledger/${ledgerId}/add-entry`, data);
    return response.data;
};

export const getAvailableInvoices = async (companyId: string) => {
    const response = await api.get(`/accounting/vouchers/company/${companyId}/available-invoices`);
    return response.data.data;
};

export const getVoucherByInvoiceNumber = async (companyId: string, invoiceNumber: string) => {
    const response = await api.get(`/accounting/vouchers/company/${companyId}/invoice/${invoiceNumber}`);
    return response.data.data;
};
