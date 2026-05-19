import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { getInvoices, deleteInvoice, getInvoiceDownloadUrl, Invoice, getDeliveryPreviewUrl, getInvoicePreviewUrl, updateInvoice, convertToProforma } from '../../services/invoiceService';
import toast from 'react-hot-toast';
import {
    FileText,
    MoreHorizontal,
    Download,
    Trash2,
    Search,
    IndianRupee,
    ExternalLink,
    Calendar,
    Building2,
    RefreshCcw,
    Eye,
    Loader2,
    Truck,
    Layers,
    Plus,
    X,
    Save
} from 'lucide-react';
import EditSalesModal from '../TallyIntegration/TallyGroupUI/EditSalesModal';

interface QuotationInvoiceListProps {
    invoices: Invoice[];
    onRefresh: () => void;
    isDeliveryView?: boolean;
    loading?: boolean;
}

const QuotationInvoiceList: React.FC<QuotationInvoiceListProps> = ({ invoices, onRefresh, isDeliveryView, loading }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [viewingId, setViewingId] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [pendingInvoice, setPendingInvoice] = useState<Invoice | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
    const [activeRemarkInvoice, setActiveRemarkInvoice] = useState<Invoice | null>(null);
    const [remarkText, setRemarkText] = useState('');
    const [isSavingRemark, setIsSavingRemark] = useState(false);
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
    const [convertingId, setConvertingId] = useState<string | null>(null);
const [isProformaModalOpen, setIsProformaModalOpen] = useState(false);
const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
const [isAdvanceEnabled, setIsAdvanceEnabled] = useState(false);
const [advanceAmount, setAdvanceAmount] = useState('');
const [editingItem, setEditingItem] = useState<any>(null);

const [showEditModal, setShowEditModal] =
    useState(false);
    const getStatusTheme = (status: string) => {
        const s = (status || '').toUpperCase();
        switch (s) {
            case 'ACCEPTED':
                return {
                    bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                    dot: 'bg-emerald-500'
                };
            case 'REJECTED':
                return {
                    bg: 'bg-rose-50 text-rose-600 border-rose-100',
                    dot: 'bg-rose-500'
                };
            case 'SENT':
                return {
                    bg: 'bg-blue-50 text-blue-600 border-blue-100',
                    dot: 'bg-blue-500'
                };
            case 'FOLLOWUP':
                return {
                    bg: 'bg-amber-50 text-amber-600 border-amber-100',
                    dot: 'bg-amber-500'
                };
            default:
                return {
                    bg: 'bg-slate-50 text-slate-500 border-slate-100',
                    dot: 'bg-slate-400'
                };
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        let rejectionReason = '';
        if (newStatus === 'REJECTED') {
            const reason = window.prompt('Please enter the reason for rejection:');
            if (reason === null) return; // Cancelled
            rejectionReason = reason || 'No reason provided';
        }

        try {
            setUpdatingId(id);
            await updateInvoice(id, { 
                status: newStatus,
                rejectionReason: newStatus === 'REJECTED' ? rejectionReason : undefined
            });
            onRefresh();
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    // const handleConvertToProforma = async (id: string) => {
    //     if (window.confirm('Are you sure you want to convert this to a Proforma Invoice?')) {
    //         setConvertingId(id);
    //         try {
    //             await convertToProforma(id);
    //             toast.success('Successfully converted to Proforma Invoice');
    //             onRefresh();
    //         } catch (error) {
    //             console.error('Failed to convert', error);
    //             toast.error('Failed to convert to Proforma Invoice');
    //         } finally {
    //             setConvertingId(null);
    //         }
    //     }
    // };


    const handleConvertToProforma = (id: string) => {
    setSelectedInvoiceId(id);
    setIsProformaModalOpen(true);

    // Reset previous values (important)
    setIsAdvanceEnabled(false);
    setAdvanceAmount('');
};
    const openRemarkModal = (invoice: Invoice) => {
        setActiveRemarkInvoice(invoice);
        setRemarkText(invoice.remarks || '');
        setIsRemarkModalOpen(true);
    };

    const handleSaveRemark = async () => {
        if (!activeRemarkInvoice) return;
        setIsSavingRemark(true);
        try {
            await updateInvoice(activeRemarkInvoice.id, { remarks: remarkText });
            onRefresh();
            toast.success('Remark saved successfully');
            setIsRemarkModalOpen(false);
        } catch (error) {
            console.error('Failed to save remark', error);
            toast.error('Failed to save remark');
        } finally {
            setIsSavingRemark(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await deleteInvoice(id);
                onRefresh();
                toast.success('Invoice deleted successfully');
            } catch (error) {
                console.error('Failed to delete invoice', error);
                toast.error('Failed to delete invoice');
            }
        }
    };

    const handleView = async (invoice: Invoice) => {
        setViewingId(invoice.id);
        // Use invoice date from object, default to today if missing (though it should exist)
        const date = invoice.invoiceDate
            ? new Date(invoice.invoiceDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];

        try {
            // [MODIFIED] Use different service based on view type
            const { url } = isDeliveryView
                ? await getDeliveryPreviewUrl(invoice.id, date)
                : await getInvoicePreviewUrl(invoice.id); // New service for standard invoices
            window.open(url, '_blank');
        } catch (error) {
            console.error('Failed to view invoice', error);
            toast.error('Could not view invoice.');
        } finally {
            setViewingId(null);
        }
    };

    const handleDownload = async (invoice: Invoice) => {
        if (isDeliveryView && !isDateModalOpen) {
            setPendingInvoice(invoice);
            setIsDateModalOpen(true);
            return;
        }

        const id = invoice.id;
        const date: string = isDeliveryView
            ? selectedDate
            : (invoice.invoiceDate
                ? new Date(invoice.invoiceDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]);

        setDownloadingId(id);
        try {
            // [MODIFIED] Use different service based on view type
            const { url } = isDeliveryView
                ? await getDeliveryPreviewUrl(invoice.id, date)
                : await getInvoicePreviewUrl(invoice.id); // New service for standard invoices
            window.open(url, '_blank');
        } catch (error) {
            console.error('Failed to download PDF', error);
            toast.error('Could not download PDF.');
        } finally {
            setDownloadingId(null);
            if (isDeliveryView) {
                setIsDateModalOpen(false);
                setPendingInvoice(null);
            }
        }
    };

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = currentUser?.role?.name?.toLowerCase() === "admin";
    const handleConfirmProforma = async () => {
    if (!selectedInvoiceId) return;

    setConvertingId(selectedInvoiceId);

    try {
        await convertToProforma(selectedInvoiceId, {
            advancedEnabled: isAdvanceEnabled,
            additionalAmount: Number(advanceAmount) || 0
        });

        toast.success('Successfully converted to Proforma Invoice');
        onRefresh();
        setIsProformaModalOpen(false);
        setAdvanceAmount('');
        setIsAdvanceEnabled(false);
    } catch (error) {
        console.error(error);
        toast.error('Failed to convert');
    } finally {
        setConvertingId(null);
    }
};

    const handleModeChange = async (id: string, mode: string) => {
        setUpdatingId(id);
        try {
            await updateInvoice(id, { modeOfDispatch: mode });
            toast.success(`Mode updated to ${mode}`);
            onRefresh();
        } catch (error) {
            console.error('Failed to update mode', error);
            toast.error('Failed to update delivery mode');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                {['#', 'Date & Ref', 'Client / Customer', 'Grand Total', 'Status', 'Rmks', 'View', 'Actions'].map(h => (
                                    <th key={h} className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-4 px-6"><div className="h-3 bg-slate-100 rounded-full w-6 mx-auto" /></td>
                                    <td className="py-4 px-3"><div className="h-3 bg-slate-100 rounded-full w-20 mb-1" /><div className="h-2.5 bg-slate-100 rounded-full w-28" /></td>
                                    <td className="py-4 px-3"><div className="h-3 bg-slate-100 rounded-full w-28 mb-1" /><div className="h-2.5 bg-slate-100 rounded-full w-20" /></td>
                                    <td className="py-4 px-3"><div className="h-3 bg-slate-100 rounded-full w-16" /></td>
                                    <td className="py-4 px-3"><div className="h-6 bg-slate-100 rounded-full w-14 mx-auto" /></td>
                                    <td className="py-4 px-3"><div className="h-6 bg-slate-100 rounded-lg w-8 mx-auto" /></td>
                                    <td className="py-4 px-3"><div className="h-6 bg-slate-100 rounded-lg w-12 mx-auto" /></td>
                                    <td className="py-4 px-3"><div className="h-6 bg-slate-100 rounded-lg w-20 mx-auto" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (invoices.length === 0) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-24 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 relative">
                    <FileText size={48} className="text-slate-200 relative z-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">No Estimates Found</h3>
                <p className="text-slate-400 max-w-xs font-medium leading-relaxed">
                    Create your first estimate using the "Solarica Energy India" option in the creation flow.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-fit">
            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="py-3.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center w-16">#</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date & Ref</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client / Customer</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Grand Total</th>
                            {isDeliveryView ? (
                                <>
                                    <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Transport By</th>
                                    <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Ref Number</th>
                                </>
                            ) : (
                                <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            )}
                            {!isDeliveryView && (
                                <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Rmks</th>
                            )}
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">View</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading && invoices.length === 0 && (
                            <tr>
                                <td colSpan={isDeliveryView ? 10 : 8} className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                                    Loading Records...
                                </td>
                            </tr>
                        )}
                        {!loading && invoices.length === 0 && (
                            <tr>
                                <td colSpan={isDeliveryView ? 10 : 8} className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    No records found
                                </td>
                            </tr>
                        )}
                        {invoices.length > 0 && invoices.map((inv, idx) => (
                            <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="py-3.5 px-6 text-xs text-slate-400 font-bold text-center">{idx + 1}</td>
                                <td className="py-3.5 px-3">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-slate-800">
                                            {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            {inv.invoiceNumber}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3.5 px-3">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-black text-slate-800 truncate max-w-[200px]">
                                            {inv.customerName}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">
                                            {inv.customerGstinUin || 'No GSTIN'}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3.5 px-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {inv.currency === 'USD' || inv.category === 'EXPORT' ? '$' : '₹'}
                                        </span>
                                        <span className="text-sm font-black text-slate-900">
                                            {(inv.grandTotalPayable || 0).toLocaleString(
                                                inv.currency === 'USD' || inv.category === 'EXPORT' ? 'en-US' : 'en-IN'
                                            )}
                                        </span>
                                    </div>
                                </td>
                                {isDeliveryView ? (
                                    <>
                                        <td className="py-3.5 px-3">
                                            <div className="flex flex-col gap-1 w-48">
                                                <div className="relative">
                                                    <select
                                                        value={inv.modeOfDispatch || ''}
                                                        onChange={async (e) => {
                                                            const newMode = e.target.value;
                                                            // Reset transport through when mode changes
                                                            try {
                                                                setUpdatingId(inv.id);
                                                                await updateInvoice(inv.id, {
                                                                    modeOfDispatch: newMode,
                                                                    transportThrough: ''
                                                                });
                                                                onRefresh();
                                                                toast.success('Mode updated');
                                                            } catch (err) {
                                                                toast.error('Failed to update mode');
                                                            } finally {
                                                                setUpdatingId(null);
                                                            }
                                                        }}
                                                        disabled={updatingId === inv.id}
                                                        className="w-full pl-2 pr-6 py-1 text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all cursor-pointer"
                                                    >
                                                        <option value="">Select Mode</option>
                                                        <option value="By road">By Road</option>
                                                        <option value="By air">By Air</option>
                                                        <option value="By shipment">By Shipment</option>
                                                        <option value="By rail">By Rail</option>
                                                        <option value="By Cargo">By Cargo</option>
                                                    </select>
                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <Truck size={10} />
                                                    </div>
                                                </div>

                                                {inv.modeOfDispatch && (
                                                    <div className="relative">
                                                        <select
                                                            value={inv.transportThrough || ''}
                                                            onChange={async (e) => {
                                                                try {
                                                                    setUpdatingId(inv.id);
                                                                    await updateInvoice(inv.id, { transportThrough: e.target.value });
                                                                    onRefresh();
                                                                    toast.success('Transport updated');
                                                                } catch (err) {
                                                                    toast.error('Failed to update transport');
                                                                } finally {
                                                                    setUpdatingId(null);
                                                                }
                                                            }}
                                                            disabled={updatingId === inv.id}
                                                            className="w-full pl-2 pr-6 py-1 text-[9px] font-bold text-slate-500 bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all cursor-pointer uppercase tracking-wider"
                                                        >
                                                            <option value="">Select Transport</option>
                                                            {(() => {
                                                                const mode = (inv.modeOfDispatch || '').toLowerCase();
                                                                let options: string[] = [];
                                                                if (mode === 'by road') options = ['By Courier', 'By Bus', 'By Local Transport', 'By Personal Vehicle', 'By Tempo / Truck'];
                                                                else if (mode === 'by air') options = ['By Air Courier', 'By Commercial Flight Cargo', 'By Air Express Service'];
                                                                else if (mode === 'by shipment') options = ['By Container Ship', 'By Bulk Carrier', 'By Port-to-Port Shipment', 'By Door-to-Door Sea Cargo'];
                                                                else if (mode === 'by rail') options = ['By Goods Train', 'By Parcel Van', 'By Full Rake', 'By Container Rail'];
                                                                else if (mode === 'by cargo') options = ['By Logistics Company', 'By Third-Party Transporter', 'By Warehouse Transfer', 'By Express Cargo Service'];
                                                                return options.map(opt => <option key={opt} value={opt}>{opt}</option>);
                                                            })()}
                                                        </select>
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                                            <Layers size={10} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <div className="relative w-32">
                                                <input
                                                    type="text"
                                                    defaultValue={inv.trackingNumber || ''}
                                                    onBlur={async (e) => {
                                                        const newVal = e.target.value;
                                                        if (newVal !== inv.trackingNumber) {
                                                            try {
                                                                setUpdatingId(inv.id);
                                                                await updateInvoice(inv.id, { trackingNumber: newVal });
                                                                onRefresh();
                                                                toast.success('Ref updated');
                                                            } catch (err) {
                                                                toast.error('Failed to update ref');
                                                            } finally {
                                                                setUpdatingId(null);
                                                            }
                                                        }
                                                    }}
                                                    disabled={updatingId === inv.id}
                                                    placeholder="Ref No."
                                                    className="w-full px-2 py-1.5 text-[10px] font-mono font-bold text-slate-600 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-slate-300"
                                                />
                                                {updatingId === inv.id && (
                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500">
                                                        <Loader2 size={10} className="animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <td className="py-3.5 px-3">
                                        <div className="flex justify-center">
                                            <div className="relative group/status">
                                                {(() => {
                                                    const theme = getStatusTheme(inv.status || 'SENT');
                                                    return (
                                                        <button
                                                            disabled={updatingId === inv.id}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${theme.bg} shadow-sm transition-all hover:scale-105 active:scale-95 group/btn relative`}
                                                        >
                                                            {updatingId === inv.id ? (
                                                                <Loader2 size={10} className="animate-spin" />
                                                            ) : (
                                                                <div className={`size-1.5 rounded-full ${theme.dot} animate-pulse`} />
                                                            )}
                                                            <span className="text-[9px] font-black uppercase tracking-widest">
                                                                {inv.status || 'SENT'}
                                                            </span>

                                                            {/* Dropdown Menu */}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all">
                                                                {['SENT', 'ACCEPTED', 'REJECTED'].map(s => (
                                                                    <button
                                                                        key={s}
                                                                        onClick={() => handleStatusUpdate(inv.id, s)}
                                                                        className={`w-full text-left px-4 py-2 text-[9px] font-black hover:bg-slate-50 transition-colors ${inv.status === s ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}
                                                                    >
                                                                        {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </button>
                                                    );
                                                })()}

                                                {inv.status === 'REJECTED' && inv.rejectionReason && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover/status:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10 backdrop-blur-md">
                                                        <div className="font-bold text-rose-400 mb-1 text-center">Rejection Reason:</div>
                                                        <div className="font-medium text-slate-200 text-center">{inv.rejectionReason}</div>
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                )}
                                {/* Remarks Column */}
                                {!isDeliveryView && (
                                    <td className="py-3.5 px-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openRemarkModal(inv)}
                                                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                title="Add Remark"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            {inv.remarks && (
                                                <button
                                                    onClick={() => openRemarkModal(inv)}
                                                    className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
                                                    title="View Remark"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                                <td className="py-3.5 px-3 text-center">
                                    <button
                                        onClick={() => handleView(inv)}
                                        disabled={viewingId === inv.id}
                                        className="px-4 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        View
                                    </button>
                                </td>
                                <td className="py-3.5 px-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleDownload(inv)}
                                            disabled={downloadingId === inv.id}
                                            className="p-2 rounded-xl bg-white border border-slate-100 text-blue-600 hover:bg-blue-50 shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                            title="Download PDF"
                                        >
                                            <Download size={16} />
                                        </button>
  
{isAdmin && (
    <button
        onClick={() => {
            setEditingItem(inv);
            setShowEditModal(true);
        }}

        className="p-2 rounded-xl bg-white border border-slate-100 text-amber-600 hover:bg-amber-50 shadow-sm transition-all"

        title="Edit"
    >
        <FileText size={16} />
    </button>
)}
                                        <button
                                            onClick={() => handleDelete(inv.id)}
                                            className="p-2 rounded-xl bg-white border border-slate-100 text-rose-500 hover:bg-rose-50 shadow-sm transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        {/* Dropdown for extra actions */}
                                        {!isDeliveryView && (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveDropdownId(activeDropdownId === inv.id ? null : inv.id)}
                                                    className={`p-2 rounded-xl border transition-all ${activeDropdownId === inv.id ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'} shadow-sm`}
                                                    title="More Actions"
                                                >
                                                    <MoreHorizontal size={16} />
                                                </button>
                                                {activeDropdownId === inv.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-[100] py-1 overflow-hidden">
                                                        <button
                                                            onClick={() => {
                                                                handleConvertToProforma(inv.id);
                                                                setActiveDropdownId(null);
                                                            }}
                                                            disabled={convertingId === inv.id || inv.isProforma}
                                                            className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            {convertingId === inv.id ? (
                                                                <><Loader2 size={12} className="animate-spin" /> Converting...</>
                                                            ) : inv.isProforma ? (
                                                                'Already Proforma'
                                                            ) : (
                                                                'Convert to Proforma'
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
            <div className="py-4 px-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">
                    Total Estimates: <span className="text-blue-600 ml-1">{invoices.length}</span>
                </p>
            </div>

            {/* Global Loading Popup */}
            {(viewingId || downloadingId) && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative z-10 animate-in zoom-in-95 duration-300 text-center text-slate-800">
                        <div className="size-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="size-10 text-blue-600 animate-spin" />
                        </div>
                        <h3 className="text-xl font-bold">Processing Request</h3>
                        <p className="text-slate-500 font-medium text-sm mt-2">Please wait while we sync with the server...</p>
                    </div>
                </div>,
                document.body
            )}

            {/* Date Selection Modal */}
            {isDateModalOpen && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsDateModalOpen(false)} />
                    <div className="bg-white rounded-[2.5rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] w-full max-w-md p-8 relative z-50 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Select Invoice Date</h3>
                            <button onClick={() => setIsDateModalOpen(false)} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400"><X size={20} /></button>
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all mb-6"
                        />
                        <button
                            onClick={() => pendingInvoice && handleDownload(pendingInvoice)}
                            disabled={downloadingId !== null}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            {downloadingId !== null ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            {downloadingId !== null ? 'Generating...' : 'Confirm & Download'}
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {/* Remark Modal */}
            {isRemarkModalOpen && activeRemarkInvoice && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsRemarkModalOpen(false)} />
                    <div className="bg-white rounded-[2.5rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] w-full max-w-md p-8 relative z-50 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Special Remarks</h3>
                            <button onClick={() => setIsRemarkModalOpen(false)} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400"><X size={20} /></button>
                        </div>
                        <textarea
                            value={remarkText}
                            onChange={(e) => setRemarkText(e.target.value)}
                            placeholder="Type internal remarks here..."
                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all mb-6 h-32 resize-none"
                        />
                        <button
                            onClick={handleSaveRemark}
                            disabled={isSavingRemark}
                            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isSavingRemark ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            SAVE REMARKS
                        </button>
                    </div>
                </div>,
                document.body
            )}

      {/* Confirm Proforma Modal */}
            {isProformaModalOpen && ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setIsProformaModalOpen(false)}
        />

        <div className="bg-white rounded-3xl w-full max-w-md p-8 z-50 shadow-2xl">
            <h3 className="text-xl font-black mb-6 text-slate-800">
                Convert to Proforma
            </h3>

            {/* Checkbox */}
            <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-slate-700">
                    Enable Advance Amount
                </label>
                <input
                    type="checkbox"
                    checked={isAdvanceEnabled}
                    onChange={(e) => setIsAdvanceEnabled(e.target.checked)}
                    className="w-5 h-5"
                />
            </div>

            {/* Amount Field */}
            {isAdvanceEnabled && (
                <input
                    type="number"
                    placeholder="Enter amount"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}

            {/* Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={() => setIsProformaModalOpen(false)}
                    className="w-full py-3 rounded-xl border border-slate-200 font-bold"
                >
                    Cancel
                </button>

                {/* <button
                    onClick={handleConfirmProforma}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold"
                >
                    Confirm
                </button> */}

                {convertingId === selectedInvoiceId ? (
    <p className="w-full py-3 text-center font-bold text-blue-600">
        Processing...
    </p>
) : (
    <button
        onClick={handleConfirmProforma}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold"
    >
        Confirm
    </button>
)}
            </div>
        </div>
    </div>,
    document.body
)}
{showEditModal && editingItem && (
    <EditSalesModal
        item={editingItem}
        onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
        }}
        onSave={() => {
            setShowEditModal(false);
            setEditingItem(null);
            onRefresh();
        }}
    />
)}

        </div >
    );
};

export default QuotationInvoiceList;
