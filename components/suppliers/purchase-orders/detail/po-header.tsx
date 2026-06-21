"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { purchaseOrderService } from "@/services/purchase-order-service";
import { PurchaseOrderResponse } from "@/types/purchase-order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    Send, CheckCircle2, XCircle, PackageCheck,
    Ban, Trash2,
} from "lucide-react";
import EditPurchaseOrderDialog from "./edit-purchase-order-dialog";

interface PoHeaderProps {
    order: PurchaseOrderResponse;
    onRefresh: () => void;
}

export default function PoHeader({ order, onRefresh }: PoHeaderProps) {

    const router = useRouter();
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<
        "submit" | "approve" | "reject" | "order" | "cancel" | "delete" | null
    >(null);

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

    const handleConfirm = async () => {
        if (!confirmAction) return;
        setActionLoading(true);
        setError(null);
        try {
            switch (confirmAction) {
                case "submit":
                    await purchaseOrderService.submitForApproval(order.id);
                    break;
                case "approve":
                    await purchaseOrderService.approvePurchaseOrder(order.id);
                    break;
                case "reject":
                    await purchaseOrderService.rejectPurchaseOrder(order.id);
                    break;
                case "order":
                    await purchaseOrderService.markAsOrdered(order.id);
                    break;
                case "cancel":
                    await purchaseOrderService.cancelPurchaseOrder(order.id);
                    break;
                case "delete":
                    await purchaseOrderService.deletePurchaseOrder(order.id);
                    router.push("/dashboard/suppliers");
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

    const confirmCopy: Record<string, { title: string; description: string; className: string }> = {
        submit: {
            title: "Submit for Approval",
            description: "This will send the purchase order for approval. You won't be able to edit it after this.",
            className: "bg-gold-500 hover:bg-gold-400",
        },
        approve: {
            title: "Approve Purchase Order",
            description: "This will approve the order and allow it to be placed with the supplier.",
            className: "bg-success hover:bg-success/90",
        },
        reject: {
            title: "Reject Purchase Order",
            description: "This will reject the order. This action cannot be undone.",
            className: "bg-error hover:bg-error/90",
        },
        order: {
            title: "Mark as Ordered",
            description: "Confirm that this order has been placed with the supplier.",
            className: "bg-gold-500 hover:bg-gold-400",
        },
        cancel: {
            title: "Cancel Purchase Order",
            description: "This will cancel the order. This action cannot be undone.",
            className: "bg-error hover:bg-error/90",
        },
        delete: {
            title: "Delete Purchase Order",
            description: "This will permanently delete this draft order. This action cannot be undone.",
            className: "bg-error hover:bg-error/90",
        },
    };

    return (
        <>
            <div className="bg-white rounded-card border border-cream-200
                            shadow-card p-5 mb-4">

                <div className="flex flex-col sm:flex-row sm:items-start
                                sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-bold text-text-primary">
                                {order.poNumber}
                            </h2>
                            <Badge
                                variant="outline"
                                className={`text-xs ${getStatusBadgeClass(order.status)}`}>
                                {order.status.replace("_", " ")}
                            </Badge>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">
                            {order.supplierName} ({order.supplierCode})
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                            Created by {order.createdByName}
                            {order.approvedByName && ` · Approved by ${order.approvedByName}`}
                        </p>
                    </div>

                    <p className="text-xl font-bold text-text-primary">
                        {order.currency} {order.totalAmount.toLocaleString()}
                    </p>
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
                            <EditPurchaseOrderDialog order={order} onSuccess={onRefresh} />
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

                    {order.status === "APPROVED" && (
                        <>
                            <Button
                                size="sm"
                                onClick={() => setConfirmAction("order")}
                                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                                <PackageCheck size={14} />
                                Mark as Ordered
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setConfirmAction("cancel")}
                                className="border-cream-200 text-error gap-2
                                           hover:bg-error-light hover:text-error">
                                <Ban size={14} />
                                Cancel
                            </Button>
                        </>
                    )}

                    {order.status === "ORDERED" && (
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
            </div>

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
                            className={confirmAction ? confirmCopy[confirmAction].className : ""}>
                            {actionLoading ? "Processing..." : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}