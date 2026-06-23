import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { MachineRequest, MachineResponse } from "@/types/machine";

export const machineService = {

    getAllMachines: async (): Promise<ApiResponse<MachineResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<MachineResponse[]>>(
            "machines"
        );
        return response.data;
    },

    getMachineById: async (
        id: number
    ): Promise<ApiResponse<MachineResponse>> => {
        const response = await axiosInstance.get<ApiResponse<MachineResponse>>(
            `machines/${id}`
        );
        return response.data;
    },

    getMachinesByStatus: async (
        status: string
    ): Promise<ApiResponse<MachineResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<MachineResponse[]>>(
            `machines/status/${status}`
        );
        return response.data;
    },

    getNextMachineCode: async (): Promise<ApiResponse<string>> => {
        const response = await axiosInstance.get<ApiResponse<string>>(
            "machines/next-code"
        );
        return response.data;
    },

    createMachine: async (
        request: MachineRequest
    ): Promise<ApiResponse<MachineResponse>> => {
        const response = await axiosInstance.post<ApiResponse<MachineResponse>>(
            "machines",
            request
        );
        return response.data;
    },

    updateMachine: async (
        id: number,
        request: MachineRequest
    ): Promise<ApiResponse<MachineResponse>> => {
        const response = await axiosInstance.put<ApiResponse<MachineResponse>>(
            `machines/${id}`,
            request
        );
        return response.data;
    },

    deleteMachine: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `machines/${id}`
        );
        return response.data;
    },
};