import React, { useState, useEffect, useRef } from 'react';
import {
    Megaphone,
    Upload,
    Users,
    Mail,
    Send,
    FileText,
    CheckCircle2,
    AlertCircle,
    Search,
    Filter,
    Trash2,
    Paperclip,
    Loader2,
    X,
    FileUp,
    ChevronRight,
    RefreshCw,
    MessageSquare,
    Calendar
} from 'lucide-react';
import { getLeads, getLeadEmails, Lead } from '../services/leadService';

// Types for Campaign
interface MarketingFile {
    id: string;
    file: File;
    name: string;
    size: string;
    type: string;
}

const MarketingTools: React.FC = () => {
    // State
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email');

    // Campaign State
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<MarketingFile[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [sendProgress, setSendProgress] = useState(0);
    const [sendLogs, setSendLogs] = useState<{ name: string, status: 'success' | 'error' }[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const data = await getLeads();
            setLeads(data || []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtered Leads
    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Handle Selection
    const toggleLeadSelection = (id: string) => {
        if (selectedLeads.includes(id)) {
            setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
        } else {
            if (selectedLeads.length >= 50) {
                alert('You can only select up to 50 recipients at a time.');
                return;
            }
            setSelectedLeads([...selectedLeads, id]);
        }
    };

    const selectAllFiltered = () => {
        const allFilteredIds = filteredLeads.map(l => l.id);
        if (selectedLeads.length === allFilteredIds.length && allFilteredIds.length <= 50) {
            setSelectedLeads([]);
        } else if (selectedLeads.length > 0 && allFilteredIds.length > 50) {
            // If we have some selected, and total > 50, deselect all for simplicity
            // or logic could be complex. Let's just toggle all off if anything is selected
            setSelectedLeads([]);
        } else {
            if (allFilteredIds.length > 50) {
                alert('Only the first 50 leads have been selected due to the limit.');
                setSelectedLeads(allFilteredIds.slice(0, 50));
            } else {
                setSelectedLeads(allFilteredIds);
            }
        }
    };

    // Handle File Upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles: MarketingFile[] = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                type: file.type
            }));
            setAttachedFiles([...attachedFiles, ...newFiles]);
        }
    };

    const removeFile = (id: string) => {
        setAttachedFiles(attachedFiles.filter(f => f.id !== id));
    };



    // Handle Bulk Send
    const handleBulkSend = async () => {
        if (selectedLeads.length === 0) return alert('Please select at least one recipient.');
        if (selectedLeads.length > 50) return alert('You can only select up to 50 recipients at a time.');
        if (!subject || !message) return alert('Please provide a subject and message.');

        setIsSending(true);
        setSendProgress(0);
        setSendLogs([]);

        const recipients = leads.filter(l => selectedLeads.includes(l.id));
        const recipientEmails = recipients.map(r => activeTab === 'email' ? r.email : r.phone).filter(e => e); // Basic filter

        // Setup FormData
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('recipients', JSON.stringify(recipientEmails));

        attachedFiles.forEach(f => {
            formData.append('attachments', f.file);
        });

        // Simulate progress for user experience since actual upload might take time
        // and we don't have real-time progress from a simple fetch without XHR/Axios config
        const progressInterval = setInterval(() => {
            setSendProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 500);

        try {
            // Import API_URL from config if possible, or hardcode for now based on context
            // Assuming axios is available or using fetch
            const token = localStorage.getItem('token'); // Simplistic auth token retrieval
            const response = await fetch('http://localhost:5000/api/v1/marketing/bulk-email', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // 'Content-Type': 'multipart/form-data' // Browser sets this automatically with boundary
                },
                body: formData
            });

            const data = await response.json();

            clearInterval(progressInterval);
            setSendProgress(100);

            if (data.success) {
                // Show individual status from backend if available, else just success
                const results = data.data;
                const newLogs: { name: string, status: 'success' | 'error' }[] = [];

                // Map backend results back to leads if possible, or just list emails
                if (results.success) {
                    results.success.forEach((email: string) => {
                        const lead = recipients.find(l => (activeTab === 'email' ? l.email : l.phone) === email);
                        newLogs.push({ name: lead ? lead.name : email, status: 'success' });
                    });
                }

                if (results.failed) {
                    results.failed.forEach((email: string) => {
                        const lead = recipients.find(l => (activeTab === 'email' ? l.email : l.phone) === email);
                        newLogs.push({ name: lead ? lead.name : email, status: 'error' });
                    });
                }

                // If no specific logs returned (e.g. for simple success), show all success
                if (newLogs.length === 0) {
                    recipients.forEach(r => newLogs.push({ name: r.name, status: 'success' }));
                }

                setSendLogs(newLogs as any); // Cast to matched type

                setTimeout(() => {
                    alert(`Campaign finished! Processed ${recipients.length} recipients.`);
                    setIsSending(false);
                }, 1000);
            } else {
                throw new Error(data.message || 'Failed to send campaign');
            }

        } catch (error: any) {
            clearInterval(progressInterval);
            setIsSending(false);
            console.error('Campaign Error:', error);
            alert(`Campaign failed: ${error.message}`);
            setSendLogs(recipients.map(r => ({ name: r.name, status: 'error' })) as any);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner">
                        <Megaphone size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Marketing & Campaigns</h1>
                        <p className="text-slate-500 text-sm font-medium">Create and send brochures to your clients in bulk</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={async () => {
                            try {
                                if (activeTab === 'email') {
                                    const emails = await getLeadEmails();
                                    alert(`Fetched ${emails.length} emails from database:\n` + emails.join(', '));
                                    console.log('Fetched emails:', emails);
                                } else {
                                    const allLeads = await getLeads();
                                    const phones = allLeads.map(l => l.phone).filter(p => p);
                                    alert(`Fetched ${phones.length} mobile numbers from database:\n` + phones.join(', '));
                                    console.log('Fetched numbers:', phones);
                                }
                            } catch (error) {
                                console.error('Failed to fetch contact details:', error);
                                alert('Failed to fetch contact details');
                            }
                        }}
                        className={`px-5 py-2.5 rounded-xl border text-center transition-all ${activeTab === 'email'
                            ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100'
                            : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100'}`}
                    >
                        <span className={`block text-xs font-bold uppercase tracking-wider ${activeTab === 'email' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                            {activeTab === 'email' ? 'Sync Emails' : 'Sync Numbers'}
                        </span>
                        <span className={`text-xs font-bold ${activeTab === 'email' ? 'text-emerald-700' : 'text-indigo-700'}`}>
                            From DB
                        </span>
                    </button>
                    <div className="px-5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Leads</span>
                        <span className="text-lg font-bold text-slate-800">{leads.length}</span>
                    </div>
                    <div className="px-5 py-2.5 bg-blue-50 rounded-xl border border-blue-100 text-center">
                        <span className="block text-xs font-bold text-blue-400 uppercase tracking-wider">Selected (Max 50)</span>
                        <span className={`text-lg font-bold ${selectedLeads.length > 50 ? 'text-red-600' : 'text-blue-700'}`}>{selectedLeads.length}</span>
                    </div>
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center pb-2">
                <div className="flex p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm w-full max-w-md">
                    <button
                        onClick={() => setActiveTab('email')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'email'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <Mail size={18} />
                        Email Marketing
                    </button>
                    <button
                        onClick={() => setActiveTab('whatsapp')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'whatsapp'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <MessageSquare size={18} />
                        WhatsApp Marketing
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Recipient Selection */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[700px]">
                        <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Users size={18} className="text-blue-500" />
                                    Select Recipients
                                </h2>
                                <button
                                    onClick={selectAllFiltered}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
                                >
                                    {selectedLeads.length === filteredLeads.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search leads by name or email..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="qualified">Qualified</option>
                                    </select>
                                    <button
                                        onClick={fetchLeads}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2 sidebar-scroll">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full py-10">
                                    <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                                    <p className="text-slate-400 text-sm">Loading leads...</p>
                                </div>
                            ) : filteredLeads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-10 opacity-50">
                                    <Users size={48} className="text-slate-200 mb-3" />
                                    <p className="text-slate-400 text-sm">No leads found</p>
                                </div>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        onClick={() => toggleLeadSelection(lead.id)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 group ${selectedLeads.includes(lead.id)
                                            ? 'bg-blue-50 border-blue-200 shadow-sm shadow-blue-500/5'
                                            : 'bg-white border-slate-100 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedLeads.includes(lead.id)
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'border-slate-200 group-hover:border-blue-400'
                                            }`}>
                                            {selectedLeads.includes(lead.id) && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-700 truncate">{lead.name}</h4>
                                            <p className="text-xs text-slate-400 truncate font-medium">
                                                {activeTab === 'email' ? lead.email : lead.phone}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${lead.status === 'qualified' ? 'bg-emerald-50 text-emerald-600' :
                                            lead.status === 'contacted' ? 'bg-blue-50 text-blue-600' :
                                                'bg-slate-50 text-slate-500'
                                            }`}>
                                            {lead.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Campaign Composer */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-6">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                            {activeTab === 'email' ? (
                                <>
                                    <Mail size={18} className="text-blue-500" />
                                    Compose Email Campaign
                                </>
                            ) : (
                                <>
                                    <MessageSquare size={18} className="text-emerald-500" />
                                    Compose WhatsApp Blast
                                </>
                            )}
                        </h2>

                        {activeTab === 'email' ? (
                            /* EMAIL UI */
                            <>
                                {/* Subject */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Subject</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Check out our new Solar Solutions Brochure 2024"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </div>

                                {/* Message */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Message Content</label>
                                    <textarea
                                        rows={6}
                                        placeholder="Write your email message here..."
                                        className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium resize-none"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>

                                {/* Attachments */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Brouchure & Files</label>

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            multiple
                                            onChange={handleFileChange}
                                        />
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                                            <FileUp size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                                            <p className="text-xs text-slate-400 font-medium mt-1">PDF, DOCX, PNG or JPG (Max 10MB)</p>
                                        </div>
                                    </div>

                                    {/* File List */}
                                    {attachedFiles.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {attachedFiles.map((f) => (
                                                <div key={f.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-bold text-slate-700 truncate">{f.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium">{f.size}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile(f.id)}
                                                        className="p-1 px-2 text-slate-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* WHATSAPP UI */
                            <>
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* Template Selection */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Message Template</label>
                                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium cursor-pointer">
                                            <option>New Product Launch 🚀</option>
                                            <option>Seasonal Discount Offer 🏷️</option>
                                            <option>General Inquiry Follow-up 👋</option>
                                            <option value="custom">Custom Message ✍️</option>
                                        </select>
                                    </div>

                                    {/* Message Body */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Message Content</label>
                                        <textarea
                                            rows={6}
                                            placeholder="Type your marketing message here..."
                                            className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium resize-none"
                                            defaultValue="Hello! We are excited to announce our latest solar solutions tailored just for you. Reply 'YES' to know more! 🌞"
                                        />
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-bold text-slate-400">0/1024 Characters</span>
                                        </div>
                                    </div>

                                    {/* Schedule */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Schedule Delivery</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="datetime-local"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 text-emerald-800">
                                        <Users size={20} className="shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-bold">Audience Summary</h4>
                                            <p className="text-xs mt-1">
                                                You are about to send this campaign to <b>{selectedLeads.length}</b> recipients.
                                                Ensure your message complies with WhatsApp Business policies.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}


                        {/* SEND SECTION */}
                        <div className="mt-4 pt-6 border-t border-slate-50">
                            {isSending ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className={`animate-spin ${activeTab === 'email' ? 'text-blue-600' : 'text-emerald-600'}`} size={20} />
                                            <span className="text-sm font-bold text-slate-700">Sending Campaign...</span>
                                        </div>
                                        <span className={`text-lg font-black ${activeTab === 'email' ? 'text-blue-600' : 'text-emerald-600'}`}>{sendProgress}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)] ${activeTab === 'email' ? 'bg-blue-600' : 'bg-emerald-500'}`}
                                            style={{ width: `${sendProgress}%` }}
                                        />
                                    </div>
                                    <div className="h-20 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] space-y-1 font-mono sidebar-scroll">
                                        {sendLogs.map((log, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span className="text-slate-500 uppercase tracking-tighter transition-all">PROCESSING: {log.name}</span>
                                                <span className={log.status === 'success' ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                                                    {log.status === 'success' ? 'SUCCESS' : 'FAILED'}
                                                </span>
                                            </div>
                                        ))}
                                        {sendLogs.length === 0 && <p className="text-slate-300">Initializing engine...</p>}
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleBulkSend}
                                    disabled={selectedLeads.length === 0}
                                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${selectedLeads.length > 0
                                        ? (activeTab === 'email'
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] shadow-blue-500/20'
                                            : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-[1.01] active:scale-[0.99] shadow-emerald-500/20'
                                        )
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Send size={20} />
                                    {activeTab === 'email'
                                        ? `Send Email Campaign to ${selectedLeads.length} Recipients`
                                        : `Blast WhatsApp to ${selectedLeads.length} Contacts`
                                    }
                                </button>
                            )}

                            <p className="text-center text-[10px] text-slate-400 font-medium mt-4 flex items-center justify-center gap-1.5">
                                <AlertCircle size={12} />
                                Bulk sending is processed client-side. Make sure to keep this window open until finished.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingTools;
