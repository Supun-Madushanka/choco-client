export interface EmployeeResponse {
    id: number;
    userId: number | null;
    userEmail: string | null;
    departmentId: number;
    departmentName: string;
    employeeNo: string;
    fullName: string;
    phone: string | null;
    nic: string | null;
    address: string | null;
    dateOfBirth: string | null;
    gender: Gender | null;
    joinedDate: string;
    employmentType: EmploymentType;
    status: EmployeeStatus;
    createdAt: string;
    updatedAt: string;
}

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type EmploymentType = "PERMANENT" | "CONTRACT" | "PROBATION";
export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "TERMINATED";

export interface CreateEmployeeRequest {
    userId: number;
    departmentId: number;
    employeeNo: string;
    fullName: string;
    phone?: string;
    nic?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: Gender;
    joinedDate: string;
    employmentType: EmploymentType;
}

export interface UpdateEmployeeRequest {
    departmentId: number;
    employeeNo: string;
    fullName: string;
    phone?: string;
    nic?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: Gender;
    employmentType: EmploymentType;
}