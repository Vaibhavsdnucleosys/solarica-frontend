import { useState, useEffect } from 'react';

const MenuOption = ({
    label,
    isActive = false,
    onClick
}: {
    label: string,
    isActive?: boolean,
    onClick?: () => void
}) => {
    const parts = label.split(':');
    const key = parts[0];
    const text = parts[1] || '';

    const baseClasses = "flex items-center px-3 cursor-pointer text-[13px] font-bold rounded-sm h-[22px] border-b-2 border-transparent transition-colors duration-100 select-none whitespace-nowrap";
    const activeClasses = "bg-[#feba35] text-black shadow-sm";
    const inactiveClasses = "text-white hover:bg-white/10 group";

    const currentClasses = isActive ? activeClasses : inactiveClasses;

    return (
        <div
            className={`${baseClasses} ${currentClasses}`}
            onClick={onClick}
        >
            <span className={`mr-[2px] underline decoration-1 underline-offset-2 ${isActive ? 'text-black decoration-black' : 'text-[#feba35] decoration-[#feba35] group-hover:text-[#feba35]'}`}>
                {key}
            </span>
            <span className={`mr-[2px] ${isActive ? 'text-black' : 'text-[#feba35]'}`}>:</span>
            <span className={`${isActive ? 'text-black' : 'text-white'}`}>{text}</span>
        </div>
    );
};

const TallyHeader = (props: {
    onMenuOptionClick?: (menu: string, option: string) => void,
    isCreateMode?: boolean,
    openCompanies?: any[],
    diskCompanies?: any[]
}) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [selectedCompanyItem, setSelectedCompanyItem] = useState('Create');
    const [selectedDataItem, setSelectedDataItem] = useState('Backup & Restore');
    const [selectedExchangeItem, setSelectedExchangeItem] = useState('SendForEInvoicing');
    const [selectedImportItem, setSelectedImportItem] = useState('Masters');
    const [selectedExportItem, setSelectedExportItem] = useState('Others');
    const [selectedPrintItem, setSelectedPrintItem] = useState('Others');
    const [selectedHelpItem, setSelectedHelpItem] = useState('TallyHelp');
    const [selectedShareItem, setSelectedShareItem] = useState('Email');
    const [manageSubItem, setManageSubItem] = useState<string | null>(null);
    const [showExportOthersModal, setShowExportOthersModal] = useState(false);
    const [exportListExpanded, setExportListExpanded] = useState(false);
    const [exportListShowMore, setExportListShowMore] = useState(false);
    const [exportListShowInactive, setExportListShowInactive] = useState(false);
    const [selectedExportListItem, setSelectedExportListItem] = useState('Expand All');
    const [showGSTReturnModal, setShowGSTReturnModal] = useState(false);
    const [selectedGSTItem, setSelectedGSTItem] = useState('GSTR-1');
    const [gstReportType, setGstReportType] = useState<'GSTR-1' | 'GSTR-3B' | null>(null);
    const [gstSidebarAction, setGstSidebarAction] = useState<string | null>(null);
    const [showExportMastersPage, setShowExportMastersPage] = useState(false);
    const [mastersFileFormat, setMastersFileFormat] = useState('XML (Data Interchange)');
    const [mastersExportTo, setMastersExportTo] = useState('Local drive');
    const [mastersFilePath, setMastersFilePath] = useState('C:\\Program Files\\TallyPrime');
    const [mastersFileName, setMastersFileName] = useState('Master.xml');
    const [mastersIncludeDependent, setMastersIncludeDependent] = useState('No');
    const [mastersSidebarAction, setMastersSidebarAction] = useState<string | null>(null);
    const [mastersSelectedFileFormat, setMastersSelectedFileFormat] = useState('XML (Data Interchange)');
    const [mastersSelectedExportTo, setMastersSelectedExportTo] = useState('Local drive');

    const [showExportTransactionsPage, setShowExportTransactionsPage] = useState(false);
    const [transactionsFileFormat, setTransactionsFileFormat] = useState('XML (Data Interchange)');
    const [transactionsExportTo, setTransactionsExportTo] = useState('Local drive');
    const [transactionsFilePath, setTransactionsFilePath] = useState('C:\\Program Files\\TallyPrime');
    const [transactionsFileName, setTransactionsFileName] = useState('Transactions.xml');
    const [transactionsVoucherType, setTransactionsVoucherType] = useState('All Vouchers');
    const [transactionsIncludeDependent, setTransactionsIncludeDependent] = useState('No');
    const [transactionsPeriod, setTransactionsPeriod] = useState('1-Apr-25 to 30-Apr-25');
    const [transactionsSidebarAction, setTransactionsSidebarAction] = useState<string | null>(null);
    const [transactionsSelectedFileFormat, setTransactionsSelectedFileFormat] = useState('XML (Data Interchange)');
    const [transactionsSelectedExportTo, setTransactionsSelectedExportTo] = useState('Local drive');
    const [transactionsSelectedVoucherType, setTransactionsSelectedVoucherType] = useState('All Vouchers');
    const [showExportConfig, setShowExportConfig] = useState(false);
    const [selectedConfigItem, setSelectedConfigItem] = useState('Location of Import/Export Files');
    const [showBackupModal, setShowBackupModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showSplitMenu, setShowSplitMenu] = useState(false);
    const [showRepairCompanyModal, setShowRepairCompanyModal] = useState(false);
    const [showMigrateCompanyModal, setShowMigrateCompanyModal] = useState(false);
    const [showDataConfigurationModal, setShowDataConfigurationModal] = useState(false);
    const [showDataConfigAccept, setShowDataConfigAccept] = useState(false);
    const [showDataConfigQuit, setShowDataConfigQuit] = useState(false);
    const [showEInvoicingModal, setShowEInvoicingModal] = useState(false);
    const [showEWayBillModal, setShowEWayBillModal] = useState(false);
    const [showAboutPageModal, setShowAboutPageModal] = useState(false);
    const [menuSearchQuery, setMenuSearchQuery] = useState('');

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showEmailProfileModal, setShowEmailProfileModal] = useState(false);
    const [showEmailErrorModal, setShowEmailErrorModal] = useState(false);
    const [emailFrom, setEmailFrom] = useState('');
    const [emailTo, setEmailTo] = useState('');
    const [emailSenderName, setEmailSenderName] = useState('Solarica');
    const [selectedEmailProfile, setSelectedEmailProfile] = useState('Create');

    const [showShareOthersModal, setShowShareOthersModal] = useState(false);
    const [shareListExpanded, setShareListExpanded] = useState(false);
    const [shareListShowMore, setShareListShowMore] = useState(false);
    const [shareListShowInactive, setShareListShowInactive] = useState(false);
    const [selectedShareListItem, setSelectedShareListItem] = useState('Expand All');

    const [showEmailConfigModal, setShowEmailConfigModal] = useState(false);
    const [emailConfigShowMore, setEmailConfigShowMore] = useState(false);
    const [selectedEmailConfigItem, setSelectedEmailConfigItem] = useState('Show More');

    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [selectedManageSubItem, setSelectedManageSubItem] = useState<string | null>(null);
    const [showWhatsAppNosModal, setShowWhatsAppNosModal] = useState(false);

    const [showWhatsAppConfigModal, setShowWhatsAppConfigModal] = useState(false);
    const [whatsAppConfigShowMore, setWhatsAppConfigShowMore] = useState(false);
    const [selectedWhatsAppConfigItem, setSelectedWhatsAppConfigItem] = useState('Show More');

    const [showMappingTemplateModal, setShowMappingTemplateModal] = useState(false);
    const [mappingTemplateFile, setMappingTemplateFile] = useState('');
    const [showMappingFileList, setShowMappingFileList] = useState(false);
    const [selectedMappingFile, setSelectedMappingFile] = useState('appdata');
    const [showSpecifyPathModal, setShowSpecifyPathModal] = useState(false);
    const [showSelectDriveModal, setShowSelectDriveModal] = useState(false);
    const [mappingFileShowMore, setMappingFileShowMore] = useState(false);
    const [showSampleExcelModal, setShowSampleExcelModal] = useState(false);
    const [sampleExcelType, setSampleExcelType] = useState<'Masters' | 'Transactions'>('Masters');
    const [showImportConfigModal, setShowImportConfigModal] = useState(false);
    const [importConfigShowMore, setImportConfigShowMore] = useState(false);
    const [selectedImportConfigItem, setSelectedImportConfigItem] = useState('Show More');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Escape key - Close modals and menus
            if (e.key === 'Escape') {
                if (showEmailModal) {
                    setShowEmailModal(false);
                } else if (showShareOthersModal) {
                    setShowShareOthersModal(false);
                } else if (showEmailConfigModal) {
                    setShowEmailConfigModal(false);
                } else if (showEmailProfileModal) {
                    setShowEmailProfileModal(false);
                } else if (showEmailErrorModal) {
                    setShowEmailErrorModal(false);
                } else if (showWhatsAppModal) {
                    setShowWhatsAppModal(false);
                } else if (showWhatsAppNosModal) {
                    setShowWhatsAppNosModal(false);
                } else if (showWhatsAppConfigModal) {
                    setShowWhatsAppConfigModal(false);
                } else if (showMappingTemplateModal) {
                    setShowMappingTemplateModal(false);
                } else if (showSampleExcelModal) {
                    setShowSampleExcelModal(false);
                } else if (showImportConfigModal) {
                    setShowImportConfigModal(false);
                } else if (showSpecifyPathModal) {
                    setShowSpecifyPathModal(false);
                } else if (showSelectDriveModal) {
                    setShowSelectDriveModal(false);
                } else if (showExportConfig) {
                    setShowExportConfig(false);
                } else if (mastersSidebarAction) {
                    setMastersSidebarAction(null);
                } else if (transactionsSidebarAction) {
                    setTransactionsSidebarAction(null);
                } else if (showExportMastersPage) {
                    setShowExportMastersPage(false);
                } else if (showExportTransactionsPage) {
                    setShowExportTransactionsPage(false);
                } else if (activeMenu) {
                    setActiveMenu(null);
                }
                return;
            }

            // Alt+F - Open search/find
            if (e.altKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                // Focus on search input
                const searchInput = document.querySelector('input[placeholder*="Find details"]') as HTMLInputElement;
                if (searchInput) searchInput.focus();
                return;
            }

            // Main Menu Shortcuts (Alt+Key)
            if (e.altKey) {
                e.preventDefault();
                switch (e.key.toLowerCase()) {
                    case 'k':
                        handleMenuClick('Company');
                        break;
                    case 'y':
                        handleMenuClick('Data');
                        break;
                    case 'z':
                        handleMenuClick('Exchange');
                        break;
                    case 'g':
                        handleMenuClick('GoTo');
                        break;
                    case 'o':
                        handleMenuClick('Import');
                        break;
                    case 'e':
                        handleMenuClick('Export');
                        break;
                    case 'm':
                        handleMenuClick('Share');
                        break;
                    case 'p':
                        handleMenuClick('Print');
                        break;
                    case 'f1':
                    case 'h':
                        handleMenuClick('Help');
                        break;
                }
                return;
            }

            // Modal-specific shortcuts (when modals are open)
            // Email Modal shortcuts
            if (showEmailModal && !e.altKey && !e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'q':
                        setShowEmailModal(false);
                        break;
                    case 'a':
                        // Accept action
                        setShowEmailModal(false);
                        break;
                    case 'c':
                        // Configure
                        setShowEmailConfigModal(true);
                        setShowEmailModal(false);
                        break;
                }
                return;
            }

            // WhatsApp Nos Modal shortcuts
            if (showWhatsAppNosModal && !e.altKey && !e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'q':
                        setShowWhatsAppNosModal(false);
                        break;
                    case 'w':
                        window.open('https://tallysolutions.com/tallyprime-with-whatsapp-prerequisites/', '_blank');
                        break;
                    case 'a':
                        // Enter WhatsApp Details
                        break;
                }
                return;
            }

            // Mapping Template Modal shortcuts
            if (showMappingTemplateModal && !e.altKey && !e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'q':
                        setShowMappingTemplateModal(false);
                        break;
                    case 'a':
                        setShowMappingTemplateModal(false);
                        break;
                }
                return;
            }

            // Sample Excel Modal shortcuts
            if (showSampleExcelModal && !e.altKey && !e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'q':
                        setShowSampleExcelModal(false);
                        break;
                    case 'c':
                        // Configure
                        break;
                    case 'e':
                        // Export
                        break;
                    case 'a':
                        setShowSampleExcelModal(false);
                        break;
                }
                return;
            }

            // Import Config Modal shortcuts
            if (showImportConfigModal && !e.altKey && !e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'q':
                        setShowImportConfigModal(false);
                        break;
                    case 'a':
                        setShowImportConfigModal(false);
                        break;
                }
                return;
            }

            // WhatsApp Config Modal shortcuts
            if (showWhatsAppConfigModal && !e.altKey && !e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'q':
                        setShowWhatsAppConfigModal(false);
                        break;
                    case 'a':
                        setShowWhatsAppConfigModal(false);
                        break;
                }
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showEmailModal, showShareOthersModal, showEmailConfigModal, showEmailProfileModal, showEmailErrorModal, showWhatsAppModal, showWhatsAppNosModal, showWhatsAppConfigModal, showMappingTemplateModal, showSampleExcelModal, showImportConfigModal, showSpecifyPathModal, showSelectDriveModal, showExportConfig, mastersSidebarAction, transactionsSidebarAction, showExportMastersPage, showExportTransactionsPage, activeMenu]);

    const handleMenuClick = (menuLabel: string) => {
        if (activeMenu === menuLabel) {
            setActiveMenu(null);
        } else {
            setActiveMenu(menuLabel);
            // Reset selection to default when opening menu
            if (menuLabel === 'Company') {
                if (props.isCreateMode) {
                    setSelectedCompanyItem('Shut');
                } else {
                    setSelectedCompanyItem('Create');
                }
            }
            if (menuLabel === 'Data') setSelectedDataItem('Backup & Restore');
            if (menuLabel === 'Exchange') setSelectedExchangeItem('SendForEInvoicing');
            if (menuLabel === 'Import') setSelectedImportItem('Masters');
            if (menuLabel === 'Export') setSelectedExportItem('Others');
            if (menuLabel === 'Print') setSelectedPrintItem('Others');
            if (menuLabel === 'Help') setSelectedHelpItem('TallyHelp');
            if (menuLabel === 'Share') setSelectedShareItem('Email');
            if (menuLabel === 'GoTo') {
                setSelectedGoToItem('Bills Payable - GST');
                setGoToQuery('');
            }
        }
    };

    const handleItemClick = (menu: string, item: string) => {
        setActiveMenu(null);
        setMenuSearchQuery('');

        // Internal Handlers for standard Tally modals
        if (menu === 'Data') {
            if (item === 'Backup & Restore') { setShowBackupModal(true); return; }
            if (item === 'Backup') { setShowBackupModal(true); return; }
            if (item === 'Restore') { setShowRestoreModal(true); return; }
            if (item === 'Split') { setShowSplitMenu(true); return; }
            if (item === 'Repair') { setShowRepairCompanyModal(true); return; }
            if (item === 'Migrate') { setShowMigrateCompanyModal(true); return; }
            if (item === 'Configuration') { setShowDataConfigurationModal(true); return; }
        }
        if (menu === 'Exchange') {
            if (item === 'SendForEInvoicing') { setShowEInvoicingModal(true); return; }
            if (item === 'SendForEWayBill') { setShowEWayBillModal(true); return; }
        }
        if (menu === 'Help' && item === 'About') {
            setShowAboutPageModal(true);
            return;
        }

        if (item === 'MappingTemplates_Create') {
            setShowMappingTemplateModal(true);
            return;
        }
        if (item === 'SampleExcel_Masters') {
            setSampleExcelType('Masters');
            setShowSampleExcelModal(true);
            return;
        }
        if (item === 'SampleExcel_Transactions') {
            setSampleExcelType('Transactions');
            setShowSampleExcelModal(true);
            return;
        }
        if (props.onMenuOptionClick) {
            props.onMenuOptionClick(menu, item);
        }
    };

    const [goToQuery, setGoToQuery] = useState('');
    const [selectedGoToItem, setSelectedGoToItem] = useState('Bills Payable - GST');

    const getMenuItemClass = (_itemName: string, isSelected: boolean, disabled: boolean = false) => {
        if (disabled) return "flex justify-between items-center px-4 py-1 text-gray-400 cursor-not-allowed";
        return `flex justify-between items-center px-4 py-1 cursor-pointer font-bold group ${isSelected ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#feba35]'}`; // Using hover for fallback, but selection overrides
    };

    return (
        <>
            <div className="relative z-[9999] flex flex-col w-full bg-[#212b35] shadow-md h-[52px] select-none text-white overflow-visible font-sans">
                {/* Top Row: Logo, Search, System Icons */}
                <div className="flex items-center justify-between h-[28px] mt-[1px] px-2 relative w-full">
                    {/* Logo */}
                    <div className="flex items-center mr-4">
                        <div className="text-[#feba35] text-[22px] font-bold italic tracking-tight">
                            Accounting
                        </div>
                    </div>

                    {/* Centered Search */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-[45%] max-w-[650px] z-10">
                        <div className="flex items-center bg-white rounded-[2px] h-[22px] px-2 shadow-sm border border-transparent focus-within:border-[#feba35]">
                            <svg className="w-3.5 h-3.5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input
                                type="text"
                                placeholder="Find details entered in masters and transactions. (Alt+F)"
                                className="bg-transparent border-none outline-none text-[12px] w-full text-black placeholder-gray-400 font-semibold h-full"
                            />
                        </div>
                    </div>

                    {/* System Icons */}
                    <div className="flex items-center text-gray-400 gap-5 scale-[0.85] origin-right ml-auto">
                        <svg className="w-5 h-5 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                        <svg className="w-5 h-5 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"></path></svg>
                        <svg className="w-5 h-5 cursor-pointer hover:text-[#feba35]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                </div>

                {/* Bottom Row: Navigation Menus & Go To */}
                <div className="flex items-center h-[24px] pb-1 w-full relative mt-auto px-1 bg-[#212b35]">
                    <div className="flex items-center gap-1">
                        {/* Go To Button (Centered) - Positioned Absolutely */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center pointer-events-none z-20">
                            <div className="bg-white px-3 h-[20px] rounded-[2px] flex items-center cursor-pointer shadow-sm hover:bg-gray-100 transition-colors pointer-events-auto">
                                <span className="text-[#feba35] text-[12px] font-bold border-b border-[#feba35] mr-1">G</span>
                                <span className="text-[#feba35] text-[12px] font-bold mr-1">:</span>
                                <span className="text-[#feba35] text-[12px] font-bold">Go To</span>
                            </div>
                        </div>

                        <div className="relative">
                            <MenuOption label="K:Company" isActive={activeMenu === 'Company'} onClick={() => handleMenuClick('Company')} />
                            {activeMenu === 'Company' && (
                                <>
                                    {/* Full screen grey overlay */}
                                    <div
                                        className="fixed inset-0 bg-black/40 z-[55]"
                                        onClick={() => setActiveMenu(null)}
                                    ></div>

                                    <div className="absolute top-[26px] left-0 min-w-[240px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[60] flex flex-col text-[13px] font-sans pb-2">
                                        {/* Create */}
                                        {!props.isCreateMode ? (
                                            <div
                                                className={getMenuItemClass('Create', selectedCompanyItem === 'Create')}
                                                onMouseEnter={() => setSelectedCompanyItem('Create')}
                                                onClick={() => handleItemClick('Company', 'Create')}
                                            >
                                                <span><span className="text-[#1d5b6e]">C</span>reate</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center px-4 py-1 text-gray-400 cursor-not-allowed">
                                                <span>Create</span>
                                            </div>
                                        )}

                                        {/* Alter */}
                                        {!props.isCreateMode ? (
                                            <div
                                                className={getMenuItemClass('Alter', selectedCompanyItem === 'Alter')}
                                                onMouseEnter={() => setSelectedCompanyItem('Alter')}
                                                onClick={() => handleItemClick('Company', 'Alter')}
                                            >
                                                <span><span className="text-[#1d5b6e]">A</span>lter</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center px-4 py-1 text-gray-400 cursor-not-allowed">
                                                <span>Alter</span>
                                            </div>
                                        )}

                                        {/* Change */}
                                        {!props.isCreateMode ? (
                                            <div
                                                className={getMenuItemClass('Change', selectedCompanyItem === 'Change')}
                                                onMouseEnter={() => setSelectedCompanyItem('Change')}
                                                onClick={() => handleItemClick('Company', 'Change')}
                                            >
                                                <span>Chan<span className="text-[#1d5b6e]">G</span>e</span>
                                                <span className="text-[#1d5b6e] font-bold text-[12px]">F3</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center px-4 py-1 text-gray-400 cursor-not-allowed">
                                                <span>Chan<span className="text-gray-400">G</span>e</span>
                                                <span className="text-gray-400 font-bold text-[12px]">F3</span>
                                            </div>
                                        )}

                                        {/* Select */}
                                        {!props.isCreateMode ? (
                                            <div
                                                className={getMenuItemClass('Select', selectedCompanyItem === 'Select')}
                                                onMouseEnter={() => setSelectedCompanyItem('Select')}
                                                onClick={() => handleItemClick('Company', 'Select')}
                                            >
                                                <span><span className="text-[#1d5b6e]">S</span>elect</span>
                                                <span className="text-[#1d5b6e] font-bold text-[12px]">Alt+F3</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center px-4 py-1 text-gray-400 cursor-not-allowed">
                                                <span><span className="text-gray-400">S</span>elect</span>
                                                <span className="text-gray-400 font-bold text-[12px]">Alt+F3</span>
                                            </div>
                                        )}
                                        {/* Shut */}
                                        <div
                                            className={getMenuItemClass('Shut', selectedCompanyItem === 'Shut')}
                                            onMouseEnter={() => setSelectedCompanyItem('Shut')}
                                            onClick={() => handleItemClick('Company', 'Shut')}
                                        >
                                            <span>S<span className="text-[#1d5b6e]">H</span>ut</span>
                                            <span className="text-[#1d5b6e] font-bold text-[12px]">Ctrl+F3</span>
                                        </div>

                                        {/* ONLINE ACCESS Header */}
                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Online Access</div>

                                        {/* Connect */}
                                        <div
                                            className={getMenuItemClass('Connect', selectedCompanyItem === 'Connect')}
                                            onMouseEnter={() => setSelectedCompanyItem('Connect')}
                                            onClick={() => handleItemClick('Company', 'Connect')}
                                        >
                                            <span>C<span className="text-[#1d5b6e]">O</span>nnect</span>
                                        </div>
                                        {/* Disconnect */}
                                        <div className={getMenuItemClass('Disconnect', false, true)}>
                                            <span>Disconnect</span>
                                        </div>
                                        {/* Connectivity Status */}
                                        <div className={getMenuItemClass('ConnectivityStatus', false, true)}>
                                            <span>Connectivity Status</span>
                                        </div>
                                        {/* Remote Access */}
                                        <div
                                            className={getMenuItemClass('RemoteAccess', selectedCompanyItem === 'RemoteAccess')}
                                            onMouseEnter={() => setSelectedCompanyItem('RemoteAccess')}
                                            onClick={() => handleItemClick('Company', 'Remote Access')}
                                        >
                                            <span>Re<span className="text-[#1d5b6e]">M</span>ote Access</span>
                                        </div>
                                        {/* Browser Access */}
                                        <div
                                            className={getMenuItemClass('BrowserAccess', selectedCompanyItem === 'BrowserAccess')}
                                            onMouseEnter={() => setSelectedCompanyItem('BrowserAccess')}
                                            onClick={() => handleItemClick('Company', 'Browser Access')}
                                        >
                                            <span><span className="text-[#1d5b6e]">B</span>rowser Access</span>
                                        </div>

                                        {/* CONFIGURE Header */}
                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Configure</div>

                                        {/* Features */}
                                        {/* Features */}
                                        {!props.isCreateMode ? (
                                            <div
                                                className={getMenuItemClass('Features', selectedCompanyItem === 'Features')}
                                                onMouseEnter={() => setSelectedCompanyItem('Features')}
                                                onClick={() => handleItemClick('Company', 'Features')}
                                            >
                                                <span><span className="text-[#1d5b6e]">F</span>eatures</span>
                                                <span className="text-[#1d5b6e] font-bold text-[12px]">F11</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center px-4 py-1 text-gray-400 cursor-not-allowed">
                                                <span><span className="text-gray-400">F</span>eatures</span>
                                                <span className="text-gray-400 font-bold text-[12px]">F11</span>
                                            </div>
                                        )}
                                        {/* Security */}
                                        <div
                                            className={getMenuItemClass('Security', selectedCompanyItem === 'Security')}
                                            onMouseEnter={() => setSelectedCompanyItem('Security')}
                                            onClick={() => handleItemClick('Company', 'Security')}
                                        >
                                            <span>S<span className="text-[#1d5b6e]">E</span>curity</span>
                                        </div>
                                        {/* TallyVault */}
                                        <div
                                            className={getMenuItemClass('TallyVault', selectedCompanyItem === 'TallyVault')}
                                            onMouseEnter={() => setSelectedCompanyItem('TallyVault')}
                                            onClick={() => handleItemClick('Company', 'TallyVault')}
                                        >
                                            <span><span className="text-[#1d5b6e]">T</span>allyVault</span>
                                        </div>
                                        {/* Online Access */}
                                        <div
                                            className={getMenuItemClass('OnlineAccess', selectedCompanyItem === 'OnlineAccess')}
                                            onMouseEnter={() => setSelectedCompanyItem('OnlineAccess')}
                                            onClick={() => handleItemClick('Company', 'Online Access')}
                                        >
                                            <span>O<span className="text-[#1d5b6e]">N</span>line Access</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Data Menu */}
                        <div className="relative">
                            <MenuOption label="Y:Data" isActive={activeMenu === 'Data'} onClick={() => handleMenuClick('Data')} />
                            {activeMenu === 'Data' && (
                                <>
                                    {/* Full screen grey overlay */}
                                    <div
                                        className="fixed inset-0 bg-black/40 z-[55]"
                                        onClick={() => setActiveMenu(null)}
                                    ></div>

                                    <div className="absolute top-[26px] left-0 min-w-[240px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[60] flex flex-col text-[13px] font-sans pb-2">

                                        {/* COMPANY DATA Header */}
                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Company Data</div>

                                        {/* Backup & Restore */}
                                        <div
                                            className={`${getMenuItemClass('Backup', selectedDataItem === 'Backup & Restore')} relative`}
                                            onMouseEnter={() => setSelectedDataItem('Backup & Restore')}
                                        >
                                            <span><span className="text-[#1d5b6e]">B</span>ackup & Restore</span>
                                            <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>

                                            {/* Submenu for Backup */}
                                            {selectedDataItem === 'Backup & Restore' && (
                                                <div className="absolute left-full top-0 w-[220px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[70] flex flex-col text-[13px] font-sans text-black pb-2" onClick={(e) => e.stopPropagation()}>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer font-bold" onClick={() => handleItemClick('Data', 'Backup')}>
                                                        <span className="text-[#1d5b6e]">B</span>ackup
                                                    </div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">Schedule Backup</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer font-bold" onClick={() => handleItemClick('Data', 'Restore')}>
                                                        <span className="text-[#1d5b6e]">R</span>estore
                                                    </div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">
                                                        <span className="text-[#1d5b6e]">M</span>anage TallyDrive
                                                    </div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">
                                                        TallyDrive Login & Logout
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Split */}
                                        <div
                                            className={`${getMenuItemClass('Split', selectedDataItem === 'Split')} relative`}
                                            onMouseEnter={() => setSelectedDataItem('Split')}
                                        >
                                            <span><span className="text-[#1d5b6e]">S</span>plit</span>
                                            <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>

                                            {/* Submenu for Split */}
                                            {selectedDataItem === 'Split' && (
                                                <div className="absolute left-full top-0 w-[200px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[70] flex flex-col text-[13px] font-sans text-black pb-2" onClick={(e) => e.stopPropagation()}>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer" onClick={() => handleItemClick('Data', 'VerifyData')}>Verify Data</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer" onClick={() => handleItemClick('Data', 'SplitData')}>Split Data</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* TROUBLESHOOTING Header */}
                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Troubleshooting</div>

                                        {/* RepAir */}
                                        <div
                                            className={getMenuItemClass('Repair', selectedDataItem === 'Repair')}
                                            onMouseEnter={() => setSelectedDataItem('Repair')}
                                            onClick={() => handleItemClick('Data', 'Repair')}
                                        >
                                            <span>Rep<span className="text-[#1d5b6e]">A</span>ir</span>
                                        </div>

                                        {/* Migrate */}
                                        <div
                                            className={getMenuItemClass('Migrate', selectedDataItem === 'Migrate')}
                                            onMouseEnter={() => setSelectedDataItem('Migrate')}
                                            onClick={() => handleItemClick('Data', 'Migrate')}
                                        >
                                            <span><span className="text-[#1d5b6e]">M</span>igrate</span>
                                        </div>

                                        {/* All Exceptions */}
                                        <div className="flex justify-between items-center px-4 py-1 text-gray-400 cursor-not-allowed">
                                            <span>All Exceptions</span>
                                        </div>

                                        {/* CONFIGURE Header */}
                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Configure</div>

                                        {/* Configuration */}
                                        <div
                                            className={getMenuItemClass('Configuration', selectedDataItem === 'Configuration')}
                                            onMouseEnter={() => setSelectedDataItem('Configuration')}
                                            onClick={() => handleItemClick('Data', 'Configuration')}
                                        >
                                            <span><span className="text-[#1d5b6e]">C</span>onfiguration</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Exchange Menu */}
                        <div className="relative">
                            <MenuOption label="Z:Exchange" isActive={activeMenu === 'Exchange'} onClick={() => handleMenuClick('Exchange')} />
                            {activeMenu === 'Exchange' && (
                                <>
                                    {/* Full screen grey overlay */}
                                    <div
                                        className="fixed inset-0 bg-black/40 z-[55]"
                                        onClick={() => setActiveMenu(null)}
                                    ></div>

                                    <div className="absolute top-[26px] left-0 min-w-[240px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[60] flex flex-col text-[13px] font-sans pb-2">

                                        {/* GST Header */}
                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">GST</div>

                                        {/* Send for e-Invoicing */}
                                        <div
                                            className={getMenuItemClass('SendForEInvoicing', selectedExchangeItem === 'SendForEInvoicing')}
                                            onMouseEnter={() => setSelectedExchangeItem('SendForEInvoicing')}
                                            onClick={() => handleItemClick('Exchange', 'SendForEInvoicing')}
                                        >
                                            <span>Send for e-Invoicing</span>
                                        </div>

                                        {/* Send for e-Way Bill */}
                                        <div
                                            className={getMenuItemClass('SendForEWayBill', selectedExchangeItem === 'SendForEWayBill')}
                                            onMouseEnter={() => setSelectedExchangeItem('SendForEWayBill')}
                                            onClick={() => handleItemClick('Exchange', 'SendForEWayBill')}
                                        >
                                            <span>Send for e-<span className="text-[#1d5b6e]">W</span>ay Bill</span>
                                        </div>

                                        {/* All GST Options */}
                                        {/* All GST Options */}
                                        <div
                                            className={`${getMenuItemClass('AllGSTOptions', selectedExchangeItem === 'AllGSTOptions')} relative`}
                                            onMouseEnter={() => setSelectedExchangeItem('AllGSTOptions')}
                                        >
                                            <span>All <span className="text-[#1d5b6e]">G</span>ST Options</span>
                                            <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>

                                            {/* Submenu for All GST Options */}
                                            {selectedExchangeItem === 'AllGSTOptions' && (
                                                <div className="absolute left-full top-0 w-[240px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[70] flex flex-col text-[13px] font-sans text-black pb-2" onClick={(e) => e.stopPropagation()}>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">GST Login & Logout</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer" onClick={() => handleItemClick('Exchange', 'SendForEInvoicing')}>
                                                        Send for e-Invoicing
                                                    </div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer" onClick={() => handleItemClick('Exchange', 'SendForEWayBill')}>
                                                        Send for e-Way Bill
                                                    </div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer"><span className="text-[#1d5b6e]">U</span>pload GST Returns</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer"><span className="text-[#1d5b6e]">D</span>ownload GST Returns</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer"><span className="text-[#1d5b6e]">R</span>ecompute GSTR-2B</div>
                                                    <div className="h-[4px]"></div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">Download <span className="text-[#1d5b6e]">I</span>MS Inward Invoices</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">U<span className="text-[#1d5b6e]">P</span>load IMS Inward Invoices</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">Reset IMS Inw<span className="text-[#1d5b6e]">A</span>rd Action Status</div>
                                                    <div className="h-[4px]"></div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">R<span className="text-[#1d5b6e]">E</span>fresh GST Status</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer"><span className="text-[#1d5b6e]">F</span>ile GSTR-1</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* BANKING Header */}
                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Banking</div>

                                        {/* Send Payments */}
                                        <div className="flex justify-between items-center px-4 py-1 text-gray-400 cursor-not-allowed">
                                            <span>Send <span className="text-gray-400">P</span>ayments</span>
                                        </div>

                                        {/* Get Balance */}
                                        <div
                                            className={getMenuItemClass('GetBalance', selectedExchangeItem === 'GetBalance')}
                                            onMouseEnter={() => setSelectedExchangeItem('GetBalance')}
                                            onClick={() => handleItemClick('Exchange', 'GetBalance')}
                                        >
                                            <span>Get B<span className="text-[#1d5b6e]">A</span>lance</span>
                                        </div>

                                        {/* All Banking Options */}
                                        <div
                                            className={`${getMenuItemClass('AllBankingOptions', selectedExchangeItem === 'AllBankingOptions')} relative`}
                                            onMouseEnter={() => setSelectedExchangeItem('AllBankingOptions')}
                                        >
                                            <span>All <span className="text-[#1d5b6e]">B</span>anking Options</span>
                                            <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>
                                            {selectedExchangeItem === 'AllBankingOptions' && (
                                                <div className="absolute left-full top-0 w-[200px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[70] flex flex-col text-[13px] font-sans text-black pb-2" onClick={(e) => e.stopPropagation()}>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer"><span className="text-[#1d5b6e]">L</span>ogin & Logout</div>
                                                    <div className="text-gray-400 px-4 py-[2px] cursor-not-allowed">Send Payments</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">Get <span className="text-[#1d5b6e]">S</span>tatement</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer" onClick={() => handleItemClick('Exchange', 'GetBalance')}>Get B<span className="text-[#1d5b6e]">A</span>lance</div>
                                                    <div className="h-[4px]"></div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">Bank <span className="text-[#1d5b6e]">C</span>onnections</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Configure */}
                                        <div
                                            className={getMenuItemClass('Configure', selectedExchangeItem === 'Configure')}
                                            onMouseEnter={() => setSelectedExchangeItem('Configure')}
                                            onClick={() => handleItemClick('Exchange', 'Configure')}
                                        >
                                            <span><span className="text-[#1d5b6e]">C</span>onfigure</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Center Go To - Absolutely Positioned to match Search Bar center */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[4px] z-[50]">
                        <MenuOption label="G:Go To" isActive={activeMenu === 'GoTo'} onClick={() => handleMenuClick('GoTo')} />

                        {activeMenu === 'GoTo' && (
                            <>
                                {/* Full Screen Overlay */}
                                <div className="fixed inset-0 bg-black/40 z-[55]" onClick={() => setActiveMenu(null)}></div>

                                {/* Go To Modal */}
                                <div className="fixed top-[60px] left-1/2 transform -translate-x-1/2 w-[600px] bg-[#f2f7fc] border-[2px] border-[#2d819b] shadow-2xl z-[60] flex flex-col font-sans text-[13px]">

                                    {/* Header Area */}
                                    <div className="bg-white p-2 border-b border-gray-300 text-center">
                                        <div className="text-[14px] font-bold text-gray-800">Solarica</div>
                                        <div className="text-[16px] font-bold text-black mt-1">Go To</div>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={goToQuery}
                                                onChange={(e) => setGoToQuery(e.target.value)}
                                                className="w-full border border-gray-400 bg-[#fff9c4] px-2 py-1 outline-none text-black font-bold text-center"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {/* List Content */}
                                    <div className="flex flex-col h-[500px]">
                                        {/* Top Actions */}
                                        <div className="bg-[#eaf4fa] px-4 py-1 text-center border-b border-[#bfdcf0]">
                                            <div className="cursor-pointer hover:underline text-gray-800">Show Opened Reports</div>
                                            <div className="cursor-pointer hover:underline text-gray-800">Create Voucher</div>
                                            <div className="cursor-pointer hover:underline text-gray-800">Create Master</div>
                                            <div className="cursor-pointer hover:underline text-gray-800">Alter Master</div>
                                            <div className="cursor-pointer hover:underline text-gray-800">Expand All</div>
                                            <div className="cursor-pointer hover:underline text-gray-800">Show More</div>
                                        </div>

                                        {/* List Header */}
                                        <div className="bg-[#2d819b] text-white font-bold px-2 py-1">
                                            List of Reports
                                        </div>

                                        {/* Scrollable List */}
                                        <div className="overflow-y-auto flex-1 bg-white">
                                            {/* Saved Views */}
                                            <div className="font-bold px-2 py-1 text-black border-b border-gray-100">Saved Views</div>
                                            {[
                                                { name: 'Bills Payable - GST', type: '(Predefined)', context: 'Bills Payable (All Companies)' },
                                                { name: 'Bills Payable - GST - Sundry Creditors', type: '(Predefined)', context: 'Bills Payable (All Companies)' },
                                                { name: 'Bills Payable - GST - Sundry Debtors', type: '(Predefined)', context: 'Bills Payable (All Companies)' },
                                                { name: 'Bills Receivable - GST', type: '(Predefined)', context: 'Bills Receivable (All Companies)' },
                                                { name: 'Purchase Dashboard', type: '(Predefined)', context: 'Dashboard (All Companies)' },
                                                { name: 'Sales Dashboard', type: '(Predefined)', context: 'Dashboard (All Companies)' },
                                                { name: 'IMS Inward Supplies - Filed Invoices', type: '(Predefined)', context: 'IMS Inward Supplies (All Companies)' },
                                                { name: 'Ledger Vouchers - GST Details', type: '(Predefined)', context: 'Ledger Vouchers (All Companies)' },
                                                { name: 'Outstanding MSME Bills', type: '(Predefined)', context: 'Bills Payable - Micro & Small (All Companies)' },
                                            ].map((item) => (
                                                <div
                                                    key={item.name}
                                                    className={`flex justify-between px-2 py-[2px] cursor-pointer ${selectedGoToItem === item.name ? 'bg-[#feba35] font-bold text-black' : 'text-black hover:bg-[#ffe599]'}`}
                                                    onMouseEnter={() => setSelectedGoToItem(item.name)}
                                                    onClick={() => setSelectedGoToItem(item.name)}
                                                >
                                                    <span>{item.name}</span>
                                                    <div className="flex gap-4 italic text-[12px]">
                                                        <span>{item.type}</span>
                                                        <span className="text-right w-[200px] truncate">{item.context}</span>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Common Reports */}
                                            <div className="font-bold px-2 py-1 text-black border-b border-gray-100 mt-2">Common Reports</div>
                                            {[
                                                'Dashboard', 'Balance Sheet', 'Profit & Loss A/c', 'Cash/Bank Book', 'Day Book',
                                                'Ledger Vouchers', 'Ledger Vouchers - GST', 'Stock Summary', 'Trial Balance',
                                                'Bills Receivable', 'Bills Payable', 'Master and Voucher Statistics'
                                            ].map((item) => (
                                                <div
                                                    key={item}
                                                    className={`flex justify-between px-2 py-[2px] cursor-pointer ${selectedGoToItem === item ? 'bg-[#feba35] font-bold text-black' : 'text-black hover:bg-[#ffe599]'}`}
                                                    onMouseEnter={() => setSelectedGoToItem(item)}
                                                    onClick={() => setSelectedGoToItem(item)}
                                                >
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="bg-[#eaf4fa] text-right px-2 py-1 text-[11px] text-[#2d819b] font-bold border-t border-[#bfdcf0]">
                                            15 ▼
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Side Menus */}
                    <div className="flex items-center ml-auto pr-4 gap-6">

                        {/* Import Menu */}
                        <div className="relative">
                            <MenuOption label="O:Import" isActive={activeMenu === 'Import'} onClick={() => handleMenuClick('Import')} />
                            {activeMenu === 'Import' && (
                                <>
                                    <div className="fixed inset-0 bg-black/40 z-[55]" onClick={() => setActiveMenu(null)}></div>
                                    <div className="absolute top-[26px] right-0 min-w-[240px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[60] flex flex-col text-[13px] font-sans pb-2 overflow-visible">
                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Company Data</div>
                                        <div
                                            className={getMenuItemClass('Masters', selectedImportItem === 'Masters')}
                                            onMouseEnter={() => setSelectedImportItem('Masters')}
                                            onClick={() => handleItemClick('Import', 'Masters')}
                                        >
                                            <span><span className="text-[#1d5b6e]">M</span>asters</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('Transactions', selectedImportItem === 'Transactions')}
                                            onMouseEnter={() => setSelectedImportItem('Transactions')}
                                            onClick={() => handleItemClick('Import', 'Transactions')}
                                        >
                                            <span><span className="text-[#1d5b6e]">T</span>ransactions</span>
                                        </div>

                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Exceptions</div>
                                        <div
                                            className={getMenuItemClass('BankDetails', selectedImportItem === 'BankDetails')}
                                            onMouseEnter={() => setSelectedImportItem('BankDetails')}
                                            onClick={() => handleItemClick('Import', 'BankDetails')}
                                        >
                                            <span><span className="text-[#1d5b6e]">B</span>ank Details</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('BankStatement', selectedImportItem === 'BankStatement')}
                                            onMouseEnter={() => setSelectedImportItem('BankStatement')}
                                            onClick={() => handleItemClick('Import', 'BankStatement')}
                                        >
                                            <span>Ban<span className="text-[#1d5b6e]">K</span> Statement</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('GSTReturns', selectedImportItem === 'GSTReturns')}
                                            onMouseEnter={() => setSelectedImportItem('GSTReturns')}
                                            onClick={(e) => { e.stopPropagation(); handleItemClick('Import', 'GSTReturns'); }}
                                        >
                                            <span><span className="text-[#1d5b6e]">G</span>ST Returns</span>
                                        </div>

                                        <div
                                            className={`${getMenuItemClass('Manage', selectedImportItem === 'Manage')} relative`}
                                            onMouseEnter={() => setSelectedImportItem('Manage')}
                                            onClick={() => setSelectedImportItem('Manage')}
                                        >
                                            <span>M<span className="text-[#1d5b6e]">A</span>nage</span>
                                            <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>

                                            {/* Manage Submenu */}
                                            {selectedImportItem === 'Manage' && (
                                                <div className="absolute top-[-2px] right-full min-w-[240px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[9999] flex flex-col text-[13px] font-sans pb-2 mr-[-4px] overflow-visible">
                                                    <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Excel</div>

                                                    {/* Mapping Templates */}
                                                    <div
                                                        className={`px-4 py-[2px] cursor-pointer flex justify-between items-center relative ${manageSubItem === 'MappingTemplates' ? 'bg-[#feba35] z-50' : 'hover:bg-[#feba35] z-auto'} overflow-visible`}
                                                        onMouseEnter={() => setManageSubItem('MappingTemplates')}
                                                    >
                                                        <span className="text-black">Mapping Templates</span>
                                                        <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>

                                                        {/* Mapping Templates Submenu */}
                                                        {manageSubItem === 'MappingTemplates' && (
                                                            <div className="absolute top-0 right-full min-w-[200px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[10000] flex flex-col text-[13px] font-sans pb-2 mr-[-4px] block visible">
                                                                <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Masters</div>
                                                                <div
                                                                    className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer text-black"
                                                                    onClick={(e) => { e.stopPropagation(); handleItemClick('Import', 'MappingTemplates_Create'); }}
                                                                >
                                                                    <span>C<span className="text-[#1d5b6e]">R</span>eate</span>
                                                                </div>
                                                                <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer text-black opacity-100">
                                                                    <span>ALter</span>
                                                                </div>

                                                                <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Transactions</div>
                                                                <div
                                                                    className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer text-black"
                                                                    onClick={(e) => { e.stopPropagation(); handleItemClick('Import', 'MappingTemplates_Create'); }} // Using same modal for now
                                                                >
                                                                    <span>C<span className="text-[#1d5b6e]">R</span>eate</span>
                                                                </div>
                                                                <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer text-black opacity-100">
                                                                    <span>ALter</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={`px-4 py-[2px] cursor-pointer flex justify-between items-center relative ${manageSubItem === 'SampleExcel' ? 'bg-[#feba35] z-50' : 'hover:bg-[#feba35] z-auto'} overflow-visible`}
                                                        onMouseEnter={() => setManageSubItem('SampleExcel')}
                                                    >
                                                        <span className="text-black">Sample Excel File</span>
                                                        <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>

                                                        {/* Sub-Submenu */}
                                                        {manageSubItem === 'SampleExcel' && (
                                                            <div className="absolute top-0 right-full min-w-[200px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[10000] flex flex-col text-[13px] font-sans pb-2 mr-[-4px] block visible">
                                                                <div
                                                                    className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer text-black mt-2"
                                                                    onClick={(e) => { e.stopPropagation(); handleItemClick('Import', 'SampleExcel_Masters'); }}
                                                                >
                                                                    <span><span className="text-[#1d5b6e]">M</span>asters</span>
                                                                </div>
                                                                <div
                                                                    className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer text-black"
                                                                    onClick={(e) => { e.stopPropagation(); handleItemClick('Import', 'SampleExcel_Transactions'); }}
                                                                >
                                                                    <span><span className="text-[#1d5b6e]">T</span>ransactions</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className={getMenuItemClass('Configuration', selectedImportItem === 'Configuration')}
                                            onMouseEnter={() => setSelectedImportItem('Configuration')}
                                            onClick={() => {
                                                setShowImportConfigModal(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span>Co<span className="text-[#1d5b6e]">N</span>figuration</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Export Menu */}
                        <div className="relative">
                            <MenuOption label="E:Export" isActive={activeMenu === 'Export'} onClick={() => handleMenuClick('Export')} />
                            {activeMenu === 'Export' && (
                                <>
                                    <div className="fixed inset-0 bg-black/40 z-[55]" onClick={() => setActiveMenu(null)}></div>
                                    <div className="absolute top-[26px] left-0 min-w-[240px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[60] flex flex-col text-[13px] font-sans pb-2">
                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Exports</div>
                                        <div
                                            className={getMenuItemClass('Current', selectedExportItem === 'Current')}
                                            onMouseEnter={() => setSelectedExportItem('Current')}
                                            onClick={() => handleItemClick('Export', 'Current')}
                                        >
                                            <span>Cu<span className="text-[#1d5b6e]">R</span>rent</span>
                                            <span className={`${selectedExportItem === 'Current' ? 'text-black' : 'text-gray-400'} font-bold text-[12px]`}>Ctrl+E</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('Others', selectedExportItem === 'Others')}
                                            onMouseEnter={() => setSelectedExportItem('Others')}
                                            onClick={() => {
                                                setShowExportOthersModal(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span><span className="text-[#1d5b6e]">O</span>thers</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('GSTReturns', selectedExportItem === 'GSTReturns')}
                                            onMouseEnter={() => setSelectedExportItem('GSTReturns')}
                                            onClick={() => {
                                                setShowGSTReturnModal(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span><span className="text-[#1d5b6e]">G</span>ST Returns</span>
                                        </div>

                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Company Data</div>
                                        <div
                                            className={getMenuItemClass('Masters', selectedExportItem === 'Masters')}
                                            onMouseEnter={() => setSelectedExportItem('Masters')}
                                            onClick={() => {
                                                setShowExportMastersPage(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span><span className="text-[#1d5b6e]">M</span>asters</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('Transactions', selectedExportItem === 'Transactions')}
                                            onMouseEnter={() => setSelectedExportItem('Transactions')}
                                            onClick={() => {
                                                setShowExportTransactionsPage(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span><span className="text-[#1d5b6e]">T</span>ransactions</span>
                                        </div>

                                        <div
                                            className={getMenuItemClass('Configuration', selectedExportItem === 'Configuration')}
                                            onMouseEnter={() => setSelectedExportItem('Configuration')}
                                            onClick={() => {
                                                setShowExportConfig(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span>Co<span className="text-[#1d5b6e]">N</span>figuration</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Share Menu */}
                        <div className="relative">
                            <MenuOption label="M:Share" isActive={activeMenu === 'Share'} onClick={() => handleMenuClick('Share')} />
                            {activeMenu === 'Share' && (
                                <>
                                    <div className="fixed inset-0 bg-black/40 z-[55]" onClick={() => setActiveMenu(null)}></div>
                                    <div className="absolute top-[26px] left-0 min-w-[240px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[60] flex flex-col text-[13px] font-sans pb-2">
                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">E-Mail</div>
                                        <div
                                            className={getMenuItemClass('Current', selectedShareItem === 'Current')}
                                            onMouseEnter={() => setSelectedShareItem('Current')}
                                            onClick={() => {
                                                setShowEmailModal(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span>Cu<span className="text-[#1d5b6e]">R</span>rent</span>
                                            <span className={`${selectedShareItem === 'Current' ? 'text-black' : 'text-gray-400'} font-bold text-[12px]`}>Ctrl+M</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('Others', selectedShareItem === 'Others')}
                                            onMouseEnter={() => setSelectedShareItem('Others')}
                                            onClick={() => {
                                                setShowShareOthersModal(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span><span className="text-[#1d5b6e]">O</span>thers</span>
                                        </div>

                                        <div
                                            className={getMenuItemClass('Configuration', selectedShareItem === 'Configuration')}
                                            onMouseEnter={() => setSelectedShareItem('Configuration')}
                                            onClick={() => {
                                                setShowEmailConfigModal(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span>Co<span className="text-[#1d5b6e]">N</span>figuration</span>
                                        </div>

                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">WhatsApp</div>
                                        <div
                                            className={getMenuItemClass('CurrentWA', selectedShareItem === 'CurrentWA')}
                                            onMouseEnter={() => setSelectedShareItem('CurrentWA')}
                                            onClick={() => {
                                                setShowWhatsAppModal(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span>Cu<span className="text-[#1d5b6e]">R</span>rent</span>
                                            <span className={`${selectedShareItem === 'CurrentWA' ? 'text-black' : 'text-gray-400'} font-bold text-[12px]`}>Ctrl+Alt+W</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('OthersWA', selectedShareItem === 'OthersWA')}
                                            onMouseEnter={() => setSelectedShareItem('OthersWA')}
                                            onClick={() => {
                                                setShowWhatsAppModal(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span><span className="text-[#1d5b6e]">O</span>thers</span>
                                        </div>

                                        <div
                                            className={`${getMenuItemClass('Manage', selectedShareItem === 'Manage')} relative`}
                                            onMouseEnter={() => setSelectedShareItem('Manage')}
                                            onClick={() => setSelectedShareItem('Manage')}
                                        >
                                            <span><span className="text-[#1d5b6e]">M</span>anage</span>
                                            <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>

                                            {/* Manage Submenu */}
                                            {selectedShareItem === 'Manage' && (
                                                <div className="absolute right-full top-0 mr-[-1px] min-w-[220px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[70] flex flex-col text-[13px] font-sans pb-2">
                                                    <div
                                                        className={getMenuItemClass('WhatsAppNos', selectedManageSubItem === 'WhatsAppNos')}
                                                        onMouseEnter={() => setSelectedManageSubItem('WhatsAppNos')}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowWhatsAppNosModal(true);
                                                            setActiveMenu(null);
                                                        }}
                                                    >
                                                        <span><span className="text-[#1d5b6e]">W</span>hatsApp Nos.</span>
                                                    </div>
                                                    <div
                                                        className={getMenuItemClass('SignUpWhatsApp', selectedManageSubItem === 'SignUpWhatsApp')}
                                                        onMouseEnter={() => setSelectedManageSubItem('SignUpWhatsApp')}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open('https://tallysolutions.com/tallyprime-with-whatsapp-prerequisites/', '_blank');
                                                            setActiveMenu(null);
                                                        }}
                                                    >
                                                        <span><span className="text-[#1d5b6e]">S</span>ign Up for WhatsApp</span>
                                                    </div>
                                                    <div
                                                        className={getMenuItemClass('RechargeWallet', selectedManageSubItem === 'RechargeWallet')}
                                                        onMouseEnter={() => setSelectedManageSubItem('RechargeWallet')}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open('https://tallysolutions.com/buy-tally/', '_blank');
                                                            setActiveMenu(null);
                                                        }}
                                                    >
                                                        <span><span className="text-[#1d5b6e]">R</span>echarge Wallet</span>
                                                    </div>
                                                    <div
                                                        className={getMenuItemClass('RenewSubscription', selectedManageSubItem === 'RenewSubscription')}
                                                        onMouseEnter={() => setSelectedManageSubItem('RenewSubscription')}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open('https://tallysolutions.com/buy-tally/', '_blank');
                                                            setActiveMenu(null);
                                                        }}
                                                    >
                                                        <span><span className="text-[#1d5b6e]">R</span>Enew Subscription</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className={getMenuItemClass('Inbox', selectedShareItem === 'Inbox')}
                                            onMouseEnter={() => setSelectedShareItem('Inbox')}
                                            onClick={() => {
                                                window.open('https://app.interakt.ai/login', '_blank');
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span><span className="text-[#1d5b6e]">I</span>nbox</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('ConfigurationWA', selectedShareItem === 'ConfigurationWA')}
                                            onMouseEnter={() => setSelectedShareItem('ConfigurationWA')}
                                            onClick={() => {
                                                setShowWhatsAppConfigModal(true);
                                                setActiveMenu(null);
                                            }}
                                        >
                                            <span>Co<span className="text-[#1d5b6e]">N</span>figuration</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Print Menu */}
                        <div className="relative">
                            <MenuOption label="P:Print" isActive={activeMenu === 'Print'} onClick={() => handleMenuClick('Print')} />
                            {activeMenu === 'Print' && (
                                <>
                                    <div className="fixed inset-0 bg-black/40 z-[55]" onClick={() => setActiveMenu(null)}></div>
                                    <div className="absolute top-[26px] left-0 min-w-[240px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[60] flex flex-col text-[13px] font-sans pb-2">
                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Reports</div>
                                        <div
                                            className={`${getMenuItemClass('Current', selectedPrintItem === 'Current')} flex justify-between items-center`}
                                            onMouseEnter={() => setSelectedPrintItem('Current')}
                                            onClick={() => handleItemClick('Print', 'Current')}
                                        >
                                            <span>Cu<span className="text-[#1d5b6e]">R</span>rent</span>
                                            <span className="text-[#1d5b6e] font-bold text-[12px]">Ctrl+P</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('Others', selectedPrintItem === 'Others')}
                                            onMouseEnter={() => setSelectedPrintItem('Others')}
                                            onClick={() => handleItemClick('Print', 'Others')}
                                        >
                                            <span><span className="text-[#1d5b6e]">O</span>thers</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('Configuration', selectedPrintItem === 'Configuration')}
                                            onMouseEnter={() => setSelectedPrintItem('Configuration')}
                                            onClick={() => setSelectedPrintItem('Configuration')}
                                        >
                                            <span>Co<span className="text-[#1d5b6e]">N</span>figuration</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Help Menu */}
                        <div className="relative">
                            <MenuOption label="F1:Help" isActive={activeMenu === 'Help'} onClick={() => handleMenuClick('Help')} />
                            {activeMenu === 'Help' && (
                                <>
                                    <div className="fixed inset-0 bg-black/40 z-[55]" onClick={() => setActiveMenu(null)}></div>
                                    <div className="absolute top-[26px] right-0 min-w-[240px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[60] flex flex-col text-[13px] font-sans pb-2">

                                        <a
                                            href="https://help.tallysolutions.com/charts-of-accounts-tally/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${getMenuItemClass('TallyHelp', selectedHelpItem === 'TallyHelp')} no-underline`}
                                            onMouseEnter={() => setSelectedHelpItem('TallyHelp')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTimeout(() => setActiveMenu(null), 150);
                                            }}
                                        >
                                            <span>Tally<span className="text-[#1d5b6e]">H</span>elp</span>
                                            <span className="text-[#1d5b6e] font-bold text-[12px]">Ctrl+F1</span>
                                        </a>

                                        <a
                                            href="https://help.tallysolutions.com/release-notes-tallyprime-7-0/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${getMenuItemClass('WhatsNew', selectedHelpItem === 'WhatsNew')} no-underline`}
                                            onMouseEnter={() => setSelectedHelpItem('WhatsNew')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTimeout(() => setActiveMenu(null), 150);
                                            }}
                                        >
                                            <span>What's <span className="text-[#1d5b6e]">N</span>ew</span>
                                        </a>

                                        <div
                                            className={getMenuItemClass('Upgrade', selectedHelpItem === 'Upgrade')}
                                            onMouseEnter={() => setSelectedHelpItem('Upgrade')}
                                            onClick={() => handleItemClick('Help', 'Upgrade')}
                                        >
                                            <span><span className="text-[#1d5b6e]">U</span>pgrade</span>
                                        </div>

                                        <a
                                            href="https://tallysolutions.com/tallyweb/modules/sd/docmgmt/CMktPlaceHomepageWIC.php"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${getMenuItemClass('TallyShop', selectedHelpItem === 'TallyShop')} no-underline`}
                                            onMouseEnter={() => setSelectedHelpItem('TallyShop')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTimeout(() => setActiveMenu(null), 150);
                                            }}
                                        >
                                            <span><span className="text-[#1d5b6e]">T</span>allyShop</span>
                                        </a>

                                        <div className="h-[1px] bg-[#2d819b] mx-2 my-1 opacity-20"></div>

                                        {/* Troubleshooting Submenu */}
                                        <div
                                            className={`${getMenuItemClass('Troubleshooting', selectedHelpItem === 'Troubleshooting')} relative`}
                                            onMouseEnter={() => setSelectedHelpItem('Troubleshooting')}
                                        >
                                            <span>T<span className="text-[#1d5b6e]">R</span>oubleshooting</span>
                                            <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>
                                            {selectedHelpItem === 'Troubleshooting' && (
                                                <div className="absolute top-0 right-full w-[280px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[70] flex flex-col text-[13px] font-sans pb-2 text-black mr-[-1px]">
                                                    <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Application</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">Event Log</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">Repair/Re-install Application</div>
                                                    <div className="text-gray-400 px-4 py-[2px] cursor-not-allowed">Delete Views S<span className="text-gray-400 font-bold">A</span>ved for All Companies</div>
                                                    <div className="text-gray-400 px-4 py-[2px] cursor-not-allowed">Delete Mapping Templates Saved for All Companies</div>

                                                    <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Company Data</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer" onClick={() => handleItemClick('Data', 'Repair')}><span className="text-[#1d5b6e]">R</span>epair</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer" onClick={() => handleItemClick('Data', 'Migrate')}><span className="text-[#1d5b6e]">M</span>igrate</div>
                                                    <div className="text-gray-400 px-4 py-[2px] cursor-not-allowed">RePair/Migrate Exceptions</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">Repair Inde<span className="text-[#1d5b6e]">X</span> for Find</div>
                                                    <div className="h-[4px]"></div>
                                                    <div className="text-gray-400 px-4 py-[2px] cursor-not-allowed">Delete Views Saved for This <span className="text-gray-400 font-bold">C</span>ompany</div>
                                                    <div className="text-gray-400 px-4 py-[2px] cursor-not-allowed">Dele<span className="text-gray-400 font-bold">T</span>e Mapping Templates Saved for This Company</div>

                                                    <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Connected Services</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer"><span className="text-[#1d5b6e]">O</span>nline GST Activity Tracker</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">Reset <span className="text-[#1d5b6e]">L</span>ogin</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Settings Submenu */}
                                        <div
                                            className={`${getMenuItemClass('Settings', selectedHelpItem === 'Settings')} relative`}
                                            onMouseEnter={() => setSelectedHelpItem('Settings')}
                                        >
                                            <span><span className="text-[#1d5b6e]">S</span>ettings</span>
                                            <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>
                                            {selectedHelpItem === 'Settings' && (
                                                <div className="absolute top-0 right-full w-[200px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[70] flex flex-col text-[13px] font-sans pb-2 text-black mr-[-1px]">
                                                    <div className={`${getMenuItemClass('License', false)} hover:bg-[#feba35] active:bg-[#feba35]`}>
                                                        <span>License</span>
                                                        <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>
                                                    </div>
                                                    <div className={`${getMenuItemClass('Language', false)} hover:bg-[#feba35]`}>
                                                        <span>Lan<span className="text-[#1d5b6e]">G</span>uage</span>
                                                        <span className="text-[#1d5b6e] font-bold text-[10px]">›</span>
                                                    </div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer"><span className="text-[#1d5b6e]">C</span>ountry</div>
                                                    <div className="h-[4px]"></div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer"><span className="text-[#1d5b6e]">S</span>tartup</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">Find</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer"><span className="text-[#1d5b6e]">D</span>isplay</div>
                                                    <div className="hover:bg-[#feba35] px-4 py-[2px] cursor-pointer">Co<span className="text-[#1d5b6e]">N</span>nectivity</div>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className={getMenuItemClass('TDLs', selectedHelpItem === 'TDLs')}
                                            onMouseEnter={() => setSelectedHelpItem('TDLs')}
                                            onClick={() => handleItemClick('Help', 'TDLs')}
                                        >
                                            <span>TDLs & Add<span className="text-[#1d5b6e]">O</span>ns</span>
                                        </div>

                                        <div className="flex justify-between items-center px-4 py-1 text-gray-400 cursor-not-allowed">
                                            <span>ProFile</span>
                                        </div>
                                        <div
                                            className={getMenuItemClass('About', selectedHelpItem === 'About')}
                                            onMouseEnter={() => setSelectedHelpItem('About')}
                                            onClick={() => handleItemClick('Help', 'About')}
                                        >
                                            <span>A<span className="text-[#1d5b6e]">B</span>out</span>
                                        </div>

                                        <div className="px-4 mt-2 mb-1 text-[#2d819b] font-bold text-[11px] uppercase">Explore More Products</div>
                                        <a
                                            href="https://tallysolutions.com/tally-prime-on-aws/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${getMenuItemClass('CloudAccess', selectedHelpItem === 'CloudAccess')} no-underline`}
                                            onMouseEnter={() => setSelectedHelpItem('CloudAccess')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTimeout(() => setActiveMenu(null), 150);
                                            }}
                                        >
                                            <span>T<span className="text-[#1d5b6e]">A</span>llyPrime Cloud Access</span>
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Others Modal UI */}
            {showExportOthersModal && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[120px] bg-black/10" onClick={() => setShowExportOthersModal(false)}>
                    {/* Main Background Export Window */}
                    <div className="flex flex-col w-[540px] shadow-2xl border border-[#2d819b] font-sans relative bg-white" onClick={(e) => e.stopPropagation()}>
                        {/* Company Name Header bar */}
                        <div className="bg-[#dcecf5] text-black px-2 h-[22px] flex items-center justify-center border-b border-[#2d819b] relative">
                            <span className="text-[11px] font-bold">Solarica</span>
                            <div className="absolute right-0 top-0 h-full flex items-center border-l border-[#2d819b]">
                                <span className="w-6 h-full flex items-center justify-center cursor-pointer hover:bg-[#ff4d4d] hover:text-white pb-[2px]" onClick={() => setShowExportOthersModal(false)}>✕</span>
                            </div>
                        </div>

                        {/* Export Report Title */}
                        <div className="bg-white text-black pt-2 pb-1 text-[13px] font-bold text-center">
                            Export Report
                        </div>

                        {/* Yellow Search/Input Area */}
                        <div className="mx-2 mb-2 p-[1px] border border-[#2d819b] bg-[#fff9c4]">
                            <div className="w-full h-[22px] flex items-center px-1 font-bold text-[13px]">
                                .
                            </div>
                        </div>

                        {/* Date info in background */}
                        <div className="absolute right-2 top-[30px] text-gray-400 text-[11px] font-bold opacity-30">
                            For 1-Apr-25
                        </div>

                        {/* List of Reports (Overlaying, aligned exactly to the input box) */}
                        <div className="absolute top-[80px] left-[8px] w-[524px] bg-[#eaf4fa] border-[1.5px] border-[#2d819b] shadow-2xl flex flex-col font-sans text-[13px] z-[110]">
                            {/* Blue Header */}
                            <div className="bg-[#2d819b] text-white font-bold px-2 h-[22px] flex items-center">
                                List of Reports
                            </div>

                            {/* Control Actions / Selection Menu */}
                            <div className="flex flex-col bg-white">
                                <div
                                    className={`px-4 py-[1px] cursor-pointer font-bold flex justify-end items-center h-[22px] border-b border-[#dcecf5] ${selectedExportListItem === (exportListExpanded ? 'Collapse All' : 'Expand All') ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#ffe599]'}`}
                                    onMouseEnter={() => setSelectedExportListItem(exportListExpanded ? 'Collapse All' : 'Expand All')}
                                    onClick={() => setExportListExpanded(!exportListExpanded)}
                                >
                                    {exportListExpanded ? 'Collapse All' : 'Expand All'}
                                </div>
                                <div
                                    className={`px-4 py-[1px] cursor-pointer font-bold flex justify-end items-center h-[22px] border-b border-[#dcecf5] ${selectedExportListItem === (exportListShowMore ? 'Show Less' : 'Show More') ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#ffe599]'}`}
                                    onMouseEnter={() => setSelectedExportListItem(exportListShowMore ? 'Show Less' : 'Show More')}
                                    onClick={() => setExportListShowMore(!exportListShowMore)}
                                >
                                    {exportListShowMore ? 'Show Less' : 'Show More'}
                                </div>
                                {exportListShowMore && (
                                    <div
                                        className={`px-4 py-[1px] cursor-pointer font-bold flex justify-end items-center h-[22px] border-b border-[#dcecf5] ${selectedExportListItem === (exportListShowInactive ? 'Hide Inactive' : 'Show Inactive') ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#ffe599]'}`}
                                        onMouseEnter={() => setSelectedExportListItem(exportListShowInactive ? 'Hide Inactive' : 'Show Inactive')}
                                        onClick={() => setExportListShowInactive(!exportListShowInactive)}
                                    >
                                        {exportListShowInactive ? 'Hide Inactive' : 'Show Inactive'}
                                    </div>
                                )}
                            </div>

                            {/* Scrollable Report List Content */}
                            <div className="bg-[#eaf4fa] flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
                                {(exportListExpanded || !exportListShowInactive) && (
                                    <div className="py-1">
                                        <div className="px-2 py-0.5 font-bold text-black bg-white/40">Payroll</div>
                                        <div className="px-6 py-0.5 cursor-pointer hover:bg-[#ffe599] text-black">Salary Payment Advice</div>
                                    </div>
                                )}

                                {exportListShowInactive && (
                                    <div className="py-1">
                                        <div className="px-2 py-0.5 font-bold text-black bg-white/40 border-b border-gray-200">VAT Reports</div>

                                        <div className="px-2 py-0.5 font-bold text-black bg-white/40 border-b border-gray-200 mt-2">Excise Manufacturer Reports</div>
                                        <div className="px-6 py-0.5 cursor-pointer hover:bg-[#ffe599] text-black">Excise Forms & Registers</div>

                                        <div className="px-2 py-0.5 font-bold text-black bg-white/40 border-b border-gray-200 mt-2">Payroll Statutory Reports</div>
                                        {[
                                            { name: 'PF Monthly Statement' },
                                            { name: 'E-Return', extra: 'PF' },
                                            { name: 'Export PF e-Return Form 5' },
                                            { name: 'Export PF e-Return Form 10' },
                                            { name: 'Export PF e-Return Form 12A' },
                                            { name: 'Export PF e-Return Form 3A' },
                                            { name: 'PF Form 5' },
                                            { name: 'PF Form 10' },
                                            { name: 'PF Form 12A' },
                                            { name: 'PF Form 3A' },
                                            { name: 'PF Form 6A' },
                                            { name: 'ESI Monthly Statement' },
                                            { name: 'E-Return', extra: 'ESI' },
                                            { name: 'Form 3' },
                                            { name: 'Form 5' },
                                            { name: 'Form 6' },
                                            { name: 'Professional Tax Computation' },
                                            { name: 'Professional Tax Statement' },
                                            { name: 'E-24Q' },
                                            { name: 'Form 24Q' },
                                            { name: 'Annexure I to Form 24Q' },
                                            { name: 'Annexure II to Form 24Q' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="px-6 py-[1px] flex justify-between cursor-pointer hover:bg-[#ffe599] text-black">
                                                <span>{item.name}</span>
                                                {item.extra && <span className="italic text-gray-500 text-[11px] pr-2">{item.extra}</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Select GST Return Modal */}
            {showGSTReturnModal && !gstReportType && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[150px] bg-black/15" onClick={() => setShowGSTReturnModal(false)}>
                    {/* Main Background Box */}
                    <div className="flex flex-col w-[380px] shadow-2xl border border-[#2d819b] font-sans relative bg-white" onClick={(e) => e.stopPropagation()}>
                        {/* Company Name Header bar */}
                        <div className="bg-[#dcecf5] text-black px-2 h-[22px] flex items-center justify-center border-b border-[#2d819b] relative">
                            <span className="text-[11px] font-bold">Solarica</span>
                            <div className="absolute right-0 top-0 h-full flex items-center border-l border-[#2d819b]">
                                <span className="w-6 h-full flex items-center justify-center cursor-pointer hover:bg-[#ff4d4d] hover:text-white pb-[2px] transition-colors" onClick={() => setShowGSTReturnModal(false)}>✕</span>
                            </div>
                        </div>

                        {/* GST Return Title */}
                        <div className="bg-white text-black pt-2 pb-1 text-[13px] font-bold text-center">
                            GST Return
                        </div>

                        {/* Yellow Search/Input Area */}
                        <div className="mx-2 mb-2 p-[1px] border border-[#2d819b] bg-[#fff9c4]">
                            <div className="w-full h-[22px] flex items-center px-1 font-bold text-[13px]">
                                .
                            </div>
                        </div>

                        {/* Date info in background */}
                        <div className="absolute right-2 top-[30px] text-gray-500 text-[11px] font-bold opacity-30">
                            For 1-Apr-25
                        </div>

                        {/* List of GST Returns (Overlaying correctly) */}
                        <div className="absolute top-[80px] left-[8px] w-[364px] bg-white border-[1.5px] border-[#2d819b] shadow-2xl flex flex-col font-sans text-[13px] z-[110]">
                            {/* Dark Teal Header */}
                            <div className="bg-[#1b5e6b] text-white font-bold px-2 h-[22px] flex items-center">
                                List of GST Returns
                            </div>

                            {/* Options */}
                            <div className="bg-white">
                                <div
                                    className={`px-4 py-[1px] cursor-pointer font-bold h-[22px] flex items-center ${selectedGSTItem === 'GSTR-1' ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#ffe599]'}`}
                                    onMouseEnter={() => setSelectedGSTItem('GSTR-1')}
                                    onClick={() => setGstReportType('GSTR-1')}
                                >
                                    GSTR-1
                                </div>
                                <div
                                    className={`px-4 py-[1px] cursor-pointer font-bold h-[22px] flex items-center ${selectedGSTItem === 'GSTR-3B' ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#ffe599]'}`}
                                    onMouseEnter={() => setSelectedGSTItem('GSTR-3B')}
                                    onClick={() => setGstReportType('GSTR-3B')}
                                >
                                    GSTR-3B
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* GSTR-1 Report Page */}
            {gstReportType === 'GSTR-1' && (
                <div className="fixed inset-0 z-[120] bg-white flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
                    {/* Top Blue Header Bar */}
                    <div className="bg-[#2d819b] text-white h-[26px] flex items-center justify-between px-2 text-[12px] font-bold relative">
                        <span className="flex-1">Upload GST Returns</span>
                        <span className="flex-1 text-center">Solarica</span>
                        <div className="flex-1 flex justify-end">
                            <span className="cursor-pointer hover:bg-red-500 px-3 h-full flex items-center text-[14px]" onClick={() => setGstReportType(null)}>✕</span>
                        </div>
                    </div>

                    {/* Main Content with Right Sidebar */}
                    <div className="flex-1 flex overflow-hidden bg-[#dcecf5]">
                        {/* Report Area */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden p-1">
                            <div className="bg-white border-[1.5px] border-[#2d819b] h-full flex flex-col overflow-hidden shadow-sm">
                                {/* Report Header Bar */}
                                <div className="p-2 border-b border-[#2d819b]/20 flex justify-between items-center bg-white">
                                    <span className="font-bold text-[14px] text-black underline decoration-[#2d819b] decoration-2 underline-offset-4">Upload GSTR-1</span>
                                    <span className="font-bold text-[14px] text-black">1-Apr-25 to 30-Apr-25</span>
                                </div>

                                {/* Table Header Grid */}
                                <div className="grid grid-cols-[100px_1.5fr_100px_100px_120px_100px_120px] gap-0 border-b border-[#2d819b]/40 bg-white text-[12px] font-bold text-black group">
                                    <div className="p-2 border-r border-[#2d819b]/20 text-center">Date</div>
                                    <div className="p-2 border-r border-[#2d819b]/20 px-8">P a r t i c u l a r s</div>
                                    <div className="p-2 border-r border-[#2d819b]/20 text-center">Vch Type</div>
                                    <div className="p-2 border-r border-[#2d819b]/20 text-center">Vch No.</div>
                                    <div className="p-2 border-r border-[#2d819b]/20 text-right">Taxable Amount</div>
                                    <div className="p-2 border-r border-[#2d819b]/20 text-right px-4">Tax Amount</div>
                                    <div className="p-2 text-right">Invoice Amount</div>
                                </div>

                                {/* Report Body */}
                                <div className="flex-1 p-2 font-bold text-[13px] text-black">
                                    Pending to Upload (Voucher Count - 0; Summary Count - 0)
                                </div>

                                {/* Footer Action Buttons */}
                                <div className="p-6 flex justify-center gap-16 bg-white">
                                    <div className="flex items-center gap-1">
                                        <button className="border border-[#2d819b] bg-white px-6 py-1.5 text-[13px] font-bold text-black hover:bg-[#dcecf5] shadow-sm flex items-center">
                                            <span className="text-blue-800 underline mr-1">X</span>: Export (Offline)
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="border border-[#2d819b] bg-white px-6 py-1.5 text-[13px] font-bold text-black hover:bg-[#dcecf5] shadow-sm flex items-center">
                                            <span className="text-blue-800 underline mr-1">S</span>: Send (Online)
                                        </button>
                                        <div className="text-blue-600 bg-blue-50 border border-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold">i</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar (F-keys) */}
                        <div className="w-[180px] bg-[#dcecf5] border-l border-[#2d819b]/30 flex flex-col p-[2px] gap-[2px] font-sans">
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Period')}>
                                <span className="text-blue-800 font-bold w-[25px]">F2:</span>
                                <span className="text-black">Period</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Company')}>
                                <span className="text-blue-800 font-bold w-[25px]">F3:</span>
                                <span className="text-black">Company</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group bg-[#feba35]" onClick={() => setGstSidebarAction('Returns')}>
                                <span className="text-blue-800 font-bold w-[25px]">F4:</span>
                                <span className="text-black font-bold">Returns</span>
                            </button>

                            <div className="h-4"></div>

                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Other Masters')}>
                                <span className="text-blue-800 font-bold w-[35px]">F10:</span>
                                <span className="text-black">Other Masters</span>
                            </button>

                            <div className="flex-1"></div>

                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Basis')}>
                                <span className="text-blue-800 font-bold w-[20px]">B:</span>
                                <span className="text-black">Basis of Values</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('ChangeView')}>
                                <span className="text-blue-800 font-bold w-[20px]">H:</span>
                                <span className="text-black">Change View</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Exceptions')}>
                                <span className="text-blue-800 font-bold w-[20px]">J:</span>
                                <span className="text-black">Exception Reports</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('SaveView')}>
                                <span className="text-blue-800 font-bold w-[20px]">L:</span>
                                <span className="text-black">Save View</span>
                            </button>
                            <div className="h-[2px] bg-[#2d819b]/20 mx-1 my-1"></div>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Filter')}>
                                <span className="text-blue-800 font-bold w-[20px]">F:</span>
                                <span className="text-black">Apply Filter</span>
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Action Overlays */}
                    {gstSidebarAction && (
                        <div className="fixed inset-0 z-[150] bg-black/5 flex items-center justify-center font-sans tracking-wide" onClick={() => setGstSidebarAction(null)}>
                            <div className="bg-white border-[1.5px] border-[#2d819b] shadow-2xl min-w-[320px]" onClick={(e) => e.stopPropagation()}>
                                <div className="bg-[#2d819b] text-white px-2 py-1 font-bold flex justify-between items-center text-[13px]">
                                    <span>{gstSidebarAction}</span>
                                    <span className="cursor-pointer hover:bg-red-500 px-2 transition-colors" onClick={() => setGstSidebarAction(null)}>✕</span>
                                </div>
                                <div className="p-4 bg-[#eaf4fa]">
                                    {gstSidebarAction === 'Period' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center gap-8">
                                                <span className="text-black font-bold text-[13px]">From:</span>
                                                <input type="text" className="border border-[#2d819b] px-2 py-0.5 text-[13px] w-[120px] outline-none focus:bg-[#fff9c4]" defaultValue="1-Apr-25" autoFocus />
                                            </div>
                                            <div className="flex justify-between items-center gap-8">
                                                <span className="text-black font-bold text-[13px]">To:</span>
                                                <input type="text" className="border border-[#2d819b] px-2 py-0.5 text-[13px] w-[120px] outline-none focus:bg-[#fff9c4]" defaultValue="30-Apr-25" />
                                            </div>
                                            <div className="flex justify-center mt-2">
                                                <button className="bg-[#feba35] px-6 py-1 font-bold text-[13px] border border-[#2d819b] hover:bg-[#ffd54f] transition-colors shadow-sm" onClick={() => setGstSidebarAction(null)}>Accept</button>
                                            </div>
                                        </div>
                                    )}
                                    {gstSidebarAction === 'Company' && (
                                        <div className="flex flex-col gap-1 min-w-[350px]">
                                            <div className="text-[11px] font-bold text-[#2d819b] mb-1">List of Companies</div>
                                            <div className="bg-white border border-[#2d819b]/20">
                                                <div className="px-3 py-1 bg-[#feba35] font-bold text-[13px] cursor-pointer" onClick={() => setGstSidebarAction(null)}>Solarica</div>
                                                <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] cursor-pointer">Alpha Industries</div>
                                                <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] cursor-pointer">Global Tech Solutions</div>
                                            </div>
                                        </div>
                                    )}
                                    {gstSidebarAction === 'Basis' && (
                                        <div className="flex flex-col gap-1 min-w-[300px]">
                                            <div className="text-[11px] font-bold text-[#2d819b] mb-1">Basis of Values</div>
                                            <div className="bg-white border border-[#2d819b]/20">
                                                <div className="px-3 py-1 bg-[#feba35] font-bold text-[13px] flex justify-between cursor-pointer">
                                                    <span>Include Inactive Vouchers</span>
                                                    <span>No</span>
                                                </div>
                                                <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] flex justify-between cursor-pointer">
                                                    <span>Type of Return</span>
                                                    <span>Monthly</span>
                                                </div>
                                                <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] flex justify-between cursor-pointer">
                                                    <span>Show Voucher Count</span>
                                                    <span>Yes</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {gstSidebarAction === 'ChangeView' && (
                                        <div className="flex flex-col gap-1 min-w-[300px]">
                                            <div className="text-[11px] font-bold text-[#2d819b] mb-1">Change View</div>
                                            <div className="bg-white border border-[#2d819b]/20">
                                                <div className="px-3 py-1 bg-[#feba35] font-bold text-[13px] cursor-pointer" onClick={() => setGstSidebarAction(null)}>Summary</div>
                                                <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] cursor-pointer">Voucher-wise</div>
                                                <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] cursor-pointer">Document-wise</div>
                                            </div>
                                        </div>
                                    )}
                                    {!['Period', 'Company', 'Basis', 'ChangeView'].includes(gstSidebarAction) && (
                                        <div className="text-center py-6 italic text-gray-500 text-[13px]">
                                            Functionality for "{gstSidebarAction}" is coming soon.
                                        </div>
                                    )}
                                </div>
                                <div className="bg-[#dcecf5] px-2 py-1 flex gap-6 text-[11px] font-bold border-t border-[#2d819b]/20 text-black">
                                    <span>Esc: Close</span>
                                    <span>Ctrl+A: Accept</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Tally Navigation Bar */}
                    <div className="bg-[#dcecf5] h-[24px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[11px] font-bold text-black">
                        <div className="flex gap-6">
                            <span><span className="text-blue-800 underline decoration-1">Q</span>: Quit</span>
                            <span>S<span className="text-blue-800 underline decoration-1">p</span>ace: Select</span>
                            <span><span className="text-blue-800 underline decoration-1">D</span>: Delete</span>
                        </div>
                        <div className="flex gap-4">
                            <span><span className="text-blue-800 underline decoration-1">F12</span>: Configure</span>
                        </div>
                    </div>
                </div>
            )}

            {/* GSTR-3B Report Page */}
            {gstReportType === 'GSTR-3B' && (
                <div className="fixed inset-0 z-[120] bg-white flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
                    {/* Top Blue Header Bar */}
                    <div className="bg-[#2d819b] text-white h-[26px] flex items-center justify-between px-2 text-[12px] font-bold relative">
                        <span className="flex-1">Upload GST Returns</span>
                        <span className="flex-1 text-center">Solarica</span>
                        <div className="flex-1 flex justify-end">
                            <span className="cursor-pointer hover:bg-red-500 px-3 h-full flex items-center text-[14px]" onClick={() => setGstReportType(null)}>✕</span>
                        </div>
                    </div>

                    {/* Main Content with Right Sidebar */}
                    <div className="flex-1 flex overflow-hidden bg-[#dcecf5]">
                        {/* Report Area */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden p-1">
                            <div className="bg-white border-[1.5px] border-[#2d819b] h-full flex flex-col overflow-hidden shadow-sm">
                                {/* Report Header Bar */}
                                <div className="p-2 border-b border-[#2d819b]/20 flex justify-between items-center bg-white">
                                    <span className="font-bold text-[14px] text-black underline decoration-[#2d819b] decoration-2 underline-offset-4">Upload GSTR-3B</span>
                                    <span className="font-bold text-[14px] text-black">1-Apr-25 to 30-Apr-25</span>
                                </div>

                                {/* Table Header Grid */}
                                <div className="grid grid-cols-[1fr_200px_200px] gap-0 border-b border-[#2d819b]/40 bg-white text-[12px] font-bold text-black italic">
                                    <div className="p-2 border-r border-[#2d819b]/20 px-8 flex items-center shadow-inner">P a r t i c u l a r s</div>
                                    <div className="p-2 border-r border-[#2d819b]/20 text-right flex items-center justify-end px-4">Taxable Amount</div>
                                    <div className="p-2 text-right flex items-center justify-end px-8">Tax Amount</div>
                                </div>

                                {/* Empty Body Space */}
                                <div className="flex-1"></div>

                                {/* Warning Note (Specific to 3B) */}
                                <div className="p-4 text-center">
                                    <p className="text-blue-800 font-bold text-[13px] leading-relaxed">
                                        Note: <span className="italic font-normal">Section 3.2 of GSTR-3B is auto-filled on the GST portal as per your GSTR-1. Any details uploaded or exported from TallyPrime will be ignored.</span>
                                    </p>
                                </div>

                                {/* Footer Action Buttons */}
                                <div className="p-6 flex justify-center gap-16 bg-white border-t border-gray-50">
                                    <div className="flex items-center gap-1">
                                        <button className="border border-[#2d819b] bg-white px-6 py-1.5 text-[13px] font-bold text-black hover:bg-[#dcecf5] shadow-sm flex items-center">
                                            <span className="text-blue-800 underline mr-1">X</span>: Export (Offline)
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="border border-[#2d819b] bg-white px-6 py-1.5 text-[13px] font-bold text-black hover:bg-[#dcecf5] shadow-sm flex items-center">
                                            <span className="text-blue-800 underline mr-1">S</span>: Send (Online)
                                        </button>
                                        <div className="text-blue-600 bg-blue-50 border border-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold">i</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar (F-keys) */}
                        <div className="w-[180px] bg-[#dcecf5] border-l border-[#2d819b]/30 flex flex-col p-[2px] gap-[2px] font-sans">
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Period')}>
                                <span className="text-blue-800 font-bold w-[25px]">F2:</span>
                                <span className="text-black">Period</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Company')}>
                                <span className="text-blue-800 font-bold w-[25px]">F3:</span>
                                <span className="text-black">Company</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group bg-[#feba35]" onClick={() => setGstSidebarAction('Returns')}>
                                <span className="text-blue-800 font-bold w-[25px]">F4:</span>
                                <span className="text-black font-bold">Returns</span>
                            </button>

                            <div className="h-4"></div>

                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Other Masters')}>
                                <span className="text-blue-800 font-bold w-[35px]">F10:</span>
                                <span className="text-black">Other Masters</span>
                            </button>

                            <div className="flex-1"></div>

                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Basis')}>
                                <span className="text-blue-800 font-bold w-[20px]">B:</span>
                                <span className="text-black">Basis of Values</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('ChangeView')}>
                                <span className="text-blue-800 font-bold w-[20px]">H:</span>
                                <span className="text-black">Change View</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Exceptions')}>
                                <span className="text-blue-800 font-bold w-[20px]">J:</span>
                                <span className="text-black">Exception Reports</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('SaveView')}>
                                <span className="text-blue-800 font-bold w-[20px]">L:</span>
                                <span className="text-black">Save View</span>
                            </button>
                            <div className="h-[2px] bg-[#2d819b]/20 mx-1 my-1"></div>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setGstSidebarAction('Filter')}>
                                <span className="text-blue-800 font-bold w-[20px]">F:</span>
                                <span className="text-black">Apply Filter</span>
                            </button>
                        </div>

                        {/* Sidebar Action Overlays */}
                        {gstSidebarAction && (
                            <div className="fixed inset-0 z-[150] bg-black/5 flex items-center justify-center font-sans tracking-wide" onClick={() => setGstSidebarAction(null)}>
                                <div className="bg-white border-[1.5px] border-[#2d819b] shadow-2xl min-w-[320px]" onClick={(e) => e.stopPropagation()}>
                                    <div className="bg-[#2d819b] text-white px-2 py-1 font-bold flex justify-between items-center text-[13px]">
                                        <span>{gstSidebarAction}</span>
                                        <span className="cursor-pointer hover:bg-red-500 px-2 transition-colors" onClick={() => setGstSidebarAction(null)}>✕</span>
                                    </div>
                                    <div className="p-4 bg-[#eaf4fa]">
                                        {gstSidebarAction === 'Period' && (
                                            <div className="flex flex-col gap-4">
                                                <div className="flex justify-between items-center gap-8">
                                                    <span className="text-black font-bold text-[13px]">From:</span>
                                                    <input type="text" className="border border-[#2d819b] px-2 py-0.5 text-[13px] w-[120px] outline-none focus:bg-[#fff9c4]" defaultValue="1-Apr-25" autoFocus />
                                                </div>
                                                <div className="flex justify-between items-center gap-8">
                                                    <span className="text-black font-bold text-[13px]">To:</span>
                                                    <input type="text" className="border border-[#2d819b] px-2 py-0.5 text-[13px] w-[120px] outline-none focus:bg-[#fff9c4]" defaultValue="30-Apr-25" />
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <button className="bg-[#feba35] px-6 py-1 font-bold text-[13px] border border-[#2d819b] hover:bg-[#ffd54f] transition-colors shadow-sm" onClick={() => setGstSidebarAction(null)}>Accept</button>
                                                </div>
                                            </div>
                                        )}
                                        {gstSidebarAction === 'Company' && (
                                            <div className="flex flex-col gap-1 min-w-[350px]">
                                                <div className="text-[11px] font-bold text-[#2d819b] mb-1">List of Companies</div>
                                                <div className="bg-white border border-[#2d819b]/20">
                                                    <div className="px-3 py-1 bg-[#feba35] font-bold text-[13px] cursor-pointer" onClick={() => setGstSidebarAction(null)}>Solarica</div>
                                                    <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] cursor-pointer">Alpha Industries</div>
                                                    <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] cursor-pointer">Global Tech Solutions</div>
                                                </div>
                                            </div>
                                        )}
                                        {gstSidebarAction === 'Basis' && (
                                            <div className="flex flex-col gap-1 min-w-[300px]">
                                                <div className="text-[11px] font-bold text-[#2d819b] mb-1">Basis of Values</div>
                                                <div className="bg-white border border-[#2d819b]/20">
                                                    <div className="px-3 py-1 bg-[#feba35] font-bold text-[13px] flex justify-between cursor-pointer">
                                                        <span>Include Inactive Vouchers</span>
                                                        <span>No</span>
                                                    </div>
                                                    <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] flex justify-between cursor-pointer">
                                                        <span>Type of Return</span>
                                                        <span>Monthly</span>
                                                    </div>
                                                    <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] flex justify-between cursor-pointer">
                                                        <span>Show Voucher Count</span>
                                                        <span>Yes</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {gstSidebarAction === 'ChangeView' && (
                                            <div className="flex flex-col gap-1 min-w-[300px]">
                                                <div className="text-[11px] font-bold text-[#2d819b] mb-1">Change View</div>
                                                <div className="bg-white border border-[#2d819b]/20">
                                                    <div className="px-3 py-1 bg-[#feba35] font-bold text-[13px] cursor-pointer" onClick={() => setGstSidebarAction(null)}>Summary</div>
                                                    <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] cursor-pointer">Voucher-wise</div>
                                                    <div className="px-3 py-1 hover:bg-[#ffe599] text-[13px] cursor-pointer">Document-wise</div>
                                                </div>
                                            </div>
                                        )}
                                        {!['Period', 'Company', 'Basis', 'ChangeView'].includes(gstSidebarAction) && (
                                            <div className="text-center py-6 italic text-gray-500 text-[13px]">
                                                Functionality for "{gstSidebarAction}" is coming soon.
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-[#dcecf5] px-2 py-1 flex gap-6 text-[11px] font-bold border-t border-[#2d819b]/20 text-black">
                                        <span>Esc: Close</span>
                                        <span>Ctrl+A: Accept</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Tally Navigation Bar */}
                    <div className="bg-[#dcecf5] h-[24px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[11px] font-bold text-black">
                        <div className="flex gap-6">
                            <span><span className="text-blue-800 underline decoration-1">Q</span>: Quit</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Masters Page */}
            {showExportMastersPage && (
                <div className="fixed inset-0 z-[120] bg-white flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
                    {/* Top Blue Header Bar */}
                    <div className="bg-[#2d819b] text-white h-[26px] flex items-center justify-between px-2 text-[12px] font-bold relative text-shadow-sm">
                        <span className="flex-1">Masters</span>
                        <span className="flex-1 text-center">Solarica</span>
                        <div className="flex-1 flex justify-end">
                            <span className="cursor-pointer hover:bg-red-500 px-3 h-full flex items-center text-[14px]" onClick={() => setShowExportMastersPage(false)}>✕</span>
                        </div>
                    </div>

                    {/* Main Content with Right Sidebar */}
                    <div className="flex-1 flex overflow-hidden bg-[#dcecf5]">
                        {/* Report Area (List of Groups Background) */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden p-[1px] relative">
                            {/* Sub Header */}
                            <div className="flex justify-between items-center px-2 py-1 text-[13px] font-bold text-black/40">
                                <span>List of Groups</span>
                                <span className="mr-8">For 1-Apr-25</span>
                            </div>

                            {/* Background Groups List (Faded) */}
                            <div className="flex-1 px-4 text-[13px] text-black/20 leading-loose select-none overflow-hidden">
                                <div className="mt-2 text-black/30">Branch / Divisions</div>
                                <div className="font-bold">Capital Account</div>
                                <div className="ml-4">Reserves & Surplus</div>
                                <div className="font-bold mt-1">Current Assets</div>
                                <div className="ml-4">Bank Accounts</div>
                                <div className="ml-4">Cash-in-Hand</div>
                                <div className="ml-4">Deposits (Asset)</div>
                                <div className="ml-4">Loans & Advances (Asset)</div>
                                <div className="ml-4">Stock-in-Hand</div>
                                <div className="ml-4">Sundry Debtors</div>
                                <div className="font-bold mt-1">Current Liabilities</div>
                                <div className="ml-4">Duties & Taxes</div>
                                <div className="ml-4">Provisions</div>
                                <div className="ml-4">Sundry Creditors</div>
                                <div className="font-bold mt-1">Direct Expenses</div>
                                <div className="font-bold">Direct Incomes</div>
                                <div className="font-bold">Fixed Assets</div>
                                <div className="font-bold">Indirect Expenses</div>
                                <div className="font-bold">Indirect Incomes</div>
                                <div className="font-bold">Investments</div>
                                <div className="font-bold mt-1">Loans (Liability)</div>
                                <div className="ml-4">Bank OD A/c</div>
                                <div className="ml-4 text-black/10">Secured Loans</div>
                                <div className="ml-4 text-black/10">Unsecured Loans</div>
                                <div className="font-bold mt-1">Misc. Expenses (ASSET)</div>
                                <div className="font-bold">Purchase Accounts</div>
                                <div className="font-bold">Sales Accounts</div>
                                <div className="font-bold">Scholarship</div>
                                <div className="font-bold bg-[#feba35] -mx-4 px-4 text-black mt-1">Suspense A/c</div>
                            </div>

                            <div className="absolute bottom-4 left-4 text-[13px] text-black/40 font-bold">29 Group(s)</div>

                            {/* Central Export Modal Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                <div className="bg-white border-[1px] border-gray-300 shadow-2xl w-[670px] font-sans overflow-hidden">
                                    <div className="p-8">
                                        <div className="text-[17px] font-bold text-black mb-1">Export</div>
                                        <div className="border-b-[1px] border-gray-200 mb-6 w-full opacity-60"></div>

                                        <div className="flex flex-col gap-[3px] text-[13.5px]">
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px]">
                                                <span className="text-black">Type of Masters</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">Groups</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setMastersIncludeDependent(mastersIncludeDependent === 'Yes' ? 'No' : 'Yes')}>
                                                <span className="text-black">Include dependent masters</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{mastersIncludeDependent}</span>
                                            </div>

                                            <div className="h-6"></div>

                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setMastersSidebarAction('File Format')}>
                                                <span className="text-black">File Format</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{mastersFileFormat}</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setMastersSidebarAction('Export to')}>
                                                <span className="text-black">Export to</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{mastersExportTo}</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setMastersSidebarAction('Folder Path')}>
                                                <span className="text-black">Folder Path</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{mastersFilePath}</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setMastersSidebarAction('File Name')}>
                                                <span className="text-black">File Name</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{mastersFileName}</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] opacity-40">
                                                <span className="text-black">Enable Stripe View</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">No</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-center gap-12 mt-12 mb-2">
                                            <button className="border border-[#1d5b6e] px-10 py-2.5 text-[14px] flex items-center bg-white min-w-[140px] justify-center shadow-sm" onClick={() => setShowExportConfig(true)}>
                                                <span className="text-[#2d819b] font-bold">C</span>
                                                <span className="text-black font-bold">: Configure</span>
                                            </button>
                                            <button className="border border-[#feba35] bg-white px-12 py-2.5 text-[14px] flex items-center min-w-[140px] justify-center shadow-sm" onClick={() => setShowExportMastersPage(false)}>
                                                <span className="text-[#2d819b] font-bold">E</span>
                                                <span className="text-black font-bold">: Export</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar (F-keys) */}
                        <div className="w-[180px] bg-[#dcecf5] border-l border-[#2d819b]/30 flex flex-col p-[2px] gap-[2px] font-sans">
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group">
                                <span className="text-blue-800 font-bold w-[25px]">F2:</span>
                                <span className="text-black"></span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group">
                                <span className="text-blue-800 font-bold w-[25px]">F3:</span>
                                <span className="text-black"></span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group">
                                <span className="text-blue-800 font-bold w-[25px]">F4:</span>
                                <span className="text-black"></span>
                            </button>

                            <div className="h-4"></div>

                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group">
                                <span className="text-blue-800 font-bold w-[25px]">F5:</span>
                                <span className="text-black">No. of Copies</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[13px] border border-gray-100 shadow-sm group" onClick={() => setMastersSidebarAction('Export to')}>
                                <span className="text-[#3eb1d3] font-bold w-[25px]">F6:</span>
                                <span className="text-[#3eb1d3]">Export to</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setMastersSidebarAction('Title')}>
                                <span className="text-blue-800 font-bold w-[25px]">F7:</span>
                                <span className="text-black">Title</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[13px] border border-gray-100 shadow-sm group" onClick={() => setMastersSidebarAction('File Format')}>
                                <span className="text-[#3eb1d3] font-bold w-[25px]">F8:</span>
                                <span className="text-[#3eb1d3] font-bold">File Format</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group">
                                <span className="text-blue-800 font-bold w-[25px]">F9:</span>
                                <span className="text-black"></span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setShowExportMastersPage(false)}>
                                <span className="text-blue-800 font-bold w-[25px]">F10:</span>
                                <span className="text-black">Quit</span>
                            </button>
                        </div>

                        {/* Sidebar Action Overlays for Masters */}
                        {mastersSidebarAction && (
                            <div className="fixed inset-0 z-[150] bg-black/5 flex items-center justify-center font-sans tracking-wide" onClick={() => setMastersSidebarAction(null)}>
                                <div className="bg-white border-[1.5px] border-[#2d819b] shadow-2xl min-w-[320px]" onClick={(e) => e.stopPropagation()}>
                                    <div className="bg-[#2d819b] text-white px-2 py-1 font-bold flex justify-between items-center text-[13px]">
                                        <span>{mastersSidebarAction}</span>
                                        <span className="cursor-pointer hover:bg-red-500 px-2 transition-colors" onClick={() => setMastersSidebarAction(null)}>✕</span>
                                    </div>
                                    <div className="p-4 bg-[#eaf4fa]">
                                        {mastersSidebarAction === 'File Format' && (
                                            <div className="flex flex-col gap-1">
                                                <div className="text-[11px] font-bold text-[#2d819b] mb-1">List of Formats</div>
                                                <div className="bg-white border border-[#2d819b]/20">
                                                    {['ASCII (Comma Delimited)', 'Excel (Spreadsheet)', 'HTML (Web-Linked)', 'JPEG (Image)', 'PDF (Read-only Document)', 'XML (Data Interchange)'].map((format) => (
                                                        <div
                                                            key={format}
                                                            className={`px-3 py-1 font-bold text-[13px] cursor-pointer ${mastersSelectedFileFormat === format ? 'bg-[#feba35] text-white' : 'text-black hover:bg-[#ffe599]'}`}
                                                            onMouseEnter={() => setMastersSelectedFileFormat(format)}
                                                            onClick={() => {
                                                                setMastersFileFormat(format);
                                                                setMastersSidebarAction(null);
                                                            }}
                                                        >
                                                            {format}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {mastersSidebarAction === 'Export to' && (
                                            <div className="flex flex-col gap-1">
                                                <div className="text-[11px] font-bold text-[#2d819b] mb-1">Export to</div>
                                                <div className="bg-white border border-[#2d819b]/20">
                                                    {['Local drive', 'E-Mail'].map((target) => (
                                                        <div
                                                            key={target}
                                                            className={`px-3 py-1 font-bold text-[13px] cursor-pointer ${mastersSelectedExportTo === target ? 'bg-[#feba35] text-white' : 'text-black hover:bg-[#ffe599]'}`}
                                                            onMouseEnter={() => setMastersSelectedExportTo(target)}
                                                            onClick={() => {
                                                                setMastersExportTo(target);
                                                                setMastersSidebarAction(null);
                                                            }}
                                                        >
                                                            {target}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {mastersSidebarAction === 'Title' && (
                                            <div className="flex flex-col gap-4">
                                                <div className="flex justify-between items-center gap-8">
                                                    <span className="text-black font-bold text-[13px]">Title:</span>
                                                    <input type="text" className="border border-[#2d819b] px-2 py-0.5 text-[13px] w-[200px] outline-none text-black focus:bg-[#fff9c4]" defaultValue="Masters" autoFocus />
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <button className="bg-[#feba35] px-6 py-1 font-bold text-[13px] border border-[#2d819b] hover:bg-[#ffd54f] transition-colors shadow-sm" onClick={() => setMastersSidebarAction(null)}>Accept</button>
                                                </div>
                                            </div>
                                        )}
                                        {mastersSidebarAction === 'Folder Path' && (
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-black font-bold text-[13px]">Folder Path:</span>
                                                    <input
                                                        type="text"
                                                        className="border border-[#2d819b] px-2 py-0.5 text-[13px] w-full outline-none text-black focus:bg-[#fff9c4]"
                                                        value={mastersFilePath}
                                                        onChange={(e) => setMastersFilePath(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <button className="bg-[#feba35] px-6 py-1 font-bold text-[13px] border border-[#2d819b] hover:bg-[#ffd54f] transition-colors shadow-sm" onClick={() => setMastersSidebarAction(null)}>Accept</button>
                                                </div>
                                            </div>
                                        )}
                                        {mastersSidebarAction === 'File Name' && (
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-black font-bold text-[13px]">File Name:</span>
                                                    <input
                                                        type="text"
                                                        className="border border-[#2d819b] px-2 py-0.5 text-[13px] w-full outline-none text-black focus:bg-[#fff9c4]"
                                                        value={mastersFileName}
                                                        onChange={(e) => setMastersFileName(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <button className="bg-[#feba35] px-6 py-1 font-bold text-[13px] border border-[#2d819b] hover:bg-[#ffd54f] transition-colors shadow-sm" onClick={() => setMastersSidebarAction(null)}>Accept</button>
                                                </div>
                                            </div>
                                        )}
                                        {!['File Format', 'Export to', 'Title', 'Folder Path', 'File Name'].includes(mastersSidebarAction) && (
                                            <div className="text-center py-6 italic text-gray-500 text-[13px]">
                                                Functionality for "{mastersSidebarAction}" is coming soon.
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-[#dcecf5] px-2 py-1 flex gap-6 text-[11px] font-bold border-t border-[#2d819b]/20 text-black">
                                        <span>Esc: Close</span>
                                        <span>Ctrl+A: Accept</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Tally Navigation Bar */}
                    <div className="bg-[#dcecf5] h-[24px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[11px] font-bold text-black shadow-inner">
                        <div className="flex gap-6">
                            <span><span className="text-blue-800 underline decoration-1">Q</span>: Quit</span>
                        </div>
                        <div className="flex gap-4">
                            <span
                                className="cursor-pointer hover:bg-[#b0d0e0] px-2"
                                onClick={() => setShowExportConfig(true)}
                            >
                                <span className="text-blue-800 underline font-bold">F12</span>: Configure
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {showExportTransactionsPage && (
                <div className="fixed inset-0 z-[120] bg-white flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
                    {/* Top Blue Header Bar */}
                    <div className="bg-[#2d819b] text-white h-[26px] flex items-center justify-between px-2 text-[12px] font-bold relative text-shadow-sm">
                        <span className="flex-1">Transactions</span>
                        <span className="flex-1 text-center">Solarica</span>
                        <div className="flex-1 flex justify-end">
                            <span className="cursor-pointer hover:bg-red-500 px-3 h-full flex items-center text-[14px]" onClick={() => setShowExportTransactionsPage(false)}>✕</span>
                        </div>
                    </div>

                    {/* Main Content with Right Sidebar */}
                    <div className="flex-1 flex overflow-hidden bg-[#dcecf5]">
                        {/* Report Area */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden p-[1px] relative">
                            {/* Sub Header */}
                            <div className="flex justify-between items-center px-2 py-1 text-[13px] font-bold text-black/40">
                                <span>List of Groups</span>
                                <span className="mr-8">For 1-Apr-25</span>
                            </div>

                            {/* Background Groups List (Faded) */}
                            <div className="flex-1 px-4 text-[13px] text-black/20 leading-loose select-none overflow-hidden">
                                <div className="mt-2 text-black/30">Branch / Divisions</div>
                                <div className="font-bold">Capital Account</div>
                                <div className="ml-4">Reserves & Surplus</div>
                                <div className="font-bold mt-1">Current Assets</div>
                                <div className="ml-4">Bank Accounts</div>
                                <div className="ml-4">Cash-in-Hand</div>
                                <div className="ml-4">Deposits (Asset)</div>
                                <div className="ml-4">Loans & Advances (Asset)</div>
                                <div className="ml-4">Stock-in-Hand</div>
                                <div className="ml-4">Sundry Debtors</div>
                                <div className="font-bold mt-1">Current Liabilities</div>
                                <div className="ml-4">Duties & Taxes</div>
                                <div className="ml-4">Provisions</div>
                                <div className="ml-4">Sundry Creditors</div>
                                <div className="font-bold mt-1">Direct Expenses</div>
                                <div className="font-bold">Direct Incomes</div>
                                <div className="font-bold">Fixed Assets</div>
                                <div className="font-bold">Indirect Expenses</div>
                                <div className="font-bold">Indirect Incomes</div>
                                <div className="font-bold">Investments</div>
                                <div className="font-bold mt-1">Loans (Liability)</div>
                                <div className="ml-4">Bank OD A/c</div>
                                <div className="ml-4 text-black/10">Secured Loans</div>
                                <div className="ml-4 text-black/10">Unsecured Loans</div>
                                <div className="font-bold mt-1">Misc. Expenses (ASSET)</div>
                                <div className="font-bold">Purchase Accounts</div>
                                <div className="font-bold">Sales Accounts</div>
                                <div className="font-bold">Scholarship</div>
                                <div className="font-bold bg-[#feba35] -mx-4 px-4 text-black mt-1">Suspense A/c</div>
                            </div>

                            <div className="absolute bottom-4 left-4 text-[13px] text-black/40 font-bold">29 Group(s)</div>

                            {/* Central Export Modal Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                <div className="bg-white border-[1px] border-gray-300 shadow-2xl w-[670px] font-sans overflow-hidden">
                                    <div className="p-8">
                                        <div className="text-[17px] font-bold text-black mb-1">Export</div>
                                        <div className="border-b-[1px] border-gray-200 mb-6 w-full opacity-60"></div>

                                        <div className="flex flex-col gap-[3px] text-[13.5px]">
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setTransactionsSidebarAction('Voucher Type')}>
                                                <span className="text-black">Type of Voucher entries</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{transactionsVoucherType}</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setTransactionsIncludeDependent(transactionsIncludeDependent === 'Yes' ? 'No' : 'Yes')}>
                                                <span className="text-black">Include dependent masters</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{transactionsIncludeDependent}</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setTransactionsSidebarAction('Period')}>
                                                <span className="text-black">Period</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{transactionsPeriod}</span>
                                            </div>

                                            <div className="h-6"></div>

                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setTransactionsSidebarAction('File Format')}>
                                                <span className="text-black">File Format</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{transactionsFileFormat}</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setTransactionsSidebarAction('Export to')}>
                                                <span className="text-black">Export to</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{transactionsExportTo}</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setTransactionsSidebarAction('Folder Path')}>
                                                <span className="text-black">Folder Path</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{transactionsFilePath}</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] cursor-pointer hover:bg-[#fff9e6]" onClick={() => setTransactionsSidebarAction('File Name')}>
                                                <span className="text-black">File Name</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">{transactionsFileName}</span>
                                            </div>
                                            <div className="grid grid-cols-[200px_40px_1fr] items-center py-[2px] opacity-40">
                                                <span className="text-black">Enable Stripe View</span>
                                                <span className="text-black">:</span>
                                                <span className="text-black font-bold">No</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-center gap-12 mt-12 mb-2">
                                            <button className="border border-[#1d5b6e] px-10 py-2.5 text-[14px] flex items-center bg-white min-w-[140px] justify-center shadow-sm" onClick={() => setShowExportConfig(true)}>
                                                <span className="text-[#2d819b] font-bold">C</span>
                                                <span className="text-black font-bold">: Configure</span>
                                            </button>
                                            <button className="border border-[#feba35] bg-white px-12 py-2.5 text-[14px] flex items-center min-w-[140px] justify-center shadow-sm" onClick={() => setShowExportTransactionsPage(false)}>
                                                <span className="text-[#2d819b] font-bold">E</span>
                                                <span className="text-black font-bold">: Export</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar (F-keys) */}
                        <div className="w-[180px] bg-[#dcecf5] border-l border-[#2d819b]/30 flex flex-col p-[2px] gap-[2px] font-sans">
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group">
                                <span className="text-blue-800 font-bold w-[25px]">F2:</span>
                                <span className="text-black"></span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group">
                                <span className="text-blue-800 font-bold w-[25px]">F3:</span>
                                <span className="text-black"></span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group">
                                <span className="text-blue-800 font-bold w-[25px]">F4:</span>
                                <span className="text-black"></span>
                            </button>

                            <div className="h-4"></div>

                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group">
                                <span className="text-blue-800 font-bold w-[25px]">F5:</span>
                                <span className="text-black">No. of Copies</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[13px] border border-gray-100 shadow-sm group" onClick={() => setTransactionsSidebarAction('Export to')}>
                                <span className="text-[#3eb1d3] font-bold w-[25px]">F6:</span>
                                <span className="text-[#3eb1d3]">Export to</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setTransactionsSidebarAction('Title')}>
                                <span className="text-blue-800 font-bold w-[25px]">F7:</span>
                                <span className="text-black">Title</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[13px] border border-gray-100 shadow-sm group" onClick={() => setTransactionsSidebarAction('File Format')}>
                                <span className="text-[#3eb1d3] font-bold w-[25px]">F8:</span>
                                <span className="text-[#3eb1d3] font-bold">File Format</span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group">
                                <span className="text-blue-800 font-bold w-[25px]">F9:</span>
                                <span className="text-black"></span>
                            </button>
                            <button className="w-full bg-white hover:bg-[#feba35] h-[26px] flex items-center px-1 text-[12px] border border-gray-100 shadow-sm group" onClick={() => setShowExportTransactionsPage(false)}>
                                <span className="text-blue-800 font-bold w-[25px]">F10:</span>
                                <span className="text-black">Quit</span>
                            </button>
                        </div>

                        {/* Sidebar Action Overlays for Transactions */}
                        {transactionsSidebarAction && (
                            <div className="fixed inset-0 z-[150] bg-black/5 flex items-center justify-center font-sans tracking-wide" onClick={() => setTransactionsSidebarAction(null)}>
                                <div className="bg-white border-[1.5px] border-[#2d819b] shadow-2xl min-w-[320px]" onClick={(e) => e.stopPropagation()}>
                                    <div className="bg-[#2d819b] text-white px-2 py-1 font-bold flex justify-between items-center text-[13px]">
                                        <span>{transactionsSidebarAction}</span>
                                        <span className="cursor-pointer hover:bg-red-500 px-2 transition-colors" onClick={() => setTransactionsSidebarAction(null)}>✕</span>
                                    </div>
                                    <div className="p-4 bg-[#eaf4fa]">
                                        {transactionsSidebarAction === 'File Format' && (
                                            <div className="flex flex-col gap-1">
                                                <div className="text-[11px] font-bold text-[#2d819b] mb-1">List of Formats</div>
                                                <div className="bg-white border border-[#2d819b]/20">
                                                    {['ASCII (Comma Delimited)', 'Excel (Spreadsheet)', 'HTML (Web-Linked)', 'JPEG (Image)', 'PDF (Read-only Document)', 'XML (Data Interchange)'].map((format) => (
                                                        <div
                                                            key={format}
                                                            className={`px-3 py-1 font-bold text-[13px] cursor-pointer ${transactionsSelectedFileFormat === format ? 'bg-[#feba35] text-white' : 'text-black hover:bg-[#ffe599]'}`}
                                                            onMouseEnter={() => setTransactionsSelectedFileFormat(format)}
                                                            onClick={() => {
                                                                setTransactionsFileFormat(format);
                                                                setTransactionsSidebarAction(null);
                                                            }}
                                                        >
                                                            {format}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {transactionsSidebarAction === 'Export to' && (
                                            <div className="flex flex-col gap-1">
                                                <div className="text-[11px] font-bold text-[#2d819b] mb-1">Export to</div>
                                                <div className="bg-white border border-[#2d819b]/20">
                                                    {['Local drive', 'E-Mail'].map((target) => (
                                                        <div
                                                            key={target}
                                                            className={`px-3 py-1 font-bold text-[13px] cursor-pointer ${transactionsSelectedExportTo === target ? 'bg-[#feba35] text-white' : 'text-black hover:bg-[#ffe599]'}`}
                                                            onMouseEnter={() => setTransactionsSelectedExportTo(target)}
                                                            onClick={() => {
                                                                setTransactionsExportTo(target);
                                                                setTransactionsSidebarAction(null);
                                                            }}
                                                        >
                                                            {target}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {transactionsSidebarAction === 'Voucher Type' && (
                                            <div className="flex flex-col gap-1">
                                                <div className="text-[11px] font-bold text-[#2d819b] mb-1">List of Voucher Types</div>
                                                <div className="bg-white border border-[#2d819b]/20">
                                                    {['All Vouchers', 'Accounting Vouchers', 'Inventory Vouchers'].map((type) => (
                                                        <div
                                                            key={type}
                                                            className={`px-3 py-1 font-bold text-[13px] cursor-pointer ${transactionsSelectedVoucherType === type ? 'bg-[#feba35] text-white' : 'text-black hover:bg-[#ffe599]'}`}
                                                            onMouseEnter={() => setTransactionsSelectedVoucherType(type)}
                                                            onClick={() => {
                                                                setTransactionsVoucherType(type);
                                                                setTransactionsSidebarAction(null);
                                                            }}
                                                        >
                                                            {type}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {transactionsSidebarAction === 'Title' && (
                                            <div className="flex flex-col gap-4">
                                                <div className="flex justify-between items-center gap-8">
                                                    <span className="text-black font-bold text-[13px]">Title:</span>
                                                    <input type="text" className="border border-[#2d819b] px-2 py-0.5 text-[13px] w-[200px] outline-none text-black focus:bg-[#fff9c4]" defaultValue="Transactions" autoFocus />
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <button className="bg-[#feba35] px-6 py-1 font-bold text-[13px] border border-[#2d819b] hover:bg-[#ffd54f] transition-colors shadow-sm" onClick={() => setTransactionsSidebarAction(null)}>Accept</button>
                                                </div>
                                            </div>
                                        )}
                                        {transactionsSidebarAction === 'Folder Path' && (
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-black font-bold text-[13px]">Folder Path:</span>
                                                    <input
                                                        type="text"
                                                        className="border border-[#2d819b] px-2 py-0.5 text-[13px] w-full outline-none text-black focus:bg-[#fff9c4]"
                                                        value={transactionsFilePath}
                                                        onChange={(e) => setTransactionsFilePath(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <button className="bg-[#feba35] px-6 py-1 font-bold text-[13px] border border-[#2d819b] hover:bg-[#ffd54f] transition-colors shadow-sm" onClick={() => setTransactionsSidebarAction(null)}>Accept</button>
                                                </div>
                                            </div>
                                        )}
                                        {transactionsSidebarAction === 'File Name' && (
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-black font-bold text-[13px]">File Name:</span>
                                                    <input
                                                        type="text"
                                                        className="border border-[#2d819b] px-2 py-0.5 text-[13px] w-full outline-none text-black focus:bg-[#fff9c4]"
                                                        value={transactionsFileName}
                                                        onChange={(e) => setTransactionsFileName(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <button className="bg-[#feba35] px-6 py-1 font-bold text-[13px] border border-[#2d819b] hover:bg-[#ffd54f] transition-colors shadow-sm" onClick={() => setTransactionsSidebarAction(null)}>Accept</button>
                                                </div>
                                            </div>
                                        )}
                                        {transactionsSidebarAction === 'Period' && (
                                            <div className="flex flex-col gap-4">
                                                <div className="flex justify-between items-center gap-8">
                                                    <span className="text-black font-bold text-[13px]">Period:</span>
                                                    <input
                                                        type="text"
                                                        className="border border-[#2d819b] px-2 py-0.5 text-[13px] w-[200px] outline-none text-black focus:bg-[#fff9c4]"
                                                        value={transactionsPeriod}
                                                        onChange={(e) => setTransactionsPeriod(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <button className="bg-[#feba35] px-6 py-1 font-bold text-[13px] border border-[#2d819b] hover:bg-[#ffd54f] transition-colors shadow-sm" onClick={() => setTransactionsSidebarAction(null)}>Accept</button>
                                                </div>
                                            </div>
                                        )}
                                        {!['File Format', 'Export to', 'Title', 'Voucher Type', 'Folder Path', 'File Name', 'Period'].includes(transactionsSidebarAction) && (
                                            <div className="text-center py-6 italic text-gray-500 text-[13px]">
                                                Functionality for "{transactionsSidebarAction}" is coming soon.
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-[#dcecf5] px-2 py-1 flex gap-6 text-[11px] font-bold border-t border-[#2d819b]/20 text-black">
                                        <span>Esc: Close</span>
                                        <span>Ctrl+A: Accept</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Tally Navigation Bar */}
                    <div className="bg-[#dcecf5] h-[24px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[11px] font-bold text-black shadow-inner">
                        <div className="flex gap-6">
                            <span><span className="text-blue-800 underline decoration-1">Q</span>: Quit</span>
                        </div>
                        <div className="flex gap-4">
                            <span
                                className="cursor-pointer hover:bg-[#b0d0e0] px-2"
                                onClick={() => setShowExportConfig(true)}
                            >
                                <span className="text-blue-800 underline font-bold">F12</span>: Configure
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {showExportConfig && (
                <div className="fixed inset-0 z-[200] bg-[#dcecf5] flex flex-col font-sans select-none" onClick={(e) => e.stopPropagation()}>
                    {/* Centered Export Configuration Title Header */}
                    <div className="flex flex-col items-center mt-6">
                        <div className="bg-white px-12 py-1.5 shadow-sm border border-gray-200 relative mb-1">
                            <span className="text-[#2d819b] font-bold text-[16px] tracking-wide">Export Configuration</span>
                            <button className="absolute top-1 right-2 text-gray-500 hover:text-red-500 font-bold text-[18px] leading-none z-10 w-6 h-6 flex items-center justify-center" onClick={() => setShowExportConfig(false)}>✕</button>
                            <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#feba35]"></div>
                        </div>
                        {/* Search Input Box */}
                        <div className="w-[400px]">
                            <input
                                type="text"
                                className="w-full bg-[#fff9c4] border border-[#2d819b] px-2 py-0.5 text-[14px] font-bold outline-none text-black"
                                defaultValue="-"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Main List of Configurations Modal */}
                    <div className="bg-white border-[1.5px] border-[#2d819b] shadow-2xl w-[600px] mx-auto mt-6 flex flex-col">
                        <div className="bg-[#2d819b] text-white px-2 py-1 font-bold flex justify-between items-center text-[13px]">
                            <span>List of Configurations</span>
                            <span className="text-[11px] font-normal cursor-pointer hover:underline">Show More</span>
                        </div>

                        <div className="p-0 overflow-y-auto max-h-[70vh] bg-[#ffffff]">
                            {[
                                {
                                    section: "General",
                                    items: [
                                        ["Location of Import/Export Files", "C:\\Program Files\\TallyPrime"],
                                        ["Open file after export", "Yes"],
                                        ["Enable export to PDF in Arabic", "No"],
                                        ["Enable Stripe View for Reports", "No"]
                                    ]
                                },
                                {
                                    section: "Banking",
                                    items: [
                                        ["Folder path for Payment Instructions", "C:\\Program Files\\TallyPrime"]
                                    ]
                                },
                                {
                                    section: "Additional Information",
                                    items: [
                                        ["Export base currency symbol along with the amount", "No"]
                                    ]
                                },
                                {
                                    section: "Header Information",
                                    items: [
                                        ["Top Margin of Reports (in Inches)", "0.50"],
                                        ["Show Date Range of Report", "Yes"],
                                        ["Show Date and Time of Reports", "No"],
                                        ["Show Date and Time of Voucher printing", "No"]
                                    ]
                                },
                                {
                                    section: "Company Details",
                                    items: [
                                        ["Include company logo (applicable to Print/Export/Share)", "No"],
                                        ["Show Company Name", "Yes"],
                                        ["Show Company Address", "Yes"],
                                        ["Show Phone No.", "No"],
                                        ["Show Country Code for Mobile No.", "No"]
                                    ]
                                }
                            ].map((group) => (
                                <div key={group.section} className="flex flex-col">
                                    <div className="px-4 py-1 text-[13.5px] font-bold text-black">{group.section}</div>
                                    {group.items.map(([label, value]) => (
                                        <div
                                            key={label}
                                            className={`grid grid-cols-[1fr_200px] px-8 py-0.5 text-[13.5px] cursor-pointer items-center ${selectedConfigItem === label ? 'bg-[#feba35] text-white font-bold' : 'text-black hover:bg-[#fff9e6]'}`}
                                            onMouseEnter={() => setSelectedConfigItem(label)}
                                            onClick={() => setSelectedConfigItem(label)}
                                        >
                                            <span>{label}</span>
                                            <span className={`text-right pr-4 italic ${selectedConfigItem === label ? 'text-white' : 'text-[#2d819b]'}`}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Tally Navigation Bar */}
                    <div className="mt-auto bg-[#dcecf5] h-[26px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[12px] font-bold text-black shadow-inner">
                        <div className="flex gap-6">
                            <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowExportConfig(false)}>Esc: Close</span>
                            <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowExportConfig(false)}><span className="text-blue-800 underline decoration-1">Q</span>: Quit</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowExportConfig(false)}><span className="text-blue-800 underline font-bold">A</span>: Accept</span>
                        </div>
                    </div>
                </div>
            )}

            {/* E-mail Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-[180] bg-black/5 flex items-center justify-center font-sans tracking-wide" onClick={() => setShowEmailModal(false)}>
                    <div className="bg-white border-[1px] border-gray-300 shadow-2xl w-[600px] relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[18px] leading-none z-10 w-6 h-6 flex items-center justify-center" onClick={() => setShowEmailModal(false)}>✕</button>
                        <div className="p-8 pb-16">
                            <div className="text-[17px] font-bold text-black mb-1 text-center border-b border-black w-fit mx-auto pb-0.5 px-4 mb-6">E-mail</div>

                            <div className="flex flex-col gap-[8px] text-[13.5px]">
                                <div className="grid grid-cols-[180px_20px_1fr] items-center">
                                    <span className="text-black">E-mail from</span>
                                    <span className="text-black">:</span>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            className="w-full bg-[#fff9c4] border border-[#2d819b] px-2 py-0.5 text-black outline-none"
                                            value={emailFrom}
                                            onChange={(e) => setEmailFrom(e.target.value)}
                                            autoFocus
                                        />
                                        {/* List of Profiles Popup */}
                                        <div className="absolute top-0 left-full ml-1 w-[200px] bg-white border border-[#2d819b] shadow-xl z-50">
                                            <div className="bg-[#2d819b] text-white px-2 py-1 text-[11px] font-bold">List of Profiles</div>
                                            <div
                                                className={`px-2 py-1 cursor-pointer font-bold text-[13px] ${selectedEmailProfile === 'Create' ? 'bg-[#feba35] text-white' : 'text-black hover:bg-[#fff9e6]'}`}
                                                onMouseEnter={() => setSelectedEmailProfile('Create')}
                                                onClick={() => setShowEmailProfileModal(true)}
                                            >
                                                Create
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[180px_20px_1fr] items-center">
                                    <span className="text-black">E-mail to</span>
                                    <span className="text-black">:</span>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 px-2 py-0.5 text-black outline-none focus:bg-[#fff9c4] focus:border-[#2d819b]"
                                        value={emailTo}
                                        onChange={(e) => setEmailTo(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-[180px_20px_1fr] items-center">
                                    <span className="text-black">Subject</span>
                                    <span className="text-black">:</span>
                                    <span className="text-black font-bold">List of Groups</span>
                                </div>
                                <div className="grid grid-cols-[180px_20px_1fr] items-start">
                                    <span className="text-black">E-mail message (if any)</span>
                                    <span className="text-black">:</span>
                                    <textarea className="w-full border border-gray-200 px-2 py-0.5 text-black outline-none h-20 resize-none focus:bg-[#fff9c4] focus:border-[#2d819b]"></textarea>
                                </div>
                            </div>

                            <div className="mt-12 text-[#2d819b] text-[13px] font-bold">
                                (Press Alt+S to select a predefined message template)
                            </div>
                        </div>

                        {/* Bottom Bar for Email Modal */}
                        <div className="absolute bottom-0 left-0 right-0 bg-[#dcecf5] h-[26px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[11px] font-bold text-black">
                            <div className="flex gap-6">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2" onClick={() => setShowEmailModal(false)}><span className="text-blue-800 underline">Q</span>: Quit</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2" onClick={() => {
                                    if (!emailTo.includes('@')) {
                                        setShowEmailErrorModal(true);
                                    } else {
                                        setShowEmailModal(false);
                                    }
                                }}><span className="text-blue-800 underline">A</span>: Accept</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create E-mail Profile Modal */}
            {showEmailProfileModal && (
                <div className="fixed inset-0 z-[190] bg-black/5 flex items-center justify-center font-sans tracking-wide" onClick={() => setShowEmailProfileModal(false)}>
                    <div className="bg-white border-[1px] border-gray-300 shadow-2xl w-[540px] p-8 pb-16 min-h-[400px] relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[18px] leading-none z-10 w-6 h-6 flex items-center justify-center" onClick={() => setShowEmailProfileModal(false)}>✕</button>
                        <div className="text-[17px] font-bold text-black mb-1 text-center border-b border-black w-fit mx-auto pb-0.5 px-4 mb-8">Create E-mail Profile</div>

                        <div className="flex flex-col gap-[8px] text-[13.5px]">
                            <div className="grid grid-cols-[180px_20px_1fr] items-center">
                                <span className="text-black font-bold">E-mail sender name</span>
                                <span className="text-black">:</span>
                                <span className="text-black">{emailSenderName}</span>
                            </div>
                            <div className="grid grid-cols-[180px_20px_1fr] items-center">
                                <span className="text-black font-bold">E-mail from</span>
                                <span className="text-black">:</span>
                                <input
                                    type="text"
                                    className="w-full bg-[#fff9c4] border border-[#2d819b] px-2 py-0.5 text-black outline-none"
                                    value={emailFrom}
                                    onChange={(e) => setEmailFrom(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-[180px_20px_1fr] items-center">
                                <span className="text-black font-bold">Show additional options</span>
                                <span className="text-black">:</span>
                                <span className="text-black italic">No</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showEmailErrorModal && (
                <div className="fixed inset-0 z-[200] bg-black/10 flex items-center justify-center font-sans" onClick={() => setShowEmailErrorModal(false)}>
                    <div className="bg-white border-2 border-red-600 shadow-2xl w-[400px] text-center overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[18px] leading-none z-10 w-6 h-6 flex items-center justify-center" onClick={() => setShowEmailErrorModal(false)}>✕</button>
                        <div className="text-red-600 font-bold py-2 border-b border-red-600 text-[18px]">Error</div>
                        <div className="p-8 text-black">
                            <div className="text-[20px] font-bold mb-4">Oops!</div>
                            <div className="text-[14px] leading-relaxed">
                                Invalid E-mail ID. Enter valid E-mail ID to proceed.
                            </div>
                        </div>
                        <div className="bg-gray-50 py-2">
                            <button className="text-[12px] font-bold border border-gray-300 px-4 py-1 hover:bg-gray-200 text-black" onClick={() => setShowEmailErrorModal(false)}>OK</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Others Modal */}
            {showShareOthersModal && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[120px] bg-black/10" onClick={() => setShowShareOthersModal(false)}>
                    {/* Main Background E-mail Report Window */}
                    <div className="flex flex-col w-[540px] shadow-2xl border border-[#2d819b] font-sans relative bg-white" onClick={(e) => e.stopPropagation()}>
                        {/* Company Name Header bar */}
                        <div className="bg-[#dcecf5] text-black px-2 h-[22px] flex items-center justify-center border-b border-[#2d819b] relative">
                            <span className="text-[11px] font-bold">Solarica</span>
                            <div className="absolute right-0 top-0 h-full flex items-center border-l border-[#2d819b]">
                                <span className="w-6 h-full flex items-center justify-center cursor-pointer hover:bg-[#ff4d4d] hover:text-white pb-[2px]" onClick={() => setShowShareOthersModal(false)}>✕</span>
                            </div>
                        </div>

                        {/* Export Report Title */}
                        <div className="bg-white text-black pt-2 pb-1 text-[13px] font-bold text-center underline decoration-1 underline-offset-[3px] decoration-black/40">
                            E-mail Report
                        </div>

                        {/* Yellow Search/Input Area */}
                        <div className="mx-2 mb-2 p-[1px] border border-[#2d819b] bg-[#fff9c4]">
                            <div className="w-full h-[22px] flex items-center px-1 font-bold text-[13px] text-black">
                                .
                            </div>
                        </div>

                        {/* Date info in background */}
                        <div className="absolute right-2 top-[30px] text-gray-400 text-[11px] font-bold opacity-30">
                            For 1-Apr-25
                        </div>

                        {/* List of Reports (Overlaying, aligned exactly to the input box) */}
                        <div className="absolute top-[80px] left-[8px] w-[524px] bg-[#eaf4fa] border-[1.5px] border-[#2d819b] shadow-2xl flex flex-col font-sans text-[13px] z-[110]">
                            {/* Blue Header */}
                            <div className="bg-[#2d819b] text-white font-bold px-2 h-[22px] flex items-center">
                                List of Reports
                            </div>

                            {/* Control Actions / Selection Menu */}
                            <div className="flex flex-col bg-white">
                                <div
                                    className={`px-4 py-[1px] cursor-pointer font-bold flex justify-end items-center h-[22px] border-b border-[#dcecf5] ${selectedShareListItem === (shareListExpanded ? 'Collapse All' : 'Expand All') ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#ffe599]'}`}
                                    onMouseEnter={() => setSelectedShareListItem(shareListExpanded ? 'Collapse All' : 'Expand All')}
                                    onClick={() => setShareListExpanded(!shareListExpanded)}
                                >
                                    {shareListExpanded ? 'Collapse All' : 'Expand All'}
                                </div>
                                <div
                                    className={`px-4 py-[1px] cursor-pointer font-bold flex justify-end items-center h-[22px] border-b border-[#dcecf5] ${selectedShareListItem === (shareListShowMore ? 'Show Less' : 'Show More') ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#ffe599]'}`}
                                    onMouseEnter={() => setSelectedShareListItem(shareListShowMore ? 'Show Less' : 'Show More')}
                                    onClick={() => setShareListShowMore(!shareListShowMore)}
                                >
                                    {shareListShowMore ? 'Show Less' : 'Show More'}
                                </div>
                                {shareListShowMore && (
                                    <div
                                        className={`px-4 py-[1px] cursor-pointer font-bold flex justify-end items-center h-[22px] border-b border-[#dcecf5] ${selectedShareListItem === (shareListShowInactive ? 'Hide Inactive' : 'Show Inactive') ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#ffe599]'}`}
                                        onMouseEnter={() => setSelectedShareListItem(shareListShowInactive ? 'Hide Inactive' : 'Show Inactive')}
                                        onClick={() => setShareListShowInactive(!shareListShowInactive)}
                                    >
                                        {shareListShowInactive ? 'Hide Inactive' : 'Show Inactive'}
                                    </div>
                                )}
                            </div>

                            {/* Scrollable Report List Content */}
                            <div className="bg-[#eaf4fa] flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
                                {(shareListExpanded || !shareListShowInactive) && (
                                    <div className="py-1">
                                        <div className="px-2 py-0.5 font-bold text-black bg-white/40">Payroll</div>
                                        <div className="px-6 py-0.5 cursor-pointer hover:bg-[#ffe599] text-black">Salary Payment Advice</div>
                                    </div>
                                )}

                                {shareListShowInactive && (
                                    <div className="py-1">
                                        <div className="px-2 py-0.5 font-bold text-black bg-white/40 border-b border-gray-200">VAT Reports</div>

                                        <div className="px-2 py-0.5 font-bold text-black bg-white/40 border-b border-gray-200 mt-2">Excise Manufacturer Reports</div>
                                        <div className="px-6 py-0.5 cursor-pointer hover:bg-[#ffe599] text-black">Excise Forms & Registers</div>

                                        <div className="px-2 py-0.5 font-bold text-black bg-white/40 border-b border-gray-200 mt-2">Payroll Statutory Reports</div>
                                        {[
                                            { name: 'PF Monthly Statement' },
                                            { name: 'E-Return', extra: 'PF' },
                                            { name: 'Export PF e-Return Form 5' },
                                            { name: 'Export PF e-Return Form 10' },
                                            { name: 'Export PF e-Return Form 12A' },
                                            { name: 'Export PF e-Return Form 3A' },
                                            { name: 'PF Form 5' },
                                            { name: 'PF Form 10' },
                                            { name: 'PF Form 12A' },
                                            { name: 'PF Form 3A' },
                                            { name: 'PF Form 6A' },
                                            { name: 'ESI Monthly Statement' },
                                            { name: 'E-Return', extra: 'ESI' },
                                            { name: 'Form 3' },
                                            { name: 'Form 5' },
                                            { name: 'Form 6' },
                                            { name: 'Professional Tax Computation' },
                                            { name: 'Professional Tax Statement' },
                                            { name: 'E-24Q' },
                                            { name: 'Form 24Q' },
                                            { name: 'Annexure I to Form 24Q' },
                                            { name: 'Annexure II to Form 24Q' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="px-6 py-[1px] flex justify-between cursor-pointer hover:bg-[#ffe599] text-black">
                                                <span>{item.name}</span>
                                                {item.extra && <span className="italic text-gray-500 text-[11px] pr-2">{item.extra}</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Bottom Label/Counter */}
                            <div className="bg-[#eaf4fa] h-[18px] flex items-center px-1 text-[11px] text-gray-500 font-bold border-t border-[#2d819b]/20">
                                {shareListShowInactive ? '29 Group(s)' : '4'}
                                <span className="ml-auto pr-1 text-[10px]">▼</span>
                            </div>
                        </div>

                        {/* Bottom Tally Navigation Bar */}
                        <div className="mt-[415px] bg-[#dcecf5] h-[24px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[11px] font-bold text-black">
                            <div className="flex gap-6">
                                <span className="cursor-pointer" onClick={() => setShowShareOthersModal(false)}><span className="text-blue-800 underline decoration-1">Q</span>: Quit</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Configuration Modal */}
            {showEmailConfigModal && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[120px] bg-black/10" onClick={() => setShowEmailConfigModal(false)}>
                    {/* Main Background E-mail Configuration Window */}
                    <div className="flex flex-col w-[540px] shadow-2xl border border-[#2d819b] font-sans relative bg-white" onClick={(e) => e.stopPropagation()}>
                        {/* Company Name Header bar */}
                        <div className="bg-[#dcecf5] text-black px-2 h-[22px] flex items-center justify-center border-b border-[#2d819b] relative">
                            <span className="text-[11px] font-bold">Solarica</span>
                            <div className="absolute right-0 top-0 h-full flex items-center border-l border-[#2d819b]">
                                <span className="w-6 h-full flex items-center justify-center cursor-pointer hover:bg-[#ff4d4d] hover:text-white pb-[2px]" onClick={() => setShowEmailConfigModal(false)}>✕</span>
                            </div>
                        </div>

                        {/* Configuration Title */}
                        <div className="bg-white text-black pt-2 pb-1 text-[13px] font-bold text-center underline decoration-1 underline-offset-[3px] decoration-black/40">
                            E-mail Configuration
                        </div>

                        {/* Yellow Search/Input Area */}
                        <div className="mx-2 mb-2 p-[1px] border border-[#2d819b] bg-[#fff9c4]">
                            <div className="w-full h-[22px] flex items-center px-1 font-bold text-[13px] text-black">
                                .
                            </div>
                        </div>

                        {/* Date info in background */}
                        <div className="absolute right-2 top-[30px] text-gray-400 text-[11px] font-bold opacity-30">
                            For 1-Apr-25
                        </div>

                        {/* List of Configurations (Overlaying) */}
                        <div className="absolute top-[80px] left-[8px] w-[524px] bg-[#eaf4fa] border-[1.5px] border-[#2d819b] shadow-2xl flex flex-col font-sans text-[13px] z-[110]">
                            {/* Blue Header */}
                            <div className="bg-[#2d819b] text-white font-bold px-2 h-[22px] flex items-center">
                                List of Configurations
                            </div>

                            {/* Show More/Less Toggle */}
                            <div className="flex flex-col bg-white">
                                <div
                                    className={`px-4 py-[1px] cursor-pointer font-bold flex justify-end items-center h-[22px] border-b border-[#dcecf5] ${selectedEmailConfigItem === (emailConfigShowMore ? 'Show Less' : 'Show More') ? 'bg-[#feba35] text-black' : 'text-black hover:bg-[#ffe599]'}`}
                                    onMouseEnter={() => setSelectedEmailConfigItem(emailConfigShowMore ? 'Show Less' : 'Show More')}
                                    onClick={() => setEmailConfigShowMore(!emailConfigShowMore)}
                                >
                                    {emailConfigShowMore ? 'Show Less' : 'Show More'}
                                </div>
                            </div>

                            {/* Configuration Items List */}
                            <div className="bg-[#eaf4fa] flex-1 overflow-y-auto max-h-[460px] custom-scrollbar p-1">
                                {/* E-mail Settings Group */}
                                <div className="mb-2">
                                    <div className="px-1 py-0.5 font-bold text-black border-b border-gray-300/50 mb-1">E-mail Settings</div>
                                    {[
                                        { label: 'Show Cc', value: 'No', showAlways: true },
                                        { label: 'Show Bcc', value: 'No', showAlways: true },
                                        { label: 'Pre-defined Message', value: '< 0 defined >', showAlways: false },
                                        { label: 'Pre-defined E-mail Profile', value: '< 0 defined >', showAlways: false },
                                        { label: 'Show additional details for Recipient E-mail ID', value: 'No', showAlways: false },
                                        { label: 'Set no. of copies for Emailing vouchers', value: '<Value exists>', showAlways: false },
                                        { label: 'Enable export to PDF in Arabic', value: 'No', showAlways: true },
                                        { label: 'Enable Stripe View for Reports', value: 'No', showAlways: true },
                                    ].filter(item => emailConfigShowMore || item.showAlways).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-2 py-[1px] flex justify-between cursor-pointer group hover:bg-[#ffe599] ${selectedEmailConfigItem === item.label ? 'bg-[#feba35]' : ''}`}
                                            onMouseEnter={() => setSelectedEmailConfigItem(item.label)}
                                        >
                                            <span className="text-black">{item.label}</span>
                                            <span className="italic text-black font-medium pr-1">{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Header Information Group */}
                                <div className="mb-2">
                                    <div className="px-1 py-0.5 font-bold text-black border-b border-gray-300/50 mb-1">Header Information</div>
                                    {[
                                        { label: 'Print Country with Address', value: 'No', showAlways: false },
                                        { label: 'Top Margin of Reports (in Inches)', value: '0.50', showAlways: true },
                                        { label: 'Show Date Range of Report', value: 'Yes', showAlways: true },
                                        { label: 'Show Page Numbers in Vouchers and Reports', value: 'Yes', showAlways: false },
                                        { label: 'Show Date and Time of Reports', value: 'No', showAlways: true },
                                        { label: 'Show Date and Time on all pages of Reports', value: 'No', showAlways: false, isSub: true },
                                        { label: 'Show Date and Time of Voucher printing', value: 'No', showAlways: true },
                                        { label: 'Show Date and Time on all pages of Vouchers', value: 'No', showAlways: false, isSub: true },
                                    ].filter(item => emailConfigShowMore || item.showAlways).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-2 py-[1px] flex justify-between cursor-pointer group hover:bg-[#ffe599] ${selectedEmailConfigItem === item.label ? 'bg-[#feba35]' : ''} ${item.isSub ? 'pl-6 text-gray-600' : ''}`}
                                            onMouseEnter={() => setSelectedEmailConfigItem(item.label)}
                                        >
                                            <span className="text-black">{item.label}</span>
                                            <span className="italic text-black font-medium pr-1">{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Company Details Group */}
                                <div className="mb-2">
                                    <div className="px-1 py-0.5 font-bold text-black border-b border-gray-300/50 mb-1">Company Details</div>
                                    {[
                                        { label: 'Include company logo (applicable to Print/Export/Share)', value: 'No', showAlways: true },
                                        { label: 'Show Company Name', value: 'Yes', showAlways: true },
                                        { label: 'Show Company Address', value: 'Yes', showAlways: true },
                                        { label: 'Show Phone No.', value: 'No', showAlways: true },
                                        { label: 'Show Country Code for Mobile No.', value: 'No', showAlways: true, isSub: true },
                                        { label: 'Show Fax', value: 'No', showAlways: false, isSub: true },
                                        { label: 'Show E-mail', value: 'Yes', showAlways: false },
                                        { label: 'Show Website', value: 'No', showAlways: false },
                                        { label: 'Show CIN', value: 'Yes', showAlways: false },
                                        { label: 'Show Udyam Reg No. & Enterprise Type for Reports', value: 'Yes', showAlways: false },
                                        { label: 'Show Activity Type for Reports', value: 'Yes', showAlways: false },
                                    ].filter(item => emailConfigShowMore || item.showAlways).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-2 py-[1px] flex justify-between cursor-pointer group hover:bg-[#ffe599] ${selectedEmailConfigItem === item.label ? 'bg-[#feba35]' : ''} ${item.isSub ? 'pl-6 text-gray-600' : ''}`}
                                            onMouseEnter={() => setSelectedEmailConfigItem(item.label)}
                                        >
                                            <span className="text-black">{item.label}</span>
                                            <span className="italic text-black font-medium pr-1">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Tally Navigation Bar */}
                        <div className="mt-[500px] bg-[#dcecf5] h-[26px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[11px] font-bold text-black">
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowEmailConfigModal(false)}><span className="text-blue-800 underline decoration-1">Q</span>: Quit</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowEmailConfigModal(false)}><span className="text-blue-800 underline decoration-1 font-bold">A</span>: Accept</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* WhatsApp Configuration Modal */}
            {showWhatsAppConfigModal && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[120px] bg-black/10" onClick={() => setShowWhatsAppConfigModal(false)}>
                    {/* Main Background WhatsApp Configuration Window */}
                    <div className="flex flex-col w-[600px] shadow-2xl border border-[#2d819b] font-sans relative bg-white" onClick={(e) => e.stopPropagation()}>
                        {/* Company Name Header bar */}
                        <div className="bg-[#dcecf5] text-black px-2 h-[22px] flex items-center justify-center border-b border-[#2d819b] relative">
                            <span className="text-[11px] font-bold">Solarica</span>
                            <div className="absolute right-0 top-0 h-full flex items-center border-l border-[#2d819b]">
                                <span className="w-6 h-full flex items-center justify-center cursor-pointer hover:bg-[#ff4d4d] hover:text-white pb-[2px]" onClick={() => setShowWhatsAppConfigModal(false)}>✕</span>
                            </div>
                        </div>

                        {/* Configuration Title */}
                        <div className="bg-white text-black pt-2 pb-1 text-[13px] font-bold text-center underline decoration-1 underline-offset-[3px] decoration-black/40">
                            WhatsApp Settings
                        </div>

                        {/* Yellow Search/Input Area */}
                        <div className="mx-2 mb-2 p-[1px] border border-[#2d819b] bg-[#fff9c4]">
                            <div className="w-full h-[22px] flex items-center px-1 font-bold text-[13px] text-black">
                                .
                            </div>
                        </div>

                        {/* Date info in background */}
                        <div className="absolute right-2 top-[30px] text-gray-400 text-[11px] font-bold opacity-30">
                            For 1-Apr-25
                        </div>

                        {/* List of Configurations (Overlaying) */}
                        <div className="absolute top-[80px] left-[8px] w-[584px] bg-[#eaf4fa] border-[1.5px] border-[#2d819b] shadow-2xl flex flex-col font-sans text-[13px] z-[110]">
                            {/* Blue Header */}
                            <div className="bg-[#2d819b] text-white font-bold px-2 h-[22px] flex items-center justify-between">
                                <span>List of Configurations</span>
                                <span className="text-[11px] font-normal cursor-pointer hover:underline" onClick={() => setWhatsAppConfigShowMore(!whatsAppConfigShowMore)}>
                                    {whatsAppConfigShowMore ? 'Show Less' : 'Show More'}
                                </span>
                            </div>

                            {/* Configuration Items List */}
                            <div className="bg-[#eaf4fa] flex-1 overflow-y-auto max-h-[460px] custom-scrollbar p-1">
                                {/* WhatsApp Settings Group */}
                                <div className="mb-2">
                                    <div className="px-1 py-0.5 font-bold text-black border-b border-gray-300/50 mb-1">WhatsApp Settings</div>
                                    {[
                                        { label: 'Set Preview as default', value: 'No', showAlways: true },
                                        { label: 'Enable export to PDF in Arabic', value: 'No', showAlways: true },
                                        { label: 'Enable Stripe View for Reports', value: 'No', showAlways: true },
                                    ].filter(item => whatsAppConfigShowMore || item.showAlways).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-2 py-[1px] flex justify-between cursor-pointer group hover:bg-[#ffe599] ${selectedWhatsAppConfigItem === item.label ? 'bg-[#feba35] text-white font-bold' : ''}`}
                                            onMouseEnter={() => setSelectedWhatsAppConfigItem(item.label)}
                                        >
                                            <span className="text-black">{item.label}</span>
                                            <span className={`italic font-medium pr-1 ${selectedWhatsAppConfigItem === item.label ? 'text-white' : 'text-black'}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Header Information Group */}
                                <div className="mb-2">
                                    <div className="px-1 py-0.5 font-bold text-black border-b border-gray-300/50 mb-1">Header Information</div>
                                    {[
                                        { label: 'Print Country with Address', value: 'No', showAlways: false },
                                        { label: 'Top Margin of Reports (in Inches)', value: '0.50', showAlways: true },
                                        { label: 'Show Date Range of Report', value: 'Yes', showAlways: true },
                                        { label: 'Show Page Numbers in Vouchers and Reports', value: 'Yes', showAlways: false },
                                        { label: 'Show Date and Time of Reports', value: 'No', showAlways: true },
                                        { label: 'Show Date and Time on all pages of Reports', value: 'No', showAlways: false, isSub: true },
                                        { label: 'Show Date and Time of Voucher printing', value: 'No', showAlways: true },
                                        { label: 'Show Date and Time on all pages of Vouchers', value: 'No', showAlways: false, isSub: true },
                                    ].filter(item => whatsAppConfigShowMore || item.showAlways).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-2 py-[1px] flex justify-between cursor-pointer group hover:bg-[#ffe599] ${selectedWhatsAppConfigItem === item.label ? 'bg-[#feba35] text-white font-bold' : ''} ${item.isSub ? 'pl-6 text-gray-600' : ''}`}
                                            onMouseEnter={() => setSelectedWhatsAppConfigItem(item.label)}
                                        >
                                            <span className="text-black">{item.label}</span>
                                            <span className={`italic font-medium pr-1 ${selectedWhatsAppConfigItem === item.label ? 'text-white' : 'text-black'}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Company Details Group */}
                                <div className="mb-2">
                                    <div className="px-1 py-0.5 font-bold text-black border-b border-gray-300/50 mb-1">Company Details</div>
                                    {[
                                        { label: 'Include company logo (applicable to Print/Export/Share)', value: 'No', showAlways: true },
                                        { label: 'Show Company Name', value: 'Yes', showAlways: true },
                                        { label: 'Show Company Address', value: 'Yes', showAlways: true },
                                        { label: 'Show Phone No.', value: 'No', showAlways: true },
                                        { label: 'Show Country Code for Mobile No.', value: 'No', showAlways: true, isSub: true },
                                        { label: 'Show Fax', value: 'No', showAlways: false, isSub: true },
                                        { label: 'Show E-mail', value: 'Yes', showAlways: false },
                                        { label: 'Show Website', value: 'No', showAlways: false },
                                        { label: 'Show CIN', value: 'Yes', showAlways: false },
                                        { label: 'Show Udyam Reg No. & Enterprise Type for Reports', value: 'Yes', showAlways: false },
                                        { label: 'Show Activity Type for Reports', value: 'Yes', showAlways: false },
                                    ].filter(item => whatsAppConfigShowMore || item.showAlways).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-2 py-[1px] flex justify-between cursor-pointer group hover:bg-[#ffe599] ${selectedWhatsAppConfigItem === item.label ? 'bg-[#feba35] text-white font-bold' : ''} ${item.isSub ? 'pl-6 text-gray-600' : ''}`}
                                            onMouseEnter={() => setSelectedWhatsAppConfigItem(item.label)}
                                        >
                                            <span className="text-black">{item.label}</span>
                                            <span className={`italic font-medium pr-1 ${selectedWhatsAppConfigItem === item.label ? 'text-white' : 'text-black'}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Tally Navigation Bar */}
                        <div className="mt-[500px] bg-[#dcecf5] h-[26px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[11px] font-bold text-black">
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowWhatsAppConfigModal(false)}><span className="text-blue-800 underline decoration-1">Q</span>: Quit</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowWhatsAppConfigModal(false)}><span className="text-blue-800 underline decoration-1 font-bold">A</span>: Accept</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* WhatsApp Subscription Modal */}
            {showWhatsAppModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/10" onClick={() => setShowWhatsAppModal(false)}>
                    <div className="bg-white border-[1.5px] border-[#2d819b] shadow-2xl w-[600px] flex flex-col font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[18px] leading-none z-10 w-6 h-6 flex items-center justify-center" onClick={() => setShowWhatsAppModal(false)}>✕</button>
                        <div className="p-8 pb-12">
                            <h2 className="text-[14px] font-bold text-black border-b border-gray-200 pb-2 mb-6">Sign Up & Use Registered Business WhatsApp No.</h2>

                            <div className="text-[13px] text-black space-y-6 leading-relaxed">
                                <p>Sign up for your WhatsApp subscription to start using TallyPrime with WhatsApp for your business.</p>

                                <p>Already signed up for WhatsApp? Enter your business WhatsApp No. & Business Name, and proceed to log in.</p>
                            </div>

                            <div className="flex gap-12 mt-10 justify-center">
                                <button className="border border-[#feba35] bg-white px-8 py-2 text-[13px] font-bold text-black hover:bg-[#fff9c4] transition-colors shadow-sm outline outline-1 outline-[#feba35]">
                                    <span className="text-blue-800 underline mr-1">W</span>: Sign Up & Subscribe
                                </button>
                                <button className="border border-[#2d819b] bg-white px-8 py-2 text-[13px] font-bold text-black hover:bg-[#dcecf5] transition-colors shadow-sm">
                                    <span className="text-blue-800 underline mr-1">A</span>: Enter WhatsApp Details
                                </button>
                            </div>
                        </div>

                        {/* Modal Bottom Bar */}
                        <div className="bg-[#dcecf5] h-[24px] border-t border-[#2d819b]/40 flex items-center px-2 text-[11px] font-bold text-black">
                            <span className="cursor-pointer" onClick={() => setShowWhatsAppModal(false)}>
                                <span className="text-blue-800 underline decoration-1">Q</span>: Quit
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* WhatsApp Nos Modal */}
            {showWhatsAppNosModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/10" onClick={() => setShowWhatsAppNosModal(false)}>
                    <div className="bg-white border-[1.5px] border-[#2d819b] shadow-2xl w-[600px] flex flex-col font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[18px] leading-none z-10 w-6 h-6 flex items-center justify-center" onClick={() => setShowWhatsAppNosModal(false)}>✕</button>
                        <div className="p-8 pb-12">
                            <h2 className="text-[14px] font-bold text-black border-b border-gray-200 pb-2 mb-6">Sign Up & Use Registered Business WhatsApp No.</h2>

                            <div className="text-[13px] text-black space-y-6 leading-relaxed">
                                <p>Sign up for your WhatsApp subscription to start using TallyPrime with WhatsApp for your business.</p>

                                <p>Already signed up for WhatsApp? Enter your business WhatsApp No. & Business Name, and proceed to log in.</p>
                            </div>

                            <div className="flex gap-12 mt-10 justify-center">
                                <button
                                    className="border border-[#feba35] bg-white px-8 py-2 text-[13px] font-bold text-black hover:bg-[#fff9c4] transition-colors shadow-sm outline outline-1 outline-[#feba35]"
                                    onClick={() => {
                                        window.open('https://tallysolutions.com/tallyprime-with-whatsapp-prerequisites/', '_blank');
                                    }}
                                >
                                    <span className="text-blue-800 underline mr-1">W</span>: Sign Up & Subscribe
                                </button>
                                <button className="border border-[#2d819b] bg-white px-8 py-2 text-[13px] font-bold text-black hover:bg-[#dcecf5] transition-colors shadow-sm">
                                    <span className="text-blue-800 underline mr-1">A</span>: Enter WhatsApp Details
                                </button>
                            </div>
                        </div>

                        {/* Modal Bottom Bar */}
                        <div className="bg-[#dcecf5] h-[24px] border-t border-[#2d819b]/40 flex items-center px-2 text-[11px] font-bold text-black">
                            <span className="cursor-pointer" onClick={() => setShowWhatsAppNosModal(false)}>
                                <span className="text-blue-800 underline decoration-1">Q</span>: Quit
                            </span>
                        </div>
                    </div>
                </div>
            )}
            {/* Mapping Template Creation Modal */}
            {showMappingTemplateModal && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[120px] bg-black/10" onClick={() => setShowMappingTemplateModal(false)}>
                    <div className="flex flex-col w-[600px] shadow-2xl border border-[#2d819b] font-sans relative bg-white" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-[#dcecf5] text-black px-2 h-[22px] flex items-center justify-center border-b border-[#2d819b] relative">
                            <span className="text-[11px] font-bold">Solarica</span>
                            <div className="absolute right-0 top-0 h-full flex items-center border-l border-[#2d819b]">
                                <span className="w-6 h-full flex items-center justify-center cursor-pointer hover:bg-[#ff4d4d] hover:text-white pb-[2px]" onClick={() => setShowMappingTemplateModal(false)}>✕</span>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="bg-[#8cc63f] text-black pt-1 pb-1 text-[13px] font-bold pl-2 border-b border-[#2d819b]">
                            Mapping Template Creation
                        </div>

                        {/* Content */}
                        <div className="p-8 pb-32 bg-[#eaf4fa] text-[13px] font-sans">
                            <div className="flex flex-col gap-[2px]">
                                <div className="grid grid-cols-[150px_10px_1fr] items-center">
                                    <span className="text-black">File Path</span>
                                    <span className="text-black font-bold">:</span>
                                    <span className="text-black font-bold">C:\Program Files\TallyPrime</span>
                                </div>

                                <div className="grid grid-cols-[150px_10px_1fr] items-center relative">
                                    <span className="text-black">File to Import</span>
                                    <span className="text-black font-bold">:</span>
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            className="w-full bg-[#fff9c4] border border-[#2d819b] px-2 py-0.5 text-black outline-none h-[24px]"
                                            value={mappingTemplateFile}
                                            onChange={(e) => setMappingTemplateFile(e.target.value)}
                                            onFocus={() => setShowMappingFileList(true)}
                                            autoFocus
                                        />

                                        {/* List of Files Dropdown */}
                                        {showMappingFileList && (
                                            <div className="absolute top-full left-0 w-full bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[200] flex flex-col mt-1">
                                                <div className="bg-[#2d819b] text-white px-2 py-1 text-[11px] font-bold">List of Files</div>

                                                <div className="flex flex-col bg-white text-[12px]">
                                                    <div className="flex justify-end pr-2 py-1 text-[#2d819b] italic border-b border-gray-100 bg-[#feba35]">
                                                        <div className="flex flex-col text-right gap-0">
                                                            <span
                                                                className="cursor-pointer hover:underline text-black"
                                                                onClick={() => setShowSpecifyPathModal(true)}
                                                            >
                                                                Specify Path
                                                            </span>
                                                            <span
                                                                className="cursor-pointer hover:underline text-black"
                                                                onClick={() => setShowSelectDriveModal(true)}
                                                            >
                                                                Select from Drive
                                                            </span>
                                                            <span
                                                                className="cursor-pointer hover:underline text-black"
                                                                onClick={() => setMappingFileShowMore(!mappingFileShowMore)}
                                                            >
                                                                {mappingFileShowMore ? 'Show Less' : 'Show More'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="px-2 py-1 font-bold text-black border-b border-gray-100 bg-gray-50">C:\Program Files\TallyPrime</div>

                                                    <div className="flex flex-col max-h-[200px] overflow-y-auto">
                                                        <div className="px-4 py-0.5 cursor-pointer hover:bg-[#ffe599] text-black font-bold flex items-center">
                                                            <span className="mr-2">♦</span> Up
                                                        </div>
                                                        {mappingFileShowMore && (
                                                            <>
                                                                {['Setup.exe', 'tally.exe', 'tally.ini', 'tallyapp.dat', 'tallycfg.tsf', 'tallygateway.ini', 'tallygatewayserver.exe', 'tallyhelp.html', 'tallymigrationtool.exe', 'tallyres.dat', 'tallyscheduler.exe', 'tallywin.dat'].map((file) => (
                                                                    <div
                                                                        key={file}
                                                                        className={`px-4 py-0.5 cursor-pointer flex justify-between ${selectedMappingFile === file ? 'bg-[#feba35] text-black font-bold' : 'text-black hover:bg-[#ffe599]'}`}
                                                                        onMouseEnter={() => setSelectedMappingFile(file)}
                                                                        onClick={() => {
                                                                            setMappingTemplateFile(file);
                                                                            setShowMappingFileList(false);
                                                                        }}
                                                                    >
                                                                        <span>{file}</span>
                                                                        <span className="italic text-black font-normal">File</span>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        )}
                                                        {['appdata', 'capsules', 'config', 'lang', 'logs'].map((folder) => (
                                                            <div
                                                                key={folder}
                                                                className={`px-4 py-0.5 cursor-pointer flex justify-between ${selectedMappingFile === folder ? 'bg-[#feba35] text-black font-bold' : 'text-black hover:bg-[#ffe599]'}`}
                                                                onMouseEnter={() => setSelectedMappingFile(folder)}
                                                                onClick={() => {
                                                                    setMappingTemplateFile(folder);
                                                                    setShowMappingFileList(false);
                                                                }}
                                                            >
                                                                <span>{folder}</span>
                                                                <span className="italic text-black font-normal">Folder</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-[150px_10px_1fr] items-center">
                                    <span className="text-black">Worksheet Name</span>
                                    <span className="text-black font-bold">:</span>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 px-2 py-0.5 text-black outline-none focus:bg-[#fff9c4] focus:border-[#2d819b] h-[24px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="mt-auto bg-[#dcecf5] h-[26px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[11px] font-bold text-black shadow-inner">
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowMappingTemplateModal(false)}><span className="text-blue-800 underline decoration-1">Q</span>: Quit</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowMappingTemplateModal(false)}><span className="text-blue-800 underline decoration-1 font-bold">A</span>: Accept</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Specify File Path Modal */}
            {showSpecifyPathModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40" onClick={() => setShowSpecifyPathModal(false)}>
                    <div className="bg-white border-2 border-gray-400 shadow-2xl w-[450px] flex flex-col font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white text-black pt-3 pb-2 text-[14px] font-bold text-center border-b border-gray-300 relative">
                            Specify File Path
                            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[18px] leading-none" onClick={() => setShowSpecifyPathModal(false)}>✕</button>
                        </div>
                        <div className="p-6">
                            <input
                                type="text"
                                className="w-full bg-[#fff9c4] border border-gray-400 px-2 py-1 text-black outline-none h-[28px]"
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Select from Drive Modal */}
            {showSelectDriveModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40" onClick={() => setShowSelectDriveModal(false)}>
                    <div className="bg-[#dcecf5] border border-[#2d819b] shadow-2xl w-[500px] flex flex-col font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#2d819b] text-white px-2 py-1 text-[11px] font-bold relative">
                            List of Files
                            <button className="absolute top-0 right-0 h-full px-2 text-white hover:bg-[#ff4d4d] font-bold text-[14px] leading-none" onClick={() => setShowSelectDriveModal(false)}>✕</button>
                        </div>

                        <div className="flex flex-col bg-white text-[12px]">
                            <div className="flex justify-end pr-2 py-1 border-b border-gray-100">
                                <span className="cursor-pointer hover:underline text-black">Specify Path</span>
                            </div>

                            <div className="px-2 py-1 font-bold text-black border-b border-gray-100 flex items-center">
                                <span className="mr-2">♦</span> Primary
                            </div>

                            <div className="flex flex-col max-h-[200px] overflow-y-auto">
                                {[
                                    { name: 'C:\\', type: 'Folder' },
                                    { name: 'Desktop', type: 'Folder' },
                                    { name: 'Documents', type: 'Folder' },
                                    { name: 'Downloads', type: 'Folder' }
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`px-4 py-0.5 cursor-pointer flex justify-between ${idx === 0 ? 'bg-[#feba35] text-black font-bold' : 'text-black hover:bg-[#ffe599]'}`}
                                        onClick={() => {
                                            setShowSelectDriveModal(false);
                                        }}
                                    >
                                        <span>{item.name}</span>
                                        <span className="italic text-black font-normal">{item.type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Sample Excel File Modal */}
            {showSampleExcelModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10" onClick={() => setShowSampleExcelModal(false)}>
                    <div className="bg-white border border-gray-400 shadow-2xl w-[550px] flex flex-col font-sans relative" onClick={(e) => e.stopPropagation()}>
                        {/* Title */}
                        <div className="bg-white text-black pt-3 pb-2 text-[14px] font-bold text-center border-b border-gray-300 relative">
                            Export Sample Excel File for {sampleExcelType}
                            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[18px] leading-none" onClick={() => setShowSampleExcelModal(false)}>✕</button>
                        </div>

                        {/* Content */}
                        <div className="p-8 bg-white text-[13px] font-sans">
                            <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-[180px_10px_1fr] items-center">
                                    <span className="text-black">Export sample file for</span>
                                    <span className="text-black font-bold">:</span>
                                    <span className="text-black font-bold">
                                        {sampleExcelType === 'Masters' ? 'All Accounting Masters' : 'All Accounting Vouchers'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-[180px_10px_1fr] items-center">
                                    <span className="text-black">Export to</span>
                                    <span className="text-black font-bold">:</span>
                                    <span className="text-black font-bold">Local drive</span>
                                </div>

                                <div className="grid grid-cols-[180px_10px_1fr] items-center">
                                    <span className="text-black">Folder Path</span>
                                    <span className="text-black font-bold">:</span>
                                    <span className="text-black font-bold">C:\Program Files\TallyPrime</span>
                                </div>

                                <div className="grid grid-cols-[180px_10px_1fr] items-center">
                                    <span className="text-black">File Name</span>
                                    <span className="text-black font-bold">:</span>
                                    <span className="text-black font-bold">
                                        {sampleExcelType === 'Masters' ? 'AllAccountingMasters.xlsx' : 'AccountingVouchers.xlsx'}
                                    </span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-6 mt-8 justify-center">
                                <button className="border-2 border-[#2d819b] bg-white px-6 py-2 text-[13px] font-bold text-black hover:bg-[#dcecf5] transition-colors">
                                    <span className="text-blue-800 underline mr-1">C</span>: Configure
                                </button>
                                <button className="border-2 border-[#feba35] bg-white px-6 py-2 text-[13px] font-bold text-black hover:bg-[#fff9c4] transition-colors outline outline-1 outline-[#feba35]">
                                    <span className="text-blue-800 underline mr-1">E</span>: Export
                                </button>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="bg-[#dcecf5] h-[26px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[11px] font-bold text-black">
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowSampleExcelModal(false)}>
                                    <span className="text-blue-800 underline decoration-1">Q</span>: Quit
                                </span>
                            </div>
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowSampleExcelModal(false)}>
                                    <span className="text-blue-800 underline decoration-1 font-bold">A</span>: Accept
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Configuration Modal */}
            {showImportConfigModal && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[120px] bg-black/10" onClick={() => setShowImportConfigModal(false)}>
                    <div className="flex flex-col w-[700px] shadow-2xl border border-[#2d819b] font-sans relative bg-white" onClick={(e) => e.stopPropagation()}>
                        {/* Company Name Header bar */}
                        <div className="bg-[#dcecf5] text-black px-2 h-[22px] flex items-center justify-center border-b border-[#2d819b] relative">
                            <span className="text-[11px] font-bold">Solarica</span>
                            <div className="absolute right-0 top-0 h-full flex items-center border-l border-[#2d819b]">
                                <span className="w-6 h-full flex items-center justify-center cursor-pointer hover:bg-[#ff4d4d] hover:text-white pb-[2px]" onClick={() => setShowImportConfigModal(false)}>✕</span>
                            </div>
                        </div>

                        {/* Configuration Title */}
                        <div className="bg-white text-black pt-2 pb-1 text-[13px] font-bold text-center underline decoration-1 underline-offset-[3px] decoration-black/40">
                            Import Configuration
                        </div>

                        {/* Yellow Search/Input Area */}
                        <div className="mx-2 mb-2 p-[1px] border border-[#2d819b] bg-[#fff9c4]">
                            <div className="w-full h-[22px] flex items-center px-1 font-bold text-[13px] text-black">
                                .
                            </div>
                        </div>

                        {/* Date info in background */}
                        <div className="absolute right-2 top-[30px] text-gray-400 text-[11px] font-bold opacity-30">
                            For 1-Apr-25
                        </div>

                        {/* List of Configurations (Overlaying) */}
                        <div className="absolute top-[80px] left-[8px] w-[684px] bg-[#eaf4fa] border-[1.5px] border-[#2d819b] shadow-2xl flex flex-col font-sans text-[13px] z-[110]">
                            {/* Blue Header */}
                            <div className="bg-[#2d819b] text-white font-bold px-2 h-[22px] flex items-center justify-between">
                                <span>List of Configurations</span>
                                <span className="text-[11px] font-normal cursor-pointer hover:underline" onClick={() => setImportConfigShowMore(!importConfigShowMore)}>
                                    {importConfigShowMore ? 'Show Less' : 'Show More'}
                                </span>
                            </div>

                            {/* Configuration Items List */}
                            <div className="bg-[#eaf4fa] flex-1 overflow-y-auto max-h-[300px] custom-scrollbar p-1">
                                {/* General Group */}
                                <div className="mb-2">
                                    <div className="px-1 py-0.5 font-bold text-black border-b border-gray-300/50 mb-1">General</div>
                                    {[
                                        { label: 'Location of Import/Export Files', value: 'C:\\Program Files\\TallyPrime', showAlways: true },
                                        { label: 'Behaviour of Import when exceptions exist', value: 'Record Exceptions and Import', showAlways: true },
                                        { label: 'Overwrite voucher when a voucher with same GUID exists (for XML & JSON format)', value: 'No', showAlways: true },
                                        { label: 'Remove invalid characters, such as tabs, extra spaces, & so on (for Excel format)', value: 'Yes', showAlways: true },
                                        { label: 'Import batch size', value: '100', showAlways: importConfigShowMore },
                                        { label: 'Enable detailed log (tally.imp)', value: 'No', showAlways: importConfigShowMore },
                                    ].filter(item => item.showAlways).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-2 py-[1px] flex justify-between cursor-pointer group hover:bg-[#ffe599] ${selectedImportConfigItem === item.label ? 'bg-[#feba35] text-white font-bold' : ''}`}
                                            onMouseEnter={() => setSelectedImportConfigItem(item.label)}
                                        >
                                            <span className="text-black">{item.label}</span>
                                            <span className={`italic font-medium pr-1 ${selectedImportConfigItem === item.label ? 'text-white' : 'text-black'}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Banking Group */}
                                <div className="mb-2">
                                    <div className="px-1 py-0.5 font-bold text-black border-b border-gray-300/50 mb-1">Banking</div>
                                    {[
                                        { label: 'Folder Path for new Payment Reverse Files', value: 'C:\\Program Files\\TallyPrime', showAlways: true },
                                        { label: 'Folder Path for imported Payment Reverse Files', value: 'C:\\Program Files\\TallyPrime', showAlways: true },
                                    ].map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-2 py-[1px] flex justify-between cursor-pointer group hover:bg-[#ffe599] ${selectedImportConfigItem === item.label ? 'bg-[#feba35] text-white font-bold' : ''}`}
                                            onMouseEnter={() => setSelectedImportConfigItem(item.label)}
                                        >
                                            <span className="text-black">{item.label}</span>
                                            <span className={`italic font-medium pr-1 ${selectedImportConfigItem === item.label ? 'text-white' : 'text-black'}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Tally Navigation Bar */}
                        <div className="mt-[350px] bg-[#dcecf5] h-[26px] border-t border-[#2d819b]/40 flex items-center justify-between px-2 text-[11px] font-bold text-black">
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowImportConfigModal(false)}><span className="text-blue-800 underline decoration-1">Q</span>: Quit</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:bg-[#b0d0e0] px-2 py-0.5" onClick={() => setShowImportConfigModal(false)}><span className="text-blue-800 underline decoration-1 font-bold">A</span>: Accept</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Integrated Standard Tally Modals --- */}
            {showRepairCompanyModal && (
                <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[100px] bg-black/10" onClick={() => setShowRepairCompanyModal(false)}>
                    <div className="flex flex-col w-[600px] min-h-[500px] shadow-2xl border border-[#2d819b] font-sans relative bg-[#e8f6fa]" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white text-black px-2 py-1 text-[13px] font-bold text-center border-b border-[#2d819b] relative">
                            Repair Company
                            <span className="absolute right-2 top-0 cursor-pointer hover:text-red-300" onClick={() => setShowRepairCompanyModal(false)}>✕</span>
                        </div>
                        <div className="mx-4 my-2 border-b border-black text-center text-[13px] font-bold text-black py-1 bg-[#feba35]">
                            <input type="text" className="w-full bg-[#feba35] text-center font-bold outline-none placeholder-black/50" value={menuSearchQuery} onChange={(e) => setMenuSearchQuery(e.target.value)} placeholder="Select Company to Repair" autoFocus />
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold flex justify-between">
                                <span>List of Companies</span>
                                <span>Number</span>
                                <span>Period</span>
                            </div>
                            <div className="flex-1 bg-[#e8f6fa] overflow-y-auto font-mono text-[13px]">
                                <div className="px-2 py-0.5 font-bold">Data Path: C:\Users\Public\TallyPrime\data</div>
                                {((props as any).openCompanies || [{ name: 'Solarica', number: '10000', period: '1-Apr-25 to 31-Mar-26' }]).filter((c: any) => c.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map((comp: any, idx: number) => (
                                    <div key={idx} className="flex justify-between px-2 cursor-pointer hover:bg-[#dceef5]" onClick={() => { alert(`Repairing ${comp.name}...`); setShowRepairCompanyModal(false); }}>
                                        <div className="font-bold text-black">{comp.name}</div>
                                        <div>{comp.number}</div>
                                        <div>{comp.period}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Migrate Company Modal */}
            {showMigrateCompanyModal && (
                <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[100px] bg-black/10" onClick={() => setShowMigrateCompanyModal(false)}>
                    <div className="flex flex-col w-[600px] min-h-[500px] shadow-2xl border border-[#2d819b] font-sans relative bg-[#e8f6fa]" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#8ec7ff] text-black px-2 py-1 text-[13px] font-bold text-center border-b border-[#2d819b] relative">
                            Migrate Company
                            <span className="absolute right-2 top-0 cursor-pointer hover:text-red-300" onClick={() => setShowMigrateCompanyModal(false)}>✕</span>
                        </div>
                        <div className="mx-4 my-2 border-b border-black text-center text-[13px] font-bold text-black py-1 bg-[#feba35]">
                            <input type="text" className="w-full bg-[#feba35] text-center font-bold outline-none placeholder-black/50" value={menuSearchQuery} onChange={(e) => setMenuSearchQuery(e.target.value)} placeholder="Select Company to Migrate" autoFocus />
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold flex justify-between">
                                <span>List of Companies</span>
                            </div>
                            <div className="flex-1 bg-[#e8f6fa] overflow-y-auto font-mono text-[13px]">
                                <div className="px-2 py-0.5 font-bold">Data Path: C:\Users\Public\TallyPrime\data</div>
                                {((props as any).openCompanies || [{ name: 'Solarica', number: '10000', period: '1-Apr-25 to 31-Mar-26' }]).filter((c: any) => c.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map((comp: any, idx: number) => (
                                    <div key={idx} className="flex justify-between px-2 cursor-pointer hover:bg-[#dceef5]" onClick={() => { alert(`Migrating ${comp.name}...`); setShowMigrateCompanyModal(false); }}>
                                        <div className="font-bold text-black">{comp.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Configuration Modal */}
            {showDataConfigurationModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-transparent" onClick={() => setShowDataConfigurationModal(false)}>
                    <div className="bg-white p-2 shadow-2xl border border-[#2d819b] w-[700px] font-sans relative flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center font-bold text-[14px] border-b border-gray-300 mb-4 pb-1">Data Configuration</div>
                        <div className="px-4 text-[13px] font-bold text-black flex flex-col gap-2" onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const inputs = Array.from(e.currentTarget.querySelectorAll('input'));
                                const index = inputs.indexOf(e.target as HTMLInputElement);
                                if (index > -1 && index < inputs.length - 1) { inputs[index + 1].focus(); }
                                else { setShowDataConfigAccept(true); (e.target as HTMLElement).blur(); }
                            }
                            if (e.key === 'Escape') { e.stopPropagation(); if (showDataConfigAccept) setShowDataConfigAccept(false); else setShowDataConfigQuit(true); }
                        }}
                        >
                            <div className="font-bold text-[#1d5b6e] border-b border-gray-200">General</div>
                            <div className="flex"><label className="w-[350px]">Company Data Path</label><span className="mr-2">:</span><input type="text" defaultValue="C:\\Users\\Public\\TallyPrime\\data" className="flex-1 bg-[#feba35] px-1 outline-none" autoFocus /></div>
                            <div className="flex"><label className="w-[350px]">Backup Data Path</label><span className="mr-2">:</span><input type="text" defaultValue="TallyDrive" className="flex-1 bg-transparent px-1 outline-none focus:bg-[#ffe599]" /></div>
                        </div>
                        {showDataConfigAccept && (
                            <div className="absolute bottom-10 right-10 z-[160] bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                                <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Accept?</div>
                                <div className="flex justify-around">
                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white" onClick={() => { setShowDataConfigAccept(false); setShowDataConfigurationModal(false); }} autoFocus>Yes</button>
                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white" onClick={() => setShowDataConfigAccept(false)}>No</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Split Menu Modal */}
            {showSplitMenu && (
                <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[100px] bg-transparent" onClick={() => setShowSplitMenu(false)}>
                    <div className="bg-white border border-[#2d819b] shadow-xl w-[200px] flex flex-col font-sans text-[13px] relative" onClick={(e) => e.stopPropagation()} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Escape') setShowSplitMenu(false); }} autoFocus >
                        <div className="bg-[#2d819b] text-white px-2 py-1 font-bold flex justify-between items-center">
                            <span>Split</span>
                            <button className="text-white hover:bg-red-500 px-1 leading-none h-full" onClick={() => setShowSplitMenu(false)}>✕</button>
                        </div>
                        <div className="hover:bg-[#feba35] px-4 py-1 cursor-pointer" onClick={() => { alert('Verify Data'); setShowSplitMenu(false); }}>Verify Data</div>
                        <div className="hover:bg-[#feba35] px-4 py-1 cursor-pointer" onClick={() => { setShowSplitMenu(false); setShowBackupModal(true); }}>Split Data</div>
                    </div>
                </div>
            )}

            {/* Backup Modal */}
            {showBackupModal && (
                <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[100px] bg-black/10" onClick={() => setShowBackupModal(false)}>
                    <div className="bg-white p-4 shadow-2xl border border-[#2d819b] w-[400px] text-center font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-1 right-1 text-gray-400 hover:text-red-500 font-bold" onClick={() => setShowBackupModal(false)}>✕</button>
                        <div className="font-bold mb-4 text-[#1d5b6e]">Backup Companies on Disk</div>
                        <div className="italic text-gray-500 text-[12px]">Source: C:\\Users\\Public\\TallyPrime\\data</div>
                        <div className="italic text-gray-500 mb-4 text-[12px]">Destination: C:\\Users\\Public\\TallyPrime\\data\\Backup</div>
                        <div className="max-h-[300px] overflow-y-auto border border-gray-300 text-left">
                            {((props as any).openCompanies || [{ name: 'Solarica', number: '10000', period: '1-Apr-25 to 31-Mar-26' }]).map((c: any, i: number) => (
                                <div key={i} className="px-2 py-1 hover:bg-[#dceef5] cursor-pointer" onClick={() => { alert(`Backing up ${c.name}`); setShowBackupModal(false); }}>{c.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Restore Modal */}
            {showRestoreModal && (
                <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[100px] bg-black/10" onClick={() => setShowRestoreModal(false)}>
                    <div className="bg-white p-4 shadow-2xl border border-[#2d819b] w-[400px] text-center font-sans relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-1 right-1 text-gray-400 hover:text-red-500 font-bold" onClick={() => setShowRestoreModal(false)}>✕</button>
                        <div className="font-bold mb-4 text-[#1d5b6e]">Restore Companies from Disk</div>
                        <div className="italic text-gray-500 text-[12px]">Source: C:\\Users\\Public\\TallyPrime\\data\\Backup</div>
                        <div className="italic text-gray-500 mb-4 text-[12px]">Destination: C:\\Users\\Public\\TallyPrime\\data</div>
                        <div className="max-h-[300px] overflow-y-auto border border-gray-300 text-left p-4 italic text-gray-400">No backup files found.</div>
                    </div>
                </div>
            )}

            {/* About Modal */}
            {showEInvoicingModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10" onClick={() => setShowEInvoicingModal(false)}>
                    <div className="bg-white p-6 shadow-2xl border border-[#2d819b] w-[500px] text-center font-sans" onClick={(e) => e.stopPropagation()}>
                        <h2 className="font-bold text-[#1b5e6b] mb-4">Send for e-Invoicing</h2>
                        <p className="text-sm">This feature is available in the full version of TallyPrime.</p>
                        <button className="mt-4 bg-[#feba35] px-4 py-1 border border-black font-bold" onClick={() => setShowEInvoicingModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {showEWayBillModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10" onClick={() => setShowEWayBillModal(false)}>
                    <div className="bg-white p-6 shadow-2xl border border-[#2d819b] w-[500px] text-center font-sans" onClick={(e) => e.stopPropagation()}>
                        <h2 className="font-bold text-[#1b5e6b] mb-4">Send for e-Way Bill</h2>
                        <p className="text-sm">This feature is available in the full version of TallyPrime.</p>
                        <button className="mt-4 bg-[#feba35] px-4 py-1 border border-black font-bold" onClick={() => setShowEWayBillModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {showAboutPageModal && (
                <div className="fixed inset-0 z-[200] bg-white flex flex-col font-sans" onClick={() => setShowAboutPageModal(false)}>
                    <div className="bg-[#1b5e6b] text-white h-8 flex items-center justify-between px-4 font-bold" onClick={(e) => e.stopPropagation()}>
                        <span>About</span>
                        <button className="hover:bg-red-500 px-2" onClick={() => setShowAboutPageModal(false)}>✕</button>
                    </div>
                    <div className="flex-1 p-10 overflow-y-auto bg-white text-black" onClick={(e) => e.stopPropagation()}>
                        <h1 className="text-2xl font-bold mb-6 text-[#1b5e6b]">TallyPrime EDU</h1>
                        <div className="grid grid-cols-2 gap-10 max-w-4xl">
                            <div><h2 className="font-bold border-b border-gray-300 mb-2">Product Information</h2><p>Release: 4.1</p><p>Serial Number: Educational</p></div>
                            <div><h2 className="font-bold border-b border-gray-300 mb-2">System Information</h2><p>OS: Windows</p><p>RAM: 16 GB</p></div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default TallyHeader;
