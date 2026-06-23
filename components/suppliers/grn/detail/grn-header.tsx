"use client";

import { useState } from "react";
import { grnService } from "@/services/grn-service";
import { GoodsReceivedNoteResponse } from "@/types/grn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Send, FlaskConical } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface GrnHeaderProps {
    grn: GoodsReceivedNoteResponse;
    onRefresh: () => void;
}

export default function GrnHeader({ grn, onRefresh }: GrnHeaderProps) {

    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<
        "submit-qc" | "complete-qc" | null
    >(null);

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "DRAFT":
                return "bg-cream-100 text-text-secondary border-cream-200";
            case "QC_PENDING":
                return "bg-warning-light text-warning border-warning/20";
            case "QC_PASSED":
                return "bg-info-light text-info border-info/20";
            case "QC_FAILED":
                return "bg-error-light text-error border-error/20";
            case "STOCKED":
                return "bg-success-light text-success border-success/20";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    const handleConfirm = async () => {
        if (!confirmAction) return;
        setActionLoading(true);
        setError(null);
        try {
            if (confirmAction === "submit-qc") {
                await grnService.submitForQc(grn.id);
            } else if (confirmAction === "complete-qc") {
                await grnService.completeQc(grn.id);
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

    const confirmCopy = {
        "submit-qc": {
            title: "Submit for QC",
            description: "This will send the GRN to the QC team for inspection. You won't be able to edit it after this.",
            className: "bg-gold-500 hover:bg-gold-400",
        },
        "complete-qc": {
            title: "Complete QC",
            description: "This will finalize QC. Passed items will be stocked into the warehouse. This cannot be undone.",
            className: "bg-gold-500 hover:bg-gold-400",
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
                                {grn.grnNumber}
                            </h2>
                            <Badge
                                variant="outline"
                                className={`text-xs ${getStatusBadgeClass(grn.status)}`}>
                                {grn.status.replace(/_/g, " ")}
                            </Badge>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">
                            {grn.poNumber} · {grn.warehouseName}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                            Received by {grn.receivedByName} on{" "}
                            {format(new Date(grn.receivedDate), "dd MMM yyyy")}
                        </p>
                        {grn.notes && (
                            <p className="text-xs text-text-muted mt-1 italic">
                                {grn.notes}
                            </p>
                        )}
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-text-muted">Items</p>
                        <p className="text-xl font-bold text-text-primary">
                            {grn.items.length}
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

                    {grn.status === "DRAFT" && (
                        <Button
                            size="sm"
                            onClick={() => setConfirmAction("submit-qc")}
                            className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                            <Send size={14} />
                            Submit for QC
                        </Button>
                    )}

                    {grn.status === "QC_PENDING" && (
                        <Button
                            size="sm"
                            onClick={() => setConfirmAction("complete-qc")}
                            className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                            <FlaskConical size={14} />
                            Complete QC
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