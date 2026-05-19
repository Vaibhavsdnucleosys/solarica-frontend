import React, { useState } from 'react';
import TallyHeader from './TallyHeader';
import { TallySelectionList } from './TallySelectionList';

interface TallyCompanyCreationProps {
    onClose: () => void;
    diskCompanies?: any[];
    setDiskCompanies?: (comps: any[]) => void;
    setOpenCompanies?: (comps: any[]) => void;
    setCurrentCompany?: (name: string) => void;
    initialShowFeatures?: boolean;
}

const TallyCompanyCreation: React.FC<TallyCompanyCreationProps> = ({
    onClose,
    diskCompanies = [],
    setDiskCompanies,
    setOpenCompanies,
    setCurrentCompany,
    initialShowFeatures = false
}) => {
    const [createCompanyName, setCreateCompanyName] = useState('');
    const [createMailingName, setCreateMailingName] = useState('');
    const [createStateValue, setCreateStateValue] = useState('Karnataka');
    const [createCountryValue, setCreateCountryValue] = useState('India');
    const [showStateList, setShowStateList] = useState(false);
    const [showCountryList, setShowCountryList] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showFeaturesModal, setShowFeaturesModal] = useState(initialShowFeatures);
    const [showFeaturesAccept, setShowFeaturesAccept] = useState(false);

    const stateList = ["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu", "Gujarat", "West Bengal", "Not Applicable"];
    const countryList = ["India", "United Kingdom", "United States", "UAE", "Singapore"];

    if (showFeaturesModal) {
        return (
            <div className="fixed inset-0 z-[100] bg-[#eaf4fa] flex flex-col font-sans">
                <div className="bg-[#1b5e6b] text-white h-8 flex items-center justify-between px-4 font-bold">
                    <span>Company Features Alteration</span>
                    <button className="hover:bg-red-500 px-2" onClick={() => setShowFeaturesModal(false)}>✕</button>
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto bg-white border border-gray-300 p-6 shadow-lg">
                        <div className="text-center mb-6">
                            <div className="text-lg font-bold">Company created successfully.</div>
                            <div className="italic text-gray-600">Enable the features as per your business needs.</div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 font-bold text-sm">
                            <div className="space-y-4">
                                <div className="text-[#1b5e6b] border-b border-gray-200 pb-1">Accounting</div>
                                <div className="flex justify-between"><span>Maintain Accounts</span><span>Yes</span></div>
                                <div className="flex justify-between"><span>Enable Bill-wise entry</span><span>Yes</span></div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-[#1b5e6b] border-b border-gray-200 pb-1">Taxation</div>
                                <div className="flex justify-between"><span>Enable Goods and Services Tax (GST)</span><span>Yes</span></div>
                            </div>
                        </div>
                        <div className="mt-10 flex justify-center">
                            <button
                                className="bg-[#feba35] px-6 py-2 font-bold border border-black hover:bg-[#ffe599]"
                                onClick={() => {
                                    if (showFeaturesAccept) {
                                        const newComp = { name: createCompanyName || 'New Company', number: '10002', period: '1-Apr-25 to 31-Mar-26' };
                                        if (setDiskCompanies) setDiskCompanies([...diskCompanies, newComp]);
                                        if (setOpenCompanies) setOpenCompanies([newComp]);
                                        if (setCurrentCompany) setCurrentCompany(newComp.name);
                                        onClose();
                                    } else {
                                        setShowFeaturesAccept(true);
                                    }
                                }}
                            >
                                Accept (Enter)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col font-sans text-black overflow-hidden">
            <TallyHeader isCreateMode={true} />

            <div className="flex justify-between items-center px-4 h-[22px] bg-[#dcecf5] border-b border-[#2d819b] text-black text-[13px] font-bold">
                <span>Company Creation</span>
                <span className="cursor-pointer hover:text-red-500 font-bold" onClick={onClose}>✕</span>
            </div>

            <div className="flex-1 p-8 overflow-y-auto font-bold text-[13px]">
                <div className="flex mb-4">
                    <label className="w-[200px]">Company Data Path</label>
                    <span className="mr-4">:</span>
                    <span className="font-normal">C:\Users\Public\TallyPrime\data</span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center">
                        <label className="w-[200px]">Company Name</label>
                        <span className="mr-4">:</span>
                        <input
                            type="text"
                            className="w-[300px] bg-transparent border-b border-transparent focus:bg-[#feba35] outline-none px-1"
                            value={createCompanyName}
                            onChange={(e) => setCreateCompanyName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-[200px]">Mailing Name</label>
                        <span className="mr-4">:</span>
                        <input
                            type="text"
                            className="w-[300px] bg-transparent focus:bg-[#feba35] outline-none px-1"
                            value={createMailingName}
                            onChange={(e) => setCreateMailingName(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-[200px]">State</label>
                        <span className="mr-4">:</span>
                        <input
                            type="text"
                            className="w-[200px] bg-transparent focus:bg-[#feba35] outline-none px-1"
                            value={createStateValue}
                            onFocus={() => setShowStateList(true)}
                            readOnly
                        />
                    </div>
                    {showStateList && (
                        <div className="ml-[220px]">
                            <TallySelectionList
                                title="List of States"
                                items={stateList}
                                selectedItem={createStateValue}
                                onSelect={(val) => { setCreateStateValue(val); setShowStateList(false); }}
                                onClose={() => setShowStateList(false)}
                            />
                        </div>
                    )}
                    <div className="flex items-center">
                        <label className="w-[200px]">Country</label>
                        <span className="mr-4">:</span>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-[200px] bg-transparent focus:bg-[#feba35] outline-none px-1"
                                value={createCountryValue}
                                onFocus={() => setShowCountryList(true)}
                                readOnly
                            />
                            {showCountryList && (
                                <div className="absolute top-0 left-[220px] z-[120]">
                                    <TallySelectionList
                                        title="List of Countries"
                                        items={countryList}
                                        selectedItem={createCountryValue}
                                        onSelect={(val) => { setCreateCountryValue(val); setShowCountryList(false); }}
                                        onClose={() => setShowCountryList(false)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-20 border-t border-gray-300 pt-4">
                    <button
                        className="bg-[#dceef5] border border-[#2d819b] px-4 py-1 hover:bg-[#2d819b] hover:text-white"
                        onClick={() => setShowAcceptModal(true)}
                    >
                        Create Company
                    </button>
                </div>
            </div>

            {showAcceptModal && (
                <div className="absolute bottom-10 right-10 z-[110] bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                    <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Accept?</div>
                    <div className="flex justify-around">
                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                            onClick={() => setShowFeaturesModal(true)} autoFocus>Yes</button>
                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                            onClick={() => setShowAcceptModal(false)}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TallyCompanyCreation;
