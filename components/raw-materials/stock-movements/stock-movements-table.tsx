"use client";

import { StockMovementResponse } from "@/types/stock-movement";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface StockMovementsTableProps {
    movements: StockMovementResponse[];
    loading: boolean;
}

export default function StockMovementsTable({
    movements,
    loading,
}: StockMovementsTableProps) {

    const getTypeBadge = (type: string) => {
        switch (type) {
            case "IN":
                return {
                    icon: <ArrowDownToLine size={11} />,
                    className: "bg-success-light text-success border-success/20",
                };
            case "OUT":
                return {
                    icon: <ArrowUpFromLine size={11} />,
                    className: "bg-error-light text-error border-error/20",
                };
            default:
                return {
                    icon: <SlidersHorizontal size={11} />,
                    className: "bg-warning-light text-warning border-warning/20",
                };
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
                            <TableHead>
                                Date
                            </TableHead>
                            <TableHead>
                                Material
                            </TableHead>
                            <TableHead>
                                Warehouse
                            </TableHead>
                            <TableHead>
                                Type
                            </TableHead>
                            <TableHead>
                                Reference Type
                            </TableHead>
                            <TableHead>
                                Quantity
                            </TableHead>
                            <TableHead>
                                Note
                            </TableHead>
                            <TableHead>
                                By
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {movements.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="text-center py-6 text-text-muted">
                                    No stock movements found
                                </TableCell>
                            </TableRow>
                        ) : (
                            movements.map((movement) => {
                                const badge = getTypeBadge(movement.movementType);

                                return (
                                    <TableRow
                                        key={movement.id}
                                    >

                                        <TableCell>
                                            <p className="text-sm text-text-secondary whitespace-nowrap">
                                                {format(new Date(movement.createdAt), "dd MMM yyyy, HH:mm")}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm font-medium text-text-primary">
                                                {movement.rawMaterialName}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {movement.warehouseName}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs gap-1 ${badge.className}`}>
                                                {badge.icon}
                                                {movement.movementType}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {movement.referenceType ? movement.referenceType : "-"} 
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm font-medium text-text-primary">
                                                {movement.quantity.toLocaleString()} {movement.unit}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-muted max-w-xs truncate">
                                                {movement.note || "—"}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary whitespace-nowrap">
                                                {movement.movedByName}
                                            </p>
                                        </TableCell>

                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
    );
}