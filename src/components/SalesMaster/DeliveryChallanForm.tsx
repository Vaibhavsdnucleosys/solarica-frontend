import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    FileText,
    Building2,
    Receipt,
    Plus,
    Trash2,
    Save,
    Upload,
    CheckCircle2,
    User,
    Truck,
    Tag,
    Layers
} from 'lucide-react';
import { createInvoice } from '../../services/invoiceService';
import { getNextInvoiceNumber } from '../../services/invoiceService';
import { searchLeads, getRecentLeads, Lead, createLead } from '../../services/leadService';
import CreateLeadModal from './CreateLeadModal';
import CatalogItemSelector from '../Catalog/CatalogItemSelector';
import { getAvailableInvoices, getVoucherByInvoiceNumber, getCompanies } from '../../services/accountingService';

import toast from 'react-hot-toast'; // Importing toast

interface DeliveryChallanFormProps {
    onBack: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialCompany: string;
    formTitle?: string;
}

interface ItemRow {
    id: number;
    description: string;
    subDescription: string;
    hsn: string;
    qty: number;
    unit: string;
    rate: number;
    watt?: number;
    isSolarPanel?: boolean;
    discPercent: number;
    amount: number;
    gstRate: number; // Added per-item GST
}


const defaultChallanTerms = `1. Payment terms 80% advance with purchase order. 20% before Delivery and inspection of product ( if company want to inspect)
2. Installation charges not included
3. Goods once sold will not be taken back at any cost unless warranted.
4. Cancellation Charged 10% of Order Value. No Cancellation is allowed after Material is Produced/Procured.
5. Panel Warranty 10 years from date of supply.
6. Standard terms and conditions apply.
7. Lisoning Work charges -govt charges are extra at actual if applicable
8. Warranty for lights 2 years is Offsite Only and onsite warranty will cost you extra unless agreed by both parties.
9. Terms and Conditions as per applicability of your demand product.
10. Transportation charges extra at actual to pay by customer. Custom and other charges are to be born by customer.
11. any clearance for site or onsite is customer scope
12. Inspection to be done at factory premises .`;
const DeliveryChallanForm = ({ onBack, onSubmit, initialCompany, formTitle }: DeliveryChallanFormProps) => {
    const isInvoice = true; // Always an invoice/challan context
    const [sameAsBillTo, setSameAsBillTo] = useState(false); // Default to false to keep blank
    const [loading, setLoading] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);

    const [formData, setFormData] = useState({
        // Company Details
        fromCompanyName: initialCompany || '',
        invoiceNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        fromGstin: '',
        paymentTerms: '',
        modeOfDispatch: 'By Road',
        transportThrough: '',
        trackingNumber: '',
        transportDescription: '',

        // Bill To
        customerName: '',
        customerAddress: '',
        customerContact: '',
        customerGstin: '',

        // Ship To
        recipientName: '',
        shippingAddress: '',
        stateCode: '',
        placeOfSupply: '',

        // Bank & Other
        bankName: 'HDFC Bank',
        bankAccountNo: '50200012345678',
        bankIfsc: 'HDFC0001234',
        bankBranch: '',
        // termsAndConditions: '1. Goods once sold will not be taken back. 2. Interest @ 18% p.a. will be charged if payment is not made within due date.',
        termsAndConditions: defaultChallanTerms,

        // Calculations
        cashDiscount: 0,
        roundOff: 0,

        // Sales Employee
        salesEmployeeName: '',
        salesEmployeeNumber: '',

        // Linking
        voucherId: ''
    });

    // Lead Search State
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<Lead[]>([]);
    const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
    const [showLeadResults, setShowLeadResults] = useState(false);
    const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
    const searchTimeoutRef = React.useRef<any>(null);
    const [lightBill, setLightBill] = useState<File | null>(null);

    // Invoice Selection State
    const [availableInvoices, setAvailableInvoices] = useState<any[]>([]);
    const [selectedInvoiceNo, setSelectedInvoiceNo] = useState('');
    const [companyId, setCompanyId] = useState<string | null>(null);

    // Load recent leads on mount
    useEffect(() => {
        getRecentLeads().then(setRecentLeads).catch(err => console.error("Failed to load recent leads", err));
    }, []);

    // Fetch company ID and available invoices
    const initData = async () => {
        try {
            const companies = await getCompanies();
            
            // Try exact match first
            let foundCompany = companies.find((c: any) => c.name === initialCompany);
            
            // If not found, try flexible matching
            if (!foundCompany && initialCompany) {
                foundCompany = companies.find((c: any) => {
                    const dbName = c.name.toLowerCase();
                    const targetName = initialCompany.toLowerCase();
                    return targetName.includes(dbName) || dbName.includes(targetName) ||
                           (targetName.includes('solarica') && dbName.includes('solarica')) ||
                           (targetName.includes('ulhasnagar') && dbName.includes('ulhasnagar'));
                });
            }

            // Fallback: If still not found but we have companies, use the first one
            if (!foundCompany && companies.length > 0) {
                foundCompany = companies[0];
            }

            if (foundCompany) {
                setCompanyId(foundCompany.id);
                const invs = await getAvailableInvoices(foundCompany.id);
                setAvailableInvoices(invs);
                if (invs && invs.length > 0) {
                    toast.success(`Found ${invs.length} available invoices`);
                }
            } else {
                toast.error(`No company access found for "${initialCompany}"`);
            }
        } catch (err: any) {
            console.error("Failed to initialize available invoices", err);
            toast.error(`Fetch error: ${err.message || 'Unknown'}`);
        }
    };

    useEffect(() => {
        initData();
    }, [initialCompany]);

    const handleInvoiceSelect = async (invoiceNo: string) => {
        setSelectedInvoiceNo(invoiceNo);
        if (!invoiceNo) return;

        // Find the specific invoice to get its companyId
        const selectedInv = availableInvoices.find(inv => inv.invoiceNumber === invoiceNo);
        const targetCompanyId = selectedInv?.companyId || companyId;

        if (!targetCompanyId) return;

        try {
            setLoading(true);
            const voucher = await getVoucherByInvoiceNumber(targetCompanyId, invoiceNo);
            
            // Find party ledger if Ledger is null
            let partyLedger = voucher.Ledger;
            if (!partyLedger && voucher.entries) {
                // In a SALES voucher, the party is typically the one being DEBITED
                const debitEntry = voucher.entries.find((e: any) => e.entryType === 'DEBIT');
                partyLedger = debitEntry?.ledger;
            }

            // Get source PI if available
            const sourcePI = (voucher as any).sourcePI;

            // Auto-fill form data
            setFormData(prev => ({
                ...prev,
                fromCompanyName: selectedInv?.company?.name || prev.fromCompanyName,
                // Prioritize PI data for customer/billing details
                customerName: sourcePI?.customerName || partyLedger?.name || '',
                customerAddress: sourcePI?.customerAddress || partyLedger?.address || '',
                customerContact: sourcePI?.customerContact || partyLedger?.phone || '',
                customerGstin: sourcePI?.customerGstinUin || partyLedger?.gstin || '',
                invoiceNumber: invoiceNo,
                // Prioritize PI data for shipping details
                recipientName: sourcePI?.recipientName || (sameAsBillTo ? (sourcePI?.customerName || partyLedger?.name || '') : prev.recipientName),
                shippingAddress: sourcePI?.shippingAddress || (sameAsBillTo ? (sourcePI?.customerAddress || partyLedger?.address || '') : prev.shippingAddress),
                stateCode: sourcePI?.stateCode || prev.stateCode,
                placeOfSupply: sourcePI?.placeOfSupply || prev.placeOfSupply,
                voucherId: voucher.id || ''
            }));

            // Auto-fill items
            if (voucher.VoucherItem && voucher.VoucherItem.length > 0) {
                const mappedItems = voucher.VoucherItem.map((vItem: any, idx: number) => ({
                    id: Date.now() + idx,
                    description: vItem.itemName,
                    subDescription: '',
                    hsn: vItem.hsnCode || '',
                    qty: Number(vItem.quantity) || 0,
                    unit: vItem.unit || 'PCS',
                    rate: Number(vItem.rate) || 0,
                    discPercent: Number(vItem.discountPercentage) || 0,
                    amount: Number(vItem.amount) || 0,
                    gstRate: Number(vItem.gstPercentage) || 18,
                    watt: Number(vItem.watt) || 0,
                    isSolarPanel: vItem.isSolarPanel || false
                }));
                setItems(mappedItems);
            }
            
            toast.success("Details auto-filled from Invoice " + invoiceNo);
        } catch (err) {
            console.error("Failed to fetch voucher details", err);
            toast.error("Failed to fetch invoice details");
        } finally {
            setLoading(false);
        }
    };

    const handleLeadSearch = async (query: string) => {
        if (!query) return;
        setIsSearching(true);
        try {
            const results = await searchLeads(query);
            setSearchResults(results || []);
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setIsSearching(false);
        }
    };

    const selectLead = (lead: Lead) => {
        setFormData(prev => ({
            ...prev,
            customerName: lead.name,
            customerContact: lead.phone,
            customerAddress: lead.company ? `${lead.company}\n` : '', // Append company to address
            customerGstin: lead.gstin || prev.customerGstin // Map GSTIN if available
        }));
        setShowLeadResults(false);
        setSearchResults([]);
    };

    const handleCreateLead = async (leadData: any) => {
        try {
            const newLead = await createLead(leadData);
            setRecentLeads(prev => [newLead, ...prev]);
            selectLead(newLead);
            setIsCreateLeadOpen(false);
        } catch (error) {
            console.error("Failed to create lead", error);
            alert("Failed to create lead");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setLightBill(file);
    };

    const [items, setItems] = useState<ItemRow[]>([
        {
            id: Date.now(),
            description: '',
            subDescription: '',
            hsn: '',
            qty: 0,
            unit: 'MTR',
            rate: 0,
            watt: 0,
            isSolarPanel: false,
            discPercent: 0,
            amount: 0,
            gstRate: 18 // Default GST
        }
    ]);

    // Company Config for pre-filling
    const companyConfigs: Record<string, any> = {
        "Solarica Energy India Pvt Ltd": {
            fromGstin: '27AAYCS3436C1Z9',
            bankName: 'HDFC Bank',
            bankAccountNo: '50200088899911',
            bankIfsc: 'HDFC0001234',
            // termsAndConditions: '1. Goods once sold will not be taken back. 2. Payment: 100% advance.'
        },
        "Solarica Fabtech Pvt Ltd": {
            fromGstin: '27FABTECH123456',
            bankName: 'ICICI Bank',
            bankAccountNo: '112233445566',
            bankIfsc: 'ICIC0006789',
            // termsAndConditions: '1. Fabtech standard terms. 2. Delivery within 15 days.'
        },
        "Solarica Industries Pvt Ltd": {
            fromGstin: '27INDUSTR123456',
            bankName: 'State Bank of India',
            bankAccountNo: '998877665544',
            bankIfsc: 'SBIN0001122',
            // termsAndConditions: '1. Industries standard terms. 2. Quality checked before dispatch.'
        }
    };

    // Handle sameAsBillTo sync and initial defaults
    // useEffect(() => {
    //     const config = companyConfigs[initialCompany];
    //     if (config) {
    //         setFormData(prev => ({
    //             ...prev,
    //             ...config
    //         }));
    //     }

    useEffect(() => {
    const config = companyConfigs[initialCompany];
    if (config) {
        // Destructure termsAndConditions out of the config to avoid overriding
        const { termsAndConditions, ...restOfConfig } = config; 
        
        setFormData(prev => ({
            ...prev,
            ...restOfConfig // Apply everything EXCEPT the terms
        }));
    }

        if (sameAsBillTo) {
            setFormData(prev => ({
                ...prev,
                recipientName: prev.customerName,
                shippingAddress: prev.customerAddress,
                placeOfSupply: prev.customerAddress ? 'Pune' : ''
            }));
        }
    }, [sameAsBillTo, formData.customerName, formData.customerAddress, initialCompany]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Coerce numeric fields
        const numericFields = ['cashDiscount', 'roundOff'];
        const finalValue = numericFields.includes(name) ? (parseFloat(value) || 0) : value;
        
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleItemChange = (id: number, field: keyof ItemRow, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                // Recalculate amount: (qty * rate * watt) - discount or (qty * rate) - discount
                if (field === 'qty' || field === 'rate' || field === 'discPercent' || field === 'watt' || field === 'gstRate') {
                    const qty = (field === 'qty' ? parseFloat(value) : item.qty) || 0;
                    const rate = (field === 'rate' ? parseFloat(value) : item.rate) || 0;
                    const watt = (field === 'watt' ? parseFloat(value) : item.watt) || 0;
                    const disc = (field === 'discPercent' ? parseFloat(value) : item.discPercent) || 0;

                    let baseAmount = qty * rate;
                    if (item.isSolarPanel && watt > 0) {
                        baseAmount = qty * rate * watt;
                    }

                    updatedItem.amount = Math.max(0, baseAmount - (baseAmount * (disc / 100)));
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const addItem = () => {
        setItems(prev => [...prev, {
            id: Date.now(),
            description: '',
            subDescription: '',
            hsn: '',
            qty: 0,
            unit: 'MTR',
            rate: 0,
            watt: 0,
            isSolarPanel: false,
            discPercent: 0,
            amount: 0,
            gstRate: 18
        }]);
    };

    const removeItem = (id: number) => {
        if (items.length > 1) {
            setItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleProductSelect = (product: any) => {
        const newItem: ItemRow = {
            id: Date.now(),
            description: product.model,
            subDescription: product.description || '',
            hsn: product.hsnSac || '',
            qty: 1,
            unit: product.unit || 'PCS',
            rate: product.price || 0,
            watt: product.watt || 0,
            isSolarPanel: product.isSolarPanel || false,
            discPercent: 0,
            amount: product.isSolarPanel && product.watt ? (1 * product.price * product.watt) : (product.price || 0),
            gstRate: 18 // Default to 18, or map from HSN if possible
        };

        // Attempt to map GST from product if it exists
        if (product.gst !== undefined) {
            newItem.gstRate = parseFloat(product.gst);
        } else if (product.hsnSac === '8419') {
            newItem.gstRate = 12; // Solar Heaters
        } else if (product.hsnSac === '8541' || product.hsnSac === '8504') {
            newItem.gstRate = 13.8; // Solar Panels / Inverters (Composite)
        }

        setItems(prev => {
            // If only one empty item, replace it
            if (prev.length === 1 && !prev[0].description) {
                return [newItem];
            }
            return [...prev, newItem];
        });
        setIsCatalogOpen(false);
    };

    const calculateTotals = () => {
        const netAmount = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

        // Calculate GST per item
        let totalCgst = 0;
        let totalSgst = 0;

        items.forEach(item => {
            const amount = Number(item.amount) || 0;
            const gstRate = Number(item.gstRate) || 0;
            const itemGst = amount * (gstRate / 100);
            totalCgst += itemGst / 2;
            totalSgst += itemGst / 2;
        });

        const totalTax = totalCgst + totalSgst;
        const disc = Number(formData.cashDiscount) || 0;
        const ro = Number(formData.roundOff) || 0;
        
        const grandTotal = Math.max(0, Math.round(netAmount + totalTax - disc + ro));

        return {
            netAmount,
            cgst: totalCgst,
            sgst: totalSgst,
            totalTax,
            grandTotal
        };
    };

    const totals = calculateTotals();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.invoiceNumber) {
            toast.error("Please select a Sales Voucher from 'Fetch from Invoice Number' first");
            return;
        }

        setLoading(true);
        try {
            const submissionData = {
                ...formData,
                items,
                totals,
                lightBill,
                salesEmployeeName: formData.salesEmployeeName,
                salesEmployeeNumber: formData.salesEmployeeNumber,
                status: 'Draft'
            };
            await onSubmit(submissionData);
        } catch (error) {
            console.error('Submission failed', error);
        } finally {
            setLoading(false);
        }
    };

    const hasSolarPanels = items.some(item => item.isSolarPanel);

    return (
        <div className="min-h-screen bg-white transition-colors duration-200 invoice-form">
            {/* Header / Nav */}
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center gap-6">
                            <button onClick={onBack} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all active:scale-95 border border-transparent hover:border-slate-100">
                                <ArrowLeft size={22} />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                                    <FileText className="text-white" size={22} />
                                </div>
                                <div>
                                    <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none">{formTitle || 'Delivery Challan / Invoice'}</h1>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Delivery Management</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Icons removed as per request */}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Company Details Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                        <Building2 size={20} />
                                    </div>
                                    Company Details
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Select the issuing entity and delivery details.</p>
                            </div>

                            <div className="w-72 space-y-2">
                                <label className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                    <Receipt size={14} />
                                    Fetch from Invoice Number
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            toast("Refreshing Invoices...");
                                            initData();
                                        }}
                                        className="ml-auto text-[10px] bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-0.5 rounded-lg transition-all font-bold"
                                    >
                                        Refresh
                                    </button>
                                </label>
                                <select
                                    value={selectedInvoiceNo}
                                    onChange={(e) => handleInvoiceSelect(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 bg-blue-50/30 text-slate-900 font-bold focus:border-blue-500 transition-all outline-none"
                                >
                                    <option value="">Select Invoice to Auto-fill</option>
                                    {availableInvoices.map((inv: any) => (
                                        <option key={inv.id} value={inv.invoiceNumber}>
                                            {inv.invoiceNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Company Name</label>
                                <input
                                    type="text"
                                    name="fromCompanyName"
                                    value={formData.fromCompanyName}
                                    onChange={handleInputChange}
                                    placeholder="Enter Company Name"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-slate-50/50"
                                />
                            </div>


                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Invoice Date</label>
                                <input
                                    type="date"
                                    name="invoiceDate"
                                    value={formData.invoiceDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">GSTIN No.</label>
                                <input
                                    type="text"
                                    name="fromGstin"
                                    value={formData.fromGstin}
                                    onChange={handleInputChange}
                                    placeholder="Enter GSTIN"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 uppercase focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Payment Terms</label>
                                <input
                                    type="text"
                                    name="paymentTerms"
                                    value={formData.paymentTerms}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Net 30"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Mode of Dispatch</label>
                                <select
                                    name="modeOfDispatch"
                                    value={formData.modeOfDispatch}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                >
                                    <option value="By road">By Road</option>
                                    <option value="By air">By Air</option>
                                    <option value="By shipment">By Shipment</option>
                                    <option value="By rail">By Rail</option>
                                    <option value="By Cargo">By Cargo</option>
                                </select>
                            </div>

                            {/* Dynamic Logistics Fields */}
                            {(formData.modeOfDispatch && formData.modeOfDispatch !== '' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Transport Through</label>
                                        <select
                                            name="transportThrough"
                                            value={(formData as any).transportThrough || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        >
                                            <option value="">Select Option</option>
                                            {(() => {
                                                const mode = formData.modeOfDispatch.toLowerCase();
                                                let options: string[] = [];
                                                if (mode === 'by road') options = ['By Courier', 'By Bus', 'By Local Transport', 'By Personal Vehicle', 'By Tempo / Truck','Transport Agency'];
                                                else if (mode === 'by air') options = ['By Air Courier', 'By Commercial Flight Cargo', 'By Air Express Service'];
                                                else if (mode === 'by shipment') options = ['By Container Ship', 'By Bulk Carrier', 'By Port-to-Port Shipment', 'By Door-to-Door Sea Cargo'];
                                                else if (mode === 'by rail') options = ['By Goods Train', 'By Parcel Van', 'By Full Rake', 'By Container Rail'];
                                                else if (mode === 'by cargo') options = ['By Logistics Company', 'By Third-Party Transporter', 'By Warehouse Transfer', 'By Express Cargo Service'];

                                                return options.map(opt => <option key={opt} value={opt}>{opt}</option>);
                                            })()}
                                        </select>
                                    </div>

                                    {(formData as any).transportThrough && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                                                {(() => {
                                                    const sub = (formData as any).transportThrough;
                                                    if (sub === 'By Courier') return 'Docket No.';
                                                    if (sub === 'By Bus') return 'Bus No.';
                                                    if (['By Local Transport', 'By Personal Vehicle', 'By Tempo / Truck'].includes(sub)) return 'Vehicle No.';
                                                    if (sub === 'By Air Courier') return 'Airway Bill (AWB) No.';
                                                    if (sub === 'By Commercial Flight Cargo') return 'Flight No.';
                                                    if (sub === 'By Air Express Service') return 'Air Cargo Reference No.';
                                                    if (sub === 'By Container Ship') return 'Container No.';
                                                    if (sub === 'By Bulk Carrier') return 'Bill of Lading No.';
                                                    if (sub === 'By Port-to-Port Shipment') return 'Shipping Bill No.';
                                                    if (sub === 'By Door-to-Door Sea Cargo') return 'Sea Cargo Reference No.';
                                                    if (sub === 'By Goods Train') return 'Railway Receipt (RR) No.';
                                                    if (sub === 'By Parcel Van') return 'Parcel Receipt No.';
                                                    if (sub === 'By Full Rake') return 'Rake No.';
                                                    if (sub === 'By Container Rail') return 'Rail Container No.';
                                                    if (sub === 'By Logistics Company') return 'LR / GR No.';
                                                    if (sub === 'By Third-Party Transporter') return 'Transport Receipt No.';
                                                    if (sub === 'By Warehouse Transfer') return 'Transfer Reference No.';
                                                    if (sub === 'By Express Cargo Service') return 'Cargo Tracking No.';
                                                    return 'Reference Number';
                                                })()}
                                            </label>
                                            <input
                                                type="text"
                                                name="trackingNumber"
                                                value={(formData as any).trackingNumber || ''}
                                                onChange={handleInputChange}
                                                placeholder="Enter Reference No."
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                            />
                                        </div>
                                    )}
                                </>
                            ))}

                            {(formData as any).transportThrough === 'Transport Agency' && (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
      Description
    </label>
    <input
      type="text"
      name="transportDescription"
      value={(formData as any).transportDescription || ''}
      onChange={handleInputChange}
      placeholder="Enter Transport Agency Details"
      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50"
    />
  </div>
)}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Sales Employee Name</label>
                                <input
                                    type="text"
                                    name="salesEmployeeName"
                                    value={formData.salesEmployeeName}
                                    onChange={handleInputChange}
                                    placeholder="Employee Name"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Sales Contact No.</label>
                                <input
                                    type="tel"
                                    name="salesEmployeeNumber"
                                    value={formData.salesEmployeeNumber}
                                    onChange={handleInputChange}
                                    placeholder="Employee Number"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Bill To & Ship To Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bill To */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
                                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                        <Receipt size={20} />
                                    </div>
                                    Bill To Details
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsCreateLeadOpen(true)}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    New Lead
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Customer Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                handleInputChange(e);

                                                // Lead Search Logic
                                                setShowLeadResults(true);
                                                if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

                                                if (value.length > 1) {
                                                    setIsSearching(true);
                                                    searchTimeoutRef.current = setTimeout(() => handleLeadSearch(value), 300);
                                                } else {
                                                    setSearchResults([]);
                                                    setIsSearching(false);
                                                }
                                            }}
                                            onFocus={() => {
                                                setShowLeadResults(true);
                                                if (formData.customerName.length > 1) handleLeadSearch(formData.customerName);
                                            }}
                                            onBlur={() => setTimeout(() => setShowLeadResults(false), 200)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                                        />
                                        {/* Lead Search Dropdown */}
                                        {showLeadResults && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
                                                {isSearching && <div className="p-3 text-center text-slate-400 text-xs">Searching...</div>}

                                                {!isSearching && formData.customerName.length <= 1 && recentLeads.length > 0 && (
                                                    <>
                                                        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">Recently Created</div>
                                                        {recentLeads.map(lead => (
                                                            <button
                                                                key={lead.id}
                                                                type="button"
                                                                onMouseDown={(e) => { e.preventDefault(); selectLead(lead); }}
                                                                className="w-full text-left p-3 hover:bg-slate-100 flex items-center justify-between group transition-colors border-b border-slate-50 last:border-0"
                                                            >
                                                                <div>
                                                                    <div className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">{lead.name}</div>
                                                                    <div className="text-xs text-slate-400 flex items-center gap-2">
                                                                        {lead.company && <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{lead.company}</span>}
                                                                        <span>{lead.email}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-slate-300 group-hover:text-blue-500">
                                                                    <User size={14} />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </>
                                                )}

                                                {!isSearching && searchResults.length > 0 && (
                                                    <>
                                                        {formData.customerName.length > 1 && <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">Search Results</div>}
                                                        {searchResults.map(lead => (
                                                            <button
                                                                key={lead.id}
                                                                type="button"
                                                                onMouseDown={(e) => { e.preventDefault(); selectLead(lead); }}
                                                                className="w-full text-left p-3 hover:bg-slate-50 flex items-center justify-between group transition-colors border-b border-slate-50 last:border-0"
                                                            >
                                                                <div>
                                                                    <div className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">{lead.name}</div>
                                                                    <div className="text-xs text-slate-400 flex items-center gap-2">
                                                                        {lead.company && <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{lead.company}</span>}
                                                                        <span>{lead.email}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-slate-300 group-hover:text-blue-500">
                                                                    <User size={14} />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </>
                                                )}

                                                {!isSearching && formData.customerName.length > 1 && searchResults.length === 0 && (
                                                    <div className="p-4 text-center text-slate-500 text-sm">No leads found.</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Address</label>
                                    <textarea
                                        name="customerAddress"
                                        value={formData.customerAddress}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Contact No.</label>
                                        <input
                                            type="tel"
                                            name="customerContact"
                                            value={formData.customerContact}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">GSTIN/UIN</label>
                                        <input
                                            type="text"
                                            name="customerGstin"
                                            value={formData.customerGstin}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-50">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight block mb-3">Light Bill Upload</label>
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            id="light-bill-upload"
                                            accept="image/*,application/pdf"
                                        />
                                        <label
                                            htmlFor="light-bill-upload"
                                            className={`flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed transition-all cursor-pointer ${lightBill
                                                ? 'border-emerald-200 bg-emerald-50'
                                                : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-slate-100'
                                                }`}
                                        >
                                            {lightBill ? (
                                                <>
                                                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 mb-2">
                                                        <CheckCircle2 size={20} />
                                                    </div>
                                                    <p className="text-xs font-bold text-emerald-700 max-w-[80%] truncate px-2">
                                                        {lightBill.name}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setLightBill(null);
                                                        }}
                                                        className="mt-2 text-[10px] text-rose-500 font-bold hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="bg-white p-2 rounded-full shadow-sm mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                                        <Upload size={18} />
                                                    </div>
                                                    <p className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">Click to Upload Light Bill</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Ship To */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                            <div className="absolute top-8 right-8 flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm z-10">
                                <input
                                    type="checkbox"
                                    id="sameAsBillTo"
                                    checked={sameAsBillTo}
                                    onChange={(e) => setSameAsBillTo(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                                />
                                <label htmlFor="sameAsBillTo" className="text-xs font-bold text-slate-600 cursor-pointer uppercase tracking-tight">Same as Bill To</label>
                            </div>
                            <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
                                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                        <Truck size={20} />
                                    </div>
                                    Ship To Details
                                </h3>
                            </div>
                            <div className={`space-y-6 ${sameAsBillTo ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Recipient Name</label>
                                    <input
                                        type="text"
                                        name="recipientName"
                                        value={formData.recipientName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Shipping Address</label>
                                    <textarea
                                        name="shippingAddress"
                                        value={formData.shippingAddress}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">State Code</label>
                                        <input
                                            type="text"
                                            name="stateCode"
                                            value={formData.stateCode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Place of Supply</label>
                                        <input
                                            type="text"
                                            name="placeOfSupply"
                                            value={formData.placeOfSupply}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Item Details Table */}
                    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                                    <Tag size={20} />
                                </div>
                                Item Details
                            </h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="px-6 py-2.5 bg-amber-50 text-amber-600 rounded-xl text-sm font-bold hover:bg-amber-100 transition-all shadow-sm flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add Item
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCatalogOpen(true)}
                                className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all shadow-sm flex items-center gap-2"
                            >
                                <Layers size={18} />
                                Add from Catalog
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-12 text-center">#</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase min-w-[240px]">Item Description</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-28">HSN/SAC</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-20 text-right">Qty</th>
                                        {hasSolarPanels && <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-28 text-right">Watt</th>}
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-28 text-center">Unit</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-32 text-right">Rate</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-24 text-right">Disc %</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-32 text-right">GST %</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-40 text-right">Amount</th>
                                        <th className="px-4 py-4 w-12 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="px-4 py-6 text-sm text-slate-400 font-bold text-center">{idx + 1}</td>
                                            <td className="px-2 py-6">
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                    placeholder="Item Code"
                                                    className="w-full bg-transparent border-0 border-b border-transparent focus:border-amber-500 focus:ring-0 p-0 text-sm font-black text-slate-800 placeholder:text-slate-300"
                                                />
                                                <input
                                                    type="text"
                                                    value={item.subDescription}
                                                    onChange={(e) => handleItemChange(item.id, 'subDescription', e.target.value)}
                                                    placeholder="Detailed description"
                                                    className="w-full bg-transparent border-0 p-0 text-[11px] font-bold text-slate-500 mt-1 focus:ring-0 placeholder:text-slate-300"
                                                />
                                            </td>
                                            <td className="px-2 py-6">
                                                <input
                                                    type="text"
                                                    value={item.hsn}
                                                    onChange={(e) => handleItemChange(item.id, 'hsn', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700"
                                                />
                                            </td>
                                            <td className="px-2 py-6">
                                                <input
                                                    type="number"
                                                    value={item.qty}
                                                    onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-right focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700"
                                                />
                                            </td>
                                            {hasSolarPanels && (
                                                <td className="px-2 py-6">
                                                    {item.isSolarPanel ? (
                                                        <input
                                                            type="number"
                                                            value={item.watt}
                                                            onChange={(e) => handleItemChange(item.id, 'watt', e.target.value)}
                                                            className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-sm text-right focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-blue-700 shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="text-center text-slate-300">-</div>
                                                    )}
                                                </td>
                                            )}
                                            <td className="px-2 py-6">
                                                <input
                                                    type="text"
                                                    value={item.unit}
                                                    onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-center focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700"
                                                />
                                            </td>
                                            <td className="px-2 py-6">
                                                <input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-right focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700"
                                                />
                                            </td>
                                            <td className="px-4 py-6">
                                                <input
                                                    type="number"
                                                    value={item.discPercent}
                                                    onChange={(e) => handleItemChange(item.id, 'discPercent', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-right focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700"
                                                />
                                            </td>
                                            <td className="px-4 py-6">
                                                <select
                                                    value={item.gstRate}
                                                    onChange={(e) => handleItemChange(item.id, 'gstRate', e.target.value)}
                                                    className="w-full px-2 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-right focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                                                >
                                                    {[0, 0.5, 2.5, 3, 7, 11.5, 14.4, 18, 20, 28, 40].map(rate => (
                                                        <option key={rate} value={rate}>{rate}%</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-6 text-right text-sm font-black text-slate-900 font-mono">
                                                {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-6 text-right">
                                                {items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="size-8 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white ml-auto"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="border-t border-dashed border-2 border-slate-100">
                                        <td colSpan={10} onClick={addItem} className="py-8 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center justify-center gap-2 text-slate-400 font-bold">
                                                <Plus size={18} />
                                                Click to add new line item
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Totals & Extra Details */}
                        <div className="bg-slate-50/30 p-8 grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-slate-50">
                            <div className="lg:col-span-2 space-y-10">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight ml-1">Amount in Words</label>
                                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-500 italic flex items-center gap-3">
                                        <div className="size-2 bg-blue-400 rounded-full animate-pulse" />
                                        Calculated automatically based on grand total.
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight ml-1">Bank Details</label>
                                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-400 font-bold uppercase tracking-wider">Bank</span>
                                                <span className="font-black text-slate-800">{formData.bankName || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-400 font-bold uppercase tracking-wider">A/C No</span>
                                                <span className="font-black text-slate-800">{formData.bankAccountNo || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-400 font-bold uppercase tracking-wider">IFSC</span>
                                                <span className="font-black text-slate-800">{formData.bankIfsc || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight ml-1">Terms & Conditions</label>
                                        <textarea
                                            name="termsAndConditions"
                                            value={formData.termsAndConditions}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Enter terms..."
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-xs focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Final Sum */}
                            <div className="space-y-8">
                                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold uppercase tracking-tight">Net Amount</span>
                                        <span className="font-black text-slate-900 font-mono">₹ {totals.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold uppercase tracking-tight">Cash Discount</span>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="cashDiscount"
                                                value={formData.cashDiscount}
                                                onChange={handleInputChange}
                                                className="w-28 px-3 py-1.5 text-right bg-slate-50 rounded-lg border border-slate-200 font-black text-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold uppercase tracking-tight">CGST Tot.</span>
                                        <span className="font-black text-slate-900 font-mono">₹ {totals.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold uppercase tracking-tight">SGST Tot.</span>
                                        <span className="font-black text-slate-900 font-mono">₹ {totals.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-50">
                                        <span className="text-slate-500 font-bold uppercase tracking-tight">Round Off</span>
                                        <input
                                            type="number"
                                            name="roundOff"
                                            value={formData.roundOff}
                                            onChange={handleInputChange}
                                            className="w-28 px-3 py-1.5 text-right bg-slate-50 rounded-lg border border-slate-200 font-black text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 text-right">Grand Total Payable</p>
                                        <div className="flex justify-between items-end">
                                            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                                <Receipt size={24} />
                                            </div>
                                            <span className="text-3xl font-black text-blue-600 font-mono tracking-tighter">₹ {totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-16 flex justify-center items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 text-lg uppercase tracking-wider"
                                    >
                                        <Save size={24} className="mr-3" />
                                        {loading ? 'Saving...' : 'Generate Challan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </form>

                <CatalogItemSelector
                    isOpen={isCatalogOpen}
                    onClose={() => setIsCatalogOpen(false)}
                    onSelect={handleProductSelect}
                />

                {/* Create Lead Modal */}
                <CreateLeadModal
                    isOpen={isCreateLeadOpen}
                    onClose={() => setIsCreateLeadOpen(false)}
                    onSubmit={handleCreateLead}
                />
            </main>
        </div >
    );
};

export default DeliveryChallanForm;
