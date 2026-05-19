// import React, { useState, useEffect, useRef } from 'react';
// import {
//     Wallet, TrendingUp, TrendingDown, DollarSign,
//     Filter, Download, RefreshCw, ArrowUpRight,
//     BarChart3, CreditCard, AlertCircle, PiggyBank
// } from 'lucide-react';
// import { Notification } from '../../services/notificationService';
// import WelcomeSection from '../WelcomeSection';
// import DashboardHeader from '../DashboardHeader';

// // ─────────────────────────────────────────────────────────
// // Animated number counter hook
// // ─────────────────────────────────────────────────────────
// function useCountUp(target: number, duration = 1200, started = true) {
//     const [value, setValue] = useState(0);
//     const raf = useRef<number | null>(null);

//     useEffect(() => {
//         if (!started) return;
//         const start = performance.now();
//         const animate = (now: number) => {
//             const elapsed = now - start;
//             const progress = Math.min(elapsed / duration, 1);
//             // Ease-out cubic
//             const eased = 1 - Math.pow(1 - progress, 3);
//             setValue(Math.round(eased * target));
//             if (progress < 1) {
//                 raf.current = requestAnimationFrame(animate);
//             }
//         };
//         raf.current = requestAnimationFrame(animate);
//         return () => { if (raf.current) cancelAnimationFrame(raf.current); };
//     }, [target, duration, started]);

//     return value;
// }

// // ─────────────────────────────────────────────────────────
// // Shimmer skeleton component
// // ─────────────────────────────────────────────────────────
// const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
//     <div className={`animate-shimmer rounded-lg ${className}`} />
// );

// const StatCardSkeleton: React.FC<{ dark?: boolean }> = ({ dark }) => (
//     <div className={`rounded-2xl p-5 ${dark ? 'bg-slate-800' : 'bg-white border border-slate-100'}`}>
//         <div className="flex items-start justify-between mb-3">
//             <Shimmer className={`w-9 h-9 rounded-xl ${dark ? 'opacity-20' : ''}`} />
//             <Shimmer className="w-14 h-5 rounded-full" />
//         </div>
//         <Shimmer className="w-24 h-3 mb-2" />
//         <Shimmer className="w-32 h-7" />
//     </div>
// );

// // ─────────────────────────────────────────────────────────
// // Individual animated stat card
// // ─────────────────────────────────────────────────────────
// interface StatCardProps {
//     title: string;
//     rawValue: number;      // numeric rupee value for animation
//     displayPrefix: string; // "₹" or ""
//     icon: React.ElementType;
//     gradient: string;
//     iconBg: string;
//     textColor: string;
//     labelColor: string;
//     badge?: { text: string; up: boolean } | null;
//     flat?: boolean;
//     delay?: number;
//     isLoading: boolean;
// }

// const StatCard: React.FC<StatCardProps> = ({
//     title, rawValue, displayPrefix, icon: Icon,
//     gradient, iconBg, textColor, labelColor,
//     badge, flat, delay = 0, isLoading,
// }) => {
//     const [visible, setVisible] = useState(false);

//     useEffect(() => {
//         if (!isLoading) {
//             const t = setTimeout(() => setVisible(true), delay);
//             return () => clearTimeout(t);
//         }
//     }, [isLoading, delay]);

//     const animatedVal = useCountUp(rawValue, 1000, visible);

//     const display = displayPrefix === '₹'
//         ? `₹${animatedVal.toLocaleString('en-IN')}`
//         : animatedVal.toString();

//     if (isLoading) return <StatCardSkeleton dark={!flat} />;

//     return (
//         <div
//             className="stat-card animate-card-in relative rounded-2xl overflow-hidden p-5 cursor-default"
//             style={{ animationDelay: `${delay}ms` }}
//         >
//             <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
//             {!flat && (
//                 <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-white/5 pointer-events-none" />
//             )}
//             <div className="relative z-10">
//                 <div className="flex items-start justify-between mb-3">
//                     <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center`}>
//                         <Icon size={17} className={textColor} />
//                     </div>
//                     {badge && (
//                         <span className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full
//                             ${flat
//                                 ? (badge.up ? 'text-emerald-600 bg-emerald-100' : 'text-rose-600 bg-rose-100')
//                                 : (badge.up ? 'bg-emerald-400/20 text-emerald-200' : 'bg-rose-400/20 text-rose-200')
//                             }`}>
//                             {badge.up ? <ArrowUpRight size={10} /> : <TrendingDown size={10} />}
//                             {badge.text}
//                         </span>
//                     )}
//                 </div>
//                 <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${labelColor}`}>{title}</p>
//                 <p className={`text-xl font-black tracking-tight tabular-nums ${textColor}`}>{display}</p>
//             </div>
//         </div>
//     );
// };

// // ─────────────────────────────────────────────────────────
// // Mock data
// // ─────────────────────────────────────────────────────────
// const PROJECT_DATA = [
//     {
//         id: 1,
//         orderDetails: { title: 'Studio Cum Office', client: 'Nilesh Birla' },
//         projectAmount: '₹1,35,000', payments: '₹25,000', balance: '₹1,10,000',
//         tasks: '1 / 1', expense: '₹12,000', unpaidExpense: '₹12,000',
//         profit: '₹13,000', profitNote: null, profitUp: true
//     },
//     {
//         id: 2,
//         orderDetails: { title: 'Sofa cum bed', client: 'Mr. Vishal Rathi' },
//         projectAmount: '₹45,000', payments: '₹35,000', balance: '₹10,000',
//         tasks: '0 / 0', expense: '₹30,000', unpaidExpense: '0',
//         profit: '₹5,000', profitNote: 'Below target (33.0%)', profitUp: false
//     },
// ];

// const STAT_CONFIG = [
//     {
//         title: 'Turnover', rawValue: 180000, displayPrefix: '₹',
//         icon: BarChart3, gradient: 'from-slate-800 to-slate-900',
//         iconBg: 'bg-white/10', textColor: 'text-white', labelColor: 'text-slate-300',
//         badge: null, flat: false,
//     },
//     {
//         title: 'Payments Received', rawValue: 60000, displayPrefix: '₹',
//         icon: CreditCard, gradient: 'from-emerald-500 to-teal-600',
//         iconBg: 'bg-white/20', textColor: 'text-white', labelColor: 'text-emerald-100',
//         badge: { text: '+12%', up: true }, flat: false,
//     },
//     {
//         title: 'Balance (Client)', rawValue: 120000, displayPrefix: '₹',
//         icon: Wallet, gradient: 'from-amber-500 to-orange-600',
//         iconBg: 'bg-white/20', textColor: 'text-white', labelColor: 'text-amber-100',
//         badge: null, flat: false,
//     },
//     {
//         title: 'Profit / Loss', rawValue: 18000, displayPrefix: '₹',
//         icon: TrendingUp, gradient: 'from-blue-500 to-indigo-600',
//         iconBg: 'bg-white/20', textColor: 'text-white', labelColor: 'text-blue-100',
//         badge: { text: '+8%', up: true }, flat: false,
//     },
//     {
//         title: 'Total Expense', rawValue: 42000, displayPrefix: '₹',
//         icon: DollarSign, gradient: 'from-slate-100 to-slate-50',
//         iconBg: 'bg-slate-200', textColor: 'text-slate-800', labelColor: 'text-slate-500',
//         badge: null, flat: true,
//     },
//     {
//         title: 'Paid Expenses', rawValue: 30000, displayPrefix: '₹',
//         icon: PiggyBank, gradient: 'from-slate-100 to-slate-50',
//         iconBg: 'bg-slate-200', textColor: 'text-slate-800', labelColor: 'text-slate-500',
//         badge: null, flat: true,
//     },
//     {
//         title: 'Unpaid Expenses', rawValue: 12000, displayPrefix: '₹',
//         icon: AlertCircle, gradient: 'from-rose-50 to-red-50',
//         iconBg: 'bg-rose-100', textColor: 'text-rose-600', labelColor: 'text-rose-400',
//         badge: { text: 'Due', up: false }, flat: true,
//     },
//     {
//         title: 'Balance (Me)', rawValue: 30000, displayPrefix: '₹',
//         icon: Wallet, gradient: 'from-emerald-50 to-teal-50',
//         iconBg: 'bg-emerald-100', textColor: 'text-emerald-700', labelColor: 'text-emerald-500',
//         badge: null, flat: true,
//     },
// ];

// // ─────────────────────────────────────────────────────────
// // Props
// // ─────────────────────────────────────────────────────────
// interface DashboardProps {
//     onNavigate?: (view: string) => void;
//     notifications?: Notification[];
//     unreadCount?: number;
//     isNotificationOpen?: boolean;
//     setIsNotificationOpen?: (open: boolean) => void;
//     handleMarkAsRead?: (id: string) => void;
//     handleMarkAllAsRead?: () => void;
//     onViewQuotation?: (id: string) => void;
// }

// // ─────────────────────────────────────────────────────────
// // Main Component
// // ─────────────────────────────────────────────────────────
// const Dashboard: React.FC<DashboardProps> = ({
//     notifications = [], unreadCount = 0,
//     isNotificationOpen = false,
//     setIsNotificationOpen = () => { },
//     handleMarkAsRead = () => { },
//     handleMarkAllAsRead = () => { },
//     onViewQuotation,
// }) => {
//     const [isLoading, setIsLoading] = useState(true);
//     const [perPage, setPerPage] = useState(10);
//     const [tableVisible, setTableVisible] = useState(false);
//     const [lastUpdated, setLastUpdated] = useState(new Date());

//     const handleReload = () => {
//         setIsLoading(true);
//         setTableVisible(false);
//         setTimeout(() => {
//             setIsLoading(false);
//             setLastUpdated(new Date());
//             setTimeout(() => setTableVisible(true), 200);
//         }, 800);
//     };

//     // Simulate data load with a short delay for the skeleton effect
//     useEffect(() => {
//         const t = setTimeout(() => {
//             setIsLoading(false);
//             setLastUpdated(new Date());
//             setTimeout(() => setTableVisible(true), 200);
//         }, 800);
//         return () => clearTimeout(t);
//     }, []);

//     return (
//         <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100">
//             <div className="flex-1 overflow-y-auto main-content-scroll p-5 md:p-8">
//                 <div className="max-w-7xl mx-auto flex flex-col gap-5">

//                     {/* ── Header ─────────────────────────────────── */}
//                     <DashboardHeader
//                         title="Business Overview"
//                         hideSearch={true}
//                         hideNotifications={false}
//                         notifications={notifications}
//                         unreadCount={unreadCount}
//                         isNotificationOpen={isNotificationOpen}
//                         setIsNotificationOpen={setIsNotificationOpen}
//                         handleMarkAsRead={handleMarkAsRead}
//                         handleMarkAllAsRead={handleMarkAllAsRead}
//                         onViewQuotation={onViewQuotation}
//                     />

//                     {/* ── Welcome hero ────────────────────────────── */}
//                     <WelcomeSection />

//                     {/* ── Filter strip ────────────────────────────── */}
//                     <div className="flex items-center justify-end gap-2 animate-card-in" style={{ animationDelay: '0.05s' }}>
//                         <span className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm">
//                             Active 2
//                         </span>
//                         <span className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/30">
//                             Ongoing 2
//                         </span>
//                         <button className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-indigo-600 shadow-sm">
//                             <Filter size={15} />
//                         </button>
//                     </div>

//                     {/* ── Stat Cards (8 cards) ─────────────────────── */}
//                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
//                         {STAT_CONFIG.map((card, i) => (
//                             <StatCard
//                                 key={card.title}
//                                 {...card}
//                                 delay={i * 60}
//                                 isLoading={isLoading}
//                             />
//                         ))}
//                     </div>

//                     {/* ── Project Performance Table ─────────────────── */}
//                     <div
//                         className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-500
//                             ${tableVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
//                     >
//                         {/* Table header */}
//                         <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
//                                     <BarChart3 size={16} className="text-indigo-600" />
//                                 </div>
//                                 <h2 className="text-base font-bold text-slate-800">Project Performance</h2>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <div className="flex items-center gap-2 text-slate-400">
//                                     <span className="text-xs">Show</span>
//                                     <select
//                                         value={perPage}
//                                         onChange={e => setPerPage(Number(e.target.value))}
//                                         className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
//                                     >
//                                         {[10, 20, 50].map(v => <option key={v}>{v}</option>)}
//                                     </select>
//                                     <span className="text-xs">per page</span>
//                                 </div>
//                                 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200">
//                                     <Download size={13} />
//                                     Export Excel
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Skeleton table rows while loading */}
//                         {isLoading ? (
//                             <div className="p-6 space-y-3">
//                                 {[1, 2, 3].map(i => (
//                                     <div key={i} className="flex gap-4 items-center">
//                                         <Shimmer className="w-6 h-6 rounded-full flex-shrink-0" />
//                                         <div className="flex-1 space-y-1.5">
//                                             <Shimmer className="w-40 h-3" />
//                                             <Shimmer className="w-24 h-2.5" />
//                                         </div>
//                                         <Shimmer className="w-20 h-3" />
//                                         <Shimmer className="w-16 h-3" />
//                                         <Shimmer className="w-16 h-3" />
//                                         <Shimmer className="w-12 h-3" />
//                                         <Shimmer className="w-16 h-3" />
//                                         <Shimmer className="w-16 h-3" />
//                                         <Shimmer className="w-16 h-3" />
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="w-full text-left">
//                                     <thead>
//                                         <tr className="border-b border-slate-100 bg-slate-50/60">
//                                             {['#', 'Order Details', 'Project Amt', 'Payments', 'Balance', 'Tasks', 'Expense', 'Unpaid Exp.', 'Profit'].map((h, i) => (
//                                                 <th
//                                                     key={h}
//                                                     className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap
//                                                         ${h === 'Balance' ? 'text-amber-600' : ''}
//                                                         ${h === 'Unpaid Exp.' ? 'text-rose-500' : ''}
//                                                         ${h === 'Profit' ? 'text-emerald-600' : h !== 'Balance' && h !== 'Unpaid Exp.' ? 'text-slate-400' : ''}
//                                                         ${i === 0 ? 'w-12 text-center' : i >= 2 ? 'text-right' : ''}
//                                                     `}
//                                                 >
//                                                     {h}
//                                                 </th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-slate-50">
//                                         {PROJECT_DATA.map(row => (
//                                             <tr key={row.id} className="perf-row group/row cursor-pointer">
//                                                 <td className="px-4 py-4 text-center">
//                                                     <span className="w-6 h-6 rounded-full bg-slate-100 group-hover/row:bg-indigo-100 inline-flex items-center justify-center text-[11px] font-bold text-slate-500 group-hover/row:text-indigo-600 transition-colors">
//                                                         {row.id}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-4 py-4">
//                                                     <div>
//                                                         <p className="text-sm font-bold text-slate-800">{row.orderDetails.title}</p>
//                                                         <p className="text-xs text-slate-400 font-medium">{row.orderDetails.client}</p>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-4 py-4 text-right text-sm font-bold text-slate-700">{row.projectAmount}</td>
//                                                 <td className="px-4 py-4 text-right text-sm font-bold text-emerald-600">{row.payments}</td>
//                                                 <td className="px-4 py-4 text-right text-sm font-bold text-amber-600">{row.balance}</td>
//                                                 <td className="px-4 py-4 text-center">
//                                                     <span className="text-xs font-bold text-slate-600 bg-slate-100 group-hover/row:bg-indigo-50 group-hover/row:text-indigo-600 px-2 py-0.5 rounded-lg transition-colors">{row.tasks}</span>
//                                                 </td>
//                                                 <td className="px-4 py-4 text-right text-sm font-bold text-slate-700">{row.expense}</td>
//                                                 <td className="px-4 py-4 text-right text-sm font-bold text-rose-500">
//                                                     {row.unpaidExpense === '0' ? (
//                                                         <span className="text-slate-300 font-medium">—</span>
//                                                     ) : row.unpaidExpense}
//                                                 </td>
//                                                 <td className="px-4 py-4 text-right">
//                                                     <div className="flex flex-col items-end gap-1">
//                                                         <div className="flex items-center gap-1">
//                                                             {row.profitUp
//                                                                 ? <ArrowUpRight size={13} className="text-emerald-500" />
//                                                                 : <TrendingDown size={13} className="text-rose-400" />}
//                                                             <span className={`text-sm font-black ${row.profitUp ? 'text-emerald-600' : 'text-rose-500'}`}>
//                                                                 {row.profit}
//                                                             </span>
//                                                         </div>
//                                                         {row.profitNote && (
//                                                             <span className="text-[10px] text-rose-400 font-semibold">{row.profitNote}</span>
//                                                         )}
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                 </div>
//             </div>

//             {/* ── Bottom bar ── sits naturally at the bottom as a flex child, no sticky needed */}
//             <div className="flex-shrink-0 px-5 py-3 bg-white border-t border-slate-100 flex items-center gap-3">
//                 <button
//                     onClick={handleReload}
//                     disabled={isLoading}
//                     className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all"
//                 >
//                     <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
//                     {isLoading ? 'Loading...' : 'Reload'}
//                 </button>
//                 <p className="text-xs text-slate-400 font-medium">
//                     Last updated: {lastUpdated.toLocaleTimeString()}
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import React, { useEffect, useState, useRef } from "react";

import {
  Wallet,
  DollarSign,
  BarChart3,
  CreditCard,
  RefreshCw,
  Download,
} from "lucide-react";

import WelcomeSection from "../WelcomeSection";

import DashboardHeader from "../DashboardHeader";

import { Notification } from "../../services/notificationService";

// import {
//     getDashboardOverview
// } from '../../services/dashboardService';
import { getCompanyDashboard } from "../../services/dashboardService";

// ─────────────────────────────────────────────
// Counter Animation
// ─────────────────────────────────────────────

function useCountUp(target: number, duration = 1000, started = true) {
  const [value, setValue] = useState(0);

  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;

    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(eased * target));

      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      }
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, [target, duration, started]);

  return value;
}

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────

const StatCard = ({ title, value, icon: Icon, gradient }: any) => {
  const animated = useCountUp(value);

  return (
    <div
      className={`
                rounded-3xl p-5
                bg-gradient-to-br
                ${gradient}
                text-white
                shadow-lg
            `}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="
                        w-12 h-12 rounded-2xl
                        bg-white/15
                        flex items-center justify-center
                    "
        >
          <Icon size={20} />
        </div>
      </div>

      <p className="text-sm font-semibold text-white/80">{title}</p>

      <h2 className="text-3xl font-black mt-1">
        ₹{animated.toLocaleString("en-IN")}
      </h2>
    </div>
  );
};

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface DashboardProps {
  notifications?: Notification[];

  unreadCount?: number;

  isNotificationOpen?: boolean;

  setIsNotificationOpen?: (open: boolean) => void;

  handleMarkAsRead?: (id: string) => void;

  handleMarkAllAsRead?: () => void;

  onViewQuotation?: (id: string) => void;
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const Dashboard: React.FC<DashboardProps> = ({
  notifications = [],

  unreadCount = 0,

  isNotificationOpen = false,

  setIsNotificationOpen = () => {},

  handleMarkAsRead = () => {},

  handleMarkAllAsRead = () => {},

  onViewQuotation,
}) => {
  const [companies, setCompanies] = useState<any[]>([]);

  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [perPage, setPerPage] = useState(10);

  const [lastUpdated, setLastUpdated] = useState(new Date());

  // ─────────────────────────────────────
  // Load Dashboard
  // ─────────────────────────────────────

  const loadDashboard = async () => {
    try {
      setIsLoading(true);

      const data = await getCompanyDashboard();

      const companies = (data.companies || []).map((company: any) => {
        return {
          id: company.id,

          name: company.companyName,

          displayName: company.companyName,

          projects: company.projectPerformance || [],

          totalRevenue: company.stats?.turnover || 0,

          totalPayments: company.stats?.paymentsReceived || 0,

          totalExpense: company.stats?.totalExpense || 0,

          balance: company.stats?.clientBalance || 0,

          profit: company.stats?.profit || 0,
        };
      });

      setCompanies(companies);

      if (companies.length > 0) {
        setSelectedCompany(companies[0]);
      }
    } catch (error) {
      console.error("Dashboard load failed", error);
    } finally {
      setIsLoading(false);

      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ─────────────────────────────────────
  // Stats
  // ─────────────────────────────────────

  const STAT_CONFIG = selectedCompany
    ? [
        {
          title: "Revenue",
          value: selectedCompany.totalRevenue || 0,
          icon: BarChart3,
          gradient: "from-slate-800 to-slate-900",
        },

        {
          title: "Payments",
          value: selectedCompany.totalPayments || 0,
          icon: CreditCard,
          gradient: "from-emerald-500 to-teal-600",
        },

        {
          title: "Expense",
          value: selectedCompany.totalExpense || 0,
          icon: DollarSign,
          gradient: "from-rose-500 to-red-600",
        },

        {
          title: "Balance",
          value: selectedCompany.balance || 0,
          icon: Wallet,
          gradient: "from-amber-500 to-orange-600",
        },
        {
    title: 'Profit',
    value:
        selectedCompany.profit || 0,
    icon: Wallet,
    gradient:
        'from-indigo-500 to-violet-600'
},
      ]
    : [];

  return (
    <div className="flex-1 bg-slate-100 min-h-screen">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}

        <DashboardHeader
          title="Business Overview"
          hideSearch={true}
          hideNotifications={false}
          notifications={notifications}
          unreadCount={unreadCount}
          isNotificationOpen={isNotificationOpen}
          setIsNotificationOpen={setIsNotificationOpen}
          handleMarkAsRead={handleMarkAsRead}
          handleMarkAllAsRead={handleMarkAllAsRead}
          onViewQuotation={onViewQuotation}
        />

        {/* Welcome */}

       <WelcomeSection
    companyName={
        selectedCompany?.name ||
        'Solarica Energy India Pvt Ltd'
    }
/>

        {/* Company Tabs */}

        <div
          className="
                            flex items-center gap-3
                            overflow-x-auto pb-2
                        "
        >
          {companies.map((company: any) => (
            <button
              key={company.id}
              onClick={() => setSelectedCompany(company)}
              className={`
                px-5 py-2.5 rounded-2xl
                text-sm font-bold
                whitespace-nowrap
                transition-all duration-300
                border

                ${
                  selectedCompany?.id === company.id
                    ? `
                        bg-indigo-600
                        text-white
                        border-indigo-600
                        shadow-lg
                        shadow-indigo-500/30
                    `
                    : `
                        bg-white
                        text-slate-700
                        border-slate-200
                        hover:border-indigo-300
                        hover:text-indigo-600
                    `
                }
            `}
            >
              {company.name}
            </button>
          ))}
        </div>

        {/* Stats */}

        <div
          className="
                            grid grid-cols-1
                            sm:grid-cols-2
                            xl:grid-cols-5
                            gap-5
                        "
        >
          {STAT_CONFIG.map((card: any) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
              gradient={card.gradient}
            />
          ))}
        </div>

        {/* Table */}

        <div
          className="
                            bg-white rounded-3xl
                            border border-slate-200
                            shadow-sm overflow-hidden
                        "
        >
          {/* Top */}

          <div
            className="
                                px-6 py-5
                                border-b border-slate-100
                                flex items-center
                                justify-between
                            "
          >
            <div>
              <h2
                className="
                                        text-lg font-black
                                        text-slate-800
                                    "
              >
                Project Performance
              </h2>

              <p
                className="
                                        text-sm text-slate-400 mt-1
                                    "
              >
                Company wise projects overview
              </p>
            </div>

            <div
              className="
                                    flex items-center gap-3
                                "
            >
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="
                                        px-3 py-2 rounded-xl
                                        border border-slate-200
                                        text-sm font-semibold
                                    "
              >
                <option value={10}>10</option>

                <option value={20}>20</option>

                <option value={50}>50</option>
              </select>

              <button
                className="
                                        flex items-center gap-2
                                        px-4 py-2 rounded-xl
                                        bg-slate-900 text-white
                                        text-sm font-semibold
                                    "
              >
                <Download size={15} />
                Export
              </button>
            </div>
          </div>

          {/* Empty State */}

          {selectedCompany?.projects?.length === 0 && (
            <div className="py-20 text-center">
              <p
                className="
                                            text-slate-400
                                            text-lg font-semibold
                                        "
              >
                No Projects Found
              </p>
            </div>
          )}

          {/* Table */}

          {selectedCompany?.projects?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="
                                                    bg-slate-50
                                                    border-b
                                                    border-slate-100
                                                "
                  >
                    {[
                      "#",
                      "Project",
                      "Client",
                      "Amount",
                      "Payments",
                      "Balance",
                      "Expense",
                      "Profit",
                    ].map((head) => (
                      <th
                        key={head}
                        className="
                                                            px-5 py-4
                                                            text-left
                                                            text-xs
                                                            font-black
                                                            uppercase
                                                            tracking-widest
                                                            text-slate-400
                                                            whitespace-nowrap
                                                        "
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {selectedCompany.projects

                    .slice(0, perPage)

                    .map((row: any, index: number) => (
                      <tr
                        key={row.id}
                        className="
                                                                border-b
                                                                border-slate-50
                                                                hover:bg-slate-50/70
                                                                transition-all
                                                            "
                      >
                        <td
                          className="
                                                                    px-5 py-4
                                                                    text-sm
                                                                    font-bold
                                                                    text-slate-500
                                                                "
                        >
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p
                              className="
        text-sm
        font-bold
        text-slate-800
    "
                            >
                              {row.orderDetails?.title ||
                                row.projectName ||
                                "-"}
                            </p>
                          </div>
                        </td>

                        <td
                          className="
                                                                    px-5 py-4
                                                                    text-sm
                                                                    text-slate-600
                                                                "
                        >
                         {
    row.orderDetails?.client ||
    row.customerName ||
    '-'
}
                        </td>

                        <td
                          className="
                                                                    px-5 py-4
                                                                    text-sm
                                                                    font-bold
                                                                    text-slate-800
                                                                "
                        >
                          ₹
                          {Number(row.projectAmount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>

                        <td
                          className="
                                                                    px-5 py-4
                                                                    text-sm
                                                                    font-bold
                                                                    text-emerald-600
                                                                "
                        >
                          ₹{Number(row.payments || 0).toLocaleString("en-IN")}
                        </td>

                        <td
                          className="
                                                                    px-5 py-4
                                                                    text-sm
                                                                    font-bold
                                                                    text-amber-600
                                                                "
                        >
                          ₹{Number(row.balance || 0).toLocaleString("en-IN")}
                        </td>

                        <td
                          className="
                                                                    px-5 py-4
                                                                    text-sm
                                                                    font-bold
                                                                    text-rose-500
                                                                "
                        >
                          ₹{Number(row.expense || 0).toLocaleString("en-IN")}
                        </td>

                        <td
                          className="
                                                                    px-5 py-4
                                                                    text-sm
                                                                    font-black
                                                                    text-indigo-600
                                                                "
                        >
                          ₹{Number(row.profit || 0).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}

        <div
          className="
                            flex items-center justify-between
                            bg-white rounded-2xl
                            border border-slate-200
                            px-5 py-4
                        "
        >
          <button
            onClick={loadDashboard}
            disabled={isLoading}
            className="
                                flex items-center gap-2
                                px-5 py-2.5
                                rounded-xl
                                bg-emerald-500
                                hover:bg-emerald-600
                                text-white
                                text-sm
                                font-bold
                                transition-all
                            "
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />

            {isLoading ? "Loading..." : "Reload"}
          </button>

          <p
            className="
                                text-sm text-slate-400
                                font-medium
                            "
          >
            Last Updated : {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
