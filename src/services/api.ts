import { API_URL, getAuthHeaders } from '../config';
import axios from 'axios';

export const getEmployees = async () => {
    const response = await fetch(`${API_URL}/employees`, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
};

// export const createEmployee = async (employeeData: any) => {
//     // Map frontend fields (category) to backend (roleName)
//     const payload = {
//         name: employeeData.name,
//         email: employeeData.email,
//         password: employeeData.password,
//         roleName: employeeData.category, // Mapped
//         grants: employeeData.grants,
//         mobile: employeeData.mobile // Added mobile field
//     };

//     const response = await fetch(`${API_URL}/employees`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             ...getAuthHeaders() // Add Auth header
//         },
//         body: JSON.stringify(payload)
//     });

//     if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Failed to create employee');
//     }
//     return response.json();
// };

export const createEmployee = async (employeeData: any) => {
    // We must include 'company' here, otherwise it is never sent to the backend
    const payload = {
        name: employeeData.name,
        email: employeeData.email,
        password: employeeData.password,
        roleName: employeeData.roleName, // Modal uses roleName, backend expects roleName
        company: employeeData.company,   // <--- THIS WAS MISSING
        mobile: employeeData.mobile,
        grants: employeeData.grants
    };

    const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create employee');
    }
    return response.json();
};

export const deleteEmployee = async (id: string) => {
    const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete employee');
    }
    return response.json();
};

// Upload Work Order
export const uploadWorkOrder = async (file: File): Promise<{ success: boolean; url: string; filePath: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/production-tasks/upload-work-order`, formData, {
        headers: {
            // 'Content-Type': 'multipart/form-data', // Let browser set boundary
            ...getAuthHeaders(),
        },
    });
    return response.data;
};

// --- QUOTATION ---

export const getTeams = async () => {
    const response = await fetch(`${API_URL}/teams`, {
        headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch teams');
    return response.json();
};

export const createTeam = async (teamData: { name: string; location: string; leaderId: string }) => {
    const response = await fetch(`${API_URL}/teams`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(teamData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create team');
    }
    return response.json();
};

export const deleteTeam = async (id: string) => {
    const response = await fetch(`${API_URL}/teams/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete team');
    }
    return response.json();
};

export const getWorkersWithoutTeam = async () => {
    const response = await fetch(`${API_URL}/teams/workers/without-team`, {
        headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch available workers');
    return response.json();
};

export const addWorkerToTeam = async (teamId: string, workerId: string) => {
    const response = await fetch(`${API_URL}/teams/add-worker`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ teamId, workerId })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add worker');
    }
    return response.json();
};

export const removeWorkerFromTeam = async (workerId: string) => {
    const response = await fetch(`${API_URL}/teams/remove-worker`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ workerId })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove worker');
    }
    return response.json();
};

// --- Production Task APIs ---

export interface ProductionTask {
    id: string;
    description: string;
    assigneeId: string;
    assigneeName: string;
    assignees?: { id: string; name: string }[];
    assigneeProgress?: { assigneeId: string, completedQuantity: number }[];
    targetQuantity: number;
    completedQuantity: number;
    startDate: string;
    deadline?: string;
    status: 'Pending' | 'In Progress' | 'Production Done' | 'Dispatched' | 'Delayed';
    priority: 'High' | 'Medium' | 'Low';
    category?: string;
    dispatchDate?: string;
    dispatchNotes?: string;
    dispatchQty?: number;
    // Integration fields - linking to Sales
    quotationId?: string;
    customerName?: string;
    customerEmail?: string;
    orderDetails?: string;
    systemCapacity?: number;
    deliveryAddress?: string;
    workOrderUrl?: string; // Added workOrderUrl
}

export const getProductionTasks = async () => {
    const response = await fetch(`${API_URL}/production-tasks`, {
        headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    const data = await response.json();
    return data.tasks || data;
};

export const assignProductionTask = async (taskData: any) => {
    const response = await fetch(`${API_URL}/production-tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(taskData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign task');
    }
    return response.json();
};

export const updateProductionTask = async (taskId: string, updateData: any) => {
    const response = await fetch(`${API_URL}/production-tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(updateData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update task');
    }
    return response.json();
};

export const getProductionTasksByAssignee = async (assigneeId: string) => {
    const response = await fetch(`${API_URL}/production-tasks/assignee/${assigneeId}`, {
        headers: { ...getAuthHeaders() }
    });
    if (!response.ok) throw new Error('Failed to fetch user tasks');
    const data = await response.json();
    return data.tasks || data;
};
export const deleteProductionTask = async (id: string) => {
    const response = await fetch(`${API_URL}/production-tasks/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete task');
    }
    return response.json();
};


export const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



// export const importHsn = async (file: File) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const token = localStorage.getItem("token"); // 👈 get token

//   const response = await axios.post(
//     `${API_URL}/hsn-master/import`,
//     formData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`, // 👈 REQUIRED
//       },
//     }
//   );

//   return response.data;
// };



export const importHsn = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/hsn-master/import", formData);

  return response.data;
};

export const updateEmployee = async (
  id: string,
  data: any
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/employees/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
};