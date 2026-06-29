"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { productionBatchService } from "@/services/production-batch-service";
import { ProductionBatchResponse } from "@/types/production-batch";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import CreateBatchDialog from "../../batches/create-batch-dialog";

interface BatchesSectionProps {
    productionOrderId: number;
    orderStatus: string;
}

export default function BatchesSection({
    productionOrderId,
    orderStatus,
}: BatchesSectionProps) {

    const router = useRouter();
    const [batches, setBatches] = useState<ProductionBatchResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const response = await productionBatchService
                .getBatchesByOrder(productionOrderId);
            setBatches(response.data);
        } catch {
            console.error("Failed to fetch batches");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, [productionOrderId]);

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

    const canCreateBatch =
        orderStatus === "APPROVED" || orderStatus === "IN_PROGRESS";

    return (
        <Card className="border-cream-200 shadow-card mt-4">
            <CardHeader className="pb-3 border-b border-cream-200">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-text-primary">
                        Batches
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({batches.length})
                        </span>
                    </CardTitle>
                    {canCreateBatch && (
                        <CreateBatchDialog
                            productionOrderId={productionOrderId}
                            onSuccess={fetchBatches}
                        />
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        Batch No
                                    </TableHead>
                                    <TableHead>
                                        Warehouse
                                    </TableHead>
                                    <TableHead>
                                        Qty Produced
                                    </TableHead>
                                    <TableHead>
                                        Production Date
                                    </TableHead>
                                    <TableHead>
                                        QC
                                    </TableHead>
                                    <TableHead>
                                        Final
                                    </TableHead>
                                    <TableHead>
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {batches.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center py-6 text-text-muted">
                                            No batches yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    batches.map((batch) => (
                                        <TableRow
                                            key={batch.id}
                                            onClick={() => router.push(
                                                `/dashboard/production/batches/${batch.id}`
                                            )}
                                            className="hover:bg-cream-50 transition-colors cursor-pointer">

                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs font-mono
                                                               border-cream-200 text-text-secondary">
                                                    {batch.batchNumber}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <p className="text-sm text-text-secondary">
                                                    {batch.warehouseName}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                <p className="text-sm text-text-secondary">
                                                    {batch.quantityProduced
                                                        ? batch.quantityProduced.toLocaleString()
                                                        : "-"}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                <p className="text-sm text-text-secondary whitespace-nowrap">
                                                    {batch.productionDate
                                                        ? format(new Date(batch.productionDate), "dd MMM yyyy")
                                                        : "-"}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${
                                                        batch.qcStatus === "PASSED"
                                                            ? "bg-success-light text-success border-success/20"
                                                            : batch.qcStatus === "FAILED"
                                                            ? "bg-error-light text-error border-error/20"
                                                            : "bg-cream-100 text-text-secondary border-cream-200"
                                                    }`}>
                                                    {batch.qcStatus}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${
                                                        batch.finalStatus === "APPROVED"
                                                            ? "bg-success-light text-success border-success/20"
                                                            : batch.finalStatus === "REJECTED"
                                                            ? "bg-error-light text-error border-error/20"
                                                            : batch.finalStatus === "REPROCESS"
                                                            ? "bg-purple-50 text-purple-600 border-purple-200"
                                                            : "bg-cream-100 text-text-secondary border-cream-200"
                                                    }`}>
                                                    {batch.finalStatus}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getStatusBadgeClass(batch.status)}`}>
                                                    {batch.status.replace(/_/g, " ")}
                                                </Badge>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}