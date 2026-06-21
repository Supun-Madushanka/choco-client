export interface SupplierMaterialResponse {
    id: number;
    supplierId: number;
    supplierCode: string;
    supplierName: string;
    rawMaterialId: number;
    rawMaterialName: string;
    unit: string;
    unitPrice: number;
    currency: string;
    leadTimeDays: number | null;
    isPreferred: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SupplierMaterialRequest {
    supplierId: number;
    rawMaterialId: number;
    unitPrice: number;
    currency?: string;
    leadTimeDays?: number;
    isPreferred?: boolean;
}