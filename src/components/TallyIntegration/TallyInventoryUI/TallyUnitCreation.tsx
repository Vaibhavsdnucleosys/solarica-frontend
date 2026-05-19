import { useState, useRef, useEffect } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import TallySidebar from '../TallyCommon/TallySidebar';
import { TallySelectionList } from '../TallyGroupUI/TallySelectionList';
import { getUqcCodes, createUnit, updateUnit, getUnits, deleteUnit } from '../../../services/inventoryService';

const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px]">{keyName}</span>
        <span>: {label}</span>
    </div>
);

interface Props {
    onClose: () => void;
    mode?: 'Create' | 'Alter';
    initialName?: string;
    companyId?: string;
}

const TallyUnitCreation = ({ onClose, mode = 'Create', initialName = '', companyId }: Props) => {
    const [unitType, setUnitType] = useState('Simple');
    const [symbol, setSymbol] = useState(initialName);
    const [formalName, setFormalName] = useState('');
    const [uqc, setUqc] = useState('Not Applicable');
    const [decimalPlaces, setDecimalPlaces] = useState('0');
    const [newUqcName, setNewUqcName] = useState('');
    const [uqcOptions, setUqcOptions] = useState<string[]>(['Not Applicable']);
    const [unitId, setUnitId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);
    const [showTypeList, setShowTypeList] = useState(false);
    const [showUqcList, setShowUqcList] = useState(false);
    const [showNewUqcBox, setShowNewUqcBox] = useState(false);

    // Fetch UQC codes on mount
    useEffect(() => {
        const fetchUQC = async () => {
            try {
                const data = await getUqcCodes();
                if (data && Array.isArray(data)) {
                    setUqcOptions(['Not Applicable', ...data.map((u: any) => u.code + '-' + u.description)]);
                }
            } catch (err) {
                console.error("Failed to fetch UQC codes:", err);
            }
        };
        fetchUQC();
    }, []);

    // If Alter mode, fetch the actual unit data
    useEffect(() => {
        if (mode === 'Alter' && initialName && companyId) {
            const fetchUnitData = async () => {
                try {
                    const data = await getUnits(companyId);
                    const unit = data.find((u: any) => u.symbol === initialName);
                    if (unit) {
                        setUnitId(unit.id);
                        setUnitType(unit.type || 'Simple');
                        setSymbol(unit.symbol);
                        setFormalName(unit.formalName);
                        setUqc(unit.uqc || 'Not Applicable');
                        setDecimalPlaces(String(unit.decimalPlaces || 0));
                    }
                } catch (err) {
                    console.error("Failed to fetch unit details:", err);
                }
            };
            fetchUnitData();
        }
    }, [mode, initialName, companyId]);

    const handleAccept = async () => {
        if (!companyId) {
            alert("No company selected");
            return;
        }
        if (!symbol.trim() || !formalName.trim()) {
            alert("Symbol and Formal Name are required");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                symbol: symbol.trim(),
                formalName: formalName.trim(),
                type: unitType,
                uqc: uqc,
                decimalPlaces: parseInt(decimalPlaces) || 0
            };

            if (mode === 'Alter' && unitId) {
                await updateUnit(companyId, unitId, payload);
            } else {
                await createUnit(companyId, payload);
            }
            onClose();
        } catch (err: any) {
            alert(err.message || "Failed to save unit");
        } finally {
            setLoading(false);
            setShowAcceptBox(false);
        }
    };

    const handleDelete = async () => {
        if (!companyId || !unitId) return;
        if (!window.confirm(`Are you sure you want to delete unit "${symbol}"?`)) return;

        setLoading(true);
        try {
            await deleteUnit(companyId, unitId);
            alert("Unit deleted successfully");
            onClose();
        } catch (err: any) {
            alert(err.message || "Failed to delete unit");
        } finally {
            setLoading(false);
        }
    };

    // Refs for navigation
    const typeRef = useRef<HTMLInputElement>(null);
    const symbolRef = useRef<HTMLInputElement>(null);
    const formalRef = useRef<HTMLInputElement>(null);
    const uqcRef = useRef<HTMLInputElement>(null);
    const decimalRef = useRef<HTMLInputElement>(null);
    const newUqcRef = useRef<HTMLInputElement>(null);

    // Removed old hardcoded uqcOptions
    const typeOptions = ['Compound', 'Simple'];

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setShowTypeList(false);
            setShowUqcList(false);
            if (nextRef.current) nextRef.current.focus();
            else setShowAcceptBox(true);
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || showAcceptBox || showTypeList || showUqcList || showNewUqcBox) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, showAcceptBox, showTypeList, showUqcList, showNewUqcBox]);

    const sidebarButtons = [
        { keyName: 'F2', label: 'Period', disabled: true },
        { keyName: 'F3', label: 'Company' },
        { keyName: '', label: 'SEPARATOR' },
        { keyName: 'F10', label: 'Other Masters' },
        { keyName: '', label: 'SPACER' },
        { keyName: 'I', label: 'More Details' },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black text-[13px] font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>Unit {mode === 'Alter' ? 'Alteration' : 'Creation'}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden h-full relative">
                <div className="flex-1 bg-white flex flex-col h-full overflow-y-auto border-r border-[#ccc] p-4 pt-2 custom-scrollbar relative">
                    {/* Type Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={() => typeRef.current?.focus()}>
                        <label className="w-[200px] text-black text-[13px]">Type</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <input
                            ref={typeRef}
                            type="text"
                            value={unitType}
                            onFocus={() => setShowTypeList(true)}
                            onBlur={() => setTimeout(() => setShowTypeList(false), 200)}
                            readOnly
                            onKeyDown={(e) => handleKeyDown(e, symbolRef)}
                            className="bg-transparent text-black font-bold text-[13px] px-1 w-[150px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 cursor-pointer"
                            autoFocus
                        />
                    </div>
                    {/* Symbol Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={() => symbolRef.current?.focus()}>
                        <label className="w-[200px] text-black text-[13px]">Symbol</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <input
                            ref={symbolRef}
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, formalRef)}
                            className="bg-[#fcfcd0] text-black font-bold text-[13px] px-1 w-[200px] outline-none border border-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                    {/* Formal Name Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={() => formalRef.current?.focus()}>
                        <label className="w-[200px] text-black text-[13px]">Formal name</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <input
                            ref={formalRef}
                            type="text"
                            value={formalName}
                            onChange={(e) => setFormalName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, uqcRef)}
                            className="bg-transparent text-black font-bold text-[13px] px-1 w-[300px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                    {/* UQC Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={() => uqcRef.current?.focus()}>
                        <label className="w-[200px] text-black text-[13px]">Unit Quantity Code (UQC)</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <div className="flex items-center">
                            <span className="text-black text-[13px] mr-1">♦</span>
                            <input
                                ref={uqcRef}
                                type="text"
                                value={uqc}
                                onFocus={() => setShowUqcList(true)}
                                onBlur={() => setTimeout(() => setShowUqcList(false), 200)}
                                readOnly
                                onKeyDown={(e) => handleKeyDown(e, decimalRef)}
                                className="bg-transparent text-black font-bold text-[13px] px-1 w-[250px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 cursor-pointer"
                            />
                        </div>
                    </div>
                    {/* Decimal Places Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={() => decimalRef.current?.focus()}>
                        <label className="w-[200px] text-black text-[13px]">Number of decimal places</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <input
                            ref={decimalRef}
                            type="text"
                            value={decimalPlaces}
                            onChange={(e) => setDecimalPlaces(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setShowAcceptBox(true);
                                }
                            }}
                            className="bg-transparent text-black font-bold text-[13px] px-1 w-[50px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 text-right"
                        />
                    </div>

                    {/* Type Selection List */}
                    {showTypeList && (
                        <div className="absolute top-[30px] left-[350px] z-[100]">
                            <TallySelectionList
                                title="Types of Units"
                                items={typeOptions}
                                selectedItem={unitType}
                                onSelect={(item: string) => {
                                    setUnitType(item);
                                    setShowTypeList(false);
                                    symbolRef.current?.focus();
                                }}
                                width="250px"
                                height="auto"
                                position="absolute"
                            />
                        </div>
                    )}

                    {/* UQC Selection List */}
                    {showUqcList && (
                        <div className="absolute top-0 right-[140px] bottom-0 z-[100]">
                            <TallySelectionList
                                title="List of UQCs"
                                items={uqcOptions}
                                selectedItem={uqc}
                                onSelect={(item: string) => {
                                    setUqc(item);
                                    setShowUqcList(false);
                                    decimalRef.current?.focus();
                                }}
                                addNewLabel="New UQC"
                                onAddNew={() => {
                                    setShowUqcList(false);
                                    setShowNewUqcBox(true);
                                }}
                                width="230px"
                                height="100%"
                                position="absolute"
                                top="0px"
                                right="0px"
                            />
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <TallySidebar buttons={sidebarButtons} />
            </div>

            {/* Footer */}
            <div className="bg-[#fcfcd0] h-[24px] flex items-center px-4 text-[12px] w-full border-t border-[#ccc] shrink-0">
                <FooterItem keyName="Q" label="Quit" onClick={() => setShowQuitBox(true)} />
                <div className="flex-1" />
                <FooterItem keyName="A" label="Accept" onClick={() => setShowAcceptBox(true)} />
                <div className="flex-1" />
                <FooterItem keyName="D" label="Delete" onClick={mode === 'Alter' ? handleDelete : undefined} />
                <div className="flex-1" />
                <FooterItem keyName="F12" label="Configure" />
            </div>

            {/* New UQC Box Overlay */}
            {showNewUqcBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] bg-white border border-[#2a5585] shadow-2xl p-4 w-[350px] flex flex-col items-center">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowNewUqcBox(false)}>✕</button>
                    <div className="text-[14px] text-black font-bold border-b border-black mb-4 px-4">UQC Name</div>
                    <input
                        ref={newUqcRef}
                        type="text"
                        value={newUqcName}
                        onChange={(e) => setNewUqcName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (newUqcName) setUqc(newUqcName);
                                setShowNewUqcBox(false);
                                decimalRef.current?.focus();
                            }
                            if (e.key === 'Escape') setShowNewUqcBox(false);
                        }}
                        className="bg-[#fcfcd0] text-black font-bold text-[13px] px-1 w-full outline-none border border-blue-400"
                    />
                </div>
            )}

            {/* Accept Box Overlay */}
            {showAcceptBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[160px] h-[100px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAcceptBox(false)}>✕</button>
                    <div className="text-[14px] text-black font-bold mt-1">Accept ?</div>
                    <div className="flex gap-6 text-[14px] font-bold text-[#2a5585] mb-1 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') handleAccept();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                setShowAcceptBox(false);
                                decimalRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={handleAccept}>{loading ? 'Saving...' : 'Yes'}</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            decimalRef.current?.focus();
                        }}>No</span>
                    </div>
                </div>
            )}

            {/* Quit Box Overlay */}
            {showQuitBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[160px] h-[100px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowQuitBox(false)}>✕</button>
                    <div className="text-[14px] text-black font-bold mt-1">Quit ?</div>
                    <div className="flex gap-6 text-[14px] font-bold text-[#2a5585] mb-1 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
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

export default TallyUnitCreation;
