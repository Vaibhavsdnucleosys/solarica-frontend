import { useState, useRef, useEffect } from 'react';
import TallyHeader from '../TallyCommon/TallyHeader';
import TallySidebar from '../TallyCommon/TallySidebar';

const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center cursor-pointer hover:bg-black/5 px-2 py-0.5 rounded transition-colors" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px]">{keyName}</span>
        <span className="text-gray-700">: {label}</span>
    </div>
);

interface Props {
    onClose: () => void;
}

const TallyVoucherCreation = ({ onClose }: Props) => {
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [abbreviation, setAbbreviation] = useState('');

    const [activateVoucherType, setActivateVoucherType] = useState('Yes');
    const [voucherNumberingMethod, setVoucherNumberingMethod] = useState('');
    const [showUnusedVchNos, setShowUnusedVchNos] = useState('Yes');
    const [useEffectiveDates, setUseEffectiveDates] = useState('No');
    const [allowZeroValued, setAllowZeroValued] = useState('No');
    const [makeOptionalByDefault, setMakeOptionalByDefault] = useState('No');
    const [allowNarration, setAllowNarration] = useState('Yes');
    const [provideNarrationsForEachLedger, setProvideNarrationsForEachLedger] = useState('No');
    const [whatsAppAfterSaving, setWhatsAppAfterSaving] = useState('No');
    const [printAfterSaving, setPrintAfterSaving] = useState('No');

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLInputElement>(null);
    const abbrRef = useRef<HTMLInputElement>(null);
    const activateRef = useRef<HTMLDivElement>(null);
    const numberingRef = useRef<HTMLInputElement>(null);
    const unusedRef = useRef<HTMLDivElement>(null);
    const datesRef = useRef<HTMLDivElement>(null);
    const zeroValRef = useRef<HTMLDivElement>(null);
    const optionalRef = useRef<HTMLDivElement>(null);
    const narrationRef = useRef<HTMLDivElement>(null);
    const ledgerNarrationRef = useRef<HTMLDivElement>(null);
    const whatsappRef = useRef<HTMLDivElement>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
        if (e.key === 'Escape') {
            setShowQuitBox(true);
        }
    };

    const sidebarButtons: any[] = [
        { keyName: 'F2', label: 'Period', disabled: true },
        { keyName: 'F3', label: 'Company' },
        { keyName: '', label: 'SEPARATOR' },
        { keyName: 'F10', label: 'Other Masters' },
        { keyName: 'SPACER', label: 'SPACER' },
        { keyName: 'I', label: 'More Details' },
    ];

    const handleHeaderAction = (action: string) => {
        if (action === 'quit') setShowQuitBox(true);
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden">
            <TallyHeader onAction={handleHeaderAction} />

            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black text-[13px] font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>Voucher Type Creation</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden h-full">
                <div className="flex-1 bg-white flex flex-col h-full overflow-hidden border-r border-gray-300">
                    <div className="w-full p-6 pb-2 bg-gray-50/50">
                        <div className="flex items-center mb-2 group cursor-pointer" onClick={() => nameRef.current?.focus()}>
                            <label className="w-[80px] text-black text-[13px] font-medium">Name</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                ref={nameRef}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, aliasRef)}
                                className="bg-[#fcfcd0] text-black font-bold text-[14px] px-2 py-0.5 w-[380px] outline-none border border-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 rounded-sm"
                                autoFocus
                            />
                        </div>
                        <div className="flex items-center mb-6 group cursor-pointer" onClick={() => aliasRef.current?.focus()}>
                            <label className="w-[80px] text-black text-[13px] italic font-medium">(alias)</label>
                            <span className="font-bold mr-2 text-[13px]"> :</span>
                            <input
                                ref={aliasRef}
                                type="text"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, typeRef)}
                                className="bg-transparent text-black italic text-[14px] px-2 py-0.5 w-[380px] outline-none placeholder-gray-400 focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 rounded-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-1 border-t border-gray-200 overflow-hidden">
                        <div className="w-[40%] border-r border-gray-300 p-6 pt-8 overflow-y-auto custom-scrollbar bg-white">
                            <div className="text-center text-[14px] font-black mb-8 text-blue-900 border-b border-blue-100 pb-1 uppercase tracking-tight">General Information</div>

                            <div className="space-y-2">
                                <div className="flex items-center group cursor-pointer" onClick={() => typeRef.current?.focus()}>
                                    <label className="flex-1 text-black text-[13px]">Select type of voucher</label>
                                    <span className="font-bold mr-2 text-[13px]">:</span>
                                    <input
                                        ref={typeRef}
                                        type="text"
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, abbrRef)}
                                        className="bg-transparent text-black font-bold text-[13px] px-2 py-0.5 w-[140px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 rounded-sm"
                                    />
                                </div>
                                <div className="flex items-center group cursor-pointer" onClick={() => abbrRef.current?.focus()}>
                                    <label className="flex-1 text-black text-[13px]">Abbreviation</label>
                                    <span className="font-bold mr-2 text-[13px]">:</span>
                                    <input
                                        ref={abbrRef}
                                        type="text"
                                        value={abbreviation}
                                        onChange={(e) => setAbbreviation(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, activateRef)}
                                        className="bg-transparent text-black font-bold text-[13px] px-2 py-0.5 w-[140px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 rounded-sm"
                                    />
                                </div>
                                <div className="flex items-center group cursor-pointer" onClick={() => activateRef.current?.focus()}>
                                    <label className="flex-1 text-black text-[13px]">Activate this Voucher Type</label>
                                    <span className="font-bold mr-2 text-[13px]">:</span>
                                    <div
                                        ref={activateRef}
                                        className="font-bold text-black text-[13px] px-2 py-0.5 min-w-[60px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none rounded-sm transition-colors text-center"
                                        onClick={() => setActivateVoucherType(prev => prev === 'No' ? 'Yes' : 'No')}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                if (e.key === ' ') setActivateVoucherType(prev => prev === 'No' ? 'Yes' : 'No');
                                                handleKeyDown(e, numberingRef);
                                            }
                                            if (e.key === 'Escape') setShowQuitBox(true);
                                        }}
                                        tabIndex={0}
                                    >
                                        {activateVoucherType}
                                    </div>
                                </div>
                                <div className="flex items-center group cursor-pointer pt-2" onClick={() => numberingRef.current?.focus()}>
                                    <label className="flex-1 text-black text-[13px]">Method of Voucher Numbering</label>
                                    <span className="font-bold mr-2 text-[13px]">:</span>
                                    <input
                                        ref={numberingRef}
                                        type="text"
                                        value={voucherNumberingMethod}
                                        onChange={(e) => setVoucherNumberingMethod(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, unusedRef)}
                                        className="bg-transparent text-black font-bold text-[13px] px-2 py-0.5 w-[140px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 rounded-sm"
                                    />
                                </div>
                                <div className="flex items-start opacity-70 mt-2">
                                    <label className="flex-1 text-gray-500 text-[11px] leading-tight pr-4">Show unused vch nos. in transactions for Retain Original Voucher No. behaviour</label>
                                    <span className="font-bold mr-2 text-gray-400 text-[13px]">:</span>
                                    <div
                                        ref={unusedRef}
                                        className="font-bold text-gray-400 text-[13px] px-2 min-w-[60px] cursor-default outline-none text-center"
                                        tabIndex={0}
                                        onKeyDown={(e) => handleKeyDown(e, datesRef)}
                                    >
                                        {showUnusedVchNos}
                                    </div>
                                </div>
                                <div className="h-[1px] bg-gray-100 w-full my-4"></div>
                                <div className="flex items-center group cursor-pointer" onClick={() => datesRef.current?.focus()}>
                                    <label className="flex-1 text-black text-[13px]">Use effective dates for vouchers</label>
                                    <span className="font-bold mr-2 text-[13px]">:</span>
                                    <div
                                        ref={datesRef}
                                        className="font-bold text-black text-[13px] px-2 py-0.5 min-w-[60px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none rounded-sm transition-colors text-center"
                                        onClick={() => setUseEffectiveDates(prev => prev === 'No' ? 'Yes' : 'No')}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                if (e.key === ' ') setUseEffectiveDates(prev => prev === 'No' ? 'Yes' : 'No');
                                                handleKeyDown(e, zeroValRef);
                                            }
                                            if (e.key === 'Escape') setShowQuitBox(true);
                                        }}
                                        tabIndex={0}
                                    >
                                        {useEffectiveDates}
                                    </div>
                                </div>
                                <div className="flex items-center group cursor-pointer" onClick={() => zeroValRef.current?.focus()}>
                                    <label className="flex-1 text-black text-[13px]">Allow zero-valued transactions</label>
                                    <span className="font-bold mr-2 text-[13px]">:</span>
                                    <div
                                        ref={zeroValRef}
                                        className="font-bold text-black text-[13px] px-2 py-0.5 min-w-[60px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none rounded-sm transition-colors text-center"
                                        onClick={() => setAllowZeroValued(prev => prev === 'No' ? 'Yes' : 'No')}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                if (e.key === ' ') setAllowZeroValued(prev => prev === 'No' ? 'Yes' : 'No');
                                                handleKeyDown(e, optionalRef);
                                            }
                                            if (e.key === 'Escape') setShowQuitBox(true);
                                        }}
                                        tabIndex={0}
                                    >
                                        {allowZeroValued}
                                    </div>
                                </div>
                                <div className="flex items-center group cursor-pointer" onClick={() => optionalRef.current?.focus()}>
                                    <label className="flex-1 text-black text-[13px]">Make this vch type 'Optional' by default</label>
                                    <span className="font-bold mr-2 text-[13px]">:</span>
                                    <div
                                        ref={optionalRef}
                                        className="font-bold text-black text-[13px] px-2 py-0.5 min-w-[60px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none rounded-sm transition-colors text-center"
                                        onClick={() => setMakeOptionalByDefault(prev => prev === 'No' ? 'Yes' : 'No')}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                if (e.key === ' ') setMakeOptionalByDefault(prev => prev === 'No' ? 'Yes' : 'No');
                                                handleKeyDown(e, narrationRef);
                                            }
                                            if (e.key === 'Escape') setShowQuitBox(true);
                                        }}
                                        tabIndex={0}
                                    >
                                        {makeOptionalByDefault}
                                    </div>
                                </div>
                                <div className="flex items-center group cursor-pointer" onClick={() => narrationRef.current?.focus()}>
                                    <label className="flex-1 text-black text-[13px]">Allow narration in voucher</label>
                                    <span className="font-bold mr-2 text-[13px]">:</span>
                                    <div
                                        ref={narrationRef}
                                        className="font-bold text-black text-[13px] px-2 py-0.5 min-w-[60px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none rounded-sm transition-colors text-center"
                                        onClick={() => setAllowNarration(prev => prev === 'No' ? 'Yes' : 'No')}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                if (e.key === ' ') setAllowNarration(prev => prev === 'No' ? 'Yes' : 'No');
                                                handleKeyDown(e, ledgerNarrationRef);
                                            }
                                            if (e.key === 'Escape') setShowQuitBox(true);
                                        }}
                                        tabIndex={0}
                                    >
                                        {allowNarration}
                                    </div>
                                </div>
                                <div className="flex items-center group cursor-pointer" onClick={() => ledgerNarrationRef.current?.focus()}>
                                    <label className="flex-1 text-black text-[13px]">Provide narrations for each ledger</label>
                                    <span className="font-bold mr-2 text-[13px]">:</span>
                                    <div
                                        ref={ledgerNarrationRef}
                                        className="font-bold text-black text-[13px] px-2 py-0.5 min-w-[60px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none rounded-sm transition-colors text-center"
                                        onClick={() => setProvideNarrationsForEachLedger(prev => prev === 'No' ? 'Yes' : 'No')}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                if (e.key === ' ') setProvideNarrationsForEachLedger(prev => prev === 'No' ? 'Yes' : 'No');
                                                handleKeyDown(e, whatsappRef);
                                            }
                                            if (e.key === 'Escape') setShowQuitBox(true);
                                        }}
                                        tabIndex={0}
                                    >
                                        {provideNarrationsForEachLedger}
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-gray-100 group cursor-pointer" onClick={() => whatsappRef.current?.focus()}>
                                    <div className="flex items-center">
                                        <label className="flex-1 text-[#1d5b6e] font-bold text-[13px]">WhatsApp voucher after saving</label>
                                        <span className="font-bold mr-2 text-[13px]">:</span>
                                        <div
                                            ref={whatsappRef}
                                            className="font-bold text-black text-[13px] px-2 py-0.5 min-w-[60px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none rounded-sm transition-colors text-center"
                                            onClick={() => setWhatsAppAfterSaving(prev => prev === 'No' ? 'Yes' : 'No')}
                                            onKeyDown={(e) => {
                                                if (e.key === ' ' || e.key === 'Enter') {
                                                    if (e.key === ' ') setWhatsAppAfterSaving(prev => prev === 'No' ? 'Yes' : 'No');
                                                    handleKeyDown(e, printRef);
                                                }
                                                if (e.key === 'Escape') setShowQuitBox(true);
                                            }}
                                            tabIndex={0}
                                        >
                                            {whatsAppAfterSaving}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-[35%] border-r border-gray-300 p-6 pt-8 bg-gray-50/20">
                            <div className="text-center text-[14px] font-black mb-8 text-blue-900 border-b border-blue-100 pb-1 uppercase tracking-tight">Printing Settings</div>
                            <div className="flex items-center group cursor-pointer" onClick={() => printRef.current?.focus()}>
                                <label className="flex-1 text-black text-[13px]">Print voucher after saving</label>
                                <span className="font-bold mr-2 text-[13px]">:</span>
                                <div
                                    ref={printRef}
                                    className="font-bold text-black text-[13px] px-2 py-0.5 min-w-[60px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none rounded-sm transition-colors text-center"
                                    onClick={() => setPrintAfterSaving(prev => prev === 'No' ? 'Yes' : 'No')}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ' || e.key === 'Enter') {
                                            if (e.key === ' ') setPrintAfterSaving(prev => prev === 'No' ? 'Yes' : 'No');
                                            setShowAcceptBox(true);
                                        }
                                        if (e.key === 'Escape') setShowQuitBox(true);
                                    }}
                                    tabIndex={0}
                                >
                                    {printAfterSaving}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-6 pt-8 bg-white overflow-hidden">
                            <div className="text-center text-[14px] font-black mb-8 text-blue-900 border-b border-blue-100 pb-1 uppercase tracking-tight">Voucher Classes</div>
                            <div className="w-full flex-1 flex items-center justify-center text-gray-300 italic text-[13px]">
                                No classes defined
                            </div>
                        </div>
                    </div>
                </div>

                <TallySidebar buttons={sidebarButtons} />
            </div>

            <div className="bg-[#fcfcd0] h-[30px] flex items-center px-6 text-[12px] w-full border-t border-gray-300 shrink-0 shadow-sm">
                <FooterItem keyName="Q" label="Quit" onClick={() => setShowQuitBox(true)} />
                <div className="flex-1" />
                <FooterItem keyName="A" label="Accept" onClick={() => setShowAcceptBox(true)} />
                <div className="flex-1" />
                <FooterItem keyName="D" label="Delete" />
                <div className="flex-1" />
                <FooterItem keyName="F12" label="Configure" />
            </div>

            {/* Modals */}
            {showAcceptBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAcceptBox(false)}>✕</button>
                    <div className="text-[15px] text-black font-bold mt-2">Accept ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                setShowAcceptBox(false);
                                printRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            printRef.current?.focus();
                        }}>No</span>
                    </div>
                </div>
            )}

            {showQuitBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
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

export default TallyVoucherCreation;

