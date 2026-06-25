"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductionOrderResponse } from "@/types/production-order";
import { productionOrderService } from "@/services/production-order-service";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import EditProductionOrderDialog from "./edit-production-order-dialog";

interface ProductionOrdersTableProps {
    orders: ProductionOrderResponse[];
    loading: boolean;
    onRefresh: () => void;
}

export default function ProductionOrdersTable({
    orders,
    loading,
    onRefresh,
}: ProductionOrdersTableProps) {

    const router = useRouter();
    const [editOrder, setEditOrder] = useState<ProductionOrderResponse | null>(null);
    const [deleteOrder, setDeleteOrder] = useState<ProductionOrderResponse | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteOrder) return;
        setDeleting(true);
        try {
            await productionOrderService.deleteOrder(deleteOrder.id);
            onRefresh();
        } catch {
            console.error("Failed to delete production order");
        } finally {
            setDeleting(false);
            setDeleteOrder(null);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "DRAFT":
                return "bg-cream-100 text-text-secondary border-cream-200";
            case "PENDING_APPROVAL":
                return "bg-warning-light text-warning border-warning/20";
            case "APPROVED":
                return "bg-info-light text-info border-info/20";
            case "IN_PROGRESS":
                return "bg-blue-50 text-blue-600 border-blue-200";
            case "COMPLETED":
                return "bg-success-light text-success border-success/20";
            case "CANCELLED":
                return "bg-error-light text-error border-error/20";
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
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order No</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Planned Qty</TableHead>
                                <TableHead>Actual Qty</TableHead>
                                <TableHead>Planned Date</TableHead>
                                <TableHead>Created By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center py-6 text-text-muted">
                                        No production orders found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        onClick={() => router.push(
                                            `/dashboard/production/orders/${order.id}`
                                        )}
                                        className="hover:bg-cream-50 transition-colors cursor-pointer">

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-xs font-mono
                                                           border-cream-200 text-text-secondary">
                                                {order.orderNumber}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm font-medium text-text-primary">
                                                {order.productName}
                                            </p>
                                            <p className="text-xs text-text-muted mt-0.5">
                                                {order.productCode}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {order.plannedQuantity.toLocaleString()}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {order.actualQuantity.toLocaleString()}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary whitespace-nowrap">
                                                {format(new Date(order.plannedDate), "dd MMM yyyy")}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {order.createdByName}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getStatusBadgeClass(order.status)}`}>
                                                {order.status.replace(/_/g, " ")}
                                            </Badge>
                                        </TableCell>

                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            {order.status === "DRAFT" && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-text-muted">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuItem
                                                            onClick={() => setEditOrder(order)}
                                                            className="gap-2 cursor-pointer">
                                                            <Pencil size={14} />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => setDeleteOrder(order)}
                                                            className="gap-2 cursor-pointer text-error
                                                                    focus:text-error focus:bg-error-light">
                                                            <Trash2 size={14} />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <EditProductionOrderDialog
                order={editOrder}
                open={!!editOrder}
                onClose={() => setEditOrder(null)}
                onSuccess={() => {
                    setEditOrder(null);
                    onRefresh();
                }}
            />

            <AlertDialog
                open={!!deleteOrder}
                onOpenChange={(open) => !open && setDeleteOrder(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Production Order</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-text-primary">
                                {deleteOrder?.orderNumber}
                            </span>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={deleting}
                            onClick={handleDelete}
                            className="bg-error hover:bg-error/90">
                            {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}