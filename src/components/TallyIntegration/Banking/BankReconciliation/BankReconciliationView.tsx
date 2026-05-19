import React, { useState, useMemo, useEffect } from 'react';
import BankLedgerSelection from './BankLedgerSelection';
import BankReconciliationWorkScreen from './BankReconciliationWorkScreen';
import TallyHeader from '../../TallyLedgerUI/TallyHeader';
import TallySidebar from '../../TallyCommon/TallySidebar';
import { getAllLedgers, getLedgerStatement, DEFAULT_COMPANY_ID, markEntryReconciled } from '../../../../services/accountingService';
import type {
    BankReconciliationViewProps,
    BankLedger,
    ReconciliationTransaction,
    ReconciliationSummaryData
} from './types';

// ============================================
// MAIN COMPONENT
// ============================================

type ViewMode = 'selection' | 'reconciliation';

const BankReconciliationView: React.FC<BankReconciliationViewProps> = ({
    companyId,
    companyName,
    onQuit
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('selection');
    const [selectedLedger, setSelectedLedger] = useState<BankLedger | null>(null);
    const [transactions, setTransactions] = useState<ReconciliationTransaction[]>([]);
    const [bankLedgers, setBankLedgers] = useState<BankLedger[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Period - can be made dynamic later
    const periodStart = "1-Apr-24";
    const periodEnd = "31-Mar-25";

    // Fetch bank ledgers on mount
    useEffect(() => {
        const fetchBankLedgers = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const effectiveCompanyId = companyId || DEFAULT_COMPANY_ID;
                console.log('[BankRecon] Props companyId:', companyId);
                console.log('[BankRecon] Using effectiveCompanyId:', effectiveCompanyId);

                const allLedgers = await getAllLedgers(effectiveCompanyId);

                // Filter for bank accounts - by flag OR by bank group
                const BANK_GROUPS = ['bank accounts', 'bank od a/c', 'bank occ a/c'];
                const filtered = (allLedgers || [])
                    .filter((ledger: any) => 
                        ledger.isBankAccount === true || 
                        BANK_GROUPS.includes(ledger.group?.name?.toLowerCase() || '')
                    )
                    .map((ledger: any) => ({
                        id: ledger.id,
                        name: ledger.name,
                        accountNumber: ledger.accountNumber || '',
                        bankName: ledger.bankName || '',
                        ifscCode: ledger.ifscCode || '',
                        branch: ledger.branch || '',
                        openingBalance: ledger.openingBalance || 0,
                        openingBalanceType: ledger.openingBalanceType || 'DEBIT'
                    }));

                console.log('[BankRecon] Bank ledgers filtered:', filtered);
                setBankLedgers(filtered);
            } catch (err: any) {
                console.error('Failed to fetch bank ledgers:', err);
                setError('Failed to load bank ledgers');
                setBankLedgers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBankLedgers();
    }, [companyId]);

    // Fetch transactions when ledger is selected
    const fetchTransactions = async (ledgerId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('[BankRecon] Fetching transactions for ledgerId:', ledgerId);
            const data = await getLedgerStatement(ledgerId);

            // Map API response to ReconciliationTransaction format
            const mapped: ReconciliationTransaction[] = (data.statement || []).map((entry: any, index: number) => ({
                id: entry.id || `txn-${index}`, // Use entry.id (VoucherEntry ID), not voucherId
                voucherDate: formatDate(entry.date),
                particulars: entry.particulars || entry.narration || '-',
                voucherType: entry.voucherType || '-',
                voucherNumber: entry.voucherNumber || '-',
                transactionType: entry.transactionType || entry.instrumentType || '-',
                instrumentNumber: entry.instrumentNumber || entry.chequeNumber || '-',
                instrumentDate: entry.instrumentDate ? formatDate(entry.instrumentDate) : '',
                bankDate: entry.bankDate ? formatDate(entry.bankDate) : null,
                debitAmount: entry.debit || null,
                creditAmount: entry.credit || null,
                isReconciled: !!entry.bankDate
            }));

            console.log('[BankRecon] Mapped transactions:', mapped);
            setTransactions(mapped);
        } catch (err: any) {
            console.error('Failed to fetch transactions:', err);
            setError('Failed to load transactions');
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateValue: any): string => {
        if (!dateValue) return '';
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return String(dateValue);
        const day = date.getDate();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    };

    const handleLedgerSelect = (ledger: BankLedger) => {
        setSelectedLedger(ledger);
        fetchTransactions(ledger.id);
        setViewMode('reconciliation');
    };

    const handleBack = () => {
        if (viewMode === 'reconciliation') {
            setViewMode('selection');
            setSelectedLedger(null);
            setTransactions([]);
        } else {
            onQuit?.();
        }
    };

    const handleBankDateChange = async (transactionId: string, date: string | null, isoDate?: string | null) => {
        // Optimistic update - update UI immediately with the display date
        setTransactions(prev =>
            prev.map(t =>
                t.id === transactionId
                    ? { ...t, bankDate: date, isReconciled: !!date }
                    : t
            )
        );

        // Persist to database via API using the ISO date
        try {
            // Use isoDate if available, otherwise fallback to date (for backward compatibility or clear)
            const dateToSend = isoDate || date;
            await markEntryReconciled(transactionId, dateToSend);
            console.log('[BankRecon] Bank date saved successfully for entry:', transactionId);
        } catch (err) {
            console.error('[BankRecon] Failed to save bank date:', err);
            // Revert optimistic update on error
            setTransactions(prev =>
                prev.map(t =>
                    t.id === transactionId
                        ? { ...t, bankDate: null, isReconciled: false }
                        : t
                )
            );
            setError('Failed to save reconciliation. Please try again.');
        }
    };

    // Calculate summary based on transactions
    const summary: ReconciliationSummaryData = useMemo(() => {
        const totalDebit = transactions.reduce((sum, t) => sum + (t.debitAmount || 0), 0);
        const totalCredit = transactions.reduce((sum, t) => sum + (t.creditAmount || 0), 0);
        const balanceAsPerBooks = totalDebit - totalCredit;

        const unreconciledDebit = transactions
            .filter(t => !t.isReconciled)
            .reduce((sum, t) => sum + (t.debitAmount || 0), 0);
        const unreconciledCredit = transactions
            .filter(t => !t.isReconciled)
            .reduce((sum, t) => sum + (t.creditAmount || 0), 0);
        const amountsNotReflectedInBank = unreconciledDebit - unreconciledCredit;

        return {
            balanceAsPerBooks,
            amountsNotReflectedInBank,
            balanceAsPerBank: balanceAsPerBooks - amountsNotReflectedInBank,
        };
    }, [transactions]);

    // Sidebar buttons (disabled - no functionality yet)
    const sidebarButtons = [
        { keyName: 'F2', label: 'Period', disabled: true },
        { keyName: 'F3', label: 'Company', disabled: true },
        { keyName: '', label: '' },
        { keyName: 'F12', label: 'Configure', disabled: true },
    ];

    return (
        <div className="h-screen w-screen flex flex-col bg-[#f5f7f9] font-sans overflow-hidden select-none">
            <TallyHeader isCreateMode={false} />

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col border-r border-gray-300 bg-white h-full relative">
                    {viewMode === 'selection' ? (
                        <BankLedgerSelection
                            bankLedgers={bankLedgers}
                            onSelect={handleLedgerSelect}
                            onClose={handleBack}
                            companyName={companyName}
                            isLoading={isLoading}
                            error={error}
                        />
                    ) : selectedLedger ? (
                        <BankReconciliationWorkScreen
                            selectedLedger={selectedLedger}
                            transactions={transactions}
                            periodStart={periodStart}
                            periodEnd={periodEnd}
                            companyName={companyName}
                            companyId={companyId || DEFAULT_COMPANY_ID}
                            onBack={handleBack}
                            onBankDateChange={handleBankDateChange}
                            onRefresh={() => selectedLedger && fetchTransactions(selectedLedger.id)}
                            summary={summary}
                            isLoading={isLoading}
                        />
                    ) : null}
                </div>

                {/* Right Sidebar */}
                <TallySidebar buttons={sidebarButtons} />
            </div>
        </div>
    );
};

export default BankReconciliationView;
