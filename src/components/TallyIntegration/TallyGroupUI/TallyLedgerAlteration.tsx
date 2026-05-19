
import { useState, useRef, useEffect } from 'react';

// Reuse SidebarButton (copied for self-containment or could be imported if exported)
const SidebarButton = ({ keyName, label, fade, disabled, onClick }: { keyName: string, label: string, fade?: boolean, disabled?: boolean, onClick?: () => void }) => (
    <button
        className={`relative bg-transparent group px-1 mb-[1px] w-full text-left text-[12px] cursor-pointer flex items-center min-h-[32px] hover:bg-[#dceef5] ${fade || disabled ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={onClick}
        disabled={disabled}
    >
        <div className="flex flex-col justify-center w-full h-full pl-1 bg-gradient-to-r from-white to-[#f0f9fc] border border-[#a0cbe0] rounded-[2px] shadow-sm relative pr-3">
            {keyName && <span className={`font-bold leading-none mt-[2px] ${disabled ? 'text-gray-400' : 'text-[#1d5b6e]'}`}>{keyName}</span>}
            <span className={`leading-tight mb-[2px] ${disabled ? 'text-black' : 'text-black'}`}>{label || '\u00A0'}</span>
            <div className={`absolute right-0 top-0 bottom-0 w-[14px] flex items-center justify-center bg-[#e0f3f9] border-l border-[#a0cbe0] ${disabled ? 'text-gray-400' : 'text-[#2d819b]'}`}>
                <span className="text-[10px] font-bold">‹</span>
            </div>
        </div>
    </button>
);

const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center mr-5 cursor-pointer hover:bg-gray-200 px-1" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px]">{keyName}</span>
        <span>: {label}</span>
    </div>
);

interface Props {
    onClose: () => void;
}

const TallyLedgerAlteration = ({ onClose }: Props) => {
    // Form State
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [under] = useState('Capital Account');

    // Mailing Details
    const [mailingName, setMailingName] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('Maharashtra'); // Default as per screenshot
    const [country, setCountry] = useState('India');
    const [pincode, setPincode] = useState('');

    // Banking Details
    const [provideBankDetails, setProvideBankDetails] = useState('No');

    // Tax Registration Details
    const [panNo, setPanNo] = useState('');
    const [registrationType, setRegistrationType] = useState('Regular');
    const [gstin, setGstin] = useState('');
    const [alterAdditionalGst, setAlterAdditionalGst] = useState('No');

    // UI State
    const [showRegistrationTypeList, setShowRegistrationTypeList] = useState(false);

    const [showAdditionalGstDetails, setShowAdditionalGstDetails] = useState(false);
    const [showAcceptBox, setShowAcceptBox] = useState(false);
    const [showQuitBox, setShowQuitBox] = useState(false);

    // Refs
    const nameRef = useRef<HTMLInputElement>(null);
    const aliasRef = useRef<HTMLInputElement>(null);
    const mailingNameRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const stateRef = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLInputElement>(null);
    const pincodeRef = useRef<HTMLInputElement>(null);
    const bankDetailsRef = useRef<HTMLDivElement>(null);
    const panRef = useRef<HTMLInputElement>(null);
    const regTypeRef = useRef<HTMLInputElement>(null);
    const gstinRef = useRef<HTMLInputElement>(null);
    const additionalGstRef = useRef<HTMLDivElement>(null);

    // Additional GST Details State
    const [placeOfSupply, setPlaceOfSupply] = useState('Maharashtra');
    const [isTransporter, setIsTransporter] = useState('No');

    const labelStyle = "w-[150px] text-[#000000] text-[13px]";
    const valueStyle = "font-bold text-black text-[13px] outline-none bg-transparent px-1";

    // Global Key Handling for Q: Quit
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox || showAcceptBox || showAdditionalGstDetails || showRegistrationTypeList) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, showAcceptBox, showAdditionalGstDetails, showRegistrationTypeList]);

    const handleKeyDown = (e: React.KeyboardEvent, nextRef?: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef?.current?.focus();
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-2.5 h-[24px] bg-[#2d819b] text-white text-[13px] font-bold select-none relative">
                <div className="flex gap-1">
                    <span>Ledger Creation</span>
                    <span className="font-normal">(Secondary)</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:text-yellow-300">✕</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden h-full">
                {/* Left Form Area (Main) */}
                <div className="w-[50%] bg-white h-full border-r border-[#ccc] p-4 pt-2 overflow-y-auto">
                    {/* Name */}
                    <div className="flex items-center mb-1">
                        <label className={labelStyle}>Name</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={nameRef}
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setMailingName(e.target.value); // Auto-fill mailing name
                            }}
                            onKeyDown={(e) => handleKeyDown(e, aliasRef)}
                            className={`${valueStyle} w-[300px] focus:bg-[#ffe599]`}
                            autoFocus
                        />
                    </div>
                    {/* Alias */}
                    <div className="flex items-center mb-6">
                        <label className={labelStyle}>(alias)</label>
                        <span className="font-bold mr-2">:</span>
                        <input
                            ref={aliasRef}
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            // Skip to Under (mocked as simple input for navigation flow, or skip to mailing name/state/pan based on grouping)
                            // For simplicity, we assume Under is static 'Capital Account' as per instruction/screenshot default, skipping focus or simple tab
                            onKeyDown={(e) => handleKeyDown(e, mailingNameRef)}
                            className={`${valueStyle} w-[300px] italic focus:bg-[#ffe599]`}
                        />
                    </div>

                    <div className="flex items-center mb-6">
                        <label className={labelStyle}>Under</label>
                        <span className="font-bold mr-2">:</span>
                        <span className="font-bold text-black text-[13px]">{under}</span>
                    </div>

                    {/* Mailing Details Section */}
                    <div className="mt-4">
                        <div className="font-bold text-[13px] text-black underline mb-2">Mailing Details</div>
                        <div className="flex items-center mb-1">
                            <label className={labelStyle}>Name</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                ref={mailingNameRef}
                                type="text"
                                value={mailingName}
                                onChange={(e) => setMailingName(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, addressRef)}
                                className={`${valueStyle} w-[300px] focus:bg-[#ffe599]`}
                            />
                        </div>
                        <div className="flex items-start mb-1 h-[60px]">
                            <label className={labelStyle}>Address</label>
                            <span className="font-bold mr-2">:</span>
                            <textarea
                                ref={addressRef}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        // Allow new lines or move to state? Typically Enter moves to next field in Tally unless Shift+Enter
                                        e.preventDefault();
                                        stateRef.current?.focus();
                                    }
                                }}
                                className={`${valueStyle} w-[300px] h-full resize-none focus:bg-[#ffe599] align-top`}
                            />
                        </div>
                        <div className="flex items-center mb-1 relative">
                            <label className={labelStyle}>State</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                ref={stateRef}
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, countryRef)}
                                className={`${valueStyle} w-[200px] focus:bg-[#ffe599]`}
                            />
                        </div>
                        <div className="flex items-center mb-1">
                            <label className={labelStyle}>Country</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                ref={countryRef}
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, pincodeRef)}
                                className={`${valueStyle} w-[200px] focus:bg-[#ffe599]`}
                            />
                        </div>
                        <div className="flex items-center mb-1">
                            <label className={labelStyle}>Pincode</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                ref={pincodeRef}
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, bankDetailsRef)} // Jump to Banking Details
                                className={`${valueStyle} w-[100px] focus:bg-[#ffe599]`}
                            />
                        </div>
                    </div>

                    {/* Banking Details */}
                    <div className="mt-4">
                        <div className="font-bold text-[13px] text-black underline mb-2">Banking Details</div>
                        <div className="flex items-center mb-1">
                            <label className={labelStyle}>Provide bank details</label>
                            <span className="font-bold mr-2">:</span>
                            <div
                                ref={bankDetailsRef}
                                className={`${valueStyle} w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-dotted focus:outline-1`}
                                onClick={() => setProvideBankDetails(prev => prev === 'No' ? 'Yes' : 'No')}
                                onKeyDown={(e) => {
                                    if (e.key === ' ' || e.key === 'Enter') {
                                        if (e.key === ' ') setProvideBankDetails(prev => prev === 'No' ? 'Yes' : 'No');
                                        handleKeyDown(e, panRef);
                                    }
                                }}
                                tabIndex={0}
                            >
                                {provideBankDetails}
                            </div>
                        </div>
                    </div>

                    {/* Tax Registration Details */}
                    <div className="mt-4">
                        <div className="font-bold text-[13px] text-black underline mb-2">Tax Registration Details</div>
                        <div className="flex items-center mb-1">
                            <label className={labelStyle}>PAN/IT No.</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                ref={panRef}
                                type="text"
                                value={panNo}
                                onChange={(e) => setPanNo(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, regTypeRef)}
                                className={`${valueStyle} w-[150px] focus:bg-[#ffe599]`}
                            />
                        </div>
                        <div className="flex items-center mb-1 relative">
                            <label className={labelStyle}>Registration type</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                ref={regTypeRef}
                                type="text"
                                value={registrationType}
                                readOnly
                                onFocus={() => setShowRegistrationTypeList(true)}
                                onBlur={() => setTimeout(() => setShowRegistrationTypeList(false), 200)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') { setShowRegistrationTypeList(false); gstinRef.current?.focus(); }
                                }}
                                className={`${valueStyle} w-[200px] cursor-pointer focus:bg-[#ffe599]`}
                            />
                            {showRegistrationTypeList && (
                                <div className="absolute left-[170px] top-[20px] bg-[#feba35] border border-[#2d819b] shadow-lg z-50 w-[200px]">
                                    <div className="bg-[#2d819b] text-white text-[12px] px-2 font-bold flex justify-between items-center">
                                        <span>GST Registration Types</span>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] cursor-pointer hover:underline">Show More</span>
                                            <span className="cursor-pointer hover:text-red-300" onClick={() => setShowRegistrationTypeList(false)}>✕</span>
                                        </div>
                                    </div>
                                    <div className="max-h-[150px] overflow-y-auto">
                                        {['Unknown', 'Composition', 'Regular', 'Unregistered/Consumer'].map(type => (
                                            <div key={type}
                                                className={`px-2 py-1 text-[12px] cursor-pointer hover:bg-[#dceef5] ${registrationType === type ? 'font-bold' : ''}`}
                                                onClick={() => {
                                                    setRegistrationType(type);
                                                    setShowRegistrationTypeList(false);
                                                }}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="hidden" tabIndex={0} autoFocus onKeyDown={(e) => {
                                        if (e.key === 'Escape') setShowRegistrationTypeList(false);
                                    }}></div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center mb-1">
                            <label className={labelStyle}>GSTIN/UIN</label>
                            <span className="font-bold mr-2">:</span>
                            <input
                                ref={gstinRef}
                                type="text"
                                value={gstin}
                                onChange={(e) => setGstin(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, additionalGstRef)}
                                className={`${valueStyle} w-[200px] focus:bg-[#ffe599]`}
                            />
                        </div>
                        <div className="flex items-center mb-1">
                            <label className={labelStyle}>Set/Alter additional GST details</label>
                            <span className="font-bold mr-2">:</span>
                            <div
                                ref={additionalGstRef}
                                className={`${valueStyle} w-[50px] cursor-pointer hover:bg-yellow-100 focus:bg-[#ffe599] focus:outline-dotted focus:outline-1`}
                                onClick={() => {
                                    setAlterAdditionalGst(prev => prev === 'No' ? 'Yes' : 'No');
                                    if (alterAdditionalGst === 'No') setShowAdditionalGstDetails(true);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === ' ' || e.key === 'Enter') {
                                        if (e.key === ' ' || e.key === 'Enter') {
                                            if (alterAdditionalGst === 'No' && (e.key === ' ' || e.key === 'Enter')) {
                                                setAlterAdditionalGst('Yes');
                                                setShowAdditionalGstDetails(true);
                                            } else {
                                                setAlterAdditionalGst('No');
                                            }
                                        }
                                        if (!showAdditionalGstDetails && e.key === 'Enter') {
                                            setShowAcceptBox(true);
                                        }
                                    }
                                }}
                                tabIndex={0}
                            >
                                {alterAdditionalGst}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Area (Can be empty or summary) */}
                <div className="flex-1 bg-[#cadce4] h-full border-r border-[#99c7d6]"></div>

                {/* Sidebar */}
                <div className="w-[140px] bg-[#e8f6fa] flex flex-col pb-1 h-full">
                    <SidebarButton keyName="F2" label="Period" disabled />
                    {/* Standard sidebar buttons can be added here or reused */}
                    <SidebarButton keyName="F12" label="Configure" onClick={() => { }} />
                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#f3f8fa] h-[30px] flex items-center px-2.5 text-[12px] w-full absolute bottom-0 border-t border-[#ccc]">
                <FooterItem keyName="Q" label="Quit" onClick={() => setShowQuitBox(true)} />
                <div className="flex-1"></div>
                <FooterItem keyName="A" label="Accept" onClick={() => setShowAcceptBox(true)} />
            </div>

            {/* Additional GST Details Modal */}
            {showAdditionalGstDetails && (
                <div className="absolute inset-0 bg-transparent flex items-center justify-center z-[60]" onClick={() => setShowAdditionalGstDetails(false)}>
                    <div className="bg-white border border-[#2d819b] shadow-[4px_4px_0px_#2d819b] p-6 w-[500px] flex flex-col font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[18px] leading-none" onClick={() => setShowAdditionalGstDetails(false)}>✕</button>
                        <div className="text-center font-bold text-[14px] mb-4 border-b border-gray-300 pb-2">Additional GST Details</div>

                        <div className="flex items-center mb-2">
                            <label className="w-[250px] text-[13px]">Place of Supply (for Outwards)</label>
                            <span className="font-bold mr-2">:</span>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={placeOfSupply}
                                    onChange={(e) => setPlaceOfSupply(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') setShowAdditionalGstDetails(false);
                                    }}
                                    // Make this a dropdown similar to previous if needed, sticking to simple input for now as per image reference
                                    className={`${valueStyle} w-full focus:bg-[#ffe599]`}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex items-center mb-2">
                            <label className="w-[250px] text-[13px]">Is the Party a Transporter</label>
                            <span className="font-bold mr-2">:</span>
                            <div
                                className={`${valueStyle} w-[50px] cursor-pointer hover:bg-yellow-100`}
                                onClick={() => setIsTransporter(prev => prev === 'No' ? 'Yes' : 'No')}
                            >{isTransporter}</div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button className="px-4 py-1 bg-[#2d819b] text-white font-bold text-[12px]" onClick={() => setShowAdditionalGstDetails(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Accept Box */}
            {showAcceptBox && (
                <div className="absolute bottom-[40px] right-[140px] z-[100]">
                    <div className="bg-[#feba35] border border-[#2d819b] shadow-[4px_4px_0px_#2d819b] p-4 w-[150px] flex flex-col items-center relative">
                        <button className="absolute top-1 right-1 text-[#1d5b6e] hover:text-red-500 font-bold text-[14px] leading-none" onClick={() => setShowAcceptBox(false)}>✕</button>
                        <div className="font-bold text-[#1d5b6e] text-[13px] mb-2">Accept?</div>
                        <div className="flex gap-4">
                            <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#1d5b6e] hover:text-white"
                                onClick={onClose}
                                onKeyDown={(e) => {
                                    if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                                    if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowAcceptBox(false);
                                }}
                                autoFocus>Yes</button>
                            <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#1d5b6e] hover:text-white"
                                onClick={() => setShowAcceptBox(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Quit Box */}
            {showQuitBox && (
                <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black/20" onClick={() => setShowQuitBox(false)}>
                    <div className="bg-[#feba35] border border-[#2d819b] shadow-[4px_4px_0px_#2d819b] p-6 flex flex-col items-center relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-1 right-1 text-[#1d5b6e] hover:text-red-500 font-bold text-[14px] leading-none" onClick={() => setShowQuitBox(false)}>✕</button>
                        <div className="font-bold text-[#1d5b6e] text-[15px] mb-4">Quit?</div>
                        <div className="flex gap-6">
                            <button className="px-6 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#1d5b6e] hover:text-white"
                                onClick={onClose}
                                onKeyDown={(e) => {
                                    if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                                    if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowQuitBox(false);
                                }}
                                autoFocus>Yes</button>
                            <button className="px-6 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#1d5b6e] hover:text-white"
                                onClick={() => setShowQuitBox(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TallyLedgerAlteration;
