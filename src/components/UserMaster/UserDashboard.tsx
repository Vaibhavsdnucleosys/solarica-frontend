import React, { useState, useEffect } from 'react';
import TallyGroupSelectModal from '../TallyIntegration/TallyGroupUI/TallyGroupSelectModal';
import TallyLedgerSelectModal from '../TallyIntegration/TallyLedgerUI/TallyLedgerSelectModal';
import TallyEmployeeGroupSelectModal from '../TallyIntegration/TallyPayrollUI/TallyEmployeeGroupSelectModal';
import TallyEmployeeSelectModal from '../TallyIntegration/TallyPayrollUI/TallyEmployeeSelectModal';
import TallyAttendanceTypeSelectModal from '../TallyIntegration/TallyPayrollUI/TallyAttendanceTypeSelectModal';
import TallyPayHeadSelectModal from '../TallyIntegration/TallyPayrollUI/TallyPayHeadSelectModal';
import TallyPayrollUnitSelectModal from '../TallyIntegration/TallyPayrollUI/TallyPayrollUnitSelectModal';
import TallyEmployeeCategorySelectModal from '../TallyIntegration/TallyPayrollUI/TallyEmployeeCategorySelectModal';
import TallyVoucherTypeSelectModal from '../TallyIntegration/TallyPayrollUI/TallyVoucherTypeSelectModal';
import {
    Search, FileText, Check, XCircle, ChevronDown, MoreVertical,
    TrendingUp, ArrowUpRight, ArrowDownRight, IndianRupee, HelpCircle,
    Printer, Share2, Upload, Download, Globe, Database, Building, Calendar, X
} from 'lucide-react';
import { Notification as AppNotification } from '../../services/notificationService';
import TallyGroupView from '../TallyIntegration/TallyGroupUI/TallyGroupView';
import ChartOfAccounts from '../TallyIntegration/TallyInventoryUI/ChartOfAccounts';
import TallyHeader from '../TallyIntegration/TallyGroupUI/TallyHeader';
import TallySidebar from '../TallyIntegration/TallyCommon/TallySidebar';
import { PeriodModal, TallySelectionList, otherMastersData, changeViewData, GenericModal } from '../TallyIntegration/TallyCommon/TallySidebarModals';
import TallyLedgerView from '../TallyIntegration/TallyLedgerUI/TallyLedgerView';
import TallyVoucherView from '../TallyIntegration/TallyVoucherUI/TallyVoucherView';
import TallyStockGroupCreation from '../TallyIntegration/TallyInventoryUI/TallyStockGroupCreation';
import TallyStockCategoryCreation from '../TallyIntegration/TallyInventoryUI/TallyStockCategoryCreation';
import TallyStockItemCreation from '../TallyIntegration/TallyInventoryUI/TallyStockItemCreation';
import TallyUnitCreation from '../TallyIntegration/TallyInventoryUI/TallyUnitCreation';
import TallyChartOfAccounts from '../TallyIntegration/TallyInventoryUI/TallyChartOfAccounts';
import TallyEmployeeGroupCreation from '../TallyIntegration/TallyPayrollUI/TallyEmployeeGroupCreation';
import TallyEmployeeCategoryCreation from '../TallyIntegration/TallyPayrollUI/TallyEmployeeCategoryCreation';
import TallyEmployeeCreation from '../TallyIntegration/TallyPayrollUI/TallyEmployeeCreation';
import TallyPayrollUnitCreation from '../TallyIntegration/TallyPayrollUI/TallyPayrollUnitCreation';
import TallyAttendanceTypeCreation from '../TallyIntegration/TallyPayrollUI/TallyAttendanceTypeCreation';
import TallyPayHeadCreation from '../TallyIntegration/TallyPayrollUI/TallyPayHeadCreation';
import TallyPayrollVoucherCreation from '../TallyIntegration/TallyPayrollUI/TallyPayrollVoucherCreation';
import TallyEmployeeCategoryList from '../TallyIntegration/TallyPayrollUI/TallyEmployeeCategoryList';
import TallyEmployeeGroupList from '../TallyIntegration/TallyPayrollUI/TallyEmployeeGroupList';
import TallyEmployeeList from '../TallyIntegration/TallyPayrollUI/TallyEmployeeList';
import TallyAttendanceTypeList from '../TallyIntegration/TallyPayrollUI/TallyAttendanceTypeList';
import TallyPayHeadList from '../TallyIntegration/TallyPayrollUI/TallyPayHeadList';
import TallyPayrollUnitList from '../TallyIntegration/TallyPayrollUI/TallyPayrollUnitList';
import TallyPayrollVoucherTypeList from '../TallyIntegration/TallyPayrollUI/TallyPayrollVoucherTypeList';
import TallySalaryDefineSelection from '../TallyIntegration/TallyPayrollUI/TallySalaryDefineSelection';
import TallySalaryDetailsAlteration from '../TallyIntegration/TallyPayrollUI/TallySalaryDetailsAlteration';
import TallyGSTClassificationCreation from '../TallyIntegration/TallyStatutoryUI/TallyGSTClassificationCreation';
import TallyCompanyGSTDetails from '../TallyIntegration/TallyStatutoryUI/TallyCompanyGSTDetails';
import TallyPANCINDetails from '../TallyIntegration/TallyStatutoryUI/TallyPANCINDetails';
import TallyCompanyCreation from '../TallyIntegration/TallyGroupUI/TallyCompanyCreation';
import SalesDataDisplay from '../TallyIntegration/TallyGroupUI/SalesDataDisplay';
import PayrollActivationGate from '../TallyIntegration/TallyPayrollUI/PayrollActivationGate';
import TallyPayrollControl from '../TallyIntegration/TallyPayrollUI/TallyPayrollControl';
import TallyPayrollReports from '../TallyReports/TallyPayrollReports';
import { getPayrollConfig, activatePayroll, DEFAULT_COMPANY_ID } from '../../services/accountingService';
import TallyGodownCreation from '../TallyIntegration/TallyInventoryUI/TallyGodownCreation';
import TallyGodownAlteration from '../TallyIntegration/TallyInventoryUI/TallyGodownAlteration';
import TallyStockCategoryAlteration from '../TallyIntegration/TallyInventoryUI/TallyStockCategoryAlteration';
import TallyStockGroupAlteration from '../TallyIntegration/TallyInventoryUI/TallyStockGroupAlteration';
import TallyStockItemAlteration from '../TallyIntegration/TallyInventoryUI/TallyStockItemAlteration';
import TallyUnitAlteration from '../TallyIntegration/TallyInventoryUI/TallyUnitAlteration';

// Tally Reports
import TrialBalance from '../TallyReports/TrialBalance';
import ProfitLoss from '../TallyReports/ProfitLoss';
import BalanceSheet from '../TallyReports/BalanceSheet';
import LedgerStatement from '../TallyReports/LedgerStatement';
import DayBook from '../TallyReports/DayBook';

// Banking
import { BankReconciliationView } from '../TallyIntegration/Banking/BankReconciliation';
import BankingGateway from '../TallyIntegration/Banking/BankingGateway';

interface UserDashboardProps {
    onNavigate?: (view: string) => void;
    notifications?: AppNotification[];
    unreadCount?: number;
    isNotificationOpen?: boolean;
    setIsNotificationOpen?: (open: boolean) => void;
    handleMarkAsRead?: (id: string) => void;
    handleMarkAllAsRead?: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
    onNavigate,
    notifications = [],
    unreadCount = 0,
    isNotificationOpen = false,
    setIsNotificationOpen = () => { },
    handleMarkAsRead = () => { },
    handleMarkAllAsRead = () => { }
}) => {
    // Current Tally Date
    const currentPeriod = "1-Apr-25 to 31-Mar-26";
    const currentDate = "Tuesday, 1-Apr-2025";
    const lastEntryDate = "1-Apr-25";

    // View State
    const [currentView, setCurrentView] = useState<'gateway' | 'master-creation' | 'chart-of-accounts' | 'list-of-ledgers' | 'tally-groups' | 'tally-ledgers' | 'tally-vouchers' | 'tally-stock-groups' | 'tally-stock-categories' | 'tally-stock-items' | 'tally-units' | 'tally-godowns' | 'tally-employee-groups' | 'tally-employee-categories' | 'tally-employees' | 'tally-payroll-units' | 'tally-attendance-types' | 'tally-pay-heads' | 'tally-payroll-vouchers' | 'tally-gst-classifications' | 'tally-company-gst' | 'tally-pan-cin' | 'tally-create-company' | 'trial-balance' | 'profit-loss' | 'balance-sheet' | 'ledger-statement' | 'day-book' | 'list-employee-categories' | 'list-employee-groups' | 'list-employees' | 'list-attendance-types' | 'list-pay-heads' | 'list-payroll-units' | 'list-payroll-vouchers' | 'banking-gateway' | 'bank-reconciliation' | 'payroll-control' | 'payroll-reports' | 'tally-salary-define-selection' | 'tally-salary-details-alteration'>('gateway');
    const [modalMode, setModalMode] = useState<'create' | 'alter' | 'chart' | 'voucher-entry'>('create');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [masterSelectedIndex, setMasterSelectedIndex] = useState(0);
    const [showMore, setShowMore] = useState(false);
    const [showInactive, setShowInactive] = useState(false);
    const [subView, setSubView] = useState<'masters' | 'companies'>('masters');
    const [showCurrencyDialog, setShowCurrencyDialog] = useState(false);
    const [showGodownDialog, setShowGodownDialog] = useState(false);
    const [showGodownCreation, setShowGodownCreation] = useState(false);
    const [showGodownAlteration, setShowGodownAlteration] = useState(false);

    const [showStockCategoryDialog, setShowStockCategoryDialog] = useState(false);
    const [showStockCategoryCreation, setShowStockCategoryCreation] = useState(false);
    const [showStockCategoryAlteration, setShowStockCategoryAlteration] = useState(false);

    const [showStockGroupDialog, setShowStockGroupDialog] = useState(false);
    const [showStockGroupCreation, setShowStockGroupCreation] = useState(false);
    const [showStockGroupAlteration, setShowStockGroupAlteration] = useState(false);

    const [showStockItemDialog, setShowStockItemDialog] = useState(false);
    const [showStockItemCreation, setShowStockItemCreation] = useState(false);
    const [showStockItemAlteration, setShowStockItemAlteration] = useState(false);

    const [showUnitDialog, setShowUnitDialog] = useState(false);
    const [showUnitCreation, setShowUnitCreation] = useState(false);
    const [showUnitAlteration, setShowUnitAlteration] = useState(false);
    const [showGstRegistrationDialog, setShowGstRegistrationDialog] = useState(false);
    const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
    const [selectedVoucherType, setSelectedVoucherType] = useState<string | null>(null);
    const [showSalesData, setShowSalesData] = useState(false);
    const [showPayrollActivation, setShowPayrollActivation] = useState(false);
    const [pendingPayrollAction, setPendingPayrollAction] = useState<string | null>(null);
    const [isCheckingPayroll, setIsCheckingPayroll] = useState(false);

    // Companies State
    const [activeCompanies, setActiveCompanies] = useState<Array<{ id?: string, name: string, date: string }>>([{ name: 'Solarica', date: '1-Apr-25' }]);
    const [openCompanyIds, setOpenCompanyIds] = useState<string[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<{ id: string, name: string } | null>(null);
    const [companyModalMode, setCompanyModalMode] = useState<'change' | 'select' | 'shut'>('change');
    const [activePopup, setActivePopup] = useState<string | null>(null);
    const [selectedDefineTarget, setSelectedDefineTarget] = useState<{ type: 'Employee' | 'Group', id: string, name: string } | null>(null);
    const [selectedMaster, setSelectedMaster] = useState<{ id?: string, name: string, mode: 'Create' | 'Alter' } | null>(null);
    
    // Proforma ID for Creating Sales Voucher
    const [sourceProformaId, setSourceProformaId] = useState<string | null>(null);
    const [sourceType, setSourceType] = useState<'quotation' | 'invoice' | null>(null);

    const handleCompanyChange = (id: string, name: string) => {
        if (id && !openCompanyIds.includes(id)) {
            setOpenCompanyIds(prev => [...prev, id]);
        }
        const found = activeCompanies.find(c => c.id === id || c.name === name);
        if (found) {
            setSelectedCompany({ id: found.id || '', name: found.name });
        } else {
            // Fallback if ID searching fails (e.g. from generic name select)
            setSelectedCompany({ id, name });
        }
    };

    // Fetch companies on mount
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                // Import dynamically to avoid circular dependency issues if any, or just strictly typed if imported at top
                const { getCompanies } = await import('../../services/accountingService');
                const companies = await getCompanies();

                if (companies && companies.length > 0) {
                    const formattedCompanies = companies.map((c: any) => ({
                        id: c.id,
                        name: c.name || c.displayName,
                        // Tally typically shows date of last entry, checking if we have that or just financial year start
                        date: c.financialYearFrom ? new Date(c.financialYearFrom).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }).replace(/ /g, '-') : '1-Apr-25'
                    }));
                    setActiveCompanies(formattedCompanies);
                    setOpenCompanyIds(formattedCompanies.map((c: any) => c.id).filter(Boolean) as string[]);

                    // Set default selected company if not set
                    if (!selectedCompany && formattedCompanies.length > 0) {
                        setSelectedCompany({ id: formattedCompanies[0].id, name: formattedCompanies[0].name });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch companies:", error);
            }
        };

        fetchCompanies();
    }, []);

    // Ledger Tree Data
    const ledgerTreeData = [
        {
            name: "Assets",
            children: [
                {
                    name: "Current Assets",
                    children: [
                        { name: "Bank Accounts" },
                        { name: "Cash-in-Hand", children: [{ name: "Cash", italic: true }] },
                        { name: "Deposits (Asset)" },
                        { name: "Loans & Advances (Asset)" },
                        { name: "Stock-in-Hand" },
                        { name: "Sundry Debtors" }
                    ]
                },
                { name: "Fixed Assets" },
                { name: "Investments", highlight: true },
                { name: "Misc. Expenses (ASSET)" }
            ]
        },
        {
            name: "Liabilities",
            children: [
                { name: "Branch / Divisions" },
                { name: "Capital Account", children: [{ name: "Reserves & Surplus" }] },
                {
                    name: "Current Liabilities",
                    children: [
                        { name: "Duties & Taxes" },
                        { name: "Provisions" },
                        { name: "Sundry Creditors" }
                    ]
                },
                {
                    name: "Loans (Liability)",
                    children: [
                        { name: "Bank OD A/c" },
                        { name: "Secured Loans" },
                        { name: "Unsecured Loans" }
                    ]
                },
                { name: "Suspense A/c" },
                { name: "Profit & Loss A/c", italic: true }
            ]
        },
        {
            name: "Expenses",
            children: [
                { name: "Direct Expenses" },
                { name: "Indirect Expenses" },
                { name: "Purchase Accounts" }
            ]
        },
        {
            name: "Income",
            children: [
                { name: "Direct Incomes" }
            ]
        }
    ];

    const renderLedgerTree = (nodes: any[], depth = 0) => {
        return nodes.map((node, index) => {
            const paddingLeft = depth * 20;
            return (
                <div key={node.name}>
                    <div
                        className={`px-2 py-0.5 text-sm cursor-pointer hover:bg-[#def1fc] flex justify-between group
                            ${node.highlight ? 'bg-[#f4c430] hover:bg-[#f4c430]' : ''}
                        `}
                        style={{ paddingLeft: `${paddingLeft + 8}px` }}
                    >
                        <span className={`
                            ${depth === 0 ? 'font-bold text-black' : ''}
                            ${depth === 1 ? 'font-bold text-black' : ''}
                            ${depth >= 2 ? 'text-[#202020]' : ''}
                            ${node.italic ? 'italic text-gray-600' : ''}
                        `}>
                            {node.name}
                        </span>
                    </div>
                    {node.children && renderLedgerTree(node.children, depth + 1)}
                </div>
            );
        });
    };

    const menuItems = [
        { label: "Create", type: "MASTERS", action: "create-master", shortcut: "C" },
        { label: "Alter", type: "MASTERS", action: "alter-master", shortcut: "A" },
        { label: "Chart of Accounts", type: "MASTERS", action: "chart-of-accounts", shortcut: "H" },

        { label: "Vouchers", type: "TRANSACTIONS", action: "voucher-posting", shortcut: "V" },
        { label: "Day Book", type: "TRANSACTIONS", action: "day-book", shortcut: "K" },
        { label: "Post Dated Vouchers", type: "TRANSACTIONS", action: "post-dated-vouchers", shortcut: "P" },

        { label: "Banking", type: "UTILITIES", action: "banking", shortcut: "B" },
        { label: "Inventory Info", type: "UTILITIES", action: "inventory-info", shortcut: "I" },

        { label: "Balance Sheet", type: "REPORTS", action: "balance-sheet", shortcut: "1" },
        { label: "Profit & Loss A/c", type: "REPORTS", action: "profit-loss", shortcut: "2" },
        { label: "Trial Balance", type: "REPORTS", action: "trial-balance", shortcut: "3" },
        { label: "Stock Summary", type: "REPORTS", action: "stock-summary", shortcut: "4" },
        { label: "Ratio Analysis", type: "REPORTS", action: "ratio-analysis", shortcut: "5" },

        { label: "Display More Reports", type: "MORE", action: "more-reports", shortcut: "M" },
        { label: "Payroll Reports", type: "MORE", action: "payroll-reports", shortcut: "R" },

        { label: "Quit", type: "EXIT", action: "logout", shortcut: "Q" }
    ];

    // Base master menu items (initial view matching Image 0)
    const baseMasterMenuItems = [
        { label: "Group", type: "Accounting Masters", action: "create-group", inactive: false },
        { label: "Ledger", type: "Accounting Masters", action: "create-ledger", inactive: false },
        { label: "Currency", type: "Accounting Masters", action: "create-currency", inactive: false },
        { label: "Voucher Type", type: "Accounting Masters", action: "create-voucher-type", inactive: false },

        { label: "Stock Group", type: "Inventory Masters", action: "create-stock-group", inactive: false },
        { label: "Stock Category", type: "Inventory Masters", action: "create-stock-category", inactive: false },
        { label: "Stock Item", type: "Inventory Masters", action: "create-stock-item", inactive: false },
        { label: "Unit", type: "Inventory Masters", action: "create-unit", inactive: false },
        { label: "Godown", type: "Inventory Masters", action: "create-godown", inactive: false },

        { label: "Employee Groups", type: "Payroll Masters", action: "create-employee-group", inactive: false },
        { label: "Employees", type: "Payroll Masters", action: "create-employee", inactive: false },
        { label: "Pay Heads", type: "Payroll Masters", action: "create-pay-heads", inactive: false },
        { label: "Payroll Voucher Type", type: "Payroll Masters", action: "create-payroll-voucher", inactive: false },
        { label: "Payroll Control", type: "Payroll Masters", action: "payroll-control", inactive: false },

        { label: "GST Registration", type: "Statutory Masters", action: "create-gst-registration", inactive: false },
        { label: "GST Classification", type: "Statutory Masters", action: "create-gst-classification", inactive: false },

        { label: "Company GST Details", type: "Statutory Details", action: "create-company-gst", inactive: false },
        { label: "PAN/CIN Details", type: "Statutory Details", action: "create-pan-cin", inactive: false },
    ];

    // Additional items shown only when "Show More" is clicked
    const moreMasterMenuItems = [
        { label: "Cost Category", type: "Accounting Masters", action: "create-cost-category", inactive: true },
        { label: "Cost Centre", type: "Accounting Masters", action: "create-cost-centre", inactive: true },
        { label: "Cost Centre Class", type: "Accounting Masters", action: "create-cost-centre-class", inactive: true },
        { label: "Budget", type: "Accounting Masters", action: "create-budget", inactive: false },
        { label: "Scenario", type: "Accounting Masters", action: "create-scenario", inactive: false },
        { label: "Rates of Exchange", type: "Accounting Masters", action: "create-rates-exchange", inactive: true },
        { label: "Credit Limits", type: "Accounting Masters", action: "create-credit-limits", inactive: false },
        { label: "Price levels", type: "Inventory Masters", action: "create-price-levels", inactive: true },
        { label: "Price List (Stock Group)", type: "Inventory Masters", action: "create-price-list-group", inactive: true },
        { label: "Price List (Stock Category)", type: "Inventory Masters", action: "create-price-list-category", inactive: true },

    ];

    const [activeModal, setActiveModal] = useState<{ title: string, content: React.ReactNode } | null>(null);

    const dashboardSidebarButtons = [
        { keyName: 'F2', label: 'Period', onClick: () => setActiveModal({ title: 'Change Period', content: <PeriodModal /> }) },
        {
            keyName: 'F3',
            label: 'Company',
            onClick: () => {
                setCurrentView('master-creation');
                setSubView('companies');
                setMasterSelectedIndex(0);
            }
        },
        { keyName: 'F4', label: '', disabled: true },
        { keyName: 'F5', label: 'Dashboard View', onClick: () => setActiveModal({ title: 'Change View', content: <TallySelectionList title="List of Views" items={changeViewData} /> }) },
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
        { keyName: 'F12', label: 'Configure', onClick: () => { /* Open Dashboard Config */ } },
    ];

    // Combined masters with grouping logic preserved
    const masterMenuItems = (() => {
        let items = showMore
            ? [...baseMasterMenuItems, ...moreMasterMenuItems]
            : baseMasterMenuItems;

        // Inject "Define Salary" ONLY in Alter mode
        if (modalMode === 'alter') {
            items = [...items, { label: "Define Salary", type: "Payroll Masters", action: "define-salary", inactive: false }];
        }

        return items.sort((a, b) => {
            const order = ["Accounting Masters", "Inventory Masters", "Payroll Masters", "Statutory Masters", "Statutory Details"];
            const typeA = order.indexOf(a.type);
            const typeB = order.indexOf(b.type);
            if (typeA !== typeB) return typeA - typeB;
            return 0; // Keep original order within group
        }).filter(item => showInactive || !item.inactive);
    })();

    const handleSelect = async (action: string, forcedMode?: 'create' | 'alter' | 'chart') => {
        const mode = forcedMode || modalMode;
        try {
            console.log("handleSelect triggered with action:", action, "Current View:", currentView, "Mode:", modalMode);
            const payrollActions = [
                'create-employee-group',
                'create-employee',
                'create-attendance-type',
                'create-pay-heads',
                'create-payroll-voucher',
                'employee-categories',
                'employee-groups',
                'employees',
                'attendance-types',
                'pay-heads',
                'payroll-units',
                'payroll-vouchers',
                'payroll-control',
                'define-salary'
            ];

            if (payrollActions.includes(action)) {
                // Prioritize selectedCompany.id, then first active company, then default
                const companyId = selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID;
                console.log("Payroll action detect. Selected ID:", selectedCompany?.id, "First Active ID:", activeCompanies[0]?.id, "Final ID used:", companyId);

                if (companyId && companyId !== 'Solarica' && companyId.length >= 10) {
                    setIsCheckingPayroll(true);
                    try {
                        console.log("Checking payroll config for company:", companyId);
                        const config = await getPayrollConfig(companyId);
                        console.log("Payroll config received:", config);
                        if (!config?.payrollEnabled) {
                            setPendingPayrollAction(action);
                            setShowPayrollActivation(true);
                            setIsCheckingPayroll(false);
                            return;
                        }
                    } catch (error) {
                        console.error("Failed to fetch payroll config:", error);
                        setPendingPayrollAction(action);
                        setShowPayrollActivation(true);
                        setIsCheckingPayroll(false);
                        return;
                    }
                    setIsCheckingPayroll(false);
                } else if (companyId === 'Solarica') {
                    console.warn("Invalid company ID for payroll check:", companyId);
                }
            }

            if (currentView === 'gateway') {
                if (action === 'chart-of-accounts') {
                    setCurrentView('chart-of-accounts');
                    setSubView('masters');
                    setMasterSelectedIndex(0);
                    return;
                }
                if (action === 'create-master') {
                    setCurrentView('master-creation');
                    setSubView('masters');
                    setModalMode('create');
                    setMasterSelectedIndex(0);
                    return;
                }
                if (action === 'alter-master') {
                    setCurrentView('master-creation');
                    setSubView('masters');
                    setModalMode('alter');
                    setMasterSelectedIndex(0);
                    return;
                }
            }

            if (currentView === 'master-creation' || currentView === 'chart-of-accounts') {
                console.log("Handling master action:", action, "in view:", currentView);

                if (action === 'create-group') {
                    if (modalMode === 'alter') {
                        setActivePopup('groups');
                        return;
                    }
                    setCurrentView('tally-groups');
                    return;
                }
                if (action === 'create-ledger') {
                    if (modalMode === 'alter') {
                        setActivePopup('ledgers');
                        return;
                    }
                    setCurrentView('tally-ledgers');
                    return;
                }
                if (action === 'create-voucher-type') {
                    if (modalMode === 'alter') {
                        setActivePopup('voucher-types');
                        return;
                    }
                    setCurrentView('tally-vouchers');
                    return;
                }
                if (action === 'create-currency') {
                    setShowCurrencyDialog(true);
                    return;
                }
                if (action === 'create-stock-group') {
                    if (modalMode === 'chart') {
                        setCurrentView('tally-stock-groups');
                    } else if (modalMode === 'alter') {
                        setShowStockGroupAlteration(true);
                    } else {
                        setShowStockGroupCreation(true);
                    }
                    return;
                }
                if (action === 'create-stock-category') {
                    if (mode === 'chart') {
                        setCurrentView('tally-stock-categories');
                    } else if (mode === 'alter') {
                        setShowStockCategoryAlteration(true);
                    } else {
                        setShowStockCategoryCreation(true);
                    }
                    return;
                }
                if (action === 'create-stock-item') {
                    if (mode === 'chart') {
                        setCurrentView('tally-stock-items');
                    } else if (mode === 'alter') {
                        setShowStockItemAlteration(true);
                    } else {
                        setShowStockItemCreation(true);
                    }
                    return;
                }
                if (action === 'create-unit') {
                    if (mode === 'chart') {
                        setCurrentView('tally-units');
                    } else if (mode === 'alter') {
                        setShowUnitAlteration(true);
                    } else {
                        setShowUnitCreation(true);
                    }
                    return;
                }
                if (action === 'create-godown') {
                    if (mode === 'chart') {
                        setCurrentView('tally-godowns');
                    } else if (mode === 'alter') {
                        setShowGodownAlteration(true);
                    } else {
                        setShowGodownDialog(true);
                    }
                    return;
                }
                if (action === 'create-employee-category') {
                    if (mode === 'alter') {
                        setActivePopup('employee-categories');
                        return;
                    }
                    setCurrentView('list-employee-categories');
                    return;
                }
                if (action === 'create-employee-group') {
                    console.log("Navigating to employee group creation/list");
                    if (mode === 'alter') {
                        setActivePopup('employee-groups');
                        return;
                    }
                    if (mode === 'chart') setCurrentView('list-employee-groups');
                    else setCurrentView('tally-employee-groups');
                    return;
                }
                if (action === 'create-employee') {
                    if (mode === 'alter') {
                        setActivePopup('employees');
                        return;
                    }
                    if (mode === 'chart') setCurrentView('list-employees');
                    else setCurrentView('tally-employees');
                    return;
                }
                if (action === 'create-units-work') {
                    if (mode === 'alter') {
                        setActivePopup('payroll-units');
                        return;
                    }
                    if (mode === 'chart') setCurrentView('list-payroll-units');
                    else setCurrentView('tally-payroll-units');
                    return;
                }
                if (action === 'create-pay-heads') {
                    if (mode === 'alter') {
                        setActivePopup('pay-heads');
                        return;
                    }
                    if (mode === 'chart') setCurrentView('list-pay-heads');
                    else setCurrentView('tally-pay-heads');
                    return;
                }
                if (action === 'create-payroll-voucher') {
                    if (mode === 'alter') {
                        setActivePopup('voucher-types');
                        return;
                    }
                    if (mode === 'chart') setCurrentView('list-payroll-vouchers');
                    else setCurrentView('tally-payroll-vouchers');
                    return;
                }
                if (action === 'create-gst-classification') {
                    setCurrentView('tally-gst-classifications');
                    return;
                }
                if (action === 'create-gst-registration') {
                    setShowGstRegistrationDialog(true);
                    return;
                }
                if (action === 'create-pan-cin') {
                    setCurrentView('tally-pan-cin');
                    return;
                }
                if (action === 'create-company-gst') {
                    setCurrentView('tally-company-gst');
                    return;
                }

                // Payroll Master List Views (from Chart of Accounts)
                if (action === 'employee-categories') {
                    setCurrentView('list-employee-categories');
                    return;
                }
                if (action === 'employee-groups') {
                    setCurrentView('list-employee-groups');
                    return;
                }
                if (action === 'employees') {
                    setCurrentView('list-employees');
                    return;
                }
                if (action === 'attendance-types') {
                    setCurrentView('list-attendance-types');
                    return;
                }
                if (action === 'pay-heads') {
                    setCurrentView('list-pay-heads');
                    return;
                }
                if (action === 'payroll-units') {
                    setCurrentView('list-payroll-units');
                    return;
                }
                if (action === 'payroll-vouchers') {
                    setCurrentView('list-payroll-vouchers');
                    return;
                }
                if (action === 'payroll-control') {
                    setCurrentView('payroll-control');
                    return;
                }
                if (action === 'define-salary') {
                    setCurrentView('tally-salary-define-selection');
                    return;
                }
            }

            if (action === 'voucher-posting' && currentView === 'gateway') {
                setCurrentView('tally-vouchers');
                setModalMode('voucher-entry');
                return;
            }

            switch (action) {
                case 'trial-balance':
                case 'more-reports':
                    setCurrentView('trial-balance');
                    break;
                case 'balance-sheet':
                    setCurrentView('balance-sheet');
                    break;
                case 'profit-loss':
                case 'p-l-statement':
                    setCurrentView('profit-loss');
                    break;
                case 'day-book':
                    setCurrentView('day-book');
                    break;
                case 'payroll-reports':
                    setCurrentView('payroll-reports');
                    break;
                case 'ledger-management':
                    setCurrentView('ledger-statement');
                    break;
                case 'banking':
                    setCurrentView('banking-gateway');
                    break;
                default:
                    if (onNavigate) {
                        if (action === 'voucher-posting') onNavigate('voucher-posting');
                        else if (action === 'create-ledger') onNavigate('ledger-creation');
                    }
            }
        } catch (err) {
            console.error("Critical error in handleSelect:", err);
            setIsCheckingPayroll(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showCurrencyDialog || showGodownDialog || showGstRegistrationDialog) {
                if (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'a' || e.key === 'Escape') {
                    if (showGstRegistrationDialog && e.key.toLowerCase() === 'c') {
                        setCurrentView('tally-company-gst');
                    }
                    if (showGstRegistrationDialog && e.key.toLowerCase() === 'a') {
                        setCurrentView('tally-company-gst');
                    }
                    setShowCurrencyDialog(false);
                    setShowGodownDialog(false);
                    setShowGstRegistrationDialog(false);
                }
                return;
            }

            if (currentView === 'gateway') {
                // Arrow key navigation
                if (e.key === 'ArrowUp') setSelectedIndex(prev => (prev > 0 ? prev - 1 : menuItems.length - 1));
                else if (e.key === 'ArrowDown') setSelectedIndex(prev => (prev < menuItems.length - 1 ? prev + 1 : 0));
                else if (e.key === 'Enter') handleSelect(menuItems[selectedIndex].action);

                // Keyboard shortcut navigation
                else {
                    const key = e.key.toUpperCase();
                    const itemIndex = menuItems.findIndex(item => item.shortcut === key);
                    if (itemIndex !== -1) {
                        setSelectedIndex(itemIndex);
                        handleSelect(menuItems[itemIndex].action);
                    }
                }
            } else if (currentView === 'master-creation') {
                if (e.key === 'ArrowUp') setMasterSelectedIndex(prev => (prev > 0 ? prev - 1 : masterMenuItems.length - 1));
                else if (e.key === 'ArrowDown') setMasterSelectedIndex(prev => (prev < masterMenuItems.length - 1 ? prev + 1 : 0));
                else if (e.key === 'Enter') handleSelect(masterMenuItems[masterSelectedIndex].action);
                else if (e.key === 'Escape') setCurrentView('gateway');
            } else if (currentView === 'list-of-ledgers') {
                if (e.key === 'Escape') setCurrentView('master-creation');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, masterSelectedIndex, currentView, showCurrencyDialog, showGodownDialog, showGstRegistrationDialog, showMore, showInactive]);

    return (
        <div className="flex flex-col h-screen w-full bg-white font-sans text-sm select-none overflow-hidden relative">

            {/* Top Header Section */}
            <div className="flex flex-col shrink-0 z-50">
                <TallyHeader
                    onToggleSalesData={() => setShowSalesData(!showSalesData)}
                    showSalesData={showSalesData}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    isNotificationOpen={isNotificationOpen}
                    setIsNotificationOpen={setIsNotificationOpen}
                    handleMarkAsRead={handleMarkAsRead}
                    handleMarkAllAsRead={handleMarkAllAsRead}
                    onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')}
                />
            </div>

            <GenericModal activeModal={activeModal} onClose={() => setActiveModal(null)} />

            {showSalesData ? (
                /* Sales Data View - Full Screen */
                <div className="flex flex-1 overflow-hidden">
                    <SalesDataDisplay onAction={(action, payload) => {
                        if (action === 'CREATE_VOUCHER') {
                            setSourceProformaId(payload.sourceProformaId);
                            setSourceType(payload.sourceType);
                            setSelectedVoucherType(payload.type);
                            setShowSalesData(false);
                            setCurrentView('tally-vouchers');
                            setModalMode('voucher-entry');
                        }
                    }} />
                </div>
            ) : (
                <>
                    {/* Gateway title bar - richer gradient */}
                    <div className="bg-gradient-to-r from-[#7ab8e8] via-[#8ec2eb] to-[#7ab8e8] text-[#0d2a40] text-[11px] font-bold px-3 py-1 flex items-center justify-between border-b-2 border-[#5ea4d6] shadow-sm">
                        <span className="tracking-wide">Gateway of Accounting</span>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-semibold text-[#2a6080] opacity-70">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            <button onClick={() => setCurrentView('chart-of-accounts')} className="hover:bg-black/10 p-0.5 rounded ml-1 transition-colors"><X size={11} /></button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-1 overflow-hidden bg-[#def1fc]">

                        {/* Left Area */}
                        <div className="w-[55%] p-4 flex flex-col border-r-2 border-[#88b5dd] relative"
                            style={{ background: 'linear-gradient(135deg, #def1fc 0%, #d2eaf8 100%)' }}>
                            <div className="flex justify-between items-start mb-5">
                                {/* Current Period pill */}
                                <div
                                    className="flex flex-col gap-0.5 w-1/2 cursor-pointer border-l-[3px] border-[#5ea4d6] pl-2 py-1 rounded-r-md hover:bg-[#c8e5f7]/60 transition-colors"
                                    onClick={() => setActiveModal({ title: 'Change Period', content: <PeriodModal /> })}
                                >
                                    <span className="text-[#3a87c0] text-[10px] font-black uppercase tracking-widest">Current Period</span>
                                    <span className="font-bold text-[#0d2a40] text-sm">{currentPeriod}</span>
                                </div>
                                {/* Current Date pill */}
                                <div
                                    className="flex flex-col gap-0.5 w-2/5 items-end cursor-pointer border-r-[3px] border-[#5ea4d6] pr-2 py-1 rounded-l-md hover:bg-[#c8e5f7]/60 transition-colors"
                                    onClick={() => setActiveModal({ title: 'Change Date', content: <div className="p-4">Date Change Modal</div> })}
                                >
                                    <span className="text-[#3a87c0] text-[10px] font-black uppercase tracking-widest">Current Date</span>
                                    <span className="font-bold text-[#0d2a40] text-sm">{currentDate}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 text-[10px] border-b-2 border-[#5ea4d6] pb-1 mb-1">
                                <span className="text-[#1e6a9e] uppercase font-black tracking-widest">Name of Company</span>
                                <span className="text-[#1e6a9e] uppercase font-black tracking-widest text-right">Date of Last Entry</span>
                            </div>

                            <div className="flex flex-col gap-0.5 max-h-[200px] overflow-y-auto tally-scroll">
                                {activeCompanies.filter(c => openCompanyIds.includes(c.id || '')).map((comp, idx) => (
                                    <div
                                        key={idx}
                                        className={`tally-company-row grid grid-cols-2 gap-x-8 font-bold text-sm cursor-pointer px-2 py-1 rounded-sm transition-colors
                                            ${selectedCompany?.name === comp.name ? 'active text-black font-extrabold bg-[#daeef9]' : 'text-[#1b2c3c]'}`}
                                        onClick={() => {
                                            if (comp.id) setSelectedCompany({ id: comp.id, name: comp.name });
                                        }}
                                    >
                                        <span>{comp.name}</span>
                                        <span className="text-right text-[#3a6891]">{comp.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Center: Gateway Menu */}
                        <div className="flex-1 flex justify-start pl-10 pt-16 relative">
                            {/* Menu Container - animated scale-in on mount */}
                            <div className="w-[280px] bg-[#f2faff] border border-[#2a5585] shadow-xl flex flex-col h-auto max-h-[80%]"
                                style={{ animation: 'gatewayPopIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                                {/* Menu Header */}
                                <div className="bg-gradient-to-r from-[#2a5585] to-[#1e4a7a] text-white text-center py-2 font-bold text-sm tracking-wide shrink-0 shadow-sm">
                                    Gateway of Accounting
                                </div>

                                {/* Menu Items List */}
                                <div className="overflow-y-auto py-2 flex-col flex items-center">
                                    {menuItems.map((item, index) => {
                                        const isNewGroup = index === 0 || menuItems[index - 1].type !== item.type;
                                        const groupLabel = item.type;
                                        const isActive = selectedIndex === index;

                                        return (
                                            <div key={index} className="w-full flex flex-col items-center">
                                                {isNewGroup && item.type !== 'EXIT' && (
                                                    <div className="w-full px-4 pt-2 pb-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-px bg-[#88b5dd]/40" />
                                                            <span className="text-[#5ea4d6] text-[9px] uppercase font-bold tracking-widest whitespace-nowrap">{groupLabel}</span>
                                                            <div className="flex-1 h-px bg-[#88b5dd]/40" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div
                                                    className={`w-full text-center px-4 py-1.5 cursor-pointer relative flex items-center justify-center gap-2
                                                        transition-all duration-[120ms] ease-out
                                                        ${isActive
                                                            ? 'bg-[#f4c430] text-black font-bold border-l-4 border-[#c8960a]'
                                                            : 'text-[#2a5585] hover:bg-[#daeef9] hover:border-l-4 hover:border-[#5ea4d6] border-l-4 border-transparent'
                                                        }
                                                    `}
                                                    onClick={() => {
                                                        setSelectedIndex(index);
                                                        handleSelect(item.action);
                                                    }}
                                                    onMouseEnter={() => setSelectedIndex(index)}
                                                >
                                                    {/* Shortcut letter underlined in label */}
                                                    <span>
                                                        {item.shortcut ? (
                                                            (() => {
                                                                const sc = item.shortcut;
                                                                const lbl = item.label;
                                                                const idx = lbl.toUpperCase().indexOf(sc.toUpperCase());
                                                                if (idx === -1) return lbl;
                                                                return (
                                                                    <>
                                                                        {lbl.slice(0, idx)}
                                                                        <span className="underline underline-offset-2 decoration-[#2a5585]">{lbl[idx]}</span>
                                                                        {lbl.slice(idx + 1)}
                                                                    </>
                                                                );
                                                            })()
                                                        ) : item.label}
                                                    </span>
                                                    {item.shortcut && (
                                                        <span className={`text-[9px] font-bold ${isActive ? 'text-[#d32f2f]' : 'text-[#aaa]'}`}>
                                                            [{item.shortcut}]
                                                        </span>
                                                    )}
                                                </div>

                                                {item.type === 'EXIT' && isNewGroup && <div className="w-1/2 border-t border-[#88b5dd]/30 my-2"></div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <TallySidebar buttons={dashboardSidebarButtons} />
                    </div>

                    {/* Tally-style status bar */}
                    <div className="flex-shrink-0 bg-gradient-to-r from-[#1e3a5f] to-[#2a5585] text-[#a8d4f0] text-[10px] font-medium px-3 py-0.5 flex items-center justify-between select-none">
                        <div className="flex items-center gap-3">
                            <span className="text-white font-bold">{selectedCompany?.name || 'No Company Selected'}</span>
                            <span className="opacity-50">|</span>
                            <span>{currentPeriod}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="opacity-70">{currentDate}</span>
                            <span className="opacity-50">|</span>
                            <span className="text-[#7bc8f0]">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </>
            )}


            {/* Tally Group View */}
            {currentView === 'tally-groups' && (
                <div className="absolute inset-0 z-[100] bg-white">
                    <TallyGroupView
                        onQuit={() => {
                            setCurrentView('chart-of-accounts');
                            setSelectedMaster(null);
                        }}
                        mode={selectedMaster?.mode.toLowerCase() as any || (modalMode === 'create' ? 'create' : (modalMode === 'alter' ? 'alter' : 'list'))}
                        initialGroup={selectedMaster?.name || ''}
                        companyId={selectedCompany?.id || ''}
                        companyName={selectedCompany?.name || ''}
                        companies={activeCompanies}
                        onCompanyChange={handleCompanyChange}
                    />
                </div>
            )}

            {/* Tally Ledger View */}
            {currentView === 'tally-ledgers' && (
                <div className="absolute inset-0 z-[100] bg-white">
                    <TallyLedgerView
                        onQuit={() => {
                            setCurrentView('chart-of-accounts');
                            setSelectedMaster(null);
                        }}
                        mode={selectedMaster?.mode.toLowerCase() as any || (modalMode === 'create' ? 'create' : (modalMode === 'alter' ? 'alter' : 'list'))}
                        initialLedger={selectedMaster?.name || ''}
                        companyId={selectedCompany?.id || ''}
                        companyName={selectedCompany?.name || ''}
                        companies={activeCompanies}
                        onCompanyChange={handleCompanyChange}
                    />
                </div>
            )}

            {/* Tally Voucher View */}
            {currentView === 'tally-vouchers' && (
                <div className="absolute inset-0 z-[100] bg-white">
                    <TallyVoucherView
                        onQuit={() => {
                            setCurrentView(modalMode === 'chart' || modalMode === 'alter' || modalMode === 'create' ? 'master-creation' : 'gateway');
                            setSelectedVoucherId(null);
                            setSelectedVoucherType(null);
                            setSourceProformaId(null);
                        }}
                        mode={selectedVoucherId ? 'alter' : (modalMode === 'create' ? 'create' : 'list')}
                        companyId={selectedCompany?.id || activeCompanies[0]?.id || ''}
                        companyName={selectedCompany?.name || activeCompanies[0]?.name || 'Solarica'}
                        voucherId={selectedVoucherId || undefined}
                        voucherType={selectedVoucherType || undefined}
                        sourceProformaId={sourceProformaId || undefined}
                        sourceType={sourceType || undefined}
                        companies={activeCompanies}
                        onCompanyChange={handleCompanyChange}
                    />
                </div>
            )}

            {/* Inventory Masters Views */}
            {currentView === 'tally-stock-groups' && (
                modalMode === 'chart' ? (
                    <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex flex-1 overflow-hidden">
                            <TallyChartOfAccounts type="Stock Group" companyId={selectedCompany?.id} onClose={() => setCurrentView('chart-of-accounts')} onAction={(action) => handleSelect(action, 'create')} />
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex flex-1 overflow-hidden">
                            <TallyStockGroupCreation onClose={() => setCurrentView('chart-of-accounts')} />
                        </div>
                    </div>
                )
            )}
            {currentView === 'tally-stock-categories' && (
                modalMode === 'chart' ? (
                    <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex flex-1 overflow-hidden">
                            <TallyChartOfAccounts type="Stock Category" companyId={selectedCompany?.id} onClose={() => setCurrentView('chart-of-accounts')} onAction={(action) => handleSelect(action, 'create')} />
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex flex-1 overflow-hidden">
                            <TallyStockCategoryCreation onClose={() => setCurrentView('chart-of-accounts')} />
                        </div>
                    </div>
                )
            )}
            {currentView === 'tally-stock-items' && (
                modalMode === 'chart' ? (
                    <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex flex-1 overflow-hidden">
                            <TallyChartOfAccounts type="Stock Item" companyId={selectedCompany?.id} onClose={() => setCurrentView('chart-of-accounts')} onAction={(action) => handleSelect(action, 'create')} />
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex flex-1 overflow-hidden">
                            <TallyStockItemCreation onClose={() => setCurrentView('chart-of-accounts')} />
                        </div>
                    </div>
                )
            )}
            {currentView === 'tally-units' && (
                modalMode === 'chart' ? (
                    <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex flex-1 overflow-hidden">
                            <TallyChartOfAccounts type="Unit" companyId={selectedCompany?.id} onClose={() => setCurrentView('chart-of-accounts')} onAction={(action) => handleSelect(action, 'create')} />
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex flex-1 overflow-hidden">
                            <TallyUnitCreation onClose={() => setCurrentView('chart-of-accounts')} />
                        </div>
                    </div>
                )
            )}

            {currentView === 'tally-godowns' && (
                modalMode === 'chart' ? (
                    <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex flex-1 overflow-hidden">
                            <TallyChartOfAccounts type="Godown" companyId={selectedCompany?.id} onClose={() => setCurrentView('master-creation')} onAction={(action) => handleSelect(action, 'create')} />
                        </div>
                    </div>
                ) : null
            )}

            {/* Payroll Masters Views */}
            {currentView === 'tally-employee-groups' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <div className="flex flex-1 overflow-hidden">
                        <TallyEmployeeGroupCreation
                            onClose={() => {
                                setCurrentView('chart-of-accounts');
                                setSelectedMaster(null);
                            }}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                            initialMode={selectedMaster?.mode || (modalMode === 'alter' ? 'Alter' : 'Create')}
                            initialName={selectedMaster?.name || ''}
                        />
                    </div>
                </div>
            )}
            {currentView === 'tally-employees' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <div className="flex flex-1 overflow-hidden">
                        <TallyEmployeeCreation
                            onClose={() => {
                                setCurrentView('chart-of-accounts');
                                setSelectedMaster(null);
                            }}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                            initialMode={selectedMaster?.mode || (modalMode === 'alter' ? 'Alter' : 'Create')}
                            initialName={selectedMaster?.name || ''}
                        />
                    </div>
                </div>
            )}
            {currentView === 'tally-employee-categories' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <div className="flex flex-1 overflow-hidden">
                        <TallyEmployeeCategoryCreation
                            onClose={() => {
                                setCurrentView('chart-of-accounts');
                                setSelectedMaster(null);
                            }}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                            initialMode={selectedMaster?.mode || (modalMode === 'alter' ? 'Alter' : 'Create')}
                            initialName={selectedMaster?.name || ''}
                        />
                    </div>
                </div>
            )}
            {currentView === 'tally-payroll-units' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <div className="flex flex-1 overflow-hidden">
                        <TallyPayrollUnitCreation
                            onClose={() => {
                                setCurrentView('chart-of-accounts');
                                setSelectedMaster(null);
                            }}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                            initialMode={selectedMaster?.mode || (modalMode === 'alter' ? 'Alter' : 'Create')}
                            initialName={selectedMaster?.name || ''}
                        />
                    </div>
                </div>
            )}
            {currentView === 'tally-attendance-types' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <div className="flex flex-1 overflow-hidden">
                        <TallyAttendanceTypeCreation
                            onClose={() => {
                                setCurrentView('chart-of-accounts');
                                setSelectedMaster(null);
                            }}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                            initialMode={selectedMaster?.mode || (modalMode === 'alter' ? 'Alter' : 'Create')}
                            initialName={selectedMaster?.name || ''}
                        />
                    </div>
                </div>
            )}
            {currentView === 'tally-pay-heads' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <div className="flex flex-1 overflow-hidden">
                        <TallyPayHeadCreation
                            onClose={() => {
                                setCurrentView('chart-of-accounts');
                                setSelectedMaster(null);
                            }}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                            initialMode={selectedMaster?.mode || (modalMode === 'alter' ? 'Alter' : 'Create')}
                            initialName={selectedMaster?.name || ''}
                        />
                    </div>
                </div>
            )}
            {currentView === 'tally-payroll-vouchers' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <div className="flex flex-1 overflow-hidden">
                        <TallyPayrollVoucherCreation
                            onClose={() => {
                                setCurrentView('chart-of-accounts');
                                setSelectedMaster(null);
                            }}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                            initialMode={selectedMaster?.mode || (modalMode === 'alter' ? 'Alter' : 'Create')}
                            initialName={selectedMaster?.name || ''}
                        />
                    </div>
                </div>
            )}

            {/* Payroll Master List Views */}
            {currentView === 'list-employee-categories' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 w-full flex overflow-hidden">
                        <TallyEmployeeCategoryList
                            onClose={() => setCurrentView('chart-of-accounts')}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                        />
                    </div>
                </div>
            )}



            {currentView === 'list-employee-groups' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 w-full flex overflow-hidden">
                        <TallyEmployeeGroupList
                            onClose={() => setCurrentView('chart-of-accounts')}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                        />
                    </div>
                </div>
            )}
            {currentView === 'list-employees' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 w-full flex overflow-hidden">
                        <TallyEmployeeList
                            onClose={() => setCurrentView('chart-of-accounts')}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                        />
                    </div>
                </div>
            )}
            {currentView === 'list-attendance-types' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 w-full flex overflow-hidden">
                        <TallyAttendanceTypeList
                            onClose={() => setCurrentView('chart-of-accounts')}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                        />
                    </div>
                </div>
            )}
            {currentView === 'list-pay-heads' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 w-full flex overflow-hidden">
                        <TallyPayHeadList
                            onClose={() => setCurrentView('chart-of-accounts')}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                        />
                    </div>
                </div>
            )}
            {currentView === 'list-payroll-units' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 w-full flex overflow-hidden">
                        <TallyPayrollUnitList
                            onClose={() => setCurrentView('chart-of-accounts')}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                        />
                    </div>
                </div>
            )}

            {currentView === 'list-payroll-vouchers' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 w-full flex overflow-hidden">
                        <TallyPayrollVoucherTypeList
                            onClose={() => setCurrentView('chart-of-accounts')}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                        />
                    </div>
                </div>
            )}

            {currentView === 'tally-salary-define-selection' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 w-full flex overflow-hidden">
                        <TallySalaryDefineSelection
                            onClose={() => setCurrentView('chart-of-accounts')}
                            onSelect={(type: 'Employee' | 'Group', id: string, name: string) => {
                                setSelectedDefineTarget({ type, id, name });
                                setCurrentView('tally-salary-details-alteration');
                            }}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                        />
                    </div>
                </div>
            )}

            {currentView === 'tally-salary-details-alteration' && selectedDefineTarget && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 w-full flex overflow-hidden">
                        <TallySalaryDetailsAlteration
                            onClose={() => setCurrentView('tally-salary-define-selection')}
                            targetType={selectedDefineTarget.type}
                            targetId={selectedDefineTarget.id}
                            targetName={selectedDefineTarget.name}
                            companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                        />
                    </div>
                </div>
            )}

            {/* Chart of Accounts */}
            {currentView === 'chart-of-accounts' && (
                <div className="absolute inset-0 z-[150]">
                    <ChartOfAccounts
                        onClose={() => setCurrentView('gateway')}
                        onNavigateToPayroll={(masterType) => {
                            setModalMode('chart');
                            // Navigate to the appropriate list view based on master type
                            handleSelect(masterType);
                        }}
                        companyName={selectedCompany?.name || 'Solarica'}
                        companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                    />
                </div>
            )}

            {/* Statutory Masters Views */}
            {currentView === 'tally-gst-classifications' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 w-full flex overflow-hidden">
                        <TallyGSTClassificationCreation onClose={() => setCurrentView('chart-of-accounts')} />
                    </div>
                </div>
            )}
            {currentView === 'tally-company-gst' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex flex-1 overflow-hidden">
                        <TallyCompanyGSTDetails onClose={() => setCurrentView('chart-of-accounts')} />
                    </div>
                </div>
            )}
            {currentView === 'tally-pan-cin' && (
                <div className="absolute inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex flex-1 overflow-hidden">
                        <TallyPANCINDetails onClose={() => setCurrentView('chart-of-accounts')} />
                    </div>
                </div>
            )}

            {/* List of Ledgers View (Legacy Chart of Accounts Mock) */}
            {currentView === 'list-of-ledgers' && (
                <div className="absolute inset-0 z-[60] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="bg-[#8ec2eb] flex justify-between px-2 py-0.5 border-b border-[#5ea4d6]">
                        <span className="font-bold text-xs text-black">Chart of Accounts</span>
                        <span className="font-bold text-xs text-black">Solarica</span>
                        <button onClick={() => setCurrentView('chart-of-accounts')} className="text-black hover:bg-black/10 px-1">✕</button>
                    </div>
                    <div className="bg-white flex justify-between px-2 py-1 border-b border-gray-300">
                        <span className="font-bold text-sm text-black">List of Ledgers</span>
                        <span className="font-bold text-sm text-black">For 1-Apr-25</span>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-white p-2">
                        {renderLedgerTree(ledgerTreeData)}
                    </div>
                    <div className="bg-white border-t border-gray-300 px-2 py-1 flex justify-between items-center">
                        <span className="font-bold text-xs text-black">28 Group(s) and 2 Ledger(s)</span>
                        <span className="text-xs text-gray-500">2 ▼</span>
                    </div>
                </div>
            )}

            {/* Master Creation / Change Company Overlay */}
            {currentView === 'master-creation' &&
                !showStockGroupAlteration &&
                !showStockCategoryAlteration &&
                !showStockItemAlteration &&
                !showUnitAlteration &&
                !showGodownAlteration &&
                !showGodownDialog && (
                    <div className="absolute inset-0 z-[50] bg-black/40 flex items-start justify-center pt-10">
                        <div className="flex flex-col gap-0 w-[420px] shadow-2xl bg-white border border-gray-400">
                            <div className="bg-white px-4 py-1.5 text-center border-b border-gray-200">
                                <div className="font-bold text-[#2a5585] text-[15px] underline decoration-1 underline-offset-[2px]">
                                    {subView === 'masters'
                                        ? (modalMode === 'create' ? 'Master Creation' : modalMode === 'alter' ? 'Master Alteration' : 'Chart of Accounts')
                                        : (companyModalMode === 'change' ? 'Change Company' : companyModalMode === 'select' ? 'Select Company' : 'Shut Company')
                                    }
                                </div>
                            </div>
                            <div className="bg-[#fcfcd0] px-3 py-1 border-b border-gray-300">
                                <input className="w-full bg-transparent border-none outline-none text-[13px] font-bold text-black" autoFocus placeholder={subView === 'companies' ? (selectedCompany?.name || 'Solarica') : ''} />
                            </div>
                            <div className="bg-[#def1fc] border-x border-t border-[#2a5585]">
                                <div className="bg-[#2a5585] text-white px-2 py-0.5 flex justify-between items-center text-[12px]">
                                    <span className="font-bold">{subView === 'masters' ? 'List of Masters' : (companyModalMode === 'change' ? 'List of Open Companies' : companyModalMode === 'select' ? 'List of Companies' : 'List of Open Companies')}</span>
                                    <div className="text-[11px] flex flex-col items-end leading-[1.2]">
                                        {subView === 'masters' ? (
                                            <>
                                                <span className="cursor-pointer hover:underline" onClick={() => { setSubView('companies'); setCompanyModalMode('change'); setMasterSelectedIndex(0); }}>Change Company</span>
                                                <span className="cursor-pointer hover:underline" onClick={() => { setShowMore(!showMore); setMasterSelectedIndex(0); }}>{showMore ? 'Show Less' : 'Show More'}</span>
                                                {showMore && <span className="cursor-pointer hover:underline" onClick={() => setShowInactive(!showInactive)}>{showInactive ? 'Hide Inactive' : 'Show Inactive'}</span>}
                                            </>
                                        ) : (
                                            <>
                                                <span className="cursor-pointer hover:underline" onClick={() => setCurrentView('tally-create-company')}>Create Company</span>
                                                <span className="cursor-pointer hover:underline" onClick={() => setCompanyModalMode('select')}>Select Company</span>
                                                <span className="cursor-pointer hover:underline" onClick={() => setCompanyModalMode('shut')}>Shut Company</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-white max-h-[500px] overflow-y-auto">
                                    {subView === 'masters' ? (
                                        masterMenuItems.map((item, index) => {
                                            const isNewGroup = index === 0 || masterMenuItems[index - 1].type !== item.type;
                                            const isActive = masterSelectedIndex === index;
                                            const isInactive = item.inactive && showInactive;
                                            return (
                                                <div key={index}>
                                                    {isNewGroup && (
                                                        <div className="px-2 pt-1.5 pb-0.5 text-[13px] font-bold text-black bg-white text-center">
                                                            {item.type}
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`px-3 py-0.5 cursor-pointer text-[13px] font-bold leading-tight
                                                        ${isActive ? 'bg-[#feba35] text-black' : isInactive ? 'text-gray-400' : 'text-black'}
                                                        ${!isActive && !isInactive ? 'hover:bg-blue-50' : ''}
                                                    `}
                                                        onClick={() => {
                                                            setMasterSelectedIndex(index);
                                                            handleSelect(item.action);
                                                        }}
                                                        onMouseEnter={() => setMasterSelectedIndex(index)}
                                                    >
                                                        {item.label}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex flex-col py-1">
                                            {activeCompanies
                                                .filter(comp => {
                                                    if (companyModalMode === 'shut') {
                                                        return openCompanyIds.includes(comp.id || '');
                                                    }
                                                    return true; // change and select show all as per user request
                                                })
                                                .map((comp, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`px-3 py-0.5 flex justify-between cursor-pointer text-[13px] font-bold hover:bg-[#dceef5] transition-colors
                                                        ${selectedCompany?.name === comp.name ? 'bg-[#feba35] text-black' : 'text-[#2a5585]'}
                                                    `}
                                                        onClick={() => {
                                                            if (companyModalMode === 'shut') {
                                                                const newOpenIds = openCompanyIds.filter(id => id !== comp.id);
                                                                setOpenCompanyIds(newOpenIds);
                                                                if (selectedCompany?.id === comp.id) {
                                                                    // Select another company if the current one is shut
                                                                    if (newOpenIds.length > 0) {
                                                                        const nextComp = activeCompanies.find(c => c.id === newOpenIds[0]);
                                                                        if (nextComp) setSelectedCompany({ id: nextComp.id || '', name: nextComp.name });
                                                                    } else {
                                                                        setSelectedCompany(null);
                                                                    }
                                                                }
                                                            } else {
                                                                handleCompanyChange(comp.id || '', comp.name);
                                                                setSubView('masters');
                                                                setCurrentView('gateway');
                                                            }
                                                        }}
                                                    >
                                                        <span>{comp.name}</span>
                                                        <span className="italic font-normal">({100000 + idx})</span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white px-2 py-0.5 flex justify-end border border-[#2a5585] border-t-0">
                                <span className="text-[11px] font-bold text-[#2a5585] cursor-pointer" onClick={() => setCurrentView('gateway')}>Esc: Quit</span>
                            </div>
                        </div>
                    </div>
                )}

            {/* Currency Exists Dialog */}
            {showCurrencyDialog && (
                <div className="absolute inset-0 z-[100] bg-black/40 flex items-center justify-center select-none">
                    <div className="bg-white border border-[#2a5585] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] w-[360px] p-5 pt-6 pb-6 font-sans relative">
                        <button
                            className="absolute top-1 right-1 text-gray-500 hover:text-red-500 font-bold px-1"
                            onClick={() => setShowCurrencyDialog(false)}
                        >
                            ✕
                        </button>
                        <div className="text-center text-[13px] text-black font-medium leading-relaxed mb-6">
                            Currency ₹ exists by default<br />
                            for the Company.<br />
                            <br />
                            Do you want to alter Currency ₹ or<br />
                            create a new Currency?
                        </div>
                        <div className="flex justify-between gap-4 px-2">
                            <button
                                className="flex-1 border border-[#feba35] bg-white text-[13px] font-bold py-2 px-1 hover:bg-[#fff9e6] transition-colors"
                                onClick={() => setShowCurrencyDialog(false)}
                            >
                                <span className="text-blue-800">C</span>:Create New
                            </button>
                            <button
                                className="flex-1 border border-[#feba35] bg-white text-[13px] font-bold py-2 px-1 hover:bg-[#fff9e6] transition-colors"
                                onClick={() => setShowCurrencyDialog(false)}
                            >
                                <span className="text-blue-800">A</span>:Alter Existing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tally Company Creation */}
            {currentView === 'tally-create-company' && (
                <div className="absolute inset-0 z-[100] bg-white">
                    <TallyCompanyCreation
                        onClose={() => setCurrentView('gateway')}
                        setDiskCompanies={(comps) => {
                            // Update local companies list
                            const newCompanies = comps.map(c => ({
                                id: c.id, // Assuming c has ID from created response
                                name: c.name,
                                date: c.period ? c.period.split(' to ')[0] : '1-Apr-25' // Extract start date or default
                            }));
                            setActiveCompanies(prev => {
                                const exists = prev.find(p => p.name === newCompanies[newCompanies.length - 1].name);
                                if (exists) return prev;
                                return [...prev, ...newCompanies.slice(-1)]; // Add the last one (newly created)
                            });
                            // Auto select new company if desired
                            const newComp = newCompanies[newCompanies.length - 1];
                            if (newComp.id) setSelectedCompany({ id: newComp.id, name: newComp.name });
                        }}
                        setOpenCompanies={(comps) => {
                            // Also update here just in case TallyCompanyCreation uses this One
                            const newComp = comps[0];
                            if (newComp) {
                                setActiveCompanies(prev => {
                                    if (prev.find(p => p.name === newComp.name)) return prev;
                                    return [...prev, { name: newComp.name, date: '1-Apr-25' }];
                                });
                            }
                        }}
                    />
                </div>
            )}

            {/* Godown Exists Dialog */}
            {showGodownDialog && (
                <div className="absolute inset-0 z-[100] bg-black/40 flex items-center justify-center select-none">
                    <div className="bg-white border border-[#2a5585] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] w-[360px] p-5 pt-6 pb-6 font-sans relative">
                        <button
                            className="absolute top-1 right-1 text-gray-500 hover:text-red-500 font-bold px-1"
                            onClick={() => setShowGodownDialog(false)}
                        >
                            ✕
                        </button>
                        <div className="text-center text-[13px] text-black font-medium leading-relaxed mb-6">
                            Main Location exists by default<br />
                            for the Company.<br />
                            <br />
                            Do you want to alter Main Location or<br />
                            create a new Godown?
                        </div>
                        <div className="flex justify-between gap-4 px-2">
                            <button
                                className="flex-1 border border-[#feba35] bg-white text-[13px] font-bold py-2 px-1 hover:bg-[#fff9e6] transition-colors"
                                onClick={() => { setShowGodownDialog(false); setShowGodownCreation(true); }}
                            >
                                <span className="text-blue-800">C</span>:Create New
                            </button>
                            <button
                                className="flex-1 border border-[#feba35] bg-white text-[13px] font-bold py-2 px-1 hover:bg-[#fff9e6] transition-colors"
                                onClick={() => { setShowGodownDialog(false); setShowGodownAlteration(true); }}
                            >
                                <span className="text-blue-800">A</span>:Alter Existing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Godown Creation */}
            {showGodownCreation && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 flex overflow-hidden">
                        <TallyGodownCreation
                            onClose={() => {
                                setShowGodownCreation(false);
                                setSelectedMaster(null);
                            }}
                            companyId={selectedCompany?.id}
                            mode={selectedMaster?.mode || 'Create'}
                            initialName={selectedMaster?.name || ''}
                            initialId={selectedMaster?.id}
                        />
                    </div>
                </div>
            )}

            {/* Godown Alteration */}
            {showGodownAlteration && (
                <div className="fixed inset-0 z-[150] flex flex-col pointer-events-none">
                    <div className="pointer-events-auto flex flex-col h-full w-full">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex-1 flex overflow-hidden">
                            <TallyGodownAlteration
                                companyId={selectedCompany?.id}
                                onClose={() => setShowGodownAlteration(false)}
                                onCreate={() => {
                                    setShowGodownAlteration(false);
                                    setShowGodownCreation(true);
                                    setSelectedMaster(null);
                                }}
                                onSelect={(name, id) => {
                                    setSelectedMaster({ name, id, mode: 'Alter' });
                                    setShowGodownAlteration(false);
                                    setShowGodownCreation(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Stock Category Creation */}
            {showStockCategoryCreation && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex flex-1 overflow-hidden">
                        <TallyStockCategoryCreation
                            onClose={() => {
                                setShowStockCategoryCreation(false);
                                setSelectedMaster(null);
                                setCurrentView('chart-of-accounts');
                            }}
                            companyId={selectedCompany?.id}
                            mode={selectedMaster?.mode || 'Create'}
                            initialName={selectedMaster?.name || ''}
                            initialId={selectedMaster?.id}
                        />
                    </div>
                </div>
            )}

            {/* Stock Category Alteration */}
            {showStockCategoryAlteration && (
                <div className="fixed inset-0 z-[150] flex flex-col pointer-events-none">
                    <div className="pointer-events-auto flex flex-col h-full w-full">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex-1 flex overflow-hidden">
                            <TallyStockCategoryAlteration
                                companyId={selectedCompany?.id}
                                onClose={() => setShowStockCategoryAlteration(false)}
                                onCreate={() => {
                                    setShowStockCategoryAlteration(false);
                                    setShowStockCategoryCreation(true);
                                    setSelectedMaster(null);
                                }}
                                onSelect={(name, id) => {
                                    setSelectedMaster({ name: name, id: id, mode: 'Alter' });
                                    setShowStockCategoryAlteration(false);
                                    setShowStockCategoryCreation(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Stock Group Creation */}
            {showStockGroupCreation && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 flex overflow-hidden">
                        <TallyStockGroupCreation
                            onClose={() => {
                                setShowStockGroupCreation(false);
                                setSelectedMaster(null);
                                setCurrentView('chart-of-accounts');
                            }}
                            companyId={selectedCompany?.id}
                            mode={selectedMaster?.mode || 'Create'}
                            initialName={selectedMaster?.name || ''}
                            initialId={selectedMaster?.id}
                        />
                    </div>
                </div>
            )}

            {/* Stock Group Alteration */}
            {showStockGroupAlteration && (
                <div className="fixed inset-0 z-[150] flex flex-col pointer-events-none">
                    <div className="pointer-events-auto flex flex-col h-full w-full">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex-1 flex overflow-hidden">
                            <TallyStockGroupAlteration
                                onClose={() => setShowStockGroupAlteration(false)}
                                companyId={selectedCompany?.id}
                                onCreate={() => {
                                    setShowStockGroupAlteration(false);
                                    setShowStockGroupCreation(true);
                                    setSelectedMaster(null);
                                }}
                                onSelect={(name, id) => {
                                    setSelectedMaster({ name: name, id: id, mode: 'Alter' });
                                    setShowStockGroupAlteration(false);
                                    setShowStockGroupCreation(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Stock Item Creation */}
            {showStockItemCreation && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 flex overflow-hidden">
                        <TallyStockItemCreation
                            onClose={() => {
                                setShowStockItemCreation(false);
                                setSelectedMaster(null);
                                setCurrentView('chart-of-accounts');
                            }}
                            companyId={selectedCompany?.id}
                            mode={selectedMaster?.mode || 'Create'}
                            initialName={selectedMaster?.name || ''}
                            initialId={selectedMaster?.id}
                        />
                    </div>
                </div>
            )}

            {/* Stock Item Alteration */}
            {showStockItemAlteration && (
                <div className="fixed inset-0 z-[150] flex flex-col pointer-events-none">
                    <div className="pointer-events-auto flex flex-col h-full w-full">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex-1 flex overflow-hidden">
                            <TallyStockItemAlteration
                                onClose={() => setShowStockItemAlteration(false)}
                                companyId={selectedCompany?.id}
                                onCreate={() => {
                                    setShowStockItemAlteration(false);
                                    setShowStockItemCreation(true);
                                    setSelectedMaster(null);
                                }}
                                onSelect={(name, id) => {
                                    setSelectedMaster({ name: name, id: id, mode: 'Alter' });
                                    setShowStockItemAlteration(false);
                                    setShowStockItemCreation(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Unit Creation */}
            {showUnitCreation && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col">
                    <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                    <div className="flex-1 flex overflow-hidden">
                        <TallyUnitCreation
                            onClose={() => {
                                setShowUnitCreation(false);
                                setSelectedMaster(null);
                                setCurrentView('chart-of-accounts');
                            }}
                            mode={selectedMaster?.mode || 'Create'}
                            initialName={selectedMaster?.name || ''}
                            companyId={selectedCompany?.id}
                        />
                    </div>
                </div>
            )}

            {/* Unit Alteration */}
            {showUnitAlteration && (
                <div className="fixed inset-0 z-[150] flex flex-col pointer-events-none">
                    <div className="pointer-events-auto flex flex-col h-full w-full">
                        <TallyHeader onAction={(action) => action === 'quit' && setCurrentView('chart-of-accounts')} />
                        <div className="flex-1 flex overflow-hidden">
                            <TallyUnitAlteration
                                onClose={() => setShowUnitAlteration(false)}
                                onCreate={() => {
                                    setShowUnitAlteration(false);
                                    setShowUnitCreation(true);
                                    setSelectedMaster(null);
                                }}
                                onSelect={(name) => {
                                    setSelectedMaster({ name: name, mode: 'Alter' });
                                    setShowUnitAlteration(false);
                                    setShowUnitCreation(true);
                                }}
                                companyId={selectedCompany?.id}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* GST Registration Dialog (Image 0) */}
            {showGstRegistrationDialog && (
                <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/20 font-sans select-none">
                    <div className="bg-white border border-[#2a5585] shadow-2xl p-6 w-[550px] relative">
                        <button className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center text-gray-500 hover:text-red-500 font-bold" onClick={() => setShowGstRegistrationDialog(false)}>✕</button>
                        <div className="text-center">
                            <div className="text-[14px] text-black mb-6">GST Registration already exists for the Company.</div>
                            <div className="text-[14px] text-black font-bold mb-8 italic">
                                Do you want to alter the existing GST Registration or create a new GST Registration?
                            </div>
                            <div className="flex justify-center gap-8">
                                <button
                                    onClick={() => { setShowGstRegistrationDialog(false); setCurrentView('tally-company-gst'); }}
                                    className="border border-[#feba35] bg-white p-2 px-8 hover:bg-yellow-50 flex items-center gap-2 group outline-none focus:ring-1 focus:ring-blue-400"
                                >
                                    <span className="text-[#2a5585] font-bold border-b border-[#2a5585]">C</span>
                                    <span className="text-black text-[13px] font-bold">: Create New</span>
                                </button>
                                <button
                                    onClick={() => { setShowGstRegistrationDialog(false); setCurrentView('tally-company-gst'); }}
                                    className="border border-[#2d819b] bg-white p-2 px-8 hover:bg-blue-50 flex items-center gap-2 group outline-none focus:ring-1 focus:ring-blue-400"
                                >
                                    <span className="text-[#2d819b] font-bold border-b border-[#2d819b]">A</span>
                                    <span className="text-black text-[13px] font-bold">: Alter Existing</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tally Report Hub */}
            {currentView === 'trial-balance' && (
                <div className="absolute inset-0 z-[200]">
                    <TrialBalance
                        onBack={() => setCurrentView('gateway')}
                        companyId={selectedCompany?.id || ''}
                        companyName={selectedCompany?.name}
                    />
                </div>
            )}
            {currentView === 'profit-loss' && (
                <div className="absolute inset-0 z-[200]">
                    <ProfitLoss
                        onBack={() => setCurrentView('gateway')}
                        companyId={selectedCompany?.id || ''}
                        companyName={selectedCompany?.name}
                    />
                </div>
            )}
            {currentView === 'balance-sheet' && (
                <div className="absolute inset-0 z-[200]">
                    <BalanceSheet
                        onBack={() => setCurrentView('gateway')}
                        companyId={selectedCompany?.id || ''}
                        companyName={selectedCompany?.name}
                    />
                </div>
            )}
            {currentView === 'ledger-statement' && (
                <div className="absolute inset-0 z-[200]">
                    <LedgerStatement
                        onBack={() => setCurrentView('gateway')}
                        companyId={selectedCompany?.id || ''}
                        companyName={selectedCompany?.name}
                    />
                </div>
            )}
            {currentView === 'day-book' && (
                <div className="absolute inset-0 z-[200]">
                    <DayBook
                        onBack={() => setCurrentView('gateway')}
                        companyId={selectedCompany?.id || ''}
                        companyName={selectedCompany?.name}
                        onVoucherClick={(id, type) => {
                            setSelectedVoucherId(id);
                            setSelectedVoucherType(type);
                            setModalMode('alter');
                            setCurrentView('tally-vouchers');
                        }}
                    />
                </div>
            )}
            {currentView === 'banking-gateway' && (
                <BankingGateway
                    companyId={selectedCompany?.id || activeCompanies[0]?.id || ''}
                    companyName={selectedCompany?.name || activeCompanies[0]?.name || 'Solarica'}
                    companies={activeCompanies}
                    selectedCompany={selectedCompany}
                    currentPeriod={currentPeriod}
                    currentDate={currentDate}
                    onReconciliation={() => setCurrentView('bank-reconciliation')}
                    onQuit={() => setCurrentView('gateway')}
                />
            )}
            {currentView === 'bank-reconciliation' && (
                <div className="absolute inset-0 z-[200]">
                    <BankReconciliationView
                        companyId={selectedCompany?.id || activeCompanies[0]?.id || ''}
                        companyName={selectedCompany?.name || activeCompanies[0]?.name || 'Solarica'}
                        onQuit={() => setCurrentView('banking-gateway')}
                    />
                </div>
            )}
            {currentView === 'payroll-control' && (
                <div className="fixed inset-0 z-[5000] bg-white">
                    <TallyPayrollControl
                        companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                        onClose={() => setCurrentView('chart-of-accounts')}
                        onSwitchView={setCurrentView}
                    />
                </div>
            )}
            {currentView === 'payroll-reports' && (
                <div className="fixed inset-0 z-[5000] bg-white">
                    <TallyPayrollReports
                        companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                        companyName={selectedCompany?.name || activeCompanies[0]?.name || 'Solarica'}
                        onClose={() => setCurrentView('gateway')}
                    />
                </div>
            )}
            {isCheckingPayroll && (
                <div className="fixed inset-0 z-[2000] bg-black/10 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white border-2 border-[#2a5585] p-4 shadow-2xl flex flex-col items-center">
                        <div className="text-[13px] font-bold text-[#2a5585] animate-pulse">Checking Payroll Status...</div>
                        <div className="mt-2 text-[11px] text-gray-500 italic">Please wait</div>
                    </div>
                </div>
            )}

            <PayrollActivationGate
                isOpen={showPayrollActivation}
                onClose={() => {
                    setShowPayrollActivation(false);
                    setPendingPayrollAction(null);
                }}
                onActivate={async () => {
                    setShowPayrollActivation(false);
                    const actionToResume = pendingPayrollAction;
                    setPendingPayrollAction(null);
                    if (actionToResume) {
                        await handleSelect(actionToResume);
                    }
                }}
                companyName={selectedCompany?.name || activeCompanies[0]?.name || 'Solarica'}
                companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
            />

            {/* Tally Employee Group Selection Modal */}
            {activePopup === 'employee-groups' && (
                <TallyEmployeeGroupSelectModal
                    companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                    onClose={() => setActivePopup(null)}
                    onSelect={(groupName, mode) => {
                        setActivePopup(null);
                        if (mode === 'Create') {
                            setCurrentView('tally-employee-groups');
                            setSelectedMaster({ name: '', mode: 'Create' });
                        } else {
                            setCurrentView('tally-employee-groups');
                            setSelectedMaster({ name: groupName, mode: 'Alter' });
                        }
                    }}
                />
            )}
            {/* Tally Employee Selection Modal */}
            {activePopup === 'employees' && (
                <TallyEmployeeSelectModal
                    companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                    onClose={() => setActivePopup(null)}
                    onSelect={(empName, mode) => {
                        setActivePopup(null);
                        if (mode === 'Create') {
                            setCurrentView('tally-employees');
                            setSelectedMaster({ name: '', mode: 'Create' });
                        } else {
                            setCurrentView('tally-employees');
                            setSelectedMaster({ name: empName, mode: 'Alter' });
                        }
                    }}
                />
            )}
            {/* Tally Attendance Type Selection Modal */}
            {activePopup === 'attendance-types' && (
                <TallyAttendanceTypeSelectModal
                    companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                    onClose={() => setActivePopup(null)}
                    onSelect={(typeName, mode) => {
                        setActivePopup(null);
                        if (mode === 'Create') {
                            setCurrentView('tally-attendance-types');
                            setSelectedMaster({ name: '', mode: 'Create' });
                        } else {
                            setCurrentView('tally-attendance-types');
                            setSelectedMaster({ name: typeName, mode: 'Alter' });
                        }
                    }}
                />
            )}
            {/* Tally Pay Head Selection Modal */}
            {activePopup === 'pay-heads' && (
                <TallyPayHeadSelectModal
                    companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                    onClose={() => setActivePopup(null)}
                    onSelect={(name, mode) => {
                        setActivePopup(null);
                        if (mode === 'Create') {
                            setCurrentView('tally-pay-heads');
                            setSelectedMaster({ name: '', mode: 'Create' });
                        } else {
                            setCurrentView('tally-pay-heads');
                            setSelectedMaster({ name: name, mode: 'Alter' });
                        }
                    }}
                />
            )}
            {/* Tally Payroll Unit Selection Modal */}
            {activePopup === 'payroll-units' && (
                <TallyPayrollUnitSelectModal
                    companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                    onClose={() => setActivePopup(null)}
                    onSelect={(name, mode) => {
                        setActivePopup(null);
                        if (mode === 'Create') {
                            setCurrentView('tally-payroll-units');
                            setSelectedMaster({ name: '', mode: 'Create' });
                        } else {
                            setCurrentView('tally-payroll-units');
                            setSelectedMaster({ name: name, mode: 'Alter' });
                        }
                    }}
                />
            )}

            {/* Tally Employee Category Selection Modal */}
            {activePopup === 'employee-categories' && (
                <TallyEmployeeCategorySelectModal
                    companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                    onClose={() => setActivePopup(null)}
                    onSelect={(name, mode) => {
                        setActivePopup(null);
                        if (mode === 'Create') {
                            setCurrentView('tally-employee-categories'); // Changed from 'list-employee-categories' for consistency
                            setSelectedMaster({ name: '', mode: 'Create' });
                        } else {
                            setCurrentView('tally-employee-categories'); // Show creation component in alter mode
                            setSelectedMaster({ name: name, mode: 'Alter' });
                        }
                    }}
                />
            )}
            {/* Tally Voucher Type Selection Modal */}
            {activePopup === 'voucher-types' && (
                <TallyVoucherTypeSelectModal
                    companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                    onClose={() => setActivePopup(null)}
                    onSelect={(typeName, mode) => {
                        setActivePopup(null);
                        if (mode === 'Create') {
                            setCurrentView('tally-payroll-vouchers');
                            setSelectedMaster({ name: '', mode: 'Create' });
                        } else {
                            setCurrentView('tally-payroll-vouchers');
                            setSelectedMaster({ name: typeName, mode: 'Alter' });
                        }
                    }}
                />
            )}
            {/* Tally Group Selection Modal */}
            {activePopup === 'groups' && (
                <TallyGroupSelectModal
                    companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                    onClose={() => setActivePopup(null)}
                    onSelect={(groupName, mode) => {
                        setActivePopup(null);
                        if (mode === 'Create') {
                            setCurrentView('tally-groups');
                            setSelectedMaster({ name: '', mode: 'Create' });
                        } else {
                            setCurrentView('tally-groups');
                            setSelectedMaster({ name: groupName, mode: 'Alter' });
                        }
                    }}
                />
            )}
            {/* Tally Ledger Selection Modal */}
            {activePopup === 'ledgers' && (
                <TallyLedgerSelectModal
                    companyId={selectedCompany?.id || activeCompanies[0]?.id || DEFAULT_COMPANY_ID}
                    onClose={() => setActivePopup(null)}
                    onSelect={(name, mode) => {
                        setActivePopup(null);
                        if (mode === 'Create') {
                            setCurrentView('tally-ledgers');
                            setSelectedMaster({ name: '', mode: 'Create' });
                        } else {
                            setCurrentView('tally-ledgers');
                            setSelectedMaster({ name: name, mode: 'Alter' });
                        }
                    }}
                />
            )}
        </div>
    );
};

export default UserDashboard;
