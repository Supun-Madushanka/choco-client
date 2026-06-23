"use client";

import { useState, useEffect } from "react";
import { productCategoryService } from "@/services/product-category-service";
import { ProductCategoryResponse, ProductCategoryRequest } from "@/types/product-category";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditCategoryDialogProps {
    category: ProductCategoryResponse | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditCategoryDialog({
    category,
    open,
    onClose,
    onSuccess,
}: EditCategoryDialogProps) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<ProductCategoryRequest>({
        name: "",
        codePrefix: "",
        description: "",
    });

    useEffect(() => {
        if (open && category) {
            setForm({
                name: category.name,
                codePrefix: category.codePrefix || "",
                description: category.description || "",
            });
            setError(null);
        }
    }, [open, category]);

    const handleSubmit = async () => {
        if (!category) return;
        if (!form.name.trim()) {
            setError("Category name is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await productCategoryService.updateCategory(category.id, {
                name: form.name.trim(),
                codePrefix: form.codePrefix?.trim() || undefined,
                description: form.description?.trim() || undefined,
            });
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to update category");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Edit Category
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Update category details
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

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Code Prefix</Label>
                        <Input
                            value={form.codePrefix}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, codePrefix: e.target.value }))
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