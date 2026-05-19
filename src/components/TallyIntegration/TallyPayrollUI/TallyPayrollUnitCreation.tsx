import React, { useState, useRef, useEffect } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';

const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px]">{keyName}</span>
        <span>: {label}</span>
    </div>
);

interface Props {
    onClose: () => void;
    companyId?: string;
    initialMode?: 'Create' | 'Alter';
    initialName?: string;
}

const TallyPayrollUnitCreation = ({
    onClose,
    companyId,
    initialMode = 'Create',
    initialName = ''
}: Props) => {
    const [unitType, setUnitType] = useState('Simple');
    const [symbol, setSymbol] = useState(initialName);
    const [formalName, setFormalName] = useState('');
    const [uqc, setUqc] = useState('Not Applicable');
    const [showUQCList, setShowUQCList] = useState(false);
    const [selectedUQCIndex, setSelectedUQCIndex] = useState(0);

    const uqcList = [
        'Not Applicable',
        'BAG-BAGS', 'BAL-BALE', 'BDL-BUNDLES', 'BKL-BUCKLES', 'BOU-BILLION OF UNITS', 'BOX-BOX',
        'BTL-BOTTLES', 'BUN-BUNCHES', 'CAN-CANS', 'CBM-CUBIC METERS', 'CCM-CUBIC CENTIMETERS',
        'CMS-CENTIMETERS', 'CTN-CARTONS', 'DOZ-DOZENS', 'DRM-DRUMS', 'GGK-GREAT GROSS', 'GMS-GRAMMES',
        'GRS-GROSS', 'GYD-GROSS YARDS', 'KGS-KILOGRAMS', 'KLR-KILOLITRE', 'KME-KILOMETRE', 'LTR-LITRES',
        'MLT-MILILITRE', 'MTR-METERS', 'MTS-METRIC TON', 'NOS-NUMBERS', 'OTH-OTHERS', 'PAC-PACKS',
        'PCS-PIECES', 'PRS-PAIRS', 'QTL-QUINTAL', 'ROL-ROLLS'
    ];
    const [decimalPlaces, setDecimalPlaces] = useState('0');

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);

    // Refs for navigation
    const typeRef = useRef<HTMLInputElement>(null);
    const symbolRef = useRef<HTMLInputElement>(null);
    const formalRef = useRef<HTMLInputElement>(null);
    const uqcRef = useRef<HTMLInputElement>(null);
    const decimalRef = useRef<HTMLInputElement>(null);

    const closeAllLists = () => {
        setShowUQCList(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            closeAllLists();
            if (nextRef.current) nextRef.current.focus();
            else setShowAcceptBox(true);
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || showAcceptBox || showUQCList) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, showAcceptBox, showUQCList]);

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>{initialMode === 'Alter' ? 'Unit Alteration' : 'Unit Creation'}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden h-full">
                <div className="flex-1 bg-white flex flex-col h-full overflow-y-auto border-r border-[#ccc] p-4 pt-2 custom-scrollbar relative" onClick={closeAllLists}>
                    {/* Type Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); typeRef.current?.focus(); }}>
                        <label className="w-[180px] text-black">Type</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={typeRef}
                            type="text"
                            value={unitType}
                            onChange={(e) => setUnitType(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, symbolRef)}
                            onFocus={closeAllLists}
                            className="bg-transparent text-black font-bold px-1 w-[150px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                            autoFocus
                        />
                    </div>
                    {/* Symbol Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); symbolRef.current?.focus(); }}>
                        <label className="w-[180px] text-black">Symbol</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={symbolRef}
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, formalRef)}
                            onFocus={closeAllLists}
                            className="bg-[#fcfcd0] text-black font-bold px-1 w-[200px] outline-none border border-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                    {/* Formal Name Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); formalRef.current?.focus(); }}>
                        <label className="w-[180px] text-black">Formal name</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={formalRef}
                            type="text"
                            value={formalName}
                            onChange={(e) => setFormalName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, uqcRef)}
                            onFocus={closeAllLists}
                            className="bg-transparent text-black font-bold px-1 w-[300px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                    {/* UQC Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        closeAllLists();
                        setShowUQCList(true);
                    }}>
                        <label className="w-[180px] text-black">Unit Quantity Code (UQC)</label>
                        <span className="font-bold mr-2">:</span>
                        <div className="flex items-center">
                            <span className="text-black mr-1">♦</span>
                            <input
                                ref={uqcRef}
                                type="text"
                                value={uqc}
                                onChange={(e) => setUqc(e.target.value)}
                                onFocus={closeAllLists}
                                onKeyDown={(e) => {
                                    if (e.key === ' ' || e.key === 'Enter') {
                                        e.preventDefault();
                                        setShowUQCList(true);
                                    } else {
                                        handleKeyDown(e, decimalRef);
                                    }
                                }}
                                className="bg-transparent text-black font-bold px-1 w-[250px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 cursor-pointer"
                                readOnly
                            />
                        </div>
                    </div>
                    {/* Decimal Places Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); decimalRef.current?.focus(); }}>
                        <label className="w-[180px] text-black">Number of decimal places</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={decimalRef}
                            type="text"
                            value={decimalPlaces}
                            onChange={(e) => setDecimalPlaces(e.target.value)}
                            onFocus={closeAllLists}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setShowAcceptBox(true);
                                }
                            }}
                            className="bg-transparent text-black font-bold px-1 w-[50px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 text-right"
                        />
                    </div>

                    {/* UQC List Modal - Side Panel Style */}
                    {showUQCList && (
                        <div className="fixed top-[52px] bottom-[26px] right-[100px] sm:right-[120px] lg:right-[140px] w-[400px] z-[10000] flex flex-col border-l border-black shadow-xl font-sans">
                            <div className="flex flex-col h-full bg-[#e8f6fa] border-l-2 border-[#2a5585]">
                                <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center">
                                    <span className="font-bold text-[13px]">List of UQCs</span>
                                    <span onClick={() => setShowUQCList(false)} className="cursor-pointer hover:bg-red-500 px-1 text-[13px]">✕</span>
                                </div>
                                <div className="flex flex-1 overflow-hidden">
                                    <div className="flex-1 overflow-y-auto bg-[#e8f6fa] custom-scrollbar text-[13px]" tabIndex={0} autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'ArrowUp') {
                                                e.preventDefault();
                                                setSelectedUQCIndex(prev => prev > 0 ? prev - 1 : uqcList.length - 1);
                                            } else if (e.key === 'ArrowDown') {
                                                e.preventDefault();
                                                setSelectedUQCIndex(prev => prev < uqcList.length - 1 ? prev + 1 : 0);
                                            } else if (e.key === 'Enter') {
                                                e.preventDefault();
                                                setUqc(uqcList[selectedUQCIndex]);
                                                setShowUQCList(false);
                                                decimalRef.current?.focus();
                                            } else if (e.key === 'Escape') {
                                                setShowUQCList(false);
                                            }
                                        }}
                                    >
                                        <div className="text-right px-2 italic text-[11px] text-gray-500 border-b border-gray-300">

                                        </div>
                                        {uqcList.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`px-2 py-0.5 cursor-pointer flex items-center justify-start text-[13px]
                                            ${selectedUQCIndex === index ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-100/50 text-black'}
                                        `}
                                                onClick={() => {
                                                    setUqc(item);
                                                    setShowUQCList(false);
                                                    decimalRef.current?.focus();
                                                }}
                                                onMouseEnter={() => setSelectedUQCIndex(index)}
                                            >
                                                <div className="flex items-center">
                                                    {/* Show diamond for all items as per Tally style usually, or just NA? Keeping NA distinctive if needed but Tally lists often allow diamond for all */}
                                                    <span className="mr-1 text-[10px]">♦</span>
                                                    <span>{item}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Tally Sidebar */}
                <TallySidebar>
                    <SidebarButton keyName="F2" label="Period" onClick={() => { }} disabled={true} />
                    <SidebarButton keyName="F3" label="Company" onClick={() => { }} />
                    <SidebarButton keyName="F4" label="" disabled={true} />
                    <SidebarButton keyName="F5" label="" disabled={true} />
                    <SidebarButton keyName="F6" label="" disabled={true} />
                    <SidebarButton keyName="F7" label="" disabled={true} />
                    <SidebarButton keyName="F8" label="" disabled={true} />
                    <SidebarButton keyName="F9" label="" disabled={true} />
                    <SidebarButton keyName="F10" label="Other Masters" onClick={() => { }} />
                    <SidebarButton keyName="F11" label="Features" onClick={() => { }} underline="single" />
                    <SidebarButton keyName="F12" label="Configure" onClick={() => { }} />
                </TallySidebar>
            </div>

            {/* Footer */}
            <div className="bg-[#fcfcd0] h-[24px] flex items-center px-4 text-[12px] w-full border-t border-[#ccc] shrink-0">
                <FooterItem keyName="Q" label="Quit" onClick={() => setShowQuitBox(true)} />
                <div className="flex-1" />
                <FooterItem keyName="A" label="Accept" onClick={() => setShowAcceptBox(true)} />
                <div className="flex-1" />
                <FooterItem keyName="D" label="Delete" />
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
                                decimalRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            decimalRef.current?.focus();
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

export default TallyPayrollUnitCreation;
