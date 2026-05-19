// import React from 'react';
// import {
//     MoreHorizontal,
//     Building2,
//     Mail,
//     Phone,
//     Globe,
//     Calendar,
//     ChevronRight,
//     Trash2,
//     UserCircle2,
//     CheckCircle2,
//     Clock,
//     XCircle,
//     UserMinus,
//     TrendingUp,
//     Pencil
// } from 'lucide-react';
// import EditLeadModal from './EditLeadModal';
// // export interface Lead {
// //     id: string;
// //     name: string;
// //     company?: string;
// //     email: string;
// //     phone?: string;
// //     source?: string;
// //     status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
// //     estimatedValue?: number;
// //     notes?: string;
// //     createdAt: string;
// //     updatedAt: string;
// // }

// export interface Lead {
//     id: string;
//     name: string;
//     company?: string;
//     email: string;
//     phone?: string;
//     source?: string;
//     status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
//     estimatedValue?: number;
//     notes?: string;
//     createdAt: string;
//     updatedAt: string;

//     assignedToId?: string;
// }

// interface LeadsListProps {
//     leads: Lead[];
//     onStatusUpdate: (id: string, status: Lead['status']) => void;
//     onDelete: (id: string) => void;
//     loading?: boolean;
// }

// const LeadsList: React.FC<LeadsListProps> = ({ leads, onStatusUpdate, onDelete, loading }) => {

//   const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
//     const [selectedLead, setSelectedLead] = React.useState<any>(null);

//     const getStatusTheme = (status: Lead['status']) => {
//         switch (status) {
//             case 'converted': return {
//                 icon: <CheckCircle2 size={14} />,
//                 gradient: 'from-emerald-400 to-teal-500',
//                 glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
//                 light: 'bg-emerald-50/50',
//                 text: 'text-emerald-600'
//             };
//             case 'lost': return {
//                 icon: <XCircle size={14} />,
//                 gradient: 'from-rose-400 to-red-500',
//                 glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
//                 light: 'bg-rose-50/50',
//                 text: 'text-rose-600'
//             };
//             case 'qualified': return {
//                 icon: <TrendingUp size={14} />,
//                 gradient: 'from-blue-400 to-indigo-500',
//                 glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
//                 light: 'bg-blue-50/50',
//                 text: 'text-blue-600'
//             };
//             case 'contacted': return {
//                 icon: <Clock size={14} />,
//                 gradient: 'from-amber-400 to-orange-500',
//                 glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
//                 light: 'bg-amber-50/50',
//                 text: 'text-amber-600'
//             };
//             default: return {
//                 icon: <UserCircle2 size={14} />,
//                 gradient: 'from-slate-400 to-slate-500',
//                 glow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]',
//                 light: 'bg-slate-50/50',
//                 text: 'text-slate-600'
//             };
//         }
//     };

// const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

// const filteredLeads =
//     currentUser?.role?.name?.toLowerCase() === "admin"
//         ? leads
//         : leads.filter(
//               (lead: any) => lead.assignedToId === currentUser.id
//           );

//     if (loading) {
//         return (
//             <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
//                 <div className="overflow-x-auto no-scrollbar">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="bg-slate-50/50 border-b border-slate-100">
//                                 {['Customer / Lead', 'Contact Details', 'Estimated Value', 'Source', 'Added Date', 'Pipeline Status', 'Actions'].map(h => (
//                                     <th key={h} className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-50">
//                             {Array.from({ length: 6 }).map((_, i) => (
//                                 <tr key={i} className="animate-pulse">
//                                     <td className="py-4 px-6">
//                                         <div className="flex items-center gap-3">
//                                             <div className="w-9 h-9 bg-slate-100 rounded-xl shrink-0" />
//                                             <div><div className="h-3 bg-slate-100 rounded-full w-24 mb-1.5" /><div className="h-2.5 bg-slate-100 rounded-full w-16" /></div>
//                                         </div>
//                                     </td>
//                                     <td className="py-4 px-6"><div className="h-3 bg-slate-100 rounded-full w-32 mb-1.5" /><div className="h-2.5 bg-slate-100 rounded-full w-20" /></td>
//                                     <td className="py-4 px-6"><div className="h-3 bg-slate-100 rounded-full w-16" /></td>
//                                     <td className="py-4 px-6"><div className="h-6 bg-slate-100 rounded-lg w-20" /></td>
//                                     <td className="py-4 px-6"><div className="h-3 bg-slate-100 rounded-full w-20 mb-1.5" /><div className="h-2.5 bg-slate-100 rounded-full w-12" /></td>
//                                     <td className="py-4 px-6"><div className="h-6 bg-slate-100 rounded-full w-20 mx-auto" /></td>
//                                     <td className="py-4 px-6"><div className="h-8 bg-slate-100 rounded-xl w-8 mx-auto" /></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         );
//     }

//     if (filteredLeads.length === 0) {
//         return (
//             <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-24 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center flex flex-col items-center">
//                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 relative">
//                     <UserMinus size={48} className="text-slate-200" />
//                 </div>
//                 <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">No Leads Found</h3>
//                 <p className="text-slate-400 max-w-xs font-medium leading-relaxed">
//                     Time to hunt! Start adding new leads to your pipeline and grow your sales.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-fit">
//             <div className="overflow-x-auto no-scrollbar">
//                 <table className="w-full text-left border-collapse">
//                     <thead>
//                         <tr className="bg-slate-50/50 border-b border-slate-100">
//                             <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer / Lead</th>
//                             <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact Details</th>
//                             <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estimated Value</th>
//                             <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Source</th>
//                             <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Added Date</th>
//                             <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Pipeline Status</th>
//                             <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-50">
//                         {filteredLeads.map((lead) => {
//                             const theme = getStatusTheme(lead.status);
//                             return (
//                                 <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
//                                     <td className="py-4 px-6">
//                                         <div className="flex items-center gap-3">
//                                             <div className={`p-2.5 rounded-xl ${theme.light} ${theme.text} shadow-sm shrink-0`}>
//                                                 <UserCircle2 size={18} />
//                                             </div>
//                                             <div className="flex flex-col gap-0.5">
//                                                 <span className="text-sm font-black text-slate-800 tracking-tight">{lead.name}</span>
//                                                 <div className="flex items-center gap-1.5">
//                                                     <Building2 size={10} className="text-slate-400" />
//                                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lead.company || 'Private Lead'}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="py-4 px-6">
//                                         <div className="flex flex-col gap-1">
//                                             <div className="flex items-center gap-2">
//                                                 <div className="w-5 h-5 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
//                                                     <Mail size={10} />
//                                                 </div>
//                                                 <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{lead.email}</span>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <div className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
//                                                     <Phone size={10} />
//                                                 </div>
//                                                 <span className="text-xs font-bold text-slate-600">{lead.phone || 'N/A'}</span>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="py-4 px-6">
//                                         <div className="flex items-baseline gap-1">
//                                             <span className="text-[10px] font-bold text-slate-400">₹</span>
//                                             <span className="text-sm font-black text-slate-900 tracking-tight">
//                                                 {(lead.estimatedValue || 0).toLocaleString('en-IN')}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className="py-4 px-6">
//                                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100">
//                                             <Globe size={10} className="text-slate-400" />
//                                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">{lead.source}</span>
//                                         </div>
//                                     </td>
//                                     <td className="py-4 px-6">
//                                         <div className="flex flex-col gap-0.5">
//                                             <span className="text-xs font-bold text-slate-700">
//                                                 {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
//                                             </span>
//                                             <span className="text-[10px] font-bold text-slate-400">
//                                                 {new Date(lead.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className="py-4 px-6">
//                                         <div className="flex justify-center">
//                                             <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border border-transparent bg-white shadow-sm transition-all duration-300 hover:${theme.glow} group/status`}>
//                                                 <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${theme.gradient} animate-pulse`} />
//                                                 <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${theme.text}`}>
//                                                     {lead.status}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="py-4 px-6">
//                                         <div className="flex justify-center">
//                                             <div className="relative group/actions">
//                                                 <button className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-all group-hover/actions:rotate-90">
//                                                     <MoreHorizontal size={16} />
//                                                 </button>

                                                      
                                                
//                                                         <button
//                                                             onClick={() => {
//                                                                 setSelectedLead(lead);
//                                                                 setIsEditModalOpen(true);
//                                                             }}
//                                                             className="w-full text-left px-4 py-2.5 text-[11px] font-black text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex items-center justify-between group/edit"
//                                                         >
//                                                             <span>Edit Details</span>
//                                                             <Pencil size={12} />
//                                                         </button>


//                                                 <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-50 p-2 z-50 opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all duration-300 translate-y-2 group-hover/actions:translate-y-0 origin-top-right">
//                                                     <div className="px-4 py-2 mb-1">
//                                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Pipeline</p>
//                                                     </div>
//                                                     <div className="space-y-0.5">
//                                                         {['contacted', 'qualified', 'converted', 'lost'].map(status => (
//                                                             <button
//                                                                 key={status}
//                                                                 onClick={() => onStatusUpdate(lead.id, status as Lead['status'])}
//                                                                 className="w-full text-left px-4 py-2.5 text-[11px] font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all flex items-center justify-between group/item"
//                                                             >
//                                                                 <span className="capitalize">{status}</span>
//                                                                 <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all" />
//                                                             </button>
//                                                         ))}
//                                                         <div className="h-px bg-slate-50 my-1.5 mx-2" />
//                                                         <button
//                                                             onClick={() => onDelete(lead.id)}
//                                                             className="w-full text-left px-4 py-2.5 text-[11px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-all flex items-center justify-between group/red"
//                                                         >
//                                                             <span>Remove Lead</span>
//                                                             <Trash2 size={12} className="opacity-60 group-hover/red:opacity-100" />
//                                                         </button>
//                                                     </div>

//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="py-4 px-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
//                 <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
//                     Total Prospects: <span className="text-blue-600 ml-1">{filteredLeads.length}</span>
//                 </p>
//                 {/* <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
//                     Pipeline view updated just now
//                 </p> */}
//             </div>
//                <EditLeadModal 
//                 isOpen={isEditModalOpen}
//                 lead={selectedLead}
//                 onClose={() => {
//                     setIsEditModalOpen(false);
//                     setSelectedLead(null);
//                 }}
//                 onSuccess={() => {
//                     // Logic to refresh data (usually calling window.location.reload() 
//                     // or a passed refresh function from props)
//                     window.location.reload(); 
//                 }}
//             />
//         </div>
//     );
// };

// export default LeadsList;

import React from 'react';
import {
    MoreHorizontal,
    Building2,
    Mail,
    Phone,
    Globe,
    Calendar,
    ChevronRight,
    Trash2,
    UserCircle2,
    CheckCircle2,
    Clock,
    XCircle,
    UserMinus,
    TrendingUp,
    Pencil
} from 'lucide-react';
import EditLeadModal from './EditLeadModal';

export interface Lead {
    id: string;
    name: string;
    company?: string;
    email: string;
    phone?: string;
    source?: string;
    status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
    estimatedValue?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    assignedToId?: string;
}

interface LeadsListProps {
    leads: Lead[];
    onStatusUpdate: (id: string, status: Lead['status']) => void;
    onDelete: (id: string) => void;
    loading?: boolean;
}

const LeadsList: React.FC<LeadsListProps> = ({ leads, onStatusUpdate, onDelete, loading }) => {
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [selectedLead, setSelectedLead] = React.useState<any>(null);

    // 1. Get User and Check Role
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = currentUser?.role?.name?.toLowerCase() === "admin";

    const getStatusTheme = (status: Lead['status']) => {
        switch (status) {
            case 'converted': return {
                icon: <CheckCircle2 size={14} />,
                gradient: 'from-emerald-400 to-teal-500',
                glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
                light: 'bg-emerald-50/50',
                text: 'text-emerald-600'
            };
            case 'lost': return {
                icon: <XCircle size={14} />,
                gradient: 'from-rose-400 to-red-500',
                glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
                light: 'bg-rose-50/50',
                text: 'text-rose-600'
            };
            case 'qualified': return {
                icon: <TrendingUp size={14} />,
                gradient: 'from-blue-400 to-indigo-500',
                glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
                light: 'bg-blue-50/50',
                text: 'text-blue-600'
            };
            case 'contacted': return {
                icon: <Clock size={14} />,
                gradient: 'from-amber-400 to-orange-500',
                glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
                light: 'bg-amber-50/50',
                text: 'text-amber-600'
            };
            default: return {
                icon: <UserCircle2 size={14} />,
                gradient: 'from-slate-400 to-slate-500',
                glow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]',
                light: 'bg-slate-50/50',
                text: 'text-slate-600'
            };
        }
    };

    const filteredLeads = isAdmin
        ? leads
        : leads.filter((lead: any) => lead.assignedToId === currentUser.id);

    if (loading) {
        return (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                {['Customer / Lead', 'Contact Details', 'Estimated Value', 'Source', 'Added Date', 'Pipeline Status', 'Actions'].map(h => (
                                    <th key={h} className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-4 px-6"><div className="h-8 bg-slate-100 rounded-xl w-32" /></td>
                                    <td className="py-4 px-6"><div className="h-8 bg-slate-100 rounded-xl w-32" /></td>
                                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 rounded-full w-16" /></td>
                                    <td className="py-4 px-6"><div className="h-6 bg-slate-100 rounded-lg w-20" /></td>
                                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 rounded-full w-20" /></td>
                                    <td className="py-4 px-6"><div className="h-6 bg-slate-100 rounded-full w-20" /></td>
                                    <td className="py-4 px-6"><div className="h-8 bg-slate-100 rounded-xl w-8" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (filteredLeads.length === 0) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-24 border border-white shadow-xl text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <UserMinus size={48} className="text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">No Leads Found</h3>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-fit">
            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer / Lead</th>
                            <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact Details</th>
                            <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estimated Value</th>
                            <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Source</th>
                            <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Added Date</th>
                            <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Pipeline Status</th>
                            <th className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredLeads.map((lead) => {
                            const theme = getStatusTheme(lead.status);
                            return (
                                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl ${theme.light} ${theme.text} shadow-sm shrink-0`}>
                                                <UserCircle2 size={18} />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-black text-slate-800 tracking-tight">{lead.name}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 size={10} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lead.company || 'Private Lead'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-slate-600 font-medium">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <span>{lead.email}</span>
                                            <span>{lead.phone || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-black text-slate-900">₹ {(lead.estimatedValue || 0).toLocaleString('en-IN')}</td>
                                    <td className="py-4 px-6 uppercase text-[10px] font-black text-slate-500 tracking-widest">{lead.source}</td>
                                    <td className="py-4 px-6 text-xs text-slate-500 font-bold">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${theme.light} ${theme.text}`}>
                                                {lead.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center">
                                            <div className="relative group/actions">
                                                <button className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 shadow-sm transition-all group-hover/actions:rotate-90">
                                                    <MoreHorizontal size={16} />
                                                </button>

                                                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-50 p-2 z-50 opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all duration-300 translate-y-2 group-hover/actions:translate-y-0 origin-top-right">
                                                    
                                                    {/* 2. ADMIN ONLY EDIT OPTION */}
                                                    {isAdmin && (
                                                        <>
                                                            <div className="px-4 py-2 mb-1">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</p>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedLead(lead);
                                                                    setIsEditModalOpen(true);
                                                                }}
                                                                className="w-full text-left px-4 py-2.5 text-[11px] font-black text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex items-center justify-between group/edit"
                                                            >
                                                                <span>Edit Details</span>
                                                                <Pencil size={12} />
                                                            </button>
                                                            <div className="h-px bg-slate-50 my-1.5 mx-2" />
                                                        </>
                                                    )}

                                                    <div className="px-4 py-2 mb-1">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Pipeline</p>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        {['contacted', 'qualified', 'converted', 'lost'].map(status => (
                                                            <button
                                                                key={status}
                                                                onClick={() => onStatusUpdate(lead.id, status as Lead['status'])}
                                                                className="w-full text-left px-4 py-2.5 text-[11px] font-black text-slate-600 hover:bg-blue-50 rounded-xl transition-all flex items-center justify-between"
                                                            >
                                                                <span className="capitalize">{status}</span>
                                                                <ChevronRight size={12} />
                                                            </button>
                                                        ))}
                                                        <div className="h-px bg-slate-50 my-1.5 mx-2" />
                                                        <button
                                                            onClick={() => onDelete(lead.id)}
                                                            className="w-full text-left px-4 py-2.5 text-[11px] font-black text-rose-500 hover:bg-rose-50 rounded-xl flex items-center justify-between"
                                                        >
                                                            <span>Remove Lead</span>
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <EditLeadModal 
                isOpen={isEditModalOpen}
                lead={selectedLead}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedLead(null);
                }}
                onSuccess={() => window.location.reload()}
            />
        </div>
    );
};

export default LeadsList;