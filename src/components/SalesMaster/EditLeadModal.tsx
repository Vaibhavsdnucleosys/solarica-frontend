import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Save, User, Building2, Mail, Phone, IndianRupee, FileText, Globe, Loader2, Users, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL, getAxiosConfig } from '../../config';

interface SalesEmployee {
    id: string;
    name: string;
    email?: string;
    role?: {
        name?: string;
    };
}

interface EditLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: any;
    onSuccess: () => void;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({ isOpen, onClose, lead, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [salesEmployees, setSalesEmployees] = useState<SalesEmployee[]>([]);
    const [emailError, setEmailError] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        source: 'Website',
        estimatedValue: '',
        customerType: 'Indian',
        notes: '',
        assignedToId: ''
    });

    // 1. Fetch Sales Employees (Same as Create Modal)
    useEffect(() => {
        if (isOpen) {
            fetch(`${API_URL}/employees`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(data => {
                const users = data.employees || [];
                const filtered = users.filter((u: SalesEmployee) => 
                    u.role?.name?.toLowerCase() === 'sales' || u.role?.name?.toLowerCase() === 'admin'
                );
                setSalesEmployees(filtered);
            })
            .catch(err => console.error("Error fetching employees:", err));
        }
    }, [isOpen]);

    // 2. Initialize form with Lead Data
    useEffect(() => {
        if (lead) {
            setFormData({
                name: lead.name || '',
                company: lead.company || '',
                email: lead.email || '',
                phone: lead.phone || '',
                source: lead.source || 'Website',
                estimatedValue: lead.estimatedValue?.toString() || '',
                customerType: lead.customerType || 'Indian',
                notes: lead.notes || '',
                assignedToId: lead.assignedToId || ''
            });
        }
    }, [lead]);

    if (!isOpen) return null;

    // Validation Handlers (Mirroring Create Modal)
    const handleNameChange = (value: string) => {
        const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 100);
        setFormData({ ...formData, name: alphabetsOnly });
    };

    const handlePhoneChange = (value: string) => {
        const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 10);
        setFormData({ ...formData, phone: digitsOnly });
    };

    const handleEmailChange = (value: string) => {
        setFormData({ ...formData, email: value });
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setEmailError(value && !emailRegex.test(value) ? 'Invalid email format' : '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.phone.length !== 10) {
            toast.error('Phone number must be 10 digits');
            return;
        }

        if (emailError) {
            toast.error('Please fix email errors');
            return;
        }

        setLoading(true);

        // Find assigned employee name for the DB
        const selectedEmployee = salesEmployees.find(emp => emp.id === formData.assignedToId);

        const payload = {
            ...formData,
            estimatedValue: parseInt(formData.estimatedValue) || 0,
            assignedToName: selectedEmployee?.name || lead.assignedToName
        };

        try {
            await axios.put(`${API_URL}/leads/${lead.id}`, payload, getAxiosConfig());
            toast.success('Lead updated successfully');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update lead');
        } finally {
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
            
            <div className="relative bg-white/95 backdrop-blur-3xl w-full max-w-xl sm:max-w-2xl max-h-[90vh] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden animate-in zoom-in-95 duration-300">
                
                <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(90vh-40px)]">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 text-blue-600 mb-1">
                                <div className="p-1.5 bg-blue-50 rounded-lg">
                                    <ShieldCheck size={16} />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Management Portal</span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Edit Prospect Details</h2>
                            <p className="text-slate-400 text-sm font-medium">Update IDs: #{lead?.id?.slice(-6).toUpperCase()}</p>
                        </div>
                        <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
                            <X size={22} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            {/* Lead Name */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Name <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={16} />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 font-semibold text-slate-700"
                                        value={formData.name}
                                        onChange={e => handleNameChange(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Company */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={16} />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 font-semibold text-slate-700"
                                        value={formData.company}
                                        onChange={e => setFormData({...formData, company: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Region */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Region</label>
                                <div className="relative group">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <select
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 appearance-none font-semibold text-slate-700"
                                        value={formData.customerType}
                                        onChange={e => setFormData({ ...formData, customerType: e.target.value })}
                                    >
                                        <option value="Indian">Indian</option>
                                        <option value="International">International</option>
                                    </select>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        required
                                        type="email"
                                        className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${emailError ? 'border-red-300' : 'border-slate-100'} rounded-2xl font-semibold text-slate-700`}
                                        value={formData.email}
                                        onChange={e => handleEmailChange(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        required
                                        type="tel"
                                        maxLength={10}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700"
                                        value={formData.phone}
                                        onChange={e => handlePhoneChange(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Source */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Source</label>
                                <select
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700"
                                    value={formData.source}
                                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                                >
                                    <option value="Website">Website</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Cold Call">Cold Call</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Estimated Value */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Value (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        type="number"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700"
                                        value={formData.estimatedValue}
                                        onChange={e => setFormData({ ...formData, estimatedValue: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Assign To */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign To <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <select
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl appearance-none font-semibold text-slate-700"
                                        value={formData.assignedToId}
                                        onChange={e => setFormData({ ...formData, assignedToId: e.target.value })}
                                    >
                                        <option value="">Select Sales Person</option>
                                        {salesEmployees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Notes</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-4 text-slate-300" size={16} />
                                <textarea
                                    rows={3}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 resize-none"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[1.5] px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditLeadModal;