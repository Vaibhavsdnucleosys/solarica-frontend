import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createLedger, getAccountGroups, DEFAULT_COMPANY_ID } from '../../../services/accountingService';

interface Props {
    onClose: () => void;
    companyName?: string;
    companyId?: string;
    initialTotalDebit?: number;
    initialTotalCredit?: number;
    refreshData?: () => void;
    isLoading?: boolean;
}

const TallyLedgerCreation = ({
    onClose,
    companyName = 'Solarica',
    companyId = DEFAULT_COMPANY_ID,
    initialTotalDebit = 0,
    initialTotalCredit = 0,
    refreshData,
    isLoading = false
}: Props) => {
    // Basic Form State
    const [formData, setFormData] = useState({
        name: '',
        alias: '',
        under: 'Capital Account',
        mailingName: '', // Defaults to name in useEffect
        address: '',
        state: 'Maharashtra',
        country: 'India',
        pincode: '',
        bankAccountHolder: '', // Defaults to name
        bankAcNo: '',
        ifsCode: '',
        swiftCode: '',
        bankName: 'Not Applicable',
        branch: '',
        bankConfiguration: 'No',
        odLimit: '',
        gstin: '',
        pan: '',
        provideBankDetails: 'No',
        openingBalance: '',
        registrationType: 'Regular',
        setAlterGstDetails: 'No',
        tdsApplicable: 'No',
        natureOfPayment: '',
        tdsRate: '',
        tdsLimit: '',
        openingBalanceType: 'Dr' // Added for Dr/Cr selection
    });

    // UI Logic State
    const [showGroups, setShowGroups] = useState(false);
    const [showStates, setShowStates] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);
    const [showAcceptBox, setShowAcceptBox] = useState(false);

    // API State
    const [groupsList, setGroupsList] = useState<any[]>([]);
    // Removed companyId state in favor of DEFAULT_COMPANY_ID
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Added error state
    const [loading, setLoading] = useState(false);

    // Refs
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const mailingNameRef = useRef<HTMLInputElement>(null); // Added missing ref
    const underRef = useRef<HTMLInputElement>(null);
    const odLimitRef = useRef<HTMLInputElement>(null);
    const bankAcNoRef = useRef<HTMLInputElement>(null);
    const ifsCodeRef = useRef<HTMLInputElement>(null);
    const swiftCodeRef = useRef<HTMLInputElement>(null);
    const branchRef = useRef<HTMLInputElement>(null);
    const bankConfigRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const stateRef = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLInputElement>(null);
    const pincodeRef = useRef<HTMLInputElement>(null);
    const gstinRef = useRef<HTMLInputElement>(null);
    const panRef = useRef<HTMLInputElement>(null);
    const openingBalanceRef = useRef<HTMLInputElement>(null);
    const openingBalanceTypeRef = useRef<HTMLDivElement>(null);
    const bankDetailsRef = useRef<HTMLDivElement>(null);

    // DEBUG: Monitor incoming props
    useEffect(() => {
        console.log("TallyLedgerCreation Props Update:", {
            initialTotalDebit,
            initialTotalCredit,
            calculatedDr: ((initialTotalDebit || 0) + (formData.openingBalanceType === 'Dr' ? parseFloat(formData.openingBalance || '0') : 0)).toFixed(2),
            calculatedCr: ((initialTotalCredit || 0) + (formData.openingBalanceType === 'Cr' ? parseFloat(formData.openingBalance || '0') : 0)).toFixed(2)
        });
    }, [initialTotalDebit, initialTotalCredit, formData.openingBalance, formData.openingBalanceType]);

    useEffect(() => {
        const init = async () => {
            try {
                console.log(`DEBUG: Fetching groups for Company ${companyId}...`);
                // Use passed ID
                const groups = await getAccountGroups(companyId);
                if (Array.isArray(groups)) {
                    setGroupsList(groups);
                }
            } catch (e) {
                console.error("DEBUG: Failed to load groups", e);
                setError("Failed to load groups. Check console.");
            }
        };
        init();
    }, []);

    // Global Key Handling for Q: Quit
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || showAcceptBox || showGroups || showStates) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, showAcceptBox, showGroups, showStates]);

    // Sync mailing name and bank holder with ledger name if empty
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            mailingName: prev.mailingName || prev.name,
            bankAccountHolder: prev.bankAccountHolder || prev.name
        }));
    }, [formData.name]);

    const handleCreate = async () => {
        try {
            // Find Group ID
            const selectedGroup = groupsList.find(g => g.name.toLowerCase() === formData.under.toLowerCase());
            if (!selectedGroup) {
                alert("Please select a valid group.");
                underRef.current?.focus();
                return;
            }

            if (!formData.name.trim()) {
                alert("Ledger Name cannot be empty.");
                nameRef.current?.focus();
                return;
            }

            // Mapping for nature based on group
            const groupNatureMapping: { [key: string]: string } = {
                'Capital Account': 'LIABILITY', 'Bank Accounts': 'ASSET', 'Bank OD A/c': 'LIABILITY',
                'Bank OCC A/c': 'LIABILITY', 'Cash-in-Hand': 'ASSET', 'Current Assets': 'ASSET',
                'Current Liabilities': 'LIABILITY', 'Direct Expenses': 'EXPENSE', 'Direct Incomes': 'INCOME',
                'Duties & Taxes': 'LIABILITY', 'Fixed Assets': 'ASSET', 'Indirect Expenses': 'EXPENSE',
                'Indirect Incomes': 'INCOME', 'Investments': 'ASSET', 'Loans (Liability)': 'LIABILITY',
                'Loans & Advances (Asset)': 'ASSET', 'Misc. Expenses (ASSET)': 'ASSET', 'Provisions': 'LIABILITY',
                'Purchase Accounts': 'EXPENSE', 'Reserves & Surplus': 'LIABILITY', 'Sales Accounts': 'INCOME',
                'Secured Loans': 'LIABILITY', 'Sundry Creditors': 'LIABILITY', 'Sundry Debtors': 'ASSET',
                'Suspense A/c': 'LIABILITY', 'Unsecured Loans': 'LIABILITY',
            };

            const isBank = formData.under === 'Bank Accounts' || formData.under === 'Bank OD A/c' || formData.under === 'Bank OCC A/c';
            const isCash = formData.under === 'Cash-in-Hand';
            const isParty = formData.under === 'Sundry Debtors' || formData.under === 'Sundry Creditors';

            const payload = {
                name: formData.name,
                groupId: selectedGroup.id,
                description: formData.alias,
                openingBalance: parseFloat(formData.openingBalance || '0'),
                openingBalanceType: formData.openingBalanceType === 'Dr' ? 'DEBIT' : 'CREDIT',
                nature: groupNatureMapping[formData.under] || 'ASSET',

                // Details
                contactPerson: formData.mailingName,
                address: formData.address,
                gstin: formData.gstin,
                pan: formData.pan,

                // Banking
                bankName: formData.bankName,
                accountNumber: formData.bankAcNo,
                ifscCode: formData.ifsCode,
                branch: formData.branch,

                // Flags
                isBankAccount: isBank || formData.provideBankDetails === 'Yes',
                isCashAccount: isCash,
                isPartyAccount: isParty,

                // TDS Details
                tdsApplicable: formData.tdsApplicable === 'Yes',
                natureOfPayment: formData.natureOfPayment,
                tdsRate: formData.tdsRate,
                tdsLimit: formData.tdsLimit
            };

            await createLedger(companyId, payload);
            setSuccessMessage(`Ledger "${formData.name}" created successfully!`);

            // Reset form for next entry
            if (refreshData) refreshData();
            setTimeout(() => {
                setSuccessMessage(null);
                setFormData({
                    name: '', alias: '', under: 'Capital Account',
                    mailingName: '', address: '', state: 'Maharashtra', country: 'India', pincode: '',
                    bankAccountHolder: '', bankAcNo: '', ifsCode: '', swiftCode: '', bankName: 'Not Applicable',
                    branch: '', bankConfiguration: 'No', odLimit: '', gstin: '', pan: '',
                    provideBankDetails: 'No', openingBalance: '', registrationType: 'Regular',
                    setAlterGstDetails: 'No',
                    tdsApplicable: 'No', natureOfPayment: '', tdsRate: '', tdsLimit: '', openingBalanceType: 'Dr'
                });
                setShowAcceptBox(false);
                nameRef.current?.focus();
            }, 1000);

        } catch (error: any) {
            console.error("Creation Error:", error);
            setErrorMessage(error.message || "Failed to create ledger");
            setTimeout(() => setErrorMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    // Navigation Handlers
    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };

    const handleUnderKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setShowGroups(false);
            if (formData.under === 'Bank OD A/c' || formData.under === 'Bank OCC A/c') {
                setTimeout(() => odLimitRef.current?.focus(), 0);
            } else {
                // If Provide Bank Details flow logic is needed, add here.
                // For now jumping to Mailing Name or Bank details based on logic
                mailingNameRef.current?.focus();
                // OR bankDetailsRef if appropriate
            }
        }
    };

    const handleGroupSelect = (groupName: string) => {
        setFormData({ ...formData, under: groupName });
        setShowGroups(false);
        if (groupName === 'Bank OD A/c' || groupName === 'Bank OCC A/c') {
            setTimeout(() => odLimitRef.current?.focus(), 0);
        } else {
            // For simplicity, move to next logical field
            setTimeout(() => mailingNameRef.current?.focus(), 0);
        }
    };

    const states = [
        "Not Applicable", "Andaman & Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh",
        "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli and Daman & Diu",
        "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir",
        "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
        "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
        "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    return (
        <div className="flex flex-col h-full w-full bg-[#def1fc] font-sans text-sm select-none overflow-hidden relative">
            {/* Top Banner specific to Ledger Creation */}
            <div className="bg-[#8ec2eb] flex items-center justify-between px-2 py-0.5 border-b border-[#5ea4d6] shrink-0 relative">
                <div className="flex gap-4">
                    <span className="font-bold text-[#1b2c3c] text-xs">Ledger Creation</span>
                </div>
                <span className="font-bold text-[#1b2c3c] text-xs underline underline-offset-2 decoration-1">{companyName}</span>

                <div className="flex items-center">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2 transition-colors">✕</span>
                </div>
            </div>

            {/* Total Opening Balance Display - Absolute Positioned */}
            <div className="absolute top-0 right-0 flex flex-col items-end pr-2 pt-0.5 z-50 bg-[#8ec2eb]">
                <div className="font-bold text-[#1b2c3c] text-[10px]">Total Opening Balance</div>
                <div className="flex flex-col text-[11px] leading-tight text-right w-32 border bg-white border-gray-300 p-0.5 min-h-[50px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-[#1b2c3c] font-bold text-xs animate-pulse">
                            Calculating...
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-end gap-1">
                                <span className="font-bold">{((Number(initialTotalDebit) || 0) + (formData.openingBalanceType === 'Dr' ? parseFloat(formData.openingBalance || '0') : 0)).toFixed(2)}</span>
                                <span className="font-bold text-[#1b2c3c]">Dr</span>
                            </div>
                            <div className="flex justify-end gap-1">
                                <span className="font-bold">{((Number(initialTotalCredit) || 0) + (formData.openingBalanceType === 'Cr' ? parseFloat(formData.openingBalance || '0') : 0)).toFixed(2)}</span>
                                <span className="font-bold text-[#1b2c3c]">Cr</span>
                            </div>
                            <div className="border-t border-gray-400 my-0.5"></div>
                            <div className="flex justify-end gap-1">
                                <span className="font-bold text-[#1b2c3c] italic text-[10px] mr-auto">Difference</span>
                                <span className="font-bold">
                                    {Math.abs(
                                        ((Number(initialTotalDebit) || 0) + (formData.openingBalanceType === 'Dr' ? parseFloat(formData.openingBalance || '0') : 0)) -
                                        ((Number(initialTotalCredit) || 0) + (formData.openingBalanceType === 'Cr' ? parseFloat(formData.openingBalance || '0') : 0))
                                    ).toFixed(2)}
                                </span>
                                <span className="font-bold text-[#1b2c3c]">
                                    {((Number(initialTotalDebit) || 0) + (formData.openingBalanceType === 'Dr' ? parseFloat(formData.openingBalance || '0') : 0)) >
                                        ((Number(initialTotalCredit) || 0) + (formData.openingBalanceType === 'Cr' ? parseFloat(formData.openingBalance || '0') : 0)) ? 'Dr' : 'Cr'}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Form Area */}
                <div className="flex-1 bg-white flex flex-col relative h-full">

                    {/* Upper Section: Name & Alias */}
                    <div className="bg-[#def1fc] p-2 border-b border-white space-y-1 shrink-0">
                        <div className="flex items-center">
                            <label className="w-24 text-[#1b2c3c] font-semibold text-xs">Name</label>
                            <span className="mr-2">:</span>
                            <div className="bg-[#fcfcd0] border border-gray-400 px-1 w-96 flex">
                                <input
                                    ref={nameRef}
                                    className="bg-transparent w-full outline-none font-bold text-black"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    onKeyDown={(e) => handleKeyDown(e, aliasRef)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <label className="w-24 text-[#1b2c3c] font-medium text-xs italic">(alias)</label>
                            <span className="mr-2">:</span>
                            <div className="border border-transparent hover:border-gray-300 px-1 w-96">
                                <input
                                    ref={aliasRef}
                                    className="bg-transparent w-full outline-none italic text-gray-600"
                                    value={formData.alias}
                                    onChange={e => setFormData({ ...formData, alias: e.target.value })}
                                    onKeyDown={(e) => handleKeyDown(e, underRef)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Columns: Left & Right */}
                    <div className="flex flex-1 p-2 gap-4 overflow-y-auto relative">

                        {/* Left Column */}
                        <div className="w-1/2 flex flex-col gap-4">
                            {/* Under Group */}
                            <div className="flex flex-col">
                                <div className="flex">
                                    <label className="w-32 text-[#1b2c3c] font-semibold text-xs">Under</label>
                                    <span className="mr-2">:</span>
                                    <div className="flex flex-col relative w-64">
                                        <div className="bg-[#fcfcd0] border border-gray-400 px-1 flex">
                                            <input
                                                ref={underRef}
                                                className="bg-transparent w-full outline-none font-bold text-[#1b2c3c] cursor-pointer"
                                                value={formData.under}
                                                onFocus={() => setShowGroups(true)}
                                                onChange={e => {
                                                    setFormData({ ...formData, under: e.target.value });
                                                    setShowGroups(true);
                                                }}
                                                onKeyDown={handleUnderKeyDown}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* OD Limit Conditional Field */}
                                {(formData.under === 'Bank OD A/c' || formData.under === 'Bank OCC A/c') && (
                                    <div className="flex mt-1">
                                        <label className="w-32 text-[#1b2c3c] font-semibold text-xs">Set OD Limit</label>
                                        <span className="mr-2">:</span>
                                        <div className="w-32">
                                            <input
                                                ref={odLimitRef}
                                                className="outline-none bg-[#f2faff] px-1 w-full border border-transparent focus:border-blue-300"
                                                value={formData.odLimit}
                                                onChange={e => setFormData({ ...formData, odLimit: e.target.value })}
                                                onKeyDown={(e) => handleKeyDown(e, bankAcNoRef)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bank Account Details */}
                            <div className="mt-4">
                                <h3 className="font-bold text-[#1b2c3c] border-b border-gray-300 mb-2 w-max text-xs">Banking Details</h3>
                                <div className="flex items-center mb-1">
                                    <label className="w-32 text-[#1b2c3c] text-xs">Provide bank details</label>
                                    <span className="font-bold mr-2">:</span>
                                    <div
                                        ref={bankDetailsRef}
                                        className="font-bold text-black text-[13px] px-1 min-w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-dotted focus:outline-1"
                                        onClick={() => setFormData(prev => ({ ...prev, provideBankDetails: prev.provideBankDetails === 'No' ? 'Yes' : 'No' }))}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                if (e.key === ' ') setFormData(prev => ({ ...prev, provideBankDetails: prev.provideBankDetails === 'No' ? 'Yes' : 'No' }));
                                                bankAcNoRef.current?.focus();
                                            }
                                        }}
                                        tabIndex={0}
                                    >
                                        {formData.provideBankDetails}
                                    </div>
                                </div>

                                {formData.provideBankDetails === 'Yes' && (
                                    <div className="space-y-1 mt-2 pl-2 border-l-2 border-blue-100">
                                        <div className="flex">
                                            <label className="w-32 text-[#1b2c3c] text-xs">A/c Holder's Name</label>
                                            <span className="mr-2">:</span>
                                            <span className="font-bold text-[#1b2c3c]">{formData.bankAccountHolder}</span>
                                        </div>
                                        <div className="flex">
                                            <label className="w-32 text-[#1b2c3c] text-xs">A/c No.</label>
                                            <span className="mr-2">:</span>
                                            <input
                                                ref={bankAcNoRef}
                                                className="outline-none bg-[#f2faff] px-1 w-48 border border-transparent focus:border-blue-300"
                                                value={formData.bankAcNo}
                                                onChange={e => setFormData({ ...formData, bankAcNo: e.target.value })}
                                                onKeyDown={(e) => handleKeyDown(e, ifsCodeRef)}
                                            />
                                        </div>
                                        <div className="flex">
                                            <label className="w-32 text-[#1b2c3c] text-xs">IFS Code</label>
                                            <span className="mr-2">:</span>
                                            <input
                                                ref={ifsCodeRef}
                                                className="outline-none bg-[#f2faff] px-1 w-48 border border-transparent focus:border-blue-300"
                                                value={formData.ifsCode}
                                                onChange={e => setFormData({ ...formData, ifsCode: e.target.value })}
                                                onKeyDown={(e) => handleKeyDown(e, swiftCodeRef)}
                                            />
                                        </div>
                                        <div className="flex">
                                            <label className="w-32 text-[#1b2c3c] text-xs">SWIFT Code</label>
                                            <span className="mr-2">:</span>
                                            <input
                                                ref={swiftCodeRef}
                                                className="outline-none bg-[#f2faff] px-1 w-48 border border-transparent focus:border-blue-300"
                                                value={formData.swiftCode}
                                                onChange={e => setFormData({ ...formData, swiftCode: e.target.value })}
                                                onKeyDown={(e) => handleKeyDown(e, branchRef)}
                                            />
                                        </div>
                                        <div className="flex">
                                            <label className="w-32 text-[#1b2c3c] text-xs">Bank Name</label>
                                            <span className="mr-2">:</span>
                                            <span className="font-bold text-[#1b2c3c]">♦ Not Applicable</span>
                                        </div>
                                        <div className="flex">
                                            <label className="w-32 text-[#1b2c3c] text-xs">Branch</label>
                                            <span className="mr-2">:</span>
                                            <input
                                                ref={branchRef}
                                                className="outline-none bg-[#f2faff] px-1 w-48 border border-transparent focus:border-blue-300"
                                                value={formData.branch}
                                                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                                onKeyDown={(e) => handleKeyDown(e, bankConfigRef)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="w-1/2 flex flex-col gap-4 border-l border-gray-200 pl-4 relative">
                            {/* Mailing Details */}
                            {/* Mailing Details */}
                            <div>
                                <h3 className="font-bold text-[#1b2c3c] border-b border-gray-300 mb-2 w-max text-xs">Mailing Details</h3>
                                <div className="space-y-1">
                                    <div className="flex">
                                        <label className="w-24 text-[#1b2c3c] text-xs">Name</label>
                                        <span className="mr-2">:</span>
                                        <input
                                            ref={mailingNameRef}
                                            className="outline-none bg-[#f2faff] px-1 w-full border border-transparent focus:border-blue-300"
                                            value={formData.mailingName}
                                            onChange={e => setFormData({ ...formData, mailingName: e.target.value })}
                                            onKeyDown={(e) => handleKeyDown(e, addressRef)}
                                        />
                                    </div>
                                    <div className="flex">
                                        <label className="w-24 text-[#1b2c3c] text-xs">Address</label>
                                        <span className="mr-2">:</span>
                                        <textarea
                                            ref={addressRef}
                                            className="outline-none bg-[#f2faff] px-1 w-full h-12 resize-none border border-transparent focus:border-blue-300"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') { e.preventDefault(); stateRef.current?.focus(); }
                                            }}
                                        />
                                    </div>
                                    <div className="flex">
                                        <label className="w-24 text-[#1b2c3c] text-xs">State</label>
                                        <span className="mr-2">:</span>
                                        <div className="w-64 relative">
                                            <input
                                                ref={stateRef}
                                                className="outline-none bg-[#f2faff] px-1 w-full border border-transparent focus:border-blue-300 cursor-pointer"
                                                value={formData.state}
                                                onFocus={() => setShowStates(true)}
                                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') { e.preventDefault(); setShowStates(false); countryRef.current?.focus(); }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <label className="w-24 text-[#1b2c3c] text-xs">Country</label>
                                        <span className="mr-2">:</span>
                                        <input
                                            ref={countryRef}
                                            className="outline-none bg-[#f2faff] px-1 w-48 border border-transparent focus:border-blue-300"
                                            value={formData.country}
                                            onChange={e => setFormData({ ...formData, country: e.target.value })}
                                            onKeyDown={(e) => handleKeyDown(e, pincodeRef)}
                                        />
                                    </div>
                                    <div className="flex">
                                        <label className="w-24 text-[#1b2c3c] text-xs">Pincode</label>
                                        <span className="mr-2">:</span>
                                        <input
                                            ref={pincodeRef}
                                            className="outline-none bg-[#f2faff] px-1 w-32 border border-transparent focus:border-blue-300"
                                            value={formData.pincode}
                                            onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                                            onKeyDown={(e) => handleKeyDown(e, panRef)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tax Details */}
                            <div className="mt-4">
                                <h3 className="font-bold text-[#1b2c3c] border-b border-gray-300 mb-2 w-max text-xs">Tax Registration Details</h3>
                                <div className="space-y-1">
                                    <div className="flex">
                                        <label className="w-24 text-[#1b2c3c] text-xs">PAN/IT No.</label>
                                        <span className="mr-2">:</span>
                                        <input
                                            ref={panRef}
                                            className="outline-none bg-[#f2faff] px-1 w-48 border border-transparent focus:border-blue-300"
                                            value={formData.pan}
                                            onChange={e => setFormData({ ...formData, pan: e.target.value })}
                                            onKeyDown={e => handleKeyDown(e, gstinRef)}
                                        />
                                    </div>
                                    <div className="flex">
                                        <label className="w-24 text-[#1b2c3c] text-xs">GSTIN/UIN</label>
                                        <span className="mr-2">:</span>
                                        <input
                                            ref={gstinRef}
                                            className="outline-none bg-[#f2faff] px-1 w-48 border border-transparent focus:border-blue-300"
                                            value={formData.gstin}
                                            onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                                            onKeyDown={(e) => handleKeyDown(e, openingBalanceRef)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* TDS Details */}
                            <div className="mt-4">
                                <h3 className="font-bold text-[#1b2c3c] border-b border-gray-300 mb-2 w-max text-xs">Statutory Details</h3>
                                <div className="space-y-1">
                                    <div className="flex items-center">
                                        <label className="w-32 text-[#1b2c3c] text-xs">Is TDS Applicable ?</label>
                                        <span className="mr-2">:</span>
                                        <div
                                            className="font-bold text-black text-[13px] px-1 min-w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-dotted focus:outline-1"
                                            onClick={() => setFormData(prev => ({ ...prev, tdsApplicable: prev.tdsApplicable === 'Yes' ? 'No' : 'Yes' }))}
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === ' ' || e.key === 'Enter') {
                                                    setFormData(prev => ({ ...prev, tdsApplicable: prev.tdsApplicable === 'Yes' ? 'No' : 'Yes' }));
                                                }
                                            }}
                                        >
                                            {formData.tdsApplicable || 'No'}
                                        </div>
                                    </div>
                                    {formData.tdsApplicable === 'Yes' && (
                                        <>
                                            <div className="flex">
                                                <label className="w-32 text-[#1b2c3c] text-xs">Nature of Payment</label>
                                                <span className="mr-2">:</span>
                                                <input
                                                    className="outline-none bg-[#f2faff] px-1 w-48 border border-transparent focus:border-blue-300"
                                                    value={formData.natureOfPayment || ''}
                                                    onChange={e => setFormData({ ...formData, natureOfPayment: e.target.value })}
                                                    placeholder="e.g. Professional Fees"
                                                />
                                            </div>
                                            <div className="flex">
                                                <label className="w-32 text-[#1b2c3c] text-xs">TDS Rate (%)</label>
                                                <span className="mr-2">:</span>
                                                <input
                                                    className="outline-none bg-[#f2faff] px-1 w-16 border border-transparent focus:border-blue-300"
                                                    value={formData.tdsRate || ''}
                                                    onChange={e => setFormData({ ...formData, tdsRate: e.target.value })}
                                                    placeholder="10"
                                                />
                                            </div>
                                            <div className="flex">
                                                <label className="w-32 text-[#1b2c3c] text-xs">Exemption Limit</label>
                                                <span className="mr-2">:</span>
                                                <input
                                                    className="outline-none bg-[#f2faff] px-1 w-32 border border-transparent focus:border-blue-300"
                                                    value={formData.tdsLimit || ''}
                                                    onChange={e => setFormData({ ...formData, tdsLimit: e.target.value })}
                                                    placeholder="30000"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>


                            {/* States Popup List Removed from here */}

                        </div>


                        {/* Groups Popup List - Absolute Positioned */}
                        {showGroups && (
                            <div className="absolute top-0 right-0 bottom-0 w-[230px] bg-[#e8f6fa] border-l border-[#2d819b] shadow-lg flex flex-col z-50 font-sans">
                                <div className="bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold flex justify-between items-center shrink-0 border-b border-[#1b5e6b]">
                                    <span>List of Groups</span>
                                    <div onClick={() => setShowGroups(false)} className="cursor-pointer hover:bg-red-500 px-1">
                                        <X size={14} />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto bg-[#e8f6fa] select-none scrollbar-hide">
                                    {(() => {
                                        const search = formData.under.toLowerCase().trim();
                                        const exactMatch = groupsList.some(g => g.name.toLowerCase() === search);
                                        const displayList = exactMatch
                                            ? groupsList
                                            : groupsList.filter(g => g.name.toLowerCase().includes(search));

                                        if (displayList.length === 0) {
                                            return <div className="text-[12px] text-gray-500 p-2 italic">No groups found</div>;
                                        }

                                        return displayList.map((group) => (
                                            <div
                                                key={group.id}
                                                className={`px-2 py-[2px] text-[13px] cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${formData.under === group.name
                                                    ? 'bg-[#feba35] text-black font-bold border-b border-[#feba35]'
                                                    : 'hover:bg-[#dceef5] text-black border-b border-transparent'
                                                    }`}
                                                onClick={() => handleGroupSelect(group.name)}
                                            >
                                                {group.name}
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* States Popup List - Floating Absolute */}
                        {showStates && (
                            <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-64 bg-[#def1fc] border border-[#1b2c3c] shadow-lg flex flex-col z-50">
                                <div className="bg-[#2c455d] text-white px-2 py-1 text-xs font-bold flex justify-between items-center shrink-0">
                                    <span>List of States</span>
                                    <div onClick={() => setShowStates(false)} className="cursor-pointer">
                                        <X size={12} />
                                    </div>
                                </div>
                                <div className="h-48 overflow-y-auto p-1 bg-[#def1fc]">
                                    {states.map((state) => (
                                        <div
                                            key={state}
                                            className={`px-2 py-0.5 text-xs font-medium cursor-pointer hover:bg-[#f7f321] hover:text-black ${formData.state === state ? 'bg-[#f7f321] text-black' : 'text-[#1b2c3c]'}`}
                                            onClick={() => {
                                                setFormData({ ...formData, state: state });
                                                setShowStates(false);
                                                countryRef.current?.focus();
                                            }}
                                        >
                                            {state}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                    {/* Opening Balance Footer within form */}
                    <div className="border-t border-gray-300 bg-white p-2 flex justify-between items-center mt-auto shrink-0">
                        <div className="flex items-center">
                            <label className="font-bold text-[#1b2c3c] text-xs">Opening Balance</label>
                            <span className="mx-2 text-xs">( on 1-Apr-25 ) :</span>
                            <input
                                ref={openingBalanceRef}
                                className="outline-none bg-[#f0f0f0] px-1 w-32 border border-gray-300 focus:border-blue-300 text-right"
                                value={formData.openingBalance}
                                onChange={e => setFormData({ ...formData, openingBalance: e.target.value })}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        openingBalanceTypeRef.current?.focus();
                                    }
                                }}
                            />
                            <div
                                ref={openingBalanceTypeRef}
                                className="ml-1 text-xs font-bold cursor-pointer hover:bg-yellow-200 px-0.5 outline-none focus:bg-yellow-200"
                                tabIndex={0}
                                onClick={() => setFormData(prev => ({ ...prev, openingBalanceType: prev.openingBalanceType === 'Dr' ? 'Cr' : 'Dr' }))}
                                onKeyDown={(e) => {
                                    if (e.key.toLowerCase() === 'c') setFormData(prev => ({ ...prev, openingBalanceType: 'Cr' }));
                                    if (e.key.toLowerCase() === 'd') setFormData(prev => ({ ...prev, openingBalanceType: 'Dr' }));
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        setShowAcceptBox(true);
                                    }
                                }}
                            >
                                {formData.openingBalanceType}
                            </div>
                        </div>

                    </div>
                </div>


            </div>

            {/* Bottom Action Bar */}
            <div className="h-6 bg-[#def1fc] border-t border-[#88b5dd] flex items-center px-1 text-[11px] font-sans gap-0.5 shrink-0 w-full relative z-10">
                <button className="px-3 h-full hover:bg-[#f7f321] hover:text-black text-[#1b2c3c] flex items-center gap-1" onClick={() => setShowQuitBox(true)}>
                    <span className="text-[#d32f2f] font-bold">Q:</span> Quit
                </button>
                <div className="w-[1px] h-4 bg-gray-400 mx-1"></div>
                <button className="px-3 h-full hover:bg-[#f7f321] hover:text-black text-[#1b2c3c] flex items-center gap-1" onClick={() => setShowAcceptBox(true)}>
                    <span className="text-[#d32f2f] font-bold">A:</span> Accept
                </button>
                <div className="flex-1"></div>
            </div>

            {/* Accept Box Overlay */}
            {showAcceptBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                    <div className="text-[15px] text-black font-bold mt-2">Accept ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') handleCreate();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                setShowAcceptBox(false);
                                openingBalanceRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={handleCreate}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            openingBalanceRef.current?.focus();
                        }}>No</span>
                    </div>
                </div>
            )}

            {/* Quit Box Overlay */}
            {showQuitBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                    <div className="text-[15px] text-black font-bold mt-2">Quit ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none" tabIndex={0} autoFocus
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

export default TallyLedgerCreation;
