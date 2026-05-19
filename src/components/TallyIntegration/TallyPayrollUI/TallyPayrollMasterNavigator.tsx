import React, { useState } from 'react';
import TallyEmployeeCategoryList from './TallyEmployeeCategoryList';
import TallyEmployeeGroupList from './TallyEmployeeGroupList';
import TallyEmployeeList from './TallyEmployeeList';
import TallyAttendanceTypeList from './TallyAttendanceTypeList';
import TallyPayHeadList from './TallyPayHeadList';
import TallyPayrollUnitList from './TallyPayrollUnitList';
import TallySalaryStructureCreation from './TallySalaryStructureCreation';

interface TallyPayrollMasterNavigatorProps {
    masterType: string;
    onClose: () => void;
    companyId: string;
}

const TallyPayrollMasterNavigator: React.FC<TallyPayrollMasterNavigatorProps> = ({ masterType, onClose, companyId }) => {
    switch (masterType) {
        case 'employee-categories':
            return <TallyEmployeeCategoryList onClose={onClose} companyId={companyId} />;
        case 'employee-groups':
            return <TallyEmployeeGroupList onClose={onClose} companyId={companyId} />;
        case 'employees':
            return <TallyEmployeeList onClose={onClose} companyId={companyId} />;
        case 'attendance-types':
            return <TallyAttendanceTypeList onClose={onClose} companyId={companyId} />;
        case 'pay-heads':
            return <TallyPayHeadList onClose={onClose} companyId={companyId} />;
        case 'units-work':
            return <TallyPayrollUnitList onClose={onClose} companyId={companyId} />;
        case 'salary-structures':
            return <TallySalaryStructureCreation onClose={onClose} companyId={companyId} />;
        default:
            return (
                <div className="h-screen flex items-center justify-center bg-[#e8f6fa]">
                    <div className="bg-white p-8 rounded shadow-lg">
                        <p className="text-lg font-bold mb-4">Master type "{masterType}" not yet implemented</p>
                        <button
                            onClick={onClose}
                            className="bg-[#5b9bd5] text-white px-4 py-2 rounded hover:bg-[#4a8bc4]"
                        >
                            Close
                        </button>
                    </div>
                </div>
            );
    }
};

export default TallyPayrollMasterNavigator;
