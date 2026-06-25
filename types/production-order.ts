export type ProductionOrderStatus =
    | "DRAFT"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

export interface ProductionOrderResponse {
    id: number;
    orderNumber: string;
    productId: number;
    productCode: string;
    productName: string;
    createdByName: string;
    approvedByName: string | null;
    plannedQuantity: number;
    actualQuantity: number;
    plannedDate: string;
    actualDate: string | null;
    status: ProductionOrderStatus;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ProductionOrderRequest {
    productId: number;
    plannedQuantity: number;
    plannedDate: string;
    notes?: string;
}