import React, { useState, useEffect, useRef } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';
import { getPayHeads, createSalaryStructure, getSalaryStructures, deleteSalaryStructureItem, getLatestSalaryStructure, DEFAULT_COMPANY_ID } from '../../../services/accountingService';

interface Props {
    onClose: () => void;
    targetType: 'Employee' | 'Group';
    targetId: string;
    targetName: string;
    companyId?: string;
}

interface SalaryItem {
    id?: string;
    payHeadId: string;
    payHeadName: string;
    rate: number;
    effectiveFrom: string;
    calculationType: string;
    computedOn: string;
    statutoryType?: string;
    per?: string;
}

const TallySalaryDetailsAlteration = ({
    onClose,
    targetType,
    targetId,
    targetName,
    companyId = DEFAULT_COMPANY_ID
}: Props) => {
    const [effectiveFrom, setEffectiveFrom] = useState('1-Apr-2025');
    const [items, setItems] = useState<SalaryItem[]>([]);
    const [payHeads, setPayHeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showPayHeadList, setShowPayHeadList] = useState(false);
    const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
    const [selectedPayHeadIndex, setSelectedPayHeadIndex] = useState(0);

    const parseTallyDate = (dateStr: string) => {
        // Tally format 01-04-2025 or 1-Apr-2025
        const parts = dateStr.split('-');
        let day = parseInt(parts[0], 10);
        let month: number;
        let year = parseInt(parts[2], 10);

        if (isNaN(parseInt(parts[1], 10))) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            month = monthNames.indexOf(parts[1]);
        } else {
            month = parseInt(parts[1], 10) - 1;
        }

        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0); // Local midnight

        // Return UTC ISO string for backend
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        return utcDate.toISOString();
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const isoDate = parseTallyDate(effectiveFrom);
            const [heads, structureResponse] = await Promise.all([
                getPayHeads(companyId),
                getLatestSalaryStructure(companyId, {
                    employeeId: targetType === 'Employee' ? targetId : undefined,
                    employeeGroupId: targetType === 'Group' ? targetId : undefined,
                    effectiveFrom: isoDate
                })
            ]);

            setPayHeads(heads || []);
            const existing = structureResponse.data;

            if (existing && existing.items) {
                setItems(existing.items.map((it: any) => ({
                    id: it.id,
                    payHeadId: it.payHeadId,
                    payHeadName: it.payHead?.name || 'Unknown',
                    rate: Number(it.amount) || 0,
                    effectiveFrom: existing.effectiveFrom ? new Date(existing.effectiveFrom).toLocaleDateString('en-GB').replace(/\//g, '-') : '1-Apr-2025',
                    calculationType: it.payHead?.calcType || '',
                    computedOn: it.payHead?.computeOn || '',
                    statutoryType: it.payHead?.statutoryType || '',
                    per: it.payHead?.payslipDisplayName || ''
                })));
                if (existing.effectiveFrom) {
                    // Update header date if different? Tally usually keeps the requested date but shows active values
                }
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setItems([]); // Clear on error to avoid stale data
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [companyId, targetId, targetType]);

    const addItem = () => {
        setItems([...items, { payHeadId: '', payHeadName: '', rate: 0, effectiveFrom, calculationType: '', computedOn: '', statutoryType: '' }]);
        setActiveRowIndex(items.length);
        setShowPayHeadList(true);
    };

    const handleSave = async () => {
        if (items.length === 0) {
            alert('Please add at least one pay head');
            return;
        }

        // Validation for numeric rates and completeness
        // PT is allowed to have 0 rate
        const invalid = items.some(it => {
            if (!it.payHeadId) return true;
            if (isNaN(it.rate)) return true;
            if (it.statutoryType === 'PT') return false; // Allowed zero/null
            return it.rate <= 0;
        });

        if (invalid) {
            alert('Please ensure all rows have a valid Pay Head and a positive Rate (PT exempted)');
            return;
        }

        setIsSaving(true);
        try {
            const isoDate = parseTallyDate(effectiveFrom);
            const payload = {
                employeeId: targetType === 'Employee' ? targetId : undefined,
                employeeGroupId: targetType === 'Group' ? targetId : undefined,
                effectiveFrom: isoDate,
                items: items.map(it => ({
                    payHeadId: it.payHeadId,
                    amount: it.rate
                }))
            };
            await createSalaryStructure(companyId, payload);
            alert('Salary details accepted');
            onClose();
        } catch (error: any) {
            console.error('Save failed:', error);
            alert('Failed to save salary details: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    const removeItem = async (index: number) => {
        const item = items[index];
        if (item.id) {
            // Immediate backend deletion for persisted items
            if (!window.confirm('Are you sure you want to permanently delete this pay head from the salary structure?')) {
                return;
            }
            try {
                await deleteSalaryStructureItem(companyId, item.id);
            } catch (error: any) {
                console.error('Delete failed:', error);
                alert('Failed to delete item: ' + (error.response?.data?.message || error.message));
                return;
            }
        }

        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);

        // After deletion, if it was immediate, we refresh to ensure DB truth
        if (item.id) {
            fetchData();
        }
    };

    return (
        <div className={`flex flex-row h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px] ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Title Bar - Now Narrower */}
                <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0 uppercase text-[11px]">
                    <div className="flex items-center">
                        <span>Salary Details (Alteration) : {targetName} ({targetType})</span>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                    <div className="flex items-center absolute right-[2px]">
                        <span onClick={onClose} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white flex flex-col h-full overflow-hidden border-r border-[#ccc] p-4 relative">
                    <div className="flex items-center mb-6">
                        <label className="w-[120px] font-medium text-gray-700">For : {targetName}</label>
                    </div>

                    <div className="flex items-center mb-6">
                        <label className="w-[120px] font-medium text-gray-700">Effective from</label>
                        <span className="mr-2 font-bold text-gray-400">:</span>
                        <input
                            type="text"
                            value={effectiveFrom}
                            onChange={(e) => setEffectiveFrom(e.target.value)}
                            className="border border-gray-400 w-32 px-1 font-bold text-black outline-none focus:bg-yellow-100"
                        />
                    </div>

                    {/* Grid Header */}
                    <div className="flex bg-[#2d819b] text-white font-bold text-[11px] border-b border-gray-300">
                        <div className="w-[15%] px-2 py-1 border-r border-white/20">Pay Head</div>
                        <div className="w-[15%] px-2 py-1 border-r border-white/20 text-right">Rate / %</div>
                        <div className="w-[10%] px-2 py-1 border-r border-white/20">Per</div>
                        <div className="w-[20%] px-2 py-1 border-r border-white/20">Calculation Type</div>
                        <div className="w-[30%] px-2 py-1 border-r border-white/20">Computed On</div>
                        <div className="w-[10%] px-2 py-1 text-center">Action</div>
                    </div>

                    {/* Grid Rows */}
                    <div className="flex-1 overflow-y-auto border border-gray-200 bg-white">
                        {loading ? (
                            <div className="p-4 text-center text-gray-400 italic">Loading existing definitions...</div>
                        ) : (
                            <>
                                {items.map((item, idx) => (
                                    <div key={idx} className={`flex border-b border-gray-100 items-center hover:bg-yellow-50 ${activeRowIndex === idx ? 'bg-yellow-100' : ''}`}>
                                        <div className="w-[15%] px-2 py-1 border-r border-gray-100 font-bold truncate">
                                            {item.payHeadName || 'End of List'}
                                        </div>
                                        <div className="w-[15%] px-2 py-1 border-r border-gray-100 text-right">
                                            <input
                                                type="number"
                                                value={item.rate || ''}
                                                onChange={(e) => {
                                                    const newItems = [...items];
                                                    newItems[idx].rate = parseFloat(e.target.value) || 0;
                                                    setItems(newItems);
                                                }}
                                                className="w-full bg-transparent text-right outline-none font-bold"
                                            />
                                        </div>
                                        <div className="w-[10%] px-2 py-1 border-r border-gray-100 text-gray-500 italic uppercase tracking-tighter">
                                            {item.per}
                                        </div>
                                        <div className="w-[20%] px-2 py-1 border-r border-gray-100 text-gray-600 truncate">
                                            {item.calculationType}
                                        </div>
                                        <div className="w-[30%] px-2 py-1 border-r border-gray-100 text-gray-400 truncate italic">
                                            {item.computedOn}
                                        </div>
                                        <div className="w-[10%] px-2 py-1 text-center">
                                            <span
                                                className="text-red-500 cursor-pointer font-bold hover:scale-110 inline-block transition-transform"
                                                onClick={() => removeItem(idx)}
                                                title="Remove"
                                            >
                                                ❌
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div className="px-2 py-1 text-blue-800 font-bold cursor-pointer hover:bg-gray-50" onClick={addItem}>
                                    <span className="mr-2">+</span> Add Pay Head
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="mt-4 flex justify-end gap-2 px-2 pb-2">
                        <button
                            className="px-6 py-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold border border-gray-600 shadow-sm"
                            onClick={handleSave}
                        >
                            Accept
                        </button>
                        <button
                            className="px-6 py-1 bg-gray-200 hover:bg-gray-300 text-black font-bold border border-gray-400 shadow-sm"
                            onClick={onClose}
                        >
                            Quit
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar - Now Full Height */}
            <TallySidebar>
                <SidebarButton keyName="F2" label="Period" onClick={() => { }} disabled={true} />
                <SidebarButton keyName="F3" label="Company" onClick={() => { }} />
            </TallySidebar>

            {/* Pay Head Selection Overlay */}
            {showPayHeadList && activeRowIndex !== null && (
                <div className="fixed top-20 right-40 w-[350px] z-[1000] shadow-2xl border border-[#2a5585]">
                    <div className="bg-[#1b2c3c] text-white px-2 py-0.5 font-bold text-sm">
                        List of Pay Heads
                    </div>
                    <div className="bg-[#dcecf5] max-h-[300px] overflow-y-auto">
                        <div
                            className="px-2 py-0.5 cursor-pointer hover:bg-yellow-200 text-right font-bold border-b border-white"
                            onClick={() => setShowPayHeadList(false)}
                        >
                            End of List
                        </div>
                        {payHeads.map((ph, idx) => (
                            <div
                                key={ph.id}
                                className={`px-2 py-0.5 cursor-pointer flex justify-between
                                    ${selectedPayHeadIndex === idx ? 'bg-yellow-400 font-bold' : 'hover:bg-yellow-200'}
                                `}
                                onClick={() => {
                                    // Validation: Check for duplicates
                                    if (items.some(it => it.payHeadId === ph.id)) {
                                        alert('This Pay Head is already added');
                                        return;
                                    }

                                    const newItems = [...items];
                                    newItems[activeRowIndex] = {
                                        ...newItems[activeRowIndex],
                                        payHeadId: ph.id,
                                        payHeadName: ph.name,
                                        calculationType: ph.calcType,
                                        computedOn: ph.computeOn,
                                        statutoryType: ph.statutoryType || '',
                                        per: ph.payslipDisplayName || ''
                                    };
                                    setItems(newItems);
                                    setShowPayHeadList(false);
                                    setActiveRowIndex(null);
                                }}
                                onMouseEnter={() => setSelectedPayHeadIndex(idx)}
                            >
                                <span>{ph.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TallySalaryDetailsAlteration;
