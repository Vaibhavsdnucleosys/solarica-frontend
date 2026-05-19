import React, { useState, useEffect, useCallback } from 'react';
import { getAllLedgers, getVoucherTypes, addAdjustmentEntry, DEFAULT_COMPANY_ID } from '../../../../../services/accountingService';
import TallyLedgerCreation from '../../../TallyGroupUI/TallyLedgerCreation';

interface AddEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    bankLedgerId: string;
    bankLedgerName: string;
    companyId: string;
    onEntryAdded: () => void;
}

type EntryType = 'BANK_CHARGE' | 'INTEREST' | 'OTHER';

const AddEntryModal: React.FC<AddEntryModalProps> = ({
    isOpen,
    onClose,
    bankLedgerId,
    bankLedgerName,
    companyId,
    onEntryAdded
}) => {
    const [entryType, setEntryType] = useState<EntryType>('BANK_CHARGE');
    const [amount, setAmount] = useState<string>('');
    const [narration, setNarration] = useState<string>('');
    const [voucherDate, setVoucherDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [bankDate, setBankDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [referenceNumber, setReferenceNumber] = useState<string>('');
    const [contraLedgerId, setContraLedgerId] = useState<string>('');

    const [ledgers, setLedgers] = useState<any[]>([]);
    const [voucherTypes, setVoucherTypes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showLedgerCreation, setShowLedgerCreation] = useState(false);

    // Load ledgers and voucher types
    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen, companyId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const effectiveCompanyId = companyId || DEFAULT_COMPANY_ID;
            const [allLedgers, allVoucherTypes] = await Promise.all([
                getAllLedgers(effectiveCompanyId),
                getVoucherTypes(effectiveCompanyId)
            ]);
            setLedgers(allLedgers || []);
            setVoucherTypes(allVoucherTypes || []);

            // Pre-select common ledgers based on entry type
            const bankChargesLedger = allLedgers?.find((l: any) =>
                l.name.toLowerCase().includes('bank charge') ||
                l.name.toLowerCase().includes('bank charges')
            );
            if (bankChargesLedger) {
                setContraLedgerId(bankChargesLedger.id);
            }
        } catch (err) {
            console.error('Failed to load data:', err);
            setError('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    // Update narration and contra ledger based on entry type
    useEffect(() => {
        if (entryType === 'BANK_CHARGE') {
            setNarration('Bank charges debited');
            const bankChargesLedger = ledgers.find(l =>
                l.name.toLowerCase().includes('bank charge')
            );
            if (bankChargesLedger) setContraLedgerId(bankChargesLedger.id);
        } else if (entryType === 'INTEREST') {
            setNarration('Interest credited by bank');
            const interestLedger = ledgers.find(l =>
                l.name.toLowerCase().includes('interest') &&
                l.name.toLowerCase().includes('received')
            );
            if (interestLedger) setContraLedgerId(interestLedger.id);
        } else {
            setNarration('');
        }
    }, [entryType, ledgers]);

    const handleSubmit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        if (!contraLedgerId) {
            setError('Please select a contra ledger');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const effectiveCompanyId = companyId || DEFAULT_COMPANY_ID;

            // Find appropriate voucher type (Journal or Contra)
            const journalType = voucherTypes.find(v =>
                v.name.toLowerCase() === 'journal' ||
                v.name.toLowerCase() === 'contra'
            );

            if (!journalType) {
                setError('No suitable voucher type found. Please create a Journal voucher type.');
                setIsSaving(false);
                return;
            }

            await addAdjustmentEntry(bankLedgerId, {
                companyId: effectiveCompanyId,
                voucherTypeId: journalType.id,
                amount: parseFloat(amount),
                entryType: entryType === 'INTEREST' ? 'DEBIT' : 'CREDIT', // Bank gets credited for charges, debited for interest
                narration,
                instrumentType: entryType,
                instrumentNumber: referenceNumber || undefined,
                bankDate,
                voucherDate,
                contraLedgerId
            });

            // Reset form
            setAmount('');
            setNarration('');
            setReferenceNumber('');
            onEntryAdded();
            onClose();
        } catch (err: any) {
            console.error('Failed to create entry:', err);
            // Extract error message from response or error object
            const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to create entry';
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            {/* Show Ledger Creation OR Add Entry Modal, not both */}
            {showLedgerCreation ? (
                <TallyLedgerCreation
                    onClose={() => {
                        setShowLedgerCreation(false);
                        onClose(); // Close Add Entry modal too
                    }}
                    companyId={companyId || DEFAULT_COMPANY_ID}
                    refreshData={() => {
                        loadData(); // Refresh ledger dropdown
                        // Close both modals and refresh reconciliation
                        setShowLedgerCreation(false);
                        onClose(); // Close Add Entry modal
                        onEntryAdded(); // Refresh reconciliation data
                    }}
                />
            ) : (
                <div className="bg-white w-[500px] max-h-[90vh] flex flex-col shadow-xl border border-[#2d819b]">
                    {/* Header */}
                    <div className="bg-[#2d819b] text-white px-4 py-2 font-bold flex justify-between items-center">
                        <span>Add Adjustment Entry</span>
                        <span
                            onClick={onClose}
                            className="cursor-pointer hover:bg-red-500 px-2 transition-colors"
                        >
                            ✕
                        </span>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="p-4 space-y-4 overflow-y-auto flex-1">
                        {/* Bank Account Display */}
                        <div className="bg-[#f0f7fa] p-3 border border-[#9bc9d9]">
                            <div className="text-[11px] text-gray-500 uppercase">Bank Account</div>
                            <div className="font-bold text-[#2d819b]">{bankLedgerName}</div>
                        </div>

                        {/* Entry Type Selection */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-600 mb-1">Entry Type</label>
                            <div className="flex gap-2">
                                {[
                                    { value: 'BANK_CHARGE', label: 'Bank Charges' },
                                    { value: 'INTEREST', label: 'Interest Received' },
                                    { value: 'OTHER', label: 'Other' }
                                ].map(type => (
                                    <button
                                        key={type.value}
                                        onClick={() => setEntryType(type.value as EntryType)}
                                        className={`px-3 py-1.5 text-[12px] border ${entryType === type.value
                                            ? 'bg-[#2d819b] text-white border-[#2d819b]'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-600 mb-1">Amount (₹)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2d819b] bg-yellow-50"
                                placeholder="Enter amount"
                                autoFocus
                            />
                        </div>

                        {/* Voucher Date & Bank Date */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-[12px] font-bold text-gray-600 mb-1">Voucher Date</label>
                                <input
                                    type="date"
                                    value={voucherDate}
                                    onChange={(e) => setVoucherDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2d819b]"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[12px] font-bold text-gray-600 mb-1">Bank Date</label>
                                <input
                                    type="date"
                                    value={bankDate}
                                    onChange={(e) => setBankDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2d819b]"
                                />
                            </div>
                        </div>

                        {/* Contra Ledger */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-[12px] font-bold text-gray-600">
                                    {entryType === 'BANK_CHARGE' ? 'Bank Charges Account' :
                                        entryType === 'INTEREST' ? 'Interest Account' : 'Contra Account'}
                                </label>
                                <button
                                    onClick={() => setShowLedgerCreation(true)}
                                    className="text-[11px] text-[#2d819b] hover:underline font-semibold"
                                    type="button"
                                >
                                    + Create Ledger
                                </button>
                            </div>
                            <select
                                value={contraLedgerId}
                                onChange={(e) => setContraLedgerId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2d819b]"
                            >
                                <option value="">-- Select Ledger --</option>
                                {ledgers
                                    .filter(l => l.id !== bankLedgerId)
                                    .map(ledger => (
                                        <option key={ledger.id} value={ledger.id}>
                                            {ledger.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* Reference Number */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-600 mb-1">Reference Number (Optional)</label>
                            <input
                                type="text"
                                value={referenceNumber}
                                onChange={(e) => setReferenceNumber(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2d819b]"
                                placeholder="Transaction reference"
                            />
                        </div>

                        {/* Narration */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-600 mb-1">Narration</label>
                            <textarea
                                value={narration}
                                onChange={(e) => setNarration(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2d819b]"
                                rows={2}
                                placeholder="Description"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] px-3 py-2">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Footer - Fixed at bottom */}
                    <div className="bg-[#f0f7fa] px-4 py-3 flex justify-end gap-3 border-t border-[#9bc9d9] flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-1.5 text-[12px] border border-gray-400 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel (Esc)
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving || isLoading}
                            className="px-4 py-1.5 text-[12px] bg-[#2d819b] text-white hover:bg-[#1d6b7f] disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Entry'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddEntryModal;
