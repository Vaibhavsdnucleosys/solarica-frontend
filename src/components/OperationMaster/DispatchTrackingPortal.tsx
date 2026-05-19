import React, { useEffect, useState } from 'react';
import { getProductionTasks, updateProductionTask, ProductionTask } from '../../services/api';

interface DispatchTrackingPortalProps {
    onBack?: () => void;
}

const DispatchTrackingPortal: React.FC<DispatchTrackingPortalProps> = ({ onBack }) => {
    const [readyTasks, setReadyTasks] = useState<ProductionTask[]>([]);
    const [historyTasks, setHistoryTasks] = useState<ProductionTask[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'ready' | 'history'>('ready');
    const [dispatchInfo, setDispatchInfo] = useState<{ [key: string]: { qty: number, notes: string } }>({});

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const allTasks = await getProductionTasks();
            setReadyTasks(allTasks.filter((t: ProductionTask) => t.status === 'Production Done'));
            setHistoryTasks(allTasks.filter((t: ProductionTask) => t.status === 'Dispatched').sort((a: ProductionTask, b: ProductionTask) =>
                new Date(b.dispatchDate || '').getTime() - new Date(a.dispatchDate || '').getTime()
            ));
        } catch (error) {
            console.error("Failed to load tasks for Dispatch", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDispatch = async (task: ProductionTask) => {
        const info = dispatchInfo[task.id] || { qty: task.completedQuantity, notes: '' };
        if (!window.confirm(`Mark "${task.description}" as dispatched?`)) return;

        try {
            await updateProductionTask(task.id, {
                status: 'Dispatched',
                dispatchQty: info.qty || task.completedQuantity,
                dispatchNotes: info.notes || '',
                dispatchDate: new Date().toISOString()
            });
            loadTasks();
        } catch (error) {
            console.error("Dispatch update failed", error);
        }
    };

    return (
        <div className="bg-solarica-bg min-h-full p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-3xl text-slate-700">arrow_back</span>
                            </button>
                        )}
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dispatch Info</h1>
                            <p className="text-lg text-slate-500 font-medium">Manage and track outgoing shipments.</p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-12">
                    {/* 1. Ready for Dispatch Section */}
                    {readyTasks.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <span className="material-symbols-outlined">pending_actions</span>
                                </span>
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Ready for Dispatch ({readyTasks.length})</h2>
                            </div>

                            {loading ? (
                                <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Syncing ready items...</div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {readyTasks.map(task => (
                                        <div key={task.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-8 items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl font-black text-slate-800">{task.description}</h3>
                                                        {task.customerName && (
                                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                                <span className="flex items-center gap-2">
                                                                    <span className="material-symbols-outlined text-sm text-blue-500">person</span>
                                                                    <span className="text-sm font-bold text-blue-600">{task.customerName}</span>
                                                                </span>
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${task.priority === 'High' ? 'bg-red-50 text-red-600' : task.priority === 'Low' ? 'bg-slate-50 text-slate-500' : 'bg-amber-50 text-amber-600'}`}>
                                                                    {task.priority || 'Low'}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                                    {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Deadline'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                                        <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Status</p>
                                                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                                            <span className="material-symbols-outlined text-lg">check_circle</span>
                                                            Ready
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full lg:w-96 bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
                                                {/* Dispatch Quantity removed */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Dispatch Notes</label>
                                                    <textarea
                                                        placeholder="Carrier info, tracking, etc."
                                                        value={dispatchInfo[task.id]?.notes || ''}
                                                        onChange={(e) => setDispatchInfo({
                                                            ...dispatchInfo,
                                                            [task.id]: { ...dispatchInfo[task.id], notes: e.target.value, qty: dispatchInfo[task.id]?.qty ?? task.completedQuantity }
                                                        })}
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none transition-all placeholder:text-slate-300"
                                                        rows={2}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleDispatch(task)}
                                                    className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                                                >
                                                    <span className="material-symbols-outlined font-black">local_shipping</span>
                                                    Mark as Dispatched
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* 2. Dispatch History Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <span className="material-symbols-outlined">history</span>
                            </span>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Recent Dispatches ({historyTasks.length})</h2>
                        </div>

                        {loading ? (
                            <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Syncing history...</div>
                        ) : historyTasks.length === 0 ? (
                            <div className="p-10 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                                <p className="text-slate-400 font-bold">No dispatch history recorded yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {historyTasks.map(task => (
                                    <div key={task.id} className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center grayscale hover:grayscale-0 transition-all">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    Shipped
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">
                                                    {task.dispatchDate && !isNaN(new Date(task.dispatchDate).getTime())
                                                        ? new Date(task.dispatchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                        : ''}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-800 mb-1">{task.description}</h3>
                                            {task.customerName && (
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="material-symbols-outlined text-sm text-slate-400">person</span>
                                                    <span className="text-sm font-bold text-slate-600">{task.customerName}</span>
                                                </div>
                                            )}

                                            {task.dispatchNotes && (
                                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Dispatch Record</p>
                                                    <p className="text-sm font-medium text-slate-700 italic">"{task.dispatchNotes}"</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Delivered Qty removed */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DispatchTrackingPortal;
