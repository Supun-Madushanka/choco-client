"use client";

import { useState, useEffect } from "react";
import { rawMaterialService } from "@/services/raw-material-service";
import { rawMaterialCategoryService } from "@/services/raw-material-category-service";
import { RawMaterialRequest, RawMaterialUnit } from "@/types/raw-material";
import { RawMaterialCategoryResponse } from "@/types/raw-material-category";
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
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface CreateMaterialDialogProps {
    onSuccess: () => void;
}

const UNITS: RawMaterialUnit[] = [
    "KG", "G", "L", "ML", "PIECES", "BOXES", "BAGS", "PACKETS",
];

const initialFormData: RawMaterialRequest = {
    categoryId: 0,
    name: "",
    unit: "KG",
    minStockLevel: 0,
    description: "",
    isActive: true,
};

export default function CreateMaterialDialog({
    onSuccess,
}: CreateMaterialDialogProps) {

    const [open, setOpen] = useState(false);
    const [formData, setFormData] =
        useState<RawMaterialRequest>(initialFormData);
    const [categories, setCategories] =
        useState<RawMaterialCategoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setFormData(initialFormData);
            setError(null);
            fetchCategories();
        }
    };

    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            const response = await rawMaterialCategoryService.getAllCategories();
            setCategories(response.data);
        } catch {
            setError("Failed to load categories");
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.categoryId) {
            setError("Please select a category");
            return;
        }
        if (!formData.name.trim()) {
            setError("Material name is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await rawMaterialService.createRawMaterial(formData);
            setOpen(false);
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Failed to create raw material"
                );
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
                onClick={() => handleOpenChange(true)}
                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                <Plus size={16} />
                Add Material
            </Button>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Add Raw Material
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Add a new raw material to the catalog.
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
                        <Label className="text-text-primary">Category</Label>
                        <Select
                            disabled={categoriesLoading}
                            onValueChange={(value) => setFormData({
                                ...formData,
                                categoryId: parseInt(value),
                            })}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder={
                                    categoriesLoading
                                        ? "Loading categories..."
                                        : "Select category"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Material Name</Label>
                        <Input
                            placeholder="e.g. Cocoa Beans"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                setError(null);
                            }}
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Unit</Label>
                            <Select
                                value={formData.unit}
                                onValueChange={(value) => setFormData({
                                    ...formData,
                                    unit: value as RawMaterialUnit,
                                })}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNITS.map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                            {unit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Min Stock Level</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.minStockLevel}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    minStockLevel: parseFloat(e.target.value) || 0,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Description{" "}
                            <span className="text-text-muted font-normal">
                                (optional)
                            </span>
                        </Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({
                                ...formData,
                                description: e.target.value,
                            })}
                            placeholder="Brief description..."
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                            rows={2}
                        />
                    </div>

                    <div className="flex items-center justify-between
                                    rounded-lg border border-cream-200 px-4 py-3">
                        <div>
                            <Label className="text-text-primary">Active</Label>
                            <p className="text-xs text-text-muted mt-0.5">
                                Inactive materials are hidden from selection
                            </p>
                        </div>
                        <Switch
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({
                                ...formData,
                                isActive: checked,
                            })}
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
                            {loading ? "Creating..." : "Add Material"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}