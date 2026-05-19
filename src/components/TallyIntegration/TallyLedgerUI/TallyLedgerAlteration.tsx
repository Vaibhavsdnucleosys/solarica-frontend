import React from 'react';
import type { TallyFormData } from './types';



interface TallyLedgerAlterationProps {
    formData: TallyFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFocus: (menuName: string | null) => void;
    handleFieldKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, nextFieldId: string | null, prevFieldId: string | null) => void;
    setViewMode: (mode: 'list' | 'alter') => void;
    showAccept: boolean;
    setShowAccept: (show: boolean) => void;
    showQuit: boolean;
    setShowQuit: (show: boolean) => void;
    sideMenuComponent: React.ReactNode;
}

const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center cursor-pointer hover:bg-black/5 px-2 py-0.5 rounded transition-colors group" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px] group-hover:text-blue-600">{keyName}</span>
        <span className="text-gray-700">: {label}</span>
    </div>
);

const TallyLedgerAlteration: React.FC<TallyLedgerAlterationProps> = ({
    formData,
    handleInputChange,
    handleFocus,
    handleFieldKeyDown,
    setViewMode,
    showAccept,
    setShowAccept,
    showQuit,
    setShowQuit,
    sideMenuComponent
}) => {
    // Handle Escape key
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    if (showQuit) {
                        setShowQuit(false);
                    } else if (!showAccept) {
                        setShowQuit(true);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showQuit, showAccept, setShowQuit]);



    const isCashOrPL = formData.name === 'Cash' || formData.name === 'Profit & Loss A/c';

    return (
        <div className="flex-1 w-full flex flex-col bg-[#f5f7f9] font-sans relative select-none overflow-hidden">

            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-6 bg-[#88b5dd] text-black text-[13px] font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>Ledger Alteration {formData.under !== 'Primary' ? '(Secondary)' : ''}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuit(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2 transition-colors">✕</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Form Area */}
                <div className={`${isCashOrPL ? 'w-full' : 'w-[65%]'} bg-white flex flex-col border-r border-gray-300 relative overflow-hidden`}>
                    <div className="flex-1 flex overflow-hidden pb-10">
                        {/* Left Column */}
                        <div className="w-1/2 p-6 border-r border-dotted border-gray-200 overflow-y-auto custom-scrollbar">
                            {/* Name Section */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('name')?.focus()}>
                                    <div className="w-24 text-[13px] text-gray-700 font-medium">Name</div>
                                    <div className="font-bold mr-2 text-gray-400">:</div>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        onFocus={() => handleFocus(null)}
                                        onKeyDown={(e) => handleFieldKeyDown(e, 'alias', null)}
                                        autoComplete="off"
                                        className="flex-1 bg-[#fcfcd0] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[14px] outline-none border border-transparent rounded-sm transition-all"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('alias')?.focus()}>
                                    <div className="w-24 text-[13px] text-gray-500 italic font-medium">(alias)</div>
                                    <div className="font-bold mr-2 text-gray-400">:</div>
                                    <input
                                        id="alias"
                                        type="text"
                                        name="alias"
                                        value={formData.alias}
                                        onChange={handleInputChange}
                                        onFocus={() => handleFocus(null)}
                                        onKeyDown={(e) => handleFieldKeyDown(e, 'underInput', 'name')}
                                        autoComplete="off"
                                        className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 italic text-[14px] outline-none border-b border-gray-100 rounded-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div className="h-[1px] bg-gray-100 mb-6" />

                            {/* Under Section */}
                            <div className="space-y-4">
                                <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('underInput')?.focus()}>
                                    <div className="w-24 text-[13px] text-gray-700 font-medium">Under</div>
                                    <div className="font-bold mr-2 text-gray-400">:</div>
                                    <div className="flex-1 flex flex-col">
                                        <input
                                            id="underInput"
                                            type="text"
                                            name="under"
                                            value={formData.under}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus('groupList')}
                                            onKeyDown={(e) => handleFieldKeyDown(e, 'mailingName', 'alias')}
                                            autoComplete="off"
                                            className="w-full bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-black text-[14px] text-blue-900 outline-none rounded-sm transition-all"
                                        />
                                        {formData.under === 'Cash-in-Hand' && (
                                            <div className="px-2 italic text-[11px] text-gray-400 mt-1 uppercase tracking-wider">(Current Assets)</div>
                                        )}
                                    </div>
                                </div>

                                {formData.useAsIncomeExpense && (
                                    <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('useAsIncomeExpense')?.focus()}>
                                        <div className="w-2/3 text-[13px] text-gray-700">Use as Income & Expense A/c</div>
                                        <div className="font-bold mr-2 text-gray-400">:</div>
                                        <input
                                            id="useAsIncomeExpense"
                                            type="text"
                                            name="useAsIncomeExpense"
                                            value={formData.useAsIncomeExpense}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus(null)}
                                            onKeyDown={(e) => handleFieldKeyDown(e, 'mailingName', 'underInput')}
                                            autoComplete="off"
                                            className="w-16 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] text-center outline-none rounded-sm transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="w-1/2 p-6 overflow-y-auto custom-scrollbar bg-gray-50/30">
                            {/* Mailing Details */}
                            <div className="mb-8">
                                <div className="text-[13px] font-black text-blue-900 mb-4 uppercase tracking-tight border-b border-blue-100 pb-1">Mailing Details</div>
                                <div className="space-y-3">
                                    <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('mailingName')?.focus()}>
                                        <div className="w-24 text-[13px] text-gray-700">Name</div>
                                        <div className="font-bold mr-2 text-gray-400">:</div>
                                        <input
                                            id="mailingName"
                                            type="text"
                                            name="mailingName"
                                            value={formData.mailingName}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus(null)}
                                            onKeyDown={(e) => handleFieldKeyDown(e, 'address', 'underInput')}
                                            autoComplete="off"
                                            className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 text-[13px] outline-none rounded-sm transition-all"
                                        />
                                    </div>
                                    <div className="flex items-start group cursor-pointer" onClick={() => document.getElementById('address')?.focus()}>
                                        <div className="w-24 text-[13px] text-gray-700 mt-1">Address</div>
                                        <div className="font-bold mr-2 text-gray-400 mt-1">:</div>
                                        <input
                                            id="address"
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus(null)}
                                            onKeyDown={(e) => handleFieldKeyDown(e, 'provideBankDetails', 'mailingName')}
                                            autoComplete="off"
                                            className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 text-[13px] outline-none rounded-sm transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Banking Details */}
                            <div className="mb-8">
                                <div className="text-[13px] font-black text-blue-900 mb-4 uppercase tracking-tight border-b border-blue-100 pb-1">Banking Details</div>
                                <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('provideBankDetails')?.focus()}>
                                    <div className="flex-1 text-[13px] text-gray-700">Provide bank details</div>
                                    <div className="font-bold mr-2 text-gray-400">:</div>
                                    <input
                                        id="provideBankDetails"
                                        type="text"
                                        name="provideBankDetails"
                                        value={formData.provideBankDetails}
                                        onChange={handleInputChange}
                                        onFocus={() => handleFocus(null)}
                                        onKeyDown={(e) => handleFieldKeyDown(e, 'panNo', 'address')}
                                        autoComplete="off"
                                        className="w-16 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] text-center outline-none rounded-sm transition-all"
                                    />
                                </div>
                            </div>

                            {/* Tax Registration Details */}
                            <div>
                                <div className="text-[13px] font-black text-blue-900 mb-4 uppercase tracking-tight border-b border-blue-100 pb-1">Tax Registration Details</div>
                                <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('panNo')?.focus()}>
                                    <div className="w-24 text-[13px] text-gray-700">PAN/IT No.</div>
                                    <div className="font-bold mr-2 text-gray-400">:</div>
                                    <input
                                        id="panNo"
                                        type="text"
                                        name="panNo"
                                        value={formData.panNo}
                                        onChange={handleInputChange}
                                        onFocus={() => handleFocus(null)}
                                        onKeyDown={(e) => handleFieldKeyDown(e, 'openingBalance', 'provideBankDetails')}
                                        autoComplete="off"
                                        className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] outline-none rounded-sm transition-all uppercase"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Opening Balance Bar (Pinned to Form Bottom, Above Footer Counts) */}
                    <div className="absolute bottom-0 left-0 w-full bg-[#e9f0f5] border-t border-gray-300 p-2 flex items-center justify-center z-20 h-10 shadow-sm">
                        <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('openingBalance')?.focus()}>
                            <span className="text-[12px] font-bold text-gray-800">Opening Balance </span>
                            <span className="mx-2 italic text-[10px] text-gray-500 font-medium">( on 1-Apr-25 ) :</span>
                            <input
                                id="openingBalance"
                                type="text"
                                name="openingBalance"
                                value={formData.openingBalance || '0.00 Dr'}
                                onChange={handleInputChange}
                                onFocus={() => handleFocus(null)}
                                onKeyDown={(e) => handleFieldKeyDown(e, null, 'panNo')}
                                autoComplete="off"
                                className="w-[150px] bg-white focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] text-right text-gray-900 outline-none border border-gray-200 rounded-sm shadow-inner transition-all"
                            />
                        </div>
                    </div>

                </div>

                {/* Right Area (Sidebar Background) */}
                <div className="flex-1 bg-[#dcdcdc] border-l border-white shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <div className="h-full w-full bg-[radial-gradient(#1b2c3c_1px,transparent_1px)] [background-size:20px_20px]" />
                    </div>
                    {/* Menu Overlay */}
                    <div className="absolute top-0 right-0 h-full w-full pointer-events-auto z-20">
                        {sideMenuComponent}
                    </div>
                </div>
            </div>

            {/* Accept Confirmation Box */}
            {showAccept && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAccept(false)}>✕</button>
                    <div className="text-[15px] text-black font-bold mt-2">Accept ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') setViewMode('list');
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                setShowAccept(false);
                                setTimeout(() => document.getElementById('name')?.focus(), 0);
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={() => setViewMode('list')}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAccept(false);
                            setTimeout(() => document.getElementById('name')?.focus(), 0);
                        }}>No</span>
                    </div>
                </div>
            )}

            {/* Quit Confirmation Box */}
            {showQuit && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowQuit(false)}>✕</button>
                    <div className="text-[15px] text-black font-bold mt-2">Quit ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') setViewMode('list');
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowQuit(false);
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={() => setViewMode('list')}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => setShowQuit(false)}>No</span>
                    </div>
                </div>
            )}




        </div>
    );
};

export default TallyLedgerAlteration;
