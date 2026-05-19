import React, {
    useEffect,
    useState
} from "react";

import toast from "react-hot-toast";

import {
    X,
    FileText,
    Loader2
} from "lucide-react";

import {
    Invoice,
    convertToTaxInvoice,
    getInvoiceById
} from "../../services/invoiceService";
import SimpleQuotationForm from "../SalesMaster/SimpleQuotationForm";
import NewQuotationForm from "../SalesMaster/NewQuotationForm";





interface Props {

    isOpen: boolean;

    onClose: () => void;

    invoice: Invoice | null;

    onSuccess: () => void;
}

const ConvertTaxInvoiceModal:
React.FC<Props> = ({

    isOpen,

    onClose,

    invoice,

    onSuccess
}) => {

    const [loading, setLoading] =
        useState(false);

    const [invoiceData, setInvoiceData] =
        useState<any>(null);

    const [loadingInvoice, setLoadingInvoice] =
        useState(false);

        const companiesForSimpleForm = [
    "Solarica Energy India Pvt Ltd",
    "Solarica Fabtech Pvt Ltd",
    "Solarica Industries Pvt Ltd"
];

const companyName =
    invoiceData?.fromCompanyName ||
    invoiceData?.companyName ||
    "";

const formType =
    companiesForSimpleForm.includes(companyName)
        ? "simple"
        : "new";

    const [taxFormData, setTaxFormData] =
        useState({

            ewayBillNumber: "",

            deliveryNote: "",

            referenceNumber: "",

            referenceDate: "",

            buyerOrderNumber: "",

            dispatchDocNumber: "",

            deliveryNoteDate: "",

            destination: "",

            termsOfDelivery: "",

            authorizedSignatory: "",

            companyPan: "",

            stateName: "",

            buyerStateName: "",

            lrNumber: "",

            vehicleNumber: "",

            reverseCharge: false,

            taxInvoiceRemarks: ""
        });

    useEffect(() => {

        if (invoice?.id) {

            loadInvoice();

        }

    }, [invoice]);

    const loadInvoice = async () => {

        try {

            setLoadingInvoice(true);

            const data =
                await getInvoiceById(
                    invoice!.id
                );

           const mappedData = {

    ...data,

    fromCompanyName:
        data.fromCompanyName ||
        data.companyName ||
        "",

    customerPhone:
        data.customerPhone ||
        data.customerContact ||
        "",

    customerContact:
        data.customerContact ||
        data.customerPhone ||
        "",

    customerGstin:
        data.customerGstin ||
        data.customerGstinUin ||
        "",

    gstNumber:
        data.gstNumber ||
        data.customerGstinUin ||
        "",

    fromGstin:
        data.fromGstin ||
        data.gstinNumber ||
        "",

    bankAccountNo:
        data.bankAccountNo ||
        data.accountNumber ||
        "",

    bankIfsc:
        data.bankIfsc ||
        data.ifscCode ||
        "",

    netPayableAmount:
        data.netPayableAmount ||
        data.grandTotalPayable ||
        0,

    items:
        data.items?.map((item: any) => ({

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
        })) || [],
};

setInvoiceData(mappedData);

            setTaxFormData((prev) => ({

                ...prev,

                destination:
                    data.shippingAddress || "",

                stateName:
                    data.stateCode || "",

                buyerStateName:
                    data.stateCode || ""

            }));

        } catch (error) {

            toast.error(
                "Failed to load invoice"
            );

        } finally {

            setLoadingInvoice(false);
        }
    };




    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement
        >
    ) => {

        const {
            name,
            value,
            type
        } = e.target;

        setTaxFormData((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value
        }));
    };

    const handleSubmit =
        async () => {

        if (!invoice) return;

        try {

            setLoading(true);

            await convertToTaxInvoice(

                invoice.id,

                {
                    ...invoiceData,
                    ...taxFormData
                }
            );

            toast.success(
                "Tax Invoice Generated Successfully"
            );

            onSuccess();

            onClose();

        } catch (error: any) {

            toast.error(

                error?.response?.data?.message ||

                "Failed to generate Tax Invoice"
            );

        } finally {

            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (

        <div className="
            fixed inset-0 z-50
            bg-black/40
            backdrop-blur-sm
            overflow-y-auto
        ">

            <div className="
                min-h-screen
                flex items-start justify-center
                p-6
            ">

                <div className="
                    bg-white
                    w-full
                    max-w-7xl
                    rounded-3xl
                    shadow-2xl
                    overflow-hidden
                ">

                    {/* HEADER */}

                    <div className="
                        flex items-center justify-between
                        px-6 py-5
                        border-b
                        sticky top-0
                        bg-white z-20
                    ">

                        <div className="
                            flex items-center gap-3
                        ">

                            <div className="
                                p-3 rounded-xl
                                bg-emerald-100
                                text-emerald-700
                            ">
                                <FileText size={24} />
                            </div>

                            <div>

                                <h2 className="
                                    text-2xl
                                    font-black
                                    text-slate-800
                                ">
                                    Convert To Tax Invoice
                                </h2>

                                <p className="
                                    text-sm text-slate-500
                                ">
                                    Review Invoice &
                                    Fill Remaining Details
                                </p>

                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="
                                p-2 rounded-lg
                                hover:bg-slate-100
                            "
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* BODY */}

                    <div className="
                        p-6
                        max-h-[85vh]
                        overflow-y-auto
                    ">

                        {
                            loadingInvoice
                            ? (

                                <div className="
                                    h-96
                                    flex items-center
                                    justify-center
                                ">

                                    <Loader2
                                        className="
                                            animate-spin
                                        "
                                        size={40}
                                    />

                                </div>

                            ) : (

                                <>
                                
                                    {/* EXISTING FORM */}

                                    {
    formType === "simple"

    ? (

        <SimpleQuotationForm
            initialData={invoiceData}
            isEditMode={true}
            isReadOnly={true}
            isTaxInvoiceMode={true}
            onSubmit={async()=>{}}
            onBack={()=>{}}
            initialCompany={
                companyName
            }
        />

    )

    : (

        <NewQuotationForm
            initialData={invoiceData}
            isEditMode={true}
            isReadOnly={true}
            isTaxInvoiceMode={true}
            onSubmit={async()=>{}}
            onBack={()=>{}}
            initialCompany={
                companyName
            }
        />

    )
}

                                    {/* TAX DETAILS */}

                                    <div className="
                                        mt-8
                                        border-t
                                        pt-8
                                    ">

                                        <h3 className="
                                            text-2xl
                                            font-black
                                            mb-6
                                        ">
                                            Tax Invoice Details
                                        </h3>

                                        <div className="
                                            grid
                                            grid-cols-1
                                            md:grid-cols-2
                                            gap-5
                                        ">

                                            <Input
                                                label="eWay Bill Number"
                                                name="ewayBillNumber"
                                                value={taxFormData.ewayBillNumber}
                                                onChange={handleChange}
                                            />

                                            <Input
                                                label="Delivery Note"
                                                name="deliveryNote"
                                                value={taxFormData.deliveryNote}
                                                onChange={handleChange}
                                            />

                                            <Input
                                                label="Reference Number"
                                                name="referenceNumber"
                                                value={taxFormData.referenceNumber}
                                                onChange={handleChange}
                                            />

                                            <Input
                                                label="Reference Date"
                                                type="date"
                                                name="referenceDate"
                                                value={taxFormData.referenceDate}
                                                onChange={handleChange}
                                            />

                                            <Input
                                                label="Buyer Order Number"
                                                name="buyerOrderNumber"
                                                value={taxFormData.buyerOrderNumber}
                                                onChange={handleChange}
                                            />

                                            <Input
                                                label="Dispatch Doc Number"
                                                name="dispatchDocNumber"
                                                value={taxFormData.dispatchDocNumber}
                                                onChange={handleChange}
                                            />

                                            <Input
                                                label="Vehicle Number"
                                                name="vehicleNumber"
                                                value={taxFormData.vehicleNumber}
                                                onChange={handleChange}
                                            />

                                            <Input
                                                label="LR Number"
                                                name="lrNumber"
                                                value={taxFormData.lrNumber}
                                                onChange={handleChange}
                                            />

                                        </div>

                                    </div>

                                </>

                            )
                        }

                    </div>

                    {/* FOOTER */}

                    <div className="
                        flex justify-end gap-3
                        px-6 py-5
                        border-t
                        bg-slate-50
                    ">

                        <button
                            onClick={onClose}
                            className="
                                px-5 py-2.5
                                rounded-xl
                                border border-slate-200
                            "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="
                                px-6 py-2.5
                                rounded-xl
                                bg-emerald-600
                                text-white
                                font-bold
                            "
                        >
                            {
                                loading
                                ? "Generating..."
                                : "Generate Tax Invoice"
                            }
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ConvertTaxInvoiceModal;

interface InputProps {

    label: string;

    name: string;

    value: any;

    onChange: any;

    type?: string;
}

const Input:
React.FC<InputProps> = ({

    label,

    name,

    value,

    onChange,

    type = "text"
}) => (

    <div>

        <label className="
            text-sm font-bold
            text-slate-700
        ">
            {label}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="
                mt-2 w-full
                border border-slate-200
                rounded-xl
                px-4 py-3
            "
        />

    </div>
);