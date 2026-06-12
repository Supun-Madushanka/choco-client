import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";

interface InvitationResponse {
    id: number;
    email: string;
    roleName: string;
    roleDisplayName: string;
    invitedByName: string;
    status: string;
    expiresAt: string;
    createdAt: string;
}

interface AcceptInvitationRequest {
    token: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    phone?: string;
}

export const userService = {

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
};