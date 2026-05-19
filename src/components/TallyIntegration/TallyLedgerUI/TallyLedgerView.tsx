import React, { useState, useEffect } from 'react';
import { PeriodModal, TallySelectionList, otherMastersData, changeViewData, GenericModal } from '../TallyCommon/TallySidebarModals';
import type { LedgerItem, TallyFormData } from './types';
import TallyList from './TallyList';
import TallyGroupAlteration from './TallyGroupAlteration';
import TallyLedgerAlteration from './TallyLedgerAlteration';
import TallySideMenuComponent from './TallySideMenuComponent';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import TallyCompanyCreation from './TallyCompanyCreation';
import TallySidebar from '../TallyCommon/TallySidebar';
import TallyFooter, { FooterItem, FooterEmptyItem } from './TallyFooter';
import TallyCommonModals from './TallyCommonModals';
import TallyFeatures from './TallyFeatures';
import TallyLedgerCreation from '../TallyGroupUI/TallyLedgerCreation';
import { getChartOfAccounts, getCompanies } from '../../../services/accountingService'; // Import getCompanies
import { AccountGroup, Ledger } from '../../../services/accountingService'; // Import types

interface TallyLedgerViewProps {
    onQuit?: () => void;
    mode?: 'list' | 'alter' | 'create';
    initialLedger?: string;
    companyId: string;
    companyName: string;
    companies?: any[];
    onCompanyChange?: (id: string, name: string) => void;
}

const TallyLedgerView = ({ onQuit, mode = 'list', initialLedger, companyId, companyName, companies, onCompanyChange }: TallyLedgerViewProps) => {
    const [selectedItem, setSelectedItem] = useState<string>(initialLedger || 'Current Assets');
    const [viewMode, setViewMode] = useState<'list' | 'alter' | 'create' | 'createCompany' | 'features'>(() => {
        if (mode === 'create') return 'create';
        if (initialLedger) return 'alter';
        return 'list';
    });
    const [showAccept, setShowAccept] = useState(false);
    const [showQuit, setShowQuit] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [ledgerData, setLedgerData] = useState<LedgerItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalOpeningBalance, setTotalOpeningBalance] = useState({ debit: 0, credit: 0 });

    // Transform Backend Data to Frontend Type
    const transformData = (groups: AccountGroup[]): LedgerItem[] => {
        return groups.map(group => ({
            id: group.id,
            name: group.name,
            type: group.level === 0 ? 'category' : 'group',
            children: [
                ...(group.children ? transformData(group.children) : []),
                ...(group.ledgers ? group.ledgers.map(l => ({
                    id: l.id,
                    name: l.name,
                    type: 'ledger' as const,
                    italic: true,
                    address: l.address,
                    phone: l.phone,
                    email: l.email,
                    contactPerson: l.contactPerson,
                    gstin: l.gstin,
                    pan: l.pan,
                    bankName: l.bankName,
                    accountNumber: l.accountNumber,
                    ifscCode: l.ifscCode,
                    branch: l.branch,
                    openingBalance: Number(l.openingBalance),
                    openingBalanceType: l.openingBalanceType,
                    under: group.name,
                    groupId: group.id
                })) : [])
            ]
        }));
    };

    const calculateTotals = (groups: AccountGroup[]) => {
        let debit = 0;
        let credit = 0;

        const traverse = (nodes: AccountGroup[]) => {
            nodes.forEach(node => {
                if (node.ledgers) {
                    node.ledgers.forEach(l => {
                        const amount = Number(l.openingBalance) || 0;
                        const type = (l.openingBalanceType || 'DEBIT').toUpperCase();

                        if (type === 'DEBIT') debit += amount;
                        else if (type === 'CREDIT') credit += amount;
                    });
                }
                if (node.children) {
                    traverse(node.children);
                }
            });
        };

        traverse(groups);
        return { debit, credit };
    };

    const fetchChartData = async () => {
        try {
            console.log("DEBUG: fetchChartData triggered. CompanyId:", companyId);
            setLoading(true);
            if (companyId) {
                const apiData = await getChartOfAccounts(companyId);
                console.log("DEBUG: API Response received. Items:", apiData?.length);
                const transformed = transformData(apiData);
                setLedgerData(transformed);

                // Calculate totals
                const totals = calculateTotals(apiData);
                console.log("DEBUG: Calculated Totals on Load:", totals);
                setTotalOpeningBalance(totals);
            } else {
                console.warn("DEBUG: No company ID provided, skipping fetch.");
                setLedgerData([]);
                setTotalOpeningBalance({ debit: 0, credit: 0 });
            }
        } catch (error) {
            console.error("DEBUG: Failed to fetch chart of accounts", error);
        } finally {
            setLoading(false);
        }
    };

    const getCounts = (items: LedgerItem[]): { groups: number, ledgers: number } => {
        let groups = 0;
        let ledgers = 0;

        const count = (nodes: LedgerItem[]) => {
            nodes.forEach(node => {
                if (node.type === 'group' || node.type === 'category') groups++;
                if (node.type === 'ledger') ledgers++;
                if (node.children) count(node.children);
            });
        };

        count(items);
        return { groups, ledgers };
    };

    const counts = getCounts(ledgerData);

    useEffect(() => {
        console.log("DEBUG: TallyLedgerView mounted/updated. CompanyId:", companyId);
        if (companyId) {
            fetchChartData();
        }
    }, [companyId]);

    useEffect(() => {
        if (initialLedger && ledgerData.length > 0) {
            const item = findItem(ledgerData, initialLedger);
            if (item) handleItemClick(item);
        }
    }, [initialLedger, ledgerData]);

    // Mock Data Removed in favor of ledgerData state

    const [diskCompanies, setDiskCompanies] = useState([{ name: 'Solarica', number: '10000', period: '1-Apr-25 to 31-Mar-26' }]);
    const [openCompanies, setOpenCompanies] = useState([{ name: 'Solarica', number: '10000', period: '1-Apr-25 to 31-Mar-26' }]);
    const [currentCompany, setCurrentCompany] = useState('Solarica');

    // Modal States
    const [showChangeCompanyModal, setShowChangeCompanyModal] = useState(false);
    const [showSelectCompanyModal, setShowSelectCompanyModal] = useState(false);
    const [showShutCompanyModal, setShowShutCompanyModal] = useState(false);
    const [showSecurityListModal, setShowSecurityListModal] = useState(false);
    const [showOnlineAccessListModal, setShowOnlineAccessListModal] = useState(false);
    const [showTallyVaultModal, setShowTallyVaultModal] = useState(false);
    const [showConnectErrorModal, setShowConnectErrorModal] = useState(false);

    const [showBackupModal, setShowBackupModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showSplitDataModal, setShowSplitDataModal] = useState(false);
    const [showRepairCompanyModal, setShowRepairCompanyModal] = useState(false);
    const [showMigrateCompanyModal, setShowMigrateCompanyModal] = useState(false);
    const [showDataConfigurationModal, setShowDataConfigurationModal] = useState(false);

    const [showEInvoicingModal, setShowEInvoicingModal] = useState(false);
    const [showEWayBillModal, setShowEWayBillModal] = useState(false);
    const [showExchangeConfigModal, setShowExchangeConfigModal] = useState(false);

    const [showImportMastersModal, setShowImportMastersModal] = useState(false);
    const [showImportTransactionsModal, setShowImportTransactionsModal] = useState(false);
    const [showImportBankDetailsModal, setShowImportBankDetailsModal] = useState(false);
    const [showImportGSTReturnsModal, setShowImportGSTReturnsModal] = useState(false);

    const [showExportCurrentModal, setShowExportCurrentModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showPrintReportModal, setShowPrintReportModal] = useState(false);
    const [showPrintConfigModal, setShowPrintConfigModal] = useState(false);

    const [showTDLManagementModal, setShowTDLManagementModal] = useState(false);
    const [showAboutPageModal, setShowAboutPageModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);


    const handleMenuOptionClick = (menu: string, item: string) => {
        if (menu === 'Company') {
            if (item === 'Create') setViewMode('createCompany');
            if (item === 'Change') setShowChangeCompanyModal(true);
            if (item === 'Select') setShowSelectCompanyModal(true);
            if (item === 'Shut') setShowShutCompanyModal(true);
            if (item === 'Features') setViewMode('features');
            if (item === 'Security') setShowSecurityListModal(true);
            if (item === 'TallyVault') setShowTallyVaultModal(true);
            if (item === 'Online Access') setShowOnlineAccessListModal(true);
            if (item === 'Connect') setShowConnectErrorModal(true);
        } else if (menu === 'Data') {
            if (item === 'Backup') setShowBackupModal(true);
            if (item === 'Restore') setShowRestoreModal(true);
            if (item === 'SplitData') setShowSplitDataModal(true);
            if (item === 'Repair') setShowRepairCompanyModal(true);
            if (item === 'Migrate') setShowMigrateCompanyModal(true);
            if (item === 'Configuration') setShowDataConfigurationModal(true);
        } else if (menu === 'Exchange') {
            if (item === 'SendForEInvoicing') setShowEInvoicingModal(true);
            if (item === 'SendForEWayBill') setShowEWayBillModal(true);
            if (item === 'Configure') setShowExchangeConfigModal(true);
        } else if (menu === 'Import') {
            if (item === 'Masters') setShowImportMastersModal(true);
            if (item === 'Transactions') setShowImportTransactionsModal(true);
            if (item === 'BankDetails') setShowImportBankDetailsModal(true);
            if (item === 'GSTReturns') setShowImportGSTReturnsModal(true);
        } else if (menu === 'Export') {
            if (item === 'Current') setShowExportCurrentModal(true);
        } else if (menu === 'Print') {
            if (item === 'Current') setShowPrintModal(true);
            if (item === 'Others') setShowPrintReportModal(true);
            if (item === 'Configuration') setShowPrintConfigModal(true);
        } else if (menu === 'Help') {
            if (item === 'TDLs') setShowTDLManagementModal(true);
            if (item === 'About') setShowAboutPageModal(true);
            if (item === 'Upgrade') setShowUpgradeModal(true);
        }
    };

    const [formData, setFormData] = useState<TallyFormData>({
        name: 'Current Assets',
        alias: '',
        under: 'Primary',
        nature: 'Assets',
        showNature: true,
        isNatureEditable: false,
        showStatutory: false,
        subLedger: 'No',
        debitCredit: 'No',
        calculation: 'No',
        invoiceMethod: 'Not Applicable',
        hsnDetails: 'As per Company/Group',
        hsnSource: 'Not Available',
        hsnSac: '',
        hsnDesc: '',
        gstRateDetails: 'As per Company/Group',
        gstSource: 'Not Available',
        gstTaxability: '',
        gstRate: '0 %',
        mailingName: '',
        address: '',
        provideBankDetails: 'No',
        panNo: '',
        openingBalance: ''
    });

    const [alterType, setAlterType] = useState<'group' | 'ledger'>('group');

    const groupList = [
        'Bank Accounts', 'Bank OCC A/c', 'Bank OD A/c', 'Branch / Divisions',
        'Capital Account', 'Cash-in-Hand', 'Current Assets', 'Current Liabilities',
        'Deposits (Asset)', 'Direct Expenses', 'Direct Incomes', 'Duties & Taxes',
        'Expenses (Direct)', 'Expenses (Indirect)', 'Fixed Assets', 'Income (Direct)',
        'Income (Indirect)', 'Indirect Expenses', 'Indirect Incomes', 'Investments',
        'Loans & Advances (Asset)', 'Loans (Liability)', 'Misc. Expenses (ASSET)',
        'Provisions', 'Purchase Accounts', 'Reserves & Surplus', 'Retained Earnings',
        'Sales Accounts', 'Secured Loans', 'Sundry Creditors', 'Sundry Debtors',
        'Suspense A/c', 'Unsecured Loans'
    ];

    const handleItemClick = (item: LedgerItem) => {
        setSelectedItem(item.name);
        setShowAccept(false);

        const formatBalance = (amt: number | undefined, type: string | undefined) => {
            if (amt === undefined || amt === null) return '';
            const formattedAmt = new Intl.NumberFormat('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amt);
            return `${formattedAmt} ${type === 'CREDIT' ? 'Cr' : 'Dr'}`;
        };

        const baseData: TallyFormData = {
            name: item.name,
            alias: '',
            under: item.under || 'Primary',
            nature: '',
            showNature: false,
            isNatureEditable: false,
            showStatutory: false,
            subLedger: 'No',
            debitCredit: 'No',
            calculation: 'No',
            invoiceMethod: 'Not Applicable',
            hsnDetails: 'As per Company/Group',
            hsnSource: 'Not Available',
            hsnSac: '',
            hsnDesc: '',
            gstRateDetails: 'As per Company/Group',
            gstSource: 'Not Available',
            gstTaxability: '',
            gstRate: '0 %',
            mailingName: item.name,
            address: item.address || '',
            provideBankDetails: item.bankName ? 'Yes' : 'No',
            panNo: item.pan || '',
            openingBalance: formatBalance(item.openingBalance, item.openingBalanceType),
            affectGrossProfits: '',
            useAsIncomeExpense: '',
        };

        if (item.type === 'ledger') {
            setFormData(baseData);
            setAlterType('ledger');
            setViewMode('alter');
        } else {
            // It's a group
            setFormData({
                ...baseData,
                name: item.name,
                under: item.under || 'Primary',
                nature: (item as any).nature || '',
                showNature: item.under === 'Primary' || !item.under,
            });
            setAlterType('group');
            setViewMode('alter');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextFieldId: string | null, prevFieldId: string | null) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.currentTarget.name === 'name' && e.currentTarget.value === '') {
                setFormData(prev => ({ ...prev, showStatutory: true }));
                return;
            }
            if (nextFieldId) {
                const nextInput = document.getElementById(nextFieldId) as HTMLInputElement;
                if (nextInput) nextInput.focus();
            } else {
                setShowAccept(true);
            }
        } else if (e.key === 'Backspace') {
            if (prevFieldId && (e.currentTarget.value === '' || (e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0))) {
                e.preventDefault();
                setTimeout(() => {
                    const prevInput = document.getElementById(prevFieldId) as HTMLInputElement;
                    if (prevInput) {
                        prevInput.focus();
                        const len = prevInput.value.length;
                        prevInput.setSelectionRange(len, len);
                    }
                }, 0);
            }
        }
    };

    const handleFocus = (menuName: string | null) => {
        setActiveMenu(menuName);
    };

    const handleMenuSelect = (field: string, value: string, nextFieldId: string | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setActiveMenu(null);
        if (nextFieldId) {
            const nextInput = document.getElementById(nextFieldId) as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
                nextInput.select();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Handled by useEffect for global keys, but keeping Escape here for modal/UI convenience if needed
        if (e.key === 'Escape') {
            if (showAccept) setShowAccept(false);
            else if (showQuit) setShowQuit(false);
            else if (viewMode !== 'list') setViewMode('list');
            else if (onQuit) onQuit();
        }
    };

    const sideMenu = (
        <TallySideMenuComponent
            activeMenu={activeMenu}
            formData={formData}
            groupList={groupList}
            handleMenuSelect={handleMenuSelect}
        />
    );

    // Helper to find item by name recursively
    const findItem = (items: LedgerItem[], name: string): LedgerItem | null => {
        for (const item of items) {
            if (item.name === name) return item;
            if (item.children) {
                const found = findItem(item.children, name);
                if (found) return found;
            }
        }
        return null;
    };

    const handleAlterClick = () => {
        if (!selectedItem) return;
        const item = findItem(ledgerData, selectedItem);
        if (item) handleItemClick(item);
    };

    const [activeModal, setActiveModal] = useState<{ title: string, content: React.ReactNode } | null>(null);

    // Global Key Handling for Q: Quit
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showAccept || showQuit || activeModal || activeMenu || showChangeCompanyModal) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    if (viewMode !== 'list') setViewMode('list');
                    else if (onQuit) onQuit();
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showAccept, showQuit, activeModal, activeMenu, showChangeCompanyModal, viewMode, onQuit]);

    const sidebarButtons: any[] = [
        { keyName: 'F2', label: 'Period', onClick: () => setActiveModal({ title: 'Change Period', content: <PeriodModal /> }) },
        { keyName: 'F3', label: 'Company', onClick: () => setShowChangeCompanyModal(true) },
        { keyName: 'F4', label: '', disabled: true },
        { keyName: 'F5', label: 'Ledger View', onClick: () => setActiveModal({ title: 'Change View', content: <TallySelectionList title="List of Views" items={changeViewData} /> }) }, // Using Change View data for F5 as requested by user context images
        { keyName: 'F6', label: '', disabled: true },
        { keyName: 'F7', label: '', disabled: true },
        { keyName: 'F8', label: '', disabled: true },
        { keyName: 'F9', label: '', disabled: true },
        { keyName: 'F10', label: 'Other Masters', onClick: () => setActiveModal({ title: 'Select Other Masters', content: <TallySelectionList title="List of Masters" items={otherMastersData} /> }) },
        { keyName: 'SPACER', label: 'SPACER' },
        { keyName: 'B', label: 'Basis of Values', onClick: () => setActiveModal({ title: 'Basis of Values', content: <div className="p-4">Include/Exclude Post-dated vouchers and other values.</div> }) },
        { keyName: 'H', label: 'Change View', onClick: () => setActiveModal({ title: 'Change View', content: <TallySelectionList title="List of Views" items={changeViewData} /> }) },
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

    return (
        <div
            className="h-screen w-screen flex flex-col bg-[#f5f7f9] font-sans overflow-hidden select-none"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <TallyHeader
                onMenuOptionClick={handleMenuOptionClick}
                openCompanies={openCompanies}
                diskCompanies={diskCompanies}
                onAction={(action) => {
                    if (action === 'quit') {
                        if (viewMode !== 'list') setViewMode('list');
                        else if (onQuit) onQuit();
                    }
                }}
            />

            <GenericModal activeModal={activeModal} onClose={() => setActiveModal(null)} />

            <div className={`flex flex-1 overflow-hidden ${viewMode !== 'create' ? 'pb-[52px]' : ''}`}>
                <div className={`flex-1 flex flex-col ${viewMode !== 'create' ? 'border-r border-gray-300' : ''} bg-white relative`}>
                    {viewMode === 'create' ? (
                        <TallyLedgerCreation
                            onClose={() => {
                                if (onQuit) onQuit();
                                else setViewMode('list');
                            }}
                            companyId={companyId}
                            companyName={companyName}
                            initialTotalDebit={totalOpeningBalance.debit}
                            initialTotalCredit={totalOpeningBalance.credit}
                            refreshData={fetchChartData}
                            isLoading={loading}
                        />
                    ) : viewMode === 'createCompany' ? (
                        <TallyCompanyCreation
                            onClose={() => setViewMode('list')}
                            diskCompanies={diskCompanies}
                            setDiskCompanies={setDiskCompanies}
                            setOpenCompanies={setOpenCompanies}
                            setCurrentCompany={setCurrentCompany}
                            onSuccess={() => setViewMode('features')}
                        />
                    ) : viewMode === 'features' ? (
                        <TallyFeatures
                            onClose={() => setViewMode('list')}
                            companyName={currentCompany}
                        />
                    ) : viewMode === 'list' ? (
                        <div className="h-full flex flex-col">
                            {/* Header Block */}
                            <div className="flex justify-between items-center px-4 h-6 bg-[#88b5dd] text-black text-[13px] font-bold border-b border-[#2d819b] shrink-0">
                                <span>Chart of Accounts</span>
                                <div className="absolute left-1/2 transform -translate-x-1/2 underline decoration-1 underline-offset-2">{companyName}</div>
                                <span onClick={() => onQuit?.()} className="cursor-pointer hover:bg-red-500 hover:text-white px-2 transition-colors">✕</span>
                            </div>

                            <div className="flex justify-between items-end px-6 py-4 bg-white border-b border-gray-100">
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-black text-[#1b2c3c] leading-tight tracking-tight uppercase font-sans">List of Ledgers</h1>
                                    <div className="h-[3px] w-10 bg-[#2a5585] mt-0.5" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Financial Period</div>
                                    <div className="text-[15px] font-black text-blue-900 border-b border-blue-100">For 1-Apr-25</div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-hidden flex flex-col">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">Loading Chart of Accounts...</div>
                                ) : (
                                    <TallyList
                                        data={ledgerData} // Use API data
                                        selectedItem={selectedItem}
                                        onItemClick={handleItemClick}
                                        onItemHover={setSelectedItem}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        alterType === 'group' ? (
                            <TallyGroupAlteration
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleFocus={handleFocus}
                                handleFieldKeyDown={handleFieldKeyDown}
                                setViewMode={setViewMode}
                                showAccept={showAccept}
                                setShowAccept={setShowAccept}
                                showQuit={showQuit}
                                setShowQuit={setShowQuit}
                                sideMenuComponent={sideMenu}
                            />
                        ) : (
                            <TallyLedgerAlteration
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleFocus={handleFocus}
                                handleFieldKeyDown={handleFieldKeyDown}
                                setViewMode={setViewMode}
                                showAccept={showAccept}
                                setShowAccept={setShowAccept}
                                showQuit={showQuit}
                                setShowQuit={setShowQuit}
                                sideMenuComponent={sideMenu}
                            />
                        )
                    )}
                </div>

                <TallySidebar buttons={sidebarButtons} />
            </div>


            {viewMode !== 'create' && (
                <TallyFooter countInfo={`${counts.groups} Group(s) and ${counts.ledgers} Ledger(s)`}>
                    <FooterItem keyName="Enter" label="Alter" onClick={handleAlterClick} />
                    <FooterItem keyName="Space" label="Select" onClick={() => { }} />
                    <FooterItem keyName="Q" label="Quit" onClick={() => {
                        if (viewMode !== 'list') setViewMode('list');
                        else if (onQuit) onQuit();
                    }} />
                    <FooterEmptyItem />
                    <FooterItem keyName="C" label="Create Master" onClick={() => setViewMode('create')} />
                </TallyFooter>
            )}

            <TallyCommonModals
                showExportCurrentModal={showExportCurrentModal}
                setShowExportCurrentModal={setShowExportCurrentModal}
                showPrintModal={showPrintModal}
                setShowPrintModal={setShowPrintModal}
                showPrintReportModal={showPrintReportModal}
                setShowPrintReportModal={setShowPrintReportModal}
                showPrintConfigModal={showPrintConfigModal}
                setShowPrintConfigModal={setShowPrintConfigModal}
                showChangeCompanyModal={showChangeCompanyModal}
                setShowChangeCompanyModal={setShowChangeCompanyModal}
                showSelectCompanyModal={showSelectCompanyModal}
                setShowSelectCompanyModal={setShowSelectCompanyModal}
                showShutCompanyModal={showShutCompanyModal}
                setShowShutCompanyModal={setShowShutCompanyModal}
                openCompanies={companies || openCompanies}
                currentCompany={companyName || currentCompany}
                setCurrentCompany={setCurrentCompany}
                onCompanyChange={onCompanyChange}
                showBackupModal={showBackupModal}
                setShowBackupModal={setShowBackupModal}
                showRestoreModal={showRestoreModal}
                setShowRestoreModal={setShowRestoreModal}
                showRepairModal={showRepairCompanyModal}
                setShowRepairModal={setShowRepairCompanyModal}
                showMigrateModal={showMigrateCompanyModal}
                setShowMigrateModal={setShowMigrateCompanyModal}
                showDataConfigModal={showDataConfigurationModal}
                setShowDataConfigModal={setShowDataConfigurationModal}
                showAboutModal={showAboutPageModal}
                setShowAboutModal={setShowAboutPageModal}
                showImportMastersModal={showImportMastersModal}
                setShowImportMastersModal={setShowImportMastersModal}
                showSplitDataModal={showSplitDataModal}
                setShowSplitDataModal={setShowSplitDataModal}
                showSecurityListModal={showSecurityListModal}
                setShowSecurityListModal={setShowSecurityListModal}
                showOnlineAccessListModal={showOnlineAccessListModal}
                setShowOnlineAccessListModal={setShowOnlineAccessListModal}
                showTallyVaultModal={showTallyVaultModal}
                setShowTallyVaultModal={setShowTallyVaultModal}
                showConnectErrorModal={showConnectErrorModal}
                setShowConnectErrorModal={setShowConnectErrorModal}
                showTDLManagementModal={showTDLManagementModal}
                setShowTDLManagementModal={setShowTDLManagementModal}
                showUpgradeModal={showUpgradeModal}
                setShowUpgradeModal={setShowUpgradeModal}
                showImportTransactionsModal={showImportTransactionsModal}
                setShowImportTransactionsModal={setShowImportTransactionsModal}
                showImportBankDetailsModal={showImportBankDetailsModal}
                setShowImportBankDetailsModal={setShowImportBankDetailsModal}
                showImportGSTReturnsModal={showImportGSTReturnsModal}
                setShowImportGSTReturnsModal={setShowImportGSTReturnsModal}
                showEInvoicingModal={showEInvoicingModal}
                setShowEInvoicingModal={setShowEInvoicingModal}
                showEWayBillModal={showEWayBillModal}
                setShowEWayBillModal={setShowEWayBillModal}
                showExchangeConfigModal={showExchangeConfigModal}
                setShowExchangeConfigModal={setShowExchangeConfigModal}
            />
        </div>
    );
};

export default TallyLedgerView;
