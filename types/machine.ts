export type MachineStatus = "OPERATIONAL" | "MAINTENANCE" | "BREAKDOWN" | "RETIRED";

export interface MachineResponse {
    id: number;
    code: string;
    name: string;
    model: string | null;
    serialNo: string | null;
    purchaseDate: string | null;
    lastMaintenance: string | null;
    nextMaintenance: string | null;
    status: MachineStatus;
    createdAt: string;
    updatedAt: string;
}

export interface MachineRequest {
    name: string;
    model?: string;
    serialNo?: string;
    purchaseDate?: string;
    lastMaintenance?: string;
    nextMaintenance?: string;
    status?: string;
}