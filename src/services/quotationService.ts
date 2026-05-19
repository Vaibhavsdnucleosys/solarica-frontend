import axios from 'axios';
import { API_URL, getAxiosConfig } from '../config';

// Helper to get auth details for internal use if needed
const getAuthDetails = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let userId = null;
    if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id;
    }
    return { token, userId };
};

export const getAllQuotations = async (company?: string) => {
    const config: any = getAxiosConfig();
    if (company) {
        config.params = { ...config.params, company };
    }
    const response = await axios.get(`${API_URL}/quotations`, config);
    // Return full response data so callers can check dbOffline flag
    // Callers should use response.quotations for the array
    return response.data; // { message, quotations: [], dbOffline?: true }
};

export const getQuotationById = async (id: string) => {
    const response = await axios.get(`${API_URL}/quotations/${id}`, getAxiosConfig());
    return response.data;
};

export const createQuotation = async (quotationData: any) => {
    const response = await axios.post(`${API_URL}/quotations`, quotationData, getAxiosConfig());
    return response.data.data;
};

// export const updateQuotationStatus = async (id: string, action: string) => {
//     // action: 'accepted' | 'rejected' | 'followup'
//     // Note: This matches the public GET endpoint for respond/:id
//     const response = await axios.get(`${API_URL}/quotations/respond/${id}?action=${action}`);
//     return response.data;
// };

export const updateQuotationStatus = async (
    id: string,
    status: string
) => {

    const response = await axios.put(

        `${API_URL}/quotations/${id}`,

        {
            status: status
        },

        getAxiosConfig()
    );

    return response.data;
};

export const updateQuotation = async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/quotations/${id}`, data, getAxiosConfig());
    return response.data;
};

export const sendQuotationEmail = async (id: string) => {
    const response = await axios.post(`${API_URL}/quotations/${id}/send-email`, {}, getAxiosConfig());
    return response.data;
};

export const deleteQuotation = async (id: string) => {
    const response = await axios.delete(`${API_URL}/quotations/${id}`, getAxiosConfig());
    return response.data;
};

export const getPDFDownloadUrl = async (id: string) => {
    const response = await axios.get(`${API_URL}/quotations/${id}/download-pdf`, getAxiosConfig());
    return response.data.url;
};

export const getServiceTypes = async () => {
    const response = await axios.get(`${API_URL}/quotations/service-types`);
    return response.data.serviceTypes;
};

export const getNextEstimateNumber = async (companyName: string): Promise<string> => {
    const response = await axios.get(`${API_URL}/quotations/next-estimate-number`, {
        ...getAxiosConfig(),
        params: { companyName }
    });
    return response.data.nextEstimateNumber;
};

export const uploadPaymentProof = async (quotationId: string, file: File, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await axios.post(
        `${API_URL}/quotations/${quotationId}/proofs`,
        formData,
        getAxiosConfig()
    );
    return response.data;
};

export const getPaymentProofs = async (quotationId: string) => {
    const response = await axios.get(`${API_URL}/quotations/${quotationId}/proofs`, getAxiosConfig());
    return response.data;
};

export const getQuotationDocs = async (id: string) => {
    const response = await axios.get(`${API_URL}/quotations/${id}/view-docs`, getAxiosConfig());
    return response.data.data;
};

export const deletePaymentProof = async (proofId: string) => {
    const response = await axios.delete(`${API_URL}/quotations/proofs/${proofId}`, getAxiosConfig());
    return response.data;
};

export const uploadQuotationDocuments = async (quotationId: string, files: { [key: string]: File | null }) => {
    const formData = new FormData();
    if (files.aadharCard) formData.append('doc1', files.aadharCard);
    if (files.panCard) formData.append('doc2', files.panCard);
    // Add other docs if needed

    const response = await axios.post(
        `${API_URL}/quotations/${quotationId}/upload-docs`,
        formData,
        getAxiosConfig()
    );
    return response.data;
};

export const createProductionFromQuotation = async (quotationId: string, productionData: any) => {
    const response = await axios.post(
        `${API_URL}/quotations/${quotationId}/create-production-task`,
        productionData,
        getAxiosConfig()
    );
    return response.data;
};

export const convertToProforma = async (
  id: string,
  data?: {
    advancedEnabled?: boolean;
    additionalAmount?: number;
  }
) => {

  const response = await axios.patch(
    `${API_URL}/quotations/${id}/proforma`,
    data,
    getAxiosConfig()
  );

  return response.data;
};