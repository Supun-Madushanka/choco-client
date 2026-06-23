"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductResponse } from "@/types/product";
import { productService } from "@/services/product-service";
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
import EditProductDialog from "./edit-product-dialog";

interface ProductsTableProps {
    products: ProductResponse[];
    loading: boolean;
    onRefresh: () => void;
}

export default function ProductsTable({
    products,
    loading,
    onRefresh,
}: ProductsTableProps) {

    const router = useRouter();
    const [editProduct, setEditProduct] = useState<ProductResponse | null>(null);
    const [deleteProduct, setDeleteProduct] = useState<ProductResponse | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteProduct) return;
        setDeleting(true);
        try {
            await productService.deleteProduct(deleteProduct.id);
            onRefresh();
        } catch {
            console.error("Failed to delete product");
        } finally {
            setDeleting(false);
            setDeleteProduct(null);
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
                                <TableHead>Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Variant</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Selling Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center py-6 text-text-muted">
                                        No products found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow
                                        key={product.id}
                                        onClick={() => router.push(
                                            `/dashboard/production/products/${product.id}`
                                        )}
                                        className="hover:bg-cream-50 transition-colors cursor-pointer">

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-xs font-mono
                                                           border-cream-200 text-text-secondary">
                                                {product.code}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm font-medium text-text-primary">
                                                {product.name}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {product.categoryName}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {product.variant || "—"}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {product.unit}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm font-medium text-text-primary">
                                                LKR {product.sellingPrice.toLocaleString()}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${
                                                    product.isActive
                                                        ? "bg-success-light text-success border-success/20"
                                                        : "bg-cream-100 text-text-muted border-cream-200"
                                                }`}>
                                                {product.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell
                                            onClick={(e) => e.stopPropagation()}>
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
                                                        onClick={() => setEditProduct(product)}
                                                        className="gap-2 cursor-pointer">
                                                        <Pencil size={14} />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => setDeleteProduct(product)}
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

            <EditProductDialog
                product={editProduct}
                open={!!editProduct}
                onClose={() => setEditProduct(null)}
                onSuccess={() => {
                    setEditProduct(null);
                    onRefresh();
                }}
            />

            <AlertDialog
                open={!!deleteProduct}
                onOpenChange={(open) => !open && setDeleteProduct(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-text-primary">
                                {deleteProduct?.name}
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