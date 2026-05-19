import React from 'react';

interface CompanyHeaderProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ activeTab, onTabChange }) => {
    const companies = [
        "Solarica Energy India Pvt Ltd",
        "Solarica Systems Pvt Ltd",
        "Solarica Fabtech Pvt Ltd",
        "Solarica Industries Pvt Ltd",
        "Solarica Greenwheels Pvt Ltd"
    ];

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Welcome to Solarica Group of Companies</h1>

            <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-none">
                {companies.map((company) => (
                    <button
                        key={company}
                        onClick={() => onTabChange(company)}
                        className={`
              whitespace-nowrap px-3 py-2 rounded-full text-xs font-bold transition-all border flex-shrink-0
              ${activeTab === company
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                            }
            `}
                    >
                        {company}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CompanyHeader;
