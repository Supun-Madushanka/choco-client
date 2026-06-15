import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { PayrollResponse, PayrollRequest } from "@/types/payroll";

export const payrollService = {

    createPayroll: async (
        request: PayrollRequest
    ): Promise<ApiResponse<PayrollResponse>> => {
        const response = await axiosInstance.post<ApiResponse<PayrollResponse>>(
            "payroll",
            request
        );
        return response.data;
    },

    updatePayroll: async (
        id: number,
        request: PayrollRequest
    ): Promise<ApiResponse<PayrollResponse>> => {
        const response = await axiosInstance.put<ApiResponse<PayrollResponse>>(
            `payroll/${id}`,
            request
        );
        return response.data;
    },

    markAsPaid: async (id: number): Promise<ApiResponse<PayrollResponse>> => {
        const response = await axiosInstance.put<ApiResponse<PayrollResponse>>(
            `payroll/${id}/mark-paid`
        );
        return response.data;
    },

    getByEmployee: async (
        employeeId: number
    ): Promise<ApiResponse<PayrollResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<PayrollResponse[]>>(
            `payroll/employee/${employeeId}`
        );
        return response.data;
    },

    getByMonthYear: async (
        month: number,
        year: number
    ): Promise<ApiResponse<PayrollResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<PayrollResponse[]>>(
            `payroll?month=${month}&year=${year}`
        );
        return response.data;
    },

    getMyLatest: async (): Promise<ApiResponse<PayrollResponse | null>> => {
        const response = await axiosInstance.get<ApiResponse<PayrollResponse | null>>(
            "payroll/my/latest"
        );
        return response.data;
    },

    getMyHistory: async (): Promise<ApiResponse<PayrollResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<PayrollResponse[]>>(
            "payroll/my/history"
        );
        return response.data;
    },
};