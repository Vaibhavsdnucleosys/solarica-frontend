import React, { useEffect, useState } from 'react';
import TallyReportLayout from './TallyReportLayout';
import { getBalanceSheet, BalanceSheetData, DEFAULT_COMPANY_ID } from '../../services/accountingService';
import { Loader2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { exportTableToExcel } from '../../utils/excelExport';
import { SidebarButtonProps } from '../TallyIntegration/TallyCommon/TallySidebar';

export interface BalanceSheetProps {
    onBack: () => void;
    companyId?: string;
    companyName?: string;
}

const BalanceSheet: React.FC<BalanceSheetProps> = ({ onBack, companyId = DEFAULT_COMPANY_ID, companyName }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<BalanceSheetData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getBalanceSheet(companyId);
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch balance sheet');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [companyId]);

    const formatCurrency = (amount: number | undefined | null): string => {
        if (amount === undefined || amount === null || amount === 0) return ' - ';
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Math.abs(amount));
    };

    const formatDate = (dateStr: string | undefined): string => {
        if (!dateStr) return '31 March, 2025';
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('en-IN', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    };

    const handleExport = () => {
        exportTableToExcel('balance-sheet-table', `Balance_Sheet_${data?.companyName || 'Solarica'}_${new Date().toISOString().split('T')[0]}`);
    };

    const sidebarButtons: (SidebarButtonProps | { label: 'SEPARATOR' | 'SPACER' })[] = [
        { keyName: 'F2', label: 'Period', underline: 'none' },
        { keyName: 'F3', label: 'Company', underline: 'none' },
        { keyName: 'F4', label: '', disabled: true },
        { label: 'SEPARATOR' },
        { keyName: 'E', label: 'Export', onClick: handleExport, underline: 'single' },
        { keyName: 'F6', label: '', underline: 'single' },
        { keyName: 'F7', label: '', underline: 'single' },
        { keyName: 'F8', label: 'Valuation', underline: 'single' },
        { keyName: 'F9', label: '', underline: 'single' },
        { keyName: 'F10', label: '', underline: 'single' },
        { label: 'SEPARATOR' },
        { keyName: 'B', label: 'Basis of Values', underline: 'single' },
        { keyName: 'H', label: 'Change View', underline: 'single' },
        { keyName: 'J', label: 'Exception Reports', underline: 'single' },
        { keyName: 'L', label: 'Save View', underline: 'single' },
        { label: 'SEPARATOR' },
        { keyName: 'F', label: 'Apply Filter', underline: 'single' },
        { label: 'SEPARATOR' },
        { keyName: 'C', label: 'New Column', underline: 'none' },
        { keyName: 'A', label: 'Alter Column', underline: 'none' },
        { keyName: 'D', label: 'Delete Column', underline: 'none' },
        { keyName: 'N', label: 'Auto Column', underline: 'none' },
        { label: 'SPACER' },
        { keyName: 'F12', label: 'Configure', underline: 'none' },
    ];

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#def1fc]">
                <Loader2 className="w-8 h-8 text-[#2a5585] animate-spin mb-2" />
                <p className="text-[#1b2c3c] font-bold">Loading Balance Sheet...</p>
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

    const eq = data?.equityAndLiabilities;
    const assets = data?.assets;

    // Helper component for line items - Tally style
    const LineItemRow = ({
        label,
        noteNo,
        amount,
        previousAmount = 0,
        indent = 0,
        isBold = false,
        isNegative = false
    }: {
        label: string;
        noteNo?: number | null;
        amount: number;
        previousAmount?: number;
        indent?: number;
        isBold?: boolean;
        isNegative?: boolean;
    }) => {
        const displayAmount = amount !== 0
            ? (isNegative && amount > 0 ? `(${formatCurrency(amount)})` : formatCurrency(amount))
            : ' - ';

        return (
            <tr className="hover:bg-[#def1fc] cursor-pointer flex w-full shrink-0">
                <td
                    className={`py-0.5 border-r border-[#cbd5e1]/50 flex-1 ${isBold ? 'font-bold' : ''}`}
                    style={{ paddingLeft: `${indent * 16 + 8}px` }}
                >
                    {label}
                </td>
                <td className="py-0.5 px-2 text-center w-16 border-r border-[#cbd5e1]/50 text-[11px] flex items-center justify-center">
                    {noteNo || ''}
                </td>
                <td className={`py-0.5 px-4 text-right w-[140px] border-r border-[#cbd5e1]/50 flex items-center justify-end ${isBold ? 'font-bold' : ''}`}>
                    {displayAmount}
                </td>
                <td className="py-0.5 px-4 text-right w-[140px] text-gray-400 italic flex items-center justify-end">
                    {formatCurrency(previousAmount)}
                </td>
            </tr>
        );
    };

    // Section subtotal row - Tally style
    const SubtotalRow = ({ amount, previousAmount = 0, label = '' }: { amount: number; previousAmount?: number; label?: string }) => (
        <tr className="bg-gray-50/50 flex w-full shrink-0">
            <td className="py-0.5 px-2 border-r border-[#cbd5e1]/50 flex-1" colSpan={2}>
                <span className="text-[10px] text-[#2a5585] italic">{label}</span>
            </td>
            <td className="w-16 border-r border-[#cbd5e1]/50"></td>
            <td className="py-0.5 px-4 text-right w-[140px] font-bold border-r border-[#cbd5e1]/50 border-t border-[#1b2c3c] flex items-center justify-end">
                {formatCurrency(amount)}
            </td>
            <td className="py-0.5 px-4 text-right w-[140px] text-gray-400 italic border-t border-gray-300 flex items-center justify-end">
                {formatCurrency(previousAmount)}
            </td>
        </tr>
    );

    // Section header row - Tally style with highlight
    const SectionHeader = ({ number, label }: { number: string; label: string }) => (
        <tr className="bg-[#feba35]/20 flex w-full shrink-0">
            <td colSpan={4} className="py-1 px-2 font-bold text-[#1b2c3c] flex-1 border-r border-[#cbd5e1]/50">
                {number}&nbsp;&nbsp;&nbsp;&nbsp;{label}
            </td>
            <td className="w-16 border-r border-[#cbd5e1]/50"></td>
            <td className="w-[140px] border-r border-[#cbd5e1]/50"></td>
            <td className="w-[140px]"></td>
        </tr>
    );

    // Main section header - Tally style
    const MainSectionHeader = ({ letter, label }: { letter: string; label: string }) => (
        <tr className="bg-[#feba35] font-bold flex w-full shrink-0">
            <td colSpan={4} className="py-1.5 px-2 text-[#1b2c3c] text-[14px] flex-1 border-r border-[#cbd5e1]/50">
                {letter}&nbsp;&nbsp;&nbsp;&nbsp;{label}
            </td>
            <td className="w-16 border-r border-[#cbd5e1]/50"></td>
            <td className="w-[140px] border-r border-[#cbd5e1]/50"></td>
            <td className="w-[140px]"></td>
        </tr>
    );

    return (
        <TallyReportLayout
            title="Balance Sheet"
            companyName={data?.companyName || "Solarica"}
            period={`as at ${formatDate(data?.asOnDate)}`}
            onBack={onBack}
            sidebarButtons={sidebarButtons}
        >
            <div className="flex flex-col h-full bg-white font-sans text-[13px] text-[#1b2c3c]">
                {/* Column Headers - Tally Style */}
                <div className="border-b border-[#cbd5e1] flex font-bold text-[14px] shrink-0">
                    <div className="flex-1 px-4 py-1.5 border-r border-[#cbd5e1]">Particulars</div>
                    <div className="w-16 px-2 py-1.5 text-center border-r border-[#cbd5e1] text-[11px]">Note No.</div>
                    <div className="w-[280px] flex flex-col">
                        <div className="text-center border-b border-[#cbd5e1] py-0.5 text-[11px] uppercase">
                            {data?.companyName || 'Solarica'}
                        </div>
                        <div className="flex">
                            <div className="flex-1 text-center py-0.5 border-r border-[#cbd5e1] text-[10px]">
                                As at {formatDate(data?.asOnDate)}
                            </div>
                            <div className="flex-1 text-center py-0.5 text-[10px] text-gray-400">
                                As at {formatDate(data?.previousYearDate)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-auto flex flex-col">
                    <table id="balance-sheet-table" className="w-full border-collapse text-[13px] flex-1 flex flex-col">
                        <thead className="hidden">
                            <tr>
                                <th>Particulars</th>
                                <th>Note No.</th>
                                <th>As at {formatDate(data?.asOnDate)}</th>
                                <th>As at {formatDate(data?.previousYearDate)}</th>
                            </tr>
                        </thead>
                        <tbody className="flex-1 flex flex-col">
                            {/* ================================================== */}
                            {/* A. EQUITY AND LIABILITIES */}
                            {/* ================================================== */}
                            <MainSectionHeader letter="A" label="EQUITY AND LIABILITIES" />

                            {/* 1. Shareholders' funds */}
                            <SectionHeader number="1" label="Shareholders' funds" />
                            <LineItemRow
                                label="(a) Share capital"
                                noteNo={eq?.shareholdersFunds.shareCapital.noteNo}
                                amount={eq?.shareholdersFunds.shareCapital.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(b) Reserves and surplus"
                                noteNo={eq?.shareholdersFunds.reservesAndSurplus.noteNo}
                                amount={eq?.shareholdersFunds.reservesAndSurplus.total || 0}
                                indent={2}
                                isNegative={(eq?.shareholdersFunds.reservesAndSurplus.total || 0) < 0}
                            />
                            <LineItemRow
                                label="(c) Money received against share warrants"
                                noteNo={eq?.shareholdersFunds.moneyReceivedAgainstShareWarrants.noteNo}
                                amount={eq?.shareholdersFunds.moneyReceivedAgainstShareWarrants.total || 0}
                                indent={2}
                            />
                            <SubtotalRow amount={eq?.shareholdersFunds.total || 0} />

                            {/* 2. Share application money pending allotment */}
                            <SectionHeader number="2" label="Share application money pending allotment" />
                            <SubtotalRow amount={eq?.shareApplicationMoneyPendingAllotment.total || 0} />

                            {/* 3. Non-current liabilities */}
                            <SectionHeader number="3" label="Non-current liabilities" />
                            <LineItemRow
                                label="(a) Long-term borrowings"
                                noteNo={eq?.nonCurrentLiabilities.longTermBorrowings.noteNo}
                                amount={eq?.nonCurrentLiabilities.longTermBorrowings.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(b) Deferred tax liabilities (net)"
                                noteNo={eq?.nonCurrentLiabilities.deferredTaxLiabilities.noteNo}
                                amount={eq?.nonCurrentLiabilities.deferredTaxLiabilities.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(c) Other long-term liabilities"
                                noteNo={eq?.nonCurrentLiabilities.otherLongTermLiabilities.noteNo}
                                amount={eq?.nonCurrentLiabilities.otherLongTermLiabilities.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(d) Long-term provisions"
                                noteNo={eq?.nonCurrentLiabilities.longTermProvisions.noteNo}
                                amount={eq?.nonCurrentLiabilities.longTermProvisions.total || 0}
                                indent={2}
                            />
                            <SubtotalRow amount={eq?.nonCurrentLiabilities.total || 0} />

                            {/* 4. Current liabilities */}
                            <SectionHeader number="4" label="Current liabilities" />
                            <LineItemRow
                                label="(a) Short-term borrowings"
                                noteNo={eq?.currentLiabilities.shortTermBorrowings.noteNo}
                                amount={eq?.currentLiabilities.shortTermBorrowings.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(b) Trade payables"
                                noteNo={eq?.currentLiabilities.tradePayables.noteNo}
                                amount={eq?.currentLiabilities.tradePayables.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(c) Other current liabilities"
                                noteNo={eq?.currentLiabilities.otherCurrentLiabilities.noteNo}
                                amount={eq?.currentLiabilities.otherCurrentLiabilities.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(d) Short-term provisions"
                                noteNo={eq?.currentLiabilities.shortTermProvisions.noteNo}
                                amount={eq?.currentLiabilities.shortTermProvisions.total || 0}
                                indent={2}
                            />
                            <SubtotalRow amount={eq?.currentLiabilities.total || 0} label="GN 6.17" />

                            {/* TOTAL EQUITY & LIABILITIES */}
                            <tr className="bg-[#2a5585] text-white font-bold flex w-full shrink-0">
                                <td className="py-1.5 px-4 border-r border-[#1b2c3c] flex-1" colSpan={2}>
                                    TOTAL
                                </td>
                                <td className="py-1.5 px-4 text-right w-[140px] border-r border-[#1b2c3c]">
                                    <span className="border-b-2 border-white">{formatCurrency(eq?.total || 0)}</span>
                                </td>
                                <td className="py-1.5 px-4 text-right w-[140px] text-white/60">
                                    <span className="border-b border-white/60">{formatCurrency(0)}</span>
                                </td>
                            </tr>

                            {/* Spacer row */}
                            <tr className="shrink-0"><td colSpan={4} className="py-2 bg-[#def1fc]"></td></tr>

                            {/* ================================================== */}
                            {/* B. ASSETS */}
                            {/* ================================================== */}
                            <MainSectionHeader letter="B" label="ASSETS" />

                            {/* 1. Non-current assets */}
                            <SectionHeader number="1" label="Non-current assets" />

                            {/* (a) Fixed assets */}
                            <tr className="bg-gray-50/30 flex w-full shrink-0">
                                <td colSpan={4} className="py-0.5 px-2 font-medium flex-1 border-r border-[#cbd5e1]/50" style={{ paddingLeft: '32px' }}>
                                    (a) Fixed assets
                                </td>
                                <td className="w-16 border-r border-[#cbd5e1]/50"></td>
                                <td className="w-[140px] border-r border-[#cbd5e1]/50"></td>
                                <td className="w-[140px]"></td>
                            </tr>
                            <LineItemRow
                                label="(i) Tangible assets"
                                noteNo={assets?.nonCurrentAssets.fixedAssets.tangibleAssets.noteNo}
                                amount={assets?.nonCurrentAssets.fixedAssets.tangibleAssets.total || 0}
                                indent={3}
                            />
                            <LineItemRow
                                label="(ii) Intangible assets"
                                noteNo={assets?.nonCurrentAssets.fixedAssets.intangibleAssets.noteNo}
                                amount={assets?.nonCurrentAssets.fixedAssets.intangibleAssets.total || 0}
                                indent={3}
                            />
                            <LineItemRow
                                label="(iii) Capital work-in-progress"
                                noteNo={assets?.nonCurrentAssets.fixedAssets.capitalWorkInProgress.noteNo}
                                amount={assets?.nonCurrentAssets.fixedAssets.capitalWorkInProgress.total || 0}
                                indent={3}
                            />
                            <LineItemRow
                                label="(iv) Intangible assets under development"
                                noteNo={assets?.nonCurrentAssets.fixedAssets.intangibleAssetsUnderDevelopment.noteNo}
                                amount={assets?.nonCurrentAssets.fixedAssets.intangibleAssetsUnderDevelopment.total || 0}
                                indent={3}
                            />
                            <LineItemRow
                                label="(v) Fixed assets held for sale"
                                noteNo={assets?.nonCurrentAssets.fixedAssets.fixedAssetsHeldForSale.noteNo}
                                amount={assets?.nonCurrentAssets.fixedAssets.fixedAssetsHeldForSale.total || 0}
                                indent={3}
                            />
                            <SubtotalRow amount={assets?.nonCurrentAssets.fixedAssets.total || 0} />

                            {/* Other non-current assets */}
                            <LineItemRow
                                label="(b) Non-current investments"
                                noteNo={assets?.nonCurrentAssets.nonCurrentInvestments.noteNo}
                                amount={assets?.nonCurrentAssets.nonCurrentInvestments.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(c) Deferred tax assets (net)"
                                noteNo={assets?.nonCurrentAssets.deferredTaxAssets.noteNo}
                                amount={assets?.nonCurrentAssets.deferredTaxAssets.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(d) Long-term loans and advances"
                                noteNo={assets?.nonCurrentAssets.longTermLoansAndAdvances.noteNo}
                                amount={assets?.nonCurrentAssets.longTermLoansAndAdvances.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(e) Other non-current assets"
                                noteNo={assets?.nonCurrentAssets.otherNonCurrentAssets.noteNo}
                                amount={assets?.nonCurrentAssets.otherNonCurrentAssets.total || 0}
                                indent={2}
                            />
                            <SubtotalRow amount={(assets?.nonCurrentAssets.total || 0) - (assets?.nonCurrentAssets.fixedAssets.total || 0)} />

                            {/* 2. Current assets */}
                            <SectionHeader number="2" label="Current assets" />
                            <LineItemRow
                                label="(a) Current investments"
                                noteNo={assets?.currentAssets.currentInvestments.noteNo}
                                amount={assets?.currentAssets.currentInvestments.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(b) Inventories"
                                noteNo={assets?.currentAssets.inventories.noteNo}
                                amount={assets?.currentAssets.inventories.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(c) Trade receivables"
                                noteNo={assets?.currentAssets.tradeReceivables.noteNo}
                                amount={assets?.currentAssets.tradeReceivables.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(d) Cash and cash equivalents"
                                noteNo={assets?.currentAssets.cashAndCashEquivalents.noteNo}
                                amount={assets?.currentAssets.cashAndCashEquivalents.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(e) Short-term loans and advances"
                                noteNo={assets?.currentAssets.shortTermLoansAndAdvances.noteNo}
                                amount={assets?.currentAssets.shortTermLoansAndAdvances.total || 0}
                                indent={2}
                            />
                            <LineItemRow
                                label="(f) Other current assets"
                                noteNo={assets?.currentAssets.otherCurrentAssets.noteNo}
                                amount={assets?.currentAssets.otherCurrentAssets.total || 0}
                                indent={2}
                            />
                            <SubtotalRow amount={assets?.currentAssets.total || 0} label="GN 6.17" />

                            {/* TOTAL ASSETS */}
                            <tr className="bg-[#2a5585] text-white font-bold flex w-full shrink-0">
                                <td className="py-1.5 px-4 border-r border-[#1b2c3c] flex-1" colSpan={2}>
                                    TOTAL
                                </td>
                                <td className="py-1.5 px-4 text-right w-[140px] border-r border-[#1b2c3c]">
                                    <span className="border-b-2 border-white">{formatCurrency(assets?.total || 0)}</span>
                                </td>
                                <td className="py-1.5 px-4 text-right w-[140px] text-white/60">
                                    <span className="border-b border-white/60">{formatCurrency(0)}</span>
                                </td>
                            </tr>

                            {/* Spacer row to extend vertical lines */}
                            <tr className="flex-1 flex w-full min-h-[50px]">
                                <td className="flex-1 border-r border-[#cbd5e1]/50"></td>
                                <td className="w-16 border-r border-[#cbd5e1]/50"></td>
                                <td className="w-[140px] border-r border-[#cbd5e1]/50"></td>
                                <td className="w-[140px]"></td>
                            </tr>

                            {/* Footer note */}
                            <tr className="shrink-0 flex w-full">
                                <td colSpan={4} className="flex-1 py-2 px-4 text-[11px] text-[#2a5585] italic bg-gray-50/50">
                                    See accompanying notes forming part of the financial statements
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Balance Check Warning - Tally Style */}
                {data && !data.totals.isBalanced && (
                    <div className="bg-red-50 text-red-700 px-4 py-0.5 text-right font-bold text-[12px] italic border-t border-red-200 shrink-0">
                        ⚠️ Balance Sheet is not balanced. Difference: {formatCurrency(data.totals.difference)}
                    </div>
                )}
            </div>
        </TallyReportLayout>
    );
};

export default BalanceSheet;
