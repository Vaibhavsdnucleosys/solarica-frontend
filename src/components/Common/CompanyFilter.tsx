import React, { useState } from 'react';
import { Building2, ChevronDown, Check, X } from 'lucide-react';

interface CompanyFilterProps {
    onFilterChange: (company: string) => void;
    selectedCompany?: string;
}

const CompanyFilter: React.FC<CompanyFilterProps> = ({ onFilterChange, selectedCompany }) => {
    const [isOpen, setIsOpen] = useState(false);

    const companies = [
        "Solarica Energy India Pvt Ltd",
        "Solarica Systems Pvt Ltd",
        "Solarica Fabtech Pvt Ltd",
        "Solarica Industries Pvt Ltd",
        "Solarica Greenwheels Pvt Ltd"
    ];

    const handleSelect = (company: string) => {
        onFilterChange(company);
        setIsOpen(false);
    };

    const clearFilter = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFilterChange('');
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl border transition-all duration-300 group
                    ${isOpen || selectedCompany
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10'
                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}
            >
                <Building2 size={18} className={isOpen || selectedCompany ? 'text-blue-400' : 'text-slate-400'} />
                <div className="flex flex-col items-start leading-none gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Issuing Company</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[150px]">
                        {selectedCompany || 'All Companies'}
                    </span>
                </div>
                <div className="flex items-center gap-1 ml-2">
                    {selectedCompany && (
                        <div
                            onClick={clearFilter}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={12} className="text-white/60" />
                        </div>
                    )}
                    <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 mt-3 w-72 bg-white/90 backdrop-blur-2xl rounded-[1.75rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden z-[70] p-2 animate-in fade-in zoom-in duration-300 origin-top-right">
                        <div className="px-4 py-3 border-b border-slate-50 mb-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Filter by Entity</p>
                        </div>
                        <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-1">
                            {companies.map((company) => (
                                <button
                                    key={company}
                                    onClick={() => handleSelect(company)}
                                    className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black transition-all flex items-center justify-between group
                                        ${selectedCompany === company
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="truncate pr-4">{company}</span>
                                    {selectedCompany === company && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                        {selectedCompany && (
                            <div className="mt-2 pt-2 border-t border-slate-50">
                                <button
                                    onClick={() => handleSelect('')}
                                    className="w-full text-center py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 rounded-xl transition-all"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CompanyFilter;
