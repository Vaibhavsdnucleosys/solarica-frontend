import axios from 'axios';
import { API_URL, getAxiosConfig } from '../config';

export interface Lead {
    id: string;
    name: string;
    company?: string;
    email: string;
    phone: string;
    source: string;
    status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
    estimatedValue?: number;
    notes?: string;
    gstin?: string;
    createdAt: string;
    updatedAt: string;
}

export const getLeads = async (filters?: any): Promise<Lead[]> => {
    const response = await axios.get(`${API_URL}/leads`, {
        ...getAxiosConfig(),
        params: filters
    });
    return response.data.data;
};

export const searchLeads = async (query: string): Promise<Lead[]> => {
    const response = await axios.get(`${API_URL}/leads`, {
        ...getAxiosConfig(),
        params: { search: query }
    });
    return response.data.data;
};

export const getRecentLeads = async (): Promise<Lead[]> => {
    // Assuming backend sorts by createdAt desc by default or we can pass sort
    // If backend doesn't support 'sort' param, we might need to sort client side.
    // For now, let's try passing typical query params, but if not, we engage standard getLeads.
    const response = await axios.get(`${API_URL}/leads`, {
        ...getAxiosConfig(),
        params: { limit: 10, sort: '-createdAt' } // Attempting standard params
    });
    // Fallback if backend API structure returns wrapped data
    const data = response.data.data || response.data;

    // Client-side sort fallback if needed (simplified assumption: API returns recent first or we trust it)
    return Array.isArray(data) ? data.slice(0, 10) : [];
};

export const getLead = async (id: string): Promise<Lead> => {
    const response = await axios.get(`${API_URL}/leads/${id}`, getAxiosConfig());
    return response.data.data;
};

export const createLead = async (leadData: Partial<Lead>): Promise<Lead> => {
    const response = await axios.post(`${API_URL}/leads`, leadData, getAxiosConfig());
    return response.data.data;
};

export const updateLead = async (id: string, leadData: Partial<Lead>): Promise<Lead> => {
    const response = await axios.put(`${API_URL}/leads/${id}`, leadData, getAxiosConfig());
    return response.data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/leads/${id}`, getAxiosConfig());
};

export const getLeadStats = async (): Promise<any> => {
    const response = await axios.get(`${API_URL}/leads/stats`, getAxiosConfig());
    return response.data.data;
};

export const getLeadEmails = async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/leads/emails`, getAxiosConfig());
    return response.data.data;
};

export const searchInternationalLeads = async (query: string) => {
  const res = await searchLeads(query); // existing API
  const data = res || [];

  // ✅ FILTER ONLY INTERNATIONAL
  return data.filter((lead: any) => lead.customerType === "International");
};