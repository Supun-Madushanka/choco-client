import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { WarehouseRequest, WarehouseResponse } from "@/types/warehouse";

export const warehouseService = {

    getAllWarehouses: async (): Promise<ApiResponse<WarehouseResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<WarehouseResponse[]>>(
            "warehouses"
        );
        return response.data;
    },

    getActiveWarehouses: async (): Promise<ApiResponse<WarehouseResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<WarehouseResponse[]>>(
            "warehouses/active"
        );
        return response.data;
    },

    getWarehouseById: async (
        id: number
    ): Promise<ApiResponse<WarehouseResponse>> => {
        const response = await axiosInstance.get<ApiResponse<WarehouseResponse>>(
            `warehouses/${id}`
        );
        return response.data;
    },

    createWarehouse: async (
        request: WarehouseRequest
    ): Promise<ApiResponse<WarehouseResponse>> => {
        const response = await axiosInstance.post<ApiResponse<WarehouseResponse>>(
            "warehouses",
            request
        );
        return response.data;
    },

    updateWarehouse: async (
        id: number,
        request: WarehouseRequest
    ): Promise<ApiResponse<WarehouseResponse>> => {
        const response = await axiosInstance.put<ApiResponse<WarehouseResponse>>(
            `warehouses/${id}`,
            request
        );
        return response.data;
    },

    deleteWarehouse: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `warehouses/${id}`
        );
        return response.data;
    }
}