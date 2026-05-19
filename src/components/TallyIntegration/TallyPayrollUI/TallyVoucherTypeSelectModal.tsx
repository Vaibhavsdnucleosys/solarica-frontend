import React, { useState, useEffect, useRef } from 'react';

interface Props {
    companyId: string;
    onClose: () => void;
    onSelect: (typeName: string, mode: 'Create' | 'Alter') => void;
}

const TallyVoucherTypeSelectModal: React.FC<Props> = ({ companyId, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const allItems = [
        { label: 'Attendance', type: 'item' },
        { label: 'Payment', type: 'item' },
        { label: 'Receipt', type: 'item' },
        { label: 'Journal', type: 'item' },
        { label: 'Payroll', type: 'item' }
    ];

    const filteredItems = allItems.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : prev));
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredItems.length > 0) {
                    onSelect(filteredItems[selectedIndex].label, 'Alter');
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, onClose, onSelect, filteredItems]);

    return (
        <div className="absolute inset-0 z-[1000] flex items-start justify-center pt-[55px] pointer-events-none">
            <div className="w-[400px] shadow-[0_15px_60px_rgba(0,0,0,0.4)] flex flex-col pointer-events-auto bg-white border border-[#2a5585]">
                {/* Parent Title */}
                <div className="bg-white px-4 py-1.5 text-center border-b border-gray-200">
                    <div className="font-bold text-[#2a5585] text-[15px] underline decoration-1 underline-offset-[2px]">
                        Master Alteration
                    </div>
                </div>

                {/* Search Field Area */}
                <div className="bg-[#fcfcd0] px-3 py-1 border-b border-gray-300">
                    <input
                        ref={searchInputRef}
                        type="text"
                        className="w-full bg-transparent border-none outline-none text-[13px] font-bold text-black"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedIndex(0);
                        }}
                        autoFocus
                    />
                </div>

                {/* Popup Header Area */}
                <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-start text-[12px] font-bold min-h-[36px]">
                    <span className="pl-1 pt-0.5">List of Voucher Types</span>
                    <div className="flex flex-col items-end leading-[1.3] text-[11px] font-normal pr-1 pt-0.5">
                        <span
                            className="cursor-pointer hover:font-bold"
                            onClick={() => onSelect('', 'Create')}
                        >
                            Create
                        </span>
                        <span
                            className="cursor-pointer hover:font-bold"
                            onClick={onClose}
                        >
                            Back
                        </span>
                    </div>
                </div>

                {/* List Content */}
                <div className="bg-[#e8f6fa] min-h-[300px] max-h-[500px] overflow-y-auto">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, idx) => (
                            <div
                                key={idx}
                                className={`px-2 py-[2.5px] flex justify-between cursor-pointer text-[13px] ${idx === selectedIndex ? 'bg-[#feba35] text-black font-bold' : 'hover:bg-[#dceef5] text-black'
                                    }`}
                                onClick={() => onSelect(item.label, 'Alter')}
                                onMouseEnter={() => setSelectedIndex(idx)}
                            >
                                <span className="pl-1">{item.label}</span>
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-[13px] text-gray-500 italic">No matches found</div>
                    )}
                </div>

                {/* Bottom Status Bar */}
                <div className="bg-[#e8f6fa] px-2 py-0.5 flex justify-end border-t border-[#9bc9d9]">
                    <span className="text-[11px] font-bold text-[#2a5585] cursor-pointer" onClick={onClose}>Esc: Quit</span>
                </div>
            </div>
        </div>
    );
};

export default TallyVoucherTypeSelectModal;
