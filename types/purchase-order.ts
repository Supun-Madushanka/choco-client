export type POStatus =
    | "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED"
    | "ORDERED" | "PARTIALLY_RECEIVED" | "RECEIVED" | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID";

export interface PurchaseOrderItemResponse {
    id: number;
    rawMaterialId: number;
    rawMaterialName: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    receivedQuantity: number;
}

export interface PurchaseOrderResponse {
    id: number;
    poNumber: string;
    supplierId: number;
    supplierCode: string;
    supplierName: string;
    createdByName: string;
    approvedByName: string | null;
    totalAmount: number;
    currency: string;
    status: POStatus;
    paymentStatus: PaymentStatus;
    paidAmount: number;
    expectedDate: string | null;
    notes: string | null;
    items: PurchaseOrderItemResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface PurchaseOrderItemRequest {
    rawMaterialId: number;
    quantity: number;
    unitPrice: number;
}

export interface PurchaseOrderRequest {
    supplierId: number;
    currency?: string;
    expectedDate?: string;
    notes?: string;
    items: PurchaseOrderItemRequest[];
}

export interface PurchaseOrderPaymentRequest {
    paidAmount: number;
    paymentStatus: PaymentStatus;
}