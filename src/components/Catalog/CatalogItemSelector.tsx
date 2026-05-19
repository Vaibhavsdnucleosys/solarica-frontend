import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Search, Package, Zap, Sun, Lightbulb, Camera, Droplets } from 'lucide-react';
import { getCatalog, CatalogData, Product } from '../../services/catalogService';

interface CatalogItemSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (product: Product) => void;
}

const CATEGORIES = [
    { id: 'solarHeaters', label: 'Solar Heaters', icon: Sun },
    { id: 'solarPanels', label: 'Solar Panels', icon: Zap },
    { id: 'solarInverters', label: 'Solar Inverters', icon: Package },
    { id: 'decorativeLights', label: 'Decorative Lights', icon: Lightbulb },
    { id: 'solarCameras', label: 'Solar Cameras', icon: Camera },
    { id: 'solarPumpDc', label: 'DC Solar Pumps', icon: Droplets },
    { id: 'solarAcPumpController', label: 'AC Pump Controllers', icon: Zap },
    { id: 'solarStreetLightAllInOne', label: 'All-in-One Street Lights', icon: Sun },
];

const CatalogItemSelector: React.FC<CatalogItemSelectorProps> = ({ isOpen, onClose, onSelect }) => {
    const [activeCategory, setActiveCategory] = useState<string>('solarHeaters');
    const [catalogData, setCatalogData] = useState<CatalogData | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen && !catalogData) {
            fetchCatalog();
        }
    }, [isOpen]);

    const fetchCatalog = async () => {
        try {
            setLoading(true);
            const data = await getCatalog();
            console.log("Catalog Data Loaded:", data);
            setCatalogData(data);
        } catch (error) {
            console.error("Failed to fetch catalog", error);
        } finally {
            setLoading(false);
        }
    };

    const normalizeProduct = (p: any) => {
        switch (activeCategory) {
            case 'solarHeaters':
                return {
                    id: p.id,
                    model: p.particular,
                    description: `100% Genuine Solar Heater with ${p.gst}% GST included.`,
                    hsnSac: p.hsnSac || '8419',
                    price: p.totalAmount
                };
            case 'solarPanels':
                const rateVal = parseFloat(p.rateRange?.split('to')[0]?.replace(/[^0-9.]/g, '')) || 0;
                const wattVal = parseFloat(p.wattRange?.replace(/[^0-9.]/g, '')) || 0;
                return {
                    id: p.id,
                    model: p.brand, // Only brand name
                    description: `Rate: ${p.rateRange}`,
                    hsnSac: p.hsnSac || '8541',
                    price: rateVal,
                    watt: wattVal,
                    type: p.type || 'N/A', // DCR or NON-DCR
                    isSolarPanel: true
                };
            case 'solarInverters':
                return {
                    id: p.id,
                    model: `${p.capacityKw}KW ${p.phase}`,
                    description: `High Efficiency ${p.phase} Inverter`,
                    hsnSac: p.hsnSac || '8504',
                    price: p.dealerPrice
                };
            case 'decorativeLights':
            case 'solarCameras':
                return {
                    id: p.id,
                    model: p.particular,
                    description: `Premium quality ${activeCategory === 'solarCameras' ? 'Surveillance' : 'Lighting'} solution.`,
                    hsnSac: p.hsnSac || (activeCategory === 'solarCameras' ? '8525' : '9405'),
                    price: p.totalAmount || p.totalPrice
                };
            case 'solarPumpDc':
                return {
                    id: p.id,
                    model: `${p.solarPumpSet} DC Pump`,
                    description: `Head: ${p.totalDutyHead}, Flow: ${p.waterFlow}, PV: ${p.pvArray}`,
                    hsnSac: p.hsnSac || '8413',
                    price: p.sellingPriceGstExtra
                };
            case 'solarAcPumpController':
                return {
                    id: p.id,
                    model: p.solarPumpController,
                    description: `PV Req: ${p.panelWattageRequired}, Panels: ${p.noOfPanelsRequired}`,
                    hsnSac: p.hsnSac || '8537',
                    price: p.sellingPrice
                };
            case 'solarStreetLightAllInOne':
                return {
                    id: p.id,
                    model: `${p.brand} All-in-One`,
                    description: p.description,
                    hsnSac: p.hsnSac || '9405',
                    price: p.totalAmount
                };
            default:
                return p;
        }
    };

    const getActiveProducts = () => {
        if (!catalogData) {
            console.log("No catalogData yet");
            return [];
        }

        // Handle cases where data might be nested inside another 'data' property
        const actualData = (catalogData as any).data || catalogData;
        const products = actualData[activeCategory] || [];

        console.log(`Products for category ${activeCategory}:`, products);

        const normalized = products.map(normalizeProduct);

        if (!searchTerm) return normalized;
        return normalized.filter((p: any) =>
            p.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-[95vw] max-w-none h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-black text-slate-800 tracking-tight">Product Catalog</h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Select a product to add to the invoice</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Categories */}
                    <div className="w-80 bg-slate-50 border-r border-slate-100 p-4 flex flex-col gap-2 overflow-y-auto">
                        <div className="mb-4 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.id;
                            const actualData = catalogData ? ((catalogData as any).data || catalogData) : null;
                            const count = actualData ? (actualData as any)[cat.id]?.length || 0 : 0;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-white text-slate-600 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} className={isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-blue-600'} />
                                        <span className="font-semibold text-sm">{cat.label}</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isActive ? 'bg-blue-500/30 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                                <p className="font-medium animate-pulse">Loading catalog...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {getActiveProducts().map((product: Product) => (
                                    <div
                                        key={product.id || product.model}
                                        onClick={() => {
                                            onSelect(product);
                                            onClose();
                                        }}
                                        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all cursor-pointer group flex flex-col h-full"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex gap-2">
                                                <div className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                    {product.hsnSac}
                                                </div>
                                                {product.isSolarPanel && product.type && (
                                                    <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${product.type === 'DCR'
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                                        }`}>
                                                        {product.type}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-bold text-lg text-slate-800">
                                                ₹{product.price.toLocaleString('en-IN')}
                                                {product.isSolarPanel && <span className="text-[10px] ml-1 text-slate-400 font-medium uppercase tracking-tight">/ Watt</span>}
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{product.model}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="pt-3 border-t border-slate-50">
                                            <button className="w-full py-2 bg-slate-50 text-slate-600 font-semibold rounded-xl text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                Select Product
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {getActiveProducts().length === 0 && (
                                    <div className="col-span-full py-20 text-center text-slate-400">
                                        <Package size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="font-medium">No products found in this category</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CatalogItemSelector;
