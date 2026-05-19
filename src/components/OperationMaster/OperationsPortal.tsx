import React from 'react';
import ManagerTaskDashboard from './ManagerTaskDashboard';
import EmployeeProductionView from './EmployeeProductionView';

interface OperationsPortalProps {
    onBack?: () => void;
    prefillData?: any;
}

const OperationsPortal: React.FC<OperationsPortalProps> = ({ onBack, prefillData }) => {
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    return (
        <div className="bg-solarica-bg min-h-full transition-all duration-500">
            <div className="space-y-6 md:space-y-8">

                {/* 1. Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {onBack && (
                                <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-slate-700">arrow_back</span>
                                </button>
                            )}
                            <h1 className={`${!onBack ? '' : ''} text-4xl font-black text-slate-900 tracking-tight`}>Task Assignment & Progress</h1>
                        </div>
                        <p className={`text-lg text-slate-500 font-medium ${onBack ? 'ml-12' : ''}`}>Manage team tasks and track project completion status effectively.</p>
                    </div>
                </div>

                {/* 3. Main Content Area */}
                <div className="space-y-8">
                    {/* Manager Section - Create Assignment */}
                    <section>
                        <ManagerTaskDashboard
                            onTaskAssigned={() => setRefreshTrigger(prev => prev + 1)}
                            prefillData={prefillData}
                        />
                    </section>

                    {/* Employee Section - Active Tasks List */}
                    <section>
                        <EmployeeProductionView workerId="w1" refreshTrigger={refreshTrigger} />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default OperationsPortal;
