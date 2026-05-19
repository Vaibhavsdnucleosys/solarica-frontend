import React from 'react';
import type { TallyFormData } from './types';



interface TallyGroupAlterationProps {
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

const TallyGroupAlteration: React.FC<TallyGroupAlterationProps> = ({
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
            if (e.key === 'Escape') {
                e.preventDefault();
                if (showQuit) {
                    setShowQuit(false);
                } else if (!showAccept) {
                    setShowQuit(true);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showQuit, showAccept, setShowQuit]);



    return (
        <div className="h-full w-full flex flex-col bg-[#f5f7f9] font-sans relative select-none overflow-hidden">

            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-6 bg-[#88b5dd] text-black text-[13px] font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>Group Alteration</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuit(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2 transition-colors">✕</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Form Area */}
                <div className="w-[60%] bg-white flex flex-col h-full border-r border-gray-300 overflow-hidden">
                    <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
                        {/* Name Section */}
                        <div className="space-y-1 mb-2 max-w-2xl">
                            <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('name')?.focus()}>
                                <div className="w-32 text-[13px] text-gray-700 font-medium">Name</div>
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
                                <div className="w-32 text-[13px] text-gray-500 italic font-medium">(alias)</div>
                                <div className="font-bold mr-2 text-gray-400">:</div>
                                <input
                                    id="alias"
                                    type="text"
                                    name="alias"
                                    value={formData.alias}
                                    onChange={handleInputChange}
                                    onFocus={() => handleFocus(null)}
                                    onKeyDown={(e) => handleFieldKeyDown(e, (formData.showNature && formData.isNatureEditable) ? 'nature' : 'subLedger', 'name')}
                                    autoComplete="off"
                                    className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 italic text-[14px] outline-none border-b border-gray-100 rounded-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="h-[1px] bg-gray-100 mb-2 max-w-2xl" />

                        {/* Under Section */}
                        <div className="space-y-1 mb-2 max-w-2xl">
                            <div className="flex items-center group cursor-pointer">
                                <div className="w-32 text-[13px] text-gray-700 font-medium">Under</div>
                                <div className="font-bold mr-2 text-gray-400">:</div>
                                <div className="flex-1 font-bold text-[14px] text-blue-900 px-2 py-0.5 flex items-center">
                                    {formData.under === 'Primary' && <span className="mr-1 text-[#d89308]">♦</span>}
                                    {formData.under || 'Primary'}
                                </div>
                            </div>

                            {formData.showNature && (
                                <div className="flex items-center group cursor-pointer" onClick={() => formData.isNatureEditable && document.getElementById('nature')?.focus()}>
                                    <div className="w-[45%] text-[13px] text-gray-700">Nature of Group</div>
                                    <div className="font-bold mr-2 text-gray-400">:</div>
                                    <div className="flex-1">
                                        {formData.isNatureEditable ? (
                                            <input
                                                id="nature"
                                                type="text"
                                                name="nature"
                                                value={formData.nature}
                                                onChange={handleInputChange}
                                                onFocus={() => handleFocus('natureOfGroup')}
                                                onKeyDown={(e) => handleFieldKeyDown(e, 'subLedger', 'alias')}
                                                autoComplete="off"
                                                className="w-full bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] outline-none rounded-sm transition-all"
                                            />
                                        ) : (
                                            <span className="px-2 font-bold text-[13px]">{formData.nature}</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {formData.affectGrossProfits && (
                                <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('affectGrossProfits')?.focus()}>
                                    <div className="w-[45%] text-[13px] text-gray-700">Does it affect gross profits</div>
                                    <div className="font-bold mr-2 text-gray-400">:</div>
                                    <input
                                        id="affectGrossProfits"
                                        type="text"
                                        name="affectGrossProfits"
                                        value={formData.affectGrossProfits}
                                        onChange={handleInputChange}
                                        onFocus={() => handleFocus(null)}
                                        onKeyDown={(e) => handleFieldKeyDown(e, 'subLedger', 'nature')}
                                        autoComplete="off"
                                        className="w-16 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] text-center outline-none rounded-sm transition-all"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="h-2" />

                        {/* Behavior Section */}
                        <div className="space-y-1 mb-2 max-w-2xl p-0">
                            <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('subLedger')?.focus()}>
                                <div className="w-[60%] text-[13px] text-gray-700">Group behaves like a sub-ledger</div>
                                <div className="font-bold mr-2 text-gray-400">:</div>
                                <input
                                    id="subLedger"
                                    type="text"
                                    name="subLedger"
                                    value={formData.subLedger}
                                    onChange={handleInputChange}
                                    onFocus={() => handleFocus(null)}
                                    onKeyDown={(e) => handleFieldKeyDown(e, 'debitCredit', formData.showNature ? 'nature' : 'alias')}
                                    autoComplete="off"
                                    className="w-16 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] text-center outline-none rounded-sm transition-all"
                                />
                            </div>
                            <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('debitCredit')?.focus()}>
                                <div className="w-[60%] text-[13px] text-gray-700">Nett Debit/Credit Balances for Reporting</div>
                                <div className="font-bold mr-2 text-gray-400">:</div>
                                <input
                                    id="debitCredit"
                                    type="text"
                                    name="debitCredit"
                                    value={formData.debitCredit}
                                    onChange={handleInputChange}
                                    onFocus={() => handleFocus(null)}
                                    onKeyDown={(e) => handleFieldKeyDown(e, 'calculation', 'subLedger')}
                                    autoComplete="off"
                                    className="w-16 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] text-center outline-none rounded-sm transition-all"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('calculation')?.focus()}>
                                    <div className="w-[60%] text-[13px] text-gray-700">Used for calculation (for example: taxes, discounts)</div>
                                    <div className="font-bold mr-2 text-gray-400">:</div>
                                    <input
                                        id="calculation"
                                        type="text"
                                        name="calculation"
                                        value={formData.calculation}
                                        onChange={handleInputChange}
                                        onFocus={() => handleFocus(null)}
                                        onKeyDown={(e) => handleFieldKeyDown(e, 'invoiceMethod', 'debitCredit')}
                                        autoComplete="off"
                                        className="w-16 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] text-center outline-none rounded-sm transition-all"
                                    />
                                </div>
                                <div className="text-[11px] italic text-gray-400 ml-[62%] mt-1">(for sales invoice entries)</div>
                            </div>
                            <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('invoiceMethod')?.focus()}>
                                <div className="w-[60%] text-[13px] text-gray-700">Method to allocate when used in purchase invoice</div>
                                <div className="font-bold mr-2 text-gray-400">:</div>
                                <div className="flex-1 flex items-center">
                                    <span className="mr-1 text-[#d89308]">♦</span>
                                    <input
                                        id="invoiceMethod"
                                        type="text"
                                        name="invoiceMethod"
                                        value={formData.invoiceMethod}
                                        onChange={handleInputChange}
                                        onFocus={() => handleFocus('invoiceMethod')}
                                        onKeyDown={(e) => handleFieldKeyDown(e, formData.showStatutory ? 'hsnDetails' : null, 'calculation')}
                                        autoComplete="off"
                                        className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] outline-none rounded-sm transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Statutory Details Section */}
                        {formData.showStatutory && (
                            <div className="mt-2 space-y-1 max-w-2xl">
                                <div className="text-[13px] font-black text-blue-900 uppercase tracking-tight border-b border-blue-100 pb-1">Statutory Details</div>

                                <div className="p-0 space-y-1">
                                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">HSN/SAC & Related Details</div>
                                    <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('hsnDetails')?.focus()}>
                                        <div className="w-[45%] text-[13px] text-gray-700">HSN/SAC Details</div>
                                        <div className="font-bold mr-2 text-gray-400">:</div>
                                        <input
                                            id="hsnDetails"
                                            type="text"
                                            name="hsnDetails"
                                            value={formData.hsnDetails}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus('hsnDetails')}
                                            onKeyDown={(e) => handleFieldKeyDown(e, 'hsnSource', 'invoiceMethod')}
                                            autoComplete="off"
                                            className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] outline-none rounded-sm transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('hsnSource')?.focus()}>
                                        <div className="w-[45%] text-[13px] text-gray-700">Source of details</div>
                                        <div className="font-bold mr-2 text-gray-400">:</div>
                                        <div className="flex-1 font-bold text-[13px] text-gray-600 italic">{formData.hsnSource}</div>
                                    </div>
                                    <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('hsnSac')?.focus()}>
                                        <div className="w-[45%] text-[13px] text-gray-700">HSN/SAC</div>
                                        <div className="font-bold mr-2 text-gray-400">:</div>
                                        <input
                                            id="hsnSac"
                                            type="text"
                                            name="hsnSac"
                                            value={formData.hsnSac}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus('hsnSac')}
                                            onKeyDown={(e) => handleFieldKeyDown(e, 'hsnDesc', 'hsnDetails')}
                                            autoComplete="off"
                                            className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] outline-none rounded-sm transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('hsnDesc')?.focus()}>
                                        <div className="w-[45%] text-[13px] text-gray-700">Description</div>
                                        <div className="font-bold mr-2 text-gray-400">:</div>
                                        <input
                                            id="hsnDesc"
                                            type="text"
                                            name="hsnDesc"
                                            value={formData.hsnDesc}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus('hsnDesc')}
                                            onKeyDown={(e) => handleFieldKeyDown(e, 'gstRateDetails', 'hsnSac')}
                                            autoComplete="off"
                                            className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] outline-none rounded-sm transition-all"
                                        />
                                    </div>

                                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">GST Rate & Related Details</div>

                                    <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('gstRateDetails')?.focus()}>
                                        <div className="w-[45%] text-[13px] text-gray-700">GST Rate Details</div>
                                        <div className="font-bold mr-2 text-gray-400">:</div>
                                        <input
                                            id="gstRateDetails"
                                            type="text"
                                            name="gstRateDetails"
                                            value={formData.gstRateDetails}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus('gstRateDetails')}
                                            onKeyDown={(e) => handleFieldKeyDown(e, 'gstTaxability', 'hsnDesc')}
                                            autoComplete="off"
                                            className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] outline-none rounded-sm transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center group cursor-pointer">
                                        <div className="w-[45%] text-[13px] text-gray-700">Source of details</div>
                                        <div className="font-bold mr-2 text-gray-400">:</div>
                                        <div className="flex-1 font-bold text-[13px] text-gray-600 italic">{formData.gstSource}</div>
                                    </div>
                                    <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('gstTaxability')?.focus()}>
                                        <div className="w-[45%] text-[13px] text-gray-700">Taxability Type</div>
                                        <div className="font-bold mr-2 text-gray-400">:</div>
                                        <div className="flex-1 font-bold text-[13px] text-black bg-transparent px-2 py-0.5">{formData.gstTaxability}</div>
                                    </div>
                                    <div className="flex items-center group cursor-pointer" onClick={() => document.getElementById('gstRate')?.focus()}>
                                        <div className="w-[45%] text-[13px] text-gray-700">GST Rate</div>
                                        <div className="font-bold mr-2 text-gray-400">:</div>
                                        <input
                                            id="gstRate"
                                            type="text"
                                            name="gstRate"
                                            value={formData.gstRate}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus('gstRate')}
                                            onKeyDown={(e) => handleFieldKeyDown(e, null, 'gstRateDetails')}
                                            autoComplete="off"
                                            className="w-16 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 px-2 py-0.5 font-bold text-[13px] text-center outline-none rounded-sm transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
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
            {
                showAccept && (
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
                )
            }

            {/* Quit Confirmation Box */}
            {
                showQuit && (
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
                )
            }




        </div >
    );
};

export default TallyGroupAlteration;
