import React, { useState } from 'react';
import { Mail, Building2, User, IndianRupee, FileText, Download, X, Wrench, MapPin, Phone, Info, Calendar } from 'lucide-react';
import { getPDFDownloadUrl } from '../services/quotationService';

interface QuotationViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    quotation: any;
}

const QuotationViewModal: React.FC<QuotationViewModalProps> = ({ isOpen, onClose, quotation }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    if (!isOpen || !quotation) return null;

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const url = await getPDFDownloadUrl(quotation.id);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Failed to download PDF:", error);
            // Optionally add toast notification here
        } finally {
            setIsDownloading(false);
        }
    };

    const SectionHeader = ({ icon: Icon, title, colorClass }: any) => (
        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">{title}</h2>
        </div>
    );

    const DataField = ({ label, value, fullWidth = false }: any) => (
        <div className={`space-y-1 ${fullWidth ? 'col-span-full' : ''}`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-700">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white animate-in zoom-in-95 duration-300 text-left">
                {/* Modal Header */}
                <div className="bg-slate-900 px-8 py-6 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                            <FileText size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-left">
                                <h3 className="text-xl font-black tracking-tight">Quotation Preview</h3>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white">
                                    {quotation.status}
                                </span>
                            </div>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-0.5">Reference Only • Not a Tax Invoice</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-10 main-content-scroll bg-slate-50/30">
                    <div className="max-w-4xl mx-auto space-y-12">


                        {/* Section 2: TO */}
                        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <SectionHeader icon={User} title="Section 2: Customer Details" colorClass="bg-indigo-100 text-indigo-600" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                                <DataField label="Customer Name" value={quotation.companyName} />
                                <DataField label="Consumer Number" value={quotation.consumerNumber} />
                                <DataField label="Billing Number" value={quotation.BillingNumber || quotation.billingNumber} />
                                <DataField label="Customer Number" value={quotation.CustomerNumber || quotation.customerNumber} />
                                <DataField label="GST Number" value={quotation.gstNumber} />
                                <DataField label="Email Address" value={quotation.companyEmail} />
                            </div>
                        </section>

                        {/* Section 3: Customer Type */}
                        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <SectionHeader icon={Info} title="Section 3: Customer Type" colorClass="bg-emerald-100 text-emerald-600" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                                <DataField label="Customer Type" value={quotation.customerType} />
                                {quotation.customerType !== 'Individual' && (
                                    <DataField label="Subsidy Option" value={quotation.subsidyOption} />
                                )}
                            </div>
                        </section>

                        {/* Section 4: Service & Pricing */}
                        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <SectionHeader icon={IndianRupee} title="Section 4: Service & Pricing" colorClass="bg-amber-100 text-amber-600" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">System Capacity (KW) & Phase</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={quotation.systemCapacityKw || ''}
                                                readOnly
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <input
                                                type="text"
                                                value={quotation.phase || '1 Phase'}
                                                readOnly
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Total Cost (Incl. GST) (₹)</label>
                                    <input
                                        type="text"
                                        value={quotation.totalAmount ? `₹ ${parseInt(quotation.totalAmount).toLocaleString()}` : '0'}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-700 outline-none"
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium">Total inclusive price</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">GST Component (Included) (₹)</label>
                                    <input
                                        type="text"
                                        value={quotation.gstAmount ? `₹ ${parseInt(quotation.gstAmount).toLocaleString()}` : '0'}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-amber-600 outline-none"
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium">Extracted from total</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-emerald-700 uppercase tracking-tight font-black">Net Payable (₹)</label>
                                    <input
                                        type="text"
                                        value={quotation.netPayableAmount ? `₹ ${parseInt(quotation.netPayableAmount).toLocaleString()}` : (quotation.netCost ? `₹ ${parseInt(quotation.netCost).toLocaleString()}` : '0')}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 font-mono font-extrabold text-emerald-700 outline-none shadow-inner"
                                    />
                                    <p className="text-[10px] text-emerald-600 font-bold">Total - Subsidy (Final Amount)</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">GST Rate (%)</label>
                                    <input
                                        type="text"
                                        value={quotation.gstRate ? `${quotation.gstRate}%` : '13.8%'}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none"
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium">Applicable GST rate</p>
                                </div>

                                {quotation.customerType === 'Society' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">No. of Flats</label>
                                        <input
                                            type="text"
                                            value={quotation.numberOfFlats || '0'}
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none"
                                        />
                                        <p className="text-[10px] text-slate-400 font-medium italic">* Used for subsidy calculation</p>
                                    </div>
                                )}

                                {quotation.subsidyAmount > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-emerald-700 uppercase tracking-tight">CFA Subsidy Amount (₹)</label>
                                        <div className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/50 font-mono font-bold text-emerald-600 flex justify-between items-center">
                                            <span>₹ {parseInt(quotation.subsidyAmount).toLocaleString()}</span>
                                        </div>
                                        <p className="text-[10px] text-emerald-600 font-medium italic">
                                            * Subsidy applied
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Section 5: Validity */}
                        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <SectionHeader icon={Calendar} title="Section 5: Validity" colorClass="bg-rose-100 text-rose-600" />
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between text-left">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Validity Period</p>
                                    <p className="text-lg font-bold text-slate-700">Valid for {quotation.validityDays} days from offer date</p>
                                </div>
                            </div>
                        </section>


                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-8 py-4 rounded-2xl text-sm font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest"
                        >
                            Close Preview
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="px-8 py-4 rounded-2xl text-sm font-black text-white bg-blue-600 hover:bg-blue-700 transition-all uppercase tracking-widest flex items-center gap-2"
                        >
                            {isDownloading ? (
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                            ) : (
                                <Download size={18} />
                            )}
                            Download PDF
                        </button>
                    </div>
                    <p className="text-xs font-bold text-slate-400 italic">This is a dynamic preview of your entry.</p>
                </div>
            </div>
        </div>
    );
};

export default QuotationViewModal;
