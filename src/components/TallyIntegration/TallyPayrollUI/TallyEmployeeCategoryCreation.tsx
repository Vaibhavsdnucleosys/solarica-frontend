import React, { useState, useRef, useEffect } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';

import { DEFAULT_COMPANY_ID } from '../../../services/accountingService';

const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px]">{keyName}</span>
        <span>: {label}</span>
    </div>
);

interface Props {
    onClose: () => void;
    initialMode?: 'Create' | 'Alter';
    initialName?: string;
    companyId?: string;
}

const TallyEmployeeCategoryCreation = ({ onClose, initialMode = 'Create', initialName = '', companyId = DEFAULT_COMPANY_ID }: Props) => {
    const [name, setName] = useState(initialName);
    const [alias, setAlias] = useState('');
    const [allocateRevenue, setAllocateRevenue] = useState('Yes');
    const [allocateNonRevenue, setAllocateNonRevenue] = useState('No');

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);

    // Refs for navigation
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const revenueRef = useRef<HTMLInputElement>(null);
    const nonRevenueRef = useRef<HTMLInputElement>(null);

    // Initialize with screenshot values if altering Primary Cost Category
    useEffect(() => {
        if (initialName === 'Primary Cost Category') {
            setAllocateRevenue('Yes');
            setAllocateNonRevenue('Yes');
        } else {
            // Defaults
            setAllocateRevenue('Yes');
            setAllocateNonRevenue('No');
        }
    }, [initialName]);


    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>, currentField?: string) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef.current) {
                nextRef.current.focus();
            } else {
                // If last field (allocateNonRevenue), show accept box
                setShowAcceptBox(true);
            }
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || showAcceptBox) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, showAcceptBox]);

    const toggleYesNo = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        setter(value === 'Yes' ? 'No' : 'Yes');
    };

    const handleYesNoKeyDown = (e: React.KeyboardEvent, setter: React.Dispatch<React.SetStateAction<string>>, value: string, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (e.key === ' ') {
                setter(value === 'Yes' ? 'No' : 'Yes');
            } else { // Enter
                if (nextRef.current) {
                    nextRef.current.focus();
                } else {
                    setShowAcceptBox(true);
                }
            }
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>Employee Category {initialMode === 'Alter' ? 'Alteration (Secondary)' : 'Creation'}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden h-full">
                <div className="flex-1 bg-white flex flex-col h-full overflow-y-auto border-r border-[#ccc] p-4 pt-2 custom-scrollbar">
                    {/* Name Field */}
                    <div className="flex items-center mb-1 group cursor-pointer">
                        <label className="w-[180px] text-black">Name</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={nameRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, aliasRef)}
                            className="bg-[#fcfcd0] text-black font-bold px-1 w-[320px] outline-none border border-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                            autoFocus
                        />
                    </div>

                    {/* Alias Field */}
                    <div className="flex items-center mb-10 group cursor-pointer">
                        <label className="w-[180px] text-black italic">(alias)</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={aliasRef}
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, revenueRef)}
                            className="bg-transparent text-black italic px-1 w-[320px] outline-none placeholder-gray-400 focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Allocate Revenue Items */}
                    <div className="flex items-center mb-1 group cursor-pointer">
                        <label className="w-[180px] text-black">Allocate Revenue Items</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={revenueRef}
                            type="text"
                            readOnly
                            value={allocateRevenue}
                            onClick={() => toggleYesNo(setAllocateRevenue, allocateRevenue)}
                            onKeyDown={(e) => handleYesNoKeyDown(e, setAllocateRevenue, allocateRevenue, nonRevenueRef)}
                            className="font-bold text-black px-1 min-w-[50px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none w-[60px]"
                        />
                    </div>

                    {/* Allocate Non-revenue items */}
                    <div className="flex items-center mb-1 group cursor-pointer">
                        <label className="w-[180px] text-black">Allocate Non-revenue items</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={nonRevenueRef}
                            type="text"
                            readOnly
                            value={allocateNonRevenue}
                            onClick={() => toggleYesNo(setAllocateNonRevenue, allocateNonRevenue)}
                            onKeyDown={(e) => handleYesNoKeyDown(e, setAllocateNonRevenue, allocateNonRevenue, { current: null })} // Finish
                            className="font-bold text-black px-1 min-w-[50px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none w-[60px]"
                        />
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
                                nonRevenueRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            nonRevenueRef.current?.focus();
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

export default TallyEmployeeCategoryCreation;
