import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import {
    ProductionOrderRequest,
    ProductionOrderResponse,
} from "@/types/production-order";

export const productionOrderService = {

    getAllOrders: async (): Promise<ApiResponse<ProductionOrderResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ProductionOrderResponse[]>>(
            "production-orders"
        );
        return response.data;
    },

    getOrdersByStatus: async (
        status: string
    ): Promise<ApiResponse<ProductionOrderResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ProductionOrderResponse[]>>(
            `production-orders/status/${status}`
        );
        return response.data;
    },

    getOrderById: async (
        id: number
    ): Promise<ApiResponse<ProductionOrderResponse>> => {
        const response = await axiosInstance.get<ApiResponse<ProductionOrderResponse>>(
            `production-orders/${id}`
        );
        return response.data;
    },

    getNextOrderNumber: async (): Promise<ApiResponse<string>> => {
        const response = await axiosInstance.get<ApiResponse<string>>(
            "production-orders/next-number"
        );
        return response.data;
    },

    createOrder: async (
        request: ProductionOrderRequest
    ): Promise<ApiResponse<ProductionOrderResponse>> => {
        const response = await axiosInstance.post<ApiResponse<ProductionOrderResponse>>(
            "production-orders",
            request
        );
        return response.data;
    },

    updateOrder: async (
        id: number,
        request: ProductionOrderRequest
    ): Promise<ApiResponse<ProductionOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<ProductionOrderResponse>>(
            `production-orders/${id}`,
            request
        );
        return response.data;
    },

    submitForApproval: async (
        id: number
    ): Promise<ApiResponse<ProductionOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<ProductionOrderResponse>>(
            `production-orders/${id}/submit`
        );
        return response.data;
    },

    approveOrder: async (
        id: number
    ): Promise<ApiResponse<ProductionOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<ProductionOrderResponse>>(
            `production-orders/${id}/approve`
        );
        return response.data;
    },

    rejectOrder: async (
        id: number
    ): Promise<ApiResponse<ProductionOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<ProductionOrderResponse>>(
            `production-orders/${id}/reject`
        );
        return response.data;
    },

    cancelOrder: async (
        id: number
    ): Promise<ApiResponse<ProductionOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<ProductionOrderResponse>>(
            `production-orders/${id}/cancel`
        );
        return response.data;
    },

    deleteOrder: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `production-orders/${id}`
        );
        return response.data;
    },
};