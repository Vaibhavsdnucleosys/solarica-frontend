import React, { useState, useRef, useEffect } from 'react';
import type { ReconciliationTableProps, ReconciliationTransaction } from '../types';

const ReconciliationTable: React.FC<ReconciliationTableProps> = ({
    transactions,
    onBankDateChange,
    selectedRowId,
    onRowSelect
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingId]);

    // Parse date string to Date object (handles multiple formats)
    const parseDate = (dateStr: string): Date | null => {
        if (!dateStr || !dateStr.trim()) return null;
        const trimmed = dateStr.trim();

        // Try dd-mmm-yy or dd-mmm-yyyy (e.g., "10-Apr-25" or "10-Apr-2025")
        const monthNames: { [key: string]: number } = {
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
            'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
        };
        const match = trimmed.match(/^(\d{1,2})[-\/](\w{3,})[-\/](\d{2,4})$/i);
        if (match) {
            const day = parseInt(match[1]);
            const monthKey = match[2].toLowerCase().substring(0, 3);
            let year = parseInt(match[3]);
            if (year < 100) year += 2000;
            const month = monthNames[monthKey];
            if (month !== undefined && day >= 1 && day <= 31) {
                return new Date(year, month, day);
            }
        }

        // Try dd/mm/yyyy or dd-mm-yyyy
        const numMatch = trimmed.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})$/);
        if (numMatch) {
            const day = parseInt(numMatch[1]);
            const month = parseInt(numMatch[2]) - 1;
            let year = parseInt(numMatch[3]);
            if (year < 100) year += 2000;
            if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
                return new Date(year, month, day);
            }
        }

        // Try standard Date parse as fallback
        const parsed = new Date(trimmed);
        if (!isNaN(parsed.getTime())) return parsed;

        return null;
    };

    // Validate bank date against voucher date
    const validateBankDate = (transactionId: string, bankDateStr: string): boolean => {
        const transaction = transactions.find(t => t.id === transactionId);
        if (!transaction) return false;

        const bankDate = parseDate(bankDateStr);
        if (!bankDate) {
            setValidationError('Invalid date format. Use dd-mmm-yy (e.g., 10-Apr-25)');
            setTimeout(() => setValidationError(null), 3000);
            return false;
        }

        const voucherDate = parseDate(transaction.voucherDate);
        if (voucherDate) {
            // Reset time components for date-only comparison
            bankDate.setHours(0, 0, 0, 0);
            voucherDate.setHours(0, 0, 0, 0);

            if (bankDate < voucherDate) {
                setValidationError(`Invalid Bank Date: Bank Date cannot be earlier than Voucher Date (${transaction.voucherDate})`);
                setTimeout(() => setValidationError(null), 4000);
                return false;
            }
        }

        return true;
    };

    const handleCellClick = (transaction: ReconciliationTransaction) => {
        onRowSelect(transaction.id);
        setEditingId(transaction.id);
        setEditValue(transaction.bankDate || '');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
    };

    const handleInputBlur = () => {
        if (editingId) {
            const trimmedValue = editValue.trim();
            if (trimmedValue) {
                // Validate: Bank Date must be >= Voucher Date
                if (!validateBankDate(editingId, trimmedValue)) {
                    setEditingId(null);
                    setEditValue('');
                    return; // Reject invalid bank date
                }
            }

            const parsedDate = parseDate(trimmedValue);
            const isoDate = parsedDate ? parsedDate.toISOString() : null;

            onBankDateChange(editingId, trimmedValue || null, isoDate);
            setEditingId(null);
            setEditValue('');
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleInputBlur();
            // Move to next row
            if (currentIndex < transactions.length - 1) {
                const nextTransaction = transactions[currentIndex + 1];
                onRowSelect(nextTransaction.id);
                setEditingId(nextTransaction.id);
                setEditValue(nextTransaction.bankDate || '');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            handleInputBlur();
            const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
            if (nextIndex >= 0 && nextIndex < transactions.length) {
                const nextTransaction = transactions[nextIndex];
                onRowSelect(nextTransaction.id);
                setEditingId(nextTransaction.id);
                setEditValue(nextTransaction.bankDate || '');
            }
        } else if (e.key === 'Escape') {
            setEditingId(null);
            setEditValue('');
        }
    };

    const formatAmount = (amount: number | null) => {
        if (amount === null || amount === 0) return '';
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="overflow-auto custom-scrollbar relative">
            {/* Validation Error Toast */}
            {validationError && (
                <div className="sticky top-0 z-20 bg-red-600 text-white text-[12px] font-bold px-4 py-2 flex items-center gap-2 shadow-md">
                    <span className="text-white">⚠</span>
                    <span>{validationError}</span>
                    <button
                        onClick={() => setValidationError(null)}
                        className="ml-auto text-white/80 hover:text-white text-sm font-bold"
                    >
                        ✕
                    </button>
                </div>
            )}
            <table className="w-full text-[12px] border-collapse">
                <thead className="sticky top-0 z-10">
                    <tr className="bg-[#d4eaf3] text-[#1d5b6e] font-bold border-b border-[#9bc9d9]">
                        <th className="px-2 py-2 text-left border-r border-[#9bc9d9] w-[75px]">Date</th>
                        <th className="px-2 py-2 text-left border-r border-[#9bc9d9] min-w-[200px]">Particulars</th>
                        <th className="px-2 py-2 text-left border-r border-[#9bc9d9] w-[85px]">Vch Type</th>
                        <th className="px-2 py-2 text-center border-r border-[#9bc9d9] w-[85px] bg-[#e8f0d8]">Bank Date</th>
                        <th className="px-2 py-2 text-right border-r border-[#9bc9d9] w-[90px]">Debit</th>
                        <th className="px-2 py-2 text-right w-[90px]">Credit</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => {
                        const isSelected = selectedRowId === transaction.id;
                        const isEditing = editingId === transaction.id;
                        const isReconciled = !!transaction.bankDate;

                        return (
                            <tr
                                key={transaction.id}
                                className={`border-b border-gray-100 cursor-pointer transition-all ${isReconciled
                                    ? 'bg-[#f5f9f0]'
                                    : isSelected
                                        ? 'bg-[#fff8e6]'
                                        : 'hover:bg-[#f5f9fc]'
                                    }`}
                                onClick={() => onRowSelect(transaction.id)}
                            >
                                <td className="px-2 py-1.5 border-r border-gray-100 text-gray-700">
                                    {transaction.voucherDate}
                                </td>
                                <td className={`px-2 py-1.5 border-r border-gray-100 ${isReconciled ? 'text-gray-900' : 'text-gray-800'}`}>
                                    {transaction.particulars}
                                </td>
                                <td className="px-2 py-1.5 border-r border-gray-100 text-gray-600">
                                    {transaction.voucherType}
                                </td>
                                {/* Bank Date - Editable */}
                                <td
                                    className={`px-1 py-1 border-r border-gray-100 text-center ${isReconciled ? 'bg-[#e8f0d8]' : 'bg-[#fffbf0]'
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCellClick(transaction);
                                    }}
                                >
                                    {isEditing ? (
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={editValue}
                                            onChange={handleInputChange}
                                            onBlur={handleInputBlur}
                                            onKeyDown={(e) => handleInputKeyDown(e, index)}
                                            className="w-full px-1 py-0.5 text-center text-[12px] border border-[#2d819b] bg-white focus:outline-none focus:ring-1 focus:ring-[#2d819b]"
                                            placeholder="dd-mmm-yy"
                                        />
                                    ) : (
                                        <span
                                            className={`block w-full px-1 py-0.5 border border-transparent ${isReconciled
                                                ? 'font-medium text-gray-800'
                                                : 'text-gray-400 hover:border-gray-300'
                                                }`}
                                        >
                                            {transaction.bankDate || '—'}
                                        </span>
                                    )}
                                </td>
                                <td className={`px-2 py-1.5 text-right border-r border-gray-100 ${transaction.debitAmount ? 'text-gray-900' : 'text-gray-400'
                                    }`}>
                                    {formatAmount(transaction.debitAmount)}
                                </td>
                                <td className={`px-2 py-1.5 text-right ${transaction.creditAmount ? 'text-gray-900' : 'text-gray-400'
                                    }`}>
                                    {formatAmount(transaction.creditAmount)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ReconciliationTable;
