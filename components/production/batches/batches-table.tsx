"use client";

import { useRouter } from "next/navigation";
import { ProductionBatchResponse } from "@/types/production-batch";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface BatchesTableProps {
    batches: ProductionBatchResponse[];
    loading: boolean;
}

export default function BatchesTable({
    batches,
    loading,
}: BatchesTableProps) {

    const router = useRouter();

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

    if (loading) {
        return (
            <div className="bg-white rounded-card border border-cream-200
                            shadow-card overflow-hidden">
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Batch No</TableHead>
                                <TableHead>Order No</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Qty Produced</TableHead>
                                <TableHead>Production Date</TableHead>
                                <TableHead>QC</TableHead>
                                <TableHead>Final</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {batches.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="text-center py-6 text-text-muted">
                                        No batches found
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
                                            <Badge
                                                variant="outline"
                                                className="text-xs font-mono
                                                           border-cream-200 text-text-secondary">
                                                {batch.orderNumber}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm font-medium text-text-primary">
                                                {batch.productName}
                                            </p>
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
                                                    : "—"}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary whitespace-nowrap">
                                                {batch.productionDate
                                                    ? format(new Date(batch.productionDate), "dd MMM yyyy")
                                                    : "—"}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getQcBadgeClass(batch.qcStatus)}`}>
                                                {batch.qcStatus}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getFinalBadgeClass(batch.finalStatus)}`}>
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
            </CardContent>
        </Card>
    );
}