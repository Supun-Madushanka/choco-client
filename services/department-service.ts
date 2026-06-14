import axiosInstance from "@/lib/api";
import { ApiResponse } from "@/types/auth";
import { DepartmentRequest, DepartmentResponse } from "@/types/department";

export const departmentService = {

    // create a new department
    createDepartment: async (
        request: DepartmentRequest
    ): Promise<ApiResponse<DepartmentResponse>> => {
        const response = await axiosInstance.post<ApiResponse<DepartmentResponse>>(
            "departments",
            request
        );
        return response.data;
    },

    // get all departments
    getAllDepartments: async (): Promise<ApiResponse<DepartmentResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<DepartmentResponse[]>>(
            "departments"
        );
        return response.data;
    },

    // get a department by id
    getDepartmentById: async (id: number): Promise<ApiResponse<DepartmentResponse>> => {
        const response = await axiosInstance.get<ApiResponse<DepartmentResponse>>(
            `departments/${id}`
        );
        return response.data;
    },

    // update a department
    updateDepartment: async (
        id: number,
        request: DepartmentRequest
    ): Promise<ApiResponse<DepartmentResponse>> => {
        const response = await axiosInstance.put<ApiResponse<DepartmentResponse>>(
            `departments/${id}`,
            request
        );
        return response.data;
    },

    // delete a department
    deleteDepartment: async (id: number): Promise<ApiResponse<void>> => {
        const response = await axiosInstance.delete<ApiResponse<void>>(
            `departments/${id}`
        );
        return response.data;
    },
}