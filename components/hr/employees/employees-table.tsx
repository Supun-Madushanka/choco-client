"use client";

import { useState } from "react";
import { EmployeeResponse } from "@/types/employee";
import { employeeService } from "@/services/employee-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    MoreHorizontal,
    Pencil,
    UserCheck,
    UserX,
    Phone,
} from "lucide-react";
import EditEmployeeDialog from "./edit-employee-dialog";

interface EmployeesTableProps {
    employees: EmployeeResponse[];
    loading: boolean;
    onRefresh: () => void;
}

export default function EmployeesTable({
    employees,
    loading,
    onRefresh,
}: EmployeesTableProps) {

    const [editEmployee, setEditEmployee] = useState<EmployeeResponse | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: "activate" | "deactivate" | null;
        employee: EmployeeResponse | null;
    }>({ open: false, type: null, employee: null });

    const handleConfirm = async () => {
        if (!confirmDialog.employee || !confirmDialog.type) return;

        setActionLoading(true);
        try {
            if (confirmDialog.type === "activate") {
                await employeeService.activateEmployee(confirmDialog.employee.id);
            } else {
                await employeeService.deactivateEmployee(confirmDialog.employee.id);
            }
            onRefresh();
        } catch {
            console.error("Failed to update employee status");
        } finally {
            setActionLoading(false);
            setConfirmDialog({ open: false, type: null, employee: null });
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-success-light text-success border-success/20";
            case "INACTIVE":
                return "bg-warning-light text-warning border-warning/20";
            case "TERMINATED":
                return "bg-error-light text-error border-error/20";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    const getEmploymentTypeBadgeClass = (type: string) => {
        switch (type) {
            case "PERMANENT":
                return "bg-blue-50 text-blue-600 border-blue-200";
            case "CONTRACT":
                return "bg-purple-50 text-purple-600 border-purple-200";
            case "PROBATION":
                return "bg-warning-light text-warning border-warning/20";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-card border border-cream-200
                            shadow-card overflow-hidden">
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-card border border-cream-200
                            shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-cream-50 hover:bg-cream-50">
                                <TableHead className="text-text-secondary font-medium">
                                    Employee
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium">
                                    No.
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium hidden md:table-cell">
                                    Department
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium hidden lg:table-cell">
                                    Contact
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium hidden lg:table-cell">
                                    Type
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium">
                                    Status
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium w-12">
                                    
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center py-12 text-text-muted">
                                        No employees found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees.map((employee) => (
                                    <TableRow
                                        key={employee.id}
                                        className="hover:bg-cream-50 transition-colors">

                                        {/* Employee */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-9 h-9 shrink-0">
                                                    <AvatarFallback
                                                        className="bg-chocolate-900
                                                                   text-white text-sm
                                                                   font-semibold">
                                                        {employee.fullName
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium
                                                                  text-text-primary truncate">
                                                        {employee.fullName}
                                                    </p>
                                                    <p className="text-xs text-text-muted truncate">
                                                        {employee.userEmail || "No account linked"}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Employee No */}
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-xs font-mono
                                                           border-cream-200
                                                           text-text-secondary">
                                                {employee.employeeNo}
                                            </Badge>
                                        </TableCell>

                                        {/* Department */}
                                        <TableCell className="hidden md:table-cell">
                                            <p className="text-sm text-text-secondary">
                                                {employee.departmentName}
                                            </p>
                                        </TableCell>

                                        {/* Contact */}
                                        <TableCell className="hidden lg:table-cell">
                                            {employee.phone ? (
                                                <div className="flex items-center gap-1.5
                                                                text-sm text-text-secondary">
                                                    <Phone size={12} className="text-text-muted" />
                                                    {employee.phone}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-text-muted">—</span>
                                            )}
                                        </TableCell>

                                        {/* Employment Type */}
                                        <TableCell className="hidden lg:table-cell">
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getEmploymentTypeBadgeClass(employee.employmentType)}`}>
                                                {employee.employmentType}
                                            </Badge>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getStatusBadgeClass(employee.status)}`}>
                                                {employee.status}
                                            </Badge>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-text-muted">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44">
                                                    <DropdownMenuItem
                                                        onClick={() => setEditEmployee(employee)}
                                                        className="gap-2 cursor-pointer">
                                                        <Pencil size={14} />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {employee.status === "ACTIVE" ? (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                setConfirmDialog({
                                                                    open: true,
                                                                    type: "deactivate",
                                                                    employee,
                                                                })
                                                            }
                                                            className="gap-2 cursor-pointer text-error
                                                                       focus:text-error focus:bg-error-light">
                                                            <UserX size={14} />
                                                            Deactivate
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                setConfirmDialog({
                                                                    open: true,
                                                                    type: "activate",
                                                                    employee,
                                                                })
                                                            }
                                                            className="gap-2 cursor-pointer text-success
                                                                       focus:text-success focus:bg-success-light">
                                                            <UserCheck size={14} />
                                                            Activate
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Edit Dialog */}
            <EditEmployeeDialog
                employee={editEmployee}
                open={!!editEmployee}
                onClose={() => setEditEmployee(null)}
                onSuccess={() => {
                    setEditEmployee(null);
                    onRefresh();
                }}
            />

            {/* Activate/Deactivate Confirm */}
            <AlertDialog
                open={confirmDialog.open}
                onOpenChange={(open) =>
                    setConfirmDialog((prev) => ({ ...prev, open }))
                }>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmDialog.type === "deactivate"
                                ? "Deactivate Employee"
                                : "Activate Employee"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog.type === "deactivate"
                                ? `Are you sure you want to deactivate ${confirmDialog.employee?.fullName}? Their status will be marked as inactive.`
                                : `Are you sure you want to activate ${confirmDialog.employee?.fullName}? Their status will be marked as active.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={actionLoading}
                            onClick={handleConfirm}
                            className={
                                confirmDialog.type === "deactivate"
                                    ? "bg-error hover:bg-error/90"
                                    : "bg-success hover:bg-success/90"
                            }>
                            {actionLoading
                                ? "Processing..."
                                : confirmDialog.type === "deactivate"
                                ? "Deactivate"
                                : "Activate"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}