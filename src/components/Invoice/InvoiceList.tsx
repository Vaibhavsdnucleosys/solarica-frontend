// import React, { useState, useEffect, useRef } from "react";
// import {
//   Eye,
//   Trash2,
//   Download,
//   Search,
//   Plus,
//   Mail,
//   Truck,
//   Pencil,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import {
//   getInvoices,
//   deleteInvoice,
//   Invoice,
//   getInvoiceDownloadUrl,
//   sendInvoiceEmail,
//   getDeliveryPreviewUrl,
//   getTaxInvoicePreviewUrl,
// } from "../../services/invoiceService";
// import InvoiceViewModal from "./InvoiceViewModal";
// import ConvertTaxInvoiceModal from "./ConvertTaxInvoiceModal";
// import { API_URL } from "../../config";

// interface InvoiceListProps {
//   onCreateClick: () => void;
// }
// const InvoiceList: React.FC<InvoiceListProps> = ({ onCreateClick }) => {
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);

//   const [selectedTaxInvoice, setSelectedTaxInvoice] = useState<Invoice | null>(
//     null,
//   );
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 10;

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   const fetchInvoices = async () => {
//     try {
//       setLoading(true);
//       const data = await getInvoices();
//       setInvoices(data || []);
//     } catch (error) {
//       console.error("Failed to fetch invoices", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const tableContainerRef = useRef<HTMLDivElement>(null);

//   const scrollLeft = () => {
//     if (tableContainerRef.current) {
//       tableContainerRef.current.scrollBy({
//         left: -400,
//         behavior: "smooth",
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (tableContainerRef.current) {
//       tableContainerRef.current.scrollBy({
//         left: 400,
//         behavior: "smooth",
//       });
//     }
//   };

//   const handleDelete = async (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (window.confirm("Are you sure you want to delete this invoice?")) {
//       try {
//         await deleteInvoice(id);
//         fetchInvoices();
//         toast.success("Invoice deleted successfully");
//       } catch (error) {
//         console.error("Failed to delete invoice", error);
//         toast.error("Failed to delete invoice");
//       }
//     }
//   };

//   //   const handleDownload = async (invoice: Invoice, e: React.MouseEvent) => {
//   //     e.stopPropagation();
//   //     const id = invoice.id;
//   //     const date: string = invoice.invoiceDate
//   //       ? new Date(invoice.invoiceDate).toISOString().split("T")[0]
//   //       : new Date().toISOString().split("T")[0];

//   //     try {
//   //       // Use the preview endpoint which supports date override
//   //       const { url } = await getDeliveryPreviewUrl(id, date);
//   //       window.open(url, "_blank");
//   //     } catch (error) {
//   //       console.error("Failed to download", error);
//   //       toast.error("Failed to initiate download");
//   //     }
//   //   };

//   const handleDownload = async (invoice: Invoice, e: React.MouseEvent) => {
//     e.stopPropagation();

//     try {
//       let url = "";

//       // TAX INVOICE
//       if (invoice.invoiceType === "TAX_INVOICE") {
//         const response = await getTaxInvoicePreviewUrl(invoice.id);

//         url = response.url;
//       }

//       // NORMAL INVOICE
//       else {
//         const date = invoice.invoiceDate
//           ? new Date(invoice.invoiceDate).toISOString().split("T")[0]
//           : new Date().toISOString().split("T")[0];

//         const response = await getDeliveryPreviewUrl(invoice.id, date);

//         url = response.url;
//       }

//       window.open(url, "_blank");
//     } catch (error) {
//       console.error("Failed to download invoice", error);

//       toast.error("Failed to download invoice");
//     }
//   };

//   const handleEmail = async (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (window.confirm("Send invoice via email to customer?")) {
//       try {
//         await sendInvoiceEmail(id);
//         toast.success("Email sent successfully!");
//       } catch (error) {
//         console.error("Failed to send email", error);
//         toast.error("Failed to send email");
//       }
//     }
//   };

//   const handleDeliveryPreview = async (
//     invoice: Invoice,
//     e: React.MouseEvent,
//   ) => {
//     e.stopPropagation();
//     const id = invoice.id;
//     const date: string = invoice.invoiceDate
//       ? new Date(invoice.invoiceDate).toISOString().split("T")[0]
//       : new Date().toISOString().split("T")[0];

//     try {
//       let url = "";

//       if (invoice.invoiceType === "TAX_INVOICE") {
//         url = `${API_URL}/invoices/${id}/download-tax-invoice`;
//       } else {
//         url = `${API_URL}/invoices/${id}/download-sales-invoice`;
//       }

//       window.open(url, "_blank");
//     } catch (error) {
//       console.error("Failed to get preview", error);
//       toast.error("Failed to generate preview");
//     }
//   };

//   const handleConvertTaxInvoice = (
//     invoice: Invoice,

//     e: React.MouseEvent,
//   ) => {
//     e.stopPropagation();

//     setSelectedTaxInvoice(invoice);

//     setIsTaxModalOpen(true);
//   };
//   // const filteredInvoices = invoices.filter(inv =>
//   //     inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //     inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
//   // );

//   //   const filteredInvoices = invoices.filter((inv) => {
//   //     const matchesSearch =
//   //       inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //       inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

//   //     const matchesStatus =
//   //       statusFilter === "ALL" ? true : inv.paymentStatus === statusFilter;

//   //     const isAccepted = inv.status === "ACCEPTED";

//   //     return matchesSearch && matchesStatus && isAccepted;
//   //   });

//   const filteredInvoices = invoices.filter((inv) => {
//     const matchesSearch =
//       inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       inv.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesPaymentStatus =
//       statusFilter === "ALL" ? true : inv.paymentStatus === statusFilter;

//     return matchesSearch && matchesPaymentStatus;
//   });

//   const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

//   const startIndex = (currentPage - 1) * itemsPerPage;

//   const paginatedInvoices = filteredInvoices.slice(
//     startIndex,
//     startIndex + itemsPerPage,
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, statusFilter]);

//   const uniqueStatuses = [
//     "ALL",
//     ...new Set(invoices.map((inv) => inv.paymentStatus).filter(Boolean)),
//   ];

//   return (
//     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//       {/* Header Actions */}
//       {/* <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100"> */}

//       <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
//         <div className="relative w-full md:w-96">
//           <Search
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//             size={18}
//           />
//           <input
//             type="text"
//             placeholder="Search invoices..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-700"
//           />
//         </div>
//         {/* <button
//           onClick={onCreateClick}
//           className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
//         >
//           <Plus size={20} />
//           <span>Create Invoice</span>
//         </button> */}

//         <select
//           value={statusFilter}
//           onChange={(e) => {
//             setStatusFilter(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium text-slate-700"
//         >
//           {uniqueStatuses.map((status) => (
//             <option key={status} value={status}>
//               {status === "ALL" ? "All Status" : status}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Invoices Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//         {/* <div className="overflow-x-auto"> */}
//         <div className="relative">
//           {/* LEFT ARROW */}
//           <button
//             onClick={scrollLeft}
//             className="
//     absolute
//     left-2
//     top-1/2
//     -translate-y-1/2
//     z-20
//     bg-slate-900
//     text-white
//     p-3
//     rounded-full
//     shadow-lg
//     hover:bg-black
//     transition
//   "
//           >
//             <ChevronLeft size={20} />
//           </button>

//           {/* RIGHT ARROW */}
//           <button
//             onClick={scrollRight}
//             className="
//     absolute
//     right-2
//     top-1/2
//     -translate-y-1/2
//     z-20
//     bg-slate-900
//     text-white
//     p-3
//     rounded-full
//     shadow-lg
//     hover:bg-black
//     transition
//   "
//           >
//             <ChevronRight size={20} />
//           </button>
//           <div
//             ref={tableContainerRef}
//             className="overflow-x-auto scroll-smooth"
//           >
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50 text-xs font-black text-slate-500 uppercase border-b border-slate-100">
//                   <th className="p-4 pl-6">Invoice No</th>
//                   <th className="p-4">Date</th>
//                   {/* <th className="p-4">Customer</th>
//                                 <th className="p-4 text-center">Status</th>
//                                 <th className="p-4 text-right">Amount</th> */}
//                   <th className="p-4">Company</th>

//                   <th className="p-4">Customer</th>

//                   <th className="p-4 text-center">Invoice Status</th>

//                   <th className="p-4 text-center">Payment Status</th>

//                   <th className="p-4 text-right">Amount</th>
//                   <th className="p-4 pr-6 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 text-sm">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={8} className="p-8 text-center text-slate-400">
//                       Loading invoices...
//                     </td>
//                   </tr>
//                 ) : filteredInvoices.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="p-8 text-center text-slate-400">
//                       No invoices found
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedInvoices.map((inv) => (
//                     <tr
//                       key={inv.id}
//                       className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
//                       onClick={() => {
//                         setSelectedInvoice(inv);
//                         setIsViewOpen(true);
//                       }}
//                     >
//                       <td className="p-4 pl-6 font-bold text-slate-800">
//                         {inv.invoiceNumber}
//                       </td>
//                       <td className="p-4 text-slate-500">
//                         {new Date(inv.invoiceDate).toLocaleDateString()}
//                       </td>
//                       {/* <td className="p-4 font-medium text-slate-700">
//                       {inv.customerName}
//                     </td>
//                     <td className="p-4 text-center">
//                       <span
//                         className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
//                           inv.paymentStatus === "PAID"
//                             ? "bg-emerald-100 text-emerald-600"
//                             : inv.paymentStatus === "PENDING"
//                               ? "bg-amber-100 text-amber-600"
//                               : "bg-red-100 text-red-600"
//                         }`}
//                       >
//                         {inv.paymentStatus}
//                       </span>
//                     </td> */}

//                       {/* COMPANY NAME */}

//                       <td className="p-4 font-semibold text-slate-700">
//                         {inv.companyName || "-"}
//                       </td>

//                       {/* CUSTOMER */}

//                       <td className="p-4 font-medium text-slate-700">
//                         {inv.customerName}
//                       </td>

//                       {/* INVOICE STATUS */}

//                       <td className="p-4 text-center">
//                         <span
//                           className={`
//             px-3 py-1
//             rounded-lg
//             text-[10px]
//             font-black
//             uppercase
//             tracking-wider

//             ${
//               inv.status === "ACCEPTED"
//                 ? "bg-blue-100 text-blue-700"
//                 : inv.status === "REJECTED"
//                   ? "bg-red-100 text-red-700"
//                   : inv.status === "TAX_INVOICE_GENERATED"
//                     ? "bg-emerald-100 text-emerald-700"
//                     : "bg-amber-100 text-amber-700"
//             }
//         `}
//                         >
//                           {inv.status || "PENDING"}
//                         </span>
//                       </td>

//                       {/* PAYMENT STATUS */}

//                       <td className="p-4 text-center">
//                         <span
//                           className={`
//             px-3 py-1
//             rounded-lg
//             text-[10px]
//             font-black
//             uppercase
//             tracking-wider

//             ${
//               inv.paymentStatus === "PAID"
//                 ? "bg-emerald-100 text-emerald-700"
//                 : inv.paymentStatus === "PARTIAL"
//                   ? "bg-orange-100 text-orange-700"
//                   : inv.paymentStatus === "OVERDUE"
//                     ? "bg-red-100 text-red-700"
//                     : "bg-amber-100 text-amber-700"
//             }
//         `}
//                         >
//                           {inv.paymentStatus || "PENDING"}
//                         </span>
//                       </td>
//                       <td className="p-4 text-right font-bold text-slate-800">
//                         ₹{inv.grandTotalPayable.toLocaleString("en-IN")}
//                       </td>
//                       <td className="p-4 pr-6">
//                         {/* <div className="flex items-center justify-center gap-2">
//                                                 <button
//                                                     onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); setIsViewOpen(true); }}
//                                                     className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
//                                                     title="View Details"
//                                                 >
//                                                     <Eye size={18} />
//                                                 </button>
//                                                 <button
//                                                     onClick={(e) => handleDownload(inv, e)}
//                                                     className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
//                                                     title="Download PDF"
//                                                 >
//                                                     <Download size={18} />
//                                                 </button>
//                                                 <button
//                                                     onClick={(e) => handleEmail(inv.id, e)}
//                                                     className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
//                                                     title="Send Email"
//                                                 >
//                                                     <Mail size={18} />
//                                                 </button>
//                                                 <button
//                                                     onClick={(e) => handleDeliveryPreview(inv, e)}
//                                                     className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
//                                                     title="Delivery Preview"
//                                                 >
//                                                     <Truck size={18} />
//                                                 </button>
//                                                 <button
//                                                     onClick={(e) => handleDelete(inv.id, e)}
//                                                     className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
//                                                     title="Delete"
//                                                 >
//                                                     <Trash2 size={18} />
//                                                 </button>
//                                             </div> */}

//                         <div className="flex items-center justify-center gap-2 flex-wrap">
//                           {/* VIEW */}
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               if (inv.invoiceType === "TAX_INVOICE") {
//                                 handleDownload(inv, e);
//                               } else {
//                                 setSelectedInvoice(inv);

//                                 setIsViewOpen(true);
//                               }
//                             }}
//                             className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
//                             title="View Details"
//                           >
//                             <Eye size={18} />
//                           </button>

//                           {/* TAX INVOICE */}
//                           {inv.invoiceType !== "TAX_INVOICE" && (
//                             <button
//                               onClick={(e) => handleConvertTaxInvoice(inv, e)}
//                               className="
//                 px-3 py-1
//                 rounded-lg
//                 bg-emerald-100
//                 text-emerald-700
//                 hover:bg-emerald-200
//                 text-xs
//                 font-bold
//                 transition
//             "
//                               title="Convert To Tax Invoice"
//                             >
//                               Tax Invoice
//                             </button>
//                           )}

//                           {/* GENERATED BADGE */}
//                           {inv.invoiceType === "TAX_INVOICE" && (
//                             <span
//                               className="
//                 px-3 py-1
//                 rounded-lg
//                 bg-green-100
//                 text-green-700
//                 text-[10px]
//                 font-black
//                 tracking-wide
//             "
//                             >
//                               TAX GENERATED
//                             </span>
//                           )}

//                           {/* DOWNLOAD */}
//                           <button
//                             onClick={(e) => handleDownload(inv, e)}
//                             className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
//                             title="Download PDF"
//                           >
//                             <Download size={18} />
//                           </button>

//                           {/* EMAIL */}
//                           <button
//                             onClick={(e) => handleEmail(inv.id, e)}
//                             className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
//                             title="Send Email"
//                           >
//                             <Mail size={18} />
//                           </button>

//                           {/* DELIVERY */}
//                           <button
//                             onClick={(e) => handleDeliveryPreview(inv, e)}
//                             className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
//                             title="Delivery Preview"
//                           >
//                             <Truck size={18} />
//                           </button>

//                           {/* DELETE */}
//                           <button
//                             onClick={(e) => handleDelete(inv.id, e)}
//                             className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
//               <p className="text-sm text-slate-500">
//                 Page {currentPage} of {totalPages}
//               </p>

//               <div className="flex items-center gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((prev) => prev - 1)}
//                   className="px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
//                 >
//                   Previous
//                 </button>

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((prev) => prev + 1)}
//                   className="px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <InvoiceViewModal
//         isOpen={isViewOpen}
//         onClose={() => setIsViewOpen(false)}
//         invoice={selectedInvoice}
//       />

//       <ConvertTaxInvoiceModal
//         isOpen={isTaxModalOpen}
//         onClose={() => setIsTaxModalOpen(false)}
//         invoice={selectedTaxInvoice}
//         onSuccess={() => {
//           fetchInvoices();
//         }}
//       />
//     </div>
//   );
// };

// export default InvoiceList;


// import React, { useState, useEffect, useRef } from "react";
// import {
//   Eye,
//   Trash2,
//   Download,
//   Search,
//   Mail,
//   Truck,
//   ChevronLeft,
//   ChevronRight,
//   Filter,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import {
//   getInvoices,
//   deleteInvoice,
//   Invoice,
//   getDeliveryPreviewUrl,
//   getTaxInvoicePreviewUrl,
//   sendInvoiceEmail,
// } from "../../services/invoiceService";
// import InvoiceViewModal from "./InvoiceViewModal";
// import ConvertTaxInvoiceModal from "./ConvertTaxInvoiceModal";
// import { API_URL } from "../../config";

// interface InvoiceListProps {
//   onCreateClick: () => void;
// }

// const InvoiceList: React.FC<InvoiceListProps> = ({ onCreateClick }) => {
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
//   const [selectedTaxInvoice, setSelectedTaxInvoice] = useState<Invoice | null>(null);
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 10;
//   const tableContainerRef = useRef<HTMLDivElement>(null);
  
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
  
//   // FIX: Robust check for admin role (handles both object and string formats)
//   const roleName = typeof user.role === 'object' ? user.role?.name : user.role;
//   const isAdmin = roleName?.toLowerCase() === "admin";
  
//   // Get company (if any)
//   const userCompany = user?.company?.toLowerCase()?.trim();

//   const fetchInvoices = async () => {
//     try {
//       setLoading(true);
//       const data = await getInvoices();
//       setInvoices(data || []);
//     } catch (error) {
//       console.error("Failed to fetch invoices", error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const filteredInvoices = invoices.filter((inv) => {
//     // Check if user is Admin OR if the invoice company matches the user's company
//     const matchesCompany = isAdmin || 
//       (inv.companyName?.toLowerCase()?.trim() === userCompany);

//     const matchesSearch =
//       inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       inv.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesPaymentStatus =
//       statusFilter === "ALL" ? true : inv.paymentStatus === statusFilter;

//     // Return true only if it matches Company AND Search AND Status
//     return matchesCompany && matchesSearch && matchesPaymentStatus;
//   });
//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   // const fetchInvoices = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const data = await getInvoices();
//   //     setInvoices(data || []);
//   //   } catch (error) {
//   //     console.error("Failed to fetch invoices", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
  
//   const scroll = (direction: "left" | "right") => {
//     if (tableContainerRef.current) {
//       const scrollAmount = direction === "left" ? -400 : 400;
//       tableContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
//     }
//   };

//   const handleDelete = async (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (window.confirm("Are you sure you want to delete this invoice?")) {
//       try {
//         await deleteInvoice(id);
//         fetchInvoices();
//         toast.success("Invoice deleted successfully");
//       } catch (error) {
//         toast.error("Failed to delete invoice");
//       }
//     }
//   };

//   const handleDownload = async (invoice: Invoice, e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       let url = "";
//       if (invoice.invoiceType === "TAX_INVOICE") {
//         const response = await getTaxInvoicePreviewUrl(invoice.id);
//         url = response.url;
//       } else {
//         const date = invoice.invoiceDate
//           ? new Date(invoice.invoiceDate).toISOString().split("T")[0]
//           : new Date().toISOString().split("T")[0];
//         const response = await getDeliveryPreviewUrl(invoice.id, date);
//         url = response.url;
//       }
//       window.open(url, "_blank");
//     } catch (error) {
//       toast.error("Failed to download invoice");
//     }
//   };

//   const handleEmail = async (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (window.confirm("Send invoice via email to customer?")) {
//       try {
//         await sendInvoiceEmail(id);
//         toast.success("Email sent successfully!");
//       } catch (error) {
//         toast.error("Failed to send email");
//       }
//     }
//   };

//   const handleDeliveryPreview = async (invoice: Invoice, e: React.MouseEvent) => {
//     e.stopPropagation();
//     const id = invoice.id;
//     try {
//       let url = invoice.invoiceType === "TAX_INVOICE" 
//         ? `${API_URL}/invoices/${id}/download-tax-invoice`
//         : `${API_URL}/invoices/${id}/download-sales-invoice`;
//       window.open(url, "_blank");
//     } catch (error) {
//       toast.error("Failed to generate preview");
//     }
//   };

 

//   const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
//   const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   // const StatusBadge = ({ type, status }: { type: 'payment' | 'invoice', status: string }) => {
//   //   const getColors = () => {
//   //     const s = status?.toUpperCase();
//   //     if (s === 'PAID' || s === 'ACCEPTED' || s === 'TAX_INVOICE_GENERATED') 
//   //       return 'bg-emerald-50 text-emerald-700 border-emerald-100';
//   //     if (s === 'PENDING' || s === 'PARTIAL') 
//   //       return 'bg-amber-50 text-amber-700 border-amber-100';
//   //     if (s === 'OVERDUE' || s === 'REJECTED') 
//   //       return 'bg-rose-50 text-rose-700 border-rose-100';
//   //     return 'bg-slate-50 text-slate-600 border-slate-100';
//   //   };

//   //   return (
//   //     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColors()}`}>
//   //       <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
//   //       {status?.replace('_', ' ') || 'PENDING'}
//   //     </span>
//   //   );
//   // };


//   // Change 'status: string' to 'status?: string'
// const StatusBadge = ({ type, status }: { type: 'payment' | 'invoice', status?: string }) => {
//   const getColors = () => {
//     // Add a fallback to 'PENDING' if status is undefined
//     const s = (status || 'PENDING').toUpperCase(); 
    
//     if (s === 'PAID' || s === 'ACCEPTED' || s === 'TAX_INVOICE_GENERATED') 
//       return 'bg-emerald-50 text-emerald-700 border-emerald-100';
//     if (s === 'PENDING' || s === 'PARTIAL') 
//       return 'bg-amber-50 text-amber-700 border-amber-100';
//     if (s === 'OVERDUE' || s === 'REJECTED') 
//       return 'bg-rose-50 text-rose-700 border-rose-100';
//     return 'bg-slate-50 text-slate-600 border-slate-100';
//   };

//   return (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColors()}`}>
//       <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
//       {(status || 'PENDING').replace('_', ' ')}
//     </span>
//   );
// };
//   return (
//     <div className="space-y-4 max-w-[1600px] mx-auto p-4 md:p-6 bg-slate-50/50 min-h-screen">
//       {/* Header & Filters */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
//         <div className="flex flex-1 items-center gap-4">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search by invoice, customer or company..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-600"
//             />
//           </div>
//           <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1">
//             <Filter size={16} className="text-slate-400" />
//             <select
//               value={statusFilter}
//               onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
//               className="bg-transparent py-1.5 outline-none text-sm font-medium text-slate-600 cursor-pointer"
//             >
//               <option value="ALL">All Payment Status</option>
//               <option value="PAID">Paid</option>
//               <option value="PENDING">Pending</option>
//               <option value="PARTIAL">Partial</option>
//               <option value="OVERDUE">Overdue</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group">
//         {/* Scroll Controls (Appear on hover) */}
//         <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
//           <button onClick={() => scroll('left')} className="m-2 p-2 bg-white shadow-xl rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
//             <ChevronLeft size={20} className="text-slate-600" />
//           </button>
//         </div>
//         <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
//           <button onClick={() => scroll('right')} className="m-2 p-2 bg-white shadow-xl rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
//             <ChevronRight size={20} className="text-slate-600" />
//           </button>
//         </div>

//         <div ref={tableContainerRef} className="overflow-x-auto scroll-smooth">
//           <table className="w-full text-left border-collapse min-w-[1000px]">
//             <thead>
//               <tr className="bg-slate-50/50 border-b border-slate-200">
//                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500">Invoice No.</th>
//                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500">Issued Date</th>
//                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500">Company / Customer</th>
//                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 text-center">Invoice Status</th>
//                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 text-center">Payment</th>
//                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 text-right">Amount</th>
//                 <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {loading ? (
//                 <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">Loading your invoices...</td></tr>
//               ) : paginatedInvoices.length === 0 ? (
//                 <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No invoices match your criteria.</td></tr>
//               ) : (
//                 paginatedInvoices.map((inv) => (
//                   <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group/row cursor-pointer" onClick={() => { setSelectedInvoice(inv); setIsViewOpen(true); }}>
//                     <td className="px-6 py-4 font-bold text-blue-600 text-sm">#{inv.invoiceNumber}</td>
//                     <td className="px-6 py-4 text-slate-500 text-sm">{new Date(inv.invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex flex-col">
//                         <span className="text-sm font-semibold text-slate-700 uppercase tracking-tight">{inv.companyName || "N/A"}</span>
//                         <span className="text-xs text-slate-400">{inv.customerName}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <StatusBadge type="invoice" status={inv.status} />
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <StatusBadge type="payment" status={inv.paymentStatus} />
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <span className="text-sm font-bold text-slate-900">₹{inv.grandTotalPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-center gap-1">
//                         {/* Action Buttons Group */}
//                         <div className="flex items-center gap-1 opacity-60 group-hover/row:opacity-100 transition-opacity">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               inv.invoiceType === "TAX_INVOICE" ? handleDownload(inv, e) : (setSelectedInvoice(inv), setIsViewOpen(true));
//                             }}
//                             className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                             title="Quick View"
//                           >
//                             <Eye size={17} />
//                           </button>
                          
//                           {inv.invoiceType !== "TAX_INVOICE" ? (
//                             <button
//                               onClick={(e) => { e.stopPropagation(); setSelectedTaxInvoice(inv); setIsTaxModalOpen(true); }}
//                               className="mx-1 px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-md hover:bg-blue-700 transition-colors uppercase tracking-wider"
//                             >
//                               Tax Invoice
//                             </button>
//                           ) : (
//                             <div className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider">Generated</div>
//                           )}

//                           <button onClick={(e) => handleDownload(inv, e)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Download PDF"><Download size={17} /></button>
//                           <button onClick={(e) => handleEmail(inv.id, e)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Email"><Mail size={17} /></button>
//                           <button onClick={(e) => handleDeliveryPreview(inv, e)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Truck View"><Truck size={17} /></button>
//                           <button onClick={(e) => handleDelete(inv.id, e)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Delete"><Trash2 size={17} /></button>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Improved Pagination */}
//         {totalPages > 1 && (
//           <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
//             <span className="text-sm text-slate-500 font-medium">
//               Showing <span className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, filteredInvoices.length)}</span> of <span className="text-slate-900">{filteredInvoices.length}</span> invoices
//             </span>
//             <div className="flex items-center gap-1">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(p => p - 1)}
//                 className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all"
//               >
//                 <ChevronLeft size={18} />
//               </button>
              
//               {[...Array(totalPages)].map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
//                     currentPage === i + 1 
//                       ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
//                       : "text-slate-600 hover:bg-slate-100"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}

//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(p => p + 1)}
//                 className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all"
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <InvoiceViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} invoice={selectedInvoice} />
//       <ConvertTaxInvoiceModal isOpen={isTaxModalOpen} onClose={() => setIsTaxModalOpen(false)} invoice={selectedTaxInvoice} onSuccess={fetchInvoices} />
//     </div>
//   );
// };

// export default InvoiceList;


import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  Trash2,
  Download,
  Search,
  Mail,
  Truck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Building2,
  FileCheck2
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getInvoices,
  deleteInvoice,
  Invoice,
  getDeliveryPreviewUrl,
  getTaxInvoicePreviewUrl,
  sendInvoiceEmail,
} from "../../services/invoiceService";
import InvoiceViewModal from "./InvoiceViewModal";
import ConvertTaxInvoiceModal from "./ConvertTaxInvoiceModal";
import { API_URL } from "../../config";

interface InvoiceListProps {
  onCreateClick: () => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ onCreateClick }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [selectedTaxInvoice, setSelectedTaxInvoice] = useState<Invoice | null>(null);
  
  // FILTERS STATE
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("ALL");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roleName = typeof user.role === 'object' ? user.role?.name : user.role;
  const isAdmin = roleName?.toLowerCase() === "admin";
  const userCompany = user?.company?.toLowerCase()?.trim();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await getInvoices();
      setInvoices(data || []);
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate Unique Options for Dropdowns
  const uniqueCompanies = Array.from(new Set(invoices.map(inv => inv.companyName).filter(Boolean))).sort();
  const uniqueInvoiceStatuses = Array.from(new Set(invoices.map(inv => inv.status).filter(Boolean))).sort();

  const filteredInvoices = invoices.filter((inv) => {
    // 1. Access Control (Admin vs Company User)
    const matchesAccess = isAdmin || (inv.companyName?.toLowerCase()?.trim() === userCompany);

    // 2. Search Term
    const matchesSearch =
      inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Payment Status Filter
    const matchesPaymentStatus = paymentStatusFilter === "ALL" ? true : inv.paymentStatus === paymentStatusFilter;

    // 4. Invoice Status Filter (NEW)
    const matchesInvoiceStatus = invoiceStatusFilter === "ALL" ? true : inv.status === invoiceStatusFilter;

    // 5. Specific Company Filter (NEW - mainly for Admin use)
    const matchesSpecificCompany = companyFilter === "ALL" ? true : inv.companyName === companyFilter;

    return matchesAccess && matchesSearch && matchesPaymentStatus && matchesInvoiceStatus && matchesSpecificCompany;
  });

  const scroll = (direction: "left" | "right") => {
    if (tableContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      tableContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // ... Handlers (handleDelete, handleDownload, etc. remain the same) ...
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try { await deleteInvoice(id); fetchInvoices(); toast.success("Invoice deleted successfully"); } 
      catch (error) { toast.error("Failed to delete invoice"); }
    }
  };

  const handleDownload = async (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      let url = "";
      if (invoice.invoiceType === "TAX_INVOICE") {
        const response = await getTaxInvoicePreviewUrl(invoice.id);
        url = response.url;
      } else {
        const date = invoice.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
        const response = await getDeliveryPreviewUrl(invoice.id, date);
        url = response.url;
      }
      window.open(url, "_blank");
    } catch (error) { toast.error("Failed to download invoice"); }
  };

  const handleEmail = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Send invoice via email to customer?")) {
      try { await sendInvoiceEmail(id); toast.success("Email sent successfully!"); } 
      catch (error) { toast.error("Failed to send email"); }
    }
  };

  const handleDeliveryPreview = async (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = invoice.id;
    try {
      let url = invoice.invoiceType === "TAX_INVOICE" ? `${API_URL}/invoices/${id}/download-tax-invoice` : `${API_URL}/invoices/${id}/download-sales-invoice`;
      window.open(url, "_blank");
    } catch (error) { toast.error("Failed to generate preview"); }
  };

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const StatusBadge = ({ type, status }: { type: 'payment' | 'invoice', status?: string }) => {
    const getColors = () => {
      const s = (status || 'PENDING').toUpperCase(); 
      if (['PAID', 'ACCEPTED', 'TAX_INVOICE_GENERATED', 'DELIVERED'].includes(s)) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      if (['PENDING', 'PARTIAL', 'SENT'].includes(s)) return 'bg-amber-50 text-amber-700 border-amber-100';
      if (['OVERDUE', 'REJECTED'].includes(s)) return 'bg-rose-50 text-rose-700 border-rose-100';
      return 'bg-slate-50 text-slate-600 border-slate-100';
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getColors()}`}>
        <span className="w-1 h-1 rounded-full bg-current mr-1.5"></span>
        {(status || 'PENDING').replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto p-4 md:p-6 bg-slate-50/50 min-h-screen">
      
      {/* Search and Filters Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
          
          {/* Search Bar */}
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search invoices, clients..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm text-slate-600"
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            
            {/* Company Filter (Visible to Admins) */}
            {isAdmin && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-slate-500 min-w-[180px]">
                <Building2 size={16} />
                <select
                  value={companyFilter}
                  onChange={(e) => { setCompanyFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-transparent py-1.5 outline-none text-xs font-bold uppercase flex-1 cursor-pointer"
                >
                  <option value="ALL">All Companies</option>
                  {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            {/* Invoice Status Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-slate-500 min-w-[160px]">
              <FileCheck2 size={16} />
              <select
                value={invoiceStatusFilter}
                onChange={(e) => { setInvoiceStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent py-1.5 outline-none text-xs font-bold uppercase flex-1 cursor-pointer"
              >
                <option value="ALL">Invoice Status</option>
              {uniqueInvoiceStatuses.map(s => (
  <option key={s} value={s}>
    {(s || "").replace('_', ' ')}
  </option>
))}
              
              
              </select>
            </div>

            {/* Payment Status Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-slate-500 min-w-[160px]">
              <Filter size={16} />
              <select
                value={paymentStatusFilter}
                onChange={(e) => { setPaymentStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent py-1.5 outline-none text-xs font-bold uppercase flex-1 cursor-pointer"
              >
                <option value="ALL">Payment Status</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="PARTIAL">Partial</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || paymentStatusFilter !== "ALL" || invoiceStatusFilter !== "ALL" || companyFilter !== "ALL") && (
                <button 
                    onClick={() => { setSearchTerm(""); setPaymentStatusFilter("ALL"); setInvoiceStatusFilter("ALL"); setCompanyFilter("ALL"); }}
                    className="text-xs font-bold text-blue-600 hover:underline px-2"
                >
                    Clear All
                </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => scroll('left')} className="m-2 p-2 bg-white shadow-xl rounded-full border border-slate-200 hover:bg-slate-50">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => scroll('right')} className="m-2 p-2 bg-white shadow-xl rounded-full border border-slate-200 hover:bg-slate-50">
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>

        <div ref={tableContainerRef} className="overflow-x-auto scroll-smooth">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Invoice No.</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Issued Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Company / Customer</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Invoice Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Payment</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">Loading your invoices...</td></tr>
              ) : paginatedInvoices.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">No invoices found matching these filters.</td></tr>
              ) : (
                paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group/row cursor-pointer text-sm" onClick={() => { setSelectedInvoice(inv); setIsViewOpen(true); }}>
                    <td className="px-6 py-4 font-bold text-blue-600">#{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(inv.invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 uppercase tracking-tight truncate max-w-[200px]">{inv.companyName || "N/A"}</span>
                        <span className="text-xs text-slate-400">{inv.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center"><StatusBadge type="invoice" status={inv.status} /></td>
                    <td className="px-6 py-4 text-center"><StatusBadge type="payment" status={inv.paymentStatus} /></td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">₹{inv.grandTotalPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1 opacity-60 group-hover/row:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); inv.invoiceType === "TAX_INVOICE" ? handleDownload(inv, e) : (setSelectedInvoice(inv), setIsViewOpen(true)); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={17} /></button>
                          {inv.invoiceType !== "TAX_INVOICE" ? (
                            <button onClick={(e) => { e.stopPropagation(); setSelectedTaxInvoice(inv); setIsTaxModalOpen(true); }} className="mx-1 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-md hover:bg-emerald-700 transition-colors uppercase tracking-wider">Tax Invoice</button>
                          ) : (
                            <div className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-bold rounded uppercase tracking-wider border border-blue-100">Tax Generated</div>
                          )}
                          <button onClick={(e) => handleDownload(inv, e)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Download size={17} /></button>
                          <button onClick={(e) => handleEmail(inv.id, e)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Mail size={17} /></button>
                          <button onClick={(e) => handleDeliveryPreview(inv, e)} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg"><Truck size={17} /></button>
                          <button onClick={(e) => handleDelete(inv.id, e)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={17} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Logic */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all"><ChevronLeft size={18} /></button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100"}`}>{i + 1}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>

      <InvoiceViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} invoice={selectedInvoice} />
      <ConvertTaxInvoiceModal isOpen={isTaxModalOpen} onClose={() => setIsTaxModalOpen(false)} invoice={selectedTaxInvoice} onSuccess={fetchInvoices} />
    </div>
  );
};

export default InvoiceList;