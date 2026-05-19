import React, { useEffect, useState } from 'react';
import TallyReportLayout from './TallyReportLayout';
import { getTrialBalance, TrialBalanceData, DEFAULT_COMPANY_ID } from '../../services/accountingService';
import { Loader2, AlertCircle } from 'lucide-react';
import { exportTableToExcel } from '../../utils/excelExport';
import { SidebarButtonProps } from '../TallyIntegration/TallyCommon/TallySidebar';

export interface TrialBalanceProps {
    onBack: () => void;
    companyId?: string;
    companyName?: string;
}

const TrialBalance: React.FC<TrialBalanceProps> = ({ onBack, companyId = DEFAULT_COMPANY_ID, companyName }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<TrialBalanceData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getTrialBalance(companyId);
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch trial balance');
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
        exportTableToExcel('trial-balance-table', `Trial_Balance_Solarica_${new Date().toISOString().split('T')[0]}`);
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
                <p className="text-[#1b2c3c] font-bold">Loading Trial Balance...</p>
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
            title="Trial Balance"
            companyName="Solarica"
            period="1-Apr-25 to 31-Mar-26"
            onBack={onBack}
            sidebarButtons={sidebarButtons}
        >
            <div className="flex flex-col h-full bg-white font-sans text-[13px] text-[#1b2c3c]">
                {/* Custom Tally Header Table */}
                <div className="border-b border-[#cbd5e1] flex font-bold text-[14px]">
                    <div className="flex-1 px-4 py-1.5 border-r border-[#cbd5e1]">Particulars</div>
                    <div className="w-[300px] flex flex-col border-r border-[#cbd5e1]">
                        <div className="text-center border-b border-[#cbd5e1] py-0.5 text-[11px] uppercase">Solarica</div>
                        <div className="flex">
                            <div className="flex-1 text-center py-0.5 border-r border-[#cbd5e1] text-[11px] uppercase">Debit</div>
                            <div className="flex-1 text-center py-0.5 text-[11px] uppercase">Credit</div>
                        </div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-auto flex flex-col">
                    <table id="trial-balance-table" className="w-full border-collapse flex-1 flex flex-col">
                        <tbody className="flex-1 flex flex-col">
                            {data && Object.entries(data.summary).map(([nature, natureData]) => (
                                <React.Fragment key={nature}>
                                    {/* Nature Category */}
                                    <tr className="bg-gray-50/50 flex w-full shrink-0">
                                        <td className="px-4 py-1 font-bold uppercase flex-1">{nature}</td>
                                        <td className="w-[150px] px-4 py-1 text-right font-bold border-l border-[#cbd5e1]">
                                            {natureData.totalDebit > 0 ? formatCurrency(natureData.totalDebit) : ''}
                                        </td>
                                        <td className="w-[150px] px-4 py-1 text-right font-bold border-l border-[#cbd5e1]">
                                            {natureData.totalCredit > 0 ? formatCurrency(natureData.totalCredit) : ''}
                                        </td>
                                    </tr>

                                    {/* Groups */}
                                    {natureData.groups.map((group: any) => (
                                        <React.Fragment key={group.id}>
                                            <tr className="hover:bg-[#def1fc] cursor-pointer group flex w-full shrink-0">
                                                <td className="px-8 py-0.5 font-bold flex-1">{group.name}</td>
                                                <td className="w-[150px] px-4 py-0.5 text-right font-bold italic border-l border-[#cbd5e1]/50 group-hover:bg-[#def1fc]">
                                                    {group.totalDebit > 0 ? formatCurrency(group.totalDebit) : ''}
                                                </td>
                                                <td className="w-[150px] px-4 py-0.5 text-right font-bold italic border-l border-[#cbd5e1]/50 group-hover:bg-[#def1fc]">
                                                    {group.totalCredit > 0 ? formatCurrency(group.totalCredit) : ''}
                                                </td>
                                            </tr>
                                            {/* Ledgers */}
                                            {group.ledgers?.map((ledger: any) => (
                                                <tr key={ledger.id} className="text-[12px] hover:bg-yellow-50/70 italic text-gray-700 flex w-full shrink-0">
                                                    <td className="pl-12 pr-4 flex-1">{ledger.name}</td>
                                                    <td className="w-[150px] px-4 text-right border-l border-[#cbd5e1]/30">
                                                        {ledger.debit > 0 ? formatCurrency(ledger.debit) : ''}
                                                    </td>
                                                    <td className="w-[150px] px-4 text-right border-l border-[#cbd5e1]/30">
                                                        {ledger.credit > 0 ? formatCurrency(ledger.credit) : ''}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                            {/* Spacer row to extend vertical lines */}
                            <tr className="flex-1 flex w-full min-h-[50px]">
                                <td className="flex-1"></td>
                                <td className="w-[150px] border-l border-[#cbd5e1]"></td>
                                <td className="w-[150px] border-l border-[#cbd5e1]"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer Totals */}
                <div className="border-t-2 border-[#1b2c3c] flex font-bold shrink-0">
                    <div className="flex-1 px-4 py-1 border-r border-[#cbd5e1]">Grand Total</div>
                    <div className="w-[150px] px-4 py-1 text-right border-r border-[#cbd5e1]">
                        <span className="border-b border-[#1b2c3c]">{data ? formatCurrency(data.grandTotals.debit) : '0.00'}</span>
                    </div>
                    <div className="w-[150px] px-4 py-1 text-right">
                        <span className="border-b border-[#1b2c3c]">{data ? formatCurrency(data.grandTotals.credit) : '0.00'}</span>
                    </div>
                </div>

                {data && !data.grandTotals.isBalanced && (
                    <div className="bg-red-50 text-red-700 px-4 py-0.5 text-right font-bold text-[12px] italic border-t border-red-200">
                        Difference: {formatCurrency(data.grandTotals.difference)}
                    </div>
                )}
            </div>
        </TallyReportLayout>
    );
};

export default TrialBalance;
