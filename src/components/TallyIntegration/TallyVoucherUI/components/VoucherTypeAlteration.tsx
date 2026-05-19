import React, { useState, useEffect } from 'react';
import TallyHeader from '../../TallyGroupUI/TallyHeader';

interface VoucherTypeAlterationProps {
    onClose: () => void;
    voucherName: string;
}

const VoucherTypeAlteration: React.FC<VoucherTypeAlterationProps> = ({ onClose, voucherName }) => {
    // State for all fields
    const [formData, setFormData] = useState({
        name: voucherName,
        alias: '',
        typeOfVoucher: voucherName,
        abbreviation: '',
        activate: 'Yes',
        methodOfNumbering: 'Automatic',
        numberingBehaviour: 'Retain Original Voucher No.',
        setAlterNumbering: 'No',
        showUnused: 'Yes',
        useEffectDates: 'No',
        allowZeroValued: 'No',
        makeOptional: 'No',
        allowNarration: 'Yes',
        provideNarrations: 'No',
        enableDefaultAllocation: 'No',
        whatsappVoucher: 'No',
        printVoucher: 'No',
        printFormalReceipt: 'No',
        defaultJurisdiction: '',
        defaultTitle: '',
        trackAdditionalCosts: 'No',
        setAlterDeclaration: 'No',
        useForJobWork: 'No',
        useForPOSInvoicing: 'No',
        defaultBank: 'Not Applicable',
        useAsManufacturingJournal: 'No'
    });

    const [activeField, setActiveField] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);

    // Reset state when voucherName changes
    useEffect(() => {
        let abbr = 'Attd';
        let actv = 'Yes';
        if (voucherName === 'Contra') abbr = 'Ctra';
        if (voucherName === 'Credit Note') abbr = 'C/Note';
        if (voucherName === 'Debit Note') abbr = 'D/Note';
        if (voucherName === 'Delivery Note') {
            abbr = 'Dely Note';
            actv = 'No';
        }
        if (voucherName === 'Job Work In Order') abbr = 'Job Wrk In Ordr';
        if (voucherName === 'Job Work Out Order') abbr = 'Job Wrk Out Ordr';
        if (voucherName === 'Journal') abbr = 'Jrnl';
        if (voucherName === 'Material In') abbr = 'Mat In';
        if (voucherName === 'Material Out') abbr = 'Mat Out';
        if (voucherName === 'Memorandum') {
            abbr = 'Memo';
            actv = 'No';
        }
        if (voucherName === 'Payment') abbr = 'Pymt';
        if (voucherName === 'Payroll') abbr = 'Pyrl';
        if (voucherName === 'Physical Stock') abbr = 'Phy Stk';
        if (voucherName === 'Purchase') abbr = 'Purc';
        if (voucherName === 'Purchase Order') {
            abbr = 'Purc Order';
            actv = 'No';
        }
        if (voucherName === 'Receipt') abbr = 'Rcpt';
        if (voucherName === 'Receipt Note') {
            abbr = 'Rcpt Note';
            actv = 'No';
        }
        if (voucherName === 'Rejections In') {
            abbr = 'Rej In';
            actv = 'No';
        }
        if (voucherName === 'Rejections Out') {
            abbr = 'Rej Out';
            actv = 'No';
        }
        if (voucherName === 'Reversing Journal') {
            abbr = 'Rev Jrnl';
            actv = 'No';
        }
        if (voucherName === 'Sales') abbr = 'Sale';
        if (voucherName === 'Sales Order') {
            abbr = 'Sales Ordr';
            actv = 'No';
        }
        if (voucherName === 'Stock Journal') abbr = 'Stk Jrnl';

        setFormData({
            name: voucherName,
            alias: '',
            typeOfVoucher: voucherName,
            abbreviation: abbr,
            activate: actv,
            methodOfNumbering: 'Automatic',
            numberingBehaviour: 'Retain Original Voucher No.',
            setAlterNumbering: 'No',
            showUnused: 'Yes',
            useEffectDates: 'No',
            allowZeroValued: 'No',
            makeOptional: 'No',
            allowNarration: 'Yes',
            provideNarrations: 'No',
            enableDefaultAllocation: 'No',
            whatsappVoucher: 'No',
            printVoucher: 'No',
            printFormalReceipt: 'No',
            defaultJurisdiction: '',
            defaultTitle: '',
            trackAdditionalCosts: 'No',
            setAlterDeclaration: 'No',
            useForJobWork: 'No',
            useForPOSInvoicing: 'No',
            defaultBank: 'Not Applicable',
            useAsManufacturingJournal: 'No'
        });
        setIsDirty(false);
        setActiveField(null);
    }, [voucherName]);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || isDirty) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, isDirty]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSelectOption = (value: string) => {
        if (activeField) {
            handleChange(activeField, value);
            setActiveField(null);
        }
    };

    const isContra = voucherName === 'Contra';
    const isCreditNote = voucherName === 'Credit Note';
    const isDebitNote = voucherName === 'Debit Note';
    const isDeliveryNote = voucherName === 'Delivery Note';
    const isJobWorkInOrder = voucherName === 'Job Work In Order';
    const isJobWorkOutOrder = voucherName === 'Job Work Out Order';
    const isJournal = voucherName === 'Journal';
    const isMaterialIn = voucherName === 'Material In';
    const isMaterialOut = voucherName === 'Material Out';
    const isMemorandum = voucherName === 'Memorandum';
    const isPayment = voucherName === 'Payment';
    const isPayroll = voucherName === 'Payroll';
    const isPhysicalStock = voucherName === 'Physical Stock';
    const isPurchase = voucherName === 'Purchase';
    const isPurchaseOrder = voucherName === 'Purchase Order';
    const isReceipt = voucherName === 'Receipt';
    const isReceiptNote = voucherName === 'Receipt Note';
    const isRejectionsIn = voucherName === 'Rejections In';
    const isRejectionsOut = voucherName === 'Rejections Out';
    const isReversingJournal = voucherName === 'Reversing Journal';
    const isSales = voucherName === 'Sales';
    const isSalesOrder = voucherName === 'Sales Order';
    const isStockJournal = voucherName === 'Stock Journal';

    // Dropdown Data
    const methodsOfNumbering = [
        "Automatic",
        "Automatic (Manual Override)",
        "Manual",
        "Multi-user Auto",
        "None"
    ];

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>Voucher Type Alteration</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2 uppercase tracking-wider">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            <div className="flex-1 w-full bg-white text-black font-sans flex flex-col text-[16px] font-bold leading-tight select-none overflow-hidden"
                onClick={() => setActiveField(null)}>
                {/* clear active field on clicking outside, stopPropagation on inputs handled below */}

                {/* Main Content Form */}
                <div className="flex-1 w-full bg-white flex flex-col p-1.5 overflow-y-auto relative" style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
                    {/* relative for dropdown positioning if needed, but we use fixed/absolute right side panel */}

                    {/* Name and Alias Section */}
                    <div className="flex flex-col gap-1 mb-4">
                        <div className="flex items-center">
                            <span className="w-24 text-gray-700 italic">Name</span>
                            <span className="mr-2">:</span>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onFocus={() => setActiveField('name')}
                                className="bg-[#ffde70] border border-gray-400 px-1 w-64 outline-none font-bold text-black focus:bg-[#ffde70]"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="w-24 text-gray-700 italic">(alias)</span>
                            <span className="mr-2">:</span>
                            <input
                                type="text"
                                value={formData.alias}
                                onChange={(e) => handleChange('alias', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onFocus={() => setActiveField('alias')}
                                className="border-b border-transparent focus:border-gray-400 w-64 outline-none bg-transparent focus:bg-[#ffde70] px-1"
                            />
                        </div>
                    </div>

                    {/* 3-Column Layout */}
                    <div className="flex flex-1 border-t border-gray-300 relative">
                        {/* Left Column: General */}
                        <div className="flex-1 border-r border-gray-300 pt-2 pr-2">
                            <h3 className="text-center underline underline-offset-2 mb-4 text-[#2b5c85]">General</h3>

                            <div className="space-y-0.5" onClick={(e) => e.stopPropagation()}>
                                <EditableRow label="Select type of voucher" value={formData.typeOfVoucher} onChange={(v) => handleChange('typeOfVoucher', v)} onFocus={() => setActiveField('typeOfVoucher')} boldValue />
                                <EditableRow label="Abbreviation" value={formData.abbreviation} onChange={(v) => handleChange('abbreviation', v)} onFocus={() => setActiveField('abbreviation')} />
                                <EditableRow label="Activate this Voucher Type" value={formData.activate} onChange={(v) => handleChange('activate', v)} onFocus={() => setActiveField('activate')} boldValue />
                                <EditableRow label="Method of Voucher Numbering" value={formData.methodOfNumbering} onChange={(v) => handleChange('methodOfNumbering', v)} onFocus={() => setActiveField('methodOfNumbering')} boldValue />
                                <div className="pl-4">
                                    <EditableRow label="Numbering behaviour on insertion/delete" value={formData.numberingBehaviour} onChange={(v) => handleChange('numberingBehaviour', v)} onFocus={() => setActiveField('numberingBehaviour')} boldValue />
                                </div>
                                <EditableRow label="Set/Alter additional numbering details" value={formData.setAlterNumbering} onChange={(v) => handleChange('setAlterNumbering', v)} onFocus={() => setActiveField('setAlterNumbering')} boldValue />
                                <EditableRow label="Show unused vch nos. in transactions for Retain Original Voucher No. behaviour" value={formData.showUnused} onChange={(v) => handleChange('showUnused', v)} onFocus={() => setActiveField('showUnused')} boldValue />
                                <div className="h-px bg-gray-200 my-1 mx-2"></div>
                                <EditableRow label="Use effective dates for vouchers" value={formData.useEffectDates} onChange={(v) => handleChange('useEffectDates', v)} onFocus={() => setActiveField('useEffectDates')} boldValue />
                                <EditableRow label="Allow zero-valued transactions" value={formData.allowZeroValued} onChange={(v) => handleChange('allowZeroValued', v)} onFocus={() => setActiveField('allowZeroValued')} boldValue />
                                <EditableRow label="Make this voucher type as 'Optional' by default" value={formData.makeOptional} onChange={(v) => handleChange('makeOptional', v)} onFocus={() => setActiveField('makeOptional')} boldValue />
                                <EditableRow label="Allow narration in voucher" value={formData.allowNarration} onChange={(v) => handleChange('allowNarration', v)} onFocus={() => setActiveField('allowNarration')} boldValue />
                                {(!isJobWorkInOrder && !isJobWorkOutOrder && !isMaterialIn && !isMaterialOut && !isPayroll && !isPhysicalStock && !isPurchaseOrder && !isReceiptNote && !isRejectionsIn && !isRejectionsOut && !isSalesOrder && !isStockJournal) && (
                                    <EditableRow label="Provide narrations for each ledger in voucher" value={formData.provideNarrations} onChange={(v) => handleChange('provideNarrations', v)} onFocus={() => setActiveField('provideNarrations')} boldValue />
                                )}

                                {/* Logic for additional fields especially for Debit Note */}
                                {(isContra || isCreditNote || isDebitNote || isDeliveryNote || isJobWorkInOrder || isJobWorkOutOrder || isJournal || isMaterialIn || isMaterialOut || isMemorandum || isPayment || isPayroll || isPhysicalStock || isPurchase || isPurchaseOrder || isReceipt || isReceiptNote || isRejectionsIn || isRejectionsOut || isReversingJournal || isSales || isSalesOrder || isStockJournal) ? (
                                    <>
                                        <div className={`
                                        ${(isJobWorkInOrder || isJobWorkOutOrder) ? 'h-[120px]' : ''}
                                        ${(isPayroll || isRejectionsIn) ? 'h-[150px]' : ''}
                                        ${(isMaterialIn || isMaterialOut || isPurchaseOrder || isReceiptNote || isRejectionsOut || isSalesOrder || isStockJournal) ? 'h-[100px]' : ''}
                                        ${(isSales) ? 'h-[60px]' : ''}
                                        ${(!isJobWorkInOrder && !isJobWorkOutOrder && !isPayroll && !isMaterialIn && !isMaterialOut && !isPurchaseOrder && !isReceiptNote && !isRejectionsIn && !isRejectionsOut && !isSalesOrder && !isStockJournal && !isSales) ? 'h-8' : ''}
                                    `}></div>

                                        {(isMaterialIn || isMaterialOut) && (
                                            <>
                                                <EditableRow label="Use for job work" value={formData.useForJobWork} onChange={(v) => handleChange('useForJobWork', v)} onFocus={() => setActiveField('useForJobWork')} boldValue />
                                                <div className="h-8"></div>
                                            </>
                                        )}

                                        {isStockJournal && (
                                            <EditableRow label="Use as a Manufacturing Journal" value={formData.useAsManufacturingJournal} onChange={(v) => handleChange('useAsManufacturingJournal', v)} onFocus={() => setActiveField('useAsManufacturingJournal')} boldValue />
                                        )}

                                        {(isDebitNote || isJournal || isMemorandum || isPayment || isPurchase || isPhysicalStock || isRejectionsOut || isReversingJournal || isStockJournal) && (
                                            <EditableRow label="Track Additional Costs for Purchases" value={formData.trackAdditionalCosts} onChange={(v) => handleChange('trackAdditionalCosts', v)} onFocus={() => setActiveField('trackAdditionalCosts')} boldValue />
                                        )}
                                        {(isJournal || isMemorandum || isPhysicalStock || isReversingJournal) && <div className="h-[60px]"></div>}
                                        {(isContra || isDebitNote || isDeliveryNote || isPayment || isPurchase || isPurchaseOrder || isReceipt || isReceiptNote || isSales || isSalesOrder) && (
                                            <EditableRow label="Enable default accounting allocations" value={formData.enableDefaultAllocation} onChange={(v) => handleChange('enableDefaultAllocation', v)} onFocus={() => setActiveField('enableDefaultAllocation')} boldValue />
                                        )}
                                        <EditableRow label="WhatsApp voucher after saving" value={formData.whatsappVoucher} onChange={(v) => handleChange('whatsappVoucher', v)} onFocus={() => setActiveField('whatsappVoucher')} boldValue />
                                    </>
                                ) : (
                                    <>
                                        <div className="h-8"></div>
                                        <EditableRow label="WhatsApp voucher after saving" value={formData.whatsappVoucher} onChange={(v) => handleChange('whatsappVoucher', v)} onFocus={() => setActiveField('whatsappVoucher')} boldValue />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Middle Column: Printing */}
                        <div className="w-1/4 border-r border-gray-300 pt-2 px-2">
                            <h3 className="text-center underline underline-offset-2 mb-4 text-[#2b5c85]">Printing</h3>
                            <div className="space-y-0.5" onClick={(e) => e.stopPropagation()}>
                                <EditableRow label="Print voucher after saving" value={formData.printVoucher} onChange={(v) => handleChange('printVoucher', v)} onFocus={() => setActiveField('printVoucher')} boldValue />
                                {isReceipt && (
                                    <>
                                        <div className="h-8"></div>
                                        <EditableRow label="Print formal receipt after saving" value={formData.printFormalReceipt} onChange={(v) => handleChange('printFormalReceipt', v)} onFocus={() => setActiveField('printFormalReceipt')} />
                                    </>
                                )}
                                {isCreditNote && (
                                    <>
                                        <EditableRow label="Default jurisdiction" value={formData.defaultJurisdiction} onChange={(v) => handleChange('defaultJurisdiction', v)} onFocus={() => setActiveField('defaultJurisdiction')} />
                                        <div className="h-8"></div>
                                        <EditableRow label="Default title to print" value={formData.defaultTitle} onChange={(v) => handleChange('defaultTitle', v)} onFocus={() => setActiveField('defaultTitle')} />
                                    </>
                                )}
                                {isDebitNote && (
                                    <>
                                        <div className="h-[52px]"></div>
                                        <EditableRow label="Default title to print" value={formData.defaultTitle} onChange={(v) => handleChange('defaultTitle', v)} onFocus={() => setActiveField('defaultTitle')} />
                                    </>
                                )}
                                {isDeliveryNote && (
                                    <>
                                        <EditableRow label="Default jurisdiction" value={formData.defaultJurisdiction} onChange={(v) => handleChange('defaultJurisdiction', v)} onFocus={() => setActiveField('defaultJurisdiction')} />
                                        <div className="h-8"></div>
                                        <EditableRow label="Default title to print" value={formData.defaultTitle} onChange={(v) => handleChange('defaultTitle', v)} onFocus={() => setActiveField('defaultTitle')} />
                                    </>
                                )}
                                {isJobWorkInOrder && (
                                    <>
                                        <div className="h-[52px]"></div>
                                        <EditableRow label="Default title to print" value={formData.defaultTitle} onChange={(v) => handleChange('defaultTitle', v)} onFocus={() => setActiveField('defaultTitle')} />
                                        <div className="h-[52px]"></div>
                                        <EditableRow label="Set/alter declaration" value={formData.setAlterDeclaration} onChange={(v) => handleChange('setAlterDeclaration', v)} onFocus={() => setActiveField('setAlterDeclaration')} />
                                    </>
                                )}
                                {isJobWorkOutOrder && (
                                    <>
                                        <div className="flex flex-col">
                                            <EditableRow label="Default jurisdiction" value={formData.defaultJurisdiction} onChange={(v) => handleChange('defaultJurisdiction', v)} onFocus={() => setActiveField('defaultJurisdiction')} />
                                            <div className="h-8"></div>
                                            <EditableRow label="Default title to print" value={formData.defaultTitle} onChange={(v) => handleChange('defaultTitle', v)} onFocus={() => setActiveField('defaultTitle')} />
                                            <div className="h-[52px]"></div>
                                            <EditableRow label="Set/alter declaration" value={formData.setAlterDeclaration} onChange={(v) => handleChange('setAlterDeclaration', v)} onFocus={() => setActiveField('setAlterDeclaration')} />
                                        </div>
                                    </>
                                )}
                                {isMaterialOut && (
                                    <EditableRow label="Default jurisdiction" value={formData.defaultJurisdiction} onChange={(v) => handleChange('defaultJurisdiction', v)} onFocus={() => setActiveField('defaultJurisdiction')} />
                                )}
                                {isPurchaseOrder && (
                                    <>
                                        <EditableRow label="Default jurisdiction" value={formData.defaultJurisdiction} onChange={(v) => handleChange('defaultJurisdiction', v)} onFocus={() => setActiveField('defaultJurisdiction')} />
                                        <div className="h-[60px]"></div>
                                        <EditableRow label="Set/alter declaration" value={formData.setAlterDeclaration} onChange={(v) => handleChange('setAlterDeclaration', v)} onFocus={() => setActiveField('setAlterDeclaration')} />
                                    </>
                                )}
                                {isSales && (
                                    <>
                                        <EditableRow label="Use for POS invoicing" value={formData.useForPOSInvoicing} onChange={(v) => handleChange('useForPOSInvoicing', v)} onFocus={() => setActiveField('useForPOSInvoicing')} />
                                        <EditableRow label="Default title to print" value={formData.defaultTitle} onChange={(v) => handleChange('defaultTitle', v)} onFocus={() => setActiveField('defaultTitle')} />
                                        <EditableRow label="Default bank" value={formData.defaultBank} onChange={(v) => handleChange('defaultBank', v)} onFocus={() => setActiveField('defaultBank')} boldValue />
                                        <EditableRow label="Default jurisdiction" value={formData.defaultJurisdiction} onChange={(v) => handleChange('defaultJurisdiction', v)} onFocus={() => setActiveField('defaultJurisdiction')} />
                                        <EditableRow label="Set/alter declaration" value={formData.setAlterDeclaration} onChange={(v) => handleChange('setAlterDeclaration', v)} onFocus={() => setActiveField('setAlterDeclaration')} />
                                    </>
                                )}
                                {isSalesOrder && (
                                    <>
                                        <div className="h-[84px]"></div>
                                        <EditableRow label="Set/alter declaration" value={formData.setAlterDeclaration} onChange={(v) => handleChange('setAlterDeclaration', v)} onFocus={() => setActiveField('setAlterDeclaration')} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Name of Class */}
                        <div className="w-1/4 pt-2 px-2">
                            <h3 className="text-center underline underline-offset-2 mb-4 text-[#2b5c85]">Name of Class</h3>
                        </div>

                        {/* SIDE PANEL DROPDOWN */}
                        {activeField === 'methodOfNumbering' && (
                            <div className="absolute right-0 top-10 w-64 bg-[#def0ff] border border-blue-800 shadow-lg z-50 text-sm">
                                <div className="bg-[#2b5c85] text-white text-center py-1 font-bold">
                                    Methods of Numbering
                                </div>
                                <ul className="flex flex-col">
                                    {methodsOfNumbering.map((option, idx) => (
                                        <li
                                            key={idx}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectOption(option);
                                            }}
                                            className="px-2 py-1 hover:bg-[#ffde70] cursor-pointer text-black"
                                        >
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Footer Status Bar */}
                <div className="bg-[#e8e8e8] h-[24px] flex items-center px-4 text-[12px] border-t border-[#ccc] shrink-0 font-bold">
                    <div className="flex items-center mr-6 cursor-pointer hover:bg-gray-200 px-1" onClick={() => setShowQuitBox(true)}>
                        <span className="text-[#1d5b6e]">Q</span>: Quit
                    </div>
                    <div className="flex-1" />
                    {isDirty && (
                        <div className="flex items-center mr-6 cursor-pointer hover:bg-gray-200 px-1" onClick={() => setShowQuitBox(true)}>
                            <span className="text-[#1d5b6e]">A</span>: Accept
                        </div>
                    )}
                    <div className="flex-1" />
                    <div className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                        <span className="text-[#1d5b6e]">F12</span>: Configure
                    </div>
                </div>

                {/* Quit/Accept Boxes */}
                {(showQuitBox || isDirty) && (
                    <div className="absolute inset-0 z-[600] flex items-center justify-center bg-black/10" onClick={() => { setShowQuitBox(false); setIsDirty(false); }}>
                        <div className="bg-white border border-[#2a5585] shadow-2xl p-4 w-[160px] h-[100px] flex flex-col items-center justify-between" onClick={e => e.stopPropagation()}>
                            <div className="text-[14px] text-black font-bold mt-1">{showQuitBox ? 'Quit ?' : 'Accept ?'}</div>
                            <div className="flex gap-6 text-[14px] font-bold text-[#2a5585] mb-1">
                                <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                                <span className="cursor-pointer hover:underline" onClick={() => { setShowQuitBox(false); setIsDirty(false); }}>No</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface EditableRowProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    boldValue?: boolean;
}

const EditableRow: React.FC<EditableRowProps> = ({ label, value, onChange, onFocus, boldValue }) => (
    <div className="flex justify-between items-start gap-2 hover:bg-[#e0f7fa] px-1 cursor-default group">
        <span className="text-black flex-1">{label}</span>
        <div className="flex shrink-0 items-center">
            <span className="mr-1">:</span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                className={`
                    ${boldValue ? 'font-bold' : ''} 
                    text-black w-64 outline-none bg-transparent 
                    focus:bg-[#ffde70] focus:text-black px-1
                `}
            />
        </div>
    </div>
);

export default VoucherTypeAlteration;
