"use client";

import { useRouter } from "next/navigation";
import { GoodsReceivedNoteResponse } from "@/types/grn";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface GrnTableProps {
    grns: GoodsReceivedNoteResponse[];
    loading: boolean;
}

export default function GrnTable({ grns, loading }: GrnTableProps) {

    const router = useRouter();

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "DRAFT":
                return "bg-cream-100 text-text-secondary border-cream-200";
            case "QC_PENDING":
                return "bg-warning-light text-warning border-warning/20";
            case "QC_PASSED":
                return "bg-info-light text-info border-info/20";
            case "QC_FAILED":
                return "bg-error-light text-error border-error/20";
            case "STOCKED":
                return "bg-success-light text-success border-success/20";
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>GRN Number</TableHead>
                            <TableHead>PO Number</TableHead>
                            <TableHead>Warehouse</TableHead>
                            <TableHead>Received By</TableHead>
                            <TableHead>Received Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {grns.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center py-6 text-text-muted">
                                    No GRNs found
                                </TableCell>
                            </TableRow>
                        ) : (
                            grns.map((grn) => (
                                <TableRow
                                    key={grn.id}
                                    onClick={() => router.push(
                                        `/dashboard/suppliers/grn/${grn.id}`
                                    )}
                                    className="hover:bg-cream-50 transition-colors cursor-pointer">

                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-mono
                                                       border-cream-200 text-text-secondary">
                                            {grn.grnNumber}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-mono
                                                       border-cream-200 text-text-secondary">
                                            {grn.poNumber}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <p className="text-sm font-medium text-text-primary">
                                            {grn.warehouseName}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        <p className="text-sm text-text-secondary">
                                            {grn.receivedByName}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        <p className="text-sm text-text-secondary whitespace-nowrap">
                                            {format(new Date(grn.receivedDate), "dd MMM yyyy")}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        <p className="text-sm text-text-secondary">
                                            {grn.items.length} item{grn.items.length !== 1 ? "s" : ""}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${getStatusBadgeClass(grn.status)}`}>
                                            {grn.status.replace(/_/g, " ")}
                                        </Badge>
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}