import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  Building2,
  Receipt,
  Plus,
  Trash2,
  Save,
  User,
  Truck,
  Tag,
  Layers,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { getNextEstimateNumber } from "../../services/quotationService";
import {
  searchLeads,
  getRecentLeads,
  Lead,
  createLead,
} from "../../services/leadService";
import CreateLeadModal from "./CreateLeadModal";
import CatalogItemSelector from "../Catalog/CatalogItemSelector";

import toast from "react-hot-toast";

// [UPGRADE] GST State Code Lookup Table present in Code B
const GST_STATE_MAP: Record<string, { code: string; name: string }> = {
  "01": { code: "01", name: "Jammu & Kashmir" },
  "02": { code: "02", name: "Himachal Pradesh" },
  "03": { code: "03", name: "Punjab" },
  "04": { code: "04", name: "Chandigarh" },
  "05": { code: "05", name: "Uttarakhand" },
  "06": { code: "06", name: "Haryana" },
  "07": { code: "07", name: "Delhi" },
  "08": { code: "08", name: "Rajasthan" },
  "09": { code: "09", name: "Uttar Pradesh" },
  "10": { code: "10", name: "Bihar" },
  "11": { code: "11", name: "Sikkim" },
  "12": { code: "12", name: "Arunachal Pradesh" },
  "13": { code: "13", name: "Nagaland" },
  "14": { code: "14", name: "Manipur" },
  "15": { code: "15", name: "Mizoram" },
  "16": { code: "16", name: "Tripura" },
  "17": { code: "17", name: "Meghalaya" },
  "18": { code: "18", name: "Assam" },
  "19": { code: "19", name: "West Bengal" },
  "20": { code: "20", name: "Jharkhand" },
  "21": { code: "21", name: "Odisha" },
  "22": { code: "22", name: "Chhattisgarh" },
  "23": { code: "23", name: "Madhya Pradesh" },
  "24": { code: "24", name: "Gujarat" },
  "25": { code: "25", name: "Daman & Diu" },
  "26": { code: "26", name: "Dadra & Nagar Haveli" },
  "27": { code: "27", name: "Maharashtra" },
  "28": { code: "28", name: "Andhra Pradesh (old)" },
  "29": { code: "29", name: "Karnataka" },
  "30": { code: "30", name: "Goa" },
  "31": { code: "31", name: "Lakshadweep" },
  "32": { code: "32", name: "Kerala" },
  "33": { code: "33", name: "Tamil Nadu" },
  "34": { code: "34", name: "Puducherry" },
  "35": { code: "35", name: "Andaman & Nicobar Islands" },
  "36": { code: "36", name: "Telangana" },
  "37": { code: "37", name: "Andhra Pradesh" },
  "38": { code: "38", name: "Ladakh" },
  "97": { code: "97", name: "Other Territory" },
  "99": { code: "99", name: "Centre Jurisdiction" },
};

const defaultEstimateTerms = `1. Payment terms 80% advance with purchase order. 20% before Delivery and inspection of product ( if company want to inspect)
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
// [UPGRADE] GST State detection helper present in Code B
const getStateFromGST = (
  gst: string,
): { code: string; name: string } | null => {
  if (!gst || gst.length < 2) return null;
  const stateCode = gst.substring(0, 2);
  return GST_STATE_MAP[stateCode] || null;
};

// interface SimpleQuotationFormProps {
//     onBack: () => void;
//     onSubmit: (data: any) => Promise<void>;
//     initialCompany: string;
//     formTitle?: string;
// }

interface SimpleQuotationFormProps {  
  onBack: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialCompany: string;
  initialData?: Record<string, string | number | boolean | null | undefined | object>;
isEditMode?: boolean;
isReadOnly?: boolean;
isPaymentMode?: boolean;
isTaxInvoiceMode?: boolean;
  formTitle?: string;
  type?: "NORMAL" | "PUMP";
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
  gstRate: number;
}

const SimpleQuotationForm = ({
    initialData,
    isEditMode = false,
    isReadOnly = false,
isPaymentMode = false,
isTaxInvoiceMode = false,
  onBack,
  onSubmit,
  initialCompany,
  formTitle,
  type = "NORMAL",
}: SimpleQuotationFormProps) => {
  const isInvoice = formTitle?.toLowerCase().includes("invoice");
  const [sameAsBillTo, setSameAsBillTo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = (currentUser?.role?.name || currentUser?.role || "").toLowerCase() === "admin";
  // const isPump = type === "PUMP";
  const isPump =
  type === "PUMP" ||
  initialData?.category === "PUMP";

  // [UPGRADE] State for resolved GST detection present in Code B
  const [resolvedGstState, setResolvedGstState] = useState<{
    code: string;
    name: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    
    // Company Details
    fromCompanyName: initialCompany || "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    officerName: isPump ? "Mr. Kiran Jagtap" : "",
    officerContact: isPump ? "9325389168 / 9665389150" : "",
    systemCapacity: isPump ? "5 HP Solar Water Pump System Full Set" : "",

    fromGstin: "",
    paymentTerms: "",
    modeOfDispatch: "By Road",
    transportThrough: "",
    trackingNumber: "",

    // Bill To
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    customerContact: "",
    customerGstin: "",

    // Ship To
    recipientName: "",
    shippingAddress: "",
    stateCode: "",
    placeOfSupply: "",

    // Bank & Other
    bankName: "HDFC Bank",
    bankAccountNo: "50200012345678",
    bankIfsc: "HDFC0001234",
    bankBranch: "",
    // termsAndConditions: '1. Goods once sold will not be taken back. 2. Interest @ 18% p.a. will be charged if payment is not made within due date.',
    termsAndConditions: defaultEstimateTerms,
    // Calculations
    cashDiscount: 0,
    roundOff: 0,
  });

  useEffect(() => {

  if (!isEditMode || !initialData) {
    return;
  }

  setFormData((prev) => ({

    ...prev,

    // ONLY API DATA
    invoiceNumber:
      String(initialData.invoiceNumber || ""),

    invoiceDate:
      String(initialData.invoiceDate || ""),

    customerName:
      String(initialData.customerName || ""),

    customerEmail:
      String(initialData.customerEmail || ""),

    customerAddress:
      String(initialData.customerAddress || ""),

    customerContact:
      String(
        initialData.customerContact ||
        initialData.customerPhone ||
        ""
      ),

    customerGstin:
      String(
        initialData.customerGstin ||
        initialData.customerGstinUin ||
        ""
      ),

    recipientName:
      String(initialData.recipientName || ""),

    shippingAddress:
      String(initialData.shippingAddress || ""),

    stateCode:
      String(initialData.stateCode || ""),

    placeOfSupply:
      String(initialData.placeOfSupply || ""),

    paymentTerms:
      String(initialData.paymentTerms || ""),

    transportThrough:
      String(initialData.transportThrough || ""),

    trackingNumber:
      String(initialData.trackingNumber || ""),

    termsAndConditions:
      String(initialData.termsAndConditions || ""),

    bankName:
      String(initialData.bankName || prev.bankName),

    bankAccountNo:
      String(
        initialData.bankAccountNo ||
        initialData.accountNumber ||
        prev.bankAccountNo
      ),

    bankIfsc:
      String(
        initialData.bankIfsc ||
        initialData.ifscCode ||
        prev.bankIfsc
      ),

    cashDiscount:
      Number(initialData.cashDiscount || 0),

    roundOff:
      Number(initialData.roundOff || 0),

      officerName:
  String(initialData.officerName || ""),

officerContact:
  String(initialData.officerContact || ""),

systemCapacity:
  String(initialData.systemCapacity || ""),

  }));


  // ITEMS

  if (
    initialData.items &&
    Array.isArray(initialData.items)
  ) {

    const mappedItems: ItemRow[] =
      initialData.items.map(
        (
          item: {
            id?: string;
            description?: string;
            itemDescription?: string;
            hsn?: string;
            hsnSac?: string;
            quantity?: number;
            qty?: number;
            unit?: string;
            rate?: number;
            discPercent?: number;
            amount?: number;
            gstRate?: number;
          },
          index: number
        ) => ({
          id: index + 1,

          description:
            item.description ||
            item.itemDescription ||
            "",

          subDescription: "",

          hsn:
            item.hsn ||
            item.hsnSac ||
            "",

          qty:
            Number(
              item.quantity ||
              item.qty ||
              0
            ),

          unit:
            item.unit || "PCS",

          rate:
            Number(item.rate || 0),

          watt: 0,

          isSolarPanel: false,

          discPercent:
            Number(item.discPercent || 0),

          amount:
            Number(item.amount || 0),

          gstRate:
            Number(item.gstRate || 18),
        })
      );

    setItems(mappedItems);
  }

}, [initialData, isEditMode]);

  // Lead Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [showLeadResults, setShowLeadResults] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  const searchTimeoutRef = React.useRef<any>(null);
  const [lightBill, setLightBill] = useState<File | null>(null);


const [paymentType, setPaymentType] =
    useState<string>(
        String(initialData?.paidType || "FULL")
    );

const [paidAmount, setPaidAmount] =
    useState<number>(
        Number(initialData?.paidAmount || 0)
    );

const [advancedEnabled, setAdvancedEnabled] =
    useState<boolean>(
        Boolean(initialData?.advancedEnabled)
    );

const [additionalAmount, setAdditionalAmount] =
    useState<number>(
        Number(initialData?.additionalAmount || 0)
    );

  // HSN Suggestions State
  const [hsnSuggestions, setHsnSuggestions] = useState<any[]>([]);
  const [showHsnSuggestions, setShowHsnSuggestions] = useState<number | null>(
    null,
  );
  const [hsnLoading, setHsnLoading] = useState(false);
  useEffect(() => {
  if (isPump) {
    setFormData(prev => ({
      ...prev,
      officerName: "Mr. Kiran Jagtap",
      officerContact: "9325389168 / 9665389150",
      systemCapacity: "5 HP Solar Water Pump System Full Set"
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      officerName: "",
      officerContact: "",
      systemCapacity: ""
    }));
  }
}, [isPump]);

  // Load recent leads on mount
  // useEffect(() => {
  //   // getRecentLeads().then(setRecentLeads).catch(err => console.error("Failed to load recent leads", err));
  //   getRecentLeads().then((data) => {
  //     const indianLeads = (data || []).filter(
  //       (lead: any) =>
  //         lead.customerType && lead.customerType.toLowerCase() === "indian",
  //     );

  //     setRecentLeads(indianLeads);
  //   });
  // }, []);

  useEffect(() => {
  getRecentLeads().then((data) => {
    // 1. Filter for Indian region
    const indianLeads = (data || []).filter(
      (lead: any) =>
        lead.customerType && lead.customerType.toLowerCase() === "indian"
    );

    // 2. Filter by Assignment (Admin sees all, others see own)
    const filteredByAccess = isAdmin 
      ? indianLeads 
      : indianLeads.filter((lead: any) => lead.assignedToId === currentUser.id);

    setRecentLeads(filteredByAccess);
  });
}, [isAdmin, currentUser.id]); // Add dependencies

  // Close HSN suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showHsnSuggestions !== null) {
        const target = event.target as Element;
        if (!target.closest(".hsn-input-container")) {
          setShowHsnSuggestions(null);
          setHsnSuggestions([]);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHsnSuggestions]);

  // const handleLeadSearch = async (query: string) => {
  //   if (!query) return;
  //   setIsSearching(true);
  //   try {
  //     // const results = await searchLeads(query);
  //     // setSearchResults(results || []);
  //     const results = await searchLeads(query);

  //     const indianLeads = (results || []).filter(
  //       (lead: any) =>
  //         lead.customerType && lead.customerType.toLowerCase() === "indian",
  //     );

  //     setSearchResults(indianLeads);
  //   } catch (err) {
  //     console.error("Search failed", err);
  //   } finally {
  //     setIsSearching(false);
  //   }
  // };

  const handleLeadSearch = async (query: string) => {
  if (!query) return;
  setIsSearching(true);
  try {
    const results = await searchLeads(query);

    // 1. Filter for Indian region
    const indianLeads = (results || []).filter(
      (lead: any) =>
        lead.customerType && lead.customerType.toLowerCase() === "indian"
    );

    // 2. Filter by Assignment
    const filteredByAccess = isAdmin 
      ? indianLeads 
      : indianLeads.filter((lead: any) => lead.assignedToId === currentUser.id);

    setSearchResults(filteredByAccess);
  } catch (err) {
    console.error("Search failed", err);
  } finally {
    setIsSearching(false);
  }
};

  const selectLead = (lead: Lead) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        customerName: lead.name,
        customerEmail: lead.email || prev.customerEmail,
        customerContact: lead.phone,
        customerAddress: lead.company ? `${lead.company}\n` : "",
        customerGstin: lead.gstin || prev.customerGstin,
      };

      // [UPGRADE] Auto-resolve state logic from Code B
      const gstin = lead.gstin || prev.customerGstin;
      if (gstin && gstin.length >= 2) {
        const state = getStateFromGST(gstin);
        if (state) {
          setResolvedGstState(state);
          newData.stateCode = state.code;
          newData.placeOfSupply = state.name;
        }
      }

      return newData;
    });
    setShowLeadResults(false);
    setSearchResults([]);
  };

  const handleCreateLead = async (leadData: any) => {
    try {
      const newLead = await createLead(leadData);
      setRecentLeads((prev) => [newLead, ...prev]);
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
      description: "",
      subDescription: "",
      hsn: "",
      qty: 0,
      unit: "MTR",
      rate: 0,
      watt: 0,
      isSolarPanel: false,
      discPercent: 0,
      amount: 0,
      gstRate: 18,
    },
  ]);

  // Company Config for pre-filling
  const companyConfigs: Record<string, any> = {
    "Solarica Energy India Pvt Ltd": {
      fromGstin: "27AALCP2722L1Z4",
      bankName: "Kotak Mahindra Bank",
      bankAccountNo: "4745055271",
      bankIfsc: "KKBK0001801",
      // termsAndConditions: '1. Goods once sold will not be taken back. 2. Payment: 100% advance.'
    },
    "Solarica Fabtech Pvt Ltd": {
      fromGstin: "27FABTECH123456",
      bankName: "ICICI Bank",
      bankAccountNo: "112233445566",
      bankIfsc: "ICIC0006789",
      // termsAndConditions: '1. Fabtech standard terms. 2. Delivery within 15 days.'
    },
    "Solarica Industries Pvt Ltd": {
      fromGstin: "27INDUSTR123456",
      bankName: "State Bank of India",
      bankAccountNo: "998877665544",
      bankIfsc: "SBIN0001122",
      // termsAndConditions: '1. Industries standard terms. 2. Quality checked before dispatch.'
    },
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

      setFormData((prev) => ({
        ...prev,
        ...restOfConfig, // Apply everything EXCEPT the terms
      }));
    }

    if (sameAsBillTo) {
      setFormData((prev) => ({
        ...prev,
        recipientName: prev.customerName || "",
        shippingAddress: prev.customerAddress || "",
        stateCode: prev.stateCode || "",
        placeOfSupply: prev.placeOfSupply || "",
      }));
    }
  }, [
    sameAsBillTo,
    formData.customerName,
    formData.customerAddress,
    formData.stateCode,
    formData.placeOfSupply,
    initialCompany,
  ]);

  // Fetch Estimate Number on Mount or Company Change
  // useEffect(() => {
  //   const fetchEstimateNumber = async () => {
  //     if (formData.fromCompanyName) {
  //       try {
  //         const num = await getNextEstimateNumber(formData.fromCompanyName);
  //         setFormData((prev) => ({ ...prev, invoiceNumber: num }));
  //       } catch (error) {
  //         console.error("Failed to fetch estimate number", error);
  //       }
  //     }
  //   };
  //   fetchEstimateNumber();
  // }, [formData.fromCompanyName]);

  useEffect(() => {
  const fetchEstimateNumber = async () => {
    // ONLY fetch if it's a NEW entry and we have a company name
    if (formData.fromCompanyName && !isEditMode) {
      try {
        const num = await getNextEstimateNumber(formData.fromCompanyName);
        setFormData((prev) => ({ ...prev, invoiceNumber: num }));
      } catch (error) {
        console.error("Failed to fetch estimate number", error);
      }
    }
  };
  fetchEstimateNumber();
}, [formData.fromCompanyName, isEditMode]); // Added isEditMode to dependencies


  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Validation for Payment Terms
    if (name === "paymentTerms") {
      const cleanedValue = value.replace(/[^a-zA-Z0-9\s-]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
      return;
    }

    // BILL-001: Customer Name
    if (name === "customerName") {
      const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 100);
      setFormData((prev) => ({ ...prev, [name]: alphabetsOnly }));
      return;
    }

    // BILL-002: Customer Contact
    if (name === "customerContact") {
      const digitsOnly = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    // BILL-003: Customer GSTIN [UPGRADED with state detection from Code B]
    if (name === "customerGstin") {
      const alphanumericOnly = value
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 15);

      // Resolve state from first 2 digits
      const state = getStateFromGST(alphanumericOnly);
      if (state) {
        setResolvedGstState(state);
        // Auto-fill stateCode and placeOfSupply as per Code B upgrade
        setFormData((prev) => ({
          ...prev,
          [name]: alphanumericOnly,
          stateCode: state.code,
          placeOfSupply: state.name,
        }));
      } else {
        // Clear resolved state if GST is short or unrecognized
        if (alphanumericOnly.length < 2) setResolvedGstState(null);
        setFormData((prev) => ({ ...prev, [name]: alphanumericOnly }));
      }
      return;
    }

    // BILL-004: Customer Address
    if (name === "customerAddress") {
      const sanitized = value.replace(/<[^>]*>/g, "").slice(0, 500);
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }

    // SHIP-001: Recipient Name
    if (name === "recipientName") {
      const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 100);
      setFormData((prev) => ({ ...prev, [name]: alphabetsOnly }));
      return;
    }

    // SHIP-002: Shipping Address
    if (name === "shippingAddress") {
      const sanitized = value
        .replace(/<[^>]*>/g, "")
        .replace(/javascript:/gi, "")
        .slice(0, 500);
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }

    // SHIP-003: State Code
    if (name === "stateCode") {
      const digitsOnly = value.replace(/[^0-9]/g, "").slice(0, 2);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    // SHIP-004: Place of Supply
    if (name === "placeOfSupply") {
      const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, "").slice(0, 100);
      setFormData((prev) => ({ ...prev, [name]: alphabetsOnly }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = async (
    id: number,
    field: keyof ItemRow,
    value: any,
  ) => {
    // Process HSN value for suggestions
    let hsnProcessedValue = value;
    // if (field === 'hsn') {
    //     hsnProcessedValue = value.replace(/[^0-9]/g, '').slice(0, 8);
    // }

    if (field === "hsn") {
      const isNumeric = /^[0-9]+$/.test(value);

      if (isNumeric) {
        hsnProcessedValue = value.slice(0, 8); // HSN
      } else {
        hsnProcessedValue = value.slice(0, 50); // Description
      }
    }

    // 1. Initial State Update (Keep UI responsive)
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let processedValue = value;

          if (field === "description") {
            processedValue = value.replace(/[^a-zA-Z0-9\s-]/g, "").slice(0, 50);
          }
          if (field === "subDescription") {
            processedValue = value
              .replace(/<[^>]*>/g, "")
              .replace(/javascript:/gi, "")
              .slice(0, 200);
          }
          if (field === "hsn") {
            processedValue = hsnProcessedValue;
          }

          const updatedItem = { ...item, [field]: processedValue };

          // Recalculate amount logic
          if (
            ["qty", "rate", "discPercent", "watt", "gstRate"].includes(field)
          ) {
            const qty =
              (field === "qty" ? parseFloat(processedValue) : item.qty) || 0;
            const rate =
              (field === "rate" ? parseFloat(processedValue) : item.rate) || 0;
            const watt =
              (field === "watt" ? parseFloat(processedValue) : item.watt) || 0;
            const disc =
              (field === "discPercent"
                ? parseFloat(processedValue)
                : item.discPercent) || 0;
            const gst =
              (field === "gstRate"
                ? parseFloat(processedValue)
                : item.gstRate) || 0;

            let baseAmount = qty * rate;
            if (updatedItem.isSolarPanel && watt > 0)
              baseAmount = qty * rate * watt;

            const afterDiscount = baseAmount - baseAmount * (disc / 100);
            const gstAmount = afterDiscount * (gst / 100);
            updatedItem.amount = Math.max(0, afterDiscount + gstAmount);
          }
          return updatedItem;
        }
        return item;
      }),
    );

    // 2. [UPDATED] HSN Suggestions Logic
    if (field === "hsn") {
      const hsnValue = hsnProcessedValue;

      // Clear suggestions if HSN is empty
      if (!hsnValue) {
        setHsnSuggestions([]);
        setShowHsnSuggestions(null);
        return;
      }

      // Fetch suggestions when HSN has at least 2 characters
      if (hsnValue.length >= 2) {
        setHsnLoading(true);
        setShowHsnSuggestions(id);

        try {
          // const { findHsnSuggestions } = await import('../../services/hsnService');
          // const response = await findHsnSuggestions(hsnValue, 5);

          const { findHsnSuggestions } =
            await import("../../services/hsnService");

          const isNumeric = /^[0-9]+$/.test(hsnValue);

          let response;

          if (isNumeric) {
            // Existing behavior (HSN search)
            response = await findHsnSuggestions(hsnValue, 5);
          } else {
            // TEMP: still calling same API (backend not ready yet)
            response = await findHsnSuggestions(hsnValue, 5);
          }

          if (response.data.data && response.data.data.length > 0) {
            setHsnSuggestions(response.data.data);
          } else {
            setHsnSuggestions([]);
          }
        } catch (error) {
          console.error("HSN suggestions fetch failed", error);
          setHsnSuggestions([]);
        } finally {
          setHsnLoading(false);
        }
      } else {
        setHsnSuggestions([]);
        setShowHsnSuggestions(null);
      }
    }
  };

  const handleHsnSelect = (itemId: number, hsnData: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedItem = {
            ...item,
            hsn: hsnData.hsnCode,
            subDescription: hsnData.description,
            gstRate: hsnData.gstRate,
          };

          // Recalculate amount with new HSN-provided GST
          // const afterDiscount = (item.qty * item.rate) - ((item.qty * item.rate) * (item.discPercent / 100));
          // const gstAmount = afterDiscount * (hsnData.gstRate / 100);
          // updatedItem.amount = Math.max(0, afterDiscount + gstAmount);

          const qty = Number(item.qty) || 0;
          const rate = Number(item.rate) || 0;
          const disc = Number(item.discPercent) || 0;
          const gst = Number(hsnData.gstRate) || 0;

          const base = qty * rate;
          const afterDiscount = base - base * (disc / 100);
          const gstAmount = afterDiscount * (gst / 100);

          updatedItem.amount = Math.max(0, afterDiscount + gstAmount);

          return updatedItem;
        }
        return item;
      }),
    );

    setHsnSuggestions([]);
    setShowHsnSuggestions(null);
    toast.success(`HSN ${hsnData.hsnCode} details applied`);
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        description: "",
        subDescription: "",
        hsn: "",
        qty: 0,
        unit: "MTR",
        rate: 0,
        watt: 0,
        isSolarPanel: false,
        discPercent: 0,
        amount: 0,
        gstRate: 18,
      },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // const handleProductSelect = (product: any) => {
  //     const newItem: ItemRow = {
  //         id: Date.now(),
  //         description: product.model,
  //         subDescription: product.description || '',
  //         hsn: product.hsnSac || '',
  //         qty: 1,
  //         unit: product.unit || 'PCS',
  //         rate: product.price || 0,
  //         watt: product.watt || 0,
  //         isSolarPanel: product.isSolarPanel || false,
  //         discPercent: 0,
  //         amount: product.isSolarPanel && product.watt ? (1 * product.price * product.watt) : (product.price || 0),
  //         gstRate: 18
  //     };

  //     if (product.gst !== undefined) {
  //         newItem.gstRate = parseFloat(product.gst);
  //     } else if (product.hsnSac === '8419') {
  //         newItem.gstRate = 12;
  //     } else if (product.hsnSac === '8541' || product.hsnSac === '8504') {
  //         newItem.gstRate = 13.8;
  //     }

  //     setItems(prev => {
  //         if (prev.length === 1 && !prev[0].description) {
  //             return [newItem];
  //         }
  //         return [...prev, newItem];
  //     });
  //     setIsCatalogOpen(false);
  // };

  const handleProductSelect = (product: any) => {
    // 🔥 Convert GST amount → percentage safely
    let gstPercent = 18; // default fallback

    if (product.gst !== undefined && product.basicPrice) {
      gstPercent = (product.gst / product.basicPrice) * 100;
    } else if (product.gst !== undefined && product.price) {
      gstPercent = (product.gst / product.price) * 100;
    } else if (product.hsnSac === "8419") {
      gstPercent = 12;
    } else if (product.hsnSac === "8541" || product.hsnSac === "8504") {
      gstPercent = 13.8;
    }

    const newItem: ItemRow = {
      id: Date.now(),
      description: product.particular || product.model,
      subDescription: product.description || "",
      hsn: product.hsnSac || "",
      qty: 1,
      unit: product.unit || "PCS",
      rate: product.basicPrice || product.price || 0,
      watt: product.watt || 0,
      isSolarPanel: product.isSolarPanel || false,
      discPercent: 0,

      // ✅ amount WITHOUT GST (important)
      amount: product.basicPrice || product.price || 0,

      // ✅ correct GST %
      gstRate: Number(gstPercent.toFixed(2)),
    };

    setItems((prev) => {
      if (prev.length === 1 && !prev[0].description) {
        return [newItem];
      }
      return [...prev, newItem];
    });

    setIsCatalogOpen(false);
  };

  const calculateTotals = () => {
    // const netAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const netAmount = items.reduce((sum, item) => {
      const qty = Number(item.qty) || 0;
      const rate = Number(item.rate) || 0;
      const disc = Number(item.discPercent) || 0;

      const base = qty * rate;
      const afterDiscount = base - base * (disc / 100);

      return sum + afterDiscount;
    }, 0);
    let totalCgst = 0;
    let totalSgst = 0;

    // items.forEach(item => {
    //     const itemGst = item.amount * (item.gstRate / 100);
    //     totalCgst += itemGst / 2;
    //     totalSgst += itemGst / 2;
    // });

    items.forEach((item) => {
      const base = (Number(item.qty) || 0) * (Number(item.rate) || 0);
      const afterDiscount =
        base - base * ((Number(item.discPercent) || 0) / 100);
      const gstAmount = afterDiscount * ((Number(item.gstRate) || 0) / 100);

      totalCgst += gstAmount / 2;
      totalSgst += gstAmount / 2;
    });

    const totalTax = totalCgst + totalSgst;
    const grandTotal = Math.max(
      0,
      Math.round(
        netAmount +
          totalTax -
          (formData.cashDiscount || 0) +
          (formData.roundOff || 0),
      ),
    );

    return {
      netAmount,
      cgst: totalCgst,
      sgst: totalSgst,
      totalTax,
      grandTotal,
    };
  };

  const totals = calculateTotals();

  const hasValidItem = items.some(
    (item) => item.description.trim() !== "" && item.qty > 0 && item.rate > 0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasValidItem) {
      alert(
        "Please add at least one item with Item Code, Quantity, and Rate before saving.",
      );
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        // items,

           items: items.map((it) => ({
                description: it.description || "",
                subDescription: it.subDescription || "",
                hsnSac: it.hsn || "",           // DB Column: hsnSac
                quantity: Number(it.qty || 0),  // DB Column: quantity
                unit: it.unit || "PCS",
                rate: Number(it.rate || 0),
                discPercent: Number(it.discPercent || 0),
                gstRate: Number(it.gstRate || 0),
                amount: Number(it.amount || 0), // <--- FIX: Ensure amount is sent!
            })),

        totals,
        lightBill,
        paymentType,
paidAmount,
advancedEnabled,
additionalAmount,
        status: "Draft",
        category: isPump ? "PUMP" : "DOMESTIC",
         officerName: formData.officerName,
  officerContact: formData.officerContact,
  systemCapacity: formData.systemCapacity,
      };
      console.log("SUBMISSION DATA", submissionData);
      await onSubmit(submissionData);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white transition-colors duration-200 invoice-form">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all active:scale-95 border border-transparent hover:border-slate-100"
              >
                <ArrowLeft size={22} />
              </button>
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                  <FileText className="text-white" size={22} />
                </div>
                <div>
                  <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none">
                    {formTitle || "Estimate Entry"}
                  </h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Quotation Management
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Building2 size={20} />
                  </div>
                  Company Details
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Select the issuing entity and estimate basics.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  Company Name
                </label>
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
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  {isInvoice ? "Invoice Number" : "Estimate Number"}
                </label>
                <div className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-bold font-mono">
                  {formData.invoiceNumber || "Loading..."}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  {isInvoice ? "Invoice Date" : "Estimate Date"}
                </label>
                <input
                  type="date"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  GSTIN No.
                </label>
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
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  Payment Terms
                </label>
                <input
                  type="text"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  placeholder="e.g. Net 30, Net 45"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  Mode of Dispatch
                </label>
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
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                       readOnly={isReadOnly}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/[^a-zA-Z\s]/g, "")
                          .slice(0, 100);
                        const syntheticEvent = {
                          ...e,
                          target: { ...e.target, value, name: "customerName" },
                        };
                        handleInputChange(syntheticEvent as any);

                        setShowLeadResults(true);
                        if (searchTimeoutRef.current)
                          clearTimeout(searchTimeoutRef.current);

                        if (value.length > 1) {
                          setIsSearching(true);
                          searchTimeoutRef.current = setTimeout(
                            () => handleLeadSearch(value),
                            300,
                          );
                        } else {
                          setSearchResults([]);
                          setIsSearching(false);
                        }
                      }}
                      onFocus={() => {
                        setShowLeadResults(true);
                        if (formData.customerName.length > 1)
                          handleLeadSearch(formData.customerName);
                      }}
                      onBlur={() =>
                        setTimeout(() => setShowLeadResults(false), 200)
                      }
                      placeholder="Enter customer name"
                      maxLength={100}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    />
                    {showLeadResults && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
                        {isSearching && (
                          <div className="p-3 text-center text-slate-400 text-xs">
                            Searching...
                          </div>
                        )}

                        {!isSearching &&
                          formData.customerName.length <= 1 &&
                          recentLeads.length > 0 && (
                            <>
                              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                                Recently Created
                              </div>
                              {recentLeads.map((lead) => (
                                <button
                                  key={lead.id}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectLead(lead);
                                  }}
                                  className="w-full text-left p-3 hover:bg-slate-100 flex items-center justify-between group transition-colors border-b border-slate-50 last:border-0"
                                >
                                  <div>
                                    <div className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">
                                      {lead.name}
                                    </div>
                                    <div className="text-xs text-slate-400 flex items-center gap-2">
                                      {lead.company && (
                                        <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                                          {lead.company}
                                        </span>
                                      )}
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
                            {formData.customerName.length > 1 && (
                              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                                Search Results
                              </div>
                            )}
                            {searchResults.map((lead) => (
                              <button
                                key={lead.id}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  selectLead(lead);
                                }}
                                className="w-full text-left p-3 hover:bg-slate-50 flex items-center justify-between group transition-colors border-b border-slate-50 last:border-0"
                              >
                                <div>
                                  <div className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">
                                    {lead.name}
                                  </div>
                                  <div className="text-xs text-slate-400 flex items-center gap-2">
                                    {lead.company && (
                                      <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                                        {lead.company}
                                      </span>
                                    )}
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

                        {!isSearching &&
                          formData.customerName.length > 1 &&
                          searchResults.length === 0 && (
                            <div className="p-4 text-center text-slate-500 text-sm">
                              No leads found.
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="Enter Customer Email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    Address <span className="text-red-500">*</span>
                  </label>
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
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                      Contact No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customerContact"
                      value={formData.customerContact}
                      onChange={handleInputChange}
                      placeholder="Enter Contact Number"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                      GSTIN/UIN (Optional)
                    </label>

                    <input
                      type="text"
                      name="customerGstin"
                      value={formData.customerGstin}
                      onChange={handleInputChange}
                      placeholder="15 character GSTIN"
                      maxLength={15}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 uppercase focus:ring-4 transition-all outline-none ${
                        resolvedGstState
                          ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                      }`}
                    />

                    {/* State resolved badge */}
                    {formData.customerGstin && resolvedGstState && (
                      <div className="flex items-center gap-2 mt-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
                        <MapPin
                          size={12}
                          className="text-emerald-600 flex-shrink-0"
                        />
                        <span className="text-xs font-bold text-emerald-700">
                          {resolvedGstState.name}
                        </span>
                        <span className="text-xs text-emerald-500 font-medium ml-auto">
                          Code: {resolvedGstState.code}
                        </span>
                      </div>
                    )}

                    {/* Invalid state warning */}
                    {formData.customerGstin &&
                      formData.customerGstin.length >= 2 &&
                      !resolvedGstState && (
                        <div className="flex items-center gap-2 mt-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg animate-in fade-in duration-200">
                          <span className="text-xs font-bold text-amber-600">
                            ⚠ Unrecognised state code
                          </span>
                        </div>
                      )}
                  </div>
                </div>
                {/* <div className="mt-6 pt-6 border-t border-slate-50">
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
                                </div> */}
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
              <div className="absolute top-8 right-8 flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm z-10">
                <input
                  type="checkbox"
                  id="sameAsBillTo"
                  checked={sameAsBillTo}
                  onChange={(e) => setSameAsBillTo(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                />
                <label
                  htmlFor="sameAsBillTo"
                  className="text-xs font-bold text-slate-600 cursor-pointer uppercase tracking-tight"
                >
                  Same as Bill To
                </label>
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
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    maxLength={100}
                    placeholder="Alphabets and spaces only"
                    className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none ${sameAsBillTo && formData.recipientName ? "bg-slate-100" : ""}`}
                    readOnly={sameAsBillTo && !!formData.recipientName}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    rows={3}
                    maxLength={500}
                    placeholder="Enter shipping address"
                    className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none ${sameAsBillTo && formData.shippingAddress ? "bg-slate-100" : ""}`}
                    readOnly={sameAsBillTo && !!formData.shippingAddress}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {/* [UPGRADE] Auto-filled styling for state code from Code B */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
                      State Code <span className="text-red-500">*</span>
                      {resolvedGstState && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 normal-case tracking-normal">
                          Auto-filled
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="stateCode"
                      value={formData.stateCode}
                       disabled={isReadOnly}
                      onChange={handleInputChange}
                      maxLength={2}
                      placeholder="e.g., 27"
                      className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${
                        resolvedGstState
                          ? "border-emerald-300 bg-emerald-50/40 text-emerald-800 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                          : "border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      } ${sameAsBillTo && formData.stateCode ? "bg-slate-100" : ""}`}
                      readOnly={sameAsBillTo && !!formData.stateCode}
                    />
                  </div>
                  {/* [UPGRADE] Auto-filled styling for place of supply from Code B */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
                      Place of Supply <span className="text-red-500">*</span>
                      {resolvedGstState && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 normal-case tracking-normal">
                          Auto-filled
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="placeOfSupply"
                      value={formData.placeOfSupply}
                      onChange={handleInputChange}
                      maxLength={100}
                      placeholder="Enter place of supply"
                      className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${
                        resolvedGstState
                          ? "border-emerald-300 bg-emerald-50/40 text-emerald-800 font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                          : "border-slate-200 bg-slate-50/50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      } ${sameAsBillTo && formData.placeOfSupply ? "bg-slate-100" : ""}`}
                      readOnly={sameAsBillTo && !!formData.placeOfSupply}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* {isPump && (
            <div className="grid grid-cols-2 gap-4">
              <input
                name="systemCapacity"
                value={formData.systemCapacity}
                onChange={handleInputChange}
                placeholder="System Capacity"
                className="border p-3 rounded-lg"
              />
            </div>
          )}

          {isPump && (
            <section className="bg-white p-6 rounded-xl border mb-6">
              <h2 className="text-lg font-bold mb-4">PROJECT DETAILS</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Officer In Charge</label>
                  <input
                    value={formData.officerName}
                    readOnly
                    className="border p-2 w-full bg-gray-100"
                  />
                </div>

                <div>
                  <label className="font-semibold">Contact</label>
                  <input
                    value={formData.officerContact}
                    readOnly
                    className="border p-2 w-full bg-gray-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold">System Capacity</label>
                  <input
                    value={formData.systemCapacity}
                    readOnly
                    className="border p-2 w-full bg-gray-100"
                  />
                </div>
              </div>
            </section>
          )} */}


          {isPump && (
  <>
    {/* System Capacity */}
    <div className="grid grid-cols-2 gap-4">
      <input
        name="systemCapacity"
        value={formData.systemCapacity}
        onChange={handleInputChange}
        placeholder="System Capacity"
        className="border p-3 rounded-lg"
      />
    </div>

    {/* PROJECT DETAILS */}
    <section className="bg-white p-6 rounded-xl border mb-6">
      <h2 className="text-lg font-bold mb-4">PROJECT DETAILS</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Officer In Charge</label>
          <input value={formData.officerName} readOnly className="border p-2 w-full bg-gray-100" />
        </div>

        <div>
          <label className="font-semibold">Contact</label>
          <input value={formData.officerContact} readOnly className="border p-2 w-full bg-gray-100" />
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold">System Capacity</label>
          <input value={formData.systemCapacity} readOnly className="border p-2 w-full bg-gray-100" />
        </div>
      </div>
    </section>
  </>
)}

          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                  <Tag size={20} />
                </div>
                Item Details
              </h3>
              {!isReadOnly && (
              <button
                type="button"
                onClick={addItem}
                className="px-6 py-2.5 bg-amber-50 text-amber-600 rounded-xl text-sm font-bold hover:bg-amber-100 transition-all shadow-sm flex items-center gap-2"
              >
                <Plus size={18} />
                Add Item
              </button>

              )}
              {!isReadOnly && (
              
              <button
                type="button"
                onClick={() => setIsCatalogOpen(true)}
                className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all shadow-sm flex items-center gap-2"
              >
                
                <Layers size={18} />
                Add from Catalog
              </button>
              )}
              
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-12 text-center">
                      #
                    </th>
                    <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase min-w-[180px]">
                      Item Description
                    </th>
                    <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-28">
                      HSN/SAC
                    </th>
                    <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-24 text-center">
                      Qty
                    </th>
                    <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-28 text-center">
                      Watt
                    </th>
                    <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-28 text-center">
                      Unit
                    </th>
                    <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-32 text-center">
                      Rate
                    </th>
                    <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-24 text-center">
                      Disc %
                    </th>
                    <th className="px-2 py-4 text-xs font-bold text-slate-500 uppercase w-24 text-center">
                      GST %
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase w-36 text-right">
                      Amount
                    </th>
                    <th className="px-4 py-4 w-12 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-all group"
                    >
                      <td className="px-4 py-6 text-sm text-slate-400 font-bold text-center">
                        {idx + 1}
                      </td>
                      <td className="px-2 py-6">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Item Code"
                          maxLength={50}
                          className="w-full bg-transparent border-0 border-b border-transparent focus:border-amber-500 focus:ring-0 p-0 text-sm font-black text-slate-800 placeholder:text-slate-300"
                        />
                        <input
                          type="text"
                          value={item.subDescription}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "subDescription",
                              e.target.value,
                            )
                          }
                          placeholder="Detailed description"
                          maxLength={200}
                          className="w-full bg-transparent border-0 p-0 text-[11px] font-bold text-slate-500 mt-1 focus:ring-0 placeholder:text-slate-300"
                        />
                      </td>
                      <td className="px-2 py-6">
                        <div className="relative hsn-input-container">
                          <input
                            type="text"
                            value={item.hsn}
                            onChange={(e) =>
                              handleItemChange(item.id, "hsn", e.target.value)
                            }
                            onFocus={() => setShowHsnSuggestions(item.id)}
                            placeholder="4-8 digits"
                            maxLength={50}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700 text-center"
                          />

                          {showHsnSuggestions === item.id && (
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[500px] bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-64 overflow-auto">
                              {hsnLoading ? (
                                <div className="p-3 text-sm text-gray-400 text-center">
                                  Searching...
                                </div>
                              ) : (
                                hsnSuggestions.map((suggestion, index) => (
                                  <div
                                    key={index}
                                    onMouseDown={() =>
                                      handleHsnSelect(item.id, suggestion)
                                    }
                                    className="p-3 hover:bg-gray-100 cursor-pointer"
                                  >
                                    <div className="font-bold text-indigo-600">
                                      {suggestion.hsnCode}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {suggestion.description}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-6">
                        <input
                          type="number"
                          value={item.qty}
                          min="0"
                          onChange={(e) =>
                            handleItemChange(item.id, "qty", e.target.value)
                          }
                          className="w-full px-2 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-center focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </td>
                      <td className="px-2 py-6">
                        <input
                          type="number"
                          value={item.watt || ""}
                          min="0"
                          onChange={(e) =>
                            handleItemChange(item.id, "watt", e.target.value)
                          }
                          placeholder="0"
                          className="w-full px-2 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-center focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </td>
                      <td className="px-2 py-6">
                        <select
                          value={item.unit}
                          onChange={(e) =>
                            handleItemChange(item.id, "unit", e.target.value)
                          }
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
                      <td className="px-2 py-6">
                        <input
                          type="number"
                          value={item.rate}
                          min="0"
                          onChange={(e) =>
                            handleItemChange(item.id, "rate", e.target.value)
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-center focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700"
                        />
                      </td>
                      <td className="px-2 py-6">
                        <input
                          type="number"
                          value={item.discPercent}
                          min="0"
                          max="100"
                          step="0.5"
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "discPercent",
                              e.target.value,
                            )
                          }
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
                          onChange={(e) =>
                            handleItemChange(item.id, "gstRate", e.target.value)
                          }
                          placeholder="0"
                          className="w-full px-2 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-center focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </td>
                      <td className="px-4 py-6 text-right text-sm font-black text-slate-900 font-mono">
                        {item.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
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
                    <td
                      colSpan={11}
                      onClick={addItem}
                      className="py-8 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-2 text-slate-400 font-bold">
                        <Plus size={18} />
                        Click to add new line item
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50/30 p-8 grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-slate-50">
              <div className="lg:col-span-2 space-y-10">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight ml-1">
                    Amount in Words
                  </label>
                  <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-500 italic flex items-center gap-3">
                    <div className="size-2 bg-blue-400 rounded-full animate-pulse" />
                    Calculated automatically based on grand total.
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight ml-1">
                      Bank Details
                    </label>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">
                          Bank
                        </span>
                        <span className="font-black text-slate-800">
                          {formData.bankName || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">
                          A/C No
                        </span>
                        <span className="font-black text-slate-800">
                          {formData.bankAccountNo || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">
                          IFSC
                        </span>
                        <span className="font-black text-slate-800">
                          {formData.bankIfsc || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight ml-1">
                      Terms & Conditions
                    </label>
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

              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-tight">
                      Net Amount
                    </span>
                    <span className="font-black text-slate-900 font-mono">
                      ₹{" "}
                      {totals.netAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-tight">
                      Cash Discount
                    </span>
                    <input
                      type="number"
                      name="cashDiscount"
                      value={formData.cashDiscount}
                      onChange={handleInputChange}
                      className="w-28 px-3 py-1.5 text-right bg-slate-50 rounded-lg border border-slate-200 font-black text-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-tight">
                      CGST Tot.
                    </span>
                    <span className="font-black text-slate-900 font-mono">
                      ₹{" "}
                      {totals.cgst.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-tight">
                      SGST Tot.
                    </span>
                    <span className="font-black text-slate-900 font-mono">
                      ₹{" "}
                      {totals.sgst.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-50">
                    <span className="text-slate-500 font-bold uppercase tracking-tight">
                      Round Off
                    </span>
                    <input
                      type="number"
                      name="roundOff"
                      value={formData.roundOff}
                      onChange={handleInputChange}
                      className="w-28 px-3 py-1.5 text-right bg-slate-50 rounded-lg border border-slate-200 font-black text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 text-right">
                      Grand Total Payable
                    </p>
                    <div className="flex justify-between items-end">
                      <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Receipt size={24} />
                      </div>
                      <span className="text-3xl font-black text-blue-600 font-mono tracking-tighter">
                        ₹{" "}
                        {totals.grandTotal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={loading || !hasValidItem}
                    className="w-full h-16 flex justify-center items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-wider"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={24} className="mr-3 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={24} className="mr-3" />
                        Save Estimate
                      </>
                    )}
                  </button>
                  {!hasValidItem && (
                    <p className="text-xs text-amber-600 font-semibold text-center">
                      Add at least one item with Item Code, Quantity, and Rate
                      to save
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
          {isPaymentMode && (

<section className="bg-white p-6 rounded-2xl border border-green-200 mt-6">

    <h2 className="text-xl font-bold text-green-700 mb-5">
        Payment Details
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
            <label className="block text-sm font-bold mb-2">
                Payment Type
            </label>

            <select
                value={paymentType}
                onChange={(e) =>
                    setPaymentType(
                        e.target.value
                    )
                }
                className="w-full border rounded-xl px-4 py-3"
            >
                <option value="FULL">
                    Full Payment
                </option>

                <option value="HALF">
                    Half Payment
                </option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-bold mb-2">
                Paid Amount
            </label>

            <input
                type="number"
                value={paidAmount}
                onChange={(e) =>
                    setPaidAmount(
                        Number(e.target.value)
                    )
                }
                className="w-full border rounded-xl px-4 py-3"
            />
        </div>

        <div className="flex items-center gap-3 mt-2">

            <input
                type="checkbox"
                checked={advancedEnabled}
                onChange={(e) =>
                    setAdvancedEnabled(
                        e.target.checked
                    )
                }
            />

            <label className="font-medium">
                Advance Included
            </label>

        </div>

        {advancedEnabled && (

            <div>

                <label className="block text-sm font-bold mb-2">
                    Additional Amount
                </label>

                <input
                    type="number"
                    value={additionalAmount}
                    onChange={(e) =>
                        setAdditionalAmount(
                            Number(e.target.value)
                        )
                    }
                    className="w-full border rounded-xl px-4 py-3"
                />

            </div>

        )}

    </div>

</section>

)}
        </form>

        <CatalogItemSelector
          isOpen={isCatalogOpen}
          onClose={() => setIsCatalogOpen(false)}
          onSelect={handleProductSelect}
        />

        <CreateLeadModal
          isOpen={isCreateLeadOpen}
          onClose={() => setIsCreateLeadOpen(false)}
          onSubmit={handleCreateLead}
        />
      </main>
    </div>
  );
};

export default SimpleQuotationForm;
