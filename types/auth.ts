export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    userId: number;
    fullName: string;
    email: string;
    role: string;
    roleDisplayName: string;
    accessToken: string;
    refreshToken: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface UserResponse {
    userId: number;
    fullName: string;
    email: string;
    phone: string | null;
    profileImage: string | null;
    role: string;
    roleDisplayName: string;
    roleLevel: string;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}