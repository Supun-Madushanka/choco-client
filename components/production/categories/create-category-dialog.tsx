"use client";

import { useState } from "react";
import { productCategoryService } from "@/services/product-category-service";
import { ProductCategoryRequest } from "@/types/product-category";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface CreateCategoryDialogProps {
    onSuccess: () => void;
}

export default function CreateCategoryDialog({
    onSuccess,
}: CreateCategoryDialogProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<ProductCategoryRequest>({
        name: "",
        codePrefix: "",
        description: "",
    });

    const resetForm = () => {
        setForm({ name: "", codePrefix: "", description: "" });
        setError(null);
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            setError("Category name is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await productCategoryService.createCategory({
                name: form.name.trim(),
                codePrefix: form.codePrefix?.trim() || undefined,
                description: form.description?.trim() || undefined,
            });
            setOpen(false);
            resetForm();
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to create category");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => {
            setOpen(o);
            if (!o) resetForm();
        }}>
            <Button
                onClick={() => setOpen(true)}
                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                <Plus size={16} />
                New Category
            </Button>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Create Category
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Add a new product category
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
                            placeholder="e.g. Dark Chocolate"
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
                            placeholder="e.g. DRK"
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
                            placeholder="Optional description..."
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                            rows={3}
                        />
                    </div>

                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 border-cream-200"
                        onClick={() => setOpen(false)}
                        disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                        {loading ? "Creating..." : "Create"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}