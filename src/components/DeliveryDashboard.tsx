import React, { useState, useEffect } from 'react';
import { getInvoices, Invoice, createInvoice } from '../services/invoiceService';
import QuotationInvoiceList from './SalesMaster/QuotationInvoiceList';
import DeliveryChallanForm from './SalesMaster/DeliveryChallanForm';
import CompanySelectionModal from './SalesMaster/CompanySelectionModal';
import {
    Truck,
    Search,
    Filter,
    Calendar,
    RefreshCcw,
    Download,
    FileText,
    TrendingUp,
    Package,
    CheckCircle2,
    Clock,
    Plus
} from 'lucide-react';
import WelcomeSection from './WelcomeSection';
import { SuccessModal, GeneratingModal } from './SalesMaster/GenerationModals';

const DeliveryDashboard: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        filterInvoices();
    }, [searchTerm, statusFilter, invoices]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const data = await getInvoices();
            // Show all relevant invoices in Delivery Dashboard (Domestic, Export, Tax Invoice)
            setInvoices(data || []);
            setFilteredInvoices(data || []);
        } catch (error) {
            console.error('Failed to fetch invoices', error);
        } finally {
            setLoading(false);
        }
    };

    const filterInvoices = () => {
        let filtered = [...invoices];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(inv =>
                inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.customerGstinUin?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(inv => inv.paymentStatus === statusFilter);
        }

        setFilteredInvoices(filtered);
    };

    const handleCreateTaxInvoice = async (data: any) => {
        try {
            setIsGenerating(true);
            setGenerationProgress(20);

            const invoicePayload = {
                companyName: data.fromCompanyName,
                invoiceNumber: data.invoiceNumber || `TAX-${Date.now()}`,
                invoiceDate: data.invoiceDate ? new Date(data.invoiceDate).toISOString() : new Date().toISOString(),
                gstinNumber: data.fromGstin,
                paymentStatus: 'PAID',
                modeOfDispatch: data.modeOfDispatch,
                transportThrough: data.transportThrough,
                trackingNumber: data.trackingNumber,
                customerName: data.customerName,
                customerAddress: data.customerAddress,
                customerContact: data.customerContact,
                customerGstinUin: data.customerGstin,
                recipientName: data.recipientName,
                shippingAddress: data.shippingAddress,
                stateCode: data.stateCode,
                placeOfSupply: data.placeOfSupply,
                bankName: data.bankName,
                accountNumber: data.bankAccountNo,
                ifscCode: data.bankIfsc,
                termsAndConditions: data.termsAndConditions,
                netAmount: Number(data.totals.netAmount || 0),
                cashDiscount: Number(data.cashDiscount || data.totals.cashDiscount || 0),
                cgst: Number(data.totals.cgst || 0),
                sgst: Number(data.totals.sgst || 0),
                roundOff: Number(data.roundOff || data.totals.roundOff || 0),
                grandTotalPayable: Number(data.totals.grandTotal || 0),
                amountInWords: data.amountInWords || "",
                category: 'TAX_INVOICE',
                items: (data.items || []).map((item: any) => ({
                    itemDescription: item.description,
                    hsnSac: item.hsn,
                    quantity: Number(item.qty || 0),
                    unit: item.unit || 'PCS',
                    rate: Number(item.rate || 0),
                    discount: Number(item.discPercent || 0),
                    amount: Number(item.amount || 0)
                })),
                voucherId: data.voucherId
            };

            await createInvoice(invoicePayload as any);

            setGenerationProgress(100);
            setTimeout(async () => {
                setIsGenerating(false);
                setShowSuccess(true);
                await fetchInvoices();
                setShowCreateForm(false);
                setGenerationProgress(0);
            }, 800);
        } catch (error) {
            setIsGenerating(false);
            console.error(error);
            alert("Failed to create Tax Invoice");
        }
    };

    const handleCompanySelect = (company: string) => {
        setSelectedCompany(company);
        setShowCompanyModal(false);
        setShowCreateForm(true);
    };

    const totalAmount = filteredInvoices.reduce((sum, inv) => sum + (inv.grandTotalPayable || 0), 0);
    const paidInvoices = filteredInvoices.filter(inv => inv.paymentStatus === 'PAID').length;
    const pendingInvoices = filteredInvoices.filter(inv => inv.paymentStatus === 'PENDING').length;

    if (showCreateForm) {
        return (
            <div className="bg-background-light min-h-screen p-8">
                <DeliveryChallanForm
                    onBack={() => setShowCreateForm(false)}
                    onSubmit={handleCreateTaxInvoice}
                    initialCompany={selectedCompany}
                    formTitle="Delivery Challan"
                />
                <GeneratingModal isOpen={isGenerating} progress={generationProgress} />
                <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full font-display bg-background-light p-8">
            {/* WelcomeSection removed as per request */}

            <CompanySelectionModal
                isOpen={showCompanyModal}
                onClose={() => setShowCompanyModal(false)}
                onSelect={handleCompanySelect}
                allowedCompanies={[
                    "Solarica Energy India Pvt Ltd",
                    "Solarica Fabtech Pvt Ltd",
                    "Solarica Industries Pvt Ltd",
                    "Ulhasnagar"
                ]}
            />

            {/* Header */}
            <header className="flex items-center justify-between py-5 bg-white border-b border-slate-100 shrink-0 rounded-2xl mb-8 px-8">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">Delivery Management</h1>
                    <p className="text-xs text-slate-400 font-medium">Track and manage all invoices from sales employees</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchInvoices}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 rounded-xl transition-all active:scale-95"
                    >
                        <RefreshCcw size={16} />
                    </button>
                    <button
                        onClick={() => setShowCompanyModal(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all font-bold"
                    >
                        <Plus size={18} />
                        <span>Create New</span>
                    </button>
                </div>
            </header>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Total Invoices", val: filteredInvoices.length.toString(), icon: FileText, color: "blue-500" },
                    { label: "Total Amount", val: `₹${(totalAmount / 100000).toFixed(2)}L`, icon: TrendingUp, color: "emerald-500" },
                    { label: "Paid", val: paidInvoices.toString(), icon: CheckCircle2, color: "green-500" },
                    { label: "Pending", val: pendingInvoices.toString(), icon: Clock, color: "amber-500" }
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
                    </div>
                ))}
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative group flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all duration-300" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by customer name, invoice number, or GSTIN..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all placeholder:text-slate-400 font-medium shadow-sm"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all shadow-sm"
                >
                    <option value="all">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="PARTIAL">Partial</option>
                    <option value="OVERDUE">Overdue</option>
                </select>
            </div>

            {/* Invoices List */}
            <main className="w-full">
                {loading ? (
                    <div className="p-32 rounded-[2.5rem] bg-slate-50/50 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
                        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <span className="text-sm font-bold text-slate-400">Loading Invoices...</span>
                    </div>
                ) : (
                    <QuotationInvoiceList
                        invoices={filteredInvoices}
                        onRefresh={fetchInvoices}
                        isDeliveryView={true}
                    />
                )}
            </main>
        </div>
    );
};

export default DeliveryDashboard;
