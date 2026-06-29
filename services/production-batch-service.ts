import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import {
    ProductionBatchResponse,
    ProductionBatchCreateRequest,
    CompleteProductionRequest,
    BatchQcRequest,
    BatchFinalApprovalRequest,
} from "@/types/production-batch";

export const productionBatchService = {

    getAllBatches: async (): Promise<ApiResponse<ProductionBatchResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ProductionBatchResponse[]>>(
            "production-batches"
        );
        return response.data;
    },

    getBatchesByOrder: async (
        productionOrderId: number
    ): Promise<ApiResponse<ProductionBatchResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<ProductionBatchResponse[]>>(
            `production-batches/order/${productionOrderId}`
        );
        return response.data;
    },

    getBatchById: async (
        id: number
    ): Promise<ApiResponse<ProductionBatchResponse>> => {
        const response = await axiosInstance.get<ApiResponse<ProductionBatchResponse>>(
            `production-batches/${id}`
        );
        return response.data;
    },

    getNextBatchNumber: async (): Promise<ApiResponse<string>> => {
        const response = await axiosInstance.get<ApiResponse<string>>(
            "production-batches/next-number"
        );
        return response.data;
    },

    createBatch: async (
        request: ProductionBatchCreateRequest
    ): Promise<ApiResponse<ProductionBatchResponse>> => {
        const response = await axiosInstance.post<ApiResponse<ProductionBatchResponse>>(
            "production-batches",
            request
        );
        return response.data;
    },

    completeProduction: async (
        id: number,
        request: CompleteProductionRequest
    ): Promise<ApiResponse<ProductionBatchResponse>> => {
        const response = await axiosInstance.put<ApiResponse<ProductionBatchResponse>>(
            `production-batches/${id}/complete-production`,
            request
        );
        return response.data;
    },

    markQc: async (
        id: number,
        request: BatchQcRequest
    ): Promise<ApiResponse<ProductionBatchResponse>> => {
        const response = await axiosInstance.put<ApiResponse<ProductionBatchResponse>>(
            `production-batches/${id}/qc`,
            request
        );
        return response.data;
    },

    finalApprove: async (
        id: number,
        request: BatchFinalApprovalRequest
    ): Promise<ApiResponse<ProductionBatchResponse>> => {
        const response = await axiosInstance.put<ApiResponse<ProductionBatchResponse>>(
            `production-batches/${id}/final-approval`,
            request
        );
        return response.data;
    },
};