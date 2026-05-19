import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  Info,
  Plus,
  X,
  Tag,
  FileText,
  Upload,
  CheckCircle2,
  Search,
  User,
  RefreshCw,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { getServiceTypes } from "../../services/quotationService";
import {
  searchLeads,
  getRecentLeads,
  createLead,
  Lead,
} from "../../services/leadService";
import CreateLeadModal from "./CreateLeadModal";

// [UPGRADE] GST State Code Lookup Table from Code B
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

// [UPGRADE] GST State detection helper from Code B
const getStateFromGST = (
  gst: string,
): { code: string; name: string } | null => {
  if (!gst || gst.length < 2) return null;
  const stateCode = gst.substring(0, 2);
  return GST_STATE_MAP[stateCode] || null;
};

interface NewQuotationFormProps {
  onBack: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialCompany?: string;
  initialData?: Record<string, string | number | boolean | null | undefined | object>;
isEditMode?: boolean;
isTaxInvoiceMode?: boolean;
isReadOnly?: boolean;
isPaymentMode?: boolean;
}

const NewQuotationForm: React.FC<NewQuotationFormProps> = ({
    initialData,
    isEditMode = false,
    isReadOnly = false,
    isTaxInvoiceMode = false,
isPaymentMode = false,
  onBack,
  onSubmit,
  initialCompany,
}) => {
  // Custom CSS to hide number input spinners
  const hideSpinnersStyle = `
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type=number] {
            -moz-appearance: textfield;
        }
    `;

  // [UPGRADE] track resolved state from GST from Code B
  const [resolvedGstState, setResolvedGstState] = useState<{
    code: string;
    name: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    // FROM Section
    fromCompanyName: initialCompany || "",
    fromGstNumber: "27ABNCS6063N1ZJ",
    corporateOfficeAddress:
      "Audumbar Nivya Complex, Office No 203, Narhe, Shree Control Chowk, Near Canara Bank, Pune-411041",
    factoryAddress: "Shop No 2 Pari Chowk, Narhe, Sinhagad Road, Pune -411041",
    contactNumbers: "9272177947 / 9665389150",
    email: "Eresh@solarica.in , Kiran@solarica.in",

    // TO Section
    customerName: "",
    consumerNumber: "",
    BillingNumber: "",
    CustomerNumber: "",
    gstNumber: "",
    customerEmail: "",
    customerPhone: "",
    whatsAppNumber: "", // [NEW] WhatsApp Number

    // Customer Type Section
    customerType: "Individual", // Default
    subsidyType: "Subsidy", // "Subsidy" or "Non-Subsidy"
    // Service & Pricing Section
    serviceType: "On-Grid",
    systemCapacityKw: 1,
    phase: "1 Phase",
    systemCost: 57118, // 65000 - 7882
    gstRate: 13.8,
    gstAmount: 7882,
    totalAmount: 65000, // Now represents inclusive total
    subsidyAmount: 30000,
    netCost: 27118, // (65000 - 7882) - 30000
    netPayable: 35000, // 65000 - 30000
    numberOfFlats: 0,

    // Validity Section
    validityDays: "7",
    validTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],

    // Items Section
    items: [
      {
        itemName: "Solar PV Modules",
        specification: "",
        make: "",
        qty: "6 NOS",
        specification1: "",
        specification2: "",
        specification3: "",
        specification7: "",
        specification8: "",
        specification9: "",
      },
      {
        itemName: "Solar Inverter",
        specification: "3 Phase 5 kw\n5 years Warranty",
        make: "",
        qty: "1 each",
        specification1: "",
        specification2: "",
        specification3: "",
        specification7: "",
        specification8: "",
        specification9: "",
      },
      {
        itemName: "Solar Structure",
        specification: "Galvanized Solar Structure Roof mounted",
        make: "Solarica",
        qty: "1 set",
        specification1: "",
        specification2: "",
        specification3: "",
        specification7: "",
        specification8: "",
        specification9: "",
      },
      {
        itemName: "Earthing Plats and Cable",
        specification:
          "Down Conductor earthing 16 sqr mm- For Structure Earthing and Inverter Earthing And ACDB earthing EarthingRod/Plates",
        make: "Polycab/Waree",
        qty: "APR",
        specification1: "",
        specification2: "",
        specification3: "",
        specification7: "",
        specification8: "",
        specification9: "",
      },
      {
        itemName: "AcCable",
        specification: "2.5 Sqr mm 4 core Copper Flexible",
        make: "Polycab",
        qty: "APR",
        specification1: "",
        specification2: "",
        specification3: "",
        specification7: "",
        specification8: "",
        specification9: "",
      },
      {
        itemName: "DC cable",
        specification: "4 Sqr mm Single core R+B",
        make: "Polycab/Waree/Apar",
        qty: "APR",
        specification1: "",
        specification2: "",
        specification3: "",
        specification7: "",
        specification8: "",
        specification9: "",
      },
    ],

    // [NEW] Sales Employee Fields
  });

useEffect(() => {

  if (!isEditMode || !initialData) {
    return;
  }

  setFormData((prev) => ({

  ...prev,

  // CUSTOMER DETAILS

  customerName:
    String(
      initialData.customerName ||
      initialData.companyName ||
      ""
    ),

  customerEmail:
    String(
      initialData.customerEmail ||
      initialData.companyEmail ||
      ""
    ),

  customerPhone:
    String(
      initialData.customerPhone ||
      initialData.companyPhone ||
      initialData.customerContact ||
      ""
    ),

  customerType:
    String(
      initialData.customerType ||
      ""
    ),

  // GST DETAILS

  gstNumber:
    String(
      initialData.gstNumber ||
      initialData.customerGstinUin ||
      ""
    ),

  gstRate:
    Number(
      initialData.gstRate || 0
    ),

  gstAmount:
    Number(
      initialData.gstAmount || 0
    ),

  // COMPANY DETAILS

  fromCompanyName:
    String(
      initialData.fromCompanyName || ""
    ),

  fromGstNumber:
    String(
      initialData.fromGstNumber || ""
    ),

  // SERVICE DETAILS

  serviceType:
    String(
      initialData.serviceType ||
      initialData.onGrid ||
      ""
    ),

  onGrid:
    String(
      initialData.onGrid || ""
    ),

  phase:
    String(
      initialData.phase || ""
    ),

  subsidyType:
    String(
      initialData.subsidyType || ""
    ),

validityDays:
  String(
    initialData.validityDays || ""
  ),

  // SYSTEM DETAILS

  systemCapacityKw:
    Number(
      initialData.systemCapacityKw ||
      initialData.systemCapacity ||
      0
    ),

  systemCost:
    Number(
      initialData.systemCost || 0
    ),

  numberOfFlats:
    Number(
      initialData.numberOfFlats || 0
    ),

  // BILLING DETAILS

  BillingNumber:
    String(
      initialData.BillingNumber || ""
    ),

  CustomerNumber:
    String(
      initialData.CustomerNumber || ""
    ),

  consumerNumber:
    String(
      initialData.consumerNumber || ""
    ),

  // FINANCIAL DETAILS

  subsidyAmount:
    Number(
      initialData.subsidyAmount || 0
    ),

  netPayable:
    Number(
      initialData.netPayable ||
      initialData.netPayableAmount ||
      initialData.grandTotalPayable ||
      initialData.totalAmount ||
      0
    ),

  totalAmount:
    Number(
      initialData.totalAmount ||
      initialData.grandTotalPayable ||
      0
    ),

  // PROFORMA FIELDS

  advancedEnabled:
    Boolean(
      initialData.advancedEnabled
    ),

  additionalAmount:
    Number(
      initialData.additionalAmount || 0
    ),

  isProforma:
    Boolean(
      initialData.isProforma
    ),

  remarks:
    String(
      initialData.remarks || ""
    ),

  // ITEMS

  items:
    Array.isArray(initialData.items)
      ? initialData.items.map(
          (
            item: any
          ) => ({

            itemName:
              item.itemName ||
              item.make1 ||
              item.description ||
              "",

            specification:
              item.specification || "",

         make:
  item.make1 ||
  item.make ||
  "",

            qty:
              String(
                item.qty ||
                item.quantity ||
                ""
              ),

            specification1:
              item.specification1 || "",

            specification2:
              item.specification2 || "",

            specification3:
              item.specification3 || "",

            specification7:
              item.specification7 || "",

            specification8:
              item.specification8 || "",

            specification9:
              item.specification9 || "",

          })
        )
      : prev.items,

}));

}, [initialData, isEditMode]);

  const [editingSpecsIndex, setEditingSpecsIndex] = useState<number | null>(
    null,
  );

  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Lead Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [showLeadResults, setShowLeadResults] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  

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

  const searchTimeoutRef = React.useRef<any>(null); // Use any to avoid NodeJS type issues

  // Load recent leads on mount
  useEffect(() => {
    getRecentLeads()
      .then(setRecentLeads)
      .catch((err) => console.error("Failed to load recent leads", err));
  }, []);

  // Mock Budget Mapping
  const serviceBudgets: Record<string, string> = {
    "On-Grid": "150000",
    "Off-Grid with Batteries": "72000", // [UPDATE] Default Cost
    "Hybrid (Battery & Grid)": "78000", // [UPDATE] Default Cost
    "Solar Farming Systems": "", // [UPDATE] Manual Entry
    "Commercial Solar Systems": "", // [UPDATE] Manual Entry
    "Service 1": "10000",
    "Service 2": "20000",
    "Service 3": "30000",
  };

  const gstRates = [0, 0.5, 2.5, 3, 7, 11.5, 14.4, 18, 20, 28, 40];

  useEffect(() => {
    loadServiceTypes();
  }, []);

  const loadServiceTypes = async () => {
    try {
      const types = await getServiceTypes();
      setServiceTypes(types || []);
    } catch (error) {
      console.error("Failed to load service types", error);
      setServiceTypes([
        "On-Grid",
        "Off-Grid with Batteries",
        "Hybrid (Battery & Grid)",
        "Solar Farming Systems",
        "Commercial Solar Systems",
      ]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Prevent decimal input for System Capacity
    if (name === "systemCapacityKw" && value.includes(".")) {
      return;
    }

    // [VALIDATION] Consumer Number (12 Digits Numeric)
    if (name === "consumerNumber") {
      if (!/^\d*$/.test(value)) return; // Only numeric
      if (value.length > 12) return; // Max 12
    }

    // [VALIDATION] WhatsApp Number (10 Digits Numeric)
    if (name === "whatsAppNumber") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    // [VALIDATION] Customer Name - alphabets and spaces only
    if (name === "customerName") {
      const sanitized = value.replace(/[^a-zA-Z\s.]/g, "").slice(0, 100);
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      // Continue to lead search logic below
    }

    // [VALIDATION] Billing Number - alphanumeric only
    if (name === "BillingNumber") {
      const sanitized = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }

    // [VALIDATION] Customer Number - alphanumeric only
    if (name === "CustomerNumber") {
      const sanitized = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }

    // [VALIDATION] GST Number - uppercase alphanumeric, 15 chars [UPGRADED with state detection from Code B]
    if (name === "gstNumber") {
      const sanitized = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 15);

      // Resolve state from first 2 digits
      const state = getStateFromGST(sanitized);
      if (state) {
        setResolvedGstState(state);
      } else {
        if (sanitized.length < 2) setResolvedGstState(null);
      }

      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }

    // [VALIDATION] Phone Number - digits only, max 10 digits
    if (name === "customerPhone") {
      const digitsOnly = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    // [LEAD SEARCH] Trigger search on Customer Name change
    if (name === "customerName") {
      setShowLeadResults(true);

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (value.length > 1) {
        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(async () => {
          try {
            const results = await searchLeads(value);
            setSearchResults(results || []);
          } catch (err) {
            console.error("Search failed", err);
          } finally {
            setIsSearching(false);
          }
        }, 300);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-fill total cost on service change
      if (name === "serviceType") {
        const defaultCost = serviceBudgets[value];
        // Only set if default exists (empty string means manual entry)
        if (defaultCost !== undefined) {
          newData.totalAmount = defaultCost ? parseFloat(defaultCost) : 0;
        }
      }

      // Calculation and Phase defaulting
      if (
        name === "systemCapacityKw" ||
        name === "subsidyType" ||
        name === "customerType" ||
        name === "numberOfFlats"
      ) {
        const capacity = parseFloat(newData.systemCapacityKw as any) || 0;

        // Set Phase Type default logic (only on capacity change)
        if (name === "systemCapacityKw") {
          if (capacity >= 6) {
            newData.phase = "3 Phase";
          } else if (capacity > 0) {
            newData.phase = "1 Phase";
          }
        }

        if (name === "systemCapacityKw" || name === "subsidyType") {
          const pricePerKW =
            newData.subsidyType === "Non-Subsidy" ? 42000 : 65000;
          const systemCostVal = pricePerKW * capacity;
          if (
            ![
              "Solar Farming Systems",
              "Commercial Solar Systems",
              "Off-Grid with Batteries",
              "Hybrid (Battery & Grid)",
            ].includes(newData.serviceType)
          ) {
            newData.totalAmount = systemCostVal;
          }
        }
      }

      // [AUTO-CALCULATION] when any cost field changes
      const currentTotalAmount = parseFloat(newData.totalAmount as any) || 0;
      const currentGstRate = parseFloat(newData.gstRate as any) || 0;
      const currentSubsidyAmount =
        parseFloat(newData.subsidyAmount as any) || 0;

      // 1. Calculate GST Amount
      newData.gstAmount = Math.round(
        currentTotalAmount * (currentGstRate / (100 + currentGstRate)),
      );

      // 2. Calculate Base System Cost (Excl GST)
      newData.systemCost = currentTotalAmount - newData.gstAmount;

      // 3. Subsidy Logic (remains same)
      // const currentCapacityKw = parseFloat(newData.systemCapacityKw as any) || 0;
      // if (newData.subsidyType === 'Subsidy') {
      //     if (newData.customerType === 'Society') {
      //         const flats = parseFloat(newData.numberOfFlats as any) || 0;
      //         const subsidyEligibleKW = Math.min(flats, currentCapacityKw, 500);
      //         newData.subsidyAmount = subsidyEligibleKW * 18000;
      //     } else {
      //         if (currentCapacityKw <= 2) {
      //             newData.subsidyAmount = currentCapacityKw * 30000;
      //         } else if (currentCapacityKw <= 3) {
      //             newData.subsidyAmount = 60000 + (currentCapacityKw - 2) * 18000;
      //         } else {
      //             // Max subsidy cap check? standard is 78k for >3kw
      //             newData.subsidyAmount = 78000;
      //         }
      //     }
      // } else {
      //     newData.subsidyAmount = 0;
      // }

      // // 4. Net Cost (Excl GST) - Subsidy
      // newData.netCost = Math.round(newData.systemCost - newData.subsidyAmount);

      // // 5. Net Payable = Total (Inclusive) - Subsidy
      // // FIX: Ensure Net Payable is never negative.
      // const calculatedNetPayable = Math.round(currentTotalAmount - newData.subsidyAmount);
      // newData.netPayable = Math.max(0, calculatedNetPayable);

      // ===================== SUBSIDY CALCULATION =====================

      const currentCapacityKw =
        parseFloat(newData.systemCapacityKw as any) || 0;

      // Default subsidy = 0
      newData.subsidyAmount = 0;

      if (newData.subsidyType === "Subsidy") {
        // ✅ 1. SOCIETY LOGIC
        if (newData.customerType === "Society") {
          const flats = parseFloat(newData.numberOfFlats as any) || 0;
          const subsidyEligibleKW = Math.min(flats, currentCapacityKw, 500);
          newData.subsidyAmount = subsidyEligibleKW * 18000;
        }

        // ✅ 2. INDIVIDUAL LOGIC
        else if (newData.customerType === "Individual") {
          if (currentCapacityKw <= 2) {
            newData.subsidyAmount = currentCapacityKw * 30000;
          } else if (currentCapacityKw <= 3) {
            newData.subsidyAmount = 60000 + (currentCapacityKw - 2) * 18000;
          } else {
            newData.subsidyAmount = 78000;
          }
        }

        // ✅ 3. CORPORATE / NON-CORPORATE (NO SUBSIDY)
        else if (["Corporate", "NonCorporate"].includes(newData.customerType)) {
          newData.subsidyAmount = 0;
        }
      }

      // ===================== FINAL CALCULATIONS =====================

      // Net Cost (Excluding GST - Subsidy)
      newData.netCost = Math.round(newData.systemCost - newData.subsidyAmount);

      // Net Payable (Including GST - Subsidy)
      const calculatedNetPayable = Math.round(
        currentTotalAmount - newData.subsidyAmount,
      );
      newData.netPayable = Math.max(0, calculatedNetPayable);

      // Recalculate expiry date
      if (name === "validityDays") {
        const days = parseInt(value) || 7;
        const date = new Date();
        date.setDate(date.getDate() + days);
        newData.validTill = date.toISOString().split("T")[0];
      }

      return newData;
    });
  };

  // Helper for Lead Search to keep handleChange clean(er)
  const handleLeadSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const results = await searchLeads(query);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Failed to search leads", error);
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
        customerPhone: lead.phone || prev.customerPhone,
        gstNumber: lead.gstin || prev.gstNumber, // [UPGRADE] Added gstin mapping from Code B
      };

      // [UPGRADE] Auto-resolve state logic from Code B
      const gstin = lead.gstin || prev.gstNumber;
      if (gstin && gstin.length >= 2) {
        const state = getStateFromGST(gstin);
        if (state) setResolvedGstState(state);
      }

      return newData;
    });
    setShowLeadResults(false);
  };

  const handleCreateLead = async (leadData: any) => {
    try {
      const newLead = await createLead(leadData);
      setRecentLeads((prev) => [newLead, ...prev]);
      selectLead(newLead);
      toast.success("Lead created and selected successfully!");
      setIsCreateLeadOpen(false);
    } catch (error) {
      console.error("Failed to create lead", error);
      toast.error("Failed to create lead");
    }
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    (newItems[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const [documents, setDocuments] = useState({
    aadharCard: null as File | null,
    panCard: null as File | null,
    lightBill: null as File | null,
  });

  // Custom GST Dropdown State
  const [showGstOptions, setShowGstOptions] = useState(false);

  const handleFileChange = (
    field: keyof typeof documents,
    file: File | null,
  ) => {
    setDocuments((prev) => ({ ...prev, [field]: file }));
  };

  const handleBack = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemName: "",
          specification: "",
          make: "",
          qty: "",
          specification1: "",
          specification2: "",
          specification3: "",
          specification7: "",
          specification8: "",
          specification9: "",
        },
      ],
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemName: "",
          specification: "",
          make: "",
          qty: "",
          specification1: "",
          specification2: "",
          specification3: "",
          specification7: "",
          specification8: "",
          specification9: "",
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // [VALIDATION] Required Customer Details
    if (!formData.customerName.trim()) {
      toast.error("Customer Name is required.");
      return;
    }

    if (
      !formData.customerPhone.trim() ||
      formData.customerPhone.length !== 10
    ) {
      toast.error("Phone Number is required and must be exactly 10 digits.");
      return;
    }

    // [VALIDATION] Final Check
    if (formData.consumerNumber && formData.consumerNumber.length !== 12) {
      toast.error("Consumer Number must be exactly 12 digits.");
      return;
    }

    if (formData.whatsAppNumber && formData.whatsAppNumber.length !== 10) {
      toast.error("WhatsApp Number must be exactly 10 digits.");
      return;
    }

    if (formData.gstNumber && formData.gstNumber.length !== 15) {
      toast.error("GST Number must be exactly 15 characters.");
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        paymentType,
paidAmount,
advancedEnabled,
additionalAmount,
      items: formData.items.map((item) => ({

  itemName:
    item.itemName || "",

  make1:
    item.make || "",

  make2:
    "",

  quantity:
    item.qty || "",

  specification:
    item.specification || "",

  specification1:
    item.specification1 || "",

  specification2:
    item.specification2 || "",

  specification3:
    item.specification3 || "",

  specification7:
    item.specification7 || "",

  specification8:
    item.specification8 || "",

  specification9:
    item.specification9 || ""

})),

        documents: documents, // Pass documents to parent
      };
      await onSubmit(submissionData);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 w-full animate-in fade-in duration-500 overflow-y-auto pb-20">
      <style>{hideSpinnersStyle}</style>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Quotation Form
            </h1>
            <p className="text-sm text-slate-500">
              Fill in the details to generate a professional quotation
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            form="quotation-form"
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                Generate Quotation
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        <form
          id="quotation-form"
          onSubmit={handleSubmit}
          className="space-y-12"
        >
          {/* Section 1: FROM */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">
                Section 1: FROM (Company Details)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  Company Name
                </label>
                <input
                  type="text"
                  name="fromCompanyName"
                  value={formData.fromCompanyName}
                  onChange={handleChange}
                  placeholder="Enter Company Name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-slate-50/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  Email Addresses
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-slate-50/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  GST Number
                </label>

                <input
                  type="text"
                  value={formData.fromGstNumber}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-slate-50/50"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  Corporate Office Address
                </label>
                <textarea
                  name="corporateOfficeAddress"
                  value={formData.corporateOfficeAddress}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-slate-50/50 resize-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  Factory Address
                </label>
                <textarea
                  name="factoryAddress"
                  value={formData.factoryAddress}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-slate-50/50 resize-none"
                />
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    Contact Numbers
                  </label>
                  <input
                    type="text"
                    name="contactNumbers"
                    value={formData.contactNumbers}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-slate-50/50"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: TO */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <Info size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">
                  Section 2: TO (Customer Details)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateLeadOpen(true)}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all flex items-center gap-2"
              >
                <Plus size={16} />
                New Lead
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { label: "Name", name: "customerName", required: true },
                {
                  label: "Consumer Number",
                  name: "consumerNumber",
                  placeholder: "12 digits",
                },
                { label: "Billing Number", name: "BillingNumber" },
                { label: "Customer Number", name: "CustomerNumber" },
                {
                  label: "GST Number",
                  name: "gstNumber",
                  placeholder: "e.g. 22AAAAA0000A1Z5",
                },
                { label: "Email", name: "customerEmail", type: "email" },
                {
                  label: "Phone",
                  name: "customerPhone",
                  type: "tel",
                  required: true,
                },
                {
                  label: "WhatsApp Number",
                  name: "whatsAppNumber",
                  type: "tel",
                },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    {field.label}
                    {(field as any).required && (
                      <span className="text-red-500"> *</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      placeholder={
                        (field as any).placeholder || `Enter ${field.label}`
                      }
                      autoComplete="off"
                      onFocus={() => {
                        if (field.name === "customerName") {
                          setShowLeadResults(true);
                          if (formData.customerName.length > 1) {
                            handleLeadSearch(formData.customerName);
                          }
                        }
                      }}
                      onBlur={() =>
                        setTimeout(() => setShowLeadResults(false), 200)
                      }
                      className={`w-full px-4 py-3 rounded-xl border ${
                        (field.name === "consumerNumber" &&
                          formData.consumerNumber &&
                          formData.consumerNumber.length !== 12) ||
                        (field.name === "whatsAppNumber" &&
                          formData.whatsAppNumber &&
                          formData.whatsAppNumber.length !== 10) ||
                        (field.name === "customerPhone" &&
                          formData.customerPhone &&
                          formData.customerPhone.length !== 10) ||
                        (field.name === "gstNumber" &&
                          formData.gstNumber &&
                          formData.gstNumber.length !== 15)
                          ? "border-red-300 focus:border-red-500 from-red-50"
                          : field.name === "gstNumber" && resolvedGstState
                            ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100"
                            : "border-slate-200 focus:border-indigo-500"
                      } focus:ring-4 transition-all outline-none bg-slate-50/50`}
                    />

                    {/* Lead Search Results Dropdown */}
                    {field.name === "customerName" && showLeadResults && (
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
                                  }} // onMouseDown prevents blur before click
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
                  {/* [UPGRADE] GST state and character count logic from Code B */}
                  {field.name === "gstNumber" && (
                    <>
                      {resolvedGstState && (
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
                      {formData.gstNumber.length >= 2 && !resolvedGstState && (
                        <div className="flex items-center gap-2 mt-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg animate-in fade-in duration-200">
                          <span className="text-xs font-bold text-amber-600">
                            ⚠ Unrecognised state code
                          </span>
                        </div>
                      )}
                      {formData.gstNumber &&
                        formData.gstNumber.length > 0 &&
                        formData.gstNumber.length !== 15 && (
                          <p className="text-[10px] text-slate-400 font-medium">
                            {formData.gstNumber.length}/15 characters
                          </p>
                        )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Customer Type */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">
                Section 3: Customer Type
              </h2>
            </div>

            <div className="space-y-8">
              {/* <div className="flex flex-wrap gap-8">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="customerType"
                                            value="Individual"
                                            checked={formData.customerType === 'Individual'}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`w-6 h-6 rounded-full border-2 transition-all ${formData.customerType === 'Individual' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 group-hover:border-emerald-300'}`}>
                                            {formData.customerType === 'Individual' && <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>}
                                        </div>
                                    </div>
                                    <span className={`font-bold transition-colors ${formData.customerType === 'Individual' ? 'text-emerald-700' : 'text-slate-600'}`}>Individual</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="customerType"
                                            value="Society"
                                            checked={formData.customerType === 'Society'}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`w-6 h-6 rounded-full border-2 transition-all ${formData.customerType === 'Society' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 group-hover:border-emerald-300'}`}>
                                            {formData.customerType === 'Society' && <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>}
                                        </div>
                                    </div>
                                    <span className={`font-bold transition-colors ${formData.customerType === 'Society' ? 'text-emerald-700' : 'text-slate-600'}`}>Society / Apartment</span>
                                </label>
                            </div> */}

              <div className="flex flex-wrap gap-8">
                {[
                  { label: "Individual", value: "Individual" },
                  { label: "Society / Apartment", value: "Society" },
                  { label: "Corporate Client", value: "Corporate" },
                  { label: "Non-Corporate Client", value: "NonCorporate" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="customerType"
                        value={option.value}
                        checked={formData.customerType === option.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          formData.customerType === option.value
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-slate-300 group-hover:border-emerald-300"
                        }`}
                      >
                        {formData.customerType === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                      </div>
                    </div>
                    <span
                      className={`font-bold transition-colors ${
                        formData.customerType === option.value
                          ? "text-emerald-700"
                          : "text-slate-600"
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Individual Specific */}
              {formData.customerType === "Individual" && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <h3 className="text-sm font-bold text-slate-700 underline underline-offset-4 uppercase tracking-tight">
                    Subsidy Options
                  </h3>
                  <div className="max-w-xs">
                    <select
                      name="subsidyType"
                      value={formData.subsidyType}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 outline-none bg-white font-bold text-slate-700 appearance-none cursor-pointer hover:border-emerald-200 shadow-sm hover:shadow-md"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                        backgroundPosition: "right 1.25rem center",
                        backgroundSize: "1.2rem",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <option value="">Select Option</option>
                      {["Subsidy", "Non-Subsidy"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <h3 className="text-sm font-bold text-slate-700 underline underline-offset-4 uppercase tracking-tight">
                    Type of System to be Installed
                  </h3>
                  <div className="max-w-md">
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none bg-white font-bold text-slate-700 appearance-none cursor-pointer hover:border-blue-200 shadow-sm hover:shadow-md"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                        backgroundPosition: "right 1.25rem center",
                        backgroundSize: "1.2rem",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <option value="">Select System Type</option>
                      {[
                        "On-Grid",
                        "Off-Grid with Batteries",
                        "Hybrid (Battery & Grid)",
                        "Solar Farming Systems",
                        "Commercial Solar Systems",
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Society Specific */}
              {formData.customerType === "Society" && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <h3 className="text-sm font-bold text-slate-700 underline underline-offset-4 uppercase tracking-tight">
                    Subsidy Options
                  </h3>
                  <div className="flex gap-8">
                    {["Subsidy", "Non-Subsidy"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 p-4 bg-white px-8 rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-300 transition-all shadow-sm"
                      >
                        <input
                          type="radio"
                          name="subsidyType"
                          value={option}
                          checked={formData.subsidyType === option}
                          onChange={handleChange}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-bold text-slate-700">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 4: Service & Pricing */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">
                Section 4: Service & Pricing
              </h2>
            </div>

            {/* [NEW] Subsidy Applicable Toggle for Specific Systems */}
            {[
              "Off-Grid with Batteries",
              "Hybrid (Battery & Grid)",
              "Solar Farming Systems",
              "Commercial Solar Systems",
            ].includes(formData.serviceType) && (
              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight block mb-4">
                  Is Subsidy Applicable?
                </label>
                <div className="flex gap-8">
                  {["Yes", "No"].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-4 px-8 rounded-xl border cursor-pointer transition-all shadow-sm ${
                        (formData.subsidyType === "Subsidy" &&
                          option === "Yes") ||
                        (formData.subsidyType === "Non-Subsidy" &&
                          option === "No")
                          ? "bg-white border-emerald-500 ring-2 ring-emerald-500/20"
                          : "bg-white border-slate-200 hover:border-emerald-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="subsidyType"
                        value={option === "Yes" ? "Subsidy" : "Non-Subsidy"}
                        checked={
                          option === "Yes"
                            ? formData.subsidyType === "Subsidy"
                            : formData.subsidyType === "Non-Subsidy"
                        }
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-bold text-slate-700">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-2 italic">
                  * Select 'Yes' to calculate and deduct subsidy from the total
                  cost.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  System Capacity (KW) & Phase
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="systemCapacityKw"
                      value={formData.systemCapacityKw}
                      onChange={handleChange}
                      min="1"
                      step="1"
                      placeholder="Enter KW"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white font-bold"
                    />
                  </div>
                  <div className="w-1/3 relative">
                    <select
                      name="phase"
                      value={formData.phase}
                      onChange={handleChange}
                      className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white font-bold text-slate-700 appearance-none cursor-pointer hover:border-amber-300"
                    >
                      <option value="1 Phase">1 Phase</option>
                      <option value="3 Phase">3 Phase</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-4 w-4 text-slate-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  Total Cost (Incl. GST) (₹)
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white font-mono font-bold text-slate-700"
                />
                <p className="text-[10px] text-slate-400 font-medium">
                  Total inclusive price
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  GST Component (Included) (₹)
                </label>
                <input
                  type="number"
                  name="gstAmount"
                  value={(formData as any).gstAmount || "0"}
                  readOnly
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-amber-600 outline-none"
                />
                <p className="text-[10px] text-slate-400 font-medium">
                  Extracted from total
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-emerald-700 uppercase tracking-tight font-black">
                  Net Payable (₹)
                </label>
                <input
                  type="number"
                  name="netPayable"
                  value={formData.netPayable}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 font-mono font-extrabold text-emerald-700 outline-none shadow-inner"
                />
                <p className="text-[10px] text-emerald-600 font-bold">
                  Total - Subsidy (Final Amount)
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  GST Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="gstRate"
                    value={formData.gstRate}
                    onChange={handleChange}
                    onFocus={() => setShowGstOptions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowGstOptions(false), 200)
                    }
                    placeholder="Enter or Select GST %"
                    step="0.1"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 font-bold outline-none bg-white"
                    autoComplete="off"
                  />
                  {showGstOptions && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                      {gstRates.map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, gstRate: rate }))
                          }
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 transition-colors"
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Select from list or type manually
                </p>
              </div>

              <div className="space-y-2">
                {formData.customerType === "Society" && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                      No. of Flats
                    </label>
                    <input
                      type="number"
                      name="numberOfFlats"
                      value={formData.numberOfFlats}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none bg-white font-bold"
                    />
                    <p className="text-[10px] text-slate-400 font-medium italic">
                      * Used for subsidy calculation (Min of KW or Flats)
                    </p>
                  </div>
                )}

                {formData.subsidyAmount > 0 && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-bold text-emerald-700 uppercase tracking-tight">
                      CFA Subsidy Amount (₹)
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/50 font-mono font-bold text-emerald-600 flex justify-between items-center">
                      <span>
                        ₹ {formData.subsidyAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-600 font-medium italic">
                      {formData.customerType === "Society"
                        ? `* Rule: min(${formData.numberOfFlats} flats, ${formData.systemCapacityKw} KW, 500) * ₹18,000`
                        : `* Applicable for individual customers choosing subsidy`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sub-section: Bill of Material */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                  <div className="size-2 bg-amber-500 rounded-full animate-pulse" />
                  BILL OF MATERIAL
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-sm font-bold hover:bg-amber-100 transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                      <th className="px-4 py-4 w-16 text-center">Sr.</th>
                      <th className="px-4 py-4 w-[25%]">Item Name</th>
                      <th className="px-4 py-4 w-[35%]">Specification</th>
                      <th className="px-4 py-4">Make</th>
                      <th className="px-4 py-4 w-32 text-center">Qty.</th>
                      <th className="px-2 py-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.items.map((item, index) => (
                      <tr
                        key={index}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-4 text-center font-bold text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="text"
                            value={(item as any).itemName || ""}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "itemName",
                                e.target.value,
                              )
                            }
                            placeholder="Item Name"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all outline-none bg-white text-sm font-bold text-slate-700"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <textarea
                            rows={2}
                            value={(item as any).specification || ""}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "specification",
                                e.target.value,
                              )
                            }
                            placeholder="Enter specs..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all outline-none bg-white text-sm resize-y min-h-[50px]"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="text"
                            value={(item as any).make || ""}
                            onChange={(e) =>
                              handleItemChange(index, "make", e.target.value)
                            }
                            placeholder="Brand/Make"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all outline-none bg-white text-sm"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="text"
                            value={(item as any).qty || ""}
                            onChange={(e) =>
                              handleItemChange(index, "qty", e.target.value)
                            }
                            placeholder="Qty"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all outline-none bg-white text-sm font-bold text-center"
                          />
                        </td>
                        <td className="px-2 py-4 text-center">
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 5: Validity */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">
                Section 5: Validity
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <span className="text-lg font-bold text-slate-700">
                This offer is valid for
              </span>
              <div className="w-24">
                <input
                  type="number"
                  name="validityDays"
                  value={formData.validityDays}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none bg-white font-bold text-center"
                />
              </div>
              <span className="text-lg font-bold text-slate-700">
                days from the date of this offer.
              </span>

              <div className="ml-auto flex items-center gap-3 bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Expiry Date
                  </p>
                  <p className="text-rose-600 font-black">
                    {new Date(formData.validTill).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
                  <Info size={20} />
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Documents */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <FileText size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">
                Section 6: Documents
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Aadhar Card", key: "aadharCard" },
                { label: "PAN Card", key: "panCard" },
                { label: "Light Bill", key: "lightBill" },
              ].map((doc) => (
                <div key={doc.key} className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight block">
                    {doc.label}
                  </label>
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(
                          doc.key as any,
                          e.target.files?.[0] || null,
                        )
                      }
                      id={`doc-${doc.key}`}
                    />
                    <label
                      htmlFor={`doc-${doc.key}`}
                      className={`flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                        documents[doc.key as keyof typeof documents]
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-slate-100"
                      }`}
                    >
                      {documents[doc.key as keyof typeof documents] ? (
                        <>
                          <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 mb-2">
                            <CheckCircle2 size={24} />
                          </div>
                          <p className="text-xs font-bold text-emerald-700 max-w-[80%] truncate px-2">
                            {documents[doc.key as keyof typeof documents]?.name}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleFileChange(doc.key as any, null);
                            }}
                            className="mt-2 text-[10px] text-rose-500 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="bg-white p-2.5 rounded-full shadow-sm mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                            <Upload size={20} />
                          </div>
                          <p className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                            Click to Upload
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Action Bar */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-3 text-lg"
            >
              {loading ? "Generating Quotation..." : "Generate Quotation"}
            </button>
          </div>
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
      </main>

      {/* Detailed Specs Modal */}
      {editingSpecsIndex !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">
                Detailed Specifications
              </h3>
              <button
                onClick={() => setEditingSpecsIndex(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-sm text-slate-500 mb-4">
                Add detailed technical specifications for{" "}
                <strong>
                  {(formData.items[editingSpecsIndex] as any).itemName ||
                    "Item"}
                </strong>
                .
              </p>
              {[1, 2, 3, 7, 8, 9].map((num) => (
                <div key={num} className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                    Specification {num}
                  </label>
                  <textarea
                    rows={2}
                    value={
                      (formData.items[editingSpecsIndex] as any)[
                        `specification${num}`
                      ] || ""
                    }
                    onChange={(e) =>
                      handleItemChange(
                        editingSpecsIndex,
                        `specification${num}`,
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm bg-slate-50/50"
                    placeholder={`Enter specification ${num}...`}
                  />
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button
                onClick={() => setEditingSpecsIndex(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateLeadModal
        isOpen={isCreateLeadOpen}
        onClose={() => setIsCreateLeadOpen(false)}
        onSubmit={handleCreateLead}
      />
    </div>
  );
};

export default NewQuotationForm;
