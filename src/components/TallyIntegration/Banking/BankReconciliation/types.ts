/**
 * Bank Reconciliation Types
 */

export interface BankLedger {
  id: string;
  name: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  branch?: string;
  openingBalance?: number;
  openingBalanceType?: 'DEBIT' | 'CREDIT';
}

export interface ReconciliationTransaction {
  id: string;
  voucherDate: string;
  particulars: string;
  voucherType: string;
  voucherNumber: string;
  transactionType: string;
  instrumentNumber: string;
  instrumentDate?: string;
  bankDate: string | null;
  debitAmount: number | null;
  creditAmount: number | null;
  isReconciled: boolean;
}

export interface ReconciliationSummaryData {
  balanceAsPerBooks: number;
  amountsNotReflectedInBank: number;
  balanceAsPerBank: number;
  // Detailed breakdown (optional for backward compatibility)
  chequesIssuedNotCleared?: number;   // Payments made but not cleared by bank
  depositsNotCredited?: number;        // Receipts not yet credited by bank
  bankChargesNotRecorded?: number;     // Bank charges not entered in books
  interestNotRecorded?: number;        // Interest credited by bank not entered
}

export interface BankReconciliationViewProps {
  companyId: string;
  companyName: string;
  onQuit?: () => void;
}

export interface BankLedgerSelectionProps {
  bankLedgers: BankLedger[];
  onSelect: (ledger: BankLedger) => void;
  onClose: () => void;
  companyName: string;
  isLoading?: boolean;
  error?: string | null;
}

export interface BankReconciliationWorkScreenProps {
  selectedLedger: BankLedger;
  transactions: ReconciliationTransaction[];
  periodStart: string;
  periodEnd: string;
  companyName: string;
  companyId: string;
  onBack: () => void;
  onBankDateChange: (transactionId: string, date: string | null, isoDate?: string | null) => void;
  onRefresh: () => void;
  summary: ReconciliationSummaryData;
  isLoading?: boolean;
}

export interface ReconciliationTableProps {
  transactions: ReconciliationTransaction[];
  onBankDateChange: (transactionId: string, date: string | null, isoDate?: string | null) => void;
  selectedRowId: string | null;
  onRowSelect: (id: string) => void;
}

export interface ReconciliationSummaryProps {
  summary: ReconciliationSummaryData;
}
