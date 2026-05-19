import { useState, useRef, useEffect } from 'react';
import TallySidebar, { SidebarButton } from '../TallyGroupUI/TallySidebar';
import { TallySelectionList } from '../TallyGroupUI/TallySelectionList';
import { createStockCategory, getStockCategories, StockCategoryData } from '../../../services/inventoryService';

interface Props {
    onClose: () => void;
    companyId?: string;
    mode?: 'Create' | 'Alter';
    initialName?: string;
    initialId?: string;
}

const TallyStockCategoryCreation = ({ onClose, companyId, mode = 'Create', initialName = '', initialId }: Props) => {
    const [name, setName] = useState(initialName);
    const [alias, setAlias] = useState('');
    const [under, setUnder] = useState('Primary');
    const [underId, setUnderId] = useState<string | undefined>(undefined);

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);
    const [showUnderList, setShowUnderList] = useState(false);
    const [loading, setLoading] = useState(false);

    const [underOptions, setUnderOptions] = useState<string[]>(['Primary']);
    const [underMap, setUnderMap] = useState<Record<string, string>>({});

    const DEFAULT_COMPANY_ID = '07839352-87f5-4720-9426-38435d883b27';
    const effectiveCompanyId = companyId || DEFAULT_COMPANY_ID;

    // Refs for navigation
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const underRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getStockCategories(effectiveCompanyId);
                const options = ['Primary'];
                const mapping: Record<string, string> = {};
                data.forEach((c: any) => {
                    if (c.id !== initialId) {
                        options.push(c.name);
                        mapping[c.name] = c.id;
                    }
                });
                setUnderOptions(options);
                setUnderMap(mapping);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, [effectiveCompanyId, initialId]);

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setShowUnderList(false);
            if (nextRef.current) nextRef.current.focus();
            else setShowAcceptBox(true);
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || showAcceptBox || showUnderList) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, showAcceptBox, showUnderList]);

    const handleSave = async () => {
        try {
            setLoading(true);
            const categoryData: StockCategoryData = {
                name,
                alias,
                underId: under === 'Primary' ? undefined : underId,
            };

            await createStockCategory(effectiveCompanyId, categoryData);
            onClose();
        } catch (error: any) {
            alert(error.message || 'Failed to save stock category');
        } finally {
            setLoading(false);
            setShowAcceptBox(false);
        }
    };

    const sidebarButtons = [
        { keyName: 'F2', label: 'Period', disabled: true },
        { keyName: 'F3', label: 'Company' },
        { keyName: 'SEPARATOR', label: 'SEPARATOR' },
        { keyName: 'F10', label: 'Other Masters' },
        { keyName: 'SPACER', label: 'SPACER' },
        { keyName: 'F11', label: 'Features' },
        { keyName: 'F12', label: 'Configure' },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>Stock Category {mode === 'Alter' ? 'Alteration' : 'Creation'}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2 uppercase tracking-wider">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden h-full relative">
                <div className="flex-1 bg-white flex flex-col h-full overflow-y-auto border-r border-[#ccc] p-4 pt-6 relative">
                    {/* Name Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={() => nameRef.current?.focus()}>
                        <label className="w-[120px] text-black">Name</label>
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
                        <label className="w-[120px] text-gray-500 italic">(alias)</label>
                        <span className="font-bold mr-2"> :</span>
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
                        <label className="w-[120px] text-black">Under</label>
                        <span className="font-bold mr-2"> :</span>
                        <div className="flex items-center">
                            <input
                                ref={underRef}
                                type="text"
                                value={under}
                                onFocus={() => setShowUnderList(true)}
                                onBlur={() => setTimeout(() => setShowUnderList(false), 200)}
                                readOnly
                                className="bg-transparent text-black font-bold text-[13px] px-1 w-[200px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 cursor-default"
                            />
                        </div>
                    </div>

                    {/* Selection Overlay */}
                    {showUnderList && (
                        <div className="absolute top-0 right-[140px] bottom-0 z-[100]">
                            <TallySelectionList
                                title="List of Categories"
                                items={underOptions}
                                selectedItem={under}
                                onSelect={(item: string) => {
                                    setUnder(item);
                                    setUnderId(underMap[item]);
                                    setShowUnderList(false);
                                    setShowAcceptBox(true);
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
            <div className="bg-[#fcfcd0] h-[24px] flex items-center px-4 text-[12px] w-full border-t border-[#ccc] shrink-0 font-bold">
                <div className="flex items-center mr-6 cursor-pointer hover:bg-gray-200 px-1" onClick={() => setShowQuitBox(true)}>
                    <span className="text-[#1d5b6e]">Q</span>: Quit
                </div>
                <div className="flex-1" />
                <div className="flex items-center mr-6 cursor-pointer hover:bg-gray-200 px-1" onClick={() => setShowAcceptBox(true)}>
                    <span className="text-[#1d5b6e]">A</span>: Accept
                </div>
                <div className="flex-1" />
                <div className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                    <span className="text-[#1d5b6e]">F12</span>: Configure
                </div>
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
                                nameRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={handleSave}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            nameRef.current?.focus();
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

export default TallyStockCategoryCreation;
