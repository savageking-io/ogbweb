import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from './authStore';
import type { ApiError } from '@/types/api';

interface ApiConfig {
    baseURL: string;
}

const config: ApiConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/',
};

const api = axios.create({
    baseURL: config.baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Add interceptor for global error logging
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        if (process.env.NODE_ENV === 'development') {
            console.error('API error:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data,
                request: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data,
                },
                stack: error.stack,
            });
        } else {
            // import * as Sentry from '@sentry/nextjs';
            // Sentry.captureException(error);
        }
        return Promise.reject(error);
    }
);

export default api;