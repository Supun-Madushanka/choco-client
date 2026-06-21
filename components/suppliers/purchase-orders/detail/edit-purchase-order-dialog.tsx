"use client";

import { useState, useEffect } from "react";
import { purchaseOrderService } from "@/services/purchase-order-service";
import { supplierService } from "@/services/supplier-service";
import { rawMaterialService } from "@/services/raw-material-service";
import {
    PurchaseOrderRequest,
    PurchaseOrderItemRequest,
    PurchaseOrderResponse,
} from "@/types/purchase-order";
import { SupplierResponse } from "@/types/supplier";
import { RawMaterialResponse } from "@/types/raw-material";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface EditPurchaseOrderDialogProps {
    order: PurchaseOrderResponse;
    onSuccess: () => void;
}

export default function EditPurchaseOrderDialog({
    order,
    onSuccess,
}: EditPurchaseOrderDialogProps) {

    const [open, setOpen] = useState(false);
    const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
    const [materials, setMaterials] = useState<RawMaterialResponse[]>([]);
    const [supplierId, setSupplierId] = useState<number>(order.supplierId);
    const [currency, setCurrency] = useState(order.currency);
    const [expectedDate, setExpectedDate] = useState(order.expectedDate || "");
    const [notes, setNotes] = useState(order.notes || "");
    const [items, setItems] = useState<PurchaseOrderItemRequest[]>(
        order.items.map((i) => ({
            rawMaterialId: i.rawMaterialId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
        }))
    );
    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setSupplierId(order.supplierId);
            setCurrency(order.currency);
            setExpectedDate(order.expectedDate || "");
            setNotes(order.notes || "");
            setItems(order.items.map((i) => ({
                rawMaterialId: i.rawMaterialId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
            })));
            setError(null);
            setOptionsLoading(true);
            try {
                const [supplierRes, materialRes] = await Promise.all([
                    supplierService.getActiveSuppliers(),
                    rawMaterialService.getActiveRawMaterials(),
                ]);
                setSuppliers(supplierRes.data);
                setMaterials(materialRes.data);
            } catch {
                setError("Failed to load form options");
            } finally {
                setOptionsLoading(false);
            }
        }
    };

    const addItemRow = () => {
        setItems([...items, { rawMaterialId: 0, quantity: 0, unitPrice: 0 }]);
    };

    const removeItemRow = (index: number) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (
        index: number,
        field: keyof PurchaseOrderItemRequest,
        value: number
    ) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    };

    const total = items.reduce(
        (sum, item) => sum + (item.quantity * item.unitPrice || 0), 0
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!supplierId) {
            setError("Please select a supplier");
            return;
        }

        const validItems = items.filter(
            (i) => i.rawMaterialId && i.quantity > 0 && i.unitPrice > 0
        );
        if (validItems.length === 0) {
            setError("Please add at least one valid item");
            return;
        }

        setLoading(true);
        setError(null);

        const request: PurchaseOrderRequest = {
            supplierId,
            currency,
            expectedDate: expectedDate || undefined,
            notes: notes || undefined,
            items: validItems,
        };

        try {
            await purchaseOrderService.updatePurchaseOrder(order.id, request);
            setOpen(false);
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to update purchase order");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <Button
                variant="outline"
                onClick={() => handleOpenChange(true)}
                className="border-cream-200 gap-2 text-text-secondary">
                <Pencil size={14} />
                Edit
            </Button>

            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Edit Purchase Order
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        {order.poNumber}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Supplier</Label>
                        <Select
                            disabled={optionsLoading}
                            value={supplierId ? String(supplierId) : ""}
                            onValueChange={(value) => setSupplierId(parseInt(value))}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Currency</Label>
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LKR">LKR</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Expected Date</Label>
                            <Input
                                type="date"
                                value={expectedDate}
                                onChange={(e) => setExpectedDate(e.target.value)}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-text-primary">Items</Label>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={addItemRow}
                                className="border-cream-200 gap-1 text-text-secondary">
                                <Plus size={13} />
                                Add Item
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-12 gap-2 items-end
                                               p-3 rounded-lg border border-cream-200">
                                    <div className="col-span-12 sm:col-span-5 space-y-1">
                                        <Label className="text-xs text-text-muted">
                                            Material
                                        </Label>
                                        <Select
                                            disabled={optionsLoading}
                                            value={item.rawMaterialId ? String(item.rawMaterialId) : ""}
                                            onValueChange={(value) =>
                                                updateItem(index, "rawMaterialId", parseInt(value))
                                            }>
                                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                                <SelectValue placeholder="Select material" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {materials.map((mat) => (
                                                    <SelectItem key={mat.id} value={String(mat.id)}>
                                                        {mat.name} ({mat.unit})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-5 sm:col-span-3 space-y-1">
                                        <Label className="text-xs text-text-muted">
                                            Quantity
                                        </Label>
                                        <Input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={item.quantity || ""}
                                            onChange={(e) =>
                                                updateItem(index, "quantity", parseFloat(e.target.value) || 0)
                                            }
                                            className="border-cream-200 focus-visible:ring-gold-500"
                                        />
                                    </div>
                                    <div className="col-span-5 sm:col-span-3 space-y-1">
                                        <Label className="text-xs text-text-muted">
                                            Unit Price
                                        </Label>
                                        <Input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={item.unitPrice || ""}
                                            onChange={(e) =>
                                                updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)
                                            }
                                            className="border-cream-200 focus-visible:ring-gold-500"
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            disabled={items.length === 1}
                                            onClick={() => removeItemRow(index)}
                                            className="h-9 w-9 text-error hover:bg-error-light">
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-1">
                            <p className="text-sm font-semibold text-text-primary">
                                Total: {currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Notes{" "}
                            <span className="text-text-muted font-normal">
                                (optional)
                            </span>
                        </Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-cream-200"
                            onClick={() => setOpen(false)}
                            disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}