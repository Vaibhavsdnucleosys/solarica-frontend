import React, { useState, useEffect } from 'react';
import {
    getProductionTasks,
    ProductionTask
} from '../../services/api';
import {
    getAllQuotations
} from '../../services/quotationService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    Truck, Layers, Clock, CheckCircle2, AlertCircle, TrendingUp,
    ShoppingCart, Users, ChevronRight, Search, Filter, Calendar
} from 'lucide-react';
import PendingOrdersPortal from './PendingOrdersPortal';
import ManagerTaskAssignment from './ManagerTaskAssignment';
import DispatchTrackingPortal from './DispatchTrackingPortal';

interface OperationAdminDashboardProps {
    onBack?: () => void;
}

const OperationAdminDashboard: React.FC<OperationAdminDashboardProps> = ({ onBack }) => {
    const [tasks, setTasks] = useState<ProductionTask[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'dashboard' | 'pending' | 'assign' | 'dispatch'>('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [prefillData, setPrefillData] = useState<any>(null);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [tasksData, quotesData] = await Promise.all([
                getProductionTasks(),
                getAllQuotations()
            ]);
            setTasks(tasksData || []);

            // Filter only accepted quotations for pending orders
            const acceptedQuotes = (quotesData || []).filter((q: any) => q.status.toUpperCase() === 'ACCEPTED');

            // Identify which orders don't have tasks yet
            const taskQuotationIds = new Set(tasksData.map((t: any) => t.quotationId).filter(Boolean));
            const pendingOrders = acceptedQuotes.filter((q: any) => !taskQuotationIds.has(q.id));

            setOrders(pendingOrders);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    // Stats Calculation
    const activeTasks = tasks.filter(t => t.status === 'In Progress').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const readyForDispatch = tasks.filter(t => t.status === 'Production Done').length;
    const dispatchedTasks = tasks.filter(t => t.status === 'Dispatched').length;

    const totalTarget = tasks.reduce((sum, t) => sum + (t.targetQuantity || 0), 0);
    const totalCompleted = tasks.reduce((sum, t) => sum + (t.completedQuantity || 0), 0);
    const productivity = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

    // Charts Data
    const statusData = [
        { name: 'Pending', value: pendingTasks, color: '#FCD34D' },
        { name: 'Processing', value: activeTasks, color: '#3B82F6' },
        { name: 'Ready', value: readyForDispatch, color: '#10B981' },
        { name: 'Dispatched', value: dispatchedTasks, color: '#6366F1' },
    ];

    const timelineData = [
        { name: 'Mon', tasks: 4 },
        { name: 'Tue', tasks: 7 },
        { name: 'Wed', tasks: 5 },
        { name: 'Thu', tasks: 9 },
        { name: 'Fri', tasks: 12 },
        { name: 'Sat', tasks: 8 },
        { name: 'Sun', tasks: 3 },
    ];

    if (view === 'pending') return <PendingOrdersPortal onBack={() => { setView('dashboard'); loadAllData(); }} onRedirectToAssignment={(data) => { setPrefillData(data); setView('assign'); }} />;
    if (view === 'assign') return <div className="p-8"><button onClick={() => setView('dashboard')} className="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors"><ChevronRight className="rotate-180" /> Back to Dashboard</button><ManagerTaskAssignment prefillData={prefillData} onTaskAssigned={() => { setView('dashboard'); loadAllData(); }} /></div>;
    if (view === 'dispatch') return <DispatchTrackingPortal onBack={() => { setView('dashboard'); loadAllData(); }} />;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
            {/* 1. Executive Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {onBack && (
                            <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                                <span className="material-symbols-outlined text-2xl text-slate-700">arrow_back</span>
                            </button>
                        )}
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Operation Command</h1>
                    </div>
                    <p className="text-slate-500 font-medium text-lg">Real-time production metrics and strategic oversight.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <button
                        onClick={() => setView('pending')}
                        className="px-5 py-3 bg-orange-50 text-orange-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-100 transition-all flex items-center gap-2"
                    >
                        <ShoppingCart size={16} />
                        Pending Orders ({orders.length})
                    </button>
                    <button
                        onClick={() => setView('assign')}
                        className="px-5 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                    >
                        <Layers size={16} />
                        New Assignment
                    </button>
                </div>
            </div>

            {/* 2. Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <Layers size={22} />
                        </div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg">Active</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Live Production</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-800">{activeTasks}</span>
                            <span className="text-xs font-bold text-slate-400">Tasks</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={22} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">Ready</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Ready for Dispatch</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-800">{readyForDispatch}</span>
                            <span className="text-xs font-bold text-slate-400">Items</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <Truck size={22} />
                        </div>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg">Success</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Dispatched</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-800">{dispatchedTasks}</span>
                            <span className="text-xs font-bold text-slate-400">Lifetime</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-amber-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <TrendingUp size={22} />
                        </div>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-lg">Efficiency</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Global Productivity</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-800">{productivity}%</span>
                            <span className="text-xs font-bold text-slate-400">Target</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Analytics Matrix */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Status Distribution */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        Status Flow
                    </h3>
                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-black text-slate-800">{tasks.length}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Tasks</span>
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        {statusData.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-lg font-black text-slate-800">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Production Activity Chart */}
                <div className="xl:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                            Production Velocity
                        </h3>
                        <div className="flex p-1 bg-slate-50 rounded-xl">
                            <button className="px-4 py-2 text-[10px] font-black uppercase text-blue-600 bg-white rounded-lg shadow-sm">Weekly</button>
                            <button className="px-4 py-2 text-[10px] font-black uppercase text-slate-400">Monthly</button>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="tasks" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorTasks)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 4. Monitoring Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Production Monitor */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Layers className="text-blue-600" size={24} />
                            Active Productions
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-6 space-y-4">
                        {tasks.filter(t => t.status === 'In Progress').length > 0 ? (
                            tasks.filter(t => t.status === 'In Progress').map(task => (
                                <div key={task.id} className="p-5 bg-white border border-slate-100 rounded-[2rem] hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors uppercase tracking-tight">{task.description}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Users size={12} /> {task.assigneeName}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Calendar size={12} /> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-black text-slate-800">{Math.round((task.completedQuantity / task.targetQuantity) * 100)}%</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(task.completedQuantity / task.targetQuantity) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No active production tasks</div>
                        )}
                    </div>
                    <div className="p-4 bg-slate-50 text-center">
                        <button
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                            onClick={() => window.dispatchEvent(new CustomEvent('solarica:sidebar-select', { detail: 'operation-master' }))}
                        >
                            View All Production Tasks
                        </button>
                    </div>
                </div>

                {/* Strategic Dispatch Log */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Truck className="text-emerald-500" size={24} />
                            Recent Shipments
                        </h3>
                        <button
                            onClick={() => setView('dispatch')}
                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                        >
                            Full History
                        </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 sticky top-0 z-10">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-4">Client</th>
                                    <th className="px-4 py-4">Quantity</th>
                                    <th className="px-4 py-4">Timeline</th>
                                    <th className="px-8 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {tasks.filter(t => t.status === 'Dispatched').slice(0, 10).map(task => (
                                    <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{task.customerName || 'Internal'}</span>
                                                <span className="text-[10px] font-bold text-slate-400">{task.description.slice(0, 30)}...</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 font-black text-slate-700 text-sm">{task.dispatchQty || task.completedQuantity}</td>
                                        <td className="px-4 py-5 text-[10px] font-bold text-slate-400">{task.dispatchDate ? new Date(task.dispatchDate).toLocaleDateString() : 'Unknown'}</td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg">Shipped</span>
                                        </td>
                                    </tr>
                                ))}
                                {tasks.filter(t => t.status === 'Dispatched').length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No dispatch history recorded yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e2e8f0;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

export default OperationAdminDashboard;
