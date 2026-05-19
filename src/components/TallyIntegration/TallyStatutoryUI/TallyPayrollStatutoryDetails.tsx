import { useState, useEffect } from 'react';
import { getPayrollConfig, updateStatutoryConfig } from '../../../services/accountingService';

interface Props {
    companyId: string;
    onClose: () => void;
}

const TallyPayrollStatutoryDetails = ({ companyId, onClose }: Props) => {
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeField, setActiveField] = useState<string>('pfEnabled');
    const [showQuitBox, setShowQuitBox] = useState(false);

    const ptStates = [
        "Andhra Pradesh", "Assam", "Bihar", "Gujarat", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
        "Punjab", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "West Bengal"
    ];

    useEffect(() => {
        fetchConfig();
    }, [companyId]);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'SELECT') {
                    setShowQuitBox(true);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox]);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const data = await getPayrollConfig(companyId);
            setConfig(data || {
                pfEnabled: false,
                ptEnabled: false,
                ptState: '',
                pfRegistrationNumber: '',
                ptRegistrationNumber: ''
            });
        } catch (error) {
            console.error("Error fetching statutory config:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await updateStatutoryConfig(companyId, config);
            onClose();
        } catch (error) {
            console.error("Error updating statutory config:", error);
            alert("Error saving configuration");
        }
    };

    const updateField = (field: string, value: any) => {
        setConfig((prev: any) => ({ ...prev, [field]: value }));
    };

    if (loading) return <div className="flex items-center justify-center h-full bg-[#f2f2f2] text-black">Loading...</div>;

    return (
        <div className="flex flex-col h-full w-full bg-[#f2f2f2] font-sans relative select-none overflow-hidden">
            {/* Title Bar */}
            <div className="flex justify-between items-center px-4 h-[24px] bg-[#88b5dd] text-black text-[13px] font-bold shrink-0 border-b border-[#2d819b]">
                <div className="flex items-center">
                    <span>Payroll Statutory Details</span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center underline decoration-1 underline-offset-2">Solarica</div>
                <div className="flex items-center absolute right-[2px]">
                    <span onClick={() => setShowQuitBox(true)} className="text-[14px] cursor-pointer hover:bg-red-500 hover:text-white px-2">✕</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-400/20">
                <div className="bg-white border border-[#2a5585] shadow-2xl w-full max-w-[600px] flex flex-col relative">
                    <div className="bg-[#2a5585] text-white text-center py-1 text-[13px] font-bold px-4">
                        Company Statutory Configuration
                    </div>

                    <div className="p-8 space-y-4">
                        {/* PF Section */}
                        <div className="space-y-2 pb-4 border-b border-gray-100">
                            <div className="text-[12px] font-bold text-black border-b border-gray-400 inline-block mb-2">Provident Fund (PF)</div>

                            <div className={`flex items-center p-1 rounded transition-colors ${activeField === 'pfEnabled' ? 'bg-[#fcfcd0] ring-1 ring-yellow-400' : ''}`}
                                onClick={() => setActiveField('pfEnabled')}>
                                <label className="w-[200px] text-[12px] text-black">Enable Provident Fund (PF)</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <select
                                    className="bg-transparent border-none outline-none font-bold text-[12px] text-[#2a5585] cursor-pointer"
                                    value={config.pfEnabled ? 'Yes' : 'No'}
                                    onChange={(e) => updateField('pfEnabled', e.target.value === 'Yes')}
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            {config.pfEnabled && (
                                <>
                                    <div className={`flex items-center p-1 rounded transition-colors ${activeField === 'pfReg' ? 'bg-[#fcfcd0] ring-1 ring-yellow-400' : ''}`}
                                        onClick={() => setActiveField('pfReg')}>
                                        <label className="w-[200px] text-[12px] text-black pl-4">PF Registration Number</label>
                                        <span className="font-bold mr-2 text-[12px]"> :</span>
                                        <input
                                            className="bg-transparent border-none outline-none font-bold text-[12px] text-black flex-1"
                                            value={config.pfRegistrationNumber || ''}
                                            placeholder="Enter PF Number"
                                            onChange={(e) => updateField('pfRegistrationNumber', e.target.value)}
                                        />
                                    </div>
                                    <div className={`flex items-center p-1 rounded transition-colors ${activeField === 'pfEst' ? 'bg-[#fcfcd0] ring-1 ring-yellow-400' : ''}`}
                                        onClick={() => setActiveField('pfEst')}>
                                        <label className="w-[200px] text-[12px] text-black pl-4">Establishment ID</label>
                                        <span className="font-bold mr-2 text-[12px]"> :</span>
                                        <input
                                            className="bg-transparent border-none outline-none font-bold text-[12px] text-black flex-1"
                                            value={config.pfEstablishmentId || ''}
                                            placeholder="Enter Establishment ID"
                                            onChange={(e) => updateField('pfEstablishmentId', e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* PT Section */}
                        <div className="space-y-2">
                            <div className="text-[12px] font-bold text-black border-b border-gray-400 inline-block mb-2">Professional Tax (PT)</div>

                            <div className={`flex items-center p-1 rounded transition-colors ${activeField === 'ptEnabled' ? 'bg-[#fcfcd0] ring-1 ring-yellow-400' : ''}`}
                                onClick={() => setActiveField('ptEnabled')}>
                                <label className="w-[200px] text-[12px] text-black">Enable Professional Tax (PT)</label>
                                <span className="font-bold mr-2 text-[12px]"> :</span>
                                <select
                                    className="bg-transparent border-none outline-none font-bold text-[12px] text-[#2a5585] cursor-pointer"
                                    value={config.ptEnabled ? 'Yes' : 'No'}
                                    onChange={(e) => updateField('ptEnabled', e.target.value === 'Yes')}
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            {config.ptEnabled && (
                                <>
                                    <div className={`flex items-center p-1 rounded transition-colors ${activeField === 'ptState' ? 'bg-[#fcfcd0] ring-1 ring-yellow-400' : ''}`}
                                        onClick={() => setActiveField('ptState')}>
                                        <label className="w-[200px] text-[12px] text-black pl-4">PT State</label>
                                        <span className="font-bold mr-2 text-[12px]"> :</span>
                                        <select
                                            className="bg-transparent border-none outline-none font-bold text-[12px] text-[#2a5585] cursor-pointer flex-1"
                                            value={config.ptState || ''}
                                            onChange={(e) => updateField('ptState', e.target.value)}
                                        >
                                            <option value="">Select State</option>
                                            {ptStates.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={`flex items-center p-1 rounded transition-colors ${activeField === 'ptReg' ? 'bg-[#fcfcd0] ring-1 ring-yellow-400' : ''}`}
                                        onClick={() => setActiveField('ptReg')}>
                                        <label className="w-[200px] text-[12px] text-black pl-4">PT Registration Number</label>
                                        <span className="font-bold mr-2 text-[12px]"> :</span>
                                        <input
                                            className="bg-transparent border-none outline-none font-bold text-[12px] text-black flex-1"
                                            value={config.ptRegistrationNumber || ''}
                                            placeholder="Enter PT Number"
                                            onChange={(e) => updateField('ptRegistrationNumber', e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end p-2 bg-[#f2f2f2] border-t border-gray-300 gap-4 shrink-0">
                        <button onClick={() => setShowQuitBox(true)} className="text-[#2a5585] font-bold text-[12px] px-4 py-1 cursor-pointer hover:bg-gray-200 rounded transition-colors group">
                            <span className="text-gray-500 group-hover:text-red-600 mr-2 font-normal">Q:</span> Quit
                        </button>
                        <button onClick={handleSave} className="bg-[#2a5585] text-white font-bold text-[12px] px-6 py-1 cursor-pointer hover:bg-[#1a3555] rounded shadow-sm">
                            Accept
                        </button>
                    </div>
                </div>
            </div>

            {/* Quit Confirmation */}
            {showQuitBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between">
                    <div className="text-[15px] text-black font-bold text-center">Quit ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585]">
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => setShowQuitBox(false)}>No</span>
                    </div>
                </div>
            )}

            {/* Hint Footer */}
            <div className="bg-[#fcfcd0] h-[24px] flex items-center px-4 text-[11px] w-full border-t border-[#ccc] shrink-0 italic text-gray-600">
                <span>Select 'Yes' to enable specific statutory features for this company.</span>
            </div>
        </div>
    );
};

export default TallyPayrollStatutoryDetails;
