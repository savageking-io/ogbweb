export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface ApiError {
    message: string;
}