// import React, { useEffect, useState } from 'react';
// import { getProductionTasksByAssignee, updateProductionTask, ProductionTask } from '../../services/api';
// import { getQuotationById } from '../../services/quotationService';
// import QuotationViewModal from '../QuotationViewModal';

// const OperationEmployeeDashboard: React.FC = () => {
//     const [tasks, setTasks] = useState<ProductionTask[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [currentUser, setCurrentUser] = useState<any>(null);
//     const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
//     const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

//     useEffect(() => {
//         const userStr = localStorage.getItem('user');
//         if (userStr) {
//             const user = JSON.parse(userStr);
//             setCurrentUser(user);
//             if (user.id) {
//                 loadMyTasks(user.id);
//             }
//         }
//     }, []);

//     const loadMyTasks = async (userId: string) => {
//         setLoading(true);
//         try {
//             const data = await getProductionTasksByAssignee(userId);
//             setTasks(data || []);
//         } catch (error) {
//             console.error("Failed to load my tasks", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleViewQuotation = async (quotationId: string) => {
//         try {
//             setLoading(true);
//             const data = await getQuotationById(quotationId);
//             if (data && data.quotation) {
//                 setSelectedQuotation(data.quotation);
//                 setIsQuotationModalOpen(true);
//             }
//         } catch (error) {
//             console.error("Failed to fetch quotation", error);
//             alert("Failed to load quotation details");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleStatusUpdate = async (task: ProductionTask, nextStatus: string) => {
//         try {
//             // Update status and quantity based on progress
//             // For logic simplicity, assuming claiming task moves it to "In Progress"
//             await updateProductionTask(task.id, {
//                 status: nextStatus,
//                 completedQuantity: nextStatus === 'Production Done' ? task.targetQuantity : task.completedQuantity
//             });
//             if (currentUser?.id) loadMyTasks(currentUser.id);
//         } catch (error) {
//             console.error("Failed to update status", error);
//         }
//     };

//     const getStatusStep = (status: string) => {
//         switch (status) {
//             case 'Pending': return 0;
//             case 'In Progress': return 1;
//             case 'Production Done': return 2;
//             case 'Dispatched': return 3;
//             default: return 0;
//         }
//     };

//     return (
//         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {/* Header */}
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                 <div>
//                     <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Production Tasks</h1>
//                     <p className="text-slate-500 font-medium">Manage your assigned work and update progress.</p>
//                 </div>
//             </div>

//             {/* Task List */}
//             <div className="space-y-6">
//                 {loading ? (
//                     <div className="py-20 text-center text-slate-400 text-xl font-bold animate-pulse">Loading your tasks...</div>
//                 ) : tasks.length === 0 ? (
//                     <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
//                         <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">assignment_turned_in</span>
//                         <p className="text-slate-400 text-xl font-bold">No active tasks assigned to you</p>
//                     </div>
//                 ) : (
//                     tasks.map(t => {
//                         const percentage = Math.round((t.completedQuantity / t.targetQuantity) * 100);
//                         const currentStep = getStatusStep(t.status);
//                         const isOverdue = t.deadline && new Date(t.deadline) < new Date();
//                         const isUrgent = t.priority === 'High' || isOverdue;

//                         return (
//                             <div key={t.id} className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl shadow-sm ${isUrgent ? 'border-red-100' : 'border-slate-100'}`}>
//                                 <div className="p-6 md:p-8">
//                                     <div className="flex flex-col xl:flex-row gap-8">
//                                         {/* Main Info */}
//                                         <div className="flex-1">
//                                             <div className="flex items-start justify-between mb-4">
//                                                 <div>
//                                                     <h4 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{t.description}</h4>
//                                                     <div className="flex flex-wrap items-center gap-4">
//                                                         <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${t.priority === 'High' ? 'bg-red-50 text-red-700' : t.priority === 'Low' ? 'bg-slate-50 text-slate-600' : 'bg-amber-50 text-amber-700'}`}>
//                                                             <span className={`w-2 h-2 rounded-full ${t.priority === 'High' ? 'bg-red-500 animate-pulse' : t.priority === 'Low' ? 'bg-slate-400' : 'bg-amber-500'}`}></span>
//                                                             {t.priority}
//                                                         </span>
//                                                         <span className={`flex items-center gap-1.5 text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-slate-400'}`}>
//                                                             <span className="material-symbols-outlined text-sm">calendar_today</span>
//                                                             {t.deadline && !isNaN(new Date(t.deadline).getTime()) ? new Date(t.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline'}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* Progress Bar */}
//                                             <div className="mt-6 mb-4">
//                                                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
//                                                     <span>Progress</span>
//                                                     <span>{percentage}%</span>
//                                                 </div>
//                                                 <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
//                                                     <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
//                                                 </div>
//                                             </div>

//                                             {/* Customer / Order Info */}
//                                             {(t.customerName || t.orderDetails) && (
//                                                 <div className="mt-4 p-4 bg-slate-50 rounded-2xl flex flex-wrap gap-6">
//                                                     {t.customerName && (
//                                                         <div>
//                                                             <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</span>
//                                                             <span className="font-bold text-slate-700">{t.customerName}</span>
//                                                         </div>
//                                                     )}
//                                                     {t.orderDetails && (
//                                                         <div>
//                                                             <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Details</span>
//                                                             <span className="font-bold text-slate-700">{t.orderDetails}</span>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Actions */}
//                                         <div className="xl:w-64 flex flex-col justify-center gap-4">
//                                             {/* Target Qty Removed as per request */}

//                                             {/* View Quotation Button Removed */}

//                                             {/* View Work Order Button */}
//                                             <button
//                                                 onClick={() => {
//                                                     if (t.workOrderUrl) {
//                                                         window.open(t.workOrderUrl, '_blank');
//                                                     } else {
//                                                         alert("No work order attached");
//                                                     }
//                                                 }}
//                                                 disabled={!t.workOrderUrl}
//                                                 className={`w-full py-3 border-2 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 ${t.workOrderUrl
//                                                     ? "bg-white border-slate-100 hover:border-purple-100 hover:bg-purple-50 text-slate-600 hover:text-purple-600"
//                                                     : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
//                                                     }`}
//                                             >
//                                                 <span className="material-symbols-outlined text-sm">assignment</span>
//                                                 {t.workOrderUrl ? "View Work Order" : "No Work Order"}
//                                             </button>

//                                             {t.status === 'Pending' && (
//                                                 <button
//                                                     onClick={() => handleStatusUpdate(t, 'In Progress')}
//                                                     className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-blue-500/20 transition-all"
//                                                 >
//                                                     Start Work
//                                                 </button>
//                                             )}
//                                             {t.status === 'In Progress' && (
//                                                 <button
//                                                     onClick={() => handleStatusUpdate(t, 'Production Done')}
//                                                     className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-emerald-500/20 transition-all"
//                                                 >
//                                                     Mark Done
//                                                 </button>
//                                             )}
//                                             {t.status === 'Production Done' && (
//                                                 <div className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold uppercase tracking-wider text-xs text-center">
//                                                     Completed
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })
//                 )}
//             </div>

//             {/* Quotation Viewer Modal */}
//             <QuotationViewModal
//                 isOpen={isQuotationModalOpen}
//                 onClose={() => setIsQuotationModalOpen(false)}
//                 quotation={selectedQuotation}
//             />
//         </div>
//     );
// };

// export default OperationEmployeeDashboard;


import React, { useEffect, useMemo, useState } from "react";
import {
  getProductionTasksByAssignee,
  updateProductionTask,
  ProductionTask,
} from "../../services/api";

import { getQuotationById } from "../../services/quotationService";
import QuotationViewModal from "../QuotationViewModal";

const ITEMS_PER_PAGE = 10;

const OperationEmployeeDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<ProductionTask[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  const [selectedQuotation, setSelectedQuotation] =
    useState<any>(null);

  const [isQuotationModalOpen, setIsQuotationModalOpen] =
    useState(false);

  const [activeFilter, setActiveFilter] =
    useState("ALL");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (userStr) {
      const user = JSON.parse(userStr);

      setCurrentUser(user);

      if (user.id) {
        loadMyTasks(user.id);
      }
    }
  }, []);

  const loadMyTasks = async (userId: string) => {
    setLoading(true);

    try {
      const data =
        await getProductionTasksByAssignee(userId);

      setTasks(data || []);
    } catch (error) {
      console.error(
        "Failed to load my tasks",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuotation = async (
    quotationId: string
  ) => {
    try {
      setLoading(true);

      const data =
        await getQuotationById(quotationId);

      if (data && data.quotation) {
        setSelectedQuotation(data.quotation);

        setIsQuotationModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load quotation");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    task: ProductionTask,
    nextStatus: string
  ) => {
    try {
      await updateProductionTask(task.id, {
        status: nextStatus,

        completedQuantity:
          nextStatus === "Production Done"
            ? task.targetQuantity
            : task.completedQuantity,
      });

      if (currentUser?.id) {
        loadMyTasks(currentUser.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // FILTERING
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (activeFilter !== "ALL") {
      filtered = filtered.filter(
        (t) => t.status === activeFilter
      );
    }

    if (search.trim()) {
      filtered = filtered.filter((t) =>
        `${t.description} ${t.customerName} ${t.orderDetails}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [tasks, activeFilter, search]);

  // PAGINATION
  const totalPages = Math.ceil(
    filteredTasks.length / ITEMS_PER_PAGE
  );

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // COUNTS
  const pendingCount = tasks.filter(
    (t) => t.status === "Pending"
  ).length;

  const progressCount = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;

  const doneCount = tasks.filter(
    (t) => t.status === "Production Done"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* TOP HEADER */}
      <div className="mb-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Production Dashboard
            </h1>

            <p className="text-slate-500 mt-1 font-medium">
              Track and manage all assigned tasks
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full lg:w-96">

            <input
              type="text"
              placeholder="Search task, customer, order..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400">
              search
            </span>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">

        {/* TOTAL */}
        <button
          onClick={() => {
            setActiveFilter("ALL");
            setCurrentPage(1);
          }}
          className={`text-left rounded-3xl p-5 border transition-all duration-300 ${
            activeFilter === "ALL"
              ? "bg-blue-600 border-blue-600 text-white shadow-xl"
              : "bg-white border-slate-200 hover:shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-bold uppercase tracking-wider opacity-80">
                Total Tasks
              </p>

              <h2 className="text-4xl font-black mt-2">
                {tasks.length}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                assignment
              </span>
            </div>

          </div>
        </button>

        {/* PENDING */}
        <button
          onClick={() => {
            setActiveFilter("Pending");
            setCurrentPage(1);
          }}
          className={`text-left rounded-3xl p-5 border transition-all duration-300 ${
            activeFilter === "Pending"
              ? "bg-amber-500 border-amber-500 text-white shadow-xl"
              : "bg-white border-slate-200 hover:shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-bold uppercase tracking-wider opacity-80">
                Pending
              </p>

              <h2 className="text-4xl font-black mt-2">
                {pendingCount}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                pending_actions
              </span>
            </div>

          </div>
        </button>

        {/* IN PROGRESS */}
        <button
          onClick={() => {
            setActiveFilter("In Progress");
            setCurrentPage(1);
          }}
          className={`text-left rounded-3xl p-5 border transition-all duration-300 ${
            activeFilter === "In Progress"
              ? "bg-blue-500 border-blue-500 text-white shadow-xl"
              : "bg-white border-slate-200 hover:shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-bold uppercase tracking-wider opacity-80">
                In Progress
              </p>

              <h2 className="text-4xl font-black mt-2">
                {progressCount}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                manufacturing
              </span>
            </div>

          </div>
        </button>

        {/* DONE */}
        <button
          onClick={() => {
            setActiveFilter("Production Done");
            setCurrentPage(1);
          }}
          className={`text-left rounded-3xl p-5 border transition-all duration-300 ${
            activeFilter === "Production Done"
              ? "bg-emerald-500 border-emerald-500 text-white shadow-xl"
              : "bg-white border-slate-200 hover:shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-bold uppercase tracking-wider opacity-80">
                Completed
              </p>

              <h2 className="text-4xl font-black mt-2">
                {doneCount}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                task_alt
              </span>
            </div>

          </div>
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        {/* TABLE HEADER */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-black text-slate-900">
              Task Listing
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Showing {filteredTasks.length} tasks
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-100 text-sm font-bold text-slate-700">
            Page {currentPage} / {totalPages || 1}
          </div>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="py-24 text-center text-slate-400 text-xl font-bold">
            Loading Tasks...
          </div>

        ) : filteredTasks.length === 0 ? (

          <div className="py-24 text-center text-slate-400 text-xl font-bold">
            No Tasks Found
          </div>

        ) : (

          <>
            <div className="overflow-auto">

              <table className="w-full min-w-[1500px]">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-500">
                      Task Details
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-500">
                      Priority
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-500">
                      Progress
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-500">
                      Deadline
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-black uppercase text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {paginatedTasks.map((t) => {

                    const percentage =
                      Math.round(
                        (t.completedQuantity /
                          t.targetQuantity) *
                        100
                      ) || 0;

                    return (

                      <tr
                        key={t.id}
                        className="border-t border-slate-100 hover:bg-slate-50 transition-all"
                      >

                        {/* TASK */}
                        <td className="px-5 py-5">

                          <div className="flex flex-col gap-2">

                            <div className="flex items-center gap-3">

                              <div
                                className={`w-3 h-3 rounded-full ${
                                  t.status ===
                                  "Pending"
                                    ? "bg-amber-400"
                                    : t.status ===
                                      "In Progress"
                                    ? "bg-blue-500"
                                    : "bg-emerald-500"
                                }`}
                              />

                              <h3 className="font-black text-slate-900">
                                {t.description}
                              </h3>

                            </div>

                            {t.orderDetails && (
                              <p className="text-sm text-slate-500 max-w-[350px] truncate">
                                {t.orderDetails}
                              </p>
                            )}

                            <div className="flex items-center gap-3 mt-1">

                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-black uppercase ${
                                  t.priority ===
                                  "High"
                                    ? "bg-red-50 text-red-700"
                                    : t.priority ===
                                      "Medium"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {t.priority}
                              </span>

                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-black uppercase ${
                                  t.status ===
                                  "Pending"
                                    ? "bg-amber-50 text-amber-700"
                                    : t.status ===
                                      "In Progress"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {t.status}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* CUSTOMER */}
                        <td className="px-5 py-5">

                          <div className="font-bold text-slate-800">
                            {t.customerName || "-"}
                          </div>

                        </td>

                        {/* PRIORITY */}
                        <td className="px-5 py-5">

                          <div className="font-bold text-slate-700">
                            {t.priority}
                          </div>

                        </td>

                        {/* PROGRESS */}
                        <td className="px-5 py-5 w-[250px]">

                          <div className="flex items-center gap-3">

                            <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">

                              <div
                                className={`h-full rounded-full ${
                                  t.status ===
                                  "Pending"
                                    ? "bg-amber-400"
                                    : t.status ===
                                      "In Progress"
                                    ? "bg-blue-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />

                            </div>

                            <span className="text-sm font-black text-slate-700">
                              {percentage}%
                            </span>

                          </div>

                        </td>

                        {/* DEADLINE */}
                        <td className="px-5 py-5">

                          <div className="font-semibold text-slate-700">
                            {t.deadline
                              ? new Date(
                                  t.deadline
                                ).toLocaleDateString()
                              : "-"}
                          </div>

                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-5">

                          <div className="flex items-center justify-center gap-2 flex-wrap">

                            {/* WORK ORDER */}
                            <button
                              onClick={() => {
                                if (t.workOrderUrl) {
                                  window.open(
                                    t.workOrderUrl,
                                    "_blank"
                                  );
                                }
                              }}
                              disabled={!t.workOrderUrl}
                              className={`h-10 px-4 rounded-xl text-xs font-black transition-all ${
                                t.workOrderUrl
                                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                  : "bg-slate-50 text-slate-300 cursor-not-allowed"
                              }`}
                            >
                              Work Order
                            </button>

                            {/* QUOTATION */}
                            {/* {t.quotationId && (
                              <button
                                onClick={() => {
                                  if (
                                    t.quotationId
                                  ) {
                                    handleViewQuotation(
                                      t.quotationId
                                    );
                                  }
                                }}
                                className="h-10 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black transition-all"
                              >
                                Quotation
                              </button>
                            )} */}

                            {/* START */}
                            {t.status ===
                              "Pending" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    t,
                                    "In Progress"
                                  )
                                }
                                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all"
                              >
                                Start
                              </button>
                            )}

                            {/* DONE */}
                            {t.status ===
                              "In Progress" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    t,
                                    "Production Done"
                                  )
                                }
                                className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all"
                              >
                                Mark Done
                              </button>
                            )}

                            {/* COMPLETED */}
                            {t.status ===
                              "Production Done" && (
                              <div className="h-10 px-4 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black flex items-center">
                                Completed
                              </div>
                            )}

                          </div>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}
            <div className="px-6 py-5 border-t border-slate-200 flex items-center justify-between">

              <div className="text-sm font-semibold text-slate-500">
                Showing{" "}
                {(currentPage - 1) *
                  ITEMS_PER_PAGE +
                  1}{" "}
                to{" "}
                {Math.min(
                  currentPage *
                    ITEMS_PER_PAGE,
                  filteredTasks.length
                )}{" "}
                of {filteredTasks.length}
              </div>

              <div className="flex items-center gap-2">

                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((p) => p - 1)
                  }
                  className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-bold"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map(
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setCurrentPage(i + 1)
                      }
                      className={`w-10 h-10 rounded-xl font-black transition-all ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage((p) => p + 1)
                  }
                  className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-bold"
                >
                  Next
                </button>

              </div>

            </div>
          </>
        )}

      </div>

      {/* MODAL */}
      {/* <QuotationViewModal
        isOpen={isQuotationModalOpen}
        onClose={() =>
          setIsQuotationModalOpen(false)
        }
        quotation={selectedQuotation}
      /> */}

    </div>
  );
};

export default OperationEmployeeDashboard;