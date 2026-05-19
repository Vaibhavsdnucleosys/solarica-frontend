import { useState, useEffect } from 'react';
import { getAllQuotations } from '../../../services/quotationService';
import { getInvoices } from '../../../services/invoiceService';
import QuotationDashboard from '../../SalesMaster/QuotationDashboard';

const StatCard = ({ title, value, color, icon, onClick }: any) => (
    <div onClick={onClick} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer hover:shadow-md">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);

const TallySalesInfo = ({ isFullView = false }: { isFullView?: boolean }) => {
    const [quotations, setQuotations] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<{ title: string; items: any[] }>({ title: '', items: [] });
    const [isExpanded, setIsExpanded] = useState(false); // Toggle state for expand/collapse

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [quotationsData, invoicesData] = await Promise.all([
                getAllQuotations(),
                getInvoices()
            ]);

            if (Array.isArray(quotationsData)) {
                setQuotations(quotationsData);
            } else if (quotationsData && quotationsData.quotations) {
                setQuotations(quotationsData.quotations);
            }

            if (Array.isArray(invoicesData)) {
                setInvoices(invoicesData);
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const quotationStats = {
        total: quotations.length,
        pending: quotations.filter(q => {
            const s = (q.status || '').toLowerCase();
            return s === 'pending' || s === 'sent' || s === 'followup' || s === 'draft';
        }).length,
        accepted: quotations.filter(q => (q.status || '').toLowerCase() === 'accepted').length,
        rejected: quotations.filter(q => (q.status || '').toLowerCase() === 'rejected').length,
    };

    const estimateStats = {
        total: invoices.filter(i => i.category !== 'EXPORT' && i.isProforma).length,
        paid: invoices.filter(i => i.category !== 'EXPORT' && i.paymentStatus === 'PAID' && i.isProforma).length,
        pending: invoices.filter(i => i.category !== 'EXPORT' && i.paymentStatus === 'PENDING' && i.isProforma).length,
        partial: invoices.filter(i => i.category !== 'EXPORT' && i.paymentStatus === 'PARTIAL' && i.isProforma).length,
    };

    const exportStats = {
        total: invoices.filter(i => i.category === 'EXPORT' && i.isProforma).length,
        paid: invoices.filter(i => i.category === 'EXPORT' && i.paymentStatus === 'PAID' && i.isProforma).length,
        pending: invoices.filter(i => i.category === 'EXPORT' && i.paymentStatus === 'PENDING' && i.isProforma).length,
        partial: invoices.filter(i => i.category === 'EXPORT' && i.paymentStatus === 'PARTIAL' && i.isProforma).length,
    };

    const handleStatClick = (type: string, status: string) => {
        let items: any[] = [];
        let title = '';

        if (type === 'quotation') {
            title = `Quotations - ${status}`;
            if (status === 'Total') {
                items = quotations;
            } else if (status === 'Pending') {
                items = quotations.filter(q => {
                    const s = (q.status || '').toLowerCase();
                    return s === 'pending' || s === 'sent' || s === 'followup' || s === 'draft';
                });
            } else if (status === 'Accepted') {
                items = quotations.filter(q => (q.status || '').toLowerCase() === 'accepted');
            } else if (status === 'Rejected') {
                items = quotations.filter(q => (q.status || '').toLowerCase() === 'rejected');
            }
        } else if (type === 'estimate') {
            title = `Proforma Invoices - ${status}`;
            if (status === 'Total') {
                items = invoices.filter(i => i.category !== 'EXPORT' && i.isProforma);
            } else {
                items = invoices.filter(i => i.category !== 'EXPORT' && i.paymentStatus === status.toUpperCase() && i.isProforma);
            }
        } else if (type === 'export') {
            title = `Export Proforma - ${status}`;
            if (status === 'Total') {
                items = invoices.filter(i => i.category === 'EXPORT' && i.isProforma);
            } else {
                items = invoices.filter(i => i.category === 'EXPORT' && i.paymentStatus === status.toUpperCase() && i.isProforma);
            }
        }

        setModalData({ title, items });
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="bg-[#f8f9fa] border-b-2 border-[#2d819b] p-3">
                <div className="text-center text-[12px] font-bold text-black">Loading sales information...</div>
            </div>
        );
    }

    return (
        <>
            {isFullView ? (
                <div className="bg-white h-full -m-4">
                    <QuotationDashboard user={user} hideHeader={true} />
                </div>
            ) : (
                <>
                    {/* Compact Toggle Bar (Always Visible) */}
                    <div className="bg-gradient-to-r from-[#2d819b] to-[#1d5b6e] border-b-2 border-[#2d819b] px-4 py-2 flex items-center justify-between cursor-pointer hover:from-[#1d5b6e] hover:to-[#2d819b] transition-all" onClick={() => setIsExpanded(!isExpanded)}>
                        <div className="flex items-center gap-3">
                            {/* Toggle Switch */}
                            <div className={`w-12 h-6 rounded-full relative transition-all ${isExpanded ? 'bg-green-500' : 'bg-gray-400'}`}>
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isExpanded ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                            </div>

                            {/* Title */}
                            <span className="text-white font-bold text-[13px]">SALES INFORMATION</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fetchData().then(() => alert(`Data Check: ${quotations.length} quotes, ${invoices.length} invoices`));
                                }}
                                className="ml-4 px-2 py-0.5 bg-white/20 text-[10px] text-white rounded hover:bg-white/30"
                            >
                                Check Data
                            </button>
                        </div>

                        {/* Quick Stats (When Collapsed) */}
                        {!isExpanded && (
                            <div className="flex items-center gap-6 text-white text-[11px]">
                                <div className="flex items-center gap-2">
                                    <span className="opacity-80">Quotations:</span>
                                    <span className="font-bold bg-white/20 px-2 py-0.5 rounded">{quotationStats.total}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="opacity-80">Proforma:</span>
                                    <span className="font-bold bg-white/20 px-2 py-0.5 rounded">{estimateStats.total}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="opacity-80">Exp. Proforma:</span>
                                    <span className="font-bold bg-white/20 px-2 py-0.5 rounded">{exportStats.total}</span>
                                </div>
                            </div>
                        )}

                        {/* Expand/Collapse Icon */}
                        <div className="text-white text-[18px] font-bold">
                            {isExpanded ? '▲' : '▼'}
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && !isFullView && (
                        <div className="bg-[#f0f9fc] border-b-2 border-[#2d819b] p-3 shadow-sm">
                            {/* Compact Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 text-[11px]">
                                {/* Quotations */}
                                <div className="bg-white border border-[#a0cbe0] p-2 rounded-sm">
                                    <div className="text-center mb-1 font-bold text-[#1d5b6e] border-b border-[#e0f3f9] pb-1">
                                        QUOTATIONS
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex justify-between hover:bg-blue-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('quotation', 'Total')}>
                                            <span className="text-gray-700">Total:</span>
                                            <span className="font-bold text-black">{quotationStats.total}</span>
                                        </div>
                                        <div className="flex justify-between hover:bg-orange-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('quotation', 'Pending')}>
                                            <span className="text-gray-700">Pending:</span>
                                            <span className="font-bold text-[#ff9800]">{quotationStats.pending}</span>
                                        </div>
                                        <div className="flex justify-between hover:bg-green-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('quotation', 'Accepted')}>
                                            <span className="text-gray-700">Accepted:</span>
                                            <span className="font-bold text-[#4caf50]">{quotationStats.accepted}</span>
                                        </div>
                                        <div className="flex justify-between hover:bg-red-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('quotation', 'Rejected')}>
                                            <span className="text-gray-700">Rejected:</span>
                                            <span className="font-bold text-[#f44336]">{quotationStats.rejected}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Estimates */}
                                <div className="bg-white border border-[#a0cbe0] p-2 rounded-sm">
                                    <div className="text-center mb-1 font-bold text-[#1d5b6e] border-b border-[#e0f3f9] pb-1">
                                        PROFORMA INVOICES
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex justify-between hover:bg-blue-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('estimate', 'Total')}>
                                            <span className="text-gray-700">Total:</span>
                                            <span className="font-bold text-black">{estimateStats.total}</span>
                                        </div>
                                        <div className="flex justify-between hover:bg-green-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('estimate', 'Paid')}>
                                            <span className="text-gray-700">Paid:</span>
                                            <span className="font-bold text-[#4caf50]">{estimateStats.paid}</span>
                                        </div>
                                        <div className="flex justify-between hover:bg-orange-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('estimate', 'Pending')}>
                                            <span className="text-gray-700">Pending:</span>
                                            <span className="font-bold text-[#ff9800]">{estimateStats.pending}</span>
                                        </div>
                                        <div className="flex justify-between hover:bg-blue-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('estimate', 'Partial')}>
                                            <span className="text-gray-700">Partial:</span>
                                            <span className="font-bold text-[#2196f3]">{estimateStats.partial}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Export Estimates */}
                                <div className="bg-white border border-[#a0cbe0] p-2 rounded-sm">
                                    <div className="text-center mb-1 font-bold text-[#1d5b6e] border-b border-[#e0f3f9] pb-1">
                                        EXPORT PROFORMA
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex justify-between hover:bg-blue-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('export', 'Total')}>
                                            <span className="text-gray-700">Total:</span>
                                            <span className="font-bold text-black">{exportStats.total}</span>
                                        </div>
                                        <div className="flex justify-between hover:bg-green-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('export', 'Paid')}>
                                            <span className="text-gray-700">Paid:</span>
                                            <span className="font-bold text-[#4caf50]">{exportStats.paid}</span>
                                        </div>
                                        <div className="flex justify-between hover:bg-orange-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('export', 'Pending')}>
                                            <span className="text-gray-700">Pending:</span>
                                            <span className="font-bold text-[#ff9800]">{exportStats.pending}</span>
                                        </div>
                                        <div className="flex justify-between hover:bg-blue-50 px-1 cursor-pointer rounded" onClick={() => handleStatClick('export', 'Partial')}>
                                            <span className="text-gray-700">Partial:</span>
                                            <span className="font-bold text-[#2196f3]">{exportStats.partial}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Note */}
                            <div className="mt-2 text-center text-[10px] text-gray-600 italic">
                                Click any stat to view details • Click the toggle above to collapse
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Details Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-lg shadow-2xl w-[90%] max-w-4xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="bg-[#2d819b] text-white px-6 py-3 flex justify-between items-center rounded-t-lg">
                            <h2 className="text-[16px] font-bold">{modalData.title}</h2>
                            <button onClick={() => setShowModal(false)} className="text-white hover:text-red-300 text-[20px] font-bold">✕</button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {modalData.items.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">No items found</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[12px] border-collapse">
                                        <thead>
                                            <tr className="bg-[#e0f3f9] border-b-2 border-[#2d819b]">
                                                <th className="px-4 py-2 text-left font-bold text-[#1d5b6e]">ID</th>
                                                <th className="px-4 py-2 text-left font-bold text-[#1d5b6e]">Customer</th>
                                                <th className="px-4 py-2 text-left font-bold text-[#1d5b6e]">Date</th>
                                                <th className="px-4 py-2 text-right font-bold text-[#1d5b6e]">Amount</th>
                                                <th className="px-4 py-2 text-center font-bold text-[#1d5b6e]">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {modalData.items.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-200 hover:bg-blue-50">
                                                    <td className="px-4 py-2 font-mono text-[#1d5b6e]">{item.quotationNumber || item.invoiceNumber || item.id}</td>
                                                    <td className="px-4 py-2">{item.companyName || item.customerName || item.customer?.name || 'N/A'}</td>
                                                    <td className="px-4 py-2">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : item.date ? new Date(item.date).toLocaleDateString('en-GB') : 'N/A'}</td>
                                                    <td className="px-4 py-2 text-right font-bold">₹{(item.netPayableAmount || item.totalAmount || item.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${(item.status || item.paymentStatus) === 'PAID' || (item.status || '').toLowerCase() === 'accepted' ? 'bg-green-100 text-green-800' :
                                                            (item.status || item.paymentStatus) === 'PENDING' || (item.status || '').toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-800' :
                                                                (item.status || item.paymentStatus) === 'PARTIAL' ? 'bg-blue-100 text-blue-800' :
                                                                    (item.status || '').toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {item.status || item.paymentStatus || 'N/A'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 rounded-b-lg flex justify-between items-center">
                            <span className="text-[12px] text-gray-600">Total: {modalData.items.length} items</span>
                            <button onClick={() => setShowModal(false)} className="bg-[#2d819b] text-white px-4 py-2 rounded text-[12px] font-bold hover:bg-[#1d5b6e]">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TallySalesInfo;
