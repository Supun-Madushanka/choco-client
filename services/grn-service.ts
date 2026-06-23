import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import {
    GoodsReceivedNoteRequest,
    GoodsReceivedNoteResponse,
    GrnItemInspectRequest,
} from "@/types/grn";

export const grnService = {

    getAllGrns: async (): Promise<ApiResponse<GoodsReceivedNoteResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<GoodsReceivedNoteResponse[]>>(
            "grn"
        );
        return response.data;
    },

    getGrnById: async (
        id: number
    ): Promise<ApiResponse<GoodsReceivedNoteResponse>> => {
        const response = await axiosInstance.get<ApiResponse<GoodsReceivedNoteResponse>>(
            `grn/${id}`
        );
        return response.data;
    },

    getGrnsByPurchaseOrder: async (
        purchaseOrderId: number
    ): Promise<ApiResponse<GoodsReceivedNoteResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<GoodsReceivedNoteResponse[]>>(
            `grn/purchase-order/${purchaseOrderId}`
        );
        return response.data;
    },

    getNextGrnNumber: async (): Promise<ApiResponse<string>> => {
        const response = await axiosInstance.get<ApiResponse<string>>(
            "grn/next-number"
        );
        return response.data;
    },

    createGrn: async (
        request: GoodsReceivedNoteRequest
    ): Promise<ApiResponse<GoodsReceivedNoteResponse>> => {
        const response = await axiosInstance.post<ApiResponse<GoodsReceivedNoteResponse>>(
            "grn",
            request
        );
        return response.data;
    },

    submitForQc: async (
        id: number
    ): Promise<ApiResponse<GoodsReceivedNoteResponse>> => {
        const response = await axiosInstance.put<ApiResponse<GoodsReceivedNoteResponse>>(
            `grn/${id}/submit-qc`
        );
        return response.data;
    },

    inspectItem: async (
        grnId: number,
        itemId: number,
        request: GrnItemInspectRequest
    ): Promise<ApiResponse<GoodsReceivedNoteResponse>> => {
        const response = await axiosInstance.put<ApiResponse<GoodsReceivedNoteResponse>>(
            `grn/${grnId}/items/${itemId}/inspect`,
            request
        );
        return response.data;
    },

    completeQc: async (
        id: number
    ): Promise<ApiResponse<GoodsReceivedNoteResponse>> => {
        const response = await axiosInstance.put<ApiResponse<GoodsReceivedNoteResponse>>(
            `grn/${id}/complete-qc`
        );
        return response.data;
    },
};