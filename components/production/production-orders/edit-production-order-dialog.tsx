"use client";

import { useState, useEffect } from "react";
import { productionOrderService } from "@/services/production-order-service";
import { productService } from "@/services/product-service";
import { ProductResponse } from "@/types/product";
import { ProductionOrderResponse, ProductionOrderRequest } from "@/types/production-order";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface EditProductionOrderDialogProps {
    order: ProductionOrderResponse | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditProductionOrderDialog({
    order,
    open,
    onClose,
    onSuccess,
}: EditProductionOrderDialogProps) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<ProductResponse[]>([]);

    const [form, setForm] = useState<ProductionOrderRequest>({
        productId: 0,
        plannedQuantity: 0,
        plannedDate: "",
        notes: "",
    });

    useEffect(() => {
        if (open && order) {
            fetchProducts();
            setForm({
                productId: order.productId,
                plannedQuantity: order.plannedQuantity,
                plannedDate: order.plannedDate,
                notes: order.notes || "",
            });
            setError(null);
        }
    }, [open, order]);

    const fetchProducts = async () => {
        try {
            const response = await productService.getActiveProducts();
            setProducts(response.data);
        } catch {
            console.error("Failed to fetch products");
        }
    };

    const handleSubmit = async () => {
        if (!order) return;
        if (!form.productId) {
            setError("Product is required");
            return;
        }
        if (!form.plannedQuantity || form.plannedQuantity <= 0) {
            setError("Planned quantity must be greater than 0");
            return;
        }
        if (!form.plannedDate) {
            setError("Planned date is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await productionOrderService.updateOrder(order.id, {
                productId: form.productId,
                plannedQuantity: form.plannedQuantity,
                plannedDate: form.plannedDate,
                notes: form.notes?.trim() || undefined,
            });
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to update order");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Edit Production Order
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Update production order details
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Product <span className="text-error">*</span>
                        </Label>
                        <Select
                            value={form.productId ? form.productId.toString() : ""}
                            onValueChange={(v) =>
                                setForm((prev) => ({ ...prev, productId: parseInt(v) }))
                            }>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.name}
                                        {p.variant ? ` - ${p.variant}` : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Planned Quantity <span className="text-error">*</span>
                            </Label>
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.plannedQuantity || ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        plannedQuantity: parseFloat(e.target.value) || 0,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Planned Date <span className="text-error">*</span>
                            </Label>
                            <Input
                                type="date"
                                value={form.plannedDate}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        plannedDate: e.target.value,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Notes</Label>
                        <Textarea
                            value={form.notes}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, notes: e.target.value }))
                            }
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                            rows={3}
                        />
                    </div>

                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 border-cream-200"
                        onClick={onClose}
                        disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}