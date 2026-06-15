import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { ShiftAssignmentRequest, ShiftAssignmentResponse } from "@/types/shift-roster";


export const shiftRosterService = {

    assignShift: async (
        request: ShiftAssignmentRequest
    ): Promise<ApiResponse<ShiftAssignmentResponse>> => {
        const response = await axiosInstance.post<ApiResponse<ShiftAssignmentResponse>>(
            "shift-assignments",
            request
        );
        return response.data;
    },

    getByEmployee: async (
        employeeId: number
    ): Promise<ApiResponse<ShiftAssignmentResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ShiftAssignmentResponse[]>>(
            `shift-assignments/employee/${employeeId}`
        );
        return response.data;
    },

    getByDate: async (
        date: string
    ): Promise<ApiResponse<ShiftAssignmentResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ShiftAssignmentResponse[]>>(
            `shift-assignments/date?date=${date}`
        );
        return response.data;
    },

    getAssignmentsByEmployeeAndDateRange: async (
        employeeId: number,
        startDate: string,
        endDate: string
    ): Promise<ApiResponse<ShiftAssignmentResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ShiftAssignmentResponse[]>>(
            `shift-assignments/employee/${employeeId}/range?startDate=${startDate}&endDate=${endDate}`
        );
        return response.data;
    },

    deleteAssignment: async (
        id: number
    ): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `shift-assignments/${id}`
        );
        return response.data;
    }
}