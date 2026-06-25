"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productionOrderService } from "@/services/production-order-service";
import { ProductionOrderResponse } from "@/types/production-order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Send, CheckCircle2, XCircle, Ban, Trash2,
} from "lucide-react";
import { format } from "date-fns";
import EditProductionOrderDialog from "../edit-production-order-dialog";

interface ProductionOrderHeaderProps {
    order: ProductionOrderResponse;
    onRefresh: () => void;
}

export default function ProductionOrderHeader({
    order,
    onRefresh,
}: ProductionOrderHeaderProps) {

    const router = useRouter();
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<
        "submit" | "approve" | "reject" | "cancel" | "delete" | null
    >(null);
    const [editOpen, setEditOpen] = useState(false);

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

    const handleConfirm = async () => {
        if (!confirmAction) return;
        setActionLoading(true);
        setError(null);
        try {
            switch (confirmAction) {
                case "submit":
                    await productionOrderService.submitForApproval(order.id);
                    break;
                case "approve":
                    await productionOrderService.approveOrder(order.id);
                    break;
                case "reject":
                    await productionOrderService.rejectOrder(order.id);
                    break;
                case "cancel":
                    await productionOrderService.cancelOrder(order.id);
                    break;
                case "delete":
                    await productionOrderService.deleteOrder(order.id);
                    router.push("/dashboard/production");
                    return;
            }
            onRefresh();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Action failed");
            }
        } finally {
            setActionLoading(false);
            setConfirmAction(null);
        }
    };

    const confirmCopy: Record<string, {
        title: string; description: string; className: string
    }> = {
        submit: {
            title: "Submit for Approval",
            description: "This will send the production order for approval. You won't be able to edit it after this.",
            className: "bg-gold-500 hover:bg-gold-400",
        },
        approve: {
            title: "Approve Production Order",
            description: "This will approve the order and allow production to begin.",
            className: "bg-gold-500 hover:bg-gold-400",
        },
        reject: {
            title: "Reject Production Order",
            description: "This will reject the order. This action cannot be undone.",
            className: "bg-error hover:bg-error/90",
        },
        cancel: {
            title: "Cancel Production Order",
            description: "This will cancel the order. This action cannot be undone.",
            className: "bg-error hover:bg-error/90",
        },
        delete: {
            title: "Delete Production Order",
            description: "This will permanently delete this draft order. This action cannot be undone.",
            className: "bg-error hover:bg-error/90",
        },
    };

    return (
        <>
            <Card className="border-cream-200 shadow-card mb-4">
                <CardContent className="p-5">

                    <div className="flex flex-col sm:flex-row sm:items-start
                                    sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-lg font-bold text-text-primary">
                                    {order.orderNumber}
                                </h2>
                                <Badge
                                    variant="outline"
                                    className={`text-xs ${getStatusBadgeClass(order.status)}`}>
                                    {order.status.replace(/_/g, " ")}
                                </Badge>
                            </div>

                            <p className="text-sm text-text-secondary mt-1">
                                {order.productName}
                                <span className="text-text-muted ml-1">
                                    ({order.productCode})
                                </span>
                            </p>

                            <p className="text-xs text-text-muted mt-0.5">
                                Created by {order.createdByName}
                                {order.approvedByName &&
                                    ` · Approved by ${order.approvedByName}`}
                            </p>

                            {order.notes && (
                                <p className="text-xs text-text-muted mt-1 italic">
                                    {order.notes}
                                </p>
                            )}
                        </div>

                        <div className="text-right shrink-0 space-y-1">
                            <div>
                                <p className="text-xs text-text-muted">Planned Qty</p>
                                <p className="text-xl font-bold text-text-primary">
                                    {order.plannedQuantity.toLocaleString()}
                                </p>
                            </div>
                            {order.actualQuantity > 0 && (
                                <div>
                                    <p className="text-xs text-text-muted">Actual Qty</p>
                                    <p className="text-sm font-medium text-text-primary">
                                        {order.actualQuantity.toLocaleString()}
                                    </p>
                                </div>
                            )}
                            <p className="text-xs text-text-muted">
                                Planned:{" "}
                                {format(new Date(order.plannedDate), "dd MMM yyyy")}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm mt-4">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-cream-200">

                        {order.status === "DRAFT" && (
                            <>
                                <EditProductionOrderDialog
                                    order={order}
                                    open={editOpen}
                                    onClose={() => setEditOpen(false)}
                                    onSuccess={() => {
                                        setEditOpen(false);
                                        onRefresh();
                                    }}
                                />
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditOpen(true)}
                                    className="border-cream-200 gap-2">
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => setConfirmAction("submit")}
                                    className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                                    <Send size={14} />
                                    Submit for Approval
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setConfirmAction("delete")}
                                    className="border-cream-200 text-error gap-2
                                               hover:bg-error-light hover:text-error">
                                    <Trash2 size={14} />
                                    Delete
                                </Button>
                            </>
                        )}

                        {order.status === "PENDING_APPROVAL" && (
                            <>
                                <Button
                                    size="sm"
                                    onClick={() => setConfirmAction("approve")}
                                    className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                                    <CheckCircle2 size={14} />
                                    Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setConfirmAction("reject")}
                                    className="border-cream-200 text-error gap-2
                                               hover:bg-error-light hover:text-error">
                                    <XCircle size={14} />
                                    Reject
                                </Button>
                            </>
                        )}

                        {(order.status === "APPROVED" ||
                            order.status === "IN_PROGRESS") && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setConfirmAction("cancel")}
                                className="border-cream-200 text-error gap-2
                                           hover:bg-error-light hover:text-error">
                                <Ban size={14} />
                                Cancel
                            </Button>
                        )}

                    </div>
                </CardContent>
            </Card>

            <AlertDialog
                open={!!confirmAction}
                onOpenChange={(open) => !open && setConfirmAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmAction && confirmCopy[confirmAction].title}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmAction && confirmCopy[confirmAction].description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={actionLoading}
                            onClick={handleConfirm}
                            className={confirmAction
                                ? confirmCopy[confirmAction].className : ""}>
                            {actionLoading ? "Processing..." : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}