import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import {
    EmployeeResponse,
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
} from "@/types/employee";

export const employeeService = {

    getAllEmployees: async (): Promise<ApiResponse<EmployeeResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<EmployeeResponse[]>>(
            "employees"
        );
        return response.data;
    },

    getEmployeeById: async (id: number): Promise<ApiResponse<EmployeeResponse>> => {
        const response = await axiosInstance.get<ApiResponse<EmployeeResponse>>(
            `employees/${id}`
        );
        return response.data;
    },

    getEmployeesByDepartment: async (
        departmentId: number
    ): Promise<ApiResponse<EmployeeResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<EmployeeResponse[]>>(
            `employees/department/${departmentId}`
        );
        return response.data;
    },

    getNextEmployeeNumber: async (
        departmentId: number
    ): Promise<ApiResponse<string>> => {
        const response = await axiosInstance.get<ApiResponse<string>>(
            `employees/next-number?departmentId=${departmentId}`
        );
        return response.data;
    },

    createEmployee: async (
        request: CreateEmployeeRequest
    ): Promise<ApiResponse<EmployeeResponse>> => {
        const response = await axiosInstance.post<ApiResponse<EmployeeResponse>>(
            "employees",
            request
        );
        return response.data;
    },

    updateEmployee: async (
        id: number,
        request: UpdateEmployeeRequest
    ): Promise<ApiResponse<EmployeeResponse>> => {
        const response = await axiosInstance.put<ApiResponse<EmployeeResponse>>(
            `employees/${id}`,
            request
        );
        return response.data;
    },

    activateEmployee: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.put<ApiResponse<void>>(
            `employees/${id}/activate`
        );
        return response.data;
    },

    deactivateEmployee: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.put<ApiResponse<void>>(
            `employees/${id}/deactivate`
        );
        return response.data;
    },
};