import React, { useState } from 'react';
import TallyHeader from '../TallyCommon/TallyHeader';
import { TallySelectionList } from './TallySelectionList';
import TallySidebar from '../TallyCommon/TallySidebar';

interface TallyCompanyCreationProps {
    onClose: () => void;
    diskCompanies?: any[];
    setDiskCompanies?: (comps: any[]) => void;
    setOpenCompanies?: (comps: any[]) => void;
    setCurrentCompany?: (name: string) => void;
    onSuccess?: () => void;
}

const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center cursor-pointer hover:bg-black/5 px-2 py-0.5 rounded transition-colors group" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px] group-hover:text-blue-600">{keyName}</span>
        <span className="text-gray-700">: {label}</span>
    </div>
);

const TallyCompanyCreation: React.FC<TallyCompanyCreationProps> = ({
    onClose,
    diskCompanies = [],
    setDiskCompanies,
    setOpenCompanies,
    setCurrentCompany,
    onSuccess
}) => {
    const [createCompanyName, setCreateCompanyName] = useState('');
    const [createMailingName, setCreateMailingName] = useState('');
    const [createStateValue, setCreateStateValue] = useState('Karnataka');
    const [createCountryValue, setCreateCountryValue] = useState('India');
    const [showStateList, setShowStateList] = useState(false);
    const [showCountryList, setShowCountryList] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showQuitModal, setShowQuitModal] = useState(false);
    const [showCreationConfiguration, setShowCreationConfiguration] = useState(false);

    const stateList = [
        "Not Applicable", "Andaman & Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
        "Bihar", "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Goa",
        "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala",
        "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana"
    ];
    const countryList = ["India", "United Kingdom", "United States", "UAE", "Singapore"];

    const handleAccept = () => {
        if (!createCompanyName.trim()) return;
        const newComp = {
            name: createCompanyName,
            number: (10000 + diskCompanies.length).toString(),
            period: '1-Apr-25 to 31-Mar-26'
        };
        if (setDiskCompanies) setDiskCompanies([...diskCompanies, newComp]);
        if (setOpenCompanies) setOpenCompanies([newComp]);
        if (setCurrentCompany) setCurrentCompany(newComp.name);
        if (onSuccess) onSuccess();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !showAcceptModal && !showQuitModal) {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                const form = target.closest('div.space-y-4');
                if (form) {
                    const elements = Array.from(form.querySelectorAll('input, textarea')) as HTMLElement[];
                    const index = elements.indexOf(target);
                    if (index > -1 && index < elements.length - 1) {
                        e.preventDefault();
                        elements[index + 1].focus();
                    } else if (index === elements.length - 1) {
                        setShowAcceptModal(true);
                    }
                }
            }
        }
        if (e.key === 'Escape') {
            if (showAcceptModal) setShowAcceptModal(false);
            else if (showQuitModal) setShowQuitModal(false);
            else setShowQuitModal(true);
        }
    };

    const sidebarButtons: any[] = [
        { keyName: 'F2', label: 'Period', disabled: true },
        { keyName: 'F3', label: 'Company', disabled: true },
        { keyName: 'SPACER', label: 'SPACER' },
        { keyName: 'F12', label: 'Configure', onClick: () => setShowCreationConfiguration(true) },
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-[#f5f7f9] flex flex-col font-sans text-black overflow-hidden select-none" onKeyDown={handleKeyDown}>
            <TallyHeader onAction={(action) => action === 'quit' && setShowQuitModal(true)} />

            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-6 bg-[#88b5dd] text-black text-[13px] font-bold border-b border-[#2d819b] shrink-0">
                <span>Company Creation</span>
                <span className="cursor-pointer hover:bg-red-500 hover:text-white px-2 transition-colors font-bold" onClick={() => setShowQuitModal(true)}>✕</span>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div className="flex-1 p-8 overflow-y-auto font-bold text-[13px] relative bg-white">
                    {/* Path Info */}
                    <div className="flex mb-8 bg-gray-50 p-2 border border-gray-100 rounded-sm">
                        <label className="w-[180px] text-gray-500">Company Data Path</label>
                        <span className="mr-4 text-gray-400">:</span>
                        <span className="font-normal text-blue-800">C:\Users\Public\TallyPrime\data</span>
                    </div>

                    <div className="space-y-8">
                        {/* Split Section 1: Basic Info and Financial Period */}
                        <div className="flex w-full gap-[80px]">
                            {/* Left Side: Names */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center group">
                                    <label className="w-[180px] text-gray-700">Company Name</label>
                                    <span className="mr-4 text-gray-400">:</span>
                                    <input
                                        type="text"
                                        className="flex-1 bg-[#fcfcd0] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-0.5 border border-transparent rounded-sm font-black text-[14px] transition-all"
                                        value={createCompanyName}
                                        onChange={(e) => {
                                            setCreateCompanyName(e.target.value);
                                            setCreateMailingName(e.target.value);
                                        }}
                                        autoFocus
                                    />
                                </div>
                                <div className="flex items-center group">
                                    <label className="w-[180px] text-gray-700">Mailing Name</label>
                                    <span className="mr-4 text-gray-400">:</span>
                                    <input
                                        type="text"
                                        className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-0.5 border-b border-gray-100 rounded-sm font-bold text-[13px] transition-all"
                                        value={createMailingName}
                                        onChange={(e) => setCreateMailingName(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-start group">
                                    <label className="w-[180px] mt-1 text-gray-700">Address</label>
                                    <span className="mr-4 mt-1 text-gray-400">:</span>
                                    <textarea className="flex-1 h-[80px] bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-1 border border-gray-100 rounded-sm resize-none font-normal text-[13px] transition-all" />
                                </div>
                            </div>

                            {/* Right Side: Financial Info */}
                            <div className="w-[350px] space-y-3">
                                <div className="bg-blue-50/50 p-4 rounded border border-blue-100 space-y-3">
                                    <div className="text-[11px] text-blue-900 uppercase tracking-wider mb-2 border-b border-blue-100 pb-1">Period Details</div>
                                    <div className="flex items-center">
                                        <label className="flex-1 text-gray-700 font-medium">Financial year beginning from</label>
                                        <span className="mr-2 text-gray-400">:</span>
                                        <input type="text" defaultValue="1-Apr-25" className="w-[100px] bg-white border border-gray-200 focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-0.5 rounded-sm text-center" />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="flex-1 text-gray-700 font-medium">Books beginning from</label>
                                        <span className="mr-2 text-gray-400">:</span>
                                        <input type="text" defaultValue="1-Apr-25" className="w-[100px] bg-white border border-gray-200 focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-0.5 rounded-sm text-center" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Split Section 2: Contact Details */}
                        <div className="flex w-full gap-[80px]">
                            {/* Left Side: Location */}
                            <div className="flex-1 space-y-3">
                                <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">Location Details</div>
                                <div className="flex items-center relative">
                                    <label className="w-[180px] text-gray-700">State</label>
                                    <span className="mr-4 text-gray-400">:</span>
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-0.5 border-b border-gray-100 rounded-sm font-bold text-blue-900 cursor-pointer transition-all"
                                            value={createStateValue}
                                            onFocus={() => { setShowStateList(true); setShowCountryList(false); }}
                                            readOnly
                                        />
                                        {showStateList && (
                                            <div className="absolute top-0 left-full ml-4 z-[120] shadow-2xl">
                                                <TallySelectionList
                                                    title="List of States"
                                                    items={stateList}
                                                    selectedItem={createStateValue}
                                                    onSelect={(val) => { setCreateStateValue(val); setShowStateList(false); }}
                                                    onClose={() => setShowStateList(false)}
                                                    width="250px"
                                                    height="400px"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center relative">
                                    <label className="w-[180px] text-gray-700">Country</label>
                                    <span className="mr-4 text-gray-400">:</span>
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-0.5 border-b border-gray-100 rounded-sm font-bold transition-all"
                                            value={createCountryValue}
                                            onFocus={() => { setShowCountryList(true); setShowStateList(false); }}
                                            readOnly
                                        />
                                        {showCountryList && (
                                            <div className="absolute top-0 left-full ml-4 z-[120] shadow-2xl">
                                                <TallySelectionList
                                                    title="List of Countries"
                                                    items={countryList}
                                                    selectedItem={createCountryValue}
                                                    onSelect={(val) => { setCreateCountryValue(val); setShowCountryList(false); }}
                                                    onClose={() => setShowCountryList(false)}
                                                    width="200px"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <label className="w-[180px] text-gray-700">Pincode</label>
                                    <span className="mr-4 text-gray-400">:</span>
                                    <input type="text" className="w-[150px] bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-0.5 border-b border-gray-100 rounded-sm transition-all" />
                                </div>
                            </div>

                            {/* Right Side: Contact */}
                            <div className="flex-1 space-y-3">
                                <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">Contact Details</div>
                                <div className="flex items-center">
                                    <label className="w-[150px] text-gray-700">Telephone</label>
                                    <span className="mr-4 text-gray-400">:</span>
                                    <input type="text" className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-0.5 border-b border-gray-100 rounded-sm transition-all" />
                                </div>
                                <div className="flex items-center">
                                    <label className="w-[150px] text-gray-700">Mobile</label>
                                    <span className="mr-4 text-gray-400">:</span>
                                    <div className="flex-1 flex items-center">
                                        <span className="mr-2 text-gray-400 font-normal">+91 -</span>
                                        <input type="text" className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-0.5 border-b border-gray-100 rounded-sm transition-all" />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <label className="w-[150px] text-gray-700">E-mail</label>
                                    <span className="mr-4 text-gray-400">:</span>
                                    <input type="text" className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-0.5 border-b border-gray-100 rounded-sm transition-all font-normal text-blue-700 lowercase" />
                                </div>
                                <div className="flex items-center">
                                    <label className="w-[150px] text-gray-700">Website</label>
                                    <span className="mr-4 text-gray-400">:</span>
                                    <input type="text" className="flex-1 bg-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 outline-none px-2 py-0.5 border-b border-gray-100 rounded-sm transition-all font-normal text-blue-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-20" />

                    {/* Bottom Status Area */}
                    <div className="absolute bottom-0 left-0 w-full h-[40px] bg-[#9eacb4] border-t border-gray-400 flex items-center px-6 text-white text-[12px] font-bold shadow-inner">
                        <span className="uppercase tracking-widest">{createCompanyName || 'New Company'}</span>
                        <div className="flex-1" />
                        <span className="opacity-60 italic">Solarica ERP Foundation</span>
                    </div>
                </div>

                <div className="w-[100px] h-full bg-[#dcdcdc] border-l border-white overflow-hidden relative">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <div className="h-full w-full bg-[radial-gradient(#1b2c3c_1px,transparent_1px)] [background-size:20px_20px]" />
                    </div>
                </div>
            </div>

            {/* Bottom Footer Section */}
            <div className="bg-[#fcfcd0] h-[30px] flex items-center px-6 text-[12px] w-full border-t border-gray-300 shrink-0 shadow-sm z-[110]">
                <FooterItem keyName="Q" label="Quit" onClick={() => setShowQuitModal(true)} />
                <div className="flex-1" />
                <FooterItem keyName="A" label="Accept" onClick={() => setShowAcceptModal(true)} />
                <div className="flex-1" />
                <FooterItem keyName="F12" label="Configure" onClick={() => setShowCreationConfiguration(true)} />
            </div>

            <TallySidebar buttons={sidebarButtons} />

            {/* Accept Confirmation Box */}
            {showAcceptModal && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAcceptModal(false)}>✕</button>
                    <div className="text-[15px] text-black font-bold mt-2">Accept ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') handleAccept();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowAcceptModal(false);
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={handleAccept}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => setShowAcceptModal(false)}>No</span>
                    </div>
                </div>
            )}

            {/* Quit Confirmation Box */}
            {showQuitModal && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowQuitModal(false)}>✕</button>
                    <div className="text-[15px] text-black font-bold mt-2">Quit ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowQuitModal(false);
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => setShowQuitModal(false)}>No</span>
                    </div>
                </div>
            )}

            {/* Configuration Overlay */}
            {showCreationConfiguration && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all">
                    <div className="bg-white p-6 shadow-2xl border border-[#2a5585] w-[500px] font-sans rounded-sm transform scale-105 border-t-[4px]">
                        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                            <span className="text-[15px] font-black text-blue-900 uppercase">Configuration</span>
                            <span className="text-gray-400 cursor-pointer hover:text-red-500" onClick={() => setShowCreationConfiguration(false)}>✕</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center group bg-gray-50 p-2 rounded-sm cursor-pointer hover:bg-blue-50 transition-colors">
                                <span className="text-[13px] font-bold text-gray-700">Provide Contact Details</span>
                                <span className="text-[#1d5b6e] font-black">Yes</span>
                            </div>
                            <div className="flex justify-between items-center group bg-gray-50 p-2 rounded-sm cursor-pointer hover:bg-blue-50 transition-colors">
                                <span className="text-[13px] font-bold text-gray-700">Set Edit Log applicability</span>
                                <span className="text-red-600 font-black">No</span>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button className="bg-[#dceef5] hover:bg-[#2d819b] hover:text-white px-6 py-1.5 border border-[#2d819b] text-[#1d5b6e] font-bold text-[13px] transition-all" onClick={() => setShowCreationConfiguration(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TallyCompanyCreation;
