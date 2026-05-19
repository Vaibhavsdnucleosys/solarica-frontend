import React, { useEffect, useState } from 'react';
import TallyReportLayout from './TallyReportLayout';
import { getPFSummaryReport, DEFAULT_COMPANY_ID, downloadPFSummaryExcel } from '../../services/accountingService';
import { Loader2, AlertCircle } from 'lucide-react';
import { exportTableToExcel } from '../../utils/excelExport';

interface Props {
    companyId: string;
    companyName?: string;
    onBack: () => void;
    month: number;
    year: number;
}

const TallyPFSummaryReport: React.FC<Props> = ({ companyId, companyName = 'Solarica', onBack, month, year }) => {
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
                // In a real app, we'd fetch the company name from a store or API
                // For now, let's keep it consistent with the dashboard's knowledge of the company
                const result = await getPFSummaryReport(companyId, month, year, selectedGroupId);
                setData(result || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch PF report');
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
            const blob = await downloadPFSummaryExcel(companyId, month, year, selectedGroupId);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `PF_Summary_${month}_${year}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (err) {
            console.error('Failed to download Excel:', err);
            alert('Failed to download Excel report');
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#def1fc]">
                <Loader2 className="w-8 h-8 text-[#2a5585] animate-spin mb-2" />
                <p className="text-[#1b2c3c] font-bold">Loading PF Summary...</p>
            </div>
        );
    }

    const totals = data.reduce((acc, curr) => ({
        eePf: acc.eePf + (curr.eePf || 0),
        erEpf: acc.erEpf + (curr.erEpf || 0),
        erEps: acc.erEps + (curr.erEps || 0),
        admin: acc.admin + (curr.pfAdminCharges || 0),
        edli: acc.edli + (curr.edliCharges || 0),
        edliAdmin: acc.edliAdmin + (curr.edliAdminCharges || 0),
        total: acc.total + (curr.totalContribution || 0)
    }), { eePf: 0, erEpf: 0, erEps: 0, admin: 0, edli: 0, edliAdmin: 0, total: 0 });

    return (
        <TallyReportLayout
            title="PF Summary Report"
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
                    <table id="pf-summary-table" className="w-full border-collapse flex-1 flex flex-col min-w-max">
                        <thead className="sticky top-0 z-20 block">
                            <tr className="bg-[#2a5585] text-white font-bold flex w-full">
                                <th className="flex-1 text-left px-4 py-1.5 border-r border-white/20">Employee Name</th>
                                <th className="w-[120px] text-left px-2 py-1.5 border-r border-white/20">UAN</th>
                                <th className="w-[100px] text-right px-2 py-1.5 border-r border-white/20">PF Wages</th>
                                <th className="w-[100px] text-right px-2 py-1.5 border-r border-white/20">EE PF (12%)</th>
                                <th className="w-[100px] text-right px-2 py-1.5 border-r border-white/20">ER EPF (3.67%)</th>
                                <th className="w-[100px] text-right px-2 py-1.5 border-r border-white/20">ER EPS (8.33%)</th>
                                <th className="w-[120px] text-right px-2 py-1.5">Total</th>
                            </tr>
                        </thead>
                        <tbody className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                            {data.length === 0 ? (
                                <tr className="flex w-full">
                                    <td colSpan={7} className="flex-1 px-4 py-10 text-center text-gray-500 font-bold border border-gray-300">
                                        Payroll not approved or no PF data for selected period
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {data.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-[#def1fc] border-b border-gray-300 flex w-full shrink-0">
                                            <td className="flex-1 px-4 py-1 font-bold border-l border-r border-gray-300">{row.employeeName}</td>
                                            <td className="w-[120px] px-2 py-1 border-r border-gray-300">{row.uan}</td>
                                            <td className="w-[100px] px-2 py-1 text-right border-r border-gray-300">{formatCurrency(row.pfWages)}</td>
                                            <td className="w-[100px] px-2 py-1 text-right border-r border-gray-300">{formatCurrency(row.eePf)}</td>
                                            <td className="w-[100px] px-2 py-1 text-right border-r border-gray-300">{formatCurrency(row.erEpf)}</td>
                                            <td className="w-[100px] px-2 py-1 text-right border-r border-gray-300">{formatCurrency(row.erEps)}</td>
                                            <td className="w-[120px] px-2 py-1 text-right font-bold border-r border-gray-300">{formatCurrency(row.totalContribution)}</td>
                                        </tr>
                                    ))}
                                    {/* Spacer row to extend vertical lines */}
                                    <tr className="flex-1 flex w-full min-h-[50px]">
                                        <td className="flex-1 border-l border-r border-gray-300"></td>
                                        <td className="w-[120px] border-r border-gray-300"></td>
                                        <td className="w-[100px] border-r border-gray-300"></td>
                                        <td className="w-[100px] border-r border-gray-300"></td>
                                        <td className="w-[100px] border-r border-gray-300"></td>
                                        <td className="w-[100px] border-r border-gray-300"></td>
                                        <td className="w-[120px] border-r border-gray-300"></td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                        {data.length > 0 && (
                            <tfoot className="bg-gray-100 font-bold border-t-2 border-[#1b2c3c] sticky bottom-0 block mt-auto">
                                <tr className="flex w-full">
                                    <td className="flex-1 px-4 py-1 border-l border-r border-gray-300">Total</td>
                                    <td className="w-[120px] px-2 py-1 border-r border-gray-300"></td>
                                    <td className="w-[100px] px-2 py-1 text-right border-r border-gray-300">{formatCurrency(data.reduce((s, r) => s + (r.pfWages || 0), 0))}</td>
                                    <td className="w-[100px] px-2 py-1 text-right border-r border-gray-300">{formatCurrency(totals.eePf)}</td>
                                    <td className="w-[100px] px-2 py-1 text-right border-r border-gray-300">{formatCurrency(totals.erEpf)}</td>
                                    <td className="w-[100px] px-2 py-1 text-right border-r border-gray-300">{formatCurrency(totals.erEps)}</td>
                                    <td className="w-[120px] px-2 py-1 text-right border-r border-gray-300 underline decoration-double">{formatCurrency(totals.total)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </TallyReportLayout>
    );
};

export default TallyPFSummaryReport;
