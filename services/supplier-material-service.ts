import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { SupplierMaterialRequest, SupplierMaterialResponse } from "@/types/supplier-material";

export const supplierMaterialService = {

    getBySupplier: async (
        supplierId: number
    ): Promise<ApiResponse<SupplierMaterialResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<SupplierMaterialResponse[]>>(
            `supplier-materials/supplier/${supplierId}`
        );
        return response.data;
    },

    getByMaterial: async (
        rawMaterialId: number
    ): Promise<ApiResponse<SupplierMaterialResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<SupplierMaterialResponse[]>>(
            `supplier-materials/material/${rawMaterialId}`
        );
        return response.data;
    },

    getPreferredByMaterial: async (
        rawMaterialId: number
    ): Promise<ApiResponse<SupplierMaterialResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<SupplierMaterialResponse[]>>(
            `supplier-materials/material/${rawMaterialId}/preferred`
        );
        return response.data;
    },

    addSupplierMaterial: async (
        request: SupplierMaterialRequest
    ): Promise<ApiResponse<SupplierMaterialResponse>> => {
        const response = await axiosInstance.post<ApiResponse<SupplierMaterialResponse>>(
            "supplier-materials",
            request
        );
        return response.data;
    },

    updateSupplierMaterial: async (
        id: number,
        request: SupplierMaterialRequest
    ): Promise<ApiResponse<SupplierMaterialResponse>> => {
        const response = await axiosInstance.put<ApiResponse<SupplierMaterialResponse>>(
            `supplier-materials/${id}`,
            request
        );
        return response.data;
    },

    deleteSupplierMaterial: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `supplier-materials/${id}`
        );
        return response.data;
    },
};