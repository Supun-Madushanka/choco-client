import axiosInstance from "@/lib/api";
import { ApiResponse, AuthResponse, LoginRequest, UserResponse } from "@/types/auth";

export const authService = {

    login: async (request: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
        const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
            "auth/login",
            request
        );
        return response.data;
    },

    logout: async (): Promise<void> => {
        await axiosInstance.post("auth/logout");
    },

    getMe: async (): Promise<ApiResponse<UserResponse>> => {
        const response = await axiosInstance.get<ApiResponse<UserResponse>>(
            "auth/me"
        );
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
        const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
            "auth/refresh-token",
            { refreshToken }
        );
        return response.data;
    },

    forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.post<ApiResponse<void>>(
            "auth/forgot-password",
            { email }
        );
        return response.data;
    },

    resetPassword: async (
        token: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.post<ApiResponse<void>>(
            "auth/reset-password",
            { token, newPassword, confirmPassword }
        );
        return response.data;
    },

    changePassword: async (
        currentPassword: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.put<ApiResponse<void>>(
            "auth/change-password",
            { currentPassword, newPassword, confirmPassword }
        );
        return response.data;
    },

    updateProfile: async (
        fullName: string,
        phone: string
    ): Promise<ApiResponse<UserResponse>> => {
        const response = await axiosInstance.put<ApiResponse<UserResponse>>(
            "auth/profile",
            { fullName, phone }
        );
        return response.data;
    },
};