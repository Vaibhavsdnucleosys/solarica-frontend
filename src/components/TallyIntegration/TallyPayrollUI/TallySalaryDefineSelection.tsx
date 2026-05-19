import React, { useState, useEffect } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';
import { getEmployeeGroups, getPayrollEmployees, DEFAULT_COMPANY_ID } from '../../../services/accountingService';

interface Props {
    onClose: () => void;
    onSelect: (type: 'Employee' | 'Group', id: string, name: string) => void;
    companyId?: string;
}

const TallySalaryDefineSelection = ({ onClose, onSelect, companyId = DEFAULT_COMPANY_ID }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState<any[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [groups, employees] = await Promise.all([
                    getEmployeeGroups(companyId),
                    getPayrollEmployees(companyId)
                ]);

                const formattedGroups = (groups || []).map((g: any) => ({
                    id: g.id,
                    name: g.name,
                    type: 'Group' as const
                }));

                const formattedEmployees = (employees || []).map((e: any) => ({
                    id: e.id,
                    name: e.name,
                    type: 'Employee' as const
                }));

                setItems([...formattedGroups, ...formattedEmployees]);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [companyId]);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
        } else if (e.key === 'ArrowDown') {
            setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'Enter') {
            if (filteredItems[selectedIndex]) {
                const item = filteredItems[selectedIndex];
                onSelect(item.type, item.id, item.name);
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="flex flex-row h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Title Bar - Now Narrower */}
                <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0 uppercase text-[11px]">
                    <div className="flex items-center">
                        <span> Define Salary </span>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                    <div className="flex items-center absolute right-[2px]">
                        <span onClick={onClose} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white flex flex-col h-full overflow-hidden border-r border-[#ccc] relative">
                    <div className="bg-black/40 flex items-start justify-center pt-10 h-full w-full">
                        <div className="flex flex-col gap-0 w-[420px] shadow-2xl bg-white border border-gray-400">
                            <div className="bg-white px-4 py-1.5 text-center border-b border-gray-200">
                                <div className="font-bold text-[#2a5585] text-[15px]">
                                    Salary Details
                                </div>
                            </div>
                            <div className="bg-[#fcfcd0] px-3 py-1 border-b border-gray-300">
                                <input
                                    className="w-full bg-transparent border-none outline-none text-[13px] font-bold text-black"
                                    autoFocus
                                    placeholder="Search Employee or Group"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <div className="bg-[#def1fc] border-x border-t border-[#2a5585]">
                                <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center text-[12px]">
                                    <span className="font-bold text-center w-full">List of Employees / Groups</span>
                                </div>
                                <div className="bg-white max-h-[400px] overflow-y-auto">
                                    {loading ? (
                                        <div className="p-4 text-center text-gray-500 italic">Loading...</div>
                                    ) : filteredItems.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 italic">No matches found</div>
                                    ) : (
                                        filteredItems.map((item, index) => {
                                            const isActive = selectedIndex === index;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`px-3 py-0.5 cursor-pointer text-[13px] font-bold leading-tight flex justify-between
                                                        ${isActive ? 'bg-[#feba35] text-black' : 'text-black hover:bg-blue-50'}
                                                    `}
                                                    onClick={() => onSelect(item.type, item.id, item.name)}
                                                    onMouseEnter={() => setSelectedIndex(index)}
                                                >
                                                    <span>{item.name}</span>
                                                    <span className="text-[11px] font-normal text-gray-500">({item.type})</span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                            <div className="bg-white px-2 py-0.5 flex justify-end border border-[#2a5585] border-t-0">
                                <span className="text-[11px] font-bold text-[#2a5585] cursor-pointer" onClick={onClose}>Esc: Quit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar - Now Full Height */}
            <TallySidebar>
                <SidebarButton keyName="F2" label="Period" onClick={() => { }} disabled={true} />
                <SidebarButton keyName="F3" label="Company" onClick={() => { }} />
                <SidebarButton keyName="F10" label="Other Masters" onClick={() => { }} />
            </TallySidebar>
        </div>
    );
};

export default TallySalaryDefineSelection;
