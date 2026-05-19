import { Search, X, ArrowDownRight } from 'lucide-react';

interface TallyHeaderProps {
    onAction?: (action: string) => void;
    onMenuOptionClick?: (menu: string, item: string) => void;
    openCompanies?: any[];
    diskCompanies?: any[];
}

const TallyHeader = ({ onAction, onMenuOptionClick, openCompanies, diskCompanies }: TallyHeaderProps) => (
    <div className="bg-[#1b2c3c] flex flex-col shrink-0 z-50">
        <div className="h-8 flex items-center justify-between px-2 pt-1 border-b border-white/5">
            <div className="flex items-center gap-2 select-none group cursor-pointer" onClick={() => onAction?.('gateway')}>
                <span className="text-[#f7f321] text-lg font-bold italic tracking-tight">Accounting</span>
            </div>
            <div className="flex-1 max-w-xl mx-4">
                <div className="bg-white rounded-sm flex items-center px-2 h-6 w-full cursor-text hover:bg-gray-50 transition-colors">
                    <Search size={12} className="text-[#2a5585] mr-2" />
                    <span className="text-[#2a5585] text-xs font-semibold truncate flex-1">
                        Find details entered in masters and transactions. (Alt+F)
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-3 text-white/80">
                <div className="p-1 rounded cursor-pointer hover:bg-[#2c455d] transition-colors" onClick={() => onAction?.('search')}><Search size={14} /></div>
                <div className="p-1 rounded cursor-pointer hover:bg-[#2c455d] transition-colors" onClick={() => onAction?.('expand')}><ArrowDownRight size={14} /></div>
                <div className="p-1 rounded cursor-pointer hover:text-red-400 hover:bg-[#2c455d] transition-colors" onClick={() => onAction?.('quit')}><X size={14} /></div>
            </div>
        </div>
        <div className="h-8 flex items-center px-4 bg-[#1b2c3c] border-b border-white/10">
            <div className="flex items-center gap-4 text-[11px] text-white font-medium w-full overflow-x-auto no-scrollbar">
                <button onClick={() => { onAction?.('company'); onMenuOptionClick?.('Company', 'Select'); }} className="flex items-center gap-1 px-1 py-0.5 cursor-pointer hover:bg-[#2c455d] rounded transition-colors group outline-none focus:ring-1 focus:ring-yellow-400">
                    <span className="text-[#f7f321] font-bold border-b border-[#f7f321]">K</span>
                    <span className="text-white/90 group-hover:text-white">: Company</span>
                </button>
                <button onClick={() => { onAction?.('data'); onMenuOptionClick?.('Data', 'Configuration'); }} className="flex items-center gap-1 px-1 py-0.5 cursor-pointer hover:bg-[#2c455d] rounded transition-colors group outline-none focus:ring-1 focus:ring-yellow-400">
                    <span className="text-[#f7f321] font-bold border-b border-[#f7f321]">Y</span>
                    <span className="text-white/90 group-hover:text-white">: Data</span>
                </button>
                <button onClick={() => { onAction?.('exchange'); onMenuOptionClick?.('Exchange', 'Configure'); }} className="flex items-center gap-1 px-1 py-0.5 cursor-pointer hover:bg-[#2c455d] rounded transition-colors group outline-none focus:ring-1 focus:ring-yellow-400">
                    <span className="text-[#f7f321] font-bold border-b border-[#f7f321]">Z</span>
                    <span className="text-white/90 group-hover:text-white">: Exchange</span>
                </button>
                <div className="flex-1 flex justify-center">
                    <button
                        onClick={() => onAction?.('goto')}
                        className="flex items-center gap-1 px-1 py-0.5 cursor-pointer hover:bg-[#2c455d] rounded transition-colors group outline-none focus:ring-1 focus:ring-yellow-400"
                    >
                        <span className="text-[#f7f321] font-bold border-b border-[#f7f321]">G</span>
                        <span className="text-white/90 group-hover:text-white">: Go To</span>
                    </button>
                </div>
                <button onClick={() => { onAction?.('import'); onMenuOptionClick?.('Import', 'Masters'); }} className="flex items-center gap-1 px-1 py-0.5 cursor-pointer hover:bg-[#2c455d] rounded transition-colors group outline-none focus:ring-1 focus:ring-yellow-400">
                    <span className="text-[#f7f321] font-bold border-b border-[#f7f321]">O</span>
                    <span className="text-white/90 group-hover:text-white">: Import</span>
                </button>
                <button onClick={() => { onAction?.('export'); onMenuOptionClick?.('Export', 'Current'); }} className="flex items-center gap-1 px-1 py-0.5 cursor-pointer hover:bg-[#2c455d] rounded transition-colors group outline-none focus:ring-1 focus:ring-yellow-400">
                    <span className="text-[#f7f321] font-bold border-b border-[#f7f321]">E</span>
                    <span className="text-white/90 group-hover:text-white">: Export</span>
                </button>
                <button onClick={() => { onAction?.('share'); onMenuOptionClick?.('Help', 'Upgrade'); }} className="flex items-center gap-1 px-1 py-0.5 cursor-pointer hover:bg-[#2c455d] rounded transition-colors group outline-none focus:ring-1 focus:ring-yellow-400">
                    <span className="text-[#f7f321] font-bold border-b border-[#f7f321]">M</span>
                    <span className="text-white/90 group-hover:text-white">: Share</span>
                </button>
                <button onClick={() => { onAction?.('print'); onMenuOptionClick?.('Print', 'Current'); }} className="flex items-center gap-1 px-1 py-0.5 cursor-pointer hover:bg-[#2c455d] rounded transition-colors group outline-none focus:ring-1 focus:ring-yellow-400">
                    <span className="text-[#f7f321] font-bold border-b border-[#f7f321]">P</span>
                    <span className="text-white/90 group-hover:text-white">: Print</span>
                </button>
                <button onClick={() => { onAction?.('help'); onMenuOptionClick?.('Help', 'About'); }} className="flex items-center gap-1 px-1 py-0.5 cursor-pointer hover:bg-[#2c455d] rounded transition-colors group ml-2 outline-none focus:ring-1 focus:ring-yellow-400">
                    <span className="text-[#f7f321] font-bold">F1</span>
                    <span className="text-white/90 group-hover:text-white">: Help</span>
                </button>
            </div>
        </div>
    </div>
);

export default TallyHeader;
