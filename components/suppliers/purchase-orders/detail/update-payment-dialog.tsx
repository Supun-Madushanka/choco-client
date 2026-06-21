"use client";

import { useState, useEffect } from "react";
import { purchaseOrderService } from "@/services/purchase-order-service";
import { PaymentStatus, PurchaseOrderResponse } from "@/types/purchase-order";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Wallet } from "lucide-react";

interface UpdatePaymentDialogProps {
    order: PurchaseOrderResponse;
    onSuccess: () => void;
}

export default function UpdatePaymentDialog({
    order,
    onSuccess,
}: UpdatePaymentDialogProps) {

    const [open, setOpen] = useState(false);
    const [paidAmount, setPaidAmount] = useState(order.paidAmount);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setPaidAmount(order.paidAmount);
            setPaymentStatus(order.paymentStatus);
            setError(null);
        }
    }, [open, order]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (paidAmount <= 0) {
            setError("Paid amount must be greater than 0");
            return;
        }
        if (paidAmount > order.totalAmount) {
            setError(`Paid amount cannot exceed total of ${order.currency} ${order.totalAmount}`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await purchaseOrderService.updatePayment(order.id, {
                paidAmount,
                paymentStatus,
            });
            setOpen(false);
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to update payment");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                size="sm"
                onClick={() => setOpen(true)}
                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                <Wallet size={14} />
                Update Payment
            </Button>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Update Payment
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        {order.poNumber} — Total: {order.currency} {order.totalAmount.toLocaleString()}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Paid Amount</Label>
                        <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={paidAmount || ""}
                            onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Payment Status</Label>
                        <Select
                            value={paymentStatus}
                            onValueChange={(value) => setPaymentStatus(value as PaymentStatus)}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="UNPAID">Unpaid</SelectItem>
                                <SelectItem value="PARTIAL">Partial</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-cream-200"
                            onClick={() => setOpen(false)}
                            disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}