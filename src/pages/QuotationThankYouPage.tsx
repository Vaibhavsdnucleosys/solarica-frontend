import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

const QuotationThankYouPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status');
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const isAccepted = status === 'accepted';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-display">
            <div
                className={`bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <div className={`mx-auto size-24 rounded-full flex items-center justify-center mb-8 ${isAccepted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {isAccepted ? (
                        <CheckCircle2 size={48} />
                    ) : (
                        <AlertTriangle size={48} />
                    )}
                </div>

                <h1 className="text-3xl font-bold text-slate-800 mb-4">
                    {isAccepted ? 'Quotation Accepted!' : 'Response Recorded'}
                </h1>

                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    {isAccepted
                        ? "Thank you for accepting the quotation. We have received your confirmation and our team will proceed with the next steps immediately."
                        : "Your response has been recorded. Our team has been notified and will get back to you shortly."}
                </p>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-500">
                        A confirmation email has been sent to your registered email address.
                    </div>

                </div>
            </div>

            <p className="mt-8 text-slate-400 text-sm font-medium">
                &copy; {new Date().getFullYear()} Solarica Energy India Pvt Ltd
            </p>
        </div>
    );
};

export default QuotationThankYouPage;
