export type Unit = 'KG' | 'G' | 'L' | 'ML' | 'PIECES' | 'BOXES' | 'BAGS' | 'PACKETS';

export interface ProductResponse {
    id: number;
    categoryId: number;
    categoryName: string;
    codePrefix: string | null;
    code: string;
    name: string;
    variant: string | null;
    packagingType: string | null;
    unit: Unit;
    weightPerUnit: number | null;
    sellingPrice: number;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductRequest {
    categoryId: number;
    name: string;
    variant?: string;
    packagingType?: string;
    unit: Unit;
    weightPerUnit?: number;
    sellingPrice: number;
    description?: string;
    isActive?: boolean;
}