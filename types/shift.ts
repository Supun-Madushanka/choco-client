import { create } from 'zustand';
export interface ShiftRequest {
    name: string;
    startTime: string;
    endTime: string;
    type: ShiftType;
    description?: string;
    isActive?: boolean;
}

export type ShiftType = "FIXED" | "FLEXIBLE" | "ROTATING";

export interface ShiftResponse {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    type: ShiftType;
    description: string | null;
    isActive: boolean;
    createdAt: string;
}