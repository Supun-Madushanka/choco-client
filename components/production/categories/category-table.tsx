"use client";

import { useState } from "react";
import { ProductCategoryResponse } from "@/types/product-category";
import { productCategoryService } from "@/services/product-category-service";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import EditCategoryDialog from "./edit-category-dialog";

interface CategoryTableProps {
    categories: ProductCategoryResponse[];
    loading: boolean;
    onRefresh: () => void;
}

export default function CategoryTable({
    categories,
    loading,
    onRefresh,
}: CategoryTableProps) {

    const [editCategory, setEditCategory] = useState<ProductCategoryResponse | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<ProductCategoryResponse | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteCategory) return;
        setDeleting(true);
        try {
            await productCategoryService.deleteCategory(deleteCategory.id);
            onRefresh();
        } catch {
            console.error("Failed to delete category");
        } finally {
            setDeleting(false);
            setDeleteCategory(null);
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
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Code Prefix</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-6 text-text-muted">
                                        No categories found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}
                                        className="hover:bg-cream-50 transition-colors">

                                        <TableCell>
                                            <p className="text-sm font-medium text-text-primary">
                                                {category.name}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            {category.codePrefix ? (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs font-mono
                                                               border-cream-200 text-text-secondary">
                                                    {category.codePrefix}
                                                </Badge>
                                            ) : (
                                                <span className="text-text-muted text-sm">—</span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary max-w-xs truncate">
                                                {category.description || "—"}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary whitespace-nowrap">
                                                {format(new Date(category.createdAt), "dd MMM yyyy")}
                                            </p>
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
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem
                                                        onClick={() => setEditCategory(category)}
                                                        className="gap-2 cursor-pointer">
                                                        <Pencil size={14} />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => setDeleteCategory(category)}
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

            {/* Edit Dialog */}
            <EditCategoryDialog
                category={editCategory}
                open={!!editCategory}
                onClose={() => setEditCategory(null)}
                onSuccess={() => {
                    setEditCategory(null);
                    onRefresh();
                }}
            />

            {/* Delete Confirm */}
            <AlertDialog
                open={!!deleteCategory}
                onOpenChange={(open) => !open && setDeleteCategory(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-text-primary">
                                {deleteCategory?.name}
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