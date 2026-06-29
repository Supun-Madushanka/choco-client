"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { productionBatchService } from "@/services/production-batch-service";
import { productionOrderService } from "@/services/production-order-service";
import { ProductionBatchResponse } from "@/types/production-batch";
import PageHeader from "@/components/common/page-header";
import BatchHeader from "@/components/production/batches/detail/batch-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function BatchDetailPage() {

    const params = useParams();
    const id = Number(params.id);

    const [batch, setBatch] = useState<ProductionBatchResponse | null>(null);
    const [productId, setProductId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchBatch = useCallback(async () => {
        setLoading(true);
        try {
            const response = await productionBatchService.getBatchById(id);
            const batchData = response.data;
            setBatch(batchData);

            // Fetch the production order to get productId
            const orderResponse = await productionOrderService
                .getOrderById(batchData.productionOrderId);
            setProductId(orderResponse.data.productId);
        } catch {
            console.error("Failed to fetch batch");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBatch();
    }, [fetchBatch]);

    if (loading || !batch || !productId) {
        return (
            <div>
                <PageHeader title="Production Batch" />
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title={batch.batchNumber}
                description="Production batch details and QC status"
            />
            <BatchHeader
                batch={batch}
                productId={productId}
                onRefresh={fetchBatch}
            />
        </div>
    );
}