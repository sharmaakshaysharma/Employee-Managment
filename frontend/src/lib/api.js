import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getEmployees = () => api.get('/employees/');
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post('/employees/', data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
export const markAttendance = (id, data) => api.post(`/employees/${id}/attendance/`, data);
export const getAttendance = (id) => api.get(`/employees/${id}/attendance/`);

export default api;
