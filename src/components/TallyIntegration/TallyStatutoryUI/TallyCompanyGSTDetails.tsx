import { useState, useRef, useEffect } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';


interface Props {
    onClose: () => void;
}

const TallyCompanyGSTDetails = ({ onClose }: Props) => {
    const [hsnDetails, setHsnDetails] = useState('Not Defined');
    const [gstDetails, setGstDetails] = useState('Not Defined');

    // Config toggles
    const [showHsnSummary, setShowHsnSummary] = useState('All Sections');
    const [minLengthHsn, setMinLengthHsn] = useState('4');
    const [showGstAdvances, setShowGstAdvances] = useState('No');
    const [updateStatus, setUpdateStatus] = useState('No');
    const [setAlterDetails, setSetAlterDetails] = useState('No');

    // Threshold values
    const [threshold1, setThreshold1] = useState('50,000');
    const [threshold2, setThreshold2] = useState('50,000');
    const [thresholdType, setThresholdType] = useState('Value of Invoice');

    const [showActions, setShowActions] = useState(false);
    const [activeField, setActiveField] = useState<'hsn' | 'gst' | null>(null);

    const [showQuitBox, setShowQuitBox] = useState(false);

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
                    <span>Company GST Details</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Centered Main Box Container */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto custom-scrollbar bg-gray-400/20">
                <div className="bg-white border border-[#2a5585] shadow-2xl w-full max-w-[1000px] flex flex-col relative overflow-hidden my-auto">
                    <div className="text-center py-2 text-[14px] font-bold text-black border-b border-gray-200 bg-gray-50">
                        GST Rate and Other Details
                    </div>

                    <div className="flex p-8 pt-6 gap-8">
                        {/* Left Section */}
                        <div className="w-1/2 border-r border-gray-100 pr-8">
                            <div className="mb-8">
                                <div className="text-[12px] font-bold text-black mb-4 inline-block border-b border-gray-400">HSN/SAC & Related Details</div>
                                <div
                                    className={`flex items-center mb-1 cursor-pointer p-0.5 rounded transition-colors ${activeField === 'hsn' ? 'bg-[#fcfcd0] ring-1 ring-yellow-400' : 'hover:bg-blue-50'}`}
                                    onClick={() => { setActiveField('hsn'); setShowActions(true); }}
                                >
                                    <label className="w-[180px] text-black text-[12px]">HSN/SAC Details</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <div className="flex items-center flex-1">
                                        <span className="text-black text-[12px] mr-1">♦</span>
                                        <span className="text-black font-bold text-[12px]">{hsnDetails}</span>
                                    </div>
                                </div>
                                <div className="flex items-center mb-1 group">
                                    <label className="w-[180px] text-black text-[12px]">HSN/SAC</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <span className="text-black font-bold text-[12px]"></span>
                                </div>
                                <div className="flex items-center group">
                                    <label className="w-[180px] text-black text-[12px]">Description</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <span className="text-black font-bold text-[12px]"></span>
                                </div>
                            </div>

                            <div>
                                <div className="text-[12px] font-bold text-black mb-4 inline-block border-b border-gray-400">GST Rate & Related Details</div>
                                <div
                                    className={`flex items-center mb-1 cursor-pointer p-0.5 rounded transition-colors ${activeField === 'gst' ? 'bg-[#fcfcd0] ring-1 ring-yellow-400' : 'hover:bg-blue-50'}`}
                                    onClick={() => { setActiveField('gst'); setShowActions(true); }}
                                >
                                    <label className="w-[180px] text-black text-[12px]">GST Rate Details</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <div className="flex items-center flex-1">
                                        <span className="text-black text-[12px] mr-1">♦</span>
                                        <span className="text-black font-bold text-[12px]">{gstDetails}</span>
                                    </div>
                                </div>
                                <div className="flex items-center mb-1 group">
                                    <label className="w-[180px] text-black text-[12px]">Taxability Type</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <span className="text-black font-bold text-[12px]"></span>
                                </div>
                                <div className="flex items-center group">
                                    <label className="w-[180px] text-black text-[12px]">GST Rate</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <span className="text-black font-bold text-[12px] text-right w-[40px]">0 %</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="w-1/2 flex flex-col gap-1.5">
                            <div className="flex items-center text-[12px] justify-between group">
                                <label className="text-black">Threshold 1</label>
                                <div className="flex items-center">
                                    <span className="font-bold mr-2">:</span>
                                    <span className="font-bold w-[100px] text-right">{threshold1}</span>
                                </div>
                            </div>
                            <div className="flex items-center text-[12px] justify-between group">
                                <label className="text-black">Threshold 2</label>
                                <div className="flex items-center">
                                    <span className="font-bold mr-2">:</span>
                                    <span className="font-bold w-[100px] text-right">{threshold2}</span>
                                </div>
                            </div>
                            <div className="flex items-center text-[12px] justify-between mb-4 group">
                                <label className="text-black">Threshold type</label>
                                <div className="flex items-center">
                                    <span className="font-bold mr-2">:</span>
                                    <span className="font-bold text-[#2a5585]">{thresholdType}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2.5 mt-4 p-4 bg-blue-50/30 rounded border border-blue-100/50">
                                <div className="flex items-center text-[12px] justify-between group">
                                    <label className="text-black font-medium">Create HSN/SAC summary for</label>
                                    <div className="flex items-center">
                                        <span className="font-bold mr-2">:</span>
                                        <span className="font-bold text-[#2a5585]">{showHsnSummary}</span>
                                    </div>
                                </div>
                                <div className="flex items-start text-[12px] justify-between group">
                                    <label className="text-black ml-4 leading-tight max-w-[280px]">Minimum length of HSN/SAC (based on annual turnover)</label>
                                    <div className="flex items-center">
                                        <span className="font-bold mr-2">:</span>
                                        <span className="font-bold">{minLengthHsn}</span>
                                    </div>
                                </div>

                                <div className="flex items-center text-[12px] justify-between mt-2 group border-t border-gray-100 pt-3">
                                    <label className="text-black font-medium">Show GST Advances for adjustments in transaction</label>
                                    <div className="flex items-center">
                                        <span className="font-bold mr-2">:</span>
                                        <span className="font-bold">{showGstAdvances}</span>
                                    </div>
                                </div>
                                <div className="flex items-start text-[12px] justify-between group">
                                    <label className="text-black leading-tight max-w-[320px]">Update GST Status of Vouchers after Master Alteration (Set this to No, to update from GST Reports)</label>
                                    <div className="flex items-center">
                                        <span className="font-bold mr-2">:</span>
                                        <span className="font-bold">{updateStatus}</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-[12px] justify-between group border-t border-gray-100 pt-3">
                                    <label className="text-black font-medium">Set/Alter details for downloading GST Returns</label>
                                    <div className="flex items-center">
                                        <span className="font-bold mr-2">:</span>
                                        <span className="font-bold">{setAlterDetails}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Menu (Image 2 Overlay) */}
                    {showActions && (
                        <div className="absolute top-[180px] left-[50%] -translate-x-1/2 z-[200] w-[220px] bg-[#dbeff7] border border-[#2a5585] shadow-2xl rounded-sm">
                            <div className="bg-[#2a5585] text-white text-[12px] px-3 py-1 font-bold flex justify-between items-center">
                                <span>List of Actions</span>
                                <span className="cursor-pointer font-normal text-[10px] hover:text-red-300" onClick={() => setShowActions(false)}>✕</span>
                            </div>
                            <div className="flex flex-col py-0.5">
                                <div className="px-3 py-1 text-[11px] text-right italic text-gray-500 border-b border-gray-200 bg-gray-50">Show More</div>
                                <div
                                    className="px-3 py-2 bg-[#feba35] text-black text-[12px] font-bold cursor-pointer flex items-center hover:brightness-105"
                                    onClick={() => {
                                        if (activeField === 'hsn') setHsnDetails('Not Defined');
                                        else setGstDetails('Not Defined');
                                        setShowActions(false);
                                    }}
                                >
                                    <span className="mr-2">♦</span> Not Defined
                                </div>
                                <div
                                    className="px-3 py-2 text-black text-[12px] font-bold cursor-pointer hover:bg-white transition-colors"
                                    onClick={() => {
                                        if (activeField === 'hsn') setHsnDetails('Specify Details Here');
                                        else setGstDetails('Specify Details Here');
                                        setShowActions(false);
                                    }}
                                >
                                    Specify Details Here
                                </div>
                                <div
                                    className="px-3 py-2 text-black text-[12px] font-bold cursor-pointer hover:bg-white transition-colors border-t border-blue-100"
                                    onClick={() => {
                                        if (activeField === 'hsn') setHsnDetails('Use GST Classification');
                                        else setGstDetails('Use GST Classification');
                                        setShowActions(false);
                                    }}
                                >
                                    Use GST Classification
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end p-2 bg-[#f2f2f2] border-t border-gray-300 gap-4 shrink-0">
                        <button onClick={() => setShowQuitBox(true)} className="text-[#2a5585] font-bold text-[12px] px-4 py-1 cursor-pointer hover:bg-gray-200 rounded transition-colors group">
                            <span className="text-gray-500 group-hover:text-red-600 mr-2 font-normal">Q:</span> Quit
                        </button>
                    </div>
                </div>
            </div>

            {/* Accept Box Overlay */}
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

            {/* Footer */}
            <div className="bg-[#fcfcd0] h-[24px] flex items-center px-4 text-[12px] w-full border-t border-[#ccc] shrink-0">
                <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={() => setShowQuitBox(true)}>
                    <span className="text-[#1d5b6e] font-bold mr-[1px]">Q</span>
                    <span>: Quit</span>
                </div>
                <div className="flex-1" />
                <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={onClose}>
                    <span className="text-[#1d5b6e] font-bold mr-[1px]">A</span>
                    <span>: Accept</span>
                </div>
            </div>
        </div>
    );
};

export default TallyCompanyGSTDetails;
