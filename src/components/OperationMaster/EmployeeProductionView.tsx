import React, { useEffect, useState } from 'react';
import { getProductionTasks, updateProductionTask, deleteProductionTask, ProductionTask } from '../../services/api';

interface EmployeeProductionViewProps {
    workerId: string;
    refreshTrigger?: number;
}

const EmployeeProductionView: React.FC<EmployeeProductionViewProps> = ({ workerId, refreshTrigger = 0 }) => {
    const [allTasks, setAllTasks] = useState<ProductionTask[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editQty, setEditQty] = useState<number>(0);
    const [editAssigneeId, setEditAssigneeId] = useState<string>('');
    const [editPriority, setEditPriority] = useState<ProductionTask['priority']>('Low');
    const [editDeadline, setEditDeadline] = useState<string>('');
    const [editBreakdown, setEditBreakdown] = useState<{ [key: string]: number }>({});
    const [selectedWorker, setSelectedWorker] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
    const [focusedAssigneeId, setFocusedAssigneeId] = useState<string | null>(null);

    useEffect(() => {
        loadTasks();
    }, [workerId, refreshTrigger]);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const tasks = await getProductionTasks();
            setAllTasks(tasks);
        } catch (error) {
            console.error("Failed to load tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await deleteProductionTask(id);
            loadTasks();
        } catch (error) {
            console.error(error);
            alert("Failed to delete task");
        }
    };

    // Filter logic
    const workers = Array.from(new Set(allTasks.map(t => t.assigneeName).filter(Boolean)));
    const uniqueWorkers = Array.from(new Map(allTasks.filter(t => t.assigneeId && t.assigneeName).map(t => [t.assigneeId!, t.assigneeName!])).entries()).map(([id, name]) => ({ id, name }));

    const filteredTasks = allTasks.filter(t => {
        const isLive = t.status !== 'Dispatched'; // Show everything not dispatched
        const matchesWorker = selectedWorker === 'ALL' || t.assigneeName === selectedWorker;
        const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
        return isLive && matchesWorker && matchesSearch;
    });

    const handleStatusMove = async (task: ProductionTask, nextStatus: string) => {
        try {
            await updateProductionTask(task.id, {
                status: nextStatus,
                completedQuantity: nextStatus === 'Production Done' ? task.targetQuantity : task.completedQuantity
            });
            loadTasks();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'Pending': return 0;
            case 'In Progress': return 1;
            case 'Production Done': return 2;
            case 'Dispatched': return 3;
            default: return 0;
        }
    };

    // Inline Edit Handlers
    const startEditing = (task: ProductionTask, assigneeId?: string) => {
        setEditingTaskId(task.id);
        setEditQty(task.completedQuantity);
        setEditAssigneeId(task.assigneeId || '');
        setEditPriority(task.priority || 'Low');
        setEditDeadline(task.deadline || '');

        if (assigneeId) {
            setFocusedAssigneeId(assigneeId);
        } else {
            setFocusedAssigneeId(null);
        }

        setExpandedTasks(prev => {
            const newSet = new Set(prev);
            newSet.add(task.id);
            return newSet;
        });

        const breakdownState: { [key: string]: number } = {};
        if (task.assignees) {
            task.assignees.forEach(a => {
                const progress = task.assigneeProgress?.find(p => p.assigneeId === a.id);
                breakdownState[a.id] = progress ? progress.completedQuantity : 0;
            });
        }
        setEditBreakdown(breakdownState);
    };

    const handleQuantitySave = async (task: ProductionTask, quantity: number) => {
        try {
            const breakdownArray = task.assignees?.map(a => ({
                assigneeId: a.id,
                completedQuantity: editBreakdown[a.id] || 0
            }));

            const selectedAssignee = uniqueWorkers.find(w => w.id === editAssigneeId);
            const newAssigneeName = selectedAssignee ? selectedAssignee.name : task.assigneeName;

            await updateProductionTask(task.id, {
                completedQuantity: quantity,
                assigneeId: editAssigneeId,
                assigneeName: newAssigneeName,
                priority: editPriority,
                deadline: editDeadline,
                assigneeProgress: breakdownArray
            });

            setEditingTaskId(null);
            loadTasks();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            {/* Enhanced Header */}
            <div className="flex flex-col gap-6 mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Active Production Flow</h3>
                        <p className="text-slate-500 font-medium">Track completion cycles and manage assignments in real-time.</p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex-1 relative w-full">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Search by task or customer..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 placeholder:font-medium shadow-sm"
                        />
                    </div>

                    <div className="relative w-full md:w-64">
                        <select
                            value={selectedWorker}
                            onChange={e => setSelectedWorker(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-700 font-bold rounded-xl pl-5 pr-12 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 appearance-none cursor-pointer shadow-sm transition-all hover:border-blue-300"
                        >
                            <option value="ALL">All Managers</option>
                            {workers.map(w => (
                                <option key={w} value={w}>{w}</option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                </div>
            </div>

            {/* Redesigned Task List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="py-20 text-center text-slate-400 text-xl font-bold animate-pulse">Synchronizing production data...</div>
                ) : filteredTasks.length === 0 ? (
                    <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">inventory_2</span>
                        <p className="text-slate-400 text-xl font-bold">No active tasks match your filters</p>
                    </div>
                ) : (
                    filteredTasks.map(t => {
                        const isEditing = t.id === editingTaskId;
                        const percentage = Math.round((t.completedQuantity / t.targetQuantity) * 100);
                        const progress = Math.min(percentage, 100);
                        const currentStep = getStatusStep(t.status);

                        // Urgency check
                        const isOverdue = t.deadline && new Date(t.deadline) < new Date();
                        const isUrgent = t.priority === 'High' || isOverdue;

                        return (
                            <div key={t.id} className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 ${isUrgent ? 'border-red-100' : 'border-slate-100'} ${isOverdue ? 'ring-2 ring-red-500/20' : ''}`}>
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col xl:flex-row gap-8">
                                        {/* 1. Main Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h4 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{t.description}</h4>
                                                    <div className="flex flex-wrap items-center gap-4">
                                                        {t.customerName && (
                                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider">
                                                                <span className="material-symbols-outlined text-sm">person</span>
                                                                {t.customerName}
                                                            </span>
                                                        )}
                                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${t.priority === 'High' ? 'bg-red-50 text-red-700' : t.priority === 'Low' ? 'bg-slate-50 text-slate-600' : 'bg-amber-50 text-amber-700'}`}>
                                                            <span className={`w-2 h-2 rounded-full ${t.priority === 'High' ? 'bg-red-500 animate-pulse' : t.priority === 'Low' ? 'bg-slate-400' : 'bg-amber-500'}`}></span>
                                                            {t.priority}
                                                        </span>
                                                        <span className={`flex items-center gap-1.5 text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-slate-400'}`}>
                                                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                            {t.deadline && !isNaN(new Date(t.deadline).getTime()) ? new Date(t.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline'}
                                                            {isOverdue && <span className="ml-1 font-black underline italic">OVERDUE</span>}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Desktop Manager Actions */}
                                                <div className="hidden md:flex items-center gap-2">
                                                    {/* Settings button removed */}
                                                    <button onClick={() => handleDeleteTask(t.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all" title="Delete">
                                                        <span className="material-symbols-outlined text-2xl">delete</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* 2. Visual Stepper */}
                                            <div className="mt-8 mb-6">
                                                <div className="flex items-center justify-between px-2 mb-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= 0 ? 'text-blue-600' : 'text-slate-300'}`}>Assignment</span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= 1 ? 'text-blue-600' : 'text-slate-300'}`}>Production</span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= 2 ? 'text-emerald-500' : 'text-slate-300'}`}>Ready for Dispatch</span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= 3 ? 'text-indigo-600' : 'text-slate-300'}`}>Dispatched</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
                                                    <div className={`h-full transition-all duration-1000 ${currentStep >= 0 ? 'bg-blue-600' : ''}`} style={{ width: '33.33%' }}></div>
                                                    <div className={`h-full transition-all duration-1000 ${currentStep >= 1 ? 'bg-blue-500' : ''}`} style={{ width: '33.33%' }}></div>
                                                    <div className={`h-full transition-all duration-1000 ${currentStep >= 2 ? 'bg-emerald-500' : ''}`} style={{ width: '33.34%' }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. Stats & Quick Actions */}
                                        <div className="xl:w-80 flex flex-col justify-center gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-50">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Progress</span>
                                                    <span className="text-3xl font-black text-slate-900">{percentage}%</span>
                                                </div>
                                                <div className="text-right">
                                                    {/* Units Completed removed */}
                                                </div>
                                            </div>

                                            {/* Quick Status Buttons */}
                                            <div className="flex gap-2">
                                                {t.status === 'Pending' && (
                                                    <button onClick={() => handleStatusMove(t, 'In Progress')} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">Start Production</button>
                                                )}
                                                {t.status === 'In Progress' && (
                                                    <button onClick={() => handleStatusMove(t, 'Production Done')} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20">Mark Completed</button>
                                                )}
                                                {t.status === 'Production Done' && (
                                                    <button onClick={() => handleStatusMove(t, 'Dispatched')} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">Dispatch Project</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inline Edit Panel */}
                                    {isEditing && (
                                        <div className="mt-8 pt-8 border-t-2 border-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
                                            <div className="md:col-span-2">
                                                <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Update Completion Breakdown</h5>
                                                <div className="space-y-4">
                                                    {t.assignees?.map(a => (
                                                        <div key={a.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-white border-2 border-transparent hover:border-blue-100 transition-all">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black">{a.name.charAt(0)}</div>
                                                                <span className="font-bold text-slate-700">{a.name}</span>
                                                            </div>
                                                            <input
                                                                type="number"
                                                                value={editBreakdown[a.id] || 0}
                                                                onChange={(e) => {
                                                                    const val = parseInt(e.target.value) || 0;
                                                                    const newBreakdown = { ...editBreakdown, [a.id]: val };
                                                                    setEditBreakdown(newBreakdown);
                                                                    setEditQty(Object.values(newBreakdown).reduce((s, v) => s + v, 0));
                                                                }}
                                                                className="w-20 bg-white border border-slate-200 rounded-lg px-3 py-2 text-center font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                                    <span className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 text-center">Finalized Total</span>
                                                    <div className="text-4xl font-black text-blue-800 text-center">{editQty}</div>
                                                </div>
                                                <button onClick={() => handleQuantitySave(t, editQty)} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-xl shadow-blue-500/20 transition-all">Save Changes</button>
                                                <button onClick={() => setEditingTaskId(null)} className="w-full py-3 bg-white hover:bg-slate-50 text-slate-400 border border-slate-200 rounded-xl font-bold transition-all">Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                <p className="text-sm font-bold text-slate-400">Visualized data is synced with real-time operations.</p>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 opacity-50">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Production
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 opacity-50">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ready
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EmployeeProductionView;
