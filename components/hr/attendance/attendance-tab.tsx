"use client";

import { useState, useEffect, useCallback } from "react";
import { employeeService } from "@/services/employee-service";
import { departmentService } from "@/services/department-service";
import { attendanceService } from "@/services/attendance-service";
import { EmployeeResponse } from "@/types/employee";
import { DepartmentResponse } from "@/types/department";
import { AttendanceResponse } from "@/types/attendance";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pencil, ClipboardPlus } from "lucide-react";
import { format } from "date-fns";
import AttendanceEditDialog from "./attendance-edit-dialog";

export default function AttendanceManagementTab() {

    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [records, setRecords] = useState<AttendanceResponse[]>([]);

    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState(
        format(new Date(), "yyyy-MM-dd")
    );

    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(true);

    const [dialogState, setDialogState] = useState<{
        open: boolean;
        employee: EmployeeResponse | null;
        record: AttendanceResponse | null;
    }>({ open: false, employee: null, record: null });

    useEffect(() => {
        const fetchOptions = async () => {
            setOptionsLoading(true);
            try {
                const deptRes = await departmentService.getAllDepartments();
                setDepartments(deptRes.data);
                if (deptRes.data.length > 0) {
                    setSelectedDepartment(String(deptRes.data[0].id));
                }
            } catch {
                console.error("Failed to load departments");
            } finally {
                setOptionsLoading(false);
            }
        };
        fetchOptions();
    }, []);

    const fetchData = useCallback(async () => {
        if (!selectedDepartment) return;

        setLoading(true);
        try {
            const [empRes, attRes] = await Promise.all([
                employeeService.getEmployeesByDepartment(
                    parseInt(selectedDepartment)
                ),
                attendanceService.getByDate(selectedDate),
            ]);

            const activeEmployees = empRes.data.filter(
                (e) => e.status !== "TERMINATED"
            );

            setEmployees(activeEmployees);
            setRecords(attRes.data);
        } catch {
            console.error("Failed to load attendance data");
        } finally {
            setLoading(false);
        }
    }, [selectedDepartment, selectedDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getRecord = (employeeId: number) => {
        return records.find((r) => r.employeeId === employeeId);
    };

    const getStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            PRESENT: "bg-success-light text-success border-success/20",
            LATE: "bg-warning-light text-warning border-warning/20",
            HALF_DAY: "bg-info-light text-info border-info/20",
            ABSENT: "bg-error-light text-error border-error/20",
            ON_LEAVE: "bg-purple-50 text-purple-600 border-purple-200",
        };
        return map[status] || "bg-cream-100 text-text-secondary border-cream-200";
    };

    return (
        <div>
            <div className="mb-4">
                <h3 className="text-base font-semibold text-text-primary">
                    Attendance Management
                </h3>
                <p className="text-sm text-text-muted mt-0.5">
                    View and manage daily attendance by department
                </p>
            </div>

            {/* Filters */}
            <Card className="border-cream-200 shadow-card mb-4">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Department
                            </Label>
                            <Select
                                disabled={optionsLoading}
                                value={selectedDepartment}
                                onValueChange={setSelectedDepartment}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={String(dept.id)}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Date
                            </Label>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
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
                                    Check In
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium">
                                    Check Out
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium">
                                    Status
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium w-12">
                                    
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [1, 2, 3, 4].map((i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5}>
                                            <Skeleton className="h-10 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : employees.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-12 text-text-muted">
                                        No employees found in this department
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees.map((employee) => {
                                    const record = getRecord(employee.id);

                                    return (
                                        <TableRow
                                            key={employee.id}
                                            className="hover:bg-cream-50 transition-colors">

                                            <TableCell>
                                                <p className="text-sm font-medium text-text-primary">
                                                    {employee.fullName}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    {employee.employeeNo}
                                                </p>
                                            </TableCell>

                                            <TableCell className="text-sm text-text-secondary">
                                                {record?.checkIn
                                                    ? format(new Date(record.checkIn), "hh:mm a")
                                                    : "—"}
                                            </TableCell>

                                            <TableCell className="text-sm text-text-secondary">
                                                {record?.checkOut
                                                    ? format(new Date(record.checkOut), "hh:mm a")
                                                    : "—"}
                                            </TableCell>

                                            <TableCell>
                                                {record ? (
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${getStatusBadge(record.status)}`}>
                                                        {record.status.replace("_", " ")}
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-cream-100
                                                                   text-text-muted border-cream-200">
                                                        Not Marked
                                                    </Badge>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDialogState({
                                                        open: true,
                                                        employee,
                                                        record: record || null,
                                                    })}
                                                    className="h-8 w-8 text-text-muted">
                                                    {record
                                                        ? <Pencil size={15} />
                                                        : <ClipboardPlus size={15} />}
                                                </Button>
                                            </TableCell>

                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Edit/Create Dialog */}
            <AttendanceEditDialog
                open={dialogState.open}
                employee={dialogState.employee}
                existingRecord={dialogState.record}
                workDate={selectedDate}
                onClose={() => setDialogState({
                    open: false, employee: null, record: null,
                })}
                onSuccess={() => {
                    setDialogState({ open: false, employee: null, record: null });
                    fetchData();
                }}
            />
        </div>
    );
}