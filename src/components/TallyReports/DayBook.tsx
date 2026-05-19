import React, { useEffect, useState } from 'react';
import TallyReportLayout from './TallyReportLayout';
import { getDayBook, deleteVoucher, DayBookData, DEFAULT_COMPANY_ID } from '../../services/accountingService';
import { Loader2, AlertCircle } from 'lucide-react';
import { exportTableToExcel } from '../../utils/excelExport';

export interface DayBookProps {
    onBack: () => void;
    companyId?: string;
    companyName?: string;
    onVoucherClick?: (voucherId: string, voucherType: string) => void;
}

const DayBook: React.FC<DayBookProps> = ({ onBack, companyId = DEFAULT_COMPANY_ID, companyName, onVoucherClick }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DayBookData | null>(null);
    const [error, setError] = useState<string | null>(null);
    // Automatically take today's date
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedVchIndex, setSelectedVchIndex] = useState<number>(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getDayBook(companyId, selectedDate);
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch day book');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [companyId, selectedDate]);

    const formatCurrency = (amount: any) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num || 0);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#def1fc]">
                <Loader2 className="w-8 h-8 text-[#2a5585] animate-spin mb-2" />
                <p className="text-[#1b2c3c] font-bold">Loading Day Book...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#def1fc] p-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-[#1b2c3c]">Error Loading Report</h3>
                <p className="text-gray-600 max-w-md mt-2 mb-6">{error}</p>
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-[#2a5585] text-white rounded font-bold uppercase text-sm"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <TallyReportLayout
            title="Day Book"
            companyName="Solarica"
            period={formatDate(selectedDate)}
            onBack={onBack}
            sidebarButtons={[
                { keyName: 'F2', label: 'Date', onClick: () => { } },
                { label: 'SEPARATOR' },
                { keyName: 'E', label: 'Export', onClick: () => exportTableToExcel('day-book-table', `Day_Book_Solarica_${selectedDate}`), underline: 'single' },
                { keyName: 'F4', label: 'Vch Type', onClick: () => { } },
                { keyName: 'F12', label: 'Configure' },
                { label: 'SEPARATOR' },
                {
                    keyName: 'Alt+D',
                    label: 'Delete',
                    onClick: () => {
                        if (data?.vouchers[selectedVchIndex]) setShowDeleteModal(true);
                    },
                    underline: 'single'
                },
            ]}
        >
            <div className="flex flex-col h-full bg-white font-sans text-[13px] text-[#1b2c3c]">
                {/* Date Selection Info Bar */}
                <div className="bg-[#f2faff] px-4 py-2 border-b border-[#cbd5e1] flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-[#2a5585]">Date:</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white border border-[#2a5585] text-[13px] px-2 py-0.5 outline-none font-bold"
                        />
                    </div>
                    <div className="text-[#2a5585] font-bold uppercase tracking-wider">
                        {formatDate(selectedDate)}
                    </div>
                </div>

                {/* Custom Tally Header Table */}
                <div className="border-b border-[#cbd5e1] flex font-bold text-[14px] shrink-0">
                    <div className="w-32 px-4 py-1.5 border-r border-[#cbd5e1]">Date</div>
                    <div className="flex-1 px-4 py-1.5 border-r border-[#cbd5e1]">Particulars</div>
                    <div className="w-32 px-4 py-1.5 border-r border-[#cbd5e1]">Vch Type</div>
                    <div className="w-32 px-4 py-1.5 border-r border-[#cbd5e1]">Vch No.</div>
                    <div className="w-40 px-4 py-1.5 border-r border-[#cbd5e1]">Invoice No.</div>
                    <div className="w-[300px] flex flex-col">
                        <div className="text-center border-b border-[#cbd5e1] py-0.5 text-[11px] uppercase">Solarica</div>
                        <div className="flex">
                            <div className="flex-1 text-center py-0.5 border-r border-[#cbd5e1] text-[11px] uppercase">Debit</div>
                            <div className="flex-1 text-center py-0.5 text-[11px] uppercase">Credit</div>
                        </div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-auto flex flex-col">
                    <table id="day-book-table" className="w-full border-collapse flex-1 flex flex-col">
                        <tbody className="flex-1 flex flex-col">
                            {data?.vouchers.map((vch, i) => {
                                const vType = typeof vch.voucherType === 'object' ? vch.voucherType.name : (vch.voucherType || 'VOUCHER');
                                return (
                                    <tr
                                        key={i}
                                        className={`hover:bg-[#def1fc] cursor-pointer group border-b border-gray-100 flex w-full shrink-0 ${selectedVchIndex === i ? 'bg-[#feba35]/20' : ''}`}
                                        onClick={() => {
                                            setSelectedVchIndex(i);
                                            // Optional: Double click to alter, single click to select
                                        }}
                                        onDoubleClick={() => onVoucherClick?.(vch.id, vType)}
                                    >
                                        <td className="w-32 px-4 py-1 text-gray-500 whitespace-nowrap">{formatDate(vch.voucherDate)}</td>
                                        <td className="flex-1 px-4 py-1 font-bold">
                                            {(() => {
                                                if (!vch.entries || vch.entries.length === 0) return vch.narration || 'General Entry';

                                                // Logic: Identify the "particular" side (Opposite of Cash/Bank header)
                                                let particularEntries = [];
                                                if (vType === 'Receipt') {
                                                    particularEntries = vch.entries.filter((e: any) => e.entryType === 'CREDIT');
                                                } else if (vType === 'Payment') {
                                                    particularEntries = vch.entries.filter((e: any) => e.entryType === 'DEBIT');
                                                } else if (vType === 'Contra') {
                                                    // In Contra, usually show the destination for Clarity
                                                    particularEntries = vch.entries.filter((e: any) => e.entryType === 'DEBIT');
                                                } else {
                                                    // For Journal/Others, show the Debit side by default or join all
                                                    particularEntries = vch.entries.filter((e: any) => e.entryType === 'DEBIT');
                                                }

                                                if (particularEntries.length === 0) return vch.narration || 'General Entry';

                                                if (particularEntries.length === 1) return particularEntries[0].ledger?.name;

                                                // Handle multiple particulars like Tally: First Ledger + " (As per details)"
                                                return `${particularEntries[0].ledger?.name} & others`;
                                            })()}
                                        </td>
                                        <td className="w-32 px-4 py-1 uppercase text-[11px] text-gray-600 font-bold">
                                            {vType}
                                        </td>
                                        <td className="w-32 px-4 py-1 font-bold underline decoration-dotted decoration-gray-400">{vch.voucherNumber}</td>
                                        <td className="w-40 px-4 py-1 text-blue-700 font-bold uppercase tracking-tight">{vch.invoiceNumber || ''}</td>
                                        <td className="w-[150px] px-4 py-1 text-right font-bold border-l border-[#cbd5e1]/50 bg-gray-50/10 group-hover:bg-[#def1fc]">
                                            {parseFloat(vch.totalDebit) > 0 ? formatCurrency(vch.totalDebit) : ''}
                                        </td>
                                        <td className="w-[150px] px-4 py-1 text-right font-bold border-l border-[#cbd5e1]/50 bg-gray-50/10 group-hover:bg-[#def1fc]">
                                            {parseFloat(vch.totalCredit) > 0 ? formatCurrency(vch.totalCredit) : ''}
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!data || data.vouchers.length === 0) ? (
                                <tr className="flex w-full">
                                    <td colSpan={6} className="flex-1 py-20 text-center text-gray-400 italic font-bold">No transactions recorded for this date</td>
                                </tr>
                            ) : (
                                /* Spacer row to extend vertical lines */
                                <tr className="flex-1 flex w-full min-h-[50px]">
                                    <td className="w-32"></td>
                                    <td className="flex-1"></td>
                                    <td className="w-32"></td>
                                    <td className="w-32"></td>
                                    <td className="w-40"></td>
                                    <td className="w-[150px] border-l border-[#cbd5e1]/50"></td>
                                    <td className="w-[150px] border-l border-[#cbd5e1]/50"></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Totals */}
                <div className="border-t-2 border-[#1b2c3c] bg-white shrink-0">
                    <div className="flex font-bold">
                        <div className="flex-1 px-4 py-1 border-r border-[#cbd5e1]">Total</div>
                        <div className="w-[150px] px-4 py-1 text-right border-r border-[#cbd5e1]">
                            <span className="border-b border-[#1b2c3c]">{data ? formatCurrency(data.summary.totalDebit) : '0.00'}</span>
                        </div>
                        <div className="w-[150px] px-4 py-1 text-right">
                            <span className="border-b border-[#1b2c3c]">{data ? formatCurrency(data.summary.totalCredit) : '0.00'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[1000]">
                    <div className="bg-[#def1fc] border-2 border-[#d32f2f] p-6 w-64 text-center shadow-2xl">
                        <div className="font-bold text-[#d32f2f] text-lg mb-4">Delete Voucher?</div>
                        <div className="flex justify-center gap-8 font-bold text-gray-800">
                            <span className="cursor-pointer hover:underline" onClick={async () => {
                                const vch = data?.vouchers[selectedVchIndex];
                                if (vch) {
                                    await deleteVoucher(vch.id);
                                    setShowDeleteModal(false);
                                    // Refresh data
                                    const result = await getDayBook(companyId, selectedDate);
                                    setData(result);
                                }
                            }}>Yes (Enter)</span>
                            <span className="cursor-pointer hover:underline" onClick={() => setShowDeleteModal(false)}>No (Esc)</span>
                        </div>
                    </div>
                </div>
            )}
        </TallyReportLayout>
    );
};

export default DayBook;
