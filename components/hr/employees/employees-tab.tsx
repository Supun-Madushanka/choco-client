"use client";

import { useState, useEffect } from "react";
import { employeeService } from "@/services/employee-service";
import { EmployeeResponse } from "@/types/employee";
import EmployeesTable from "./employees-table";
import CreateEmployeeDialog from "./create-employee-dialog";

export default function EmployeesTab() {

    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await employeeService.getAllEmployees();
            setEmployees(response.data);
        } catch {
            console.error("Failed to fetch employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Employees
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({employees.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage employee HR profiles
                    </p>
                </div>
                <CreateEmployeeDialog onSuccess={fetchEmployees} />
            </div>

            <EmployeesTable
                employees={employees}
                loading={loading}
                onRefresh={fetchEmployees}
            />
        </div>
    );
}