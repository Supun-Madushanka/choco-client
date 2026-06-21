export type RawMaterialUnit =
    | "KG" | "G" | "L" | "ML"
    | "PIECES" | "BOXES" | "BAGS" | "PACKETS";

export interface RawMaterialResponse {
    id: number;
    categoryId: number;
    categoryName: string;
    name: string;
    unit: RawMaterialUnit;
    minStockLevel: number;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RawMaterialRequest {
    categoryId: number;
    name: string;
    unit: RawMaterialUnit;
    minStockLevel: number;
    description?: string;
    isActive?: boolean;
}