import React, { useState, useEffect } from 'react';
import TallySidebar, { SidebarButton } from '../TallyCommon/TallySidebar';

interface ChartOfAccountsProps {
    onClose: () => void;
    onNavigateToPayroll?: (masterType: string) => void;
    companyName?: string;
    companyId: string;
}

interface MasterItem {
    name: string;
    action: string;
    category: string;
}

const ChartOfAccounts: React.FC<ChartOfAccountsProps> = ({
    onClose,
    onNavigateToPayroll,
    companyName = 'Solarica',
    companyId
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showMore, setShowMore] = useState(true);

    const masterItems: MasterItem[] = [
        // Accounting Masters
        { name: 'Group', action: 'create-group', category: 'Accounting Masters' },
        { name: 'Ledger', action: 'create-ledger', category: 'Accounting Masters' },
        { name: 'Currency', action: 'create-currency', category: 'Accounting Masters' },
        { name: 'Voucher Type', action: 'create-voucher-type', category: 'Accounting Masters' },

        // Inventory Masters
        { name: 'Stock Group', action: 'create-stock-group', category: 'Inventory Masters' },
        { name: 'Stock Category', action: 'create-stock-category', category: 'Inventory Masters' },
        { name: 'Stock Item', action: 'create-stock-item', category: 'Inventory Masters' },
        { name: 'Unit', action: 'create-unit', category: 'Inventory Masters' },
        { name: 'Godown', action: 'create-godown', category: 'Inventory Masters' },

        // Payroll Masters
        { name: 'Employee Categories', action: 'employee-categories', category: 'Payroll Masters' },
        { name: 'Employee Groups', action: 'employee-groups', category: 'Payroll Masters' },
        { name: 'Employees', action: 'employees', category: 'Payroll Masters' },
        { name: 'Attendance/Production Types', action: 'attendance-types', category: 'Payroll Masters' },
        { name: 'Pay Heads', action: 'pay-heads', category: 'Payroll Masters' },

        // Statutory Masters
        { name: 'GST Registration', action: 'create-gst-registration', category: 'Statutory Masters' },
        { name: 'GST Classification', action: 'create-gst-classification', category: 'Statutory Masters' },

        // Statutory Details
        { name: 'Company GST Details', action: 'create-company-gst', category: 'Statutory Details' }
    ];

    const handleSelect = (item: MasterItem) => {
        if (onNavigateToPayroll) {
            onNavigateToPayroll(item.action);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    onClose();
                    return;
                }
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : masterItems.length - 1));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < masterItems.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                handleSelect(masterItems[selectedIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, masterItems]);

    // Group items by category to match the UserDashboard rendering logic
    const renderListItems = () => {
        return masterItems.map((item, index) => {
            const isNewGroup = index === 0 || masterItems[index - 1].category !== item.category;
            const isActive = selectedIndex === index;

            return (
                <div key={item.name}>
                    {isNewGroup && (
                        <div className="px-2 pt-1.5 pb-0.5 text-[13px] font-bold text-black bg-white text-center">
                            {item.category}
                        </div>
                    )}
                    <div
                        className={`px-3 py-0.5 cursor-pointer text-[13px] font-bold leading-tight
                            ${isActive ? 'bg-[#feba35] text-black' : 'text-black'}
                            ${!isActive ? 'hover:bg-blue-50' : ''}
                        `}
                        onClick={() => {
                            setSelectedIndex(index);
                            handleSelect(item);
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                    >
                        {item.name}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="absolute inset-0 z-[100] bg-black/40 flex items-start justify-center pt-10 font-sans select-none">
            <div className="flex flex-col gap-0 w-[420px] shadow-2xl bg-white border border-gray-400">
                {/* Title */}
                <div className="bg-white px-4 py-1.5 text-center border-b border-gray-200 relative">
                    <div className="font-bold text-[#2a5585] text-[15px] underline decoration-1 underline-offset-[2px]">
                        Chart of Accounts
                    </div>
                    <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                        <span onClick={onClose} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2 font-bold mb-4">✕</span>
                    </div>
                </div>

                {/* Search/Input Placeholder */}
                <div className="bg-[#fcfcd0] px-3 py-1 border-b border-gray-300">
                    <input className="w-full bg-transparent border-none outline-none text-[13px] font-bold text-black" autoFocus placeholder="" />
                </div>

                {/* List Container */}
                <div className="bg-[#def1fc] border-x border-t border-[#2a5585]">
                    {/* List Header */}
                    <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center text-[12px]">
                        <span className="font-bold">List of Masters</span>
                        <div className="text-[11px] flex flex-col items-end leading-[1.2]">
                            <span className="cursor-pointer hover:underline">Change Company</span>
                            <span className="cursor-pointer hover:underline" onClick={() => setShowMore(!showMore)}>
                                {showMore ? 'Show Less' : 'Show More'}
                            </span>
                        </div>
                    </div>

                    {/* List Items */}
                    <div className="bg-white max-h-[500px] overflow-y-auto">
                        {renderListItems()}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white px-2 py-0.5 flex justify-end border border-[#2a5585] border-t-0">
                    <span className="text-[11px] font-bold text-[#2a5585] cursor-pointer" onClick={onClose}>
                        Q: Quit
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChartOfAccounts;
