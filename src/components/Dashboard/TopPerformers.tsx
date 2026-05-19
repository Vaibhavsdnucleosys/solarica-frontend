import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Medal } from 'lucide-react';
import { getAllQuotations } from '../../services/quotationService';

interface Performer {
    id: string;
    name: string;
    revenue: number;
    deals: number;
    role: string;
}

interface TopPerformersProps {
    selectedCompany?: string;
}

const TopPerformers: React.FC<TopPerformersProps> = ({ selectedCompany }) => {
    const [performers, setPerformers] = useState<Performer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        calculateTopPerformers();
    }, [selectedCompany]);

    const calculateTopPerformers = async () => {
        try {
            const response = await getAllQuotations();
            let quotations = Array.isArray(response) ? response : (response?.quotations || []);

            if (selectedCompany) {
                quotations = quotations.filter((q: any) => q.fromCompanyName === selectedCompany);
            }

            const acceptedQuotes = quotations.filter((q: any) => q.status === 'ACCEPTED');

            const userStats: Record<string, Performer> = {};

            acceptedQuotes.forEach((q: any) => {
                if (!q.createdBy) return; // Skip if no creator

                const userId = q.createdBy.id;
                const userName = q.createdBy.name || 'Unknown User';
                const userRole = q.createdBy.role?.name || 'Sales';

                const amount = typeof q.netPayableAmount === 'string' ? parseFloat(q.netPayableAmount) : (q.netPayableAmount || 0);

                if (!userStats[userId]) {
                    userStats[userId] = {
                        id: userId,
                        name: userName,
                        revenue: 0,
                        deals: 0,
                        role: userRole
                    };
                }

                userStats[userId].revenue += amount;
                userStats[userId].deals += 1;
            });

            // Convert to array and sort by Revenue DESC
            const sorted = Object.values(userStats).sort((a, b) => b.revenue - a.revenue);

            setPerformers(sorted.slice(0, 5)); // Top 5

        } catch (err) {
            console.error("Failed to calc top performers", err);
        } finally {
            setLoading(false);
        }
    };

    const getMedalColor = (index: number) => {
        switch (index) {
            case 0: return 'text-yellow-500 bg-yellow-50 border-yellow-100'; // Gold
            case 1: return 'text-slate-400 bg-slate-50 border-slate-200';   // Silver
            case 2: return 'text-amber-700 bg-amber-50 border-amber-100';   // Bronze
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    if (loading) return <div className="animate-pulse h-64 bg-slate-50 rounded-2xl"></div>;

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white h-full relative overflow-hidden shadow-lg shadow-indigo-500/20">
            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-white opacity-5"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-lg font-bold">Top Performers</h3>
                    <p className="text-indigo-200 text-sm">Revenue Leaders this Month</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <Trophy className="text-yellow-300" size={20} />
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {performers.map((user, index) => (
                    <div key={user.id} className="flex items-center gap-4 group">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border ${getMedalColor(index)}`}>
                            {index < 3 ? <Medal size={16} /> : <span className="text-xs">#{index + 1}</span>}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-white group-hover:text-indigo-100 transition-colors">{user.name}</span>
                                <span className="font-bold text-white tracking-tight">₹{(user.revenue / 1000).toFixed(1)}k</span>
                            </div>
                            <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-yellow-300 to-amber-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${(user.revenue / (performers[0]?.revenue || 1)) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-indigo-200 uppercase tracking-wider font-medium">
                                <span>{user.role}</span>
                                <span>{user.deals} Deals</span>
                            </div>
                        </div>
                    </div>
                ))}

                {performers.length === 0 && (
                    <div className="text-center py-8 text-indigo-200 text-sm italic">
                        No performance data yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopPerformers;
