import React from 'react';

interface SalesStatsProps {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
}

const StatCard: React.FC<{
    title: string;
    value: number;
    color: string;
    icon: React.ReactNode;
}> = ({ title, value, color, icon }) => (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                {/* <h3 className="text-2xl font-bold text-slate-800">{value}</h3> */}
                <h3 className="text-2xl font-bold text-slate-800">
    {value || 0}
</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);

const SalesStats: React.FC<SalesStatsProps> = ({ total, pending, accepted, rejected }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
                title="Total Quotations"
                value={total}
                color="bg-blue-50 text-blue-600"
                icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                }
            />
            <StatCard
                title="Pending Action"
                value={pending}
                color="bg-amber-50 text-amber-600"
                icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />
            <StatCard
                title="Accepted"
                value={accepted}
                color="bg-green-50 text-green-600"
                icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />
            <StatCard
                title="Rejected"
                value={rejected}
                color="bg-red-50 text-red-600"
                icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />
        </div>
    );
};

export default SalesStats;
