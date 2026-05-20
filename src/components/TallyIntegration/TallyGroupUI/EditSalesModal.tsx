

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { ChevronDown, X, Loader2, Plus, Trash2 } from "lucide-react";
import axios from 'axios';
import { API_URL } from "../../../config";
import NewQuotationForm from "../../SalesMaster/NewQuotationForm";
import SimpleQuotationForm from "../../SalesMaster/SimpleQuotationForm";



const getCorrectAxiosConfig = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.warn("[EditModal] Token not found in localStorage.");
        return {};
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};


const fetchItemDetailsById = async (id: string, type: 'invoice' | 'quotation') => {
    try {
        const finalUrl = `${API_URL}/${type}s/${id}`;
        console.log(`[EditModal] Attempting to fetch from: ${finalUrl}`);
        
        // Use the corrected config function
        const config = getCorrectAxiosConfig();
        const response = await axios.get(finalUrl, config);
        
        return response.data.data||response.data.quotation || response.data.invoice;
    } catch (error: any) {
        console.error(`[EditModal] Failed to fetch ${type} details:`, error);
        if (error.response) {
            console.error('[EditModal] Server responded with:', error.response.status, error.response.data);
        }
        throw new Error(`Could not load details. Reason: ${error.response?.data?.message || 'Authorization Failed'}`);
    }
};

const updateItemDetails = async (id: string, type: 'invoice' | 'quotation', data: any) => {
    try {
        const finalUrl = `${API_URL}/${type}s/${id}`;
        console.log(`[EditModal] Updating at: ${finalUrl}`);
        
        const config = getCorrectAxiosConfig();
        const response = await axios.put(finalUrl, data, config);
        return response.data;
    } catch (error: any) {
        console.error(`[EditModal] Failed to update ${type}:`, error);
        throw new Error(`Failed to save changes.`);
    }
};


// --- Custom Status Dropdown Component (No changes needed) ---
const StatusDropdown = ({ value, onChange }: { value: string; onChange: (status: string) => void; }) => {
    const [isOpen, setIsOpen] = useState(false);
    const options = ["PENDING", "ACCEPTED", "PAID", "REJECTED"];
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };
    // const currentValue = value?.toUpperCase() || "PENDING";
    const currentValue =
    value
        ? value.toUpperCase()
        : "";
    return (
        <div className="relative w-full max-w-xs" ref={dropdownRef}>
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight block mb-2">Status</label>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none">
                <span className="font-bold text-slate-800">{currentValue}</span>
                <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {options.map((option) => (
                        <button key={option} onClick={() => handleSelect(option)} className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${currentValue === option ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Main Edit Modal Component ---
interface EditSalesModalProps {
    item: any;
    onClose: () => void;
    onSave: (data: any) => void;
}

const EditSalesModal: React.FC<EditSalesModalProps> = ({ item, onClose, onSave }) => {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
const isPaymentMode =
    item?.paymentMode === true;
   

    const itemType = item.invoiceNumber ? 'invoice' : 'quotation';
    const companiesForSimpleForm = ["Solarica Energy India Pvt Ltd", "Solarica Fabtech Pvt Ltd", "Solarica Industries Pvt Ltd"];
const companyName =
    formData?.fromCompanyName ||
    formData?.companyName ||
    "";

const formType = companiesForSimpleForm.includes(companyName)
    ? "simple"
    : "new";
    useEffect(() => {
        const fetchDetails = async () => {
            if (!item?.id) {
                setError("No item ID provided.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                // const data = await fetchItemDetailsById(item.id, itemType);
                // const status = data.status || data.paymentStatus || "PENDING";
                // setFormData({ ...data, status, items: data.items || [] });
const data = await fetchItemDetailsById(item.id, itemType);

console.log("FULL API DATA => ", data);

const status =
    data.status ??
    data.paymentStatus ??
    "";

const mappedData = {
    ...data,

    // COMPANY
    fromCompanyName:
        data.fromCompanyName ||
        data.companyName ||
        "",

    // CUSTOMER
    customerName:
        data.customerName ||
        "",

    customerPhone:
        data.customerPhone ||
        data.customerContact ||
        "",

    customerContact:
        data.customerContact ||
        data.customerPhone ||
        "",

    customerEmail:
        data.customerEmail ||
        "",

    customerAddress:
        data.customerAddress ||
        "",

    customerGstin:
        data.customerGstin ||
        data.customerGstinUin ||
        "",

    gstNumber:
        data.gstNumber ||
        data.customerGstinUin ||
        "",

    // COMPANY GST
    fromGstin:
        data.fromGstin ||
        data.gstinNumber ||
        "",

    fromGstNumber:
        data.fromGstNumber ||
        data.gstinNumber ||
        "",

    // BANK
    bankAccountNo:
        data.bankAccountNo ||
        data.accountNumber ||
        "",

    bankIfsc:
        data.bankIfsc ||
        data.ifscCode ||
        "",

    // TOTALS
    netPayableAmount:
        data.netPayableAmount ||
        data.grandTotalPayable ||
        0,

    systemCapacityKw:
        data.systemCapacityKw ||
        data.systemCapacity ||
        0,

    // SHIPPING
    recipientName:
        data.recipientName ||
        "",

    shippingAddress:
        data.shippingAddress ||
        "",

    stateCode:
        data.stateCode ||
        "",

    placeOfSupply:
        data.placeOfSupply ||
        "",

    // TERMS
    termsAndConditions:
        data.termsAndConditions ||
        "",

    // STATUS
    status,

    paymentStatus:
    data.paymentStatus || "",

paidType:
    data.paidType || "FULL",

paidAmount:
    Number(data.paidAmount || 0),

remainingAmount:
    Number(data.remainingAmount || 0),

advancedEnabled:
    Boolean(data.advancedEnabled),

additionalAmount:
    Number(data.additionalAmount || 0),

    

    // ITEMS
    items:
        data.items?.map((item: {
            id?: string;
            description?: string;
            itemDescription?: string;
            hsn?: string;
            hsnSac?: string;
            quantity?: number;
            qty?: number;
            rate?: number;
            unit?: string;
            itemName?: string;
            specification?: string;
            make?: string;
        }) => ({
            ...item,

            description:
                item.description ||
                item.itemDescription ||
                "",

            itemDescription:
                item.itemDescription ||
                item.description ||
                "",

            hsn:
                item.hsn ||
                item.hsnSac ||
                "",

            hsnSac:
                item.hsnSac ||
                item.hsn ||
                "",

            quantity:
                item.quantity ||
                item.qty ||
                0,

            qty:
                item.qty ||
                item.quantity ||
                0,

            rate:
                item.rate ||
                0,

            unit:
                item.unit ||
                "PCS",

            itemName:
                item.itemName ||
                item.description ||
                "",

            specification:
                item.specification ||
                "",

            make:
                item.make ||
                "",
        })) || [],
};

console.log("FINAL MAPPED DATA => ", mappedData);

setFormData(mappedData);

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [item, itemType]);

  

    
    // The render functions for the UI remain the same as the last version

const renderContent = () => {

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2
                    className="animate-spin text-blue-600"
                    size={40}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-red-500">
                {error}
            </div>
        );
    }

    if (!formData) {
        return null;
    }

    return (
        <div className="p-6">

           {formType === "simple" ? (

//  <SimpleQuotationForm
//     initialData={formData}
//     isEditMode={true}

//     isReadOnly={isPaymentMode}
// isPaymentMode={isPaymentMode}
//     onBack={onClose}
    

//     initialCompany={
//         formData.fromCompanyName ||
//         formData.companyName ||
//         ""
//     }



//     formTitle={
//         itemType === "invoice"
//             ? "Edit Invoice"
//             : "Edit Quotation"
//     }

// //   onSubmit={async (updatedData) => {

// //     let payload;

// //     if (formType === "simple") {

// //         payload = {

// //             companyName:
// //                 updatedData.fromCompanyName || "",

// //             gstinNumber:
// //                 updatedData.fromGstin || "",

// //             invoiceNumber:
// //                 updatedData.invoiceNumber || "",

// //             invoiceDate:
// //                 updatedData.invoiceDate || "",

// //             customerName:
// //                 updatedData.customerName || "",

// //             customerEmail:
// //                 updatedData.customerEmail || "",

// //             customerAddress:
// //                 updatedData.customerAddress || "",

// //             customerContact:
// //                 updatedData.customerContact || "",

// //             customerGstinUin:
// //                 updatedData.customerGstin || "",

// //             recipientName:
// //                 updatedData.recipientName || "",

// //             shippingAddress:
// //                 updatedData.shippingAddress || "",

// //             stateCode:
// //                 updatedData.stateCode || "",

// //             placeOfSupply:
// //                 updatedData.placeOfSupply || "",

// //             bankName:
// //                 updatedData.bankName || "",

// //             accountNumber:
// //                 updatedData.bankAccountNo || "",

// //             ifscCode:
// //                 updatedData.bankIfsc || "",

// //             termsAndConditions:
// //                 updatedData.termsAndConditions || "",

// //             paymentStatus:
// //                 updatedData.status || "PENDING",

// //             status:
// //                 updatedData.status || "PENDING",

// //             netAmount:
// //                 updatedData.totals?.netAmount || 0,

// //             cgst:
// //                 updatedData.totals?.cgst || 0,

// //             sgst:
// //                 updatedData.totals?.sgst || 0,

// //             grandTotalPayable:
// //                 updatedData.totals?.grandTotal || 0,

// //             items:
// //                 Array.isArray(updatedData.items)
// //                     ? updatedData.items.map(
// //                           (item: {
// //                               description?: string;
// //                               subDescription?: string;
// //                               hsn?: string;
// //                               qty?: number;
// //                               unit?: string;
// //                               rate?: number;
// //                               gstRate?: number;
// //                           }) => ({
// //                               description:
// //                                   item.description || "",

// //                               subDescription:
// //                                   item.subDescription || "",

// //                               hsnSac:
// //                                   item.hsn || "",

// //                               quantity:
// //                                   Number(item.qty || 0),

// //                               unit:
// //                                   item.unit || "PCS",

// //                               rate:
// //                                   Number(item.rate || 0),

// //                               gstRate:
// //                                   Number(item.gstRate || 18),
// //                           })
// //                       )
// //                     : [],
// //         };

// //     } else {

// //         payload = {

// //             companyName:
// //                 updatedData.companyName || "",

// //             companyEmail:
// //                 updatedData.companyEmail || "",

// //             companyPhone:
// //                 updatedData.companyPhone || "",

// //             gstNumber:
// //                 updatedData.gstNumber || "",

// //             serviceType:
// //                 updatedData.serviceType || "",

// //             systemCapacityKw:
// //                 Number(
// //                     updatedData.systemCapacityKw || 0
// //                 ),

// //             netPayableAmount:
// //                 Number(
// //                     updatedData.netPayableAmount || 0
// //                 ),

// //             status:
// //                 updatedData.status || "PENDING",

// //             items:
// //                 Array.isArray(updatedData.items)
// //                     ? updatedData.items.map(
// //                           (item: {
// //                               itemName?: string;
// //                               specification?: string;
// //                               make?: string;
// //                               qty?: string | number;
// //                           }) => ({
// //                               itemName:
// //                                   item.itemName || "",

// //                               specification:
// //                                   item.specification || "",

// //                               make:
// //                                   item.make || "",

// //                               qty:
// //                                   String(item.qty || ""),
// //                           })
// //                       )
// //                     : [],
// //         };
// //     }

// //     console.log("FINAL UPDATE PAYLOAD => ", payload);

// //     const response = await updateItemDetails(
// //         item.id,
// //         itemType,
// //         payload
// //     );

// //     toast.success("Updated Successfully");

// //     onSave(response);

// //     onClose();
// // }}

// onSubmit={async (updatedData) => {

//     // PAYMENT MODE
//     if (isPaymentMode) {

//         const paymentPayload = {

//             status: "PAID",

//             paymentStatus:
//                 updatedData.paymentType === "HALF"
//                     ? "HALF_PAID"
//                     : "PAID",

//             paidAmount:
//                 Number(updatedData.paidAmount || 0),

//             paymentType:
//                 updatedData.paymentType || "FULL",

//             advancedEnabled:
//                 updatedData.advancedEnabled || false,

//             additionalAmount:
//                 Number(updatedData.additionalAmount || 0),
//         };

//         const response =
//             await updateItemDetails(
//                 item.id,
//                 itemType,
//                 paymentPayload
//             );

//         toast.success(
//             "Payment Updated Successfully"
//         );

//         onSave(response);

//         onClose();

//         return;
//     }

//     let payload;

//     payload = {

//         companyName:
//             updatedData.fromCompanyName || "",

//         gstinNumber:
//             updatedData.fromGstin || "",

//         invoiceNumber:
//             updatedData.invoiceNumber || "",

//         invoiceDate:
//             updatedData.invoiceDate || "",

//         customerName:
//             updatedData.customerName || "",

//         customerEmail:
//             updatedData.customerEmail || "",

//         customerAddress:
//             updatedData.customerAddress || "",

//         customerContact:
//             updatedData.customerContact || "",

//         customerGstinUin:
//             updatedData.customerGstin || "",

//         recipientName:
//             updatedData.recipientName || "",

//         shippingAddress:
//             updatedData.shippingAddress || "",

//         stateCode:
//             updatedData.stateCode || "",

//         placeOfSupply:
//             updatedData.placeOfSupply || "",

//         bankName:
//             updatedData.bankName || "",

//         accountNumber:
//             updatedData.bankAccountNo || "",

//         ifscCode:
//             updatedData.bankIfsc || "",

//         termsAndConditions:
//             updatedData.termsAndConditions || "",

//         paymentStatus:
//             updatedData.status || "PENDING",

//         status:
//             updatedData.status || "PENDING",

//         netAmount:
//             updatedData.totals?.netAmount || 0,

//         cgst:
//             updatedData.totals?.cgst || 0,

//         sgst:
//             updatedData.totals?.sgst || 0,

//         grandTotalPayable:
//             updatedData.totals?.grandTotal || 0,

//         items:
//             Array.isArray(updatedData.items)
//                 ? updatedData.items.map(
//                       (item: any) => ({
//                           description:
//                               item.description || "",

//                           subDescription:
//                               item.subDescription || "",

//                           hsnSac:
//                               item.hsn || "",

//                           quantity:
//                               Number(item.qty || 0),

//                           unit:
//                               item.unit || "PCS",

//                           rate:
//                               Number(item.rate || 0),

//                           gstRate:
//                               Number(item.gstRate || 18),
//                       })
//                   )
//                 : [],
//     };

//     console.log(
//         "FINAL UPDATE PAYLOAD => ",
//         payload
//     );

//     const response =
//         await updateItemDetails(
//             item.id,
//             itemType,
//             payload
//         );

//     toast.success(
//         "Updated Successfully"
//     );

//     onSave(response);

//     onClose();
// }}

// />

// Inside EditSalesModal.tsx -> SimpleQuotationForm section

<SimpleQuotationForm
    initialData={formData}
    isEditMode={true}
    isReadOnly={isPaymentMode}
    isPaymentMode={isPaymentMode}
    onBack={onClose}
    initialCompany={formData.fromCompanyName || formData.companyName || ""}
    
    onSubmit={async (updatedData) => {
        // updatedData is the submissionData we built in Step 1 above.
        
        if (isPaymentMode) {
            // Keep your payment logic...
            const paymentPayload = {
                status: "PAID",
                paymentStatus: updatedData.paymentType === "HALF" ? "HALF_PAID" : "PAID",
                paidAmount: Number(updatedData.paidAmount || 0),
                paymentType: updatedData.paymentType || "FULL",
                advancedEnabled: updatedData.advancedEnabled || false,
                additionalAmount: Number(updatedData.additionalAmount || 0),
            };
            await updateItemDetails(item.id, itemType, paymentPayload);
            onSave(paymentPayload);
            onClose();
            return;
        }

        // --- DIRECT SEND ---
        // We send updatedData directly because the form formatted everything correctly.
        console.log("SENDING DIRECT DATA FROM FORM:", updatedData);

        try {
            const response = await updateItemDetails(
                item.id, 
                itemType, 
                updatedData // Send the object exactly as received from the form
            );

            toast.success("Updated Successfully");
            onSave(response);
            onClose();
        } catch (err: any) {
            toast.error("Failed to update amounts");
        }
    }}
/>

) : (

  <NewQuotationForm
    initialData={formData}
    isEditMode={true}
    isReadOnly={isPaymentMode}
isPaymentMode={isPaymentMode}
    onBack={onClose}

    initialCompany={
        formData.fromCompanyName ||
        formData.companyName ||
        ""
    }

// onSubmit={async (updatedData) => {
//     // PAYMENT MODE
// if (isPaymentMode) {

//     const paymentPayload = {

//         status: "PAID",

//         paymentStatus:
//             updatedData.paymentType === "HALF"
//                 ? "HALF_PAID"
//                 : "PAID",

//         paidAmount:
//             Number(updatedData.paidAmount || 0),

//         paymentType:
//             updatedData.paymentType || "FULL",

//         advancedEnabled:
//             updatedData.advancedEnabled || false,

//         additionalAmount:
//             Number(updatedData.additionalAmount || 0),
//     };

//     const response =
//         await updateItemDetails(
//             item.id,
//             itemType,
//             paymentPayload
//         );

//     toast.success(
//         "Payment Updated Successfully"
//     );

//     onSave(response);

//     onClose();

//     return;
// }

//     const payload = {

//         companyName:
//             updatedData.companyName || "",

//         companyEmail:
//             updatedData.companyEmail || "",

//         companyPhone:
//             updatedData.companyPhone || "",

//         gstNumber:
//             updatedData.gstNumber || "",

//         serviceType:
//             updatedData.serviceType || "",

//         systemCapacityKw:
//             Number(
//                 updatedData.systemCapacityKw || 0
//             ),

//         netPayableAmount:
//             Number(
//                 updatedData.netPayableAmount || 0
//             ),

//         status:
//             updatedData.status || "PENDING",

//         items:
//             Array.isArray(updatedData.items)
//                 ? updatedData.items.map(
//                       (item: {
//                           itemName?: string;
//                           specification?: string;
//                           make?: string;
//                           qty?: string | number;
//                       }) => ({
//                           itemName:
//                               item.itemName || "",

//                           specification:
//                               item.specification || "",

//                           make:
//                               item.make || "",

//                           qty:
//                               String(item.qty || ""),
//                       })
//                   )
//                 : [],
//     };

//     const response = await updateItemDetails(
//         item.id,
//         itemType,
//         payload
//     );

//     toast.success("Updated Successfully");

//     onSave(response);

//     onClose();
// }}


// Inside EditSalesModal.tsx -> renderContent() -> NewQuotationForm branch

// onSubmit={async (updatedData) => {
//     // 1. Handle Payment Mode (This part looks okay)
//     if (isPaymentMode) {
//         const paymentPayload = {
//             status: "PAID",
//             paymentStatus: updatedData.paymentType === "HALF" ? "HALF_PAID" : "PAID",
//             paidAmount: Number(updatedData.paidAmount || 0),
//             paymentType: updatedData.paymentType || "FULL",
//             advancedEnabled: updatedData.advancedEnabled || false,
//             additionalAmount: Number(updatedData.additionalAmount || 0),
//         };
//         const response = await updateItemDetails(item.id, itemType, paymentPayload);
//         toast.success("Payment Updated Successfully");
//         onSave(response);
//         onClose();
//         return;
//     }

//     // 2. Handle FULL Update (Fixing the missing fields here)
//     const payload = {
//         // Company Info
//         fromCompanyName: updatedData.fromCompanyName,
//         fromGstNumber: updatedData.fromGstNumber,
        
//         // Customer Info
//         customerName: updatedData.customerName,
//         customerEmail: updatedData.customerEmail,
//         customerPhone: updatedData.customerPhone,
//         customerType: updatedData.customerType,
        
//         // Identity / Utility Nos
//         gstNumber: updatedData.gstNumber,
//         consumerNumber: updatedData.consumerNumber,
//         BillingNumber: updatedData.BillingNumber,
//         CustomerNumber: updatedData.CustomerNumber,

//         // Service Info
//         serviceType: updatedData.serviceType,
//         onGrid: updatedData.serviceType, // Sync with your backend logic
//         phase: updatedData.phase,
//         subsidyType: updatedData.subsidyType,
//         systemCapacityKw: Number(updatedData.systemCapacityKw || 0),
//         numberOfFlats: Number(updatedData.numberOfFlats || 0),

//         // Financials
//         systemCost: Number(updatedData.systemCost || 0),
//         gstRate: Number(updatedData.gstRate || 0),
//         gstAmount: Number(updatedData.gstAmount || 0),
//         totalAmount: Number(updatedData.totalAmount || 0),
//         subsidyAmount: Number(updatedData.subsidyAmount || 0),
//         netPayableAmount: Number(updatedData.netPayable || 0),
        
//         // Misc
//         validityDays: Number(updatedData.validityDays || 0),
//         status: updatedData.status || "PENDING",

//         // Items Mapping (Ensure make1 is used for make)
//         items: Array.isArray(updatedData.items)
//             ? updatedData.items.map((it: any) => ({
//                   itemName: it.itemName || "",
//                   specification: it.specification || "",
//                     make1: item.make || item.make1 || "", 

//                 // FIX: Map 'qty' to 'quantity' (Database column name)
//                 quantity: String(item.qty || item.quantity || ""),

//                   specification1: it.specification1 || "",
//                   specification2: it.specification2 || "",
//                   specification3: it.specification3 || "",
//                   specification7: it.specification7 || "",
//                   specification8: it.specification8 || "",
//                   specification9: it.specification9 || "",
//               }))
//             : [],
//     };

//     console.log("FINAL UPDATE PAYLOAD => ", payload);

//     const response = await updateItemDetails(item.id, itemType, payload);
//     toast.success("Updated Successfully");
//     onSave(response);
//     onClose();
// }}


// Inside EditSalesModal.tsx -> NewQuotationForm branch
onSubmit={async (updatedData) => {
    // 1. Handle Payment Mode
    if (isPaymentMode) {
        const paymentPayload = {
            status: "PAID",
            paymentStatus: updatedData.paymentType === "HALF" ? "HALF_PAID" : "PAID",
            paidAmount: Number(updatedData.paidAmount || 0),
            paymentType: updatedData.paymentType || "FULL",
            advancedEnabled: updatedData.advancedEnabled || false,
            additionalAmount: Number(updatedData.additionalAmount || 0),
        };
        const response = await updateItemDetails(item.id, itemType, paymentPayload);
        onSave(response);
        onClose();
        return;
    }

    // 2. SEND DIRECT DATA FROM FORM
    // updatedData already contains the correct make1 and quantity 
    // because it comes directly from the buildUpdatePayload above.
    console.log("FINAL UPDATE PAYLOAD => ", updatedData);

    try {
        const response = await updateItemDetails(
            item.id, 
            itemType, 
            updatedData // <--- SEND EVERYTHING DIRECTLY
        );

        toast.success("Updated Successfully");
        onSave(response);
        onClose();
    } catch (err: any) {
        toast.error("Update failed");
    }
}}
  
/>

)}

        </div>
    );
};

return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

        <div className="bg-white rounded-2xl w-full max-w-7xl h-[95vh] overflow-y-auto shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 flex items-center justify-between">

                <div>

                    <h2 className="text-2xl font-bold text-slate-800">
                        Edit {itemType === "invoice"
                            ? "Invoice"
                            : "Quotation"}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        {item.customerName ||
                            item.companyName}
                    </p>

                </div>

                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-slate-100"
                >
                    <X size={22} />
                </button>

            </div>

            {/* BODY */}

            <div>
                {renderContent()}
            </div>

        </div>

    </div>
);
};

export default EditSalesModal;