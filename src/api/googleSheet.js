import axios from 'axios';

// Node.js Backend URL
const API_BASE_URL = '/api';

export const api = {
    // --- AUTH ---
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
            return response.data;
        } catch (error) {
            console.error("Login Error:", error);
            return { valid: false, message: 'Connection Error' };
        }
    },

    // --- EMPLOYEES ---
    addEmployee: async (employee) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/employees`, employee);
            return response.data;
        } catch (error) {
            console.error("Add Employee Error:", error);
            return { status: 'error', message: 'Connection Error' };
        }
    },

    // --- TASKS ---
    getTasks: async (userId, role) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tasks`, {
                params: { userId, role }
            });
            return response.data;
        } catch (error) {
            console.error("Get Tasks Error:", error);
            return [];
        }
    },

    addTask: async (task) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tasks`, task);
            return response.data;
        } catch (error) {
            console.error("Add Task Error:", error);
            return { status: 'error', message: 'Failed to add task' };
        }
    },

    approveTask: async (rowIndex, signature, pmName) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/approve`, {
                rowIndex, // This is now the DB ID
                signature,
                pmName
            });
            return response.data;
        } catch (error) {
            console.error("Approve Task Error:", error);
            return { status: 'error', message: 'Approval Failed' };
        }
    },

    // --- DELETE TASK ---
    deleteTask: async (taskId, empId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
                data: { empId }
            });
            return response.data;
        } catch (error) {
            console.error("Delete Task Error:", error);
            return { status: 'error', message: 'Delete Failed' };
        }
    },

    // --- STATS ---
    getStats: async (userId, role) => {
        return {
            total: 0,
            completed: 0,
            pending: 0,
            unapproved: 0
        };
        // TODO: Implement stats endpoint in backend if needed, 
        // or let frontend calculate from getTasks response as before.
    }
};
