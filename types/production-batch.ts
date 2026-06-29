export type BatchStatus =
    | "IN_PROGRESS"
    | "QC_PENDING"
    | "QC_DONE"
    | "STOCKED"
    | "REJECTED"
    | "REPROCESS";

export type QcStatus = "PENDING" | "PASSED" | "FAILED";

export type FinalStatus = "PENDING" | "APPROVED" | "REJECTED" | "REPROCESS";

export interface ProductionBatchResponse {
    id: number;
    batchNumber: string;
    productionOrderId: number;
    orderNumber: string;
    productName: string;
    warehouseId: number;
    warehouseName: string;
    quantityProduced: number | null;
    quantityRejected: number;
    productionDate: string | null;
    expiryDate: string | null;
    qcStatus: QcStatus;
    qcMarkedByName: string | null;
    qcMarkedAt: string | null;
    finalStatus: FinalStatus;
    finalApprovedByName: string | null;
    finalApprovedAt: string | null;
    status: BatchStatus;
    supervisedByName: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ProductionBatchCreateRequest {
    productionOrderId: number;
    warehouseId: number;
    notes?: string;
}

export interface BatchConsumptionItemRequest {
    rawMaterialId: number;
    quantityConsumed: number;
}

export interface CompleteProductionRequest {
    quantityProduced: number;
    quantityRejected?: number;
    productionDate: string;
    expiryDate?: string;
    consumptions: BatchConsumptionItemRequest[];
}

export interface BatchQcRequest {
    qcStatus: string;
}

export interface BatchFinalApprovalRequest {
    finalStatus: string;
    notes?: string;
}