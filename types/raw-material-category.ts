export interface RawMaterialCategoryRequest {
    name: string;
    description?: string;
}

export interface RawMaterialCategoryResponse {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}