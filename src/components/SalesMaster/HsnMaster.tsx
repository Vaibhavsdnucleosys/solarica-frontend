// import React, { useState, useEffect } from 'react';
// import { 
//     Search, 
//     Edit2, 
//     Check, 
//     X, 
//     Hash, 
//     ChevronLeft, 
//     ChevronRight, 
//     Loader2, 
//     RefreshCcw, 
//     Info,
//     Package,
//     Activity
// } from 'lucide-react';
// import { getHsnMaster, updateHsnCode } from '../../services/hsnService';
// import toast from 'react-hot-toast';
// import { importHsnFile } from '../../services/hsnService';
// import { api, importHsn } from '../../services/api';
// const HsnMaster = () => {
//     const [loading, setLoading] = useState(false);
//     const [data, setData] = useState([]);
//     const [search, setSearch] = useState('');
//     const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 });
//     const [editingId, setEditingId] = useState<string | null>(null);
//     const [editForm, setEditForm] = useState({ description: '', gstRate: 0 });

//     useEffect(() => {
//         const delayDebounce = setTimeout(() => {
//             loadData(1);
//         }, 500);
//         return () => clearTimeout(delayDebounce);
//     }, [search]);

//     const loadData = async (page: number) => {
//         setLoading(true);
//         try {
//             const res = await getHsnMaster({ page, limit: 50, search });
//             setData(res.data.data);
//             setPagination(res.data.meta);
//         } catch (err) {
//             toast.error("Failed to load HSN data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSave = async (id: string) => {
//         try {
//             await updateHsnCode(id, editForm);
//             toast.success("Code updated successfully");
//             setEditingId(null);
//             loadData(pagination.page);
//         } catch (err) { 
//             toast.error("Update failed"); 
//         }
//     };
//  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//         await importHsn(file);
//         toast.success("Uploaded successfully");
//         loadData(1);
//     } catch (err) {
//         console.error(err);
//         toast.error("Upload failed");
//     }
// };

//     return (
//         <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            
//             {/* --- Header Section --- */}
//             <div className="p-8 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/50">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//                     <div className="flex items-center gap-5">
//                         <div className="relative">
//                             <div className="bg-blue-600 p-3.5 rounded-2xl shadow-lg shadow-blue-200">
//                                 <Hash className="text-white" size={24} />
//                             </div>
//                             <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
//                         </div>
//                         <div>
//                             <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">HSN/SAC Master</h2>
//                             <div className="flex items-center gap-2 mt-2">
//                                 <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-100">
//                                     {pagination.total.toLocaleString()} Records
//                                 </span>
//                                 <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
//                                     <Activity size={12} /> Server Sync Active
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3 w-full md:w-auto">
//                         <div className="relative group flex-1 md:w-96">
//                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
//                             <input 
//                                 className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-semibold text-slate-600 placeholder:text-slate-300 shadow-sm"
//                                 placeholder="Search by code or description..."
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                             />
//                         </div>

//                    <input
//   type="file"
//   accept=".xlsx,.csv"
//   onChange={handleUpload}
// />

// <label
//     htmlFor="upload-hsn"
//     className="px-5 py-3 bg-green-600 text-white rounded-2xl cursor-pointer font-bold text-xs hover:bg-green-700 transition-all"
// >
//     Import Excel
// </label>
//                         <button 
//                             onClick={() => loadData(1)}
//                             className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100 active:scale-95"
//                             title="Refresh Data"
//                         >
//                             <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* --- Table Section --- */}
//             <div className="flex-grow overflow-auto no-scrollbar relative">
//                 <table className="w-full text-left border-separate border-spacing-0">
//                     <thead className="sticky top-0 z-20">
//                         <tr className="bg-white/80 backdrop-blur-md">
//                             <th className="px-8 py-4 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em] border-b border-slate-100">Category</th>
//                             <th className="px-6 py-4 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em] border-b border-slate-100">Tax Code</th>
//                             <th className="px-6 py-4 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em] border-b border-slate-100">Item Description</th>
//                             <th className="px-6 py-4 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em] border-b border-slate-100">GST Rate</th>
//                             <th className="px-8 py-4 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em] border-b border-slate-100 text-right">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-50">
//                         {loading && data.length === 0 ? (
//                             <tr>
//                                 <td colSpan={5} className="py-32 text-center">
//                                     <div className="flex flex-col items-center gap-4">
//                                         <Loader2 className="animate-spin text-blue-600" size={40} />
//                                         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Database...</p>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ) : data.map((item: any) => (
//                             <tr key={item.id} className="hover:bg-slate-50/80 transition-all group">
//                                 <td className="px-8 py-5">
//                                     <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl font-bold text-[10px] tracking-tight ${
//                                         item.category === 'SAC' 
//                                         ? 'bg-purple-50 text-purple-600 border border-purple-100' 
//                                         : 'bg-blue-50 text-blue-600 border border-blue-100'
//                                     }`}>
//                                         <div className={`w-1.5 h-1.5 rounded-full ${item.category === 'SAC' ? 'bg-purple-400' : 'bg-blue-400'}`}></div>
//                                         {item.category === 'SAC' ? 'SERVICE' : 'GOODS'}
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-5 font-mono font-black text-slate-700 text-sm">{item.hsnCode}</td>
//                                 <td className="px-6 py-5">
//                                     {editingId === item.id ? (
//                                         <textarea 
//                                             className="w-full bg-white border-2 border-blue-500/20 p-3 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 text-xs font-bold text-slate-600 leading-relaxed shadow-inner"
//                                             rows={2} 
//                                             value={editForm.description} 
//                                             onChange={e => setEditForm({...editForm, description: e.target.value})} 
//                                         />
//                                     ) : (
//                                         <div className="max-w-md">
//                                             <p className="text-slate-600 text-xs font-semibold leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
//                                                 {item.description || 'No description provided'}
//                                             </p>
//                                         </div>
//                                     )}
//                                 </td>
//                                 <td className="px-6 py-5">
//                                     {editingId === item.id ? (
//                                         <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-100 rounded-2xl px-3 py-2 w-24 shadow-inner">
//                                             <input 
//                                                 type="number" 
//                                                 className="w-full bg-transparent outline-none font-black text-blue-600 text-sm" 
//                                                 value={editForm.gstRate} 
//                                                 onChange={e => setEditForm({...editForm, gstRate: parseFloat(e.target.value)})} 
//                                             />
//                                             <span className="text-blue-300 font-bold text-xs">%</span>
//                                         </div>
//                                     ) : (
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-lg font-black text-slate-800 tracking-tighter">{item.gstRate}</span>
//                                             <span className="text-slate-400 font-bold text-[10px]">%</span>
//                                         </div>
//                                     )}
//                                 </td>
//                                 <td className="px-8 py-5 text-right">
//                                     {editingId === item.id ? (
//                                         <div className="flex justify-end gap-2 animate-in slide-in-from-right-2">
//                                             <button 
//                                                 onClick={() => handleSave(item.id)} 
//                                                 className="p-2.5 bg-green-500 text-white rounded-xl shadow-md shadow-green-200 hover:bg-green-600 transition-all active:scale-90"
//                                             >
//                                                 <Check size={18} strokeWidth={3} />
//                                             </button>
//                                             <button 
//                                                 onClick={() => setEditingId(null)} 
//                                                 className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-all active:scale-90"
//                                             >
//                                                 <X size={18} strokeWidth={3} />
//                                             </button>
//                                         </div>
//                                     ) : (
//                                         <button 
//                                             onClick={() => {
//                                                 setEditingId(item.id);
//                                                 setEditForm({ description: item.description, gstRate: item.gstRate });
//                                             }} 
//                                             className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 active:scale-90"
//                                         >
//                                             <Edit2 size={18} />
//                                         </button>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* --- Footer / Pagination --- */}
//             <div className="p-6 bg-slate-50/50 border-t border-slate-100">
//                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//                     <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
//                         <Info size={14} className="text-blue-500" />
//                         Page <span className="text-slate-800 font-black">{pagination.page}</span> of <span className="text-slate-800 font-black">{pagination.lastPage}</span>
//                     </div>
                    
//                     <div className="flex items-center gap-2">
//                         <button 
//                             disabled={pagination.page === 1 || loading}
//                             onClick={() => loadData(pagination.page - 1)}
//                             className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all shadow-sm active:scale-95"
//                         >
//                             <ChevronLeft size={16} strokeWidth={3} /> Previous
//                         </button>
//                         <button 
//                             disabled={pagination.page === pagination.lastPage || loading}
//                             onClick={() => loadData(pagination.page + 1)}
//                             className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 disabled:opacity-30 transition-all shadow-lg shadow-blue-200 active:scale-95"
//                         >
//                             Next <ChevronRight size={16} strokeWidth={3} />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HsnMaster;

import React, { useEffect, useState } from "react";
import {
  Search,
  RefreshCcw,
  Edit2,
  Check,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import {
  getHsnMaster,
  updateHsnCode,
} from "../../services/hsnService";
import { importHsn } from "../../services/api";
import toast from "react-hot-toast";

const HsnMaster = () => {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    lastPage: 1,
    total: 0
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadData(1);
  }, [search, statusFilter]);

  const loadData = async (page: number) => {
    setLoading(true);
    try {
      const res = await getHsnMaster({
        page,
        limit: 20,
        search
      });

      let result = res.data.data;

      // filter status
      if (statusFilter !== "ALL") {
        result = result.filter((i: any) =>
          statusFilter === "ACTIVE" ? i.isActive : !i.isActive
        );
      }

      // sorting
      if (sortField) {
        result.sort((a: any, b: any) => {
          if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
          if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      setData(result);
      setPagination(res.data.meta);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };


  
const handleUpload = async (e: any) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    await importHsn(file);   // ✅ correct function
    toast.success("Imported successfully");
    loadData(1);
  } catch (err) {
    console.error(err);
    toast.error("Import failed");
  }
};

  const handleSave = async (id: string) => {
    await updateHsnCode(id, editForm);
    toast.success("Updated");
    setEditingId(null);
    loadData(pagination.page);
  };

  const exportCSV = () => {
    const headers = [
      "hsnCode",
      "description",
      "category",
      "cgstRate",
      "sgstRate",
      "igstRate",
      "isActive"
    ];

    const rows = data.map((d) =>
      headers.map((h) => d[h]).join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "hsn_export.csv";
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow border p-6 flex flex-col h-full">

      {/* 🔥 HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            placeholder="Search HSN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>

        <div className="flex gap-3 items-center">

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-xl text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
          >
            <Download size={16} /> Export
          </button>

          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={handleUpload}
          />

          <button
            onClick={() => loadData(1)}
            className="p-2 bg-gray-100 rounded-xl"
          >
            <RefreshCcw size={18} />
          </button>

        </div>
      </div>

      {/* 🔥 TABLE SCROLL */}
      <div className="flex-1 overflow-auto border rounded-xl">

        <table className="w-full text-sm">

          {/* 🔥 STICKY HEADER */}
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                { label: "HSN", field: "hsnCode" },
                { label: "Description", field: "description" },
                { label: "Category", field: "category" },
                { label: "CGST", field: "cgstRate" },
                { label: "SGST", field: "sgstRate" },
                { label: "IGST", field: "igstRate" },
                { label: "Status", field: "isActive" }
              ].map((col) => (
                <th
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  className="p-3 cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown size={12} />
                  </div>
                </th>
              ))}
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">

                <td className="p-3 font-semibold">{item.hsnCode}</td>

                <td className="p-3">
                  {editingId === item.id ? (
                    <input
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    item.description
                  )}
                </td>

                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.cgstRate}%</td>
                <td className="p-3">{item.sgstRate}%</td>
                <td className="p-3">{item.igstRate}%</td>

                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-3 text-right">
                  {editingId === item.id ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleSave(item.id)} className="p-2 bg-green-500 text-white rounded">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-2 bg-gray-200 rounded">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditForm(item);
                      }}
                      className="p-2 bg-blue-100 text-blue-600 rounded"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 PAGINATION */}
      <div className="flex justify-between items-center mt-4">

        <div className="text-sm text-gray-500">
          Page {pagination.page} of {pagination.lastPage}
        </div>

        <div className="flex gap-2">
          <button
            disabled={pagination.page === 1}
            onClick={() => loadData(pagination.page - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            disabled={pagination.page === pagination.lastPage}
            onClick={() => loadData(pagination.page + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default HsnMaster;