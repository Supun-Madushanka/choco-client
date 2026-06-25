import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { MaintenanceLogRequest, MaintenanceLogResponse } from "@/types/maintenance-log";

export const maintenanceLogService = {

    getAllLogs: async (): Promise<ApiResponse<MaintenanceLogResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<MaintenanceLogResponse[]>>(
            "maintenance-logs"
        );
        return response.data;
    },

    getLogsByMachine: async (
        machineId: number
    ): Promise<ApiResponse<MaintenanceLogResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<MaintenanceLogResponse[]>>(
            `maintenance-logs/machine/${machineId}`
        );
        return response.data;
    },

    createLog: async (
        request: MaintenanceLogRequest
    ): Promise<ApiResponse<MaintenanceLogResponse>> => {
        const response = await axiosInstance.post<ApiResponse<MaintenanceLogResponse>>(
            "maintenance-logs",
            request
        );
        return response.data;
    },
};