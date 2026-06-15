"use client";

import { useState, useEffect, useCallback } from "react";
import { employeeService } from "@/services/employee-service";
import { payrollService } from "@/services/payroll-service";
import { EmployeeResponse } from "@/types/employee";
import { PayrollResponse } from "@/types/payroll";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { Pencil, ReceiptText, CircleDollarSign } from "lucide-react";
import PayrollProcessDialog from "./payroll-process-dialog";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export default function PayrollManagementTab() {

    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1));
    const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [records, setRecords] = useState<PayrollResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const [dialogState, setDialogState] = useState<{
        open: boolean;
        employee: EmployeeResponse | null;
        record: PayrollResponse | null;
    }>({ open: false, employee: null, record: null });

    const [markPaidTarget, setMarkPaidTarget] = useState<PayrollResponse | null>(null);
    const [markPaidLoading, setMarkPaidLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [empRes, payRes] = await Promise.all([
                employeeService.getAllEmployees(),
                payrollService.getByMonthYear(
                    parseInt(selectedMonth), parseInt(selectedYear)
                ),
            ]);

            const activeEmployees = empRes.data.filter(
                (e) => e.status !== "TERMINATED"
            );

            setEmployees(activeEmployees);
            setRecords(payRes.data);
        } catch {
            console.error("Failed to load payroll data");
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getRecord = (employeeId: number) => {
        return records.find((r) => r.employeeId === employeeId);
    };

    const handleMarkPaid = async () => {
        if (!markPaidTarget) return;
        setMarkPaidLoading(true);
        try {
            await payrollService.markAsPaid(markPaidTarget.id);
            fetchData();
        } catch {
            console.error("Failed to mark as paid");
        } finally {
            setMarkPaidLoading(false);
            setMarkPaidTarget(null);
        }
    };

    // Generate year options — current year and previous 2 years
    const yearOptions = [now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2];

    return (
        <div>
            <div className="mb-4">
                <h3 className="text-base font-semibold text-text-primary">
                    Payroll Management
                </h3>
                <p className="text-sm text-text-muted mt-0.5">
                    Process monthly salaries and manage payments
                </p>
            </div>

            {/* Filters */}
            <Card className="border-cream-200 shadow-card mb-4">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Month
                            </Label>
                            <Select
                                value={selectedMonth}
                                onValueChange={setSelectedMonth}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((m, idx) => (
                                        <SelectItem key={idx + 1} value={String(idx + 1)}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Year
                            </Label>
                            <Select
                                value={selectedYear}
                                onValueChange={setSelectedYear}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((y) => (
                                        <SelectItem key={y} value={String(y)}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Employee
                                </TableHead>
                                <TableHead>
                                    Basic 
                                </TableHead>
                                <TableHead>
                                    Allowances
                                </TableHead>
                                <TableHead>
                                    EPF (8%)
                                </TableHead>
                                <TableHead>
                                    ETF (3%)
                                </TableHead>
                                <TableHead>
                                    Tax
                                </TableHead>
                                <TableHead>
                                    Other Ded.
                                </TableHead>
                                <TableHead>
                                    Net Salary
                                </TableHead>
                                <TableHead>
                                    Paid By
                                </TableHead>
                                <TableHead>
                                    Status
                                </TableHead>
                                <TableHead>
                                    
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [1, 2, 3, 4].map((i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={10}>
                                            <Skeleton className="h-10 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : employees.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        className="text-center py-5">
                                        No employees found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees.map((employee) => {
                                    const record = getRecord(employee.id);

                                    return (
                                        <TableRow
                                            key={employee.id}
                                        >

                                            <TableCell>
                                                <p className="text-sm font-medium text-text-primary">
                                                    {employee.fullName}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    {employee.employeeNo} · {employee.departmentName}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                {record ? formatCurrency(record.basicSalary) : "—"}
                                            </TableCell>
                                            <TableCell>
                                                {record ? formatCurrency(record.allowances) : "—"}
                                            </TableCell>
                                            <TableCell className="text-error">
                                                {record ? `- ${formatCurrency(record.epfEmployee)}` : "—"}
                                            </TableCell>
                                            <TableCell>
                                                {record ? formatCurrency(record.etfEmployer) : "—"}
                                            </TableCell>
                                            <TableCell className="text-error">
                                                {record ? `- ${formatCurrency(record.tax)}` : "—"}
                                            </TableCell>
                                            <TableCell className="text-error">
                                                {record ? `- ${formatCurrency(record.additionalDeductions)}` : "—"}
                                            </TableCell>
                                            <TableCell>
                                                {record ? formatCurrency(record.netSalary) : "—"}
                                            </TableCell>
                                            <TableCell>
                                                {record ? record.processedByName : "—"}
                                            </TableCell>

                                            <TableCell>
                                                {record ? (
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${
                                                            record.paymentStatus === "PAID"
                                                                ? "bg-success-light text-success border-success/20"
                                                                : "bg-warning-light text-warning border-warning/20"
                                                        }`}>
                                                        {record.paymentStatus}
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-cream-100
                                                                   text-text-muted border-cream-200">
                                                        Not Processed
                                                    </Badge>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {!record ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setDialogState({
                                                            open: true, employee, record: null,
                                                        })}
                                                        className="h-8 text-xs bg-gold-500
                                                                   hover:bg-gold-400 text-white gap-1">
                                                        <ReceiptText size={13} />
                                                        Process
                                                    </Button>
                                                ) : record.paymentStatus === "PENDING" ? (
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDialogState({
                                                                open: true, employee, record,
                                                            })}
                                                            className="h-8 w-8 text-text-muted">
                                                            <Pencil size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setMarkPaidTarget(record)}
                                                            className="h-8 w-8 text-success">
                                                            <CircleDollarSign size={15} />
                                                        </Button>
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

            {/* Process/Edit Dialog */}
            <PayrollProcessDialog
                open={dialogState.open}
                employee={dialogState.employee}
                existingRecord={dialogState.record}
                month={parseInt(selectedMonth)}
                year={parseInt(selectedYear)}
                onClose={() => setDialogState({
                    open: false, employee: null, record: null,
                })}
                onSuccess={() => {
                    setDialogState({ open: false, employee: null, record: null });
                    fetchData();
                }}
            />

            {/* Mark Paid Confirm */}
            <AlertDialog
                open={!!markPaidTarget}
                onOpenChange={(open) => !open && setMarkPaidTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Mark as Paid</AlertDialogTitle>
                        <AlertDialogDescription>
                            Confirm that{" "}
                            <span className="font-medium text-text-primary">
                                {markPaidTarget?.employeeName}
                            </span>
                            &apos;s salary of{" "}
                            <span className="font-medium text-text-primary">
                                LKR {markPaidTarget ? formatCurrency(markPaidTarget.netSalary) : ""}
                            </span>{" "}
                            has been paid. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={markPaidLoading}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={markPaidLoading}
                            onClick={handleMarkPaid}
                            className="bg-success hover:bg-success/90">
                            {markPaidLoading ? "Processing..." : "Confirm Paid"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}