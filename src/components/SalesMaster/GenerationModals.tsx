import React from 'react';
import ReactDOM from 'react-dom';
import { Loader2, CheckCircle2, X } from 'lucide-react';

interface GeneratingModalProps {
    isOpen: boolean;
    progress: number;
}

export const GeneratingModal: React.FC<GeneratingModalProps> = ({ isOpen, progress }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-10 animate-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                        <div className="size-20 rounded-full bg-blue-50 flex items-center justify-center">
                            <Loader2 className="size-10 text-blue-600 animate-spin" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                            <div className="size-8 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                                {Math.round(progress)}%
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-800">Generating Quotation</h3>
                        <p className="text-slate-500 font-medium">Please wait while we prepare your document...</p>
                    </div>

                    <div className="w-full space-y-3">
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Processing</span>
                            <span>{progress === 100 ? 'Complete' : 'Working...'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center space-y-6 pt-2">
                    <div className="size-20 rounded-full bg-emerald-50 flex items-center justify-center animate-bounce shadow-xl shadow-emerald-500/10">
                        <CheckCircle2 className="size-12 text-emerald-600" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Quotation Generated!</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            The quotation has been created successfully. You can now view, download, or email it from the dashboard.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transform active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20"
                    >
                        Great, Thanks!
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

