"use client";

import { useState } from "react";
import { productionBatchService } from "@/services/production-batch-service";
import { ProductionBatchResponse } from "@/types/production-batch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FlaskConical, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import CompleteProductionDialog from "../complete-production-dialog";

interface BatchHeaderProps {
    batch: ProductionBatchResponse;
    productId: number;
    onRefresh: () => void;
}

export default function BatchHeader({
    batch,
    productId,
    onRefresh,
}: BatchHeaderProps) {

    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // QC dialog
    const [qcOpen, setQcOpen] = useState(false);
    const [qcStatus, setQcStatus] = useState("PASSED");

    // Final approval dialog
    const [finalOpen, setFinalOpen] = useState(false);
    const [finalStatus, setFinalStatus] = useState("APPROVED");
    const [finalNotes, setFinalNotes] = useState("");

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "IN_PROGRESS":
                return "bg-blue-50 text-blue-600 border-blue-200";
            case "QC_PENDING":
                return "bg-warning-light text-warning border-warning/20";
            case "QC_DONE":
                return "bg-info-light text-info border-info/20";
            case "STOCKED":
                return "bg-success-light text-success border-success/20";
            case "REJECTED":
                return "bg-error-light text-error border-error/20";
            case "REPROCESS":
                return "bg-purple-50 text-purple-600 border-purple-200";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    const getQcBadgeClass = (status: string) => {
        switch (status) {
            case "PASSED":
                return "bg-success-light text-success border-success/20";
            case "FAILED":
                return "bg-error-light text-error border-error/20";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    const getFinalBadgeClass = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "bg-success-light text-success border-success/20";
            case "REJECTED":
                return "bg-error-light text-error border-error/20";
            case "REPROCESS":
                return "bg-purple-50 text-purple-600 border-purple-200";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    const handleMarkQc = async () => {
        setActionLoading(true);
        setError(null);
        try {
            await productionBatchService.markQc(batch.id, { qcStatus });
            setQcOpen(false);
            onRefresh();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "QC marking failed");
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleFinalApproval = async () => {
        setActionLoading(true);
        setError(null);
        try {
            await productionBatchService.finalApprove(batch.id, {
                finalStatus,
                notes: finalNotes.trim() || undefined,
            });
            setFinalOpen(false);
            onRefresh();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Final approval failed");
            }
        } finally {
            setActionLoading(false);
        }
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
                                    {batch.batchNumber}
                                </h2>
                                <Badge
                                    variant="outline"
                                    className={`text-xs ${getStatusBadgeClass(batch.status)}`}>
                                    {batch.status.replace(/_/g, " ")}
                                </Badge>
                            </div>

                            <p className="text-sm text-text-secondary mt-1">
                                {batch.productName}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">
                                Order: {batch.orderNumber} · {batch.warehouseName}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">
                                Supervised by {batch.supervisedByName}
                            </p>
                            {batch.notes && (
                                <p className="text-xs text-text-muted mt-1 italic">
                                    {batch.notes}
                                </p>
                            )}
                        </div>

                        <div className="text-right shrink-0 space-y-2">
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-xs text-text-muted">QC:</span>
                                <Badge
                                    variant="outline"
                                    className={`text-xs ${getQcBadgeClass(batch.qcStatus)}`}>
                                    {batch.qcStatus}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-xs text-text-muted">Final:</span>
                                <Badge
                                    variant="outline"
                                    className={`text-xs ${getFinalBadgeClass(batch.finalStatus)}`}>
                                    {batch.finalStatus}
                                </Badge>
                            </div>
                            {batch.quantityProduced && (
                                <div>
                                    <p className="text-xs text-text-muted">Produced</p>
                                    <p className="text-xl font-bold text-text-primary">
                                        {batch.quantityProduced.toLocaleString()}
                                    </p>
                                </div>
                            )}
                            {batch.productionDate && (
                                <p className="text-xs text-text-muted">
                                    {format(new Date(batch.productionDate), "dd MMM yyyy")}
                                </p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm mt-4">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-cream-200">

                        {batch.status === "IN_PROGRESS" && (
                            <CompleteProductionDialog
                                batch={batch}
                                productId={productId}
                                onSuccess={onRefresh}
                            />
                        )}

                        {batch.status === "QC_PENDING" && (
                            <Button
                                size="sm"
                                onClick={() => {
                                    setQcStatus("PASSED");
                                    setQcOpen(true);
                                }}
                                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                                <FlaskConical size={14} />
                                Mark QC
                            </Button>
                        )}

                        {batch.status === "QC_DONE" && (
                            <Button
                                size="sm"
                                onClick={() => {
                                    setFinalStatus("APPROVED");
                                    setFinalNotes("");
                                    setFinalOpen(true);
                                }}
                                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                                <CheckCircle2 size={14} />
                                Final Approval
                            </Button>
                        )}

                    </div>
                </CardContent>
            </Card>

            {/* QC Dialog */}
            <Dialog open={qcOpen} onOpenChange={(o) => !o && setQcOpen(false)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-text-primary">
                            Mark QC Status
                        </DialogTitle>
                        <DialogDescription className="text-text-muted">
                            {batch.batchNumber}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">QC Status</Label>
                            <Select
                                value={qcStatus}
                                onValueChange={setQcStatus}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PASSED">Passed</SelectItem>
                                    <SelectItem value="FAILED">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1 border-cream-200"
                            onClick={() => setQcOpen(false)}
                            disabled={actionLoading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleMarkQc}
                            disabled={actionLoading}
                            className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                            {actionLoading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Final Approval Dialog */}
            <Dialog open={finalOpen} onOpenChange={(o) => !o && setFinalOpen(false)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-text-primary">
                            Final Approval
                        </DialogTitle>
                        <DialogDescription className="text-text-muted">
                            {batch.batchNumber}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Decision</Label>
                            <Select
                                value={finalStatus}
                                onValueChange={setFinalStatus}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="APPROVED">Approve</SelectItem>
                                    <SelectItem value="REJECTED">Reject</SelectItem>
                                    <SelectItem value="REPROCESS">Reprocess</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Notes</Label>
                            <Textarea
                                value={finalNotes}
                                onChange={(e) => setFinalNotes(e.target.value)}
                                placeholder="Optional notes..."
                                className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1 border-cream-200"
                            onClick={() => setFinalOpen(false)}
                            disabled={actionLoading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleFinalApproval}
                            disabled={actionLoading}
                            className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                            {actionLoading ? "Saving..." : "Confirm"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}