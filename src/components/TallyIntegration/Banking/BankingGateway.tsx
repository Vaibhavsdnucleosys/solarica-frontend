import React, { useEffect, useState, useCallback } from 'react';

interface Company {
    id?: string;
    name: string;
    date: string;
}

interface BankingGatewayProps {
    companyId?: string;
    companyName?: string;
    companies?: Company[];
    selectedCompany?: { id: string; name: string } | null;
    currentPeriod?: string;
    currentDate?: string;
    onReconciliation?: () => void;
    onQuit?: () => void;
}

const BankingGateway: React.FC<BankingGatewayProps> = ({
    companyId,
    companyName = 'Solarica',
    companies = [],
    selectedCompany,
    currentPeriod = '1-Apr-25 to 31-Mar-26',
    currentDate = 'Tuesday, 1-Apr-2025',
    onReconciliation,
    onQuit
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuItems = [
        { label: 'Reconciliation', type: 'RECONCILIATION', action: 'reconciliation' },
        { label: 'Quit', type: 'Quit', action: 'quit' }
    ];

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key.toLowerCase()) {
            case 'r':
                e.preventDefault();
                onReconciliation?.();
                break;
            case 'q':
                e.preventDefault();
                onQuit?.();
                break;
            case 'arrowdown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, menuItems.length - 1));
                break;
            case 'arrowup':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'enter':
                e.preventDefault();
                if (selectedIndex === 0) onReconciliation?.();
                else if (selectedIndex === 1) onQuit?.();
                break;
        }
    }, [selectedIndex, menuItems.length, onReconciliation, onQuit]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);


    return (
        <div className="flex flex-col h-full bg-[#def1fc]">
            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Area: Stats */}
                <div className="w-[55%] p-4 flex flex-col border-r-2 border-[#88b5dd] relative">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col gap-1 w-1/2 cursor-pointer hover:bg-blue-50 p-1 rounded transition-colors">
                            <span className="text-[#5ea4d6] text-[10px] font-bold uppercase tracking-wider">Current Period</span>
                            <span className="font-bold text-[#1b2c3c]">{currentPeriod}</span>
                        </div>
                        <div className="flex flex-col gap-1 w-1/2 items-end cursor-pointer hover:bg-blue-50 p-1 rounded transition-colors">
                            <span className="text-[#5ea4d6] text-[10px] font-bold uppercase tracking-wider">Current Date</span>
                            <span className="font-bold text-[#1b2c3c]">{currentDate}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 text-[11px] border-b border-[#5ea4d6] pb-1 mb-2">
                        <span className="text-[#5ea4d6] uppercase font-bold tracking-wider">Name of Company</span>
                        <span className="text-[#5ea4d6] uppercase font-bold tracking-wider text-right">Date of Last Entry</span>
                    </div>

                    <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
                        {companies.map((comp, idx) => (
                            <div
                                key={idx}
                                className={`grid grid-cols-2 gap-x-8 font-bold text-sm cursor-pointer hover:bg-blue-50 p-1 rounded transition-colors ${selectedCompany?.name === comp.name ? 'text-black font-extrabold' : 'text-[#1b2c3c]'
                                    }`}
                            >
                                <span>{comp.name}</span>
                                <span className="text-right">{comp.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Gateway Menu */}
                <div className="flex-1 flex justify-start pl-10 pt-16 relative">
                    <div className="w-[280px] bg-[#f2faff] border border-[#2a5585] shadow-lg flex flex-col h-auto max-h-[80%]">
                        {/* Menu Header */}
                        <div className="bg-[#2a5585] text-white text-center py-2 font-bold text-sm tracking-wide shrink-0">
                            Gateway of Accounting
                        </div>

                        {/* Menu Items List */}
                        <div className="overflow-y-auto py-2 flex-col flex items-center">
                            {menuItems.map((item, index) => {
                                const isNewGroup = index === 0 || menuItems[index - 1].type !== item.type;
                                const groupLabel = item.type;
                                const isActive = selectedIndex === index;

                                return (
                                    <div key={index} className="w-full flex flex-col items-center">
                                        {isNewGroup && item.type !== 'Quit' && (
                                            <div className="w-full text-center py-2 mt-1">
                                                <span className="text-[#5ea4d6] text-[10px] uppercase font-bold tracking-wider">
                                                    {groupLabel}
                                                </span>
                                            </div>
                                        )}

                                        <div
                                            className={`w-full text-center px-4 py-1 cursor-pointer transition-colors duration-75 relative ${isActive ? 'bg-[#f4c430] text-black font-bold' : 'text-[#2a5585] hover:bg-blue-50'
                                                }`}
                                            onClick={() => {
                                                setSelectedIndex(index);
                                                if (item.action === 'reconciliation') onReconciliation?.();
                                                else if (item.action === 'quit') onQuit?.();
                                            }}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            {item.label === 'Reconciliation' ? (
                                                <>
                                                    <span className="text-[#d32f2f] font-bold">R</span>econciliation
                                                </>
                                            ) : item.label === 'Quit' ? (
                                                <>
                                                    <span className="text-[#d32f2f] font-bold">Q</span>uit
                                                </>
                                            ) : (
                                                item.label
                                            )}
                                        </div>

                                        {item.type === 'Quit' && isNewGroup && (
                                            <div className="w-1/2 border-t border-[#88b5dd]/30 my-2"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankingGateway;
