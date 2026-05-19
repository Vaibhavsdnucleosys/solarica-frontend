import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Search, Bell, Menu, TrendingUp, Target, Send, CheckCircle2, XCircle,
    ArrowUpRight, ArrowDownRight, UserPlus, FileText, ChevronRight, MoreVertical,
    Briefcase, Users, Edit3, X, Check, IndianRupee, Filter, ChevronDown, LogOut
} from 'lucide-react';
import { getAllEmployeeReports, EmployeeReport, updateEmployeeTarget, getEmployeeReportSummary, getMonthlySalesReport } from '../../services/employeeReportService';
import { getNotifications, markAsRead, markAllAsRead, Notification } from '../../services/notificationService';
import CompanyHeader from '../CompanyHeader';

const AdminSalesDashboard: React.FC = () => {
    const [reports, setReports] = useState<EmployeeReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTarget, setEditingTarget] = useState<{ id: string, email: string, current: number } | null>(null);
    const [newTargetValue, setNewTargetValue] = useState<string>("");
    const [updating, setUpdating] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeReport | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRange, setFilterRange] = useState(1); // 1, 2, 3, or 4 months
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [timeFrame, setTimeFrame] = useState<'monthly' | 'quarterly'>('monthly');
    const [selectedCompany, setSelectedCompany] = useState<string>('Solarica Energy India Pvt Ltd');
    const [summary, setSummary] = useState<any>(null);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);

    useEffect(() => {
        console.log("AdminSalesDashboard mounted - version 2.0");
        fetchAllData();
    }, [selectedCompany, filterRange]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [reportsData, summaryData, monthlySalesData] = await Promise.all([
                getAllEmployeeReports(selectedCompany),
                getEmployeeReportSummary(selectedCompany),
                getMonthlySalesReport(filterRange, undefined, selectedCompany)
            ]);

            setReports(reportsData || []);
            setReports(reportsData || []);
            // Extract the actual summary stats from the nested response
            // Response format: { message: "...", summary: { summary: { totalDealValue... }, topPerformer... } }
            if (summaryData && summaryData.summary && summaryData.summary.summary) {
                setSummary(summaryData.summary.summary);
            } else {
                setSummary(null);
            }
            setMonthlyData(monthlySalesData || []);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchReports = async () => {
        // Kept for backward compatibility or individual refreshes if needed, 
        // but now mostly superseded by fetchAllData
        try {
            const data = await getAllEmployeeReports(selectedCompany);
            setReports(data || []);
        } catch (err) {
            console.error("Failed to fetch reports", err);
        }
    };

    const handleUpdateTarget = async () => {
        if (!editingTarget || !newTargetValue) return;
        try {
            setUpdating(true);
            await updateEmployeeTarget(editingTarget.id, parseFloat(newTargetValue));
            setEditingTarget(null);
            setNewTargetValue("");
            await fetchReports();
        } catch (err) {
            console.error("Failed to update target", err);
            alert("Failed to update target. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    const filteredReports = reports.filter(report =>
        report.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const performanceData = monthlyData.length > 0
        ? monthlyData.map(d => ({ name: d.monthName.slice(0, 3), value: d.totalSales }))
        : timeFrame === 'monthly' ? [
            { name: 'Jan', value: 400000 },
            { name: 'Feb', value: 300000 },
            { name: 'Mar', value: 600000 },
            { name: 'Apr', value: 800000 },
            { name: 'May', value: 700000 },
            { name: 'Jun', value: 900000 },
            { name: 'Jul', value: 1100000 },
            { name: 'Aug', value: 1200000 },
        ].slice(-(filterRange + 1)) : [
            { name: 'Oct', value: 3800000 },
            { name: 'Nov', value: 4200000 },
            { name: 'Dec', value: 4500000 },
        ];

    const conversionData = [
        { name: 'Accepted', value: 75, color: '#2bee79' },
        { name: 'Pending', value: 15, color: '#fde047' },
        { name: 'Rejected', value: 10, color: '#ef4444' },
    ];

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden font-display bg-background-light min-h-screen p-8">
            <CompanyHeader activeTab={selectedCompany} onTabChange={setSelectedCompany} />

            <div className="mb-6">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{selectedCompany}</h2>
                <p className="text-sm font-bold text-slate-400 mt-1">{currentDate}</p>
            </div>

            {/* Header */}
            <header className="flex items-center justify-between py-5 bg-white border-b border-slate-100 shrink-0 rounded-2xl mb-8 px-8">
                <div className="flex items-center gap-4 lg:hidden">
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500">
                        <Menu size={24} />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-800 leading-tight">SOLARICA</span>
                        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">NEXUS</span>
                    </div>
                </div>

                <div className="hidden lg:flex flex-col">
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">Sales Analytics Dashboard</h1>
                    <p className="text-xs text-slate-400 font-medium">Insights and performance monitoring</p>
                </div>

                <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                    <div className="flex items-center gap-4">
                        <div className="relative group flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all duration-300" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search employees by email..."
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        {/* Company Filter Removed - Controlled by top tabs now */}

                        {/* Time Period Dropdown Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all active:scale-95 ${isFilterOpen ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Filter size={16} className={isFilterOpen ? 'text-primary' : 'text-slate-400'} />
                                <div className="flex flex-col items-start leading-none gap-0.5">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Timeframe</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{filterRange} Month{filterRange > 1 ? 's' : ''}</span>
                                </div>
                                <ChevronDown size={14} className={`transition-transform duration-500 ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isFilterOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsFilterOpen(false)}
                                    />
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-2xl p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                        {[1, 2, 3, 4].map((range) => (
                                            <button
                                                key={range}
                                                onClick={() => {
                                                    setFilterRange(range);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${filterRange === range ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest">{range} Month{range > 1 ? 's' : ''}</span>
                                                {filterRange === range && <Check size={14} className="text-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-5">

                    <div className="size-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-black/10">
                        AD
                    </div>
                </div>

            </header>

            <main className="flex-1 overflow-y-auto main-content-scroll bg-background-light no-scrollbar">
                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                    {[
                        { label: "Direct Sales", val: summary?.totalDealValue ? `₹${(summary.totalDealValue / 100000).toFixed(1)}L` : "₹0.0L", icon: IndianRupee, color: "primary" },
                        { label: "Avg Success", val: summary?.averageSuccessRate ? `${Math.round(summary.averageSuccessRate)}%` : "0%", icon: Target, color: "blue-500" },
                        { label: "Quotes Issued", val: summary?.totalQuotations?.toString() || "0", icon: Send, color: "purple-500" },
                        { label: "Clients Converted", val: summary?.totalClientsConverted?.toString() || "0", icon: CheckCircle2, color: "primary" },
                        { label: "Conversion Rate", val: summary?.rejectionRate !== undefined ? `${Math.round(100 - summary.rejectionRate)}%` : "0%", icon: XCircle, color: "red-500" }
                    ].map((stat, i) => (
                        <div key={i} className="relative overflow-hidden group p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon size={22} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</span>
                                <span className="text-3xl font-black text-slate-800 tracking-tight">{stat.val}</span>
                            </div>
                            {stat.label === "Monthly Target" && (
                                <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10">
                    {/* Main Performance Chart */}
                    <div className="xl:col-span-8 flex flex-col p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_25px_-12px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Revenue Performance</h2>
                                <p className="text-sm text-slate-400">Total revenue growth over time</p>
                            </div>
                            <div className="flex p-1.5 bg-slate-50/80 rounded-2xl">
                                <button
                                    onClick={() => setTimeFrame('monthly')}
                                    className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${timeFrame === 'monthly' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setTimeFrame('quarterly')}
                                    className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${timeFrame === 'quarterly' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Quarterly
                                </button>
                            </div>
                        </div>
                        <div className="h-[380px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2bee79" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#2bee79" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(value) => `₹${value / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#2bee79"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorVal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="xl:col-span-4 flex flex-col gap-8">
                        <div className="flex-1 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_25px_-12px_rgba(0,0,0,0.1)]">
                            <h2 className="text-lg font-bold text-slate-800 mb-8 tracking-tight">Conversion Analytics</h2>
                            <div className="h-[200px] w-full relative mb-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={conversionData}
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {conversionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-black text-slate-800">75%</span>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Success</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {conversionData.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="size-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-800">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Employee Reports (Dynamic with Target Management) */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Employee Performance</h2>
                            <p className="text-sm text-slate-400 font-medium">Manage and monitor team contribution</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 rounded-xl text-slate-500 text-xs font-bold border border-slate-100">
                                <Users size={14} /> Total: {filteredReports.length}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-32 rounded-[2.5rem] bg-slate-50/50 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
                            <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <span className="text-sm font-bold text-slate-400">Compiling Analytics...</span>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] uppercase text-slate-400 font-black tracking-[0.1em]">
                                        <th className="px-8 py-6">Identity</th>
                                        <th className="px-8 py-6 text-center">Monthly Progress</th>
                                        <th className="px-8 py-6 text-right">Target</th>
                                        <th className="px-8 py-6 text-center">Manage</th>
                                        <th className="px-8 py-6 text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm">
                                    {filteredReports.map((report) => {
                                        const progress = report.salesTarget > 0
                                            ? Math.min(Math.round((report.totalDealValue / report.salesTarget) * 100), 100)
                                            : 0;

                                        return (
                                            <tr key={report.employeeId} className="hover:bg-slate-50/40 transition-all duration-300 group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-11 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-lg border border-primary/10 group-hover:scale-110 transition-transform">
                                                            {(report.email || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-800 group-hover:text-primary transition-colors">{report.email.split('@')[0]}</span>
                                                            <span className="text-[11px] text-slate-400 font-medium">{report.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-2 max-w-[120px] mx-auto">
                                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
                                                            <span>{progress}% Achieved</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-primary shadow-[0_0_8px_rgba(43,238,121,0.5)]' : 'bg-blue-500'}`}
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-sm font-black text-slate-800">₹{report.salesTarget?.toLocaleString()}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">Monthly Goal</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <button
                                                        onClick={() => {
                                                            setEditingTarget({ id: report.employeeId, email: report.email, current: report.salesTarget });
                                                            setNewTargetValue(report.salesTarget.toString());
                                                        }}
                                                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all border border-slate-100"
                                                        title="Manage Target"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={() => setSelectedEmployee(report)}
                                                        className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-all active:scale-95 shadow-lg shadow-black/5 hover:shadow-primary/20"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Target Modal */}
            {editingTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-white animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Set Sales Target</h3>
                                <p className="text-sm text-slate-400 font-medium">{editingTarget.email}</p>
                            </div>
                            <button onClick={() => setEditingTarget(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Target Amount (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="number"
                                        value={newTargetValue}
                                        onChange={(e) => setNewTargetValue(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
                                <TrendingUp className="text-blue-500 shrink-0" size={20} />
                                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                    Setting a clear target motivates employees and allows for precise performance analytics. Progress will be tracked in real-time.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setEditingTarget(null)}
                                    className="flex-1 py-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateTarget}
                                    disabled={updating}
                                    className="flex-1 py-4 bg-primary text-white font-black text-xs rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {updating ? (
                                        <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>Save Target <Check size={16} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Employee Details Modal */}
            {selectedEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="relative p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                            <button
                                onClick={() => setSelectedEmployee(null)}
                                className="absolute top-5 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-5">
                                <div className="size-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/20">
                                    {selectedEmployee.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-xl font-black tracking-tight">{selectedEmployee.email.split('@')[0]}</h3>
                                    <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
                                        <Bell size={12} />
                                        <span>{selectedEmployee.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-10 space-y-10">
                            {/* Key Performance Indicators */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-primary/20 transition-colors">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Progress</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-slate-800">
                                            {Math.round((selectedEmployee.totalDealValue / (selectedEmployee.salesTarget || 1)) * 100)}%
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">Target</span>
                                    </div>
                                    <div className="mt-4 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(Math.round((selectedEmployee.totalDealValue / (selectedEmployee.salesTarget || 1)) * 100), 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-colors">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quotations Raised</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-slate-800">{selectedEmployee.totalQuotations}</span>
                                        <span className="text-xs font-bold text-blue-500">Sent</span>
                                    </div>
                                    <div className="mt-4 flex gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 3 ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl shadow-slate-900/10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-white/50">Total Value</p>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-white">₹{(selectedEmployee.totalDealValue / 100000).toFixed(1)}L</span>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Generated</span>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Activity Matrix */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <Target size={16} className="text-primary" />
                                    Activity Matrix
                                </h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                                <Send size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">Quotations Raised</span>
                                        </div>
                                        <span className="text-lg font-black text-slate-800">{selectedEmployee.totalQuotations}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                                <Users size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">Clients Visited</span>
                                        </div>
                                        <span className="text-lg font-black text-slate-800">{selectedEmployee.totalClientsVisited}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">Clients Converted</span>
                                        </div>
                                        <span className="text-lg font-black text-emerald-600">{selectedEmployee.totalClientsConverted}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                                <TrendingUp size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">Pending Quotes</span>
                                        </div>
                                        <span className="text-lg font-black text-amber-600">{selectedEmployee.pendingQuotations}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedEmployee(null)}
                                className="w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-900/10"
                            >
                                Close Performance view
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSalesDashboard;
