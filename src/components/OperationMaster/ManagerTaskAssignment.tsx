import React, { useState, useEffect } from 'react';
import { assignProductionTask, getEmployees, ProductionTask, uploadWorkOrder } from '../../services/api';
import ConfirmationModal from '../Common/ConfirmationModal';

interface ManagerTaskAssignmentProps {
    onTaskAssigned?: () => void;
    currentTasks?: ProductionTask[];
    prefillData?: any;
}

const ManagerTaskAssignment: React.FC<ManagerTaskAssignmentProps> = ({ onTaskAssigned, currentTasks = [], prefillData }) => {
    const [taskDescription, setTaskDescription] = useState('');
    const [targetQuantity, setTargetQuantity] = useState(100);
    const [deadline, setDeadline] = useState('');
    const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);
    const [workers, setWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    const [category, setCategory] = useState('Assembly'); // Default, hidden or small
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Optional Customer Info
    const [customerName, setCustomerName] = useState('');
    const [orderDetails, setOrderDetails] = useState('');
    const [quotationId, setQuotationId] = useState<string | undefined>(undefined);

    // Work Order Upload
    const [workOrderUrl, setWorkOrderUrl] = useState<string | undefined>(undefined);
    const [uploadingFile, setUploadingFile] = useState(false);

    useEffect(() => {
        loadWorkers();
    }, []);

    useEffect(() => {
        if (prefillData) {
            if (prefillData.description) setTaskDescription(prefillData.description);
            if (prefillData.customerName) setCustomerName(prefillData.customerName);
            if (prefillData.orderDetails) setOrderDetails(prefillData.orderDetails);
            if (prefillData.priority) setPriority(prefillData.priority);
            if (prefillData.quotationId) setQuotationId(prefillData.quotationId);
            if (prefillData.targetQuantity) setTargetQuantity(prefillData.targetQuantity);
        }
    }, [prefillData]);

    const loadWorkers = async () => {
        try {
            const data = await getEmployees();
            if (data && data.employees) {
                // Only show employees with the 'Operation' role per user request
                const operationEmployees = data.employees.filter((emp: any) =>
                    emp.category?.toLowerCase() === 'operation employee' ||
                    emp.role?.name?.toLowerCase() === 'operation employee'
                );
                setWorkers(operationEmployees);
            }
        } catch (error) {
            console.error("Failed to load workers", error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingFile(true);
            const result = await uploadWorkOrder(file);
            if (result.success) {
                setWorkOrderUrl(result.url); // Use the signed URL or file path as needed. Usually store path in DB, but URL for viewing.
                // If the backend signed URL expires, we might want to store the filePath and sign it on fetch.
                // The current backend implementation returns `url` (signed) and `filePath`.
                // Let's store the `filePath` in the DB if possible, or just the URL. 
                // Wait, `createProductionTask` expects `workOrderUrl`. If I store the signed URL, it expires.
                // ProductionTask model has `workOrderUrl`.
                // The controller `getProductionTasksByAssignee` signs it if it's there.
                // So I should store the `filePath` (or relative path) in `workOrderUrl` field in DB?
                // The controller `createProductionTask` saves `workOrderUrl` directly.
                // The upload response gives `filePath` (e.g. `work-orders/filename`).
                // So I should send `filePath` as `workOrderUrl`.
                setWorkOrderUrl(result.filePath);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload work order");
        } finally {
            setUploadingFile(false);
        }
    };

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedWorkerIds.length === 0 || !taskDescription) {
            alert("Please select at least one assignee and enter a task name.");
            return;
        }

        try {
            setLoading(true);

            // Get selected worker details
            const selectedAssignees = workers
                .filter(w => selectedWorkerIds.includes(w.id))
                .map(w => ({ id: w.id, name: w.name }));

            if (selectedAssignees.length === 0) return;

            // Determine primary assignee (first one) or a generic name for display
            const primaryAssignee = selectedAssignees[0];

            const payload = {
                description: taskDescription,
                assigneeId: primaryAssignee.id,
                assigneeName: selectedAssignees.length > 1 ? `${selectedAssignees.length} Members` : primaryAssignee.name,
                assignees: selectedAssignees,
                targetQuantity: targetQuantity,
                startDate: new Date().toISOString().split('T')[0],
                deadline: deadline || undefined,
                priority,
                category,
                customerName: customerName || undefined,
                orderDetails: orderDetails || undefined,
                quotationId: quotationId,
                workOrderUrl: workOrderUrl // Add this
            };

            console.log("Assigning Task with payload:", payload);
            await assignProductionTask(payload);

            // Reset
            setTaskDescription('');
            setSelectedWorkerIds([]);
            setDeadline('');
            setCustomerName('');
            setOrderDetails('');
            setQuotationId(undefined);
            setWorkOrderUrl(undefined);

            // Show Success Modal
            setShowSuccessModal(true);

            if (onTaskAssigned) onTaskAssigned();
        } catch (error: any) {
            console.error("Assignment Error:", error);
            alert(`Failed to assign task: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleWorkerSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const workerId = e.target.value;
        if (!workerId) return;

        setSelectedWorkerIds(prev => {
            if (prev.includes(workerId)) return prev;
            return [...prev, workerId];
        });
    };

    const removeWorker = (workerId: string) => {
        setSelectedWorkerIds(prev => prev.filter(id => id !== workerId));
    };

    return (
        <div className="bg-white rounded-2xl p-4 md:p-8 border border-slate-100 shadow-sm relative">
            <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Create New Assignment</h2>
            <p className="text-sm text-slate-500 font-medium mb-6">Assign production tasks to your team or create from quotations</p>

            <form onSubmit={handleAssignTask}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Task Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Task Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Q3 Financial Report"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-base text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 placeholder:font-medium"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Due Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-base text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12 cursor-pointer"
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl pointer-events-none">calendar_today</span>
                        </div>
                    </div>

                    {/* Assignee */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Assignee</label>

                        {/* Selected Tags */}
                        {selectedWorkerIds.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {selectedWorkerIds.map(id => {
                                    const worker = workers.find(w => w.id === id);
                                    return (
                                        <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
                                            {worker?.name}
                                            <button
                                                type="button"
                                                onClick={() => removeWorker(id)}
                                                className="hover:text-blue-900 focus:outline-none"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        <div className="relative">
                            <select
                                value=""
                                onChange={toggleWorkerSelection}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-base text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="" disabled hidden>
                                    {selectedWorkerIds.length === 0 ? "Select team member" : "Add another member"}
                                </option>
                                {workers.map(w => (
                                    <option
                                        key={w.id}
                                        value={w.id}
                                        disabled={selectedWorkerIds.includes(w.id)}
                                        className={selectedWorkerIds.includes(w.id) ? 'text-slate-300' : ''}
                                    >
                                        {w.name} {selectedWorkerIds.includes(w.id) ? '(Selected)' : ''}
                                    </option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* Priority & Quantity (Mixed Row for compactness or separate) */}
                    <div className="flex gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Priority</label>
                            <div className="relative">
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as any)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-base text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                                >
                                    <option value="High">High Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="Low">Low Priority</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl pointer-events-none">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optional: Customer Details Section */}
                <div className="mb-8 p-6 bg-blue-50/30 border border-blue-100 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-blue-600">info</span>
                        <h3 className="text-sm font-black text-blue-800 uppercase tracking-wide">Customer Info (Optional)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Customer Name</label>
                            <input
                                type="text"
                                placeholder="Leave empty for internal tasks"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Order Details</label>
                            <input
                                type="text"
                                placeholder="e.g., 5kW Solar Installation"
                                value={orderDetails}
                                onChange={(e) => setOrderDetails(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic">💡 Tip: Customer info is automatically added when creating from quotations</p>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">Description</label>
                    <textarea
                        rows={3} // Reduced from default to look like visual
                        placeholder="Briefly describe the task requirements and goals..."
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-base text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all placeholder:text-slate-400"
                    ></textarea>
                </div>

                {/* Work Order Upload */}
                <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl border-dashed">
                    <label className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">upload_file</span>
                        Upload Work Order (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            accept="application/pdf,image/*"
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2.5 file:px-4
                                file:rounded-xl file:border-0
                                file:text-sm file:font-bold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100 transition-all cursor-pointer"
                        />
                        {uploadingFile && <span className="text-sm text-blue-600 font-medium animate-pulse">Uploading...</span>}
                        {workOrderUrl && !uploadingFile && (
                            <span className="text-sm text-green-600 font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                Uploaded
                            </span>
                        )}
                    </div>
                    {workOrderUrl && (
                        <div className="mt-2 text-xs text-slate-400 truncate max-w-md">
                            URL: {workOrderUrl.split('/').pop()}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-3 text-lg hover:-translate-y-0.5"
                    >
                        {loading ? 'Assigning...' : 'Assign Task'}
                    </button>
                </div>
            </form>

            <ConfirmationModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onConfirm={() => setShowSuccessModal(false)}
                title="Task Assigned!"
                message="The new task has been successfully assigned to the selected team members."
                confirmText="Awesome"
                cancelText="" // Hide cancel button for success message
                type="success"
            />
        </div>
    );
};

export default ManagerTaskAssignment;
