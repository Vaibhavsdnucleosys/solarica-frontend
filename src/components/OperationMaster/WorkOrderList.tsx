import React, { useEffect, useState } from 'react';
import { Download, Plus, Search, FileText, ArrowLeft, Loader2, Eye, RefreshCcw } from 'lucide-react';

interface WorkOrder {
    id: string;
    jobId: string;
    customerName: string;
    date: string;
    status: string;
    createdBy: {
        name: string;
    };
    createdById: string;
    finishedGoodName?: string;
    finishedGoodQty?: number;
}

interface WorkOrderListProps {
    onCreateNew: () => void;
    onBack?: () => void;
}

const WorkOrderList: React.FC<WorkOrderListProps> = ({ onCreateNew, onBack }) => {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [viewingId, setViewingId] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    useEffect(() => {
        fetchWorkOrders();
    }, []);

    const fetchWorkOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/v1/work-order', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setWorkOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch work orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async (id: string, jobId: string) => {
        try {
            setDownloadingId(id);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/v1/work-order/${id}/pdf`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `WorkOrder_${jobId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                alert('Failed to download PDF');
            }
        } catch (error) {
            console.error('Error downloading PDF', error);
            alert('Error downloading PDF');
        } finally {
            setDownloadingId(null);
        }
    };

    const handleViewPDF = async (id: string) => {
        try {
            setViewingId(id);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/v1/work-order/${id}/pdf`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            } else {
                alert('Failed to view PDF');
            }
        } catch (error) {
            console.error('Error viewing PDF', error);
            alert('Error viewing PDF');
        } finally {
            setViewingId(null);
        }
    };

    const filteredOrders = workOrders.filter(order =>
        order.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col w-full font-display bg-background-light p-8 h-full overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between py-5 bg-white border-b border-slate-100 shrink-0 rounded-2xl mb-8 px-8">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-500" />
                        </button>
                    )}
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Work Orders</h1>
                        <p className="text-xs text-slate-400 font-medium">Manage and track job work out challans</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchWorkOrders}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 rounded-xl transition-all active:scale-95"
                    >
                        <RefreshCcw size={16} />
                    </button>
                    <button
                        onClick={onCreateNew}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all font-bold"
                    >
                        <Plus size={18} />
                        <span>Create New</span>
                    </button>
                </div>
            </header>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative group flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-all duration-300" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Job ID or Customer..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500/30 transition-all placeholder:text-slate-400 font-medium shadow-sm"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col flex-1">
                <div className="flex-1 overflow-auto no-scrollbar">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center justify-center gap-4">
                            <div className="size-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                            <span className="text-sm font-bold text-slate-400">Loading Work Orders...</span>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-24 text-center flex flex-col items-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <FileText size={48} className="text-slate-200" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">No Work Orders Found</h3>
                            <p className="text-slate-400 max-w-xs font-medium leading-relaxed">
                                Create your first work order to get started.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="py-3.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center w-24">Date</th>
                                    <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Job ID</th>
                                    <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer</th>
                                    <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Finished Good</th>
                                    <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                                    <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Created By</th>
                                    <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-3.5 px-6 text-center">
                                            <span className="text-xs font-bold text-slate-800">
                                                {new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                                                {order.jobId}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <span className="text-xs font-bold text-slate-600 truncate max-w-[200px] block">
                                                {order.customerName || '-'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">{order.finishedGoodName || '-'}</span>
                                                <span className="text-[10px] font-bold text-slate-400">Qty: {order.finishedGoodQty || 0}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-3 text-center">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm ${order.status === 'CREATED'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-slate-50 text-slate-500 border-slate-100'
                                                    }`}>
                                                    <span className="text-[9px] font-black uppercase tracking-widest">
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-3 text-center">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {order.createdBy?.name || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-3 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleViewPDF(order.id)}
                                                    disabled={viewingId === order.id}
                                                    className="px-4 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-all shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {viewingId === order.id ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Eye size={14} />
                                                    )}
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadPDF(order.id, order.jobId)}
                                                    disabled={downloadingId === order.id}
                                                    className="p-2 rounded-xl bg-white border border-slate-100 text-blue-600 hover:bg-blue-50 shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                                    title="Download PDF"
                                                >
                                                    {downloadingId === order.id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Download size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="py-4 px-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between shrink-0">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">
                        Total Orders: <span className="text-violet-600 ml-1">{filteredOrders.length}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WorkOrderList;
