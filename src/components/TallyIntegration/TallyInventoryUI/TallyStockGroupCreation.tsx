import { useState, useRef } from 'react';
import TallySidebar, { SidebarButton } from '../TallyGroupUI/TallySidebar';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySelectionList } from '../TallyGroupUI/TallySelectionList';
import { createStockGroup, updateStockGroup, getStockGroups, getStockGroupById, StockGroupData } from '../../../services/inventoryService';
import { DEFAULT_COMPANY_ID } from '../../../services/accountingService';
import { useEffect } from 'react';

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

const TallyStockGroupCreation = ({ onClose, mode = 'Create', initialName = '', initialId, companyId = DEFAULT_COMPANY_ID }: Props) => {
    const [name, setName] = useState(initialName);
    const [alias, setAlias] = useState('');
    const [under, setUnder] = useState('Primary');
    const [shouldAddQuantities, setShouldAddQuantities] = useState('No');

    // Statutory Details
    const [hsnSacDetails, setHsnSacDetails] = useState('As per Company/Stock Group');
    const [hsnSource, setHsnSource] = useState('Not Available');
    const [hsnDescription, setHsnDescription] = useState('');
    const [hsnCode, setHsnCode] = useState('');

    const [gstRateDetails, setGstRateDetails] = useState('As per Company/Stock Group');
    const [gstSource, setGstSource] = useState('Not Available');
    const [gstRate, setGstRate] = useState('0 %');

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);

    const [showUnderList, setShowUnderList] = useState(false);
    const [showHsnList, setShowHsnList] = useState(false);
    const [showGstList, setShowGstList] = useState(false);
    const [showTaxabilityList, setShowTaxabilityList] = useState(false);
    const [taxabilityType, setTaxabilityType] = useState('Taxable');

    const [underList, setUnderList] = useState<string[]>(['Primary']);
    const [underId, setUnderId] = useState<string | undefined>(undefined);
    const [underMap, setUnderMap] = useState<Record<string, string>>({});
    const hsnActions = ['As per Company/Stock Group', 'Specify Details Here', 'Use GST Classification'];
    const gstActions = ['As per Company/Stock Group', 'Specify Details Here', 'Specify Slab-Based Rates', 'Use GST Classification'];

    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const groupData: StockGroupData = {
                name: name,
                alias: alias,
                underId: underId,
                shouldAddQuantities: shouldAddQuantities === 'Yes',
                gstApplicable: 'Applicable', // Defaulting to applicable as in UI
                hsnSac: hsnSacDetails === 'Specify Details Here' ? hsnCode : (hsnSacDetails === 'As per Company/Stock Group' ? undefined : hsnSacDetails),
                hsnDescription: hsnDescription,
                taxabilityType: gstRateDetails === 'Specify Details Here' ? taxabilityType : 'Taxable',
                gstRate: gstRate ? parseFloat(gstRate.replace('%', '').trim()) : 0
            };

            const compId = companyId || DEFAULT_COMPANY_ID;
            if (mode === 'Create') {
                await createStockGroup(compId, groupData);
            } else if (initialId) {
                await updateStockGroup(compId, initialId, groupData);
            }
            onClose();
        } catch (error: any) {
            console.error("Save failed:", error);
            alert(error.message || "Failed to save stock group");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const compId = companyId || DEFAULT_COMPANY_ID;
                const groupsData = await getStockGroups(compId);

                const gList = ['Primary', ...groupsData.map((g: any) => g.name)];
                const gMap: Record<string, string> = {};
                groupsData.forEach((g: any) => { gMap[g.name] = g.id; });
                setUnderList(gList);
                setUnderMap(gMap);

                // Fetch specific group if in Alter mode
                if (mode === 'Alter' && initialId) {
                    const group = await getStockGroupById(compId, initialId);
                    if (group) {
                        setName(group.name || '');
                        setAlias(group.alias || '');
                        if (group.parent) {
                            setUnder(group.parent.name);
                            setUnderId(group.underId);
                        }
                        setShouldAddQuantities(group.shouldAddQuantities ? 'Yes' : 'No');
                        setHsnCode(group.hsnSac || '');
                        setHsnDescription(group.hsnDescription || '');
                        setGstRate(group.gstRate ? `${group.gstRate} %` : '0 %');

                        // Heuristic to set dropdown values
                        if (group.hsnSac) setHsnSacDetails('Specify Details Here');
                        if (group.gstRate || group.taxabilityType) {
                            setGstRateDetails('Specify Details Here');
                            if (group.taxabilityType) setTaxabilityType(group.taxabilityType);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            }
        };
        fetchData();
    }, [companyId, mode, initialId]);

    // Refs for navigation
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const underRef = useRef<HTMLInputElement>(null);
    const quantitiesRef = useRef<HTMLDivElement>(null);

    const hsnDetailsRef = useRef<HTMLInputElement>(null);
    const hsnDescriptionRef = useRef<HTMLInputElement>(null);
    const hsnCodeRef = useRef<HTMLInputElement>(null);

    const gstDetailsRef = useRef<HTMLInputElement>(null);
    const taxabilityRef = useRef<HTMLDivElement>(null);
    const gstRateRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setShowUnderList(false);
            setShowHsnList(false);
            setShowGstList(false);
            setShowTaxabilityList(false);
            nextRef.current?.focus();
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || showAcceptBox || showUnderList || showHsnList || showGstList || showTaxabilityList) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, showAcceptBox, showUnderList, showHsnList, showGstList, showTaxabilityList]);

    const sidebarButtons = [
        { keyName: 'F2', label: 'Period', disabled: true },
        { keyName: 'F3', label: 'Company' },
        { keyName: 'SEPARATOR', label: 'SEPARATOR' },
        { keyName: 'F11', label: 'Features' },
        { keyName: 'F12', label: 'Configure' },
        { keyName: 'I', label: 'More Details' },
        { keyName: '', label: 'SPACER' },
        { keyName: 'B', label: 'Get HSN/SAC Info' },
    ];



    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>Stock Group {mode === 'Alter' ? 'Alteration' : 'Creation'}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2 uppercase tracking-wider">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2 transition-colors font-bold">✕</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden h-full">
                <div className="flex-1 bg-white flex flex-col h-full overflow-y-auto border-r border-[#ccc] p-4 pt-2 custom-scrollbar relative">
                    {/* Name Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={() => nameRef.current?.focus()}>
                        <label className="w-[180px] text-black text-[13px]">Name</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={nameRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, aliasRef)}
                            className="bg-[#fcfcd0] text-black font-bold text-[13px] px-1 w-[320px] outline-none border border-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                            autoFocus
                        />
                    </div>
                    {/* Alias Field */}
                    <div className="flex items-center mb-10 group cursor-pointer" onClick={() => aliasRef.current?.focus()}>
                        <label className="w-[180px] text-black text-[13px] italic">(alias)</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <input
                            ref={aliasRef}
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, underRef)}
                            className="bg-transparent text-black italic text-[13px] px-1 w-[320px] outline-none placeholder-gray-400 focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Under Field */}
                    <div className="flex items-center mb-6 group cursor-pointer" onClick={() => underRef.current?.focus()}>
                        <label className="w-[180px] text-black text-[13px]">Under</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <div className="flex items-center">
                            <span className="text-black text-[13px] mr-1">♦</span>
                            <input
                                ref={underRef}
                                type="text"
                                value={under}
                                onFocus={() => setShowUnderList(true)}
                                onBlur={() => setTimeout(() => setShowUnderList(false), 200)}
                                onChange={(e) => setUnder(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, quantitiesRef)}
                                className="bg-transparent text-black font-bold text-[13px] px-1 w-[200px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Quantities Field */}
                    <div className="flex items-center mb-8 group cursor-pointer" onClick={() => quantitiesRef.current?.focus()}>
                        <label className="w-[180px] text-black text-[13px]">Should quantities of items be added</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <div
                            ref={quantitiesRef}
                            className="font-bold text-black text-[13px] px-1 min-w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-none focus:ring-1 focus:ring-blue-400"
                            onClick={() => setShouldAddQuantities(prev => prev === 'No' ? 'Yes' : 'No')}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    if (e.key === ' ') setShouldAddQuantities(prev => prev === 'No' ? 'Yes' : 'No');
                                    handleKeyDown(e, hsnDetailsRef);
                                }
                            }}
                            tabIndex={0}
                        >
                            {shouldAddQuantities}
                        </div>
                    </div>

                    {/* Statutory Details Section */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <div className="text-[13px] font-bold text-black border-b border-gray-400 mb-4 inline-block">Statutory Details</div>

                        {/* HSN/SAC Section */}
                        <div className="mb-4">
                            <div className="text-[13px] font-bold text-[#2a5585] mb-2">HSN/SAC & Related Details</div>
                            <div className="flex items-center ml-2 mb-1 group cursor-pointer" onClick={() => hsnDetailsRef.current?.focus()}>
                                <label className="w-[180px] text-black text-[12px]">HSN/SAC Details</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <input
                                    ref={hsnDetailsRef}
                                    type="text"
                                    value={hsnSacDetails}
                                    onFocus={() => setShowHsnList(true)}
                                    onBlur={() => setTimeout(() => setShowHsnList(false), 200)}
                                    readOnly
                                    className="bg-transparent text-black font-bold text-[12px] px-1 w-[320px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    onKeyDown={(e) => handleKeyDown(e, hsnSacDetails === 'Specify Details Here' ? hsnDescriptionRef : gstDetailsRef)}
                                />
                            </div>
                            <div className="flex items-center ml-2 mb-1">
                                <label className="w-[180px] text-black text-[12px]">Source of details</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <span className="text-gray-500 font-bold text-[12px] italic">{hsnSource}</span>
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
                                            className="bg-transparent text-black font-bold text-[12px] px-1 w-[320px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
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
                                            onKeyDown={(e) => handleKeyDown(e, gstDetailsRef)}
                                            className="bg-transparent text-black font-bold text-[12px] px-1 w-[320px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* GST Rate Section */}
                        <div className="mb-4">
                            <div className="text-[13px] font-bold text-[#2a5585] mb-2">GST Rate & Related Details</div>
                            <div className="flex items-center ml-2 mb-1 group cursor-pointer" onClick={() => gstDetailsRef.current?.focus()}>
                                <label className="w-[180px] text-black text-[12px]">GST Rate Details</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <input
                                    ref={gstDetailsRef}
                                    type="text"
                                    value={gstRateDetails}
                                    onFocus={() => setShowGstList(true)}
                                    onBlur={() => setTimeout(() => setShowGstList(false), 200)}
                                    readOnly
                                    className="bg-transparent text-black font-bold text-[12px] px-1 w-[320px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    onKeyDown={(e) => handleKeyDown(e, gstRateDetails === 'Specify Details Here' ? { current: taxabilityRef.current } : gstRateRef)}
                                />
                            </div>
                            <div className="flex items-center ml-2 mb-1">
                                <label className="w-[180px] text-black text-[12px]">Source of details</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <span className="text-gray-500 font-bold text-[12px] italic">{gstSource}</span>
                            </div>

                            {gstRateDetails === 'Specify Details Here' && (
                                <>
                                    <div className="flex items-center ml-2 mb-1 group cursor-pointer" onClick={() => taxabilityRef.current?.focus()}>
                                        <label className="w-[180px] text-black text-[12px]">Taxability Type</label>
                                        <span className="font-bold mr-2 text-[12px]"> :</span>
                                        <div
                                            ref={taxabilityRef}
                                            tabIndex={0}
                                            className="bg-transparent text-black font-bold text-[12px] px-1 min-w-[100px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                            onFocus={() => setShowTaxabilityList(true)}
                                            onBlur={() => setTimeout(() => setShowTaxabilityList(false), 200)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    setShowTaxabilityList(false);
                                                    gstRateRef.current?.focus();
                                                }
                                                if (e.key === ' ') {
                                                    setShowTaxabilityList(true);
                                                }
                                            }}
                                        >
                                            {taxabilityType}
                                        </div>
                                    </div>
                                    <div className="flex items-center ml-2 mb-1 group cursor-pointer" onClick={() => gstRateRef.current?.focus()}>
                                        <label className="w-[180px] text-black text-[12px]">GST Rate (IGST)</label>
                                        <span className="font-bold mr-2 text-[12px]"> :</span>
                                        <div className="flex items-center">
                                            <input
                                                ref={gstRateRef}
                                                type="text"
                                                value={gstRate}
                                                onChange={(e) => setGstRate(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        setShowAcceptBox(true);
                                                    }
                                                }}
                                                className="bg-transparent text-black font-bold text-[12px] px-1 w-[100px] outline-none text-right focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {gstRateDetails !== 'Specify Details Here' && (
                                <div className="flex items-center ml-2 mb-1 group cursor-pointer" onClick={() => gstRateRef.current?.focus()}>
                                    <label className="w-[180px] text-black text-[12px]">GST Rate</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <div className="flex items-center">
                                        <input
                                            ref={gstRateRef}
                                            type="text"
                                            value={gstRate}
                                            onChange={(e) => setGstRate(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    setShowAcceptBox(true);
                                                }
                                            }}
                                            className="bg-transparent text-black font-bold text-[12px] px-1 w-[80px] outline-none text-right focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selection Overlays INSIDE Content Area */}
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
                                    quantitiesRef.current?.focus();
                                }}
                                addNewLabel="Create"
                                onAddNew={() => {
                                    setShowUnderList(false);
                                    nameRef.current?.focus();
                                }}
                                width="230px"
                                height="100%"
                                position="absolute"
                                top="0px"
                                right="0px"
                            />
                        </div>
                    )}

                    {showHsnList && (
                        <div className="absolute top-[180px] left-[380px] z-[100]">
                            <TallySelectionList
                                title="List of Actions"
                                items={hsnActions}
                                selectedItem={hsnSacDetails}
                                onSelect={(item: string) => {
                                    setHsnSacDetails(item);
                                    setShowHsnList(false);
                                    if (item === 'Specify Details Here') {
                                        setTimeout(() => hsnDescriptionRef.current?.focus(), 0);
                                    } else {
                                        setTimeout(() => gstDetailsRef.current?.focus(), 0);
                                    }
                                }}
                                showMoreLabel="Show More"
                                width="300px"
                                height="auto"
                                position="absolute"
                            />
                        </div>
                    )}

                    {showGstList && (
                        <div className="absolute top-[300px] left-[380px] z-[100]">
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
                                        setTimeout(() => gstRateRef.current?.focus(), 0);
                                    }
                                }}
                                showMoreLabel="Show More"
                                width="300px"
                                height="auto"
                                position="absolute"
                            />
                        </div>
                    )}

                    {showTaxabilityList && (
                        <div className="absolute top-[340px] left-[380px] z-[110]">
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
                <TallySidebar>
                    {sidebarButtons.map((btn, index) => {
                        if (btn.label === 'SEPARATOR') return <div key={index} className="h-[1px] bg-[#99c7d6] my-0.5 mx-1" />;
                        if (btn.label === 'SPACER') return <div key={index} className="flex-1" />;
                        return (
                            <SidebarButton
                                key={index}
                                keyName={btn.keyName}
                                label={btn.label}
                                disabled={btn.disabled}
                            />
                        );
                    })}
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
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[160px] h-[100px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAcceptBox(false)}>✕</button>
                    <div className="text-[14px] text-black font-bold mt-1">Accept ?</div>
                    <div className="flex gap-6 text-[14px] font-bold text-[#2a5585] mb-1 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') handleSave();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                setShowAcceptBox(false);
                                gstRateRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={handleSave}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            gstRateRef.current?.focus();
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

export default TallyStockGroupCreation;
