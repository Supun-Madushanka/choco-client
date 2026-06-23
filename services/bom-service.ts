import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { BillOfMaterialRequest, BillOfMaterialResponse } from "@/types/bill-of-material";

export const bomService = {

    getByProduct: async (
        productId: number
    ): Promise<ApiResponse<BillOfMaterialResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<BillOfMaterialResponse[]>>(
            `bill-of-materials/product/${productId}`
        );
        return response.data;
    },

    getByRawMaterial: async (
        rawMaterialId: number
    ): Promise<ApiResponse<BillOfMaterialResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<BillOfMaterialResponse[]>>(
            `bill-of-materials/raw-material/${rawMaterialId}`
        );
        return response.data;
    },

    addBomItem: async (
        request: BillOfMaterialRequest
    ): Promise<ApiResponse<BillOfMaterialResponse>> => {
        const response = await axiosInstance.post<ApiResponse<BillOfMaterialResponse>>(
            "bill-of-materials",
            request
        );
        return response.data;
    },

    updateBomItem: async (
        id: number,
        request: BillOfMaterialRequest
    ): Promise<ApiResponse<BillOfMaterialResponse>> => {
        const response = await axiosInstance.put<ApiResponse<BillOfMaterialResponse>>(
            `bill-of-materials/${id}`,
            request
        );
        return response.data;
    },

    deleteBomItem: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `bill-of-materials/${id}`
        );
        return response.data;
    },
};