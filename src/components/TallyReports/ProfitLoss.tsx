import React, { useEffect, useState } from 'react';
import TallyReportLayout from './TallyReportLayout';
import { getProfitLoss, ProfitLossData, DEFAULT_COMPANY_ID } from '../../services/accountingService';
import { Loader2, AlertCircle } from 'lucide-react';
import { exportProfitLossToExcel } from '../../utils/excelExport';
import { SidebarButtonProps } from '../TallyIntegration/TallyCommon/TallySidebar';

export interface ProfitLossProps {
    onBack: () => void;
    companyId?: string;
    companyName?: string;
}

const ProfitLoss: React.FC<ProfitLossProps> = ({ onBack, companyId = DEFAULT_COMPANY_ID, companyName }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ProfitLossData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Default dates for the current financial year
    const startDate = '2025-04-01';
    const endDate = '2026-03-31';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getProfitLoss(companyId, startDate, endDate);
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch P&L statement');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [companyId]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Math.abs(amount));
    };

    const handleExport = () => {
        exportProfitLossToExcel(data, `Profit_Loss_Solarica_${new Date().toISOString().split('T')[0]}`);
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
                <p className="text-[#1b2c3c] font-bold">Loading P&L Statement...</p>
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
            title="Profit & Loss A/c"
            companyName="Solarica"
            period="1-Apr-25 to 31-Mar-26"
            onBack={onBack}
            sidebarButtons={sidebarButtons}
        >
            <div className="flex flex-col h-full bg-white font-sans text-[13px] text-[#1b2c3c]">
                {/* Column Headers */}
                <div className="flex border-b border-[#cbd5e1] shrink-0">
                    <div className="flex-1 flex justify-between items-end px-4 py-1.5 border-r border-[#cbd5e1]">
                        <span className="font-bold text-[14px]">Particulars</span>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-[11px] font-bold">Solarica</span>
                            <span className="text-[10px] italic leading-none">1-Apr-25 to 31-Mar-26</span>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-between items-end px-4 py-1.5">
                        <span className="font-bold text-[14px]">Particulars</span>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-[11px] font-bold">Solarica</span>
                            <span className="text-[10px] italic leading-none">1-Apr-25 to 31-Mar-26</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Expenses/Trading Side */}
                    <div className="flex-1 border-r border-[#cbd5e1] overflow-y-auto px-0 py-2">
                        {/* Trading Account Part */}
                        <div className="mb-2">
                            {data?.sections.directExpense.map((item, i) => (
                                <div key={i} className="flex justify-between px-4 py-0.5 hover:bg-[#def1fc]">
                                    <span className="font-bold">{item.name}</span>
                                    <span className="font-bold">{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Gross Profit c/o */}
                        {!data?.calculations.isLoss && (
                            <div className="flex justify-between px-4 py-0.5 mt-4 bg-gray-50 italic font-bold">
                                <span>Gross Profit c/o</span>
                                <span>{formatCurrency(data?.calculations.grossProfit || 0)}</span>
                            </div>
                        )}

                        {/* Indirect Account Part */}
                        <div className="mt-8">
                            {data?.sections.indirectExpense.map((item, i) => (
                                <div key={i} className="flex justify-between px-4 py-0.5 hover:bg-[#def1fc]">
                                    <span className="font-bold">{item.name}</span>
                                    <span className="font-bold">{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Net Profit */}
                        {!data?.calculations.isLoss && (
                            <div className="flex justify-between px-4 py-0.5 mt-8 bg-[#feba35] font-bold">
                                <span>Net Profit</span>
                                <span>{formatCurrency(data?.calculations.netProfit || 0)}</span>
                            </div>
                        )}
                    </div>

                    {/* Incomes Side */}
                    <div className="flex-1 overflow-y-auto px-0 py-2">
                        {/* Trading Account Part */}
                        <div className="mb-2">
                            {data?.sections.directIncome.map((item, i) => (
                                <div key={i} className="flex justify-between px-4 py-0.5 hover:bg-[#def1fc]">
                                    <span className="font-bold">{item.name}</span>
                                    <span className="font-bold">{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Gross Loss c/o */}
                        {data?.calculations.isLoss && (
                            <div className="flex justify-between px-4 py-0.5 mt-4 bg-red-50 italic font-bold text-red-700">
                                <span>Gross Loss c/o</span>
                                <span>{formatCurrency(data?.calculations.grossProfit || 0)}</span>
                            </div>
                        )}

                        {/* Indirect Account Part */}
                        <div className="mt-8">
                            {/* Gross Profit b/f from other side usually */}
                            {!data?.calculations.isLoss && (
                                <div className="flex justify-between px-4 py-0.5 italic font-bold text-gray-600">
                                    <span>Gross Profit b/f</span>
                                    <span>{formatCurrency(data?.calculations.grossProfit || 0)}</span>
                                </div>
                            )}
                            {data?.sections.indirectIncome.map((item, i) => (
                                <div key={i} className="flex justify-between px-4 py-0.5 hover:bg-[#def1fc]">
                                    <span className="font-bold">{item.name}</span>
                                    <span className="font-bold">{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Net Loss */}
                        {data?.calculations.isLoss && (
                            <div className="flex justify-between px-4 py-0.5 mt-8 bg-[#feba35] font-bold">
                                <span>Net Loss</span>
                                <span>{formatCurrency(data?.calculations.netProfit || 0)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Totals Section */}
                <div className="flex border-t-2 border-[#1b2c3c] bg-white shrink-0">
                    <div className="flex-1 flex justify-between px-4 py-1 border-r border-[#cbd5e1]">
                        <span className="font-bold uppercase">Total</span>
                        <span className="font-bold border-b border-[#1b2c3c]">{data ? formatCurrency(Math.max(data.calculations.totalDirectExpense + (data.calculations.isLoss ? 0 : data.calculations.grossProfit), 0)) : '0.00'}</span>
                    </div>
                    <div className="flex-1 flex justify-between px-4 py-1">
                        <span className="font-bold uppercase">Total</span>
                        <span className="font-bold border-b border-[#1b2c3c]">{data ? formatCurrency(Math.max(data.calculations.totalDirectIncome + (data.calculations.isLoss ? Math.abs(data.calculations.grossProfit) : 0), 0)) : '0.00'}</span>
                    </div>
                </div>
            </div>
        </TallyReportLayout>
    );
};

export default ProfitLoss;
