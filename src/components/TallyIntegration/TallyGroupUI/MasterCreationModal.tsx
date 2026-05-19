import React, { useState } from 'react';
import TallyEmployeeGroupCreation from '../TallyPayrollUI/TallyEmployeeGroupCreation';
import TallyEmployeeCreation from '../TallyPayrollUI/TallyEmployeeCreation';
import TallyAttendanceTypeCreation from '../TallyPayrollUI/TallyAttendanceTypeCreation';
import TallyPayHeadCreation from '../TallyPayrollUI/TallyPayHeadCreation';
import TallyPayrollUnitCreation from '../TallyPayrollUI/TallyPayrollUnitCreation';
import TallyPayrollVoucherCreation from '../TallyPayrollUI/TallyPayrollVoucherCreation';
import TallyGodownCreation from '../TallyInventoryUI/TallyGodownCreation';
import TallyGodownAlteration from '../TallyInventoryUI/TallyGodownAlteration';

interface MasterCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentCompany: string;
    openCompanies: Array<{ name: string; number: string; period?: string }>;
    setCurrentCompany: (company: string) => void;
    onAction?: (action: string) => void;
}

const MasterCreationModal: React.FC<MasterCreationModalProps> = ({
    isOpen,
    onClose,
    currentCompany,
    openCompanies,
    setCurrentCompany,
    onAction
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showMore, setShowMore] = useState(false);
    const [showInactive, setShowInactive] = useState(false);
    const [activePayrollModal, setActivePayrollModal] = useState<string | null>(null);

    const godownItems = ['♦ Primary', 'Main Location'];

    if (!isOpen) return null;

    return (
        <div
            className="absolute inset-0 z-[50] flex items-start justify-center pt-[80px] bg-[#e8f6fa] bg-opacity-20 backdrop-blur-sm font-sans text-black"
            onClick={onClose}
        >
            <div
                className="flex flex-col w-[480px] max-h-[600px] bg-white border-2 border-[#2d819b] shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black text-[13px] font-bold relative border-b border-[#2d819b] shrink-0">
                    <div className="flex items-center">
                        <span>Master Creation</span>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">{currentCompany || 'Solarica'}</div>
                    <div className="flex items-center absolute right-[2px]">
                        <span onClick={onClose} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                    </div>
                </div>

                {/* Search Input */}
                <div className="p-2 bg-[#ffe599] border-b border-black">
                    <input
                        type="text"
                        className="w-full bg-transparent font-bold outline-none text-black placeholder-black/50 text-[13px] px-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        autoFocus
                        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
                    />
                </div>

                {/* List Header with Change Company and Show More */}
                <div className="bg-[#2d819b] text-white px-2 py-1 text-[12px] font-bold flex justify-between items-center">
                    <span>List of Masters</span>
                    <div className="flex gap-4">
                        <span className="cursor-pointer hover:underline">Change Company</span>
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? 'Show Less' : 'Show More'}
                        </span>
                        {showMore && (
                            <span
                                className="cursor-pointer hover:underline"
                                onClick={() => setShowInactive(!showInactive)}
                            >
                                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Masters List Content */}
                <div className="flex-1 overflow-y-auto bg-white text-[14px]">
                    {/* Accounting Masters */}
                    <div className="bg-gray-100 px-3 py-2 font-bold text-[13px] text-center border-b border-gray-200">
                        Accounting Masters
                    </div>
                    <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200">Group</div>
                    <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200">Ledger</div>

                    {showMore && (
                        <>
                            {showInactive && (
                                <>
                                    <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer text-gray-400 border-b border-gray-200">Cost Category</div>
                                    <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer text-gray-400 border-b border-gray-200">Cost Centre</div>
                                    <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer text-gray-400 border-b border-gray-200">Cost Centre Class</div>
                                </>
                            )}
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200">Currency</div>
                            {showInactive && (
                                <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer text-gray-400 border-b border-gray-200">Rates of Exchange</div>
                            )}
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200">Budget</div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200">Scenario</div>
                        </>
                    )}

                    <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200">Voucher Type</div>

                    {showMore && (
                        <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200">Credit Limits</div>
                    )}

                    {/* Inventory Masters */}
                    {showMore && (
                        <>
                            <div className="bg-gray-100 px-3 py-2 font-bold text-[13px] border-b border-gray-200 mt-2">
                                Inventory Masters
                            </div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200" onClick={() => onAction?.('create-stock-group')}>Stock Group</div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200" onClick={() => onAction?.('create-stock-category')}>Stock Category</div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200" onClick={() => onAction?.('create-stock-item')}>Stock Item</div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200" onClick={() => onAction?.('create-unit')}>Unit</div>
                            <div
                                className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200"
                                onClick={() => onAction?.('create-godown')}
                            >Godown</div>
                            {showInactive && (
                                <>
                                    <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer text-gray-400 border-b border-gray-200">Price levels</div>
                                    <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer text-gray-400 border-b border-gray-200">Price List (Stock Group)</div>
                                    <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer text-gray-400 border-b border-gray-200">Price List (Stock Category)</div>
                                </>
                            )}
                        </>
                    )}

                    {/* Payroll Masters */}
                    {showMore && (
                        <>
                            <div className="bg-gray-100 px-3 py-2 font-bold text-[13px] border-b border-gray-200 mt-2">
                                Payroll Masters
                            </div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200" onClick={() => setActivePayrollModal('employeeGroup')}>Employee Group</div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200" onClick={() => setActivePayrollModal('employee')}>Employee</div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200" onClick={() => setActivePayrollModal('attendanceType')}>Attendance/Production Type</div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200" onClick={() => setActivePayrollModal('payHead')}>Pay Heads</div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200" onClick={() => setActivePayrollModal('payrollVoucher')}>Payroll Voucher Type</div>
                        </>
                    )}

                    {/* Statutory Masters */}
                    {showMore && (
                        <>
                            <div className="bg-gray-100 px-3 py-2 font-bold text-[13px] border-b border-gray-200 mt-2">
                                Statutory Masters
                            </div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200">GST Registration</div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200">GST Classification</div>
                        </>
                    )}

                    {/* Statutory Details */}
                    {showMore && (
                        <>
                            <div className="bg-gray-100 px-3 py-2 font-bold text-[13px] border-b border-gray-200 mt-2">
                                Statutory Details
                            </div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200">Company GST Details</div>
                            <div className="px-4 py-2 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-200">PAN/CIN Details</div>
                        </>
                    )}

                    {/* Show count at bottom */}
                    <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200 mt-2">
                        {showInactive && <span className="mr-4">26 ▼</span>}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-2 border-t border-gray-200 flex justify-end bg-white">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-gray-600 hover:text-black"
                    >
                        Esc: Close
                    </button>
                </div>
            </div>

            {/* Payroll Master Creation Modals */}
            {activePayrollModal === 'employeeGroup' && (
                <TallyEmployeeGroupCreation onClose={() => setActivePayrollModal(null)} />
            )}
            {activePayrollModal === 'employee' && (
                <TallyEmployeeCreation onClose={() => setActivePayrollModal(null)} />
            )}
            {activePayrollModal === 'unit' && (
                <TallyPayrollUnitCreation onClose={() => setActivePayrollModal(null)} />
            )}
            {activePayrollModal === 'attendanceType' && (
                <TallyAttendanceTypeCreation onClose={() => setActivePayrollModal(null)} />
            )}
            {activePayrollModal === 'payHead' && (
                <TallyPayHeadCreation onClose={() => setActivePayrollModal(null)} />
            )}
            {activePayrollModal === 'payrollVoucher' && (
                <TallyPayrollVoucherCreation onClose={() => setActivePayrollModal(null)} />
            )}

        </div>
    );
};

export default MasterCreationModal;
