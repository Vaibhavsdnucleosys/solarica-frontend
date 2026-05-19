import { API_URL, getAuthHeaders } from '../config';

export interface TallyPartyData {
    name: string;
    group: string;
    gstin?: string;
    openingBalance?: number;
}

export interface TallyInvoiceData {
    invoiceNo: string;
    date: string;
    partyName: string;
    amount: number;
    salesLedger: string;
}

export const syncPartyToTally = async (partyData: TallyPartyData) => {
    const response = await fetch(`${API_URL}/crm/party`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(partyData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sync party to Tally');
    }
    return response.json();
};

export const syncInvoiceToTally = async (invoiceData: TallyInvoiceData) => {
    const response = await fetch(`${API_URL}/crm/sales-invoice`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(invoiceData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sync invoice to Tally');
    }
    return response.json();
};

export const getTallyStats = async () => {
    const response = await fetch(`${API_URL}/crm/tally/stats`, {
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch Tally stats');
    }
    return response.json();
};
