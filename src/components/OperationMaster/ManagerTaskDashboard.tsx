import React, { useState, useEffect } from 'react';
import ManagerTaskAssignment from './ManagerTaskAssignment';
import { getProductionTasks, ProductionTask } from '../../services/api';

interface ManagerTaskDashboardProps {
    onTaskAssigned?: () => void;
    prefillData?: any;
}

const ManagerTaskDashboard: React.FC<ManagerTaskDashboardProps> = ({ onTaskAssigned, prefillData }) => {
    const [tasks, setTasks] = useState<ProductionTask[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getProductionTasks();
            setTasks(data || []);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <ManagerTaskAssignment
                onTaskAssigned={() => {
                    loadData();
                    if (onTaskAssigned) onTaskAssigned();
                }}
                currentTasks={tasks}
                prefillData={prefillData}
            />
        </div>
    );
};

export default ManagerTaskDashboard;
