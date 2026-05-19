import React, { useState } from 'react';
import TallyHeader from '../TallyCommon/TallyHeader';
import TallySidebar from '../TallyCommon/TallySidebar';
import { FeatureRow } from './FeatureRow';

interface TallyFeaturesProps {
    onClose: () => void;
    companyName: string;
}

const FooterItem = ({ keyName, label, onClick }: { keyName: string, label: string, onClick?: () => void }) => (
    <div className="flex items-center cursor-pointer hover:bg-black/5 px-2 py-0.5 rounded transition-colors group" onClick={onClick}>
        <span className="text-[#1d5b6e] font-bold mr-[1px] group-hover:text-blue-600">{keyName}</span>
        <span className="text-gray-700">: {label}</span>
    </div>
);

const TallyFeatures: React.FC<TallyFeaturesProps> = ({ onClose, companyName }) => {
    const [featShowMore, setFeatShowMore] = useState('No');
    const [featShowAll, setFeatShowAll] = useState('No');

    // Accounting
    const [featMaintainAccounts, setFeatMaintainAccounts] = useState('Yes');
    const [featBillWise, setFeatBillWise] = useState('Yes');
    const [featCostCentres, setFeatCostCentres] = useState('No');
    const [featInterestCalc, setFeatInterestCalc] = useState('No');

    // Inventory
    const [featMaintainInventory, setFeatMaintainInventory] = useState('Yes');
    const [featIntegrateInventory, setFeatIntegrateInventory] = useState('Yes');

    // Taxation
    const [featGST, setFeatGST] = useState('Yes');
    const [featTDS, setFeatTDS] = useState('No');
    const [featTCS, setFeatTCS] = useState('No');

    // Online Access
    const [featBrowserAccess, setFeatBrowserAccess] = useState('Yes');

    // Payroll
    const [featMaintainPayroll, setFeatMaintainPayroll] = useState('No');

    const [showAccept, setShowAccept] = useState(false);
    const [showQuit, setShowQuit] = useState(false);

    const sidebarButtons: any[] = [
        { keyName: 'F2', label: 'Period', disabled: true },
        { keyName: 'F3', label: 'Company', disabled: true },
        { keyName: 'SPACER', label: 'SPACER' },
        { keyName: 'F12', label: 'Configure' },
    ];

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key.toLowerCase() === 'q') {
            const target = e.target as HTMLElement;
            if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                if (showAccept) setShowAccept(false);
                else if (showQuit) setShowQuit(false);
                else setShowQuit(true);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[110] bg-[#f5f7f9] flex flex-col font-sans text-black overflow-hidden select-none" onKeyDown={handleKeyDown} tabIndex={0}>
            <TallyHeader onAction={(action) => action === 'quit' && setShowQuit(true)} />

            <div className="flex justify-between items-center px-4 h-6 bg-[#88b5dd] text-black text-[13px] font-bold border-b border-[#2d819b] shrink-0">
                <span>Company Features Alteration</span>
                <div className="absolute left-1/2 transform -translate-x-1/2 underline decoration-1 underline-offset-2 uppercase tracking-wider">{companyName || 'Solarica'}</div>
                <span className="cursor-pointer hover:bg-red-500 hover:text-white px-2 transition-colors font-bold" onClick={() => setShowQuit(true)}>✕</span>
            </div>

            <div className="flex-1 flex overflow-hidden bg-white">
                <div className="flex-1 p-6 relative flex flex-col items-center overflow-y-auto">
                    <div className="w-full max-w-4xl bg-white border border-gray-100 shadow-2xl flex flex-col p-8 rounded-sm mb-20">
                        <div className="flex flex-col mb-8 border-b border-gray-100 pb-4">
                            <h1 className="text-xl font-black text-blue-900 uppercase tracking-tight">Features</h1>
                            <div className="h-1 w-12 bg-blue-600 mt-1" />
                        </div>

                        <div className="flex flex-col gap-1 w-full font-bold text-[13px]">
                            <div className="flex gap-40 mb-8 pb-4 border-b border-gray-50 bg-gray-50/50 p-4 rounded-sm">
                                <FeatureRow label="Show more features" val={featShowMore} set={setFeatShowMore} />
                                <FeatureRow label="Show all features" val={featShowAll} set={setFeatShowAll} />
                            </div>

                            <div className="grid grid-cols-2 gap-x-20 gap-y-10">
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <div className="text-[11px] font-black text-blue-800 uppercase tracking-widest border-b border-blue-50 pb-1 mb-3">Accounting</div>
                                        <FeatureRow label="Maintain Accounts" val={featMaintainAccounts} set={setFeatMaintainAccounts} />
                                        <FeatureRow label="Enable Bill-wise entry" val={featBillWise} set={setFeatBillWise} />
                                        {(featShowMore === 'Yes' || featShowAll === 'Yes') && (
                                            <>
                                                <FeatureRow label="Enable Cost Centres" val={featCostCentres} set={setFeatCostCentres} />
                                                <FeatureRow label="Enable Interest Calculation" val={featInterestCalc} set={setFeatInterestCalc} />
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-[11px] font-black text-blue-800 uppercase tracking-widest border-b border-blue-50 pb-1 mb-3">Inventory</div>
                                        <FeatureRow label="Maintain Inventory" val={featMaintainInventory} set={setFeatMaintainInventory} />
                                        <FeatureRow label="Integrate Accounts with Inventory" val={featIntegrateInventory} set={setFeatIntegrateInventory} />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <div className="text-[11px] font-black text-blue-800 uppercase tracking-widest border-b border-blue-50 pb-1 mb-3">Taxation</div>
                                        <FeatureRow label="Enable Goods and Services Tax (GST)" val={featGST} set={setFeatGST} />
                                        <FeatureRow label="Enable Tax Deducted at Source (TDS)" val={featTDS} set={setFeatTDS} />
                                        {(featShowMore === 'Yes' || featShowAll === 'Yes') && (
                                            <FeatureRow label="Enable Tax Collected at Source (TCS)" val={featTCS} set={setFeatTCS} />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-[11px] font-black text-blue-800 uppercase tracking-widest border-b border-blue-50 pb-1 mb-3">Online Access</div>
                                        <FeatureRow label="Enable Browser Access for Reports" val={featBrowserAccess} set={setFeatBrowserAccess} />
                                    </div>

                                    {(featShowMore === 'Yes' || featShowAll === 'Yes') && (
                                        <div className="space-y-2">
                                            <div className="text-[11px] font-black text-blue-800 uppercase tracking-widest border-b border-blue-50 pb-1 mb-3">Payroll</div>
                                            <FeatureRow label="Maintain Payroll" val={featMaintainPayroll} set={setFeatMaintainPayroll} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modals */}
                    {showAccept && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                            <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowAccept(false)}>✕</button>
                            <div className="text-[15px] text-black font-bold mt-2">Accept ?</div>
                            <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                                onKeyDown={(e) => {
                                    if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                                    if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowAccept(false);
                                }}
                            >
                                <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                                <span className="cursor-pointer hover:underline" onClick={() => setShowAccept(false)}>No</span>
                            </div>
                        </div>
                    )}

                    {showQuit && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[300] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between font-sans">
                            <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowQuit(false)}>✕</button>
                            <div className="text-[15px] text-black font-bold mt-2">Quit ?</div>
                            <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                                onKeyDown={(e) => {
                                    if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                                    if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowQuit(false);
                                }}
                            >
                                <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                                <span className="cursor-pointer hover:underline" onClick={() => setShowQuit(false)}>No</span>
                            </div>
                        </div>
                    )}
                </div>

                <TallySidebar buttons={sidebarButtons} />
            </div>

            {/* Bottom Footer Section */}
            <div className="bg-[#fcfcd0] h-[30px] flex items-center px-6 text-[12px] w-full border-t border-gray-300 shrink-0 shadow-sm z-[110]">
                <FooterItem keyName="Q" label="Quit" onClick={() => setShowQuit(true)} />
                <div className="flex-1" />
                <FooterItem keyName="A" label="Accept" onClick={() => setShowAccept(true)} />
                <div className="flex-1" />
                <FooterItem keyName="F12" label="Configure" />
            </div>
        </div>
    );
};

export default TallyFeatures;
