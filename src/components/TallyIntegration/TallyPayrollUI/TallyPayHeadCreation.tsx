import React, { useState, useRef } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';
import TallyGroupCreation from '../TallyGroupUI/TallyGroupCreation';
import { createPayHead, updatePayHead, getPayHeads, DEFAULT_COMPANY_ID, deletePayHead } from '../../../services/accountingService';

const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px]">{keyName}</span>
        <span>: {label}</span>
    </div>
);

interface Props {
    onClose: () => void;
    companyId?: string;
    initialMode?: 'Create' | 'Alter';
    initialName?: string;
}

const TallyPayHeadCreation = ({
    onClose,
    companyId = DEFAULT_COMPANY_ID,
    initialMode = 'Create',
    initialName = ''
}: Props) => {
    const [isSaving, setIsSaving] = useState(false);
    const [allPayHeads, setAllPayHeads] = useState<any[]>([]);
    const [alterId, setAlterId] = useState<string | null>(null);

    // Top Section
    const [name, setName] = useState(initialName);
    const [alias, setAlias] = useState('');

    // Pay Head Information
    const [payHeadType, setPayHeadType] = useState('Earnings for Employees');
    const [incomeType, setIncomeType] = useState('Fixed');
    const [under, setUnder] = useState('Direct Expenses');
    const [affectNetSalary, setAffectNetSalary] = useState('Yes');
    const [payslipName, setPayslipName] = useState('');
    const [useGratuity, setUseGratuity] = useState('No');
    const [calculationType, setCalculationType] = useState('As User Defined Value');

    // Statutory and Computation Fields
    const [statutoryType, setStatutoryType] = useState<string>('');
    const [computeOn, setComputeOn] = useState<string>('Not Applicable');
    const [computePercentage, setComputePercentage] = useState<string>('');
    const [selectedComputePayHeadIds, setSelectedComputePayHeadIds] = useState<string[]>([]);

    // Bottom
    const [openingBalance, setOpeningBalance] = useState('');

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);
    const [showUnderList, setShowUnderList] = useState(false);
    const [selectedUnderIndex, setSelectedUnderIndex] = useState(0);
    const [showGroupCreation, setShowGroupCreation] = useState(false);
    const [showDeleteBox, setShowDeleteBox] = useState(false);

    const [showPayHeadTypeList, setShowPayHeadTypeList] = useState(false);
    const [selectedPayHeadTypeIndex, setSelectedPayHeadTypeIndex] = useState(0);

    const [showCalculationTypeList, setShowCalculationTypeList] = useState(false);
    const [selectedCalculationTypeIndex, setSelectedCalculationTypeIndex] = useState(0);

    const [showStatutoryTypeList, setShowStatutoryTypeList] = useState(false);
    const [selectedStatutoryTypeIndex, setSelectedStatutoryTypeIndex] = useState(0);

    const [showComputeOnList, setShowComputeOnList] = useState(false);
    const [selectedComputeOnIndex, setSelectedComputeOnIndex] = useState(0);

    const [showDependentHeadsList, setShowDependentHeadsList] = useState(false);
    const [selectedDependentHeadsIndex, setSelectedDependentHeadsIndex] = useState(0);

    const [showAffectNetSalaryList, setShowAffectNetSalaryList] = useState(false);
    const [selectedAffectNetSalaryIndex, setSelectedAffectNetSalaryIndex] = useState(0);

    const [showUseGratuityList, setShowUseGratuityList] = useState(false);
    const [selectedUseGratuityIndex, setSelectedUseGratuityIndex] = useState(0);

    // Lists
    const yesNoList = ['Yes', 'No'];

    const payHeadTypesList = [
        'Earnings for Employees',
        'Employees\' Statutory Deductions',
        'Employer\'s Statutory Contributions'
    ];

    const calculationTypesList = [
        'As Computed Value',
        'As User Defined Value',
        'Flat Rate',
        'On Attendance'
    ];

    const payHeadCategoriesList = [
        'Direct Expenses',
        'Indirect Expenses',
        'Misc. Expenses (ASSET)',
        'Current Assets',
        'Current Liabilities',
        'Fixed Assets',
        'Primary'
    ];

    const statutoryTypesList = [
        'EPF_EE',
        'EPF_ER',
        'EPS_ER',
        'PF_ADMIN',
        'EDLI',
        'EDLI_ADMIN',
        'PT'
    ];

    const computeOnList = [
        'On Specified Pay Heads',
        'On Current Earnings Total',
        'On Current Deductions Total',
        'Not Applicable'
    ];

    // Refs
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLInputElement>(null);
    const incomeRef = useRef<HTMLInputElement>(null);
    const underRef = useRef<HTMLDivElement>(null);
    const affectRef = useRef<HTMLInputElement>(null);
    const payslipRef = useRef<HTMLInputElement>(null);
    const gratuityRef = useRef<HTMLInputElement>(null);
    const calcRef = useRef<HTMLInputElement>(null);
    const statutoryRef = useRef<HTMLInputElement>(null);
    const computeOnRef = useRef<HTMLInputElement>(null);
    const percentageRef = useRef<HTMLInputElement>(null);
    const dependentRef = useRef<HTMLDivElement>(null);
    const balanceRef = useRef<HTMLInputElement>(null);

    const handleDelete = async () => {
        if (!alterId) return;
        setIsSaving(true);
        try {
            await deletePayHead(companyId, alterId);
            onClose();
        } catch (error: any) {
            console.error('Failed to delete pay head:', error);
            alert(`Failed to delete pay head: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    React.useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showAcceptBox || showQuitBox || showDeleteBox || showUnderList ||
                showPayHeadTypeList || showCalculationTypeList || showStatutoryTypeList ||
                showComputeOnList || showDependentHeadsList || showAffectNetSalaryList ||
                showUseGratuityList) return;

            if (e.altKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                if (initialMode === 'Alter') setShowDeleteBox(true);
            }
            if (e.key === 'd' || e.key === 'D') {
                if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                    if (initialMode === 'Alter') setShowDeleteBox(true);
                }
            }
            if (e.key.toLowerCase() === 'q') {
                if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showAcceptBox, showQuitBox, showDeleteBox, showUnderList, showPayHeadTypeList,
        showCalculationTypeList, showStatutoryTypeList, showComputeOnList,
        showDependentHeadsList, showAffectNetSalaryList, showUseGratuityList, initialMode]);

    React.useEffect(() => {
        const fetchPayHeads = async () => {
            try {
                // Reset dependent selections when company changes to prevent cross-company references
                setSelectedComputePayHeadIds([]);
                setAllPayHeads([]);

                const data = await getPayHeads(companyId);
                const heads = data || [];
                setAllPayHeads(heads);

                if (initialMode === 'Alter' && initialName) {
                    const head = heads.find((h: any) => h.name.toLowerCase() === initialName.toLowerCase());
                    if (head) {
                        setAlterId(head.id);
                        setName(head.name);
                        setAlias(head.alias || '');

                        const revTypeMapping: Record<string, string> = {
                            'EARNINGS_FOR_EMPLOYEES': 'Earnings for Employees',
                            'DEDUCTIONS_FROM_EMPLOYEES': 'Employees\' Statutory Deductions',
                            'EMPLOYERS_STATUTORY_CONTRIBUTIONS': 'Employer\'s Statutory Contributions'
                        };
                        setPayHeadType(revTypeMapping[head.payHeadType] || 'Earnings for Employees');
                        setIncomeType(head.incomeType === 'FIXED' ? 'Fixed' : 'Variable');
                        setUnder(head.under || 'Direct Expenses');
                        setAffectNetSalary(head.affectNetSalary ? 'Yes' : 'No');
                        setPayslipName(head.payslipDisplayName || '');
                        setUseGratuity(head.useForGratuity ? 'Yes' : 'No');

                        const revCalcMapping: Record<string, string> = {
                            'AS_COMPUTED_VALUE': 'As Computed Value',
                            'AS_USER_DEFINED_VALUE': 'As User Defined Value',
                            'FLAT_RATE': 'Flat Rate',
                            'ON_ATTENDANCE': 'On Attendance'
                        };
                        setCalculationType(revCalcMapping[head.calcType] || 'As User Defined Value');
                        setStatutoryType(head.statutoryType || '');

                        const revComputeMapping: Record<string, string> = {
                            'SPECIFIED_PAY_HEADS': 'On Specified Pay Heads',
                            'CURRENT_EARNINGS_TOTAL': 'On Current Earnings Total',
                            'CURRENT_DEDUCTIONS_TOTAL': 'On Current Deductions Total',
                            'NOT_APPLICABLE': 'Not Applicable'
                        };
                        setComputeOn(revComputeMapping[head.computeOn] || 'Not Applicable');
                        setComputePercentage(head.computePercentage?.toString() || '');
                        setSelectedComputePayHeadIds(head.computePayHeadIds || []);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch pay heads:', error);
            }
        };
        fetchPayHeads();
    }, [companyId, initialName, initialMode]);

    const closeAllLists = () => {
        setShowPayHeadTypeList(false);
        setShowUnderList(false);
        setShowCalculationTypeList(false);
        setShowStatutoryTypeList(false);
        setShowComputeOnList(false);
        setShowDependentHeadsList(false);
        setShowAffectNetSalaryList(false);
        setShowUseGratuityList(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            alert('Please enter a name for the pay head');
            return;
        }

        setIsSaving(true);
        try {
            // Map UI values to backend enums exactly as per schema.prisma
            const typeMapping: Record<string, string> = {
                'Earnings for Employees': 'EARNINGS_FOR_EMPLOYEES',
                'Employees\' Statutory Deductions': 'DEDUCTIONS_FROM_EMPLOYEES',
                'Employer\'s Statutory Contributions': 'EMPLOYERS_STATUTORY_CONTRIBUTIONS'
            };

            const calcMapping: Record<string, string> = {
                'As Computed Value': 'AS_COMPUTED_VALUE',
                'As User Defined Value': 'AS_USER_DEFINED_VALUE',
                'Flat Rate': 'FLAT_RATE',
                'On Attendance': 'ON_ATTENDANCE'
            };

            const computeOnMapping: Record<string, string> = {
                'On Specified Pay Heads': 'SPECIFIED_PAY_HEADS',
                'On Current Earnings Total': 'CURRENT_EARNINGS_TOTAL',
                'On Current Deductions Total': 'CURRENT_DEDUCTIONS_TOTAL',
                'Not Applicable': 'NOT_APPLICABLE'
            };

            const payload = {
                name,
                alias,
                payHeadType: typeMapping[payHeadType] || 'EARNINGS_FOR_EMPLOYEES',
                incomeType: incomeType.toUpperCase(),
                under,
                affectNetSalary: affectNetSalary === 'Yes',
                payslipName: payslipName || name,
                useGratuity: useGratuity === 'Yes',
                calcType: calcMapping[calculationType] || 'AS_USER_DEFINED_VALUE',
                openingBalance: statutoryType ? 0 : (parseFloat(openingBalance) || 0),
                statutoryType: statutoryType || null,
                computeOn: computeOnMapping[computeOn] || 'NOT_APPLICABLE',
                computePercentage: parseFloat(computePercentage) || null,
                computePayHeadIds: selectedComputePayHeadIds
            };

            if (initialMode === 'Alter' && alterId) {
                await updatePayHead(companyId, alterId, payload);
                console.log('Pay Head updated successfully');
            } else {
                await createPayHead(companyId, payload);
                console.log('Pay Head created successfully');
            }
            onClose();
        } catch (error: any) {
            console.error('Failed to create pay head:', error);
            alert(`Failed to save pay head: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={`flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px] ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Title Bar */}
            <TallyHeader />
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>{initialMode === 'Alter' ? 'Pay Head Alteration' : 'Pay Head Creation'}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden h-full relative">
                <div className="flex-1 bg-white flex flex-col h-full overflow-hidden border-r border-[#ccc] relative">
                    {/* Header Fields Section */}
                    <div className="p-4 border-b border-gray-300 relative bg-gray-50/30">
                        <div className="flex items-center mb-1 group cursor-pointer" onClick={() => nameRef.current?.focus()}>
                            <label className="w-[120px] text-black">Name</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                ref={nameRef}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, aliasRef)}
                                className="bg-[#fcfcd0] text-black font-bold px-1 w-[320px] outline-none border border-transparent focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                autoFocus
                                onFocus={closeAllLists}
                            />
                        </div>
                        <div className="flex items-center mb-1 group cursor-pointer" onClick={() => aliasRef.current?.focus()}>
                            <label className="w-[120px] text-black italic">(alias)</label>
                            <span className="font-bold mr-2"> :</span>
                            <input
                                ref={aliasRef}
                                type="text"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, typeRef)}
                                onFocus={closeAllLists}
                                className="bg-transparent text-black italic px-1 w-[320px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                            />
                        </div>

                        {/* Total Opening Balance Box (Top Right Contextual) */}
                        <div className="absolute top-2 right-4 border border-gray-300 w-[200px]">
                            <div className="bg-[#e8f6fa] text-[12px] font-bold text-black border-b border-gray-300 px-2 py-0.5 text-center">Total Opening Balance</div>
                            <div className="bg-white h-[40px]"></div>
                        </div>
                    </div>

                    {/* Pay Head Information Section */}
                    <div className="flex-1 p-4 pt-10 flex overflow-y-auto custom-scrollbar">
                        <div className="w-1/2 border-r border-gray-200 pr-4">
                            <div className="text-[13px] font-bold text-black border-b border-gray-400 mb-6 self-center px-12 inline-block">Pay Head Information</div>

                            <div className="flex items-center mb-4 group cursor-pointer" onClick={() => {
                                closeAllLists();
                                setShowPayHeadTypeList(true);
                                const idx = payHeadTypesList.indexOf(payHeadType);
                                setSelectedPayHeadTypeIndex(idx >= 0 ? idx : 0);
                            }}>
                                <label className="w-[180px] text-black">Pay head type</label>
                                <span className="font-bold mr-2"> :</span>
                                <input
                                    ref={typeRef}
                                    type="text"
                                    value={payHeadType}
                                    readOnly
                                    className="bg-transparent text-black font-bold px-1 flex-1 outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 cursor-pointer"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (statutoryRef.current) statutoryRef.current.focus();
                                            else incomeRef.current?.focus();
                                        }
                                        if (e.key === ' ') {
                                            e.preventDefault();
                                            closeAllLists();
                                            setShowPayHeadTypeList(true);
                                            const idx = payHeadTypesList.indexOf(payHeadType);
                                            setSelectedPayHeadTypeIndex(idx >= 0 ? idx : 0);
                                        }
                                        if (e.key === 'Escape') setShowQuitBox(true);
                                    }}
                                    onFocus={closeAllLists}
                                />
                            </div>

                            {['Employees\' Statutory Deductions', 'Employer\'s Statutory Contributions'].includes(payHeadType) && (
                                <div className="flex items-center mb-1 group cursor-pointer" onClick={() => {
                                    closeAllLists();
                                    setShowStatutoryTypeList(true);
                                    const idx = statutoryTypesList.indexOf(statutoryType);
                                    setSelectedStatutoryTypeIndex(idx >= 0 ? idx : 0);
                                }}>
                                    <label className="w-[180px] text-black">Statutory type</label>
                                    <span className="font-bold mr-2"> :</span>
                                    <input
                                        ref={statutoryRef}
                                        type="text"
                                        value={statutoryType}
                                        readOnly
                                        className="bg-[#fcfcd0] text-black font-bold px-1 flex-1 outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 cursor-pointer"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                incomeRef.current?.focus();
                                            }
                                            if (e.key === ' ') {
                                                e.preventDefault();
                                                closeAllLists();
                                                setShowStatutoryTypeList(true);
                                            }
                                        }}
                                        onFocus={closeAllLists}
                                    />
                                </div>
                            )}

                            <div className="flex items-center mb-1 group cursor-pointer">
                                <label className="w-[180px] text-black">Income type</label>
                                <span className="font-bold mr-2"> :</span>
                                <input
                                    ref={incomeRef}
                                    type="text"
                                    value={incomeType}
                                    onChange={(e) => setIncomeType(e.target.value)}
                                    // Focus Under div logic
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            underRef.current?.focus();
                                        }
                                        if (e.key === 'Escape') setShowQuitBox(true);
                                    }}
                                    onFocus={closeAllLists}
                                    className="bg-transparent text-black font-bold px-1 flex-1 outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                />
                            </div>

                            <div className="flex items-center mb-6 group cursor-pointer" onClick={() => {
                                closeAllLists();
                                setShowUnderList(true);
                                setSelectedUnderIndex(payHeadCategoriesList.indexOf(under));
                            }}>
                                <label className="w-[180px] text-black">Under</label>
                                <span className="font-bold mr-2"> :</span>
                                <div
                                    ref={underRef}
                                    tabIndex={0}
                                    className="flex items-center outline-none focus:bg-[#ffe599] px-1"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            affectRef.current?.focus();
                                        }
                                        if (e.key === ' ') {
                                            e.preventDefault();
                                            closeAllLists();
                                            setShowUnderList(true);
                                            setSelectedUnderIndex(payHeadCategoriesList.indexOf(under));
                                        }
                                    }}
                                    onFocus={closeAllLists}
                                >
                                    <span className="text-black mr-1">♦</span>
                                    <div className="text-black font-bold cursor-pointer">
                                        {under}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center mb-1 group cursor-pointer" onClick={() => {
                                closeAllLists();
                                setShowAffectNetSalaryList(true);
                                setSelectedAffectNetSalaryIndex(yesNoList.indexOf(affectNetSalary));
                            }}>
                                <label className="w-[180px] text-black">Affect net salary</label>
                                <span className="font-bold mr-2"> :</span>
                                <input
                                    ref={affectRef}
                                    type="text"
                                    value={affectNetSalary}
                                    readOnly
                                    className="bg-transparent text-black font-bold px-1 flex-1 outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 cursor-pointer"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            payslipRef.current?.focus();
                                        }
                                        if (e.key === ' ') {
                                            e.preventDefault();
                                            closeAllLists();
                                            setShowAffectNetSalaryList(true);
                                        }
                                    }}
                                    onFocus={closeAllLists}
                                />
                            </div>

                            <div className="flex items-center mb-1 ml-4 group cursor-pointer">
                                <label className="w-[164px] text-black">Name to be displayed in payslip</label>
                                <span className="font-bold mr-2"> :</span>
                                <input
                                    ref={payslipRef}
                                    type="text"
                                    value={payslipName}
                                    onChange={(e) => setPayslipName(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, gratuityRef)}
                                    onFocus={closeAllLists}
                                    className="bg-transparent text-black font-bold px-1 flex-1 outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                />
                            </div>

                            <div className="flex items-center mb-1 group cursor-pointer" onClick={() => {
                                closeAllLists();
                                setShowUseGratuityList(true);
                                setSelectedUseGratuityIndex(yesNoList.indexOf(useGratuity));
                            }}>
                                <label className="w-[180px] text-black">Use for calculation of gratuity</label>
                                <span className="font-bold mr-2"> :</span>
                                <input
                                    ref={gratuityRef}
                                    type="text"
                                    value={useGratuity}
                                    readOnly
                                    className="bg-transparent text-black font-bold px-1 flex-1 outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 cursor-pointer"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            calcRef.current?.focus();
                                        }
                                        if (e.key === ' ') {
                                            e.preventDefault();
                                            closeAllLists();
                                            setShowUseGratuityList(true);
                                        }
                                    }}
                                    onFocus={closeAllLists}
                                />
                            </div>

                            <div className="flex items-center mb-1 group cursor-pointer" onClick={() => {
                                closeAllLists();
                                setShowCalculationTypeList(true);
                                const idx = calculationTypesList.indexOf(calculationType);
                                setSelectedCalculationTypeIndex(idx >= 0 ? idx : 0);
                            }}>
                                <label className="w-[180px] text-black">Calculation type</label>
                                <span className="font-bold mr-2"> :</span>
                                <input
                                    ref={calcRef}
                                    type="text"
                                    value={calculationType}
                                    readOnly
                                    className="bg-transparent text-black font-bold cursor-pointer hover:bg-[#ffe599] px-1 w-[200px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (calculationType === 'As Computed Value') computeOnRef.current?.focus();
                                            else balanceRef.current?.focus();
                                        }
                                        if (e.key === ' ') {
                                            e.preventDefault();
                                            closeAllLists();
                                            setShowCalculationTypeList(true);
                                            const idx = calculationTypesList.indexOf(calculationType);
                                            setSelectedCalculationTypeIndex(idx >= 0 ? idx : 0);
                                        }
                                        if (e.key === 'Escape') setShowQuitBox(true);
                                    }}
                                    onFocus={closeAllLists}
                                />
                            </div>

                            {calculationType === 'As Computed Value' && (
                                <div className="ml-8 border-l-2 border-gray-200 pl-4 mt-2">
                                    <div className="flex items-center mb-1 group cursor-pointer" onClick={() => {
                                        closeAllLists();
                                        setShowComputeOnList(true);
                                        const idx = computeOnList.indexOf(computeOn);
                                        setSelectedComputeOnIndex(idx >= 0 ? idx : 0);
                                    }}>
                                        <label className="w-[172px] text-black italic">Compute on</label>
                                        <span className="font-bold mr-2"> :</span>
                                        <input
                                            ref={computeOnRef}
                                            type="text"
                                            value={computeOn}
                                            readOnly
                                            className="bg-transparent text-black font-bold px-1 flex-1 outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400 cursor-pointer"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (computeOn === 'On Specified Pay Heads') dependentRef.current?.focus();
                                                    else percentageRef.current?.focus();
                                                }
                                                if (e.key === ' ') {
                                                    e.preventDefault();
                                                    closeAllLists();
                                                    setShowComputeOnList(true);
                                                }
                                            }}
                                            onFocus={closeAllLists}
                                        />
                                    </div>

                                    {computeOn === 'On Specified Pay Heads' && (
                                        <div className="flex items-start mb-1 group cursor-pointer" onClick={() => {
                                            closeAllLists();
                                            setShowDependentHeadsList(true);
                                        }}>
                                            <label className="w-[172px] text-black italic mt-1">Dependent heads</label>
                                            <span className="font-bold mr-2 mt-1"> :</span>
                                            <div
                                                ref={dependentRef}
                                                tabIndex={0}
                                                className="flex-1 min-h-[24px] bg-transparent text-black font-bold px-1 outline-none focus:bg-[#ffe599] cursor-pointer"
                                                onKeyDown={(e) => {
                                                    if (e.key === ' ') {
                                                        e.preventDefault();
                                                        closeAllLists();
                                                        setShowDependentHeadsList(true);
                                                    }
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        percentageRef.current?.focus();
                                                    }
                                                }}
                                            >
                                                {selectedComputePayHeadIds.length === 0 ? (
                                                    <span className="text-gray-400">Select pay heads...</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1">
                                                        {selectedComputePayHeadIds.map(id => {
                                                            const ph = allPayHeads.find(p => p.id === id);
                                                            return (
                                                                <span key={id} className="bg-blue-100 px-1 border border-blue-300 rounded text-[11px]">
                                                                    {ph?.name || id}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center mb-1 group cursor-pointer">
                                        <label className="w-[172px] text-black italic">Percentage (%)</label>
                                        <span className="font-bold mr-2"> :</span>
                                        <input
                                            ref={percentageRef}
                                            type="text"
                                            value={computePercentage}
                                            onChange={(e) => setComputePercentage(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, balanceRef)}
                                            onFocus={closeAllLists}
                                            className="bg-transparent text-black font-bold px-1 w-[100px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-1/2"></div>
                    </div>

                    {/* Opening Balance Footer Section */}
                    {!statutoryType && (
                        <div className="border-t border-gray-300 p-1 bg-white">
                            <div className="flex items-center group cursor-pointer" onClick={() => balanceRef.current?.focus()}>
                                <label className="w-[280px] text-black font-bold text-center">Opening Balance</label>
                                <span className="text-black font-bold mr-4">( on 1-Apr-25 ) :</span>
                                <input
                                    ref={balanceRef}
                                    type="text"
                                    value={openingBalance}
                                    onChange={(e) => setOpeningBalance(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            setShowAcceptBox(true);
                                        }
                                        if (e.key === 'Escape') setShowQuitBox(true);
                                    }}
                                    onFocus={closeAllLists}
                                    className="bg-transparent text-black font-bold px-1 w-[200px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                />
                            </div>
                        </div>
                    )}

                    {/* Choice Lists (Existing & New) */}

                    {/* Affect Net Salary TST */}
                    {showAffectNetSalaryList && (
                        <div className="absolute top-[50%] left-[40%] w-[150px] z-[20000] border-2 border-[#2a5585] shadow-2xl bg-[#def1fc]">
                            <div className="bg-[#2a5585] text-white px-2 py-0.5 text-center text-[12px] font-bold">Options</div>
                            <div className="bg-white">
                                {yesNoList.map((val, idx) => (
                                    <div key={val} className={`px-2 py-0.5 cursor-pointer text-[13px] ${selectedAffectNetSalaryIndex === idx ? 'bg-[#fdb913] font-bold' : 'hover:bg-blue-50'}`}
                                        onClick={() => { setAffectNetSalary(val); setShowAffectNetSalaryList(false); payslipRef.current?.focus(); }}
                                        onMouseEnter={() => setSelectedAffectNetSalaryIndex(idx)}
                                    >{val}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Use Gratuity TST */}
                    {showUseGratuityList && (
                        <div className="absolute top-[60%] left-[40%] w-[150px] z-[20000] border-2 border-[#2a5585] shadow-2xl bg-[#def1fc]">
                            <div className="bg-[#2a5585] text-white px-2 py-0.5 text-center text-[12px] font-bold">Options</div>
                            <div className="bg-white">
                                {yesNoList.map((val, idx) => (
                                    <div key={val} className={`px-2 py-0.5 cursor-pointer text-[13px] ${selectedUseGratuityIndex === idx ? 'bg-[#fdb913] font-bold' : 'hover:bg-blue-50'}`}
                                        onClick={() => { setUseGratuity(val); setShowUseGratuityList(false); calcRef.current?.focus(); }}
                                        onMouseEnter={() => setSelectedUseGratuityIndex(idx)}
                                    >{val}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Under Selection List Modal - Floating Box */}
                    {showUnderList && (
                        <div className="absolute top-[40%] left-[40%] w-[350px] z-[20000] border-2 border-[#2a5585] shadow-2xl bg-[#def1fc]">
                            <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center text-[13px]">
                                <span className="font-bold">List of Pay Head Categories</span>
                                <span onClick={() => setShowUnderList(false)} className="cursor-pointer hover:bg-red-500 px-1">✕</span>
                            </div>
                            <div
                                className="bg-white max-h-[300px] overflow-y-auto outline-none"
                                tabIndex={0}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        setSelectedUnderIndex(prev => prev > 0 ? prev - 1 : payHeadCategoriesList.length - 1);
                                    } else if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setSelectedUnderIndex(prev => prev < payHeadCategoriesList.length - 1 ? prev + 1 : 0);
                                    } else if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (selectedUnderIndex >= 0) {
                                            setUnder(payHeadCategoriesList[selectedUnderIndex]);
                                            setShowUnderList(false);
                                            affectRef.current?.focus();
                                        }
                                    } else if (e.key === 'Escape') {
                                        setShowUnderList(false);
                                    }
                                }}
                            >
                                {payHeadCategoriesList.map((category, index) => (
                                    <div
                                        key={index}
                                        className={`px-2 py-0.5 cursor-pointer flex items-center justify-between text-[13px]
                                            ${selectedUnderIndex === index ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-50 text-black'}
                                        `}
                                        onClick={() => {
                                            setUnder(category);
                                            setShowUnderList(false);
                                            affectRef.current?.focus();
                                        }}
                                        onMouseEnter={() => setSelectedUnderIndex(index)}
                                    >
                                        <div className="flex items-center">
                                            {category === 'Primary' && <span className="mr-1 text-[10px]">♦</span>}
                                            <span>{category}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pay Head Type List Modal - Floating Box */}
                    {showPayHeadTypeList && (
                        <div className="absolute top-[20%] left-[40%] w-[350px] z-[20000] border-2 border-[#2a5585] shadow-2xl bg-[#def1fc]">
                            <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center text-[13px]">
                                <span className="font-bold">List of Pay Head Types</span>
                                <span onClick={() => setShowPayHeadTypeList(false)} className="cursor-pointer hover:bg-red-500 px-1">✕</span>
                            </div>
                            <div className="bg-white max-h-[300px] overflow-y-auto">
                                {payHeadTypesList.map((type, index) => (
                                    <div
                                        key={index}
                                        className={`px-2 py-0.5 cursor-pointer flex items-center justify-between text-[13px]
                                    ${selectedPayHeadTypeIndex === index ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-50 text-black'}
                                `}
                                        onClick={() => {
                                            setPayHeadType(type);
                                            setShowPayHeadTypeList(false);
                                            incomeRef.current?.focus();
                                        }}
                                        onMouseEnter={() => setSelectedPayHeadTypeIndex(index)}
                                    >
                                        <div className="flex items-center">
                                            <span>{type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Calculation Type List Modal - Floating Box */}
                    {showCalculationTypeList && (
                        <div className="absolute top-[50%] left-[40%] w-[350px] z-[20000] border-2 border-[#2a5585] shadow-2xl bg-[#def1fc]">
                            <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center text-[13px]">
                                <span className="font-bold">Type of Calculations</span>
                                <span onClick={() => setShowCalculationTypeList(false)} className="cursor-pointer hover:bg-red-500 px-1">✕</span>
                            </div>
                            <div className="bg-white max-h-[300px] overflow-y-auto">
                                {calculationTypesList.map((type, index) => (
                                    <div
                                        key={index}
                                        className={`px-2 py-0.5 cursor-pointer flex items-center justify-between text-[13px]
                                    ${selectedCalculationTypeIndex === index ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-100/50 text-black'}
                                `}
                                        onClick={() => {
                                            setCalculationType(type);
                                            setShowCalculationTypeList(false);
                                            balanceRef.current?.focus();
                                        }}
                                        onMouseEnter={() => setSelectedCalculationTypeIndex(index)}
                                    >
                                        <div className="flex items-center">
                                            <span>{type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Statutory Type List Modal */}
                    {showStatutoryTypeList && (
                        <div className="absolute top-[30%] left-[40%] w-[350px] z-[20000] border-2 border-[#2a5585] shadow-2xl bg-[#def1fc]">
                            <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center text-[13px]">
                                <span className="font-bold">Statutory Types</span>
                                <span onClick={() => setShowStatutoryTypeList(false)} className="cursor-pointer hover:bg-red-500 px-1">✕</span>
                            </div>
                            <div className="bg-white max-h-[300px] overflow-y-auto">
                                {statutoryTypesList.map((type, index) => (
                                    <div
                                        key={index}
                                        className={`px-2 py-0.5 cursor-pointer flex items-center justify-between text-[13px]
                                            ${selectedStatutoryTypeIndex === index ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-50 text-black'}
                                        `}
                                        onClick={() => {
                                            setStatutoryType(type);
                                            setShowStatutoryTypeList(false);
                                            incomeRef.current?.focus();
                                        }}
                                        onMouseEnter={() => setSelectedStatutoryTypeIndex(index)}
                                    >
                                        <span>{type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Compute On List Modal */}
                    {showComputeOnList && (
                        <div className="absolute top-[40%] left-[40%] w-[350px] z-[20000] border-2 border-[#2a5585] shadow-2xl bg-[#def1fc]">
                            <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center text-[13px]">
                                <span className="font-bold">Compute On</span>
                                <span onClick={() => setShowComputeOnList(false)} className="cursor-pointer hover:bg-red-500 px-1">✕</span>
                            </div>
                            <div className="bg-white max-h-[300px] overflow-y-auto">
                                {computeOnList.map((type, index) => (
                                    <div
                                        key={index}
                                        className={`px-2 py-0.5 cursor-pointer flex items-center justify-between text-[13px]
                                            ${selectedComputeOnIndex === index ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-50 text-black'}
                                        `}
                                        onClick={() => {
                                            setComputeOn(type);
                                            setShowComputeOnList(false);
                                            percentageRef.current?.focus();
                                        }}
                                        onMouseEnter={() => setSelectedComputeOnIndex(index)}
                                    >
                                        <span>{type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dependent Pay Heads List Modal (Multi-select) */}
                    {showDependentHeadsList && (
                        <div className="absolute top-[50%] left-[40%] w-[350px] z-[20000] border-2 border-[#2a5585] shadow-2xl bg-[#def1fc]">
                            <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center text-[13px]">
                                <span className="font-bold">Select Pay Heads</span>
                                <span onClick={() => setShowDependentHeadsList(false)} className="cursor-pointer hover:bg-red-500 px-1">✕</span>
                            </div>
                            <div className="bg-white max-h-[300px] overflow-y-auto">
                                {allPayHeads.map((ph, index) => (
                                    <div
                                        key={ph.id}
                                        className={`px-2 py-1 cursor-pointer flex items-center gap-2 text-[13px] border-b border-gray-100
                                            ${selectedComputePayHeadIds.includes(ph.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}
                                        `}
                                        onClick={() => {
                                            setSelectedComputePayHeadIds(prev =>
                                                prev.includes(ph.id) ? prev.filter(id => id !== ph.id) : [...prev, ph.id]
                                            );
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedComputePayHeadIds.includes(ph.id)}
                                            readOnly
                                            className="cursor-pointer"
                                        />
                                        <span className="text-black">{ph.name}</span>
                                        <span className="text-gray-500 text-[11px] ml-auto">({ph.payHeadType})</span>
                                    </div>
                                ))}
                                {allPayHeads.length === 0 && (
                                    <div className="p-4 text-center text-gray-400 italic">No pay heads found</div>
                                )}
                            </div>
                            <div className="bg-gray-100 p-2 flex justify-end">
                                <button
                                    className="bg-[#2a5585] text-white px-4 py-1 text-[12px] font-bold"
                                    onClick={() => setShowDependentHeadsList(false)}
                                >
                                    Done
                                </button>
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
                <FooterItem keyName="D" label="Delete" onClick={() => initialMode === 'Alter' && setShowDeleteBox(true)} />
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
                                balanceRef.current?.focus();
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={handleSave}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => {
                            setShowAcceptBox(false);
                            balanceRef.current?.focus();
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


            {/* Group Creation Modal */}
            {showGroupCreation && (
                <div className="fixed inset-0 z-[20000] bg-white">
                    <TallyGroupCreation onClose={() => setShowGroupCreation(false)} />
                </div>
            )}

            {showDeleteBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans text-black">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowDeleteBox(false)}>✕</button>
                    <div className="text-[15px] font-bold mt-2 text-red-600">Delete ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') handleDelete();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowDeleteBox(false);
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={handleDelete}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => setShowDeleteBox(false)}>No</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TallyPayHeadCreation;
