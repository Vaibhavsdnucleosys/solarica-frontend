import { useState, useRef, useEffect } from 'react';

import TallySidebar from '../TallyCommon/TallySidebar';

const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px]">{keyName}</span>
        <span>: {label}</span>
    </div>
);

interface Props {
    onClose: () => void;
}

const TallyGSTClassificationCreation = ({ onClose }: Props) => {
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');

    // Statutory Details
    const [hsnDetails, setHsnDetails] = useState('Not Defined');
    const [gstDetails, setGstDetails] = useState('Not Defined');

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);

    // Refs
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef.current) nextRef.current.focus();
            else setShowAcceptBox(true);
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
                    <span>GST Classification Creation</span>
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
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={() => nameRef.current?.focus()}>
                        <label className="w-[120px] text-black text-[13px]">Name</label>
                        <span className="font-bold mr-2 text-[13px]">:</span>
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
                        <label className="w-[120px] text-black text-[13px] italic">(alias)</label>
                        <span className="font-bold mr-2 text-[13px]"> :</span>
                        <input
                            ref={aliasRef}
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') setShowAcceptBox(true);
                            }}
                            className="bg-transparent text-black italic text-[13px] px-1 w-[320px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* HSN/SAC Section */}
                    <div className="mb-8">
                        <div className="text-[13px] font-bold text-black border-b border-gray-400 mb-2 inline-block">HSN/SAC & Related Details</div>
                        <div className="flex items-center ml-2 group cursor-pointer">
                            <label className="w-[180px] text-black text-[13px]">HSN/SAC Details</label>
                            <span className="font-bold mr-2 text-[13px]"> :</span>
                            <div className="flex items-center">
                                <span className="text-black text-[13px] mr-1">♦</span>
                                <span className="text-black font-bold text-[13px]">{hsnDetails}</span>
                            </div>
                        </div>
                        <div className="flex items-center ml-2 group cursor-pointer">
                            <label className="w-[180px] text-black text-[13px]">HSN/SAC</label>
                            <span className="font-bold mr-2 text-[13px]"> :</span>
                            <span className="text-black font-bold text-[13px]"></span>
                        </div>
                        <div className="flex items-center ml-2 group cursor-pointer">
                            <label className="w-[180px] text-black text-[13px]">Description</label>
                            <span className="font-bold mr-2 text-[13px]"> :</span>
                            <span className="text-black font-bold text-[13px]"></span>
                        </div>
                    </div>

                    {/* GST Rate Section */}
                    <div className="mb-4">
                        <div className="text-[13px] font-bold text-black border-b border-gray-400 mb-2 inline-block">GST Rate & Related Details</div>
                        <div className="flex items-center ml-2 group cursor-pointer">
                            <label className="w-[180px] text-black text-[13px]">GST Rate Details</label>
                            <span className="font-bold mr-2 text-[13px]"> :</span>
                            <div className="flex items-center">
                                <span className="text-black text-[13px] mr-1">♦</span>
                                <span className="text-black font-bold text-[13px]">{gstDetails}</span>
                            </div>
                        </div>
                        <div className="flex items-center ml-2 group cursor-pointer">
                            <label className="w-[180px] text-black text-[13px]">Taxability Type</label>
                            <span className="font-bold mr-2 text-[13px]"> :</span>
                            <span className="text-black font-bold text-[13px]"></span>
                        </div>
                        <div className="flex items-center ml-2 group cursor-pointer">
                            <label className="w-[180px] text-black text-[13px]">GST Rate</label>
                            <span className="font-bold mr-2 text-[13px]"> :</span>
                            <span className="text-black font-bold text-[13px] text-right w-[40px]">0 %</span>
                        </div>
                    </div>
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
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                setShowAcceptBox(false);
                                nameRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            nameRef.current?.focus();
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

export default TallyGSTClassificationCreation;
