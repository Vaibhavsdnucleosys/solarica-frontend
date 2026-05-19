import React, { useState } from 'react';

const voucherTypes = [
    "Attendance", "Contra", "Credit Note", "Debit Note", "Delivery Note",
    "Job Work In Order", "Job Work Out Order", "Journal", "Material In",
    "Material Out", "Memorandum", "Payment", "Payroll", "Physical Stock",
    "Purchase", "Purchase Order", "Receipt", "Receipt Note", "Rejections In",
    "Rejections Out", "Reversing Journal", "Sales", "Sales Order", "Stock Journal"
];

interface VoucherListProps {
    onNavigate?: (type: string) => void;
}

const VoucherList: React.FC<VoucherListProps> = ({ onNavigate }) => {
    const [selected, setSelected] = useState<string>("Attendance");

    // Scroll selected item into view
    React.useEffect(() => {
        const element = document.getElementById(`voucher-${selected}`);
        if (element) {
            element.scrollIntoView({ block: 'nearest' });
        }
    }, [selected]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const currentIndex = voucherTypes.indexOf(selected);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % voucherTypes.length;
            setSelected(voucherTypes[nextIndex]);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + voucherTypes.length) % voucherTypes.length;
            setSelected(voucherTypes[prevIndex]);
        } else if (e.key === 'Enter') {
            if (onNavigate) onNavigate(selected);
        }
    };

    return (
        <div
            className="flex-1 bg-white text-black font-sans flex flex-col text-base select-none overflow-hidden outline-none"
            tabIndex={0}
            autoFocus
            onKeyDown={handleKeyDown}
        >
            {/* Header Block */}
            <div className="h-9 bg-[#8cbbea] flex items-center justify-between px-3 w-full z-10 select-none shadow-sm text-black">
                <div className="font-bold whitespace-nowrap text-xl">Chart of Accounts</div>
                <div className="font-bold whitespace-nowrap flex-1 text-center pr-10 text-xl">Solarica</div>
                <div
                    className="font-bold cursor-pointer text-xl hover:text-red-600"
                    onClick={() => {
                        // Close functionality - navigate back or close modal
                        window.history.back();
                    }}
                >×</div>
            </div>

            {/* Sub Header */}
            <div className="flex justify-between items-center px-6 py-2 border-b border-gray-300 bg-white">
                <h2 className="font-bold text-2xl">List of Voucher Types</h2>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto bg-white pt-0 pb-6">
                <ul className="w-full">
                    {voucherTypes.map((type, index) => (
                        <li
                            key={index}
                            id={`voucher-${type}`}
                            onClick={() => setSelected(type)}
                            onDoubleClick={() => onNavigate && onNavigate(type)}
                            className={`
              px-6 py-0 cursor-pointer font-bold text-[17px] leading-snug tracking-tight border-b border-transparent
              ${selected === type ? 'bg-[#ffde70] text-black w-full' : 'hover:bg-gray-100'}
            `}
                        >
                            {type}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VoucherList;
