import React, { useState } from 'react';

// Modal Content Components
export const PeriodModal = () => (
    <div className="w-[300px] font-sans">
        <div className="flex items-center mb-2">
            <label className="w-16 font-medium text-gray-700">From</label>
            <span className="mr-2 font-bold text-gray-400">:</span>
            <input type="text" defaultValue="1-4-2025" className="border border-gray-400 w-24 px-1 font-bold text-black outline-none focus:bg-yellow-100" />
        </div>
        <div className="flex items-center">
            <label className="w-16 font-medium text-gray-700">To</label>
            <span className="mr-2 font-bold text-gray-400">:</span>
            <input type="text" className="border border-gray-400 w-24 px-1 font-bold text-black outline-none focus:bg-yellow-100" />
        </div>
    </div>
);

export const TallySelectionList = ({ title, items, onItemClick }: { title: string, items: { label: string, type?: 'header' | 'item' }[], onItemClick?: (item: string) => void }) => {
    return (
        <div className="w-[350px] font-sans flex flex-col h-[400px]">
            {/* Blue Title Bar */}
            <div className="bg-[#1b2c3c] text-white px-2 py-0.5 font-bold text-sm">
                {title}
            </div>

            <div className="flex-1 bg-[#dcecf5] overflow-y-auto border border-gray-400 custom-scrollbar relative">
                {/* Right Side Shortcuts Panel (Mock) */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#bedff6] border-l border-white z-10"></div>

                <div className="pr-8"> {/* Space for sidebar */}
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`
                                px-2 py-0.5 cursor-pointer flex justify-between
                                ${item.type === 'header' ? 'font-bold text-[#1d5b6e] mt-2 mb-0.5' : 'text-black hover:bg-yellow-200'}
                                ${item.label === 'Ledgers' || item.label === 'Ledger-wise' ? 'bg-yellow-400 font-bold text-black' : ''} 
                            `}
                            onClick={() => onItemClick && item.type !== 'header' && onItemClick(item.label)}
                        >
                            <span className={item.type === 'header' ? '' : 'pl-2'}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const otherMastersData = [
    { label: 'Show Inactive', type: 'header' as const },
    { label: 'Accounting Masters', type: 'header' as const },
    { label: 'Groups' },
    { label: 'Ledgers' },
    { label: 'Voucher Types' },
    { label: 'Currencies' },
    { label: 'Budgets' },
    { label: 'Scenarios' },
    { label: 'Inventory Masters', type: 'header' as const },
    { label: 'Stock Groups' },
    { label: 'Stock Items' },
    { label: 'Stock Categories' },
    { label: 'Units' },
    { label: 'Godowns' },
    { label: 'Payroll Masters', type: 'header' as const },
    { label: 'Employee Categories' },
    { label: 'Employee Groups' },
    { label: 'Employees' },
    { label: 'Pay Heads' },
];

export const changeViewData = [
    { label: 'Views', type: 'header' as const },
    { label: 'Ledger-wise' },
    { label: 'Ledger GST Details' },
    { label: 'Related Reports', type: 'header' as const },
    { label: 'Ledger Contact Details' },
];

export const GenericModal = ({ activeModal, onClose }: { activeModal: { title: string, content: React.ReactNode } | null, onClose: () => void }) => {
    if (!activeModal) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20">
            <div className="bg-white border text-sm shadow-xl min-w-[300px] max-w-[500px]">
                <div className="bg-[#2d819b] text-white px-2 py-1 font-bold flex justify-between items-center bg-gradient-to-r from-[#2d819b] to-[#2d819b]/80">
                    <span>{activeModal.title}</span>
                    <button onClick={onClose} className="hover:bg-red-500 px-1.5 rounded">✕</button>
                </div>
                <div className="min-h-[100px] border border-[#2d819b] m-1 bg-[#f5f7f9] p-1">
                    {activeModal.content}
                    <div className="flex justify-end p-2 gap-2 mt-4">
                        <button className="px-3 py-0.5 border border-gray-400 bg-gray-100 hover:bg-gray-200 text-xs font-bold" onClick={onClose}>Cancel</button>
                        <button className="px-3 py-0.5 border border-gray-400 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-blue-800" onClick={onClose}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
