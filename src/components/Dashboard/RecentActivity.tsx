import React, { useEffect, useState } from 'react';
import { FileText, UserPlus, Clock } from 'lucide-react';
import { getAllQuotations } from '../../services/quotationService';
import { getLeads } from '../../services/leadService';

interface ActivityItem {
    id: string;
    type: 'quotation' | 'lead';
    title: string;
    subtitle: string;
    timestamp: Date;
    user?: string;
    amount?: number;
}

interface RecentActivityProps {
    selectedCompany?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ selectedCompany }) => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivity();
    }, [selectedCompany]);

    const fetchActivity = async () => {
        try {
            const [quotesData, leadsData] = await Promise.all([
                getAllQuotations(),
                getLeads()
            ]);

            let events: ActivityItem[] = [];

            // Process Quotations
            let quotations = Array.isArray(quotesData) ? quotesData : (quotesData?.quotations || []);

            if (selectedCompany) {
                quotations = quotations.filter((q: any) => q.fromCompanyName === selectedCompany);
            }

            quotations.forEach((q: any) => {
                events.push({
                    id: `q-${q.id}`,
                    type: 'quotation',
                    title: `New Quotation for ${q.companyName}`,
                    subtitle: `Created by ${q.createdBy?.name || 'Unknown'}`,
                    timestamp: new Date(q.createdAt),
                    user: q.createdBy?.name,
                    amount: typeof q.netPayableAmount === 'string' ? parseFloat(q.netPayableAmount) : q.netPayableAmount
                });
            });

            // Process Leads
            let leads = Array.isArray(leadsData) ? leadsData : ((leadsData as any)?.data || []);

            if (selectedCompany) {
                leads = leads.filter((l: any) => l.createdBy?.worker?.company === selectedCompany);
            }

            leads.forEach((l: any) => {
                events.push({
                    id: `l-${l.id}`,
                    type: 'lead',
                    title: `New Lead: ${l.name}`,
                    subtitle: `Source: ${l.source || 'Direct'}`,
                    timestamp: new Date(l.createdAt),
                });
            });

            // Sort by newest first
            events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

            // Try to show just the top 20 items
            setActivities(events.slice(0, 20));
        } catch (err) {
            console.error("Failed to fetch activity", err);
        } finally {
            setLoading(false);
        }
    };

    const getRelativeTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    if (loading) return <div className="animate-pulse h-64 bg-slate-50 rounded-2xl"></div>;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
                    <p className="text-sm text-slate-500">Latest updates across the system</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <Clock size={16} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
                <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 before:content-[''] min-h-0">
                    {activities.map((item) => (
                        <div key={item.id} className="relative pl-10 group">
                            <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 
                  ${item.type === 'quotation' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {item.type === 'quotation' ? <FileText size={14} /> : <UserPlus size={14} />}
                            </div>

                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                    <span>{item.subtitle}</span>
                                    <span>•</span>
                                    <span>{getRelativeTime(item.timestamp)}</span>
                                </div>
                                {item.amount && (
                                    <div className="mt-1">
                                        <span className="text-[10px] font-bold bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                            ₹{item.amount.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <div className="text-center py-8 text-slate-400 text-sm">No recent activity</div>
                    )}
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e2e8f0;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

export default RecentActivity;
