import React, { useState } from 'react';
import type { ReconciliationSummaryProps } from '../types';

/**
 * ReconciliationSummary - Bottom summary bar showing:
 * - Balance as per Company Books
 * - Amounts not reflected in Bank (with breakdown)
 * - Balance as per Bank
 */
const ReconciliationSummary: React.FC<ReconciliationSummaryProps> = ({ summary }) => {
    const [showBreakdown, setShowBreakdown] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Math.abs(amount));
    };

    const getSign = (amount: number) => {
        if (amount < 0) return 'Cr';
        if (amount > 0) return 'Dr';
        return '';
    };

    const hasBreakdown = summary.chequesIssuedNotCleared !== undefined ||
        summary.depositsNotCredited !== undefined;

    return (
        <div className="bg-[#f0f7fa] border-t-2 border-[#2d819b] px-4 py-2.5 shrink-0 relative z-20">
            <div className="flex justify-end items-center text-[13px] gap-8">
                {/* Balance as per Company Books */}
                <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Balance as per Company Books:</span>
                    <span className="font-bold text-gray-900 min-w-[110px] text-right">
                        ₹ {formatCurrency(summary.balanceAsPerBooks)} {getSign(summary.balanceAsPerBooks)}
                    </span>
                </div>

                {/* Amounts not reflected in Bank */}
                <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Amounts not reflected in Bank:</span>
                    <span className={`font-bold min-w-[110px] text-right ${summary.amountsNotReflectedInBank !== 0 ? 'text-orange-600' : 'text-gray-700'}`}>
                        ₹ {formatCurrency(summary.amountsNotReflectedInBank)} {getSign(summary.amountsNotReflectedInBank)}
                    </span>
                </div>

                {/* Balance as per Bank */}
                <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-bold">Balance as per Bank:</span>
                    <span className="font-bold text-[#2d819b] min-w-[110px] text-right text-[14px]">
                        ₹ {formatCurrency(summary.balanceAsPerBank)} {getSign(summary.balanceAsPerBank)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ReconciliationSummary;

