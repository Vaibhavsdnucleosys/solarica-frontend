// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import DashboardHeader from '../components/DashboardHeader';
// import DashboardCards from '../components/DashboardCards';
// import StatsCharts from '../components/StatsCharts';
// import AddEmployeeModal from '../components/AddEmployeeModal';
// import AdminLeadsPage from '../pages/AdminLeadsPage';

// import AccountsDashboard from '../components/AccountMasterComponents/Dashboard';
// import { getEmployees, createEmployee, deleteEmployee } from '../services/api';
// import { getNotifications, markAsRead, markAllAsRead, Notification as AppNotification } from '../services/notificationService';
// import OperationsPortal from '../components/OperationMaster/OperationsPortal';
// import DispatchTrackingPortal from '../components/OperationMaster/DispatchTrackingPortal';
// import PendingOrdersPortal from '../components/OperationMaster/PendingOrdersPortal';
// import OperationAdminDashboard from '../components/OperationMaster/OperationAdminDashboard';
// import WorkOrder from '../components/OperationMaster/WorkOrder';
// import WorkOrderList from '../components/OperationMaster/WorkOrderList';
// import HsnMaster from '../components/SalesMaster/HsnMaster'; // Already imported

// // Wrapper for Work Order View Management
// const WorkOrderManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
//   const [view, setView] = React.useState<'list' | 'create'>('list');

//   const handleCreateNew = () => setView('create');
//   const handleBackToList = () => setView('list');

//   return view === 'list' ? (
//     <WorkOrderList onCreateNew={handleCreateNew} onBack={onBack} />
//   ) : (
//     <WorkOrder onBack={handleBackToList} onSave={handleBackToList} />
//   );
// };
// import CompanyHeader from '../components/CompanyHeader';
// import SalesDashboard from '../components/SalesMaster/SalesDashboard';
// import AdminSalesDashboard from '../components/SalesMaster/AdminSalesDashboard';
// import MarketingTools from '../components/MarketingTools';
// import DeliveryDashboard from '../components/DeliveryDashboard';
// import {
//   Users, Trash2, Plus, FileText, UserPlus, BarChart3, Wrench,
//   LayoutDashboard, FolderOpen, Layers, Wallet, Truck,
//   BookText, Building2, Scale, Clock, ScrollText, TrendingUp, FileCheck
// } from 'lucide-react';
// import QuotationViewModal from '../components/QuotationViewModal';
// import { getQuotationById } from '../services/quotationService';
// import WelcomeSection from '../components/WelcomeSection';
// import UserDashboard from '../components/UserMaster/UserDashboard';

// import RecentActivity from '../components/Dashboard/RecentActivity';
// import TopPerformers from '../components/Dashboard/TopPerformers';
// import OperationEmployeeDashboard from '../components/Dashboard/OperationEmployeeDashboard';
// import TallySyncDashboard from '../components/TallyIntegration/TallySyncDashboard';

// // Tally Reports
// import TrialBalance from '../components/TallyReports/TrialBalance';
// import ProfitLoss from '../components/TallyReports/ProfitLoss';
// import BalanceSheet from '../components/TallyReports/BalanceSheet';
// import LedgerStatement from '../components/TallyReports/LedgerStatement';
// import DayBook from '../components/TallyReports/DayBook';

// const DashboardPage: React.FC = () => {
//   // Lazy init for currentUser
//   const [currentUser, setCurrentUser] = useState<any>(() => {
//     const userStr = localStorage.getItem('user');
//     return userStr ? JSON.parse(userStr) : null;
//   });

//   // Lazy init for userRole
//   const [userRole, setUserRole] = useState<string | null>(() => {
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       const user = JSON.parse(userStr);
//       return user.role?.name || user.role;
//     }
//     return null;
//   });

//   // Lazy init for selected view based on role
//   const [selected, setSelected] = useState<string>(() => {
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       const user = JSON.parse(userStr);
//       const role = (user.role?.name || user.role)?.toLowerCase();
//       if (role === 'sales') return 'quotation-module';
//       if (role === 'accounts employee' || role === 'accounts-employee' || role === 'accounting') return 'accounting-dashboard';
//       if (role === 'operation' || role === 'operations') return 'operation-master';
//       if (role === 'operation employee') return 'operation-employee-dashboard';
//     }
//     return 'dashboard';
//   });

//   const [activeCompany, setActiveCompany] = useState<string>('Solarica Energy India Pvt Ltd');
//   const [employees, setEmployees] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Notification State
//   const [notifications, setNotifications] = useState<AppNotification[]>([]);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
//   const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
//   const [operationPrefill, setOperationPrefill] = useState<any>(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userStr = localStorage.getItem('user');

//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     if (userStr) {
//       const user = JSON.parse(userStr);
//       setCurrentUser(user);
//       const roleName = user.role?.name || user.role;
//       setUserRole(roleName);

//       const lowerRole = roleName?.toLowerCase();
//       if (lowerRole === 'admin' || lowerRole === 'accounts employee' || lowerRole === 'accounts-employee' || lowerRole === 'accounting') {
//         loadEmployees();
//         fetchNotifications();
//         const interval = setInterval(fetchNotifications, 30000);
//         return () => clearInterval(interval);
//       }
//     }
//   }, [navigate]);

//   const fetchNotifications = async () => {
//     try {
//       const data = await getNotifications();
//       setNotifications(data || []);
//       setUnreadCount((data || []).filter(n => !n.isRead).length);
//     } catch (err) {
//       console.error("Failed to fetch notifications", err);
//     }
//   };

//   const handleMarkAsRead = async (id: string) => {
//     try {
//       await markAsRead(id);
//       fetchNotifications();
//     } catch (err) {
//       console.error("Failed to mark notification as read", err);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       await markAllAsRead();
//       fetchNotifications();
//     } catch (err) {
//       console.error("Failed to mark all as read", err);
//     }
//   };

//   const handleViewQuotation = async (id: string) => {
//     try {
//       const data = await getQuotationById(id);
//       if (data && data.quotation) {
//         setSelectedQuotation(data.quotation);
//         setIsQuotationModalOpen(true);
//         setIsNotificationOpen(false);
//       }
//     } catch (err) {
//       console.error("Failed to fetch quotation details", err);
//       alert("Failed to load quotation details.");
//     }
//   };

//   const loadEmployees = async () => {
//     try {
//       setLoading(true);
//       const data = await getEmployees();
//       if (data && data.employees) {
//         setEmployees(data.employees);
//       }
//     } catch (error) {
//       console.error("Failed to load employees", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [showAdd, setShowAdd] = useState(false);

//   const handleAddEmployee = async (employeeData: any) => {
//     try {
//       await createEmployee(employeeData);
//       await loadEmployees();
//       setShowAdd(false);
//     } catch (error) {
//       console.error("Failed to create employee", error);
//       alert("Failed to create employee.");
//     }
//   };

//   const handleDeleteEmployee = async (id: string) => {
//     if (window.confirm("Are you sure you want to delete this employee?")) {
//       try {
//         await deleteEmployee(id);
//         await loadEmployees();
//       } catch (error) {
//         console.error("Failed to delete employee", error);
//         alert("Failed to delete employee.");
//       }
//     }
//   };

//   const handleOperationPrefill = (prefillData: any) => {
//     setOperationPrefill(prefillData);
//     setSelected('operation-master');
//   };

//   const isSales = userRole?.toLowerCase() === 'sales';
//   const isAccountsEmployee = userRole?.toLowerCase() === 'accounts employee' ||
//     userRole?.toLowerCase() === 'accounts-employee' ||
//     userRole?.toLowerCase() === 'accounting';
//   const isOperationEmployee = userRole?.toLowerCase() === 'operation' || userRole?.toLowerCase() === 'operations';
//   const isOperationWorker = userRole?.toLowerCase() === 'operation employee';

//   const salesMenuItems = [
//     { id: 'quotation-module', label: 'Quotation Module', icon: <FileText size={20} className="text-emerald-600" /> },
//     { id: 'leads-management', label: 'Leads Management', icon: <UserPlus size={20} className="text-blue-600" /> },
//     { id: 'employee-report', label: 'Employee Report', icon: <BarChart3 size={20} className="text-amber-600" /> },
//   ];

//   const accountsMenuItems = [
//     { id: 'accounting-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} className="text-blue-600" /> },
//     { id: 'receipts-payments', label: 'Receipts & Payments', icon: <Wallet size={20} className="text-amber-600" /> },
//     { id: 'journal-entries', label: 'Journal Entries', icon: <BookText size={20} className="text-purple-600" /> },
//     { id: 'bank-recon', label: 'Bank Reconciliation', icon: <Scale size={20} className="text-orange-600" /> },
//   ];

//   const operationMenuItems = [
//     { id: 'pending-orders', label: 'Pending Orders', icon: <ScrollText size={20} className="text-teal-600" /> },
//     { id: 'operation-master', label: 'Production Tracking', icon: <Layers size={20} className="text-blue-600" /> },
//     { id: 'dispatch-tracking', label: 'Dispatch Info', icon: <Truck size={20} className="text-orange-600" /> },
//     { id: 'delivery', label: 'Delivery Challan', icon: <Truck size={20} className="text-teal-600" /> },
//     { id: 'work-order', label: 'Work Order', icon: <FileText size={20} className="text-purple-600" /> },
//   ];

//   const operationWorkerMenuItems = [
//     { id: 'operation-employee-dashboard', label: 'My Tasks', icon: <LayoutDashboard size={20} className="text-blue-600" /> },
//   ];

//   // Set default selection for specific roles
//   useEffect(() => {
//     if (isSales && selected === 'dashboard') {
//       setSelected('quotation-module');
//     } else if (isAccountsEmployee && selected === 'dashboard') {
//       setSelected('accounting-dashboard');
//     } else if (isOperationEmployee && selected === 'dashboard') {
//       setSelected('operation-master');
//     } else if (isOperationWorker && selected === 'dashboard') {
//       setSelected('operation-employee-dashboard');
//     }
//   }, [isSales, isAccountsEmployee, isOperationEmployee, isOperationWorker, selected]);

//   return (
//     <div className="h-screen overflow-hidden bg-solarica-bg">
//       {!isAccountsEmployee && (
//         <Sidebar
//           activeId={selected}
//           onNavigate={setSelected}
//           menuItems={
//             isSales ? salesMenuItems :
//               isAccountsEmployee ? accountsMenuItems :
//                 isOperationEmployee ? operationMenuItems :
//                   isOperationWorker ? operationWorkerMenuItems :
//                     undefined
//           }
//           user={currentUser ? {
//             name: currentUser.name,
//             role: userRole || 'User',
//             image: (isSales || isOperationEmployee) ? undefined : currentUser.image
//           } : undefined}
//         />
//       )}
//       <main className={`${!isAccountsEmployee ? 'md:ml-72 h-screen overflow-y-auto' : 'h-screen w-full overflow-y-auto'} transition-all duration-300 no-scrollbar`}>
//         <div key={selected} className="h-full animate-fade-up" style={{ animationDuration: '0.35s' }}>
//           {isSales ? (
//             <SalesDashboard
//               selectedView={selected}
//               user={currentUser ? {
//                 name: currentUser.name,
//                 email: currentUser.email,
//                 role: userRole || 'Sales',
//                 image: undefined
//               } : undefined}
//             />
//           ) : selected === 'operation-employee-dashboard' ? (
//             <OperationEmployeeDashboard />
//           ) : selected === 'leads' || selected === 'leads-management' ? (
//             <AdminLeadsPage />
//           ) : selected === 'employee-management' ? (
//             <>
//               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 px-6 py-5">
//                 <div className="flex justify-between items-center mb-2 px-1">
//                   <div className="text-sm font-semibold text-slate-700">Employees Directory</div>
//                   <div className="text-xs text-slate-500">{employees.length} Members</div>
//                 </div>

//                 {employees.length === 0 ? (
//                   <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
//                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <Users className="w-8 h-8 text-slate-300" />
//                     </div>
//                     <h3 className="text-slate-800 font-medium">No employees yet</h3>
//                     <p className="text-slate-500 text-sm mt-1">Click the + button to add your first team member</p>
//                   </div>
//                 ) : (
//                   <div className="grid gap-3">
//                     {employees.map((e, i) => (
//                       <div
//                         key={i}
//                         className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow group"
//                       >
//                         <div className="flex items-center gap-4">
//                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm ${i % 3 === 0 ? 'bg-blue-50 text-blue-600' :
//                             i % 3 === 1 ? 'bg-indigo-50 text-indigo-600' :
//                               'bg-violet-50 text-violet-600'
//                             }`}>
//                             {(e.name || '').charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <h4 className="font-semibold text-slate-800">{e.name}</h4>
//                             <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
//                               <span className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-100">
//                                 {e.category || 'General'}
//                               </span>
//                               <span>•</span>
//                               <span>{e.email}</span>
//                               {e.phone && (
//                                 <>
//                                   <span>•</span>
//                                   <span>{e.phone}</span>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-6">
//                           <div className="hidden sm:block text-right">
//                             <div className="flex items-center gap-1 justify-end">
//                               {e.grants && e.grants.length > 0 ? (
//                                 e.grants.map((g: string) => (
//                                   <span key={g} className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
//                                     {g}
//                                   </span>
//                                 ))
//                               ) : (
//                                 <span className="text-xs text-slate-400 italic"></span>
//                               )}
//                             </div>
//                           </div>

//                           <button
//                             onClick={() => handleDeleteEmployee(e.id)}
//                             className="w-8 h-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
//                           >
//                             <Trash2 size={20} />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </>

//             /* [ADDED] Logic to render HSN Master component */
//           ) : selected === 'hsn-master' ? (
//             <div className="px-6 py-5 h-full overflow-hidden">
//               <HsnMaster />
//             </div>

//           ) : selected === 'pending-orders' ? (
//             <PendingOrdersPortal
//               onBack={isOperationEmployee ? undefined : () => setSelected('dashboard')}
//               onRedirectToAssignment={handleOperationPrefill}
//             />
//           ) : selected === 'operation-master' ? (
//             userRole?.toLowerCase() === 'admin' ? (
//               <OperationAdminDashboard onBack={() => setSelected('dashboard')} />
//             ) : (
//               <OperationsPortal
//                 onBack={isOperationEmployee ? undefined : () => setSelected('dashboard')}
//                 prefillData={operationPrefill}
//               />
//             )
//           ) : selected === 'dispatch-tracking' ? (
//             <DispatchTrackingPortal onBack={isOperationEmployee ? undefined : () => setSelected('dashboard')} />
//           ) : selected === 'work-order' ? (
//             <WorkOrderManager onBack={() => setSelected('dashboard')} />
//           ) : selected === 'marketing-tools' ? (
//             <div className="px-6 py-5">
//               <MarketingTools />
//             </div>
//           ) : selected === 'accounts-master' ? (
//             <AccountsDashboard
//               onNavigate={setSelected}
//               notifications={notifications}
//               unreadCount={unreadCount}
//               isNotificationOpen={isNotificationOpen}
//               setIsNotificationOpen={setIsNotificationOpen}
//               handleMarkAsRead={handleMarkAsRead}
//               handleMarkAllAsRead={handleMarkAllAsRead}
//               onViewQuotation={handleViewQuotation}
//             />
//           ) : selected === 'accounting-dashboard' ? (
//             <UserDashboard
//               onNavigate={setSelected}
//               notifications={notifications}
//               unreadCount={unreadCount}
//               isNotificationOpen={isNotificationOpen}
//               setIsNotificationOpen={setIsNotificationOpen}
//               handleMarkAsRead={handleMarkAsRead}
//               handleMarkAllAsRead={handleMarkAllAsRead}
//             />
//           ) : selected === 'delivery' ? (
//             <DeliveryDashboard />
//           ) : selected === 'sales-master' ? (
//             <AdminSalesDashboard />
//           ) : selected === 'tally-sync' ? (
//             <TallySyncDashboard />
//           ) : selected === 'trial-balance' ? (
//             <TrialBalance onBack={() => setSelected('accounts-master')} />
//           ) : selected === 'profit-loss' ? (
//             <ProfitLoss onBack={() => setSelected('accounts-master')} />
//           ) : selected === 'balance-sheet' ? (
//             <BalanceSheet onBack={() => setSelected('accounts-master')} />
//           ) : selected === 'ledger-statement' ? (
//             <LedgerStatement onBack={() => setSelected('accounts-master')} />
//           ) : selected === 'day-book' ? (
//             <DayBook onBack={() => setSelected('accounts-master')} />
//           ) : selected === 'solarica-hierarchy' ? (
//             <div className="flex items-center justify-center h-full bg-white">
//               <h1 className="text-2xl font-bold text-gray-500">Work in Progress</h1>
//             </div>
//           ) : (
//             <>
//               <div className="px-6 py-5">
//                 <CompanyHeader activeTab={activeCompany} onTabChange={setActiveCompany} />
//                 <div className="mt-8">
//                   <DashboardHeader
//                     title={activeCompany}
//                     subtitle="Friday, December 15th 2023"
//                     hideSearch={true}
//                     hideNotifications={true}
//                     user={currentUser ? {
//                       name: currentUser.name,
//                       role: userRole || 'Admin'
//                     } : undefined}
//                   />
//                 </div>
//                 <DashboardCards selectedCompany={activeCompany} />
//                 <StatsCharts selectedCompany={activeCompany} />
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-8">
//                   <div className="lg:col-span-2 h-[480px]">
//                     <RecentActivity selectedCompany={activeCompany} />
//                   </div>
//                   <div className="lg:col-span-1 h-[480px]">
//                     <TopPerformers selectedCompany={activeCompany} />
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </main>
//       <QuotationViewModal
//         isOpen={isQuotationModalOpen}
//         onClose={() => setIsQuotationModalOpen(false)}
//         quotation={selectedQuotation}
//       />
//       {selected === 'employee-management' && (
//         <>
//           <button
//             onClick={() => setShowAdd(true)}
//             className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-blue-500/60 z-50 group"
//           >
//             <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
//           </button>
//           <AddEmployeeModal
//             isOpen={showAdd}
//             onClose={() => setShowAdd(false)}
//             onSubmit={handleAddEmployee}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import DashboardCards from "../components/DashboardCards";
import StatsCharts from "../components/StatsCharts";
import AddEmployeeModal from "../components/AddEmployeeModal";
import AdminLeadsPage from "../pages/AdminLeadsPage";
import AccountsDashboard from "../components/AccountMasterComponents/Dashboard";
import {
  getEmployees,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../services/api";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  Notification as AppNotification,
} from "../services/notificationService";
import OperationsPortal from "../components/OperationMaster/OperationsPortal";
import DispatchTrackingPortal from "../components/OperationMaster/DispatchTrackingPortal";
import PendingOrdersPortal from "../components/OperationMaster/PendingOrdersPortal";
import OperationAdminDashboard from "../components/OperationMaster/OperationAdminDashboard";
import WorkOrder from "../components/OperationMaster/WorkOrder";
import WorkOrderList from "../components/OperationMaster/WorkOrderList";
import HsnMaster from "../components/SalesMaster/HsnMaster";
import CompanyHeader from "../components/CompanyHeader";
import SalesDashboard from "../components/SalesMaster/SalesDashboard";
import AdminSalesDashboard from "../components/SalesMaster/AdminSalesDashboard";
import MarketingTools from "../components/MarketingTools";
import DeliveryDashboard from "../components/DeliveryDashboard";
import {
  Users,
  Trash2,
  Plus,
  FileText,
  UserPlus,
  Layers,
  Wallet,
  Truck,
  LayoutDashboard,
  BarChart3,
  Megaphone,
  Hash,
  Building2,
  ScrollText,
  Pencil,
} from "lucide-react";

import QuotationViewModal from "../components/QuotationViewModal";
import { getQuotationById } from "../services/quotationService";
import UserDashboard from "../components/UserMaster/UserDashboard";
import RecentActivity from "../components/Dashboard/RecentActivity";
import TopPerformers from "../components/Dashboard/TopPerformers";
import TallySyncDashboard from "../components/TallyIntegration/TallySyncDashboard";

// Tally Reports
import TrialBalance from "../components/TallyReports/TrialBalance";
import ProfitLoss from "../components/TallyReports/ProfitLoss";
import BalanceSheet from "../components/TallyReports/BalanceSheet";
import LedgerStatement from "../components/TallyReports/LedgerStatement";
import DayBook from "../components/TallyReports/DayBook";
import AccountsMasterPage from "./AccountsMasterPage";
import EditEmployeeModal from "../components/EditEmployeeModal";
import InvoiceList from "../components/Invoice/InvoiceList";
import OperationEmployeeDashboard from "../components/Dashboard/OperationEmployeeDashboard";
const WorkOrderManager: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [view, setView] = React.useState<"list" | "create">("list");
  return view === "list" ? (
    <WorkOrderList onCreateNew={() => setView("create")} onBack={onBack} />
  ) : (
    <WorkOrder onBack={() => setView("list")} onSave={() => setView("list")} />
  );
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  const [userRole, setUserRole] = useState<string | null>(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return (user.role?.name || user.role || "").toLowerCase();
    }
    return null;
  });

  const [selected, setSelected] = useState<string>("dashboard");
  const [activeCompany, setActiveCompany] = useState<string>(
    "Solarica Energy India Pvt Ltd",
  );
  const [employees, setEmployees] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [operationPrefill, setOperationPrefill] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Role check helpers
  const isAdmin = userRole === "admin";
  const isSales = userRole === "sales";
  const isOperations = userRole === "operation" || userRole === "operations";
  const isOperationWorker = userRole === "operation employee";
  const isAccounts = userRole?.includes("account") || userRole === "accounting";

 const [currentPage, setCurrentPage] = useState(1);

const [searchEmployee, setSearchEmployee] = useState("");
const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("");
const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");

const employeesPerPage = 10;

const startIndex = (currentPage - 1) * employeesPerPage;

const endIndex = startIndex + employeesPerPage;

const filteredEmployees = employees.filter((e) => {
  const matchesEmployee =
    e.name?.toLowerCase().includes(searchEmployee.toLowerCase());

  const matchesCompany =
    !selectedCompanyFilter ||
    e.company === selectedCompanyFilter;

  const matchesDepartment =
    !selectedDepartmentFilter ||
    e.category === selectedDepartmentFilter;

  return (
    matchesEmployee &&
    matchesCompany &&
    matchesDepartment
  );
});

const totalPages = Math.ceil(
  filteredEmployees.length / employeesPerPage
);

const paginatedEmployees = filteredEmployees.slice(
  startIndex,
  endIndex
);



  // Define Menu Items per role
  const salesMenuItems = [
    {
      id: "quotation-module",
      label: "Quotation Module",
      icon: <FileText size={20} className="text-emerald-600" />,
    },
    {
      id: "leads-management",
      label: "Leads Management",
      icon: <UserPlus size={20} className="text-blue-600" />,
    },
    {
      id: "marketing-tools",
      label: "Marketing Tools",
      icon: <Megaphone size={20} className="text-pink-600" />,
    },
    {
      id: "employee-report",
      label: "Employee Report",
      icon: <BarChart3 size={20} className="text-amber-600" />,
    },
  ];

  const operationsMenuItems = [
    {
      id: "pending-orders",
      label: "Pending Orders",
      icon: <ScrollText size={20} className="text-teal-600" />,
    },
    {
      id: "operation-master",
      label: "Production Tracking",
      icon: <Layers size={20} className="text-blue-600" />,
    },
    {
      id: "dispatch-tracking",
      label: "Dispatch Info",
      icon: <Truck size={20} className="text-orange-600" />,
    },
    {
      id: "delivery",
      label: "Delivery Challan",
      icon: <Truck size={20} className="text-teal-600" />,
    },
    {
      id: "work-order",
      label: "Work Order",
      icon: <FileText size={20} className="text-purple-600" />,
    },
  ];
    const operationWorkerMenuItems = [
    { id: 'operation-employee-dashboard', label: 'My Tasks', icon: <LayoutDashboard size={20} className="text-blue-600" /> },
  ];

  // Set initial selection based on role
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (isSales) setSelected("quotation-module");
    // else if (isAccounts) setSelected('accounting-dashboard');
    else if (isAccounts) setSelected("accounts-master");
    else if (isOperations) setSelected("operation-master");
    else if (isOperationWorker) {
  setSelected("operation-employee-dashboard");
}
    else setSelected("dashboard");

    fetchNotifications();
    loadEmployees();
  }, [userRole, navigate]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
      setUnreadCount((data || []).filter((n) => !n.isRead).length);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      if (data?.employees) setEmployees(data.employees);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };
  const handleViewQuotation = async (id: string) => {
    try {
      const data = await getQuotationById(id);
      if (data?.quotation) {
        setSelectedQuotation(data.quotation);
        setIsQuotationModalOpen(true);
        setIsNotificationOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEmployee = async (data: any) => {
    try {
      await createEmployee(data);
      loadEmployees();
      setShowAdd(false);
    } catch (e) {
      console.error(e);
    }
  };
  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm("Delete?")) {
      try {
        await deleteEmployee(id);
        loadEmployees();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleEditEmployee = async (data: any) => {
    try {
      await updateEmployee(editingEmployee.id, data);

      await loadEmployees();

      setShowEditModal(false);

      setEditingEmployee(null);

      alert("Employee updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update employee");
    }
  };
  return (
    <div className="h-screen overflow-hidden bg-solarica-bg flex">
      {/* <Sidebar
        activeId={selected}
        onNavigate={setSelected}
        // ONLY PASS RELEVANT MENU ITEMS BASED ON ROLE
        menuItems={
          isSales
            ? salesMenuItems
            : isOperations
              ? operationsMenuItems
              : undefined // Admin will use the default menu inside Sidebar.tsx
        }
        user={
          currentUser
            ? {
                name: currentUser.name || "User",
                role: userRole || "User",
              }
            : undefined
        }
      /> */}

      <Sidebar
  activeId={selected}
  onNavigate={setSelected}
 menuItems={
  isSales
    ? salesMenuItems
    : isOperations
      ? operationsMenuItems
      : isOperationWorker
        ? operationWorkerMenuItems
        : isAccounts
          ? [
              {
                id: "accounts-master",
                label: "Accounts Master",
                icon: (
                  <Wallet
                    size={20}
                    className="text-emerald-600"
                  />
                ),
              },
              {
                id: "accepted-invoices",
                label: "Invoice List",
                icon: (
                  <FileText
                    size={20}
                    className="text-blue-600"
                  />
                ),
              },
            ]
          : undefined
  }
  user={
    currentUser
      ? {
          name: currentUser.name || "User",
          role: userRole || "User",
        }
      : undefined
  }
/>

      <main className="flex-1 h-screen overflow-y-auto md:ml-72 transition-all duration-300 no-scrollbar">
        <div key={selected} className="h-full animate-fade-up">
          
          {/* CONTENT RENDERING LOGIC */}
          {selected === "operation-employee-dashboard" ? (

  <OperationEmployeeDashboard />

) :selected === "marketing-tools" ? (
            <div className="px-6 py-5">
              <MarketingTools />
            </div>
          ) : isSales ||
            (isAdmin &&
              (selected === "quotation-module" ||
                selected === "leads-management")) ? (
            <SalesDashboard selectedView={selected} user={currentUser} />
          ) : selected === "hsn-master" ? (
            <div className="px-6 py-5">
              <HsnMaster />
            </div>
          ) : selected === "pending-orders" ? (
            <PendingOrdersPortal
              onBack={() => setSelected("dashboard")}
              onRedirectToAssignment={(d) => {
                setOperationPrefill(d);
                setSelected("operation-master");
              }}
            />
          ) : selected === "operation-master" ? (
            isAdmin ? (
              <OperationAdminDashboard
                onBack={() => setSelected("dashboard")}
              />
            ) : (
              <OperationsPortal prefillData={operationPrefill} />
            )
          ) : selected === "dispatch-tracking" ? (
            <DispatchTrackingPortal onBack={() => setSelected("dashboard")} />
          ) : selected === "work-order" ? (
            <WorkOrderManager onBack={() => setSelected("dashboard")} />
          ) : // ) : selected === 'accounts-master' ? (
          // <AccountsDashboard onNavigate={setSelected} notifications={notifications} unreadCount={unreadCount} isNotificationOpen={isNotificationOpen} setIsNotificationOpen={setIsNotificationOpen} handleMarkAsRead={handleMarkAsRead} handleMarkAllAsRead={handleMarkAllAsRead} onViewQuotation={handleViewQuotation} />
          // <AccountsMasterPage onNavigate={setSelected} notifications={notifications} unreadCount={unreadCount} isNotificationOpen={isNotificationOpen} setIsNotificationOpen={setIsNotificationOpen} handleMarkAsRead={handleMarkAsRead} handleMarkAllAsRead={handleMarkAllAsRead} onViewQuotation={handleViewQuotation} />

          // selected === "accounts-master" ? (
          //   <AccountsMasterPage />

          // ) : selected === "accounting-dashboard" ? (

//       selected === "accounts-master" ? (
//             <AccountsMasterPage />
//           ) : selected === "accepted-invoices" ? (
//   <div className="p-6">
//     <h1 className="text-2xl font-bold">
//       Accepted Invoice List
//     </h1>
//   </div>

// ) : 

selected === "accounts-master" ? (
  <AccountsMasterPage />

) : selected === "accepted-invoices" ? (

  <InvoiceList
    onCreateClick={() => {}}
  />

) : selected === "accounting-dashboard" ? (
            <UserDashboard
              onNavigate={setSelected}
              notifications={notifications}
              unreadCount={unreadCount}
              isNotificationOpen={isNotificationOpen}
              setIsNotificationOpen={setIsNotificationOpen}
              handleMarkAsRead={handleMarkAsRead}
              handleMarkAllAsRead={handleMarkAllAsRead}
            />
          ) : selected === "delivery" ? (
            <DeliveryDashboard />
          ) : selected === "sales-master" ? (
            <AdminSalesDashboard />
          ) : selected === "tally-sync" ? (
            <TallySyncDashboard />
          ) : selected === "trial-balance" ? (
            <TrialBalance onBack={() => setSelected("accounts-master")} />
          ) : selected === "profit-loss" ? (
            <ProfitLoss onBack={() => setSelected("accounts-master")} />
          ) : selected === "balance-sheet" ? (
            <BalanceSheet onBack={() => setSelected("accounts-master")} />
          ) : selected === "ledger-statement" ? (
            <LedgerStatement onBack={() => setSelected("accounts-master")} />
          ) : selected === "day-book" ? (
            <DayBook onBack={() => setSelected("accounts-master")} />
          ) : // ) : selected === 'employee-management' ? (
          //   <div className="px-6 py-5">
          //     <div className="flex justify-between items-center mb-6">
          //       <h1 className="text-2xl font-bold text-slate-800">Employee Master</h1>
          //       <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          //         <Plus size={20} /> Add Employee
          //       </button>
          //     </div>
          //     <div className="grid gap-4">
          //       {employees.map((e) => (
          //         <div key={e.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
          //           <div><h3 className="font-bold">{e.name}</h3><p className="text-sm text-gray-500">{e.email} • {e.role?.name || e.role}</p></div>
          //           <button onClick={() => handleDeleteEmployee(e.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={20} /></button>
          //         </div>
          //       ))}
          //     </div>
          //   </div>
          // ) : (

          // Inside the 'employee-management' rendering block in DashboardPage.tsx:

          selected === "employee-management" ? (
            <div className="px-6 py-5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    Employee Master
                  </h1>
                  <p className="text-sm text-slate-500">
                    Solarica Group Hierarchy Management
                  </p>
                </div>
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-md transition-all"
                >
                  <Plus size={20} /> Add New Employee
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Table Header */}
             {/* Filters */}
<div className="p-5 border-b border-slate-200 bg-slate-50">
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {/* Employee Search */}
    <div>
      <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
        Search Employee
      </label>

      <input
        type="text"
        placeholder="Search employee name..."
        value={searchEmployee}
        onChange={(e) => {
          setSearchEmployee(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>

    {/* Company Filter */}
    <div>
      <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
        Company
      </label>

      <input
        list="company-list"
        placeholder="Search company..."
        value={selectedCompanyFilter}
        onChange={(e) => {
          setSelectedCompanyFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />

      <datalist id="company-list">
        {[
          ...new Set(
            employees
              .map((e) => e.company)
              .filter(Boolean)
          ),
        ].map((company) => (
          <option key={company} value={company} />
        ))}
      </datalist>
    </div>

    {/* Department Filter */}
    <div>
      <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
        Department
      </label>

      <input
        list="department-list"
        placeholder="Search department..."
        value={selectedDepartmentFilter}
        onChange={(e) => {
          setSelectedDepartmentFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />

      <datalist id="department-list">
        {[
          ...new Set(
            employees
              .map((e) => e.category)
              .filter(Boolean)
          ),
        ].map((department) => (
          <option
            key={department}
            value={department}
          />
        ))}
      </datalist>
    </div>
  </div>
</div>
             
                <div className="grid grid-cols-12 gap-4 bg-slate-50 border-b border-slate-200 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <div className="col-span-3">Employee</div>
                  <div className="col-span-2">Company</div>
                  <div className="col-span-2">Department</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-1 text-center">Role</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                {/* Empty State */}
                {filteredEmployees.length === 0 ? (
                  <div className="py-20 text-center">
                    <Users className="mx-auto text-slate-300 mb-3" size={48} />
                    <p className="text-slate-500 font-medium">
                      No employees found
                    </p>
                  </div>
                ) : (
                  paginatedEmployees.map((e, index) => (
                    <div
                      key={e.id}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-slate-100 hover:bg-slate-50 transition-all ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      {/* Employee */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shadow-sm
            ${
              e.company?.includes("Energy")
                ? "bg-green-500"
                : e.company?.includes("Industries")
                  ? "bg-blue-500"
                  : "bg-orange-500"
            }`}
                        >
                          {e.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {e.name}
                          </p>

                          {/* <p className="text-xs text-slate-400">
                            ID: {e.id?.slice(0, 8)}
                          </p> */}
                        </div>
                      </div>

                      {/* Company */}
                      <div className="col-span-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {e.company || "N/A"}
                        </span>
                      </div>

                      {/* Department */}
                      <div className="col-span-2">
                        <span className="text-sm text-slate-700 font-medium">
                          {e.category || "General"}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="col-span-3">
                        <p className="text-sm text-slate-600 truncate">
                          {e.email}
                        </p>
                      </div>

                      {/* Role */}
                      <div className="col-span-1 flex justify-center">
                        <span
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase
            ${
              e.role?.name?.toLowerCase() === "admin"
                ? "bg-red-100 text-red-700"
                : e.role?.name?.toLowerCase()?.includes("account")
                  ? "bg-emerald-100 text-emerald-700"
                  : e.role?.name?.toLowerCase()?.includes("sales")
                    ? "bg-orange-100 text-orange-700"
                    : "bg-slate-100 text-slate-700"
            }`}
                        >
                          {e.role?.name || "User"}
                        </span>
                      </div>

                      {/* Action */}
                      {/* <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => handleDeleteEmployee(e.id)}
                          className="w-9 h-9 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all flex items-center justify-center"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div> */}

                      <div className="col-span-1 flex items-center justify-center gap-2">
                        {/* Edit Button - Admin Only */}
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setEditingEmployee(e);
                              setShowEditModal(true);
                            }}
                            className="w-9 h-9 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center"
                          >
                            <Pencil size={17} />
                          </button>
                        )}

                        {/* Delete Button - Admin Only */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteEmployee(e.id)}
                            className="w-9 h-9 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all flex items-center justify-center"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Pagination */}
                {employees.length > employeesPerPage && (
                  <div className="flex items-center justify-between mt-6 px-2">
                    {/* Left Info */}
                    <div className="text-sm text-slate-500 font-medium">
                      Showing{" "}
                      <span className="font-semibold text-slate-700">
                        {startIndex + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-slate-700">
                        {Math.min(endIndex, employees.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-slate-700">
                       {filteredEmployees.length}
                      </span>{" "}
                      employees
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Previous */}
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
          ${
            currentPage === 1
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
          }`}
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all
            ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}

                      {/* Next */}
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
          ${
            currentPage === totalPages
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ADMIN HOME VIEW */
            <div className="px-6 py-5">
              <CompanyHeader
                activeTab={activeCompany}
                onTabChange={setActiveCompany}
              />
              <div className="mt-8">
                <DashboardHeader
                  title={activeCompany}
                  subtitle="Solarica Nexus Management"
                  hideSearch
                  hideNotifications
                  user={{
                    name: currentUser?.name || "User",
                    role: userRole || "User",
                  }}
                />
              </div>
              <DashboardCards selectedCompany={activeCompany} />
              <StatsCharts selectedCompany={activeCompany} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-8">
                <div className="lg:col-span-2">
                  <RecentActivity selectedCompany={activeCompany} />
                </div>
                <div className="lg:col-span-1">
                  <TopPerformers selectedCompany={activeCompany} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <QuotationViewModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        quotation={selectedQuotation}
      />
      <AddEmployeeModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAddEmployee}
      />
      <EditEmployeeModal
        isOpen={showEditModal}
        employee={editingEmployee}
        onClose={() => {
          setShowEditModal(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleEditEmployee}
      />
    </div>
  );
};

export default DashboardPage;
