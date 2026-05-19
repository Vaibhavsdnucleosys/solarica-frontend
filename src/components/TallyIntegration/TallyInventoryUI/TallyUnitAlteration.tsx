import { useState, useRef, useEffect } from 'react';
import TallySidebar, { SidebarButton } from '../TallyGroupUI/TallySidebar';
import { getUnits } from '../../../services/inventoryService';

interface Props {
    onClose: () => void;
    onSelect?: (name: string) => void;
    onCreate?: () => void;
    companyId?: string;
}

const TallyUnitAlteration = ({ onClose, onSelect, onCreate, companyId }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1); // -1 for "Create", -2 for "Back"
    const [units, setUnits] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUnits = async () => {
            if (!companyId) return;
            setLoading(true);
            try {
                const data = await getUnits(companyId);
                if (data && Array.isArray(data)) {
                    setUnits(data.map((u: any) => u.symbol));
                }
            } catch (err) {
                console.error("Failed to fetch units:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUnits();
    }, [companyId]);

    const filteredUnits = units.filter(u => u.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT') {
                    e.preventDefault();
                    onClose();
                }
            }
            if (e.key === 'ArrowDown') {
                setSelectedIndex(prev => {
                    if (prev === -2) return 0;
                    if (prev === -1) return -2;
                    return Math.min(prev + 1, filteredUnits.length - 1);
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
                else if (selectedIndex >= 0) {
                    onSelect?.(filteredUnits[selectedIndex]);
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, selectedIndex, filteredUnits.length, onCreate, onSelect]);

    return (
        <div
            className="fixed inset-0 z-[500] bg-black/40 flex items-center justify-center font-sans select-none"
            onClick={onClose}
        >
            <div
                className="bg-white border-2 border-[#2a5585] shadow-2xl w-[500px] flex flex-col relative"
                onClick={e => e.stopPropagation()}
            >
                <div className="py-1 text-center font-bold text-[#2a5585] text-[16px] underline decoration-1 underline-offset-4 relative">
                    Master Alteration
                    <span onClick={onClose} className="absolute right-2 top-1/2 -translate-y-1/2 text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2 transition-colors">✕</span>
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
                    <span>List of Units</span>
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

                <div className="min-h-[300px] max-h-[450px] overflow-y-auto bg-white border-b border-[#2a5585]">
                    {filteredUnits.length > 0 ? (
                        filteredUnits.map((unit, idx) => (
                            <div
                                key={idx}
                                className={`px-4 py-0.5 cursor-pointer text-[13px] font-bold flex justify-start items-center ${idx === selectedIndex ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#dceef5]'}`}
                                onClick={() => { onSelect?.(unit); onClose(); }}
                                onMouseEnter={() => setSelectedIndex(idx)}
                            >
                                {unit}
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



export default TallyUnitAlteration;
