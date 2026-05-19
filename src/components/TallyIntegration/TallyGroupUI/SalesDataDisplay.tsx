import React, { useState, useEffect } from "react";
import {
  getAllQuotations,
  getPDFDownloadUrl,
} from "../../../services/quotationService";
import {API_URL } from "../../../config";
import {
  getInvoices,
  getInvoiceDownloadUrl,
  getInvoiceProofs,
} from "../../../services/invoiceService";
import {
  Bell,
  Check,
  XCircle,
  FileText,
  LogIn,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  Notification,
} from "../../../services/notificationService";
import { DocumentUploadModal } from "./DocumentUploadModal";
import EditSalesModal from "./EditSalesModal";
import toast from "react-hot-toast";
// ─── Inline Login Gate ────────────────────────────────────────────────────────
const SalesLoginGate: React.FC<{ onLoginSuccess: () => void }> = ({
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-[#f0f6fb] p-8">
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-[#dde8f0] overflow-hidden"
        style={{
          animation: "gatewayPopIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a202c] to-[#2a5585] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#feba35] flex items-center justify-center shadow">
              <Lock size={16} className="text-[#1a202c]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Sales Info Access</p>
              <p className="text-white/50 text-[11px]">
                Sign in to view quotation data
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#5ea4d6] uppercase tracking-widest">
              Email
            </label>
            <div className="flex items-center gap-2 border-b-2 border-[#c8dde8] focus-within:border-[#2a5585] pb-1 transition-colors">
              <Mail size={14} className="text-[#5ea4d6] shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-transparent text-sm text-[#1b2c3c] outline-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#5ea4d6] uppercase tracking-widest">
              Password
            </label>
            <div className="flex items-center gap-2 border-b-2 border-[#c8dde8] focus-within:border-[#2a5585] pb-1 transition-colors">
              <Lock size={14} className="text-[#5ea4d6] shrink-0" />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="flex-1 bg-transparent text-sm text-[#1b2c3c] outline-none placeholder-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="text-[#5ea4d6] hover:text-[#2a5585]"
              >
                {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-gradient-to-r from-[#2a5585] to-[#1e4a7a] hover:from-[#1e4a7a] hover:to-[#14366b]
                            text-white font-bold py-2.5 rounded-xl shadow transition-all duration-150 flex items-center justify-center gap-2
                            disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <LogIn size={15} />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};
// ──────────────────────────────────────────────────────────────────────────────

interface SalesDataProps {
  onClose?: () => void;
  onAction?: (actionName: string, payload: any) => void;
}

const SalesDataDisplay: React.FC<SalesDataProps> = ({ onClose, onAction }) => {
  const [activeTab, setActiveTab] = useState<
    "quotation" | "estimated" | "export"
  >("quotation");

  const [activeCard, setActiveCard] = useState<
  "all" | "pending" | "accepted" | "rejected"
>("all");
  const [quotations, setQuotations] = useState<any[]>([]);
  const [domesticInvoices, setDomesticInvoices] = useState<any[]>([]);
  const [exportInvoices, setExportInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbOffline, setDbOffline] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRejectModal, setShowRejectModal] =
    useState(false);

const [rejectReason, setRejectReason] =
    useState("");

const [rejectItem, setRejectItem] =
    useState<any>(null);

  // ── Auth gate state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token"),
  );

  // State for raw data to calculate stats
  const [allQuotations, setAllQuotations] = useState<any[]>([]);
  const [allInvoices, setAllInvoices] = useState<any[]>([]);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Document Modal State
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(
    null,
  );
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userCompany = user?.company?.toLowerCase()?.trim();

  // const userCompany =user?.companyName?.toLowerCase()?.trim();
  // ── Token validation on mount ─────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/quotations?limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Main data fetch (runs when authenticated) ─────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchData();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

// const handleStatusChange = async (
//     id: string,
//     status: string,
//     type: "quotation" | "invoice"
// ) => {

//     try {

//         const token =
//             localStorage.getItem("token");

//         const endpoint =
//             type === "quotation"
//                 ? `${API_URL}/quotations/${id}`
//                 : `${API_URL}/invoices/${id}`;

//         const response = await fetch(
//             endpoint,
//             {
//                 method: "PUT",

//                 headers: {
//                     "Content-Type":
//                         "application/json",

//                     Authorization:
//                         `Bearer ${token}`,
//                 },

//                 body: JSON.stringify({
//                     status,
//                     paymentStatus: status,
//                 }),
//             }
//         );

//         if (!response.ok) {
//             throw new Error(
//                 "Failed to update status"
//             );
//         }

//         // REFRESH DATA

//         await fetchData();

//     } catch (error) {

//         console.error(
//             "Status update failed:",
//             error
//         );

//         alert(
//             "Failed to update status"
//         );
//     }
// };



// const handleStatusChange = async (
//     id: string,
//     status: string,
//     type: "quotation" | "invoice"
// ) => {

//     try {

//         const token = localStorage.getItem("token");

//         const endpoint =
//             type === "quotation"
//                 ? `${API_URL}/quotations/${id}`
//                 : `${API_URL}/invoices/${id}`;

//         const payload: any = {
//             status,
//             paymentStatus: status,
//         };

//         // NEW CONDITION
//         if (
//             type === "invoice" &&
//             status.toUpperCase() === "ACCEPTED"
//         ) {
//             payload.proformaAccepted = true;
//             payload.proformaAcceptedAt = new Date();
//             payload.paymentStatus = "PROFORMA_INVOICE_ACCEPTED";
//         }

//         const response = await fetch(endpoint, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//             throw new Error("Failed to update status");
//         }

//         await fetchData();

//     } catch (error) {

//         console.error("Status update failed:", error);

//         alert("Failed to update status");
//     }
// };


const handleStatusChange = async (
    id: string,
    status: string,
    type: "quotation" | "invoice"
) => {

    try {

        const token =
            localStorage.getItem("token");

        const endpoint =
            type === "quotation"
                ? `${API_URL}/quotations/${id}`
                : `${API_URL}/invoices/${id}`;

        const payload: any = {
            status,
            paymentStatus: status,
        };

        // ACCEPT CONDITION

        if (
            type === "invoice" &&
            status.toUpperCase() === "ACCEPTED"
        ) {

            payload.proformaAccepted = true;

            payload.proformaAcceptedAt =
                new Date();

            payload.paymentStatus =
                "PROFORMA_INVOICE_ACCEPTED";
        }

        // REJECT CONDITION
if (
    type === "invoice" &&
    status.toUpperCase() === "REJECTED"
) {

    setRejectItem({
        id,
        type,
    });

    setRejectReason("");

    setShowRejectModal(true);

    return;
}

        const response = await fetch(
            endpoint,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body: JSON.stringify(payload),
            }
        );

        if (!response.ok) {

            throw new Error(
                "Failed to update status"
            );
        }

        await fetchData();

    } catch (error) {

        console.error(
            "Status update failed:",
            error
        );

        alert(
            "Failed to update status"
        );
    }
};

const submitRejectReason = async () => {

    try {

        if (!rejectReason.trim()) {

            toast.error(
                "Please enter rejection reason"
            );

            return;
        }

        const token =
            localStorage.getItem("token");

        const endpoint =
            rejectItem.type === "quotation"
                ? `${API_URL}/quotations/${rejectItem.id}`
                : `${API_URL}/invoices/${rejectItem.id}`;

        const response = await fetch(
            endpoint,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body: JSON.stringify({

                    status: "REJECTED",

                    paymentStatus:
                        "REJECTED",

                    rejectionReason:
                        rejectReason,
                }),
            }
        );

        if (!response.ok) {

            throw new Error(
                "Failed to reject"
            );
        }

        toast.success(
            "Rejected Successfully"
        );

        setShowRejectModal(false);

        setRejectReason("");

        setRejectItem(null);

        fetchData();

    } catch (error) {

        console.error(error);

        toast.error(
            "Failed to reject"
        );
    }
};

  const handleMarkAsRead = async (
    id: string,
    quotationId?: string,
    title?: string,
  ) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );

      // Auto close notifications
      setIsNotificationOpen(false);

      // Navigate based on notification content if quotationId exists
      if (quotationId) {
        if (title?.includes("Converted")) {
          // It's a proforma conversion, let's just go to the domestic valid tab for now
          // In a perfect world we'd know if it's export or domestic, but this is a good start
          setActiveTab("estimated");

          try {
            const result = await getInvoiceDownloadUrl(quotationId);
            if (result?.url) window.open(result.url, "_blank");
          } catch (e) {
            console.error("Failed to open invoice PDF:", e);
            alert("Failed to open invoice document");
          }
        } else {
          setActiveTab("quotation");
          try {
            const pdfUrl = await getPDFDownloadUrl(quotationId);
            if (pdfUrl) {
              const link = document.createElement("a");
              link.href = pdfUrl;
              link.target = "_blank";
              link.click();
            } else {
              alert("Quotation document not available");
            }
          } catch (e) {
            console.error("Failed to open quotation PDF:", e);
            alert("Failed to open quotation document");
          }
        }
      }
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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setDbOffline(false);

      // Helper: detect auth failure
      const isAuthErr = (err: any) =>
        err?.response?.status === 401 || err?.response?.status === 403;

      // Fetch quotations
      try {
        const quotationsResponse = await getAllQuotations();
        if (quotationsResponse?.dbOffline) setDbOffline(true);
        const quotes = Array.isArray(quotationsResponse?.quotations)
          ? quotationsResponse.quotations
          : Array.isArray(quotationsResponse)
            ? quotationsResponse
            : [];
        // setAllQuotations(quotes);
        // setQuotations(quotes.filter((q: any) => (q.status || '').toUpperCase() === 'ACCEPTED'));
        const filteredQuotes = quotes.filter(
          (q: any) => q.companyName?.toLowerCase()?.trim() === userCompany,
        );

        setAllQuotations(filteredQuotes);

        setQuotations(
          filteredQuotes.filter(
            (q: any) => (q.status || "").toUpperCase() === "ACCEPTED",
          ),
        );
      } catch (quotErr: any) {
        if (isAuthErr(quotErr)) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setAllQuotations([]);
        setQuotations([]);
      }

      // Fetch invoices
      try {
        const invoicesResponse = await getInvoices();
        const invoices = Array.isArray(invoicesResponse)
          ? invoicesResponse
          : [];
        console.log("[SalesDataDisplay] Fetched Invoices:", invoices.length);
        // setAllInvoices(invoices);

        // const filteredInvoices = invoices.filter(
        //   (inv: any) => inv.companyName?.toLowerCase()?.trim() === userCompany,
        // );

        // setAllInvoices(filteredInvoices);

        // // Same logic as TallySalesInfo: Exports are marked EXPORT, everything else is domestic (Estimate)
        // const domestic = invoices.filter(
        //   (inv: any) => inv.category !== "EXPORT" && inv.isProforma,
        // );
        // const exportInv = invoices.filter(
        //   (inv: any) => inv.category === "EXPORT" && inv.isProforma,
        // );

        // console.log(
        //   `[SalesDataDisplay] Categorized: ${domestic.length} Domestic, ${exportInv.length} Export`,
        // );
        // setDomesticInvoices(domestic);
        // setExportInvoices(exportInv);

        const filteredInvoices = invoices.filter(
  (inv: any) =>
    inv.companyName?.toLowerCase()?.trim() === userCompany
);

setAllInvoices(filteredInvoices);

const domestic = filteredInvoices.filter(
  (inv: any) =>
    inv.category !== "EXPORT" && inv.isProforma
);

const exportInv = filteredInvoices.filter(
  (inv: any) =>
    inv.category === "EXPORT" && inv.isProforma
);

setDomesticInvoices(domestic);
setExportInvoices(exportInv);
      } catch (invErr: any) {
        if (isAuthErr(invErr)) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setAllInvoices([]);
        setDomesticInvoices([]);
        setExportInvoices([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹ ${(amount || 0).toLocaleString("en-IN")}`;
  };


  const getDisplayStatus = (status?: string) => {

    const normalized =
        (status || "").toUpperCase();

    if (
        normalized ===
        "PROFORMA_INVOICE_ACCEPTED"
    ) {
        return "ACCEPTED";
    }

    return normalized;
};
  // Calculate dynamic stats for currently active tab
  const getStats = () => {
    let items: any[] = [];
    let statusField = "status";
    let amountField = "netPayableAmount";

    if (activeTab === "quotation") {
      items = allQuotations;
      statusField = "status";
      amountField = "netPayableAmount";
    } else if (activeTab === "estimated") {
      items = domesticInvoices;
      statusField = "paymentStatus";
      amountField = "grandTotalPayable";
    } else if (activeTab === "export") {
      items = exportInvoices;
      statusField = "paymentStatus";
      amountField = "grandTotalPayable";
    }

    const totalValue = items.reduce(
      (sum, item) => sum + (item[amountField] || 0),
      0,
    );

    return {
      total: items.length,
      pending: items.filter((i) => {
        const s = (i.status || i.paymentStatus || "").toUpperCase();
        return ["DRAFT", "PENDING", "SENT", "FOLLOWUP", "PARTIAL"].includes(s);
      }).length,
      accepted: items.filter((i) => {
        const s = (i.status || i.paymentStatus || "").toUpperCase();
        return ["ACCEPTED", "APPROVED", "PAID", "DELIVERED"].includes(s);
      }).length,
      rejected: items.filter((i) => {
        const s = (i.status || i.paymentStatus || "").toUpperCase();
        return ["REJECTED", "DECLINED", "OVERDUE", "CANCELLED"].includes(s);
      }).length,
      totalValue: formatCurrency(totalValue),
    };
  };

  const stats = getStats();

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "quotation":
        return quotations;
      case "estimated":
        return domesticInvoices;
      case "export":
        return exportInvoices;
      default:
        return quotations;
    }
  };

  // const currentData = getCurrentData();

  const currentData = getCurrentData();

const filteredData = currentData.filter((item: any) => {

  if (activeCard === "all") {
    return true;
  }

  const status = (
    item.status ||
    item.paymentStatus ||
    ""
  ).toUpperCase();

  if (activeCard === "pending") {
    return ["PENDING", "DRAFT", "SENT"].includes(status);
  }

  if (activeCard === "accepted") {
    return [
      "ACCEPTED",
      "PAID",
      "DELIVERED",
      "PROFORMA_INVOICE_ACCEPTED"
    ].includes(status);
  }

  if (activeCard === "rejected") {
    return ["REJECTED", "OVERDUE"].includes(status);
  }

  return true;
});

  // Get tab-specific title and summary
  const getTabInfo = () => {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    switch (activeTab) {
      case "quotation":
        return {
          title: "Quotation Management",
          subtitle: today,
          ...stats,
        };
      case "estimated":
        return {
          title: "Proforma Invoice Management",
          subtitle: today,
          ...stats,
        };
      case "export":
        return {
          title: "Export Proforma Management",
          subtitle: today,
          ...stats,
        };
      default:
        return {
          title: "Sales Management",
          subtitle: today,
          ...stats,
        };
    }
  };

  const tabInfo = getTabInfo();

  const handleViewPDF = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      let url = "";

      if (activeTab === "quotation") {
        url = await getPDFDownloadUrl(id);
      } else {
        // For estimates and exports (invoices)
        const result = await getInvoiceDownloadUrl(id);
        url = result.url;
      }

      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.click();
      } else {
        alert("Document URL not found");
      }
    } catch (error) {
      console.error("Error fetching document URL:", error);
      alert("Failed to open document");
    }
  };

  // const handleDocumentClick = async (id: string, e: React.MouseEvent) => {
  //   e.stopPropagation();

  //   try {
  //     const proofs = await getInvoiceProofs(id);

  //     if (!proofs || proofs.length === 0) {
  //       alert("No documents found");
  //       return;
  //     }

  //     proofs.forEach((proof: any) => {
  //       if (proof.fileUrl) {
  //         window.open(proof.fileUrl, "_blank");
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error fetching proofs:", error);
  //     alert("Failed to load documents");
  //   }
  // };

  // ── Login gate ───────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col flex-1 bg-[#f5f7fa] overflow-hidden">
        <SalesLoginGate onLoginSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#f5f7fa] text-black overflow-hidden">
      {/* Document Upload Modal */}
      {showDocumentModal && selectedQuotationId && (
        <DocumentUploadModal
          quotationId={selectedQuotationId}
          onClose={() => {
            setShowDocumentModal(false);
            setSelectedQuotationId(null);
          }}
          entityType={activeTab === "quotation" ? "quotation" : "invoice"}
          readOnly={true}
        />
      )}


      {/* DB Offline Banner */}
      {dbOffline && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-800 text-xs font-semibold">
          <span className="text-base">⚠️</span>
          Database is temporarily offline. Showing cached/empty data. Connect to
          Supabase to see live records.
          <button
            onClick={fetchData}
            className="ml-auto text-amber-700 underline hover:text-amber-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {tabInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {tabInfo.subtitle}
            </p>
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => {
                const willOpen = !isNotificationOpen;
                setIsNotificationOpen(willOpen);
                if (willOpen && unreadCount > 0) {
                  handleMarkAllAsRead();
                }
              }}
              className={`p-2 rounded-xl border transition-all relative ${isNotificationOpen ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce-slow">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationOpen(false)}
                />
                <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-100 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-6 bg-slate-900 text-white">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg">Notifications</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#394ca7] bg-[#394ca7]/10 px-2 py-1 rounded-lg">
                        Real-time
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-white/50 text-xs font-medium">
                        {unreadCount} unread alerts
                      </p>
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto bg-slate-50/50">
                    {notifications.length === 0 ? (
                      <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
                        <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                          <Bell size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-400">
                          All caught up!
                        </p>
                        <p className="text-[10px] text-slate-300 font-medium px-4">
                          No new updates on quotations or sales activity.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() =>
                              handleMarkAsRead(
                                notif.id,
                                notif.quotationId,
                                notif.title,
                              )
                            }
                            className={`p-5 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer group ${!notif.isRead ? "bg-blue-50/30" : ""}`}
                          >
                            <div
                              className={`size-10 rounded-xl shrink-0 flex items-center justify-center ${
                                notif.type === "SUCCESS"
                                  ? "bg-emerald-50 text-emerald-500"
                                  : notif.type === "WARNING"
                                    ? "bg-amber-50 text-amber-500"
                                    : "bg-blue-50 text-blue-500"
                              }`}
                            >
                              {notif.type === "SUCCESS" ? (
                                <Check size={18} />
                              ) : notif.type === "WARNING" ? (
                                <XCircle size={18} />
                              ) : (
                                <FileText size={18} />
                              )}
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-bold text-slate-800">
                                  {notif.title}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap shrink-0">
                                  {new Date(notif.createdAt).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                                {notif.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"> */}
        <div
  onClick={() => setActiveCard("all")}
  className={`bg-white rounded-lg p-4 border shadow-sm cursor-pointer transition-all duration-200
  ${
    activeCard === "all"
      ? "border-blue-500 ring-2 ring-blue-100 scale-[1.02]"
      : "border-gray-200 hover:border-blue-200"
  }`}
>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Total{" "}
                {activeTab === "quotation" ? "Quotations" : "Proforma Invoices"}
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {tabInfo.total}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"> */}
        <div
  onClick={() => setActiveCard("pending")}
  className={`bg-white rounded-lg p-4 border shadow-sm cursor-pointer transition-all duration-200
  ${
    activeCard === "pending"
      ? "border-orange-500 ring-2 ring-orange-100 scale-[1.02]"
      : "border-gray-200 hover:border-orange-200"
  }`}
>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Action</p>
              <p className="text-3xl font-bold text-gray-800">
                {tabInfo.pending}
              </p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"> */}

<div
  onClick={() => setActiveCard("accepted")}
  className={`bg-white rounded-lg p-4 border shadow-sm cursor-pointer transition-all duration-200
  ${
    activeCard === "accepted"
      ? "border-green-500 ring-2 ring-green-100 scale-[1.02]"
      : "border-gray-200 hover:border-green-200"
  }`}
>          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Accepted</p>
              <p className="text-3xl font-bold text-gray-800">
                {tabInfo.accepted}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"> */}
        <div
  onClick={() => setActiveCard("rejected")}
  className={`bg-white rounded-lg p-4 border shadow-sm cursor-pointer transition-all duration-200
  ${
    activeCard === "rejected"
      ? "border-red-500 ring-2 ring-red-100 scale-[1.02]"
      : "border-gray-200 hover:border-red-200"
  }`}
>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-800">
                {tabInfo.rejected}
              </p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 sm:px-6 overflow-x-auto">
        <div className="flex gap-2 border-b border-gray-200 min-w-max">
          <button
            onClick={() => setActiveTab("quotation")}
            className={`px-4 py-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === "quotation"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📋 QUOTATIONS
          </button>
          <button
            onClick={() => setActiveTab("estimated")}
            className={`px-4 py-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === "estimated"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📊 PROFORMA INVOICES
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`px-4 py-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === "export"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🌐 EXPORT PROFORMA
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-hidden px-4 sm:px-6 py-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
          {/* Table Container - Modified for Sticky Header */}
          {/* Table Container - Modified for Sticky Header & Horizontal Scroll */}
          <div className="flex-1 overflow-auto relative w-full">
            {/* Wrapper for min-width to ensure no squashing */}
            <div className="min-w-[1000px]">
              {/* Sticky Table Header */}
              <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-4 py-3">
                <div className="grid grid-cols-[0.8fr,1.5fr,1.5fr,1fr,1fr,1fr,0.8fr] gap-4 text-xs font-semibold text-gray-600 uppercase items-center">
                  <div className="text-left pl-2">Date & Ref</div>
                  <div className="text-left">Client</div>
                  <div className="text-left">Client Email</div>
                  <div className="text-right">Net Payable</div>
                  <div className="flex justify-center">Created By</div>
                  <div className="flex justify-center">Status</div>
                  <div className="flex justify-center">Actions</div>
                </div>
              </div>

              {/* Table Body Content */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Loading...</div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-red-500">{error}</div>
                </div>
              ) : 
              // currentData.length === 0 
              
              filteredData.length === 0
              ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">No data found</div>
                </div>
              ) : (
                // currentData.map((item: any, index: number) => {
                filteredData.map((item: any, index: number) => {
                  // Determine field names based on active tab
                  const isQuotation = activeTab === "quotation";
                  const date = isQuotation ? item.createdAt : item.invoiceDate;
                  const ref = isQuotation
                    ? `Q-${item.id.slice(0, 8)}`
                    : item.invoiceNumber;
                  const company = item.companyName;
                  const customer = isQuotation
                    ? item.companyEmail
                    : item.customerName;
                  const email = isQuotation
                    ? item.companyEmail
                    : item.customerEmail || "";
                  const amount = isQuotation
                    ? item.netPayableAmount
                    : item.grandTotalPayable;
                  const createdBy = item.createdBy?.name || "Unknown";

                  // Determine item status based on tab type
             const itemStatus =
    getDisplayStatus(
        isQuotation
            ? item.status
            : item.status ||
                  item.paymentStatus
    ) || "N/A";
                  return (
                    <div
                      key={item.id || index}
                      className="grid grid-cols-[0.8fr,1.5fr,1.5fr,1fr,1fr,1fr,0.8fr] gap-4 px-4 py-3 text-sm border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors items-center"
                    >
                      <div className="text-left pl-2 overflow-hidden">
                        <div className="font-semibold text-gray-800 text-[11px] truncate">
                          {formatDate(date)}
                        </div>
                        <div
                          className="text-[10px] text-blue-600 font-medium truncate"
                          title={ref}
                        >
                          {ref}
                        </div>
                      </div>
                      <div
                        className="text-gray-700 truncate text-left"
                        title={company}
                      >
                        {company}
                      </div>
                      <div className="text-left overflow-hidden">
                        <div
                          className="font-medium text-gray-800 truncate"
                          title={customer}
                        >
                          {customer}
                        </div>
                        <div
                          className="text-xs text-gray-500 truncate"
                          title={email}
                        >
                          {email}
                        </div>
                      </div>
                      <div className="text-right font-bold text-gray-800 truncate">
                        {formatCurrency(amount)}
                      </div>

                      {/* Centered Created By */}
                      <div className="flex flex-col items-center justify-center text-center overflow-hidden">
                        <div
                          className="text-gray-700 truncate w-full"
                          title={createdBy}
                        >
                          {createdBy}
                        </div>
                        <div className="text-xs text-gray-500 italic w-full">
                          {createdBy.split(" ")[0]}
                        </div>
                      </div>


                      {/* REJECT MODAL */}

{showRejectModal && (

<div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-[1.5px]">        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between mb-4">

                <h2 className="text-xl font-bold text-slate-800">
                    Reject Reason
                </h2>

                <button
                    onClick={() => {

                        setShowRejectModal(false);

                        setRejectReason("");

                        setRejectItem(null);
                    }}
                    className="text-slate-400 hover:text-red-500 text-xl"
                >
                    ✕
                </button>
            </div>

            <p className="text-sm text-slate-500 mb-3">
                Please enter reason for rejection
            </p>

            <textarea
                value={rejectReason}
                onChange={(e) =>
                    setRejectReason(
                        e.target.value
                    )
                }
                rows={5}
                placeholder="Enter rejection reason..."
                className="w-full border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none"
            />

            <div className="flex justify-end gap-3 mt-5">

                <button
                    onClick={() => {

                        setShowRejectModal(false);

                        setRejectReason("");

                        setRejectItem(null);
                    }}
                    className="px-5 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100"
                >
                    Cancel
                </button>

                <button
                    onClick={submitRejectReason}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg"
                >
                    Reject
                </button>

            </div>

        </div>

    </div>
)}

                      {/* Centered Status */}
                      {/* <div className="flex items-center justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm whitespace-nowrap ${
                            ["ACCEPTED", "PAID", "DELIVERED"].includes(
                              (itemStatus || "").toUpperCase(),
                            )
                              ? "bg-green-100 text-green-700"
                              : ["PENDING", "SENT", "DRAFT"].includes(
                                    (itemStatus || "").toUpperCase(),
                                  )
                                ? "bg-orange-100 text-orange-700"
                                : ["REJECTED", "OVERDUE"].includes(
                                      (itemStatus || "").toUpperCase(),
                                    )
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {itemStatus}
                        </span>
                      </div> */}

                      <div className="flex items-center justify-center">

    <select
        value={itemStatus}
        onChange={(e) => {

    const value = e.target.value;

    // OPEN PAYMENT EDIT MODAL
    if (
        value === "PAID"
    ) {

        setEditingItem({
            ...item,
            status: value,
            paymentMode: true,
        });

        setShowEditModal(true);

        return;
    }

    // NORMAL STATUS UPDATE
    handleStatusChange(
        item.id,
        value,
        isQuotation
            ? "quotation"
            : "invoice"
    );
}}
        

        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border-0 outline-none cursor-pointer shadow-sm

        ${
            ["ACCEPTED", "PAID", "DELIVERED"].includes(
                (itemStatus || "").toUpperCase()
            )
                ? "bg-green-100 text-green-700"
                : ["PENDING", "SENT", "DRAFT"].includes(
                        (itemStatus || "").toUpperCase()
                    )
                  ? "bg-orange-100 text-orange-700"
                  : ["REJECTED", "OVERDUE"].includes(
                          (itemStatus || "").toUpperCase()
                      )
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
        }
        `}
    >

        <option value="PENDING">
            PENDING
        </option>

        <option value="ACCEPTED">
            ACCEPTED
        </option>

        <option value="REJECTED">
            REJECTED
        </option>

        <option value="PAID">
            PAID
        </option>

        <option value="DRAFT">
            DRAFT
        </option>

    </select>

</div>

                      {/* Centered Actions */}
                      {/* Centered Actions */}
                      <div className="flex items-center justify-center gap-2 relative">
                        <button
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100 transition-colors"
                          onClick={(e) => handleViewPDF(item.id, e)}
                        >
                          View
                        </button>
                       
                       
                      </div>
                    </div>
                    
                  );
                })
              )}

              
            </div>
          </div>
        </div>

      </div>
      
{/* PAYMENT / EDIT MODAL */}

{showEditModal && editingItem && (

    <EditSalesModal

        item={editingItem}

        onClose={() => {

            setShowEditModal(false);

            setEditingItem(null);
        }}

        onSave={() => {

            fetchData();

            setShowEditModal(false);

            setEditingItem(null);
        }}
    />

)}
    
    </div>
  );
};

export default SalesDataDisplay;
