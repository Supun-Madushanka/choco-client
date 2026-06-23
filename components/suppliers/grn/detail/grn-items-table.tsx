"use client";

import { GrnItemResponse, GoodsReceivedNoteResponse } from "@/types/grn";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import InspectItemDialog from "./inspect-item-dialog";
import { Card, CardContent } from "@/components/ui/card";

interface GrnItemsTableProps {
    grn: GoodsReceivedNoteResponse;
    onRefresh: () => void;
}

export default function GrnItemsTable({ grn, onRefresh }: GrnItemsTableProps) {

    const { user } = useAuthStore();
    const canInspect =
        user?.role === "SUPER_ADMIN" ||
        user?.role === "QC_MANAGER" ||
        user?.role === "QC_CONTROLLER";

    const getQualityBadgeClass = (status: string) => {
        switch (status) {
            case "PASSED":
                return "bg-success-light text-success border-success/20";
            case "FAILED":
                return "bg-error-light text-error border-error/20";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    return (

        <Card>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                Material
                            </TableHead>
                            <TableHead>
                                Ordered
                            </TableHead>
                            <TableHead>
                                Received
                            </TableHead>
                            <TableHead>
                                Accepted
                            </TableHead>
                            <TableHead>
                                Rejected
                            </TableHead>
                            <TableHead>
                                QC Status
                            </TableHead>
                            <TableHead>
                                Inspected By
                            </TableHead>
                            {grn.status === "QC_PENDING" && canInspect && (
                                <TableHead>
                                    Action
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {grn.items.map((item: GrnItemResponse) => (
                            <TableRow key={item.id} className="hover:bg-cream-50">

                                <TableCell>
                                    <p className="text-sm font-medium text-text-primary">
                                        {item.rawMaterialName}
                                    </p>
                                    <p className="text-xs text-text-muted">
                                        {item.unit}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <p className="text-sm text-text-secondary">
                                        {item.orderedQuantity.toLocaleString()}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <p className="text-sm text-text-secondary">
                                        {item.receivedQuantity.toLocaleString()}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <p className="text-sm text-text-secondary">
                                        {item.acceptedQuantity.toLocaleString()}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <p className="text-sm text-text-secondary">
                                        {item.rejectedQuantity.toLocaleString()}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <div className="space-y-1">
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${getQualityBadgeClass(item.qualityStatus)}`}>
                                            {item.qualityStatus}
                                        </Badge>
                                        {item.qualityNotes && (
                                            <p className="text-xs text-text-muted max-w-32 truncate">
                                                {item.qualityNotes}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <p className="text-sm text-text-secondary ">
                                        {item.inspectedByName || "-"}
                                    </p>
                                </TableCell>

                                {grn.status === "QC_PENDING" && canInspect && (
                                    <TableCell>
                                        <InspectItemDialog
                                            grnId={grn.id}
                                            item={item}
                                            onSuccess={onRefresh}
                                        />
                                    </TableCell>
                                )}

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}