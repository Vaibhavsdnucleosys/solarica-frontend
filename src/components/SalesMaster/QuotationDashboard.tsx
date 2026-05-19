import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import DashboardHeader from "../DashboardHeader";
import SalesStats from "./SalesStats";
import QuotationList from "./QuotationList";
import CreateQuotationModal from "./CreateQuotationModal";
import NewQuotationForm from "./NewQuotationForm";
import SimpleQuotationForm from "./SimpleQuotationForm";
import ExportForm from "./ExportForm";
import CompanySelectionModal from "./CompanySelectionModal";
import { GeneratingModal, SuccessModal } from "./GenerationModals";
import {
  getAllQuotations,
  createQuotation,
  uploadPaymentProof,
  uploadQuotationDocuments,
} from "../../services/quotationService";
import {
  getInvoices,
  createInvoice,
  uploadInvoiceProof,
  sendInvoiceEmail,
  getInvoicePreviewUrl,
} from "../../services/invoiceService";
import QuotationInvoiceList from "./QuotationInvoiceList";
import { Plus, FileText, FileSpreadsheet, Globe } from "lucide-react";
import CompanyFilter from "../Common/CompanyFilter";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  Notification,
} from "../../services/notificationService";
import QuotationViewModal from "./QuotationViewModal";
import PumpEstimateForm from "./PumpEstimateForm";

const QuotationDashboard: React.FC<{
  user?: {
    name: string;
    role: string;
    image?: string;
  };
  hideHeader?: boolean;
}> = ({ user, hideHeader = false }) => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [showFullForm, setShowFullForm] = useState(false);
  const [showExportForm, setShowExportForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "quotations" | "invoices" | "exports"
  >("quotations");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
const [selectedAction, setSelectedAction] = useState<
  "estimate" | "export" | "pump" | null
>(null);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const data = await getAllQuotations();
      if (Array.isArray(data)) {
        setQuotations(data);
      } else if (data && data.quotations) {
        setQuotations(data.quotations);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setInvoicesLoading(true);
      const data = await getInvoices();
      if (Array.isArray(data)) {
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setInvoicesLoading(false);
    }
  };

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // View Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(
    null,
  );

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  useEffect(() => {
    fetchQuotations();
    fetchInvoices();
    fetchNotifications();

    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateQuotation = async (data: any) => {
    try {
      setIsGenerating(true);
      setGenerationProgress(10);
      fetchNotifications(); // Update notifications after action

      // Simulation of progress while starting
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 5;
        });
      }, 300);

      // Map frontend form fields to backend expected names,
      // but include ALL form data for the PDF generation logic
      // Default values/calculations logic ONLY if fields are missing (fallback for old forms)
      const budgetVal = parseFloat(data.totalCost || data.budget) || 0;
      const gstRateVal = parseFloat(data.gstRate) || 0;
      const subsidyVal = parseFloat(data.subsidyAmount) || 0;

      // Priority: Use the EXACT values sent from NewQuotationForm first
      const systemCostCombined =
        data.systemCost !== undefined ? parseFloat(data.systemCost) : budgetVal;
      const gstAmt =
        data.gstAmount !== undefined
          ? parseFloat(data.gstAmount)
          : (budgetVal * gstRateVal) / 100;
      const totalAmt =
        data.totalAmount !== undefined
          ? parseFloat(data.totalAmount)
          : budgetVal + gstAmt;
      const netPayable =
        data.netPayable !== undefined
          ? parseFloat(data.netPayable)
          : data.netCost !== undefined
            ? parseFloat(data.netCost)
            : budgetVal - subsidyVal;

      const submissionData = {
        ...data,
        companyName: data.customerName,
        companyEmail: data.customerEmail,
        companyPhone: data.customerPhone,
        fromCompanyName: data.fromCompanyName,
        systemCapacityKw:
          parseFloat(data.systemCapacity || data.systemCapacityKw) || 0,

        // Use the prioritized values
        systemCost: systemCostCombined,
        gstAmount: gstAmt,
        totalAmount: totalAmt,
        subsidyAmount: subsidyVal,
        netPayableAmount: netPayable,
        items: data.items || [],
        validityDays: parseInt(data.validityDays) || 7,
        numberOfFlats: parseInt(data.numberOfFlats) || 0,
      };

      const newQuotation = await createQuotation(submissionData);

      if (newQuotation && newQuotation.id && data.documents) {
        try {
          // Upload Aadhar/PAN
          if (data.documents.aadharCard || data.documents.panCard) {
            await uploadQuotationDocuments(newQuotation.id, {
              aadharCard: data.documents.aadharCard,
              panCard: data.documents.panCard,
            });
          }

          // Upload Light Bill
          if (data.documents.lightBill) {
            await uploadPaymentProof(
              newQuotation.id,
              data.documents.lightBill,
              "LIGHT_BILL",
            );
          }
        } catch (docError) {
          console.error("Error uploading documents:", docError);
          // Don't block success, just log
        }
      }

      // Generation complete
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Short delay to show 100% completion
      setTimeout(async () => {
        setIsGenerating(false);
        setShowSuccess(true);
        await fetchQuotations();
        setIsModalOpen(false);
        setShowFullForm(false);
        setGenerationProgress(0);
      }, 800);
    } catch (error) {
      setIsGenerating(false);
      setGenerationProgress(0);
      console.error("Failed to create quotation:", error);
      alert(
        "Failed to create quotation. Please check the console for details.",
      );
    }
  };

  const handleCreateInvoice = async (data: any) => {
    try {
      setIsGenerating(true);
      setGenerationProgress(20);

      let invoicePayload;

      if (data.isExport) {
        // ExportForm sends pre-formatted data
        invoicePayload = data;
      } else {
        // SimpleQuotationForm returns a slightly different structure than CreateInvoiceForm
        // Need to map it to backend Invoice schema
        invoicePayload = {
          companyName: data.fromCompanyName,
          invoiceNumber: data.invoiceNumber || `INV-${Date.now()}`,
          invoiceDate: data.invoiceDate
            ? new Date(data.invoiceDate).toISOString()
            : new Date().toISOString(),
          gstinNumber: data.fromGstin,
          paymentStatus: "PAID",
          modeOfDispatch: data.modeOfDispatch,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
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
          cashDiscount: Number(data.cashDiscount || 0),
          cgst: Number(data.totals.cgst || 0),
          sgst: Number(data.totals.sgst || 0),
          roundOff: Number(data.roundOff || 0),
          grandTotalPayable: Number(data.totals.grandTotal || 0),
          amountInWords: data.amountInWords || "",
          items: (data.items || []).map((item: any) => ({
            itemDescription: item.description,
            hsnSac: item.hsn,
            quantity: Number(item.qty || 0),
            unit: item.unit || "PCS",
            rate: Number(item.rate || 0),
            discount: Number(item.discPercent || 0),
            amount: Number(item.amount || 0),
          })),
          // Map Sales Person Details from SimpleQuotationForm
          salesPersonName: data.salesEmployeeName,
          salesPersonPhone: data.salesEmployeeNumber,
          category: data.category,
officerName: data.officerName,
officerContact: data.officerContact,
systemCapacity: data.systemCapacity,
        };
      }

      console.log("Sending Invoice Payload:", invoicePayload);

      const newInvoice = await createInvoice(invoicePayload as any);

      // [NEW] Upload Light Bill if present (for Estimates)
      if (newInvoice && newInvoice.id && data.lightBill) {
        try {
          console.log("Uploading Light Bill for Invoice:", newInvoice.id);
          await uploadInvoiceProof(newInvoice.id, data.lightBill, "LIGHT_BILL");
        } catch (docError) {
          console.error("Error uploading invoice documents:", docError);
          // Don't block success, just log
        }
      }

      // [NEW] Attempt to send email if this is an Estimate or Export Estimate and customerEmail is provided
      if (newInvoice && newInvoice.id && invoicePayload.customerEmail) {
        try {
          console.log(
            "Automatically sending email for new Estimate to:",
            invoicePayload.customerEmail,
          );
          await sendInvoiceEmail(newInvoice.id);
        } catch (emailError) {
          console.error(
            "Failed to automatically send email for invoice:",
            emailError,
          );
          // Don't fail the whole creation process just because email failed
        }
      }

      setGenerationProgress(100);
      setTimeout(async () => {
        setIsGenerating(false);
        setShowSuccess(true);
        await fetchInvoices();
        setShowFullForm(false);
        setActiveTab("invoices");
        setGenerationProgress(0);
      }, 800);
    } catch (error: any) {
      setIsGenerating(false);
      setGenerationProgress(0);
      console.error("Failed to create invoice:", error);

      if (error.response) {
        const errorDetail =
          error.response.data.details || error.response.data.error || "";
        if (
          errorDetail.includes(
            "Unique constraint failed on the fields: (`invoiceNumber`)",
          )
        ) {
          alert(
            "Error: Invoice Number already exists. Please use a different Invoice Number.",
          );
        } else {
          console.error("Error Response Data:", error.response.data);
          alert(
            `Failed to create invoice: ${error.response.data.message || error.message}`,
          );
        }
      } else {
        alert(`Failed to create invoice: ${error.message}`);
      }
    }
  };

  // [NEW] Action Modal State
  const [showActionModal, setShowActionModal] = useState(false);

//   const handleCompanySelect = (company: string) => {
//     setSelectedCompany(company);
//     setIsCompanyModalOpen(false);

//     // Check for specific companies to show the Estimate/Export popup
//     if (
//       [
//         "Solarica Energy India Pvt Ltd",
//         "Solarica Fabtech Pvt Ltd",
//         "Solarica Industries Pvt Ltd",
//       ].includes(company)
//     ) {
//       setShowActionModal(true);
//     } else {
//       // Default behavior for other companies
//       setShowFullForm(true);
//     }
//   };

  // const handleActionChoice = (action: 'estimate' | 'export') => {

  //   const handleActionChoice = (action: "estimate" | "export" | "pump") => {
  //     if (action === "estimate") {
  //       setShowActionModal(false);
  //       setShowFullForm(true);
  //     } else {
  //       // Export logic
  //       setShowActionModal(false);
  //       setShowExportForm(true);
  //     }
  //   };

 const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setIsCompanyModalOpen(false);

    const actionCompanies = [
        "Solarica Energy India Pvt Ltd",
        "Solarica Fabtech Pvt Ltd",
        "Solarica Industries Pvt Ltd",
    ];

    if (actionCompanies.includes(company)) {
        setShowActionModal(true);
    } else {
        setShowFullForm(true);
    }
};
 
 
//   const handleActionChoice = (action: "estimate" | "export" | "pump") => {
//     if (action === "estimate") {
//       setShowActionModal(false);
//       setShowFullForm(true);
//     } else if (action === "export") {
//       setShowActionModal(false);
//       setShowExportForm(true);
//     } else if (action === "pump") {
//   setShowActionModal(false);
//   setShowFullForm(true);   // 👈 SAME FORM
// }
//   };

const handleActionChoice = (action: "estimate" | "export" | "pump") => {
  setSelectedAction(action);

  if (action === "estimate") {
    setShowActionModal(false);
    setShowFullForm(true);
  } else if (action === "export") {
    setShowActionModal(false);
    setShowExportForm(true);
  } else if (action === "pump") {
    setShowActionModal(false);
    setShowFullForm(true);
  }
};

  // const stats = {
  //     total: quotations.length,
  //     pending: quotations.filter(q => {
  //         const s = (q.status || '').toLowerCase();
  //         return s === 'pending' || s === 'sent' || s === 'followup' || s === 'draft';
  //     }).length,
  //     accepted: quotations.filter(q => (q.status || '').toLowerCase() === 'accepted').length,
  //     rejected: quotations.filter(q => (q.status || '').toLowerCase() === 'rejected').length,
  // };

  const filteredQuotations = quotations.filter((q) => {
    if (!searchQuery) return true; // ✅ IMPORTANT
    return (
      q.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.companyEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // ✅ FIRST: filtered data

  // const stats = {
  //     total: filteredQuotations.length,
  //     pending: 0,
  //     accepted: 0,
  //     rejected: 0,
  // };

  const currentData =
    activeTab === "quotations"
      ? filteredQuotations
      : activeTab === "invoices"
        ? invoices.filter((i) => i.category !== "EXPORT")
        : invoices.filter((i) => i.category === "EXPORT");

  const stats = {
    total: currentData.length,
    pending: 0,
    accepted: 0,
    rejected: 0,
  };

  currentData.forEach((item: any) => {
    const s = (item.status || item.paymentStatus || "").toLowerCase();

    if (s.includes("accept") || s.includes("paid")) stats.accepted++;
    else if (s.includes("reject")) stats.rejected++;
    else stats.pending++;
  });
  filteredQuotations.forEach((q) => {
    const s = (q.status || q.quotationStatus || "").toString().toLowerCase();

    if (s.includes("accept")) stats.accepted++;
    else if (s.includes("reject")) stats.rejected++;
    else stats.pending++;
  });

  useEffect(() => {
    console.log(
      "👉 STATUS CHECK:",
      filteredQuotations.map((q) => q.status),
    );
  }, [filteredQuotations]);

  console.log("Quotations:", quotations);
  console.log("Filtered:", filteredQuotations);
  console.log("Stats:", stats);

  return (
    <>

  {showFullForm ? (
    [
      "Solarica Energy India Pvt Ltd",
      "Solarica Fabtech Pvt Ltd",
      "Solarica Industries Pvt Ltd",
    ].includes(selectedCompany) ? (
      <SimpleQuotationForm
        onBack={() => setShowFullForm(false)}
        onSubmit={handleCreateInvoice}
        initialCompany={selectedCompany}

        // ✅ FIXED LOGIC
      formTitle={
  selectedCompany === "Solarica Energy India Pvt Ltd" &&
  selectedAction === "pump"
    ? "Pump Estimate"
    : "Estimate"
}

       type={
  selectedCompany === "Solarica Energy India Pvt Ltd" &&
  selectedAction === "pump"
    ? "PUMP"
    : "NORMAL"
}
      />
    ) : (
      <NewQuotationForm
        onBack={() => setShowFullForm(false)}
        onSubmit={handleCreateQuotation}
        initialCompany={selectedCompany}
      />
    )
  ) : showExportForm ? (
    <ExportForm
      onBack={() => setShowExportForm(false)}
      onSubmit={handleCreateInvoice}
    />
  ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-2 py-6">
          {!hideHeader && (
            <>
              <DashboardHeader
                title="Quotation Management"
                hideLogout={true}
                action={
                  <button
                    onClick={() => setIsCompanyModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 font-bold flex items-center gap-2 group"
                  >
                    <Plus
                      size={20}
                      className="group-hover:rotate-90 transition-transform"
                    />
                    <span>Create New Quotation</span>
                  </button>
                }
                user={user}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                // Notification Props
                hideNotifications={false}
                notifications={notifications}
                unreadCount={notifications.filter((n) => !n.isRead).length}
                isNotificationOpen={isNotificationOpen}
                setIsNotificationOpen={setIsNotificationOpen}
                handleMarkAsRead={handleMarkAsRead}
                handleMarkAllAsRead={handleMarkAllAsRead}
                // onViewQuotation={(id) => {
                //     setSelectedQuotationId(id);
                //     setViewModalOpen(true);
                // }}

                onViewQuotation={(id) => {
                  // 🔥 Check if this ID exists in invoices
                  const isInvoice = invoices.some((inv) => inv.id === id);

                  if (isInvoice) {
                    // 👉 Open invoice preview (same as View button)
                    getInvoicePreviewUrl(id)
                      .then((res) => window.open(res.url, "_blank"))
                      .catch(() => alert("Invoice not found"));
                  } else {
                    // 👉 Open quotation modal
                    setSelectedQuotationId(id);
                    setViewModalOpen(true);
                  }
                }}
              />

              {/* <SalesStats {...stats} /> */}
              {!loading && <SalesStats {...stats} />}

              {/* Tabs */}
              <div className="flex items-center gap-1 mb-6 p-1 bg-slate-100/50 rounded-2xl w-fit">
                <button
                  onClick={() => setActiveTab("quotations")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === "quotations"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <FileSpreadsheet size={16} />
                  Quotations
                </button>
                <button
                  onClick={() => setActiveTab("invoices")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === "invoices"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <FileText size={16} />
                  Estimates
                </button>
                <button
                  onClick={() => setActiveTab("exports")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === "exports"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Globe size={16} />
                  Export Estimates
                </button>
              </div>
            </>
          )}

          <div className="mt-6 relative">
            {(loading || invoicesLoading) && (
              <div className="absolute inset-x-0 -top-2 z-[10] h-1.5 bg-blue-50/50 backdrop-blur-sm overflow-hidden rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-progress"
                  style={{ width: "40%" }}
                />
              </div>
            )}
            {activeTab === "quotations" ? (
              <QuotationList
                quotations={filteredQuotations}
                loading={loading}
                onRefresh={fetchQuotations}
                onView={(id) => {
                  setSelectedQuotationId(id);
                  setViewModalOpen(true);
                }}
              />
            ) : activeTab === "invoices" ? (
              <QuotationInvoiceList
                invoices={invoices.filter((i) => i.category !== "EXPORT")}
                loading={invoicesLoading}
                onRefresh={fetchInvoices}
              />
            ) : (
              <QuotationInvoiceList
                invoices={invoices.filter((i) => i.category === "EXPORT")}
                loading={invoicesLoading}
                onRefresh={fetchInvoices}
              />
            )}
          </div>

          <CreateQuotationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateQuotation}
          />

          <CompanySelectionModal
            isOpen={isCompanyModalOpen}
            onClose={() => setIsCompanyModalOpen(false)}
            onSelect={handleCompanySelect}
          />

          {showActionModal &&
            ReactDOM.createPortal(
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 mb-4">
                      <FileText size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">
                        Select Action
                      </h3>
                      <p className="text-slate-500 font-bold text-xs mt-2">
                        Choose how you want to proceed for <br />
                        <span className="text-blue-600">{selectedCompany}</span>
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <button
                        onClick={() => handleActionChoice("estimate")}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
                      >
                        Create Estimate
                      </button>
                      <button
                        onClick={() => handleActionChoice("export")}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all"
                      >
                        Export Invoice
                      </button>
                    {selectedCompany === "Solarica Energy India Pvt Ltd" && (
  <button onClick={() => handleActionChoice("pump")}
  
                          className="w-full py-4 bg-gradient-to-r from-amber-500 to-green-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all"
  >
    Pump Estimate
  </button>
)}
                    </div>

                    <button
                      onClick={() => setShowActionModal(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest mt-4"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>,
              document.body,
            )}
        </div>
      )}

      <GeneratingModal isOpen={isGenerating} progress={generationProgress} />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      <QuotationViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        quotationId={selectedQuotationId}
      />
    </>
  );
};

export default QuotationDashboard;
