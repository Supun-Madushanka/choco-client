import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { ShiftResponse, ShiftRequest } from "@/types/shift";

export const shiftService = {

    getAllShifts: async (): Promise<ApiResponse<ShiftResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ShiftResponse[]>>(
            "shifts"
        );
        return response.data;
    },

    getActiveShifts: async (): Promise<ApiResponse<ShiftResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ShiftResponse[]>>(
            "shifts/active"
        );
        return response.data;
    },

    getShiftById: async (id: number): Promise<ApiResponse<ShiftResponse>> => {
        const response = await axiosInstance.get<ApiResponse<ShiftResponse>>(
            `shifts/${id}`
        );
        return response.data;
    },

    createShift: async (
        request: ShiftRequest
    ): Promise<ApiResponse<ShiftResponse>> => {
        const response = await axiosInstance.post<ApiResponse<ShiftResponse>>(
            "shifts",
            request
        );
        return response.data;
    },

    updateShift: async (
        id: number,
        request: ShiftRequest
    ): Promise<ApiResponse<ShiftResponse>> => {
        const response = await axiosInstance.put<ApiResponse<ShiftResponse>>(
            `shifts/${id}`,
            request
        );
        return response.data;
    },

    deleteShift: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `shifts/${id}`
        );
        return response.data;
    },
};