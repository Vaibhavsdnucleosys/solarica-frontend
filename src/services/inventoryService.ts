import { api } from './api';

export interface UnitData {
    symbol: string;
    formalName: string;
    type?: string;
    uqc?: string;
    decimalPlaces?: number;
}

export const createUnit = async (companyId: string, unitData: UnitData) => {
    try {
        const response = await api.post(`/inventory/units/${companyId}`, unitData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create unit');
    }
};

export const getUnits = async (companyId: string) => {
    try {
        const response = await api.get(`/inventory/units/list/${companyId}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch units');
    }
};

export const updateUnit = async (companyId: string, unitId: string, unitData: Partial<UnitData>) => {
    try {
        const response = await api.put(`/inventory/units/${companyId}/${unitId}`, unitData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update unit');
    }
};

export const deleteUnit = async (companyId: string, unitId: string) => {
    try {
        const response = await api.delete(`/inventory/units/${companyId}/${unitId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete unit');
    }
};

export const getUqcCodes = async () => {
    try {
        const response = await api.get('/inventory/units/uqc-codes');
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch UQC codes');
    }
};

// --- STOCK ITEMS ---

export interface StockItemData {
    id?: string;
    name: string;
    alias?: string;
    groupId?: string;
    categoryId?: string;
    unitId?: string;
    gstApplicable?: string;
    hsnSource?: string;
    hsnSac?: string;
    hsnDescription?: string;
    gstRateSource?: string;
    taxabilityType?: string;
    gstRate?: number;
    typeOfSupply?: string;
    rateOfDuty?: number;
    openingQty?: number;
    openingRate?: number;
    openingValue?: number;
}

export const createStockItem = async (companyId: string, itemData: StockItemData) => {
    try {
        const response = await api.post(`/inventory/stock-items/${companyId}`, itemData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create stock item');
    }
};

export const getStockItems = async (companyId: string) => {
    try {
        const response = await api.get(`/inventory/stock-items/list/${companyId}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch stock items');
    }
};

export const getStockItemById = async (companyId: string, itemId: string) => {
    try {
        const response = await api.get(`/inventory/stock-items/${companyId}/${itemId}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch stock item');
    }
};

export const updateStockItem = async (companyId: string, itemId: string, itemData: Partial<StockItemData>) => {
    try {
        const response = await api.put(`/inventory/stock-items/${companyId}/${itemId}`, itemData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update stock item');
    }
};

export const deleteStockItem = async (companyId: string, itemId: string) => {
    try {
        const response = await api.delete(`/inventory/stock-items/${companyId}/${itemId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete stock item');
    }
};

export const searchStockItems = async (companyId: string, query: string) => {
    try {
        const response = await api.get(`/inventory/stock-items/search/${companyId}?query=${query}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to search stock items');
    }
};

// --- STOCK GROUPS ---

export interface StockGroupData {
    id?: string;
    name: string;
    alias?: string;
    underId?: string;
    shouldAddQuantities?: boolean;
    gstApplicable?: string;
    hsnSac?: string;
    hsnDescription?: string;
    taxabilityType?: string;
    gstRate?: number;
}

// --- GODOWNS ---

export interface GodownData {
    id?: string;
    name: string;
    alias?: string;
    underId?: string;
    address?: string;
    contactName?: string;
    contactPhone?: string;
    isDefault?: boolean;
}

export const createGodown = async (companyId: string, godownData: GodownData) => {
    try {
        const response = await api.post(`/inventory/godowns/${companyId}`, godownData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create godown');
    }
};

export const getGodowns = async (companyId: string) => {
    try {
        const response = await api.get(`/inventory/godowns/list/${companyId}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch godowns');
    }
};

export const getGodownById = async (companyId: string, godownId: string) => {
    try {
        const response = await api.get(`/inventory/godowns/${companyId}/${godownId}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch godown');
    }
};

export const updateGodown = async (companyId: string, godownId: string, godownData: Partial<GodownData>) => {
    try {
        const response = await api.put(`/inventory/godowns/${companyId}/${godownId}`, godownData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update godown');
    }
};

export const deleteGodown = async (companyId: string, godownId: string) => {
    try {
        const response = await api.delete(`/inventory/godowns/${companyId}/${godownId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete godown');
    }
};

export const searchGodowns = async (companyId: string, query: string) => {
    try {
        const response = await api.get(`/inventory/godowns/search/${companyId}?query=${query}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to search godowns');
    }
};

// --- STOCK CATEGORIES ---

export interface StockCategoryData {
    id?: string;
    name: string;
    alias?: string;
    underId?: string;
}

export const createStockCategory = async (companyId: string, categoryData: StockCategoryData) => {
    try {
        const response = await api.post(`/inventory/stock-categories/${companyId}`, categoryData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create stock category');
    }
};

export const getStockCategories = async (companyId: string) => {
    try {
        const response = await api.get(`/inventory/stock-categories/list/${companyId}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch stock categories');
    }
};

export const getStockCategoryById = async (companyId: string, categoryId: string) => {
    try {
        const response = await api.get(`/inventory/stock-categories/${companyId}/${categoryId}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch stock category');
    }
};

export const updateStockCategory = async (companyId: string, categoryId: string, categoryData: Partial<StockCategoryData>) => {
    try {
        const response = await api.put(`/inventory/stock-categories/${companyId}/${categoryId}`, categoryData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update stock category');
    }
};

export const deleteStockCategory = async (companyId: string, categoryId: string) => {
    try {
        const response = await api.delete(`/inventory/stock-categories/${companyId}/${categoryId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete stock category');
    }
};

export const searchStockCategories = async (companyId: string, query: string) => {
    try {
        const response = await api.get(`/inventory/stock-categories/search/${companyId}?query=${query}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to search stock categories');
    }
};

export const createStockGroup = async (companyId: string, groupData: StockGroupData) => {
    try {
        const response = await api.post(`/inventory/stock-groups/${companyId}`, groupData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create stock group');
    }
};

export const getStockGroups = async (companyId: string) => {
    try {
        const response = await api.get(`/inventory/stock-groups/list/${companyId}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch stock groups');
    }
};

export const getStockGroupById = async (companyId: string, groupId: string) => {
    try {
        const response = await api.get(`/inventory/stock-groups/${companyId}/${groupId}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch stock group');
    }
};

export const updateStockGroup = async (companyId: string, groupId: string, groupData: Partial<StockGroupData>) => {
    try {
        const response = await api.put(`/inventory/stock-groups/${companyId}/${groupId}`, groupData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update stock group');
    }
};

export const deleteStockGroup = async (companyId: string, groupId: string) => {
    try {
        const response = await api.delete(`/inventory/stock-groups/${companyId}/${groupId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete stock group');
    }
};

export const searchStockGroups = async (companyId: string, query: string) => {
    try {
        const response = await api.get(`/inventory/stock-groups/search/${companyId}?query=${query}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to search stock groups');
    }
};
