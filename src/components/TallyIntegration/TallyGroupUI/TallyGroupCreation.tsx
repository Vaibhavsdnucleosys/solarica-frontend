import React, { useState, useRef, useEffect } from 'react';
import TallyHeader from './TallyHeader';


const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px]">{keyName}</span>
        <span>: {label}</span>
    </div>
);

interface Props {
    onClose: () => void;
}

const TallyGroupCreation = ({ onClose }: Props) => {
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [under, setUnder] = useState('Capital Account');
    const [subLedger, setSubLedger] = useState('No');
    const [debitCredit, setDebitCredit] = useState('No');
    const [calculation, setCalculation] = useState('No');
    const [allocationMethod, setAllocationMethod] = useState('Not Applicable');

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);

    // Refs for navigation
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const underRef = useRef<HTMLInputElement>(null);
    const subLedgerRef = useRef<HTMLDivElement>(null);
    const debitCreditRef = useRef<HTMLDivElement>(null);
    const calculationRef = useRef<HTMLDivElement>(null);
    const allocationRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || showAcceptBox) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, showAcceptBox]);

    const sidebarButtons = [
        { keyName: 'F2', label: 'Period', disabled: true },
        { keyName: 'F3', label: 'Company' },
        { keyName: '', label: 'SEPARATOR' },
        { keyName: 'F10', label: 'Other Masters' },
        { keyName: '', label: 'SPACER' },
        { keyName: 'I', label: 'More Details' },
        { keyName: '', label: 'SPACER' },
        { keyName: 'B', label: 'Get HSN/SAC Info' },
    ];

    const labelStyle = "w-[320px] text-black text-[13px] font-medium";
    const valueStyle = "font-bold text-black text-[13px] ml-2 outline-none bg-transparent";

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black text-[13px] font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>Group Creation</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden h-full">
                {/* Left Form Area */}
                <div className="w-[50%] bg-white h-full border-r border-[#ccc] p-4 pt-2 overflow-y-auto custom-scrollbar">
                    {/* Name Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={() => nameRef.current?.focus()}>
                        <label className="w-[120px] text-black text-[13px]">Name</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={nameRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, aliasRef)}
                            className="bg-[#fcfcd0] text-black font-bold text-[13px] px-1 w-[300px] outline-none border border-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                            autoFocus
                        />
                    </div>
                    {/* Alias Field */}
                    <div className="flex items-center mb-5 group cursor-pointer" onClick={() => aliasRef.current?.focus()}>
                        <label className="w-[120px] text-black text-[13px] italic">(alias)</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={aliasRef}
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, underRef)}
                            className="bg-transparent text-black italic text-[13px] px-1 w-[300px] outline-none placeholder-gray-400 focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Under Field */}
                    <div className="flex items-center mb-6 group cursor-pointer" onClick={() => underRef.current?.focus()}>
                        <label className="w-[120px] text-black text-[13px]">Under</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={underRef}
                            type="text"
                            value={under}
                            onChange={(e) => setUnder(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, subLedgerRef)}
                            className="bg-transparent text-black font-bold text-[13px] px-1 w-[300px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Separator */}
                    <div className="border-t border-[#ccc] w-full my-2 mb-3"></div>

                    {/* Sub-ledger */}
                    <div className="flex items-center mb-1 group" onClick={() => subLedgerRef.current?.focus()}>
                        <label className={labelStyle}>Group behaves like a sub-ledger</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <div
                            ref={subLedgerRef}
                            className={`${valueStyle} min-w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-dotted focus:outline-1 focus:ring-1 focus:ring-blue-400`}
                            onClick={() => setSubLedger(prev => prev === 'No' ? 'Yes' : 'No')}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    if (e.key === ' ') setSubLedger(prev => prev === 'No' ? 'Yes' : 'No');
                                    handleKeyDown(e, debitCreditRef);
                                }
                            }}
                            tabIndex={0}
                        >
                            {subLedger}
                        </div>
                    </div>

                    {/* Nett Debit/Credit */}
                    <div className="flex items-center mb-1 group" onClick={() => debitCreditRef.current?.focus()}>
                        <label className={labelStyle}>Nett Debit/Credit Balances for Reporting</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <div
                            ref={debitCreditRef}
                            className={`${valueStyle} min-w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-dotted focus:outline-1 focus:ring-1 focus:ring-blue-400`}
                            onClick={() => setDebitCredit(prev => prev === 'No' ? 'Yes' : 'No')}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    if (e.key === ' ') setDebitCredit(prev => prev === 'No' ? 'Yes' : 'No');
                                    handleKeyDown(e, calculationRef);
                                }
                            }}
                            tabIndex={0}
                        >
                            {debitCredit}
                        </div>
                    </div>

                    {/* Calculation */}
                    <div className="flex items-center group relative mb-0" onClick={() => calculationRef.current?.focus()}>
                        <label className={labelStyle}>Used for calculation (for example: taxes, discounts)</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <div
                            ref={calculationRef}
                            className={`${valueStyle} min-w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-dotted focus:outline-1 focus:ring-1 focus:ring-blue-400`}
                            onClick={() => setCalculation(prev => prev === 'No' ? 'Yes' : 'No')}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    if (e.key === ' ') setCalculation(prev => prev === 'No' ? 'Yes' : 'No');
                                    handleKeyDown(e, allocationRef);
                                }
                            }}
                            tabIndex={0}
                        >
                            {calculation}
                        </div>
                    </div>
                    <div className="pl-[20px] italic text-[11px] mb-2 text-gray-500 leading-tight">
                        (for sales invoice entries)
                    </div>

                    {/* Allocation Method */}
                    <div className="flex items-center mb-1 relative group cursor-pointer" onClick={() => allocationRef.current?.focus()}>
                        <label className={labelStyle}>Method to allocate when used in purchase invoice</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <input
                            ref={allocationRef}
                            type="text"
                            value={allocationMethod === 'Not Applicable' ? '◆ Not Applicable' : allocationMethod}
                            readOnly
                            onFocus={() => { }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setShowAcceptBox(true);
                                }
                            }}
                            className={`${valueStyle} min-w-[200px] cursor-pointer focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400`}
                        />
                    </div>
                </div>

                {/* Right Placeholder Space */}
                <div className="flex-1 bg-white h-full relative border-r border-[#ccc] bg-gray-50/10">
                    {/* Placeholder for center content if any */}
                </div>

            </div>

            {/* Footer */}
            <div className="bg-[#fcfcd0] h-[24px] flex items-center px-4 text-[12px] w-full border-t border-[#ccc] shrink-0">
                <FooterItem keyName="Q" label="Quit" onClick={() => setShowQuitBox(true)} />
                <div className="flex-1" />
                <FooterItem keyName="A" label="Accept" onClick={() => setShowAcceptBox(true)} />
                <div className="flex-1" />
                <FooterItem keyName="F12" label="Configure" />
            </div>

            {/* Accept Box Overlay */}
            {showAcceptBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAcceptBox(false)}>✕</button>
                    <div className="text-[15px] text-black font-bold mt-2">Accept ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                setShowAcceptBox(false);
                                allocationRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            allocationRef.current?.focus();
                        }}>No</span>
                    </div>
                </div>
            )}

            {/* Quit Box Overlay */}
            {showQuitBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowQuitBox(false)}>✕</button>
                    <div className="text-[15px] text-black font-bold mt-2">Quit ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowQuitBox(false);
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => setShowQuitBox(false)}>No</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TallyGroupCreation;
