import { API_URL, getAuthHeaders } from '../config';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    isRead: boolean;
    createdAt: string;
    quotationId?: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await fetch(`${API_URL}/notifications`, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    const data = await response.json();
    return data.notifications;
};

export const markAsRead = async (id: string) => {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return response.json();
};

export const markAllAsRead = async () => {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Failed to mark all notifications as read');
    return response.json();
};

