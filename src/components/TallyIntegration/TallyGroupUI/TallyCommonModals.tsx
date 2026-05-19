import React, { useState } from 'react';

interface TallyCommonModalsProps {
    showExportCurrentModal: boolean;
    setShowExportCurrentModal: (val: boolean) => void;
    showPrintModal: boolean;
    setShowPrintModal: (val: boolean) => void;
    showPrintReportModal: boolean;
    setShowPrintReportModal: (val: boolean) => void;
    showPrintConfigModal: boolean;
    setShowPrintConfigModal: (val: boolean) => void;
    showCompanyModal: boolean;
    setShowCompanyModal: (val: boolean) => void;
    openCompanies: any[];
    currentCompany: string;
    setCurrentCompany: (name: string) => void;
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
    showCompanyModal,
    setShowCompanyModal,
    openCompanies,
    currentCompany,
    setCurrentCompany
}) => {
    // Local states for sub-modals (to keep it clean)
    const [companyQuery, setCompanyQuery] = useState('');
    const [exportIncludeDependent, setExportIncludeDependent] = useState('No');
    const [exportFormat, setExportFormat] = useState('XML (Data Interchange)');
    const [exportTo, setExportTo] = useState('Local drive');
    const [exportPath, setExportPath] = useState('C:\\Program Files\\TallyPrime');
    const [exportFileName, setExportFileName] = useState('Master.xml');
    const [exportStripeView, setExportStripeView] = useState('No');

    const [printCopies, setPrintCopies] = useState('1');
    const [selectedPrinter, setSelectedPrinter] = useState('Microsoft Print to PDF');
    const [showPrintCopies, setShowPrintCopies] = useState(false);
    const [showPrinterSelect, setShowPrinterSelect] = useState(false);
    const [showPrintFormat, setShowPrintFormat] = useState(false);
    const [printFormat, setPrintFormat] = useState('Neat Mode');
    const [showPagesToPrint, setShowPagesToPrint] = useState(false);
    const [pageStart, setPageStart] = useState('1');
    const [pageRange, setPageRange] = useState('');
    const [showTitleConfig, setShowTitleConfig] = useState(false);
    const [printTitle, setPrintTitle] = useState('List of Reports');
    const [printSubtitle, setPrintSubtitle] = useState('');

    const [printReportQuery, setPrintReportQuery] = useState('');
    const [printReportExpanded, setPrintReportExpanded] = useState(false);
    const [printReportShowMore, setPrintReportShowMore] = useState(false);
    const [printReportShowInactive, setPrintReportShowInactive] = useState(false);

    return (
        <>
            {/* Export Current Modal */}
            {showExportCurrentModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10">
                    <div className="bg-white p-8 px-12 shadow-[0_0_20px_rgba(0,0,0,0.1)] border border-gray-300 w-[600px] h-[450px] relative flex flex-col items-start font-sans" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowExportCurrentModal(false)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 text-[20px] leading-none transition-colors">✕</button>
                        <div className="font-bold text-[14px] mb-2 text-black">Export</div>
                        <div className="border-t border-gray-200 mb-6 w-full"></div>
                        <div className="flex flex-col gap-1.5 mb-8 w-full">
                            <div className="flex items-center"><label className="w-[180px] text-gray-600 text-[13px]">Type of Masters</label><span className="mr-6 font-bold text-black">:</span><span className="font-bold text-black text-[13px]">Groups</span></div>
                            <div className="flex items-center cursor-pointer" onClick={() => setExportIncludeDependent(exportIncludeDependent === 'No' ? 'Yes' : 'No')}><label className="w-[180px] text-gray-600 text-[13px]">Include dependent masters</label><span className="mr-6 font-bold text-black">:</span><span className="font-bold text-black text-[13px]">{exportIncludeDependent}</span></div>
                            <div className="h-6"></div>
                            <div className="flex items-center cursor-pointer"><label className="w-[180px] text-gray-600 text-[13px]">File Format</label><span className="mr-6 font-bold text-black">:</span><span className="font-bold text-[#1d5b6e] text-[13px]">{exportFormat}</span></div>
                            <div className="flex items-center cursor-pointer"><label className="w-[180px] text-gray-600 text-[13px]">Export to</label><span className="mr-6 font-bold text-black">:</span><span className="font-bold text-black text-[13px]">{exportTo}</span></div>
                            <div className="flex items-center cursor-pointer"><label className="w-[180px] text-gray-600 text-[13px]">Folder Path</label><span className="mr-6 font-bold text-black">:</span><span className="font-bold text-black text-[13px]">{exportPath}</span></div>
                            <div className="flex items-center cursor-pointer"><label className="w-[180px] text-gray-600 text-[13px]">File Name</label><span className="mr-6 font-bold text-black">:</span><span className="font-bold text-black text-[13px]">{exportFileName}</span></div>
                            <div className="flex items-center cursor-pointer" onClick={() => setExportStripeView(exportStripeView === 'No' ? 'Yes' : 'No')}><label className="w-[180px] text-gray-600 text-[13px]">Enable Stripe View</label><span className="mr-6 font-bold text-black">:</span><span className="font-bold text-black text-[13px]">{exportStripeView}</span></div>
                        </div>
                        <div className="flex justify-center gap-12 mt-auto w-full pb-2">
                            <div className="border border-[#2d819b] px-6 py-2 cursor-pointer hover:bg-[#f2f9fb] flex items-center justify-center min-w-[130px] rounded-[2px] transition-colors">
                                <span className="text-[#2d819b] font-bold underline decoration-1 underline-offset-2 text-[13px]">C</span><span className="text-black font-bold text-[13px]">: Configure</span>
                            </div>
                            <div className="border border-[#feba35] px-6 py-2 cursor-pointer hover:bg-[#fff9ef] flex items-center justify-center min-w-[130px] rounded-[2px] transition-colors" onClick={() => { alert(`Exporting ${exportFileName}...`); setShowExportCurrentModal(false); }}>
                                <span className="text-[#feba35] font-bold underline decoration-1 underline-offset-2 text-[13px]">E</span><span className="text-black font-bold text-[13px]">: Export</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Modal Overlay */}
            {showPrintModal && (
                <div className="fixed inset-0 z-[150] flex flex-col font-sans bg-white">
                    <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                        <span>Print</span>
                        <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany}</span>
                        <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowPrintModal(false)}>✕</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex justify-center items-center bg-gray-200">
                        <div className="bg-white shadow-xl p-8 w-[700px] min-h-[400px] relative flex flex-col">
                            <div className="border-b border-gray-300 mb-4 pb-2"><div className="uppercase font-bold text-[14px]">Print</div></div>
                            <div className="flex-1 text-[13px] font-bold text-black space-y-2">
                                <div className="flex"><div className="w-[200px]">Printer</div><div className="w-[10px]">:</div><div>{selectedPrinter}</div></div>
                                <div className="flex"><div className="w-[200px]">Number of Copies</div><div className="w-[10px]">:</div><div>{printCopies}</div></div>
                            </div>
                            <div className="mt-8 flex justify-center gap-4">
                                <button className="border border-[#2d819b] text-[#2d819b] px-6 py-1 hover:bg-[#dceef5] font-bold text-[13px]">Configure</button>
                                <button className="border border-[#feba35] bg-white text-[#feba35] px-6 py-1 hover:bg-[#fff9c4] font-bold text-[13px] shadow-sm" onClick={() => { alert('Printing...'); setShowPrintModal(false); }}>Print</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Report Modal (Others) */}
            {showPrintReportModal && (
                <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[50px]">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setShowPrintReportModal(false)}></div>
                    <div className="relative bg-white shadow-2xl border border-[#2d819b] w-[700px] h-[500px] flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowPrintReportModal(false)} className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-black hover:bg-red-500 hover:text-white font-bold text-[18px] z-50">✕</button>
                        <div className="bg-white p-2 text-center border-b border-gray-300">
                            <div className="font-bold text-[14px] text-black mb-1">Print Report</div>
                            <div className="px-8"><input type="text" value={printReportQuery} onChange={(e) => setPrintReportQuery(e.target.value)} className="w-full bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-blue-400" autoFocus /></div>
                        </div>
                        <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px]">List of Reports</div>
                        <div className="flex-1 bg-[#e8f6fa] overflow-y-auto p-2 text-[13px] font-bold text-black relative">
                            <div className="absolute top-0 right-0 p-1 flex flex-col items-end z-10 w-[150px]">
                                <div className="cursor-pointer hover:underline px-2" onClick={() => setPrintReportExpanded(!printReportExpanded)}>{printReportExpanded ? 'Collapse All' : 'Expand All'}</div>
                                <div className="cursor-pointer hover:underline px-2" onClick={() => setPrintReportShowMore(!printReportShowMore)}>{printReportShowMore ? 'Show Less' : 'Show More'}</div>
                            </div>
                            <div className="mt-2 pl-2">
                                <div className="mb-1">VAT Reports</div>
                                <div className="mb-1">Payroll</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Company Modal */}
            {showCompanyModal && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/20" onClick={() => setShowCompanyModal(false)}>
                    <div className="flex flex-col w-[500px] shadow-2xl border border-[#2d819b] font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowCompanyModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] z-50">✕</button>
                        <div className="bg-white p-3 pt-2 text-center border-b border-gray-300">
                            <div className="font-bold text-[13px] text-black mb-1 underline decoration-1 underline-offset-2">Change Company</div>
                            <input type="text" value={companyQuery} onChange={(e) => setCompanyQuery(e.target.value)} className="w-full bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-gray-400" autoFocus />
                        </div>
                        <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px]">List of Companies</div>
                        <div className="bg-[#e8f6fa] h-[400px] relative overflow-y-auto">
                            <div className="absolute right-0 top-0 p-2 text-right text-[13px] text-black font-bold z-10 flex flex-col gap-1 items-end">
                                <div className="cursor-pointer hover:bg-[#dceef5] px-2 w-fit">Create Company</div>
                                <div className="cursor-pointer hover:bg-[#dceef5] px-2 w-fit">Select Company</div>
                                <div className="cursor-pointer hover:bg-[#dceef5] px-2 w-fit">Shut Company</div>
                            </div>
                            <div className="mt-[70px]">
                                {openCompanies.filter(c => c.name.toLowerCase().includes(companyQuery.toLowerCase())).map((comp, idx) => (
                                    <div key={idx} className={`flex justify-between px-4 py-[2px] cursor-pointer border-b border-transparent ${comp.name === currentCompany ? 'bg-[#feba35] text-black font-bold hover:bg-[#feba35]' : 'hover:bg-[#dceef5]'}`} onClick={() => { setCurrentCompany(comp.name); setShowCompanyModal(false); }}>
                                        <span>{comp.name}</span>
                                        <span>({comp.number})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TallyCommonModals;
