import React, { useState, useEffect } from 'react';
import TallyPayHeadCreation from './TallyPayHeadCreation';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';
import { getPayHeads, DEFAULT_COMPANY_ID } from '../../../services/accountingService';

interface TallyPayHeadListProps {
    onClose?: () => void;
    companyId?: string;
}

const TallyPayHeadList: React.FC<TallyPayHeadListProps> = ({ onClose, companyId = DEFAULT_COMPANY_ID }) => {
    const [showCreationModal, setShowCreationModal] = useState(false);
    const [payHeads, setPayHeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPayHeads = async () => {
        setLoading(true);
        try {
            const data = await getPayHeads(companyId);
            setPayHeads(data);
        } catch (error) {
            console.error('Failed to fetch pay heads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayHeads();
    }, [companyId]);

    const [selectedIndex, setSelectedIndex] = useState(0);

    // Keydown handler for shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showCreationModal) return;

            if (e.key === 'Escape') {
                if (onClose) onClose();
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, payHeads.length - 1)));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < payHeads.length - 1 ? prev + 1 : 0));
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                if (onClose) onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, showCreationModal, payHeads.length]);

    return (
        <div className="w-full h-full flex flex-row bg-[#e8f6fa] font-sans overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-[#8ec2eb] text-[#1b2c3c] px-4 py-0.5 flex justify-between items-center border-b border-[#5ea4d6] relative shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-[13px]">Chart of Accounts</span>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                        <span className="font-bold text-[13px]">Solarica</span>
                    </div>
                    <div className="flex items-center absolute right-[2px]">
                        <span onClick={onClose} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                    </div>
                </div>

                {/* Title Bar */}
                <div className="bg-white px-4 py-1 border-b border-gray-300">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-[13px]">List of Pay Heads</span>
                        <span className="text-[11px] text-gray-600">For 1-Apr-25</span>
                    </div>
                </div>

                {/* List Content */}
                <div className="flex-1 bg-white overflow-y-auto custom-scrollbar relative">
                    {/* Table Header Row Removed */}

                    {loading ? (
                        <div className="px-4 py-4 text-gray-500 italic">Loading...</div>
                    ) : payHeads.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-20">
                            <span className="font-bold text-[15px]">No pay heads found</span>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {payHeads.map((head, index) => (
                                <div
                                    key={index}
                                    className={`px-4 py-1 flex items-center cursor-pointer border-b border-gray-100 transition-colors
                                            ${selectedIndex === index ? 'bg-[#feba35] shadow-sm' : 'hover:bg-[#def1fc]/50'}
                                        `}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <div className="flex items-center gap-2 w-1/2">
                                        <span className={`text-[14px] font-bold ${selectedIndex === index ? 'text-black' : 'text-[#1b2c3c]'}`}>
                                            {head.name}
                                        </span>
                                        {head.statutoryType && (
                                            <span className={`text-[10px] px-1 rounded uppercase font-bold ${selectedIndex === index ? 'bg-black/20 text-black' : 'bg-blue-100 text-blue-800'}`}>
                                                {head.statutoryType}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-[13px] w-1/2 text-right pr-4 ${selectedIndex === index ? 'text-black font-bold' : 'text-gray-600 italic'}`}>
                                        {head.payHeadType || 'Earnings'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Status Bar */}
                <div className="bg-[#8ec2eb] border-t border-[#5ea4d6] px-4 py-1 flex justify-between">
                    <span className="text-[11px] font-bold text-black uppercase tracking-wider">{payHeads.length} Pay Heads</span>
                    <span className="text-[11px] font-bold text-black uppercase tracking-wider">{selectedIndex + 1} of {payHeads.length}</span>
                </div>

                <div className="bg-[#def1fc] border-t-2 border-[#2a5585] px-4 py-1 flex items-center gap-6 text-[11px]">
                    <span className="cursor-pointer hover:underline" onClick={onClose}><span className="text-[#2a5585] font-bold">Q</span>: Quit</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">Enter</span>: Alter</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">Space</span>: Select</span>
                    <span className="cursor-pointer hover:underline" onClick={onClose}><span className="text-[#2a5585] font-bold">A</span>: Accept</span>
                    <span className="cursor-pointer hover:underline" onClick={() => setShowCreationModal(true)}><span className="text-[#2a5585] font-bold">C</span>: Create Master</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">D</span>: Delete</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">R</span>: Remove Line</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">U</span>: Restore Line</span>
                    <span className="cursor-pointer hover:underline"><span className="text-[#2a5585] font-bold">F12</span>: Configure</span>
                </div>
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
            </TallySidebar>

            {showCreationModal && (
                <div className="fixed inset-0 z-[10000] bg-white">
                    <TallyPayHeadCreation
                        onClose={() => {
                            setShowCreationModal(false);
                            fetchPayHeads();
                        }}
                        companyId={companyId}
                    />
                </div>
            )}
        </div>
    );
};

export default TallyPayHeadList;
