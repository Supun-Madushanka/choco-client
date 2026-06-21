import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { RawMaterialCategoryRequest, RawMaterialCategoryResponse } from "@/types/raw-material-category";

export const rawMaterialCategoryService = {

    getAllCategories: async (): Promise<ApiResponse<RawMaterialCategoryResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<RawMaterialCategoryResponse[]>>(
            "raw-material-categories"
        );
        return response.data;
    },

    getCategoryById: async (
        id: number
    ): Promise<ApiResponse<RawMaterialCategoryResponse>> => {
        const response = await axiosInstance.get<ApiResponse<RawMaterialCategoryResponse>>(
            `raw-material-categories/${id}`
        );
        return response.data;
    },

    createCategory: async (
        request: RawMaterialCategoryRequest
    ): Promise<ApiResponse<RawMaterialCategoryResponse>> => {
        const response = await axiosInstance.post<ApiResponse<RawMaterialCategoryResponse>>(
            "raw-material-categories",
            request
        );
        return response.data;
    },

    updateCategory: async (
        id: number,
        request: RawMaterialCategoryRequest
    ): Promise<ApiResponse<RawMaterialCategoryResponse>> => {
        const response = await axiosInstance.put<ApiResponse<RawMaterialCategoryResponse>>(
            `raw-material-categories/${id}`,
            request
        );
        return response.data;
    },

    deleteCategory: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `raw-material-categories/${id}`
        );
        return response.data;
    },

}