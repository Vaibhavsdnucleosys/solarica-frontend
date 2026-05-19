import React from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'success' | 'warning' | 'error' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'info'
}) => {
    if (!isOpen) return null;

    const typeStyles = {
        success: {
            bg: 'bg-emerald-50',
            icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
            button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20',
            border: 'border-emerald-100'
        },
        warning: {
            bg: 'bg-amber-50',
            icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
            button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20',
            border: 'border-amber-100'
        },
        error: {
            bg: 'bg-red-50',
            icon: <AlertCircle className="w-8 h-8 text-red-600" />,
            button: 'bg-red-600 hover:bg-red-700 shadow-red-500/20',
            border: 'border-red-100'
        },
        info: {
            bg: 'bg-blue-50',
            icon: <Info className="w-8 h-8 text-blue-600" />,
            button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
            border: 'border-blue-100'
        }
    };

    const styles = typeStyles[type];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 border border-slate-100`}>
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl ${styles.bg} flex items-center justify-center border ${styles.border}`}>
                            {styles.icon}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                        {title}
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        {message}
                    </p>

                    <div className="mt-8 flex gap-3">
                        {cancelText && (
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-6 py-4 text-white font-bold rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 ${styles.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
