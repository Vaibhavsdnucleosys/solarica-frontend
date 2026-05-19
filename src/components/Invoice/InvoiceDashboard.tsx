import React, { useState } from 'react';
import InvoiceList from './InvoiceList';
import CreateInvoiceForm from './CreateInvoiceForm';
import DashboardHeader from '../DashboardHeader';

const InvoiceDashboard: React.FC<{ user: any }> = ({ user }) => {
    const [view, setView] = useState<'list' | 'create'>('list');

    return (
        <div className="px-2 py-6 min-h-screen">
            <div className="mb-6">
                <DashboardHeader
                    title={view === 'create' ? "New Invoice" : "Invoices Management"}
                    user={user}
                    hideSearch={true}
                    hideNotifications={false}
                />
            </div>

            {view === 'list' ? (
                <InvoiceList onCreateClick={() => setView('create')} />
            ) : (
                <CreateInvoiceForm
                    onBack={() => setView('list')}
                    onSuccess={() => setView('list')}
                />
            )}
        </div>
    );
};

export default InvoiceDashboard;
