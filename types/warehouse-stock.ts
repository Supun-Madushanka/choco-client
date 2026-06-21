export interface WarehouseStockResponse {
    id: number;
    warehouseId: number;
    warehouseName: string;
    rawMaterialId: number;
    rawMaterialName: string;
    categoryName: string;
    unit: string;
    quantity: number;
    minStockLevel: number;
    isLowStock: boolean;
    lastUpdated: string;
}