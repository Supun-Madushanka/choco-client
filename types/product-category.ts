export interface ProductCategoryResponse {
    id: number;
    name: string;
    codePrefix: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ProductCategoryRequest {
    name: string;
    codePrefix?: string;
    description?: string;
}