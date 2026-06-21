import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { RawMaterialRequest, RawMaterialResponse } from "@/types/raw-material";

export const rawMaterialService = {

    getAllRawMaterials: async (): Promise<ApiResponse<RawMaterialResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<RawMaterialResponse[]>>(
            "raw-materials"
        );
        return response.data;
    },

    getActiveRawMaterials: async (): Promise<ApiResponse<RawMaterialResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<RawMaterialResponse[]>>(
            "raw-materials/active"
        );
        return response.data;
    },

    getByCategory: async (
        categoryId: number
    ): Promise<ApiResponse<RawMaterialResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<RawMaterialResponse[]>>(
            `raw-materials/category/${categoryId}`
        );
        return response.data;
    },

    getRawMaterialById: async (
        id: number
    ): Promise<ApiResponse<RawMaterialResponse>> => {
        const response = await axiosInstance.get<ApiResponse<RawMaterialResponse>>(
            `raw-materials/${id}`
        );
        return response.data;
    },

    createRawMaterial: async (
        request: RawMaterialRequest
    ): Promise<ApiResponse<RawMaterialResponse>> => {
        const response = await axiosInstance.post<ApiResponse<RawMaterialResponse>>(
            "raw-materials",
            request
        );
        return response.data;
    },

    updateRawMaterial: async (
        id: number,
        request: RawMaterialRequest
    ): Promise<ApiResponse<RawMaterialResponse>> => {
        const response = await axiosInstance.put<ApiResponse<RawMaterialResponse>>(
            `raw-materials/${id}`,
            request
        );
        return response.data;
    },

    deleteRawMaterial: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `raw-materials/${id}`
        );
        return response.data;
    },
};