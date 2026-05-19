import React, { useState, useEffect } from 'react';
import TallyHeader from './TallyHeader';
import { TallySelectionList } from './TallySelectionList';
import { createCompany } from '../../../services/accountingService';

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
    const [createAddress, setCreateAddress] = useState('');
    const [createStateValue, setCreateStateValue] = useState('Karnataka');
    const [createCountryValue, setCreateCountryValue] = useState('India');
    const [createPincode, setCreatePincode] = useState('');
    const [createTelephone, setCreateTelephone] = useState('');
    const [createMobile, setCreateMobile] = useState('');
    const [createFax, setCreateFax] = useState('');
    const [createEmail, setCreateEmail] = useState('');
    const [createWebsite, setCreateWebsite] = useState('');

    // Dates
    const [createFinancialYearFrom, setCreateFinancialYearFrom] = useState('2025-04-01');
    const [createBooksBeginningFrom, setCreateBooksBeginningFrom] = useState('2025-04-01');

    // Currency
    const [createCurrencySymbol, setCreateCurrencySymbol] = useState('₹');
    const [createCurrencyFormalName, setCreateCurrencyFormalName] = useState('INR');

    const [showStateList, setShowStateList] = useState(false);
    const [showCountryList, setShowCountryList] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showFeaturesModal, setShowFeaturesModal] = useState(initialShowFeatures);
    const [showFeaturesAccept, setShowFeaturesAccept] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [createdCompanyData, setCreatedCompanyData] = useState<any>(null);

    const stateList = ["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu", "Gujarat", "West Bengal", "Not Applicable"];
    const countryList = ["India", "United Kingdom", "United States", "UAE", "Singapore"];

    // Auto-fill mailing name when company name changes
    const handleNameChange = (val: string) => {
        setCreateCompanyName(val);
        // Always sync mailing name as per user request
        setCreateMailingName(val);
    };

    const handleEnterNavigate = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const currentElement = e.target as HTMLElement;

            // Allow new lines in address textarea with Shift+Enter
            if (currentElement.tagName === 'TEXTAREA' && e.shiftKey) return;

            e.preventDefault();

            // Find all tabbable/focusable elements in the specific form container
            const container = document.getElementById('tally-form-container');
            if (!container) return;

            const formInputs = Array.from(container.querySelectorAll('input:not([type="hidden"]), textarea, select')) as HTMLElement[];
            const currentIndex = formInputs.indexOf(currentElement);

            if (currentIndex > -1 && currentIndex < formInputs.length - 1) {
                const nextElement = formInputs[currentIndex + 1];
                nextElement.focus();

                // If it's a text input, select the content
                if (nextElement instanceof HTMLInputElement) {
                    nextElement.select();
                }
            } else if (currentIndex === formInputs.length - 1) {
                // If it's the last field, show the accept modal
                setShowAcceptModal(true);
            }
        }
    };

    // Global Key Handling for Q: Quit
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showAcceptModal || showFeaturesModal || showStateList || showCountryList) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    onClose();
                }
            }

            if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
                e.preventDefault();
                setShowAcceptModal(true);
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showAcceptModal, showFeaturesModal, showStateList, showCountryList]);

    const handleCreateCompany = async () => {
        setIsLoading(true);
        try {
            const payload = {
                name: createCompanyName,
                legalName: createCompanyName,
                displayName: createCompanyName,
                addressLine1: createMailingName, // Using Mailing Name as primary address line for now, or we can map address textarea
                addressLine2: createAddress,
                city: '', // Could extract from address
                state: createStateValue,
                country: createCountryValue,
                pincode: createPincode,
                telephone: createTelephone,
                mobile: createMobile,
                fax: createFax,
                email: createEmail,
                website: createWebsite,

                financialYearFrom: new Date(createFinancialYearFrom).toISOString(),
                booksBeginningFrom: new Date(createBooksBeginningFrom).toISOString(),

                baseCurrency: createCurrencyFormalName,
                baseCurrencySymbol: createCurrencySymbol,
                baseCurrencyFormalName: createCurrencyFormalName
            };

            const response = await createCompany(payload);
            setCreatedCompanyData(response.data.company);
            setShowAcceptModal(false);
            setShowFeaturesModal(true);
        } catch (error: any) {
            console.error('Failed to create company:', error);
            alert(`Error creating company: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // ... features modal code remains same ...
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

    // Tally-like styles
    const labelStyle = "w-[200px] text-[#2d819b]"; // Tally uses a specific shade of blue/grey? No, usually black but label vs value. In image, labels are black.
    // The image labels are plain text. Let's stick to black font.
    const rowClass = "flex items-start mb-1";
    const labelClass = "w-[160px] text-black";
    const separatorClass = "mr-2";
    const inputClass = "bg-transparent border-b border-transparent focus:bg-[#feba35] outline-none px-1 w-[250px]";
    const dateInputClass = "bg-transparent border-b border-transparent focus:bg-[#feba35] outline-none px-1 w-[120px]";

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col font-sans text-black overflow-hidden select-none">
            <TallyHeader isCreateMode={true} />

            <div className="flex justify-between items-center px-4 h-[22px] bg-[#dcecf5] border-b border-[#2d819b] text-black text-[13px] font-bold">
                <span>Company Creation</span>
                <span className="cursor-pointer hover:text-red-500 font-bold" onClick={onClose}>✕</span>
            </div>

            <div id="tally-form-container" className="flex-1 p-8 overflow-y-auto text-[13px] font-bold relative bg-white">
                {/* Header Info */}
                <div className="flex mb-6 border-b border-dotted border-gray-400 pb-2">
                    <label className={labelClass}>Company Data Path</label>
                    <span className={separatorClass}>:</span>
                    <span className="font-normal">C:\Users\Public\TallyPrime\data</span>
                </div>

                {/* Main Split Layout */}
                <div className="flex gap-10">
                    {/* Left Column */}
                    <div className="flex-1 space-y-1">
                        <div className={rowClass}>
                            <label className={labelClass}>Company Name</label>
                            <span className={separatorClass}>:</span>
                            <input
                                type="text"
                                className={inputClass}
                                style={{ backgroundColor: '#fffec8' }} // Highlighted yellow in screenshot
                                value={createCompanyName}
                                onChange={(e) => handleNameChange(e.target.value)}
                                onKeyDown={handleEnterNavigate}
                                autoFocus
                            />
                        </div>
                        <div className={rowClass}>
                            <label className={labelClass}>Mailing Name</label>
                            <span className={separatorClass}>:</span>
                            <input
                                type="text"
                                className={inputClass}
                                value={createMailingName}
                                onChange={(e) => setCreateMailingName(e.target.value)}
                                onKeyDown={handleEnterNavigate}
                            />
                        </div>
                        <div className={rowClass}>
                            <label className={labelClass}>Address</label>
                            <span className={separatorClass}>:</span>
                            <textarea
                                className={`${inputClass} hover:bg-[#ffe599] resize-none h-16 align-top`}
                                value={createAddress}
                                onChange={(e) => setCreateAddress(e.target.value)}
                                onKeyDown={handleEnterNavigate}
                            />
                        </div>

                        <div className="h-4"></div> {/* Spacer */}

                        <div className={rowClass}>
                            <label className={labelClass}>State</label>
                            <span className={separatorClass}>:</span>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={createStateValue}
                                    onFocus={() => setShowStateList(true)}
                                    // readOnly
                                    onChange={(e) => setCreateStateValue(e.target.value)}
                                    onKeyDown={handleEnterNavigate}
                                />
                                {showStateList && (
                                    <div className="absolute top-0 left-full ml-2 z-[150] shadow-lg border border-black bg-white">
                                        <TallySelectionList
                                            title="List of States"
                                            items={stateList}
                                            selectedItem={createStateValue}
                                            onSelect={(val) => { setCreateStateValue(val); setShowStateList(false); }}
                                            onClose={() => setShowStateList(false)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={rowClass}>
                            <label className={labelClass}>Country</label>
                            <span className={separatorClass}>:</span>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`${inputClass} font-bold`}
                                    value={createCountryValue}
                                    onFocus={() => setShowCountryList(true)}
                                    onKeyDown={handleEnterNavigate}
                                    readOnly
                                />
                                {showCountryList && (
                                    <div className="absolute top-0 left-full ml-2 z-[150] shadow-lg border border-black bg-white">
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

                        <div className={rowClass}>
                            <label className={labelClass}>Pincode</label>
                            <span className={separatorClass}>:</span>
                            <input
                                type="text"
                                className={inputClass}
                                value={createPincode}
                                onChange={(e) => setCreatePincode(e.target.value)}
                                onKeyDown={handleEnterNavigate}
                            />
                        </div>
                        <div className={rowClass}>
                            <label className={labelClass}>Telephone</label>
                            <span className={separatorClass}>:</span>
                            <input
                                type="text"
                                className={inputClass}
                                value={createTelephone}
                                onChange={(e) => setCreateTelephone(e.target.value)}
                                onKeyDown={handleEnterNavigate}
                            />
                        </div>
                        <div className={rowClass}>
                            <label className={labelClass}>Mobile</label>
                            <span className={separatorClass}>:</span>
                            <div className="flex items-center">
                                <span className="mr-1 text-gray-500 font-normal">+91 -</span>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={createMobile}
                                    onChange={(e) => setCreateMobile(e.target.value)}
                                    onKeyDown={handleEnterNavigate}
                                />
                            </div>
                        </div>
                        <div className={rowClass}>
                            <label className={labelClass}>Fax</label>
                            <span className={separatorClass}>:</span>
                            <input
                                type="text"
                                className={inputClass}
                                value={createFax}
                                onChange={(e) => setCreateFax(e.target.value)}
                                onKeyDown={handleEnterNavigate}
                            />
                        </div>
                        <div className={rowClass}>
                            <label className={labelClass}>E-mail</label>
                            <span className={separatorClass}>:</span>
                            <input
                                type="text"
                                className={inputClass}
                                value={createEmail}
                                onChange={(e) => setCreateEmail(e.target.value)}
                                onKeyDown={handleEnterNavigate}
                            />
                        </div>
                        <div className={rowClass}>
                            <label className={labelClass}>Website</label>
                            <span className={separatorClass}>:</span>
                            <input
                                type="text"
                                className={inputClass}
                                value={createWebsite}
                                onChange={(e) => setCreateWebsite(e.target.value)}
                                onKeyDown={handleEnterNavigate}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 space-y-1 pl-4 border-l border-dotted border-gray-400">
                        <div className={rowClass}>
                            <label className="w-[200px]">Financial year beginning from</label>
                            <span className={separatorClass}>:</span>
                            <input
                                type="date"
                                className={dateInputClass}
                                value={createFinancialYearFrom}
                                onChange={(e) => setCreateFinancialYearFrom(e.target.value)}
                                onKeyDown={handleEnterNavigate}
                            />
                        </div>
                        <div className={rowClass}>
                            <label className="w-[200px]">Books beginning from</label>
                            <span className={separatorClass}>:</span>
                            <input
                                type="date"
                                className={dateInputClass}
                                value={createBooksBeginningFrom}
                                onChange={(e) => setCreateBooksBeginningFrom(e.target.value)}
                                onKeyDown={handleEnterNavigate}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Section - Base Currency */}
                <div className="mt-8 border-t border-gray-300 pt-2 space-y-1">
                    <div className={rowClass}>
                        <label className={labelClass}>Base Currency symbol</label>
                        <span className={separatorClass}>:</span>
                        <input
                            type="text"
                            className={inputClass}
                            value={createCurrencySymbol}
                            onChange={(e) => setCreateCurrencySymbol(e.target.value)}
                            onKeyDown={handleEnterNavigate}
                        />
                    </div>
                    <div className={rowClass}>
                        <label className={labelClass}>Formal name</label>
                        <span className={separatorClass}>:</span>
                        <input
                            type="text"
                            className={inputClass}
                            value={createCurrencyFormalName}
                            onChange={(e) => setCreateCurrencyFormalName(e.target.value)}
                            onKeyDown={handleEnterNavigate}
                        />
                    </div>
                </div>

                {/* Tally Actions Footer */}
                <div className="absolute bottom-4 right-4 text-[11px] flex gap-2">
                    <button
                        className="bg-[#dceef5] border border-[#2d819b] px-6 py-1 hover:bg-[#2d819b] hover:text-white"
                        onClick={() => setShowAcceptModal(true)}
                    >
                        Create
                    </button>
                </div>
            </div>

            {/* Footer Bar */}
            <div className="bg-[#f3f8fa] h-[30px] flex items-center px-2.5 text-[12px] w-full border-t border-[#ccc]">
                <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={onClose}>
                    <span className="text-[#1d5b6e] font-bold mr-[1px]">Q</span>
                    <span>: Quit</span>
                </div>
                <div className="flex-1"></div>
                <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={() => setShowAcceptModal(true)}>
                    <span className="text-[#1d5b6e] font-bold mr-[1px]">A</span>
                    <span>: Accept</span>
                </div>
            </div>

            {showAcceptModal && (
                <div className="absolute bottom-10 right-10 z-[110] bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                    <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Accept?</div>
                    <div className="flex justify-around">
                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                            onClick={handleCreateCompany} autoFocus disabled={isLoading}>{isLoading ? '...' : 'Yes'}</button>
                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                            onClick={() => setShowAcceptModal(false)} disabled={isLoading}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TallyCompanyCreation;
