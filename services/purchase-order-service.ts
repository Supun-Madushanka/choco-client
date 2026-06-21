import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import {
    PurchaseOrderRequest,
    PurchaseOrderResponse,
    PurchaseOrderPaymentRequest,
} from "@/types/purchase-order";

export const purchaseOrderService = {

    getAllPurchaseOrders: async (): Promise<ApiResponse<PurchaseOrderResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<PurchaseOrderResponse[]>>(
            "purchase-orders"
        );
        return response.data;
    },

    getByStatus: async (
        status: string
    ): Promise<ApiResponse<PurchaseOrderResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<PurchaseOrderResponse[]>>(
            `purchase-orders/status/${status}`
        );
        return response.data;
    },

    getPurchaseOrderById: async (
        id: number
    ): Promise<ApiResponse<PurchaseOrderResponse>> => {
        const response = await axiosInstance.get<ApiResponse<PurchaseOrderResponse>>(
            `purchase-orders/${id}`
        );
        return response.data;
    },

    getNextPoNumber: async (): Promise<ApiResponse<string>> => {
        const response = await axiosInstance.get<ApiResponse<string>>(
            "purchase-orders/next-number"
        );
        return response.data;
    },

    createPurchaseOrder: async (
        request: PurchaseOrderRequest
    ): Promise<ApiResponse<PurchaseOrderResponse>> => {
        const response = await axiosInstance.post<ApiResponse<PurchaseOrderResponse>>(
            "purchase-orders",
            request
        );
        return response.data;
    },

    updatePurchaseOrder: async (
        id: number,
        request: PurchaseOrderRequest
    ): Promise<ApiResponse<PurchaseOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<PurchaseOrderResponse>>(
            `purchase-orders/${id}`,
            request
        );
        return response.data;
    },

    submitForApproval: async (
        id: number
    ): Promise<ApiResponse<PurchaseOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<PurchaseOrderResponse>>(
            `purchase-orders/${id}/submit`
        );
        return response.data;
    },

    approvePurchaseOrder: async (
        id: number
    ): Promise<ApiResponse<PurchaseOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<PurchaseOrderResponse>>(
            `purchase-orders/${id}/approve`
        );
        return response.data;
    },

    rejectPurchaseOrder: async (
        id: number
    ): Promise<ApiResponse<PurchaseOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<PurchaseOrderResponse>>(
            `purchase-orders/${id}/reject`
        );
        return response.data;
    },

    markAsOrdered: async (
        id: number
    ): Promise<ApiResponse<PurchaseOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<PurchaseOrderResponse>>(
            `purchase-orders/${id}/order`
        );
        return response.data;
    },

    cancelPurchaseOrder: async (
        id: number
    ): Promise<ApiResponse<PurchaseOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<PurchaseOrderResponse>>(
            `purchase-orders/${id}/cancel`
        );
        return response.data;
    },

    updatePayment: async (
        id: number,
        request: PurchaseOrderPaymentRequest
    ): Promise<ApiResponse<PurchaseOrderResponse>> => {
        const response = await axiosInstance.put<ApiResponse<PurchaseOrderResponse>>(
            `purchase-orders/${id}/payment`,
            request
        );
        return response.data;
    },

    deletePurchaseOrder: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `purchase-orders/${id}`
        );
        return response.data;
    },
};