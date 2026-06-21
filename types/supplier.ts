export type SupplierType = "LOCAL" | "INTERNATIONAL";
export type SupplierStatus = "ACTIVE" | "INACTIVE";

export interface SupplierResponse {
    id: number;
    code: string;
    name: string;
    contactPerson: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    country: string;
    supplierType: SupplierType;
    status: SupplierStatus;
    createdAt: string;
    updatedAt: string;
}

export interface SupplierRequest {
    name: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    country: string;
    supplierType: SupplierType;
    status?: SupplierStatus;
}