import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { SupplierRequest, SupplierResponse } from "@/types/supplier";

export const supplierService = {

    getAllSuppliers: async (): Promise<ApiResponse<SupplierResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<SupplierResponse[]>>(
            "suppliers"
        );
        return response.data;
    },

    getActiveSuppliers: async (): Promise<ApiResponse<SupplierResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<SupplierResponse[]>>(
            "suppliers/active"
        );
        return response.data;
    },

    getSupplierById: async (
        id: number
    ): Promise<ApiResponse<SupplierResponse>> => {
        const response = await axiosInstance.get<ApiResponse<SupplierResponse>>(
            `suppliers/${id}`
        );
        return response.data;
    },

    createSupplier: async (
        request: SupplierRequest
    ): Promise<ApiResponse<SupplierResponse>> => {
        const response = await axiosInstance.post<ApiResponse<SupplierResponse>>(
            "suppliers",
            request
        );
        return response.data;
    },

    updateSupplier: async (
        id: number,
        request: SupplierRequest
    ): Promise<ApiResponse<SupplierResponse>> => {
        const response = await axiosInstance.put<ApiResponse<SupplierResponse>>(
            `suppliers/${id}`,
            request
        );
        return response.data;
    },

    deleteSupplier: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `suppliers/${id}`
        );
        return response.data;
    },

    getNextSupplierCode: async (): Promise<ApiResponse<string>> => {
        const response = await axiosInstance.get<ApiResponse<string>>(
            "suppliers/next-code"
        );
        return response.data;
    }
};