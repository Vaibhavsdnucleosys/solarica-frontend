import { useState, useRef, useEffect } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';


interface Props {
    onClose: () => void;
}

const TallyPANCINDetails = ({ onClose }: Props) => {
    const [pan, setPan] = useState('');
    const [cin, setCin] = useState('');
    const [showQuitBox, setShowQuitBox] = useState(false);

    const panRef = useRef<HTMLInputElement>(null);
    const cinRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        panRef.current?.focus();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent, nextRef?: React.RefObject<HTMLInputElement | null>) => {
        if (e.key === 'Enter') {
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            } else {
                onClose();
            }
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox]);



    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black text-[13px] font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>PAN/CIN Details</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 bg-gray-400/20">
                <div className="bg-white border border-[#2a5585] shadow-2xl w-full max-w-[500px] flex flex-col font-sans overflow-hidden">
                    <div className="text-center py-2 text-[14px] font-bold text-black border-b border-gray-200 bg-gray-50 uppercase tracking-wide">
                        PAN/CIN Details
                    </div>
                    <div className="p-8 pb-12 flex flex-col gap-2">
                        <div className="flex items-center group cursor-pointer" onClick={() => panRef.current?.focus()}>
                            <label className="w-[180px] text-black text-[13px]">PAN/Income tax no.</label>
                            <span className="font-bold mr-2 text-[13px]"> :</span>
                            <input
                                ref={panRef}
                                type="text"
                                value={pan}
                                onChange={(e) => setPan(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, cinRef)}
                                className="bg-[#fcfcd0] text-black font-bold text-[13px] px-2 py-0.5 w-[220px] outline-none border border-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 rounded-sm"
                            />
                        </div>
                        <div className="flex items-center group cursor-pointer" onClick={() => cinRef.current?.focus()}>
                            <label className="w-[180px] text-black text-[13px]">Corporate Identity No. (CIN)</label>
                            <span className="font-bold mr-2 text-[13px]"> :</span>
                            <input
                                ref={cinRef}
                                type="text"
                                value={cin}
                                onChange={(e) => setCin(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e)}
                                className="bg-transparent text-black font-bold text-[13px] px-2 py-0.5 w-[220px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 rounded-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between p-2 bg-gray-100 border-t border-gray-300 px-6 text-[12px] shrink-0">
                        <div className="flex items-center cursor-pointer hover:bg-gray-200 px-2 py-1 rounded transition-colors" onClick={() => setShowQuitBox(true)}>
                            <span className="text-[#1d5b6e] font-bold mr-[1px]">Q</span>
                            <span className="text-gray-700">: Quit</span>
                        </div>
                        <div className="flex items-center cursor-pointer hover:bg-gray-200 px-2 py-1 rounded transition-colors" onClick={onClose}>
                            <span className="text-[#1d5b6e] font-bold mr-[1px]">A</span>
                            <span className="text-gray-700">: Accept</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quit Confirmation Overlay */}
            {showQuitBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowQuitBox(false)}>✕</button>
                    <div className="text-[15px] text-black font-bold mt-2 text-center">Quit ?</div>
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

export default TallyPANCINDetails;
