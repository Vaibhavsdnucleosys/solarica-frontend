import React, { useState, useRef, useEffect } from 'react';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallySidebar, SidebarButton } from '../TallyGroupUI/TallySidebar';
import { createVoucherType, updateVoucherType, getVoucherTypes } from '../../../services/accountingService';
import { toast } from 'react-hot-toast';

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

const TallyPayrollVoucherCreation = ({
    onClose,
    companyId = '',
    initialMode = 'Create',
    initialName = ''
}: Props) => {
    // Identity Section
    const [name, setName] = useState(initialName);
    const [isActivated, setIsActivated] = useState('Yes');
    const [allowNarration, setAllowNarration] = useState('Yes');
    const [existingId, setExistingId] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);

    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);

    // Refs
    const nameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchExisting = async () => {
            try {
                const types = await getVoucherTypes(companyId);
                const payrollType = types.find((t: any) => t.name === "Payroll" || (initialName && t.name === initialName));
                if (payrollType) {
                    setName(payrollType.name);
                    setIsActivated(payrollType.isActive ? 'Yes' : 'No');
                    setExistingId(payrollType.id);
                    setIsLocked(!!payrollType.isLocked);
                }
            } catch (err) {
                console.error("Error fetching voucher types", err);
            }
        };
        fetchExisting();
    }, [companyId, initialName]);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || showAcceptBox) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, showAcceptBox]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLocked) {
            e.preventDefault();
            setShowAcceptBox(true);
        }
    };

    const handleSubmit = async () => {
        try {
            const data = {
                name,
                code: "PAY", // Hardcoded code
                category: "JOURNAL", // Hardcoded category
                isActive: isActivated === 'Yes',
                isSystem: true,
                startingNumber: 1,
                allowNarration: allowNarration === 'Yes'
            };

            if (existingId) {
                await updateVoucherType(existingId, data);
                toast.success("Payroll Voucher Type updated");
            } else {
                await createVoucherType(companyId, data);
                toast.success("Payroll Voucher Type created");
            }
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to save voucher type");
        }
    };

    const sidebarButtons = [
        { keyName: 'F2', label: 'Period', disabled: true },
        { keyName: 'F3', label: 'Company' },
        { keyName: '', label: 'SEPARATOR' },
        { keyName: 'F10', label: 'Other Masters' },
        { keyName: '', label: 'SPACER' },
        { keyName: 'I', label: 'More Details' },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden text-[13px]">
            {/* Tally Header */}
            <TallyHeader />

            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black text-[13px] font-bold relative border-b border-[#2d819b] shrink-0">
                <div className="flex items-center">
                    <span>{initialMode === 'Alter' ? 'Payroll Voucher Type Alteration' : 'Payroll Voucher Type Creation'}</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden h-full">
                <div className="flex-1 bg-white flex flex-col h-full overflow-hidden border-r border-[#ccc]">
                    {/* Identity Header */}
                    <div className="p-4 py-2 border-b border-gray-300 bg-gray-50/30">
                        <div className="flex items-center mb-1 group cursor-pointer" onClick={() => !isLocked && nameRef.current?.focus()}>
                            <label className="w-[120px] text-black text-[13px]">Name</label>
                            <span className="font-bold mr-2 text-[13px]">:</span>
                            <input
                                ref={nameRef}
                                type="text"
                                value={name}
                                disabled={isLocked}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className={`text-black font-bold text-[13px] px-1 w-[320px] outline-none border border-transparent ${isLocked ? 'bg-gray-100 italic' : 'bg-[#fcfcd0] focus:bg-[#ffe599] focus:ring-1 focus:ring-blue-400'}`}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Simple Section */}
                    <div className="flex flex-1 overflow-hidden">
                        <div className="w-full p-4 pt-4 flex flex-col">
                            <div className="text-[13px] font-bold text-black border-b border-gray-400 mb-6 self-start px-4 inline-block">General</div>

                            <div className="flex items-center mb-4">
                                <label className="w-[200px] text-black text-[12px]">Activate this Voucher Type</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <select
                                    value={isActivated}
                                    disabled={isLocked}
                                    onChange={(e) => setIsActivated(e.target.value)}
                                    className="bg-transparent font-bold text-[12px] outline-none border-b border-gray-300"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className="flex items-center mb-4">
                                <label className="w-[200px] text-black text-[12px]">Method of Voucher Numbering</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <span className="text-black font-bold text-[12px] bg-gray-100 px-1">Automatic</span>
                            </div>

                            <div className="flex items-center mb-4">
                                <label className="w-[200px] text-black text-[12px]">Allow narration in voucher</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <select
                                    value={allowNarration}
                                    disabled={isLocked}
                                    onChange={(e) => setAllowNarration(e.target.value)}
                                    className="bg-transparent font-bold text-[12px] outline-none border-b border-gray-300"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            {isLocked && (
                                <div className="mt-8 p-3 bg-red-50 border border-red-200 text-red-700 text-[11px] rounded">
                                    <strong>LOCK STATUS:</strong> This voucher type is locked because payroll has been approved. Edits are disabled for audit integrity.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tally Sidebar */}
                <TallySidebar>
                    {sidebarButtons.map((btn, idx) => (
                        <SidebarButton
                            key={idx}
                            keyName={btn.keyName}
                            label={btn.label}
                            disabled={btn.disabled}
                            onClick={btn.keyName ? () => { } : undefined}
                        />
                    ))}
                </TallySidebar>
            </div>

            {/* Footer */}
            <div className="bg-[#fcfcd0] h-[24px] flex items-center px-4 text-[12px] w-full border-t border-[#ccc] shrink-0">
                <FooterItem keyName="Q" label="Quit" onClick={() => setShowQuitBox(true)} />
                <div className="flex-1" />
                <FooterItem keyName="A" label="Accept" onClick={() => !isLocked && setShowAcceptBox(true)} />
                <div className="flex-1" />
                <FooterItem keyName="D" label="Delete" />
            </div>

            {/* Accept Box Overlay */}
            {
                showAcceptBox && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                        <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAcceptBox(false)}>✕</button>
                        <div className="text-[15px] text-black font-bold mt-2">Accept ?</div>
                        <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                            onKeyDown={(e) => {
                                if (e.key.toLowerCase() === 'y' || e.key === 'Enter') handleSubmit();
                                if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
                                    setShowAcceptBox(false);
                                    nameRef.current?.focus();
                                }
                            }}
                        >
                            <span className="cursor-pointer hover:underline" onClick={handleSubmit}>Yes</span>
                            <span className="cursor-pointer hover:underline" onClick={() => {
                                setShowAcceptBox(false);
                                nameRef.current?.focus();
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
        </div >
    );
};

export default TallyPayrollVoucherCreation;
