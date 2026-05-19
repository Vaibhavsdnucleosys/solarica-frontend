import React, { useEffect, useState } from 'react';
import TallyReportLayout from './TallyReportLayout';
import { getPTMonthlyReport, DEFAULT_COMPANY_ID, downloadPTMonthlyExcel } from '../../services/accountingService';
import { Loader2, AlertCircle } from 'lucide-react';

interface Props {
    companyId: string;
    companyName?: string;
    onBack: () => void;
    month: number;
    year: number;
}

const TallyPTMonthlyReport: React.FC<Props> = ({ companyId, companyName = 'Solarica', onBack, month, year }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string>('all');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const { getEmployeeGroups } = await import('../../services/accountingService');
                const result = await getEmployeeGroups(companyId);
                setGroups(result || []);
            } catch (err) {
                console.error('Failed to fetch groups:', err);
            }
        };
        fetchGroups();
    }, [companyId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getPTMonthlyReport(companyId, month, year, selectedGroupId);
                setData(result || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch PT report');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [companyId, month, year, selectedGroupId]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const handleExport = async () => {
        try {
            const blob = await downloadPTMonthlyExcel(companyId, month, year, selectedGroupId);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `PT_Monthly_${month}_${year}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download Excel:', err);
            alert('Failed to download Excel report');
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#def1fc]">
                <Loader2 className="w-8 h-8 text-[#2a5585] animate-spin mb-2" />
                <p className="text-[#1b2c3c] font-bold">Loading PT Monthly Report...</p>
            </div>
        );
    }

    return (
        <TallyReportLayout
            title="PT Monthly Report"
            companyName={companyName}
            period={`${month}/${year}`}
            onBack={onBack}
            sidebarButtons={[
                { keyName: 'F2', label: 'Period' },
                { keyName: 'E', label: 'Export', onClick: handleExport },
            ]}
        >
            <div className="flex flex-col h-full bg-white font-sans text-[12px] text-[#1b2c3c]">
                <div className="bg-[#def1fc] px-4 py-2 border-b border-gray-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[#2a5585]">Employee Group:</span>
                        <select
                            className="bg-white border border-[#2a5585] rounded px-2 py-1 outline-none text-[11px] min-w-[200px]"
                            value={selectedGroupId}
                            onChange={(e) => setSelectedGroupId(e.target.value)}
                        >
                            <option value="all">All Groups</option>
                            {groups.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-[#2a5585] font-bold italic">
                        Showing results for: {selectedGroupId === 'all' ? 'All Employees' : groups.find(g => g.id === selectedGroupId)?.name}
                    </div>
                </div>
                <div className="flex-1 overflow-auto flex flex-col">
                    <table id="pt-monthly-table" className="w-full border-collapse flex-1 flex flex-col min-w-max">
                        <thead className="sticky top-0 z-20 block">
                            <tr className="bg-[#2a5585] text-white font-bold flex w-full">
                                <th className="flex-1 text-left px-4 py-1.5 border-r border-white/20">Employee Name</th>
                                <th className="w-[120px] px-2 py-1.5 border-r border-white/20 text-center">State</th>
                                <th className="w-[150px] px-2 py-1.5 text-right border-r border-white/20">Gross Salary</th>
                                <th className="w-[150px] px-2 py-1.5 text-center border-r border-white/20">PT Slab</th>
                                <th className="w-[120px] px-2 py-1.5 text-right">PT Amount</th>
                            </tr>
                        </thead>
                        <tbody className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                            {data.length === 0 ? (
                                <tr className="flex w-full">
                                    <td colSpan={5} className="flex-1 px-4 py-10 text-center text-gray-500 font-bold border border-gray-300">
                                        Payroll not approved or no PT data for selected period
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {data.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-[#def1fc] border-b border-gray-300 flex w-full shrink-0">
                                            <td className="flex-1 px-4 py-1 font-bold border-l border-r border-gray-300">{row.employeeName}</td>
                                            <td className="w-[120px] px-2 py-1 text-center border-r border-gray-300">{row.state}</td>
                                            <td className="w-[150px] px-2 py-1 text-right border-r border-gray-300">{formatCurrency(row.grossSalary)}</td>
                                            <td className="w-[150px] px-2 py-1 text-center border-r border-gray-300">{row.ptSlab}</td>
                                            <td className="w-[120px] px-2 py-1 text-right font-bold border-r border-gray-300">{formatCurrency(row.ptAmount)}</td>
                                        </tr>
                                    ))}
                                    {/* Spacer row to extend vertical lines */}
                                    <tr className="flex-1 flex w-full min-h-[50px]">
                                        <td className="flex-1 border-l border-r border-gray-300"></td>
                                        <td className="w-[120px] border-r border-gray-300"></td>
                                        <td className="w-[150px] border-r border-gray-300"></td>
                                        <td className="w-[150px] border-r border-gray-300"></td>
                                        <td className="w-[120px] border-r border-gray-300"></td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                        {data.length > 0 && (
                            <tfoot className="bg-gray-100 font-bold border-t-2 border-[#1b2c3c] sticky bottom-0 block mt-auto">
                                <tr className="flex w-full">
                                    <td className="flex-1 px-4 py-1 border-l border-r border-gray-300">Total</td>
                                    <td className="w-[120px] px-2 py-1 border-r border-gray-300 text-center"></td>
                                    <td className="w-[150px] px-2 py-1 text-right border-r border-gray-300">{formatCurrency(data.reduce((s, r) => s + (r.grossSalary || 0), 0))}</td>
                                    <td className="w-[150px] px-2 py-1 border-r border-gray-300 text-center"></td>
                                    <td className="w-[120px] px-2 py-1 text-right border-r border-gray-300 underline decoration-double">{formatCurrency(data.reduce((s, r) => s + (r.ptAmount || 0), 0))}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </TallyReportLayout>
    );
};

export default TallyPTMonthlyReport;
