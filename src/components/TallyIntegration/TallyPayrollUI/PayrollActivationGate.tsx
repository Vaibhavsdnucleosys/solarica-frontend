import React from 'react';
import { activatePayroll } from '../../../services/accountingService';

interface PayrollActivationGateProps {
    isOpen: boolean;
    onClose: () => void;
    onActivate: () => void;
    companyName?: string;
    companyId?: string;
}

const PayrollActivationGate: React.FC<PayrollActivationGateProps> = ({
    isOpen,
    onClose,
    onActivate,
    companyName,
    companyId
}) => {
    if (!isOpen) return null;

    const handleActivate = async () => {
        if (!companyId || companyId.length < 10) {
            console.error("Invalid companyId for activation:", companyId);
            alert("Please select a valid company before activating payroll.");
            return;
        }
        console.log("Attempting to activate payroll for company:", companyId);
        try {
            const result = await activatePayroll(companyId);
            console.log("Activation result:", result);
            onActivate();
        } catch (error: any) {
            console.error("Failed to activate payroll. Error object:", error);
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
                alert(`Failed to activate payroll: ${error.response.data?.message || 'Server error'}`);
            } else if (error.request) {
                console.error("Error request:", error.request);
                alert("Failed to activate payroll: No response from server. Check your connection.");
            } else {
                console.error("Error message:", error.message);
                alert(`Failed to activate payroll: ${error.message}`);
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-white border-2 border-[#2a5585] shadow-2xl w-[450px] font-sans overflow-hidden">
                {/* Header */}
                <div className="px-4 py-2 border-b border-gray-300 bg-[#2a5585] text-white text-center font-bold text-[14px] flex justify-between items-center">
                    <span>Activate Payroll</span>
                    <button
                        onClick={onClose}
                        className="hover:bg-red-500 px-1 rounded transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 bg-white text-[13px] text-black">
                    <p className="mb-4 leading-relaxed">
                        Payroll is not activated for this company.
                    </p>
                    <p className="mb-6 leading-relaxed">
                        To use Employee, Pay Heads, and Salary features, you must activate Payroll.
                    </p>

                    {companyName && (
                        <div className="bg-[#def1fc] p-2 border border-[#8ec2eb] rounded-sm mb-2">
                            <span className="text-gray-600 font-bold uppercase text-[10px] block mb-1">Company</span>
                            <span className="font-bold text-[#1b2c3c]">{companyName}</span>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-4 py-3 bg-[#f5f5f5] border-t border-gray-200 flex justify-end gap-3">
                    <button
                        className="px-4 py-1.5 text-[13px] font-bold text-white bg-[#2a5585] hover:bg-[#24476d] rounded-sm transition-colors shadow-sm"
                        onClick={handleActivate}
                    >
                        Activate Payroll
                    </button>
                    <button
                        className="px-4 py-1.5 text-[13px] font-bold text-gray-700 hover:bg-gray-200 border border-gray-400 rounded-sm transition-colors"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayrollActivationGate;
