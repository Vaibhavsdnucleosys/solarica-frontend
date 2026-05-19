import React, { useState } from 'react';
import { Save, Plus, Trash2, Printer, ArrowLeft, BookOpen } from 'lucide-react';
import axios from 'axios';
import CatalogItemSelector from '../Catalog/CatalogItemSelector';
import { Product } from '../../services/catalogService';

interface WorkOrderProps {
    onBack?: () => void;
    onSave?: () => void; // Callback to refresh list 
}

interface OrderItem {
    name: string;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
}

const WorkOrder: React.FC<WorkOrderProps> = ({ onBack, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerAddress: '',
        customerContact: '',
        customerGst: '',
        customerState: '',
        shipToAddress: '',
        jobId: '',
        date: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        finishedGoodName: '',
        finishedGoodQty: 0,
        additionalCost: 0,
        items: [
            { name: '', quantity: 0, unit: 'Nos', rate: 0, amount: 0 }
        ] as OrderItem[]
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto-calculate amount
        if (field === 'quantity' || field === 'rate') {
            const qty = field === 'quantity' ? parseFloat(value) || 0 : newItems[index].quantity;
            const rate = field === 'rate' ? parseFloat(value) || 0 : newItems[index].rate;
            newItems[index].amount = qty * rate;
        }

        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { name: '', quantity: 0, unit: 'Nos', rate: 0, amount: 0 }]
        }));
    };

    const handleProductSelect = (product: Product) => {
        const newItem: OrderItem = {
            name: product.model,
            quantity: 1,
            unit: 'Nos',
            rate: product.price || 0,
            amount: product.price || 0
        };

        setFormData((prev: any) => {
            // If only one empty item, replace it
            if (prev.items.length === 1 && !prev.items[0].name) {
                return { ...prev, items: [newItem] };
            }
            return { ...prev, items: [...prev.items, newItem] };
        });
        setIsCatalogOpen(false);
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const generatePDF = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // 1. Create Work Order (Save to DB)
            const createResponse = await fetch('http://localhost:5000/api/v1/work-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData) // Using formData as formattedData is not defined
            });

            if (!createResponse.ok) {
                throw new Error('Failed to create Work Order');
            }

            const createdOrder = await createResponse.json();

            // 2. Download PDF (using the ID from created order)
            const pdfResponse = await fetch(`http://localhost:5000/api/v1/work-order/${createdOrder.id}/pdf`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (pdfResponse.ok) {
                const blob = await pdfResponse.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `WorkOrder_${formData.jobId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error('Failed to download PDF');
            }

            alert('Work Order Created Successfully!');
            if (onSave) onSave();
            if (onBack) onBack();

        } catch (error) {
            console.error('Error generating Work Order', error);
            alert('Failed to generate Work Order PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-white min-h-screen p-6">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-slate-600" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">New Work Order</h1>
                            <p className="text-sm text-slate-500">Create and generate Job Work Out (Challan)</p>
                        </div>
                    </div>

                </div>

                <div className="space-y-8">
                    {/* Form Section */}
                    <div className="space-y-6">

                        {/* Customer Details */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-violet-500 rounded-full"></span>
                                Customer Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Customer Name</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Contact Number</label>
                                    <input
                                        type="text"
                                        name="customerContact"
                                        value={formData.customerContact}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Address</label>
                                    <textarea
                                        name="customerAddress"
                                        value={formData.customerAddress}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">GSTIN</label>
                                    <input
                                        type="text"
                                        name="customerGst"
                                        value={formData.customerGst}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">State</label>
                                    <input
                                        type="text"
                                        name="customerState"
                                        value={formData.customerState}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-violet-500 rounded-full"></span>
                                Order Info
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Job ID</label>
                                    <input
                                        type="text"
                                        name="jobId"
                                        value={formData.jobId}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Delivery Date</label>
                                    <input
                                        type="date"
                                        name="deliveryDate"
                                        value={formData.deliveryDate}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Ship To Address (Same as Customer if empty)</label>
                                    <textarea
                                        name="shipToAddress"
                                        value={formData.shipToAddress}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Finished Goods Info */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-violet-500 rounded-full"></span>
                                Finished Product To Make
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        name="finishedGoodName"
                                        value={formData.finishedGoodName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Total Quantity</label>
                                    <input
                                        type="number"
                                        name="finishedGoodQty"
                                        value={formData.finishedGoodQty}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Items Section - Full Width Bottom */}
                    <div className="w-full">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                                <h3 className="font-semibold text-slate-700">Raw Material List</h3>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCatalogOpen(true)}
                                        className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors flex items-center gap-1 shadow-sm"
                                    >
                                        <BookOpen size={14} /> Product Catalog
                                    </button>
                                    <button
                                        onClick={addItem}
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                                    >
                                        <Plus size={14} /> Add Item
                                    </button>
                                </div>
                            </div>

                            {/* Header Row */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <div className="col-span-4">Item Name</div>
                                <div className="col-span-2">Quantity</div>
                                <div className="col-span-2">Unit</div>
                                <div className="col-span-2">Rate</div>
                                <div className="col-span-2 text-right px-8">Amount</div>
                            </div>

                            <div className="space-y-2">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group hover:shadow-md transition-shadow">
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="absolute -right-2 -top-2 bg-red-50 text-red-500 p-1 rounded-full shadow-sm border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                            <div className="md:col-span-4">
                                                <label className="md:hidden text-[10px] text-slate-400 block mb-1">Item Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Item Name"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                                    className="w-full p-2 text-sm border border-slate-200 rounded-md focus:border-blue-500 outline-none font-medium"
                                                />
                                            </div>
                                            <div className="col-span-6 md:col-span-2">
                                                <label className="md:hidden text-[10px] text-slate-400 block mb-1">Quantity</label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                    className="w-full p-2 text-sm border border-slate-200 rounded-md focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="col-span-6 md:col-span-2">
                                                <label className="md:hidden text-[10px] text-slate-400 block mb-1">Unit</label>
                                                <select
                                                    value={item.unit}
                                                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                                    className="w-full p-2 text-sm border border-slate-200 rounded-md focus:border-blue-500 outline-none bg-white"
                                                >
                                                    <option value="Nos">Nos</option>
                                                    <option value="Mtr">Mtr</option>
                                                    <option value="Kg">Kg</option>
                                                    <option value="Set">Set</option>
                                                </select>
                                            </div>
                                            <div className="col-span-6 md:col-span-2">
                                                <label className="md:hidden text-[10px] text-slate-400 block mb-1">Rate</label>
                                                <input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                                    className="w-full p-2 text-sm border border-slate-200 rounded-md focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="col-span-6 md:col-span-2 text-right">
                                                <label className="md:hidden text-[10px] text-slate-400 block mb-1">Amount</label>
                                                <div className="w-full p-2 text-sm font-bold text-slate-700 bg-slate-50 rounded-md border border-slate-100">
                                                    ₹{item.amount.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col items-end gap-4">
                                <div className="flex justify-end items-center gap-6 w-full">
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm font-medium text-slate-500">Additional Cost</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                            <input
                                                type="number"
                                                name="additionalCost"
                                                value={formData.additionalCost || ''}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                                className="w-32 pl-7 p-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none font-semibold text-slate-700 text-right"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white px-6 py-3 rounded-lg border border-slate-200 shadow-sm flex gap-8 items-center">
                                        <span className="text-sm font-medium text-slate-500">Total Estimated Cost</span>
                                        <span className="text-xl font-bold text-blue-600">
                                            ₹{(formData.items.reduce((acc, curr) => acc + curr.amount, 0) + Number(formData.additionalCost || 0)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={generatePDF}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 font-bold"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Printer size={20} />
                                    )}
                                    <span>Generate Work Order</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <CatalogItemSelector
                isOpen={isCatalogOpen}
                onClose={() => setIsCatalogOpen(false)}
                onSelect={handleProductSelect}
            />
        </>
    );
};

export default WorkOrder;
