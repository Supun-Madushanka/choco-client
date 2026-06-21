import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { WarehouseStockResponse } from "@/types/warehouse-stock";

export const warehouseStockService = {

    getAllStock: async (): Promise<ApiResponse<WarehouseStockResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<WarehouseStockResponse[]>>(
            "warehouse-stock"
        );
        return response.data;
    },

    getByWarehouse: async (
        warehouseId: number
    ): Promise<ApiResponse<WarehouseStockResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<WarehouseStockResponse[]>>(
            `warehouse-stock/warehouse/${warehouseId}`
        );
        return response.data;
    },

    getByRawMaterial: async (
        rawMaterialId: number
    ): Promise<ApiResponse<WarehouseStockResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<WarehouseStockResponse[]>>(
            `warehouse-stock/raw-material/${rawMaterialId}`
        );
        return response.data;
    },

    getLowStock: async (): Promise<ApiResponse<WarehouseStockResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<WarehouseStockResponse[]>>(
            "warehouse-stock/low-stock"
        );
        return response.data;
    },

    getByWarehouseAndMaterial: async (
        warehouseId: number,
        rawMaterialId: number
    ): Promise<ApiResponse<WarehouseStockResponse>> => {
        const response = await axiosInstance.get<ApiResponse<WarehouseStockResponse>>(
            `warehouse-stock/warehouse/${warehouseId}/material/${rawMaterialId}`
        );
        return response.data;
    },
};