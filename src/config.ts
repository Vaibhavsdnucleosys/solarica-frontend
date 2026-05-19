export const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = `${API_BASE_URL}/api/v1`;

// Helper to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper for axios config
export const getAxiosConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        }
    };
};
