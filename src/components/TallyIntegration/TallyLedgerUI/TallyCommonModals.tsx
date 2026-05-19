
import React from 'react';

interface TallyCommonModalsProps {
    showExportCurrentModal: boolean;
    setShowExportCurrentModal: (val: boolean) => void;
    showPrintModal: boolean;
    setShowPrintModal: (val: boolean) => void;
    showPrintReportModal: boolean;
    setShowPrintReportModal: (val: boolean) => void;
    showPrintConfigModal: boolean;
    setShowPrintConfigModal: (val: boolean) => void;
    openCompanies: any[];
    currentCompany: string;
    setCurrentCompany: (name: string) => void;
    onCompanyChange?: (id: string, name: string) => void;

    // Recovery/Data Modals
    showBackupModal?: boolean;
    setShowBackupModal?: (val: boolean) => void;
    showRestoreModal?: boolean;
    setShowRestoreModal?: (val: boolean) => void;
    showRepairModal?: boolean;
    setShowRepairModal?: (val: boolean) => void;
    showMigrateModal?: boolean;
    setShowMigrateModal?: (val: boolean) => void;
    showDataConfigModal?: boolean;
    setShowDataConfigModal?: (val: boolean) => void;
    showSplitDataModal?: boolean;
    setShowSplitDataModal?: (val: boolean) => void;

    // Company Management
    showSelectCompanyModal?: boolean;
    setShowSelectCompanyModal?: (val: boolean) => void;
    showShutCompanyModal?: boolean;
    setShowShutCompanyModal?: (val: boolean) => void;
    showChangeCompanyModal?: boolean;
    setShowChangeCompanyModal?: (val: boolean) => void;
    showSecurityListModal?: boolean;
    setShowSecurityListModal?: (val: boolean) => void;
    showOnlineAccessListModal?: boolean;
    setShowOnlineAccessListModal?: (val: boolean) => void;
    showTallyVaultModal?: boolean;
    setShowTallyVaultModal?: (val: boolean) => void;
    showConnectErrorModal?: boolean;
    setShowConnectErrorModal?: (val: boolean) => void;

    // Help
    showAboutModal?: boolean;
    setShowAboutModal?: (val: boolean) => void;
    showTDLManagementModal?: boolean;
    setShowTDLManagementModal?: (val: boolean) => void;
    showUpgradeModal?: boolean;
    setShowUpgradeModal?: (val: boolean) => void;

    // Import
    showImportMastersModal?: boolean;
    setShowImportMastersModal?: (val: boolean) => void;
    showImportTransactionsModal?: boolean;
    setShowImportTransactionsModal?: (val: boolean) => void;
    showImportBankDetailsModal?: boolean;
    setShowImportBankDetailsModal?: (val: boolean) => void;
    showImportGSTReturnsModal?: boolean;
    setShowImportGSTReturnsModal?: (val: boolean) => void;

    // Exchange
    showEInvoicingModal?: boolean;
    setShowEInvoicingModal?: (val: boolean) => void;
    showEWayBillModal?: boolean;
    setShowEWayBillModal?: (val: boolean) => void;
    showExchangeConfigModal?: boolean;
    setShowExchangeConfigModal?: (val: boolean) => void;
}

const TallyCommonModals: React.FC<TallyCommonModalsProps> = ({
    showExportCurrentModal,
    setShowExportCurrentModal,
    showPrintModal,
    setShowPrintModal,
    showPrintReportModal,
    setShowPrintReportModal,
    showPrintConfigModal,
    setShowPrintConfigModal,
    openCompanies,
    currentCompany,
    setCurrentCompany,
    onCompanyChange,
    showBackupModal,
    setShowBackupModal,
    showRestoreModal,
    setShowRestoreModal,
    showRepairModal,
    setShowRepairModal,
    showMigrateModal,
    setShowMigrateModal,
    showDataConfigModal,
    setShowDataConfigModal,
    showSplitDataModal,
    setShowSplitDataModal,
    showSelectCompanyModal,
    setShowSelectCompanyModal,
    showShutCompanyModal,
    setShowShutCompanyModal,
    showAboutModal,
    setShowAboutModal,
    showImportMastersModal,
    setShowImportMastersModal,
    showChangeCompanyModal,
    setShowChangeCompanyModal,
    showSecurityListModal,
    setShowSecurityListModal,
    showOnlineAccessListModal,
    setShowOnlineAccessListModal,
    showTallyVaultModal,
    setShowTallyVaultModal,
    showConnectErrorModal,
    setShowConnectErrorModal,
    showTDLManagementModal,
    setShowTDLManagementModal,
    showUpgradeModal,
    setShowUpgradeModal,
    showImportTransactionsModal,
    setShowImportTransactionsModal,
    showImportBankDetailsModal,
    setShowImportBankDetailsModal,
    showImportGSTReturnsModal,
    setShowImportGSTReturnsModal,
    showEInvoicingModal,
    setShowEInvoicingModal,
    showEWayBillModal,
    setShowEWayBillModal,
    showExchangeConfigModal,
    setShowExchangeConfigModal
}) => {

    // Generic placeholder modal renderer
    const renderPlaceholder = (title: string, message: string, show?: boolean, setShow?: (v: boolean) => void) => {
        if (!show || !setShow) return null;
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/10" onClick={() => setShow(false)}>
                <div className="bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-[#2d819b] w-[450px] font-sans text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="font-bold text-[14px] mb-6 text-[#1d5b6e] tracking-tight">{title}</div>
                    <div className="text-[13px] font-bold text-gray-700 mb-8">{message}</div>
                    <div className="flex justify-center">
                        <button
                            className="bg-[#feba35] text-white px-6 py-1.5 font-bold border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                            onClick={() => setShow(false)}
                            autoFocus
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Export Current Modal */}
            {showExportCurrentModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10">
                    <div className="bg-white p-8 px-12 shadow-2xl border border-gray-300 w-[600px] relative flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowExportCurrentModal(false)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 text-[20px]">✕</button>
                        <div className="font-bold text-[14px] mb-2 text-black border-b border-gray-200 pb-2">Export</div>
                        <div className="flex flex-col gap-2 mt-4 font-bold text-[13px]">
                            <div className="flex items-center"><label className="w-[180px] text-gray-600">Type of Masters</label><span>: Groups</span></div>
                            <div className="flex items-center"><label className="w-[180px] text-gray-600">File Name</label><span>: Master.xml</span></div>
                        </div>
                        <div className="flex justify-center gap-6 mt-10 pb-2">
                            <button className="border-2 border-[#2d819b] px-6 py-1 font-bold text-[#2d819b] hover:bg-[#dceef5]">Configure</button>
                            <button className="border-2 border-[#feba35] px-6 py-1 font-bold text-black hover:bg-[#fff9c4]" onClick={() => setShowExportCurrentModal(false)}>Export</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Modal */}
            {showPrintModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10">
                    <div className="bg-white p-6 shadow-2xl border border-gray-300 w-[500px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="font-bold text-[14px] mb-4 text-black border-b border-gray-200 pb-2">Print</div>
                        <div className="font-bold text-[13px] space-y-2">
                            <div className="flex justify-between"><span>Printer</span><span className="text-[#1d5b6e]">Microsoft Print to PDF</span></div>
                            <div className="flex justify-between"><span>No. of copies</span><span className="text-[#1d5b6e]">1</span></div>
                        </div>
                        <div className="mt-8 flex justify-center gap-4">
                            <button className="border border-[#2d819b] px-4 py-1 text-[#2d819b] font-bold" onClick={() => setShowPrintConfigModal && setShowPrintConfigModal(true)}>Configure</button>
                            <button className="border border-[#2d819b] px-4 py-1 text-[#2d819b] font-bold">Preview</button>
                            <button className="bg-[#feba35] border border-black px-4 py-1 font-bold" onClick={() => setShowPrintModal(false)}>Print</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Report Modal */}
            {showPrintReportModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10">
                    <div className="bg-[#e8f6fa] border border-[#2d819b] shadow-2xl w-[600px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#2d819b] text-white px-2 py-1 font-bold flex justify-between">
                            <span>Print Report</span>
                            <span className="cursor-pointer" onClick={() => setShowPrintReportModal(false)}>✕</span>
                        </div>
                        <div className="p-4">
                            <input type="text" className="w-full bg-[#feba35] border border-black px-2 py-1 mb-4 font-bold outline-none" placeholder="Search for report..." autoFocus />
                            <div className="bg-[#2d819b] text-white px-2 text-[11px]">List of Reports</div>
                            <div className="bg-white max-h-[300px] overflow-y-auto">
                                <div className="px-2 py-1 hover:bg-[#dceef5] cursor-pointer font-bold">Balance Sheet</div>
                                <div className="px-2 py-1 hover:bg-[#dceef5] cursor-pointer font-bold">Profit & Loss A/c</div>
                                <div className="px-2 py-1 hover:bg-[#dceef5] cursor-pointer font-bold">Stock Summary</div>
                                <div className="px-2 py-1 hover:bg-[#dceef5] cursor-pointer font-bold">Ratio Analysis</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Company Modal */}
            {showChangeCompanyModal && setShowChangeCompanyModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10" onClick={() => setShowChangeCompanyModal(false)}>
                    <div className="bg-[#e8f6fa] border border-[#2d819b] shadow-2xl w-[500px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#2d819b] text-white px-2 py-1 font-bold">Change Company</div>
                        <div className="p-4">
                            <div className="bg-[#2d819b] text-white px-2 text-[11px] flex justify-between"><span>List of Companies</span><span>Number</span></div>
                            <div className="max-h-[200px] overflow-y-auto bg-white">
                                {openCompanies.map((c, i) => (
                                    <div key={i} className="flex justify-between px-2 py-0.5 hover:bg-[#feba35] cursor-pointer text-[13px] font-bold" onClick={() => {
                                        if (onCompanyChange) onCompanyChange(c.id || '', c.name);
                                        else setCurrentCompany(c.name);
                                        setShowChangeCompanyModal && setShowChangeCompanyModal(false);
                                    }}>
                                        <span>{c.name}</span><span>{c.number || c.id?.slice(0, 5)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Select Company Modal */}
            {showSelectCompanyModal && setShowSelectCompanyModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10" onClick={() => setShowSelectCompanyModal(false)}>
                    <div className="bg-[#e8f6fa] border border-[#2d819b] shadow-2xl w-[600px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#2d819b] text-white px-2 py-1 font-bold">Select Company</div>
                        <div className="p-4 flex flex-col">
                            <input type="text" className="bg-[#feba35] border border-black px-2 py-1 mb-4 outline-none font-bold" placeholder="Select Company" autoFocus />
                            <div className="bg-[#2d819b] text-white px-2 text-[11px] flex justify-between"><span>List of Companies</span><span>Number</span></div>
                            <div className="max-h-[300px] overflow-y-auto bg-white border border-gray-300">
                                <div className="px-2 py-1 text-gray-400 italic font-normal">Directly from Drive...</div>
                                <div className="px-2 py-1 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-100">Solarica (10000)</div>
                                <div className="px-2 py-1 hover:bg-[#feba35] cursor-pointer font-bold border-b border-gray-100">Dev Trading Co. (10001)</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Shut Company Modal */}
            {showShutCompanyModal && setShowShutCompanyModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10" onClick={() => setShowShutCompanyModal(false)}>
                    <div className="bg-[#e8f6fa] border border-[#2d819b] shadow-2xl w-[500px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#2d819b] text-white px-2 py-1 font-bold">Shut Company</div>
                        <div className="p-4">
                            <div className="bg-[#2d819b] text-white px-2 text-[11px] flex justify-between"><span>List of Open Companies</span><span>Number</span></div>
                            <div className="max-h-[200px] overflow-y-auto bg-white">
                                {openCompanies.map((c, i) => (
                                    <div key={i} className="flex justify-between px-2 py-0.5 hover:bg-red-200 cursor-pointer text-[13px] font-bold" onClick={() => setShowShutCompanyModal(false)}>
                                        <span>{c.name}</span><span>{c.number}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Backup Modal */}
            {showBackupModal && setShowBackupModal && (
                <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[100px] bg-black/10" onClick={() => setShowBackupModal(false)}>
                    <div className="bg-white p-6 shadow-2xl border border-[#2d819b] w-[450px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="font-bold mb-4 text-[#1d5b6e] border-b pb-2">Backup Companies</div>
                        <div className="text-[12px] italic text-gray-500 mb-4 text-left">
                            Source: C:\\Users\\Public\\TallyPrime\\data<br />
                            Destination: C:\\Users\\Public\\TallyPrime\\data\\Backup
                        </div>
                        <div className="max-h-[300px] overflow-y-auto border border-gray-200 text-left">
                            {openCompanies.map((c, i) => (
                                <div key={i} className="px-3 py-1 hover:bg-[#dceef5] cursor-pointer font-bold text-[13px]" onClick={() => setShowBackupModal(false)}>{c.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Restore Modal */}
            {showRestoreModal && setShowRestoreModal && (
                <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[100px] bg-black/10" onClick={() => setShowRestoreModal(false)}>
                    <div className="bg-white p-6 shadow-2xl border border-[#2d819b] w-[450px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="font-bold mb-4 text-[#1d5b6e] border-b pb-2">Restore Companies</div>
                        <div className="text-[12px] italic text-gray-500 mb-4 text-left">
                            Path: C:\\Users\\Public\\TallyPrime\\data\\Backup
                        </div>
                        <div className="max-h-[300px] overflow-y-auto border border-gray-200 text-left">
                            <div className="px-3 py-1 hover:bg-[#feba35] cursor-pointer font-bold text-[13px]">Solarica - (10000)</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Repair Modal */}
            {showRepairModal && setShowRepairModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10" onClick={() => setShowRepairModal(false)}>
                    <div className="bg-[#e8f6fa] border border-[#2d819b] shadow-2xl w-[500px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#2d819b] text-white px-2 py-1 font-bold">Repair Company</div>
                        <div className="p-4">
                            <input type="text" className="w-full bg-[#feba35] border border-black px-2 py-1 font-bold outline-none mb-4" placeholder="Select Company to Repair" autoFocus />
                            <div className="bg-[#2d819b] text-white px-2 text-[11px] flex justify-between"><span>List of Companies</span><span>Number</span></div>
                            <div className="max-h-[200px] overflow-y-auto bg-white">
                                {openCompanies.map((c, i) => (
                                    <div key={i} className="flex justify-between px-2 py-0.5 hover:bg-[#dceef5] cursor-pointer text-[13px] font-bold" onClick={() => setShowRepairModal(false)}>
                                        <span>{c.name}</span><span>{c.number}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Migrate Modal */}
            {showMigrateModal && setShowMigrateModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10" onClick={() => setShowMigrateModal(false)}>
                    <div className="bg-[#e8f6fa] border border-[#2d819b] shadow-2xl w-[500px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#2d819b] text-white px-2 py-1 font-bold text-center">Migrate Company Data</div>
                        <div className="p-8 text-center">
                            <div className="font-bold text-[14px] mb-4 text-[#1b5e6b]">Do you want to Migrate Company Data?</div>
                            <div className="text-[12px] text-gray-600 mb-6">Company: {currentCompany}</div>
                            <div className="flex justify-center gap-4">
                                <button className="bg-[#feba35] border border-black px-8 py-1 font-bold" onClick={() => setShowMigrateModal(false)}>Yes</button>
                                <button className="bg-white border border-gray-400 px-8 py-1 font-bold" onClick={() => setShowMigrateModal(false)}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Split Data Modal */}
            {showSplitDataModal && setShowSplitDataModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10" onClick={() => setShowSplitDataModal(false)}>
                    <div className="bg-white p-6 shadow-2xl border border-[#2d819b] w-[500px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="font-bold mb-4 text-[#1d5b6e] border-b pb-2 text-center underline">Split Company Data</div>
                        <div className="space-y-4 font-bold text-[13px]">
                            <div className="flex justify-between"><span>Select Company</span><span className="text-[#1d5b6e]">{currentCompany}</span></div>
                            <div className="flex justify-between"><span>Split from</span><span className="text-[#1d5b6e]">1-Apr-2025</span></div>
                        </div>
                        <div className="mt-8 flex justify-center gap-4">
                            <button className="bg-[#dceef5] border border-[#2d819b] px-6 py-1 font-bold" onClick={() => setShowSplitDataModal(false)}>Analyze</button>
                            <button className="bg-[#feba35] border border-black px-6 py-1 font-bold" onClick={() => setShowSplitDataModal(false)}>Proceed</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Configuration */}
            {showDataConfigModal && setShowDataConfigModal && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center bg-transparent" onClick={() => setShowDataConfigModal(false)}>
                    <div className="bg-white p-4 shadow-2xl border border-[#2d819b] w-[600px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center font-bold text-[14px] border-b mb-4 pb-1 underline">Data Configuration</div>
                        <div className="space-y-2 font-bold text-[13px]">
                            <div className="flex justify-between"><span>Company Data Path</span><span className="text-[#1d5b6e]">C:\\Users\\Public\\TallyPrime\\data</span></div>
                            <div className="flex justify-between"><span>Backup Data Path</span><span className="text-[#1d5b6e]">TallyDrive</span></div>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button className="bg-[#dceef5] border border-[#2d819b] px-6 py-1 font-bold" onClick={() => setShowDataConfigModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Masters Modal */}
            {showImportMastersModal && setShowImportMastersModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10" onClick={() => setShowImportMastersModal(false)}>
                    <div className="bg-white p-8 shadow-2xl border border-gray-300 w-[600px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="font-bold text-[14px] mb-4 text-black border-b border-gray-200 pb-2">Import Masters</div>
                        <div className="font-bold text-[13px] space-y-3">
                            <div className="flex justify-between"><span>File Format</span><span className="text-[#1d5b6e]">XML (Data Interchange)</span></div>
                            <div className="flex justify-between"><span>Import File Name</span><span className="text-[#1d5b6e]">Master.xml</span></div>
                            <div className="flex justify-between"><span>Treatment of duplicate masters</span><span className="text-[#1d5b6e]">Modify with new data</span></div>
                        </div>
                        <div className="mt-10 flex justify-center gap-6">
                            <button className="border-2 border-[#2d819b] px-6 py-1 font-bold text-[#2d819b]">Configure</button>
                            <button className="bg-[#feba35] border border-black px-6 py-1 font-bold" onClick={() => setShowImportMastersModal(false)}>Import</button>
                        </div>
                    </div>
                </div>
            )}

            {renderPlaceholder("Print Configuration", "System and printer configuration for reports.", showPrintConfigModal, setShowPrintConfigModal)}
            {renderPlaceholder("Security", "Security settings for this company are not available in Educational mode.", showSecurityListModal, setShowSecurityListModal)}
            {renderPlaceholder("Online Access", "Online access configuration is currently unavailable.", showOnlineAccessListModal, setShowOnlineAccessListModal)}
            {renderPlaceholder("TallyVault", "TallyVault configuration for security and encryption.", showTallyVaultModal, setShowTallyVaultModal)}
            {renderPlaceholder("Connectivity Error", "Unable to connect to Tally.NET services. Please check your internet connection.", showConnectErrorModal, setShowConnectErrorModal)}
            {renderPlaceholder("TDL Management", "Add/Remove TDLs and Add-ons.", showTDLManagementModal, setShowTDLManagementModal)}
            {renderPlaceholder("Upgrade", "You are already on the latest version of TallyPrime.", showUpgradeModal, setShowUpgradeModal)}
            {renderPlaceholder("Import Transactions", "Import transactions from XML or Excel files.", showImportTransactionsModal, setShowImportTransactionsModal)}
            {renderPlaceholder("Bank Details", "Import bank details for reconciliation.", showImportBankDetailsModal, setShowImportBankDetailsModal)}
            {renderPlaceholder("GST Returns", "Import GST returns from portal.", showImportGSTReturnsModal, setShowImportGSTReturnsModal)}
            {renderPlaceholder("Send for e-Invoicing", "Electronic invoicing is currently in demonstration mode.", showEInvoicingModal, setShowEInvoicingModal)}
            {renderPlaceholder("Send for e-Way Bill", "Electronic Way Bill generation is currently in demonstration mode.", showEWayBillModal, setShowEWayBillModal)}
            {renderPlaceholder("Exchange Configuration", "Configure e-Invoicing and e-Way Bill settings.", showExchangeConfigModal, setShowExchangeConfigModal)}

            {/* About Modal */}
            {showAboutModal && setShowAboutModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30" onClick={() => setShowAboutModal(false)}>
                    <div className="bg-white shadow-2xl border border-gray-400 w-[700px] h-[500px] flex flex-col font-sans overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#1b5e6b] text-white px-4 py-2 flex justify-between items-center font-bold">
                            <span>About TallyPrime</span>
                            <span className="cursor-pointer" onClick={() => setShowAboutModal(false)}>✕</span>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto font-bold text-[13px] text-gray-700">
                            <div className="grid grid-cols-2 gap-8">
                                <section>
                                    <h3 className="text-[#1b5e6b] border-b mb-2">Product Information</h3>
                                    <div className="flex justify-between mb-1"><span>Release</span><span>4.0</span></div>
                                    <div className="flex justify-between mb-1"><span>Application Path</span><span>C:\Program Files\TallyPrime</span></div>
                                </section>
                                <section>
                                    <h3 className="text-[#1b5e6b] border-b mb-2">License Information</h3>
                                    <div className="flex justify-between mb-1"><span>Serial Number</span><span>Educational</span></div>
                                    <div className="flex justify-between mb-1"><span>Account ID</span><span>demo@tally.com</span></div>
                                </section>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-[#1b5e6b] border-b mb-2">Computer Information</h3>
                                <div className="flex justify-between mb-1"><span>Operating System</span><span>Windows 11</span></div>
                                <div className="flex justify-between mb-1"><span>Processor</span><span>Intel Core i7</span></div>
                                <div className="flex justify-between mb-1"><span>Memory</span><span>16 GB</span></div>
                            </div>
                        </div>
                        <div className="bg-[#dcecf5] p-3 text-right">
                            <button className="bg-[#1b5e6b] text-white px-6 py-1 font-bold" onClick={() => setShowAboutModal(false)}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TallyCommonModals;
