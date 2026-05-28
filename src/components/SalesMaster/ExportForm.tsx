import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, ArrowLeft, Save, FileText, Building2, Receipt, Truck, Tag, RefreshCw } from 'lucide-react';
import CatalogItemSelector from '../Catalog/CatalogItemSelector';
import { Product } from '../../services/catalogService';
import { getNextExportEstimateNumber } from '../../services/invoiceService';
import { CURRENCIES } from '../../constants/currencies';
import { createLead, searchInternationalLeads } from '../../services/leadService';
import CreateLeadModal from './CreateLeadModal';
interface ExportFormProps {
    onBack: () => void;
    onSubmit: (data: any) => Promise<void>;
    loading?: boolean;
}

interface ExportItem {
    itemDescription: string;
    hsnSac: string;
    quantity: number;
    unit: string;
    rate: number;
    watt?: number;
    isSolarPanel?: boolean;
    discount: number;
    amount: number;
}

const ExportForm: React.FC<ExportFormProps> = ({ onBack, onSubmit, loading }) => {
    const defaultTerms = `1. Price quoted is FOB 
2. Warranty for full light is as per mentioned and discussed with customer. 
3. Payment terms 100 % in Advance with Purchase order.
4. Goods once sold will not be taken back at any cost unless warranted. 
5. Cancellation Charged 10% of Order Value. No Cancellation is allowed after Material is Produced/Procured. 
6.Solar Panel Warranty & Performance Warranty for Solar Panel is from OEM.`;


    const [formData, setFormData] = useState({
        proposalFor: '',
        customerEmail: '',
        leadId: '',
        estimateNo: '',
        date: new Date().toISOString().split('T')[0],
        currency: 'USD',
        exchangeRate: 1,
        selectedCompany: 'Solarica Systems Pvt Ltd', // Default company
        accountHolder: 'SOLARICA ENERGY INDIA PRIVATE LIMITED',
        bankName: 'KOTAK MAHINDRA BANK LTD',
        address: 'Narhe Road, Pune-411041.',
        accountNumber: '4745055271',
        ifsc: 'KKBK0001801',
        swift: 'KKBKINBBXXX',
        items: [] as ExportItem[],
        terms: defaultTerms, 

    });

    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [loadingRate, setLoadingRate] = useState(false);
const [searchResults, setSearchResults] = useState<any[]>([]);
const [showResults, setShowResults] = useState(false);
const [isSearching, setIsSearching] = useState(false);
const searchTimeout = useRef<any>(null);
const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
const [hsnSuggestions, setHsnSuggestions] = useState<any[]>([]);
const [showHsnSuggestions, setShowHsnSuggestions] = useState<number | null>(null);
const [hsnLoading, setHsnLoading] = useState(false);
    // Company options for export proposals
    const companyOptions = [
        { value: 'Solarica Systems Pvt Ltd', label: 'Solarica Systems Pvt Ltd', prefix: 'SS' },
        { value: 'Solarica Industries Pvt Ltd', label: 'Solarica Industries Pvt Ltd', prefix: 'SI' },
        { value: 'Solarica Energy India Pvt Ltd', label: 'Solarica Energy India Pvt Ltd', prefix: 'SE' },
        { value: 'Solarica Fabtech Pvt Ltd', label: 'Solarica Fabtech Pvt Ltd', prefix: 'SF' },
    ];

    // Fetch Export Estimate Number based on selected company
    useEffect(() => {
        const fetchEstimateNumber = async () => {
            if (formData.selectedCompany) {
                try {
                    const num = await getNextExportEstimateNumber(formData.selectedCompany);
                    setFormData(prev => ({ ...prev, estimateNo: num }));
                } catch (error) {
                    console.error("Failed to fetch export estimate number", error);
                }
            }
        };
        fetchEstimateNumber();
    }, [formData.selectedCompany]);

    // Fetch Exchange Rate if currency is USD
    useEffect(() => {
        const fetchExchangeRate = async () => {
            if (formData.currency === 'USD') {
                setLoadingRate(true);
                try {
                    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                    const data = await response.json();
                    setFormData(prev => ({ ...prev, exchangeRate: data.rates.INR }));
                } catch (error) {
                    console.error("Failed to fetch exchange rate", error);
                } finally {
                    setLoadingRate(false);
                }
            } else {
                setFormData(prev => ({ ...prev, exchangeRate: 1 }));
            }
        };
        fetchExchangeRate();
    }, [formData.currency]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // PROP-001: Proposal For - alphabets, spaces, and common punctuation only
        if (name === 'proposalFor') {
            const sanitized = value.replace(/[^a-zA-Z\s.,&'-]/g, '').slice(0, 100);
            setFormData(prev => ({ ...prev, [name]: sanitized }));
            return;
        }



        // BANK-001/002: Account Holder Name - alphabets and spaces only
        if (name === 'accountHolder') {
            const sanitized = value.replace(/[^a-zA-Z\s.]/g, '').slice(0, 100);
            setFormData(prev => ({ ...prev, [name]: sanitized }));
            return;
        }

        // BANK-001/002: Bank Name - alphabets, spaces, and common punctuation
        if (name === 'bankName') {
            const sanitized = value.replace(/[^a-zA-Z\s.,&'-]/g, '').slice(0, 100);
            setFormData(prev => ({ ...prev, [name]: sanitized }));
            return;
        }

        // BANK-004: Account Number - digits only, max 18 digits
        if (name === 'accountNumber') {
            const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 18);
            setFormData(prev => ({ ...prev, [name]: digitsOnly }));
            return;
        }

        // BANK-003: IFSC Code - uppercase alphanumeric, max 11 characters (format: 4 letters + 7 alphanumeric)
        if (name === 'ifsc') {
            const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
            setFormData(prev => ({ ...prev, [name]: sanitized }));
            return;
        }

        // BANK-003: SWIFT Code - uppercase alphanumeric, 8 or 11 characters
        if (name === 'swift') {
            const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
            setFormData(prev => ({ ...prev, [name]: sanitized }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addManualItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, {
                itemDescription: '',
                hsnSac: '',
                quantity: 1,
                unit: 'Nos',
                rate: 0,
                discount: 0,
                amount: 0
            }]
        }));
    };

    const handleCreateLead = async (leadData: any) => {
  try {
    const newLead = await createLead(leadData);

    // 🔥 Auto-fill after create
    setFormData(prev => ({
      ...prev,
      proposalFor: newLead.name,
      customerEmail: newLead.email || ''
    }));

    setIsCreateLeadOpen(false);
  } catch (error) {
    console.error("Failed to create lead", error);
  }
};
    const handleCatalogSelect = (product: Product) => {
        const newItem: ExportItem = {
            itemDescription: product.model + (product.description ? ` - ${product.description}` : ''),
            hsnSac: product.hsnSac,
            quantity: 1,
            unit: 'Nos',
            // rate: 0, // Manual entry required
            rate: product.price || 0,
            watt: product.watt || 0,
            isSolarPanel: product.isSolarPanel || false,
            discount: 0,
            // amount: 0
            amount: product.price || 0
        };

        setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
        setIsCatalogOpen(false);
    };

    // const updateItem = (index: number, field: keyof ExportItem, value: any) => {
    //     const newItems = [...formData.items];
    //     let processed = value;
    //     if (['quantity', 'rate', 'discount', 'watt'].includes(field)) {
    //         processed = Number(value) || 0;
    //     }
    //     newItems[index] = { ...newItems[index], [field]: processed };
    //     // Recalculate amount
    //     const { quantity, rate, watt, isSolarPanel, discount } = newItems[index];
    //     const base = isSolarPanel ? quantity * rate * (watt || 0) : quantity * rate;
    //     newItems[index].amount = base - (discount || 0);
    //     setFormData(prev => ({ ...prev, items: newItems }));
    // };


const updateItem = async (index: number, field: keyof ExportItem, value: any) => {
    const newItems = [...formData.items];
    let processed = value;

    if (field === 'hsnSac') {
        processed = value.replace(/[^0-9]/g, '').slice(0, 8);
    }

    if (['quantity', 'rate', 'discount', 'watt'].includes(field)) {
        processed = Number(value) || 0;
    }

    newItems[index] = { ...newItems[index], [field]: processed };

    // 🔥 HSN API CALL
    if (field === 'hsnSac') {
        const hsnValue = processed;

        if (!hsnValue) {
            setHsnSuggestions([]);
            setShowHsnSuggestions(null);
        } else if (hsnValue.length >= 2) {
            setHsnLoading(true);
            setShowHsnSuggestions(index);

            try {
                const { findHsnSuggestions } = await import('../../services/hsnService');
                const response = await findHsnSuggestions(hsnValue, 5);

                setHsnSuggestions(response.data.data || []);
            } catch (err) {
                console.error("HSN fetch error", err);
                setHsnSuggestions([]);
            } finally {
                setHsnLoading(false);
            }
        }
    }

    // Recalculate
    const { quantity, rate, watt, isSolarPanel, discount } = newItems[index];
    const base = isSolarPanel ? quantity * rate * (watt || 0) : quantity * rate;
    newItems[index].amount = base - (discount || 0);

    setFormData(prev => ({ ...prev, items: newItems }));
};



const handleHsnSelect = (index: number, hsnData: any) => {
    const newItems = [...formData.items];

    newItems[index] = {
        ...newItems[index],
        hsnSac: hsnData.hsnCode,
        itemDescription: hsnData.description
    };

    setFormData(prev => ({ ...prev, items: newItems }));

    setHsnSuggestions([]);
    setShowHsnSuggestions(null);
};

    const removeItem = (index: number) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for mandatory fields
        if (!formData.proposalFor.trim()) {
            alert('Proposal For is required');
            return;
        }

        if (!formData.estimateNo) {
            alert('Estimate Number is required');
            return;
        }

        // BANK-001/002: Validate required bank details fields
        if (!formData.accountHolder.trim()) {
            alert('Account Holder Name is required');
            return;
        }
        if (!formData.bankName.trim()) {
            alert('Bank Name is required');
            return;
        }
        // BANK-004: Account number validation (9-18 digits)
        if (!formData.accountNumber.trim() || formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
            alert('Account Number is required and must be between 9-18 digits');
            return;
        }
        // BANK-003: IFSC validation (must be exactly 11 characters: 4 letters + 7 alphanumeric)
        const ifscRegex = /^[A-Z]{4}[A-Z0-9]{7}$/;
        if (!formData.ifsc.trim() || !ifscRegex.test(formData.ifsc)) {
            alert('IFSC Code is required and must be in valid format (e.g., HDFC0001234)');
            return;
        }
        // BANK-003: SWIFT validation (8 or 11 characters)
        const swiftRegex = /^[A-Z0-9]{8}([A-Z0-9]{3})?$/;
        if (!formData.swift.trim() || !swiftRegex.test(formData.swift)) {
            alert('SWIFT Code is required and must be 8 or 11 characters');
            return;
        }
        if (!formData.address.trim()) {
            alert('Bank Address is required');
            return;
        }

        // ITEM-001: Validate at least one item is added
        if (formData.items.length === 0) {
            alert('At least one item is required. Please add items from Catalog or manually.');
            return;
        }

        // Validate each item has required fields
        const invalidItems = formData.items.filter(item =>
            !item.itemDescription.trim() || item.quantity <= 0 || item.rate <= 0
        );
        if (invalidItems.length > 0) {
            alert('All items must have a description, quantity greater than 0, and rate greater than 0');
            return;
        }

        // Calculate total items amount
        const netAmount = formData.items.reduce((sum, item) => sum + item.amount, 0);

        // Construct payload to match backend 'createInvoice' schema and QuotationDashboard expectations
        // Note: The backend controller now accepts category, currency, exchangeRate, swiftCode
        const submissionData = {
            // Helper fields for Dashboard to recognize this is from ExportForm
            leadId: formData.leadId,
            isExport: true,

            // Core Invoice Data
            companyName: formData.selectedCompany || formData.accountHolder || 'SOLARICA ENERGY INDIA PRIVATE LIMITED',
            invoiceNumber: formData.estimateNo, // Auto-generated, unique
            invoiceDate: formData.date,

            // Customer/Proposal Details
            customerName: formData.proposalFor,
            customerEmail: formData.customerEmail,
            customerAddress: formData.address, // Mapping 'address' from form to customerAddress
            customerContact: '', // Add field if needed, currently empty

            // Financials
            netAmount,
            grandTotalPayable: netAmount, // Assuming no extra taxes on top yet
            currency: formData.currency,
            exchangeRate: formData.exchangeRate,

            // Bank Details
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifsc,
            swiftCode: formData.swift,
            accountHolder: formData.accountHolder,
            termsAndConditions: formData.terms,

            // Metadata
            category: 'EXPORT',

            // Items mapped to schema
            items: formData.items.map(item => ({
                itemDescription: item.itemDescription,
                hsnSac: item.hsnSac,
                quantity: Number(item.quantity),
                unit: item.unit,
                rate: Number(item.rate),
                discount: Number(item.discount),
                amount: Number(item.amount)
            })),

            // Sales Employee

        };

        await onSubmit(submissionData);
    };

    const hasSolarPanels = formData.items.some(item => item.isSolarPanel);
    const selectedCurrency = CURRENCIES.find(c => c.code === formData.currency) || CURRENCIES[0];
    const currencySymbol = selectedCurrency.symbol;

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
                                <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                                    <FileText className="text-white" size={22} />
                                </div>
                                <div>
                                    <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none">Export Proposal</h1>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">International Sales</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Proposal Details Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                        <Building2 size={20} />
                                    </div>
                                    Proposal Details
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">General info for the export proposal.</p>
                            </div>
                             {/* ✅ NEW BUTTON */}
  <button
    type="button"
    onClick={() => setIsCreateLeadOpen(true)}
    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all flex items-center gap-2"
  >
    <Plus size={16} />
    New Lead
  </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                            {/* Company Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Company <span className="text-red-500">*</span></label>
                                <select name="selectedCompany" value={formData.selectedCompany} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none appearance-none">
                                    {companyOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            {/* <div className="space-y-2"> */}
                            <div className="space-y-2 relative">
                                
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Proposal For <span className="text-red-500">*</span></label>
                                {/* <input type="text" name="proposalFor" value={formData.proposalFor} onChange={handleChange}
                                    placeholder="Company or Client Name"
                                    maxLength={100}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none" /> */}
                           
                          
  <input
    type="text"
    name="proposalFor"
    value={formData.proposalFor}
    onChange={(e) => {
      const value = e.target.value;
      handleChange(e);

      setShowResults(true);

      if (searchTimeout.current) clearTimeout(searchTimeout.current);

      if (value.length > 1) {
        setIsSearching(true);
        searchTimeout.current = setTimeout(async () => {
          const results = await searchInternationalLeads(value);
          setSearchResults(results);
          setIsSearching(false);
        }, 300);
      } else {
        setSearchResults([]);
      }
    }}
    onFocus={() => setShowResults(true)}
    onBlur={() => setTimeout(() => setShowResults(false), 200)}
    className="w-full px-4 py-3 border rounded-xl"
    placeholder="Search International Customer"
  />

  {/* DROPDOWN */}
  {showResults && (
    <div className="absolute w-full bg-white border rounded-xl mt-2 max-h-60 overflow-auto z-50">
    
      {isSearching && (
        <div className="p-3 text-sm text-gray-400">Searching...</div>
      )}

      {searchResults.map((lead) => (
        <div
          key={lead.id}
          onMouseDown={() => {
            setFormData(prev => ({
              ...prev,
                   leadId: lead.id,
              proposalFor: lead.name,
              customerEmail: lead.email || ''
            }));
            setShowResults(false);
          }}
          className="p-3 hover:bg-gray-100 cursor-pointer"
        >
          <div className="font-bold">{lead.name}</div>
          <div className="text-xs text-gray-400">{lead.email}</div>
        </div>
      ))}

      {!isSearching && searchResults.length === 0 && (
        <div className="p-3 text-sm text-gray-400">
          No International leads found
        </div>
      )}
    </div>
  )}

                           
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Customer Email</label>
                                <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange}
                                    placeholder="Required for sending email"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Estimate No. <span className="text-red-500">*</span></label>
                                <div className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-bold font-mono">
                                    {formData.estimateNo || 'Loading...'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Date <span className="text-red-500">*</span></label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Currency <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <select name="currency" value={formData.currency} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none appearance-none">
                                        {CURRENCIES.map(curr => (
                                            <option key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                    </section>

                    {/* Items Section (Moved ABOVE Bank Details) */}
                    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                                    <Tag size={20} />
                                </div>
                                Item Details
                            </h3>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setIsCatalogOpen(true)}
                                    className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all shadow-sm flex items-center gap-2">
                                    <Search size={16} /> Add from Catalog
                                </button>
                                <button type="button" onClick={addManualItem}
                                    className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-all shadow-sm flex items-center gap-2">
                                    <Plus size={16} /> Add Manual
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-12 text-center">#</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase min-w-[240px]">Description</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-28">HSN</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-20 text-center">Qty</th>
                                        {hasSolarPanels && <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-28 text-center">Watt</th>}
                                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-32 text-right">Rate {formData.currency}</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-24 text-right">Disc</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-40 text-right">Amount {currencySymbol}</th>
                                        <th className="px-4 py-4 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {formData.items.length === 0 ? (
                                        <tr>
                                            <td colSpan={hasSolarPanels ? 9 : 8} className="p-12 text-center text-slate-400 text-sm italic">
                                                No items added yet. Use the catalog or add manually.
                                            </td>
                                        </tr>
                                    ) : (
                                        formData.items.map((item, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                                                <td className="px-4 py-4 text-sm text-slate-400 font-bold text-center">{i + 1}</td>
                                                <td className="px-4 py-4">
                                                    <input type="text" value={item.itemDescription}
                                                        onChange={e => updateItem(i, 'itemDescription', e.target.value)}
                                                        className="w-full bg-transparent border-0 border-b border-transparent focus:border-amber-500 focus:ring-0 p-0 text-sm font-medium text-slate-800 placeholder:text-slate-300"
                                                        placeholder="Item name" />
                                                </td>
                                                {/* <td className="px-4 py-4">
                                                    <input type="text" value={item.hsnSac}
                                                        onChange={e => updateItem(i, 'hsnSac', e.target.value)}
                                                        className="w-full bg-transparent outline-none text-slate-600 text-sm font-bold"
                                                        placeholder="HSN" />
                                                </td> */}

                                                <td className="px-4 py-4 relative">
  <input
    type="text"
    value={item.hsnSac}
    onChange={e => updateItem(i, 'hsnSac', e.target.value)}
    onFocus={() => setShowHsnSuggestions(i)}
    className="w-full bg-transparent outline-none text-slate-600 text-sm font-bold"
    placeholder="HSN"
  />

  {/* 🔥 DROPDOWN */}
  {showHsnSuggestions === i && (
    // <div className="absolute z-50 bg-white border rounded-xl mt-2 w-full max-h-60 overflow-auto shadow-lg">
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[500px] bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-64 overflow-auto">
      {hsnLoading && (
        <div className="p-3 text-sm text-gray-400">Searching...</div>
      )}

      {hsnSuggestions.map((hsn, idx) => (
        <div
          key={idx}
          onMouseDown={() => handleHsnSelect(i, hsn)}
          className="p-3 hover:bg-gray-100 cursor-pointer"
        >
          <div className="font-bold text-indigo-600">{hsn.hsnCode}</div>
          <div className="text-xs text-gray-500">{hsn.description}</div>
        </div>
      ))}

      {!hsnLoading && hsnSuggestions.length === 0 && (
        <div className="p-3 text-sm text-gray-400">No data found</div>
      )}
    </div>
  )}
</td>
                                                <td className="px-4 py-4">
                                                    <input type="number" value={item.quantity}
                                                        onChange={e => updateItem(i, 'quantity', e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500 text-center font-bold text-slate-700 text-sm" />
                                                </td>
                                                {hasSolarPanels && (
                                                    <td className="px-4 py-4">
                                                        {item.isSolarPanel ? (
                                                            <input type="number" value={item.watt}
                                                                onChange={e => updateItem(i, 'watt', e.target.value)}
                                                                className="w-full bg-blue-50 border border-blue-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-500 text-center font-bold text-blue-700 text-sm" />
                                                        ) : (
                                                            <div className="text-center text-slate-300 font-bold">-</div>
                                                        )}
                                                    </td>
                                                )}
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus-within:border-indigo-500">
                                                        <span className="text-slate-400 text-xs mr-1">{currencySymbol}</span>
                                                        <input type="number" value={item.rate}
                                                            onChange={e => updateItem(i, 'rate', e.target.value)}
                                                            className="bg-transparent outline-none text-right font-bold text-slate-700 text-sm w-full" />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus-within:border-indigo-500">
                                                        <span className="text-slate-400 text-xs mr-1">{currencySymbol}</span>
                                                        <input type="number" value={item.discount}
                                                            onChange={e => updateItem(i, 'discount', e.target.value)}
                                                            className="bg-transparent outline-none text-right font-bold text-slate-700 text-sm w-full" />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right font-black text-slate-900 font-mono">
                                                    {currencySymbol} {item.amount.toLocaleString(formData.currency === 'USD' ? 'en-US' : 'en-IN', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <button type="button" onClick={() => removeItem(i)}
                                                        className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
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
                    <CatalogItemSelector isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} onSelect={handleCatalogSelect} />

                    {/* Bank Details Section (Moved BELOW Items Section) */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-50">
                            <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                                    <Receipt size={20} />
                                </div>
                                Company Bank Details
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Account Holder Name <span className="text-red-500">*</span></label>
                                <input type="text" name="accountHolder" value={formData.accountHolder} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Bank Name <span className="text-red-500">*</span></label>
                                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Account No. <span className="text-red-500">*</span></label>
                                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange}
                                    placeholder="9-18 digits"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">IFSC Code <span className="text-red-500">*</span></label>
                                <input type="text" name="ifsc" value={formData.ifsc} onChange={handleChange}
                                    placeholder="e.g. HDFC0001234"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">SWIFT CODE <span className="text-red-500">*</span></label>
                                <input type="text" name="swift" value={formData.swift} onChange={handleChange}
                                    placeholder="8 or 11 characters"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none" />
                            </div>
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Address <span className="text-red-500">*</span></label>
                                <textarea name="address" value={formData.address} onChange={handleChange} rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none resize-none" />
                            </div>
                        </div>
                    </section>

                    {/* Terms & Totals Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Terms Section */}
                        <section className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                                    <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                                        <FileText size={20} />
                                    </div>
                                    Terms & Conditions
                                </h3>
                            </div>
                            <textarea name="terms" value={formData.terms} onChange={handleChange} rows={5}
                                placeholder="Enter terms and conditions..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none" />
                        </section>

                        {/* Totals Section */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col justify-center">
                            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider mb-6 pb-4 border-b border-slate-100">
                                Payment Summary
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Taxable Amount</span>
                                    <span>{currencySymbol} {formData.items.reduce((sum, item) => sum + item.amount, 0).toLocaleString(formData.currency === 'USD' ? 'en-US' : 'en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Total Tax</span>
                                    <span>{currencySymbol} 0.00</span>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xl font-bold text-slate-800">Grand Total</span>
                                    <span className="text-2xl font-black text-indigo-600">
                                        {currencySymbol} {formData.items.reduce((sum, item) => sum + item.amount, 0).toLocaleString(formData.currency === 'USD' ? 'en-US' : 'en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                        <button type="button" onClick={onBack} className="px-6 py-3 bg-white text-slate-500 rounded-xl hover:bg-slate-50 font-bold transition-all border border-slate-200">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw size={18} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Export Proposal
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main ><CreateLeadModal
  isOpen={isCreateLeadOpen}
  onClose={() => setIsCreateLeadOpen(false)}
  onSubmit={handleCreateLead}
/>

        </div >
    );
};

export default ExportForm;
