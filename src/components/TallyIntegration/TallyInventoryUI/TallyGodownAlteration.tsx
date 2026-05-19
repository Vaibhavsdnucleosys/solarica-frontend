import { useState, useRef, useEffect } from 'react';
import TallySidebar, { SidebarButton } from '../TallyGroupUI/TallySidebar';
import { TallySelectionList } from '../TallyGroupUI/TallySelectionList';
import { getGodowns } from '../../../services/inventoryService';

interface Props {
    onClose: () => void;
    companyId?: string;
    onCreate?: () => void;
    onSelect: (name: string, id: string) => void;
}

const TallyGodownAlteration = ({ onClose, companyId, onCreate, onSelect }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [godowns, setGodowns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const DEFAULT_COMPANY_ID = '07839352-87f5-4720-9426-38435d883b27';
    const effectiveCompanyId = companyId || DEFAULT_COMPANY_ID;

    useEffect(() => {
        const fetchGodowns = async () => {
            try {
                setLoading(true);
                const data = await getGodowns(effectiveCompanyId);
                setGodowns(data || []);
            } catch (error) {
                console.error('Failed to fetch godowns:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGodowns();
    }, [effectiveCompanyId]);

    const filteredGodowns = godowns.filter(g => 
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (g.alias && g.alias.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const displayItems = [
        { name: 'Back', id: 'back', isSystem: true },
        { name: 'Create', id: 'create', isSystem: true },
        ...filteredGodowns
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                setSelectedIndex(prev => Math.min(prev + 1, displayItems.length - 1));
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                const selected = displayItems[selectedIndex];
                if (selected.id === 'back') onClose();
                else if (selected.id === 'create') onCreate?.();
                else onSelect(selected.name, selected.id);
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, displayItems, onClose, onCreate, onSelect]);

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
                    <span>Godown Alteration</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2 uppercase tracking-wider">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={onClose} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div className="flex-1 bg-white flex flex-col items-center justify-start pt-10 relative">
                    <div className="w-[450px] border-2 border-[#2a5585] shadow-2xl bg-white">
                        <div className="bg-white py-1 text-center font-bold text-[#2a5585] text-[15px] underline decoration-1 underline-offset-4">
                            Master Alteration
                        </div>
                        <div className="px-2 pb-2">
                            <div className="bg-[#fffacd] border border-[#2a5585] h-[24px] flex items-center px-2">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setSelectedIndex(2); }}
                                    autoFocus
                                    className="bg-transparent border-none outline-none w-full font-bold text-black text-[13px]"
                                />
                            </div>
                        </div>
                        <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center text-[12px] font-bold">
                            <span>List of Godowns</span>
                        </div>
                        <div className="min-h-[300px] max-h-[450px] overflow-y-auto bg-white border-b border-[#2a5585]">
                            {loading ? (
                                <div className="px-4 py-8 text-center text-gray-500 italic">Loading...</div>
                            ) : displayItems.length > 0 ? (
                                displayItems.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className={`px-4 py-0.5 cursor-pointer text-[13px] font-bold flex justify-between items-center ${idx === selectedIndex ? 'bg-[#feba35] text-black' : item.isSystem ? 'text-[#2a5585]' : 'text-black hover:bg-[#dceef5]'}`}
                                        onClick={() => {
                                            if (item.id === 'back') onClose();
                                            else if (item.id === 'create') onCreate?.();
                                            else onSelect(item.name, item.id);
                                        }}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                    >
                                        <span>{item.name}</span>
                                        {idx === selectedIndex && <span>↵</span>}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center text-gray-400 italic">No matches found</div>
                            )}
                        </div>
                    </div>
                </div>

                <TallySidebar>
                    {sidebarButtons.map((btn, index) => {
                        if (btn.label === 'SEPARATOR') return <div key={index} className="h-[1px] bg-[#99c7d6] my-0.5 mx-1" />;
                        if (btn.label === 'SPACER') return <div key={index} className="flex-1" />;
                        return <SidebarButton key={index} keyName={btn.keyName} label={btn.label} disabled={btn.disabled} />;
                    })}
                </TallySidebar>
            </div>

            <div className="bg-[#fcfcd0] h-[24px] flex items-center px-4 text-[12px] w-full border-t border-[#ccc] shrink-0 font-bold">
                <div className="flex items-center mr-6 cursor-pointer hover:bg-gray-200 px-1" onClick={onClose}>
                    <span className="text-[#1d5b6e]">Q</span>: Quit
                </div>
            </div>
        </div>
    );
};

export default TallyGodownAlteration;
