import React, { useState } from 'react';
import TallyHeader from '../TallyIntegration/TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyIntegration/TallyGroupUI/TallySidebar';
import TallyPFSummaryReport from './TallyPFSummaryReport';
import TallyPTMonthlyReport from './TallyPTMonthlyReport';
import { getEmployeeGroups } from '../../services/accountingService';

interface Props {
    companyId: string;
    companyName?: string;
    onClose: () => void;
}

const TallyPayrollReports = ({ companyId, companyName = 'Solarica', onClose }: Props) => {
    const [activeReport, setActiveReport] = useState<'selection' | 'pf-summary' | 'pt-monthly'>('selection');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedIndex, setSelectedIndex] = useState(0);

    const reports = [
        { label: 'PF Summary Report', action: 'pf-summary', shortcut: 'S' },
        { label: 'Professional Tax Monthly Report', action: 'pt-monthly', shortcut: 'P' },
    ];

    if (activeReport === 'selection') {
        return (
            <div className="h-screen flex flex-col bg-[#e8f6fa] font-sans">
                <TallyHeader />
                <div className="bg-[#8ec2eb] text-[#1b2c3c] px-4 py-0.5 flex justify-between items-center border-b border-[#5ea4d6]">
                    <span className="font-bold text-[13px]">Payroll Reports</span>
                    <span className="font-bold text-[13px]">{companyName}</span>
                    <button className="hover:bg-black/10 px-2 rounded font-bold" onClick={onClose}>✕</button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 flex flex-col items-center justify-center p-10">
                        <div className="w-[450px] bg-white border-2 border-[#2a5585] shadow-2xl">
                            <div className="bg-[#2a5585] text-white px-4 py-1 font-bold text-[14px]">List of Payroll Reports</div>
                            <div className="flex flex-col py-2 outline-none" tabIndex={0} autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowUp') setSelectedIndex(p => p > 0 ? p - 1 : reports.length - 1);
                                    if (e.key === 'ArrowDown') setSelectedIndex(p => p < reports.length - 1 ? p + 1 : 0);
                                    if (e.key === 'Enter') setActiveReport(reports[selectedIndex].action as any);
                                    if (e.key === 'Escape') onClose();

                                    const key = e.key.toUpperCase();
                                    const idx = reports.findIndex(r => r.shortcut === key);
                                    if (idx !== -1) {
                                        setSelectedIndex(idx);
                                        setActiveReport(reports[idx].action as any);
                                    }
                                }}
                            >
                                {reports.map((r, idx) => (
                                    <div key={idx}
                                        className={`px-4 py-2 cursor-pointer flex justify-between items-center ${selectedIndex === idx ? 'bg-[#fdb913] font-bold' : 'hover:bg-blue-50'}`}
                                        onClick={() => setActiveReport(r.action as any)}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-[#2a5585] mr-2">♦</span>
                                            <span>{r.label}</span>
                                        </div>
                                        <span className="text-[#2a5585] font-bold underline">{r.shortcut}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 bg-white border border-[#2a5585] p-4 w-[450px] shadow-lg">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <span className="font-bold text-[#2a5585]">Report Period</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-600">Month</label>
                                    <select
                                        className="border-b border-[#2a5585] outline-none text-[13px] font-bold"
                                        value={month}
                                        onChange={(e) => setMonth(parseInt(e.target.value))}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                            <option key={m} value={m}>{new Date(2025, m - 1).toLocaleString('default', { month: 'long' })}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-600">Year</label>
                                    <input
                                        type="number"
                                        className="border-b border-[#2a5585] outline-none text-[13px] font-bold"
                                        value={year}
                                        onChange={(e) => setYear(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <TallySidebar>
                        <SidebarButton keyName="F2" label="Period" onClick={() => { }} />
                        <SidebarButton keyName="Q" label="Quit" onClick={onClose} />
                    </TallySidebar>
                </div>
            </div>
        );
    }

    if (activeReport === 'pf-summary') {
        return <TallyPFSummaryReport companyId={companyId} companyName={companyName} onBack={() => setActiveReport('selection')} month={month} year={year} />;
    }

    if (activeReport === 'pt-monthly') {
        return <TallyPTMonthlyReport companyId={companyId} companyName={companyName} onBack={() => setActiveReport('selection')} month={month} year={year} />;
    }

    return null;
};

export default TallyPayrollReports;
