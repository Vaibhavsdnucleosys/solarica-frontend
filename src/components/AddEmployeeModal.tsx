// import React, { useState } from 'react';

// interface AddEmployeeModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSubmit: (employee: any) => void;
// }

// const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSubmit }) => {
//     // const [step, setStep] = useState(1); // Removed step state
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         mobile: '',
//         password: '',
//         category: '',
//         grants: [] as string[]
//     });
//     const [errors, setErrors] = useState<{ [key: string]: string }>({});

//     if (!isOpen) return null;

//     const validateForm = () => {
//         const newErrors: { [key: string]: string } = {};
//         if (!formData.name.trim()) newErrors.name = 'Full Name is required';
//         if (!formData.email.trim()) {
//             newErrors.email = 'Email is required';
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = 'Email is invalid';
//         }
//         if (!formData.mobile.trim()) {
//             newErrors.mobile = 'Mobile Number is required';
//         } else if (!/^\d{10}$/.test(formData.mobile)) {
//             newErrors.mobile = 'Mobile Number must be 10 digits';
//         }
//         if (!formData.password) {
//             newErrors.password = 'Password is required';
//         } else if (formData.password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters';
//         }
//         if (!formData.category) newErrors.category = 'Department is required';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = () => {
//         if (validateForm()) {
//             onSubmit(formData);
//             setFormData({ name: '', email: '', mobile: '', password: '', category: '', grants: [] });
//             setErrors({});
//             onClose();
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             {/* Backdrop with blur */}
//             <div
//                 className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
//                 onClick={onClose}
//             />

//             {/* Modal Content */}
//             <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
//                 {/* Header */}
//                 <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
//                     <div>
//                         <h3 className="text-lg font-bold text-slate-800">Add New Employee</h3>
//                         <p className="text-xs text-slate-500 font-medium">Create a new employee account</p>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 flex items-center justify-center transition-all"
//                     >
//                         ✕
//                     </button>
//                 </div>

//                 {/* Progress Bar Removed */}

//                 {/* Body */}
//                 <div className="p-8 min-h-[400px] overflow-y-auto">
//                     <div className="space-y-5">
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
//                                 <input
//                                     type="text"
//                                     value={formData.name}
//                                     onChange={e => {
//                                         setFormData({ ...formData, name: e.target.value });
//                                         if (errors.name) setErrors({ ...errors, name: '' });
//                                     }}
//                                     className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-700 placeholder-slate-400 ${errors.name ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
//                                     placeholder="e.g. Sarah Connor"
//                                     autoFocus
//                                 />
//                                 {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//                             </div>
//                             <div>
//                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
//                                 <input
//                                     type="email"
//                                     value={formData.email}
//                                     onChange={e => {
//                                         setFormData({ ...formData, email: e.target.value });
//                                         if (errors.email) setErrors({ ...errors, email: '' });
//                                     }}
//                                     className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-700 placeholder-slate-400 ${errors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
//                                     placeholder="e.g. sarah@solarica.com"
//                                 />
//                                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//                             </div>
//                             <div>
//                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
//                                 <input
//                                     type="tel"
//                                     value={formData.mobile}
//                                     onChange={e => {
//                                         setFormData({ ...formData, mobile: e.target.value });
//                                         if (errors.mobile) setErrors({ ...errors, mobile: '' });
//                                     }}
//                                     className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-700 placeholder-slate-400 ${errors.mobile ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
//                                     placeholder="e.g. 9876543210"
//                                 />
//                                 {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
//                                     <input
//                                         type="password"
//                                         value={formData.password}
//                                         onChange={e => {
//                                             setFormData({ ...formData, password: e.target.value });
//                                             if (errors.password) setErrors({ ...errors, password: '' });
//                                         }}
//                                         className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-700 placeholder-slate-400 ${errors.password ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
//                                         placeholder="••••••••"
//                                     />
//                                     {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Department</label>
//                                     <div className="relative">
//                                         <select
//                                             value={formData.category}
//                                             onChange={e => {
//                                                 setFormData({ ...formData, category: e.target.value });
//                                                 if (errors.category) setErrors({ ...errors, category: '' });
//                                             }}
//                                             className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-700 appearance-none ${errors.category ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
//                                         >
//                                             <option value="">Select Dept.</option>
//                                             <option value="Sales">Sales</option>
//                                             <option value="Accounting">Accounting</option>
//                                             <option value="Operation">Operation Head</option>
//                                             <option value="Operation Employee">Operation Employee</option>
//                                         </select>
//                                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
//                                     </div>
//                                     {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="pt-4 flex items-center justify-end gap-3">
//                         <button
//                             onClick={onClose}
//                             className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleSubmit}
//                             className="px-8 py-2.5 bg-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
//                         >
//                             Create Employee
//                         </button>
//                     </div>
//                 </div>
//             </div>

//         </div>


//     );
// };

// export default AddEmployeeModal;


import React, { useState } from 'react';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (employee: any) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        company: '',  // matches backend destructuring
        roleName: '', // matches backend (replacing 'category')
        grants: []
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.company) newErrors.company = 'Company is required';
        if (!formData.roleName) newErrors.roleName = 'Department is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // This 'formData' now contains 'company' and 'roleName'
            onSubmit(formData); 
            setFormData({ name: '', email: '', mobile: '', password: '', company: '', roleName: '', grants: [] });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Add New Employee</h3>
                
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
                    </div>

                    {/* NEW: Company Selection */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company</label>
                        <select 
                            value={formData.company} 
                            onChange={e => setFormData({...formData, company: e.target.value})}
                            className="w-full p-3 bg-slate-50 border rounded-xl"
                        >
                            
                                <option value="">Select Company</option>

<option value="Solarica Energy India Pvt Ltd">
  Solarica Energy India Pvt Ltd
</option>

<option value="Solarica Industries Pvt Ltd">
  Solarica Industries Pvt Ltd
</option>

<option value="Solarica Systems Pvt Ltd">
  Solarica Systems Pvt Ltd
</option>

<option value="Solarica Fabtech Pvt Ltd">
  Solarica Fabtech Pvt Ltd
</option>

<option value="Solarica Greenwheels Pvt Ltd">
  Solarica Greenwheels Pvt Ltd
</option>
                        </select>
                        {errors.company && <p className="text-red-500 text-xs">{errors.company}</p>}
                    </div>

                    {/* RoleName (Department) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                        <select 
                            value={formData.roleName} 
                            onChange={e => setFormData({...formData, roleName: e.target.value})}
                            className="w-full p-3 bg-slate-50 border rounded-xl"
                        >
                            <option value="">Select Dept.</option>
                            <option value="Sales">Sales</option>
                            <option value="Accounting">Accounting</option>
                            <option value="Operation">Operation</option>
                            <option value="Operation Employee">Operation Employee</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile</label>
                            <input type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 font-semibold">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold">Create</button>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeModal;