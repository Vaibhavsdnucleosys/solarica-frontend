import { useState, useRef, useEffect } from 'react';
import TallySidebar, { SidebarButton } from '../TallyGroupUI/TallySidebar';
import { getStockGroups, StockGroupData } from '../../../services/inventoryService';
import { DEFAULT_COMPANY_ID } from '../../../services/accountingService';

interface Props {
    onClose: () => void;
    onSelect?: (name: string, id: string) => void;
    onCreate?: () => void;
    companyId?: string;
}

const TallyStockGroupAlteration = ({ onClose, onSelect, onCreate, companyId = DEFAULT_COMPANY_ID }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1); // -1 for "Create", -2 for "Back"
    const [groups, setGroups] = useState<StockGroupData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const compId = companyId || DEFAULT_COMPANY_ID;
                const data = await getStockGroups(compId);
                setGroups(data);
            } catch (error) {
                console.error("Failed to fetch stock groups:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGroups();
    }, [companyId]);

    const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    onClose();
                }
            }
            if (e.key === 'ArrowDown') {
                setSelectedIndex(prev => {
                    if (prev === -2) return 0;
                    if (prev === -1) return -2;
                    return Math.min(prev + 1, filteredGroups.length - 1);
                });
            }
            if (e.key === 'ArrowUp') {
                setSelectedIndex(prev => {
                    if (prev === 0) return -2;
                    if (prev === -2) return -1;
                    if (prev === -1) return prev;
                    return prev - 1;
                });
            }
            if (e.key === 'Enter') {
                if (selectedIndex === -1) onCreate?.();
                else if (selectedIndex === -2) onClose();
                else if (selectedIndex >= 0 && filteredGroups[selectedIndex]) {
                    onSelect?.(filteredGroups[selectedIndex].name, filteredGroups[selectedIndex].id || '');
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, selectedIndex, filteredGroups.length, onCreate, onSelect]);

    return (
        <div
            className="fixed inset-0 z-[500] bg-black/40 flex items-center justify-center font-sans select-none pointer-events-auto"
            onClick={onClose}
        >
            <div
                className="bg-white border-2 border-[#2a5585] shadow-2xl w-[500px] flex flex-col relative"
                onClick={e => e.stopPropagation()}
            >
                <div className="py-1 text-center font-bold text-[#2a5585] text-[16px] underline decoration-1 underline-offset-4 relative">
                    Master Alteration
                    <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                        <span onClick={onClose} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2 font-bold mb-4">✕</span>
                    </div>
                </div>

                <div className="px-2 pb-2">
                    <div className="bg-[#fffacd] border border-[#2a5585] h-[24px] flex items-center px-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setSelectedIndex(0); }}
                            autoFocus
                            className="bg-transparent border-none outline-none w-full font-bold text-black text-[13px]"
                        />
                    </div>
                </div>

                <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center text-[12px] font-bold">
                    <span>List of Stock Groups</span>
                    <div className="flex gap-4">
                        <span
                            className={`cursor-pointer ${selectedIndex === -1 ? 'text-[#feba35] underline' : ''}`}
                            onClick={onCreate}
                        >Create</span>
                        <span
                            className={`cursor-pointer ${selectedIndex === -2 ? 'text-[#feba35] underline' : ''}`}
                            onClick={onClose}
                        >Back</span>
                    </div>
                </div>

                <div className="min-h-[300px] max-h-[450px] overflow-y-auto bg-white border-b border-[#2a5585] custom-scrollbar">
                    {isLoading ? (
                        <div className="px-4 py-8 text-center text-gray-400 italic text-[13px]">
                            Loading...
                        </div>
                    ) : filteredGroups.length > 0 ? (
                        filteredGroups.map((group, idx) => (
                            <div
                                key={group.id}
                                className={`px-4 py-0.5 cursor-pointer text-[13px] font-bold flex justify-between items-center ${idx === selectedIndex ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#dceef5]'}`}
                                onClick={() => { onSelect?.(group.name, group.id || ''); onClose(); }}
                                onMouseEnter={() => setSelectedIndex(idx)}
                            >
                                <span>{group.name}</span>
                                {group.alias && <span className="text-gray-400 font-normal italic text-[11px]">({group.alias})</span>}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center text-gray-400 italic text-[13px]">
                            No matches found
                        </div>
                    )}
                </div>

                <div className="p-1 px-2 flex justify-end">
                    <span
                        className="text-[11px] font-bold text-[#2a5585] cursor-pointer hover:underline"
                        onClick={onClose}
                    >
                        Q: Quit
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TallyStockGroupAlteration;
