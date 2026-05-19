// import {
//   LayoutDashboard,
//   Wallet,
//   FolderOpen,
//   Users,
//   Building2,
//   Megaphone,
//   Layers,
//   Hash,
//   Truck,
//   UserPlus
// } from "lucide-react";
// import React from "react";

// // ✅ Type (important for TS)
// export interface MenuItem {
//   id: string;
//   label: string;
//   icon: React.ReactNode;
// }

// // ✅ MASTER MENU (single source of truth)
// export const MENU_ITEMS: MenuItem[] = [
//   {
//   id: "role-permissions",
//   label: "Role Permissions",
//   icon: <Users size={20} className="text-red-600" />
// },
//   {
//     id: "dashboard",
//     label: "Dashboard",
//     icon: <LayoutDashboard size={20} className="text-blue-600" />
//   },
//   {
//     id: "leads-management",
//     label: "Leads Management",
//     icon: <UserPlus size={20} className="text-green-600" />
//   },
//   {
//     id: "hsn-master",
//     label: "HSN/SAC Master",
//     icon: <Hash size={20} className="text-orange-500" />
//   },
//   {
//     id: "sales-master",
//     label: "Sales Master",
//     icon: <Wallet size={20} className="text-emerald-600" />
//   },
//   {
//     id: "accounts-master",
//     label: "Accounts Master",
//     icon: <FolderOpen size={20} className="text-indigo-600" />
//   },
//   {
//     id: "operation-master",
//     label: "Operation Master",
//     icon: <Layers size={20} className="text-orange-600" />
//   },
//   {
//     id: "delivery",
//     label: "Delivery Challan",
//     icon: <Truck size={20} className="text-teal-600" />
//   },
//   {
//     id: "employee-management",
//     label: "Employee Master",
//     icon: <Users size={20} className="text-cyan-600" />
//   },
//   {
//     id: "solarica-hierarchy",
//     label: "Solarica Hierarchy",
//     icon: <Building2 size={20} className="text-violet-600" />
//   },
//   {
//     id: "marketing-tools",
//     label: "Marketing Tools",
//     icon: <Megaphone size={20} className="text-pink-600" />
//   }
// ];



// import React from "react";
// import {
//   LayoutDashboard,
//   Wallet,
//   FolderOpen,
//   Users,
//   Building2,
//   Megaphone,
//   Layers,
//   Hash,
//   Truck,
//   UserPlus
// } from "lucide-react";

// // ✅ IMPORT ALL YOUR PAGES
// import DashboardPage from "../pages/dashboard";
// import LeadsManagementPage from "../pages/LeadsManagementPage";
// import HsnMasterPage from "../pages/HsnMasterPage";
// import SalesMasterPage from "../pages/SalesMasterPage";
// import AccountsMasterPage from "../pages/AccountsMasterPage";
// import OperationMasterPage from "../pages/OperationMasterPage";
// import DeliveryPage from "../pages/DeliveryPage";
// import EmployeePage from "../pages/EmployeePage";
// import HierarchyPage from "../pages/HierarchyPage";
// import MarketingPage from "../pages/MarketingPage";
// import RolePermissionsPage from "../pages/RolePermissionsPage";

// export interface MenuItem {
//   id: string;
//   label: string;
//   icon: React.ReactNode;
//   component: React.ReactNode;
// }

// export const MENU_ITEMS: MenuItem[] = [
//   {
//     id: "dashboard",
//     label: "Dashboard",
//     icon: <LayoutDashboard size={20} className="text-blue-600" />,
//     component: <DashboardPage />
//   },
//   {
//     id: "leads-management",
//     label: "Leads Management",
//     icon: <UserPlus size={20} className="text-green-600" />,
//     component: <LeadsManagementPage />
//   },
//   {
//     id: "hsn-master",
//     label: "HSN/SAC Master",
//     icon: <Hash size={20} className="text-orange-500" />,
//     component: <HsnMasterPage />
//   },
//   {
//     id: "sales-master",
//     label: "Sales Master",
//     icon: <Wallet size={20} className="text-emerald-600" />,
//     component: <SalesMasterPage />
//   },
//   {
//     id: "accounts-master",
//     label: "Accounts Master",
//     icon: <FolderOpen size={20} className="text-indigo-600" />,
//     component: <AccountsMasterPage />
//   },
//   {
//     id: "operation-master",
//     label: "Operation Master",
//     icon: <Layers size={20} className="text-orange-600" />,
//     component: <OperationMasterPage />
//   },
//   {
//     id: "delivery",
//     label: "Delivery Challan",
//     icon: <Truck size={20} className="text-teal-600" />,
//     component: <DeliveryPage />
//   },
//   {
//     id: "employee-management",
//     label: "Employee Master",
//     icon: <Users size={20} className="text-cyan-600" />,
//     component: <EmployeePage />
//   },
//   {
//     id: "solarica-hierarchy",
//     label: "Solarica Hierarchy",
//     icon: <Building2 size={20} className="text-violet-600" />,
//     component: <HierarchyPage />
//   },
//   {
//     id: "marketing-tools",
//     label: "Marketing Tools",
//     icon: <Megaphone size={20} className="text-pink-600" />,
//     component: <MarketingPage />
//   },
//   {
//     id: "role-permissions",
//     label: "Role Permissions",
//     icon: <Users size={20} className="text-red-600" />,
//     component: <RolePermissionsPage />
//   }
// ];