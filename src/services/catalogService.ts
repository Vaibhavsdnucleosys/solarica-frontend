import axios from 'axios';
import { API_URL, getAxiosConfig } from '../config';

export interface Product {
    id: string;
    model: string;
    description: string;
    image?: string;
    hsnSac: string;
    price: number;
    watt?: number;
    type?: string; // New field for DCR/NON-DCR
    isSolarPanel?: boolean;
    category: 'solarHeaters' | 'solarPanels' | 'solarInverters' | 'decorativeLights' | 'solarCameras';
    features?: string[];
    specifications?: Record<string, string>;
}

export interface CatalogData {
    solarHeaters: Product[];
    solarPanels: Product[];
    solarInverters: Product[];
    decorativeLights: Product[];
    solarCameras: Product[];
    solarPumpDc?: any[];
    solarAcPumpController?: any[];
    solarStreetLightAllInOne?: any[];
}

export const getCatalog = async (): Promise<CatalogData> => {
    const response = await axios.get(`${API_URL}/catalog`, getAxiosConfig());
    return response.data.data;
};

export const getCategoryCatalog = async (category: string): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/catalog/${category}`, getAxiosConfig());
    return response.data.data;
};
