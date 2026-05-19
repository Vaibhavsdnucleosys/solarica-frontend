// import React from 'react';
// import { X, Download, Printer } from 'lucide-react';
// import { Invoice } from '../../services/invoiceService';

// interface InvoiceViewModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     invoice: Invoice | null;
// }

// const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({ isOpen, onClose, invoice }) => {
//     if (!isOpen || !invoice) return null;
//     const finalAmount =
//     (invoice.grandTotalPayable || 0) +
//     (invoice.additionalAmount || 0);

//     return (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
//                 {/* Header */}
//                 <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
//                     <div>
//                         <h2 className="text-lg font-bold text-slate-800">Invoice Details</h2>
//                         <p className="text-sm text-slate-500">{invoice.invoiceNumber}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <button className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors border border-transparent hover:border-slate-200">
//                             <Printer size={18} />
//                         </button>
//                         <button className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors border border-transparent hover:border-slate-200">
//                             <Download size={18} />
//                         </button>
//                         <div className="w-px h-6 bg-slate-200 mx-2"></div>
//                         <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-slate-400">
//                             <X size={20} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-8 overflow-y-auto flex-1 space-y-8">
//                     {/* Header Info */}
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <h3 className="font-bold text-xl text-slate-800">{invoice.companyName}</h3>
//                             <p className="text-slate-500 text-sm mt-1 whitespace-pre-line">
//                                 {invoice.invoiceDate}
//                             </p>
//                         </div>
//                         <div className="text-right">
//                             <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold uppercase tracking-wider mb-2">
//                                 {invoice.category || 'DOMESTIC'}
//                             </div>
//                             <div className="font-mono text-2xl font-black text-slate-800">
//                                 {/* {invoice.currency === 'USD' ? '$' : '₹'}{invoice.grandTotalPayable.toLocaleString()} */}
//                            {invoice.currency === 'USD' ? '$' : '₹'}{finalAmount.toLocaleString()}
                           
//                             </div>
//                         </div>
//                     </div>

//                     {/* Bill To / Ship To */}
//                     <div className="grid grid-cols-2 gap-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
//                         <div>
//                             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Bill To</h4>
//                             <p className="font-bold text-slate-800">{invoice.customerName}</p>
//                             <p className="text-sm text-slate-600 whitespace-pre-line mt-1">{invoice.customerAddress}</p>
//                             <p className="text-sm text-slate-600 mt-1">GSTIN: {invoice.customerGstinUin}</p>
//                         </div>
//                         <div>
//                             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Ship To</h4>
//                             <p className="font-bold text-slate-800">{invoice.recipientName || invoice.customerName}</p>
//                             <p className="text-sm text-slate-600 whitespace-pre-line mt-1">{invoice.shippingAddress || invoice.customerAddress}</p>
//                         </div>
//                     </div>

//                     {/* Items Table */}
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
//                                 <th className="py-3 px-4">Item</th>
//                                 <th className="py-3 px-4 text-center">HSN</th>
//                                 <th className="py-3 px-4 text-center">Qty</th>
//                                 <th className="py-3 px-4 text-right">Rate</th>
//                                 <th className="py-3 px-4 text-right">Amount</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-100">
//                             {(invoice.items || []).map((item, i) => (
//                                 <tr key={i}>
//                                     <td className="py-3 px-4 font-medium text-slate-700">
//                                         {item.itemDescription}
//                                     </td>
//                                     <td className="py-3 px-4 text-center text-slate-500 text-sm">{item.hsnSac}</td>
//                                     <td className="py-3 px-4 text-center text-slate-700 font-bold">{item.quantity} {item.unit}</td>
//                                     <td className="py-3 px-4 text-right text-slate-600">
//                                         {invoice.currency === 'USD' ? '$' : '₹'}{item.rate}
//                                     </td>
//                                     <td className="py-3 px-4 text-right font-bold text-slate-800">
//                                         {invoice.currency === 'USD' ? '$' : '₹'}{item.amount}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {/* Totals */}
//                     <div className="flex justify-end">
//                         <div className="w-64 space-y-2">
//                             <div className="flex justify-between text-sm text-slate-600">
//                                 <span>Net Amount</span>
//                                 <span>{invoice.currency === 'USD' ? '$' : '₹'}{invoice.netAmount}</span>
//                             </div>
//                             {/* <div className="flex justify-between text-lg font-black text-slate-800 border-t border-slate-200 pt-2">
//                                 <span>Total</span>
//                                 <span>{invoice.currency === 'USD' ? '$' : '₹'}{invoice.grandTotalPayable}</span>
//                             </div> */}

//                             <div className="flex justify-end">
//     <div className="w-64 space-y-2">

//         {/* Net Amount */}
//         <div className="flex justify-between text-sm text-slate-600">
//             <span>Net Amount</span>
//             <span>{invoice.currency === 'USD' ? '$' : '₹'}{invoice.netAmount}</span>
//         </div>

//         {/* Advance Amount (ONLY IF ENABLED) */}
//         {/* {invoice.advancedEnabled && invoice.additionalAmount > 0 && ( */}
//             <div className="flex justify-between text-sm text-blue-600 font-bold">
//                 <span>Advance Amount</span>
//                 <span>
//                     {invoice.currency === 'USD' ? '$' : '₹'}
//                     {invoice.additionalAmount || 0}
//                 </span>
//             </div>
//         {/* )} */}

//         {/* FINAL TOTAL */}
//         <div className="flex justify-between text-lg font-black text-slate-800 border-t border-slate-200 pt-2">
//             <span>Total</span>
//             <span>
//                 {invoice.currency === 'USD' ? '$' : '₹'}
//                 {finalAmount}
//             </span>
//         </div>

//         <p className="text-xs text-right text-slate-400 mt-1 capitalize">
//             {invoice.amountInWords}
//         </p>
//     </div>
// </div>
//                             <p className="text-xs text-right text-slate-400 mt-1 capitalize">
//                                 {invoice.amountInWords}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InvoiceViewModal;


import React from 'react';
import { X, Download, Printer } from 'lucide-react';
import { Invoice } from '../../services/invoiceService';
import { API_URL } from '../../config';

interface InvoiceViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice | null;
}

const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
    isOpen,
    onClose,
    invoice
}) => {

    if (!isOpen || !invoice) return null;

    // PDF URL BASED ON INVOICE TYPE
    const previewUrl =
        invoice.invoiceType === "TAX_INVOICE"
            ? `${API_URL}/invoices/${invoice.id}/download-tax-invoice`
            : `${API_URL}/invoices/${invoice.id}/download-sales-invoice`;

    // PRINT
    const handlePrint = () => {
        window.open(previewUrl, "_blank");
    };

    // DOWNLOAD
    const handleDownload = () => {
        window.open(previewUrl, "_blank");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">

                    {/* LEFT */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Invoice Preview
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            {invoice.invoiceNumber}
                        </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-2">

                        {/* PRINT */}
                        <button
                            onClick={handlePrint}
                            className="
                                p-2
                                rounded-lg
                                text-slate-600
                                hover:bg-white
                                hover:border-slate-300
                                border border-transparent
                                transition-all
                            "
                            title="Print Invoice"
                        >
                            <Printer size={18} />
                        </button>

                        {/* DOWNLOAD */}
                        <button
                            onClick={handleDownload}
                            className="
                                p-2
                                rounded-lg
                                text-slate-600
                                hover:bg-white
                                hover:border-slate-300
                                border border-transparent
                                transition-all
                            "
                            title="Download Invoice"
                        >
                            <Download size={18} />
                        </button>

                        {/* DIVIDER */}
                        <div className="w-px h-6 bg-slate-300 mx-2"></div>

                        {/* CLOSE */}
                        <button
                            onClick={onClose}
                            className="
                                p-2
                                rounded-full
                                text-slate-400
                                hover:bg-red-50
                                hover:text-red-500
                                transition-all
                            "
                        >
                            <X size={20} />
                        </button>

                    </div>
                </div>

                {/* PDF PREVIEW */}
                <div className="flex-1 bg-slate-200 p-3 overflow-hidden">

                    <iframe
                        src={previewUrl}
                        title="Invoice Preview"
                        className="
                            w-full
                            h-full
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            shadow-sm
                        "
                    />

                </div>

            </div>

        </div>
    );
};

export default InvoiceViewModal;