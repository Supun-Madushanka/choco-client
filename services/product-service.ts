import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { ProductRequest, ProductResponse } from "@/types/product";

export const productService = {

    getAllProducts: async (): Promise<ApiResponse<ProductResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ProductResponse[]>>(
            "products"
        );
        return response.data;
    },

    getActiveProducts: async (): Promise<ApiResponse<ProductResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ProductResponse[]>>(
            "products/active"
        );
        return response.data;
    },

    getProductsByCategory: async (
        categoryId: number
    ): Promise<ApiResponse<ProductResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ProductResponse[]>>(
            `products/category/${categoryId}`
        );
        return response.data;
    },

    getProductById: async (
        id: number
    ): Promise<ApiResponse<ProductResponse>> => {
        const response = await axiosInstance.get<ApiResponse<ProductResponse>>(
            `products/${id}`
        );
        return response.data;
    },

    getNextProductCode: async (
        categoryId: number
    ): Promise<ApiResponse<string>> => {
        const response = await axiosInstance.get<ApiResponse<string>>(
            `products/next-code?categoryId=${categoryId}`
        );
        return response.data;
    },

    createProduct: async (
        request: ProductRequest
    ): Promise<ApiResponse<ProductResponse>> => {
        const response = await axiosInstance.post<ApiResponse<ProductResponse>>(
            "products",
            request
        );
        return response.data;
    },

    updateProduct: async (
        id: number,
        request: ProductRequest
    ): Promise<ApiResponse<ProductResponse>> => {
        const response = await axiosInstance.put<ApiResponse<ProductResponse>>(
            `products/${id}`,
            request
        );
        return response.data;
    },

    deleteProduct: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `products/${id}`
        );
        return response.data;
    },
};