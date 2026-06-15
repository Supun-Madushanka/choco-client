export interface AttendanceResponse {
    id: number;
    employeeId: number;
    employeeNo: string;
    employeeName: string;
    workDate: string;
    checkIn: string | null;
    checkOut: string | null;
    status: AttendanceStatus;
    markedByName: string;
    note: string | null;
    createdAt: string;
    updatedAt: string;
}

export type AttendanceStatus =
    | "PRESENT"
    | "ABSENT"
    | "HALF_DAY"
    | "LATE"
    | "ON_LEAVE";

export interface AttendanceUpdateRequest {
    workDate: string;
    checkIn?: string;
    checkOut?: string;
    status?: AttendanceStatus;
    note?: string;
}