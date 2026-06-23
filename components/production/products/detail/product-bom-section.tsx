"use client";

import { useState, useEffect } from "react";
import { bomService } from "@/services/bom-service";
import { BillOfMaterialResponse, Unit } from "@/types/bill-of-material";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AddBomItemDialog from "./add-bom-item-dialog";

const UNITS: Unit[] = [
    "KG", "G", "L", "ML", "PIECES", "BOXES", "BAGS", "PACKETS",
];

interface ProductBomSectionProps {
    productId: number;
}

export default function ProductBomSection({
    productId,
}: ProductBomSectionProps) {

    const [items, setItems] = useState<BillOfMaterialResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [editItem, setEditItem] = useState<BillOfMaterialResponse | null>(null);
    const [deleteItem, setDeleteItem] = useState<BillOfMaterialResponse | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    const [editForm, setEditForm] = useState({
        quantityRequired: 0,
        unit: "KG" as Unit,
        notes: "",
    });

    const fetchBom = async () => {
        setLoading(true);
        try {
            const response = await bomService.getByProduct(productId);
            setItems(response.data);
        } catch {
            console.error("Failed to fetch BOM");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBom();
    }, [productId]);

    useEffect(() => {
        if (editItem) {
            setEditForm({
                quantityRequired: editItem.quantityRequired,
                unit: editItem.unit,
                notes: editItem.notes || "",
            });
            setEditError(null);
        }
    }, [editItem]);

    const handleEditSubmit = async () => {
        if (!editItem) return;
        if (!editForm.quantityRequired || editForm.quantityRequired <= 0) {
            setEditError("Quantity must be greater than 0");
            return;
        }

        setEditLoading(true);
        setEditError(null);

        try {
            await bomService.updateBomItem(editItem.id, {
                productId,
                rawMaterialId: editItem.rawMaterialId,
                quantityRequired: editForm.quantityRequired,
                unit: editForm.unit,
                notes: editForm.notes?.trim() || undefined,
            });
            setEditItem(null);
            fetchBom();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setEditError(axiosError.response?.data?.message || "Failed to update BOM item");
            }
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteItem) return;
        setDeleting(true);
        try {
            await bomService.deleteBomItem(deleteItem.id);
            fetchBom();
        } catch {
            console.error("Failed to delete BOM item");
        } finally {
            setDeleting(false);
            setDeleteItem(null);
        }
    };

    return (
        <>
            <Card className="border-cream-200 shadow-card">
                <CardHeader className="pb-3 border-b border-cream-200">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold text-text-primary">
                            Bill of Materials
                            <span className="ml-2 text-text-muted font-normal text-sm">
                                ({items.length})
                            </span>
                        </CardTitle>
                        <AddBomItemDialog
                            productId={productId}
                            onSuccess={fetchBom}
                        />
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        Raw Material
                                    </TableHead>
                                    <TableHead>
                                        Quantity Required
                                    </TableHead>
                                    <TableHead>
                                        Unit
                                    </TableHead>
                                    <TableHead>
                                        Notes
                                    </TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-6 text-text-muted">
                                            No materials added yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item) => (
                                        <TableRow key={item.id}
                                            className="hover:bg-cream-50">
                                            <TableCell>
                                                <p className="text-sm font-medium text-text-primary">
                                                    {item.rawMaterialName}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm text-text-secondary">
                                                    {item.quantityRequired.toLocaleString()}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm text-text-secondary">
                                                    {item.unit}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm text-text-muted max-w-xs truncate">
                                                    {item.notes || "—"}
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
                                                            onClick={() => setEditItem(item)}
                                                            className="gap-2 cursor-pointer">
                                                            <Pencil size={14} />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => setDeleteItem(item)}
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
                    )}
                </CardContent>
            </Card>

            {/* Edit BOM Item Dialog */}
            <Dialog
                open={!!editItem}
                onOpenChange={(o) => !o && setEditItem(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-text-primary">
                            Edit BOM Item
                        </DialogTitle>
                        <DialogDescription className="text-text-muted">
                            {editItem?.rawMaterialName}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">

                        {editError && (
                            <div className="bg-error-light border border-error/20
                                            text-error rounded-lg px-4 py-3 text-sm">
                                {editError}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-text-primary">
                                    Quantity <span className="text-error">*</span>
                                </Label>
                                <Input
                                    type="number"
                                    min="0.0001"
                                    step="0.0001"
                                    value={editForm.quantityRequired || ""}
                                    onChange={(e) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            quantityRequired: parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                    className="border-cream-200 focus-visible:ring-gold-500"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-text-primary">Unit</Label>
                                <Select
                                    value={editForm.unit}
                                    onValueChange={(v) =>
                                        setEditForm((prev) => ({ ...prev, unit: v as Unit }))
                                    }>
                                    <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UNITS.map((u) => (
                                            <SelectItem key={u} value={u}>{u}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Notes</Label>
                            <Textarea
                                value={editForm.notes}
                                onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, notes: e.target.value }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                                rows={2}
                            />
                        </div>

                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1 border-cream-200"
                            onClick={() => setEditItem(null)}
                            disabled={editLoading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditSubmit}
                            disabled={editLoading}
                            className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                            {editLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>

                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <AlertDialog
                open={!!deleteItem}
                onOpenChange={(open) => !open && setDeleteItem(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Material</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove{" "}
                            <span className="font-medium text-text-primary">
                                {deleteItem?.rawMaterialName}
                            </span>{" "}
                            from the recipe? This action cannot be undone.
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
                            {deleting ? "Removing..." : "Remove"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}