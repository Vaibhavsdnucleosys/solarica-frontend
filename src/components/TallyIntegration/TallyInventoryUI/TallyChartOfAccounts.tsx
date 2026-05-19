import React, { useState, useEffect } from 'react';
import TallySidebar from '../TallyCommon/TallySidebar';
import TallyHeader from '../TallyGroupUI/TallyHeader';
import { TallyFooter, FooterItem, FooterEmptyItem } from '../TallyGroupUI/TallyFooter';
import { X } from 'lucide-react';
import {
    getStockGroups,
    getStockItems,
    getStockCategories,
    getUnits,
    getGodowns
} from '../../../services/inventoryService';

interface Props {
    type: 'Stock Group' | 'Stock Item' | 'Stock Category' | 'Unit' | 'Godown';
    onClose: () => void;
    onAction?: (action: string) => void;
    companyId?: string;
}

const TallyChartOfAccounts = ({ type, onClose, onAction, companyId }: Props) => {
    const [showQuitBox, setShowQuitBox] = useState(false);
    const [items, setItems] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const DEFAULT_COMPANY_ID = '07839352-87f5-4720-9426-38435d883b27';
    const effectiveCompanyId = companyId || DEFAULT_COMPANY_ID;

    const fetchItems = async () => {
        try {
            setLoading(true);
            let data: any[] = [];
            switch (type) {
                case 'Stock Group': data = await getStockGroups(effectiveCompanyId); break;
                case 'Stock Item': data = await getStockItems(effectiveCompanyId); break;
                case 'Stock Category': data = await getStockCategories(effectiveCompanyId); break;
                case 'Unit': data = await getUnits(effectiveCompanyId); break;
                case 'Godown': data = await getGodowns(effectiveCompanyId); break;
            }

            // Map to standard { id, name }
            const mapped = data.map(item => ({
                id: item.id,
                name: type === 'Unit' ? item.symbol : item.name
            }));
            setItems(mapped);
        } catch (error) {
            console.error(`Failed to fetch ${type}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [type, effectiveCompanyId]);

    const getAction = (prefix: 'create' | 'alter') => {
        const actionMap: Record<string, string> = {
            'Stock Group': `${prefix}-stock-group`,
            'Stock Item': `${prefix}-stock-item`,
            'Stock Category': `${prefix}-stock-category`,
            'Unit': `${prefix}-unit`,
            'Godown': `${prefix}-godown`
        };
        return actionMap[type] || '';
    };

    const handleDelete = async () => {
        if (!items[selectedIndex]) return;

        const item = items[selectedIndex];
        if (!window.confirm(`Are you sure you want to delete ${type} "${item.name}"?`)) return;

        try {
            const {
                deleteUnit,
                deleteGodown,
                deleteStockGroup,
                deleteStockItem,
                deleteStockCategory
            } = await import('../../../services/inventoryService');

            switch (type) {
                case 'Stock Group': await deleteStockGroup(effectiveCompanyId, item.id); break;
                case 'Stock Item': await deleteStockItem(effectiveCompanyId, item.id); break;
                case 'Stock Category': await deleteStockCategory(effectiveCompanyId, item.id); break;
                case 'Unit': await deleteUnit(effectiveCompanyId, item.id); break;
                case 'Godown': await deleteGodown(effectiveCompanyId, item.id); break;
            }
            alert(`${type} deleted successfully.`);
            fetchItems(); // Reload
        } catch (error: any) {
            alert(error.message || `Failed to delete ${type}`);
            console.error('Delete failed:', error);
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (showQuitBox) return;

            if (e.key.toLowerCase() === 'q') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    setShowQuitBox(true);
                }
            } else if (e.key.toLowerCase() === 'd') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    handleDelete();
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [showQuitBox, selectedIndex, items, handleDelete]); // Added handleDelete to dependencies

    const sidebarButtons = [
        { keyName: 'F2', label: 'Period' },
        { keyName: 'F3', label: 'Company' },
        {
            keyName: 'C',
            label: 'Create',
            onClick: () => {
                const action = getAction('create');
                if (onAction) onAction(action);
            }
        },
        { keyName: 'F4', label: '', disabled: true },
        { keyName: 'F5', label: type === 'Stock Item' ? 'Stock Item View' : '', disabled: type !== 'Stock Item' },
        { keyName: 'F6', label: '', disabled: true },
        { keyName: 'F7', label: '', disabled: true },
        { keyName: 'F8', label: '', disabled: true },
        { keyName: 'F9', label: '', disabled: true },
        { keyName: 'F10', label: 'Other Masters' },
        { keyName: '', label: 'SEPARATOR' },
        { keyName: 'B', label: 'Basis of Values' },
        { keyName: 'H', label: 'Change View' },
        { keyName: 'J', label: 'Exception Reports' },
        { keyName: 'L', label: 'Save View' },
        { keyName: '', label: 'SEPARATOR' },
        { keyName: 'F', label: 'Apply Filter' },
        { keyName: 'F', label: 'Filter Details' },
        { keyName: '', label: 'SEPARATOR' },
        { keyName: 'H', label: 'Multi-Masters' },
    ];

    const getTitle = () => {
        switch (type) {
            case 'Stock Group': return 'List of Stock Groups';
            case 'Stock Item': return 'List of Stock Items';
            case 'Stock Category': return 'List of Stock Categories';
            case 'Unit': return 'List of Units';
            case 'Godown': return 'List of Godowns';
            default: return 'Chart of Accounts';
        }
    };

    const getCountLabel = () => {
        const count = items.length;
        switch (type) {
            case 'Stock Group': return `${count} Stock Group(s)`;
            case 'Stock Item': return `${count} Stock Item(s)`;
            case 'Stock Category': return `${count} Stock Categories`;
            case 'Unit': return `${count} Unit(s)`;
            case 'Godown': return `${count} Godown(s)`;
            default: return `${count} Item(s)`;
        }
    };

    return (
        <div className="flex flex-row h-full w-full bg-white font-sans relative select-none overflow-hidden text-black">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Blue Title Bar - Now Narrower */}
                <div className="bg-[#8ec2eb] flex justify-between px-2 py-0.5 border-b border-[#5ea4d6] shrink-0">
                    <span className="font-bold text-[11px] text-black uppercase tracking-tight">Chart of Accounts</span>
                    <span className="font-bold text-[11px] text-black absolute left-1/2 transform -translate-x-1/2 underline decoration-1 underline-offset-2 uppercase tracking-wider">Solarica</span>
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="text-black hover:bg-black/10 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                    {/* Secondary Header - Now Narrower */}
                    <div className="flex justify-between px-4 py-1 border-b border-gray-100 shrink-0">
                        <span className="font-bold text-[14px] text-black">{getTitle()}</span>
                        <span className="font-bold text-[13px] text-black">For 1-Apr-25</span>
                    </div>

                    {/* List Area */}
                    <div className="flex-1 overflow-y-auto p-0 flex flex-col bg-white">
                        {loading ? (
                            <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm">
                                Loading...
                            </div>
                        ) : items.length > 0 ? (
                            items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`px-4 py-0.5 font-bold text-[13px] cursor-pointer w-full ${idx === selectedIndex ? 'bg-[#feba35] text-black' : 'hover:bg-[#dceef5]'}`}
                                    onClick={() => setSelectedIndex(idx)}
                                >
                                    {item.name}
                                </div>
                            ))
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm">
                                {"< No items created yet >"}
                            </div>
                        )}
                    </div>

                    {/* Footer Component */}
                    <TallyFooter countInfo={getCountLabel()}>
                        <FooterItem keyName="Q" label="Quit" onClick={() => setShowQuitBox(true)} />
                        <FooterItem keyName="Enter" label="Alter" onClick={() => {
                            const action = getAction('alter');
                            if (onAction && action) onAction(action);
                        }} />
                        <FooterItem keyName="Space" label="Select" />
                        <FooterEmptyItem />
                        <FooterItem keyName="C" label="Create Master" onClick={() => {
                            const action = getAction('create');
                            if (onAction && action) onAction(action);
                        }} />
                        <FooterEmptyItem />
                        <FooterItem keyName="D" label="Delete" onClick={handleDelete} />
                        <FooterEmptyItem />
                        <FooterEmptyItem />
                        <FooterItem keyName="R" label="Remove Line" />
                        <FooterItem keyName="U" label="Restore Line" />
                        <FooterItem keyName="F12" label="Configure" />
                    </TallyFooter>
                </div>
            </div>

            {/* Sidebar - Now Full Height */}
            <TallySidebar buttons={sidebarButtons} />

            {/* Quit Confirmation Dialog */}
            {showQuitBox && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] bg-white border border-[#2a5585] shadow-2xl p-4 w-[180px] h-[110px] flex flex-col items-center justify-between">
                    <button className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-gray-400 hover:text-red-500 font-bold text-[12px]" onClick={() => setShowQuitBox(false)}>✕</button>
                    <div className="text-[15px] text-black font-bold mt-2">Quit ?</div>
                    <div className="flex gap-6 text-[15px] font-bold text-[#2a5585] mb-2 outline-none focus:ring-1 focus:ring-blue-400" tabIndex={0} autoFocus
                        onKeyDown={(e) => {
                            if (e.key.toLowerCase() === 'y' || e.key === 'Enter') onClose();
                            if (e.key.toLowerCase() === 'n' || e.key === 'Escape') setShowQuitBox(false);
                        }}
                    >
                        <span className="cursor-pointer hover:underline" onClick={onClose}>Yes</span>
                        <span className="cursor-pointer hover:underline" onClick={() => setShowQuitBox(false)}>No</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TallyChartOfAccounts;
