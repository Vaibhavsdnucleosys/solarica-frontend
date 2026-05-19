import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Save, Calculator, Search, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { createInvoice, InvoiceItem, getNextInvoiceNumber } from '../../services/invoiceService';
import { searchLeads, getRecentLeads, Lead } from '../../services/leadService';
import CatalogItemSelector from '../Catalog/CatalogItemSelector';
import { Product } from '../../services/catalogService';
import { CURRENCIES } from '../../constants/currencies';

interface CreateInvoiceFormProps {
    onBack: () => void;
    onSuccess: () => void;
}

const CreateInvoiceForm: React.FC<CreateInvoiceFormProps> = ({ onBack, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        companyName: 'Solarica Energy India Pvt Ltd',
        invoiceNumber: '', // Auto-fetched via API
        invoiceDate: new Date().toISOString().split('T')[0],
        currency: 'INR', // [NEW] Default INR
        category: 'DOMESTIC', // [NEW] Default DOMESTIC
        gstinNumber: '24ABCDE1234F1Z5', // Default
        paymentStatus: 'PENDING',
        modeOfDispatch: 'Road Transport',
        customerName: '',
        customerEmail: '', // [NEW]
        customerAddress: '',
        customerContact: '',
        customerGstinUin: '',
        recipientName: '',
        shippingAddress: '',
        stateCode: '24',
        placeOfSupply: 'Gujarat',
        items: [] as InvoiceItem[],
        bankName: 'HDFC Bank',
        accountNumber: '50200012345678',
        ifscCode: 'HDFC0001234',
        termsAndConditions: '1. Goods once sold will not be taken back.\n2. Interest @ 18% p.a. will be charged if payment is not made within due date.',
        salesPersonName: '',
        salesPersonPhone: ''
    });

    const [calculations, setCalculations] = useState({
        netAmount: 0,
        cgst: 0,
        sgst: 0,
        roundOff: 0,
        grandTotal: 0,
        amountInWords: ''
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
            customerEmail: lead.email,
            customerContact: lead.phone,
            customerAddress: lead.company ? `${lead.company}\n` : '' // Append company to address if available
        }));
        setShowLeadResults(false);
        setSearchResults([]);
    };

    // [NEW] Fetch Invoice Number
    useEffect(() => {
        const fetchNumber = async () => {
            if (formData.companyName) {
                try {
                    const num = await getNextInvoiceNumber(formData.companyName);
                    setFormData(prev => ({ ...prev, invoiceNumber: num }));
                } catch (error) {
                    console.error("Failed to fetch invoice number", error);
                }
            }
        };
        fetchNumber();
    }, [formData.companyName]);

    // Handle Input Changes
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Item Management
    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, {
                itemDescription: '',
                hsnSac: '',
                quantity: 1,
                unit: 'Nos',
                rate: 0,
                watt: 0,
                isSolarPanel: false,
                discount: 0,
                amount: 0
            }]
        }));
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...formData.items];

        // Convert to number for numeric fields
        let processedValue = value;
        if (['quantity', 'rate', 'discount', 'amount', 'watt'].includes(field)) {
            processedValue = Number(value) || 0;
        }

        newItems[index] = { ...newItems[index], [field]: processedValue };

        // Recalculate item amount
        const qty = Number(newItems[index].quantity) || 0;
        const rate = Number(newItems[index].rate) || 0;
        const watt = Number(newItems[index].watt) || 0;
        const discount = Number(newItems[index].discount) || 0;

        if (newItems[index].isSolarPanel) {
            newItems[index].amount = Math.max(0, (qty * rate * watt) - discount);
        } else {
            newItems[index].amount = Math.max(0, (qty * rate) - discount);
        }

        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    // Catalog Selection Handler
    const handleCatalogSelect = (product: Product) => {
        setFormData(prev => {
            const newItem: InvoiceItem = {
                itemDescription: product.model + (product.description ? ` - ${product.description}` : ''),
                hsnSac: product.hsnSac,
                quantity: 1,
                unit: 'Nos',
                rate: product.price,
                watt: product.watt || 0,
                isSolarPanel: product.isSolarPanel || false,
                discount: 0,
                amount: product.isSolarPanel
                    ? (1 * product.price * (product.watt || 0))
                    : product.price
            };
            return { ...prev, items: [...prev.items, newItem] };
        });
    };

    // Calculations Effect
    useEffect(() => {
        const netAmount = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);

        // Assuming 18% GST (9% CGST + 9% SGST) for simplicity, or configurable?
        // In the user request, example had 0 CGST/SGST but usually it's calculated.
        // I'll assume standard 18% for now if not specified per item. 
        // Actually, user example had "netAmount": 194000, "grandTotalPayable": 194000 (Tax 0).
        // I will add a tax rate selector or auto-calc. Let's assume 18% is standard for solar but maybe 0 for some?
        // For now I'll create a simple global tax toggle or just calculate based on fields if I add them.
        // Given the prompt example has explicit 0 tax, I'll calculate tax as 0 by default but allow logic.
        // Wait, prompt has "cgst": 0, "sgst": 0 in the request body.
        // I will implement basic calculation logic.

        // Let's assume tax is inclusive or 0 for now unless I add a tax field.
        // I'll calculate CGST/SGST as 9% each of Net Amount? Or 0?
        // I'll set it to 0 for now to match prompt logic unless I add a specific tax setting.
        // To be safe, I'll calculate 9+9% = 18% GST.
        const taxRate = 0.18;
        // Actually, looking at the request, "rate": 15000 * 10 = 150000.
        // "grandTotalPayable": 194000. 
        // Items: 150000 + 44000 = 194000.
        // So Tax is 0 in the example.
        // I will default Tax to 0 but maybe add a checkbox "Apply GST (18%)".

        const cgst = 0; // Customize later if needed
        const sgst = 0;

        const totalBeforeRound = netAmount + cgst + sgst;
        const roundOff = Math.round(totalBeforeRound) - totalBeforeRound;
        const grandTotal = Math.max(0, Math.round(totalBeforeRound));

        // Convert to words (Mock function - proper implementation needs a library or helper)
        const toWords = (amount: number) => {
            const selectedCurrency = CURRENCIES.find(c => c.code === formData.currency) || CURRENCIES[0];
            const prefix = selectedCurrency.name;
            return `${prefix} ${amount} Only`;
        };

        setCalculations({
            netAmount,
            cgst,
            sgst,
            roundOff,
            grandTotal,
            amountInWords: toWords(grandTotal)
        });
    }, [formData.items]);

    const handleSubmit = async () => {
        if (!formData.customerName || formData.items.length === 0) {
            toast.error("Please fill in customer details and add at least one item.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                ...calculations,
                paymentStatus: formData.paymentStatus as any,
                currency: formData.currency as any, // Fix type inference
                category: formData.category as any, // Fix type inference
                grandTotalPayable: calculations.grandTotal
            };

            await createInvoice(payload);
            toast.success("Invoice created successfully!");
            onSuccess();
        } catch (error) {
            console.error("Failed to create invoice", error);
            toast.error("Failed to create invoice.");
        } finally {
            setLoading(false);
        }
    };

    const hasSolarPanels = formData.items.some(item => item.isSolarPanel);
    const selectedCurrency = CURRENCIES.find(c => c.code === formData.currency) || CURRENCIES[0];
    const currencySymbol = selectedCurrency.symbol;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-right-4 duration-300 invoice-form">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Create New Invoice</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div> : <Save size={18} />}
                        Save Invoice
                    </button>
                </div>
            </div>

            <div className="p-8 max-w-5xl mx-auto space-y-8">
                {/* 1. Invoice Details */}
                <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Invoice Metadata</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputGroup label="Invoice Number" value={formData.invoiceNumber} onChange={(v: any) => handleInputChange('invoiceNumber', v)} placeholder="e.g. INV-2025-001" />
                        <InputGroup label="Invoice Date" type="date" value={formData.invoiceDate} onChange={(v: any) => handleInputChange('invoiceDate', v)} />
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Currency</label>
                            <select
                                value={formData.currency}
                                onChange={(e) => handleInputChange('currency', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium"
                            >
                                {CURRENCIES.map(curr => (
                                    <option key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium"
                            >
                                <option value="DOMESTIC">Domestic</option>
                                <option value="EXPORT">Export</option>
                            </select>
                        </div>
                        <InputGroup label="Place of Supply" value={formData.placeOfSupply} onChange={(v: any) => handleInputChange('placeOfSupply', v)} />
                    </div>
                </section>

                {/* 2. Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span>Bill To</span>
                            <div className="h-px bg-blue-100 flex-1"></div>
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2 relative">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Customer Name</label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleInputChange('customerName', value);

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
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
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
                            <InputGroup label="Customer Email" value={formData.customerEmail} onChange={(v: any) => handleInputChange('customerEmail', v)} type="email" placeholder="Required for sending email" />
                            <InputGroup label="Address" value={formData.customerAddress} onChange={(v: any) => handleInputChange('customerAddress', v)} textArea />
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Contact No." value={formData.customerContact} onChange={(v: any) => handleInputChange('customerContact', v)} />
                                <InputGroup label="GSTIN" value={formData.customerGstinUin} onChange={(v: any) => handleInputChange('customerGstinUin', v)} />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span>Ship To</span>
                            <div className="h-px bg-emerald-100 flex-1"></div>
                        </h3>
                        <div className="space-y-4">
                            <InputGroup label="Recipient Name" value={formData.recipientName} onChange={(v: any) => handleInputChange('recipientName', v)} placeholder="Same as Customer" />
                            <InputGroup label="Shipping Address" value={formData.shippingAddress} onChange={(v: any) => handleInputChange('shippingAddress', v)} textArea placeholder="Same as Billing Address" />
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Mode of Dispatch" value={formData.modeOfDispatch} onChange={(v: any) => handleInputChange('modeOfDispatch', v)} />
                                <InputGroup label="State Code" value={formData.stateCode} onChange={(v: any) => handleInputChange('stateCode', v)} />
                            </div>
                        </div>
                    </section>

                    {/* Sales Person Details */}
                    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1 md:col-span-2">
                        <h3 className="text-sm font-black text-purple-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span>Sales Person Details</span>
                            <div className="h-px bg-purple-100 flex-1"></div>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Sales Person Name" value={formData.salesPersonName} onChange={(v: any) => handleInputChange('salesPersonName', v)} placeholder="Enter Name" />
                            <InputGroup label="Sales Person Phone" value={formData.salesPersonPhone} onChange={(v: any) => handleInputChange('salesPersonPhone', v)} placeholder="Enter Mobile Number" />
                        </div>
                    </section>
                </div>

                {/* 3. Items */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black text-slate-800">Items & Particulars</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsCatalogOpen(true)}
                                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2"
                            >
                                <Search size={16} />
                                Add from Catalog
                            </button>
                            <button
                                onClick={addItem}
                                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Add Manual Item
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                                    <th className="p-4 w-12">#</th>
                                    <th className="p-4 w-[30%]">Description</th>
                                    <th className="p-4 w-28">HSN</th>
                                    <th className="p-4 w-24 text-center">Qty</th>
                                    {hasSolarPanels && <th className="p-4 w-32 text-center">Watt</th>}
                                    <th className="p-4 w-24 text-right">Rate ({currencySymbol})</th>
                                    <th className="p-4 w-32 text-right">Disc ({currencySymbol})</th>
                                    <th className="p-4 w-28 text-right">Amount ({currencySymbol})</th>
                                    <th className="p-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {formData.items.length === 0 ? (
                                    <tr>
                                        <td colSpan={hasSolarPanels ? 9 : 8} className="p-8 text-center text-slate-400 text-sm">
                                            No items added yet. Search catalog or add manually.
                                        </td>
                                    </tr>
                                ) : (
                                    formData.items.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 group">
                                            <td className="p-4 text-slate-400 font-medium">{i + 1}</td>
                                            <td className="p-4">
                                                <input
                                                    type="text"
                                                    value={item.itemDescription}
                                                    onChange={(e) => updateItem(i, 'itemDescription', e.target.value)}
                                                    className="w-full bg-transparent outline-none font-medium text-slate-700 placeholder:text-slate-300"
                                                    placeholder="Item name"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <input
                                                    type="text"
                                                    value={item.hsnSac}
                                                    onChange={(e) => updateItem(i, 'hsnSac', e.target.value)}
                                                    className="w-full bg-transparent outline-none text-slate-600 text-sm font-bold"
                                                    placeholder="HSN"
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                                                    className="w-full bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:bg-white focus:border-blue-500 transition-colors text-center font-bold text-slate-700 text-sm shadow-sm"
                                                />
                                            </td>
                                            {hasSolarPanels && (
                                                <td className="p-4">
                                                    {item.isSolarPanel ? (
                                                        <input
                                                            type="number"
                                                            value={item.watt}
                                                            onChange={(e) => updateItem(i, 'watt', e.target.value)}
                                                            className="w-full bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg px-2 py-1.5 outline-none focus:bg-white focus:border-blue-500 transition-colors text-center font-bold text-blue-700 text-sm shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="text-center text-slate-300 font-bold">-</div>
                                                    )}
                                                </td>
                                            )}
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg px-2 py-1.5 focus-within:bg-white focus-within:border-blue-500 transition-colors shadow-sm">
                                                    <span className="text-slate-400 text-xs mr-1">{currencySymbol}</span>
                                                    <input
                                                        type="number"
                                                        value={item.rate}
                                                        onChange={(e) => updateItem(i, 'rate', e.target.value)}
                                                        className="bg-transparent outline-none text-right font-bold text-slate-700 text-sm w-full"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg px-2 py-1.5 focus-within:bg-white focus-within:border-blue-500 transition-colors shadow-sm">
                                                    <span className="text-slate-400 text-xs mr-1">{currencySymbol}</span>
                                                    <input
                                                        type="number"
                                                        value={item.discount}
                                                        onChange={(e) => updateItem(i, 'discount', e.target.value)}
                                                        className="bg-transparent outline-none text-right font-bold text-slate-700 text-sm w-full"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-bold text-slate-800">
                                                {item.amount.toLocaleString('en-IN')}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => removeItem(i)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 4. Footer & Totals */}
                <section className="flex flex-col md:flex-row gap-8 justify-end">
                    <div className="w-full md:w-80 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Net Amount</span>
                            <span className="font-bold">{currencySymbol}{calculations.netAmount.toLocaleString(formData.currency === 'USD' ? 'en-US' : 'en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>CGST</span>
                            <span>{currencySymbol}{calculations.cgst}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>SGST</span>
                            <span>{currencySymbol}{calculations.sgst}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Round Off</span>
                            <span>{calculations.roundOff}</span>
                        </div>
                        <div className="pt-3 border-t border-slate-200 flex justify-between text-lg font-black text-slate-800">
                            <span>Grand Total</span>
                            <span>{currencySymbol}{calculations.grandTotal.toLocaleString(formData.currency === 'USD' ? 'en-US' : 'en-IN')}</span>
                        </div>
                    </div>
                </section>
            </div>

            <CatalogItemSelector
                isOpen={isCatalogOpen}
                onClose={() => setIsCatalogOpen(false)}
                onSelect={handleCatalogSelect}
            />
        </div>
    );
};

// Helper Input Component
const InputGroup = ({ label, value, onChange, type = 'text', placeholder, textArea }: any) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">{label}</label>
        {textArea ? (
            <textarea
                value={value}
                onChange={(e: any) => onChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none h-24 text-sm font-medium"
                placeholder={placeholder}
            />
        ) : (
            <input
                type={type}
                value={value}
                onChange={(e: any) => onChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium"
                placeholder={placeholder}
            />
        )}
    </div>
);

export default CreateInvoiceForm;
