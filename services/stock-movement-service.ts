import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { MovementType, StockMovementRequest, StockMovementResponse } from "@/types/stock-movement";

export const stockMovementService = {

    recordMovement: async (
        request: StockMovementRequest
    ): Promise<ApiResponse<StockMovementResponse>> => {
        const response = await axiosInstance.post<ApiResponse<StockMovementResponse>>(
            "stock-movements",
            request
        );
        return response.data;
    },

    getAllMovements: async (): Promise<ApiResponse<StockMovementResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<StockMovementResponse[]>>(
            "stock-movements"
        );
        return response.data;
    },

    getByWarehouse: async (
        warehouseId: number
    ): Promise<ApiResponse<StockMovementResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<StockMovementResponse[]>>(
            `stock-movements/warehouse/${warehouseId}`
        );
        return response.data;
    },

    getByRawMaterial: async (
        rawMaterialId: number
    ): Promise<ApiResponse<StockMovementResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<StockMovementResponse[]>>(
            `stock-movements/raw-material/${rawMaterialId}`
        );
        return response.data;
    },

    getByWarehouseAndMaterial: async (
        warehouseId: number,
        rawMaterialId: number
    ): Promise<ApiResponse<StockMovementResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<StockMovementResponse[]>>(
            `stock-movements/warehouse/${warehouseId}/material/${rawMaterialId}`
        );
        return response.data;
    },

    getByType: async (
        movementType: MovementType
    ): Promise<ApiResponse<StockMovementResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<StockMovementResponse[]>>(
            `stock-movements/type/${movementType}`
        );
        return response.data;
    },
};