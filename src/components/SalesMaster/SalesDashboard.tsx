import React, { useState, useEffect } from 'react';
import CreateQuotationModal from './CreateQuotationModal';
import QuotationDashboard from './QuotationDashboard';
import { getAllQuotations, createQuotation } from '../../services/quotationService';
import { FileText, CheckCircle2, TrendingUp, FileBarChart } from 'lucide-react';
import LeadsDashboard from './LeadsDashboard';
import EmployeeReport from './EmployeeReport';

interface SalesDashboardProps {
    selectedView?: string;
    onBack?: () => void;
    user?: {
        name: string;
        role: string;
        image?: string;
        email: string;
    };
}

const SalesDashboard: React.FC<SalesDashboardProps> = ({ selectedView, onBack, user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quotations, setQuotations] = useState<any[]>([]);

    const fetchQuotations = async () => {
        try {
            const data = await getAllQuotations();
            if (data && data.quotations) {
                setQuotations(data.quotations);
            }
        } catch (error) {
            console.error('Error fetching quotations:', error);
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    const handleCreateQuotation = async (formData: FormData) => {
        await createQuotation(formData);
        await fetchQuotations();
        setIsModalOpen(false);
    };

    const renderContent = () => {
        switch (selectedView) {
            case 'quotation-module':
                return <QuotationDashboard user={user} />;
            case 'leads-management':
                return <LeadsDashboard user={user} />;
            case 'employee-report':
                return <EmployeeReport user={user} />;
            default:
                return (
                    <div className="p-8">
                        <div className="animate-pulse bg-slate-100 h-96 rounded-[2.5rem]"></div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col font-display bg-background-light min-h-screen">
            {renderContent()}

            {/* Modal */}
            <CreateQuotationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateQuotation}
            />
        </div>
    );
};


export default SalesDashboard;
