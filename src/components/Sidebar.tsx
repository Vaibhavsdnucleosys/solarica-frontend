// import React, { useState } from 'react';
// import {
//   LayoutDashboard,
//   Wallet,
//   FolderOpen,
//   Users,
//   Building2,
//   Megaphone,
//   Menu,
//   X,
//   Layers,
//   Hash,
//   LogOut,
//   Truck,
//   UserPlus,   // ✅ Added icon for Leads
//   FileText
// } from 'lucide-react';

// // Menu item interface
// interface MenuItem {
//   id: string;
//   label: string;
//   icon: React.ReactNode;
// }

// interface SidebarProps {
//   onNavigate?: (id: string) => void;
//   activeId?: string;
//   menuItems?: MenuItem[];
//   user?: {
//     name: string;
//     role: string;
//     image?: string;
//   };
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   onNavigate,
//   activeId,
//   menuItems: customMenuItems,
//   user
// }) => {
//   const [localActive, setLocalActive] = useState<string>('dashboard');
//   const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

//   const activeItem = activeId || localActive;

//   // ✅ UPDATED MENU
//   const defaultMenuItems: MenuItem[] = [
//     { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} className="text-blue-600" /> },

//     // 🔥 NEW TAB ADDED HERE
//     // { id: 'leads-management', label: 'Leads Management', icon: <UserPlus size={20} className="text-green-600" /> },
//  { id: 'quotation-module', label: 'Quotation Module', icon: <FileText size={20} className="text-emerald-600" /> },
//     { id: 'leads-management', label: 'Leads Management', icon: <UserPlus size={20} className="text-blue-600" /> },
//     { id: 'hsn-master', label: 'HSN/SAC Master', icon: <Hash size={20} className="text-orange-500" /> },
//     { id: 'sales-master', label: 'Sales Master', icon: <Wallet size={20} className="text-emerald-600" /> },
//     { id: 'accounts-master', label: 'Accounts Master', icon: <FolderOpen size={20} className="text-indigo-600" /> },
//     { id: 'operation-master', label: 'Operation Master', icon: <Layers size={20} className="text-orange-600" /> },
//     { id: 'delivery', label: 'Delivery Challan', icon: <Truck size={20} className="text-teal-600" /> },
//     { id: 'employee-management', label: 'Employee Master', icon: <Users size={20} className="text-cyan-600" /> },
//     { id: 'solarica-hierarchy', label: 'Solarica Hierarchy', icon: <Building2 size={20} className="text-violet-600" /> },
//     { id: 'marketing-tools', label: 'Marketing Tools', icon: <Megaphone size={20} className="text-pink-600" /> },
//   ];

//   const menuItems = customMenuItems || defaultMenuItems;

//   const handleItemClick = (id: string) => {
//     setLocalActive(id);
//     if (onNavigate) onNavigate(id);

//     window.dispatchEvent(new CustomEvent('solarica:sidebar-select', { detail: id }));

//     if (window.innerWidth < 768) {
//       setIsMobileOpen(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     window.location.replace('/login');
//   };

//   return (
//     <>
//       {/* Mobile toggle */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white text-slate-600 rounded-xl shadow-lg border border-slate-100 hover:text-blue-600"
//         onClick={() => setIsMobileOpen(!isMobileOpen)}
//       >
//         {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       {/* Overlay */}
//       {isMobileOpen && (
//         <div
//           className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed left-0 top-0 h-full w-72 bg-white z-40
//           border-r border-slate-100 flex flex-col
//           transform transition-transform duration-300
//           ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
//         `}
//       >
//         {/* Logo */}
//         <div className="h-24 flex items-center px-8 border-b border-slate-50">
//           <div className="flex items-center gap-3">
//             <img src="/solarics_logo.webp" className="w-10 h-10" />
//             <div>
//               <div className="font-bold text-lg">SOLARICA</div>
//               <div className="text-xs text-blue-600 tracking-widest">NEXUS</div>
//             </div>
//           </div>
//         </div>

//         {/* User */}
//         <div className="mx-4 mt-6 p-4 rounded-2xl bg-slate-50 border">
//           <div className="flex gap-3 items-center">
//             <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
//               {user?.name?.[0] || 'U'}
//             </div>
//             <div>
//               <div className="text-sm font-bold">{user?.name}</div>
//               <div className="text-xs text-gray-400">{user?.role}</div>
//             </div>
//           </div>
//         </div>

//         {/* Menu */}
//         {/* <nav className="flex-1 p-4 space-y-1"> */}
//           <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
//           {menuItems.map((item) => {
//             const isActive = activeItem === item.id;

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleItemClick(item.id)}
//                 className={`
//                   w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm
//                   ${isActive
//                     ? 'bg-blue-600 text-white'
//                     : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
//                   }
//                 `}
//               >
//                 {React.cloneElement(item.icon as React.ReactElement, {
//                   className: isActive ? 'text-white' : (item.icon as any).props.className
//                 })}
//                 {item.label}
//               </button>
//             );
//           })}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl"
//           >
//             <LogOut size={20} />
//             Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;


import React, { useState } from 'react';
import {
  LayoutDashboard,
  Wallet,
  FolderOpen,
  Users,
  Building2,
  Megaphone,
  Menu,
  X,
  Layers,
  Hash,
  LogOut,
  Truck,
  UserPlus,
  FileText,
  BarChart3,
  ScrollText
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  onNavigate?: (id: string) => void;
  activeId?: string;
  menuItems?: MenuItem[];
  user?: {
    name: string;
    role: string;
    image?: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({
  onNavigate,
  activeId,
  menuItems: customMenuItems,
  user
}) => {
  const [localActive, setLocalActive] = useState<string>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const activeItem = activeId || localActive;

  // Menu for Admin - includes Quotation Module for creating quotations
  // const defaultMenuItems: MenuItem[] = [
  //   { id: 'dashboard', label: 'Admin Dashboard', icon: <LayoutDashboard size={20} className="text-blue-600" /> },
  //   { id: 'quotation-module', label: 'Quotation Module', icon: <FileText size={20} className="text-emerald-600" /> },
  //   { id: 'leads-management', label: 'Leads Management', icon: <UserPlus size={20} className="text-blue-600" /> },
  //   { id: 'hsn-master', label: 'HSN/SAC Master', icon: <Hash size={20} className="text-orange-500" /> },
  //   { id: 'sales-master', label: 'Sales Master', icon: <Wallet size={20} className="text-emerald-600" /> },
  //   { id: 'accounts-master', label: 'Accounts Master', icon: <FolderOpen size={20} className="text-indigo-600" /> },
  //      { id: 'accepted-invoices', label: 'Invoice List', icon: <FileText size={20} className="text-blue-600" /> },
  //   { id: 'operation-master', label: 'Operation Master', icon: <Layers size={20} className="text-orange-600" /> },
  //   { id: 'delivery', label: 'Delivery Challan', icon: <Truck size={20} className="text-teal-600" /> },
  //   { id: 'employee-management', label: 'Employee Master', icon: <Users size={20} className="text-cyan-600" /> },
  //   { id: 'solarica-hierarchy', label: 'Solarica Hierarchy', icon: <Building2 size={20} className="text-violet-600" /> },
  //   { id: 'marketing-tools', label: 'Marketing Tools', icon: <Megaphone size={20} className="text-pink-600" /> },
  // ];

  // Menu for Admin - includes ALL modules from all roles
  const defaultMenuItems: MenuItem[] = [
    // --- CORE & DASHBOARD ---
    { id: 'dashboard', label: 'Admin Dashboard', icon: <LayoutDashboard size={20} className="text-blue-600" /> },
    { id: 'employee-management', label: 'Employee Master', icon: <Users size={20} className="text-cyan-600" /> },
    // { id: 'solarica-hierarchy', label: 'Solarica Hierarchy', icon: <Building2 size={20} className="text-violet-600" /> },

    // --- SALES & CRM ---
        { id: 'sales-master', label: 'Sales Master', icon: <Wallet size={20} className="text-emerald-600" /> },
    { id: 'quotation-module', label: 'Quotation Module', icon: <FileText size={20} className="text-emerald-600" /> },
    { id: 'leads-management', label: 'Leads Management', icon: <UserPlus size={20} className="text-blue-600" /> },
    { id: 'marketing-tools', label: 'Marketing Tools', icon: <Megaphone size={20} className="text-pink-600" /> },

    // --- ACCOUNTS & INVOICING ---
    { id: 'accepted-invoices', label: 'Invoice List', icon: <FileText size={20} className="text-indigo-600" /> },
    { id: 'accounts-master', label: 'Accounts Master', icon: <FolderOpen size={20} className="text-emerald-600" /> },
    // { id: 'tally-sync', label: 'Tally Sync', icon: <BarChart3 size={20} className="text-blue-500" /> },

    // --- OPERATIONS & PRODUCTION ---
    { id: 'pending-orders', label: 'Pending Orders', icon: <ScrollText size={20} className="text-teal-600" /> },
    { id: 'operation-master', label: 'Production Tracking', icon: <Layers size={20} className="text-orange-600" /> },
    { id: 'work-order', label: 'Work Orders', icon: <FileText size={20} className="text-purple-600" /> },
    { id: 'dispatch-tracking', label: 'Dispatch Info', icon: <Truck size={20} className="text-orange-600" /> },
    { id: 'delivery', label: 'Delivery Challan', icon: <Truck size={20} className="text-teal-600" /> },

    // --- SYSTEM MASTERS ---
    { id: 'hsn-master', label: 'HSN/SAC Master', icon: <Hash size={20} className="text-orange-500" /> },
  ];

  
  const menuItems = customMenuItems || defaultMenuItems;
  

  const handleItemClick = (id: string) => {
    setLocalActive(id);
    if (onNavigate) onNavigate(id);
    if (window.innerWidth < 768) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.replace('/login');
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white text-slate-600 rounded-xl shadow-lg border border-slate-100 hover:text-blue-600"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 h-full w-72 bg-white z-40 border-r border-slate-100 flex flex-col transform transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-24 flex items-center px-8 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <img src="/solarics_logo.webp" className="w-10 h-10" alt="Logo" />
            <div>
              <div className="font-bold text-lg">SOLARICA</div>
              <div className="text-xs text-blue-600 tracking-widest">NEXUS</div>
            </div>
          </div>
        </div>

        <div className="mx-4 mt-6 p-4 rounded-2xl bg-slate-50 border">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <div className="text-sm font-bold truncate max-w-[150px]">{user?.name}</div>
              <div className="text-xs text-gray-400 uppercase">{user?.role}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}
              >
                {React.cloneElement(item.icon as React.ReactElement, {
                  className: isActive ? 'text-white' : (item.icon as any).props.className
                })}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl transition-colors">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;