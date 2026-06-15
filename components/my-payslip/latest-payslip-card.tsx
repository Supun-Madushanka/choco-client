"use client";

import { PayrollResponse } from "@/types/payroll";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Props {
    payroll: PayrollResponse | null;
    loading: boolean;
}

export default function LatestPayslipCard({
    payroll,
    loading,
}: Props) {
    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (!payroll) {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    No payslip available.
                </CardContent>
            </Card>
        );
    }

    const monthYear = format(
        new Date(payroll.year, payroll.month - 1),
        "MMMM yyyy"
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    Latest Payslip
                </CardTitle>
                <Badge
                    variant="outline"
                    className={
                        payroll.paymentStatus === "PAID"
                        ?
                        "bg-green-50 text-green-600"
                        :
                        "bg-yellow-50 text-yellow-600"
                    }
                >
                    {payroll.paymentStatus}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border-b pb-3">
                    <p className="text-sm text-muted-foreground">
                        {monthYear}
                    </p>
                </div>
                <div className="space-y-2 text-sm">
                    <Row
                        label="Basic Salary"
                        value={payroll.basicSalary}
                    />
                    <Row
                        label="Allowances"
                        value={payroll.allowances}
                    />
                    <Row
                        label="EPF Employee"
                        value={-payroll.epfEmployee}
                    />
                    <Row
                        label="ETF Employer"
                        value={payroll.etfEmployer}
                    />
                    <Row
                        label="Tax"
                        value={-payroll.tax}
                    />
                    <Row
                        label="Other Deductions"
                        value={-payroll.additionalDeductions}
                    />
                </div>
                <div
                    className="
                    border-t
                    pt-4
                    flex
                    justify-between
                    font-bold
                    text-lg
                    "
                >
                    <span>
                        Net Salary
                    </span>
                    <span>
                        LKR {payroll.netSalary.toLocaleString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

function Row({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="flex justify-between">
            <span className="text-muted-foreground">
                {label}
            </span>
            <span>
                LKR {value.toLocaleString()}
            </span>
        </div>
    );
}