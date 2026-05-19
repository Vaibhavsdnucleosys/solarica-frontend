import React, { useEffect, useState } from 'react';
import TallyReportLayout from './TallyReportLayout';
import { getLedgerStatement, LedgerStatementData, getAccountGroups, DEFAULT_COMPANY_ID } from '../../services/accountingService';
import { Loader2, AlertCircle } from 'lucide-react';
import { exportTableToExcel } from '../../utils/excelExport';

export interface LedgerStatementProps {
    onBack: () => void;
    companyId?: string;
    companyName?: string;
    initialLedgerId?: string;
}

const LedgerStatement: React.FC<LedgerStatementProps> = ({ onBack, companyId = DEFAULT_COMPANY_ID, companyName, initialLedgerId }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<LedgerStatementData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ledgerId, setLedgerId] = useState(initialLedgerId || '');
    const [ledgers, setLedgers] = useState<any[]>([]);

    useEffect(() => {
        const fetchLedgers = async () => {
            try {
                const groups = await getAccountGroups(companyId);
                const allLedgers: any[] = [];
                groups.forEach((g: any) => {
                    if (g.ledgers) allLedgers.push(...g.ledgers);
                });
                setLedgers(allLedgers);
                if (!ledgerId && allLedgers.length > 0) {
                    setLedgerId(allLedgers[0].id);
                }
            } catch (err) {
                console.error("Failed to load ledgers", err);
            }
        };
        fetchLedgers();
    }, [companyId]);

    useEffect(() => {
        if (!ledgerId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getLedgerStatement(ledgerId);
                setData(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch ledger statement');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ledgerId]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Math.abs(amount));
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <TallyReportLayout
            title="Ledger Statement"
            companyName="Solarica"
            period="1-Apr-25 to 31-Mar-26"
            onBack={onBack}
            sidebarButtons={[
                { keyName: 'F4', label: 'Ledger', onClick: () => { } },
                { label: 'SEPARATOR' },
                { keyName: 'E', label: 'Export', onClick: () => exportTableToExcel('ledger-statement-table', `Ledger_Statement_${data?.ledger?.name || 'Solarica'}_${new Date().toISOString().split('T')[0]}`), underline: 'single' },
                { keyName: 'F2', label: 'Period' },
                { keyName: 'F12', label: 'Configure' },
            ]}
        >
            <div className="flex flex-col h-full bg-white font-sans text-[13px] text-[#1b2c3c]">
                {/* Ledger Quick Selection */}
                <div className="bg-[#f2faff] px-4 py-2 border-b border-[#cbd5e1] flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-[#2a5585]">Ledger:</span>
                        <select
                            value={ledgerId}
                            onChange={(e) => setLedgerId(e.target.value)}
                            className="bg-white border border-[#2a5585] text-[13px] px-2 py-0.5 outline-none font-bold min-w-[250px]"
                        >
                            <option value="">Select Ledger...</option>
                            {ledgers.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>
                    {data && (
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-gray-500">Opening Balance</span>
                            <span className="font-bold">{formatCurrency(data.ledger.openingBalance)} {data.ledger.openingType}</span>
                        </div>
                    )}
                </div>

                {/* Table Layout */}
                <div className="flex-1 overflow-auto flex flex-col">
                    <table id="ledger-statement-table" className="w-full border-collapse flex-1 flex flex-col">
                        <thead className="sticky top-0 bg-white z-10 shrink-0 block">
                            <tr className="border-b border-[#cbd5e1] font-bold text-[14px] flex w-full">
                                <th className="text-left px-4 py-1.5 border-r border-[#cbd5e1] w-32">Date</th>
                                <th className="text-left px-4 py-1.5 border-r border-[#cbd5e1] flex-1">Particulars</th>
                                <th className="text-left px-4 py-1.5 border-r border-[#cbd5e1] w-32">Vch Type</th>
                                <th className="text-left px-4 py-1.5 border-r border-[#cbd5e1] w-32">Vch No.</th>
                                <th className="text-right px-4 py-1.5 border-r border-[#cbd5e1] w-[130px]">Debit</th>
                                <th className="text-right px-4 py-1.5 border-r border-[#cbd5e1] w-[130px]">Credit</th>
                                <th className="text-right px-4 py-1.5 w-[140px]">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="flex-1 flex flex-col">
                            {loading ? (
                                <tr className="flex-1 flex items-center justify-center">
                                    <td colSpan={7} className="py-20 text-center flex-1">
                                        <Loader2 className="w-8 h-8 text-[#2a5585] animate-spin inline-block" />
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {data?.statement.map((row, i) => (
                                        <tr key={i} className="hover:bg-[#def1fc] border-b border-gray-50 group flex w-full shrink-0">
                                            <td className="w-32 px-4 py-1 text-gray-500">{formatDate(row.date)}</td>
                                            <td className="flex-1 px-4 py-1">
                                                <div className="font-bold">{row.particulars || 'Transaction'}</div>
                                                {row.narration && <div className="text-[10px] text-gray-500 font-normal italic">{row.narration}</div>}
                                            </td>
                                            <td className="w-32 px-4 py-1 uppercase text-[11px] font-bold text-gray-600">{row.voucherType || 'JOURNAL'}</td>
                                            <td className="w-32 px-4 py-1 font-bold underline decoration-dotted decoration-gray-400">{row.voucherNo}</td>
                                            <td className="w-[130px] px-4 py-1 text-right font-bold border-l border-[#cbd5e1]/30">
                                                {row.debit > 0 ? formatCurrency(row.debit) : ''}
                                            </td>
                                            <td className="w-[130px] px-4 py-1 text-right font-bold border-l border-[#cbd5e1]/30 text-red-600">
                                                {row.credit > 0 ? formatCurrency(row.credit) : ''}
                                            </td>
                                            <td className="w-[140px] px-4 py-1 text-right font-bold bg-gray-50/30 group-hover:bg-[#def1fc]">
                                                {formatCurrency(row.balance)} {row.balanceType}
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Spacer row to extend vertical lines */}
                                    <tr className="flex-1 flex w-full min-h-[50px]">
                                        <td className="w-32 border-r border-[#cbd5e1]/50"></td>
                                        <td className="flex-1 border-r border-[#cbd5e1]/50"></td>
                                        <td className="w-32 border-r border-[#cbd5e1]/50"></td>
                                        <td className="w-32 border-r border-[#cbd5e1]/50"></td>
                                        <td className="w-[130px] border-r border-[#cbd5e1]/50"></td>
                                        <td className="w-[130px] border-r border-[#cbd5e1]/50"></td>
                                        <td className="w-[140px]"></td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Section */}
                {data && (
                    <div className="border-t-2 border-[#1b2c3c] bg-white shrink-0">
                        <div className="flex font-bold">
                            <div className="flex-1 px-4 py-1 border-r border-[#cbd5e1]">Closing Balance</div>
                            <div className="w-[130px] border-r border-[#cbd5e1]"></div>
                            <div className="w-[130px] border-r border-[#cbd5e1]"></div>
                            <div className="w-[140px] px-4 py-1 text-right">
                                <span className="border-b border-[#1b2c3c]">{formatCurrency(data.closingBalance)} {data.closingType}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TallyReportLayout>
    );
};

export default LedgerStatement;
