import { api } from './api'; // Added curly braces here



// Add this to your existing hsnService.ts
export const findHsnByCode = (code: string) => 
    api.get(`/hsn-master`, { params: { search: code, limit: 1 } });

// New function to fetch multiple HSN suggestions
export const findHsnSuggestions = (code: string, limit: number = 5) => 
    api.get(`/hsn-master`, { params: { search: code, limit } });



export const getHsnMaster = (params: any) =>
    api.get('/hsn-master', { params });

export const createHsn = (data: any) =>
    api.post('/hsn-master', data);

export const updateHsnCode = (id: string, data: any) =>
    api.put(`/hsn-master/${id}`, data);

