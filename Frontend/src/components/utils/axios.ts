import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1/',
});

// Request interceptor to add the bearer token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 403 || error.response?.status === 401) {
            // Potentially redirect to login or refresh token
            console.error('Session expired or unauthorized');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

export interface AdminData {
    adminId: string;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    status: string;
    message: string;
    data: {
        token: string;
        admin: AdminData;
    };
}

const API_URL = 'http://localhost:5000/api/v1/admin/auth';

export const authService = {
    // Logic: JWT token generated on login and stored in localStorage
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(`${API_URL}/login`, { email, password });
        if (response.data.status === "success") {
            localStorage.setItem('adminToken', response.data.data.token);
            localStorage.setItem('adminData', JSON.stringify(response.data.data.admin));
        }
        return response.data;
    },

    // Logic: Token destroyed on logout
    logout(): void {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        window.location.href = '/login';
    }
};