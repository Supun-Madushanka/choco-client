"use client";

import { PayrollResponse } from "@/types/payroll";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Props {
    payrolls: PayrollResponse[];
    loading: boolean;
}

export default function PaymentHistoryTable({
    payrolls,
    loading,
}: Props) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Payment History
                </CardTitle>
            </CardHeader>
            <CardContent>
                {
                    loading
                    ?
                    <div className="space-y-3">
                        {[1,2,3].map(i => (
                            <Skeleton
                                key={i}
                                className="h-12 w-full"
                            />
                        ))}
                    </div>
                    :
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Month
                                </TableHead>
                                <TableHead>
                                    Net Salary
                                </TableHead>
                                <TableHead>
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                payrolls.map(
                                    payroll => (
                                    <TableRow
                                        key={payroll.id}
                                    >
                                        <TableCell>
                                            {
                                                format(
                                                    new Date(
                                                        payroll.year,
                                                        payroll.month - 1
                                                    ),
                                                    "MMMM yyyy"
                                                )
                                            }
                                        </TableCell>
                                        <TableCell>
                                            LKR {
                                                payroll.netSalary
                                                .toLocaleString()
                                            }
                                        </TableCell>
                                        <TableCell>
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
                                                {
                                                    payroll.paymentStatus
                                                }
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                }
            </CardContent>
        </Card>
    );
}