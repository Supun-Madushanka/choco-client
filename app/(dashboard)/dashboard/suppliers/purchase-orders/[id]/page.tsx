"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { purchaseOrderService } from "@/services/purchase-order-service";
import { PurchaseOrderResponse } from "@/types/purchase-order";
import PageHeader from "@/components/common/page-header";
import PoHeader from "@/components/suppliers/purchase-orders/detail/po-header";
import PoItemsTable from "@/components/suppliers/purchase-orders/detail/po-items-table";
import PoPaymentSection from "@/components/suppliers/purchase-orders/detail/po-payment-section";
import { Skeleton } from "@/components/ui/skeleton";

export default function PurchaseOrderDetailPage() {

    const params = useParams();
    const id = Number(params.id);

    const [order, setOrder] = useState<PurchaseOrderResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = useCallback(async () => {
        setLoading(true);
        try {
            const response = await purchaseOrderService.getPurchaseOrderById(id);
            setOrder(response.data);
        } catch {
            console.error("Failed to fetch purchase order");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    if (loading || !order) {
        return (
            <div>
                <PageHeader title="Purchase Order" />
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title={order.poNumber}
                description="Purchase order details and status"
            />

            <PoHeader order={order} onRefresh={fetchOrder} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <PoItemsTable items={order.items} currency={order.currency} />
                </div>
                <div>
                    <PoPaymentSection order={order} onRefresh={fetchOrder} />
                </div>
            </div>
        </div>
    );
}