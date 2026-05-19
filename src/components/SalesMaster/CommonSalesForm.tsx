
import React, { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface CommonSalesFormProps {
  type: "invoice" | "quotation";
  mode: "create" | "edit";
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onClose?: () => void;
}

const CommonSalesForm: React.FC<CommonSalesFormProps> = ({
  type,
  mode,
  initialData,
  onSubmit,
  onClose,
}) => {
  const companiesForSimpleForm = [
    "Solarica Energy India Pvt Ltd",
    "Solarica Fabtech Pvt Ltd",
    "Solarica Industries Pvt Ltd",
  ];

  const defaultFormData = {
    companyName: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    gstNumber: "",
    systemCapacityKw: 1,
    serviceType: "",
    netPayableAmount: 0,
    status: "PENDING",
    fromCompanyName: "",
    invoiceDate: "",
    items: [],
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        ...defaultFormData,
        ...initialData,
        customerName:
          initialData.customerName ||
          initialData.companyName ||
          "",
        items: initialData.items || [],
      });
    }
  }, [initialData, mode]);

  const companyName =
    formData?.fromCompanyName ||
    formData?.companyName;

  const formType = companiesForSimpleForm.includes(companyName)
    ? "simple"
    : "advanced";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: any
  ) => {
   const updatedItems: any[] = [...formData.items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setFormData((prev: any) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    if (formType === "simple") {
      setFormData((prev: any) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            description: "",
            hsn: "",
            quantity: 1,
            rate: 0,
            unit: "PCS",
          },
        ],
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            itemName: "",
            specification: "",
            make: "",
            qty: "",
          },
        ],
      }));
    }
  };

  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter(
      (_: any, i: number) => i !== index
    );

    setFormData((prev: any) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await onSubmit(formData);

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* CUSTOMER DETAILS */}

      <section className="bg-white p-6 rounded-xl border">
        <h2 className="text-xl font-bold mb-5">
          Customer Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="font-semibold">
              Customer Name
            </label>

            <input
              type="text"
              name="customerName"
              value={formData.customerName || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="font-semibold">
              Customer Phone
            </label>

            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="font-semibold">
              Customer Email
            </label>

            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="font-semibold">
              GST Number
            </label>

            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold">
              Address
            </label>

            <textarea
              name="customerAddress"
              value={formData.customerAddress || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>
      </section>

      {/* ADVANCED FORM */}

      {formType === "advanced" && (
        <section className="bg-white p-6 rounded-xl border">

          <h2 className="text-xl font-bold mb-5">
            Quotation Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div>
              <label className="font-semibold">
                Service Type
              </label>

              <input
                type="text"
                name="serviceType"
                value={formData.serviceType || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="font-semibold">
                System Capacity
              </label>

              <input
                type="number"
                name="systemCapacityKw"
                value={formData.systemCapacityKw || 0}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="font-semibold">
                Net Payable Amount
              </label>

              <input
                type="number"
                name="netPayableAmount"
                value={formData.netPayableAmount || 0}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>
        </section>
      )}

      {/* ITEMS */}

      <section className="bg-white p-6 rounded-xl border">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">
            Items
          </h2>

          <button
            type="button"
            onClick={addItem}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>

        <div className="space-y-4">

          {formData.items?.map((item: any, index: number) => (

            <div
              key={index}
              className="border rounded-xl p-4"
            >

              {formType === "simple" ? (

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description || ""}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    className="border rounded-lg p-3"
                  />

                  <input
                    type="text"
                    placeholder="HSN"
                    value={item.hsn || ""}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "hsn",
                        e.target.value
                      )
                    }
                    className="border rounded-lg p-3"
                  />

                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity || 0}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                    className="border rounded-lg p-3"
                  />

                  <input
                    type="number"
                    placeholder="Rate"
                    value={item.rate || 0}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "rate",
                        e.target.value
                      )
                    }
                    className="border rounded-lg p-3"
                  />

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="bg-red-500 text-white rounded-lg flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                  <input
                    type="text"
                    placeholder="Item Name"
                    value={item.itemName || ""}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "itemName",
                        e.target.value
                      )
                    }
                    className="border rounded-lg p-3"
                  />

                  <input
                    type="text"
                    placeholder="Specification"
                    value={item.specification || ""}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "specification",
                        e.target.value
                      )
                    }
                    className="border rounded-lg p-3"
                  />

                  <input
                    type="text"
                    placeholder="Make"
                    value={item.make || ""}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "make",
                        e.target.value
                      )
                    }
                    className="border rounded-lg p-3"
                  />

                  <input
                    type="text"
                    placeholder="Qty"
                    value={item.qty || ""}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "qty",
                        e.target.value
                      )
                    }
                    className="border rounded-lg p-3"
                  />

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="bg-red-500 text-white rounded-lg flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              )}

            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}

      <div className="flex justify-end gap-3">

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="border px-5 py-3 rounded-lg"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          {loading && (
            <Loader2 className="animate-spin" size={18} />
          )}

          {mode === "edit"
            ? "Update"
            : "Create"}
        </button>
      </div>
    </div>
  );
};

export default CommonSalesForm;

