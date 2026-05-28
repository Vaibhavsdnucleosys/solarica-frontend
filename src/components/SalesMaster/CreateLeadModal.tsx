// import React, { useEffect, useState } from 'react';
// import ReactDOM from 'react-dom';
// import { X, User, Building2, Mail, Phone, Globe, DollarSign, IndianRupee, FileText, Plus, ShieldCheck, Users } from 'lucide-react';

// interface CreateLeadModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSubmit: (leadData: any) => void;
// }
// interface SalesEmployee {
//     id: string;
//     name: string;
//     email?: string;
//     role?: {
//         name?: string;
//     };
// }

// // const [salesEmployees, setSalesEmployees] = useState<SalesEmployee[]>([]);
// const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         company: '',
//         email: '',
//         phone: '',
//         source: 'Website',
//         estimatedValue: '',
//         customerType: 'Indian',
//         notes: '',
//          assignedTo: ''
//     });
//     const [emailError, setEmailError] = useState('');
//     // const [salesEmployees, setSalesEmployees] = useState([]);

// const [salesEmployees, setSalesEmployees] = useState<SalesEmployee[]>([]);

// // useEffect(() => {
// //     fetch('/api/users') // your API
// //         .then(res => res.json())
// //         .then(data => {
// //             const filtered = data.filter((u: any) => u.role === 'Sales');
// //             setSalesEmployees(filtered);
// //         });
// // }, []);



// // useEffect(() => {
   

// //      fetch('/api/v1/employees', {
// //     headers: {
// //         Authorization: `Bearer ${localStorage.getItem('token')}`
// //     }
// // })
// //         .then(res => res.json())
// //         .then(data => {
// //             console.log("Users API:", data); // 👈 debug

// //             const filtered = data.filter((u: any) =>
// //     u.role?.name?.toLowerCase() === 'sales'
// // );

// //             setSalesEmployees(filtered);
// //         })
// //         .catch(err => console.error("Error fetching users:", err));
// // }, []);


// useEffect(() => {
//     fetch('/api/v1/employees', {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//     })
//         .then(res => res.json())
//         .then(data => {
//             console.log("API RESPONSE:", data);

//             const users = data.employees || [];

//             // const filtered = users.filter((u: any) =>
//             //     u.role?.name?.toLowerCase() === 'sales'
//             // );

//             const filtered: SalesEmployee[] = users.filter(
//     (u: SalesEmployee) =>
//         u.role?.name?.toLowerCase() === 'sales'
// );

//             console.log("Filtered Sales:", filtered);

//             setSalesEmployees(filtered);
//         })
//         .catch(err => console.error("Error:", err));
// }, []);


//     if (!isOpen) return null;


    
//     // LEAD-001: Lead Name - alphabets and spaces only, max 100 characters
//     const handleNameChange = (value: string) => {
//         const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 100);
//         setFormData({ ...formData, name: alphabetsOnly });
//     };

//     // LEAD-002: Company - alphanumeric and basic punctuation, max 150 characters
//     const handleCompanyChange = (value: string) => {
//         const validChars = value.replace(/[^a-zA-Z0-9\s.,&'-]/g, '').slice(0, 150);
//         setFormData({ ...formData, company: validChars });
//     };

//     // LEAD-003: Email - proper validation
//     const handleEmailChange = (value: string) => {
//         setFormData({ ...formData, email: value });
//         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         if (value && !emailRegex.test(value)) {
//             setEmailError('Please enter a valid email address');
//         } else {
//             setEmailError('');
//         }
//     };

//     // LEAD-004: Phone - digits only, exactly 10 digits
//     const handlePhoneChange = (value: string) => {
//         const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 10);
//         setFormData({ ...formData, phone: digitsOnly });
//     };

//     // LEAD-005: Estimated Value - positive whole numbers only
//     const handleEstimatedValueChange = (value: string) => {
//         // Remove any non-digit characters and leading zeros
//         const digitsOnly = value.replace(/[^0-9]/g, '');
//         const positiveInt = digitsOnly ? parseInt(digitsOnly, 10).toString() : '';
//         setFormData({ ...formData, estimatedValue: positiveInt });
//     };

//     // LEAD-006: Notes - sanitize script-like content, max 1000 characters
//     const handleNotesChange = (value: string) => {
//         const sanitized = value.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').slice(0, 1000);
//         setFormData({ ...formData, notes: sanitized });
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         // Validate email before submit
//         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         if (!emailRegex.test(formData.email)) {
//             setEmailError('Please enter a valid email address');
//             return;
//         }
//         // Validate phone is exactly 10 digits
//         if (formData.phone.length !== 10) {
//             return;
//         }
//         // onSubmit({
//         //     ...formData,
//         //     estimatedValue: parseInt(formData.estimatedValue) || 0,
//         //     status: 'new',
//         //     createdAt: new Date().toISOString(),
//         //     updatedAt: new Date().toISOString()
//         // });

// //         const selectedEmployee = salesEmployees.find(
// //     (emp: any) => emp.id === formData.assignedTo
// // );

// const selectedEmployee = salesEmployees.find(
//     (emp: SalesEmployee) => emp.id === formData.assignedTo
// );

// onSubmit({
//     ...formData,
//     assignedToId: formData.assignedTo,
//     assignedToName: selectedEmployee?.name || "",
//     estimatedValue: parseInt(formData.estimatedValue) || 0,
//     status: 'new',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
// });
//         resetForm();
//     };

//     const resetForm = () => {
//         setFormData({
//             name: '',
//             company: '',
//             email: '',
//             phone: '',
//             source: 'Website',
//             customerType: 'Indian',
//             estimatedValue: '',
//             notes: '',
//                 assignedTo: ''
//         });
//     };

//     return ReactDOM.createPortal(
//         // <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          
// <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">        
//         {/* Backdrop */}
//             <div
//                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300"
//                 onClick={onClose}
//             />

//             {/* Modal Content */}
//             {/* <div className="relative bg-white/95 backdrop-blur-3xl w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] border border-white/50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"> */}
               
//                <div className="relative bg-white/95 backdrop-blur-3xl 
// w-full max-w-xl sm:max-w-2xl 
// max-h-[90vh] 
// rounded-[2rem] sm:rounded-[2.5rem] 
// shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] 
// border border-white/50 
// overflow-hidden 
// animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
               
//                 {/* Header Decoration */}
//                 <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-blue-600/10 to-indigo-600/5 -z-10" />

//                 {/* <div className="p-6 sm:p-8"> */}
//                 <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
//                     <div className="flex justify-between items-start mb-8">
//                         <div className="space-y-1">
//                             <div className="flex items-center gap-3 text-blue-600 mb-1">
//                                 <div className="p-1.5 bg-blue-50 rounded-lg">
//                                     <ShieldCheck size={16} />
//                                 </div>
//                                 <span className="text-[9px] font-black uppercase tracking-[0.2em]">Sales Intelligence</span>
//                             </div>
//                             <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add a New Lead</h2>
//                             <p className="text-slate-400 text-sm font-medium">Capture essential prospect details for the pipeline.</p>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600 active:scale-95"
//                         >
//                             <X size={22} />
//                         </button>
//                     </div>

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//                             {/* Lead Name */}
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Name <span className="text-red-500">*</span></label>
//                                 <div className="relative group">
//                                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
//                                     <input
//                                         required
//                                         type="text"
//                                         placeholder="Full name"
//                                         maxLength={100}
//                                         className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-semibold text-slate-700"
//                                         value={formData.name}
//                                         onChange={e => handleNameChange(e.target.value)}
//                                     />
//                                 </div>
//                             </div>

//                             {/* Company */}
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company <span className="text-red-500">*</span></label>
//                                 <div className="relative group">
//                                     <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
//                                     <input
//                                         required
//                                         type="text"
//                                         placeholder="Organization"
//                                         maxLength={150}
//                                         className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-semibold text-slate-700"
//                                         value={formData.company}
//                                         onChange={e => handleCompanyChange(e.target.value)}
//                                     />
//                                 </div>
//                             </div>

//                             {/* Customer Type */}
// <div className="space-y-1.5">
//   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//     Customer Region <span className="text-red-500">*</span>
// </label>
//     <div className="relative group">
//         <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
//         <select
//             required
//             className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-semibold text-slate-700 appearance-none cursor-pointer"
//             value={formData.customerType}
//             onChange={e => setFormData({ ...formData, customerType: e.target.value })}
//         >
//            <option value="Indian">Indian</option>
// <option value="International">International</option>
//         </select>
//     </div>
// </div>

//                             {/* Email */}
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address <span className="text-red-500">*</span></label>
//                                 <div className="relative group">
//                                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
//                                     <input
//                                         required
//                                         type="email"
//                                         placeholder="example@mail.com"
//                                         className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-semibold text-slate-700 ${emailError ? 'border-red-300' : 'border-slate-100'}`}
//                                         value={formData.email}
//                                         onChange={e => handleEmailChange(e.target.value)}
//                                     />
//                                 </div>
//                                 {emailError && <p className="text-red-500 text-xs ml-1">{emailError}</p>}
//                             </div>

//                             {/* Phone */}
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number <span className="text-red-500">*</span></label>
//                                 <div className="relative group">
//                                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
//                                     <input
//                                         required
//                                         type="tel"
//                                         placeholder="+91 XXXXX XXXXX"
//                                         maxLength={10}
//                                         pattern="[0-9]{10}"
//                                         className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-semibold text-slate-700"
//                                         value={formData.phone}
//                                         onChange={e => handlePhoneChange(e.target.value)}
//                                     />
//                                 </div>
//                                 {formData.phone && formData.phone.length !== 10 && <p className="text-red-500 text-xs ml-1">Phone must be exactly 10 digits</p>}
//                             </div>

//                             {/* Lead Source */}
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Source</label>
//                                 <div className="relative group">
//                                     <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
//                                     <select
//                                         className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-semibold text-slate-700 appearance-none cursor-pointer"
//                                         value={formData.source}
//                                         onChange={e => setFormData({ ...formData, source: e.target.value })}
//                                     >
//                                         <option value="Website">Website</option>
//                                         <option value="Referral">Referral</option>
//                                         <option value="Cold Call">Cold Call</option>
//                                         <option value="LinkedIn">LinkedIn</option>
//                                         <option value="Other">Other</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Estimated Value */}
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Est. Value (₹) <span className="text-red-500">*</span></label>
//                                 <div className="relative group">
//                                     <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
//                                     <input
//                                         required
//                                         type="text"
//                                         inputMode="numeric"
//                                         placeholder="0"
//                                         min="0"
//                                         className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-bold text-slate-700"
//                                         value={formData.estimatedValue}
//                                         onChange={e => handleEstimatedValueChange(e.target.value)}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Notes */}
//                         <div className="space-y-1.5">
//                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Notes <span className="text-red-500">*</span></label>
//                             <div className="relative group">
//                                 <FileText className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
//                                 <textarea
//                                     placeholder="Add requirements or strategic highlights..."
//                                     rows={2}
//                                     maxLength={1000}
//                                     className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-semibold text-slate-700 resize-none"
//                                     value={formData.notes}
//                                     onChange={e => handleNotesChange(e.target.value)}
//                                 />
//                             </div>
//                         </div>


//                         {/* Assign Lead */}
// <div className="space-y-1.5">
//     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
//         Assign To <span className="text-red-500">*</span>
//     </label>

//     <div className="relative group">
//         <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />

//         <select
//             required
//             className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-semibold text-slate-700 appearance-none cursor-pointer"
//             value={formData.assignedTo}
//             onChange={(e) =>
//                 setFormData({ ...formData, assignedTo: e.target.value })
//             }
//         >
//             <option value="">Select Sales Employee</option>

//             {/* {salesEmployees.map((emp: any) => (
//                 <option key={emp.id} value={emp.id}>
//                     {emp.name}
//                 </option>
//             ))} */}
//             {salesEmployees.map((emp: SalesEmployee) => (
//     <option key={emp.id} value={emp.id}>
//         {emp.name}
//     </option>
// ))}


//         </select>
//     </div>
// </div>

//                         {/* Submit Actions */}
//                         {/* <div className="flex gap-4 pt-2"> */}
//                         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
//                             <button
//                                 type="button"
//                                 onClick={onClose}
//                                 className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95 text-sm"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="flex-[1.5] px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3 group text-sm"
//                             >
//                                 <Plus size={18} className="group-hover:rotate-90 transition-transform" />
//                                 <span>Add a New Lead</span>
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>,
//         document.body
//     );
// };

// export default CreateLeadModal;



import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, User, Building2, Mail, Phone, Globe, IndianRupee, FileText, Plus, ShieldCheck, Users } from 'lucide-react';

interface CreateLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (leadData: any) => void;
}

interface SalesEmployee {
    id: string;
    name: string;
    email?: string;
    role?: {
        name?: string;
    };
}

const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
    // 1. Get Current User Info
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = currentUser?.role?.name?.toLowerCase() === "admin";

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        source: 'Website',
        estimatedValue: '',
        customerType: 'Indian',
        notes: '',
        // If not admin, pre-assign to current user ID
        assignedTo: !isAdmin ? currentUser.id : ''
    });

    const [emailError, setEmailError] = useState('');
    const [salesEmployees, setSalesEmployees] = useState<SalesEmployee[]>([]);

    // 2. Fetch Logic based on Role
    useEffect(() => {
        if (!isOpen) return;

        if (isAdmin) {
            // ADMIN: Fetch all sales employees
            fetch('/api/v1/employees', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    const users = data.employees || [];
                    const filtered = users.filter((u: SalesEmployee) =>
                        u.role?.name?.toLowerCase() === 'sales'
                    );
                    setSalesEmployees(filtered);
                })
                .catch(err => console.error("Error fetching employees:", err));
        } else {
            // NON-ADMIN: Only show the current user in the list
            setSalesEmployees([{
                id: currentUser.id,
                name: currentUser.name || "Self"
            }]);
        }
    }, [isOpen, isAdmin]);

    if (!isOpen) return null;

    // Validation Handlers
    const handleNameChange = (value: string) => {
        const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 100);
        setFormData({ ...formData, name: alphabetsOnly });
    };

    const handleCompanyChange = (value: string) => {
        const validChars = value.replace(/[^a-zA-Z0-9\s.,&'-]/g, '').slice(0, 150);
        setFormData({ ...formData, company: validChars });
    };

    const handleEmailChange = (value: string) => {
        setFormData({ ...formData, email: value });
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setEmailError(value && !emailRegex.test(value) ? 'Please enter a valid email address' : '');
    };

    const handlePhoneChange = (value: string) => {
        const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 10);
        setFormData({ ...formData, phone: digitsOnly });
    };

    const handleEstimatedValueChange = (value: string) => {
        const digitsOnly = value.replace(/[^0-9]/g, '');
        setFormData({ ...formData, estimatedValue: digitsOnly });
    };

    const handleNotesChange = (value: string) => {
        const sanitized = value.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').slice(0, 1000);
        setFormData({ ...formData, notes: sanitized });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailError || formData.phone.length !== 10) return;

        const selectedEmployee = salesEmployees.find(emp => emp.id === formData.assignedTo);

        onSubmit({
            ...formData,
            assignedToId: formData.assignedTo,
            assignedToName: selectedEmployee?.name || currentUser.name || "",
            estimatedValue: parseInt(formData.estimatedValue) || 0,
            status: 'new',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            company: '',
            email: '',
            phone: '',
            source: 'Website',
            customerType: 'Indian',
            estimatedValue: '',
            notes: '',
            assignedTo: !isAdmin ? currentUser.id : ''
        });
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />

            <div className="relative bg-white/95 backdrop-blur-3xl w-full max-w-xl sm:max-w-2xl max-h-[90vh] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 text-blue-600 mb-1">
                                <div className="p-1.5 bg-blue-50 rounded-lg"><ShieldCheck size={16} /></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Sales Intelligence</span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add a New Lead</h2>
                        </div>
                        <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"><X size={22} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Name <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={16} />
                                    <input required type="text" placeholder="Full name" className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 font-semibold text-slate-700" value={formData.name} onChange={e => handleNameChange(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={16} />
                                    <input required type="text" placeholder="Organization" className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 font-semibold text-slate-700" value={formData.company} onChange={e => handleCompanyChange(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Region <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <select required className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 font-semibold text-slate-700 appearance-none" value={formData.customerType} onChange={e => setFormData({ ...formData, customerType: e.target.value })}>
                                        <option value="Indian">Indian</option>
                                        <option value="International">International</option>
                                    </select>
                                </div>
                            </div>

                            {/* <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input required type="email" placeholder="example@mail.com" className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 font-semibold text-slate-700 ${emailError ? 'border-red-300' : 'border-slate-100'}`} value={formData.email} onChange={e => handleEmailChange(e.target.value)} />
                                </div>
                                {emailError && <p className="text-red-500 text-[10px] ml-1">{emailError}</p>}
                            </div> */}

                            {/* Email Address Section */}
<div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        Email Address (Optional) {/* Removed * */}
    </label>
    <div className="relative group">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
        <input 
            type="email" // Removed required
            placeholder="example@mail.com" 
            className={`w-full ... ${emailError ? 'border-red-300' : 'border-slate-100'}`} 
            value={formData.email} 
            onChange={e => handleEmailChange(e.target.value)} 
        />
    </div>
    {emailError && <p className="text-red-500 text-[10px] ml-1">{emailError}</p>}
</div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input required type="tel" placeholder="10 digit number" maxLength={10} className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 font-semibold text-slate-700" value={formData.phone} onChange={e => handlePhoneChange(e.target.value)} />
                                </div>
                            </div>

                            {/* <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Est. Value (₹) <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input required type="text" inputMode="numeric" placeholder="0" className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 font-bold text-slate-700" value={formData.estimatedValue} onChange={e => handleEstimatedValueChange(e.target.value)} />
                                </div>
                            </div> */}

                            <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        Est. Value (₹) (Optional) {/* Removed * */}
    </label>
    <div className="relative group">
        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
        <input 
            type="text" // Removed required
            inputMode="numeric" 
            placeholder="0" 
            className="w-full ..." 
            value={formData.estimatedValue} 
            onChange={e => handleEstimatedValueChange(e.target.value)} 
        />
    </div>
</div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Notes <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <FileText className="absolute left-4 top-4 text-slate-300" size={16} />
                                <textarea placeholder="Add requirements..." rows={2} className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 font-semibold text-slate-700 resize-none" value={formData.notes} onChange={e => handleNotesChange(e.target.value)} />
                            </div>
                        </div>

                        {/* Assign Lead Section */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign To <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                                <select 
                                    required 
                                    disabled={!isAdmin} // Disabled if not admin
                                    className={`w-full pl-11 pr-4 py-3.5 border rounded-2xl focus:outline-none font-semibold text-slate-700 appearance-none ${!isAdmin ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50/50 border-slate-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400'}`} 
                                    value={formData.assignedTo} 
                                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                >
                                    {isAdmin && <option value="">Select Sales Employee</option>}
                                    {salesEmployees.map((emp: SalesEmployee) => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            {!isAdmin && <p className="text-[9px] text-slate-400 ml-1 italic">Automatically assigned to you.</p>}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 text-sm transition-all">Cancel</button>
                            <button type="submit" className="flex-[1.5] px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-sm">
                                <Plus size={18} />
                                <span>Add a New Lead</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CreateLeadModal;