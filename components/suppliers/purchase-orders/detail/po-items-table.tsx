"use client";

import { PurchaseOrderItemResponse } from "@/types/purchase-order";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PoItemsTableProps {
    items: PurchaseOrderItemResponse[];
    currency: string;
}

export default function PoItemsTable({ items, currency }: PoItemsTableProps) {

    return (
        <div className="bg-white rounded-card border border-cream-200
                        shadow-card overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-cream-50 hover:bg-cream-50">
                            <TableHead className="text-text-secondary font-medium">
                                Material
                            </TableHead>
                            <TableHead className="text-text-secondary font-medium">
                                Quantity
                            </TableHead>
                            <TableHead className="text-text-secondary font-medium">
                                Unit Price
                            </TableHead>
                            <TableHead className="text-text-secondary font-medium">
                                Total
                            </TableHead>
                            <TableHead className="text-text-secondary font-medium">
                                Received
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => {
                            const fullyReceived = item.receivedQuantity >= item.quantity;
                            const partiallyReceived = item.receivedQuantity > 0 && !fullyReceived;

                            return (
                                <TableRow key={item.id} className="hover:bg-cream-50">
                                    <TableCell>
                                        <p className="text-sm font-medium text-text-primary">
                                            {item.rawMaterialName}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-text-secondary">
                                            {item.quantity.toLocaleString()} {item.unit}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-text-secondary">
                                            {currency} {item.unitPrice.toLocaleString()}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm font-medium text-text-primary">
                                            {currency} {item.totalPrice.toLocaleString()}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-text-secondary">
                                                {item.receivedQuantity.toLocaleString()} / {item.quantity.toLocaleString()} {item.unit}
                                            </p>
                                            {fullyReceived && (
                                                <Badge variant="outline" className="text-xs
                                                    bg-success-light text-success border-success/20">
                                                    Complete
                                                </Badge>
                                            )}
                                            {partiallyReceived && (
                                                <Badge variant="outline" className="text-xs
                                                    bg-warning-light text-warning border-warning/20">
                                                    Partial
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}