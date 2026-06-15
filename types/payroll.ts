export interface PayrollResponse {
    id: number;
    employeeId: number;
    employeeNo: string;
    employeeName: string;
    departmentName: string;
    month: number;
    year: number;
    basicSalary: number;
    allowances: number;
    epfEmployee: number;
    etfEmployer: number;
    tax: number;
    additionalDeductions: number;
    deductions: number;
    netSalary: number;
    paymentStatus: PaymentStatus;
    paidAt: string | null;
    processedByName: string;
    note: string | null;
    createdAt: string;
    updatedAt: string;
}

export type PaymentStatus = "PENDING" | "PAID";

export interface PayrollRequest {
    employeeId: number;
    month: number;
    year: number;
    basicSalary: number;
    allowances?: number;
    additionalDeductions?: number;
    taxPercentage?: number;
    note?: string;
}