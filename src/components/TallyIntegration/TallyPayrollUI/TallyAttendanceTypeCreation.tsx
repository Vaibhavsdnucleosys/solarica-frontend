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

const TallyAttendanceTypeCreation = ({
    onClose,
    initialMode = 'Create',
    initialName = '',
    companyId = DEFAULT_COMPANY_ID,
}: Props) => {
    const [name, setName] = useState(initialName);
    const [alias, setAlias] = useState('');
    const [under, setUnder] = useState('Primary');
    const [attendanceType, setAttendanceType] = useState('Attendance / Leave with Pay');

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);
    const [showUnderList, setShowUnderList] = useState(false);
    const [selectedUnderIndex, setSelectedUnderIndex] = useState(0);
    const [showTypeOptions, setShowTypeOptions] = useState(false);
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
    const [showRecursiveCreation, setShowRecursiveCreation] = useState(false);

    // Mock data - replace with actual API call
    const attendanceTypesList = ['Primary'];
    const attendanceTypeOptions = ['Attendance / Leave with Pay', 'Leave without Pay'];

    // Refs for navigation

    // Refs for navigation
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const underRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLInputElement>(null);

    const closeAllLists = () => {
        setShowUnderList(false);
        setShowTypeOptions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            closeAllLists();
            if (nextRef.current) nextRef.current.focus();
            else setShowAcceptBox(true);
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || showAcceptBox || showUnderList || showTypeOptions) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, showAcceptBox, showUnderList, showTypeOptions]);

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>{initialMode === 'Alter' ? 'Attendance/Production Type Alteration' : 'Attendance/Production Type Creation'}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden h-full">
                <div className="flex-1 bg-white flex flex-col h-full overflow-y-auto border-r border-[#ccc] p-4 pt-2 custom-scrollbar relative" onClick={closeAllLists}>
                    {/* Name Field */}
                    <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); nameRef.current?.focus(); }}>
                        <label className="w-[120px] text-black">Name</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={nameRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, aliasRef)}
                            onFocus={closeAllLists}
                            className="bg-[#fcfcd0] text-black font-bold px-1 w-[320px] outline-none border border-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                            autoFocus
                        />
                    </div>
                    {/* Alias Field */}
                    <div className="flex items-center mb-10 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); aliasRef.current?.focus(); }}>
                        <label className="w-[120px] text-black italic">(alias)</label>
                        <span className="font-bold mr-2"> :</span>
                        <input
                            ref={aliasRef}
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, underRef)}
                            onFocus={closeAllLists}
                            className="bg-transparent text-black italic px-1 w-[320px] outline-none placeholder-gray-400 focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Under Field */}
                    <div className="flex items-center mb-8 group cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        closeAllLists();
                        setShowUnderList(true);
                        setSelectedUnderIndex(attendanceTypesList.indexOf(under));
                    }}>
                        <label className="w-[120px] text-black">Under</label>
                        <span className="font-bold mr-2"> :</span>
                        <div className="flex items-center">
                            <span className="text-black mr-1">♦</span>
                            <div
                                className="bg-transparent text-black font-bold px-1 w-[200px] outline-none cursor-pointer hover:bg-[#ffe599]"
                            >
                                {under}
                            </div>
                        </div>
                    </div>

                    {/* Attendance Type Field */}
                    <div className="flex items-center mb-8 group cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        closeAllLists();
                        setShowTypeOptions(true);
                        const idx = attendanceTypeOptions.indexOf(attendanceType);
                        setSelectedTypeIndex(idx >= 0 ? idx : 0);
                    }}>
                        <label className="w-[120px] text-black">Attendance type</label>
                        <span className="font-bold mr-2"> :</span>
                        <input
                            ref={typeRef}
                            type="text"
                            value={attendanceType}
                            readOnly
                            onFocus={closeAllLists}
                            className="bg-transparent text-black font-bold px-1 w-[300px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 cursor-pointer"
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    setShowTypeOptions(true);
                                    const idx = attendanceTypeOptions.indexOf(attendanceType);
                                    setSelectedTypeIndex(idx >= 0 ? idx : 0);
                                }
                            }}
                        />
                    </div>

                    {/* Under Selection List Modal - Side Panel Style */}
                    {showUnderList && (
                        <div className="fixed top-[52px] bottom-[26px] right-[100px] sm:right-[120px] lg:right-[140px] w-[400px] z-[10000] flex flex-col border-l border-black shadow-xl font-sans">
                            <div className="flex flex-col h-full bg-[#e8f6fa] border-l-2 border-[#2a5585]">
                                <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center">
                                    <span className="font-bold text-[13px]">List of Attendance/Production Types</span>
                                    <span onClick={() => setShowUnderList(false)} className="cursor-pointer hover:bg-red-500 px-1 text-[13px]">✕</span>
                                </div>
                                <div className="flex flex-1 overflow-hidden">
                                    <div
                                        className="flex-1 overflow-y-auto bg-[#e8f6fa] custom-scrollbar text-[13px]"
                                        tabIndex={0}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'ArrowUp') {
                                                e.preventDefault();
                                                setSelectedUnderIndex(prev => prev > -1 ? prev - 1 : attendanceTypesList.length - 1);
                                            } else if (e.key === 'ArrowDown') {
                                                e.preventDefault();
                                                setSelectedUnderIndex(prev => prev < attendanceTypesList.length - 1 ? prev + 1 : -1);
                                            } else if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (selectedUnderIndex === -1) {
                                                    setShowRecursiveCreation(true);
                                                } else {
                                                    setUnder(attendanceTypesList[selectedUnderIndex]);
                                                    setShowUnderList(false);
                                                }
                                            } else if (e.key === 'Escape') {
                                                setShowUnderList(false);
                                            }
                                        }}
                                    >
                                        <div
                                            className={`px-2 py-0.5 text-right cursor-pointer border-b border-gray-300
                                                ${selectedUnderIndex === -1 ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-100/50 text-black'}
                                            `}
                                            onClick={() => setShowRecursiveCreation(true)}
                                            onMouseEnter={() => setSelectedUnderIndex(-1)}
                                        >
                                            <span className="font-bold">Create</span>
                                        </div>
                                        {attendanceTypesList.map((type, index) => (
                                            <div
                                                key={index}
                                                className={`px-2 py-0.5 cursor-pointer flex items-center justify-between text-[13px]
                                            ${selectedUnderIndex === index ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-50 text-black'}
                                        `}
                                                onClick={() => {
                                                    setUnder(type);
                                                    setShowUnderList(false);
                                                }}
                                                onMouseEnter={() => setSelectedUnderIndex(index)}
                                            >
                                                <div className="flex items-center">
                                                    {type === 'Primary' && <span className="mr-1 text-[10px]">♦</span>}
                                                    <span>{type}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance Type Options List Modal */}
                    {showTypeOptions && (
                        <div className="fixed top-[52px] bottom-[26px] right-[100px] sm:right-[120px] lg:right-[140px] w-[400px] z-[10000] flex flex-col border-l border-black shadow-xl font-sans">
                            <div className="flex flex-col h-full bg-[#e8f6fa] border-l-2 border-[#2a5585]">
                                <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center">
                                    <span className="font-bold text-[13px]">List of Attendance Types</span>
                                    <span onClick={() => setShowTypeOptions(false)} className="cursor-pointer hover:bg-red-500 px-1 text-[13px]">✕</span>
                                </div>
                                <div className="flex flex-1 overflow-hidden">
                                    <div
                                        className="flex-1 overflow-y-auto bg-[#e8f6fa] custom-scrollbar text-[13px]"
                                        tabIndex={0}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'ArrowUp') {
                                                e.preventDefault();
                                                setSelectedTypeIndex(prev => prev > 0 ? prev - 1 : attendanceTypeOptions.length - 1);
                                            } else if (e.key === 'ArrowDown') {
                                                e.preventDefault();
                                                setSelectedTypeIndex(prev => prev < attendanceTypeOptions.length - 1 ? prev + 1 : 0);
                                            } else if (e.key === 'Enter') {
                                                e.preventDefault();
                                                setAttendanceType(attendanceTypeOptions[selectedTypeIndex]);
                                                setShowTypeOptions(false);
                                                setShowAcceptBox(true);
                                            } else if (e.key === 'Escape') {
                                                setShowTypeOptions(false);
                                            }
                                        }}
                                    >
                                        <div className="text-right px-2 italic text-[11px] text-gray-500 border-b border-gray-300">

                                        </div>
                                        {attendanceTypeOptions.map((type, index) => (
                                            <div
                                                key={index}
                                                className={`px-2 py-0.5 cursor-pointer flex items-center justify-between text-[13px]
                                            ${selectedTypeIndex === index ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-100/50 text-black'}
                                        `}
                                                onClick={() => {
                                                    setAttendanceType(type);
                                                    setShowTypeOptions(false);
                                                    setShowAcceptBox(true);
                                                }}
                                                onMouseEnter={() => setSelectedTypeIndex(index)}
                                            >
                                                <div className="flex items-center">
                                                    <span className="mr-1 text-[10px]">♦</span>
                                                    <span>{type}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
            {
                showAcceptBox && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                        <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAcceptBox(false)}>✕</button>
                        <div className="text-[15px] text-black font-bold mt-2">Accept ?</div>
                        <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                            onKeyDown={(e) => {
                                if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                                if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                    setShowAcceptBox(false);
                                    typeRef.current?.focus();
                                }
                            }}
                        >
                            <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                            <span className="cursor-pointer hover:underline" onClick={() => {
                                setShowAcceptBox(false);
                                typeRef.current?.focus();
                            }}>No</span>
                        </div>
                    </div>
                )
            }

            {/* Quit Box Overlay */}
            {
                showQuitBox && (
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
                )
            }


            {/* Recursive Creation Modal */}
            {
                showRecursiveCreation && (
                    <div className="fixed inset-0 z-[20000] bg-white">
                        <TallyAttendanceTypeCreation onClose={() => setShowRecursiveCreation(false)} />
                    </div>
                )
            }
        </div >
    );
};

export default TallyAttendanceTypeCreation;
