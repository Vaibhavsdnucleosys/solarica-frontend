import React, { useState, useEffect, useCallback } from 'react';
import ReconciliationTable from './components/ReconciliationTable';
import ReconciliationSummary from './components/ReconciliationSummary';
import AddEntryModal from './components/AddEntryModal';
import TallyFooter, { FooterItem, FooterEmptyItem } from '../../TallyLedgerUI/TallyFooter';
import type { BankReconciliationWorkScreenProps } from './types';

const BankReconciliationWorkScreen: React.FC<BankReconciliationWorkScreenProps> = ({
    selectedLedger,
    transactions,
    periodStart,
    periodEnd,
    companyName,
    companyId,
    onBack,
    onBankDateChange,
    onRefresh,
    summary,
    isLoading = false
}) => {
    const [selectedRowId, setSelectedRowId] = useState<string | null>(
        transactions.length > 0 ? transactions[0].id : null
    );
    const [showAddEntryModal, setShowAddEntryModal] = useState(false);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
            onBack();
        }

        // A or a to open Add Entry modal
        if ((e.key === 'a' || e.key === 'A') && !showAddEntryModal) {
            e.preventDefault();
            setShowAddEntryModal(true);
        }
    }, [onBack, showAddEntryModal]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Update selected row when transactions change
    useEffect(() => {
        if (transactions.length > 0 && !selectedRowId) {
            setSelectedRowId(transactions[0].id);
        }
    }, [transactions, selectedRowId]);

    const reconciledCount = transactions.filter(t => t.isReconciled).length;
    const unreconciledCount = transactions.length - reconciledCount;

    const handleEntryAdded = () => {
        // Refresh transactions after adding new entry
        onRefresh();
    };

    return (
        <div className="h-full flex flex-col bg-white relative pb-[65px]">
            {/* Header Block */}
            <div className="flex justify-between items-center px-4 h-6 bg-[#88b5dd] text-black text-[13px] font-bold border-b border-[#2d819b] shrink-0">
                <span>Bank Reconciliation</span>
                <div className="absolute left-1/2 transform -translate-x-1/2 underline decoration-1 underline-offset-2">
                    {companyName}
                </div>
                <span
                    onClick={onBack}
                    className="cursor-pointer hover:bg-red-500 hover:text-white px-2 transition-colors"
                >
                    ✕
                </span>
            </div>

            {/* Sub Header - Ledger Info */}
            <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-100">
                <div className="flex flex-col">
                    <h1 className="text-lg font-black text-[#1b2c3c] leading-tight tracking-tight uppercase font-sans">
                        Bank Reconciliation
                    </h1>
                    <div className="h-[2px] w-8 bg-[#2a5585] mt-0.5" />
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-[13px] text-gray-500">Ledger:</span>
                        <span className="text-[14px] font-bold text-[#2d819b]">{selectedLedger.name}</span>
                        {selectedLedger.accountNumber && (
                            <span className="text-[12px] text-gray-400">
                                ({selectedLedger.accountNumber})
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end text-right">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Period</div>
                    <div className="text-[13px] font-bold text-blue-900">
                        {periodStart} to {periodEnd}
                    </div>
                    <div className="mt-1 flex gap-3 text-[11px]">
                        <span className="text-gray-600">
                            ✓ {reconciledCount} Reconciled
                        </span>
                        <span className="text-gray-600">
                            ○ {unreconciledCount} Pending
                        </span>
                    </div>
                </div>
            </div>

            {/* Table Header Label */}
            <div className="px-4 py-1.5 bg-[#f0f7fa] border-b border-[#9bc9d9] text-[11px] font-bold text-[#1d5b6e] uppercase tracking-wider flex justify-between items-center">
                <span>(Reconciliation)</span>
                <span className="text-[10px] text-gray-400 normal-case font-normal">
                    Click on Bank Date column to enter date • Tab to move between rows
                </span>
            </div>

            {/* Main Table Area - Scrollable */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Loading transactions...
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No transactions found for this ledger
                    </div>
                ) : (
                    <ReconciliationTable
                        transactions={transactions}
                        onBankDateChange={onBankDateChange}
                        selectedRowId={selectedRowId}
                        onRowSelect={setSelectedRowId}
                    />
                )}
            </div>

            {/* Summary Section - MANDATORY per YouTube summary */}
            <ReconciliationSummary summary={summary} />

            {/* Bottom Footer Bar - Same as other Solarica screens */}
            <TallyFooter countInfo="">
                <FooterItem keyName="A" label="Add Entry" onClick={() => setShowAddEntryModal(true)} />
                <FooterItem keyName="Q" label="Quit" onClick={onBack} />
                <FooterEmptyItem />
                <FooterEmptyItem />
                <FooterEmptyItem />
            </TallyFooter>

            {/* Add Entry Modal */}
            <AddEntryModal
                isOpen={showAddEntryModal}
                onClose={() => setShowAddEntryModal(false)}
                bankLedgerId={selectedLedger.id}
                bankLedgerName={selectedLedger.name}
                companyId={companyId}
                onEntryAdded={handleEntryAdded}
            />
        </div>
    );
};

export default BankReconciliationWorkScreen;

