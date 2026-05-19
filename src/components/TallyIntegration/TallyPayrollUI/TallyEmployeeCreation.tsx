import React, { useState, useRef, useEffect } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';
import { createPayrollEmployee, getEmployeeGroups, DEFAULT_COMPANY_ID, getPayrollEmployees, updatePayrollEmployee, getPayrollConfig, updateStatutoryConfig, deletePayrollEmployee } from '../../../services/accountingService';
import TallyEmployeeGroupCreation from './TallyEmployeeGroupCreation';

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

const TallyEmployeeCreation = ({
    onClose,
    companyId = DEFAULT_COMPANY_ID,
    initialMode = 'Create',
    initialName = ''
}: Props) => {

    const [isSaving, setIsSaving] = useState(false);
    const [employeeId, setEmployeeId] = useState<string | null>(null);
    const [employeeGroups, setEmployeeGroups] = useState<string[]>(['Primary']);
    const [allGroups, setAllGroups] = useState<any[]>([]);

    const fetchGroups = async () => {
        try {
            const groups = await getEmployeeGroups(companyId);
            setAllGroups(groups || []);
            if (groups && groups.length > 0) {
                setEmployeeGroups(['Primary', ...groups.map((g: any) => g.name)]);
            } else {
                setEmployeeGroups(['Primary']);
            }
        } catch (error) {
            console.error('Failed to fetch employee groups:', error);
        }
    };

    const fetchEmployeeData = async () => {
        if (initialMode === 'Alter' && initialName) {
            try {
                // Find employee in list first or fetch all
                const employees = await getPayrollEmployees(companyId);
                const emp = employees.find((e: any) => e.name === initialName);
                if (emp) {
                    setEmployeeId(emp.id);
                    setName(emp.name);
                    setAlias(emp.alias || '');
                    setUnder(emp.employeeGroup?.name || 'Primary');
                    setDateOfJoining(emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '-') : '');
                    setEmployeeNumber(emp.employeeNumber || '');
                    setDesignation(emp.designation || '');
                    setFunctionVal(emp.function || '');
                    setLocation(emp.location || '');
                    setAddress(emp.address || '');
                    setPhone(emp.phone ? `+91 - ${emp.phone}` : '+91 - ');
                    setEmail(emp.email || '');
                    setPfAvailability(emp.pfApplicable ? 'Yes' : 'No');
                    setUan(emp.uan || '');
                    setPfNo(emp.pfAccountNumber || '');
                    setEsiAvailability(emp.esiApplicable ? 'Yes' : 'No');
                    setEsiNo(emp.esiNumber || '');
                    setCompanyPtEnabled(emp.ptApplicable); // Use companyPtEnabled to track employee's ptApplicable
                    setGender(emp.gender || '');
                }
            } catch (error) {
                console.error('Failed to fetch employee data:', error);
            }
        }
    };

    const fetchStatutoryConfig = async () => {
        try {
            const config = await getPayrollConfig(companyId);
            if (config && initialMode === 'Create') {
                setCompanyPtEnabled(config.ptEnabled);
                setCompanyPfEnabled(config.pfEnabled);
            }
        } catch (error) {
            console.error('Failed to fetch statutory config:', error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            await fetchGroups();
            if (initialMode === 'Alter') {
                await fetchEmployeeData();
            } else {
                await fetchStatutoryConfig();
            }
        };
        loadInitialData();
    }, [companyId, initialMode, initialName]);

    // Top Section
    const [name, setName] = useState(initialName);
    const [alias, setAlias] = useState('');
    const [under, setUnder] = useState('Primary');
    const [dateOfJoining, setDateOfJoining] = useState('1-Apr-2025');

    // General Information
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [designation, setDesignation] = useState('');
    const [functionVal, setFunctionVal] = useState('');
    const [location, setLocation] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [parentsName, setParentsName] = useState('');
    const [spouseName, setSpouseName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('+91 - ');
    const [email, setEmail] = useState('');
    const [stateVal, setStateVal] = useState('');

    // Statutory
    const [pfAvailability, setPfAvailability] = useState('Yes');
    const [uan, setUan] = useState('');
    const [pfNo, setPfNo] = useState('');
    const [esiAvailability, setEsiAvailability] = useState('No');
    const [esiNo, setEsiNo] = useState('');
    const [companyPtEnabled, setCompanyPtEnabled] = useState(false);
    const [companyPfEnabled, setCompanyPfEnabled] = useState(false);

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);
    const [showUnderList, setShowUnderList] = useState(false);
    const [selectedUnderIndex, setSelectedUnderIndex] = useState(0);
    const [showRecursiveCreation, setShowRecursiveCreation] = useState(false);
    const [showStateList, setShowStateList] = useState(false);
    const [selectedStateIndex, setSelectedStateIndex] = useState(0);
    const [showDeleteBox, setShowDeleteBox] = useState(false);

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
        "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
        "Ladakh", "Lakshadweep", "Puducherry"
    ];

    const [showGenderList, setShowGenderList] = useState(false);
    const [selectedGenderIndex, setSelectedGenderIndex] = useState(0);
    const genderOptions = ["MALE", "FEMALE", "OTHER"];

    const formatGender = (g: string) => {
        if (!g) return 'Not Applicable';
        return g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
    };

    // Navigation Refs
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const underRef = useRef<HTMLInputElement>(null);
    const joiningRef = useRef<HTMLInputElement>(null);
    const empNoRef = useRef<HTMLInputElement>(null);
    const stateRef = useRef<HTMLInputElement>(null);

    const closeAllLists = () => {
        setShowUnderList(false);
        setShowStateList(false);
        setShowGenderList(false);
    };


    const handleNumberInput = (value: string, setter: (v: string) => void, maxLength: number) => {
        const cleaned = value.replace(/[^0-9]/g, '').slice(0, maxLength);
        setter(cleaned);
    };

    const handlePFInput = (value: string) => {
        const cleaned = value.toUpperCase().replace(/[^A-Z0-9/]/g, '').slice(0, 30);
        setPfNo(cleaned);
    };

    const handlePhoneInput = (value: string) => {
        const prefix = '+91 - ';
        let body = value;
        if (value.startsWith(prefix)) {
            body = value.slice(prefix.length);
        }
        const cleaned = body.replace(/[^0-9]/g, '').slice(0, 10);
        setPhone(prefix + cleaned);
    };

    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            closeAllLists();
            nextRef.current?.focus();
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            alert('Please enter a name for the employee');
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                name,
                alias,
                employeeGroupId: under === 'Primary' ? null : allGroups.find(g => g.name === under)?.id,
                dateOfJoining: new Date(dateOfJoining).toISOString(),
                employeeNumber,
                designation,
                function: functionVal,
                location,
                gender: gender || null,
                dateOfBirth: dob ? new Date(dob).toISOString() : null,
                bloodGroup,
                fatherMotherName: parentsName,
                spouseName,
                address,
                phone: phone.replace('+91 - ', '').trim(),
                email,
                state: stateVal,
                pfApplicable: pfAvailability === 'Yes',
                uan,
                pfAccountNumber: pfNo,
                ptApplicable: companyPtEnabled,
                isActive: true
            };

            if (initialMode === 'Alter' && employeeId) {
                await updatePayrollEmployee(companyId, employeeId, payload);
                console.log('Employee updated successfully');
            } else {
                await createPayrollEmployee(companyId, payload);
                console.log('Employee created successfully');
            }
            onClose();
        } catch (error: any) {
            console.error('Failed to save employee:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to save employee. Check console for details.';
            alert(`Failed to save employee: ${errorMsg}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!employeeId) return;
        setIsSaving(true);
        try {
            await deletePayrollEmployee(companyId, employeeId);
            onClose();
        } catch (error: any) {
            console.error('Failed to delete employee:', error);
            alert(`Failed to delete employee: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showAcceptBox || showQuitBox || showDeleteBox || showUnderList || showStateList || showGenderList) return;

            if (e.altKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                if (initialMode === 'Alter') setShowDeleteBox(true);
            }
            if (e.key === 'd' || e.key === 'D') {
                // Only trigger if not typing in an input
                if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                    if (initialMode === 'Alter') setShowDeleteBox(true);
                }
            }
            if (e.key.toLowerCase() === 'q') {
                // Only trigger if not typing in an input
                if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showAcceptBox, showQuitBox, showDeleteBox, showUnderList, showStateList, showGenderList, initialMode]);

    return (
        <div className={`flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px] ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Title Bar */}
            <TallyHeader />
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>{initialMode === 'Alter' ? 'Employee Alteration' : 'Employee Creation'}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden h-full relative">
                {/* Main Form Area */}
                <div className="flex-1 bg-white flex flex-col h-full overflow-hidden border-r border-[#ccc] relative" onClick={closeAllLists}>
                    {/* Top Identity Section */}
                    <div className="p-4 pb-2 border-b border-gray-300 bg-gray-50/30">
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
                        <div className="flex items-center mb-4 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); aliasRef.current?.focus(); }}>
                            <label className="w-[120px] text-black italic">(alias)</label>
                            <span className="font-bold mr-2"> :</span>
                            <input
                                ref={aliasRef}
                                type="text"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, underRef)}
                                onFocus={closeAllLists}
                                className="bg-transparent text-black italic px-1 w-[320px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                            />
                        </div>

                        <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => {
                            e.stopPropagation();
                            closeAllLists();
                            setShowUnderList(true);
                            setSelectedUnderIndex(employeeGroups.indexOf(under));
                        }}>
                            <label className="w-[120px] text-black">Under</label>
                            <span className="font-bold mr-2"> :</span>
                            <div className="flex items-center">
                                <span className="text-black mr-1">♦</span>
                                <div className="bg-transparent text-black font-bold px-1 w-[200px] outline-none cursor-pointer hover:bg-[#ffe599]">
                                    {under}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); joiningRef.current?.focus(); }}>
                            <label className="w-[120px] text-black">Date of joining</label>
                            <span className="font-bold mr-2"> :</span>
                            <input
                                ref={joiningRef}
                                type="text"
                                value={dateOfJoining}
                                onChange={(e) => setDateOfJoining(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, empNoRef)}
                                onFocus={closeAllLists}
                                className="bg-transparent text-black font-bold px-1 w-[150px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Split Layout */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Column (General Info) */}
                        <div className="w-1/2 border-r border-gray-300 p-4 pt-1 flex flex-col overflow-y-auto custom-scrollbar">
                            <div className="font-bold text-black border-b border-gray-400 mb-4 self-center px-8">General Information</div>

                            {[
                                { label: 'Employee Number', value: employeeNumber, setter: setEmployeeNumber, ref: empNoRef },
                                { label: 'Designation', value: designation, setter: setDesignation },
                                { label: 'Function', value: functionVal, setter: setFunctionVal },
                                { label: 'Location', value: location, setter: setLocation },
                                { label: 'Address', value: address, setter: setAddress },
                            ].map((field, idx) => (
                                <div key={idx} className="flex items-center mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); field.ref?.current?.focus(); }}>
                                    <label className="w-[160px] text-black text-[12px]">{field.label}</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <input
                                        ref={field.ref}
                                        type="text"
                                        value={field.value}
                                        onChange={(e) => field.setter(e.target.value)}
                                        onFocus={closeAllLists}
                                        className="bg-transparent text-black font-bold text-[12px] px-1 flex-1 outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            ))}

                            <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                closeAllLists();
                                setShowStateList(true);
                                setSelectedStateIndex(indianStates.indexOf(stateVal));
                            }}>
                                <label className="w-[160px] text-black text-[12px]">State</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <div className="flex items-center">
                                    <span className="text-black mr-1">♦</span>
                                    <div
                                        ref={stateRef as any}
                                        tabIndex={0}
                                        className="bg-transparent text-black font-bold text-[12px] px-1 w-[200px] outline-none cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599]"
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                e.preventDefault();
                                                closeAllLists();
                                                setShowStateList(true);
                                                setSelectedStateIndex(indianStates.indexOf(stateVal));
                                            }
                                        }}
                                    >
                                        {stateVal || 'Not Applicable'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                closeAllLists();
                                setShowGenderList(true);
                                setSelectedGenderIndex(genderOptions.indexOf(gender) >= 0 ? genderOptions.indexOf(gender) : 0);
                            }}>
                                <label className="w-[160px] text-black text-[12px]">Gender</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <div className="flex items-center">
                                    <span className="text-black mr-1">♦</span>
                                    <div
                                        tabIndex={0}
                                        className="bg-transparent text-black font-bold text-[12px] px-1 w-[200px] outline-none cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599]"
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                e.preventDefault();
                                                closeAllLists();
                                                setShowGenderList(true);
                                            }
                                        }}
                                    >
                                        {formatGender(gender)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); }}>
                                <div className="flex items-center">
                                    <label className="w-[160px] text-black text-[12px]">Phone no.</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => handlePhoneInput(e.target.value)}
                                        onFocus={closeAllLists}
                                        className="bg-transparent text-black font-bold text-[12px] px-1 w-[150px] outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); }}>
                                <div className="flex items-center">
                                    <label className="w-[160px] text-black text-[12px]">Email</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={closeAllLists}
                                        className="bg-transparent text-black font-bold text-[12px] px-1 flex-1 outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Statutory Details) */}
                        <div className="w-1/2 p-4 pt-1 flex flex-col overflow-y-auto custom-scrollbar bg-gray-50/10">
                            <div className="font-bold text-black border-b border-gray-400 mb-4 self-center px-8 mt-8">Statutory Details</div>

                            <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); }}>
                                <label className="w-[200px] text-black text-[12px]">PF Availability</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <span
                                    className="font-bold text-black px-1 min-w-[30px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599]"
                                    onClick={(e) => { e.stopPropagation(); setPfAvailability(prev => prev === 'Yes' ? 'No' : 'Yes'); }}
                                >
                                    {pfAvailability}
                                </span>
                            </div>

                            <div className="flex flex-col mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); }}>
                                <div className="flex items-center">
                                    <label className="w-[200px] text-black text-[12px]">Universal Account Number (UAN)</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <input
                                        type="text"
                                        value={uan}
                                        onChange={(e) => handleNumberInput(e.target.value, setUan, 12)}
                                        onFocus={closeAllLists}
                                        className="bg-transparent text-black font-bold text-[12px] px-1 flex-1 outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); }}>
                                <div className="flex items-center">
                                    <label className="w-[200px] text-black text-[12px]">PF account number</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <input
                                        type="text"
                                        value={pfNo}
                                        onChange={(e) => handlePFInput(e.target.value)}
                                        onFocus={closeAllLists}
                                        className="bg-transparent text-black font-bold text-[12px] px-1 flex-1 outline-none focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            {/* Company Level Statutory (as requested) */}
                            <div className="mt-6 pt-4 border-t border-gray-300">
                                <div className="font-bold text-[#b54a26] text-[11px] mb-2 px-1 uppercase tracking-tight">Company Statutory Configuration</div>

                                <div className="flex items-center mb-1 group cursor-pointer" onClick={(e) => { e.stopPropagation(); closeAllLists(); }}>
                                    <label className="w-[200px] text-black text-[12px]">Enable Professional Tax (PT)</label>
                                    <span className="font-bold mr-2 text-[12px]"> :</span>
                                    <span
                                        className="font-bold text-black px-1 min-w-[30px] cursor-pointer hover:bg-[#ffe599] focus:bg-[#ffe599]"
                                        onClick={(e) => { e.stopPropagation(); setCompanyPtEnabled(prev => !prev); }}
                                    >
                                        {companyPtEnabled ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tally Sidebar */}
                <TallySidebar>
                    <SidebarButton keyName="F1" label="Select" onClick={() => { }} disabled={true} />
                    <SidebarButton keyName="F2" label="Period" onClick={() => { }} disabled={true} />
                    <SidebarButton keyName="F3" label="Company" onClick={() => { }} />
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
            </div>

            {/* Overlays */}
            {showAcceptBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans text-black">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAcceptBox(false)}>✕</button>
                    <div className="text-[15px] font-bold mt-2">Accept ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') handleSave();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                setShowAcceptBox(false);
                            }
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={handleSave}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => { setShowAcceptBox(false); }}>No</span>
                    </div>
                </div>
            )}

            {showQuitBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans text-black">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowQuitBox(false)}>✕</button>
                    <div className="text-[15px] font-bold mt-2">Quit ?</div>
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

            {showUnderList && (
                <div className="fixed top-[52px] bottom-[26px] right-[100px] sm:right-[120px] lg:right-[140px] w-[300px] z-[10000] flex flex-col border-l border-black shadow-xl font-sans">
                    <div className="flex flex-col h-full bg-[#e8f6fa] border-l-2 border-[#2a5585]">
                        <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center px-4">
                            <span className="font-bold text-[13px]">List of Employee Groups</span>
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
                                        setSelectedUnderIndex(prev => prev > -1 ? prev - 1 : employeeGroups.length - 1);
                                    } else if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setSelectedUnderIndex(prev => prev < employeeGroups.length - 1 ? prev + 1 : -1);
                                    } else if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (selectedUnderIndex === -1) {
                                            setShowRecursiveCreation(true);
                                        } else {
                                            setUnder(employeeGroups[selectedUnderIndex]);
                                            setShowUnderList(false);
                                            // Focus designation or something after selection
                                        }
                                    } else if (e.key === 'Escape') {
                                        setShowUnderList(false);
                                    }
                                }}
                            >
                                <div
                                    className={`px-2 py-0.5 text-right cursor-pointer border-b border-gray-300 ${selectedUnderIndex === -1 ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-100/50 text-black'}`}
                                    onClick={() => setShowRecursiveCreation(true)}
                                    onMouseEnter={() => setSelectedUnderIndex(-1)}
                                >
                                    <span className="font-bold">Create</span>
                                </div>
                                {employeeGroups.map((group, index) => (
                                    <div
                                        key={index}
                                        className={`px-2 py-0.5 cursor-pointer flex items-center justify-start text-[13px] ${selectedUnderIndex === index ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-50 text-black'}`}
                                        onClick={() => { setUnder(group); setShowUnderList(false); }}
                                        onMouseEnter={() => setSelectedUnderIndex(index)}
                                    >
                                        <div className="flex items-center">
                                            <span className="mr-1 text-[10px] text-black">♦</span>
                                            <span>{group}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showRecursiveCreation && (
                <div className="fixed inset-0 z-[20000] bg-white">
                    <TallyEmployeeGroupCreation
                        onClose={() => { setShowRecursiveCreation(false); fetchGroups(); }}
                        companyId={companyId}
                    />
                </div>
            )}

            {showStateList && (
                <div className="fixed top-[52px] bottom-[26px] right-[100px] sm:right-[120px] lg:right-[140px] w-[300px] z-[10000] flex flex-col border-l border-black shadow-xl font-sans">
                    <div className="flex flex-col h-full bg-[#e8f6fa] border-l-2 border-[#2a5585]">
                        <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center px-4">
                            <span className="font-bold text-[13px]">List of States</span>
                            <span onClick={() => setShowStateList(false)} className="cursor-pointer hover:bg-red-500 px-1 text-[13px]">✕</span>
                        </div>
                        <div className="flex flex-1 overflow-hidden">
                            <div
                                className="flex-1 overflow-y-auto bg-[#e8f6fa] custom-scrollbar text-[13px]"
                                tabIndex={0}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        setSelectedStateIndex(prev => prev > 0 ? prev - 1 : indianStates.length - 1);
                                    } else if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setSelectedStateIndex(prev => prev < indianStates.length - 1 ? prev + 1 : 0);
                                    } else if (e.key === 'Enter') {
                                        e.preventDefault();
                                        setStateVal(indianStates[selectedStateIndex]);
                                        setShowStateList(false);
                                    } else if (e.key === 'Escape') {
                                        setShowStateList(false);
                                    }
                                }}
                            >
                                {indianStates.map((st, index) => (
                                    <div
                                        key={index}
                                        className={`px-2 py-0.5 cursor-pointer flex items-center justify-start text-[13px] ${selectedStateIndex === index ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-50 text-black'}`}
                                        onClick={() => { setStateVal(st); setShowStateList(false); }}
                                        onMouseEnter={() => setSelectedStateIndex(index)}
                                    >
                                        <span>{st}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showGenderList && (
                <div className="fixed top-[52px] bottom-[26px] right-[100px] sm:right-[120px] lg:right-[140px] w-[300px] z-[10000] flex flex-col border-l border-black shadow-xl font-sans">
                    <div className="flex flex-col h-full bg-[#e8f6fa] border-l-2 border-[#2a5585]">
                        <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center px-4">
                            <span className="font-bold text-[13px]">List of Genders</span>
                            <span onClick={() => setShowGenderList(false)} className="cursor-pointer hover:bg-red-500 px-1 text-[13px]">✕</span>
                        </div>
                        <div className="flex flex-1 overflow-hidden">
                            <div
                                className="flex-1 overflow-y-auto bg-[#e8f6fa] custom-scrollbar text-[13px]"
                                tabIndex={0}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        setSelectedGenderIndex(prev => prev > 0 ? prev - 1 : genderOptions.length - 1);
                                    } else if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setSelectedGenderIndex(prev => prev < genderOptions.length - 1 ? prev + 1 : 0);
                                    } else if (e.key === 'Enter') {
                                        e.preventDefault();
                                        setGender(genderOptions[selectedGenderIndex]);
                                        setShowGenderList(false);
                                    } else if (e.key === 'Escape') {
                                        setShowGenderList(false);
                                    }
                                }}
                            >
                                {genderOptions.map((g, index) => (
                                    <div
                                        key={index}
                                        className={`px-2 py-0.5 cursor-pointer flex items-center justify-start text-[13px] ${selectedGenderIndex === index ? 'bg-[#fdb913] text-black font-bold' : 'hover:bg-blue-50 text-black'}`}
                                        onClick={() => { setGender(g); setShowGenderList(false); }}
                                        onMouseEnter={() => setSelectedGenderIndex(index)}
                                    >
                                        <span>{formatGender(g)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
        </div >
    );
};

export default TallyEmployeeCreation;
