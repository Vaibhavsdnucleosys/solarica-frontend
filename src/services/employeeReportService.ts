import axios from 'axios';
import { API_URL, getAxiosConfig } from '../config';

// Interface matching the backend response structure
export interface EmployeeReport {
    employeeId: string;
    email: string;
    // employeeName is commented out in backend, so we rely on email
    // employeeName?: string; 
    totalClientsVisited: number;
    totalClientsConverted: number;
    successRate: number;
    serviceTypesOffered: string[];
    totalDealValue: number;
    totalQuotations: number;
    pendingQuotations: number;
    rejectedQuotations: number;
    followupQuotations: number;
    salesTarget: number;
}

interface EmployeeReportsResponse {
    message: string;
    reports: EmployeeReport[];
}

export const getAllEmployeeReports = async (company?: string): Promise<EmployeeReport[]> => {
    const config: any = getAxiosConfig();
    if (company) {
        config.params = { company };
    }
    const response = await axios.get<EmployeeReportsResponse>(`${API_URL}/employee-reports`, config);
    return response.data.reports;
};

export const getEmployeeReportSummary = async (company?: string): Promise<any> => {
    const config: any = getAxiosConfig();
    if (company) {
        config.params = { company };
    }
    const response = await axios.get(`${API_URL}/employee-reports/summary`, config);
    return response.data;
};

export const getMonthlySalesReport = async (months = 12, year?: number, company?: string): Promise<any> => {
    const config: any = getAxiosConfig();
    config.params = { months };
    if (year) config.params.year = year;
    if (company) config.params.company = company;

    const response = await axios.get(`${API_URL}/employee-reports/monthly-sales-report`, config);
    return response.data.data;
};

export const getSpecificEmployeeReport = async (id: string, company?: string): Promise<EmployeeReport> => {
    const config: any = getAxiosConfig();
    if (company) {
        config.params = { company };
    }
    const response = await axios.get(`${API_URL}/employee-reports/${id}`, config);
    return response.data.report;
};

export const updateEmployeeTarget = async (employeeId: string, salesTarget: number): Promise<void> => {
    await axios.patch(`${API_URL}/employees/${employeeId}/target`, { salesTarget }, getAxiosConfig());
};
