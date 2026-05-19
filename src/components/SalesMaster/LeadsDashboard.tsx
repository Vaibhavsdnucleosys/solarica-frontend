import React, { useState, useMemo, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    Target,
    UserPlus,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    Briefcase,
    Zap
} from 'lucide-react';
import DashboardHeader from '../DashboardHeader';
import LeadsList, { Lead } from './LeadsList';
import CreateLeadModal from './CreateLeadModal';

import * as leadService from '../../services/leadService';

interface LeadsDashboardProps {
    user: any;
}

const LeadStatsCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <div className="relative group overflow-hidden">
        <div className={`absolute -inset-1 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-[2rem] blur-xl`} />

        <div className="relative bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-100 ${color.replace('from-', 'text-').split(' ')[0]}`}>
                    <Icon size={22} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                        <ArrowUpRight size={14} className="font-bold" />
                        <span className="text-[10px] font-black">{trend}</span>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h3>
                </div>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-10 group-hover:opacity-100 transition-opacity`} />
        </div>
    </div>
);

const LeadsDashboard: React.FC<LeadsDashboardProps> = ({ user }) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filterRange, setFilterRange] = useState(1); // 1, 2, 3, or 4 months
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const data = await leadService.getLeads();
            setLeads(data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch leads:', err);
            setError('Failed to load leads. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const stats = useMemo(() => {
        const total = leads.length;
        const converted = leads.filter(l => l.status === 'converted').length;
        const pipeline = leads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
        const active = leads.filter(l => ['new', 'contacted', 'qualified'].includes(l.status)).length;

        return { total, converted, pipeline, active };
    }, [leads]);

    const filteredLeads = useMemo(() => {
        const now = new Date();
        const cutoff = new Date(now.setMonth(now.getMonth() - filterRange));

        return leads.filter(lead => {
            const matchesDate = new Date(lead.createdAt) >= cutoff;
            const matchesSearch =
                lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDate && matchesSearch;
        });
    }, [leads, filterRange, searchQuery]);

    const handleAddLead = async (newLeadData: any) => {
        try {
            await leadService.createLead(newLeadData);
            await fetchLeads();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to create lead:', err);
            alert('Failed to create lead');
        }
    };

    const handleStatusUpdate = async (id: string, status: Lead['status']) => {
        try {
            await leadService.updateLead(id, { status });
            await fetchLeads();
        } catch (err) {
            console.error('Failed to update lead status:', err);
            alert('Failed to update lead status');
        }
    };

    const handleDeleteLead = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                await leadService.deleteLead(id);
                await fetchLeads();
            } catch (err) {
                console.error('Failed to delete lead:', err);
                alert('Failed to delete lead');
            }
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-2 py-6">
            <DashboardHeader
                title="Leads Management"
                hideLogout={true}
                action={
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 group"
                            >
                                <Calendar size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                <span className="text-sm font-black text-slate-800">{filterRange} Month{filterRange > 1 ? 's' : ''} Period</span>
                            </button>

                            {isFilterOpen && (
                                <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-2xl rounded-[1.75rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden z-50 p-2 animate-in fade-in zoom-in duration-300">
                                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Analysis Window</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1">
                                        {[1, 2, 3, 4].map((range) => (
                                            <button
                                                key={range}
                                                onClick={() => {
                                                    setFilterRange(range);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between group ${filterRange === range
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span>Last {range} Month{range > 1 ? 's' : ''}</span>
                                                <ChevronRight size={14} className={filterRange === range ? 'opacity-100' : 'opacity-0'} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>



                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 font-bold flex items-center gap-2 group"
                        >
                            <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                            <span>Add a New Lead</span>
                        </button>
                    </div>
                }
                user={user}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                hideNotifications={true}
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <LeadStatsCard
                    title="Total Prospects"
                    value={stats.total}
                    icon={Users}
                    color="from-slate-600 to-slate-800"
                />
                <LeadStatsCard
                    title="Active Pipeline"
                    value={stats.active}
                    icon={Zap}
                    color="from-amber-400 to-orange-500"
                />
                <LeadStatsCard
                    title="Estimated Value"
                    value={`₹${(stats.pipeline / 100000).toFixed(1)}L`}
                    icon={TrendingUp}
                    color="from-blue-600 to-indigo-600"
                />
                <LeadStatsCard
                    title="Conversions"
                    value={stats.converted}
                    icon={Target}
                    color="from-emerald-400 to-teal-500"
                />
            </div>

            {/* Content Control Bar - Removed Search and Gen Report as requested */}
            <div className="mb-8" />

            {/* List View */}
            <div className="relative">
                {loading && (
                    <div className="absolute inset-x-0 -top-2 z-[10] h-1.5 bg-blue-50/50 backdrop-blur-sm overflow-hidden rounded-full">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-progress" style={{ width: '40%' }} />
                    </div>
                )}
                <LeadsList
                    leads={filteredLeads}
                    loading={loading}
                    onStatusUpdate={handleStatusUpdate}
                    onDelete={handleDeleteLead}
                />
            </div>

            <CreateLeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddLead}
            />


        </div>
    );
};

export default LeadsDashboard;
