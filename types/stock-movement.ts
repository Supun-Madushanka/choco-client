export type MovementType = "IN" | "OUT" | "ADJUSTMENT";

export interface StockMovementResponse {
    id: number;
    warehouseId: number;
    warehouseName: string;
    rawMaterialId: number;
    rawMaterialName: string;
    unit: string;
    movementType: MovementType;
    quantity: number;
    stockAfterMovement: number | null;
    referenceId: number | null;
    referenceType: string | null;
    note: string | null;
    movedByName: string;
    createdAt: string;
}

export interface StockMovementRequest {
    warehouseId: number;
    rawMaterialId: number;
    movementType: MovementType;
    quantity: number;
    referenceId?: number;
    referenceType?: string;
    note?: string;
}