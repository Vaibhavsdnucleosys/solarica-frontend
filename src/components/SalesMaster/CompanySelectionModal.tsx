import React from 'react';
import ReactDOM from 'react-dom';
import { X, Building2, ChevronRight } from 'lucide-react';

interface CompanySelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (company: string) => void;
    // Optional: Only show specific companies
    allowedCompanies?: string[];
}

const CompanySelectionModal: React.FC<CompanySelectionModalProps> = ({ isOpen, onClose, onSelect, allowedCompanies }) => {
    if (!isOpen) return null;

    const allCompanies = [
        "Solarica Energy India Pvt Ltd",
        "Solarica Systems Pvt Ltd",
        "Solarica Fabtech Pvt Ltd",
        "Solarica Industries Pvt Ltd",
        "Solarica Greenwheels Pvt Ltd"
    ];

    const companies = allowedCompanies
        ? allCompanies.filter(c => allowedCompanies.includes(c))
        : allCompanies;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center p-8 border-b border-slate-50">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Select Issuing Company</h3>
                        <p className="text-sm text-slate-400 font-medium">Choose a company to generate the quotation from</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {companies.map((company, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(company)}
                            className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-600 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl text-blue-600 group-hover:text-blue-600 shadow-sm transition-colors">
                                    <Building2 size={24} />
                                </div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-white transition-colors">{company}</span>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CompanySelectionModal;
