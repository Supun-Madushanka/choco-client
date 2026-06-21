"use client";

import { useState } from "react";
import { RawMaterialResponse } from "@/types/raw-material";
import { rawMaterialService } from "@/services/raw-material-service";
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
import { MoreHorizontal, Pencil, Trash2, AlertTriangle } from "lucide-react";
import EditMaterialDialog from "./edit-material-dialog";

interface MaterialsTableProps {
    materials: RawMaterialResponse[];
    stockByMaterial: Record<number, number>;
    loading: boolean;
    onRefresh: () => void;
}

export default function MaterialsTable({
    materials,
    stockByMaterial,
    loading,
    onRefresh,
}: MaterialsTableProps) {

    const [editMaterial, setEditMaterial] =
        useState<RawMaterialResponse | null>(null);
    const [deleteMaterial, setDeleteMaterial] =
        useState<RawMaterialResponse | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteMaterial) return;
        setDeleting(true);
        try {
            await rawMaterialService.deleteRawMaterial(deleteMaterial.id);
            onRefresh();
        } catch {
            console.error("Failed to delete raw material");
        } finally {
            setDeleting(false);
            setDeleteMaterial(null);
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
        <>
            <div className="bg-white rounded-card border border-cream-200
                            shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-cream-50 hover:bg-cream-50">
                                <TableHead className="text-text-secondary font-medium">
                                    Name
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium hidden md:table-cell">
                                    Category
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium">
                                    Total Stock
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium hidden lg:table-cell">
                                    Min Level
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium">
                                    Status
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium w-12">
                                    
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {materials.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-12 text-text-muted">
                                        No raw materials found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                materials.map((material) => {
                                    const totalStock =
                                        stockByMaterial[material.id] || 0;
                                    const isLowStock =
                                        totalStock < material.minStockLevel;

                                    return (
                                        <TableRow
                                            key={material.id}
                                            className="hover:bg-cream-50 transition-colors">

                                            <TableCell>
                                                <p className="text-sm font-medium text-text-primary">
                                                    {material.name}
                                                </p>
                                                {!material.isActive && (
                                                    <p className="text-xs text-text-muted mt-0.5">
                                                        Inactive
                                                    </p>
                                                )}
                                            </TableCell>

                                            <TableCell className="hidden md:table-cell">
                                                <p className="text-sm text-text-secondary">
                                                    {material.categoryName}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                <p className="text-sm font-medium text-text-primary">
                                                    {totalStock.toLocaleString()} {material.unit}
                                                </p>
                                            </TableCell>

                                            <TableCell className="hidden lg:table-cell">
                                                <p className="text-sm text-text-muted">
                                                    {material.minStockLevel.toLocaleString()} {material.unit}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                {isLowStock ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-error-light
                                                                   text-error border-error/20 gap-1">
                                                        <AlertTriangle size={11} />
                                                        Low Stock
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-success-light
                                                                   text-success border-success/20">
                                                        OK
                                                    </Badge>
                                                )}
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
                                                    <DropdownMenuContent align="end" className="w-36">
                                                        <DropdownMenuItem
                                                            onClick={() => setEditMaterial(material)}
                                                            className="gap-2 cursor-pointer">
                                                            <Pencil size={14} />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setDeleteMaterial(material)}
                                                            className="gap-2 cursor-pointer text-error
                                                                       focus:text-error focus:bg-error-light">
                                                            <Trash2 size={14} />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>

                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <EditMaterialDialog
                material={editMaterial}
                open={!!editMaterial}
                onClose={() => setEditMaterial(null)}
                onSuccess={() => {
                    setEditMaterial(null);
                    onRefresh();
                }}
            />

            <AlertDialog
                open={!!deleteMaterial}
                onOpenChange={(open) => !open && setDeleteMaterial(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Raw Material</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-text-primary">
                                {deleteMaterial?.name}
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