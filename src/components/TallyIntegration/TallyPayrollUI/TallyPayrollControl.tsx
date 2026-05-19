import React, { useState, useEffect } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';
import {
    getPayrollLockStatus,
    lockPayroll,
    unlockPayroll,
    processSalary,
    approveSalary,
    getEmployeeGroups,
    DEFAULT_COMPANY_ID
} from '../../../services/accountingService';

interface Props {
    companyId: string;
    onClose: () => void;
    onSwitchView?: (view: any) => void;
}

const TallyPayrollControl = ({ companyId, onClose, onSwitchView }: Props) => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [employeeGroups, setEmployeeGroups] = useState<any[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
    const [lockStatus, setLockStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchGroups = async () => {
        try {
            const groups = await getEmployeeGroups(companyId);
            setEmployeeGroups(groups || []);
        } catch (error) {
            console.error('Failed to fetch employee groups:', error);
        }
    };

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const status = await getPayrollLockStatus(companyId, month, year, selectedGroupId);
            setLockStatus(status);
        } catch (error) {
            console.error('Failed to fetch lock status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [companyId]);

    useEffect(() => {
        fetchStatus();
    }, [month, year, companyId, selectedGroupId]);

    const handleLockToggle = async () => {
        setActionLoading(true);
        try {
            const groupName = selectedGroupId === 'all' ? 'all employees' : employeeGroups.find(g => g.id === selectedGroupId)?.name || 'selected group';
            if (lockStatus?.isLocked) {
                await unlockPayroll(companyId, month, year, selectedGroupId);
                setMessage(`Payroll unlocked for ${groupName}`);
            } else {
                await lockPayroll(companyId, month, year, selectedGroupId);
                setMessage(`Payroll locked for ${groupName}`);
            }
            await fetchStatus();
        } catch (error: any) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleProcessSalary = async () => {
        setActionLoading(true);
        try {
            const result = await processSalary(companyId, {
                month,
                year,
                employeeGroupId: selectedGroupId === 'all' ? undefined : selectedGroupId
            });
            console.log('[Payroll UI] process response:', result);

            let displayMessage = result.message;
            if (result.processedCount > 0) {
                const groupName = selectedGroupId === 'all' ? 'all employees' : employeeGroups.find(g => g.id === selectedGroupId)?.name;
                displayMessage = `Salary processed for ${result.processedCount} employees in ${groupName} successfully.`;
            } else if (result.totalFound > 0 && result.processedCount === 0) {
                if (result.totalEligible === 0) {
                    displayMessage = "No employees eligible for payroll processing in this group.";
                } else {
                    displayMessage = result.message || "All employees in this group are already processed.";
                }
            }

            setMessage(displayMessage);
            await fetchStatus();
        } catch (error: any) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleApproveSalary = async () => {
        setActionLoading(true);
        try {
            await approveSalary(companyId, {
                month,
                year,
                employeeGroupId: selectedGroupId === 'all' ? undefined : selectedGroupId
            });
            const groupName = selectedGroupId === 'all' ? 'all employees' : employeeGroups.find(g => g.id === selectedGroupId)?.name;
            setMessage(`Salary approved successfully for ${groupName} and vouchers generated`);
            await fetchStatus();
        } catch (error: any) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setActionLoading(false);
        }
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className={`flex flex-row h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px] ${actionLoading ? 'opacity-70 pointer-events-none' : ''}`}>
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Tally Header - Now Narrower */}
                <TallyHeader />

                {/* Title Bar - Now Narrower */}
                <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0">
                    <div className="flex items-center">
                        <span>Payroll Control Center</span>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                    <button onClick={onClose} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2 absolute right-[2px]">✕</button>
                </div>

                {/* Main Content Pane */}
                <div className="flex-1 bg-white flex flex-col p-8 items-center overflow-y-auto custom-scrollbar">
                    <div className="w-full max-w-2xl bg-[#e8f6fa] border-2 border-[#2a5585] p-6 shadow-lg">
                        <div className="flex justify-between items-start mb-8 border-b border-[#2a5585] pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-[#1b2c3c]">Payroll Period Selection</h2>
                                <p className="text-gray-600">Select month and year to manage payroll</p>
                            </div>
                            <div className="text-right">
                                <div className={`px-4 py-1 rounded-full font-bold text-[14px] ${lockStatus?.status === 'APPROVED' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                                    lockStatus?.status === 'PROCESSED' ? 'bg-purple-100 text-purple-700 border border-purple-300' :
                                        lockStatus?.status === 'LOCKED' ? 'bg-red-100 text-red-700 border border-red-300' :
                                            'bg-green-100 text-green-700 border border-green-300'
                                    }`}>
                                    {loading ? 'Checking...' : (lockStatus?.status || 'OPEN')}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-[#2a5585]">Month</label>
                                <select
                                    className="border-b-2 border-[#2a5585] bg-transparent outline-none p-1 font-bold disabled:opacity-50"
                                    value={month}
                                    onChange={(e) => setMonth(parseInt(e.target.value))}
                                    disabled={lockStatus?.status === 'APPROVED'}
                                >
                                    {months.map((m, i) => (
                                        <option key={i} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-[#2a5585]">Year</label>
                                <input
                                    type="number"
                                    className="border-b-2 border-[#2a5585] bg-transparent outline-none p-1 font-bold w-full disabled:opacity-50"
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    disabled={lockStatus?.status === 'APPROVED'}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-[#2a5585]">Employee Group</label>
                                <select
                                    className="border-b-2 border-[#2a5585] bg-transparent outline-none p-1 font-bold disabled:opacity-50"
                                    value={selectedGroupId}
                                    onChange={(e) => setSelectedGroupId(e.target.value)}
                                >
                                    <option value="all">All Employees</option>
                                    {employeeGroups.map((g) => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {message && (
                            <div className="mb-8 p-3 bg-white border-l-4 border-[#fdb913] text-[#1b2c3c] font-bold italic text-[12px] shadow-sm">
                                {message}
                            </div>
                        )}

                        <div className="space-y-4 pt-4 border-t border-gray-300">
                            {/* LOCK / UNLOCK (Global Action) */}
                            <div className={`flex items-center justify-between p-4 border border-gray-200 transition-colors group rounded ${lockStatus?.status === 'APPROVED' || lockStatus?.status === 'PROCESSED' ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-white/50 hover:bg-white cursor-pointer'
                                }`} onClick={(lockStatus?.status === 'APPROVED' || lockStatus?.status === 'PROCESSED') ? undefined : handleLockToggle}>
                                <div>
                                    <div className="font-bold text-[#1b2c3c]">{lockStatus?.isLocked ? 'Unlock' : 'Lock'} Monthly Master Data</div>
                                    <div className="text-[11px] text-gray-500">{lockStatus?.isLocked ? 'Allow changes to employee masters' : 'Prepare for payroll processing'}</div>
                                </div>
                                <span className={`${lockStatus?.status === 'APPROVED' ? 'text-gray-400' : 'text-[#2a5585]'} font-bold group-hover:translate-x-1 transition-transform`}>➔</span>
                            </div>

                            {/* PROCESS */}
                            <div className={`flex items-center justify-between p-4 border border-gray-200 transition-colors group rounded ${!lockStatus?.isLocked || lockStatus?.status === 'APPROVED' || lockStatus?.status === 'PROCESSED' ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-white/50 hover:bg-white cursor-pointer'
                                }`} onClick={(!lockStatus?.isLocked || lockStatus?.status === 'APPROVED' || lockStatus?.status === 'PROCESSED') ? undefined : handleProcessSalary}>
                                <div>
                                    <div className="font-bold text-[#1b2c3c]">Process {selectedGroupId === 'all' ? 'All' : 'Group'} Salary</div>
                                    <div className="text-[11px] text-gray-500">Calculate earnings and deductions for selected group</div>
                                </div>
                                <span className={`${(!lockStatus?.isLocked || lockStatus?.status === 'APPROVED') ? 'text-gray-400' : 'text-[#2a5585]'} font-bold group-hover:translate-x-1 transition-transform`}>➔</span>
                            </div>

                            {/* APPROVE */}
                            <div className={`flex items-center justify-between p-4 border border-gray-200 transition-colors group rounded ${lockStatus?.status !== 'PROCESSED' ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-white/50 hover:bg-white cursor-pointer'
                                }`} onClick={lockStatus?.status !== 'PROCESSED' ? undefined : () => {
                                    if (window.confirm(`Are you sure you want to APPROVE payroll for ${selectedGroupId === 'all' ? 'all employees' : 'this group'}?`)) {
                                        handleApproveSalary();
                                    }
                                }}>
                                <div>
                                    <div className="font-bold text-[#1b2c3c]">Approve & Finalize {selectedGroupId === 'all' ? '' : 'Group'}</div>
                                    <div className="text-[11px] text-gray-500">Generate liability vouchers and mark as audited</div>
                                </div>
                                <span className={`${lockStatus?.status !== 'PROCESSED' ? 'text-gray-400' : 'text-[#2a5585]'} font-bold group-hover:translate-x-1 transition-transform`}>➔</span>
                            </div>
                        </div>

                        {lockStatus?.status === 'APPROVED' ? (
                            <div className="mt-8 space-y-3">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded text-blue-800 font-bold text-center">
                                    ✓ {selectedGroupId === 'all' ? 'COMPANY' : 'GROUP'} PAYROLL IS APPROVED
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-8 text-center text-gray-500 text-[11px]">
                        <p>Note: Approval is irreversible and will lock the period automatically.</p>
                        <p>Backend engine handles all PF/PT/TDS calculations based on approved configurations.</p>
                    </div>
                </div>
            </div>

            {/* Sidebar - Now Full Height */}
            <TallySidebar>
                <SidebarButton keyName="F2" label="Period" onClick={() => { }} />
                <SidebarButton keyName="F3" label="Company" onClick={() => { }} />
                <SidebarButton keyName="L" label={lockStatus?.isLocked ? "Unlock" : "Lock"} onClick={handleLockToggle} disabled={lockStatus?.status === 'APPROVED' || lockStatus?.status === 'PROCESSED'} />
                <SidebarButton keyName="P" label="Process" onClick={handleProcessSalary} disabled={!lockStatus?.isLocked || lockStatus?.status === 'APPROVED' || lockStatus?.status === 'PROCESSED'} />
                <SidebarButton keyName="V" label="Approve" onClick={handleApproveSalary} disabled={lockStatus?.status !== 'PROCESSED'} />
                <SidebarButton keyName="R" label="Payroll report" onClick={() => onSwitchView?.('payroll-reports')} />
                <SidebarButton keyName="Q" label="Quit" onClick={onClose} />
            </TallySidebar>
        </div>
    );
};

export default TallyPayrollControl;
