export type Unit = 'KG' | 'G' | 'L' | 'ML' | 'PIECES' | 'BOXES' | 'BAGS' | 'PACKETS';

export interface BillOfMaterialResponse {
    id: number;
    productId: number;
    productName: string;
    productCode: string;
    rawMaterialId: number;
    rawMaterialName: string;
    rawMaterialUnit: Unit;
    quantityRequired: number;
    unit: Unit;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface BillOfMaterialRequest {
    productId: number;
    rawMaterialId: number;
    quantityRequired: number;
    unit: Unit;
    notes?: string;
}