"use client";

import { useState, useEffect, useCallback } from "react";
import { employeeService } from "@/services/employee-service";
import { departmentService } from "@/services/department-service";
import { shiftService } from "@/services/shift-service";
import { shiftRosterService } from "@/services/shift-roster-service";
import { EmployeeResponse } from "@/types/employee";
import { DepartmentResponse } from "@/types/department";
import { ShiftResponse } from "@/types/shift";
import { ShiftAssignmentResponse } from "@/types/shift-roster";
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
import { Save, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default function ShiftRosterTab() {

    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [shifts, setShifts] = useState<ShiftResponse[]>([]);
    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [assignments, setAssignments] = useState<ShiftAssignmentResponse[]>([]);

    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState(
        format(new Date(), "yyyy-MM-dd")
    );

    // Pending shift selections per employeeId (not yet saved)
    const [pendingShifts, setPendingShifts] = useState<Record<number, string>>({});
    const [savingId, setSavingId] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load departments + active shifts once
    useEffect(() => {
        const fetchOptions = async () => {
            setOptionsLoading(true);
            try {
                const [deptRes, shiftRes] = await Promise.all([
                    departmentService.getAllDepartments(),
                    shiftService.getActiveShifts(),
                ]);
                setDepartments(deptRes.data);
                setShifts(shiftRes.data);
                if (deptRes.data.length > 0) {
                    setSelectedDepartment(String(deptRes.data[0].id));
                }
            } catch {
                setError("Failed to load filters");
            } finally {
                setOptionsLoading(false);
            }
        };
        fetchOptions();
    }, []);

    const fetchRoster = useCallback(async () => {
        if (!selectedDepartment) return;

        setLoading(true);
        setError(null);
        setPendingShifts({});

        try {
            const [empRes, assignRes] = await Promise.all([
                employeeService.getEmployeesByDepartment(
                    parseInt(selectedDepartment)
                ),
                shiftRosterService.getByDate(selectedDate),
            ]);

            // Exclude terminated employees
            const activeAndInactive = empRes.data.filter(
                (e) => e.status !== "TERMINATED"
            );

            setEmployees(activeAndInactive);
            setAssignments(assignRes.data);
        } catch {
            setError("Failed to load roster data");
        } finally {
            setLoading(false);
        }
    }, [selectedDepartment, selectedDate]);

    useEffect(() => {
        fetchRoster();
    }, [fetchRoster]);

    const getAssignment = (employeeId: number) => {
        return assignments.find((a) => a.employeeId === employeeId);
    };

    const handleShiftSelect = (employeeId: number, shiftId: string) => {
        setPendingShifts((prev) => ({ ...prev, [employeeId]: shiftId }));
    };

    const handleSave = async (employeeId: number) => {
        const shiftId = pendingShifts[employeeId];
        if (!shiftId) return;

        setSavingId(employeeId);
        setError(null);

        try {
            await shiftRosterService.assignShift({
                employeeId,
                shiftId: parseInt(shiftId),
                assignedDate: selectedDate,
            });

            // Refresh assignments only
            const assignRes = await shiftRosterService.getByDate(selectedDate);
            setAssignments(assignRes.data);

            setPendingShifts((prev) => {
                const next = { ...prev };
                delete next[employeeId];
                return next;
            });
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Failed to assign shift"
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setSavingId(null);
        }
    };

    const formatTime = (time: string) => {
        const [hour, minute] = time.split(":");
        const date = new Date();
        date.setHours(parseInt(hour), parseInt(minute));
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div>
            <div className="mb-4">
                <h3 className="text-base font-semibold text-text-primary">
                    Shift Roster
                </h3>
                <p className="text-sm text-text-muted mt-0.5">
                    Assign daily shifts to employees by department
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

            {error && (
                <div className="bg-error-light border border-error/20
                                text-error rounded-lg px-4 py-3 text-sm mb-4">
                    {error}
                </div>
            )}

            {/* Roster Table */}
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Employee
                                </TableHead>
                                <TableHead>
                                    Current Shift
                                </TableHead>
                                <TableHead>
                                  Assigned By
                                </TableHead>
                                <TableHead>
                                    Assign Shift
                                </TableHead>
                                <TableHead>
                                    
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [1, 2, 3, 4].map((i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={4}>
                                            <Skeleton className="h-10 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : employees.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-5">
                                        No employees found in this department
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees.map((employee) => {
                                    const assignment = getAssignment(employee.id);
                                    const pendingShiftId = pendingShifts[employee.id];
                                    const hasChange = !!pendingShiftId &&
                                        pendingShiftId !== String(assignment?.shiftId || "");

                                    return (
                                        <TableRow
                                            key={employee.id}
                                        >

                                            {/* Employee */}
                                            <TableCell>
                                                <p className="text-sm font-medium text-text-primary">
                                                    {employee.fullName}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    {employee.employeeNo}
                                                </p>
                                            </TableCell>

                                            {/* Current Shift */}
                                            <TableCell>
                                                {assignment ? (
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs bg-success-light
                                                                       text-success border-success/20">
                                                            {assignment.shiftName}
                                                        </Badge>
                                                        <div className="flex items-center gap-1
                                                                        text-xs text-text-muted">
                                                            <Clock size={11} />
                                                            {formatTime(assignment.shiftStartTime)} - {formatTime(assignment.shiftEndTime)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-text-muted">
                                                        Not assigned
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {assignment?.assignedByName ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-text-primary">
                                                            {assignment.assignedByName}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-text-muted">
                                                        N/A
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* Assign Shift */}
                                            <TableCell>
                                                <Select
                                                    value={pendingShiftId || ""}
                                                    onValueChange={(value) =>
                                                        handleShiftSelect(employee.id, value)
                                                    }>
                                                    <SelectTrigger className="border-cream-200
                                                                               focus:ring-gold-500 h-9 w-44">
                                                        <SelectValue placeholder="Select shift" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {shifts.map((shift) => (
                                                            <SelectItem
                                                                key={shift.id}
                                                                value={String(shift.id)}>
                                                                {shift.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>

                                            {/* Save */}
                                            <TableCell>
                                                {savingId === employee.id ? (
                                                    <Button
                                                        size="icon"
                                                        disabled
                                                        className="h-9 w-9 bg-gold-300 text-white">
                                                        <Save size={15} />
                                                    </Button>
                                                ) : hasChange ? (
                                                    <Button
                                                        size="icon"
                                                        onClick={() => handleSave(employee.id)}
                                                        className="h-9 w-9 bg-gold-500
                                                                   hover:bg-gold-400 text-white">
                                                        <Save size={15} />
                                                    </Button>
                                                ) : assignment ? (
                                                    <div className="h-9 w-9 flex items-center
                                                                    justify-center">
                                                        <CheckCircle2 size={16} className="text-success" />
                                                    </div>
                                                ) : null}
                                            </TableCell>

                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
        </div>
    );
}