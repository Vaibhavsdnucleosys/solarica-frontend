import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Mail, MessageSquare, Calendar, Users } from 'lucide-react';
import { getLeadEmails } from '../../services/leadService';

interface LeadEmailsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LeadEmailsModal: React.FC<LeadEmailsModalProps> = ({ isOpen, onClose }) => {
    const [emails, setEmails] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email');

    useEffect(() => {
        if (isOpen) {
            fetchEmails();
        }
    }, [isOpen]);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const data = await getLeadEmails();
            setEmails(data || []);
        } catch (error) {
            console.error("Failed to fetch emails", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (email: string, index: number) => {
        navigator.clipboard.writeText(email);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAll = () => {
        navigator.clipboard.writeText(emails.join(', '));
        alert("All emails copied to clipboard!");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center transition-colors ${activeTab === 'email' ? 'bg-white text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {activeTab === 'email' ? <Mail size={20} /> : <MessageSquare size={20} />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Marketing Tools</h2>
                            <p className="text-xs text-slate-500 font-medium">
                                {activeTab === 'email' ? 'Email Campaign Manager' : 'WhatsApp Bulk Messaging'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-white/50 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Toggle Switch */}
                <div className="px-6 pt-6 pb-2">
                    <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setActiveTab('email')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'email'
                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Mail size={16} />
                            Email Marketing
                        </button>
                        <button
                            onClick={() => setActiveTab('whatsapp')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'whatsapp'
                                ? 'bg-white text-green-600 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <MessageSquare size={16} />
                            WhatsApp
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0">

                    {/* EMAIL TAB CONTENT */}
                    {activeTab === 'email' && (
                        <>
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-700">Target Audience</span>
                                <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                                    {emails.length} Leads
                                </span>
                            </div>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                    <p className="text-sm text-slate-500">Loading emails...</p>
                                </div>
                            ) : emails.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    No emails found from leads.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {emails.map((email, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 hover:border-blue-200 hover:shadow-sm transition-all group"
                                        >
                                            <span className="text-sm font-medium text-slate-700 truncate mr-2">{email}</span>
                                            <button
                                                onClick={() => handleCopy(email, index)}
                                                className={`p-2 rounded-lg transition-all ${copiedIndex === index
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100'
                                                    }`}
                                                title="Copy Email"
                                            >
                                                {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* WHATSAPP TAB CONTENT */}
                    {activeTab === 'whatsapp' && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Audience Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                        <Users size={16} />
                                    </div>
                                    <span className="text-2xl font-black text-green-700 leading-none">{emails.length}</span>
                                    <span className="text-[10px] uppercase font-bold text-green-600/70 mt-1 tracking-wide">Recipients</span>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                    </div>
                                    <span className="text-2xl font-black text-amber-700 leading-none">Ready</span>
                                    <span className="text-[10px] uppercase font-bold text-amber-600/70 mt-1 tracking-wide">System Status</span>
                                </div>
                            </div>

                            {/* Template Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Message Template</label>
                                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all cursor-pointer">
                                    <option>New Product Launch 🚀</option>
                                    <option>Seasonal Discount Offer 🏷️</option>
                                    <option>General Inquiry Follow-up 👋</option>
                                    <option value="custom">Custom Message ✍️</option>
                                </select>
                            </div>

                            {/* Message Body */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Message Content</label>
                                <textarea
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all min-h-[120px] resize-none"
                                    placeholder="Type your marketing message here..."
                                    defaultValue="Hello! We are excited to announce our latest solar solutions tailored just for you. Reply 'YES' to know more! 🌞"
                                />
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-bold text-slate-400">0/1024 Characters</span>
                                    <span className="text-[10px] font-bold text-slate-400">Media attached: None</span>
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Schedule Delivery</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="datetime-local"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 z-10">
                    {activeTab === 'email' ? (
                        <>
                            {emails.length > 0 && (
                                <button
                                    onClick={handleCopyAll}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    Copy All
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 transition-colors shadow-sm shadow-slate-200"
                            >
                                Close
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2"
                            >
                                <MessageSquare size={16} />
                                Start Campaign
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadEmailsModal;
