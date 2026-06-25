"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { productionOrderService } from "@/services/production-order-service";
import { ProductionOrderResponse } from "@/types/production-order";
import PageHeader from "@/components/common/page-header";
import ProductionOrderHeader from "@/components/production/production-orders/detail/production-order-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductionOrderDetailPage() {

    const params = useParams();
    const id = Number(params.id);

    const [order, setOrder] = useState<ProductionOrderResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = useCallback(async () => {
        setLoading(true);
        try {
            const response = await productionOrderService.getOrderById(id);
            setOrder(response.data);
        } catch {
            console.error("Failed to fetch production order");
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
                <PageHeader title="Production Order" />
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
                title={order.orderNumber}
                description="Production order details and status"
            />
            <ProductionOrderHeader order={order} onRefresh={fetchOrder} />
        </div>
    );
}