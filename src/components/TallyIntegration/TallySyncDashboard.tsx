import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { RefreshCw, CheckCircle2, XCircle, Database, ArrowRight, Zap, History, LayoutDashboard } from 'lucide-react';

const TallySyncDashboard: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                const tallyNotifs = data.filter((n: any) => n.title && n.title.includes('Tally'));
                setNotifications(tallyNotifs);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/crm/tally/stats`);
            const data = await response.json();

            if (response.ok && data.success) {
                setStats(data);
            } else {
                setError(data.message || 'Failed to fetch stats');
                setStats(null);
            }
        } catch (err: any) {
            setError(err.message || 'Network Error');
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchNotifications();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen flex flex-col gap-8 custom-scrollbar relative overflow-x-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -z-10 animate-float" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-3xl -z-10 animate-float-slow" />

            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                        <LayoutDashboard size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            Accounting Sync Dashboard
                            {loading && <Zap size={20} className="text-orange-500 animate-pulse" />}
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Manage integration and view real-time synchronization status</p>
                    </div>
                </div>
                <button
                    onClick={() => { fetchStats(); fetchNotifications(); }}
                    disabled={loading}
                    className="btn-premium flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    {loading ? 'Synchronizing...' : 'Sync Now'}
                </button>
            </header>

            {/* Status Card */}
            <div className={`p-8 rounded-[2rem] border transition-all duration-300 ${error ? 'bg-red-50/80 border-red-100 shadow-red-100' : 'bg-white/80 border-slate-200 shadow-slate-200'} shadow-xl glass`}>
                <div className="flex items-center gap-6">
                    <div className={`p-5 rounded-2xl ${error ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-100'}`}>
                        {error ? <XCircle size={40} /> : <CheckCircle2 size={40} />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-slate-800">
                                {error ? 'Connection Problem Detected' : 'Actively Connected to Accounting Master'}
                            </h3>
                            {!error && <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-black rounded-full animate-pulse uppercase tracking-wider">Online</span>}
                        </div>
                        <p className={`text-base font-bold mt-1 ${error ? 'text-red-500' : 'text-slate-400'}`}>
                            {error ? error : `Successfully established communication with Tally Server on 127.0.0.1:9000`}
                        </p>
                    </div>
                    {!error && (
                        <div className="hidden lg:flex items-center gap-2 text-slate-400 bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold">
                            <History size={16} />
                            Last sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="group bg-white/80 p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 glass hover:-translate-y-2">
                        <div className="flex items-center justify-between mb-6">
                            <span className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm"><Database size={28} /></span>
                            <span className="text-xs font-black bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full uppercase tracking-tighter">Raw Data</span>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-black uppercase tracking-widest">Payload Size</p>
                            <h2 className="text-4xl font-black text-slate-800 mt-2 flex items-baseline gap-2">
                                {stats.data?.dataLength?.toLocaleString() || 0}
                                <span className="text-lg text-slate-400 font-bold">bytes</span>
                            </h2>
                        </div>
                    </div>

                    <div className="group bg-white/80 p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 glass hover:-translate-y-2">
                        <div className="flex items-center justify-between mb-6">
                            <span className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm"><ArrowRight size={28} /></span>
                            <span className="text-xs font-black bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full uppercase tracking-tighter">Masters</span>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-black uppercase tracking-widest">Ledger Entries</p>
                            <h2 className="text-4xl font-black text-slate-800 mt-2">{stats.data?.ledgersCount !== undefined ? stats.data.ledgersCount : '--'}</h2>
                        </div>
                    </div>

                    <div className="group bg-white/80 p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 glass hover:-translate-y-2">
                        <div className="flex items-center justify-between mb-6">
                            <span className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm"><ArrowRight size={28} /></span>
                            <span className="text-xs font-black bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full uppercase tracking-tighter">Transactions</span>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-black uppercase tracking-widest">Voucher Sync</p>
                            <h2 className="text-4xl font-black text-slate-800 mt-2">{stats.data?.vouchersCount !== undefined ? stats.data.vouchersCount : '--'}</h2>
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-2 text-white overflow-hidden relative">
                        <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-white/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="p-4 bg-white/20 text-white rounded-2xl shadow-inner"><Database size={28} /></span>
                            <span className="text-[10px] font-black bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">Total Revenue</span>
                        </div>
                        <div>
                            <p className="text-white/60 text-sm font-black uppercase tracking-widest">Gross Sales</p>
                            <h2 className="text-3xl font-black text-white mt-1 drop-shadow-md">{formatCurrency(stats.data?.totalSales)}</h2>
                            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-1">
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none">Net Receivables</p>
                                <p className="text-white/80 font-bold text-lg">{formatCurrency(stats.data?.totalReceivables)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity Section */}
            <div className="bg-white/90 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden glass mb-8">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <History size={24} className="text-blue-600" />
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Synchronization Log</h3>
                    </div>
                    <span className="px-4 py-1.5 bg-white text-slate-400 text-xs font-black rounded-xl border border-slate-100 shadow-sm">{notifications.length} Entries Found</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <History size={32} className="text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold text-lg">No synchronization logs available yet.</p>
                            <p className="text-slate-300 text-sm font-medium">Click on 'Sync Now' to establish a fresh heartbeat.</p>
                        </div>
                    ) : (
                        notifications.map((notif: any) => (
                            <div key={notif.id} className="p-6 flex items-center gap-6 hover:bg-blue-50/30 transition-all group">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-base font-black text-slate-800 tracking-tight">{notif.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium mt-0.5">{notif.message}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-slate-400 font-black bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                                        {new Date(notif.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TallySyncDashboard;
