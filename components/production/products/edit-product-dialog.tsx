"use client";

import { useState, useEffect } from "react";
import { productService } from "@/services/product-service";
import { productCategoryService } from "@/services/product-category-service";
import { ProductCategoryResponse } from "@/types/product-category";
import { ProductResponse, ProductRequest, Unit } from "@/types/product";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";

const UNITS: Unit[] = [
    "KG", "G", "L", "ML", "PIECES", "BOXES", "BAGS", "PACKETS",
];

interface EditProductDialogProps {
    product: ProductResponse | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditProductDialog({
    product,
    open,
    onClose,
    onSuccess,
}: EditProductDialogProps) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);

    const [form, setForm] = useState<ProductRequest>({
        categoryId: 0,
        name: "",
        variant: "",
        packagingType: "",
        unit: "KG",
        weightPerUnit: undefined,
        sellingPrice: 0,
        description: "",
        isActive: true,
    });

    useEffect(() => {
        if (open && product) {
            fetchCategories();
            setForm({
                categoryId: product.categoryId,
                name: product.name,
                variant: product.variant || "",
                packagingType: product.packagingType || "",
                unit: product.unit,
                weightPerUnit: product.weightPerUnit || undefined,
                sellingPrice: product.sellingPrice,
                description: product.description || "",
                isActive: product.isActive,
            });
            setError(null);
        }
    }, [open, product]);

    const fetchCategories = async () => {
        try {
            const response = await productCategoryService.getAllCategories();
            setCategories(response.data);
        } catch {
            console.error("Failed to fetch categories");
        }
    };

    const handleSubmit = async () => {
        if (!product) return;
        if (!form.categoryId) {
            setError("Category is required");
            return;
        }
        if (!form.name.trim()) {
            setError("Product name is required");
            return;
        }
        if (!form.unit) {
            setError("Unit is required");
            return;
        }
        if (!form.sellingPrice || form.sellingPrice <= 0) {
            setError("Selling price is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await productService.updateProduct(product.id, {
                categoryId: form.categoryId,
                name: form.name.trim(),
                variant: form.variant?.trim() || undefined,
                packagingType: form.packagingType?.trim() || undefined,
                unit: form.unit,
                weightPerUnit: form.weightPerUnit || undefined,
                sellingPrice: form.sellingPrice,
                description: form.description?.trim() || undefined,
                isActive: form.isActive,
            });
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to update product");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Edit Product
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Update product details
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
                            Category <span className="text-error">*</span>
                        </Label>
                        <Select
                            value={form.categoryId ? form.categoryId.toString() : ""}
                            onValueChange={(v) =>
                                setForm((prev) => ({ ...prev, categoryId: parseInt(v) }))
                            }>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Name <span className="text-error">*</span>
                        </Label>
                        <Input
                            value={form.name}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Variant</Label>
                            <Input
                                value={form.variant}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, variant: e.target.value }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Packaging Type</Label>
                            <Input
                                value={form.packagingType}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, packagingType: e.target.value }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Unit <span className="text-error">*</span>
                            </Label>
                            <Select
                                value={form.unit}
                                onValueChange={(v) =>
                                    setForm((prev) => ({ ...prev, unit: v as Unit }))
                                }>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNITS.map((u) => (
                                        <SelectItem key={u} value={u}>
                                            {u}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Weight per Unit (g)</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.weightPerUnit || ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        weightPerUnit: parseFloat(e.target.value) || undefined,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Selling Price (LKR) <span className="text-error">*</span>
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.sellingPrice || ""}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    sellingPrice: parseFloat(e.target.value) || 0,
                                }))
                            }
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Description</Label>
                        <Textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch
                            checked={form.isActive}
                            onCheckedChange={(checked) =>
                                setForm((prev) => ({ ...prev, isActive: checked }))
                            }
                        />
                        <Label className="text-text-primary">Active</Label>
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