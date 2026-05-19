import React, { useState, useEffect } from 'react';
import TallyHeader from './TallyHeader';
import TallyGroupAlteration from './TallyGroupAlteration';
import TallyGroupCreation from './TallyGroupCreation';
import TallyLedgerAlteration from './TallyLedgerAlteration';
import { PeriodModal, TallySelectionList as SharedTallySelectionList, otherMastersData, changeViewData, GenericModal } from '../TallyCommon/TallySidebarModals';
import TallySidebar, { SidebarButton } from '../TallyCommon/TallySidebar';
import TallyFooter, { FooterItem, FooterEmptyItem } from './TallyFooter';
import { FeatureRow } from './FeatureRow';
import { TallySelectionList } from './TallySelectionList';
import { groupData, type TallyItem } from './data';
import TallyLedgerView from '../TallyLedgerUI/TallyLedgerView';
import TallyCompanyCreation from './TallyCompanyCreation';
import TallyLedgerCreation from './TallyLedgerCreation';
import SalesDataDisplay from './SalesDataDisplay';

// Helper to flatten the tree for the list view
const flattenData = (items: TallyItem[], depth = 0): { item: TallyItem; depth: number }[] => {
    let flat: { item: TallyItem; depth: number }[] = [];
    items.forEach(item => {
        flat.push({ item, depth });
        if (item.children) {
            flat = flat.concat(flattenData(item.children, depth + 1));
        }
    });
    return flat;
};

interface TallyGroupViewProps {
    initialGroup?: string;
    onQuit?: () => void;
    mode?: 'list' | 'alter' | 'create';
    companyId: string;
    companyName: string;
    companies?: any[];
    onCompanyChange?: (id: string, name: string) => void;
}

const TallyGroupView = ({ initialGroup, onQuit, mode = 'list', companyId, companyName, companies, onCompanyChange }: TallyGroupViewProps) => {
    const flatList = flattenData(groupData);
    const [selectedIndex, setSelectedIndex] = useState<number>(() => {
        if (initialGroup) {
            const idx = flatList.findIndex(x => x.item.name === initialGroup);
            if (idx !== -1) return idx;
        }
        return flatList.findIndex(x => x.item.name === 'Suspense A/c');
    });
    const [viewMode, setViewMode] = useState<'list' | 'alter' | 'create' | 'createCompany' | 'features' | 'createGroupCompany' | 'gstDetails' | 'createLedger' | 'ledgerList'>(() => {
        if (mode === 'create') return 'create';
        return initialGroup ? 'alter' : 'list';
    });
    const [selectedGroup, setSelectedGroup] = useState<string>(initialGroup || '');
    const [showPeriodModal, setShowPeriodModal] = useState(false);
    const [periodFrom, setPeriodFrom] = useState('1-4-2025');
    const [periodTo, setPeriodTo] = useState('');
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [companyQuery, setCompanyQuery] = useState(companyName || 'Solarica');
    const [showOtherMastersModal, setShowOtherMastersModal] = useState(false);
    const [otherMastersQuery, setOtherMastersQuery] = useState('Groups');
    const [showExceptionReportsModal, setShowExceptionReportsModal] = useState(false);
    const [exceptionQuery, setExceptionQuery] = useState('');
    const [showSaveViewModal, setShowSaveViewModal] = useState(false);
    const [saveViewName, setSaveViewName] = useState('Chart of Accounts - My View');
    const [showConfiguration, setShowConfiguration] = useState('No');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterLookFor, setFilterLookFor] = useState('');
    const [showMultiMastersModal, setShowMultiMastersModal] = useState(false);
    const [multiMasterQuery, setMultiMasterQuery] = useState('');
    const [showMainF12Modal, setShowMainF12Modal] = useState(false);
    const [mainDisplayName, setMainDisplayName] = useState('Name Only');
    const [mainStripeView, setMainStripeView] = useState('No');
    const [showDisplayNameList, setShowDisplayNameList] = useState(false);
    const [showQuitModal, setShowQuitModal] = useState(false);
    const [removedLines, setRemovedLines] = useState<number[]>([]); // Store indices of removed lines
    const [showStateList, setShowStateList] = useState(false);
    const [createStateValue, setCreateStateValue] = useState('Not Applicable');
    const [createCompanyName, setCreateCompanyName] = useState('');
    const [createMailingName, setCreateMailingName] = useState('');
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [gstStateValue, setGstStateValue] = useState('Not Applicable');
    const [showGstStateList, setShowGstStateList] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showCreationConfiguration, setShowCreationConfiguration] = useState(false);

    const [createCountryValue, setCreateCountryValue] = useState('India');
    const [showCountryList, setShowCountryList] = useState(false);

    // Quit/Accept States for Specific Views
    const [showGstAccept, setShowGstAccept] = useState(false);
    const [showGstQuit, setShowGstQuit] = useState(false);
    const [showFeaturesAccept, setShowFeaturesAccept] = useState(false);
    const [showFeaturesQuit, setShowFeaturesQuit] = useState(false);
    const [showRepairQuit, setShowRepairQuit] = useState(false);
    const [showMigrateQuit, setShowMigrateQuit] = useState(false);
    const [showExchangeQuit, setShowExchangeQuit] = useState(false);

    // GST Details State
    const [registrationType, setRegistrationType] = useState('Regular');
    const [showRegistrationTypeList, setShowRegistrationTypeList] = useState(false);
    const [periodicity, setPeriodicity] = useState('Monthly');
    const [showPeriodicityList, setShowPeriodicityList] = useState(false);
    const [filingMode, setFilingMode] = useState('Not Applicable');
    const [showFilingModeList, setShowFilingModeList] = useState(false);

    const [showFeaturesModal, setShowFeaturesModal] = useState(false); // New state for overlay features
    const [showMoreDetailsModal, setShowMoreDetailsModal] = useState(false);
    const [moreDetailsQuery, setMoreDetailsQuery] = useState('');

    // Company Menu Modals
    const [showChangeCompanyModal, setShowChangeCompanyModal] = useState(false);
    const [showSelectCompanyModal, setShowSelectCompanyModal] = useState(false);
    const [showShutCompanyModal, setShowShutCompanyModal] = useState(false);
    const [showFeaturesListModal, setShowFeaturesListModal] = useState(false);
    const [showSecurityListModal, setShowSecurityListModal] = useState(false);
    const [showOnlineAccessListModal, setShowOnlineAccessListModal] = useState(false);
    const [showTallyVaultModal, setShowTallyVaultModal] = useState(false);
    const [showConnectErrorModal, setShowConnectErrorModal] = useState(false);

    // Sidebar State
    const [activeModal, setActiveModal] = useState<{ title: string, content: React.ReactNode } | null>(null);
    const [showSalesData, setShowSalesData] = useState(false);
    const groupSidebarButtons = [
        { keyName: 'F2', label: 'Period', onClick: () => setActiveModal({ title: 'Change Period', content: <PeriodModal /> }) },
        { keyName: 'F3', label: 'Company', onClick: () => setShowChangeCompanyModal(true) },
        { keyName: 'F4', label: '', disabled: true },
        { keyName: 'F5', label: 'Group View', onClick: () => setActiveModal({ title: 'Change View', content: <SharedTallySelectionList title="List of Views" items={changeViewData} /> }) },
        { keyName: 'F6', label: '', disabled: true },
        { keyName: 'F7', label: '', disabled: true },
        { keyName: 'F8', label: '', disabled: true },
        { keyName: 'F9', label: '', disabled: true },
        { keyName: 'F10', label: 'Other Masters', onClick: () => setActiveModal({ title: 'Select Other Masters', content: <SharedTallySelectionList title="List of Masters" items={otherMastersData} /> }) },
        { keyName: 'SPACER', label: 'SPACER' },
        { keyName: 'B', label: 'Basis of Values', onClick: () => setActiveModal({ title: 'Basis of Values', content: <div className="p-4">Include/Exclude Post-dated vouchers and other values.</div> }) },
        { keyName: 'H', label: 'Change View', onClick: () => setActiveModal({ title: 'Change View', content: <SharedTallySelectionList title="List of Views" items={changeViewData} /> }) },
        { keyName: 'J', label: 'Exception Reports', onClick: () => setActiveModal({ title: 'Exception Reports', content: <div className="p-4">Show Negative Ledgers, Overdue Receivables, etc.</div> }) },
        { keyName: 'L', label: 'Save View', onClick: () => setActiveModal({ title: 'Save View', content: <div className="p-4">Save the current report configuration.</div> }) },
        { keyName: 'SPACER', label: 'SPACER' },
        { keyName: 'F', label: 'Apply Filter', onClick: () => setActiveModal({ title: 'Apply Filter', content: <div className="p-4">Advanced filtering options.</div> }) },
        { keyName: 'F', label: 'Filter Details', disabled: true },
        { keyName: 'SPACER', label: 'SPACER' },
        { keyName: 'H', label: 'Multi-Masters', onClick: () => setActiveModal({ title: 'Multi-Master Creation', content: <div className="p-4">Create or Alter multiple masters at once.</div> }) },
        { keyName: 'SPACER', label: 'SPACER' },
        { keyName: 'F12', label: 'Configure', onClick: () => setShowDataConfigurationModal(true) },
    ];

    const [menuSearchQuery, setMenuSearchQuery] = useState('');
    const [currentCompany, setCurrentCompany] = useState(companyName || ''); // Global active company state


    const [selectCompanyHash, setSelectCompanyHash] = useState('Bhbvj'); // Highlighted item for Select modal
    const [companyToShut, setCompanyToShut] = useState('');
    const [showShutConfirmation, setShowShutConfirmation] = useState(false);
    const [showExportSampleConfig, setShowExportSampleConfig] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);


    // Configuration State
    const [confContactDetails, setConfContactDetails] = useState('Yes');
    const [confEditLog, setConfEditLog] = useState('No');
    const [confTallyVault, setConfTallyVault] = useState('No');
    const [confAccessControl, setConfAccessControl] = useState('No');
    const [confBaseCurrency, setConfBaseCurrency] = useState('No');

    // Features Configuration State
    const [featShowMore, setFeatShowMore] = useState('No');


    // Accounting
    const [featMaintainAccounts, setFeatMaintainAccounts] = useState('Yes');
    const [featBillWise, setFeatBillWise] = useState('Yes');
    const [featCostCentres, setFeatCostCentres] = useState('Yes');
    const [featInterestCalc, setFeatInterestCalc] = useState('Yes');

    // Inventory
    const [featMaintainInventory, setFeatMaintainInventory] = useState('Yes');
    const [featIntegrateInventory, setFeatIntegrateInventory] = useState('Yes');
    const [featPriceLevels, setFeatPriceLevels] = useState('Yes');
    const [featBatches, setFeatBatches] = useState('Yes');
    const [featExpiryDate, setFeatExpiryDate] = useState('Yes');
    const [featJobOrder, setFeatJobOrder] = useState('Yes');
    const [featCostTracking, setFeatCostTracking] = useState('Yes');
    const [featDiscountColumn, setFeatDiscountColumn] = useState('Yes');
    const [featActualBilled, setFeatActualBilled] = useState('Yes');

    // Taxation
    const [featGST, setFeatGST] = useState('Yes');
    const [featGSTDetails, setFeatGSTDetails] = useState('No');
    const [featTDS, setFeatTDS] = useState('Yes');
    const [featTCS, setFeatTCS] = useState('Yes');
    const [featVAT, setFeatVAT] = useState('Yes');
    const [featExcise, setFeatExcise] = useState('Yes');
    const [featServiceTax, setFeatServiceTax] = useState('Yes');

    // Online Access
    const [featBrowserAccess, setFeatBrowserAccess] = useState('Yes');

    // Payroll
    const [featMaintainPayroll, setFeatMaintainPayroll] = useState('Yes');

    // Others
    const [featMultiAddress, setFeatMultiAddress] = useState('Yes');
    const [featMarkModified, setFeatMarkModified] = useState('Yes');



    // Security Access Modal State
    const [showSecurityAccessModal, setShowSecurityAccessModal] = useState(false);
    const [securityControl, setSecurityControl] = useState('No');
    const [securityEmail, setSecurityEmail] = useState('');
    const [showSecurityAccept, setShowSecurityAccept] = useState(false);
    const [showSecurityQuit, setShowSecurityQuit] = useState(false);

    // Data Menu Modals State
    const [showBackupModal, setShowBackupModal] = useState(false);
    const [showSplitMenu, setShowSplitMenu] = useState(false); // Submenu or Modal
    const [showRepairCompanyModal, setShowRepairCompanyModal] = useState(false);
    const [showMigrateCompanyModal, setShowMigrateCompanyModal] = useState(false);
    const [showDataConfigurationModal, setShowDataConfigurationModal] = useState(false);
    const [showEInvoicingModal, setShowEInvoicingModal] = useState(false);
    const [showEWayBillModal, setShowEWayBillModal] = useState(false);
    const [showGetBalanceModal, setShowGetBalanceModal] = useState(false);

    const [showExchangeConfigModal, setShowExchangeConfigModal] = useState(false);
    const [showDataConfigAccept, setShowDataConfigAccept] = useState(false);

    const [showDataConfigQuit, setShowDataConfigQuit] = useState(false);

    const [showBackupRestoreMenu, setShowBackupRestoreMenu] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showRestoreAccept, setShowRestoreAccept] = useState(false);
    const [showRestoreQuit, setShowRestoreQuit] = useState(false);
    const [showBackupAccept, setShowBackupAccept] = useState(false);
    const [showBackupQuit, setShowBackupQuit] = useState(false);

    const [showSplitDataModal, setShowSplitDataModal] = useState(false);
    const [showSplitAccept, setShowSplitAccept] = useState(false);
    const [showSplitQuit, setShowSplitQuit] = useState(false);

    // GST Details State
    const [showGSTDetailsModal, setShowGSTDetailsModal] = useState(false);
    const [gstState, setGstState] = useState('Not Applicable');
    const [gstRegType, setGstRegType] = useState('Regular');
    const [gstAssessee, setGstAssessee] = useState('No');
    const [gstin, setGstin] = useState('');
    const [gstPeriodicity, setGstPeriodicity] = useState('Monthly');
    const [gstUsername, setGstUsername] = useState('');
    const [gstFilingMode, setGstFilingMode] = useState('Not Applicable');
    const [gstEInvoice, setGstEInvoice] = useState('No');
    const [gstEWayBill, setGstEWayBill] = useState('Yes');
    const [gstEWayBillDate, setGstEWayBillDate] = useState('1-Apr-25');
    const [gstEWayBillIntrastate, setGstEWayBillIntrastate] = useState('Yes');
    const [gstRegName, setGstRegName] = useState('');
    const [gstCreateAnother, setGstCreateAnother] = useState('No');

    // GST Dropdown visibility

    const [showGstRegTypeList, setShowGstRegTypeList] = useState(false);
    const [showGstPeriodicityList, setShowGstPeriodicityList] = useState(false);

    // Import Modals State
    const [showImportMastersModal, setShowImportMastersModal] = useState(false);
    const [showImportTransactionsModal, setShowImportTransactionsModal] = useState(false);
    const [showImportBankDetailsModal, setShowImportBankDetailsModal] = useState(false);
    const [showBankImportFileList, setShowBankImportFileList] = useState(false);
    const [importFileFormat, setImportFileFormat] = useState('Excel (Spreadsheet)');
    const [showImportFileFormatList, setShowImportFileFormatList] = useState(false);
    const [importFilePath, setImportFilePath] = useState('C:\\Program Files\\TallyPrime');
    const [importFileName, setImportFileName] = useState('');
    const [importBackup, setImportBackup] = useState('Yes');
    const [importBackupPath, setImportBackupPath] = useState('TallyDrive');
    const [importPassword, setImportPassword] = useState('No');
    const [showImportAccept, setShowImportAccept] = useState(false);
    const [showGstFilingModeList, setShowGstFilingModeList] = useState(false);
    const [showImportBankDetailsAccept, setShowImportBankDetailsAccept] = useState(false);
    const [showImportBankDetailsQuit, setShowImportBankDetailsQuit] = useState(false);
    const [importBankLedger, setImportBankLedger] = useState('');
    const [showBankLedgerList, setShowBankLedgerList] = useState(false);
    const [importFileType, setImportFileType] = useState('All');
    const [importShowPreview, setImportShowPreview] = useState('Yes');

    // Import GST Returns State
    const [showImportGSTReturnsModal, setShowImportGSTReturnsModal] = useState(false);
    const [gstRegistration, setGstRegistration] = useState('Maharashtra Registration');
    const [showGSTRegistrationList, setShowGSTRegistrationList] = useState(false);
    const [importReturnPath, setImportReturnPath] = useState('C:\\Program Files\\TallyPrime');
    const [importReturnFile, setImportReturnFile] = useState('');
    const [showGSTReturnError, setShowGSTReturnError] = useState(false);

    // Export Sample Excel File State
    const [showExportSampleMastersModal, setShowExportSampleMastersModal] = useState(false);
    const [showExportSampleTransactionsModal, setShowExportSampleTransactionsModal] = useState(false);
    const [showExportCurrentModal, setShowExportCurrentModal] = useState(false);
    const [exportCurrentIncludeDependent, setExportCurrentIncludeDependent] = useState('No');
    const [exportCurrentFormat, setExportCurrentFormat] = useState('XML (Data Interchange)');
    const [exportCurrentTo, setExportCurrentTo] = useState('Local drive');
    const [exportCurrentPath, setExportCurrentPath] = useState('C:\\Program Files\\TallyPrime');
    const [exportCurrentFileName, setExportCurrentFileName] = useState('Master.xml');
    const [exportCurrentStripeView, setExportCurrentStripeView] = useState('No');

    // Mapping Template Creation State
    const [showMappingTemplateCreationModal, setShowMappingTemplateCreationModal] = useState(false);
    const [mappingFilePath, setMappingFilePath] = useState('C:\\Program Files\\TallyPrime');
    const [mappingFileToImport, setMappingFileToImport] = useState('');
    const [mappingWorksheetName, setMappingWorksheetName] = useState('');
    const [showMappingFileList, setShowMappingFileList] = useState(false);

    // File List Advanced States
    const [showSpecifyPathModal, setShowSpecifyPathModal] = useState(false);
    const [tempPath, setTempPath] = useState('');
    const [fileListMode, setFileListMode] = useState<'default' | 'drives' | 'all'>('default');

    // Export Sample File Modal State
    const [showExportSampleFileModal, setShowExportSampleFileModal] = useState(false);
    const [exportSampleFileName, setExportSampleFileName] = useState('');

    // MSME Details State
    const [showMSMEModal, setShowMSMEModal] = useState(false);
    const [msmeType, setMsmeType] = useState('Not Applicable');
    const [msmeUdyamNo, setMsmeUdyamNo] = useState('');
    const [msmeActivityType, setMsmeActivityType] = useState('');
    const [showMsmeTypeList, setShowMsmeTypeList] = useState(false);

    // PAN Details State
    const [showPANModal, setShowPANModal] = useState(false);
    const [panNo, setPanNo] = useState('');
    const [cinNo, setCinNo] = useState('');

    // Help Menu Modals State
    const [showTDLManagementModal, setShowTDLManagementModal] = useState(false);
    const [showAboutPageModal, setShowAboutPageModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Print Menu Modals State
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showPrintCopies, setShowPrintCopies] = useState(false);
    const [showPrinterSelect, setShowPrinterSelect] = useState(false);
    const [showTitleConfig, setShowTitleConfig] = useState(false);
    const [printCopies, setPrintCopies] = useState('1');
    const [printTitle, setPrintTitle] = useState('List of Groups');
    const [printSubtitle, setPrintSubtitle] = useState('');
    const [selectedPrinter, setSelectedPrinter] = useState('Microsoft Print to PDF');
    const [showPrintFormat, setShowPrintFormat] = useState(false);
    const [printFormat, setPrintFormat] = useState('Neat Mode');
    const [showPagesToPrint, setShowPagesToPrint] = useState(false);
    const [pageStart, setPageStart] = useState('1');
    const [pageRange, setPageRange] = useState('');

    // Print Report Modal State (Others)
    const [showPrintReportModal, setShowPrintReportModal] = useState(false);
    const [printReportQuery, setPrintReportQuery] = useState('');
    const [printReportExpanded, setPrintReportExpanded] = useState(false);
    const [printReportShowMore, setPrintReportShowMore] = useState(false);
    const [printReportShowInactive, setPrintReportShowInactive] = useState(false);

    // Print Configuration Modal
    const [showPrintConfigModal, setShowPrintConfigModal] = useState(false);
    const [printConfigSettings, setPrintConfigSettings] = useState({
        printer: 'Microsoft Print to PDF',
        previewDefault: false,
        stripeView: false,
        topMargin: '0.50',
        dateRange: true,
        dateTimeReports: false,
        dateTimeVoucher: false,
        companyLogo: false,
        companyName: true,
        companyAddress: true,
        phoneNo: false,
        countryCode: false,
        // Hidden options
        printState: false,
        printCountry: false
    });
    const [printConfigShowMore, setPrintConfigShowMore] = useState(false);
    const [printConfigQuery, setPrintConfigQuery] = useState('');

    const togglePrintConfig = (key: keyof typeof printConfigSettings) => {
        setPrintConfigSettings(prev => ({
            ...prev,
            [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key]
        }));
    };

    // Credit Days State
    const [showCreditDaysModal, setShowCreditDaysModal] = useState(false);
    const [creditDaysAgreement, setCreditDaysAgreement] = useState('45');
    const [creditDaysNoAgreement, setCreditDaysNoAgreement] = useState('15');

    // Payroll Statutory Details State
    const [showPayrollModal, setShowPayrollModal] = useState(false);

    // Provident Fund
    const [pfCompanyCode, setPfCompanyCode] = useState('');
    const [pfGroupCode, setPfGroupCode] = useState('');
    const [pfSecurityCode, setPfSecurityCode] = useState('');

    // ESI
    const [esiCompanyCode, setEsiCompanyCode] = useState('');
    const [esiBranchOffice, setEsiBranchOffice] = useState('');
    const [esiWorkingDays, setEsiWorkingDays] = useState('');

    // NPS
    const [npsCorpRegNo, setNpsCorpRegNo] = useState('');
    const [npsBranchNo, setNpsBranchNo] = useState('');

    // Income Tax
    const [itTan, setItTan] = useState('');
    const [itTanRegNo, setItTanRegNo] = useState('');
    const [itCircle, setItCircle] = useState('');
    const [itDeductorType, setItDeductorType] = useState('Government');
    const [itDeductorBranch, setItDeductorBranch] = useState('');
    const [itRespPerson, setItRespPerson] = useState('');
    const [itFatherName, setItFatherName] = useState('');
    const [itDesignation, setItDesignation] = useState('');
    const [itPan, setItPan] = useState('');


    const countryList = [
        "Not Applicable", "Bangladesh", "Bhutan", "Botswana", "Egypt", "Ghana", "Hong Kong", "India",
        "Indonesia", "Kenya", "Kingdom of Bahrain", "Kuwait", "Liberia", "Malawi", "Malaysia", "Myanmar (Burma)",
        "Nepal", "Nigeria", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "South Africa", "Sri Lanka",
        "Sultanate of Oman", "Tanzania", "Thailand", "UAE", "Uganda", "UK", "United States of America", "Zambia"
    ];

    const stateList = [
        "Not Applicable", "Andaman & Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
        "Bihar", "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Goa",
        "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala",
        "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana"
    ];

    const registrationTypeList = ["Regular", "Composition", "Regular - SEZ"];
    const periodicityList = ["Monthly", "Quarterly"];
    const filingModeList = ["Not Applicable", "DSC"];

    const [openCompanies, setOpenCompanies] = useState<{ name: string, number: string, period: string }[]>([]);

    const [diskCompanies, setDiskCompanies] = useState<{ name: string, number: string, period: string }[]>([]);

    // Helper to handle Enter key navigation in forms
    const handleEnterNav = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.stopPropagation();
            // Don't move if it's a button, let the click happen (or assume simple form inputs)
            if ((e.target as HTMLElement).tagName === 'BUTTON') return;

            const formElements = Array.from(e.currentTarget.querySelectorAll('input, select, textarea')) as HTMLElement[];
            const activeElement = document.activeElement as HTMLElement;
            const index = formElements.indexOf(activeElement);
            if (index > -1 && index < formElements.length - 1) {
                formElements[index + 1].focus();
            }
        }
    };
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if input is focused (except F-keys usually, but mostly avoid conflict)
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === 'q' || e.key === 'Q') {
                if (onQuit) {
                    onQuit();
                } else {
                    setShowQuitModal(true);
                }
            }
            if (e.key === 'Enter') {
                handleRowDoubleClick(selectedIndex);
            }
            // Space to select (noop or move down? Tally toggle selection? For now simple selection is active)

            if (e.key === 'c' || e.key === 'C') {
                handleCreate();
            }
            if (e.key === 'd' || e.key === 'D') {
                handleDelete();
            }
            if (e.key === 'r' || e.key === 'R') {
                handleRemoveLine();
            }
            if (e.key === 'u' || e.key === 'U') {
                handleRestoreLine();
            }
            if (e.key === 'F12') {
                e.preventDefault();
                if (viewMode === 'createCompany' || viewMode === 'createGroupCompany') {
                    setShowCreationConfiguration(true);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, flatList]); // Dependencies for actions

    // Actions
    const handleCreate = () => {
        setSelectedGroup(''); // Empty for create
        setViewMode('alter');
    };

    const handleDelete = () => {
        // Mock deletion - typically shows confirmation
        if (confirm(`Delete ${flatList[selectedIndex].item.name}?`)) {
            alert('Delete functionality would trigger here.');
        }
    };

    const handleRemoveLine = () => {
        setRemovedLines(prev => [...prev, selectedIndex]);
        // Move selection down
        if (selectedIndex < flatList.length - 1) setSelectedIndex(prev => prev + 1);
    };

    const handleRestoreLine = () => {
        setRemovedLines([]); // Restore all or pop last? Tally restores last removed usually.
        // Simple implementation: Restore all or just one? Let's pop.
        setRemovedLines(prev => prev.slice(0, -1));
    };

    const handleQuit = () => {
        if (onQuit) {
            onQuit();
        } else {
            setShowQuitModal(true);
        }
    };
    const handleRowDoubleClick = (index: number) => {
        setSelectedIndex(index);
        const item = flatList[index].item;
        setSelectedGroup(item.name);
        setViewMode('alter');
    };

    const handleAccept = () => {
        if (!createCompanyName.trim()) {
            setShowErrorModal(true);
        } else {
            setShowAcceptModal(true);
        }
    };

    const handleMenuOptionClick = (menu: string, item: string) => {
        if (menu === 'Company') {
            if (item === 'Create') setViewMode('createCompany');
            if (item === 'Change') setShowChangeCompanyModal(true);
            if (item === 'Select') setShowSelectCompanyModal(true);
            if (item === 'Shut') setShowShutCompanyModal(true);
            if (item === 'Features') setShowFeaturesListModal(true);
            if (item === 'Security') setShowSecurityListModal(true);
            if (item === 'TallyVault') setShowTallyVaultModal(true);
            if (item === 'Online Access') setShowOnlineAccessListModal(true);
            if (item === 'Connect') setShowConnectErrorModal(true);
            if (item === 'Remote Access') {
                window.open("https://tallysolutions.com/website/html/tally_login.html?destination_url=https%3A%2F%2Fcustomer.tallysolutions.com%2Fcustomerapp%2Fremote-access%2Fremote-sessions%3Fserial%3D%26admin%3D", "_blank");
            }
            if (item === 'Browser Access') {
                window.open("https://tallysolutions.com/website/html/tally_login.html?destination_url=https%3A%2F%2Fcustomer.tallysolutions.com%2Fcustomerapp%2Freports%2Fonline-user-management%3Fserial%3D%26admin%3D", "_blank");
            }
        }
        if (menu === 'Data') {
            if (item === 'Backup') setShowBackupModal(true);
            if (item === 'Restore') setShowRestoreModal(true);
            if (item === 'SplitData') setShowSplitDataModal(true);
            if (item === 'VerifyData') console.log('Verify Data');
            if (item === 'Repair') setShowRepairCompanyModal(true);
            if (item === 'Migrate') setShowMigrateCompanyModal(true);
            if (item === 'Configuration') setShowDataConfigurationModal(true);
        }
        if (menu === 'Exchange') {
            if (item === 'SendForEInvoicing') setShowEInvoicingModal(true);
            if (item === 'SendForEWayBill') setShowEWayBillModal(true);
            if (item === 'GetBalance') setShowGetBalanceModal(true);
            if (item === 'Configure') setShowExchangeConfigModal(true);
        }
        if (menu === 'Import') {
            if (item === 'Masters') setShowImportMastersModal(true);
            if (item === 'Transactions') setShowImportTransactionsModal(true);
            if (item === 'BankDetails') setShowImportBankDetailsModal(true);
            if (item === 'BankStatement') setShowImportBankDetailsModal(true);
            if (item === 'GSTReturns') setShowImportGSTReturnsModal(true);
            if (item === 'MappingTemplates_Create') setShowMappingTemplateCreationModal(true);
            if (item === 'SampleExcel_Masters') setShowExportSampleMastersModal(true);
            if (item === 'SampleExcel_Masters_Alter') setShowExportSampleMastersModal(true);
            if (item === 'SampleExcel_Transactions') setShowExportSampleTransactionsModal(true);
            if (item === 'Configuration') setShowImportFileFormatList(true);
        }
        if (menu === 'Export') {
            if (item === 'Current') setShowExportCurrentModal(true);
        }
        if (menu === 'Help') {
            if (item === 'TDLs') setShowTDLManagementModal(true);
            if (item === 'About') setShowAboutPageModal(true);
            if (item === 'Upgrade') setShowUpgradeModal(true);
        }
        if (menu === 'Print') {
            if (item === 'Current') {
                setShowPrintReportModal(false);
                setShowPrintConfigModal(false);
                setShowPrintModal(true);
            }
            if (item === 'Others') {
                setShowPrintModal(false);
                setShowPrintConfigModal(false);
                setShowPrintReportModal(true);
            }
            if (item === 'Configuration') {
                setShowPrintModal(false);
                setShowPrintReportModal(false);
                setShowPrintConfigModal(true);
            }
        }
    };

    if (viewMode === 'ledgerList') {
        return (
            <TallyLedgerView
                onQuit={() => setViewMode('list')}
                companyId={companyId}
                companyName={companyName}
                companies={companies}
                onCompanyChange={onCompanyChange}
            />
        );
    }

    if (viewMode === 'create') {
        return (
            <div className="flex flex-col h-screen w-full bg-white text-black overflow-hidden font-sans">
                <TallyHeader onMenuOptionClick={handleMenuOptionClick} />
                <GenericModal activeModal={activeModal} onClose={() => setActiveModal(null)} />
                <div className="flex flex-1 overflow-hidden">
                    <TallyGroupCreation
                        onClose={() => {
                            if (onQuit) onQuit();
                            else setViewMode('list');
                        }}
                    />
                    <TallySidebar buttons={groupSidebarButtons} />
                </div>
            </div>
        );
    }

    if (viewMode === 'alter') {
        return (
            <div className="flex flex-col h-screen w-full bg-white text-black overflow-hidden font-sans">
                <TallyHeader onMenuOptionClick={handleMenuOptionClick} />
                <GenericModal activeModal={activeModal} onClose={() => setActiveModal(null)} />
                <div className="flex flex-1 overflow-hidden">
                    <TallyGroupAlteration
                        groupName={selectedGroup}
                        onClose={() => setViewMode('list')}
                    />
                </div>
            </div>
        );
    }

    if (viewMode === 'createCompany') {
        return (
            <TallyCompanyCreation
                onClose={() => setViewMode('list')}
                diskCompanies={diskCompanies}
                setDiskCompanies={setDiskCompanies}
                setOpenCompanies={setOpenCompanies}
                setCurrentCompany={setCurrentCompany}
                initialShowFeatures={showFeaturesModal}
            />
        );
    }

    if (viewMode === 'createGroupCompany') {
        return (
            <div className="flex flex-col h-screen w-full bg-white text-black overflow-hidden font-sans">
                <TallyHeader
                    onMenuOptionClick={handleMenuOptionClick}
                    isCreateMode={true}
                />

                {/* Group Company Creation Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Main Form Area */}
                    <div className="flex flex-col flex-1 bg-white relative">
                        {/* Title Bar */}
                        <div className="flex justify-between items-center px-4 h-[22px] bg-[#dcecf5] border-b border-[#2d819b] text-black text-[13px] font-bold">
                            <span>Group Company Creation</span>
                            <span
                                className="cursor-pointer hover:text-red-500"
                                onClick={() => setViewMode('list')}
                            >✕</span>
                        </div>

                        {/* Form Content */}
                        <div
                            className="p-8 text-[13px] font-bold text-black flex-1 overflow-y-auto"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const form = e.currentTarget;
                                    const elements = Array.from(form.querySelectorAll('input, textarea')) as HTMLElement[];
                                    const index = elements.indexOf(e.target as HTMLElement);

                                    if ((e.target as HTMLInputElement).name === 'companyName' && !(e.target as HTMLInputElement).value.trim()) {
                                        return;
                                    }
                                    if ((e.target as HTMLInputElement).name === 'state') {
                                        setShowStateList(false);
                                    }
                                    if ((e.target as HTMLInputElement).name === 'country') {
                                        setShowCountryList(false);
                                    }

                                    if (index > -1 && index < elements.length - 1) {
                                        elements[index + 1].focus();
                                    } else if (index === elements.length - 1) {
                                        // On saving Group Company - logic can be similar to Create Company
                                        setShowAcceptModal(true);
                                        (e.target as HTMLElement).blur();
                                    }
                                }
                            }}
                        >
                            {/* Data Path */}
                            <div className="flex mb-4">
                                <label className="w-[150px]">Company Data Path</label>
                                <span className="mr-4">:</span>
                                <span className="font-normal">C:\Users\Public\TallyPrime\data</span>
                            </div>

                            {/* Company Name Section (No Financial Year on right for Group typically, or maybe yes, sticking to basic layout) */}
                            <div className="flex w-full">
                                <div className="flex flex-col">
                                    {/* Company Name */}
                                    <div className="flex mb-1 cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[150px]">Company Name</label>
                                        <span className="mr-4">:</span>
                                        <input
                                            name="companyName"
                                            type="text"
                                            value={createCompanyName}
                                            onChange={(e) => {
                                                setCreateCompanyName(e.target.value);
                                                setCreateMailingName(e.target.value);
                                            }}
                                            className="w-[300px] bg-transparent border-transparent focus:border-blue-400 outline-none focus:bg-[#ffe599] pl-1"
                                            autoFocus
                                        />
                                    </div>
                                    {/* Mailing Name */}
                                    <div className="flex mb-1 cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[150px]">Mailing Name</label>
                                        <span className="mr-4">:</span>
                                        <input
                                            name="mailingName"
                                            type="text"
                                            value={createMailingName}
                                            onChange={(e) => setCreateMailingName(e.target.value)}
                                            className="w-[300px] bg-transparent outline-none focus:bg-[#ffe599] pl-1"
                                        />
                                    </div>
                                    {/* Address */}
                                    <div className="flex mb-6 cursor-pointer" onClick={(e) => e.currentTarget.querySelector('textarea')?.focus()}>
                                        <label className="w-[150px]">Address</label>
                                        <span className="mr-4">:</span>
                                        <textarea className="w-[300px] h-[80px] bg-transparent outline-none resize-none focus:bg-[#ffe599] pl-1"></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* State */}
                            <div className="flex mb-1 relative cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                <label className="w-[150px]">State</label>
                                <span className="mr-4">:</span>
                                <input
                                    name="state"
                                    type="text"
                                    value={createStateValue}
                                    onChange={(e) => setCreateStateValue(e.target.value)}
                                    // onFocus={() => setShowStateList(true)} // Can enable state list if needed
                                    className="w-[200px] bg-transparent outline-none focus:bg-[#ffe599] pl-1"
                                />
                            </div>

                            {/* Country */}
                            <div className="flex mb-1 cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                <label className="w-[150px]">Country</label>
                                <span className="mr-4">:</span>
                                <input
                                    name="country"
                                    type="text"
                                    value={createCountryValue}
                                    onChange={(e) => setCreateCountryValue(e.target.value)}
                                    onFocus={() => {
                                        setShowCountryList(true);
                                        setShowStateList(false);
                                    }}
                                    className="w-[200px] bg-transparent outline-none focus:bg-[#ffe599] pl-1"
                                />
                            </div>

                            {/* Pincode */}
                            <div className="flex mb-1 cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                <label className="w-[150px]">Pincode</label>
                                <span className="mr-4">:</span>
                                <input type="text" className="w-[100px] bg-transparent outline-none focus:bg-[#ffe599] pl-1" />
                            </div>

                            {/* Telephone */}
                            <div className="flex mb-1 cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                <label className="w-[150px]">Telephone</label>
                                <span className="mr-4">:</span>
                                <input type="text" className="w-[200px] bg-transparent outline-none focus:bg-[#ffe599] pl-1" />
                            </div>

                            {/* Mobile */}
                            <div className="flex mb-1 cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                <label className="w-[150px]">Mobile</label>
                                <span className="mr-4">:</span>
                                <div className="flex items-center">
                                    <span className="font-bold mr-2">+91 -</span>
                                    <input type="text" className="w-[200px] bg-transparent outline-none focus:bg-[#ffe599] pl-1" />
                                </div>
                            </div>

                            {/* Fax, Email, Website */}
                            <div className="flex mb-1 cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                <label className="w-[150px]">Fax</label>
                                <span className="mr-4">:</span>
                                <input type="text" className="w-[200px] bg-transparent outline-none focus:bg-[#ffe599] pl-1" />
                            </div>
                            <div className="flex mb-1 cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                <label className="w-[150px]">E-mail</label>
                                <span className="mr-4">:</span>
                                <input type="text" className="w-[300px] bg-transparent outline-none focus:bg-[#ffe599] pl-1" />
                            </div>
                            <div className="flex mb-4 cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                <label className="w-[150px]">Website</label>
                                <span className="mr-4">:</span>
                                <input type="text" className="w-[300px] bg-transparent outline-none focus:bg-[#ffe599] pl-1" />
                            </div>

                            {/* Members Companies - Specific to Group Company */}
                            <div className="flex mb-8 cursor-pointer" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                <label className="w-[150px]">Members companies</label>
                                <span className="mr-4">:</span>
                                <input type="text" className="w-[300px] bg-transparent outline-none focus:bg-[#ffe599] pl-1" />
                            </div>

                        </div>

                        {/* Accept Confirmation Modal (Reused) */}
                        {showAcceptModal && (
                            <div className="absolute bottom-10 right-10 z-[60] bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                                <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Accept?</div>
                                <div className="flex justify-around">
                                    <button
                                        className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                        onClick={() => {
                                            setShowAcceptModal(false);
                                            setViewMode('list');
                                        }}
                                        autoFocus
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                        onClick={() => setShowAcceptModal(false)}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        )}

                        {showErrorModal && (
                            <div className="absolute bottom-10 right-10 z-[70] bg-white border border-red-500 shadow-2xl w-[250px] font-sans animate-bounce" onClick={() => setShowErrorModal(false)}>
                                <div className="text-center border-b border-red-200 py-1">
                                    <span className="text-red-500 font-bold text-[13px]">Error</span>
                                </div>
                                <div className="p-4 text-center">
                                    <div className="font-bold text-black mb-2 text-[14px]">Oops!</div>
                                    <div className="text-[12px] text-black">
                                        <div>Unable to create Company.</div>
                                        <div>Specify a valid Company Name.</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Configuration Modal (Reused for Group Company) */}
                        {showCreationConfiguration && (
                            <div className="absolute inset-0 z-[80] flex items-center justify-center pointer-events-none">
                                <div className="bg-white p-6 shadow-2xl border border-gray-400 w-[700px] pointer-events-auto text-[13px] font-bold text-black font-sans relative" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-[14px]">Configuration</div>
                                        <div className="cursor-pointer text-gray-500 text-[16px] hover:text-red-500" onClick={() => setShowCreationConfiguration(false)}>✕</div>
                                    </div>
                                    <div className="border-t border-gray-300 mb-2"></div>

                                    <div className="space-y-0.5" onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const inputs = e.currentTarget.querySelectorAll('input');
                                            const index = Array.from(inputs).indexOf(e.target as HTMLInputElement);
                                            if (index > -1 && index < inputs.length - 1) {
                                                inputs[index + 1].focus();
                                            } else {
                                                setShowCreationConfiguration(false);
                                            }
                                        }
                                        if (e.key === 'Escape') setShowCreationConfiguration(false);
                                    }}>
                                        {[
                                            { label: 'Provide Contact Details', val: confContactDetails, set: setConfContactDetails },
                                            { label: 'Set Edit Log applicability', val: confEditLog, set: setConfEditLog },
                                            { label: 'Use TallyVault Password to encrypt Company Data', val: confTallyVault, set: setConfTallyVault },
                                            { label: 'Use User Access Control', val: confAccessControl, set: setConfAccessControl },
                                            { label: 'Provide Additional Base Currency details', val: confBaseCurrency, set: setConfBaseCurrency }
                                        ].map((field, i) => (
                                            <div key={i} className="flex justify-between items-center hover:bg-[#ffe599] focus-within:bg-[#ffe599] cursor-pointer px-2 py-0.5">
                                                <label className="flex-1">{field.label}</label>
                                                <div className="flex items-center w-[100px]">
                                                    <span className="mr-2">:</span>
                                                    <input
                                                        type="text"
                                                        value={field.val}
                                                        onChange={(e) => field.set(e.target.value)}
                                                        className="w-full bg-transparent outline-none font-bold"
                                                        autoFocus={i === 0}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <TallyFooter countInfo="">
                            <FooterItem keyName="Q" label="Quit" onClick={() => setViewMode('list')} />
                            <div className="flex-1"></div>
                            <FooterItem keyName="A" label="Accept" onClick={handleAccept} />
                            <div className="flex-1"></div>
                            <div className="flex-1"></div>
                            <FooterItem keyName="F12" label="Configure" icon="<" onClick={() => setShowCreationConfiguration(true)} />
                        </TallyFooter>

                    </div>

                    {/* List of Countries Popup (Group Company) */}
                    {showCountryList && (
                        <TallySelectionList
                            title="List of Countries"
                            items={countryList}
                            selectedItem={createCountryValue}
                            onSelect={(item) => {
                                setCreateCountryValue(item);
                                showCountryList && setShowCountryList(false);
                            }}
                            right="0"
                            top="100px"
                            height="400px"
                            addNewLabel="New Country"
                            showMoreLabel="Show More"
                        />
                    )}

                    {/* Right Sidebar */}
                    <TallySidebar buttons={[
                        { keyName: 'F2', label: ': Period', disabled: true },
                        { keyName: 'F3', label: ': Company', disabled: true },
                        { keyName: 'F4', label: '', disabled: true },
                        { keyName: 'F5', label: '', disabled: true },
                        { keyName: 'F6', label: '', disabled: true },
                        { keyName: 'F7', label: '', disabled: true },
                        { keyName: 'F8', label: '', disabled: true },
                        { keyName: 'F9', label: '', disabled: true },
                        { keyName: 'F10', label: '', disabled: true },
                        { label: 'SPACER' },
                        { keyName: 'R', label: 'Regular', onClick: () => setViewMode('createCompany') }
                    ]} />
                </div>
            </div>
        );
    }


    if (viewMode === 'createLedger') {
        return (
            <div className="flex flex-col h-screen w-full bg-white text-black overflow-hidden font-sans">
                <TallyHeader onMenuOptionClick={handleMenuOptionClick} />
                <TallyLedgerCreation
                    onClose={() => {
                        setViewMode('list');
                        setShowImportBankDetailsModal(true);
                    }}
                    companyId={companyId}
                    companyName={companyName}
                />
            </div>
        );
    }

    if (viewMode === 'gstDetails') {
        return (
            <div className="flex flex-col h-screen w-full bg-white text-black overflow-hidden font-sans">
                <TallyHeader />
                <div className="flex flex-1 overflow-hidden">
                    {/* Main Form Area */}
                    <div className="flex flex-col flex-1 bg-[#e8f6fa] relative">
                        {/* Title Bar */}
                        <div className="flex justify-between items-center px-4 h-[22px] bg-[#2d819b] text-white text-[13px] font-bold">
                            <span>GST Registration Creation</span>
                            <span>{createCompanyName || 'Elite'}</span>
                            <span className="cursor-pointer hover:text-red-500" onClick={() => { setViewMode('createCompany'); setShowFeaturesModal(true); }}>✕</span>
                        </div>

                        <div className="flex-1 p-8 text-[13px] font-bold text-black overflow-y-auto"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const form = e.currentTarget;
                                    const elements = Array.from(form.querySelectorAll('input, textarea')) as HTMLElement[];
                                    const index = elements.indexOf(e.target as HTMLElement);

                                    if ((e.target as HTMLInputElement).name === 'registrationType') {
                                        setShowRegistrationTypeList(false);
                                    }
                                    if ((e.target as HTMLInputElement).name === 'periodicity') {
                                        setShowPeriodicityList(false);
                                    }
                                    if ((e.target as HTMLInputElement).name === 'filingMode') {
                                        setShowFilingModeList(false);
                                    }

                                    if (index > -1 && index < elements.length - 1) {
                                        // Special Handling to close popups if open?
                                        e.preventDefault();
                                        elements[index + 1].focus();
                                    } else {
                                        // Last element
                                        setShowGstAccept(true);
                                        (e.target as HTMLElement).blur();
                                    }
                                }
                                if (e.key === 'Escape') {
                                    if (showGstAccept) {
                                        setShowGstAccept(false);
                                    } else {
                                        setShowGstQuit(true);
                                    }
                                }
                            }}
                        >
                            {/* Left Column */}
                            <div className="flex gap-8">
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="flex items-center h-[24px]">
                                        <label className="w-[200px]">Registration status</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <span className="font-bold">Active</span>
                                    </div>

                                    <div className="mt-4 mb-2 border-b border-gray-300 font-bold text-[#1b5e6b]">GST Registration Details</div>

                                    {/* State */}
                                    <div className="flex items-center relative h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">State</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={gstStateValue}
                                                onChange={(e) => setGstStateValue(e.target.value)}
                                                onFocus={() => {
                                                    setShowRegistrationTypeList(false);
                                                    setShowPeriodicityList(false);
                                                    setShowFilingModeList(false);
                                                    setShowGstStateList(true);
                                                }}
                                                className="w-[250px] bg-transparent border-transparent focus:border-blue-300 outline-none font-bold focus:bg-[#ffe599] px-1 pl-1"
                                                autoFocus
                                            />
                                            {showGstStateList && (
                                                <div className="absolute left-0 top-[24px] z-[60]">
                                                    <TallySelectionList
                                                        title="List of States"
                                                        items={stateList}
                                                        selectedItem={gstStateValue}
                                                        onSelect={(item) => {
                                                            setGstStateValue(item);
                                                            setShowGstStateList(false);
                                                        }}
                                                        left="0" top="0"
                                                        width="250px"
                                                        height="300px"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Registration Type */}
                                    <div className="flex items-center relative h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">Registration type</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <div className="relative">
                                            <input
                                                name="registrationType"
                                                type="text"
                                                value={registrationType}
                                                onChange={(e) => setRegistrationType(e.target.value)}
                                                onFocus={() => {
                                                    setShowGstStateList(false);
                                                    setShowPeriodicityList(false);
                                                    setShowFilingModeList(false);
                                                    setShowRegistrationTypeList(true);
                                                }}
                                                className="w-[150px] bg-transparent outline-none focus:bg-[#ffe599] font-bold pl-1 border-b border-transparent focus:border-blue-300"
                                            />
                                            {showRegistrationTypeList && (
                                                <div className="absolute left-0 top-[24px] z-[60]">
                                                    <TallySelectionList
                                                        title="Registration Types"
                                                        items={registrationTypeList}
                                                        selectedItem={registrationType}
                                                        onSelect={(item) => {
                                                            setRegistrationType(item);
                                                            setShowRegistrationTypeList(false);
                                                        }}
                                                        left="0" top="0"
                                                        width="200px"
                                                        height="auto"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">Assessee of Other Territory</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <input type="text" defaultValue="No" className="w-[150px] bg-transparent outline-none focus:bg-[#ffe599] font-bold pl-1 border-b border-transparent focus:border-blue-300" />
                                    </div>
                                    <div className="flex items-center h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">GSTIN/UIN</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <input type="text" className="w-[200px] bg-transparent outline-none focus:bg-[#ffe599] border-b border-transparent focus:border-blue-300 pl-1 font-bold" />
                                    </div>

                                    {/* Periodicity */}
                                    <div className="flex items-center relative h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">Periodicity of GSTR-1</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <div className="relative">
                                            <input
                                                name="periodicity"
                                                type="text"
                                                value={periodicity}
                                                onChange={(e) => setPeriodicity(e.target.value)}
                                                onFocus={() => {
                                                    setShowGstStateList(false);
                                                    setShowRegistrationTypeList(false);
                                                    setShowFilingModeList(false);
                                                    setShowPeriodicityList(true);
                                                }}
                                                className="w-[150px] bg-transparent outline-none focus:bg-[#ffe599] font-bold pl-1 border-b border-transparent focus:border-blue-300"
                                            />
                                            {showPeriodicityList && (
                                                <div className="absolute left-0 top-[24px] z-[60]">
                                                    <TallySelectionList
                                                        title="Periodicity"
                                                        items={periodicityList}
                                                        selectedItem={periodicity}
                                                        onSelect={(item) => {
                                                            setPeriodicity(item);
                                                            setShowPeriodicityList(false);
                                                        }}
                                                        left="0" top="0"
                                                        width="150px"
                                                        height="auto"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 mb-2 border-b border-gray-300 font-bold text-[#1b5e6b]">Connected GST Details</div>

                                    <div className="flex items-center h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">GST Username</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <input type="text" className="w-[200px] bg-transparent outline-none focus:bg-[#ffe599] border-b border-transparent focus:border-blue-300 pl-1 font-bold" />
                                    </div>

                                    {/* Filing Mode */}
                                    <div className="flex items-center relative h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">Mode of Filing</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <div className="relative">
                                            <input
                                                name="filingMode"
                                                type="text"
                                                value={filingMode}
                                                onChange={(e) => setFilingMode(e.target.value)}
                                                onFocus={() => {
                                                    setShowGstStateList(false);
                                                    setShowRegistrationTypeList(false);
                                                    setShowPeriodicityList(false);
                                                    setShowFilingModeList(true);
                                                }}
                                                className="w-[200px] bg-transparent outline-none focus:bg-[#ffe599] font-bold pl-1 border-b border-transparent focus:border-blue-300"
                                            />
                                            {showFilingModeList && (
                                                <div className="absolute left-0 top-[24px] z-[60]">
                                                    <TallySelectionList
                                                        title="Modes of Filing"
                                                        items={filingModeList}
                                                        selectedItem={filingMode}
                                                        onSelect={(item) => {
                                                            setFilingMode(item);
                                                            setShowFilingModeList(false);
                                                        }}
                                                        left="0" top="0"
                                                        width="200px"
                                                        height="auto"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 mb-2 border-b border-gray-300 font-bold text-[#1b5e6b]">e-Invoice Details</div>
                                    <div className="flex items-center h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">e-Invoicing applicable</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <input type="text" defaultValue="No" className="w-[50px] bg-transparent outline-none focus:bg-[#ffe599] font-bold pl-1 border-b border-transparent focus:border-blue-300" />
                                    </div>

                                    <div className="h-8"></div> {/* Spacer */}

                                    <div className="flex items-center h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">Registration Name</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <input name="registrationName" type="text" className="w-[250px] bg-transparent outline-none focus:bg-[#ffe599] border-b border-transparent focus:border-blue-300 pl-1 font-bold" />
                                    </div>
                                    <div className="flex items-center h-[24px]">
                                        <label className="w-[200px]">Create another GST Registration for the Company</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <span className="font-bold">No</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    {/* Right Column Content - e-way bill */}
                                    <div className="h-[24px]"></div>
                                    <div className="mt-4 mb-2 border-b border-gray-300 font-bold text-[#1b5e6b]">e-Way Bill Details</div>
                                    <div className="flex items-center h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">e-Way Bill applicable</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <input type="text" defaultValue="Yes" className="w-[50px] bg-transparent outline-none focus:bg-[#ffe599] font-bold pl-1 border-b border-transparent focus:border-blue-300" />
                                    </div>
                                    <div className="flex items-center h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">Applicable from</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <input type="text" defaultValue="1-Apr-25" className="w-[100px] bg-transparent outline-none focus:bg-[#ffe599] font-bold pl-1 border-b border-transparent focus:border-blue-300" />
                                    </div>
                                    <div className="flex items-center h-[24px]" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                                        <label className="w-[200px]">Applicable for intrastate</label>
                                        <span className="mr-2 font-bold">:</span>
                                        <input type="text" defaultValue="Yes" className="w-[50px] bg-transparent outline-none focus:bg-[#ffe599] font-bold pl-1 border-b border-transparent focus:border-blue-300" />
                                    </div>
                                </div>

                                {/* GST Accept Modal */}
                                {showGstAccept && (
                                    <div className="absolute bottom-10 right-10 z-[60] bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                                        <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Accept?</div>
                                        <div className="flex justify-around">
                                            <button
                                                className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                onClick={() => {
                                                    setShowGstAccept(false);
                                                    setViewMode('createCompany');
                                                    setShowFeaturesModal(true);
                                                }}
                                                autoFocus
                                            >
                                                Yes
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                onClick={() => setShowGstAccept(false)}
                                            >
                                                No
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* GST Quit Modal */}
                                {showGstQuit && (
                                    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/10">
                                        <div className="bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                                            <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Quit?</div>
                                            <div className="flex justify-around">
                                                <button
                                                    className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                    onClick={() => {
                                                        setShowGstQuit(false);
                                                        setViewMode('createCompany');
                                                        setShowFeaturesModal(true);
                                                    }}
                                                    autoFocus
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                    onClick={() => setShowGstQuit(false)}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div >



                    {/* More Details Modal (GST View) */}
                    {
                        showMoreDetailsModal && (
                            <div className="absolute inset-0 z-[90] flex flex-col font-sans">
                                {/* Standard Header */}
                                <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                    <span>More Details</span>
                                    <span className="absolute left-1/2 transform -translate-x-1/2">{createCompanyName || 'Company Creation'}</span>
                                    <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowMoreDetailsModal(false)}>✕</span>
                                </div>
                                <div className="flex-1 relative">
                                    <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                        <div className="w-[450px] shadow-2xl border border-[#2d819b] bg-[#e8f6fa] flex flex-col relative max-h-[500px]" onClick={(e) => e.stopPropagation()}>
                                            <div className="p-2 bg-white pb-0">
                                                <div className="font-bold text-[15px] text-center mb-1 text-black border-b border-black w-fit mx-auto leading-none">More Details</div>
                                                <div className="h-1"></div>
                                                <input
                                                    type="text"
                                                    value={moreDetailsQuery}
                                                    onChange={(e) => setMoreDetailsQuery(e.target.value)}
                                                    className="w-full bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-gray-400 mb-2"
                                                    autoFocus
                                                    onKeyDown={(e) => { if (e.key === 'Escape') setShowMoreDetailsModal(false); }}
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold flex justify-between items-center border-b border-[#bfdcf0]">
                                                <span>List of Company Details</span>
                                                <span className="text-[11px] cursor-pointer hover:text-yellow-300 font-normal">Show More</span>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-0 text-[13px] text-black h-[350px] bg-[#e8f6fa]">
                                                {[
                                                    {
                                                        title: "Statutory Details",
                                                        items: [
                                                            { label: "GST Registration", action: () => setShowMoreDetailsModal(false), highlight: true },
                                                            { label: "Company GST Details", sub: "<Value exists>", subColor: "text-gray-700", action: () => setShowMoreDetailsModal(false) }
                                                        ]
                                                    },
                                                    {
                                                        title: "Payroll Details",
                                                        items: [
                                                            { label: "Payroll Statutory Details", action: () => { setShowPayrollModal(true); setShowMoreDetailsModal(false); } }
                                                        ]
                                                    },
                                                    {
                                                        title: "General Details",
                                                        items: [
                                                            { label: "PAN/CIN Details", action: () => { setShowPANModal(true); setShowMoreDetailsModal(false); } },
                                                            { label: "MSME Registration Details", action: () => { setShowMSMEModal(true); setShowMoreDetailsModal(false); } },
                                                            { label: "Credit Days Allowed for Micro & Small Parties", sub: creditDaysAgreement, subColor: "text-black", action: () => { setShowCreditDaysModal(true); setShowMoreDetailsModal(false); } }
                                                        ]
                                                    }
                                                ].map((section: { title: string; items: { label: string; action: () => void; highlight?: boolean; sub?: string; subColor?: string }[] }, idx) => {
                                                    const filteredItems = section.items.filter(i => i.label.toLowerCase().includes(moreDetailsQuery.toLowerCase()));
                                                    if (filteredItems.length === 0) return null;
                                                    return (
                                                        <div key={idx}>
                                                            <div className="font-bold px-1 text-black mt-1">{section.title}</div>
                                                            <div className="pl-1">
                                                                {filteredItems.map((item, iIdx) => (
                                                                    <div
                                                                        key={iIdx}
                                                                        className={`flex justify-between px-2 py-[1px] cursor-pointer ${item.highlight ? 'bg-[#feba35]' : 'hover:bg-[#dceef5]'}`}
                                                                        onClick={item.action}
                                                                    >
                                                                        <span>{item.label}</span>
                                                                        {item.sub && <span className={`italic font-normal ${item.subColor || 'text-black'}`}>{item.sub}</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {/* Sidebar for GST View */}
                    <TallySidebar>
                        <SidebarButton keyName="F2" label=": Period" />
                        <SidebarButton keyName="F3" label=": Company" />
                        <SidebarButton keyName="F4" label="" disabled />
                        <SidebarButton keyName="F5" label="" disabled />
                        <SidebarButton keyName="F6" label="" disabled />
                        <SidebarButton keyName="F7" label="" disabled />
                        <SidebarButton keyName="F8" label="" disabled />
                        <SidebarButton keyName="F9" label="" disabled />
                        <SidebarButton keyName="F10" label="" disabled />
                        <div className="flex-1"></div>

                        {showImportBankDetailsModal ? (
                            <>
                                <div className="h-[1px] bg-[#99c7d6] w-full my-1"></div>
                                <SidebarButton keyName="L" label="Payee Sample file" onClick={() => {
                                    setExportSampleFileName('Ledger Bank Details.xlsx');
                                    setShowExportSampleFileModal(true);
                                }} />
                                <SidebarButton keyName="O" label="Emp. Sample file" onClick={() => {
                                    setExportSampleFileName('Employee Bank Details.xlsx');
                                    setShowExportSampleFileModal(true);
                                }} />
                            </>
                        ) : (
                            <SidebarButton keyName="I" label=": More Details" onClick={() => setShowMoreDetailsModal(v => !v)} />
                        )}
                    </TallySidebar>
                </div >
                <TallyFooter countInfo="">
                    <FooterItem keyName="Q" label="Quit" onClick={() => { setViewMode('createCompany'); setShowFeaturesModal(true); }} />
                    <div className="flex-1"></div>
                    <FooterItem keyName="A" label="Accept" onClick={() => { setViewMode('createCompany'); setShowFeaturesModal(true); }} />
                    <div className="flex-1"></div>
                    <FooterItem keyName="D" label="Delete" onClick={() => { }} />
                    <FooterItem keyName="F12" label="Configure" icon="<" onClick={() => { }} />
                </TallyFooter>
            </div >

        );
    }

    return (
        <div className="flex flex-col h-screen w-full bg-gradient-to-br from-[#f0f4f8] to-[#e6eaf0] text-gray-900 overflow-hidden font-sans">
            <div className="shadow-md z-20 relative">
                <TallyHeader
                    onMenuOptionClick={handleMenuOptionClick}
                    onToggleSalesData={() => setShowSalesData(!showSalesData)}
                    showSalesData={showSalesData}
                    onAction={(action) => action === 'quit' && handleQuit()}
                />
            </div>

            {/* Main Content Area (Includes List Header + List + Sidebar) */}
            <div className={`flex flex-1 overflow-hidden ${(!showSalesData && viewMode === 'list') ? 'mb-[52px]' : ''} relative z-10`}>
                {/* Left Section (Header + List) */}
                <div className="flex flex-col flex-1 border-r border-gray-300 bg-white/80 backdrop-blur-sm relative shadow-[4px_0_15px_rgba(0,0,0,0.05)]">

                    {showSalesData ? (
                        /* Sales Data View */
                        <SalesDataDisplay />
                    ) : (
                        <>
                            {/* Title Bar - Premium Gradient */}
                            <div className="flex justify-between items-center px-4 h-[32px] bg-gradient-to-r from-[#1a4b5c] to-[#2d819b] text-white text-[13px] font-bold select-none relative shadow-sm">
                                <span className="tracking-wide">{showFeaturesModal ? 'Company Features Alteration' : 'Chart of Accounts'}</span>
                                <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-yellow-100">{currentCompany}</div>
                                <div className="flex items-center absolute right-2 gap-2">
                                    <span className="text-[11px] opacity-80 hover:opacity-100 cursor-pointer">Help (F1)</span>
                                    <span
                                        className="text-[14px] cursor-pointer hover:text-red-300 transition-colors"
                                        onClick={handleQuit}
                                    >✕</span>
                                </div>
                            </div>


                            <div className="flex justify-between items-center px-4 min-h-[36px] bg-white border-b border-gray-200 font-bold text-[14px] shadow-sm z-10">
                                <span className="text-[#1d5b6e]">List of Groups</span>
                                <div className="font-bold text-[13px] flex items-center bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                    <span className="font-normal text-blue-900">For 1-Apr-25</span>
                                </div>
                            </div>

                            {/* Scrollable List - Premium Look */}
                            <div className="flex-1 overflow-y-auto pb-1 font-sans text-[14px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent" style={{ scrollbarWidth: 'thin' }}>
                                {flatList.map((entry, index) => {
                                    if (removedLines.includes(index)) return null;
                                    const isSelected = index === selectedIndex;
                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-center px-4 cursor-pointer py-1 transition-all duration-75 border-b border-transparent ${isSelected
                                                ? 'bg-gradient-to-r from-[#fec107] to-[#facf55] text-black font-bold shadow-[0_2px_4px_rgba(0,0,0,0.1)] z-10 scale-[1.002] border-l-4 border-l-[#1d5b6e]'
                                                : 'hover:bg-blue-50/80 border-l-4 border-l-transparent'
                                                }`}
                                            onClick={() => setSelectedIndex(index)}
                                            onDoubleClick={() => handleRowDoubleClick(index)}
                                            tabIndex={isSelected ? 0 : -1}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleRowDoubleClick(index);
                                                }
                                            }}
                                            ref={isSelected ? (el) => el?.focus() : null}
                                            style={{ paddingLeft: `${16 + entry.depth * 24}px` }}
                                        >
                                            <span className={`leading-snug block truncate ${entry.item.italic ? 'italic font-normal text-gray-700' : ''} ${entry.item.children ? 'font-bold text-gray-900' : 'text-gray-800'}`}>
                                                {entry.item.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Features Overlay Modal (Inside Left Section) */}
                    {showFeaturesModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col items-center justify-center bg-black/10">
                            {/* The "Modal" Box */}
                            <div
                                className="bg-white px-8 py-4 shadow-2xl border border-gray-400 w-[1000px] h-[550px] font-bold text-[13px] text-black flex flex-col relative overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowFeaturesModal(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none z-10"
                                >
                                    ✕
                                </button>

                                {/* Header Section */}
                                <div className="mb-2 border-b border-gray-300 pb-2">
                                    <div className="flex items-center">
                                        <div className="w-[200px] text-[14px]">Company: {currentCompany}</div>
                                    </div>
                                </div>

                                {/* Show More Features */}
                                <div className="flex flex-col mb-4 border-b border-gray-200 pb-2">
                                    <div
                                        className="flex items-center hover:bg-[#ffe599] focus:bg-[#ffe599] w-fit pr-2 outline-none cursor-pointer"
                                        tabIndex={0}
                                        onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                e.currentTarget.querySelector('input')?.focus();
                                            }
                                        }}
                                    >
                                        <label className="w-[200px] italic cursor-pointer">Show more features</label>
                                        <span className="mr-2">:</span>
                                        <input
                                            type="text"
                                            value={featShowMore}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                if (v.toLowerCase() === 'y') setFeatShowMore('Yes');
                                                else if (v.toLowerCase() === 'n') setFeatShowMore('No');
                                                else setFeatShowMore(v);
                                            }}
                                            className="w-[50px] bg-transparent outline-none focus:bg-[#ffe599] text-center cursor-pointer font-bold" />
                                    </div>
                                </div>

                                {/* Columns */}
                                <div className="flex gap-4 overflow-y-auto flex-1">
                                    {/* Left Column */}
                                    <div className="flex-1 min-w-[300px]">
                                        {/* Accounting Section */}
                                        <div className="mb-4">
                                            <div className="text-[14px] mb-2 font-bold text-[#1d5b6e]">Accounting</div>
                                            <div className="pl-1">
                                                <FeatureRow label="Maintain Accounts" val={featMaintainAccounts} set={setFeatMaintainAccounts} />
                                                <FeatureRow label="Enable Bill-wise entry" val={featBillWise} set={setFeatBillWise} />
                                                {featShowMore === 'Yes' && (
                                                    <>
                                                        <FeatureRow label="Enable Cost Centres" val={featCostCentres} set={setFeatCostCentres} />
                                                        <FeatureRow label="Enable Interest Calculation" val={featInterestCalc} set={setFeatInterestCalc} />
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Inventory Section */}
                                        <div className="mb-4">
                                            <div className="text-[14px] mb-2 font-bold text-[#1d5b6e]">Inventory</div>
                                            <div className="pl-1">
                                                <FeatureRow label="Maintain Inventory" val={featMaintainInventory} set={setFeatMaintainInventory} />
                                                <FeatureRow label="Integrate Accounts with Inventory" val={featIntegrateInventory} set={setFeatIntegrateInventory} />
                                                {featShowMore === 'Yes' && (
                                                    <>
                                                        <FeatureRow label="Enable multiple Price Levels" val={featPriceLevels} set={setFeatPriceLevels} />
                                                        <FeatureRow label="Enable Batches" val={featBatches} set={setFeatBatches} />
                                                        {featBatches === 'Yes' && (
                                                            <div className="pl-4">
                                                                <FeatureRow label="Maintain Expiry Date for Batches" val={featExpiryDate} set={setFeatExpiryDate} />
                                                            </div>
                                                        )}
                                                        <FeatureRow label="Enable Job Order Processing" val={featJobOrder} set={setFeatJobOrder} />
                                                        <FeatureRow label="Enable Cost Tracking" val={featCostTracking} set={setFeatCostTracking} />
                                                        <FeatureRow label="Use Discount column in invoices" val={featDiscountColumn} set={setFeatDiscountColumn} />
                                                        <FeatureRow label="Use separate Actual and Billed Quantity columns" val={featActualBilled} set={setFeatActualBilled} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-[1px] bg-gray-300"></div>

                                    {/* Right Column */}
                                    <div className="flex-1 min-w-[300px]">
                                        {/* Taxation */}
                                        <div className="mb-4">
                                            <div className="text-[14px] mb-2 font-bold text-[#1d5b6e]">Taxation</div>
                                            <div className="pl-1">
                                                <FeatureRow label="Enable Goods and Services Tax (GST)" val={featGST} set={setFeatGST} />
                                                {featGST === 'Yes' && (
                                                    <div className="pl-4">
                                                        <div className="flex justify-between items-center mb-1 cursor-pointer outline-none"
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'y') {
                                                                    e.preventDefault();
                                                                    setViewMode('gstDetails');
                                                                }
                                                            }}
                                                            onClick={() => setViewMode('gstDetails')}
                                                        >
                                                            <label className="flex-1 mr-2 cursor-pointer">Set/Alter Company GST Rate and Other Details</label>
                                                            <div className="flex items-center">
                                                                <span className="mr-2">:</span>
                                                                <input
                                                                    type="text"
                                                                    value="No"
                                                                    readOnly
                                                                    className="w-[60px] bg-transparent border border-transparent px-1 outline-none text-center focus:bg-[#ffe599] focus:border-[#2d819b] font-bold cursor-pointer" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <FeatureRow label="Enable Tax Deducted at Source (TDS)" val={featTDS} set={setFeatTDS} />
                                                {featShowMore === 'Yes' && (
                                                    <>
                                                        <FeatureRow label="Enable Tax Collected at Source (TCS)" val={featTCS} set={setFeatTCS} />
                                                        <FeatureRow label="Enable Value Added Tax (VAT)" val={featVAT} set={setFeatVAT} />
                                                        <FeatureRow label="Enable Excise" val={featExcise} set={setFeatExcise} />
                                                        <FeatureRow label="Enable Service Tax" val={featServiceTax} set={setFeatServiceTax} />
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Online Access */}
                                        {featShowMore === 'Yes' && (
                                            <div className="mb-4">
                                                <div className="text-[14px] mb-2 font-bold text-[#1d5b6e]">Online Access</div>
                                                <div className="pl-1">
                                                    <FeatureRow label="Enable Browser Access for Reports" val={featBrowserAccess} set={setFeatBrowserAccess} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Payroll */}
                                        {featShowMore === 'Yes' && (
                                            <div className="mb-4">
                                                <div className="text-[14px] mb-2 font-bold text-[#1d5b6e]">Payroll</div>
                                                <div className="pl-1">
                                                    <FeatureRow label="Maintain Payroll" val={featMaintainPayroll} set={setFeatMaintainPayroll} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Others */}
                                        {featShowMore === 'Yes' && (
                                            <div className="mb-4">
                                                <div className="text-[14px] mb-2 font-bold text-[#1d5b6e]">Others</div>
                                                <div className="pl-1">
                                                    <FeatureRow label="Enable multiple addresses" val={featMultiAddress} set={setFeatMultiAddress} />
                                                    <FeatureRow label="Mark modified vouchers" val={featMarkModified} set={setFeatMarkModified} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Send for e-Invoicing Overlay (Inside Left Section) */}
                    {showEInvoicingModal && (
                        <div className="absolute inset-0 z-[40] flex flex-col bg-white font-sans">
                            {/* Title Bar */}
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Send for e-Invoicing</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowEInvoicingModal(false)}>✕</span>
                            </div>

                            {/* Upper Info Row */}
                            <div className="flex justify-between items-center px-2 bg-white border-b border-[#ccc] text-[13px] font-bold text-black min-h-[28px]">
                                <span>Send for e-Invoicing</span>
                                <span>For 1-Apr-25</span>
                            </div>

                            {/* Table Header */}
                            <div className="flex bg-white border-b border-black text-[13px] font-bold text-black px-2 py-1">
                                <div className="w-[80px]">Date</div>
                                <div className="flex-1">Particulars</div>
                                <div className="w-[150px] text-center">GSTIN/UIN</div>
                                <div className="w-[100px] text-center">Vch Type</div>
                                <div className="w-[100px] text-center">Vch No.</div>
                                <div className="w-[120px] text-right">Invoice Amount</div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-white p-2 text-[13px] font-bold text-black overflow-y-auto">
                                <div className="mb-2">Pending (For Generation - 0; For Cancellation - 0)</div>
                            </div>

                            {/* Bottom Actions */}
                            <div className="p-4 flex justify-center gap-20 bg-white">
                                <button className="border border-[#2d819b] px-4 py-1 text-[#2d819b] font-bold title-button text-[13px] bg-white hover:bg-[#dceef5]">
                                    <span className="text-[#2d819b]"><span className="text-[#1d5b6e]">X:</span> Export (Offline)</span>
                                </button>
                                <button className="border border-[#2d819b] px-4 py-1 text-[#2d819b] font-bold title-button text-[13px] bg-white hover:bg-[#dceef5]">
                                    <span className="text-[#2d819b]"><span className="text-[#1d5b6e]">S:</span> Send (Online)</span>
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Send for e-Way Bill Overlay (Inside Left Section) */}
                    {showEWayBillModal && (
                        <div className="absolute inset-0 z-[40] flex flex-col bg-white font-sans">
                            {/* Title Bar */}
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Send for e-Way Bill</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowEWayBillModal(false)}>✕</span>
                            </div>

                            {/* Upper Info Row */}
                            <div className="flex justify-between items-center px-2 bg-white border-b border-[#ccc] text-[13px] font-bold text-black min-h-[28px]">
                                <span>Send for e-Way Bill</span>
                                <span>For 1-Apr-25</span>
                            </div>

                            {/* Table Header */}
                            <div className="flex bg-white border-b border-black text-[13px] font-bold text-black px-2 py-1">
                                <div className="w-[100px]">Date</div>
                                <div className="flex-1">Particulars</div>
                                <div className="w-[150px]">GSTIN/UIN</div>
                                <div className="w-[100px]">Vch Type</div>
                                <div className="w-[100px]">Vch No.</div>
                                <div className="w-[120px] text-right">Invoice Amount</div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-white p-2 text-[13px] font-bold text-black overflow-y-auto">
                                <div className="mb-2">Pending (For IRN Generation - 0; For e-Way Bill Generation - 0; For e-Way Bill Cancellation - 0)</div>
                            </div>

                            {/* Bottom Actions */}
                            <div className="p-4 flex justify-center gap-20 bg-white">
                                <button className="border border-[#2d819b] px-4 py-1 text-[#2d819b] font-bold title-button text-[13px] bg-white hover:bg-[#dceef5]">
                                    <span className="text-[#2d819b]"><span className="text-[#1d5b6e]">X:</span> Export (Offline)</span>
                                </button>
                                <button className="border border-[#2d819b] px-4 py-1 text-[#2d819b] font-bold title-button text-[13px] bg-white hover:bg-[#dceef5]">
                                    <span className="text-[#2d819b]"><span className="text-[#1d5b6e]">S:</span> Send (Online)</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Get Balance Overlay (Inside Left Section) */}
                    {showGetBalanceModal && (
                        <div className="absolute inset-0 z-[40] flex flex-col bg-white font-sans">
                            {/* Title Bar */}
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Get Balance</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowGetBalanceModal(false)}>✕</span>
                            </div>

                            {/* Upper Info Row */}
                            <div className="flex justify-between items-center px-2 bg-white border-b border-[#ccc] text-[13px] font-bold text-black min-h-[28px]">
                                <span>Get Balance</span>
                                <span></span>
                            </div>

                            {/* Table Header */}
                            <div className="flex bg-white border-b border-black text-[13px] font-bold text-black px-2 py-1">
                                <div className="flex-1">Bank Ledger</div>
                                <div className="w-[150px]">Account No.</div>
                                <div className="w-[150px] text-center">Available Balance<br />as per Bank</div>
                                <div className="w-[150px]">Last Updated On</div>
                                <div className="w-[100px]">Status</div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-white p-2 text-[13px] font-bold text-black overflow-y-auto">
                                {/* Empty content for now */}
                            </div>

                            {/* Bottom Actions */}
                            <div className="p-4 flex justify-center gap-20 bg-white">
                                <button className="border border-gray-300 text-gray-400 px-4 py-1 text-[13px] cursor-not-allowed font-bold">B: Get Balance</button>
                            </div>
                        </div>
                    )}


                    {/* Import Masters / Transactions Overlay */}
                    {(showImportMastersModal || showImportTransactionsModal) && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans">
                            {/* Title Bar */}
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Import Data</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => {
                                    setShowImportMastersModal(false);
                                    setShowImportTransactionsModal(false);
                                }}>✕</span>
                            </div>

                            {/* Content Area with Dimmed Background */}
                            <div className="flex-1 relative">
                                {/* Background Image/Placeholder (Optional - mimicking the list behind) */}
                                <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>

                                {/* Modal Centered */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10" onClick={() => {
                                    // Click outside to close? Tally usually requires Esc key.
                                    // setShowImportMastersModal(false);
                                    // setShowImportTransactionsModal(false);
                                }}>
                                    <div className="bg-white p-8 w-[800px] shadow-2xl border border-gray-300 font-bold text-[13px] text-black relative" onClick={(e) => e.stopPropagation()}>

                                        <div className="border-b border-gray-300 pb-1 mb-4">
                                            <span className="text-[14px]">{showImportMastersModal ? 'Import Masters' : 'Import Transactions'}</span>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center relative">
                                                <label className="w-[300px]">File Format</label>
                                                <span className="mr-2">:</span>
                                                <div className="relative flex-1">
                                                    <input
                                                        type="text"
                                                        value={importFileFormat}
                                                        readOnly
                                                        autoFocus
                                                        className="w-full bg-transparent px-1 outline-none hover:bg-[#ffe599] focus:bg-[#feba35]"
                                                        onClick={() => setShowImportFileFormatList(!showImportFileFormatList)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                setShowImportFileFormatList(!showImportFileFormatList);
                                                            }
                                                        }}
                                                    />
                                                    {showImportFileFormatList && (
                                                        <TallySelectionList
                                                            title="List of File Formats"
                                                            items={['Excel (Spreadsheet)', 'JSON (Data Exchange)', 'XML (Data Interchange)']}
                                                            selectedItem={importFileFormat}
                                                            onSelect={(item) => {
                                                                setImportFileFormat(item);
                                                                setShowImportFileFormatList(false);
                                                                // Focus next input
                                                                setTimeout(() => {
                                                                    const next = document.getElementById('importFilePathInput');
                                                                    if (next) next.focus();
                                                                }, 0);
                                                            }}
                                                            left="0"
                                                            top="24px"
                                                            width="250px"
                                                            height="auto"
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <label className="w-[300px]">File Path</label>
                                                <span className="mr-2">:</span>
                                                <input
                                                    id="importFilePathInput"
                                                    type="text"
                                                    value={importFilePath}
                                                    onChange={(e) => setImportFilePath(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('importFileNameInput')?.focus(); }}
                                                    className="flex-1 bg-transparent px-1 outline-none hover:bg-[#ffe599] focus:bg-[#feba35]" />
                                            </div>

                                            <div className="flex items-center">
                                                <label className="w-[300px]">File to Import</label>
                                                <span className="mr-2">:</span>
                                                <input
                                                    id="importFileNameInput"
                                                    type="text"
                                                    value={importFileName}
                                                    onChange={(e) => setImportFileName(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('importBackupInput')?.focus(); }}
                                                    className="flex-1 bg-transparent px-1 outline-none hover:bg-[#ffe599] focus:bg-[#feba35]" />
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <label className="w-[300px]">Backup Company Data before Import</label>
                                                <span className="mr-2">:</span>
                                                <input
                                                    id="importBackupInput"
                                                    type="text"
                                                    value={importBackup}
                                                    onChange={(e) => setImportBackup(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            if (importBackup === 'Yes') document.getElementById('importBackupPathInput')?.focus();
                                                            else document.getElementById('importPasswordInput')?.focus();
                                                        }
                                                    }}
                                                    className="flex-1 bg-transparent px-1 outline-none hover:bg-[#ffe599] focus:bg-[#feba35]" />
                                            </div>

                                            {importBackup === 'Yes' && (
                                                <div className="flex items-center pl-4">
                                                    <label className="w-[285px]">Backup Data Path</label>
                                                    <span className="mr-2">:</span>
                                                    <input
                                                        id="importBackupPathInput"
                                                        type="text"
                                                        value={importBackupPath}
                                                        onChange={(e) => setImportBackupPath(e.target.value)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('importPasswordInput')?.focus(); }}
                                                        className="flex-1 bg-transparent px-1 outline-none hover:bg-[#ffe599] focus:bg-[#feba35]" />
                                                </div>
                                            )}

                                            <div className="flex items-center pl-4">
                                                <label className="w-[285px]">{importBackup === 'Yes' ? 'Set Backup Password' : 'Set Password'}</label> {/* Tally logic? Image shows 'Set Backup Password' indented */}
                                                <span className="mr-2">:</span>
                                                <input
                                                    id="importPasswordInput"
                                                    type="password"
                                                    value={importPassword}
                                                    onChange={(e) => setImportPassword(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') setShowImportAccept(true);
                                                    }}
                                                    className="flex-1 bg-transparent px-1 outline-none hover:bg-[#ffe599] focus:bg-[#feba35]" />
                                            </div>

                                        </div>

                                        {/* Accept Import Modal */}
                                        {showImportAccept && (
                                            <div className="absolute inset-0 top-0 left-0 bg-transparent flex items-end justify-end p-10 z-[100]" onClick={(e) => e.stopPropagation()}>
                                                <div className="bg-[#dcecf5] border border-[#2d819b] shadow-xl p-4 w-[200px] text-center">
                                                    <div className="font-bold text-[#1d5b6e] mb-4">Import?</div>
                                                    <div className="flex justify-around">
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#1d5b6e] hover:text-white"
                                                            onClick={() => {
                                                                setShowImportAccept(false);
                                                                // Logic to perform Import
                                                                setShowImportMastersModal(false);
                                                                setShowImportTransactionsModal(false);
                                                            }} autoFocus>Yes</button>
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#1d5b6e] hover:text-white"
                                                            onClick={() => setShowImportAccept(false)}>No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Import Bank Details Modal */}
                    {showImportBankDetailsModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans">
                            {/* Title Bar - Using standard Overlay Header */}
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Importing of Payee/Employee Bank A/c Details</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowImportBankDetailsModal(false)}>✕</span>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 relative">
                                <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">

                                    {/* The Pop-up Box */}
                                    <div className="bg-white p-6 w-[800px] shadow-2xl border border-gray-400 font-bold text-[13px] text-black relative" onClick={(e) => e.stopPropagation()}>

                                        <div className="text-center font-bold text-[14px] mb-6">Import Bank Statement <span className="text-blue-500 rounded-full border border-blue-500 px-1 text-[10px]">i</span></div>

                                        <div className="grid grid-cols-[100px_10px_350px_40px_80px_10px_1fr] gap-y-2">
                                            {/* Bank Ledger */}
                                            <div className="text-[#1d5b6e]">Bank Ledger</div>
                                            <div className="text-black">:</div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={importBankLedger}
                                                    onChange={(e) => setImportBankLedger(e.target.value)}
                                                    className="w-full bg-[#feba35] px-1 outline-none font-bold text-black border border-transparent focus:border-blue-500"
                                                    onFocus={() => setShowBankLedgerList(true)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            setShowBankLedgerList(false);
                                                            document.getElementById('bankDetailsFileInput')?.focus();
                                                        }
                                                        if (e.key === 'ArrowDown') {
                                                            // Logic to navigate list would go here, for now just ensure list is open
                                                            setShowBankLedgerList(true);
                                                        }
                                                    }}
                                                    autoFocus
                                                />
                                                {showBankLedgerList && (
                                                    <div className="absolute left-0 top-[22px] w-[350px] bg-white border border-[#2d819b] shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-[80] font-sans">
                                                        <div className="bg-[#2d819b] text-white px-2 py-1 flex justify-between">
                                                            <span>List of Bank Ledgers</span>
                                                        </div>
                                                        <div className="bg-[#feba35] text-black px-2 py-1 flex justify-between text-[11px] font-normal border-b border-gray-300">
                                                            <span>Ledger Name</span>
                                                            <span>Account No.</span>
                                                        </div>
                                                        <div className="max-h-[150px] overflow-y-auto">
                                                            <div
                                                                className="px-2 py-1 hover:bg-[#feba35] cursor-pointer text-right text-blue-800 font-bold"
                                                                onClick={() => {
                                                                    // Handle Create logic
                                                                    setImportBankLedger('Create');
                                                                    setShowBankLedgerList(false);
                                                                    setViewMode('createLedger');
                                                                    setShowImportBankDetailsModal(false);
                                                                }}
                                                            >
                                                                Create
                                                            </div>
                                                            <div className="px-2 py-1 hover:bg-[#feba35] cursor-pointer flex justify-between"
                                                                onClick={() => {
                                                                    setImportBankLedger('HDFC Bank');
                                                                    setShowBankLedgerList(false);
                                                                }}>
                                                                <span>HDFC Bank</span>
                                                                <span>1234567890</span>
                                                            </div>
                                                            <div className="px-2 py-1 hover:bg-[#feba35] cursor-pointer flex justify-between"
                                                                onClick={() => {
                                                                    setImportBankLedger('Kotak Bank');
                                                                    setShowBankLedgerList(false);
                                                                }}>
                                                                <span>Kotak Bank</span>
                                                                <span>0987654321</span>
                                                            </div>
                                                            <div className="px-2 py-1 hover:bg-[#feba35] cursor-pointer flex justify-between"
                                                                onClick={() => {
                                                                    setImportBankLedger('SBI');
                                                                    setShowBankLedgerList(false);
                                                                }}>
                                                                <span>SBI</span>
                                                                <span>1122334455</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div></div>
                                            <div className="text-[#1d5b6e] italic">Account No.</div>
                                            <div className="text-black">:</div>
                                            <div></div>

                                            {/* File Path */}
                                            <div className="text-[#1d5b6e]">File Path</div>
                                            <div className="text-black">:</div>
                                            <div className="font-bold text-black">{importFilePath}</div>
                                            <div></div>
                                            <div className="text-[#1d5b6e]">File Type</div>
                                            <div className="text-black">:</div>
                                            <div className="font-bold text-black">{importFileType}</div>

                                            {/* File To Import */}
                                            <div className="text-[#1d5b6e]">File to Import</div>
                                            <div className="text-black">:</div>
                                            <div className="relative col-span-5">
                                                <input
                                                    id="bankDetailsFileInput"
                                                    type="text"
                                                    value={importFileName}
                                                    onChange={(e) => setImportFileName(e.target.value)}
                                                    className="w-[350px] bg-white border-b border-gray-400 focus:bg-[#feba35] px-1 outline-none font-bold text-black"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowBankImportFileList(true);
                                                    }}
                                                    onFocus={() => setShowBankImportFileList(true)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            if (importFileName) {
                                                                setShowBankImportFileList(false);
                                                                document.getElementById('showPreviewInput')?.focus();
                                                            }
                                                        }
                                                        if (e.key === 'Escape') {
                                                            if (showBankImportFileList) setShowBankImportFileList(false);
                                                            else if (showImportBankDetailsAccept) setShowImportBankDetailsAccept(false);
                                                            else setShowImportBankDetailsQuit(true);
                                                        }
                                                        if (e.key === 'ArrowDown') {
                                                            setShowBankImportFileList(true);
                                                        }
                                                    }}
                                                />

                                                {/* List of Files Dropdown */}
                                                {showBankImportFileList && (
                                                    <div className="absolute left-0 top-[24px] w-[500px] bg-white border border-[#2d819b] shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-[70] flex flex-col font-sans">
                                                        {/* Header */}
                                                        <div className="bg-[#2d819b] text-white flex justify-between items-start px-2 py-1">
                                                            <span className="font-bold pt-1">List of Files</span>
                                                            <div className="text-[11px] text-right font-normal leading-tight">
                                                                <div className="cursor-pointer hover:text-yellow-300" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setTempPath(importFilePath);
                                                                    setShowSpecifyPathModal(true);
                                                                }}>Specify Path</div>
                                                                <div className="cursor-pointer hover:text-yellow-300" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setFileListMode('drives');
                                                                }}>Select from Drive</div>
                                                                <div className="cursor-pointer hover:text-yellow-300" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setFileListMode((prev) => prev === 'all' ? 'default' : 'all');
                                                                }}>{fileListMode === 'all' ? 'Show Less' : 'Show More'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Current Path */}
                                                        {fileListMode !== 'drives' && (
                                                            <div className="bg-[#e8f6fa] border-b border-[#bfdcf0] px-2 py-1 font-bold text-black truncate">
                                                                {importFilePath}
                                                            </div>
                                                        )}
                                                        {fileListMode === 'drives' && (
                                                            <div className="bg-[#feba35] border-b border-[#bfdcf0] px-2 py-1 font-bold text-black truncate">
                                                                Primary
                                                            </div>
                                                        )}

                                                        {/* File/Folder List */}
                                                        <div className="max-h-[250px] overflow-y-auto bg-white text-black">
                                                            {fileListMode !== 'drives' && (
                                                                <div className="flex items-center px-2 py-[1px] hover:bg-[#dcecf5] cursor-pointer" onClick={() => {
                                                                    // Up one level logic - for now just mock or reset
                                                                }}>
                                                                    <span className="text-[11px] mr-1">♦</span>
                                                                    <span>Up</span>
                                                                </div>
                                                            )}

                                                            {/* Render Items based on Mode */}
                                                            {(() => {
                                                                let items: { name: string, type: string, indent?: boolean }[] = [];

                                                                if (fileListMode === 'drives') {
                                                                    items = [
                                                                        { name: 'C:\\', type: 'Drive' },
                                                                        { name: 'Desktop', type: 'Folder' },
                                                                        { name: 'Documents', type: 'Folder' },
                                                                        { name: 'Downloads', type: 'Folder' },
                                                                    ];
                                                                } else {
                                                                    items = [
                                                                        { name: 'appdata', type: 'Folder' },
                                                                        { name: 'capsules', type: 'Folder' },
                                                                        { name: 'config', type: 'Folder' },
                                                                    ];
                                                                    if (fileListMode === 'all') {
                                                                        items.push(
                                                                            { name: 'Setup.exe', type: 'File' },
                                                                            { name: 'tally.exe', type: 'File' },
                                                                            { name: 'tally.ini', type: 'File' },
                                                                            { name: 'tallyapp.dat', type: 'File' },
                                                                            { name: 'tallycfg.tsf', type: 'File' },
                                                                            { name: 'tallygateway.ini', type: 'File' },
                                                                            { name: 'tallygatewayserver.exe', type: 'File' },
                                                                            { name: 'tallyhelp.html', type: 'File' }
                                                                        );
                                                                    }
                                                                    items.push(
                                                                        { name: 'bank_payees_sample.xlsx', type: 'File' },
                                                                        { name: 'emp_sample.xlsx', type: 'File' }
                                                                    );
                                                                }

                                                                return items.map((file) => (
                                                                    <div
                                                                        key={file.name}
                                                                        className={`flex justify-between px-2 py-[1px] cursor-pointer hover:bg-[#dcecf5]`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (file.type === 'Drive' || file.type === 'Folder') {
                                                                                // Navigate mock - reset to default for folder
                                                                                if (fileListMode === 'drives') setFileListMode('default');
                                                                            } else {
                                                                                setImportFileName(file.name);
                                                                                setShowBankImportFileList(false);
                                                                                setTimeout(() => document.getElementById('showPreviewInput')?.focus(), 0);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <span className={`${file.indent ? 'pl-4' : ''}`}>{file.name}</span>
                                                                        <span className="text-right italic">{file.type}</span>
                                                                    </div>
                                                                ));
                                                            })()}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div></div>

                                            {/* Show Preview */}
                                            <div className="text-[#1d5b6e]">Show Preview</div>
                                            <div className="text-black">:</div>
                                            <div>
                                                <input
                                                    id="showPreviewInput"
                                                    type="text"
                                                    value={importShowPreview}
                                                    onChange={(e) => setImportShowPreview(e.target.value)}
                                                    className="w-[50px] bg-white text-black font-bold outline-none focus:bg-[#feba35] px-1"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            // Logic for showing preview or accepting
                                                            if (importShowPreview.toLowerCase() === 'yes' || importShowPreview.toLowerCase() === 'y') {
                                                                setImportShowPreview('Yes');
                                                                setShowPreviewModal(true); // Show actual preview modal
                                                            } else {
                                                                setImportShowPreview('No');
                                                                setShowImportBankDetailsAccept(true);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Accept? Confirmation */}
                                        {showImportBankDetailsAccept && (
                                            <div className="absolute bottom-[20px] right-[20px] bg-[#feba35] border-[2px] border-[#2d819b] shadow-[4px_4px_0px_#2d819b] p-4 z-[60] flex flex-col items-center">
                                                <div className="font-bold text-[#1d5b6e] text-[13px] mb-2">Accept?</div>
                                                <div className="flex gap-4">
                                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#1d5b6e] hover:text-white"
                                                        onClick={() => {
                                                            setShowImportBankDetailsAccept(false);
                                                            setShowImportBankDetailsModal(false);
                                                            // Trigger actual import logic here
                                                        }} autoFocus>Yes</button>
                                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#1d5b6e] hover:text-white"
                                                        onClick={() => setShowImportBankDetailsAccept(false)}>No</button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Quit? Confirmation */}
                                        {showImportBankDetailsQuit && (
                                            <div className="absolute inset-0 flex items-center justify-center z-[70]">
                                                <div className="bg-[#feba35] border-[2px] border-[#2d819b] shadow-[4px_4px_0px_#2d819b] p-6 flex flex-col items-center">
                                                    <div className="font-bold text-[#1d5b6e] text-[15px] mb-4">Quit?</div>
                                                    <div className="flex gap-6">
                                                        <button className="px-6 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#1d5b6e] hover:text-white"
                                                            onClick={() => {
                                                                setShowImportBankDetailsQuit(false);
                                                                setShowImportBankDetailsModal(false);
                                                            }} autoFocus>Yes</button>
                                                        <button className="px-6 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#1d5b6e] hover:text-white"
                                                            onClick={() => setShowImportBankDetailsQuit(false)}>No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Import GST Returns Modal */}
                                        {showImportGSTReturnsModal && (
                                            <div className="absolute inset-0 z-[50] flex flex-col font-sans">
                                                {/* Title Bar */}
                                                <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                                    <span>Import GST Returns</span>
                                                    <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                                    <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowImportGSTReturnsModal(false)}>✕</span>
                                                </div>

                                                {/* Content Area */}
                                                <div className="flex-1 relative">
                                                    <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">

                                                        {/* The Pop-up Box */}
                                                        <div className="bg-white p-8 w-[600px] shadow-2xl border border-gray-400 font-bold text-[13px] text-black relative" onClick={(e) => e.stopPropagation()}>

                                                            <div className="text-center font-bold text-[14px] mb-8 underline underline-offset-4">Import GST Returns</div>

                                                            <div className="grid grid-cols-[150px_10px_1fr] gap-y-4">
                                                                {/* GST Registration */}
                                                                <div className="text-black">GST Registration</div>
                                                                <div className="text-black">:</div>
                                                                <div className="relative">
                                                                    <input
                                                                        type="text"
                                                                        value={gstRegistration}
                                                                        readOnly
                                                                        className="w-full bg-[#feba35] px-1 outline-none font-bold text-black border border-transparent cursor-pointer"
                                                                        onClick={() => setShowGSTRegistrationList(true)}
                                                                        onFocus={() => setShowGSTRegistrationList(true)}
                                                                    />
                                                                    {showGSTRegistrationList && (
                                                                        <div className="absolute left-0 top-[22px] w-full bg-blue-100 border border-blue-500 shadow-xl z-[80] font-sans">
                                                                            <div className="bg-[#2d819b] text-white px-2 py-1 text-[12px]">List of GST Registrations</div>
                                                                            <div className="bg-blue-100 text-black px-2 py-1 flex justify-between text-[11px] font-bold border-b border-gray-400">
                                                                                <span className="w-1/3">Name</span>
                                                                                <span className="w-1/3 text-center">GSTIN/UIN</span>
                                                                                <span className="w-1/3 text-right">State</span>
                                                                            </div>
                                                                            <div className="bg-white">
                                                                                <div className="px-2 py-1 hover:bg-[#feba35] cursor-pointer text-black font-bold">Solarica</div>
                                                                                <div
                                                                                    className="px-2 py-1 bg-[#feba35] cursor-pointer text-black font-normal italic flex justify-between"
                                                                                    onClick={() => {
                                                                                        setGstRegistration('Maharashtra Registration');
                                                                                        setShowGSTRegistrationList(false);
                                                                                    }}
                                                                                >
                                                                                    <span>Maharashtra Registration</span>
                                                                                    <span className="text-right">Maharashtra</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Return Type */}
                                                                <div className="text-black">Return Type</div>
                                                                <div className="text-black">:</div>
                                                                <div></div>

                                                                {/* File Path */}
                                                                <div className="text-black">File Path</div>
                                                                <div className="text-black">:</div>
                                                                <div className="font-bold text-black">{importReturnPath}</div>

                                                                {/* File To Import */}
                                                                <div className="text-black">File to Import</div>
                                                                <div className="text-black">:</div>
                                                                <div className="relative">
                                                                    <input
                                                                        type="text"
                                                                        value={importReturnFile}
                                                                        onChange={(e) => setImportReturnFile(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                // Validation Logic
                                                                                if (!importReturnFile.trim() || gstRegistration === 'Solarica') {
                                                                                    setShowGSTReturnError(true);
                                                                                } else {
                                                                                    // Proceed
                                                                                    alert('Import functionality would proceed here.');
                                                                                    setShowImportGSTReturnsModal(false);
                                                                                }
                                                                            }
                                                                        }}
                                                                        className="w-full bg-[#feba35] px-1 outline-none font-bold text-black border border-transparent focus:border-blue-500"
                                                                        autoFocus
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Error Modal */}
                                                {showGSTReturnError && (
                                                    <div className="absolute bottom-[50px] right-[50px] bg-white border border-red-500 shadow-2xl w-[300px] h-[200px] flex flex-col z-[100]" onClick={() => setShowGSTReturnError(false)}>
                                                        <div className="text-center font-bold text-red-500 py-1 border-b border-gray-200">Error</div>
                                                        <div className="flex-1 flex flex-col items-center justify-center p-4">
                                                            <div className="font-bold text-black mb-4 text-[16px]">Oops!</div>
                                                            <div className="text-[13px] text-black">GSTIN/UIN is not provided.</div>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        )}

                                        {/* Specify Path Modal */}
                                        {showSpecifyPathModal && (
                                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setShowSpecifyPathModal(false)}>
                                                <div className="bg-white p-8 shadow-2xl border-[2px] border-[#2d819b] w-[500px] flex flex-col gap-4 font-sans" onClick={(e) => e.stopPropagation()}>
                                                    <div className="text-center font-bold text-[15px] text-[#1d5b6e] border-b border-[#ccc] pb-2">Specify File Path</div>
                                                    <input
                                                        type="text"
                                                        value={tempPath}
                                                        onChange={(e) => setTempPath(e.target.value)}
                                                        className="w-full bg-[#feba35] p-2 outline-none font-bold text-black border border-gray-400 focus:border-[#2d819b] text-[13px]"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                setImportFilePath(tempPath);
                                                                setShowSpecifyPathModal(false);
                                                            }
                                                            if (e.key === 'Escape') {
                                                                setShowSpecifyPathModal(false);
                                                            }
                                                        }}
                                                    />
                                                    <div className="text-center text-[11px] text-gray-500 mt-2">Press Enter to Accept, Esc to Close</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Export Sample File Modal */}
                                        {showExportSampleFileModal && (
                                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
                                                <div className="bg-white w-[700px] shadow-2xl border border-gray-400 font-sans flex flex-col p-10 relative" onClick={(e) => e.stopPropagation()}>

                                                    <div
                                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer font-bold px-2 py-1"
                                                        onClick={() => setShowExportSampleFileModal(false)}
                                                    >
                                                        ✕
                                                    </div>

                                                    <div className="text-[15px] font-bold text-black border-b border-gray-300 pb-2 mb-8">Exporting Sample File</div>

                                                    <div className="grid grid-cols-[150px_10px_1fr] gap-y-2 text-[13px] text-[#1d5b6e]">
                                                        <div className="text-black">File Format</div>
                                                        <div className="text-black">:</div>
                                                        <div className="font-bold">Excel (Spreadsheet)</div>

                                                        <div className="text-black">Export to</div>
                                                        <div className="text-black">:</div>
                                                        <div className="font-bold">Local drive</div>

                                                        <div className="text-black">Folder Path</div>
                                                        <div className="text-black">:</div>
                                                        <div className="font-bold">{importFilePath}</div>

                                                        <div className="text-black">File Name</div>
                                                        <div className="text-black">:</div>
                                                        <div className="font-bold">{exportSampleFileName}</div>

                                                        <div className="text-black">Enable Stripe View</div>
                                                        <div className="text-black">:</div>
                                                        <div className="font-bold">No</div>
                                                    </div>

                                                    <div className="flex justify-center gap-8 mt-12">
                                                        <button className="border border-[#2d819b] px-8 py-2 text-[#1d5b6e] font-bold text-[13px] hover:bg-[#dcecf5]"
                                                            onClick={() => setShowExportSampleConfig(true)}
                                                        >
                                                            <span className="text-[#2d819b]">C:</span> Configure
                                                        </button>
                                                        <button className="border border-[#feba35] px-8 py-2 text-black font-bold text-[13px] hover:bg-[#ffe599]"
                                                            onClick={() => {
                                                                const content = "Account No.,Bank Name,IFSC Code,Amount,Transaction Type,Date\n";
                                                                const blob = new Blob([content], { type: 'text/csv' });
                                                                const url = window.URL.createObjectURL(blob);
                                                                const a = document.createElement('a');
                                                                a.href = url;
                                                                a.download = exportSampleFileName.replace('.xlsx', '.csv'); // Fallback to CSV for web demo
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                document.body.removeChild(a);
                                                                window.URL.revokeObjectURL(url);

                                                                setShowExportSampleFileModal(false);
                                                            }}
                                                            autoFocus
                                                        >
                                                            <span className="text-[#2d819b]">E:</span> Export
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Export Sample Excel File for Masters */}
                                        {showExportSampleMastersModal && (
                                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setShowExportSampleMastersModal(false)}>
                                                <div className="bg-white w-[700px] shadow-2xl border border-gray-400 font-sans flex flex-col p-10 relative" onClick={(e) => e.stopPropagation()}>

                                                    <div
                                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer font-bold px-2 py-1"
                                                        onClick={() => setShowExportSampleMastersModal(false)}
                                                    >
                                                        ✕
                                                    </div>

                                                    <div className="text-center font-bold text-[14px] mb-6 underline underline-offset-4 text-black">Export Sample Excel File for Masters</div>

                                                    <div className="grid grid-cols-[180px_10px_1fr] gap-y-4 text-[13px] text-black">
                                                        <div>Export sample file for</div><div>:</div><div className="font-bold">All Accounting Masters</div>
                                                        <div>Export to</div><div>:</div><div className="font-bold">Local drive</div>
                                                        <div>Folder Path</div><div>:</div><div className="font-bold text-[#1d5b6e]">C:\Program Files\TallyPrime</div>
                                                        <div>File Name</div><div>:</div><div className="font-bold">AllAccountingMasters.xlsx</div>
                                                    </div>

                                                    <div className="flex justify-center gap-6 mt-10">
                                                        <button
                                                            className="px-6 py-1 border border-[#2d819b] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#dcecf5] transition-colors"
                                                            onClick={() => setShowExportSampleConfig(true)} // Reuse config for now
                                                        >
                                                            <span className="text-[#2d819b] underline decoration-[#2d819b] decoration-1 underline-offset-2">C</span>: Configure
                                                        </button>
                                                        <button
                                                            className="px-6 py-1 border border-[#feba35] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#ffe599] transition-colors"
                                                            onClick={() => {
                                                                const content = "Name,Under,Opening Balance\n";
                                                                const blob = new Blob([content], { type: 'text/csv' });
                                                                const url = window.URL.createObjectURL(blob);
                                                                const a = document.createElement('a');
                                                                a.href = url;
                                                                a.download = 'AllAccountingMasters.csv';
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                document.body.removeChild(a);
                                                                window.URL.revokeObjectURL(url);
                                                                setShowExportSampleMastersModal(false);
                                                            }}
                                                            autoFocus
                                                        >
                                                            <span className="text-[#2d819b] underline decoration-[#2d819b] decoration-1 underline-offset-2">E</span>: Export
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Export Sample Excel File for Transactions */}
                                        {showExportSampleTransactionsModal && (
                                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setShowExportSampleTransactionsModal(false)}>
                                                <div className="bg-white w-[700px] shadow-2xl border border-gray-400 font-sans flex flex-col p-10 relative" onClick={(e) => e.stopPropagation()}>

                                                    <div
                                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer font-bold px-2 py-1"
                                                        onClick={() => setShowExportSampleTransactionsModal(false)}
                                                    >
                                                        ✕
                                                    </div>

                                                    <div className="text-center font-bold text-[14px] mb-6 underline underline-offset-4 text-black">Export Sample Excel File for Transactions</div>

                                                    <div className="grid grid-cols-[180px_10px_1fr] gap-y-4 text-[13px] text-black">
                                                        <div>Export sample file for</div><div>:</div><div className="font-bold">All Accounting Vouchers</div>
                                                        <div>Export to</div><div>:</div><div className="font-bold">Local drive</div>
                                                        <div>Folder Path</div><div>:</div><div className="font-bold text-[#1d5b6e]">C:\Program Files\TallyPrime</div>
                                                        <div>File Name</div><div>:</div><div className="font-bold">AccountingVouchers.xlsx</div>
                                                    </div>

                                                    <div className="flex justify-center gap-6 mt-10">
                                                        <button
                                                            className="px-6 py-1 border border-[#2d819b] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#dcecf5] transition-colors"
                                                            onClick={() => setShowExportSampleConfig(true)}
                                                        >
                                                            <span className="text-[#2d819b] underline decoration-[#2d819b] decoration-1 underline-offset-2">C</span>: Configure
                                                        </button>
                                                        <button
                                                            className="px-6 py-1 border border-[#feba35] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#ffe599] transition-colors"
                                                            onClick={() => {
                                                                const content = "Date,Voucher Type,Voucher No.,Ledger Name,Amount\n";
                                                                const blob = new Blob([content], { type: 'text/csv' });
                                                                const url = window.URL.createObjectURL(blob);
                                                                const a = document.createElement('a');
                                                                a.href = url;
                                                                a.download = 'AccountingVouchers.csv';
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                document.body.removeChild(a);
                                                                window.URL.revokeObjectURL(url);
                                                                setShowExportSampleTransactionsModal(false);
                                                            }}
                                                            autoFocus
                                                        >
                                                            <span className="text-[#2d819b] underline decoration-[#2d819b] decoration-1 underline-offset-2">E</span>: Export
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Export Current Modal */}
                                        {showExportCurrentModal && (
                                            <div className="absolute inset-0 z-[120] flex flex-col font-sans text-black">
                                                {/* Title Bar */}
                                                <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                                    <span>Export</span>
                                                    <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                                    <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowExportCurrentModal(false)}>✕</span>
                                                </div>

                                                <div className="flex-1 relative bg-black/10 flex items-center justify-center">
                                                    <div className="bg-white p-6 w-[550px] shadow-2xl border border-gray-400 text-black relative"
                                                        onClick={(e) => e.stopPropagation()}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Escape') setShowExportCurrentModal(false);
                                                        }}
                                                    >
                                                        <div className="mb-1 text-[14px] font-bold">Export</div>
                                                        <div className="border-t border-gray-300 mb-6"></div>

                                                        <div className="grid grid-cols-[180px_10px_1fr] gap-y-2 text-[13px]">
                                                            <div className="font-normal">Type of Masters</div><div>:</div><div className="font-bold">Groups</div>
                                                            <div className="font-normal">Include dependent masters</div><div>:</div><div className="font-bold cursor-pointer hover:bg-[#ffe599]" onClick={() => setExportCurrentIncludeDependent(prev => prev === 'Yes' ? 'No' : 'Yes')}>{exportCurrentIncludeDependent}</div>

                                                            <div className="h-2 col-span-3"></div>

                                                            <div className="font-normal">File Format</div><div>:</div><div className="font-bold italic cursor-pointer hover:bg-[#ffe599]">{exportCurrentFormat}</div>
                                                            <div className="font-normal">Export to</div><div>:</div><div className="font-bold cursor-pointer hover:bg-[#ffe599]">{exportCurrentTo}</div>
                                                            <div className="font-normal">Folder Path</div><div>:</div><div className="font-bold text-[#1d5b6e] truncate cursor-pointer hover:bg-[#ffe599]">{exportCurrentPath}</div>
                                                            <div className="font-normal">File Name</div><div>:</div><div className="font-bold cursor-pointer hover:bg-[#ffe599]">{exportCurrentFileName}</div>
                                                            <div className="font-normal">Enable Stripe View</div><div>:</div><div className="font-bold cursor-pointer hover:bg-[#ffe599]">No</div>
                                                        </div>

                                                        <div className="flex justify-center gap-10 mt-10">
                                                            <button className="px-10 py-1 border border-[#2d819b] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#dceef5] transition-colors" onClick={() => { }}>
                                                                <span className="text-[#2d819b] underline decoration-[#2d819b] decoration-1 underline-offset-2">C</span>: Configure
                                                            </button>
                                                            <button className="px-10 py-1 border border-[#feba35] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#ffe599] transition-colors"
                                                                onClick={() => {
                                                                    alert(`Exporting ${exportCurrentFileName} to ${exportCurrentPath}...`);
                                                                    setShowExportCurrentModal(false);
                                                                }}
                                                                autoFocus
                                                            >
                                                                <span className="text-[#2d819b] underline decoration-[#2d819b] decoration-1 underline-offset-2">E</span>: Export
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                        {/* Mapping Template Creation Modal */}
                                        {showMappingTemplateCreationModal && (
                                            <div className="absolute inset-0 z-[50] flex flex-col font-sans">
                                                {/* Title Bar */}
                                                <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                                    <span>Mapping Template Creation</span>
                                                    <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                                    <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowMappingTemplateCreationModal(false)}>✕</span>
                                                </div>

                                                {/* Content Area */}
                                                <div className="flex-1 relative">
                                                    <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>
                                                    <div className="absolute inset-0 flex items-start justify-center pt-10 bg-black/10">

                                                        {/* The Pop-up Box */}
                                                        <div className="bg-white p-8 w-[600px] shadow-2xl border border-gray-400 font-bold text-[13px] text-black relative" onClick={(e) => e.stopPropagation()}>

                                                            <div className="grid grid-cols-[150px_10px_1fr] gap-y-4">
                                                                {/* File Path */}
                                                                <div className="text-black">File Path</div>
                                                                <div className="text-black">:</div>
                                                                <div className="font-bold text-black">{mappingFilePath}</div>

                                                                {/* File to Import */}
                                                                <div className="text-black">File to Import</div>
                                                                <div className="text-black">:</div>
                                                                <div className="relative">
                                                                    <input
                                                                        type="text"
                                                                        value={mappingFileToImport}
                                                                        onChange={(e) => setMappingFileToImport(e.target.value)}
                                                                        onFocus={() => setShowMappingFileList(true)} // Show file list on focus
                                                                        className="w-full bg-[#feba35] px-1 outline-none font-bold text-black border border-transparent focus:border-blue-500"
                                                                        autoFocus
                                                                    />

                                                                    {/* List of Files Dropdown */}
                                                                    {showMappingFileList && (
                                                                        <div className="absolute left-0 top-[22px] w-[350px] bg-[#dcecf5] border border-[#2d819b] shadow-xl z-[80] font-sans">
                                                                            <div className="bg-[#2d819b] text-white px-2 py-1 text-[12px] flex justify-between">
                                                                                <span>List of Files</span>
                                                                            </div>

                                                                            <div className="text-right px-2 py-1 text-[11px] text-[#1d5b6e] italic border-b border-gray-300 font-bold">
                                                                                <div>Specify Path</div>
                                                                                <div>Select from Drive</div>
                                                                                <div>Show More</div>
                                                                            </div>

                                                                            <div className="bg-white max-h-[200px] overflow-y-auto">
                                                                                <div className="px-2 py-1 font-bold text-black bg-gray-200 border-b border-gray-300">{mappingFilePath}</div>
                                                                                <div className="hover:bg-[#feba35] cursor-pointer px-2 py-1 text-black font-bold flex items-center gap-2">
                                                                                    <span className="text-[10px]">♦</span> Up
                                                                                </div>
                                                                                {/* Mock Folders */}
                                                                                {['appdata', 'capsules', 'config', 'lang', 'logs'].map((folder) => (
                                                                                    <div
                                                                                        key={folder}
                                                                                        className="hover:bg-[#feba35] cursor-pointer px-2 py-1 text-black font-normal flex justify-between group"
                                                                                        onClick={() => {
                                                                                            setMappingFileToImport(folder);
                                                                                            setShowMappingFileList(false);
                                                                                        }}
                                                                                    >
                                                                                        <span>{folder}</span>
                                                                                        <span className="italic text-gray-500 group-hover:text-black text-[11px]">Folder</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Worksheet Name */}
                                                                <div className="text-black">Worksheet Name</div>
                                                                <div className="text-black">:</div>
                                                                <input
                                                                    type="text"
                                                                    value={mappingWorksheetName}
                                                                    onChange={(e) => setMappingWorksheetName(e.target.value)}
                                                                    className="w-full bg-white px-1 outline-none font-bold text-black border border-gray-300 focus:bg-[#feba35]"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Export Configuration Modal */}
                                        {showExportSampleConfig && (
                                            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-transparent" onClick={() => setShowExportSampleConfig(false)}>
                                                <div className="bg-white border border-[#2d819b] shadow-[4px_4px_0px_#2d819b] p-4 w-[400px] flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
                                                    <div className="text-center font-bold text-[14px] mb-4 border-b border-gray-300 pb-2 text-black">Export Configuration</div>

                                                    <div className="flex items-center mb-2">
                                                        <label className="w-[150px] text-[13px] text-black">File Format</label>
                                                        <span className="font-bold mr-2 text-black">:</span>
                                                        <span className="font-bold text-black text-[13px]">Excel (Spreadsheet)</span>
                                                    </div>
                                                    <div className="flex items-center mb-2">
                                                        <label className="w-[150px] text-[13px] text-black">Folder Path</label>
                                                        <span className="font-bold mr-2 text-black">:</span>
                                                        <input type="text" value={importFilePath} readOnly className="font-bold text-black text-[13px] bg-transparent outline-none w-full" />
                                                    </div>

                                                    <div className="flex justify-end mt-4">
                                                        <button className="px-4 py-1 bg-[#2d819b] text-white font-bold text-[12px]" onClick={() => setShowExportSampleConfig(false)}>Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Import Preview Modal */}
                                        {showPreviewModal && (
                                            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40" onClick={() => setShowPreviewModal(false)}>
                                                <div className="bg-white border border-[#2d819b] shadow-2xl p-0 w-[800px] h-[500px] flex flex-col font-sans relative" onClick={(e) => e.stopPropagation()}>
                                                    <div className="bg-[#2d819b] text-white font-bold text-[13px] px-2 py-1 flex justify-between">
                                                        <span>Import Preview</span>
                                                        <span className="cursor-pointer hover:text-red-300" onClick={() => setShowPreviewModal(false)}>✕</span>
                                                    </div>
                                                    <div className="flex-1 overflow-auto p-4">
                                                        <table className="w-full border-collapse border border-gray-400 text-[12px]">
                                                            <thead>
                                                                <tr className="bg-[#dfeff5] font-bold">
                                                                    <th className="border border-gray-400 px-2 py-1 text-left text-black">Date</th>
                                                                    <th className="border border-gray-400 px-2 py-1 text-left text-black">Particulars</th>
                                                                    <th className="border border-gray-400 px-2 py-1 text-right text-black">Debit</th>
                                                                    <th className="border border-gray-400 px-2 py-1 text-right text-black">Credit</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td className="border border-gray-400 px-2 py-1 text-black">01-04-2025</td>
                                                                    <td className="border border-gray-400 px-2 py-1 text-black">Opening Balance</td>
                                                                    <td className="border border-gray-400 px-2 py-1 text-right text-black"></td>
                                                                    <td className="border border-gray-400 px-2 py-1 text-right text-black">50,000.00</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="border border-gray-400 px-2 py-1 text-black">02-04-2025</td>
                                                                    <td className="border border-gray-400 px-2 py-1 text-black">Payment to Supplier</td>
                                                                    <td className="border border-gray-400 px-2 py-1 text-right text-black">10,000.00</td>
                                                                    <td className="border border-gray-400 px-2 py-1 text-right text-black"></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="p-2 border-t border-gray-300 flex justify-end bg-white">
                                                        <button className="px-4 py-1 bg-[#2d819b] text-white font-bold text-[12px] hover:bg-[#1d5b6e]" onClick={() => {
                                                            setShowPreviewModal(false);
                                                            setShowImportBankDetailsAccept(true);
                                                        }}>OK</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showBackupModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans">
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Backup Companies</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowBackupModal(false)}>✕</span>
                            </div>
                            <div className="flex-1 relative">
                                <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <div className="bg-[#e8f6fa] shadow-2xl border border-[#2d819b] w-[700px] font-sans relative flex flex-col h-[500px]" onClick={(e) => e.stopPropagation()}>
                                        <div className="p-4 flex flex-col h-full">
                                            <div className="text-[13px] font-bold mb-4 text-center border-b border-[#2d819b] pb-1">Backup Companies on Disk</div>
                                            {/* Content from previous implementation */}
                                            <div className="flex mb-2">
                                                <label className="w-[150px] text-[13px] font-bold">Details</label>
                                            </div>
                                            <div className="flex mb-1">
                                                <label className="w-[150px] text-[13px]">Source</label>
                                                <span className="mr-2">:</span>
                                                <span className="font-bold text-[13px]">C:\Users\Public\TallyPrime\data</span>
                                            </div>
                                            <div className="flex mb-4">
                                                <label className="w-[150px] text-[13px]">Destination</label>
                                                <span className="mr-2">:</span>
                                                <input
                                                    type="text"
                                                    defaultValue="C:\Users\Public\TallyPrime\data\Backup"
                                                    className="w-[300px] bg-transparent border-b border-gray-400 outline-none text-[13px] font-bold hover:bg-[#ffe599] focus:bg-[#feba35] px-1"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') setShowBackupAccept(true);
                                                        if (e.key === 'Escape') {
                                                            if (showBackupAccept) setShowBackupAccept(false);
                                                            else setShowBackupQuit(true);
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div className="flex-1 border border-gray-400 bg-white flex flex-col">
                                                <div className="bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold flex justify-between pr-4">
                                                    <span>Name of Companies</span>
                                                    <span>Number</span>
                                                    <span>Period</span>
                                                </div>
                                                <div className="overflow-y-auto flex-1 p-2">
                                                    {openCompanies.map((c, i) => (
                                                        <div key={i} className="flex justify-between px-2 cursor-pointer hover:bg-blue-100 text-[13px]">
                                                            <span>{c.name}</span>
                                                            <span>{c.number}</span>
                                                            <span>{c.period}</span>
                                                        </div>
                                                    ))}
                                                    <div className="text-gray-500 italic mt-2 px-2 cursor-pointer hover:bg-yellow-200 hover:text-black font-bold"
                                                        onClick={() => setShowBackupAccept(true)}
                                                    >End of List</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Accept Modal */}
                                        {showBackupAccept && (
                                            <div className="absolute bottom-10 right-10 z-[70] bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center">
                                                <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Accept?</div>
                                                <div className="flex justify-around">
                                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                        onClick={() => { setShowBackupAccept(false); setShowBackupModal(false); }} autoFocus>Yes</button>
                                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                        onClick={() => setShowBackupAccept(false)}>No</button>
                                                </div>
                                            </div>
                                        )}
                                        {/* Quit Modal */}
                                        {showBackupQuit && (
                                            <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/10">
                                                <div className="bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center">
                                                    <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Quit?</div>
                                                    <div className="flex justify-around">
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => { setShowBackupQuit(false); setShowBackupModal(false); }} autoFocus>Yes</button>
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => setShowBackupQuit(false)}>No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Restore Modal Overlay */}
                    {showRestoreModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans">
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Restore Companies</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowRestoreModal(false)}>✕</span>
                            </div>
                            <div className="flex-1 relative">
                                <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <div className="bg-[#e8f6fa] shadow-2xl border border-[#2d819b] w-[700px] font-sans relative flex flex-col h-[500px]" onClick={(e) => e.stopPropagation()}>
                                        <div className="p-4 flex flex-col h-full">
                                            <div className="text-[13px] font-bold mb-4 text-center border-b border-[#2d819b] pb-1">Restore Companies</div>

                                            <div className="flex mb-2">
                                                <label className="w-[150px] text-[13px] font-bold">Details</label>
                                            </div>
                                            <div className="flex mb-1">
                                                <label className="w-[150px] text-[13px]">Destination</label>
                                                <span className="mr-2">:</span>
                                                <span className="font-bold text-[13px]">C:\Users\Public\TallyPrime\data</span>
                                            </div>
                                            <div className="flex mb-4">
                                                <label className="w-[150px] text-[13px]">Source</label>
                                                <span className="mr-2">:</span>
                                                <input
                                                    type="text"
                                                    defaultValue="C:\Users\Public\TallyPrime\data\Backup"
                                                    className="w-[300px] bg-transparent border-b border-gray-400 outline-none text-[13px] font-bold hover:bg-[#ffe599] focus:bg-[#feba35] px-1"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') setShowRestoreAccept(true);
                                                        if (e.key === 'Escape') {
                                                            if (showRestoreAccept) setShowRestoreAccept(false);
                                                            else setShowRestoreQuit(true);
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div className="flex-1 border border-gray-400 bg-white flex flex-col">
                                                <div className="bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold flex justify-between pr-4">
                                                    <span>Name of Companies</span>
                                                    <span>Number</span>
                                                    <span>Period</span>
                                                </div>
                                                <div className="overflow-y-auto flex-1 p-2">
                                                    <div className="text-gray-500 italic mt-2 px-2 cursor-pointer hover:bg-yellow-200 hover:text-black font-bold"
                                                        onClick={() => setShowRestoreAccept(true)}
                                                    >End of List</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Accept Modal */}
                                        {showRestoreAccept && (
                                            <div className="absolute bottom-10 right-10 z-[70] bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center">
                                                <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Accept?</div>
                                                <div className="flex justify-around">
                                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                        onClick={() => { setShowRestoreAccept(false); setShowRestoreModal(false); }} autoFocus>Yes</button>
                                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                        onClick={() => setShowRestoreAccept(false)}>No</button>
                                                </div>
                                            </div>
                                        )}
                                        {/* Quit Modal */}
                                        {showRestoreQuit && (
                                            <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/10">
                                                <div className="bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center">
                                                    <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Quit?</div>
                                                    <div className="flex justify-around">
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => { setShowRestoreQuit(false); setShowRestoreModal(false); }} autoFocus>Yes</button>
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => setShowRestoreQuit(false)}>No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    )}




                    {/* Repair Company Modal Overlay */}
                    {showRepairCompanyModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans">
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Repair Company</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowRepairCompanyModal(false)}>✕</span>
                            </div>
                            <div className="flex-1 relative">
                                <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <div className="flex flex-col w-[600px] min-h-[500px] shadow-2xl border border-[#2d819b] font-sans relative bg-[#e8f6fa]" onClick={(e) => e.stopPropagation()}>
                                        <div className="bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold text-center relative">
                                            Repair Company
                                        </div>
                                        {/* Editable Input */}
                                        <div className="mx-4 my-2 border-b border-black text-center text-[13px] font-bold text-black py-1 bg-[#feba35]">
                                            <input
                                                type="text"
                                                className="w-full bg-[#feba35] text-center font-bold outline-none placeholder-black/50"
                                                value={menuSearchQuery}
                                                onChange={(e) => setMenuSearchQuery(e.target.value)}
                                                placeholder="Select Company to Repair"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') setShowRepairQuit(true);
                                                }}
                                            />
                                        </div>

                                        <div className="flex flex-col flex-1">
                                            <div className="bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold flex justify-between">
                                                <span>List of Companies</span>
                                                <span>Number</span>
                                                <span>Period</span>
                                            </div>
                                            <div className="flex-1 bg-[#e8f6fa] overflow-y-auto font-mono text-[13px]">
                                                <div className="px-2 py-0.5 font-bold">Data Path: C:\Users\Public\TallyPrime\data</div>
                                                {openCompanies.filter(c => c.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map((comp, idx) => (
                                                    <div key={idx}
                                                        className={`flex justify-between px-2 cursor-pointer hover:bg-[#dceef5]`}
                                                        onClick={() => {
                                                            alert(`Repairing ${comp.name}...`); // Placeholder
                                                            setShowRepairCompanyModal(false);
                                                        }}
                                                    >
                                                        <div className="font-bold text-black">{comp.name}</div>
                                                        <div>{comp.number}</div>
                                                        <div>{comp.period}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Quit Modal */}
                                        {showRepairQuit && (
                                            <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/10">
                                                <div className="bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center">
                                                    <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Quit?</div>
                                                    <div className="flex justify-around">
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => { setShowRepairQuit(false); setShowRepairCompanyModal(false); }} autoFocus>Yes</button>
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => setShowRepairQuit(false)}>No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Migrate Company Modal Overlay */}
                    {showMigrateCompanyModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans">
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Migrate Company</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowMigrateCompanyModal(false)}>✕</span>
                            </div>
                            <div className="flex-1 relative">
                                <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <div className="flex flex-col w-[600px] min-h-[500px] shadow-2xl border border-[#2d819b] font-sans relative bg-[#e8f6fa]" onClick={(e) => e.stopPropagation()}>
                                        <div className="bg-[#8ec7ff] text-black px-2 py-1 text-[13px] font-bold text-center border-b border-[#2d819b] relative">
                                            Migrate Company
                                        </div>
                                        <div className="mx-4 my-2 border-b border-black text-center text-[13px] font-bold text-black py-1 bg-[#feba35]">
                                            <input
                                                type="text"
                                                className="w-full bg-[#feba35] text-center font-bold outline-none placeholder-black/50"
                                                value={menuSearchQuery}
                                                onChange={(e) => setMenuSearchQuery(e.target.value)}
                                                placeholder="Select Company to Migrate"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') setShowMigrateQuit(true);
                                                }}
                                            />
                                        </div>

                                        <div className="flex flex-col flex-1">
                                            <div className="bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold flex justify-between">
                                                <span>List of Companies</span>
                                            </div>
                                            <div className="flex-1 bg-[#e8f6fa] overflow-y-auto font-mono text-[13px]">
                                                <div className="px-2 py-0.5 font-bold">Data Path: C:\Users\Public\TallyPrime\data</div>
                                                {openCompanies.filter(c => c.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map((comp, idx) => (
                                                    <div key={idx}
                                                        className={`flex justify-between px-2 cursor-pointer hover:bg-[#dceef5]`}
                                                        onClick={() => {
                                                            alert(`Migrating ${comp.name}...`); // Placeholder
                                                            setShowMigrateCompanyModal(false);
                                                        }}
                                                    >
                                                        <div className="font-bold text-black">{comp.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Quit Modal */}
                                        {showMigrateQuit && (
                                            <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/10">
                                                <div className="bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center">
                                                    <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Quit?</div>
                                                    <div className="flex justify-around">
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => { setShowMigrateQuit(false); setShowMigrateCompanyModal(false); }} autoFocus>Yes</button>
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => setShowMigrateQuit(false)}>No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* TDL Management Overlay */}
                    {showTDLManagementModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans bg-[#e8f6fa]">
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>TDL Management</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">TDLS & Add-ons</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowTDLManagementModal(false)}>✕</span>
                            </div>

                            {/* Column Headers */}
                            <div className="flex bg-[#e8f6fa] border-b border-[#2d819b] text-[13px] font-bold text-black px-2 py-1">
                                <div className="w-[80px]">Sl.No.</div>
                                <div className="flex-1">Particulars</div>
                                <div className="w-[100px] text-right">Status</div>
                            </div>

                            {/* List Content */}
                            <div className="flex-1 overflow-y-auto bg-[#e8f6fa] p-2 text-[13px] font-bold text-black" onKeyDown={(e) => {
                                if (e.key === 'Escape') setShowTDLManagementModal(false);
                            }} tabIndex={0} autoFocus>
                                {/* No TDLs configured normally */}
                            </div>

                            {/* Footer Status */}
                            <div className="bg-[#e8f6fa] border-t border-[#2d819b] px-2 py-1 text-[13px] font-bold text-black flex justify-between h-[24px]">
                                <span>Total TDLs Configured</span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    {/* About Page Overlay */}
                    {showAboutPageModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans bg-[#e8f6fa]">
                            <div className="flex justify-between items-center bg-[#8ec7ff] text-black border-b border-[#2d819b] px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span className="flex-1 text-center">About</span>
                                <span className="cursor-pointer hover:text-red-600 font-bold absolute right-2" onClick={() => setShowAboutPageModal(false)}>✕</span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 text-[13px] font-bold text-black" onKeyDown={(e) => {
                                if (e.key === 'Escape') setShowAboutPageModal(false);
                            }} tabIndex={0} autoFocus>
                                {/* Grid Layout for Info */}
                                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                    {/* Product Info */}
                                    <div>
                                        <div className="mb-2 border-b border-black font-bold">Product Information</div>
                                        <div className="flex justify-between"><span>Application</span><span>TallyPrime</span></div>
                                        <div className="flex justify-between"><span>Release</span><span>7.0 (Latest)</span></div>
                                        <div className="flex justify-between"><span>Application path</span><span>C:\Program Files\TallyPrime</span></div>
                                        <div className="flex justify-between"><span>Other TallyPrime installations</span><span>None</span></div>
                                    </div>

                                    {/* Data Information */}
                                    <div>
                                        <div className="mb-2 border-b border-black font-bold">Data Information</div>
                                        <div className="flex justify-between"><span>Location of Company data</span><span>C:\Users\Public\TallyPrime\data</span></div>
                                        <div className="flex justify-between"><span>Companies to load on startup</span><span>1 Configured</span></div>
                                        <div className="flex justify-between"><span>Location of Company Backup</span><span>TallyDrive</span></div>
                                        <div className="flex justify-between"><span>Migration Ports (Tool | TallyPrime)</span><span>9509 | 9009</span></div>
                                    </div>

                                    {/* License Information */}
                                    <div>
                                        <div className="mb-2 border-b border-black font-bold">License Information</div>
                                        <div className="flex justify-between"><span>Application status</span><span>Educational Mode</span></div>
                                        <div className="flex justify-between"><span>License Error</span><span>Unable to access Tally Gateway Server</span></div>
                                        <div className="flex justify-between"><span>Tally Gateway Server</span><span>localhost:9999</span></div>
                                    </div>

                                    {/* Connectivity */}
                                    <div>
                                        <div className="mb-2 bg-[#feba35] px-1 border-b border-black text-black font-bold">Connectivity and Tally Gateway Server</div>
                                        <div className="flex justify-between px-1"><span>Local Area Network (LAN) connectivity</span><span>Yes</span></div>
                                        <div className="flex justify-between px-1"><span>Connected to Tally Gateway Server</span><span>localhost:9999 (Connected to internet)</span></div>
                                        <div className="flex justify-between px-1"><span>Client/Server and ODBC Services</span><span>ODBC | Port:9000</span></div>
                                        <div className="flex justify-between px-1"><span>Status of Online Access services</span><span>Available on https://status.tallysolutions.com</span></div>
                                    </div>

                                    {/* TDL & Add-On */}
                                    <div>
                                        <div className="mb-2 border-b border-black font-bold">TDL & Add-On</div>
                                        <div className="flex justify-between"><span>TDLs Configured</span><span>None</span></div>
                                    </div>

                                    {/* Tally Scheduler */}
                                    <div>
                                        <div className="mb-2 border-b border-black font-bold">Tally Scheduler</div>
                                        <div className="flex justify-between"><span>Status | Port</span><span>Running | 10089</span></div>
                                    </div>

                                    {/* Empty for spacing */}
                                    <div></div>

                                    {/* Computer Information */}
                                    <div>
                                        <div className="mb-2 border-b border-black font-bold">Computer Information</div>
                                        <div className="flex justify-between"><span>Computer Name</span><span>KHUSHI</span></div>
                                        <div className="flex justify-between"><span>Operating System</span><span>Windows 11</span></div>
                                        <div className="flex justify-between"><span>Firewall and Antivirus</span><span>Installed</span></div>
                                        <div className="flex justify-between"><span>Hard Drive | Memory</span><span>931 GB | 15.7 GB</span></div>
                                        <div className="flex justify-between"><span>Processor</span><span>13th Gen Intel(R) Core(TM) i7-1360P</span></div>
                                        <div className="flex justify-between"><span>Display Resolution</span><span>1920 X 1200</span></div>
                                        <div className="flex justify-between"><span>Printers Installed</span><span>3</span></div>
                                        <div className="flex justify-between"><span>Network Adaptors</span><span>Local Area Connection* 1(not operational) | 169.254.31.206</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center text-[10px] text-gray-400 py-1 border-t border-gray-300">
                                © Tally Solutions Pvt Ltd., 1988
                            </div>
                        </div>
                    )}

                    {/* Upgrade (Product Update) Modal Overlay */}
                    {showUpgradeModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans bg-[#e8f6fa]">
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Product Update</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2"></span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowUpgradeModal(false)}>✕</span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 flex justify-center text-[13px] font-bold text-black" onKeyDown={(e) => {
                                if (e.key === 'Escape') setShowUpgradeModal(false);
                            }} tabIndex={0} autoFocus>
                                <div className="w-[800px] bg-white shadow-xl border border-gray-300 min-h-[400px] flex flex-col">
                                    <div className="py-4 text-center text-[16px] font-bold underline">Product Update</div>
                                    <div className="bg-[#feba35] px-4 py-1 flex gap-2 font-bold mb-2">
                                        <span>TallyPrime Release 7.0</span>
                                        <span>|</span>
                                        <span>Installed</span>
                                        <span>|</span>
                                        <span>Latest Release</span>
                                    </div>

                                    <div className="flex border-b border-gray-200 px-4 py-1 font-bold">
                                        <div className="w-[200px]">Release</div>
                                        <div className="w-[200px]">Status</div>
                                        <div className="flex-1">Information</div>
                                    </div>
                                    {/* Empty list for now as it's latest */}

                                    <div className="mt-8 px-4 font-bold">
                                        Explore Tally Products & Releases on the Tally website
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Print Modal Overlay */}
                    {showPrintModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans bg-white" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Print</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowPrintModal(false)}>✕</span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-10 flex justify-center items-center bg-gray-200" onClick={() => { /* Close sub-modals on outside click if needed */ }} onKeyDown={(e) => {
                                if (e.key === 'Escape' && !showPrintCopies && !showPrinterSelect && !showTitleConfig) setShowPrintModal(false);
                            }} tabIndex={0} autoFocus>

                                <div className="bg-white shadow-xl p-8 w-[700px] min-h-[400px] relative flex flex-col">
                                    <div className="border-b border-gray-300 mb-4 pb-2">
                                        <div className="uppercase font-bold text-[14px]">Print</div>
                                    </div>

                                    <div className="flex-1 text-[13px] font-bold text-black space-y-2">
                                        <div className="flex">
                                            <div className="w-[200px]">Type of Masters</div>
                                            <div className="w-[10px]">:</div>
                                            <div className="font-bold">Groups</div>
                                        </div>

                                        <div className="h-[1px] bg-gray-300 my-2"></div>

                                        <div className="flex">
                                            <div className="w-[200px]">Printer</div>
                                            <div className="w-[10px]">:</div>
                                            <div>{selectedPrinter}</div>
                                        </div>
                                        <div className="flex">
                                            <div className="w-[200px]">Paper Size</div>
                                            <div className="w-[10px]">:</div>
                                            <div>Letter (8.50" x 10.98") or (216 mm x 279 mm)</div>
                                        </div>
                                        <div className="flex">
                                            <div className="w-[200px] pl-4">Print area</div>
                                            <div className="w-[10px]">:</div>
                                            <div>(8.50" x 10.98") or (216 mm x 279 mm)</div>
                                        </div>
                                        <div className="flex">
                                            <div className="w-[200px]">Number of Copies</div>
                                            <div className="w-[10px]">:</div>
                                            <div>{printCopies}</div>
                                        </div>
                                        <div className="flex">
                                            <div className="w-[200px]">Enable Stripe View</div>
                                            <div className="w-[10px]">:</div>
                                            <div>No</div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-center gap-4">
                                        <button className="border border-[#2d819b] text-[#2d819b] px-6 py-1 hover:bg-[#dceef5] font-bold text-[13px]">
                                            <span className="text-[#1d5b6e]">C:</span> Configure
                                        </button>
                                        <button className="border border-[#2d819b] text-[#2d819b] px-6 py-1 hover:bg-[#dceef5] font-bold text-[13px]">
                                            <span className="text-[#1d5b6e]">I:</span> Preview
                                        </button>
                                        <button className="border border-[#feba35] bg-white text-[#feba35] px-6 py-1 hover:bg-[#fff9c4] font-bold text-[13px] shadow-sm">
                                            <span className="text-[#1d5b6e]">P:</span> Print
                                        </button>
                                    </div>

                                    {/* Sub-Modal: Print Copies */}
                                    {showPrintCopies && (
                                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/10">
                                            <div className="bg-white border border-[#2d819b] shadow-2xl p-4 w-[350px]">
                                                <div className="font-bold border-b border-gray-300 mb-2 pb-1 text-center">Printer Settings</div>
                                                <div className="flex items-center">
                                                    <div className="w-[150px] font-bold text-[13px]">Number of copies</div>
                                                    <div className="mr-2">:</div>
                                                    <input
                                                        type="text"
                                                        value={printCopies}
                                                        onChange={(e) => setPrintCopies(e.target.value)}
                                                        className="w-[60px] bg-[#feba35] border border-gray-400 px-1 font-bold outline-none"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === 'Escape') setShowPrintCopies(false);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sub-Modal: Printer List */}
                                    {showPrinterSelect && (
                                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/10">
                                            <div className="bg-white border border-[#2d819b] shadow-2xl w-[500px] flex flex-col font-sans relative"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') setShowPrinterSelect(false);
                                                }}
                                                autoFocus
                                            >
                                                <button className="absolute top-1 right-1 text-gray-400 hover:text-red-500 font-bold text-[14px] leading-none z-10" onClick={() => setShowPrinterSelect(false)}>✕</button>
                                                <div className="font-bold border-b border-gray-300 py-1 text-center mb-0">Printer Settings</div>
                                                <div className="flex bg-white px-2 py-1">
                                                    <div className="w-[150px] font-bold text-[13px]">Printer</div>
                                                    <div className="mr-2">:</div>
                                                    <div className="bg-[#feba35] flex-1 px-1 font-bold">{selectedPrinter}</div>
                                                </div>

                                                <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px]">List of Printers</div>
                                                <div className="bg-[#e8f6fa] items-center px-2 py-1 text-[13px] font-bold border-b border-[#2d819b] flex">
                                                    <div className="flex-1">Printer Name</div>
                                                    <div className="w-[80px]">Status</div>
                                                    <div className="w-[100px]">Port</div>
                                                </div>
                                                <div className="bg-white max-h-[200px] overflow-y-auto">
                                                    {['Microsoft Print to PDF', 'OneNote (Desktop)', 'OneNote (Desktop) - Protected'].map(p => (
                                                        <div key={p} className="px-2 py-1 text-[13px] hover:bg-[#feba35] cursor-pointer flex font-bold"
                                                            onClick={() => { setSelectedPrinter(p); setShowPrinterSelect(false); }}>
                                                            <div className="flex-1">{p}</div>
                                                            <div className="w-[80px] italic font-normal">Ready</div>
                                                            <div className="w-[100px] italic font-normal">PORTPROMPT:</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sub-Modal: Print Format (F8) */}
                                    {showPrintFormat && (
                                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/10">
                                            <div className="bg-white border border-[#2d819b] shadow-2xl w-[400px] flex flex-col font-sans relative"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') setShowPrintFormat(false);
                                                }}
                                                autoFocus
                                            >
                                                <button className="absolute top-1 right-1 text-gray-400 hover:text-red-500 font-bold text-[14px] leading-none z-10" onClick={() => setShowPrintFormat(false)}>✕</button>
                                                <div className="font-bold border-b border-gray-300 py-1 text-center mb-0">Printer Settings</div>
                                                <div className="flex bg-white px-2 py-1">
                                                    <div className="w-[100px] font-bold text-[13px]">Print Format</div>
                                                    <div className="mr-2">:</div>
                                                    <div className="bg-[#feba35] flex-1 px-1 font-bold">{printFormat}</div>
                                                </div>

                                                <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px]">List of Print Formats</div>
                                                <div className="bg-white">
                                                    {['Dot Matrix Format', 'Neat Mode', 'Quick / Draft Format'].map(f => (
                                                        <div key={f} className={`px-2 py-1 text-[13px] font-bold cursor-pointer hover:bg-[#feba35] ${printFormat === f ? 'bg-[#feba35]' : ''}`}
                                                            onClick={() => { setPrintFormat(f); setShowPrintFormat(false); }}>
                                                            {f}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sub-Modal: Pages to Print (F10) */}
                                    {showPagesToPrint && (
                                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/10">
                                            <div className="bg-white border border-[#2d819b] shadow-2xl p-4 w-[450px]">
                                                <div className="font-bold border-b border-gray-300 mb-2 pb-1 text-center">Printer Settings</div>

                                                <div className="flex items-center mb-2">
                                                    <div className="w-[200px] font-bold text-[13px]">Number to start from first page</div>
                                                    <div className="mr-2">:</div>
                                                    <input
                                                        type="text"
                                                        value={pageStart}
                                                        onChange={(e) => setPageStart(e.target.value)}
                                                        className="w-[50px] font-bold outline-none"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') document.getElementById('page-range-input')?.focus();
                                                            if (e.key === 'Escape') setShowPagesToPrint(false);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-[200px] font-bold text-[13px]">Page Range</div>
                                                    <div className="mr-2">:</div>
                                                    <input
                                                        id="page-range-input"
                                                        type="text"
                                                        value={pageRange}
                                                        onChange={(e) => setPageRange(e.target.value)}
                                                        className="flex-1 bg-[#feba35] border border-gray-400 px-1 font-bold outline-none"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === 'Escape') setShowPagesToPrint(false);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sub-Modal: Title Config */}
                                    {showTitleConfig && (
                                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/10">
                                            <div className="bg-white border border-[#2d819b] shadow-2xl p-4 w-[450px]">
                                                <div className="font-bold border-b border-gray-300 mb-4 pb-1 text-center">Header Information</div>
                                                <div className="flex items-center mb-2">
                                                    <div className="w-[100px] font-bold text-[13px]">Title</div>
                                                    <div className="mr-2">:</div>
                                                    <input
                                                        type="text"
                                                        value={printTitle}
                                                        onChange={(e) => setPrintTitle(e.target.value)}
                                                        className="flex-1 bg-[#feba35] border border-gray-400 px-1 font-bold outline-none"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') document.getElementById('subtitle-input')?.focus();
                                                            if (e.key === 'Escape') setShowTitleConfig(false);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-[100px] font-bold text-[13px]">Subtitle</div>
                                                    <div className="mr-2">:</div>
                                                    <input
                                                        id="subtitle-input"
                                                        type="text"
                                                        value={printSubtitle}
                                                        onChange={(e) => setPrintSubtitle(e.target.value)}
                                                        className="flex-1 bg-white border-b border-gray-400 px-1 font-bold outline-none"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === 'Escape') setShowTitleConfig(false);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Configuration Modal Overlay */}
                    {showDataConfigurationModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans">
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Data Configuration</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowDataConfigurationModal(false)}>✕</span>
                            </div>
                            <div className="flex-1 relative">
                                <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <div className="bg-white p-2 shadow-2xl border border-[#2d819b] w-[700px] font-sans relative flex flex-col" onClick={(e) => e.stopPropagation()}>
                                        <div className="text-center font-bold text-[14px] border-b border-gray-300 mb-4 pb-1">Data Configuration</div>

                                        <div className="px-4 text-[13px] font-bold text-black flex flex-col gap-2"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const inputs = Array.from(e.currentTarget.querySelectorAll('input'));
                                                    const index = inputs.indexOf(e.target as HTMLInputElement);
                                                    if (index > -1 && index < inputs.length - 1) {
                                                        inputs[index + 1].focus();
                                                    } else {
                                                        setShowDataConfigAccept(true);
                                                        (e.target as HTMLElement).blur();
                                                    }
                                                }
                                                if (e.key === 'Escape') {
                                                    e.stopPropagation();
                                                    if (showDataConfigAccept) setShowDataConfigAccept(false);
                                                    else if (showDataConfigQuit) setShowDataConfigQuit(false);
                                                    else setShowDataConfigQuit(true);
                                                }
                                            }}
                                        >
                                            {/* General Header */}
                                            <div className="font-bold text-[#1d5b6e] border-b border-gray-200">General</div>
                                            <div className="flex">
                                                <label className="w-[350px]">Company Data Path</label>
                                                <span className="mr-2">:</span>
                                                <input type="text" defaultValue="C:\Users\Public\TallyPrime\data" className="flex-1 bg-transparent px-1 outline-none hover:bg-[#ffe599] focus:bg-[#feba35]" autoFocus />
                                            </div>
                                            <div className="flex">
                                                <label className="w-[350px]">Backup Data Path</label>
                                                <span className="mr-2">:</span>
                                                <input type="text" defaultValue="TallyDrive" className="flex-1 bg-transparent px-1 outline-none hover:bg-[#ffe599] focus:bg-[#feba35]" />
                                            </div>
                                            <div className="flex">
                                                <label className="w-[350px]">Schedule Backup Data Path</label>
                                                <span className="mr-2">:</span>
                                                <input type="text" defaultValue="TallyDrive" className="flex-1 bg-transparent px-1 outline-none hover:bg-[#ffe599] focus:bg-[#feba35]" />
                                            </div>
                                            <div className="flex">
                                                <label className="w-[350px]">Auto-restore companies from TallyDrive with the same Backup Password</label>
                                                <span className="mr-2">:</span>
                                                <input type="text" defaultValue="Yes" className="flex-1 bg-transparent px-1 outline-none hover:bg-[#ffe599] focus:bg-[#feba35]" />
                                            </div>

                                            {/* Migration Header */}
                                            <div className="font-bold text-[#1d5b6e] border-b border-gray-200 mt-2">Migration</div>
                                            <div className="flex">
                                                <label className="w-[350px]">Allow working on data during migration</label>
                                                <span className="mr-2">:</span>
                                                <input type="text" defaultValue="No" className="flex-1 bg-transparent px-1 outline-none hover:bg-[#ffe599] focus:bg-[#feba35]" />
                                            </div>
                                        </div>

                                        {/* Config Accept Modal */}
                                        {showDataConfigAccept && (
                                            <div className="absolute bottom-10 right-10 z-[70] bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                                                <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Accept?</div>
                                                <div className="flex justify-around">
                                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                        onClick={() => {
                                                            setShowDataConfigAccept(false);
                                                            setShowDataConfigurationModal(false);
                                                        }} autoFocus>Yes</button>
                                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                        onClick={() => setShowDataConfigAccept(false)}>No</button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Config Quit Modal */}
                                        {showDataConfigQuit && (
                                            <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/10">
                                                <div className="bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                                                    <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Quit?</div>
                                                    <div className="flex justify-around">
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => {
                                                                setShowDataConfigQuit(false);
                                                                setShowDataConfigurationModal(false);
                                                            }} autoFocus>Yes</button>
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => setShowDataConfigQuit(false)}>No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Exchange Configuration Modal Overlay */}
                    {showExchangeConfigModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans">
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Exchange Configuration</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowExchangeConfigModal(false)}>✕</span>
                            </div>
                            <div className="flex-1 relative">
                                <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <div className="bg-white p-6 shadow-2xl border border-[#2d819b] w-[700px] text-[13px] font-bold text-black font-sans relative" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-[14px]">Exchange Configuration</div>
                                        </div>
                                        <div className="border-t border-gray-300 mb-2"></div>

                                        <div className="bg-[#2d819b] text-white px-2 py-1 mb-2">List of Configurations</div>

                                        <div className="space-y-0.5" tabIndex={0} autoFocus onKeyDown={(e) => {
                                            if (e.key === 'Escape') setShowExchangeQuit(true);
                                        }}>
                                            <div className="mb-2 font-bold text-[#1d5b6e] border-b border-gray-300">GST Settings</div>
                                            <div className="flex justify-between items-center bg-[#feba35] cursor-pointer px-2 py-0.5">
                                                <label className="flex-1">GST Return Type for Download</label>
                                                <div className="flex items-center w-[200px]">
                                                    <input
                                                        type="text"
                                                        value="GSTR-2B"
                                                        className="w-full bg-transparent outline-none font-bold italic text-right"
                                                        readOnly />
                                                </div>
                                            </div>

                                            <div className="mb-2 mt-4 font-bold text-[#1d5b6e] border-b border-gray-300">Data Synchronisation</div>
                                            <div className="flex justify-between items-center hover:bg-[#ffe599] cursor-pointer px-2 py-0.5">
                                                <label className="flex-1">Client/Server configuration</label>
                                                <div className="flex items-center w-[200px]">
                                                    <input
                                                        type="text"
                                                        value="<Value exists>"
                                                        className="w-full bg-transparent outline-none font-bold italic text-right"
                                                        readOnly />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Quit Modal */}
                                        {showExchangeQuit && (
                                            <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/10">
                                                <div className="bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center">
                                                    <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Quit?</div>
                                                    <div className="flex justify-around">
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => { setShowExchangeQuit(false); setShowExchangeConfigModal(false); }} autoFocus>Yes</button>
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => setShowExchangeQuit(false)}>No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Print Report Modal (Others) */}
                    {showPrintReportModal && (
                        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[50px]">
                            {/* Background Overlay */}
                            <div className="fixed inset-0 bg-black/40" onClick={() => setShowPrintReportModal(false)}></div>

                            {/* Modal Content */}
                            <div className="relative bg-white shadow-2xl border border-[#2d819b] w-[700px] h-[500px] flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowPrintReportModal(false)}
                                    className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-black hover:bg-red-500 hover:text-white font-bold text-[18px] z-50 leading-none"
                                >
                                    ✕
                                </button>

                                {/* Header */}
                                <div className="bg-white p-2 text-center border-b border-gray-300">
                                    <div className="font-bold text-[14px] text-black mb-1">Print Report</div>
                                    <div className="px-8">
                                        <input
                                            type="text"
                                            value={printReportQuery}
                                            onChange={(e) => setPrintReportQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Escape') setShowPrintReportModal(false);
                                            }}
                                            className="w-full bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-blue-400"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* List Header */}
                                <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px] flex justify-between items-center">
                                    <span>List of Reports</span>
                                </div>

                                {/* Report List Content */}
                                <div className="flex-1 bg-[#e8f6fa] overflow-y-auto relative text-[13px] font-bold text-black p-2">
                                    {/* Right Options */}
                                    <div className="absolute top-0 right-0 p-1 bg-[#e8f6fa] flex flex-col items-end z-10 w-[150px]">
                                        <div
                                            className="cursor-pointer hover:underline text-right w-full px-2 py-[2px] hover:bg-[#dceef5]"
                                            onClick={() => setPrintReportExpanded(!printReportExpanded)}
                                        >{printReportExpanded ? 'Collapse All' : 'Expand All'}</div>
                                        <div
                                            className={`cursor-pointer hover:underline text-right w-full px-2 py-[2px] ${printReportShowMore ? 'bg-[#feba35] hover:bg-[#feba35]' : 'hover:bg-[#dceef5]'}`}
                                            onClick={() => setPrintReportShowMore(!printReportShowMore)}
                                        >{printReportShowMore ? 'Show Less' : 'Show More'}</div>
                                        <div
                                            className={`cursor-pointer hover:underline text-right w-full px-2 py-[2px] ${printReportShowInactive ? 'bg-[#feba35] hover:bg-[#feba35]' : 'hover:bg-[#dceef5]'}`}
                                            onClick={() => setPrintReportShowInactive(!printReportShowInactive)}
                                        >{printReportShowInactive ? 'Hide Inactive' : 'Show Inactive'}</div>
                                    </div>

                                    {/* Reports Tree */}
                                    <div className="mt-2 pl-2">
                                        {/* Dynamic Rendering Logic */}
                                        {/* VAT Reports */}
                                        <div className="mb-1">
                                            <div className="cursor-pointer hover:bg-[#dceef5] px-1">VAT Reports</div>
                                        </div>

                                        {/* Excise Reports - Only if Show More */}
                                        {(printReportShowMore) && (
                                            <div className="mb-1">
                                                <div className="cursor-pointer hover:bg-[#dceef5] px-1">Excise Manufacturer Reports</div>
                                                {(printReportExpanded) && (
                                                    <div className="pl-4">
                                                        <div className="cursor-pointer hover:bg-[#dceef5] px-1 text-gray-700">Excise Forms & Registers</div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Payroll */}
                                        <div className="mb-1">
                                            <div className="cursor-pointer hover:bg-[#dceef5] px-1">Payroll</div>
                                            {(printReportExpanded) && (
                                                <div className="pl-4">
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1 text-gray-700">Salary Payment Advice</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Payroll Statutory Reports - Only if Show More or if needed */}
                                        <div className="mb-1">
                                            <div className="cursor-pointer hover:bg-[#dceef5] px-1">Payroll Statutory Reports</div>
                                            {(printReportExpanded) && (
                                                <div className="pl-4 font-normal text-black">
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">PF Monthly Statement</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">PF Form 5</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">PF Form 10</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">PF Form 12A</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">PF Form 3A</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">PF Form 6A</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">ESI Monthly Statement</div>
                                                    {(printReportShowInactive) && (
                                                        <div className="cursor-pointer hover:bg-[#dceef5] px-1 flex justify-between text-gray-500">
                                                            <span>E-Return</span>
                                                            <span className="italic mr-20">ESI</span>
                                                        </div>
                                                    )}
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">Form 3</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">Form 5</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">Form 6</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">Professional Tax Computation</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">Professional Tax Statement</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">E-24Q</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">Form 24Q</div>
                                                    <div className="cursor-pointer hover:bg-[#dceef5] px-1">Annexure I to Form 24Q</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Print Configuration Modal */}
                    {showPrintConfigModal && (
                        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[50px]">
                            {/* Background Overlay */}
                            <div className="fixed inset-0 bg-black/40" onClick={() => setShowPrintConfigModal(false)}></div>

                            {/* Modal Content */}
                            <div className="relative bg-white shadow-2xl border border-[#2d819b] w-[700px] flex flex-col pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowPrintConfigModal(false)}
                                    className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-black hover:bg-red-500 hover:text-white font-bold text-[18px] z-50 leading-none"
                                >
                                    ✕
                                </button>

                                {/* Header */}
                                <div className="bg-white p-2 text-center border-b border-gray-300">
                                    <div className="font-bold text-[14px] text-black mb-1">Print Configuration</div>
                                    <div className="px-8">
                                        <input
                                            type="text"
                                            className="w-full bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-blue-400"
                                            placeholder="Search Configuration"
                                            value={printConfigQuery}
                                            onChange={(e) => setPrintConfigQuery(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* List Header */}
                                <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px] flex justify-between items-center">
                                    <span>List of Configurations</span>
                                </div>

                                {/* Configuration List Content */}
                                <div className="bg-[#e8f6fa] overflow-y-auto relative text-[13px] font-bold text-black p-2 h-[400px]">
                                    <div className="absolute top-0 right-0 p-1 bg-[#e8f6fa] z-10">
                                        <div
                                            className={`cursor-pointer hover:underline text-right w-full px-2 py-[2px] ${printConfigShowMore ? 'bg-[#feba35] hover:bg-[#feba35]' : 'hover:bg-[#dceef5]'}`}
                                            onClick={() => setPrintConfigShowMore(!printConfigShowMore)}
                                        >{printConfigShowMore ? 'Show Less' : 'Show More'}</div>
                                    </div>

                                    {/* Printer Settings */}
                                    {(!printConfigQuery || 'Printer Settings'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Printer'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Set Preview as default'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Enable Stripe View for Reports'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                        <div className="mb-2">
                                            <div className="font-bold text-black border-b border-gray-300 mb-1">Printer Settings</div>
                                            {(!printConfigQuery || 'Printer'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1">
                                                    <span>Printer</span>
                                                    <span className="italic underline underline-offset-2">{printConfigSettings.printer}</span>
                                                </div>
                                            )}
                                            {(!printConfigQuery || 'Set Preview as default'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div
                                                    className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                    onClick={() => togglePrintConfig('previewDefault')}
                                                >
                                                    <span>Set Preview as default</span>
                                                    <span className="italic">{printConfigSettings.previewDefault ? 'Yes' : 'No'}</span>
                                                </div>
                                            )}
                                            {(!printConfigQuery || 'Enable Stripe View for Reports'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div
                                                    className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                    onClick={() => togglePrintConfig('stripeView')}
                                                >
                                                    <span>Enable Stripe View for Reports</span>
                                                    <span className="italic">{printConfigSettings.stripeView ? 'Yes' : 'No'}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Header Information */}
                                    {(!printConfigQuery || 'Header Information'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Top Margin of Reports (in Inches)'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Show Date Range of Report'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Show Date and Time of Reports'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Show Date and Time of Voucher printing'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                        <div className="mb-2">
                                            <div className="font-bold text-black border-b border-gray-300 mb-1 mt-4">Header Information</div>
                                            {(!printConfigQuery || 'Top Margin of Reports (in Inches)'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1">
                                                    <span>Top Margin of Reports (in Inches)</span>
                                                    <span className="italic underline underline-offset-2">{printConfigSettings.topMargin}</span>
                                                </div>
                                            )}
                                            {(!printConfigQuery || 'Show Date Range of Report'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div
                                                    className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                    onClick={() => togglePrintConfig('dateRange')}
                                                >
                                                    <span>Show Date Range of Report</span>
                                                    <span className="italic">{printConfigSettings.dateRange ? 'Yes' : 'No'}</span>
                                                </div>
                                            )}
                                            {(!printConfigQuery || 'Show Date and Time of Reports'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div
                                                    className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                    onClick={() => togglePrintConfig('dateTimeReports')}
                                                >
                                                    <span>Show Date and Time of Reports</span>
                                                    <span className="italic">{printConfigSettings.dateTimeReports ? 'Yes' : 'No'}</span>
                                                </div>
                                            )}
                                            {(!printConfigQuery || 'Show Date and Time of Voucher printing'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div
                                                    className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                    onClick={() => togglePrintConfig('dateTimeVoucher')}
                                                >
                                                    <span>Show Date and Time of Voucher printing</span>
                                                    <span className="italic">{printConfigSettings.dateTimeVoucher ? 'Yes' : 'No'}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Company Details */}
                                    {(!printConfigQuery || 'Company Details'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Include company logo'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Show Company Name'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Show Company Address'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Show Phone No.'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Show Country Code for Mobile No.'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Show State Name'.toLowerCase().includes(printConfigQuery.toLowerCase()) || 'Show Country Name'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                        <div className="mb-2">
                                            <div className="font-bold text-black border-b border-gray-300 mb-1 mt-4">Company Details</div>
                                            {(!printConfigQuery || 'Include company logo'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div
                                                    className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                    onClick={() => togglePrintConfig('companyLogo')}
                                                >
                                                    <span>Include company logo (applicable to Print/Export/Share)</span>
                                                    <span className="italic">{printConfigSettings.companyLogo ? 'Yes' : 'No'}</span>
                                                </div>
                                            )}
                                            {(!printConfigQuery || 'Show Company Name'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div
                                                    className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                    onClick={() => togglePrintConfig('companyName')}
                                                >
                                                    <span>Show Company Name</span>
                                                    <span className="italic">{printConfigSettings.companyName ? 'Yes' : 'No'}</span>
                                                </div>
                                            )}
                                            {(!printConfigQuery || 'Show Company Address'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div
                                                    className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                    onClick={() => togglePrintConfig('companyAddress')}
                                                >
                                                    <span>Show Company Address</span>
                                                    <span className="italic">{printConfigSettings.companyAddress ? 'Yes' : 'No'}</span>
                                                </div>
                                            )}
                                            {(!printConfigQuery || 'Show Phone No.'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div
                                                    className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                    onClick={() => togglePrintConfig('phoneNo')}
                                                >
                                                    <span>Show Phone No.</span>
                                                    <span className="italic">{printConfigSettings.phoneNo ? 'Yes' : 'No'}</span>
                                                </div>
                                            )}
                                            {(!printConfigQuery || 'Show Country Code for Mobile No.'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                <div
                                                    className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                    onClick={() => togglePrintConfig('countryCode')}
                                                >
                                                    <span>Show Country Code for Mobile No.</span>
                                                    <span className="italic">{printConfigSettings.countryCode ? 'Yes' : 'No'}</span>
                                                </div>
                                            )}
                                            {(printConfigShowMore || printConfigQuery) && (
                                                <>
                                                    {(!printConfigQuery || 'Show State Name'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                        <div
                                                            className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                            onClick={() => togglePrintConfig('printState')}
                                                        >
                                                            <span>Show State Name</span>
                                                            <span className="italic">{printConfigSettings.printState ? 'Yes' : 'No'}</span>
                                                        </div>
                                                    )}
                                                    {(!printConfigQuery || 'Show Country Name'.toLowerCase().includes(printConfigQuery.toLowerCase())) && (
                                                        <div
                                                            className="flex justify-between items-center hover:bg-[#feba35] cursor-pointer px-1"
                                                            onClick={() => togglePrintConfig('printCountry')}
                                                        >
                                                            <span>Show Country Name</span>
                                                            <span className="italic">{printConfigSettings.printCountry ? 'Yes' : 'No'}</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Split Data Modal Overlay */}
                    {showSplitDataModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col font-sans">
                            <div className="flex justify-between items-center bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold h-[24px]">
                                <span>Split Company Data</span>
                                <span className="absolute left-1/2 transform -translate-x-1/2">{currentCompany || 'Solarica'}</span>
                                <span className="cursor-pointer hover:text-red-300 font-bold" onClick={() => setShowSplitDataModal(false)}>✕</span>
                            </div>
                            <div className="flex-1 relative">
                                <div className="absolute inset-0 bg-[#e8f6fa] opacity-20"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <div className="bg-white p-6 shadow-2xl border border-[#2d819b] w-[500px] font-sans relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                                        <div className="font-bold text-[14px] text-[#1d5b6e] mb-6 underline decoration-1 underline-offset-4">Split Company Data</div>

                                        <div className="w-full px-10">
                                            <div className="flex items-center mb-4">
                                                <label className="text-[13px] text-black w-[150px]">Company Name</label>
                                                <span className="font-bold text-black mr-4">:</span>
                                                <span className="font-bold text-[13px]">{currentCompany}</span>
                                            </div>

                                            <div className="flex items-center mb-6">
                                                <label className="text-[13px] text-black w-[150px]">Split from</label>
                                                <span className="font-bold text-black mr-4">:</span>
                                                <input
                                                    type="text"
                                                    defaultValue="1-Apr-25"
                                                    className="w-[100px] bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-transparent focus:border-blue-300"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') { setShowSplitAccept(true); (e.target as HTMLElement).blur(); }
                                                        if (e.key === 'Escape') {
                                                            if (showSplitAccept) setShowSplitAccept(false);
                                                            else setShowSplitQuit(true);
                                                        }
                                                    }} />
                                            </div>
                                        </div>

                                        {/* Accept/Quit Modals for Split */}
                                        {showSplitAccept && (
                                            <div className="absolute bottom-10 right-10 z-[70] bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                                                <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Accept?</div>
                                                <div className="flex justify-around">
                                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                        onClick={() => { setShowSplitAccept(false); setShowSplitDataModal(false); }} autoFocus>Yes</button>
                                                    <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                        onClick={() => setShowSplitAccept(false)}>No</button>
                                                </div>
                                            </div>
                                        )}
                                        {showSplitQuit && (
                                            <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/10">
                                                <div className="bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                                                    <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Quit?</div>
                                                    <div className="flex justify-around">
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => { setShowSplitQuit(false); setShowSplitDataModal(false); }} autoFocus>Yes</button>
                                                        <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                            onClick={() => setShowSplitQuit(false)}>No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Refactored Change Company Modal */}
                    {showChangeCompanyModal && (
                        <div className="absolute inset-0 z-[50] flex items-center justify-center bg-[#e8f6fa] bg-opacity-20 backdrop-blur-sm font-sans text-black" onClick={() => setShowChangeCompanyModal(false)}>
                            <div className="flex flex-col w-[450px] max-h-[500px] bg-[#e8f6fa] border border-[#2d819b] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                                <div className="bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold flex justify-between items-center text-center relative">
                                    <div className="flex-1 text-center">Change Company</div>
                                    <span className="absolute right-2 cursor-pointer hover:text-red-300" onClick={() => setShowChangeCompanyModal(false)}>✕</span>
                                </div>
                                <div className="p-2 bg-[#feba35] border-b border-black">
                                    <input
                                        type="text"
                                        className="w-full bg-transparent font-bold outline-none text-black placeholder-black/50 text-[13px] text-center"
                                        value={menuSearchQuery}
                                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                                        placeholder={currentCompany}
                                        autoFocus
                                        onKeyDown={(e) => { if (e.key === 'Escape') setShowChangeCompanyModal(false); }}
                                    />
                                </div>
                                <div className="flex bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold">
                                    <span>List of Companies</span>
                                </div>
                                <div className="flex-1 overflow-y-auto bg-white min-h-[200px]">
                                    {openCompanies.filter(c => c.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map((comp, idx) => (
                                        <div key={idx}
                                            className={`flex justify-between px-2 py-1 cursor-pointer text-[13px] border-b border-gray-100 ${comp.name === currentCompany ? 'bg-[#feba35] font-bold' : 'hover:bg-[#dceef5]'}`}
                                            onClick={() => {
                                                setCurrentCompany(comp.name);
                                                setShowChangeCompanyModal(false);
                                            }}
                                        >
                                            <span>{comp.name}</span>
                                            <span>({comp.number})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Refactored Select Company Modal */}
                    {showSelectCompanyModal && (
                        <div className="absolute inset-0 z-[50] flex flex-col items-center pt-10 bg-[#e8f6fa] font-sans text-black" onClick={() => setShowSelectCompanyModal(false)}>
                            <div className="w-[90%] flex flex-col h-[600px] border border-[#2d819b] shadow-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                                <div className="bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold flex justify-between items-center relative">
                                    <div className="flex-1 text-center">Select Company</div>
                                    <span className="cursor-pointer hover:text-red-300 absolute right-2" onClick={() => setShowSelectCompanyModal(false)}>✕</span>
                                </div>
                                <div className="bg-white p-2 border-b border-[#2d819b] flex flex-col items-center">
                                    <div className="text-[13px] font-bold text-[#2d819b] mb-1">Select Company</div>
                                    <input
                                        type="text"
                                        className="w-[400px] bg-[#feba35] border-b border-black outline-none px-1 text-[13px] font-bold placeholder-black/50 text-center"
                                        value={menuSearchQuery}
                                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                                        placeholder={currentCompany}
                                        autoFocus
                                        onKeyDown={(e) => { if (e.key === 'Escape') setShowSelectCompanyModal(false); }}
                                    />
                                </div>
                                <div className="bg-[#2d819b] text-white text-[12px] font-bold px-2 py-1 flex">
                                    <div className="w-[40%]">Name</div>
                                    <div className="w-[20%] text-center">Number</div>
                                    <div className="w-[40%] text-right">Period</div>
                                </div>
                                <div className="flex-1 overflow-y-auto bg-white">
                                    <div className="px-2 py-1 text-[12px] font-bold border-b border-gray-200 bg-gray-50">
                                        Path: C:\Users\Public\TallyPrime\data
                                    </div>
                                    {diskCompanies.filter(c => c.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map((comp, idx) => (
                                        <div key={idx}
                                            className={`flex px-2 py-1 cursor-pointer text-[13px] border-b border-gray-100 ${comp.name === selectCompanyHash ? 'bg-[#feba35] font-bold' : 'hover:bg-[#dceef5]'}`}
                                            onClick={() => {
                                                setSelectCompanyHash(comp.name);
                                                if (!openCompanies.find(c => c.name === comp.name)) {
                                                    setOpenCompanies(prev => [...prev, { name: comp.name, number: comp.number, period: comp.period || "" }]);
                                                }
                                                setCurrentCompany(comp.name);
                                                setShowSelectCompanyModal(false);
                                            }}
                                        >
                                            <div className="w-[40%] font-bold">{comp.name}</div>
                                            <div className="w-[20%] text-center italic font-normal">({comp.number})</div>
                                            <div className="w-[40%] text-right font-normal italic">{comp.period}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Refactored Shut Company Modal */}
                    {showShutCompanyModal && (
                        <div className="absolute inset-0 z-[50] flex items-center justify-center bg-[#e8f6fa] bg-opacity-20 backdrop-blur-sm font-sans text-black" onClick={() => setShowShutCompanyModal(false)}>
                            <div className="flex flex-col w-[450px] min-h-[400px] bg-[#e8f6fa] border border-[#2d819b] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                                <div className="bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold text-center border-b border-[#2d819b] relative">
                                    Shut Company
                                    <span className="absolute right-2 top-0 cursor-pointer hover:text-red-300" onClick={() => setShowShutCompanyModal(false)}>✕</span>
                                </div>
                                <div className="p-2 bg-[#feba35] border-b border-black">
                                    <input
                                        type="text"
                                        className="w-full bg-transparent font-bold outline-none text-black placeholder-black/50 text-[13px] text-center"
                                        value={menuSearchQuery}
                                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                                        placeholder={currentCompany}
                                        autoFocus
                                        onKeyDown={(e) => { if (e.key === 'Escape') setShowShutCompanyModal(false); }}
                                    />
                                </div>
                                <div className="flex bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold">
                                    <span>List of Companies</span>
                                </div>
                                <div className="flex-1 overflow-y-auto bg-white">
                                    {openCompanies.filter(c => c.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map((comp, idx) => (
                                        <div key={idx}
                                            className={`flex justify-between px-2 py-1 cursor-pointer text-[13px] border-b border-gray-100 hover:bg-[#dceef5]`}
                                            onClick={() => {
                                                setCompanyToShut(comp.name);
                                                setShowShutConfirmation(true);
                                                setShowShutCompanyModal(false);
                                            }}
                                        >
                                            <span>{comp.name}</span>
                                            <span>({comp.number})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shut Confirmation Modal */}
                    {showShutConfirmation && (
                        <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black/10 backdrop-blur-sm font-sans">
                            <div className="bg-white p-6 border border-[#2d819b] shadow-2xl w-[400px] text-center flex flex-col items-center gap-4">
                                <div className="text-[14px] font-bold text-[#1d5b6e]">Shut Company</div>
                                <div className="text-[13px] text-black">
                                    This will close all open Reports, Vouchers, and Masters without saving unsaved changes. <br />Do you want to shut the Company?
                                </div>
                                <div className="flex gap-6 w-full justify-center mt-2">
                                    <button
                                        className="px-4 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#2d819b] hover:text-white transition-colors"
                                        onClick={() => {
                                            const newOpen = openCompanies.filter(c => c.name !== companyToShut);
                                            setOpenCompanies(newOpen);
                                            if (currentCompany === companyToShut) {
                                                if (newOpen.length > 0) setCurrentCompany(newOpen[0].name);
                                                else setCurrentCompany('');
                                            }
                                            setShowShutConfirmation(false);
                                        }}
                                        autoFocus
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="px-4 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[13px] hover:bg-[#2d819b] hover:text-white transition-colors"
                                        onClick={() => setShowShutConfirmation(false)}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Refactored Repair Company Modal */}
                    {showRepairCompanyModal && (
                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-[#e8f6fa] bg-opacity-20 backdrop-blur-sm font-sans text-black" onClick={() => setShowRepairCompanyModal(false)}>
                            <div className="flex flex-col w-[600px] min-h-[500px] bg-[#e8f6fa] border border-[#2d819b] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                                <div className="bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold text-center border-b border-[#2d819b] relative">
                                    Repair Company
                                    <span className="absolute right-2 top-0 cursor-pointer hover:text-red-300" onClick={() => setShowRepairCompanyModal(false)}>✕</span>
                                </div>
                                <div className="p-2 bg-[#feba35] border-b border-black">
                                    <input
                                        type="text"
                                        className="w-full bg-transparent font-bold outline-none text-black placeholder-black/50 text-[13px] text-center"
                                        value={menuSearchQuery}
                                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                                        placeholder="Select Company to Repair"
                                        autoFocus
                                        onKeyDown={(e) => { if (e.key === 'Escape') setShowRepairCompanyModal(false); }}
                                    />
                                </div>
                                <div className="flex bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold justify-between">
                                    <span>List of Companies</span>
                                    <span>Number</span>
                                    <span>Period</span>
                                </div>
                                <div className="flex-1 overflow-y-auto bg-white font-mono text-[13px]">
                                    <div className="px-2 py-0.5 font-bold bg-gray-50 border-b">Data Path: C:\Users\Public\TallyPrime\data</div>
                                    {openCompanies.filter(c => c.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map((comp, idx) => (
                                        <div key={idx}
                                            className="flex justify-between px-2 py-1 cursor-pointer hover:bg-[#dceef5] border-b border-gray-100"
                                            onClick={() => {
                                                alert(`Repairing ${comp.name}...`);
                                                setShowRepairCompanyModal(false);
                                            }}
                                        >
                                            <div className="font-bold text-black">{comp.name}</div>
                                            <div>{comp.number}</div>
                                            <div>{comp.period}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TallyVault Modal */}
                    {showTallyVaultModal && (
                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/10 backdrop-blur-sm font-sans" onClick={() => setShowTallyVaultModal(false)}>
                            <div className="bg-white p-6 pt-4 border border-[#2d819b] w-[600px] shadow-2xl relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => setShowTallyVaultModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px]">✕</button>
                                <div className="font-bold text-[14px] text-[#2d819b] mb-1">TallyVault</div>
                                <div className="text-[11px] italic mb-1 text-center text-gray-600">TallyVault Password encrypts your Company Data.</div>
                                <div className="text-[11px] italic mb-6 text-center text-red-500">(If you forget your TallyVault Password, you will permanently lose access to your Company Data.)</div>

                                <div className="w-full px-10 flex flex-col gap-3">
                                    <div className="flex items-center">
                                        <label className="text-[13px] text-black w-[150px]">Company Name</label>
                                        <span className="font-bold text-black mr-4">:</span>
                                        <div className="relative flex-1">
                                            <input type="text"
                                                readOnly
                                                value={currentCompany}
                                                className="w-full bg-[#e8f6fa] border border-[#2d819b] px-2 py-0.5 text-[13px] font-bold text-black cursor-pointer hover:bg-[#dceef5]"
                                                onClick={() => { /* Toggle list if needed, usually auto-shows */ }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <label className="text-[13px] text-black w-[150px]">Password</label>
                                        <span className="font-bold text-black mr-4">:</span>
                                        <input
                                            type="password"
                                            className="w-[200px] bg-[#ffe599] font-bold text-[13px] px-1 outline-none text-black h-[24px] border border-transparent focus:border-blue-500"
                                            autoFocus
                                            onKeyDown={(e) => { if (e.key === 'Escape') setShowTallyVaultModal(false); }}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="text-[13px] text-black w-[150px]">Confirm Password</label>
                                        <span className="font-bold text-black mr-4">:</span>
                                        <input
                                            type="password"
                                            className="w-[200px] bg-[#ffe599] font-bold text-[13px] px-1 outline-none text-black h-[24px] border border-transparent focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Features List Modal */}
                    {showFeaturesListModal && (
                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-[#e8f6fa] bg-opacity-20 backdrop-blur-sm font-sans" onClick={() => setShowFeaturesListModal(false)}>
                            <div className="flex flex-col w-[450px] min-h-[400px] bg-[#e8f6fa] border border-[#2d819b] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                                <div className="bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold text-center border-b border-[#2d819b] relative">
                                    Company for Features
                                    <span className="absolute right-2 top-0 cursor-pointer hover:text-red-300" onClick={() => setShowFeaturesListModal(false)}>✕</span>
                                </div>
                                <div className="p-2 bg-[#feba35] border-b border-black">
                                    <input
                                        type="text"
                                        className="w-full bg-transparent font-bold outline-none text-black placeholder-black/50 text-[13px] text-center"
                                        value={menuSearchQuery}
                                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                                        placeholder={currentCompany}
                                        autoFocus
                                        onKeyDown={(e) => { if (e.key === 'Escape') setShowFeaturesListModal(false); }}
                                    />
                                </div>
                                <div className="flex bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold">
                                    <span>List of Companies</span>
                                </div>
                                <div className="flex-1 overflow-y-auto bg-white">
                                    {openCompanies.filter(c => c.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map((comp, idx) => (
                                        <div key={idx}
                                            className={`flex justify-between px-2 py-1 cursor-pointer text-[13px] border-b border-gray-100 hover:bg-[#dceef5]`}
                                            onClick={() => {
                                                setCurrentCompany(comp.name);
                                                setShowFeaturesModal(true);
                                                setShowFeaturesListModal(false);
                                            }}
                                        >
                                            <span>{comp.name}</span>
                                            <span>({comp.number})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security List Modal */}
                    {showSecurityListModal && (
                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-[#e8f6fa] bg-opacity-20 backdrop-blur-sm font-sans" onClick={() => setShowSecurityListModal(false)}>
                            <div className="flex flex-col w-[450px] min-h-[400px] bg-[#e8f6fa] border border-[#2d819b] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                                <div className="bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold text-center border-b border-[#2d819b] relative">
                                    Company for Security
                                    <span className="absolute right-2 top-0 cursor-pointer hover:text-red-300" onClick={() => setShowSecurityListModal(false)}>✕</span>
                                </div>
                                <div className="p-2 bg-[#feba35] border-b border-black">
                                    <input type="text"
                                        className="w-full bg-transparent font-bold outline-none text-black placeholder-black/50 text-[13px] text-center"
                                        value={menuSearchQuery}
                                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                                        placeholder={currentCompany}
                                        autoFocus
                                        onKeyDown={(e) => { if (e.key === 'Escape') setShowSecurityListModal(false); }}
                                    />
                                </div>
                                <div className="flex bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold">
                                    <span>List of Companies</span>
                                </div>
                                <div className="flex-1 overflow-y-auto bg-white">
                                    {openCompanies.filter(c => c.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map((comp, idx) => (
                                        <div key={idx}
                                            className={`flex justify-between px-2 py-1 cursor-pointer text-[13px] border-b border-gray-100 hover:bg-[#dceef5]`}
                                            onClick={() => {
                                                setCurrentCompany(comp.name);
                                                setShowSecurityListModal(false);
                                                setShowSecurityAccessModal(true);
                                            }}
                                        >
                                            <span>{comp.name}</span>
                                            <span>({comp.number})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Access Modal */}
                    {showSecurityAccessModal && (
                        <div className="absolute inset-0 z-[65] flex items-center justify-center bg-black/10 backdrop-blur-sm font-sans" onClick={() => setShowSecurityAccessModal(false)}>
                            <div className="bg-white p-6 shadow-2xl border border-[#2d819b] w-[600px] relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => setShowSecurityAccessModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px]">✕</button>
                                <div className="font-bold text-[14px] text-[#2d819b] mb-6 underline decoration-1 underline-offset-4">Security And User Access</div>

                                <div className="w-full px-10">
                                    <div className="flex items-center mb-4">
                                        <label className="text-[13px] text-black w-[250px]">Company Name</label>
                                        <span className="font-bold text-black mr-4">:</span>
                                        <span className="font-bold text-[13px]">{currentCompany}</span>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <label className="text-[13px] text-black w-[250px]">Control User Access to Company Data</label>
                                        <span className="font-bold text-black mr-4">:</span>
                                        <input
                                            type="text"
                                            value={securityControl}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val.toLowerCase() === 'y') setSecurityControl('Yes');
                                                else if (val.toLowerCase() === 'n') setSecurityControl('No');
                                                else setSecurityControl(val);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const form = e.currentTarget.closest('.w-full');
                                                    const nextInput = form?.querySelector('input[name="securityEmail"]') as HTMLElement;
                                                    if (nextInput) nextInput.focus();
                                                }
                                            }}
                                            className="w-[100px] bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-transparent focus:border-blue-300"
                                            autoFocus />
                                    </div>
                                    <div className="flex items-center mb-6">
                                        <label className="text-[13px] text-black w-[250px]">E-mail ID for Browser Access</label>
                                        <span className="font-bold text-black mr-4">:</span>
                                        <input
                                            name="securityEmail"
                                            type="text"
                                            value={securityEmail}
                                            onChange={(e) => setSecurityEmail(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    setShowSecurityAccept(true);
                                                    (e.target as HTMLElement).blur();
                                                }
                                                if (e.key === 'Escape') {
                                                    if (showSecurityAccept) setShowSecurityAccept(false);
                                                    else setShowSecurityQuit(true);
                                                }
                                            }}
                                            className="w-[200px] bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-transparent focus:border-blue-300" />
                                    </div>
                                </div>

                                {/* Security Accept Modal */}
                                {showSecurityAccept && (
                                    <div className="absolute bottom-10 right-10 z-[70] bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                                        <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Accept?</div>
                                        <div className="flex justify-around">
                                            <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                onClick={() => { setShowSecurityAccept(false); setShowSecurityAccessModal(false); }} autoFocus>Yes</button>
                                            <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                onClick={() => setShowSecurityAccept(false)}>No</button>
                                        </div>
                                    </div>
                                )}
                                {/* Security Quit Modal */}
                                {showSecurityQuit && (
                                    <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/10">
                                        <div className="bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans">
                                            <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Quit?</div>
                                            <div className="flex justify-around">
                                                <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                    onClick={() => { setShowSecurityQuit(false); setShowSecurityAccessModal(false); }} autoFocus>Yes</button>
                                                <button className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                                    onClick={() => setShowSecurityQuit(false)}>No</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Online Access List Modal */}
                    {showOnlineAccessListModal && (
                        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-[#e8f6fa] bg-opacity-20 backdrop-blur-sm font-sans" onClick={() => setShowOnlineAccessListModal(false)}>
                            <div className="flex flex-col w-[450px] min-h-[400px] bg-[#e8f6fa] border border-[#2d819b] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                                <div className="bg-[#2d819b] text-white px-2 py-1 text-[13px] font-bold text-center border-b border-[#2d819b] relative">
                                    Company for Online Access
                                    <span className="absolute right-2 top-0 cursor-pointer hover:text-red-300" onClick={() => setShowOnlineAccessListModal(false)}>✕</span>
                                </div>
                                <div className="p-2 bg-[#feba35] border-b border-black">
                                    <input type="text"
                                        className="w-full bg-transparent font-bold outline-none text-black placeholder-black/50 text-[13px] text-center"
                                        value={menuSearchQuery}
                                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                                        placeholder={currentCompany}
                                        autoFocus
                                        onKeyDown={(e) => { if (e.key === 'Escape') setShowOnlineAccessListModal(false); }}
                                    />
                                </div>
                                <div className="flex bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold">
                                    <span>List of Companies</span>
                                </div>
                                <div className="flex-1 overflow-y-auto bg-white">
                                    {openCompanies.filter(c => c.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map((comp, idx) => (
                                        <div key={idx}
                                            className={`flex justify-between px-2 py-1 cursor-pointer text-[13px] border-b border-gray-100 hover:bg-[#dceef5]`}
                                            onClick={() => {
                                                setCurrentCompany(comp.name);
                                                setShowOnlineAccessListModal(false);
                                            }}
                                        >
                                            <span>{comp.name}</span>
                                            <span>({comp.number})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Sidebar */}
                <TallySidebar>
                    {showExportCurrentModal ? (
                        <>
                            <SidebarButton keyName="F2" label="" disabled />
                            <SidebarButton keyName="F3" label="" disabled />
                            <SidebarButton keyName="F4" label="" disabled />
                            <div className="h-2"></div>
                            <SidebarButton keyName="F5" label=": No. of Copies" disabled />
                            <SidebarButton keyName="F6" label=": Export to" onClick={() => { }} />
                            <SidebarButton keyName="F7" label=": Title" disabled />
                            <SidebarButton keyName="F8" label=": File Format" onClick={() => { }} />
                            <SidebarButton keyName="F9" label="" disabled />
                            <SidebarButton keyName="F10" label="" disabled />
                            <div className="flex-1"></div>
                            <SidebarButton keyName="F12" label=": Configure" onClick={() => { }} />
                        </>
                    ) : showPrintModal ? (
                        <>
                            <SidebarButton keyName="F2" label="" disabled />
                            <SidebarButton keyName="F3" label="" disabled />
                            <SidebarButton keyName="F4" label="" disabled />
                            <SidebarButton keyName="F5" label=": No. of Copies" onClick={() => { setShowPrinterSelect(false); setShowTitleConfig(false); setShowPrintFormat(false); setShowPagesToPrint(false); setShowPrintCopies(true); }} />
                            <SidebarButton keyName="F6" label=": Printer" onClick={() => { setShowPrintCopies(false); setShowTitleConfig(false); setShowPrintFormat(false); setShowPagesToPrint(false); setShowPrinterSelect(true); }} />
                            <SidebarButton keyName="F7" label=": Title" onClick={() => { setShowPrintCopies(false); setShowPrinterSelect(false); setShowPrintFormat(false); setShowPagesToPrint(false); setShowTitleConfig(true); }} />
                            <SidebarButton keyName="F8" label=": Print Format" onClick={() => { setShowPrintCopies(false); setShowPrinterSelect(false); setShowTitleConfig(false); setShowPagesToPrint(false); setShowPrintFormat(true); }} />
                            <SidebarButton keyName="F9" label=": Plain Paper" />
                            <SidebarButton keyName="F10" label=": Pages to Print" onClick={() => { setShowPrintCopies(false); setShowPrinterSelect(false); setShowTitleConfig(false); setShowPrintFormat(false); setShowPagesToPrint(true); }} />
                            <div className="flex-1"></div>
                            <SidebarButton keyName="F12" label=": Configure" onClick={() => { }} />
                        </>
                    ) : (
                        <>
                            {/* Date Period Group - F2 & F3 */}
                            <>
                                <SidebarButton keyName="F2" label=": Period" onClick={() => setShowPeriodModal(true)} />
                                <SidebarButton keyName="F3" label=": Company" onClick={() => setShowCompanyModal(true)} />
                            </>

                            {/* Middle Section - Context Sensitive */}
                            {showEInvoicingModal ? (
                                <>
                                    <SidebarButton keyName="F4" label="" disabled />
                                    <SidebarButton keyName="F5" label=": e-Invoice" />
                                    <SidebarButton keyName="F6" label="" disabled />
                                    <SidebarButton keyName="F7" label="" disabled />
                                    <SidebarButton keyName="F8" label="" disabled />
                                    <SidebarButton keyName="F9" label="" disabled />
                                    <SidebarButton keyName="F10" label="" disabled />
                                </>
                            ) : showEWayBillModal ? (
                                <>
                                    <SidebarButton keyName="F4" label="" disabled />
                                    <SidebarButton keyName="F5" label=": e-Way Bill" />
                                    <SidebarButton keyName="F6" label="" disabled />
                                    <SidebarButton keyName="F7" label="" disabled />
                                    <SidebarButton keyName="F8" label="" disabled />
                                    <SidebarButton keyName="F9" label="" disabled />
                                    <SidebarButton keyName="F10" label="" disabled />
                                </>
                            ) : showGetBalanceModal ? (
                                <>
                                    <SidebarButton keyName="F4" label="" disabled />
                                    <SidebarButton keyName="F5" label="" disabled />
                                    <SidebarButton keyName="F6" label="" disabled />
                                    <SidebarButton keyName="F7" label="" disabled />
                                    <SidebarButton keyName="F8" label="" disabled />
                                    <SidebarButton keyName="F9" label="" disabled />
                                    <SidebarButton keyName="F10" label="" disabled />
                                </>
                            ) : showFeaturesModal ? (
                                <>
                                    <SidebarButton keyName="F4" label="" disabled />
                                    <SidebarButton keyName="F5" label="" disabled />
                                    <SidebarButton keyName="F6" label="" disabled />
                                    <SidebarButton keyName="F7" label="" disabled />
                                    <SidebarButton keyName="F8" label="" disabled />
                                    <SidebarButton keyName="F9" label="" disabled />
                                    <SidebarButton keyName="F10" label="" disabled />
                                    <SidebarButton keyName="I" label=": More Details" onClick={() => setShowMoreDetailsModal(true)} />
                                </>
                            ) : showImportMastersModal || showImportTransactionsModal ? (
                                <>
                                    <SidebarButton keyName="F4" label="" disabled />
                                    <SidebarButton keyName="F5" label="" disabled />
                                    <SidebarButton keyName="F6" label="" disabled />
                                    <SidebarButton keyName="F7" label="" disabled />
                                    <SidebarButton keyName="F8" label="" disabled />
                                    <SidebarButton keyName="F9" label="" disabled />
                                    <SidebarButton keyName="F10" label="" disabled />
                                    <div className="h-4"></div>
                                    <SidebarButton keyName="L" label="Sample Excel File" />
                                </>
                            ) : (
                                <>
                                    <SidebarButton keyName="F4" label="" disabled />
                                    <SidebarButton keyName="F5" label="" disabled />
                                    <SidebarButton keyName="F6" label="" disabled />
                                    <SidebarButton keyName="F7" label="" disabled />
                                    <SidebarButton keyName="F8" label="" disabled />
                                    <SidebarButton keyName="F9" label="" disabled />
                                    <SidebarButton keyName="F10" label="Other Masters" onClick={() => setShowOtherMastersModal(true)} />
                                    {showImportBankDetailsModal && (
                                        <>
                                            <div className="h-[1px] bg-[#99c7d6] w-full my-1"></div>
                                            <SidebarButton keyName="L" label="Payee Sample file" onClick={() => {
                                                setExportSampleFileName('Ledger Bank Details.xlsx');
                                                setShowExportSampleFileModal(true);
                                            }} />
                                            <SidebarButton keyName="O" label="Emp. Sample file" onClick={() => {
                                                setExportSampleFileName('Employee Bank Details.xlsx');
                                                setShowExportSampleFileModal(true);
                                            }} />
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* Change Period Modal */}
                    {showPeriodModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
                            <div className="bg-white px-8 py-6 shadow-[0_0_20px_rgba(0,0,0,0.2)] border border-[#888] w-[320px] pointer-events-auto relative">
                                <button
                                    onClick={() => setShowPeriodModal(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none"
                                >
                                    ✕
                                </button>
                                <div className="text-center font-bold text-[13px] underline decoration-1 underline-offset-2 mb-6 text-black">Change Period</div>

                                <div className="flex items-center mb-2">
                                    <label className="text-[13px] font-bold w-[40px] text-black text-left">From</label>
                                    <span className="font-bold text-black mx-4">:</span>
                                    <input
                                        type="text"
                                        value={periodFrom}
                                        onChange={(e) => setPeriodFrom(e.target.value)}
                                        className="flex-1 bg-[#ffe599] font-bold text-[13px] px-1 h-[22px] outline-none text-black border border-transparent selection:bg-blue-300"
                                        autoFocus />
                                </div>

                                <div className="flex items-center">
                                    <label className="text-[13px] font-bold w-[40px] text-black text-left">To</label>
                                    <span className="font-bold text-black mx-4">:</span>
                                    <input
                                        type="text"
                                        value={periodTo}
                                        onChange={(e) => setPeriodTo(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') setShowPeriodModal(false);
                                            if (e.key === 'Escape') setShowPeriodModal(false);
                                        }}
                                        className="flex-1 bg-white font-bold text-[13px] px-1 h-[22px] outline-none text-black border border-transparent focus:bg-[#ffe599]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Change Company Modal */}
                    {showCompanyModal && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20" onClick={() => setShowCompanyModal(false)}>
                            <div className="flex flex-col w-[500px] shadow-2xl border border-[#2d819b] font-sans relative" onClick={(e) => e.stopPropagation()}>
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowCompanyModal(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] z-50 leading-none"
                                >
                                    ✕
                                </button>

                                {/* Header */}
                                <div className="bg-white p-3 pt-2 text-center border-b border-gray-300">
                                    <div className="font-bold text-[13px] text-black mb-1 underline decoration-1 underline-offset-2">Change Company</div>
                                    <input
                                        type="text"
                                        value={companyQuery}
                                        onChange={(e) => setCompanyQuery(e.target.value)}
                                        className="w-full bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-gray-400"
                                        autoFocus />
                                </div>

                                {/* List Header */}
                                <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px]">
                                    List of Companies
                                </div>

                                {/* List Body */}
                                <div className="bg-[#e8f6fa] h-[400px] relative overflow-y-auto">
                                    {/* Right Aligned Options */}
                                    <div className="absolute right-0 top-0 p-2 text-right text-[13px] text-black font-bold z-10 flex flex-col gap-1 items-end">
                                        <div className="cursor-pointer hover:bg-[#dceef5] px-2 w-fit">Create Company</div>
                                        <div className="cursor-pointer hover:bg-[#dceef5] px-2 w-fit">Select Company</div>
                                        <div className="cursor-pointer hover:bg-[#dceef5] px-2 w-fit">Shut Company</div>
                                    </div>

                                    {/* List Items */}
                                    <div className="mt-[70px]">
                                        {openCompanies.map((comp, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex justify-between px-4 py-[2px] cursor-pointer border-b border-transparent ${comp.name === currentCompany ? 'bg-[#feba35] text-black font-bold hover:bg-[#feba35]' : 'hover:bg-[#dceef5]'}`}
                                                onClick={() => {
                                                    setCurrentCompany(comp.name);
                                                    // Optionally close list or navigate if this is a selection screen
                                                }}
                                            >
                                                <span>{comp.name}</span>
                                                <span>({comp.number})</span>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}



                    {/* Other Masters Modal */}
                    {showOtherMastersModal && (
                        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[40px] bg-black/20" onClick={() => setShowOtherMastersModal(false)}>
                            <div className="flex flex-col w-[350px] shadow-2xl border border-[#2d819b] font-sans relative" onClick={(e) => e.stopPropagation()}>
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowOtherMastersModal(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] z-50 leading-none"
                                >
                                    ✕
                                </button>

                                {/* Header */}
                                <div className="bg-white p-3 pt-2 text-center border-b border-gray-300">
                                    <div className="font-bold text-[13px] text-[#2d819b] mb-1">Chart of Accounts</div>
                                    <input
                                        type="text"
                                        value={otherMastersQuery}
                                        onChange={(e) => setOtherMastersQuery(e.target.value)}
                                        className="w-full bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-gray-400"
                                        autoFocus />
                                </div>

                                {/* List Header */}
                                <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px] flex justify-between items-center">
                                    <span>List of Masters</span>
                                    <div className="flex gap-4 text-[10px] items-center">
                                        <span className="hover:underline cursor-pointer">Change Company</span>
                                        <span className="hover:underline cursor-pointer">Show More</span>
                                    </div>
                                </div>

                                {/* List Body */}
                                <div className="bg-[#e8f6fa] h-[500px] relative overflow-y-auto text-[13px] text-black font-bold">
                                    {/* Top Actions REMOVED as they are in the header bar now */}

                                    {/* List Sections */}
                                    <div className="mt-2">
                                        <div className="px-2 text-[#2d819b] text-center border-b border-gray-200 pb-1 mb-2">Accounting Masters</div>
                                        <div className="px-4">
                                            <div
                                                className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer"
                                                onClick={() => { setViewMode('list'); setShowOtherMastersModal(false); }}
                                            >Group</div>
                                            <div
                                                className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer"
                                                onClick={() => { setViewMode('ledgerList'); setShowOtherMastersModal(false); }}
                                            >Ledger</div>
                                            <div className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer">Currency</div>
                                            <div className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer">Voucher Type</div>
                                        </div>

                                        <div className="px-2 text-[#2d819b] mt-4 text-center border-b border-gray-200 pb-1 mb-2">Inventory Masters</div>
                                        <div className="px-4">
                                            <div className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer">Stock Group</div>
                                            <div className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer">Stock Category</div>
                                            <div className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer">Stock Item</div>
                                            <div className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer">Unit</div>
                                            <div className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer">Godown</div>
                                        </div>

                                        <div className="px-2 text-[#2d819b] mt-4 text-center border-b border-gray-200 pb-1 mb-2">Statutory Masters</div>
                                        <div className="px-4">
                                            <div className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer">GST Registration</div>
                                            <div className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer">GST Classification</div>
                                        </div>

                                        <div className="px-2 text-[#2d819b] mt-4 text-center border-b border-gray-200 pb-1 mb-2">Statutory Details</div>
                                        <div className="px-4 mb-4">
                                            <div className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer">Company GST Details</div>
                                            <div className="px-2 py-[2px] hover:bg-[#dceef5] cursor-pointer">PAN/CIN Details</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!showExportCurrentModal && (
                        <div className="h-2"></div>
                    )}

                    {/* View Options Group */}
                    {!showExportCurrentModal && (
                        <>
                            {showEWayBillModal || showEInvoicingModal || showGetBalanceModal ? (
                                <>
                                    <SidebarButton keyName="B" label=": Basis of Values" underline="double" />
                                    <SidebarButton keyName="H" label=": Change View" underline="double" />
                                    <SidebarButton keyName="J" label=": Exception Reports" underline="double" />
                                    <SidebarButton keyName="F3" label=": Company" onClick={() => setShowCompanyModal(true)} disabled={showEInvoicingModal || showEWayBillModal || showGetBalanceModal || showImportMastersModal || showImportTransactionsModal || showBackupModal || showRestoreModal || showRepairCompanyModal || showMigrateCompanyModal || showSplitDataModal || showDataConfigurationModal || showExchangeConfigModal || showTDLManagementModal || showAboutPageModal || showUpgradeModal || showPrintModal || showExportCurrentModal} />
                                    <SidebarButton keyName="L" label=": Save View" underline="double" />
                                </>
                            ) : showImportMastersModal || showImportTransactionsModal || showBackupModal || showRestoreModal || showRepairCompanyModal || showMigrateCompanyModal || showSplitDataModal || showDataConfigurationModal || showExchangeConfigModal || showPrintModal ? (
                                <>
                                    <SidebarButton keyName="B" label="Basis of Values" underline="double" disabled />
                                    <SidebarButton keyName="H" label="Multi-Masters" underline="double" disabled />
                                    <SidebarButton keyName="J" label="Exception Reports" underline="double" disabled />
                                </>
                            ) : (
                                <>
                                    <SidebarButton keyName="B" label="Basis of Values" underline="double" disabled />
                                    <SidebarButton keyName="H" label="Multi-Masters" underline="double" onClick={() => setShowMultiMastersModal(true)} />
                                    <SidebarButton keyName="J" label="Exception Reports" underline="double" onClick={() => setShowExceptionReportsModal(true)} />
                                </>
                            )}
                        </>
                    )}

                    {/* Multi-Masters ("H") Modal */}
                    {showMultiMastersModal && (
                        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[60px] bg-black/20" onClick={() => setShowMultiMastersModal(false)}>
                            <div className="flex flex-col w-[350px] shadow-2xl border border-[#2d819b] font-sans relative" onClick={(e) => e.stopPropagation()}>
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowMultiMastersModal(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] z-50 leading-none"
                                >
                                    ✕
                                </button>

                                {/* Header */}
                                <div className="bg-white p-3 pt-2 text-center border-b border-gray-300">
                                    <div className="font-bold text-[13px] text-black mb-1 underline decoration-1 underline-offset-2">Multi-Masters</div>
                                    <input
                                        type="text"
                                        value={multiMasterQuery}
                                        onChange={(e) => setMultiMasterQuery(e.target.value)}
                                        className="w-full bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-gray-400"
                                        autoFocus />
                                </div>

                                {/* List Header */}
                                <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px]">
                                    List of Multi-Masters
                                </div>

                                {/* List Body */}
                                <div className="bg-[#e8f6fa] h-[150px] relative overflow-y-auto text-[13px] text-black font-bold">
                                    <div className="mt-2 text-black">
                                        <div className="px-4 py-[2px] cursor-pointer bg-[#feba35] hover:bg-[#feba35] w-full block">Multi Create</div>
                                        <div className="px-4 py-[2px] cursor-pointer hover:bg-[#dceef5]">Multi Alter</div>
                                        <div className="px-4 py-[2px] cursor-pointer hover:bg-[#dceef5]">GST Rate Setup</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Exception Reports Modal */}
                    {showExceptionReportsModal && (
                        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[60px] bg-black/20" onClick={() => setShowExceptionReportsModal(false)}>
                            <div className="flex flex-col w-[350px] shadow-2xl border border-[#2d819b] font-sans relative" onClick={(e) => e.stopPropagation()}>
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowExceptionReportsModal(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] z-50 leading-none"
                                >
                                    ✕
                                </button>

                                {/* Header */}
                                <div className="bg-white p-3 pt-2 text-center border-b border-gray-300">
                                    <div className="font-bold text-[13px] text-black mb-1 underline decoration-1 underline-offset-2">Exception Reports</div>
                                    <input
                                        type="text"
                                        value={exceptionQuery}
                                        onChange={(e) => setExceptionQuery(e.target.value)}
                                        className="w-full bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-gray-400"
                                        autoFocus />
                                </div>

                                {/* List Header */}
                                <div className="bg-[#2d819b] text-white font-bold px-2 py-1 text-[13px]">
                                    List of Exception Reports
                                </div>

                                {/* List Body */}
                                <div className="bg-[#e8f6fa] h-[150px] relative overflow-y-auto text-[13px] text-black font-bold">
                                    <div className="mt-2">
                                        <div className="flex justify-between px-4 py-[2px] bg-[#feba35] text-black font-bold cursor-pointer hover:bg-[#feba35] border-b border-transparent">
                                            <span>Show Unused</span>
                                        </div>
                                        <div className="flex justify-between px-4 py-[2px] cursor-pointer hover:bg-[#dceef5] border-b border-transparent">
                                            <span>Show Used</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!showPrintModal && !showExportCurrentModal && (
                        <>
                            <SidebarButton keyName="L" label="Save View" underline="double" onClick={() => setShowSaveViewModal(true)} />
                            <SidebarButton keyName="F" label="Apply Filter" underline="double" onClick={() => setShowFilterModal(true)} />
                        </>
                    )}

                    {/* Save View Modal */}
                    {showSaveViewModal && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20" onClick={() => setShowSaveViewModal(false)}>
                            <div className="bg-white p-8 px-12 shadow-2xl border border-gray-400 w-[600px] h-[350px] relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowSaveViewModal(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none"
                                >
                                    ✕
                                </button>

                                <div className="text-center font-bold text-[16px] underline decoration-1 underline-offset-4 mb-10 text-black">Save View</div>

                                <div className="w-full">
                                    <div className="flex items-center mb-6">
                                        <label className="text-[13px] text-black w-[200px]">Name</label>
                                        <span className="font-bold text-black mr-4">:</span>
                                        <input
                                            type="text"
                                            value={saveViewName}
                                            onChange={(e) => setSaveViewName(e.target.value)}
                                            className="flex-1 bg-[#ffe599] font-bold text-[13px] px-1 h-[24px] outline-none text-black border border-blue-300"
                                            autoFocus />
                                    </div>

                                    <div className="flex items-center">
                                        <label className="text-[13px] text-black w-[200px]">Show additional configuration</label>
                                        <span className="font-bold text-black mr-4">:</span>
                                        <div
                                            className="font-bold text-black cursor-pointer"
                                            onClick={() => setShowConfiguration(prev => prev === 'No' ? 'Yes' : 'No')}
                                        >
                                            {showConfiguration}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Basic Filter Modal */}
                    {showFilterModal && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-transparent" onClick={() => setShowFilterModal(false)}>
                            <div className="bg-white p-6 shadow-[0_0_20px_rgba(0,0,0,0.2)] border border-[#888] w-[400px] relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none"
                                >
                                    ✕
                                </button>

                                <div className="text-center font-bold text-[13px] underline decoration-1 underline-offset-2 mb-6 text-black">Basic Filter</div>

                                <div className="mb-2 flex items-center">
                                    <label className="text-[13px] text-black w-[100px]">Apply Filter on</label>
                                    <span className="font-bold text-black mr-4">:</span>
                                    <span className="font-bold text-[13px] text-black">Group</span>
                                </div>

                                <div className="flex items-center">
                                    <label className="text-[13px] text-black w-[100px]">Look for</label>
                                    <span className="font-bold text-black mr-4">:</span>
                                    <input
                                        type="text"
                                        value={filterLookFor}
                                        onChange={(e) => setFilterLookFor(e.target.value)}
                                        className="flex-1 bg-[#ffe599] font-bold text-[13px] px-1 h-[22px] outline-none text-black border border-transparent selection:bg-blue-300"
                                        autoFocus />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="h-2"></div>

                    {/* Master Group */}
                    {!showPrintModal && !showExportCurrentModal && (
                        <SidebarButton keyName="H" label="Multi-Masters" underline="single" onClick={() => setShowMultiMastersModal(true)} />
                    )}

                    <div className="flex-1"></div>
                </TallySidebar>

            </div>

            {/* Footer Area - Fixed at bottom */}
            <TallyFooter countInfo="28 Group(s)">
                {!showFeaturesModal && !showExportCurrentModal ? (
                    <>
                        <FooterItem keyName="Enter" label="Alter" onClick={() => handleRowDoubleClick(selectedIndex)} />
                        <FooterItem keyName="Space" label="Select" onClick={() => { }} />
                        <FooterItem keyName="Q" label="Quit" onClick={handleQuit} />
                        <FooterEmptyItem />
                        <FooterItem keyName="C" label="Create Master" onClick={handleCreate} />
                        <FooterEmptyItem />
                        <FooterItem keyName="D" label="Delete" onClick={handleDelete} />
                        <FooterEmptyItem />
                        <FooterItem keyName="R" label="Remove Line" onClick={handleRemoveLine} />
                        <FooterItem keyName="U" label="Restore Line" onClick={handleRestoreLine} />
                        <FooterItem keyName="F12" label="Configure" icon="<" onClick={() => setShowMainF12Modal(true)} />
                    </>
                ) : showExportCurrentModal ? (
                    <>
                        <FooterItem keyName="Q" label="Quit" onClick={() => setShowExportCurrentModal(false)} />
                        <div className="flex-1"></div>
                        <FooterItem keyName="F12" label="Configure" icon="<" onClick={() => { }} />
                    </>
                ) : (
                    <>
                        <FooterItem keyName="Q" label="Quit" onClick={() => setShowFeaturesModal(false)} />
                        <FooterEmptyItem />
                        <FooterItem keyName="A" label="Accept" onClick={() => setShowFeaturesModal(false)} />
                        <FooterEmptyItem />
                        <div className="flex-1"></div>
                        <FooterItem keyName="F12" label="Configure" icon="<" onClick={() => { }} />
                    </>
                )}
            </TallyFooter>

            {/* Connect Error Modal */}
            {
                showConnectErrorModal && (
                    <div className="fixed bottom-10 right-10 z-[80] bg-white border border-red-500 shadow-2xl w-[250px] font-sans animate-bounce"
                        onClick={() => setShowConnectErrorModal(false)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape' || e.key === 'Enter') setShowConnectErrorModal(false);
                        }}
                        autoFocus
                    >
                        <button className="absolute top-1 right-1 text-gray-500 hover:text-red-500 font-bold text-[14px] leading-none" onClick={() => setShowConnectErrorModal(false)}>✕</button>
                        <div className="text-center border-b border-red-200 py-1">
                            <span className="text-red-500 font-bold text-[13px]">Error</span>
                        </div>
                        <div className="p-4 text-center">
                            <div className="font-bold text-black mb-2 text-[14px]">Oops!</div>
                            <div className="text-[12px] text-black">
                                <div>Cannot connect in Educational Mode.</div>
                                <div>Activate the license and try again.</div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Quit Confirmation Modal */}
            {
                showQuitModal && (
                    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/20" onClick={() => setShowQuitModal(false)}>
                        <div className="bg-[#dceef5] border-[2px] border-[#2d819b] shadow-2xl p-4 w-[200px] text-center font-sans relative" onClick={(e) => e.stopPropagation()}>
                            <button className="absolute top-1 right-1 text-gray-500 hover:text-red-500 font-bold text-[14px] leading-none" onClick={() => setShowQuitModal(false)}>✕</button>
                            <div className="text-[14px] font-bold text-[#1d5b6e] mb-4">Quit?</div>
                            <div className="flex justify-around">
                                <button
                                    className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                    onClick={() => {
                                        // Handle actual quit (return to gateway/home? For now just alert or close)
                                        alert("Quitting...");
                                        setShowQuitModal(false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape' || e.key.toLowerCase() === 'n') setShowQuitModal(false);
                                        if (e.key.toLowerCase() === 'y' || e.key === 'Enter') {
                                            alert("Quitting...");
                                            setShowQuitModal(false);
                                        }
                                    }}
                                    autoFocus
                                >
                                    Yes
                                </button>
                                <button
                                    className="px-3 py-1 bg-white border border-[#2d819b] text-[#1d5b6e] font-bold text-[12px] hover:bg-[#2d819b] hover:text-white"
                                    onClick={() => setShowQuitModal(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* F12 Configuration Modal */}
            {
                showMainF12Modal && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-transparent" onClick={() => setShowMainF12Modal(false)}>
                        <div className="bg-white p-6 pt-4 border border-[#888] w-[600px] shadow-[0_0_20px_rgba(0,0,0,0.2)] font-sans relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setShowMainF12Modal(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none"
                            >
                                ✕
                            </button>

                            <div className="font-bold text-[14px] text-black mb-1">Configuration</div>
                            <div className="border-b border-gray-300 mb-2"></div>

                            <div className="mt-4">
                                <div className="flex items-center mb-1">
                                    <label className="text-[13px] text-black w-[350px]">Display name for masters</label>
                                    <span className="font-bold text-black mr-4">:</span>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={mainDisplayName}
                                            readOnly
                                            onClick={() => setShowDisplayNameList(true)}
                                            className="w-[150px] bg-[#ffe599] font-bold text-[13px] px-1 outline-none text-black cursor-pointer" />
                                        {showDisplayNameList && (
                                            <div className="absolute top-0 left-[100%] ml-2 w-[200px] bg-[#e8f6fa] border border-[#2d819b] shadow-xl z-50 flex flex-col font-sans"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Escape') setShowDisplayNameList(false);
                                                }}
                                                autoFocus
                                            >
                                                <div className="bg-[#2d819b] text-white text-[12px] font-bold px-2 py-1 flex justify-between items-center">
                                                    <span>Type of Display Name</span>
                                                    <button className="text-white hover:bg-red-500 px-1 leading-none h-full" onClick={() => setShowDisplayNameList(false)}>✕</button>
                                                </div>
                                                <div className="max-h-[200px] overflow-y-auto">
                                                    {['Alias (Name)', 'Alias Only', 'Name (Alias)', 'Name Only'].map((opt) => (
                                                        <div
                                                            key={opt}
                                                            className={`px-2 py-[2px] text-[13px] cursor-pointer hover:bg-[#ffe599] ${mainDisplayName === opt ? 'bg-[#fdd835] font-bold' : 'text-black'}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMainDisplayName(opt);
                                                                setShowDisplayNameList(false);
                                                            }}
                                                        >
                                                            {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center mb-1">
                                    <label className="text-[13px] text-black w-[350px]">Enable Stripe View</label>
                                    <span className="font-bold text-black mr-4">:</span>
                                    <span
                                        className="font-bold text-[13px] text-black cursor-pointer"
                                        onClick={() => setMainStripeView(prev => prev === 'No' ? 'Yes' : 'No')}
                                    >{mainStripeView}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
































            {/* Split Menu Modal */}
            {
                showSplitMenu && (
                    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[100px] bg-transparent" onClick={() => setShowSplitMenu(false)}>
                        <div className="bg-white border border-[#2d819b] shadow-xl w-[200px] flex flex-col font-sans text-[13px] relative"
                            onClick={(e) => e.stopPropagation()}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') setShowSplitMenu(false);
                            }}
                            autoFocus
                        >
                            <div className="bg-[#2d819b] text-white px-2 py-1 font-bold flex justify-between items-center">
                                <span>Split</span>
                                <button className="text-white hover:bg-red-500 px-1 leading-none h-full" onClick={() => setShowSplitMenu(false)}>✕</button>
                            </div>
                            <div className="hover:bg-[#feba35] px-4 py-1 cursor-pointer" onClick={() => { alert('Verify Data'); setShowSplitMenu(false); }}>Verify Data</div>
                            <div className="hover:bg-[#feba35] px-4 py-1 cursor-pointer" onClick={() => { setShowSplitMenu(false); setShowSplitDataModal(true); }}>Split Data</div>
                        </div>
                    </div>
                )
            }



            {/* Backup & Restore Menu */}
            {
                showBackupRestoreMenu && (
                    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[100px] bg-transparent" onClick={() => setShowBackupRestoreMenu(false)}>
                        <div className="bg-white border border-[#2d819b] shadow-xl w-[200px] flex flex-col font-sans text-[13px]" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-[#2d819b] text-white px-2 py-1 font-bold">Backup & Restore</div>
                            <div className="hover:bg-[#feba35] px-4 py-1 cursor-pointer" onClick={() => { setShowBackupRestoreMenu(false); setShowBackupModal(true); }}>Backup</div>
                            <div className="hover:bg-[#feba35] px-4 py-1 cursor-pointer" onClick={() => { setShowBackupRestoreMenu(false); setShowRestoreModal(true); }}>Restore</div>
                            <div className="hover:bg-[#feba35] px-4 py-1 cursor-pointer text-gray-400">Schedule Backup</div>
                            <div className="hover:bg-[#feba35] px-4 py-1 cursor-pointer text-gray-400">Manage TallyDrive</div>
                            <div className="hover:bg-[#feba35] px-4 py-1 cursor-pointer text-gray-400">TallyDrive Login & Logout</div>
                        </div>
                    </div>
                )
            }





            {/* Backup Modal (Simple placeholder as mostly similar to Restore/Others) */}
            {
                false && (
                    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[100px] bg-black/10" onClick={() => setShowBackupModal(false)}>
                        <div className="bg-white p-4 shadow-2xl border border-[#2d819b] w-[400px] text-center font-sans" onClick={(e) => e.stopPropagation()}>
                            <div className="font-bold mb-4">Backup Companies on Disk</div>
                            <div className="italic text-gray-500">Source: C:\Users\Public\TallyPrime\data</div>
                            <div className="italic text-gray-500 mb-4">Destination: C:\Users\Public\TallyPrime\data\Backup</div>

                            <div className="max-h-[300px] overflow-y-auto border border-gray-300 text-left">
                                {openCompanies.map((c, i) => (
                                    <div key={i} className="px-2 py-1 hover:bg-blue-100 cursor-pointer" onClick={() => { alert(`Backing up ${c.name}`); setShowBackupModal(false); }}>{c.name}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }



            {/* More Details Modal (List Style) */}
            {
                showMoreDetailsModal && (
                    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[100px] pointer-events-none">
                        <div className="flex flex-col w-[450px] shadow-2xl border border-[#2d819b] font-sans relative bg-[#e8f6fa] pointer-events-auto" onClick={(e) => e.stopPropagation()}>

                            {/* Title */}
                            <div className="bg-white text-black px-2 py-1 text-[13px] font-bold text-center border-b border-[#2d819b] relative">
                                More Details
                                <span className="absolute right-2 top-0 cursor-pointer hover:text-red-300" onClick={() => setShowMoreDetailsModal(false)}>✕</span>
                            </div>

                            {/* Search Input */}
                            <div className="mx-4 my-2 border-b border-black text-center text-[13px] font-bold text-black py-1 bg-[#feba35]">
                                <input
                                    type="text"
                                    className="w-full bg-[#feba35] text-center font-bold outline-none placeholder-black/50"
                                    value={moreDetailsQuery}
                                    onChange={(e) => setMoreDetailsQuery(e.target.value)}
                                    placeholder=""
                                    autoFocus />
                            </div>

                            {/* List Header */}
                            <div className="bg-[#2d819b] text-white px-2 py-0.5 text-[12px] font-bold flex justify-between items-center">
                                <span>List of Company Details</span>
                                <span className="text-[10px] cursor-pointer hover:text-yellow-300">Show More</span>
                            </div>

                            {/* List Content */}
                            <div className="flex-1 bg-white h-[300px] overflow-y-auto text-[13px] text-black">
                                {/* Statutory Details */}
                                {/* Statutory Details */}
                                <div className="font-bold px-2 py-1 mt-1">Statutory Details</div>
                                <div
                                    className="px-4 py-0.5 cursor-pointer hover:bg-[#dceef5] flex justify-between focus:bg-[#feba35] outline-none"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setShowGSTDetailsModal(true);
                                            setShowMoreDetailsModal(false);
                                        }
                                    }}
                                    onClick={() => {
                                        setShowGSTDetailsModal(true);
                                        setShowMoreDetailsModal(false);
                                    }}
                                >
                                    <span>GST Registration</span>
                                </div>
                                <div
                                    className="px-4 py-0.5 cursor-pointer hover:bg-[#dceef5] flex justify-between focus:bg-[#feba35] outline-none"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setShowGSTDetailsModal(true);
                                            setShowMoreDetailsModal(false);
                                        }
                                    }}
                                    onClick={() => {
                                        setShowGSTDetailsModal(true);
                                        setShowMoreDetailsModal(false);
                                    }}
                                >
                                    <span>Company GST Details</span>
                                    <span className="italic text-[11px]">&lt;Value exists&gt;</span>
                                </div>

                                {/* Payroll Details */}
                                <div className="font-bold px-2 py-1 mt-1">Payroll Details</div>
                                <div
                                    className="px-4 py-0.5 cursor-pointer bg-[#feba35] hover:bg-[#feba35] flex justify-between font-bold outline-none"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { setShowPayrollModal(true); setShowMoreDetailsModal(false); } }}
                                    onClick={() => { setShowPayrollModal(true); setShowMoreDetailsModal(false); }}
                                >
                                    <span>Payroll Statutory Details</span>
                                </div>

                                {/* General Details */}
                                <div className="font-bold px-2 py-1 mt-1">General Details</div>
                                <div
                                    className="px-4 py-0.5 cursor-pointer hover:bg-[#dceef5] flex justify-between focus:bg-[#feba35] outline-none"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { setShowPANModal(true); setShowMoreDetailsModal(false); } }}
                                    onClick={() => { setShowPANModal(true); setShowMoreDetailsModal(false); }}
                                >
                                    <span>PAN/CIN Details</span>
                                </div>
                                <div
                                    className="px-4 py-0.5 cursor-pointer hover:bg-[#dceef5] flex justify-between focus:bg-[#feba35] outline-none"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { setShowMSMEModal(true); setShowMoreDetailsModal(false); } }}
                                    onClick={() => { setShowMSMEModal(true); setShowMoreDetailsModal(false); }}
                                >
                                    <span>MSME Registration Details</span>
                                </div>
                                <div
                                    className="px-4 py-0.5 cursor-pointer hover:bg-[#dceef5] flex justify-between focus:bg-[#feba35] outline-none"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { setShowCreditDaysModal(true); setShowMoreDetailsModal(false); } }}
                                    onClick={() => { setShowCreditDaysModal(true); setShowMoreDetailsModal(false); }}
                                >
                                    <span>Credit Days Allowed for Micro & Small Parties</span>
                                    <span className="italic text-[11px] font-bold">{creditDaysAgreement}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }


            {/* GST Details Modal */}
            {
                showGSTDetailsModal && (
                    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40" onClick={() => setShowGSTDetailsModal(false)}>
                        <div className="bg-white px-8 py-6 shadow-2xl border border-[#2d819b] w-[1100px] h-[600px] font-bold text-[13px] text-black flex flex-col relative" onClick={(e) => e.stopPropagation()} onKeyDown={handleEnterNav}>
                            {/* Close Button */}
                            <button
                                onClick={() => setShowGSTDetailsModal(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none z-10"
                            >
                                ✕
                            </button>

                            <div className="text-center font-bold text-[15px] mb-4">GST Details</div>

                            <div className="flex gap-10 flex-1 overflow-y-auto">
                                {/* Left Column */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="w-[200px]">Registration status</label>
                                        <span>:</span>
                                        <input type="text" value="Active" readOnly className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                    </div>

                                    <div className="font-bold underline mb-2">GST Registration Details</div>

                                    {/* State */}
                                    <div className="flex justify-between items-center mb-1 relative">
                                        <label className="w-[200px]">State</label>
                                        <span>:</span>
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={gstState}
                                                readOnly
                                                className="w-full bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none cursor-pointer"
                                                onClick={() => setShowGstStateList(!showGstStateList)} />
                                            {showGstStateList && (
                                                <TallySelectionList
                                                    title="List of States"
                                                    items={stateList}
                                                    selectedItem={gstState}
                                                    onSelect={(item) => {
                                                        setGstState(item);
                                                        setShowGstStateList(false);
                                                    }}
                                                    left="0"
                                                    top="24px" // Approximately right
                                                    width="250px"
                                                    height="200px" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-1 relative">
                                        <label className="w-[200px]">Registration type</label>
                                        <span>:</span>
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={gstRegType}
                                                readOnly
                                                className="w-full bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none cursor-pointer"
                                                onClick={() => setShowGstRegTypeList(!showGstRegTypeList)} />
                                            {showGstRegTypeList && (
                                                <TallySelectionList
                                                    title="Registration Types"
                                                    items={registrationTypeList}
                                                    selectedItem={gstRegType}
                                                    onSelect={(item) => {
                                                        setGstRegType(item);
                                                        setShowGstRegTypeList(false);
                                                    }}
                                                    left="0"
                                                    top="24px"
                                                    width="200px"
                                                    height="auto" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-1">
                                        <label className="w-[200px]">Assessee of Other Territory</label>
                                        <span>:</span>
                                        <input type="text" value={gstAssessee} onChange={(e) => setGstAssessee(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="w-[200px]">GSTIN/UIN</label>
                                        <span>:</span>
                                        <input type="text" value={gstin} onChange={(e) => setGstin(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                    </div>
                                    <div className="flex justify-between items-center mb-4 relative">
                                        <label className="w-[200px]">Periodicity of GSTR-1</label>
                                        <span>:</span>
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={gstPeriodicity}
                                                readOnly
                                                className="w-full bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none cursor-pointer"
                                                onClick={() => setShowGstPeriodicityList(!showGstPeriodicityList)} />
                                            {showGstPeriodicityList && (
                                                <TallySelectionList
                                                    title="Periodicity"
                                                    items={periodicityList}
                                                    selectedItem={gstPeriodicity}
                                                    onSelect={(item) => {
                                                        setGstPeriodicity(item);
                                                        setShowGstPeriodicityList(false);
                                                    }}
                                                    left="0"
                                                    top="24px"
                                                    width="150px"
                                                    height="auto"
                                                    onClose={() => setShowGstPeriodicityList(false)} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="font-bold underline mb-2">Connected GST Details</div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="w-[200px]">GST Username</label>
                                        <span>:</span>
                                        <input type="text" value={gstUsername} onChange={(e) => setGstUsername(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                    </div>
                                    <div className="flex justify-between items-center mb-4 relative">
                                        <label className="w-[200px]">Mode of Filing</label>
                                        <span>:</span>
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={gstFilingMode}
                                                readOnly
                                                className="w-full bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none cursor-pointer"
                                                onClick={() => setShowGstFilingModeList(!showGstFilingModeList)} />
                                            {showGstFilingModeList && (
                                                <TallySelectionList
                                                    title="Modes of Filing"
                                                    items={["Not Applicable", "DSC", "EVC"]}
                                                    selectedItem={gstFilingMode}
                                                    onSelect={(item) => {
                                                        setGstFilingMode(item);
                                                        setShowGstFilingModeList(false);
                                                    }}
                                                    left="0"
                                                    top="24px"
                                                    width="200px"
                                                    height="auto"
                                                    onClose={() => setShowGstFilingModeList(false)} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="font-bold underline mb-2">e-Invoice Details</div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="w-[200px]">e-Invoicing applicable</label>
                                        <span>:</span>
                                        <input type="text" value={gstEInvoice} onChange={(e) => setGstEInvoice(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="flex-1">
                                    <div className="font-bold underline mb-2">e-Way Bill Details</div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="w-[200px]">e-Way Bill applicable</label>
                                        <span>:</span>
                                        <input type="text" value={gstEWayBill} onChange={(e) => setGstEWayBill(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                    </div>
                                    {gstEWayBill === 'Yes' && (
                                        <>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="w-[200px] pl-4">Applicable from</label>
                                                <span>:</span>
                                                <input type="text" value={gstEWayBillDate} onChange={(e) => setGstEWayBillDate(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                            </div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="w-[200px] pl-4">Applicable for intrastate</label>
                                                <span>:</span>
                                                <input type="text" value={gstEWayBillIntrastate} onChange={(e) => setGstEWayBillIntrastate(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Section */}
                            <div className="mt-4 border-t border-gray-300 pt-4">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="w-[300px]">Registration Name</label>
                                    <span>:</span>
                                    <input type="text" value={gstRegName} onChange={(e) => setGstRegName(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                </div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="w-[300px]">Create another GST Registration for the Company</label>
                                    <span>:</span>
                                    <input type="text" value={gstCreateAnother} onChange={(e) => setGstCreateAnother(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }


            {/* MSME Modal */}
            {
                showMSMEModal && (
                    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40" onClick={() => setShowMSMEModal(false)}>
                        <div className="bg-white px-8 py-6 shadow-2xl border border-[#2d819b] w-[600px] font-bold text-[13px] text-black flex flex-col relative" onClick={(e) => e.stopPropagation()} onKeyDown={handleEnterNav}>
                            <button onClick={() => setShowMSMEModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none z-10">✕</button>
                            <div className="text-center font-bold text-[15px] mb-4">MSME Registration Details</div>
                            <div className="flex justify-between items-center mb-1 relative">
                                <label className="w-[200px]">Type of Enterprise</label>
                                <span>:</span>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={msmeType}
                                        readOnly
                                        className="w-full bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none cursor-pointer"
                                        onClick={() => setShowMsmeTypeList(!showMsmeTypeList)} />
                                    {showMsmeTypeList && (
                                        <TallySelectionList
                                            title="List of Enterprise Types"
                                            items={["Not Applicable", "Micro", "Small", "Medium"]}
                                            selectedItem={msmeType}
                                            onSelect={(item) => {
                                                setMsmeType(item);
                                                setShowMsmeTypeList(false);
                                            }}
                                            left="0"
                                            top="24px"
                                            width="200px"
                                            height="auto" />
                                    )}
                                </div>
                            </div>
                            {msmeType !== 'Not Applicable' && (
                                <>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="w-[200px]">UDYAM Registration Number</label>
                                        <span>:</span>
                                        <input type="text" value={msmeUdyamNo} onChange={(e) => setMsmeUdyamNo(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="w-[200px]">Activity Type</label>
                                        <span>:</span>
                                        <input type="text" value={msmeActivityType} onChange={(e) => setMsmeActivityType(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )
            }

            {/* PAN Modal */}
            {
                showPANModal && (
                    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40" onClick={() => setShowPANModal(false)}>
                        <div className="bg-white px-8 py-6 shadow-2xl border border-[#2d819b] w-[500px] font-bold text-[13px] text-black flex flex-col relative" onClick={(e) => e.stopPropagation()} onKeyDown={handleEnterNav}>
                            <button onClick={() => setShowPANModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none z-10">✕</button>
                            <div className="text-center font-bold text-[15px] mb-4">PAN/CIN Details</div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[200px]">PAN/Income tax no.</label>
                                <span>:</span>
                                <input type="text" value={panNo} onChange={(e) => setPanNo(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[200px]">Corporate Identity No. (CIN)</label>
                                <span>:</span>
                                <input type="text" value={cinNo} onChange={(e) => setCinNo(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Credit Days Modal */}
            {
                showCreditDaysModal && (
                    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40" onClick={() => setShowCreditDaysModal(false)}>
                        <div className="bg-white px-8 py-6 shadow-2xl border border-[#2d819b] w-[600px] font-bold text-[13px] text-black flex flex-col relative" onClick={(e) => e.stopPropagation()} onKeyDown={handleEnterNav}>
                            <button onClick={() => setShowCreditDaysModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none z-10">✕</button>
                            <div className="text-center font-bold text-[15px] mb-4">No. of Credit Days Allowed for Micro & Small Parties</div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="flex-1">With Credit Period Agreement (max allowed days)</label>
                                <div className="flex items-center w-[60px]">
                                    <span className="mr-2">:</span>
                                    <input type="text" value={creditDaysAgreement} onChange={(e) => setCreditDaysAgreement(e.target.value)} className="w-full bg-[#feba35] text-right px-1 font-bold outline-none" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="flex-1">With No Credit Period Agreement</label>
                                <div className="flex items-center w-[60px]">
                                    <span className="mr-2">:</span>
                                    <input type="text" value={creditDaysNoAgreement} onChange={(e) => setCreditDaysNoAgreement(e.target.value)} className="w-full bg-transparent text-right px-1 font-bold focus:bg-[#ffe599] outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }




            {/* Payroll Statutory Details Modal */}
            {
                showPayrollModal && (
                    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40" onClick={() => setShowPayrollModal(false)}>
                        <div className="bg-white px-8 py-6 shadow-2xl border border-[#2d819b] w-[800px] h-[600px] font-bold text-[13px] text-black flex flex-col relative overflow-y-auto" onClick={(e) => e.stopPropagation()} onKeyDown={handleEnterNav}>
                            <button onClick={() => setShowPayrollModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-[16px] leading-none z-10">✕</button>
                            <div className="text-center font-bold text-[15px] mb-4">Payroll Statutory Details</div>

                            {/* Provident Fund */}
                            <div className="font-bold border-b border-black w-fit mb-2">Provident Fund</div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">Company code</label>
                                <span>:</span>
                                <input type="text" value={pfCompanyCode} onChange={(e) => setPfCompanyCode(e.target.value)} className="flex-1 bg-[#feba35] px-2 font-bold outline-none" autoFocus />
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">Company account group code</label>
                                <span>:</span>
                                <input type="text" value={pfGroupCode} onChange={(e) => setPfGroupCode(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="w-[300px]">Company security code</label>
                                <span>:</span>
                                <input type="text" value={pfSecurityCode} onChange={(e) => setPfSecurityCode(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>

                            {/* Employee State Insurance */}
                            <div className="font-bold border-b border-black w-fit mb-2">Employee State Insurance</div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">Company code</label>
                                <span>:</span>
                                <input type="text" value={esiCompanyCode} onChange={(e) => setEsiCompanyCode(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">ESI branch office</label>
                                <span>:</span>
                                <input type="text" value={esiBranchOffice} onChange={(e) => setEsiBranchOffice(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="w-[300px]">Standard working days per month</label>
                                <span>:</span>
                                <input type="text" value={esiWorkingDays} onChange={(e) => setEsiWorkingDays(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>

                            {/* National Pension Scheme */}
                            <div className="font-bold border-b border-black w-fit mb-2">National Pension Scheme</div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">Corporate registration number</label>
                                <span>:</span>
                                <input type="text" value={npsCorpRegNo} onChange={(e) => setNpsCorpRegNo(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="w-[300px]">Corporate branch office number</label>
                                <span>:</span>
                                <input type="text" value={npsBranchNo} onChange={(e) => setNpsBranchNo(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>

                            {/* Income Tax */}
                            <div className="font-bold border-b border-black w-fit mb-2">Income Tax</div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">Tax deduction and collection Account Number (TAN)</label>
                                <span>:</span>
                                <input type="text" value={itTan} onChange={(e) => setItTan(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">TAN registration number</label>
                                <span>:</span>
                                <input type="text" value={itTanRegNo} onChange={(e) => setItTanRegNo(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">Income tax circle or ward</label>
                                <span>:</span>
                                <input type="text" value={itCircle} onChange={(e) => setItCircle(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">Deductor type</label>
                                <span>:</span>
                                <input type="text" value={itDeductorType} onChange={(e) => setItDeductorType(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">Deductor branch/division</label>
                                <span>:</span>
                                <input type="text" value={itDeductorBranch} onChange={(e) => setItDeductorBranch(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">Name of person responsible</label>
                                <span>:</span>
                                <input type="text" value={itRespPerson} onChange={(e) => setItRespPerson(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-1 pl-4">
                                <label className="w-[285px]">Son/daughter of</label>
                                <span>:</span>
                                <input type="text" value={itFatherName} onChange={(e) => setItFatherName(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="w-[300px]">Designation</label>
                                <span>:</span>
                                <input type="text" value={itDesignation} onChange={(e) => setItDesignation(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="w-[300px]">PAN</label>
                                <span>:</span>
                                <input type="text" value={itPan} onChange={(e) => setItPan(e.target.value)} className="flex-1 bg-transparent px-2 font-bold focus:bg-[#ffe599] outline-none" />
                            </div>

                            <div className="text-center italic text-[11px] mt-4">
                                (Note: All the above details will be used in Challan, Forms & Returns)
                            </div>

                        </div>
                    </div>
                )
            }


            {/* Export Current Modal */}
            {showExportCurrentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
                    <div className="bg-white p-8 px-12 shadow-[0_0_20px_rgba(0,0,0,0.1)] border border-gray-300 w-[600px] h-[450px] relative flex flex-col items-start font-sans" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button
                            onClick={() => setShowExportCurrentModal(false)}
                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 text-[20px] leading-none transition-colors"
                        >
                            ✕
                        </button>

                        <div className="font-bold text-[14px] mb-2 text-black">Export</div>
                        <div className="border-t border-gray-200 mb-6 w-full"></div>

                        <div className="flex flex-col gap-1.5 mb-8 w-full">
                            <div className="flex items-center">
                                <label className="w-[180px] text-gray-600 text-[13px]">Type of Masters</label>
                                <span className="mr-6 font-bold text-black">:</span>
                                <span className="font-bold text-black text-[13px]">Groups</span>
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => setExportCurrentIncludeDependent(prev => prev === 'No' ? 'Yes' : 'No')}>
                                <label className="w-[180px] text-gray-600 text-[13px]">Include dependent masters</label>
                                <span className="mr-6 font-bold text-black">:</span>
                                <span className="font-bold text-black text-[13px]">{exportCurrentIncludeDependent}</span>
                            </div>

                            <div className="h-6"></div>

                            <div className="flex items-center cursor-pointer" onClick={() => { }}>
                                <label className="w-[180px] text-gray-600 text-[13px]">File Format</label>
                                <span className="mr-6 font-bold text-black">:</span>
                                <span className="font-bold text-[#1d5b6e] text-[13px]">{exportCurrentFormat}</span>
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => { }}>
                                <label className="w-[180px] text-gray-600 text-[13px]">Export to</label>
                                <span className="mr-6 font-bold text-black">:</span>
                                <span className="font-bold text-black text-[13px]">{exportCurrentTo}</span>
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => { }}>
                                <label className="w-[180px] text-gray-600 text-[13px]">Folder Path</label>
                                <span className="mr-6 font-bold text-black">:</span>
                                <span className="font-bold text-black text-[13px]">{exportCurrentPath}</span>
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => { }}>
                                <label className="w-[180px] text-gray-600 text-[13px]">File Name</label>
                                <span className="mr-6 font-bold text-black">:</span>
                                <span className="font-bold text-black text-[13px]">{exportCurrentFileName}</span>
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => setExportCurrentStripeView(prev => prev === 'No' ? 'Yes' : 'No')}>
                                <label className="w-[180px] text-gray-600 text-[13px]">Enable Stripe View</label>
                                <span className="mr-6 font-bold text-black">:</span>
                                <span className="font-bold text-black text-[13px]">{exportCurrentStripeView}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-12 mt-auto w-full pb-2">
                            <div
                                className="border border-[#2d819b] px-6 py-2 cursor-pointer hover:bg-[#f2f9fb] flex items-center justify-center min-w-[130px] rounded-[2px] transition-colors"
                                onClick={() => { }}
                            >
                                <span className="text-[#2d819b] font-bold underline decoration-1 underline-offset-2 text-[13px]">C</span>
                                <span className="text-black font-bold text-[13px]">: Configure</span>
                            </div>
                            <div
                                className="border border-[#feba35] px-6 py-2 cursor-pointer hover:bg-[#fff9ef] flex items-center justify-center min-w-[130px] rounded-[2px] transition-colors"
                                onClick={() => {
                                    alert(`Exporting ${exportCurrentFileName} to ${exportCurrentPath}...`);
                                    setShowExportCurrentModal(false);
                                }}
                            >
                                <span className="text-[#feba35] font-bold underline decoration-1 underline-offset-2 text-[13px]">E</span>
                                <span className="text-black font-bold text-[13px]">: Export</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Change Company Modal */}
            {showChangeCompanyModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/10" onClick={() => setShowChangeCompanyModal(false)}>
                    <div className="bg-[#e8f6fa] border border-[#2d819b] shadow-2xl w-[500px] font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#2d819b] text-white px-2 py-1 font-bold">Change Company</div>
                        <div className="p-4">
                            <div className="bg-[#2d819b] text-white px-2 text-[11px] flex justify-between"><span>List of Companies</span><span>Number</span></div>
                            <div className="max-h-[200px] overflow-y-auto bg-white">
                                {(companies || [{ name: companyName || 'Solarica', id: companyId || '1' }]).map((c: any, i: number) => (
                                    <div key={i} className="flex justify-between px-2 py-0.5 hover:bg-[#feba35] cursor-pointer text-[13px] font-bold" onClick={() => {
                                        if (onCompanyChange) onCompanyChange(c.id || '', c.name);
                                        else setCurrentCompany(c.name);
                                        setShowChangeCompanyModal(false);
                                    }}>
                                        <span>{c.name}</span><span>{c.number || (c.id ? c.id.slice(0, 5) : '10000')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div >


    );
};

export default TallyGroupView;
