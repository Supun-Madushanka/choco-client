"use client";

import { PurchaseOrderResponse } from "@/types/purchase-order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import UpdatePaymentDialog from "./update-payment-dialog";

interface PoPaymentSectionProps {
    order: PurchaseOrderResponse;
    onRefresh: () => void;
}

export default function PoPaymentSection({
    order,
    onRefresh,
}: PoPaymentSectionProps) {

    const { user } = useAuthStore();
    const canUpdatePayment =
        user?.role === "SUPER_ADMIN" || user?.role === "FINANCE_MANAGER";

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

    return (
        <Card className="border-cream-200 shadow-card">
            <CardHeader className="pb-3 border-b border-cream-200">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-text-primary">
                        Payment
                    </CardTitle>
                    {canUpdatePayment && (
                        <UpdatePaymentDialog order={order} onSuccess={onRefresh} />
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-text-muted">Status</p>
                    <Badge
                        variant="outline"
                        className={`text-xs ${getPaymentBadgeClass(order.paymentStatus)}`}>
                        {order.paymentStatus}
                    </Badge>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-text-muted">Paid Amount</p>
                    <p className="text-sm font-medium text-text-primary">
                        {order.currency} {order.paidAmount.toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-text-muted">Total Amount</p>
                    <p className="text-sm font-medium text-text-primary">
                        {order.currency} {order.totalAmount.toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center justify-between border-t
                                border-cream-200 pt-3">
                    <p className="text-sm text-text-muted">Balance</p>
                    <p className="text-sm font-semibold text-text-primary">
                        {order.currency} {(order.totalAmount - order.paidAmount).toLocaleString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}