import React, { useState, useEffect, useCallback } from 'react';
import type { BankLedgerSelectionProps, BankLedger } from './types';
import TallyFooter, { FooterItem, FooterEmptyItem } from '../../TallyLedgerUI/TallyFooter';

const BankLedgerSelection: React.FC<BankLedgerSelectionProps> = ({
    bankLedgers,
    onSelect,
    onClose,
    companyName,
    isLoading = false,
    error = null
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLedgers = bankLedgers.filter(ledger =>
        ledger.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, filteredLedgers.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredLedgers[selectedIndex]) {
                    onSelect(filteredLedgers[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
        }
    }, [filteredLedgers, selectedIndex, onSelect, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Reset selection when filter changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [searchQuery]);

    const handleRowClick = (ledger: BankLedger, index: number) => {
        setSelectedIndex(index);
    };

    const handleRowDoubleClick = (ledger: BankLedger) => {
        onSelect(ledger);
    };

    return (
        <div className="h-full flex flex-col bg-white relative">
            {/* Header Block */}
            <div className="flex justify-between items-center px-4 h-6 bg-[#88b5dd] text-black text-[13px] font-bold border-b border-[#2d819b] shrink-0">
                <span>Bank Reconciliation</span>
                <div className="absolute left-1/2 transform -translate-x-1/2 underline decoration-1 underline-offset-2">
                    {companyName}
                </div>
                <span
                    onClick={onClose}
                    className="cursor-pointer hover:bg-red-500 hover:text-white px-2 transition-colors"
                >
                    ✕
                </span>
            </div>

            {/* Title Section */}
            <div className="flex justify-between items-end px-6 py-4 bg-white border-b border-gray-100">
                <div className="flex flex-col">
                    <h1 className="text-xl font-black text-[#1b2c3c] leading-tight tracking-tight uppercase font-sans">
                        Select Bank Ledger
                    </h1>
                    <div className="h-[3px] w-10 bg-[#2a5585] mt-0.5" />
                </div>
            </div>

            {/* Main Content - Centered Panel */}
            <div className="flex-1 flex items-start justify-center p-8 bg-[#f5f7f9] pb-16">
                <div className="w-[700px] shadow-[0_0_15px_rgba(0,0,0,0.15)] border border-[#2d819b] bg-[#e8f6fa] flex flex-col max-h-[400px]">
                    {/* Panel Header */}
                    <div className="bg-[#2d819b] text-white px-3 py-2 font-bold flex justify-between items-center select-none text-[13px]">
                        <span>List of Bank Ledgers</span>
                        <span className="text-xs opacity-75">
                            {isLoading ? 'Loading...' : `${filteredLedgers.length} Ledger(s)`}
                        </span>
                    </div>

                    {/* Search Input */}
                    <div className="px-3 py-2 border-b border-[#9bc9d9] bg-white">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Name of Bank Ledger..."
                            className="w-full px-2 py-1 border border-[#a0cbe0] text-[13px] bg-yellow-50 focus:outline-none focus:ring-1 focus:ring-[#2d819b] focus:bg-yellow-100"
                            autoFocus
                        />
                    </div>

                    {/* Column Headers */}
                    <div className="flex bg-[#d4eaf3] border-b border-[#9bc9d9] text-[12px] font-bold text-[#1d5b6e] select-none">
                        <div className="flex-1 px-3 py-1.5">Ledger Name</div>
                        <div className="w-[150px] px-3 py-1.5 border-l border-[#9bc9d9]">Account No.</div>
                    </div>

                    {/* Ledger List */}
                    <div className="flex-1 overflow-y-auto bg-white">
                        {isLoading ? (
                            <div className="px-3 py-4 text-center text-gray-500 text-[13px]">
                                Loading bank ledgers...
                            </div>
                        ) : error ? (
                            <div className="px-3 py-4 text-center text-red-500 text-[13px]">
                                {error}
                            </div>
                        ) : filteredLedgers.length === 0 ? (
                            <div className="px-3 py-4 text-center text-gray-500 text-[13px]">
                                No bank ledgers found
                            </div>
                        ) : (
                            filteredLedgers.map((ledger, index) => (
                                <div
                                    key={ledger.id}
                                    className={`flex cursor-pointer text-[13px] border-b border-gray-100 transition-colors ${index === selectedIndex
                                        ? 'bg-[#feba35] text-black font-bold'
                                        : 'hover:bg-[#dceef5]'
                                        }`}
                                    onClick={() => handleRowClick(ledger, index)}
                                    onDoubleClick={() => handleRowDoubleClick(ledger)}
                                >
                                    <div className="flex-1 px-3 py-1.5 flex items-center gap-2">
                                        {ledger.name}
                                    </div>
                                    <div className="w-[150px] px-3 py-1.5 border-l border-gray-100 text-gray-600">
                                        {ledger.accountNumber || '-'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Panel Footer */}
                    <div className="px-3 py-2 bg-[#f0f7fa] border-t border-[#9bc9d9] text-[11px] text-gray-500 flex justify-between">
                        <span>Enter: Select</span>
                        <span>↑↓: Navigate</span>
                        <span>Esc: Cancel</span>
                    </div>
                </div>
            </div>

            {/* Bottom Footer Bar */}
            <TallyFooter countInfo={`${filteredLedgers.length} Bank Ledger(s)`}>
                <FooterItem keyName="Q" label="Quit" onClick={onClose} />
                <FooterEmptyItem />
                <FooterEmptyItem />
                <FooterEmptyItem />
                <FooterEmptyItem />
            </TallyFooter>
        </div>
    );
};

export default BankLedgerSelection;
