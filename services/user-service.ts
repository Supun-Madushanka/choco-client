import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { InvitationResponse, AcceptInvitationRequest, UserResponse, RoleResponse, SendInvitationRequest } from "@/types/user";

export const userService = {

    // Invitation endpoints
    validateInvitationToken: async (
        token: string
    ): Promise<ApiResponse<InvitationResponse>> => {
        const response = await axiosInstance.get<ApiResponse<InvitationResponse>>(
            `users/invite/validate?token=${token}`
        );
        return response.data;
    },

    acceptInvitation: async (
        request: AcceptInvitationRequest
    ): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.post<ApiResponse<void>>(
            "users/invite/accept",
            request
        );
        return response.data;
    },

    sendInvitation: async (
        request: SendInvitationRequest
    ): Promise<ApiResponse<InvitationResponse>> => {
        const response = await axiosInstance.post<ApiResponse<InvitationResponse>>(
            "users/invite",
            request
        );
        return response.data;
    },

    // User management endpoints
    getAllUsers: async (): Promise<ApiResponse<UserResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<UserResponse[]>>(
            "users"
        );
        return response.data;
    },

    getUserById: async (id: number): Promise<ApiResponse<UserResponse>> => {
        const response = await axiosInstance.get<ApiResponse<UserResponse>>(
            `users/${id}`
        );
        return response.data;
    },

    deactivateUser: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.put<ApiResponse<void>>(
            `users/${id}/deactivate`
        );
        return response.data;
    },

    activateUser: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.put<ApiResponse<void>>(
            `users/${id}/activate`
        );
        return response.data;
    },

    changeUserRole: async (
        id: number,
        roleId: number
    ): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.put<ApiResponse<void>>(
            `users/${id}/change-role?roleId=${roleId}`
        );
        return response.data;
    },

    // Role management endpoints
    getAllRoles: async (): Promise<ApiResponse<RoleResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<RoleResponse[]>>(
            "roles"
        );
        return response.data;
    },

    getRolesByLevel: async (
        level: string
    ): Promise<ApiResponse<RoleResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<RoleResponse[]>>(
            `roles/by-level?level=${level}`
        );
        return response.data;
    },

    getUsersWithoutEmployeeProfile: async (): Promise<ApiResponse<UserResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<UserResponse[]>>(
            "users/unlinked"
        );
        return response.data;
    }
};