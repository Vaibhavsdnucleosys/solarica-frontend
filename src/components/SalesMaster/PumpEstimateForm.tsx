import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

interface PumpEstimateFormProps {
  onBack: () => void;
  onSubmit: (data: PumpEstimateData) => void;
  initialCompany: string;
}

interface PumpEstimateData {
  customerName: string;
  officerName: string;
  contact: string;
  systemCapacity: string;
  date: string;
  items: PumpItem[];
  totalAmount: number;
  category: string;
  fromCompanyName: string;
}

interface PumpItem {
  id: number;
  description: string;
  amount: number;
}

const PumpEstimateForm: React.FC<PumpEstimateFormProps> = ({
  onBack,
  onSubmit,
  initialCompany,
}) => {
  const [formData, setFormData] = useState({
    customerName: "",
    officerName: "Mr. Kiran Jagtap",
    contact: "9325389168",
    systemCapacity: "5 HP Solar Water Pump System",
    date: new Date().toISOString().split("T")[0],
    fromCompanyName: initialCompany,
  });

  const [items, setItems] = useState<PumpItem[]>([
    { id: 1, description: "Solar Pump Controller", amount: 50000 },
    { id: 2, description: "Solar Panels", amount: 120000 },
  ]);

  // 🔹 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle item change
  const handleItemChange = (
    id: number,
    field: keyof PumpItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // 🔹 Add item
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: "", amount: 0 },
    ]);
  };

  // 🔹 Remove item
  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  // 🔹 Total calculation
  const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  // 🔹 Submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: PumpEstimateData = {
      ...formData,
      items,
      totalAmount: total,
      category: "PUMP",
    };

    onSubmit(payload);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <div className="flex items-center gap-4 p-6 border-b">
        <button onClick={onBack}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Pump Estimate</h1>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* CUSTOMER DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
            className="border p-3 rounded-lg"
            required
          />

          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
            className="border p-3 rounded-lg"
          />

          <input
            name="systemCapacity"
            value={formData.systemCapacity}
            onChange={handleChange}
            placeholder="System Capacity"
            className="border p-3 rounded-lg"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
        </div>

        {/* ITEMS */}
        <div className="border rounded-xl p-4">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold">Pump Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-blue-600"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div key={item.id} className="flex gap-3 mb-3 items-center">
              <span>{index + 1}</span>

              <input
                value={item.description}
                onChange={(e) =>
                  handleItemChange(item.id, "description", e.target.value)
                }
                placeholder="Description"
                className="border p-2 rounded w-full"
              />

              <input
                type="number"
                value={item.amount}
                onChange={(e) =>
                  handleItemChange(
                    item.id,
                    "amount",
                    Number(e.target.value)
                  )
                }
                placeholder="Amount"
                className="border p-2 rounded w-32"
              />

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="text-right font-bold text-lg">
          Total: ₹ {total.toLocaleString("en-IN")}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl flex justify-center items-center gap-2"
        >
          <Save size={18} />
          Save Pump Estimate
        </button>
      </form>
    </div>
  );
};

export default PumpEstimateForm;