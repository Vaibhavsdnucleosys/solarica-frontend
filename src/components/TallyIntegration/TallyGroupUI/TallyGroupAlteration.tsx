import React, { useState, useRef, useEffect } from 'react';

// Reusing the SidebarButton logic for consistency
// Reusing the SidebarButton logic for consistency
const SidebarButton = ({ keyName, label, fade, disabled, onClick }: { keyName: string, label: string, fade?: boolean, disabled?: boolean, onClick?: () => void }) => (
    <button
        className={`relative bg-transparent group px-1 mb-[1px] w-full text-left text-[12px] cursor-pointer flex items-center min-h-[32px] hover:bg-[#dceef5] ${fade || disabled ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={onClick}
        disabled={disabled}
    >
        <div className="flex flex-col justify-center w-full h-full pl-1 bg-gradient-to-r from-white to-[#f0f9fc] border border-[#a0cbe0] rounded-[2px] shadow-sm relative pr-3">
            {keyName && <span className={`font-bold leading-none mt-[2px] ${disabled ? 'text-gray-400' : 'text-[#1d5b6e]'}`}>{keyName}</span>}
            <span className={`leading-tight mb-[2px] ${disabled ? 'text-gray-400' : 'text-black'}`}>{label || '\u00A0'}</span>
            <div className={`absolute right-0 top-0 bottom-0 w-[14px] flex items-center justify-center bg-[#e0f3f9] border-l border-[#a0cbe0] ${disabled ? 'text-gray-400' : 'text-[#2d819b]'}`}>
                <span className="text-[10px] font-bold">‹</span>
            </div>
        </div>
    </button>
);

const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px]">{keyName}</span>
        <span>: {label}</span>
    </div>
);

interface Props {
    groupName: string;
    onClose: () => void;
}

const TallyGroupAlteration = ({ groupName, onClose }: Props) => {
    const [name, setName] = useState(groupName);
    const [alias, setAlias] = useState('');
    const [parent, setParent] = useState('Primary'); // Usually selects from a list
    const [nature, setNature] = useState('Liabilities');
    const [grossProfit, setGrossProfit] = useState('No');
    const [subLedger, setSubLedger] = useState('No');
    const [debitCredit, setDebitCredit] = useState('No');
    const [calculation, setCalculation] = useState('No');
    const [allocationMethod, setAllocationMethod] = useState('Not Applicable');
    const [allocationListOpen, setAllocationListOpen] = useState(false);
    const [showStatutory, setShowStatutory] = useState(false);
    const [hsnDetails, setHsnDetails] = useState('As per Company/Group');
    const [gstRateDetails, setGstRateDetails] = useState('As per Company/Group');
    const [hsnPopupOpen, setHsnPopupOpen] = useState(false);
    const [gstPopupOpen, setGstPopupOpen] = useState(false);
    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);
    const [showPeriodModal, setShowPeriodModal] = useState(false);
    const [periodFrom, setPeriodFrom] = useState('1-4-2025');
    const [periodTo, setPeriodTo] = useState('');
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [companyQuery, setCompanyQuery] = useState('Solarica');
    const [showOtherMastersModal, setShowOtherMastersModal] = useState(false);
    const [otherMastersQuery, setOtherMastersQuery] = useState('Groups');
    const [showMoreDetailsModal, setShowMoreDetailsModal] = useState(false);
    const [moreDetailsQuery, setMoreDetailsQuery] = useState('');
    const [showHsnInfoModal, setShowHsnInfoModal] = useState(false);
    const [showConfigureModal, setShowConfigureModal] = useState(false);
    const [configShowMore, setConfigShowMore] = useState('No');
    const [provideAliases, setProvideAliases] = useState('Yes');

    // Refs for navigation
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const grossProfitRef = useRef<HTMLDivElement>(null);
    const subLedgerRef = useRef<HTMLDivElement>(null);
    const debitCreditRef = useRef<HTMLDivElement>(null);
    const calculationRef = useRef<HTMLDivElement>(null);
    const allocationRef = useRef<HTMLInputElement>(null);
    const hsnRef = useRef<HTMLInputElement>(null);
    const gstRef = useRef<HTMLInputElement>(null);

    const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

    const updatePopupPos = (e: React.FocusEvent<HTMLInputElement>) => {
        const rect = e.target.getBoundingClientRect();
        setPopupPos({ top: rect.top, left: rect.right + 5 });
    };

    // Effect to update validation/values based on groupName (Mock data logic)
    useEffect(() => {
        setName(groupName);
        // Reset defaults
        setDebitCredit('No');
        setSubLedger('No');
        setGrossProfit('No');
        setShowStatutory(false);

        if (groupName === 'Reserves & Surplus') {
            setParent('Capital Account');
            setAlias('Retained Earnings');
            setNature('Liabilities'); // Capital Account is a liability
        } else if (groupName === 'Capital Account') {
            setParent('Primary');
            setAlias('');
            setNature('Liabilities');
        } else if (groupName === 'Current Assets') {
            setParent('Primary');
            setAlias('');
            setNature('Assets');
            setDebitCredit('Yes');
            setShowStatutory(true);
        } else if (groupName === 'Bank Accounts') {
            setParent('Current Assets');
            setAlias('');
            setNature('Assets');
            setDebitCredit('No');
            setShowStatutory(false);
        } else if (groupName === 'Cash-in-Hand') {
            setParent('Current Assets');
            setAlias('');
            setNature('Assets');
            setDebitCredit('No');
            setShowStatutory(false);
        } else if (groupName === 'Deposits (Asset)') {
            setParent('Current Assets');
            setAlias('');
            setNature('Assets');
            setDebitCredit('No');
            setShowStatutory(false);
        } else if (groupName === 'Loans & Advances (Asset)') {
            setParent('Current Assets');
            setAlias('');
            setNature('Assets');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Stock-in-Hand') {
            setParent('Current Assets');
            setAlias('');
            setNature('Assets');
            setDebitCredit('No');
            setShowStatutory(false);
        } else if (groupName === 'Sundry Debtors') {
            setParent('Current Assets');
            setAlias('');
            setNature('Assets');
            setSubLedger('Yes');
            setDebitCredit('No');
            setShowStatutory(false);
        } else if (groupName === 'Current Liabilities') {
            setParent('Primary');
            setAlias('');
            setNature('Liabilities');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Duties & Taxes') {
            setParent('Current Liabilities');
            setAlias('');
            setNature('Liabilities');
            setDebitCredit('No');
            setShowStatutory(false);
        } else if (groupName === 'Provisions') {
            setParent('Current Liabilities');
            setAlias('');
            setNature('Liabilities');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Sundry Creditors') {
            setParent('Current Liabilities');
            setAlias('');
            setNature('Liabilities');
            setSubLedger('Yes');
            setDebitCredit('No');
            setShowStatutory(false);
        } else if (groupName === 'Direct Expenses') {
            setParent('Primary');
            setAlias('Expenses (Direct)');
            setNature('Expenses');
            setGrossProfit('Yes');
            setSubLedger('No');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Direct Incomes') {
            setParent('Primary');
            setAlias('Income (Direct)');
            setNature('Income');
            setGrossProfit('Yes');
            setSubLedger('No');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Fixed Assets') {
            setParent('Primary');
            setAlias('');
            setNature('Assets');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Indirect Expenses') {
            setParent('Primary');
            setAlias('Expenses (Indirect)');
            setNature('Expenses');
            setGrossProfit('No');
            setSubLedger('No');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Indirect Incomes') {
            setParent('Primary');
            setAlias('Income (Indirect)');
            setNature('Income');
            setGrossProfit('No');
            setSubLedger('No');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Investments') {
            setParent('Primary');
            setAlias('');
            setNature('Assets');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Loans (Liability)') {
            setParent('Primary');
            setAlias('');
            setNature('Liabilities');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Bank OD A/c') {
            setParent('Loans (Liability)');
            setAlias('Bank OCC A/c');
            setNature('Liabilities');
            setDebitCredit('No');
            setShowStatutory(false);
        } else if (groupName === 'Secured Loans') {
            setParent('Loans (Liability)');
            setAlias('');
            setNature('Liabilities');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Unsecured Loans') {
            setParent('Loans (Liability)');
            setAlias('');
            setNature('Liabilities');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Misc. Expenses (ASSET)') {
            setParent('Primary');
            setAlias('');
            setNature('Assets');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Purchase Accounts') {
            setParent('Primary');
            setAlias('');
            setNature('Expenses');
            setGrossProfit('Yes');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Sales Accounts') {
            setParent('Primary');
            setAlias('');
            setNature('Income');
            setGrossProfit('Yes');
            setDebitCredit('No');
            setShowStatutory(true);
        } else if (groupName === 'Suspense A/c') {
            setParent('Primary');
            setAlias('');
            setNature('Liabilities');
            setDebitCredit('No');
            setShowStatutory(false);
        } else {
            // Default fallback
            setParent('Primary');
            setAlias('');
            setNature('Liabilities');
        }
    }, [groupName]);

    // Enter Key Handler
    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };

    // Default form styling
    const labelStyle = "w-[300px] text-[#000000] text-[13px] font-medium";
    const valueStyle = "font-bold text-black text-[13px] ml-2 outline-none bg-transparent";

    // Handle global shortcuts
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Avoid conflict if a modal is open (simple check)
            if (showPeriodModal || showCompanyModal || showOtherMastersModal || showMoreDetailsModal || showHsnInfoModal || showConfigureModal || showAcceptBox || showQuitBox) {
                return;
            }

            // Q to Quit
            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }

            // Ctrl+A to Accept
            if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
                e.preventDefault();
                setShowAcceptBox(true);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showPeriodModal, showCompanyModal, showOtherMastersModal, showMoreDetailsModal, showHsnInfoModal, showConfigureModal, showAcceptBox, showQuitBox]);

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-2.5 h-[24px] bg-[#2d819b] text-white text-[13px] font-bold select-none relative">
                <div className="flex gap-1">
                    <span>Group Alteration</span>
                    <span className="font-normal">(Secondary)</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:text-yellow-300">✕</span>
                </div>
            </div>


            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden h-full">
                {/* Left Form Area */}
                <div className="w-[60%] bg-white h-full border-r border-[#ccc] p-4 pt-2 overflow-y-auto">
                    {/* Name Field */}
                    <div className="flex items-center mb-1">
                        <label className="w-[120px] text-[#000000] text-[13px]">Name</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={nameRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, aliasRef)}
                            className="bg-transparent text-black font-bold text-[13px] px-1 w-[300px] outline-none focus:bg-[#ffe599]"
                            autoFocus
                        />
                    </div>
                    {/* Alias Field */}
                    <div className="flex items-center mb-5">
                        <label className="w-[120px] text-[#000000] text-[13px] italic">(alias)</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={aliasRef}
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, subLedgerRef)}
                            className="bg-transparent text-black italic text-[13px] px-1 w-[300px] outline-none placeholder-gray-400 focus:bg-[#ffe599]"
                        />
                    </div>

                    {/* Under Field */}
                    <div className="flex items-center mb-6">
                        <label className="w-[120px] text-[#000000] text-[13px]">Under</label>
                        <span className="font-bold mr-2">:</span>
                        <span className="font-bold text-black text-[13px]">
                            {/* Only show diamond if parent is Primary or specialized, but usually distinct. Keeping diamond for consistency with mock. */}
                            {parent === 'Primary' ? '◆ Primary' : parent}
                        </span>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-[#ccc] w-full my-2 mb-3"></div>

                    {/* Nature of Group - Only show if parent is Primary */}
                    {parent === 'Primary' && (
                        <div className="flex items-center mb-1 relative">
                            <label className={labelStyle}>Nature of Group</label>
                            <span className="font-bold mr-2">:</span>
                            <span className="font-bold text-black text-[13px] ml-2">{nature}</span>
                        </div>
                    )}

                    {/* Does it affect gross profits - Only for Expenses/Income */}
                    {(nature.includes('Expenses') || nature.includes('Income')) && (
                        <div className="flex items-center mb-1">
                            <label className={labelStyle}>Does it affect gross profits</label>
                            <span className="font-bold mr-2">:</span>
                            <div
                                ref={grossProfitRef}
                                className={`${valueStyle} w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-dotted focus:outline-1`}
                                onClick={() => setGrossProfit(prev => prev === 'No' ? 'Yes' : 'No')}
                                onKeyDown={(e) => {
                                    if (e.key === ' ' || e.key === 'Enter') {
                                        if (e.key === ' ') setGrossProfit(prev => prev === 'No' ? 'Yes' : 'No');
                                        handleKeyDown(e, subLedgerRef);
                                    }
                                }}
                                tabIndex={0}
                            >
                                {grossProfit}
                            </div>
                        </div>
                    )}

                    {/* Sub-ledger */}
                    <div className="flex items-center mb-1">
                        <label className={labelStyle}>Group behaves like a sub-ledger</label>
                        <span className="font-bold mr-2">:</span>
                        <div
                            ref={subLedgerRef}
                            className={`${valueStyle} w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-dotted focus:outline-1`}
                            onClick={() => setSubLedger(prev => prev === 'No' ? 'Yes' : 'No')}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    if (e.key === ' ') setSubLedger(prev => prev === 'No' ? 'Yes' : 'No'); // Toggle on space
                                    handleKeyDown(e, debitCreditRef);
                                }
                            }}
                            tabIndex={0}
                        >
                            {subLedger}
                        </div>
                    </div>

                    {/* Nett Debit/Credit */}
                    <div className="flex items-center mb-1">
                        <label className={labelStyle}>Nett Debit/Credit Balances for Reporting</label>
                        <span className="font-bold mr-2">:</span>
                        <div
                            ref={debitCreditRef}
                            className={`${valueStyle} w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-dotted focus:outline-1`}
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
                    <div className="flex items-center group relative mb-0">
                        <label className={labelStyle}>Used for calculation (for example: taxes, discounts)</label>
                        <span className="font-bold mr-2">:</span>
                        <div
                            ref={calculationRef}
                            className={`${valueStyle} w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-dotted focus:outline-1`}
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
                    <div className="pl-[20px] italic text-[11px] mb-2 text-black leading-tight">
                        (for sales invoice entries)
                    </div>

                    {/* Allocation Method */}
                    <div className="flex items-center mb-1 relative">
                        <label className={labelStyle}>Method to allocate when used in purchase invoice</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={allocationRef}
                            type="text"
                            value={allocationMethod === 'Not Applicable' ? '◆ Not Applicable' : allocationMethod}
                            readOnly
                            onFocus={(e) => {
                                updatePopupPos(e);
                                setAllocationListOpen(true);
                            }}
                            onBlur={() => setTimeout(() => setAllocationListOpen(false), 200)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab') {
                                    setAllocationListOpen(false);
                                    if (e.key === 'Enter') {
                                        if (!name || showStatutory) {
                                            hsnRef.current?.focus();
                                        } else {
                                            setShowAcceptBox(true);
                                        }
                                    }
                                }
                            }}
                            className={`${valueStyle} w-[200px] cursor-pointer focus:bg-[#ffe599]`}
                        />
                        {/* Dropdown removed from here, moved to global fixed section */}
                    </div>

                    {/* Statutory Details - Conditional on empty Name or specific groups */}
                    {(!name || showStatutory) && (
                        <div className="mt-4 pb-10">
                            <div className="font-bold text-[13px] text-black mb-1">Statutory Details</div>

                            {/* HSN/SAC */}
                            <div className="mb-2">
                                <div className="border-b border-black inline-block mb-1"><span className="font-bold text-[13px]">HSN/SAC & Related Details</span></div>
                                <div className="flex items-center mb-1 relative">
                                    <label className={labelStyle}>HSN/SAC Details</label>
                                    <span className="font-bold mr-2">:</span>
                                    <input
                                        ref={hsnRef}
                                        type="text"
                                        value={hsnDetails}
                                        readOnly
                                        onFocus={(e) => {
                                            updatePopupPos(e);
                                            setHsnPopupOpen(true);
                                        }}
                                        onBlur={() => setTimeout(() => setHsnPopupOpen(false), 200)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === 'Tab') {
                                                setHsnPopupOpen(false);
                                                gstRef.current?.focus();
                                            }
                                        }}
                                        className={`${valueStyle} w-[250px] cursor-pointer focus:bg-[#ffe599]`}
                                    />
                                </div>
                                <div className="flex items-center mb-1">
                                    <label className="w-[300px] text-[13px] font-medium text-gray-500">Source of details</label>
                                    <span className="font-bold mr-2 text-gray-500">:</span>
                                    <span className="text-gray-500 text-[13px] ml-2 font-bold">Not Available</span>
                                </div>
                                <div className="flex items-center mb-1">
                                    <label className="w-[300px] text-[13px] font-medium text-gray-500">HSN/SAC</label>
                                    <span className="font-bold mr-2 text-gray-500">:</span>
                                </div>
                                <div className="flex items-center mb-1">
                                    <label className="w-[300px] text-[13px] font-medium text-gray-500">Description</label>
                                    <span className="font-bold mr-2 text-gray-500">:</span>
                                </div>
                            </div>

                            {/* GST Rate */}
                            <div>
                                <div className="border-b border-black inline-block mb-1"><span className="font-bold text-[13px]">GST Rate & Related Details</span></div>
                                <div className="flex items-center mb-1 relative">
                                    <label className={labelStyle}>GST Rate Details</label>
                                    <span className="font-bold mr-2">:</span>
                                    <input
                                        ref={gstRef}
                                        type="text"
                                        value={gstRateDetails}
                                        readOnly
                                        onFocus={(e) => {
                                            updatePopupPos(e);
                                            setGstPopupOpen(true);
                                        }}
                                        onBlur={() => setTimeout(() => setGstPopupOpen(false), 200)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === 'Tab') {
                                                setGstPopupOpen(false);
                                                setShowAcceptBox(true);
                                            }
                                        }}
                                        className={`${valueStyle} w-[250px] cursor-pointer focus:bg-[#ffe599]`}
                                    />
                                </div>
                                <div className="flex items-center mb-1">
                                    <label className="w-[300px] text-[13px] font-medium text-gray-500">Source of details</label>
                                    <span className="font-bold mr-2 text-gray-500">:</span>
                                    <span className="text-gray-500 text-[13px] ml-2 font-bold">Not Available</span>
                                </div>
                                <div className="flex items-center mb-1">
                                    <label className="w-[300px] text-[13px] font-medium text-gray-500">Taxability Type</label>
                                    <span className="font-bold mr-2 text-gray-500">:</span>
                                </div>
                                <div className="flex items-center mb-1">
                                    <label className="w-[300px] text-[13px] font-medium text-gray-500">GST Rate</label>
                                    <span className="font-bold mr-2 text-gray-500">:</span>
                                    <span className={valueStyle}>0 %</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Grey Space */}
                <div className="flex-1 bg-[#cadce4] h-full relative border-r border-[#99c7d6]">
                    {/* Placeholder for grey background */}
                </div>

                {/* Sidebar - Reusing structure */}
                <div className="w-[140px] bg-[#e8f6fa] flex flex-col pb-1 h-full">
                    <SidebarButton keyName="F2" label="Period" disabled /* onClick={() => setShowPeriodModal(true)} User requested disabled */ />
                    <SidebarButton keyName="F3" label="Company" onClick={() => setShowCompanyModal(true)} />
                    <SidebarButton keyName="F4" label="" disabled />
                    <SidebarButton keyName="F5" label="" disabled />
                    <SidebarButton keyName="F6" label="" disabled />
                    <SidebarButton keyName="F7" label="" disabled />
                    <SidebarButton keyName="F8" label="" disabled />
                    <SidebarButton keyName="F9" label="" disabled />
                    <SidebarButton keyName="F10" label="Other Masters" onClick={() => setShowOtherMastersModal(true)} />

                    <div className="h-5"></div>
                    <SidebarButton keyName="I" label="More Details" onClick={() => setShowMoreDetailsModal(true)} />
                    <div className="h-2"></div>
                    <SidebarButton keyName="B" label="Get HSN/SAC Info" onClick={() => setShowHsnInfoModal(true)} />
                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#f3f8fa] h-[30px] flex items-center px-2.5 text-[12px] w-full absolute bottom-0 border-t border-[#ccc]">
                <FooterItem keyName="Q" label="Quit" onClick={() => setShowQuitBox(true)} />
                <div className="flex-1"></div>
                <FooterItem keyName="A" label="Accept" onClick={() => setShowAcceptBox(true)} />
                <div className="flex-1"></div>
                <FooterItem keyName="D" label="Delete" />
                <div className="flex-1"></div>
                <div className="flex-1"></div>
                <FooterItem keyName="F12" label="Configure" onClick={() => setShowConfigureModal(true)} />
            </div>

            {/* Accept Box Overlay */}
            {showAcceptBox && (
                <div className="absolute bottom-[30px] right-[140px] z-50 bg-white border border-black shadow-lg p-4 w-[120px] h-[80px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-500 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAcceptBox(false)}>✕</button>
                    <div className="text-[13px] text-black">Accept ?</div>
                    <div className="flex gap-2 text-[13px] font-bold text-black" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose(); // Go to main page
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                setShowAcceptBox(false);
                                nameRef.current?.focus(); // Go to Name field
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="font-normal text-[11px] pt-1">or</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            nameRef.current?.focus();
                        }}>No</span>
                    </div>
                </div>
            )}

            {/* Quit Box Overlay */}
            {showQuitBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-black shadow-lg p-4 w-[120px] h-[80px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-500 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowQuitBox(false)}>✕</button>
                    <div className="text-[13px] text-black">Quit ?</div>
                    <div className="flex gap-2 text-[13px] font-bold text-black" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowQuitBox(false);
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="font-normal text-[11px] pt-1">or</span>
                        <span className="cursor-pointer hover:underline" onClick={() => setShowQuitBox(false)}>No</span>
                    </div>
                </div>
            )}

            {/* Change Period Modal */}
            {showPeriodModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10" onClick={() => setShowPeriodModal(false)}>
                    <div className="bg-white p-4 shadow-2xl border border-gray-400 w-[250px] relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-1 right-1 text-gray-400 hover:text-red-500 font-bold text-[14px] leading-none" onClick={() => setShowPeriodModal(false)}>✕</button>
                        <div className="text-center font-bold text-[13px] underline mb-4">Change Period</div>
                        <div className="flex items-center mb-2">
                            <label className="text-[13px] font-bold w-[60px]">From</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                type="text"
                                value={periodFrom}
                                onChange={(e) => setPeriodFrom(e.target.value)}
                                className="w-[100px] bg-[#ffe599] font-bold text-[13px] px-1 outline-none border border-transparent focus:border-blue-500"
                                autoFocus
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="text-[13px] font-bold w-[60px]">To</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                type="text"
                                value={periodTo}
                                onChange={(e) => setPeriodTo(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setShowPeriodModal(false);
                                    if (e.key === 'Escape') setShowPeriodModal(false);
                                }}
                                className="w-[100px] bg-white font-bold text-[13px] px-1 outline-none border border-gray-300 focus:bg-[#ffe599]"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Change Company Modal (F3) */}
            {showCompanyModal && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[60px] bg-black/20" onClick={() => setShowCompanyModal(false)}>
                    <div className="flex flex-col w-[500px] shadow-2xl border border-[#2d819b] font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowCompanyModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] z-50 leading-none">✕</button>
                        <div className="bg-white p-3 pt-2 text-center border-b border-gray-300">
                            <div className="font-bold text-[13px] text-black mb-1 underline decoration-1 underline-offset-2">Change Company</div>
                            <input type="text" value={companyQuery} onChange={(e) => setCompanyQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') setShowCompanyModal(false);
                                }}
                                className="w-full bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-gray-400" autoFocus />
                        </div>
                        <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px]">List of Companies</div>
                        <div className="bg-[#e8f6fa] h-[400px] relative overflow-y-auto">
                            <div className="absolute right-0 top-0 p-2 text-right text-[13px] text-black font-bold z-10 flex flex-col gap-1 items-end">
                                <div className="cursor-pointer hover:bg-[#dceef5] px-2 w-fit">Create Company</div>
                                <div className="cursor-pointer hover:bg-[#dceef5] px-2 w-fit">Select Company</div>
                                <div className="cursor-pointer hover:bg-[#dceef5] px-2 w-fit">Shut Company</div>
                            </div>
                            <div className="mt-[70px]">
                                <div className="flex justify-between px-4 py-[2px] bg-[#feba35] text-black font-bold cursor-pointer hover:bg-[#feba35] border-b border-transparent">
                                    <span>Solarica</span><span>(100000)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Other Masters Modal (F10) */}
            {showOtherMastersModal && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[40px] bg-black/20" onClick={() => setShowOtherMastersModal(false)}>
                    <div className="flex flex-col w-[350px] shadow-2xl border border-[#2d819b] font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowOtherMastersModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] z-50 leading-none">✕</button>
                        <div className="bg-white p-3 pt-2 text-center border-b border-gray-300">
                            <div className="font-bold text-[13px] text-black mb-1 underline decoration-1 underline-offset-2">Select Other Masters</div>
                            <input type="text" value={otherMastersQuery} onChange={(e) => setOtherMastersQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') setShowOtherMastersModal(false);
                                }}
                                className="w-full bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-gray-400" autoFocus />
                        </div>
                        <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px]">List of Masters</div>
                        <div className="bg-[#e8f6fa] h-[500px] relative overflow-y-auto text-[13px] text-black font-bold">
                            <div className="text-right p-2 border-b border-[#bfdcf0] mb-1 flex flex-col items-end gap-1">
                                <div className="cursor-pointer hover:underline text-[12px]">Change Company</div>
                                <div className="cursor-pointer hover:underline text-[12px]">Show Inactive</div>
                            </div>
                            <div className="px-2 py-1 font-bold text-[#1d5b6e] mt-1">Accounting Masters</div>
                            <div className="pl-6 py-[1px] cursor-pointer bg-[#feba35] hover:bg-[#feba35] w-full block">Groups</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Ledgers</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Voucher Types</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Currencies</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Budgets</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Scenarios</div>
                            <div className="px-2 py-1 font-bold text-[#1d5b6e] mt-2">Inventory Masters</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Stock Groups</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Stock Items</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Stock Categories</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Units</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Godowns</div>
                            <div className="px-2 py-1 font-bold text-[#1d5b6e] mt-2">Payroll Masters</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Employee Categories</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Employee Groups</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Employees</div>
                            <div className="pl-6 py-[1px] cursor-pointer hover:bg-[#dceef5]">Pay Heads</div>
                        </div>
                    </div>
                </div>
            )}

            {/* More Details Modal (I) */}
            {showMoreDetailsModal && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[60px] bg-black/20" onClick={() => setShowMoreDetailsModal(false)}>
                    <div className="flex flex-col w-[550px] shadow-2xl border border-[#2d819b] font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowMoreDetailsModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] z-50 leading-none">✕</button>

                        {/* Header */}
                        <div className="bg-white p-3 pt-2 border-b border-gray-300">
                            <div className="text-center font-bold text-[13px] text-black mb-4 underline decoration-1 underline-offset-2">More Details</div>

                            <div className="flex items-center mb-1 pl-4">
                                <label className="text-[13px] text-black w-[50px]">Under</label>
                                <span className="font-bold text-black mr-2">:</span>
                                <span className="text-[13px] font-bold text-black">♦ Primary</span>
                            </div>

                            <div className="flex items-center pl-4">
                                <label className="text-[13px] text-black w-[50px]">Add</label>
                                <span className="font-bold text-black mr-2">:</span>
                                <input
                                    type="text"
                                    value={moreDetailsQuery}
                                    onChange={(e) => setMoreDetailsQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') setShowMoreDetailsModal(false);
                                    }}
                                    className="w-[300px] bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-gray-400"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* List Header */}
                        <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px]">List of Group Details</div>

                        {/* List Body */}
                        <div className="bg-[#e8f6fa] h-[300px] relative overflow-y-auto text-[13px] text-black">
                            <div className="absolute right-0 top-0 p-2 text-right text-[12px] text-black z-10 font-normal cursor-pointer hover:underline">
                                Show More
                            </div>

                            <div className="mt-6">
                                <div className="px-2 font-bold border-b border-gray-400 mb-1 mx-2">General Details</div>

                                <div className="flex justify-between px-4 py-[2px] bg-[#feba35] cursor-pointer hover:bg-[#ffe599]">
                                    <span className="font-normal text-black">Name and Alias</span>
                                    <span className="italic text-black">Branch / Divisions</span>
                                </div>
                                <div className="flex justify-between px-4 py-[2px] cursor-pointer hover:bg-[#dceef5]">
                                    <span className="font-normal text-black">Group behaves like a Sub-ledger</span>
                                    <span className="italic text-black">No</span>
                                </div>
                                <div className="flex justify-between px-4 py-[2px] cursor-pointer hover:bg-[#dceef5]">
                                    <span className="font-normal text-black">Nett Credit/Debit Balances for Reporting</span>
                                    <span className="italic text-black">No</span>
                                </div>
                                <div className="flex justify-between px-4 py-[2px] cursor-pointer hover:bg-[#dceef5]">
                                    <span className="font-normal text-black">Nature of Group</span>
                                    <span className="italic text-black">Liabilities</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Get HSN/SAC Info Modal (B) - Placeholder */}
            {showHsnInfoModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-transparent" onClick={() => setShowHsnInfoModal(false)}>
                    <div className="bg-white p-6 shadow-[0_0_20px_rgba(0,0,0,0.2)] border border-[#888] w-[400px] relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowHsnInfoModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none">✕</button>
                        <div className="text-center font-bold text-[13px] underline decoration-1 underline-offset-2 mb-6 text-black">HSN/SAC Info</div>
                        <div className="text-[13px] text-center italic text-gray-500">HSN/SAC Information would appear here.</div>
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => setShowHsnInfoModal(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape' || e.key === 'Enter') setShowHsnInfoModal(false);
                                }}
                                autoFocus
                                className="px-4 py-1 bg-[#2d819b] text-white font-bold text-[12px]"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Fixed Position Popups */}
            {allocationListOpen && (
                <div
                    className="fixed w-[200px] bg-white border border-[#2d819b] shadow-xl z-50 flex flex-col font-sans"
                    style={{ top: popupPos.top, left: popupPos.left }}
                >
                    <div className="bg-[#2d819b] text-white text-[12px] font-bold px-2 py-1 flex justify-between items-center">
                        <span className="flex-1 text-center">List of Methods</span>
                        <button className="text-white hover:bg-red-500 px-1 leading-none h-full" onClick={() => setAllocationListOpen(false)}>✕</button>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                        {['Not Applicable', 'Appropriate by Qty', 'Appropriate by Value'].map((opt) => (
                            <div
                                key={opt}
                                className={`px-2 py-[2px] text-[13px] cursor-pointer hover:bg-[#ffe599] ${allocationMethod === opt ? 'bg-[#fdd835] font-bold' : 'text-black'}`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setAllocationMethod(opt);
                                    setAllocationListOpen(false);
                                    if (!name || showStatutory) {
                                        hsnRef.current?.focus();
                                    } else {
                                        setShowAcceptBox(true);
                                    }
                                }}
                            >
                                {opt === 'Not Applicable' ? '◆ Not Applicable' : opt}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {hsnPopupOpen && (
                <div
                    className="fixed w-[220px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-50 flex flex-col font-sans"
                    style={{ top: popupPos.top, left: popupPos.left }}
                >
                    <div className="bg-[#276e98] text-white text-[12px] font-bold px-2 py-1 flex justify-between items-center">
                        <span>List of Actions</span>
                        <button className="text-white hover:bg-red-500 px-1 leading-none h-full" onClick={() => setHsnPopupOpen(false)}>✕</button>
                    </div>
                    <div className="text-right text-[11px] px-2 italic text-gray-600 border-b border-white">Show More</div>
                    <div className="max-h-[200px] overflow-y-auto bg-[#dcecf5]">
                        {['As per Company/Group', 'Specify Details Here', 'Use GST Classification'].map((opt) => (
                            <div
                                key={opt}
                                className={`px-2 py-[2px] text-[13px] cursor-pointer hover:bg-[#ffe599] ${hsnDetails === opt ? 'bg-[#fdd835] font-bold' : 'text-black'}`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setHsnDetails(opt);
                                    setHsnPopupOpen(false);
                                    gstRef.current?.focus();
                                }}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {gstPopupOpen && (
                <div
                    className="fixed w-[220px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-50 flex flex-col font-sans"
                    style={{ top: popupPos.top, left: popupPos.left }}
                >
                    <div className="bg-[#276e98] text-white text-[12px] font-bold px-2 py-1 flex justify-between items-center">
                        <span>List of Actions</span>
                        <button className="text-white hover:bg-red-500 px-1 leading-none h-full" onClick={() => setGstPopupOpen(false)}>✕</button>
                    </div>
                    <div className="text-right text-[11px] px-2 italic text-gray-600 border-b border-white">Show More</div>
                    <div className="max-h-[200px] overflow-y-auto bg-[#dcecf5]">
                        {['As per Company/Group', 'Specify Details Here', 'Specify Slab-Based Rates', 'Use GST Classification'].map((opt) => (
                            <div
                                key={opt}
                                className={`px-2 py-[2px] text-[13px] cursor-pointer hover:bg-[#ffe599] ${gstRateDetails === opt ? 'bg-[#fdd835] font-bold' : 'text-black'}`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setGstRateDetails(opt);
                                    setGstPopupOpen(false);
                                    setShowAcceptBox(true);
                                }}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* F12 Configuration Modal */}
            {showConfigureModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-transparent" onClick={() => setShowConfigureModal(false)}>
                    <div className="bg-white p-6 pt-4 border border-[#888] w-[600px] shadow-[0_0_20px_rgba(0,0,0,0.2)] font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowConfigureModal(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none"
                        >
                            ✕
                        </button>

                        <div className="font-bold text-[14px] text-black mb-1">Configuration</div>
                        <div className="border-b border-gray-300 mb-2"></div>

                        <div className="mb-4 flex items-center">
                            <i className="text-[13px] text-black mr-4 w-[250px]">Show more configurations</i>
                            <span className="font-bold text-black mr-4">:</span>
                            <span
                                className="font-bold text-black cursor-pointer"
                                onClick={() => setConfigShowMore(prev => prev === 'No' ? 'Yes' : 'No')}
                            >
                                {configShowMore}
                            </span>
                        </div>

                        <div className="border-b border-gray-300 mb-2"></div>

                        {/* General Details */}
                        <div className="mb-2">
                            <div className="font-bold text-[13px] text-black mb-1">General Details</div>
                            <div className="flex items-center mb-1">
                                <label className="text-[13px] text-black w-[350px]">Provide aliases for Name</label>
                                <span className="font-bold text-black mr-4">:</span>
                                <input
                                    type="text"
                                    value={provideAliases}
                                    onChange={(e) => setProvideAliases(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') setShowConfigureModal(false);
                                        if (e.key === 'Enter') setShowConfigureModal(false);
                                    }}
                                    className="w-[50px] bg-[#ffe599] font-bold text-[13px] px-1 outline-none text-black selection:bg-blue-300"
                                />
                            </div>
                            <div className="flex items-center mb-1">
                                <label className="text-[13px] text-black w-[350px]">Provide language aliases for Name</label>
                                <span className="font-bold text-black mr-4">:</span>
                                <span className="font-bold text-[13px] text-black">No</span>
                            </div>
                        </div>

                        {/* Statutory Details */}
                        <div className="mt-4">
                            <div className="font-bold text-[13px] text-black mb-1">Statutory Details</div>
                            <div className="flex items-center mb-1">
                                <label className="text-[13px] text-black w-[350px]">Provide GST Details</label>
                                <span className="font-bold text-black mr-4">:</span>
                                <span className="font-bold text-[13px] text-black">Yes</span>
                            </div>
                            <div className="flex items-center mb-1 pl-4">
                                <label className="text-[13px] text-black w-[334px]">Provide HSN/SAC details</label>
                                <span className="font-bold text-black mr-4">:</span>
                                <span className="font-bold text-[13px] text-black">Yes</span>
                            </div>
                            <div className="flex items-center mb-1 pl-8">
                                <label className="text-[13px] text-black w-[318px]">Provide HSN/SAC description</label>
                                <span className="font-bold text-black mr-4">:</span>
                                <span className="font-bold text-[13px] text-black">Yes</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <label className="text-[13px] text-black w-[350px]">Select Nature of Transaction</label>
                                <span className="font-bold text-black mr-4">:</span>
                                <span className="font-bold text-[13px] text-black">No</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <label className="text-[13px] text-black w-[350px]">Provide breakup of Tax Rate</label>
                                <span className="font-bold text-black mr-4">:</span>
                                <span className="font-bold text-[13px] text-black">No</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <label className="text-[13px] text-black w-[350px]">Provide Cess Rate details</label>
                                <span className="font-bold text-black mr-4">:</span>
                                <span className="font-bold text-[13px] text-black">No</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <label className="text-[13px] text-black w-[350px]">Enable Reverse Charge calculation</label>
                                <span className="font-bold text-black mr-4">:</span>
                                <span className="font-bold text-[13px] text-black">No</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <label className="text-[13px] text-black w-[350px]">Eligible for Input Tax Credit</label>
                                <span className="font-bold text-black mr-4">:</span>
                                <span className="font-bold text-[13px] text-black">No</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TallyGroupAlteration;
