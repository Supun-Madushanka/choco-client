"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DepartmentResponse } from "@/types/department";
import { departmentService } from "@/services/department-service";
import { useAuthStore } from "@/store/auth-store";
import DepartmentsTable from "./departments-table";
import CreateDepartmentDialog from "./create-department-dialog";
import EditDepartmentDialog from "./edit-department-dialog";

export default function DepartmentsTab() {

    const { user } = useAuthStore();
    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentResponse | null>(null);

    const canManage = user?.role === "SUPER_ADMIN";

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const res =
                await departmentService.getAllDepartments();
            if (res.success) {
                setDepartments(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }

    };

    const handleDelete = async (id: number) => {
        try {
            await departmentService.deleteDepartment(id);
            fetchDepartments();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Departments
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({departments.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage organization departments
                    </p>
                </div>

                {canManage && (

                    <Button
                        onClick={() => setCreateOpen(true)}
                        className="gap-2"
                    >
                        <Plus size={16} />
                        Create Department
                    </Button>
                )}
            </div>

            {/* Table */}
            <DepartmentsTable
                departments={departments}
                loading={loading}
                onDelete={handleDelete}
                onEdit={(dept) => {
                    setSelectedDepartment(dept);
                    setEditOpen(true);
                }}
                canManage={user?.role === "SUPER_ADMIN"}
            />

            {/* Dialog */}
            <CreateDepartmentDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={() => {
                    setCreateOpen(false);
                    fetchDepartments();
                }}
            />

            <EditDepartmentDialog
                open={editOpen}
                department={selectedDepartment}
                onClose={() => {
                    setEditOpen(false);
                    setSelectedDepartment(null);
                }}
                onSuccess={() => {
                    setEditOpen(false);
                    setSelectedDepartment(null);
                    fetchDepartments();
                }}
            />
        </div>
    );
}