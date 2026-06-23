"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { grnService } from "@/services/grn-service";
import { GoodsReceivedNoteResponse } from "@/types/grn";
import PageHeader from "@/components/common/page-header";
import GrnHeader from "@/components/suppliers/grn/detail/grn-header";
import GrnItemsTable from "@/components/suppliers/grn/detail/grn-items-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function GrnDetailPage() {

    const params = useParams();
    const id = Number(params.id);

    const [grn, setGrn] = useState<GoodsReceivedNoteResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchGrn = useCallback(async () => {
        setLoading(true);
        try {
            const response = await grnService.getGrnById(id);
            setGrn(response.data);
        } catch {
            console.error("Failed to fetch GRN");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchGrn();
    }, [fetchGrn]);

    if (loading || !grn) {
        return (
            <div>
                <PageHeader title="GRN" />
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
                title={grn.grnNumber}
                description="Goods received note details and QC status"
            />

            <GrnHeader grn={grn} onRefresh={fetchGrn} />
            <GrnItemsTable grn={grn} onRefresh={fetchGrn} />
        </div>
    );
}