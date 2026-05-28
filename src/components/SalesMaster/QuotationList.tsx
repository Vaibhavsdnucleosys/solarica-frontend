import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { API_URL, getAxiosConfig } from '../../config';
import { updateQuotationStatus, sendQuotationEmail, deleteQuotation, getPDFDownloadUrl, uploadPaymentProof, deletePaymentProof, createProductionFromQuotation, updateQuotation } from '../../services/quotationService';
import EditSalesModal from '../TallyIntegration/TallyGroupUI/EditSalesModal';
import {
    Mail,
    FileText,
    MoreHorizontal,
    Calendar,
    Building2,
    Trash2,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    RefreshCcw,
    ChevronRight,
    ChevronLeft,
    Search,
    IndianRupee,
    ArrowUpRight,
    ExternalLink,
    Eye,
    Wrench,
    Users,
    Upload,
    Camera,
    Image as ImageIcon,
    Plus,
    X,
    Loader2
} from 'lucide-react';
import { convertToProforma } from '../../services/quotationService';
interface Quotation {
    id: string;
    isProforma?: boolean;
    companyName: string;
    companyEmail: string;
    fromCompanyName?: string;
    serviceType?: string;
    systemCapacityKw?: number;
    budget?: number;
    systemCost?: number;
    totalAmount?: number;
    netPayableAmount?: number;
    status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'FOLLOWUP' | 'pending' | 'accepted' | 'rejected' | 'followup';
    createdAt: string;
    pdfFilePath?: string;
    remarks?: string;
    leadStatus?: string;
    leadId?: string;
    rejectionReason?: string;
    createdBy: {
        email: string;
        name?: string;
        worker?: {
            name: string;
        };
    };
    paymentProofs?: Array<{
        id: string;
        type: 'ADVANCE' | 'FULL' | 'WORK';
        imageUrl: string;
        uploadedAt: string;
        uploadedBy: {
            id: string;
            name: string;
        };
    }>;
}

interface QuotationListProps {
    quotations: Quotation[];
    onRefresh: () => void;
    onView?: (id: string) => void;
    loading?: boolean;
}

const QuotationList: React.FC<QuotationListProps> = ({ quotations, onRefresh, onView, loading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const [showProductionModal, setShowProductionModal] = useState(false);
    const [selectedQuotationForProduction, setSelectedQuotationForProduction] = useState<Quotation | null>(null);

    // Remarks Modal State
    const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
    const [activeRemarkInvoice, setActiveRemarkInvoice] = useState<Quotation | null>(null); // Reusing name logic or renaming to Quotation
    const [remarkText, setRemarkText] = useState('');
    const [isSavingRemark, setIsSavingRemark] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
const [convertingId, setConvertingId] = useState<string | null>(null);

const [isProformaModalOpen, setIsProformaModalOpen] = useState(false);
const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);

const [isAdvanceEnabled, setIsAdvanceEnabled] = useState(false);
const [advanceAmount, setAdvanceAmount] = useState('');

const [showEditModal, setShowEditModal] =
    useState(false);

    // Status Update Handler (Hot/Warm/Cold)
//     const updateLeadStatus = async (
//     leadId: string,
//     status: string
// ) => {
//         try {
//             await updateQuotation(leadId, { leadStatus: status });
//             onRefresh();
//             // toast.success('Status updated'); // Assuming we want silent update or need to add toast
//         } catch (error) {
//             console.error('Failed to update lead status', error);
//             alert('Failed to update lead status');
//         }
//     };

const updateLeadStatus = async (
    leadId: string | undefined,
    status: string
) => {

    if (!leadId) {
        alert("Lead ID not found");
        return;
    }

    try {

        await axios.put(
            `${API_URL}/leads/${leadId}`,
            {
                status: status
            },
            getAxiosConfig()
        );

        onRefresh();

    } catch (error) {

        console.error(
            'Failed to update lead status',
            error
        );

        alert('Failed to update lead status');
    }
};

    const openRemarkModal = (quotation: Quotation) => {
        setActiveRemarkInvoice(quotation);
        setRemarkText(quotation.remarks || '');
        setIsRemarkModalOpen(true);
    };

    const handleSaveRemark = async () => {
        if (!activeRemarkInvoice) return;
        setIsSavingRemark(true);
        try {
            await updateQuotation(activeRemarkInvoice.id, { remarks: remarkText });
            onRefresh();
            setIsRemarkModalOpen(false);
        } catch (error) {
            console.error('Failed to save remark', error);
            alert('Failed to save remark');
        } finally {
            setIsSavingRemark(false);
        }
    };


    const handleStatusChange = async (id: string, status: string) => {
        if (window.confirm(`Are you sure you want to mark this as ${status}?`)) {
            try {
                await updateQuotationStatus(id, status);
                onRefresh();
            } catch (error) {
                console.error('Failed to update status', error);
            }
        }
    };

    const handleSendEmail = async (id: string) => {
        if (window.confirm('Send quotation email to client?')) {
            try {
                await sendQuotationEmail(id);
                alert('Email sent successfully');
                onRefresh();
            } catch (error) {
                console.error('Failed to send email', error);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this quotation?')) {
            try {
                await deleteQuotation(id);
                onRefresh();
            } catch (error) {
                console.error('Failed to delete quotation', error);
            }
        }
    };

    const handleConvertToProforma = (id: string) => {
    setSelectedQuotationId(id);
    setIsProformaModalOpen(true);

    setIsAdvanceEnabled(false);
    setAdvanceAmount('');
};

const handleConfirmProforma = async () => {
    if (!selectedQuotationId) return;

    setConvertingId(selectedQuotationId);

    try {
        await convertToProforma(selectedQuotationId, {
            advancedEnabled: isAdvanceEnabled,
            additionalAmount: Number(advanceAmount) || 0
        });

        alert('Successfully converted to Proforma Invoice');

        onRefresh();

        setIsProformaModalOpen(false);
        setAdvanceAmount('');
        setIsAdvanceEnabled(false);
    } catch (error) {
        console.error(error);
        alert('Failed to convert');
    } finally {
        setConvertingId(null);
    }
};

    const handleDownload = async (id: string) => {
        try {
            const url = await getPDFDownloadUrl(id);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Failed to download PDF', error);
            alert('Could not download PDF. It may not exist.');
        }
    };

    const handleFileUpload = async (quotationId: string, file: File, type: 'ADVANCE' | 'FULL' | 'WORK') => {
        try {
            await uploadPaymentProof(quotationId, file, type);
            alert(`${type} payment proof uploaded successfully`);
            onRefresh();
        } catch (error: any) {
            console.error(`Failed to upload ${type} proof`, error);
            alert(error.response?.data?.error || `Failed to upload ${type} proof`);
        }
    };

    const handleDeleteProof = async (proofId: string) => {
        if (window.confirm('Are you sure you want to delete this payment proof?')) {
            try {
                await deletePaymentProof(proofId);
                onRefresh();
            } catch (error) {
                console.error('Failed to delete payment proof', error);
                alert('Failed to delete payment proof');
            }
        }
    };

    const handleCreateProductionOrder = async (quotation: Quotation) => {
        setSelectedQuotationForProduction(quotation);
        setShowProductionModal(true);
    };

    

    const confirmCreateProduction = async () => {
        if (!selectedQuotationForProduction) return;

        try {
            const productionData = {
                description: `Production for ${selectedQuotationForProduction.companyName}`,
                targetQuantity: selectedQuotationForProduction.systemCapacityKw || 10,
                priority: 'High' as const,
                quotationId: selectedQuotationForProduction.id,
                customerName: selectedQuotationForProduction.companyName,
                customerEmail: selectedQuotationForProduction.companyEmail,
                orderDetails: `${selectedQuotationForProduction.serviceType || 'Solar Installation'} - ${selectedQuotationForProduction.systemCapacityKw || 0}kW`,
                systemCapacity: selectedQuotationForProduction.systemCapacityKw,
            };

            await createProductionFromQuotation(selectedQuotationForProduction.id, productionData);
            alert('Production order created successfully! Check Operations Portal.');
            setShowProductionModal(false);
            setSelectedQuotationForProduction(null);
            onRefresh();
        } catch (error: any) {
            console.error('Failed to create production order', error);
            alert(error.response?.data?.error || 'Failed to create production order');
        }
    };

    const getStatusTheme = (status: string) => {
        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case 'accepted': return {
                base: 'emerald',
                icon: null,
                bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                dot: 'bg-emerald-500'
            };
            case 'rejected': return {
                base: 'rose',
                icon: null,
                bg: 'bg-rose-50 text-rose-600 border-rose-100',
                dot: 'bg-rose-500'
            };
            case 'followup': return {
                base: 'amber',
                icon: null,
                bg: 'bg-amber-50 text-amber-600 border-amber-100',
                dot: 'bg-amber-500'
            };
            case 'sent': return {
                base: 'blue',
                icon: null,
                bg: 'bg-blue-50 text-blue-600 border-blue-100',
                dot: 'bg-blue-500'
            };
            default: return {
                base: 'slate',
                icon: null,
                bg: 'bg-slate-50 text-slate-600 border-slate-100',
                dot: 'bg-slate-400'
            };
        }
    };


    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = currentUser?.role?.name?.toLowerCase() === "admin";

    if (loading) {
        return (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                {['Date & Ref', 'Issuing Company', 'Client / Customer', 'Net Payable', 'Created By', 'Payment', 'Proof of Work', 'Status', 'Lead Status', 'Rmks', 'View'].map(h => (
                                    <th key={h} className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-4 px-3"><div className="h-3 bg-slate-100 rounded-full w-20 mb-1" /><div className="h-2.5 bg-slate-100 rounded-full w-14" /></td>
                                    <td className="py-4 px-3"><div className="h-3 bg-slate-100 rounded-full w-32" /></td>
                                    <td className="py-4 px-3"><div className="h-3 bg-slate-100 rounded-full w-28 mb-1" /><div className="h-2.5 bg-slate-100 rounded-full w-36" /></td>
                                    <td className="py-4 px-3"><div className="h-3 bg-slate-100 rounded-full w-16" /></td>
                                    <td className="py-4 px-3"><div className="h-3 bg-slate-100 rounded-full w-16 mb-1" /><div className="h-2.5 bg-slate-100 rounded-full w-24" /></td>
                                    <td className="py-4 px-3"><div className="h-7 bg-slate-100 rounded-xl w-24 mx-auto" /></td>
                                    <td className="py-4 px-3"><div className="h-7 bg-slate-100 rounded-xl w-16 mx-auto" /></td>
                                    <td className="py-4 px-3"><div className="h-6 bg-slate-100 rounded-full w-16 mx-auto" /></td>
                                    <td className="py-4 px-3"><div className="h-6 bg-slate-100 rounded-lg w-20 mx-auto" /></td>
                                    <td className="py-4 px-3"><div className="h-6 bg-slate-100 rounded-lg w-8 mx-auto" /></td>
                                    <td className="py-4 px-3"><div className="h-6 bg-slate-100 rounded-lg w-14 mx-auto" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (quotations.length === 0) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-24 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping scale-75 opacity-75"></div>
                    <FileText size={48} className="text-slate-200 relative z-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">No Quotations Found</h3>
                <p className="text-slate-400 max-w-xs font-medium leading-relaxed">
                    Ready to close another deal? Start by creating a stunning new quotation.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-fit relative group/table">
            <button
                onClick={() => scroll('left')}
                className="absolute left-4 top-[20%] z-10 p-2 bg-blue-600 text-white rounded-full shadow-lg border border-blue-500 opacity-0 group-hover/table:opacity-100 transition-all hover:bg-blue-700 hover:scale-110 active:scale-95 shadow-blue-500/20"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-4 top-[20%] z-10 p-2 bg-blue-600 text-white rounded-full shadow-lg border border-blue-500 opacity-0 group-hover/table:opacity-100 transition-all hover:bg-blue-700 hover:scale-110 active:scale-95 shadow-blue-500/20"
            >
                <ChevronRight size={20} />
            </button>

            <div ref={scrollRef} className="overflow-x-auto no-scrollbar scroll-smooth">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 min-w-[100px]">Date & Ref</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 min-w-[160px]">Issuing Company</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 min-w-[160px]">Client / Customer</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 min-w-[100px]">Net Payable</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 min-w-[120px]">Created By</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center min-w-[120px]">Payment</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center min-w-[100px]">Proof of Work</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center min-w-[100px]">Status</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center min-w-[110px]">Lead Status</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center min-w-[80px]">Rmks</th>
                            <th className="py-3.5 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center min-w-[140px]">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {quotations.map((q) => {
                            const theme = getStatusTheme(q.status);
                            const amount = q.netPayableAmount || q.budget || 0;
                            const capacity = q.systemCapacityKw || 0;
                            const creator = q.createdBy.name || q.createdBy.worker?.name || 'Admin';

                            return (
                                <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-3.5 px-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-slate-800">
                                                {new Date(q.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                ID: #{q.id.slice(-6).toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar cursor-pointer">
                                            <span className="text-xs font-bold text-slate-700 truncate max-w-[180px] hover:overflow-visible transition-all" title={q.fromCompanyName}>
                                                {q.fromCompanyName || 'Solarica Energy India'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <div className="flex flex-col gap-0.5 overflow-x-auto no-scrollbar cursor-pointer">
                                            <span className="text-xs font-black text-slate-800 truncate max-w-[200px] hover:overflow-visible transition-all" title={q.companyName}>
                                                {q.companyName}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">
                                                {q.companyEmail}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-slate-400">₹</span>
                                            <span className="text-sm font-black text-slate-900">
                                                {amount.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <div className="flex flex-col gap-0.5 overflow-x-auto no-scrollbar">
                                            <span className="text-xs font-bold text-slate-700">{creator}</span>
                                            <span className="text-[9px] font-bold text-slate-400 truncate max-w-[120px]">{q.createdBy.email}</span>
                                        </div>
                                    </td>

                                    {/* Payment Column */}
                                    <td className="py-3.5 px-3 min-w-[100px]">
                                        <div className="flex justify-center gap-3">
                                            {/* Advance Payment */}
                                            {(() => {
                                                const advanceProof = q.paymentProofs?.find(p => p.type === 'ADVANCE');
                                                return (
                                                    <div className="flex flex-col gap-1 items-center">
                                                        {advanceProof ? (
                                                            // <div className="relative group/proof">
                                                            //     <div
                                                            //         onClick={() => window.open(advanceProof.imageUrl, '_blank')}
                                                            //         className="size-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500 cursor-pointer hover:bg-blue-100 transition-all shadow-sm"
                                                            //     >
                                                            //         <ImageIcon size={14} />
                                                            //     </div>
                                                            //     {isAdmin && (
                                                            //         <button
                                                            //             onClick={() => handleDeleteProof(advanceProof.id)}
                                                            //             className="absolute -top-1 -right-1 size-4 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/proof:opacity-100 transition-opacity shadow-sm"
                                                            //         >
                                                            //             <XCircle size={10} />
                                                            //         </button>
                                                            //     )}
                                                            // </div>

                                                            <div className="relative group/proof">
    <a 
        href={advanceProof.imageUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="size-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500 cursor-pointer hover:bg-blue-100 transition-all shadow-sm"
    >
        <ImageIcon size={14} />
    </a>
    {isAdmin && (
        <button
            onClick={(e) => {
                e.preventDefault(); // Prevent opening the link
                handleDeleteProof(advanceProof.id);
            }}
            className="absolute -top-1 -right-1 size-4 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/proof:opacity-100 transition-opacity shadow-sm"
        >
            <XCircle size={10} />
        </button>
    )}
</div>
                                                        ) : (
                                                            <label className="cursor-pointer group/upload">
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) handleFileUpload(q.id, file, 'ADVANCE');
                                                                    }}
                                                                />
                                                                <div className="size-8 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 group-hover/upload:bg-blue-50 group-hover/upload:border-blue-200 group-hover/upload:text-blue-500 transition-all">
                                                                    <Camera size={14} />
                                                                </div>
                                                            </label>
                                                        )}
                                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Advance</span>
                                                    </div>
                                                );
                                            })()}

                                            {/* Full Payment */}
                                            {(() => {
                                                const fullProof = q.paymentProofs?.find(p => p.type === 'FULL');
                                                return (
                                                    <div className="flex flex-col gap-1 items-center">
                                                        {fullProof ? (
                                                            <div className="relative group/proof">
                                                                <div
                                                                    onClick={() => window.open(fullProof.imageUrl, '_blank')}
                                                                    className="size-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 cursor-pointer hover:bg-emerald-100 transition-all shadow-sm"
                                                                >
                                                                    <ImageIcon size={14} />
                                                                </div>
                                                                {isAdmin && (
                                                                    <button
                                                                        onClick={() => handleDeleteProof(fullProof.id)}
                                                                        className="absolute -top-1 -right-1 size-4 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/proof:opacity-100 transition-opacity shadow-sm"
                                                                    >
                                                                        <XCircle size={10} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <label className="cursor-pointer group/upload">
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) handleFileUpload(q.id, file, 'FULL');
                                                                    }}
                                                                />
                                                                <div className="size-8 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 group-hover/upload:bg-emerald-50 group-hover/upload:border-emerald-200 group-hover/upload:text-emerald-500 transition-all">
                                                                    <Upload size={14} />
                                                                </div>
                                                            </label>
                                                        )}
                                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Full</span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </td>

                                    {/* Proof of Work Column */}
                                    <td className="py-3.5 px-3 min-w-[80px]">
                                        <div className="flex justify-center gap-3">
                                            {/* Work Proof */}
                                            {(() => {
                                                const workProof = q.paymentProofs?.find(p => p.type === 'WORK');
                                                return (
                                                    <div className="flex flex-col gap-1 items-center">
                                                        {workProof ? (
                                                            <div className="relative group/proof">
                                                                <div
                                                                    onClick={() => window.open(workProof.imageUrl, '_blank')}
                                                                    className="size-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-500 cursor-pointer hover:bg-indigo-100 transition-all shadow-sm"
                                                                >
                                                                    <Wrench size={14} />
                                                                </div>
                                                                {isAdmin && (
                                                                    <button
                                                                        onClick={() => handleDeleteProof(workProof.id)}
                                                                        className="absolute -top-1 -right-1 size-4 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/proof:opacity-100 transition-opacity shadow-sm"
                                                                    >
                                                                        <XCircle size={10} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <label className="cursor-pointer group/upload">
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) handleFileUpload(q.id, file, 'WORK');
                                                                    }}
                                                                />
                                                                <div className="size-8 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 group-hover/upload:bg-indigo-50 group-hover/upload:border-indigo-200 group-hover/upload:text-indigo-500 transition-all">
                                                                    <Upload size={14} />
                                                                </div>
                                                            </label>
                                                        )}
                                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Work</span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </td>
                                    {/* <td className="py-3.5 px-3">
                                        <div className="flex justify-center">
                                            <div
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${theme.bg} shadow-sm transition-all duration-300 group-hover:scale-105 relative group/status`}
                                                title={q.status === 'REJECTED' && q.rejectionReason ? `Reason: ${q.rejectionReason}` : ''}
                                            >
                                                <span className="text-[9px] font-black uppercase tracking-widest">
                                                    {q.status}
                                                </span>

                                                {q.status === 'REJECTED' && q.rejectionReason && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover/status:opacity-100 transition-opacity pointer-events-none whitespace-normal min-w-[200px] z-50 shadow-xl">
                                                        <p className="font-bold text-rose-400 mb-1">Rejection Reason:</p>
                                                        {q.rejectionReason}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                                                    </div>
                                                )}

                                                {q.status === 'SENT' && (
                                                    <div className="size-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                                                )}
                                            </div>
                                        </div>
                                    </td> */}
<td className="py-3.5 px-3">

    <div className="flex justify-center">

        <select
            value={q.status || "PENDING"}
            onChange={(e) =>
                handleStatusChange(
                    q.id,
                    e.target.value
                )
            }
            className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest outline-none transition-all shadow-sm cursor-pointer ${theme.bg}`}
        >

            <option value="DRAFT">
                DRAFT
            </option>

            <option value="SENT">
                SENT
            </option>

            <option value="ACCEPTED">
                ACCEPTED
            </option>

            <option value="REJECTED">
                REJECTED
            </option>

            <option value="FOLLOWUP">
                FOLLOWUP
            </option>

        </select>

    </div>

</td>

                                    <td className="py-3.5 px-3">
                                        <div className="flex flex-col gap-2 min-w-[110px]">
                                            <select
                                                value={q.leadStatus || ''}
                                                // onChange={(e) => 
                                                //     updateLeadStatus(q.id, e.target.value)
                                                // }
                                                onChange={(e) =>
    updateLeadStatus(
        q.leadId,
        e.target.value
    )
}
                                                className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border outline-none transition-all ${q.leadStatus === 'HOT' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                                    q.leadStatus === 'WARM' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                        q.leadStatus === 'COLD' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                            'bg-slate-50 text-slate-400 border-slate-100'
                                                    }`}
                                            >
                                                <option value="">Status</option>
                                                <option value="HOT">🔥 HOT</option>
                                                <option value="WARM">☀️ WARM</option>
                                                <option value="COLD">❄️ COLD</option>
                                            </select>
                                        </div>
                                    </td>
                                    {/* Remarks Column */}
                                    <td className="py-3.5 px-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openRemarkModal(q)}
                                                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                title="Add Remark"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            {q.remarks && (
                                                <button
                                                    onClick={() => openRemarkModal(q)}
                                                    className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
                                                    title="View Remark"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    {/* <td className="py-3.5 px-3 min-w-[140px]">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleDownload(q.id)}
                                                className="px-4 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-wider hover:bg-indigo-100 transition-all shadow-sm flex items-center gap-2 group/view"
                                            >
                                                <Eye size={14} className="group-hover/view:scale-110 transition-transform" />
                                                <span>View</span>
                                            </button>
                                        </div>
                                    </td> */}

                                    <td className="py-3.5 px-3 min-w-[180px]">

    <div className="flex items-center justify-center gap-2">

        <button
            onClick={() => handleDownload(q.id)}
            className="px-4 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-wider hover:bg-indigo-100 transition-all shadow-sm flex items-center gap-2 group/view"
        >
            <Eye
                size={14}
                className="group-hover/view:scale-110 transition-transform"
            />

            <span>View</span>
        </button>

       
            <button
                onClick={() => {
                    setEditingItem(q);
                    setShowEditModal(true);
                }}
                className="p-2 rounded-xl bg-white border border-slate-100 text-amber-600 hover:bg-amber-50 shadow-sm transition-all"
                title="Edit"
            >
                <FileText size={16} />
            </button>
     
        {isAdmin && (
    <button
        onClick={() => handleDelete(q.id)}
        className="p-2 rounded-xl bg-white border border-slate-100 text-red-600 hover:bg-red-50 shadow-sm transition-all"
        title="Delete"
    >
        <Trash2 size={16} />
    </button>
)}



    </div>

    <div className="relative">
    <button
        onClick={() =>
            setActiveDropdownId(
                activeDropdownId === q.id ? null : q.id
            )
        }
        className={`p-2 rounded-xl border transition-all ${
            activeDropdownId === q.id
                ? 'bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
        } shadow-sm`}
        title="More Actions"
    >
        <MoreHorizontal size={16} />
    </button>

    {activeDropdownId === q.id && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-100 rounded-xl shadow-lg z-[100] py-1 overflow-hidden">
            {/* <button
                onClick={() => {
                    handleConvertToProforma(q.id);
                    setActiveDropdownId(null);
                }}
                disabled={convertingId === q.id}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {convertingId === q.id ? (
                    <>
                        <Loader2
                            size={12}
                            className="animate-spin"
                        />
                        Converting...
                    </>
                ) : (
                    'Convert to Proforma'
                )}
            </button> */}


            <button
    onClick={() => {

        if (q.isProforma) return;

        handleConvertToProforma(q.id);

        setActiveDropdownId(null);

    }}

    disabled={
        convertingId === q.id ||
        q.isProforma
    }

    className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
>
    {convertingId === q.id ? (

        <>
            <Loader2
                size={12}
                className="animate-spin"
            />
            Converting...
        </>

    ) : q.isProforma ? (

        'Already Proforma'

    ) : (

        'Convert to Proforma'

    )}
</button>
        </div>
    )}
</div>

</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div >

            <div className="py-4 px-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">
                    Total Quotations: <span className="text-blue-600 ml-1">{quotations.length}</span>
                </p>
                {/* <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Showing all generated records
                </p> */}
            </div >

            {/* Production Order Modal */}
            {showProductionModal && selectedQuotationForProduction && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-2xl">
                                <Wrench size={24} className="text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800">Create Production Order</h3>
                                <p className="text-sm text-slate-500 font-medium">Link quotation to operations</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Customer</p>
                                <p className="text-lg font-black text-slate-800">{selectedQuotationForProduction.companyName}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                    <p className="text-xs font-bold text-blue-400 uppercase mb-1">Capacity</p>
                                    <p className="text-lg font-black text-blue-700">{selectedQuotationForProduction.systemCapacityKw || 0} kW</p>
                                </div>
                                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                    <p className="text-xs font-bold text-emerald-400 uppercase mb-1">Value</p>
                                    <p className="text-lg font-black text-emerald-700">₹{(selectedQuotationForProduction.netPayableAmount || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowProductionModal(false);
                                    setSelectedQuotationForProduction(null);
                                }}
                                className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmCreateProduction}
                                className="flex-1 px-6 py-3 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Wrench size={18} />
                                Create Order
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Remark Modal */}
            {
                isRemarkModalOpen && activeRemarkInvoice && ReactDOM.createPortal(
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Add Remark</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        {activeRemarkInvoice.companyName}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsRemarkModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-6">
                                <textarea
                                    value={remarkText}
                                    onChange={(e) => setRemarkText(e.target.value)}
                                    placeholder="Enter your remarks here..."
                                    className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 resize-none transition-all"
                                />
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsRemarkModalOpen(false)}
                                        className="px-5 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveRemark}
                                        disabled={isSavingRemark}
                                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/30 text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSavingRemark ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Remark'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

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

{
    isProformaModalOpen &&
    ReactDOM.createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={() => setIsProformaModalOpen(false)}
            />

            <div className="bg-white rounded-3xl w-full max-w-md p-8 z-50 shadow-2xl">
                <h3 className="text-2xl font-black text-slate-800 mb-6">
                    Convert to Proforma
                </h3>

                <div className="space-y-5">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={isAdvanceEnabled}
                            onChange={(e) =>
                                setIsAdvanceEnabled(e.target.checked)
                            }
                        />
                        <span className="font-semibold text-slate-700">
                            Add Advance Amount
                        </span>
                    </label>

                    {isAdvanceEnabled && (
                        <input
                            type="number"
                            value={advanceAmount}
                            onChange={(e) =>
                                setAdvanceAmount(e.target.value)
                            }
                            placeholder="Enter advance amount"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={() =>
                            setIsProformaModalOpen(false)
                        }
                        className="flex-1 py-3 rounded-xl bg-slate-100 font-bold text-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirmProforma}
                        disabled={convertingId !== null}
                        className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all"
                    >
                        {convertingId ? 'Converting...' : 'Convert'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
        </div >
    );
};

export default QuotationList;
