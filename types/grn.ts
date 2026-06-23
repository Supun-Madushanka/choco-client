export type GrnStatus =
    | "DRAFT"
    | "QC_PENDING"
    | "QC_PASSED"
    | "QC_FAILED"
    | "STOCKED";

export type QualityStatus =
    | "PENDING"
    | "PASSED"
    | "FAILED";

export interface GrnItemResponse {
    id: number;
    rawMaterialId: number;
    rawMaterialName: string;
    unit: string;
    orderedQuantity: number;
    receivedQuantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
    qualityStatus: QualityStatus;
    qualityNotes: string | null;
    inspectedByName: string | null;
    inspectedAt: string | null;
}

export interface GoodsReceivedNoteResponse {
    id: number;
    grnNumber: string;
    purchaseOrderId: number;
    poNumber: string;
    warehouseId: number;
    warehouseName: string;
    receivedByName: string;
    receivedDate: string;
    status: GrnStatus;
    notes: string | null;
    items: GrnItemResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface GrnItemCreateRequest {
    rawMaterialId: number;
    orderedQuantity: number;
    receivedQuantity: number;
}

export interface GoodsReceivedNoteRequest {
    purchaseOrderId: number;
    warehouseId: number;
    receivedDate: string;
    notes?: string;
    items: GrnItemCreateRequest[];
}

export interface GrnItemInspectRequest {
    acceptedQuantity: number;
    qualityStatus: string;
    qualityNotes?: string;
}