export interface ShiftAssignmentRequest {
  employeeId: number;
  shiftId: number;
  assignedDate: string;
  note?: string;
}

export interface ShiftAssignmentResponse {
    id: number;
    employeeId: number;
    employeeNo: string;
    employeeName: string;
    shiftId: number;
    shiftName: string;
    shiftStartTime: string;
    shiftEndTime: string;
    assignedDate: string;
    assignedByName: string;
    note: string;
    createdAt: string;
}