import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import {
    ProductCategoryRequest,
    ProductCategoryResponse,
} from "@/types/product-category";

export const productCategoryService = {

    getAllCategories: async (): Promise<ApiResponse<ProductCategoryResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ProductCategoryResponse[]>>(
            "product-categories"
        );
        return response.data;
    },

    getCategoryById: async (
        id: number
    ): Promise<ApiResponse<ProductCategoryResponse>> => {
        const response = await axiosInstance.get<ApiResponse<ProductCategoryResponse>>(
            `product-categories/${id}`
        );
        return response.data;
    },

    createCategory: async (
        request: ProductCategoryRequest
    ): Promise<ApiResponse<ProductCategoryResponse>> => {
        const response = await axiosInstance.post<ApiResponse<ProductCategoryResponse>>(
            "product-categories",
            request
        );
        return response.data;
    },

    updateCategory: async (
        id: number,
        request: ProductCategoryRequest
    ): Promise<ApiResponse<ProductCategoryResponse>> => {
        const response = await axiosInstance.put<ApiResponse<ProductCategoryResponse>>(
            `product-categories/${id}`,
            request
        );
        return response.data;
    },

    deleteCategory: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `product-categories/${id}`
        );
        return response.data;
    },
};