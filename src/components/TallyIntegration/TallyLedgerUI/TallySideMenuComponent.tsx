import React from 'react';
import type { TallyFormData } from './types';

interface TallySideMenuProps {
    activeMenu: string | null;
    formData: TallyFormData;
    handleMenuSelect: (field: string, value: string, nextFieldId: string | null) => void;
    groupList: string[];
}

const TallySideMenuComponent: React.FC<TallySideMenuProps> = ({
    activeMenu,
    formData,
    handleMenuSelect,
    groupList
}) => {
    if (activeMenu === 'invoiceMethod') {
        return (
            <div className="absolute top-[320px] left-0 w-60 border-[2px] border-[#004f91] bg-[#dcf1fc] shadow-lg text-black animate-in fade-in zoom-in duration-100 z-50 pointer-events-auto">
                <div className="bg-[#004f91] text-white px-2 py-1 font-bold text-base">List of Methods</div>
                <div className="flex flex-col text-base py-1">
                    {['Not Applicable', 'Appropriate by Qty', 'Appropriate by Value'].map((opt) => (
                        <div
                            key={opt}
                            className="px-2 py-0.5 cursor-pointer flex items-center hover:bg-[#ffc107] text-black"
                            onClick={() => handleMenuSelect('invoiceMethod', opt, formData.showStatutory ? 'hsnDetails' : null)}
                        >
                            <span className={`mr-2 w-3 inline-block text-center ${formData.invoiceMethod === opt ? 'visible' : 'invisible'}`}>♦</span>
                            {opt}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (activeMenu === 'gstRateDetails') {
        return (
            <div className="absolute top-[560px] left-0 w-72 border-[2px] border-[#004f91] bg-[#dcf1fc] shadow-lg text-black animate-in fade-in zoom-in duration-100 z-50 pointer-events-auto">
                <div className="bg-[#004f91] text-white px-2 py-1 font-bold text-base flex justify-between items-center">
                    <span>List of Actions</span>
                    <span className="text-[11px] font-normal cursor-pointer hover:underline">Show More</span>
                </div>
                <div className="flex flex-col text-base py-1">
                    <div
                        className="px-2 py-0.5 cursor-pointer flex items-center hover:bg-[#ffc107] text-black"
                        onClick={() => handleMenuSelect('gstRateDetails', 'As per Company/Group', 'gstSource')}
                    >
                        <span className="mr-2 w-3 inline-block text-center visible">♦</span>
                        As per Company/Group
                    </div>
                    <div
                        className={`px-2 py-0.5 cursor-pointer flex items-center hover:bg-[#ffc107]`}
                        onClick={() => handleMenuSelect('gstRateDetails', 'Specify Details Here', 'gstSource')}
                    >
                        <span className="mr-2 w-3 inline-block text-center invisible">♦</span>
                        Specify Details Here
                    </div>
                    <div
                        className={`px-2 py-0.5 cursor-pointer flex items-center hover:bg-[#ffc107]`}
                        onClick={() => handleMenuSelect('gstRateDetails', 'Specify Slab-Based Rates', 'gstSource')}
                    >
                        <span className="mr-2 w-3 inline-block text-center invisible">♦</span>
                        Specify Slab-Based Rates
                    </div>
                    <div
                        className={`px-2 py-0.5 cursor-pointer flex items-center hover:bg-[#ffc107]`}
                        onClick={() => handleMenuSelect('gstRateDetails', 'Use GST Classification', 'gstSource')}
                    >
                        <span className="mr-2 w-3 inline-block text-center invisible">♦</span>
                        Use GST Classification
                    </div>
                </div>
            </div>
        );
    }

    if (activeMenu === 'hsnDetails') {
        return (
            <div className="absolute top-[440px] left-0 w-72 border-[2px] border-[#004f91] bg-[#dcf1fc] shadow-lg text-black animate-in fade-in zoom-in duration-100 z-50 pointer-events-auto">
                <div className="bg-[#004f91] text-white px-2 py-1 font-bold text-base flex justify-between items-center">
                    <span>List of Actions</span>
                    <span className="text-[11px] font-normal cursor-pointer hover:underline">Show More</span>
                </div>
                <div className="flex flex-col text-base py-1">
                    <div
                        className="px-2 py-0.5 cursor-pointer flex items-center hover:bg-[#ffc107] text-black"
                        onClick={() => handleMenuSelect('hsnDetails', 'As per Company/Group', 'hsnSource')}
                    >
                        <span className="mr-2 w-3 inline-block text-center visible">♦</span>
                        As per Company/Group
                    </div>
                    <div
                        className={`px-2 py-0.5 cursor-pointer flex items-center hover:bg-[#ffc107]`}
                        onClick={() => handleMenuSelect('hsnDetails', 'Specify Details Here', 'hsnSource')}
                    >
                        <span className="mr-2 w-3 inline-block text-center invisible">♦</span>
                        Specify Details Here
                    </div>
                    <div
                        className={`px-2 py-0.5 cursor-pointer flex items-center hover:bg-[#ffc107]`}
                        onClick={() => handleMenuSelect('hsnDetails', 'Use GST Classification', 'hsnSource')}
                    >
                        <span className="mr-2 w-3 inline-block text-center invisible">♦</span>
                        Use GST Classification
                    </div>
                </div>
            </div>
        );
    }

    if (activeMenu === 'groupList') {
        return (
            <div className="absolute top-0 right-0 h-full w-full bg-[#dcf1fc] border-l-2 border-[#004f91] shadow-lg text-black animate-in fade-in slide-in-from-right duration-200 z-50 flex flex-col pointer-events-auto">
                <div className="bg-[#004f91] text-white px-2 py-1 font-bold text-base flex justify-between items-center">
                    <span>List of Groups</span>
                    <span className="text-sm cursor-pointer hover:underline">Create</span>
                </div>
                <div className="flex-1 overflow-y-auto p-1">
                    {groupList.map((group) => (
                        <div
                            key={group}
                            className={`px-2 py-0.5 cursor-pointer flex items-center hover:bg-[#ffc107] text-black ${formData.under === group ? 'bg-[#ffc107] ' : ''}`}
                            onClick={() => handleMenuSelect('under', group, 'mailingName')}
                        >
                            <span className="flex-1 text-sm font-medium truncate">{group}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (activeMenu === 'natureOfGroup') {
        return (
            <div className="absolute top-40 left-0 w-40 border-[2px] border-[#004f91] bg-[#dcf1fc] shadow-lg text-black animate-in fade-in zoom-in duration-100 z-50 pointer-events-auto">
                <div className="bg-[#004f91] text-white px-2 py-1 font-bold text-base">Nature of Group</div>
                <div className="flex flex-col text-base py-1">
                    {['Assets', 'Liabilities'].map((opt) => (
                        <div
                            key={opt}
                            className={`px-2 py-0.5 cursor-pointer flex items-center hover:bg-[#ffc107] text-black ${formData.nature === opt ? 'bg-[#ffc107]' : ''}`}
                            onClick={() => handleMenuSelect('nature', opt, 'subLedger')}
                        >
                            <span className="truncate">{opt}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

export default TallySideMenuComponent;
