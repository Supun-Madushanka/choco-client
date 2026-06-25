export type MaintenanceType = "PREVENTIVE" | "CORRECTIVE" | "EMERGENCY";

export interface MaintenanceLogResponse {
    id: number;
    machineId: number;
    machineCode: string;
    machineName: string;
    maintenanceType: MaintenanceType;
    description: string;
    maintenanceDate: string;
    nextMaintenanceDate: string | null;
    cost: number;
    performedByName: string;
    createdAt: string;
}

export interface MaintenanceLogRequest {
    machineId: number;
    maintenanceType: string;
    description: string;
    maintenanceDate: string;
    nextMaintenanceDate?: string;
    cost?: number;
}