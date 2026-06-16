export interface WarehouseResponse {
    id: number;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    capacity: number;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface WarehouseRequest {
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    capacity: number;
    description: string;
    isActive: boolean;
}