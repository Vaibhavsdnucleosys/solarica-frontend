import { useState, useRef, useEffect } from 'react';
import TallySidebar from '../TallyCommon/TallySidebar';
import { TallySelectionList } from '../TallyGroupUI/TallySelectionList';
import TallyUnitCreation from './TallyUnitCreation';
import TallyStockGroupCreation from './TallyStockGroupCreation';
import TallyHeader from '../TallyGroupUI/TallyHeader';

import { createStockItem, updateStockItem, getUnits, getStockGroups, getStockItemById, StockItemData } from '../../../services/inventoryService';
import { DEFAULT_COMPANY_ID } from '../../../services/accountingService';

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
    initialId?: string;
    companyId?: string;
}

const TallyStockItemCreation = ({ onClose, mode = 'Create', initialName = '', initialId, companyId = DEFAULT_COMPANY_ID }: Props) => {
    const [name, setName] = useState(initialName);
    const [alias, setAlias] = useState('');
    const [under, setUnder] = useState('Primary');
    const [underId, setUnderId] = useState<string | undefined>(undefined);
    const [units, setUnits] = useState('Not Applicable');
    const [unitId, setUnitId] = useState<string | undefined>(undefined);

    // Statutory Details
    const [gstApplicability, setGstApplicability] = useState('Applicable');
    const [hsnSacDetails, setHsnSacDetails] = useState('As per Company/Stock Group');
    const [hsnSource, setHsnSource] = useState('Not Available');
    const [gstRateDetails, setGstRateDetails] = useState('As per Company/Stock Group');
    const [gstSource, setGstSource] = useState('Not Available');
    const [gstRate, setGstRate] = useState('0 %');
    const [supplyType, setSupplyType] = useState('Goods');
    const [rateOfDuty, setRateOfDuty] = useState('');

    const [hsnCode, setHsnCode] = useState('');
    const [hsnDescription, setHsnDescription] = useState('');
    const [taxabilityType, setTaxabilityType] = useState('Taxable');

    // Opening Balance
    const [openingQuantity, setOpeningQuantity] = useState('');

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);

    // List Visibility
    const [showUnderList, setShowUnderList] = useState(false);
    const [showUnitsList, setShowUnitsList] = useState(false);
    const [showHsnList, setShowHsnList] = useState(false);
    const [showGstList, setShowGstList] = useState(false);
    const [showSupplyList, setShowSupplyList] = useState(false);

    // Nested Creation State
    const [showNestedUnitCreation, setShowNestedUnitCreation] = useState(false);
    const [showNestedGroupCreation, setShowNestedGroupCreation] = useState(false);
    const [showTaxabilityList, setShowTaxabilityList] = useState(false);

    // List Options
    const [underList, setUnderList] = useState<string[]>(['Primary']);
    const [underMap, setUnderMap] = useState<Record<string, string>>({});
    const [unitsList, setUnitsList] = useState<string[]>(['Not Applicable']);
    const [unitsMap, setUnitsMap] = useState<Record<string, string>>({});
    const hsnActions = ['As per Company/Stock Group', 'Specify Details Here', 'Use GST Classification'];
    const gstActions = ['As per Company/Stock Group', 'Specify Details Here', 'Specify Slab-Based Rates', 'Use GST Classification'];
    const supplyTypes = ['Capital Goods', 'Goods', 'Services'];

    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const itemData: StockItemData = {
                name: name,
                alias: alias,
                groupId: underId,
                unitId: unitId,
                gstApplicable: gstApplicability,
                hsnSource: hsnSource,
                hsnSac: hsnCode,
                hsnDescription: hsnDescription,
                taxabilityType: taxabilityType,
                typeOfSupply: supplyType,
                openingQty: openingQuantity ? parseFloat(openingQuantity) : 0,
                rateOfDuty: rateOfDuty ? parseFloat(rateOfDuty) : 0,
                gstRate: gstRate ? parseFloat(gstRate.replace('%', '').trim()) : 0
            };

            const compId = companyId || DEFAULT_COMPANY_ID;
            if (mode === 'Create') {
                await createStockItem(compId, itemData);
            } else if (initialId) {
                await updateStockItem(compId, initialId, itemData);
            }
            onClose();
        } catch (error: any) {
            console.error("Save failed:", error);
            alert(error.message || "Failed to save stock item");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const compId = companyId || DEFAULT_COMPANY_ID;
                const [unitsData, groupsData] = await Promise.all([
                    getUnits(compId),
                    getStockGroups(compId)
                ]);

                const uList = ['Not Applicable', ...unitsData.map((u: any) => u.symbol)];
                const uMap: Record<string, string> = {};
                unitsData.forEach((u: any) => { uMap[u.symbol] = u.id; });
                setUnitsList(uList);
                setUnitsMap(uMap);

                const gList = ['Primary', ...groupsData.map((g: any) => g.name)];
                const gMap: Record<string, string> = {};
                groupsData.forEach((g: any) => { gMap[g.name] = g.id; });
                setUnderList(gList);
                setUnderMap(gMap);

                // If in Alter mode, fetch the specific item data
                if (mode === 'Alter' && initialId) {
                    try {
                        const item = await getStockItemById(compId, initialId);
                        if (item) {
                            setName(item.name || '');
                            setAlias(item.alias || '');
                            if (item.StockGroup) {
                                setUnder(item.StockGroup.name);
                                setUnderId(item.groupId);
                            } else if (item.groupId === null || item.groupId === undefined) {
                                setUnder('Primary');
                                setUnderId(undefined);
                            }

                            if (item.Unit) {
                                setUnits(item.Unit.symbol);
                                setUnitId(item.unitId);
                            } else {
                                setUnits('Not Applicable');
                                setUnitId(undefined);
                            }
                            setGstApplicability(item.gstApplicable || 'Applicable');
                            setHsnSource(item.hsnSource || 'Not Available');
                            setHsnSacDetails(item.hsnSac ? 'Specify Details Here' : (item.hsnSource === 'As per Company/Stock Group' ? 'As per Company/Stock Group' : 'Specify Details Here'));
                            setHsnCode(item.hsnSac || '');
                            setHsnDescription(item.hsnDescription || '');
                            setTaxabilityType(item.taxabilityType || 'Taxable');
                            setSupplyType(item.typeOfSupply || 'Goods');
                            setOpeningQuantity(item.openingQty?.toString() || '');
                            setRateOfDuty(item.rateOfDuty?.toString() || '');
                            setGstRate(item.gstRate ? `${item.gstRate} %` : '0 %');
                            if (item.taxabilityType) setGstRateDetails('Specify Details Here');
                        }
                    } catch (err) {
                        console.error("Failed to fetch item details:", err);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch units or groups:", error);
            }
        };
        fetchData();
    }, [companyId, mode, initialId, showNestedGroupCreation, showNestedUnitCreation]);

    // Refs for navigation
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const underRef = useRef<HTMLInputElement>(null);
    const unitsRef = useRef<HTMLInputElement>(null);
    const gstAppRef = useRef<HTMLInputElement>(null);
    const hsnDetailsRef = useRef<HTMLInputElement>(null);
    const hsnDescriptionRef = useRef<HTMLInputElement>(null);
    const hsnCodeRef = useRef<HTMLInputElement>(null);
    const gstRateDetailsRef = useRef<HTMLInputElement>(null);
    const taxabilityRef = useRef<HTMLInputElement>(null);
    const gstRateRef = useRef<HTMLInputElement>(null);
    const supplyRef = useRef<HTMLInputElement>(null);
    const openingQtyRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || showAcceptBox || showUnderList || showUnitsList || showHsnList || showGstList || showSupplyList || showNestedUnitCreation || showNestedGroupCreation || showTaxabilityList) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, showAcceptBox, showUnderList, showUnitsList, showHsnList, showGstList, showSupplyList, showNestedUnitCreation, showNestedGroupCreation, showTaxabilityList]);

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



    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden">


            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black text-[13px] font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>Stock Item {mode === 'Alter' ? 'Alteration' : 'Creation'}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden h-full">
                <div className="flex-1 bg-white flex flex-col h-full overflow-y-auto border-r border-[#ccc] custom-scrollbar">
                    {/* Top Identity Section */}
                    <div className="p-4 pb-0 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center mb-1 group cursor-pointer" onClick={() => nameRef.current?.focus()}>
                            <label className="w-[100px] text-black text-[13px]">Name</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                ref={nameRef}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, aliasRef)}
                                className="bg-[#fcfcd0] text-black font-bold text-[13px] px-1 w-[400px] outline-none border border-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                autoFocus
                            />
                        </div>
                        <div className="flex items-center mb-4 group cursor-pointer" onClick={() => aliasRef.current?.focus()}>
                            <label className="w-[100px] text-black text-[13px] italic">(alias)</label>
                            <span className="font-bold mr-2 text-[13px]"> :</span>
                            <input
                                ref={aliasRef}
                                type="text"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, underRef)}
                                className="bg-transparent text-black italic text-[13px] px-1 w-[400px] outline-none placeholder-gray-400 focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Split Layout */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Column */}
                        <div className="w-[45%] border-r border-gray-200 p-4 pt-6 bg-white">
                            <div className="flex items-center mb-2 group cursor-pointer" onClick={() => underRef.current?.focus()}>
                                <label className="w-[180px] text-black text-[13px]">Under</label>
                                <span className="font-bold mr-2 text-[13px]"> :</span>
                                <div className="flex items-center">
                                    <span className="text-black text-[13px] mr-1">♦</span>
                                    <input
                                        ref={underRef}
                                        type="text"
                                        value={under}
                                        onChange={(e) => setUnder(e.target.value)}
                                        onFocus={() => {
                                            setShowUnderList(true);
                                            // Handle "PrimaZSry" style issues by selecting text on focus
                                            underRef.current?.select();
                                        }}
                                        onBlur={() => setTimeout(() => setShowUnderList(false), 200)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setShowUnderList(false);
                                                unitsRef.current?.focus();
                                            }
                                        }}
                                        className="bg-transparent text-black font-bold text-[13px] px-1 w-[200px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center mb-6 group cursor-pointer" onClick={() => unitsRef.current?.focus()}>
                                <label className="w-[180px] text-black text-[13px]">Units</label>
                                <span className="font-bold mr-2 text-[13px]"> :</span>
                                <div className="flex items-center">
                                    <span className="text-black text-[13px] mr-1">♦</span>
                                    <input
                                        ref={unitsRef}
                                        type="text"
                                        value={units}
                                        onChange={(e) => setUnits(e.target.value)}
                                        onFocus={() => setShowUnitsList(true)}
                                        onBlur={() => setTimeout(() => setShowUnitsList(false), 200)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setShowUnitsList(false);
                                                gstAppRef.current?.focus();
                                            }
                                        }}
                                        className="bg-transparent text-black font-bold text-[13px] px-1 w-[200px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Statutory Details) */}
                        <div className="flex-1 p-4 pt-6 bg-white">
                            <div className="text-[13px] font-bold text-black border-b border-gray-400 mb-4 inline-block">Statutory Details</div>

                            <div className="flex items-center mb-4 group cursor-pointer" onClick={() => gstAppRef.current?.focus()}>
                                <label className="w-[180px] text-black text-[13px]">GST applicability</label>
                                <span className="font-bold mr-2 text-[13px]"> :</span>
                                <div className="flex items-center">
                                    <span className="text-black text-[13px] mr-1">♦</span>
                                    <input
                                        ref={gstAppRef}
                                        type="text"
                                        value={gstApplicability}
                                        onChange={(e) => setGstApplicability(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, hsnDetailsRef)}
                                        className="bg-transparent text-black font-bold text-[13px] px-1 w-[150px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center ml-2 mb-1 group cursor-pointer" onClick={() => hsnDetailsRef.current?.focus()}>
                                    <label className="w-[180px] text-black text-[12px]">HSN/SAC Details</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <input
                                        ref={hsnDetailsRef}
                                        type="text"
                                        value={hsnSacDetails}
                                        onChange={(e) => setHsnSacDetails(e.target.value)}
                                        onFocus={() => setShowHsnList(true)}
                                        onBlur={() => setTimeout(() => setShowHsnList(false), 200)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setShowHsnList(false);
                                                if (hsnSacDetails === 'Specify Details Here') {
                                                    hsnDescriptionRef.current?.focus();
                                                } else {
                                                    gstRateDetailsRef.current?.focus();
                                                }
                                            }
                                        }}
                                        className="bg-transparent text-black font-bold text-[12px] px-1 w-[200px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                                <div className="flex items-center ml-2 mb-1">
                                    <label className="w-[180px] text-black text-[12px]">Source of details</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <span className="text-gray-500 font-bold text-[12px] italic">{hsnSacDetails === 'Specify Details Here' ? 'Company' : 'Not Available'}</span>
                                </div>
                                {hsnSacDetails === 'Specify Details Here' && (
                                    <>
                                        <div className="flex items-center ml-2 mb-1 group cursor-pointer" onClick={() => hsnDescriptionRef.current?.focus()}>
                                            <label className="w-[180px] text-black text-[12px]">Description</label>
                                            <span className="font-bold mr-2 text-[12px]"> :</span>
                                            <input
                                                ref={hsnDescriptionRef}
                                                type="text"
                                                value={hsnDescription}
                                                onChange={(e) => setHsnDescription(e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, hsnCodeRef)}
                                                className="bg-transparent text-black font-bold text-[12px] px-1 w-[200px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                            />
                                        </div>
                                        <div className="flex items-center ml-2 mb-1 group cursor-pointer" onClick={() => hsnCodeRef.current?.focus()}>
                                            <label className="w-[180px] text-black text-[12px]">HSN/SAC</label>
                                            <span className="font-bold mr-2 text-[12px]"> :</span>
                                            <input
                                                ref={hsnCodeRef}
                                                type="text"
                                                value={hsnCode}
                                                onChange={(e) => setHsnCode(e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, gstRateDetailsRef)}
                                                className="bg-transparent text-black font-bold text-[12px] px-1 w-[200px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                            />
                                        </div>
                                    </>
                                )}
                                {hsnSacDetails !== 'Specify Details Here' && (
                                    <>
                                        <div className="flex items-center ml-2 mb-1">
                                            <label className="w-[180px] text-black text-[12px]">HSN/SAC</label>
                                            <span className="font-bold mr-2 text-[12px]"> :</span>
                                            <span className="text-black font-bold text-[12px]"></span>
                                        </div>
                                        <div className="flex items-center ml-2">
                                            <label className="w-[180px] text-black text-[12px]">Description</label>
                                            <span className="font-bold mr-2 text-[12px]"> :</span>
                                            <span className="text-black font-bold text-[12px]"></span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mb-4">
                                <div className="text-[13px] font-bold text-[#2a5585] mb-2">GST Rate & Related Details</div>
                                <div className="flex items-center ml-2 mb-1 group cursor-pointer" onClick={() => gstRateDetailsRef.current?.focus()}>
                                    <label className="w-[180px] text-black text-[12px]">GST Rate Details</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <input
                                        ref={gstRateDetailsRef}
                                        type="text"
                                        value={gstRateDetails}
                                        onChange={(e) => setGstRateDetails(e.target.value)}
                                        onFocus={() => setShowGstList(true)}
                                        onBlur={() => setTimeout(() => setShowGstList(false), 200)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setShowGstList(false);
                                                if (gstRateDetails === 'Specify Details Here') {
                                                    taxabilityRef.current?.focus();
                                                } else {
                                                    supplyRef.current?.focus();
                                                }
                                            }
                                        }}
                                        className="bg-transparent text-black font-bold text-[12px] px-1 w-[200px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                                <div className="flex items-center ml-2 mb-1">
                                    <label className="w-[180px] text-black text-[12px]">Source of details</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <span className="text-gray-500 font-bold text-[12px] italic">{gstRateDetails === 'Specify Details Here' ? 'Company' : 'Not Available'}</span>
                                </div>
                                {gstRateDetails === 'Specify Details Here' && (
                                    <>
                                        <div className="flex items-center ml-2 mb-1 group cursor-pointer" onClick={() => taxabilityRef.current?.focus()}>
                                            <label className="w-[180px] text-black text-[12px]">Taxability Type</label>
                                            <span className="font-bold mr-2 text-[12px]"> :</span>
                                            <input
                                                ref={taxabilityRef}
                                                type="text"
                                                value={taxabilityType}
                                                onFocus={() => setShowTaxabilityList(true)}
                                                onBlur={() => setTimeout(() => setShowTaxabilityList(false), 200)}
                                                readOnly
                                                className="bg-transparent text-black font-bold text-[12px] px-1 w-[150px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex items-center ml-2 group cursor-pointer" onClick={() => gstRateRef.current?.focus()}>
                                            <label className="w-[180px] text-black text-[12px]">GST Rate</label>
                                            <span className="font-bold mr-2 text-[12px]"> :</span>
                                            <input
                                                ref={gstRateRef}
                                                type="text"
                                                value={gstRate}
                                                onChange={(e) => setGstRate(e.target.value.includes('%') ? e.target.value : `${e.target.value} %`)}
                                                onKeyDown={(e) => handleKeyDown(e, supplyRef)}
                                                className="bg-transparent text-black font-bold text-[12px] px-1 w-[100px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                            />
                                        </div>
                                    </>
                                )}
                                {gstRateDetails !== 'Specify Details Here' && (
                                    <>
                                        <div className="flex items-center ml-2 mb-1">
                                            <label className="w-[180px] text-black text-[12px]">Taxability Type</label>
                                            <span className="font-bold mr-2 text-[12px]"> :</span>
                                            <span className="text-black font-bold text-[12px]"></span>
                                        </div>
                                        <div className="flex items-center ml-2">
                                            <label className="w-[180px] text-black text-[12px]">GST Rate</label>
                                            <span className="font-bold mr-2 text-[12px]"> :</span>
                                            <span className="text-black font-bold text-[12px] ml-1">{gstRate}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center mb-4 group cursor-pointer" onClick={() => supplyRef.current?.focus()}>
                                <label className="w-[180px] text-black text-[13px]">Type of Supply</label>
                                <span className="font-bold mr-2 text-[13px]"> :</span>
                                <div className="flex items-center">
                                    <span className="text-black text-[13px] mr-1">♦</span>
                                    <input
                                        ref={supplyRef}
                                        type="text"
                                        value={supplyType}
                                        onChange={(e) => setSupplyType(e.target.value)}
                                        onFocus={() => setShowSupplyList(true)}
                                        onBlur={() => setTimeout(() => setShowSupplyList(false), 200)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setShowSupplyList(false);
                                                openingQtyRef.current?.focus();
                                            }
                                        }}
                                        className="bg-transparent text-black font-bold text-[13px] px-1 w-[150px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="w-[180px] text-black text-[13px]">Rate of Duty (eg 5)</label>
                                <span className="font-bold mr-2 text-[13px]"> :</span>
                                <input
                                    type="text"
                                    value={rateOfDuty}
                                    onChange={(e) => setRateOfDuty(e.target.value)}
                                    className="bg-transparent text-black font-bold text-[13px] px-1 w-[100px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Opening Balance Section */}
                    <div className="border-t border-gray-200 p-2 bg-gray-50/50 shrink-0">
                        <div className="flex items-center justify-between w-full max-w-[900px]">
                            <div className="flex items-center group cursor-pointer" onClick={() => openingQtyRef.current?.focus()}>
                                <label className="text-[13px] font-bold text-[#2a5585]">Opening Balance</label>
                                <span className="font-bold mr-2 text-[13px] ml-4"> :</span>
                                <input
                                    ref={openingQtyRef}
                                    type="text"
                                    value={openingQuantity}
                                    onChange={(e) => setOpeningQuantity(e.target.value)}
                                    placeholder="Quantity"
                                    className="bg-transparent text-black font-bold text-[13px] px-1 w-[120px] outline-none text-right focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            setShowAcceptBox(true);
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-10 pr-4">
                                <div className="text-center font-bold text-[11px] text-gray-400 uppercase tracking-tight">Quantity</div>
                                <div className="text-center font-bold text-[11px] text-gray-400 uppercase tracking-tight w-24">Rate per</div>
                                <div className="text-center font-bold text-[11px] text-gray-400 uppercase tracking-tight w-24">Value</div>
                            </div>
                        </div>
                    </div>

                    {/* Selection Overlays */}
                    {showUnderList && (
                        <div className="absolute top-0 right-[140px] bottom-0 z-[100]">
                            <TallySelectionList
                                title="List of Groups"
                                items={underList}
                                selectedItem={under}
                                onSelect={(item: string) => {
                                    setUnder(item);
                                    setUnderId(underMap[item]);
                                    setShowUnderList(false);
                                    unitsRef.current?.focus();
                                }}
                                addNewLabel="Create"
                                onAddNew={() => {
                                    setShowUnderList(false);
                                    setShowNestedGroupCreation(true);
                                }}
                                width="230px"
                                height="100%"
                                position="absolute"
                                top="0px"
                                right="0px"
                            />
                        </div>
                    )}

                    {showUnitsList && (
                        <div className="absolute top-[130px] left-[320px] z-[100]">
                            <TallySelectionList
                                title="Units"
                                items={unitsList}
                                selectedItem={units}
                                onSelect={(item: string) => {
                                    setUnits(item);
                                    setUnitId(unitsMap[item]);
                                    setShowUnitsList(false);
                                    setTimeout(() => gstAppRef.current?.focus(), 0);
                                }}
                                addNewLabel="Create"
                                onAddNew={() => {
                                    setShowUnitsList(false);
                                    setShowNestedUnitCreation(true);
                                }}
                                width="250px"
                                height="auto"
                                position="absolute"
                            />
                        </div>
                    )}

                    {showHsnList && (
                        <div className="absolute top-[180px] left-[650px] z-[100]">
                            <TallySelectionList
                                title="List of Actions"
                                items={hsnActions}
                                selectedItem={hsnSacDetails}
                                onSelect={(item: string) => {
                                    setHsnSacDetails(item);
                                    setShowHsnList(false);
                                    setTimeout(() => gstRateDetailsRef.current?.focus(), 0);
                                }}
                                showMoreLabel="Show More"
                                width="280px"
                                height="auto"
                                position="absolute"
                            />
                        </div>
                    )}

                    {showGstList && (
                        <div className="absolute top-[320px] left-[650px] z-[100]">
                            <TallySelectionList
                                title="List of Actions"
                                items={gstActions}
                                selectedItem={gstRateDetails}
                                onSelect={(item: string) => {
                                    setGstRateDetails(item);
                                    setShowGstList(false);
                                    if (item === 'Specify Details Here') {
                                        setTimeout(() => taxabilityRef.current?.focus(), 0);
                                    } else {
                                        setTimeout(() => supplyRef.current?.focus(), 0);
                                    }
                                }}
                                showMoreLabel="Show More"
                                width="280px"
                                height="auto"
                                position="absolute"
                            />
                        </div>
                    )}

                    {showSupplyList && (
                        <div className="absolute top-[400px] left-[650px] z-[100]">
                            <TallySelectionList
                                title="Types of Supply"
                                items={supplyTypes}
                                selectedItem={supplyType}
                                onSelect={(item: string) => {
                                    setSupplyType(item);
                                    setShowSupplyList(false);
                                    setTimeout(() => openingQtyRef.current?.focus(), 0);
                                }}
                                width="230px"
                                height="auto"
                                position="absolute"
                            />
                        </div>
                    )}

                    {showTaxabilityList && (
                        <div className="absolute top-[380px] left-[650px] z-[110]">
                            <TallySelectionList
                                title="Taxability Type"
                                items={['Taxable', 'Nil Rated', 'Exempt']}
                                selectedItem={taxabilityType}
                                onSelect={(item: string) => {
                                    setTaxabilityType(item);
                                    setShowTaxabilityList(false);
                                    setTimeout(() => gstRateRef.current?.focus(), 0);
                                }}
                                width="230px"
                                height="auto"
                                position="absolute"
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
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') handleSave();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                setShowAcceptBox(false);
                                openingQtyRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={handleSave}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            openingQtyRef.current?.focus();
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
            {/* Nested Creation Overlays - Use fixed and high z-index to cover header */}
            {showNestedUnitCreation && (
                <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
                    <TallyHeader />
                    <div className="flex-1 flex overflow-hidden">
                        <TallyUnitCreation onClose={() => {
                            setShowNestedUnitCreation(false);
                            unitsRef.current?.focus();
                        }} />
                    </div>
                </div>
            )}
            {showNestedGroupCreation && (
                <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
                    <TallyHeader />
                    <div className="flex-1 flex overflow-hidden">
                        <TallyStockGroupCreation onClose={() => {
                            setShowNestedGroupCreation(false);
                            underRef.current?.focus();
                        }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TallyStockItemCreation;
