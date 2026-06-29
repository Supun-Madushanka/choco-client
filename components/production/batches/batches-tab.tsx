"use client";

import { useState, useEffect } from "react";
import { productionBatchService } from "@/services/production-batch-service";
import { ProductionBatchResponse } from "@/types/production-batch";
import BatchesTable from "./batches-table";

export default function BatchesTab() {

    const [batches, setBatches] = useState<ProductionBatchResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const response = await productionBatchService.getAllBatches();
            setBatches(response.data);
        } catch {
            console.error("Failed to fetch batches");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center
                            lg:justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Production Batches
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({batches.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Track all production batches and QC status
                    </p>
                </div>
            </div>

            <BatchesTable batches={batches} loading={loading} />
        </div>
    );
}