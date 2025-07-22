'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/axios';
import type { LoginRequest, LoginResponse, ApiError } from '@/types/api';
import { AxiosError } from 'axios';

export default function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const setAuth = useAuthStore((state) => state.setAuth);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const request: LoginRequest = { email, password };
            const response = await api.post<LoginResponse>('/user/auth/credentials', request);
            const { token, user } = response.data;
            setAuth(token, user);
            router.push('/dashboard');
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            // Log detailed error information
            console.error('Login error:', {
                message: axiosError.message,
                status: axiosError.response?.status,
                statusText: axiosError.response?.statusText,
                responseData: axiosError.response?.data,
                request: {
                    url: axiosError.config?.url,
                    method: axiosError.config?.method,
                    data: axiosError.config?.data,
                },
                stack: axiosError.stack,
            });

            // User-facing error message
            const errorMessage = axiosError.response?.data?.message ?? 'Login failed. Please try again.';
            setError(errorMessage);

            // Optional: Log to a service in production
            if (process.env.NODE_ENV === 'production') {
                // Example: Send to a logging service (e.g., Sentry, LogRocket)
                // import * as Sentry from '@sentry/nextjs';
                // Sentry.captureException(axiosError);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}