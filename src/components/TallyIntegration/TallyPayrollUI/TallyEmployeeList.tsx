import React, { useState, useEffect } from 'react';
import TallyEmployeeCreation from './TallyEmployeeCreation';
import TallyEmployeeCategoryCreation from './TallyEmployeeCategoryCreation'; // Import
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';
import { getPayrollEmployees, DEFAULT_COMPANY_ID } from '../../../services/accountingService';

interface TallyEmployeeListProps {
    onClose?: () => void;
    companyId?: string;
}

const TallyEmployeeList: React.FC<TallyEmployeeListProps> = ({ onClose, companyId = DEFAULT_COMPANY_ID }) => {
    const [showCreationModal, setShowCreationModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [alterationMode, setAlterationMode] = useState(false);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const data = await getPayrollEmployees(companyId);
            setEmployees(data);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [companyId]);

    const [selectedIndex, setSelectedIndex] = useState(0);

    // Keydown handler for shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showCreationModal || showCategoryModal) return;

            if (e.key === 'Escape') {
                if (onClose) onClose();
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, employees.length - 1)));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < employees.length - 1 ? prev + 1 : 0));
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                if (onClose) onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, showCreationModal, showCategoryModal, employees.length]);

    return (
        <div className="w-full h-full flex flex-row bg-[#e8f6fa] font-sans overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-[#8ec2eb] text-[#1b2c3c] px-4 py-0.5 flex justify-between items-center border-b border-[#5ea4d6] relative shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-[13px]">Chart of Accounts</span>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                        <span className="font-bold text-[13px]">Solarica</span>
                    </div>
                    <div className="flex items-center absolute right-[2px]">
                        <span onClick={onClose} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                    </div>
                </div>

                {/* Title Bar */}
                <div className="bg-white px-4 py-1 border-b border-gray-300">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-[13px]">List of Employees</span>
                        <span className="text-[11px] text-gray-600">For 1-Apr-25</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white custom-scrollbar relative">
                    {/* Table Header Row Removed */}

                    {loading ? (
                        <div className="px-4 py-4 text-gray-500 italic">Loading...</div>
                    ) : employees.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-20">
                            <span className="font-bold text-[15px]">No employees found</span>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {employees.map((emp, index) => (
                                <div
                                    key={index}
                                    className={`px-4 py-1 flex items-center cursor-pointer border-b border-gray-100 transition-colors
                                            ${selectedIndex === index ? 'bg-[#feba35] shadow-sm' : 'hover:bg-[#def1fc]/50'}
                                        `}
                                    onClick={() => {
                                        setSelectedEmployee(emp.name);
                                        setAlterationMode(true);
                                        setShowCreationModal(true);
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <div className="flex items-center gap-2 w-1/2">
                                        <span className={`text-[14px] font-bold ${selectedIndex === index ? 'text-black' : 'text-[#1b2c3c]'}`}>
                                            {emp.name}
                                        </span>
                                        {emp.designation && (
                                            <span className={`text-[11px] ${selectedIndex === index ? 'text-black opacity-70' : 'text-gray-500'}`}>({emp.designation})</span>
                                        )}
                                    </div>
                                    <span className={`text-[13px] w-1/2 text-right pr-4 ${selectedIndex === index ? 'text-black font-bold' : 'text-gray-600 italic'}`}>
                                        Primary Cost Category
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-[#8ec2eb] border-t border-[#5ea4d6] px-4 py-1 flex justify-between">
                    <span className="text-[11px] font-bold text-black uppercase tracking-wider">1 Category, 0 Groups and {employees.length} Employee(s)</span>
                    <span className="text-[11px] font-bold text-black uppercase tracking-wider">{selectedIndex + 1} of {employees.length}</span>
                </div>

                <div className="bg-[#def1fc] border-t-2 border-[#2a5585] px-4 py-1 flex items-center gap-6 text-[11px]">
                    <span className="cursor-pointer hover:underline" onClick={onClose}><span className="text-[#2a5585] font-bold">Q</span>: Quit</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">Enter</span>: Alter</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">Space</span>: Select</span>
                    <span className="cursor-pointer hover:underline" onClick={onClose}><span className="text-[#2a5585] font-bold">A</span>: Accept</span>
                    <span className="cursor-pointer hover:underline" onClick={() => {
                        setAlterationMode(false);
                        setSelectedEmployee(null);
                        setShowCreationModal(true);
                    }}><span className="text-[#2a5585] font-bold">C</span>: Create Master</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">D</span>: Delete</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">R</span>: Remove Line</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">U</span>: Restore Line</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">F12</span>: Configure</span>
                </div>
            </div>

            <TallySidebar>
                <SidebarButton keyName="F2" label="Period" onClick={() => { }} disabled={true} />
                <SidebarButton keyName="F3" label="Company" onClick={() => { }} />
                <SidebarButton keyName="F4" label="" disabled={true} />
                <SidebarButton keyName="F5" label="" disabled={true} />
                <SidebarButton keyName="F6" label="" disabled={true} />
                <SidebarButton keyName="F7" label="" disabled={true} />
                <SidebarButton keyName="F8" label="" disabled={true} />
                <SidebarButton keyName="F9" label="" disabled={true} />
                <SidebarButton keyName="F10" label="Other Masters" onClick={() => { }} />
            </TallySidebar>

            {showCreationModal && (
                <div className="fixed inset-0 z-[10000] bg-white">
                    <TallyEmployeeCreation
                        onClose={() => {
                            setShowCreationModal(false);
                            fetchEmployees();
                        }}
                        companyId={companyId}
                        initialMode={alterationMode ? 'Alter' : 'Create'}
                        initialName={alterationMode ? (selectedEmployee || '') : ''}
                    />
                </div>
            )}
            {showCategoryModal && (
                <div className="fixed inset-0 z-[10000] bg-white">
                    <TallyEmployeeCategoryCreation
                        onClose={() => setShowCategoryModal(false)}
                        companyId={companyId}
                        initialMode="Alter"
                        initialName="Primary Cost Category"
                    />
                </div>
            )}
        </div>
    );
};

export default TallyEmployeeList;
