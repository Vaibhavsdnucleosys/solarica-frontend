import React, { useState, useEffect, useRef } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';
import { getPayrollEmployees, getPayHeads, createSalaryStructure, DEFAULT_COMPANY_ID } from '../../../services/accountingService';

interface Props {
    onClose: () => void;
    companyId: string;
}

const TallySalaryStructureCreation = ({ onClose, companyId }: Props) => {
    const [employees, setEmployees] = useState<any[]>([]);
    const [payHeads, setPayHeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
    const [effectiveFrom, setEffectiveFrom] = useState('1-Apr-2025');

    // Items state: { payHeadId, payHeadName, rate }
    const [items, setItems] = useState<any[]>([]);

    const [showEmployeeList, setShowEmployeeList] = useState(false);
    const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(0);

    const [showPayHeadList, setShowPayHeadList] = useState(false);
    const [selectedPayHeadIndex, setSelectedPayHeadIndex] = useState(0);
    const [currentRowIndex, setCurrentRowIndex] = useState(-1);

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);

    const empRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empData, phData] = await Promise.all([
                    getPayrollEmployees(companyId),
                    getPayHeads(companyId)
                ]);
                setEmployees(empData);
                setPayHeads(phData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddItem = (payHead: any) => {
        const newItem = {
            payHeadId: payHead.id,
            name: payHead.name,
            rate: 0
        };
        setItems([...items, newItem]);
        setShowPayHeadList(false);
    };

    const handleRateChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index].rate = parseFloat(value) || 0;
        setItems(newItems);
    };

    const handleSave = async () => {
        if (!selectedEmployeeId) {
            alert('Please select an employee');
            return;
        }
        if (items.length === 0) {
            alert('Please add at least one pay head');
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                employeeId: selectedEmployeeId,
                effectiveFrom: new Date(effectiveFrom).toISOString(),
                items: items.map(it => ({
                    payHeadId: it.payHeadId,
                    rate: it.rate
                }))
            };
            await createSalaryStructure(companyId, payload);
            alert('Salary Structure created successfully');
            onClose();
        } catch (error) {
            console.error('Failed to create salary structure:', error);
            alert('Failed to save salary structure');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-white italic text-gray-500">Loading master data...</div>;

    return (
        <div className={`flex flex-row h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px] ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Title Bar - Now Narrower */}
                <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0">
                    <div className="flex items-center">
                        <span>Salary Details Alteration</span>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                    <div className="flex items-center absolute right-[2px]">
                        <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                    </div>
                </div>

                {/* Main Content Pane */}
                <div className="flex-1 bg-white flex flex-col h-full overflow-hidden border-r border-[#ccc] relative">
                    {/* Header Section */}
                    <div className="p-4 border-b border-gray-300 bg-gray-50/30">
                        <div className="flex items-center mb-1 group cursor-pointer" onClick={() => setShowEmployeeList(true)}>
                            <label className="w-[120px] text-black">Employee</label>
                            <span className="font-bold mr-2">:</span>
                            <div className="bg-[#fcfcd0] text-black font-bold px-1 w-[320px] outline-none border border-transparent focus:bg-[#ffe599]">
                                {selectedEmployeeName || 'Select Employee'}
                            </div>
                        </div>
                        <div className="flex items-center mb-1 group cursor-pointer">
                            <label className="w-[120px] text-black text-[11px] italic">Effective from</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                ref={dateRef}
                                type="text"
                                value={effectiveFrom}
                                onChange={(e) => setEffectiveFrom(e.target.value)}
                                className="bg-transparent text-black font-bold px-1 w-[120px] outline-none focus:bg-[#ffe599]"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        setShowPayHeadList(true);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#e8f6fa] z-10">
                                <tr className="text-[12px] font-bold border-b border-gray-300">
                                    <th className="px-4 py-1 w-[400px]">Pay Head Name</th>
                                    <th className="px-4 py-1 text-right">Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-[#def1fc] border-b border-gray-100">
                                        <td className="px-4 py-1 font-bold text-[#1b2c3c]">{item.name}</td>
                                        <td className="px-4 py-1 text-right">
                                            <input
                                                type="number"
                                                value={item.rate}
                                                onChange={(e) => handleRateChange(idx, e.target.value)}
                                                className="w-[100px] text-right font-bold outline-none focus:bg-[#ffe599] px-1"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && idx === items.length - 1) {
                                                        e.preventDefault();
                                                        setShowPayHeadList(true);
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-blue-50/50 cursor-pointer" onClick={() => setShowPayHeadList(true)}>
                                    <td className="px-4 py-2 italic text-gray-500" colSpan={2}>
                                        Click to add pay head...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Progress */}
                    <div className="p-2 border-t border-gray-300 flex justify-end gap-4 bg-gray-50">
                        <button onClick={() => setShowAcceptBox(true)} className="bg-[#2a5585] text-white px-4 py-1 font-bold rounded-sm">Save Structure</button>
                    </div>

                    {/* Selection Modals - Repositioned Absolute but bound to the left content pane */}
                    {showEmployeeList && (
                        <div className="absolute top-[50px] left-[150px] w-[350px] z-[500] border-2 border-[#2a5585] shadow-2xl bg-white">
                            <div className="bg-[#2a5585] text-white px-2 py-0.5 font-bold text-[12px]">List of Employees</div>
                            <div className="max-h-[300px] overflow-y-auto outline-none" tabIndex={0} autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowUp') setSelectedEmployeeIndex(p => p > 0 ? p - 1 : employees.length - 1);
                                    if (e.key === 'ArrowDown') setSelectedEmployeeIndex(p => p < employees.length - 1 ? p + 1 : 0);
                                    if (e.key === 'Enter') {
                                        const emp = employees[selectedEmployeeIndex];
                                        setSelectedEmployeeId(emp.id);
                                        setSelectedEmployeeName(emp.name);
                                        setShowEmployeeList(false);
                                        dateRef.current?.focus();
                                    }
                                    if (e.key === 'Escape') setShowEmployeeList(false);
                                }}
                            >
                                {employees.map((emp, idx) => (
                                    <div key={idx}
                                        className={`px-2 py-1 cursor-pointer ${selectedEmployeeIndex === idx ? 'bg-[#fdb913] font-bold' : 'hover:bg-blue-50'}`}
                                        onClick={() => {
                                            setSelectedEmployeeId(emp.id);
                                            setSelectedEmployeeName(emp.name);
                                            setShowEmployeeList(false);
                                            dateRef.current?.focus();
                                        }}
                                        onMouseEnter={() => setSelectedEmployeeIndex(idx)}
                                    >
                                        {emp.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {showPayHeadList && (
                        <div className="absolute top-[150px] left-[150px] w-[350px] z-[500] border-2 border-[#2a5585] shadow-2xl bg-white">
                            <div className="bg-[#2a5585] text-white px-2 py-0.5 font-bold text-[12px]">List of Pay Heads</div>
                            <div className="max-h-[300px] overflow-y-auto outline-none" tabIndex={0} autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowUp') setSelectedPayHeadIndex(p => p > 0 ? p - 1 : payHeads.length - 1);
                                    if (e.key === 'ArrowDown') setSelectedPayHeadIndex(p => p < payHeads.length - 1 ? p + 1 : 0);
                                    if (e.key === 'Enter') {
                                        handleAddItem(payHeads[selectedPayHeadIndex]);
                                    }
                                    if (e.key === 'Escape') setShowPayHeadList(false);
                                }}
                            >
                                {payHeads.map((ph, idx) => (
                                    <div key={idx}
                                        className={`px-2 py-1 cursor-pointer ${selectedPayHeadIndex === idx ? 'bg-[#fdb913] font-bold' : 'hover:bg-blue-50'}`}
                                        onClick={() => handleAddItem(ph)}
                                        onMouseEnter={() => setSelectedPayHeadIndex(idx)}
                                    >
                                        {ph.name}
                                    </div>
                                ))}
                                <div className="px-2 py-1 border-t text-red-600 font-bold text-center cursor-pointer hover:bg-red-50" onClick={() => setShowPayHeadList(false)}>End of List</div>
                            </div>
                        </div>
                    )}

                    {/* Accept/Quit Dialogs */}
                    {showAcceptBox && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#2a5585] shadow-2xl p-4 w-[200px] z-[1000] text-center">
                            <div className="font-bold mb-4">Accept ?</div>
                            <div className="flex justify-center gap-8 font-bold text-[#2a5585]">
                                <button onClick={handleSave} className="hover:underline">Yes</button>
                                <button onClick={() => setShowAcceptBox(false)} className="hover:underline">No</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar - Now Full Height */}
            <TallySidebar>
                <SidebarButton keyName="A" label="Accept" onClick={() => setShowAcceptBox(true)} />
                <SidebarButton keyName="Q" label="Quit" onClick={() => setShowQuitBox(true)} />
            </TallySidebar>
        </div>
    );
};

export default TallySalaryStructureCreation;
