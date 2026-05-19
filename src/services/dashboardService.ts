import axios from 'axios';
import { API_URL, getAxiosConfig } from '../config';

// Dashboard Overview
export const getDashboardOverview = async () => {

    const response = await axios.get(
        `${API_URL}/dashboard/overview`,
        getAxiosConfig()
    );

    return response.data.data;
};

// Company Wise Dashboard
export const getCompanyDashboard = async (
    company?: string
) => {

    const config: any =
        getAxiosConfig();

    if (company) {

        config.params = {
            ...config.params,
            company
        };
    }

    const response = await axios.get(
        `${API_URL}/dashboard/company-overview`,
        config
    );

    return response.data.data;
};

// Revenue Analytics
export const getRevenueAnalytics = async () => {

    const response = await axios.get(
        `${API_URL}/dashboard/revenue`,
        getAxiosConfig()
    );

    return response.data.data;
};

// Production Analytics
export const getProductionAnalytics = async () => {

    const response = await axios.get(
        `${API_URL}/dashboard/production`,
        getAxiosConfig()
    );

    return response.data.data;
};

// Financial Summary
export const getFinancialSummary = async () => {

    const response = await axios.get(
        `${API_URL}/dashboard/financial-summary`,
        getAxiosConfig()
    );

    return response.data.data;
};