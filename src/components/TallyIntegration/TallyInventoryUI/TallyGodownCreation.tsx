import { useState, useRef, useEffect } from 'react';
import TallySidebar, { SidebarButton } from '../TallyGroupUI/TallySidebar';
import { TallySelectionList } from '../TallyGroupUI/TallySelectionList';
import { createGodown, getGodowns, getGodownById, updateGodown, GodownData } from '../../../services/inventoryService';

interface Props {
    onClose: () => void;
    companyId?: string;
    mode?: 'Create' | 'Alter';
    initialName?: string;
    initialId?: string;
}

const TallyGodownCreation = ({ onClose, companyId, mode = 'Create', initialName = '', initialId }: Props) => {
    const [name, setName] = useState(initialName);
    const [alias, setAlias] = useState('');
    const [under, setUnder] = useState('Primary');
    const [underId, setUnderId] = useState<string | undefined>(undefined);
    const [address, setAddress] = useState('');
    
    const [activeField, setActiveField] = useState<'name' | 'alias' | 'under' | 'address'>('name');
    const [showUnderList, setShowUnderList] = useState(false);
    const [showQuit, setShowQuit] = useState(false);
    const [showAccept, setShowAccept] = useState(false);
    const [loading, setLoading] = useState(false);

    const [underOptions, setUnderOptions] = useState<string[]>(['Primary']);
    const [underMap, setUnderMap] = useState<Record<string, string>>({});

    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const underRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);

    const DEFAULT_COMPANY_ID = '07839352-87f5-4720-9426-38435d883b27';
    const effectiveCompanyId = companyId || DEFAULT_COMPANY_ID;

    // Fetch godowns for the "Under" list
    useEffect(() => {
        const fetchGodowns = async () => {
            try {
                const data = await getGodowns(effectiveCompanyId);
                const options = ['Primary'];
                const mapping: Record<string, string> = {};
                data.forEach((g: any) => {
                    if (g.id !== initialId) { // Prevent circular reference
                        options.push(g.name);
                        mapping[g.name] = g.id;
                    }
                });
                setUnderOptions(options);
                setUnderMap(mapping);
            } catch (error) {
                console.error('Failed to fetch godowns:', error);
            }
        };
        fetchGodowns();
    }, [effectiveCompanyId, initialId]);

    // Fetch initial data for Alter mode
    useEffect(() => {
        if (mode === 'Alter' && initialId) {
            const fetchDetails = async () => {
                try {
                    setLoading(true);
                    const data = await getGodownById(effectiveCompanyId, initialId);
                    if (data) {
                        setName(data.name || '');
                        setAlias(data.alias || '');
                        setAddress(data.address || '');
                        if (data.underId && data.Godown) {
                            setUnder(data.Godown.name);
                            setUnderId(data.underId);
                        } else {
                            setUnder('Primary');
                            setUnderId(undefined);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch godown details:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [mode, initialId, effectiveCompanyId]);

    useEffect(() => { 
        if (!loading) {
            setTimeout(() => nameRef.current?.focus(), 50); 
        }
    }, [loading]);

    // Global Key Handling for Q: Quit
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuit || showAccept || showUnderList) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuit(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuit, showAccept, showUnderList]);

    const handleSave = async () => {
        try {
            setLoading(true);
            const godownData: GodownData = {
                name,
                alias,
                underId: under === 'Primary' ? undefined : underId,
                address,
            };

            if (mode === 'Alter' && initialId) {
                await updateGodown(effectiveCompanyId, initialId, godownData);
            } else {
                await createGodown(effectiveCompanyId, godownData);
            }
            onClose();
        } catch (error: any) {
            alert(error.message || 'Failed to save godown');
        } finally {
            setLoading(false);
            setShowAccept(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<any>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            } else {
                setShowAccept(true);
            }
        }
    };

    const sidebarButtons = [
        { keyName: 'F2', label: 'Period', disabled: true },
        { keyName: 'F3', label: 'Company' },
        { keyName: 'SEPARATOR', label: 'SEPARATOR' },
        { keyName: 'F10', label: 'Other Masters' },
        { keyName: 'SPACER', label: 'SPACER' },
        { keyName: 'I', label: 'More Details' },
        { keyName: 'F11', label: 'Features' },
        { keyName: 'F12', label: 'Configure' },
    ];

    if (loading && mode === 'Alter') {
        return (
            <div className="flex items-center justify-center h-full w-full bg-white text-black font-bold">
                Loading Godown Details...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>Godown {mode === 'Alter' ? 'Alteration' : 'Creation'}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2 uppercase tracking-wider">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuit(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                <div className="flex-1 bg-white p-4 pt-6 relative border-r border-[#ccc] overflow-y-auto">
                    {/* Name */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={() => nameRef.current?.focus()}>
                        <label className="w-[100px] text-black">Name</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={nameRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => { setActiveField('name'); setShowUnderList(false); }}
                            onKeyDown={(e) => handleKeyDown(e, aliasRef)}
                            className={`px-1 h-5 w-[350px] outline-none font-bold ${activeField === 'name' ? 'bg-[#fffacd] ring-1 ring-blue-400' : 'bg-transparent'}`}
                        />
                    </div>

                    {/* Alias */}
                    <div className="flex items-center mb-8 group cursor-pointer" onClick={() => aliasRef.current?.focus()}>
                        <label className="w-[100px] text-gray-500 italic">(alias)</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={aliasRef}
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            onFocus={() => { setActiveField('alias'); setShowUnderList(false); }}
                            onKeyDown={(e) => handleKeyDown(e, underRef)}
                            className={`px-1 h-5 w-[350px] outline-none italic ${activeField === 'alias' ? 'bg-[#fffacd] ring-1 ring-blue-400' : 'bg-transparent'}`}
                        />
                    </div>

                    {/* Under */}
                    <div className="flex items-center mb-4 cursor-pointer" onClick={() => underRef.current?.focus()}>
                        <label className="w-[100px] text-black">Under</label>
                        <span className="font-bold mr-2">:</span>
                        <div className="flex items-center bg-transparent">
                            <input
                                ref={underRef}
                                type="text"
                                value={under}
                                readOnly
                                onFocus={() => { setActiveField('under'); setShowUnderList(true); }}
                                onKeyDown={(e) => { 
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        setShowUnderList(false);
                                        addressRef.current?.focus();
                                    }
                                }}
                                className={`px-1 h-5 w-[250px] outline-none font-bold cursor-default ${activeField === 'under' ? 'bg-[#fffacd] ring-1 ring-blue-400' : 'bg-transparent'}`}
                            />
                        </div>
                    </div>

                    {/* Address - Added to Godown Creation */}
                    <div className="flex items-start mb-1 group cursor-pointer" onClick={() => addressRef.current?.focus()}>
                        <label className="w-[100px] text-black mt-0.5">Address</label>
                        <span className="font-bold mr-2 mt-0.5">:</span>
                        <textarea
                            ref={addressRef}
                            rows={3}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onFocus={() => { setActiveField('address'); setShowUnderList(false); }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    setShowAccept(true);
                                }
                            }}
                            className={`px-1 py-0.5 w-[350px] outline-none font-bold resize-none ${activeField === 'address' ? 'bg-[#fffacd] ring-1 ring-blue-400' : 'bg-transparent'}`}
                        />
                    </div>

                    {/* Selection Overlay */}
                    {showUnderList && (
                        <div className="absolute top-0 right-[140px] bottom-0 z-[100]">
                            <TallySelectionList
                                title="List of Godowns"
                                items={underOptions}
                                selectedItem={under}
                                onSelect={(item) => {
                                    setUnder(item);
                                    setUnderId(underMap[item]);
                                    setShowUnderList(false);
                                    addressRef.current?.focus();
                                }}
                                addNewLabel="Create"
                                onAddNew={() => {
                                    setShowUnderList(false);
                                    nameRef.current?.focus();
                                }}
                                width="300px"
                                height="100%"
                                position="absolute"
                                top="0px"
                                right="0px"
                            />
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <TallySidebar>
                    {sidebarButtons.map((btn, index) => {
                        if (btn.label === 'SEPARATOR') return <div key={index} className="h-[1px] bg-[#99c7d6] my-0.5 mx-1" />;
                        if (btn.label === 'SPACER') return <div key={index} className="flex-1" />;
                        return <SidebarButton key={index} keyName={btn.keyName} label={btn.label} disabled={btn.disabled} />;
                    })}
                </TallySidebar>
            </div>

            {/* Footer */}
            <div className="bg-[#fcfcd0] h-[24px] flex items-center px-4 text-[12px] w-full border-t border-[#ccc] shrink-0">
                <div className="flex items-center mr-6 cursor-pointer hover:bg-gray-200 px-1" onClick={() => setShowQuit(true)}>
                    <span className="text-[#1d5b6e] font-bold">Q</span>: Quit
                </div>
                <div className="flex-1" />
                <div className="flex items-center mr-6 cursor-pointer hover:bg-gray-200 px-1" onClick={() => setShowAccept(true)}>
                    <span className="text-[#1d5b6e] font-bold">A</span>: Accept
                </div>
                <div className="flex-1" />
                <div className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                    <span className="text-[#1d5b6e] font-bold">F12</span>: Configure
                </div>
            </div>

            {/* Accept Dialog */}
            {showAccept && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[160px] h-[100px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAccept(false)}>✕</button>
                    <div className="text-[14px] text-black font-bold mt-1">Accept ?</div>
                    <div className="flex gap-6 text-[14px] font-bold text-[#2a5585] mb-1 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') handleSave();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                setShowAccept(false);
                                addressRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={handleSave}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => { setShowAccept(false); addressRef.current?.focus(); }}>No</span>
                    </div>
                </div>
            )}

            {/* Quit Dialog */}
            {showQuit && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[160px] h-[100px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowQuit(false)}>✕</button>
                    <div className="text-[14px] text-black font-bold mt-1">Quit ?</div>
                    <div className="flex gap-6 text-[14px] font-bold text-[#2a5585] mb-1 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowQuit(false);
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => setShowQuit(false)}>No</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TallyGodownCreation;
