import React, { useEffect, useState } from 'react';
import { getAllQuotations, createProductionFromQuotation } from '../../services/quotationService';
import { getInvoices, createProductionFromInvoice, getInvoiceDownloadUrl } from '../../services/invoiceService';
import { getProductionTasks, ProductionTask } from '../../services/api';
import { Wrench, CheckCircle, Eye, FileText, Globe, ScrollText } from 'lucide-react';
import QuotationViewModal from '../SalesMaster/QuotationViewModal';

interface PendingOrdersPortalProps {
    onBack?: () => void;
    onRedirectToAssignment?: (prefillData: any) => void;
}

type TabType = 'QUOTATIONS' | 'ESTIMATES' | 'EXPORT_ESTIMATES';

const PendingOrdersPortal: React.FC<PendingOrdersPortalProps> = ({ onBack, onRedirectToAssignment }) => {
    const [activeTab, setActiveTab] = useState<TabType>('QUOTATIONS');
    const [data, setData] = useState<{
        quotations: any[];
        estimates: any[];
        exportEstimates: any[];
    }>({
        quotations: [],
        estimates: [],
        exportEstimates: []
    });
    const [existingTaskIds, setExistingTaskIds] = useState<Set<string>>(new Set());
    const [existingInvoiceTaskIds, setExistingInvoiceTaskIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewQuotationId, setViewQuotationId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [allQuotations, allInvoices, allTasks] = await Promise.all([
                getAllQuotations(),
                getInvoices(),
                getProductionTasks()
            ]);

            // Filter data
            // const acceptedQuotations = allQuotations.filter((q: any) => q.status.toUpperCase() === 'ACCEPTED');
       const acceptedQuotations =
    (allQuotations?.quotations || []).filter(
        (q: any) =>
            q?.status
                ?.toString()
                ?.trim()
                ?.toUpperCase() === "ACCEPTED"
    );
            // Estimates include both domestic category and tax invoices (domestic orders)
            const estimates = allInvoices.filter((i: any) =>
                (i.category === 'DOMESTIC' || i.category === 'TAX_INVOICE' || !i.category)
            );
            const exportEstimates = allInvoices.filter((i: any) => i.category === 'EXPORT');

            setData({
                quotations: acceptedQuotations,
                estimates: estimates,
                exportEstimates: exportEstimates
            });

            // Map existing production tasks
            const taskQuotationIds = new Set(allTasks.map((t: ProductionTask) => t.quotationId).filter(Boolean) as string[]);
            const taskInvoiceIds = new Set((allTasks as any).map((t: any) => t.invoiceId).filter(Boolean) as string[]);

            setExistingTaskIds(taskQuotationIds);
            setExistingInvoiceTaskIds(taskInvoiceIds);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = (order: any) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleView = async (order: any) => {
        if (activeTab === 'QUOTATIONS') {
            setViewQuotationId(order.id);
            setViewModalOpen(true);
        } else {
            try {
                // For estimates/invoices, open the PDF directly
                const { url } = await getInvoiceDownloadUrl(order.id);
                window.open(url, '_blank');
            } catch (error) {
                console.error("Failed to view estimate PDF", error);
                alert("Could not view estimate PDF. Please try again.");
            }
        }
    };

    const confirmCreateProduction = async () => {
        if (!selectedOrder) return;

        const isInvoice = activeTab !== 'QUOTATIONS';
        const orderId = selectedOrder.id;

        const prefillData = {
            description: `Production for ${selectedOrder.companyName || selectedOrder.customerName}`,
            targetQuantity: selectedOrder.systemCapacityKw || (selectedOrder.items && selectedOrder.items[0]?.quantity) || 1,
            priority: 'High' as const,
            quotationId: isInvoice ? undefined : orderId,
            invoiceId: isInvoice ? orderId : undefined,
            customerName: selectedOrder.companyName || selectedOrder.customerName,
            customerEmail: selectedOrder.companyEmail || selectedOrder.customerEmail,
            orderDetails: isInvoice
                ? `${selectedOrder.invoiceNumber} - ${selectedOrder.items?.length || 0} items`
                : `${selectedOrder.serviceType || 'Solar Installation'} - ${selectedOrder.systemCapacityKw || 0}kW`,
            systemCapacity: selectedOrder.systemCapacityKw || 0,
        };

        if (onRedirectToAssignment) {
            onRedirectToAssignment(prefillData);
            return;
        }

        try {
            const defaultDeadline = new Date();
            defaultDeadline.setDate(defaultDeadline.getDate() + 7);

            const productionData = {
                ...prefillData,
                deadline: defaultDeadline.toISOString().split('T')[0]
            };

            if (isInvoice) {
                await createProductionFromInvoice(orderId, productionData);
            } else {
                await createProductionFromQuotation(orderId, productionData);
            }

            alert('Production order created successfully!');
            setShowModal(false);
            setSelectedOrder(null);
            loadData();
        } catch (error: any) {
            console.error('Failed to create production order', error);
            alert(error.response?.data?.error || 'Failed to create production order');
        }
    };

    const getActiveData = () => {
        if (activeTab === 'QUOTATIONS') return data.quotations;
        if (activeTab === 'ESTIMATES') return data.estimates;
        return data.exportEstimates;
    };

    const activeOrders = getActiveData();

    return (
        <div className="bg-solarica-bg min-h-full p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-3xl text-slate-700">arrow_back</span>
                            </button>
                        )}
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pending Orders</h1>
                            <p className="text-lg text-slate-500 font-medium">Create production tasks from sales and estimates.</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                        <button
                            onClick={() => setActiveTab('QUOTATIONS')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'QUOTATIONS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <ScrollText size={18} />
                            Quotations
                        </button>
                        <button
                            onClick={() => setActiveTab('ESTIMATES')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'ESTIMATES' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <FileText size={18} />
                            Estimates
                        </button>
                        <button
                            onClick={() => setActiveTab('EXPORT_ESTIMATES')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'EXPORT_ESTIMATES' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Globe size={18} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Order List */}
                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="p-20 text-center text-slate-400 font-bold">Loading orders...</div>
                    ) : activeOrders.length === 0 ? (
                        <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 text-slate-400 font-bold">
                            No pending {activeTab.toLowerCase().replace('_', ' ')} found.
                        </div>
                    ) : (
                        activeOrders.map(order => {
                            const isExisting = activeTab === 'QUOTATIONS'
                                ? existingTaskIds.has(order.id)
                                : existingInvoiceTaskIds.has(order.id);

                            return (
                                <div key={order.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between transition-all hover:shadow-md">
                                    <div className="flex-1 w-full md:w-auto">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="text-xl font-black text-slate-800">{order.companyName || order.customerName}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${activeTab === 'QUOTATIONS' ? 'bg-blue-50 text-blue-600' :
                                                activeTab === 'ESTIMATES' ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'
                                                }`}>
                                                {activeTab === 'QUOTATIONS' ? `${order.systemCapacityKw || 0} kW` : (order.invoiceNumber || 'ESTIMATE')}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                                                Value: <span className="text-emerald-600">
                                                    {order.currency === 'USD' ? '$' : '₹'}
                                                    {(order.netAmount || order.netPayableAmount || 0).toLocaleString()}
                                                </span>
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium">
                                                {activeTab === 'QUOTATIONS' ? 'Accepted' : 'Created'} on: {new Date(order.updatedAt || order.createdAt || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {isExisting ? (
                                        <div className="px-6 py-3 bg-slate-50 text-slate-400 border border-slate-100 font-bold rounded-xl flex items-center gap-2 cursor-not-allowed">
                                            <CheckCircle size={18} />
                                            Task Generated
                                        </div>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                            <button
                                                onClick={() => handleView(order)}
                                                className="px-6 py-3 bg-blue-50 text-blue-600 border border-blue-100 font-bold rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2 active:scale-95 justify-center"
                                            >
                                                <Eye size={18} />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleCreateClick(order)}
                                                className={`px-6 py-3 border font-bold rounded-xl transition-all flex items-center gap-2 active:scale-95 justify-center ${activeTab === 'QUOTATIONS' ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100' :
                                                    activeTab === 'ESTIMATES' ? 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100' :
                                                        'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'
                                                    }`}
                                            >
                                                <Wrench size={18} />
                                                Create Task
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-3 rounded-2xl ${activeTab === 'ESTIMATES' ? 'bg-teal-100 text-teal-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                <Wrench size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800">Confirm Production</h3>
                                <p className="text-sm text-slate-500 font-medium">Create task for this {activeTab.toLowerCase().replace('_', ' ')}?</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Customer</p>
                                <p className="text-lg font-black text-slate-800">{selectedOrder.companyName || selectedOrder.customerName}</p>
                            </div>

                            {activeTab === 'QUOTATIONS' && (
                                <div className="flex-1 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                    <p className="text-xs font-bold text-blue-400 uppercase mb-1">Capacity</p>
                                    <p className="text-lg font-black text-blue-700">{selectedOrder.systemCapacityKw || 0} kW</p>
                                </div>
                            )}

                            <p className="text-xs text-slate-400 italic">
                                This will create a new production task with High priority and notify the operations team.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmCreateProduction}
                                className={`flex-1 px-6 py-3 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'ESTIMATES' ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/20' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20'
                                    }`}
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <QuotationViewModal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                quotationId={viewQuotationId}
            />
        </div>
    );
};

export default PendingOrdersPortal;
