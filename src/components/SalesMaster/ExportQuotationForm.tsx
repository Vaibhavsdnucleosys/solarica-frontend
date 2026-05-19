import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    FileText,
    Bell,
    Settings,
    Moon,
    Sun,
    Building2,
    Tag,
    Receipt,
    Truck,
    Plus,
    Trash2,
    Save,
    Printer,
    Mail,
    PlusCircle,
    Layers,
    User
} from 'lucide-react';
import { createInvoice } from '../../services/invoiceService';
import { getNextEstimateNumber } from '../../services/quotationService';
import { searchLeads, getRecentLeads, Lead, searchInternationalLeads } from '../../services/leadService';
import CatalogItemSelector from '../Catalog/CatalogItemSelector';
import { CURRENCIES } from '../../constants/currencies';

interface ExportQuotationFormProps {
    onBack: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialCompany: string;
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
const defaultExportTerms = `1. Price quoted is FOB 
2. Warranty for full light is as per mentioned and discussed with customer. 
3. Payment terms 100 % in Advance with Purchase order.
4. Goods once sold will not be taken back at any cost unless warranted. 
5. Cancellation Charged 10% of Order Value. No Cancellation is allowed after Material is Produced/Procured. 
6. Solar Panel Warranty & Performance Warranty for Solar Panel is from OEM.`;

const ExportQuotationForm = ({ onBack, onSubmit, initialCompany }: ExportQuotationFormProps) => {
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
        modeOfDispatch: 'Road Transport',

        // Bill To
        customerName: '',
        customerEmail: '',
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
 termsAndConditions: defaultExportTerms,
        // Calculations
        cashDiscount: 0,
        roundOff: 0,

        // Export Specific
        currency: 'USD',
        conversionRate: 83.50,
        portOfLoading: '',
        portOfDischarge: '',
        countryOfOrigin: 'India',
        finalDestination: ''
    });

    // Lead Search State
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<Lead[]>([]);
    const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
    const [showLeadResults, setShowLeadResults] = useState(false);
    const searchTimeoutRef = React.useRef<any>(null);

    // Load recent leads on mount
    useEffect(() => {
        getRecentLeads().then(setRecentLeads).catch(err => console.error("Failed to load recent leads", err));
    }, []);

    const handleLeadSearch = async (query: string) => {
        if (!query) return;
        setIsSearching(true);
        try {
            // const results = await searchLeads(query);
            const results = await searchInternationalLeads(query);
setSearchResults(results);
            // setSearchResults(results || []);
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
            customerEmail: lead.email || '',
            customerContact: lead.phone,
            customerAddress: lead.company ? `${lead.company}\n` : '' // Append company to address
        }));
        setShowLeadResults(false);
        setSearchResults([]);
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
                recipientName: prev.customerName || '',
                shippingAddress: prev.customerAddress || '',
                stateCode: prev.stateCode || '',
                placeOfSupply: prev.placeOfSupply || ''
            }));
        }
    }, [sameAsBillTo, formData.customerName, formData.customerAddress, formData.stateCode, formData.placeOfSupply, initialCompany]);

    // [NEW] Fetch Estimate Number on Mount or Company Change
    useEffect(() => {
        const fetchEstimateNumber = async () => {
            if (formData.fromCompanyName) {
                try {
                    const num = await getNextEstimateNumber(formData.fromCompanyName);
                    setFormData(prev => ({ ...prev, invoiceNumber: num }));
                } catch (error) {
                    console.error("Failed to fetch estimate number", error);
                }
            }
        };
        fetchEstimateNumber();
    }, [formData.fromCompanyName]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;



        // Validation for Payment Terms - allow "Net X", "Net-X", or numeric days only
        if (name === 'paymentTerms') {
            // Allow: Net 30, Net-30, Net30, or just numbers
            const cleanedValue = value.replace(/[^a-zA-Z0-9\s-]/g, '');
            setFormData(prev => ({ ...prev, [name]: cleanedValue }));
            return;
        }

        // BILL-001: Customer Name - alphabets and spaces only, max 100 characters
        if (name === 'customerName') {
            const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 100);
            setFormData(prev => ({ ...prev, [name]: alphabetsOnly }));
            return;
        }

        // BILL-002: Customer Contact - digits only, max 10 digits
        if (name === 'customerContact') {
            const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: digitsOnly }));
            return;
        }

        // BILL-003: Customer GSTIN - alphanumeric only, max 15 characters (uppercase)
        if (name === 'customerGstin') {
            const alphanumericOnly = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 15);
            setFormData(prev => ({ ...prev, [name]: alphanumericOnly }));
            return;
        }

        // SHIP-001: Recipient Name - alphabets and spaces only, max 100 characters
        if (name === 'recipientName') {
            const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 100);
            setFormData(prev => ({ ...prev, [name]: alphabetsOnly }));
            return;
        }

        // SHIP-002: Shipping Address - sanitize script-like input, max 500 characters
        if (name === 'shippingAddress') {
            const sanitized = value.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').slice(0, 500);
            setFormData(prev => ({ ...prev, [name]: sanitized }));
            return;
        }

        // SHIP-003: State Code - digits only, max 2 digits (valid Indian state codes are 01-37)
        if (name === 'stateCode') {
            const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 2);
            setFormData(prev => ({ ...prev, [name]: digitsOnly }));
            return;
        }

        // SHIP-004: Place of Supply - alphabets and spaces only, max 100 characters
        if (name === 'placeOfSupply') {
            const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 100);
            setFormData(prev => ({ ...prev, [name]: alphabetsOnly }));
            return;
        }

        // BILL-004: Customer Address - sanitize and limit to 500 characters
        if (name === 'customerAddress') {
            // Remove script tags and limit length
            const sanitized = value.replace(/<[^>]*>/g, '').slice(0, 500);
            setFormData(prev => ({ ...prev, [name]: sanitized }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (id: number, field: keyof ItemRow, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                let processedValue = value;

                // ITEM-001: Item Code (description) - alphanumeric + hyphen only, max 50 chars
                if (field === 'description') {
                    processedValue = value.replace(/[^a-zA-Z0-9\\s-]/g, '').slice(0, 50);
                }

                // ITEM-002: Detailed Description - sanitize script-like input, max 200 chars
                if (field === 'subDescription') {
                    processedValue = value.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').slice(0, 200);
                }

                // ITEM-003: HSN/SAC - digits only, 4-8 digits
                if (field === 'hsn') {
                    processedValue = value.replace(/[^0-9]/g, '').slice(0, 8);
                }

                const updatedItem = { ...item, [field]: processedValue };
                // Recalculate amount: ((qty * rate * watt) - discount) + GST
                if (field === 'qty' || field === 'rate' || field === 'discPercent' || field === 'watt' || field === 'gstRate') {
                    const qty = (field === 'qty' ? parseFloat(processedValue) : item.qty) || 0;
                    const rate = (field === 'rate' ? parseFloat(processedValue) : item.rate) || 0;
                    const watt = (field === 'watt' ? parseFloat(processedValue) : item.watt) || 0;
                    const disc = (field === 'discPercent' ? parseFloat(processedValue) : item.discPercent) || 0;
                    const gst = (field === 'gstRate' ? parseFloat(processedValue) : item.gstRate) || 0;

                    let baseAmount = qty * rate;
                    if (updatedItem.isSolarPanel && watt > 0) {
                        baseAmount = qty * rate * watt;
                    }

                    const afterDiscount = baseAmount - (baseAmount * (disc / 100));
                    const gstAmount = afterDiscount * (gst / 100);
                    updatedItem.amount = Math.max(0, afterDiscount + gstAmount);
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
        const netAmount = items.reduce((sum, item) => sum + item.amount, 0);

        // Calculate GST per item
        let totalCgst = 0;
        let totalSgst = 0;

        items.forEach(item => {
            const itemGst = item.amount * (item.gstRate / 100);
            totalCgst += itemGst / 2;
            totalSgst += itemGst / 2;
        });

        const totalTax = totalCgst + totalSgst;
        const grandTotal = Math.max(0, Math.round(netAmount + totalTax - (formData.cashDiscount || 0) + (formData.roundOff || 0)));

        return {
            netAmount,
            cgst: totalCgst,
            sgst: totalSgst,
            totalTax,
            grandTotal
        };
    };

    const totals = calculateTotals();

    // Check if at least one valid item exists
    const hasValidItem = items.some(item =>
        item.description.trim() !== '' &&
        item.qty > 0 &&
        item.rate > 0
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate at least one item is added
        if (!hasValidItem) {
            alert('Please add at least one item with Item Code, Quantity, and Rate before saving.');
            return;
        }

        setLoading(true);
        try {
            const submissionData = {
                ...formData,
                items,
                totals,
                status: 'Draft',
                category: 'EXPORT'
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
                                    <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none">Export Invoice Entry</h1>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quotation Management</p>
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
                                <p className="text-sm text-slate-500 mt-1">Select the issuing entity and estimate basics.</p>
                            </div>
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                STATUS: DRAFT
                            </span>
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
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Estimate Number</label>
                                <div className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-bold font-mono">
                                    {formData.invoiceNumber || 'Loading...'}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Estimate Date</label>
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
                                    placeholder="e.g. Net 30, Net 45"
                                    title="Enter valid payment terms (e.g. Net 30, Net 45) or numeric days"
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
                                    <option>Road Transport</option>
                                    <option>Courier</option>
                                    <option>Hand Delivery</option>
                                </select>
                            </div>
                        </div>

                        {/* Export Specific Details */}
                        <div className="bg-slate-50/50 p-6 rounded-xl border border-blue-100 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Currency</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                >
                                    {CURRENCIES.map(curr => (
                                        <option key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Port of Loading</label>
                                <input
                                    type="text"
                                    name="portOfLoading"
                                    value={formData.portOfLoading}
                                    onChange={handleInputChange}
                                    placeholder="e.g. NHT, Mumbai"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Port of Discharge</label>
                                <input
                                    type="text"
                                    name="portOfDischarge"
                                    value={formData.portOfDischarge}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Dubai"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Country of Origin</label>
                                <input
                                    type="text"
                                    name="countryOfOrigin"
                                    value={formData.countryOfOrigin}
                                    onChange={handleInputChange} // Fix: Changed from readonly to editable if needed, but usually static
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Final Destination</label>
                                <input
                                    type="text"
                                    name="finalDestination"
                                    value={formData.finalDestination}
                                    onChange={handleInputChange}
                                    placeholder="e.g. UAE"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
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
                                <button type="button" className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all">Select Customer</button>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Customer Name <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={(e) => {
                                                // Apply alphabets-only validation before passing to handler
                                                const value = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 100);
                                                const syntheticEvent = { ...e, target: { ...e.target, value, name: 'customerName' } };
                                                handleInputChange(syntheticEvent as any);

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
                                            placeholder="Enter customer name (alphabets only)"
                                            maxLength={100}
                                            required
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
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Customer Email</label>
                                    <input
                                        type="email"
                                        name="customerEmail"
                                        value={formData.customerEmail}
                                        onChange={handleInputChange}
                                        placeholder="Required for sending email"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Address <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="customerAddress"
                                        value={formData.customerAddress}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Enter complete address"
                                        maxLength={500}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Contact No. <span className="text-red-500">*</span></label>
                                        <input
                                            type="tel"
                                            name="customerContact"
                                            value={formData.customerContact}
                                            onChange={handleInputChange}
                                            placeholder="10 digit number"
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                            title="Please enter exactly 10 digits"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">GSTIN/UIN <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="customerGstin"
                                            value={formData.customerGstin}
                                            onChange={handleInputChange}
                                            placeholder="15 character GSTIN"
                                            maxLength={15}
                                            pattern="[A-Z0-9]{15}"
                                            title="Please enter a valid 15-character GSTIN"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 uppercase focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                                        />
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
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Recipient Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="recipientName"
                                        value={formData.recipientName}
                                        onChange={handleInputChange}
                                        maxLength={100}
                                        placeholder="Alphabets and spaces only"
                                        className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none ${sameAsBillTo && formData.recipientName ? 'bg-slate-100' : ''}`}
                                        readOnly={sameAsBillTo && !!formData.recipientName}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Shipping Address <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="shippingAddress"
                                        value={formData.shippingAddress}
                                        onChange={handleInputChange}
                                        rows={3}
                                        maxLength={500}
                                        placeholder="Enter shipping address"
                                        className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none ${sameAsBillTo && formData.shippingAddress ? 'bg-slate-100' : ''}`}
                                        readOnly={sameAsBillTo && !!formData.shippingAddress}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">State Code <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="stateCode"
                                            value={formData.stateCode}
                                            onChange={handleInputChange}
                                            maxLength={2}
                                            placeholder="e.g., 27"
                                            className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none ${sameAsBillTo && formData.stateCode ? 'bg-slate-100' : ''}`}
                                            readOnly={sameAsBillTo && !!formData.stateCode}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Place of Supply <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="placeOfSupply"
                                            value={formData.placeOfSupply}
                                            onChange={handleInputChange}
                                            maxLength={100}
                                            placeholder="Enter place of supply"
                                            className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none ${sameAsBillTo && formData.placeOfSupply ? 'bg-slate-100' : ''}`}
                                            readOnly={sameAsBillTo && !!formData.placeOfSupply}
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
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase min-w-[180px]">Item Description</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-28">HSN/SAC</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-24 text-center">Qty</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-28 text-center">Watt</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-28 text-center">Unit</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-32 text-center">Rate</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-24 text-center">Disc %</th>
                                        <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-24 text-center">GST %</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-36 text-right">Amount</th>
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
                                                    maxLength={50}
                                                    className="w-full bg-transparent border-0 border-b border-transparent focus:border-amber-500 focus:ring-0 p-0 text-sm font-black text-slate-800 placeholder:text-slate-300"
                                                />
                                                <input
                                                    type="text"
                                                    value={item.subDescription}
                                                    onChange={(e) => handleItemChange(item.id, 'subDescription', e.target.value)}
                                                    placeholder="Detailed description"
                                                    maxLength={200}
                                                    className="w-full bg-transparent border-0 p-0 text-[11px] font-bold text-slate-500 mt-1 focus:ring-0 placeholder:text-slate-300"
                                                />
                                            </td>
                                            <td className="px-2 py-6">
                                                <input
                                                    type="text"
                                                    value={item.hsn}
                                                    onChange={(e) => handleItemChange(item.id, 'hsn', e.target.value)}
                                                    placeholder="4-8 digits"
                                                    maxLength={8}
                                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700 text-center"
                                                />
                                            </td>
                                            <td className="px-2 py-6">
                                                <input
                                                    type="number"
                                                    value={item.qty}
                                                    min="0"
                                                    onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                                                    className="w-full px-2 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-center focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                            </td>
                                            {/* ITEM-004: WATT column - always visible and editable */}
                                            <td className="px-2 py-6">
                                                <input
                                                    type="number"
                                                    value={item.watt || ''}
                                                    min="0"
                                                    onChange={(e) => handleItemChange(item.id, 'watt', e.target.value)}
                                                    placeholder="0"
                                                    className="w-full px-2 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-center focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                            </td>
                                            {/* ITEM-005: Unit column - dropdown with valid values */}
                                            <td className="px-2 py-6">
                                                <select
                                                    value={item.unit}
                                                    onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                                                    className="w-full px-1 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-center focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700 cursor-pointer"
                                                >
                                                    <option value="NOS">NOS</option>
                                                    <option value="PCS">PCS</option>
                                                    <option value="MTR">MTR</option>
                                                    <option value="KG">KG</option>
                                                    <option value="LTR">LTR</option>
                                                    <option value="SET">SET</option>
                                                    <option value="BOX">BOX</option>
                                                    <option value="PAIR">PAIR</option>
                                                    <option value="ROLL">ROLL</option>
                                                    <option value="SQM">SQM</option>
                                                    <option value="SQFT">SQFT</option>
                                                    <option value="WATT">WATT</option>
                                                    <option value="KW">KW</option>
                                                </select>
                                            </td>
                                            {/* ITEM-006: Rate column - proper center alignment */}
                                            <td className="px-2 py-6">
                                                <input
                                                    type="number"
                                                    value={item.rate}
                                                    min="0"
                                                    onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-center focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700"
                                                />
                                            </td>
                                            {/* ITEM-009: Discount % - show numeric value clearly */}
                                            <td className="px-2 py-6">
                                                <input
                                                    type="number"
                                                    value={item.discPercent}
                                                    min="0"
                                                    max="100"
                                                    step="0.5"
                                                    onChange={(e) => handleItemChange(item.id, 'discPercent', e.target.value)}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-center focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                            </td>
                                            <td className="px-2 py-6">
                                                <input
                                                    type="number"
                                                    value={item.gstRate}
                                                    min="0"
                                                    max="100"
                                                    step="0.5"
                                                    onChange={(e) => handleItemChange(item.id, 'gstRate', e.target.value)}
                                                    placeholder="0"
                                                    className="w-full px-2 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-center focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
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
                                        <td colSpan={11} onClick={addItem} className="py-8 text-center cursor-pointer hover:bg-slate-50 transition-colors">
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
                                        disabled={loading || !hasValidItem}
                                        className="w-full h-16 flex justify-center items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-wider"
                                    >
                                        <Save size={24} className="mr-3" />
                                        {loading ? 'Saving...' : 'Save Estimate'}
                                    </button>
                                    {!hasValidItem && (
                                        <p className="text-xs text-amber-600 font-semibold text-center">
                                            Add at least one item with Item Code, Quantity, and Rate to save
                                        </p>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <button type="button" className="flex justify-center items-center py-4 border border-slate-200 bg-white text-slate-700 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95 leading-none">
                                            <Printer size={18} className="mr-2" />
                                            PRINT
                                        </button>
                                        <button type="button" className="flex justify-center items-center py-4 border border-slate-200 bg-white text-slate-700 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95 leading-none">
                                            <Mail size={18} className="mr-2" />
                                            EMAIL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tax Breakdown */}
                    <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                        <h4 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3">
                            <div className="size-2 bg-slate-400 rounded-full" />
                            Tax Breakdown (GST Logic)
                        </h4>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-tighter">HSN/SAC</th>
                                    <th className="px-6 py-4 text-right font-black text-slate-500 uppercase tracking-tighter">Taxable Value</th>
                                    <th className="px-6 py-4 text-right font-black text-slate-500 uppercase tracking-tighter bg-blue-50/30" colSpan={2}>Central Tax</th>
                                    <th className="px-6 py-4 text-right font-black text-slate-500 uppercase tracking-tighter bg-green-50/30" colSpan={2}>State Tax</th>
                                    <th className="px-6 py-4 text-right font-black text-slate-500 uppercase tracking-tighter">Total Tax</th>
                                </tr>
                                <tr className="bg-slate-50/30 border-t border-slate-50">
                                    <th className="px-6 py-2"></th>
                                    <th className="px-6 py-2"></th>
                                    <th className="px-6 py-2 text-right text-slate-400 font-bold uppercase text-[10px]">Rate</th>
                                    <th className="px-6 py-2 text-right text-slate-400 font-bold uppercase text-[10px]">Amount</th>
                                    <th className="px-6 py-2 text-right text-slate-400 font-bold uppercase text-[10px]">Rate</th>
                                    <th className="px-6 py-2 text-right text-slate-400 font-bold uppercase text-[10px]">Amount</th>
                                    <th className="px-6 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {items.filter(i => i.qty > 0).map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/20 transition-all font-mono">
                                        <td className="px-6 py-4 font-black text-slate-600">{item.hsn || '-'}</td>
                                        <td className="px-6 py-4 text-right font-black text-slate-600">{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-4 text-right font-black bg-blue-50/10 text-slate-500">9%</td>
                                        <td className="px-6 py-4 text-right font-black bg-blue-50/10 text-slate-600">{(item.amount * 0.09).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-4 text-right font-black bg-green-50/10 text-slate-500">9%</td>
                                        <td className="px-6 py-4 text-right font-black bg-green-50/10 text-slate-600">{(item.amount * 0.09).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-4 text-right font-black text-slate-900">{(item.amount * 0.18).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                ))}
                                <tr className="bg-slate-50/50 font-black text-sm">
                                    <td className="px-6 py-6 text-right text-slate-400" colSpan={2}>Net Total: <span className="text-slate-900">₹ {totals.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></td>
                                    <td className="px-6 py-6" colSpan={2}></td>
                                    <td className="px-6 py-6 text-right text-blue-600" colSpan={2}>GST Total: ₹ {totals.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-6 text-right text-blue-600">₹ {totals.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* Brand Logos */}
                    <div className="flex flex-wrap justify-center gap-10 opacity-30 hover:opacity-100 transition-all duration-700 pt-16 pb-8">
                        {['POLYCAB', 'HAVELLS', 'ANCHOR', 'SIEMENS', 'LEGRAND'].map(brand => (
                            <div key={brand} className="text-[11px] font-black text-slate-400 border border-slate-200 px-5 py-2 rounded-2xl tracking-[0.3em] hover:text-blue-600 hover:border-blue-200 transition-all hover:-translate-y-1">
                                {brand}
                            </div>
                        ))}
                    </div>
                </form>

                <CatalogItemSelector
                    isOpen={isCatalogOpen}
                    onClose={() => setIsCatalogOpen(false)}
                    onSelect={handleProductSelect}
                />
            </main>
        </div >
    );
};

export default ExportQuotationForm;
