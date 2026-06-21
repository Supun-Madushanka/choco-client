"use client";

import { useRouter } from "next/navigation";
import { PurchaseOrderResponse } from "@/types/purchase-order";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface PurchaseOrdersTableProps {
    orders: PurchaseOrderResponse[];
    loading: boolean;
}

export default function PurchaseOrdersTable({
    orders,
    loading,
}: PurchaseOrdersTableProps) {

    const router = useRouter();

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "DRAFT":
                return "bg-cream-100 text-text-secondary border-cream-200";
            case "PENDING_APPROVAL":
                return "bg-warning-light text-warning border-warning/20";
            case "APPROVED":
                return "bg-info-light text-info border-info/20";
            case "ORDERED":
                return "bg-blue-50 text-blue-600 border-blue-200";
            case "PARTIALLY_RECEIVED":
                return "bg-purple-50 text-purple-600 border-purple-200";
            case "RECEIVED":
                return "bg-success-light text-success border-success/20";
            case "REJECTED":
            case "CANCELLED":
                return "bg-error-light text-error border-error/20";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    const getPaymentBadgeClass = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-success-light text-success border-success/20";
            case "PARTIAL":
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
        <Card>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                PO Number
                            </TableHead>
                            <TableHead>
                                Supplier
                            </TableHead>
                            <TableHead>
                                Created By
                            </TableHead>
                            <TableHead>
                                Approved By
                            </TableHead>
                            <TableHead>
                                Total Amount
                            </TableHead>
                            <TableHead>
                                Status
                            </TableHead>
                            <TableHead>
                                Payment
                            </TableHead>
                            <TableHead>
                                Expected Date
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-6 text-text-muted">
                                    No purchase orders found
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    onClick={() => router.push(
                                        `/dashboard/suppliers/purchase-orders/${order.id}`
                                    )}
                                    className="hover:bg-cream-50 transition-colors cursor-pointer">

                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-mono
                                                       border-cream-200
                                                       text-text-secondary">
                                            {order.poNumber}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <p className="text-sm font-medium text-text-primary">
                                            {order.supplierName}
                                        </p>
                                        <p className="text-xs text-text-muted mt-0.5">
                                            {order.supplierCode}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                            {order.createdByName}
                                    </TableCell>

                                    <TableCell>
                                        {order.approvedByName || "—"}
                                    </TableCell>

                                    <TableCell>
                                        <p className="text-sm font-medium text-text-primary">
                                            {order.currency} {order.totalAmount.toLocaleString()}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${getStatusBadgeClass(order.status)}`}>
                                            {order.status.replace("_", " ")}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${getPaymentBadgeClass(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <p className="text-sm text-text-secondary whitespace-nowrap">
                                            {order.expectedDate
                                                ? format(new Date(order.expectedDate), "dd MMM yyyy")
                                                : "—"}
                                        </p>
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
    );
}