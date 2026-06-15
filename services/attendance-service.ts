import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import {
    AttendanceResponse,
    AttendanceUpdateRequest,
} from "@/types/attendance";

export const attendanceService = {

    // Self
    checkIn: async (): Promise<ApiResponse<AttendanceResponse>> => {
        const response = await axiosInstance.post<ApiResponse<AttendanceResponse>>(
            "attendance/check-in"
        );
        return response.data;
    },

    checkOut: async (): Promise<ApiResponse<AttendanceResponse>> => {
        const response = await axiosInstance.put<ApiResponse<AttendanceResponse>>(
            "attendance/check-out"
        );
        return response.data;
    },

    getMyToday: async (): Promise<ApiResponse<AttendanceResponse | null>> => {
        const response = await axiosInstance.get<ApiResponse<AttendanceResponse | null>>(
            "attendance/my/today"
        );
        return response.data;
    },

    getMyHistory: async (
        startDate: string,
        endDate: string
    ): Promise<ApiResponse<AttendanceResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<AttendanceResponse[]>>(
            `attendance/my?startDate=${startDate}&endDate=${endDate}`
        );
        return response.data;
    },

    // HR
    getByEmployee: async (
        employeeId: number
    ): Promise<ApiResponse<AttendanceResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<AttendanceResponse[]>>(
            `attendance/employee/${employeeId}`
        );
        return response.data;
    },

    getByDate: async (
        date: string
    ): Promise<ApiResponse<AttendanceResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<AttendanceResponse[]>>(
            `attendance/date?date=${date}`
        );
        return response.data;
    },

    updateAttendance: async (
        id: number,
        request: AttendanceUpdateRequest
    ): Promise<ApiResponse<AttendanceResponse>> => {
        const response = await axiosInstance.put<ApiResponse<AttendanceResponse>>(
            `attendance/${id}`,
            request
        );
        return response.data;
    },

    createForEmployee: async (
        employeeId: number,
        request: AttendanceUpdateRequest
    ): Promise<ApiResponse<AttendanceResponse>> => {
        const response = await axiosInstance.post<ApiResponse<AttendanceResponse>>(
            `attendance/employee/${employeeId}`,
            request
        );
        return response.data;
    },
};