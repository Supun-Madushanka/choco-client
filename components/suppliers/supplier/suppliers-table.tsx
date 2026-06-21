"use client";

import { useState } from "react";
import { SupplierResponse } from "@/types/supplier";
import { supplierService } from "@/services/supplier-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2, Package2 } from "lucide-react";
import EditSupplierDialog from "./edit-supplier-dialog";
import ManageSupplierMaterialsDialog from "./manage-supplier-materials-dialog";
import { Card, CardContent } from "@/components/ui/card";

interface SuppliersTableProps {
    suppliers: SupplierResponse[];
    loading: boolean;
    onRefresh: () => void;
}

export default function SuppliersTable({
    suppliers,
    loading,
    onRefresh,
}: SuppliersTableProps) {

    const [editSupplier, setEditSupplier] = useState<SupplierResponse | null>(null);
    const [materialsSupplier, setMaterialsSupplier] = useState<SupplierResponse | null>(null);
    const [deleteSupplier, setDeleteSupplier] = useState<SupplierResponse | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteSupplier) return;
        setDeleting(true);
        try {
            await supplierService.deleteSupplier(deleteSupplier.id);
            onRefresh();
        } catch {
            console.error("Failed to delete supplier");
        } finally {
            setDeleting(false);
            setDeleteSupplier(null);
        }
    };

    const getTypeBadgeClass = (type: string) => {
        return type === "INTERNATIONAL"
            ? "bg-blue-50 text-blue-600 border-blue-200"
            : "bg-purple-50 text-purple-600 border-purple-200";
    };

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Code
                                </TableHead>
                                <TableHead>
                                    Name
                                </TableHead>
                                <TableHead>
                                    Type
                                </TableHead>
                                <TableHead>
                                    Country
                                </TableHead>
                                <TableHead>
                                    City
                                </TableHead>
                                <TableHead>
                                    Contact
                                </TableHead>
                                <TableHead>
                                    Status
                                </TableHead>
                                <TableHead>
                                    
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center py-6 text-text-muted">
                                        No suppliers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                suppliers.map((supplier) => (
                                    <TableRow
                                        key={supplier.id}
                                    >

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-xs font-mono
                                                           border-cream-200
                                                           text-text-secondary">
                                                {supplier.code}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm font-medium text-text-primary">
                                                {supplier.name}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getTypeBadgeClass(supplier.supplierType)}`}>
                                                {supplier.supplierType}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {supplier.country}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {supplier.city || "—"}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {supplier.contactPerson || "—"}
                                            </p>
                                            {supplier.phone && (
                                                <p className="text-xs text-text-muted mt-0.5">
                                                    {supplier.phone}
                                                </p>
                                            )}
                                            {supplier.email && (
                                                <p className="text-xs text-text-muted mt-0.5">
                                                    {supplier.email}
                                                </p>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${
                                                    supplier.status === "ACTIVE"
                                                        ? "bg-success-light text-success border-success/20"
                                                        : "bg-cream-100 text-text-muted border-cream-200"
                                                }`}>
                                                {supplier.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-text-muted">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem
                                                        onClick={() => setMaterialsSupplier(supplier)}
                                                        className="gap-2 cursor-pointer">
                                                        <Package2 size={14} />
                                                        Manage Materials
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => setEditSupplier(supplier)}
                                                        className="gap-2 cursor-pointer">
                                                        <Pencil size={14} />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => setDeleteSupplier(supplier)}
                                                        className="gap-2 cursor-pointer text-error
                                                                   focus:text-error focus:bg-error-light">
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>

            <EditSupplierDialog
                supplier={editSupplier}
                open={!!editSupplier}
                onClose={() => setEditSupplier(null)}
                onSuccess={() => {
                    setEditSupplier(null);
                    onRefresh();
                }}
            />

            <ManageSupplierMaterialsDialog
                supplier={materialsSupplier}
                open={!!materialsSupplier}
                onClose={() => setMaterialsSupplier(null)}
            />

            <AlertDialog
                open={!!deleteSupplier}
                onOpenChange={(open) => !open && setDeleteSupplier(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-text-primary">
                                {deleteSupplier?.name}
                            </span>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={deleting}
                            onClick={handleDelete}
                            className="bg-error hover:bg-error/90">
                            {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}