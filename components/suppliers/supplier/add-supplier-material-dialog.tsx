"use client";

import { useState, useEffect } from "react";
import { supplierMaterialService } from "@/services/supplier-material-service";
import { rawMaterialService } from "@/services/raw-material-service";
import { SupplierMaterialRequest } from "@/types/supplier-material";
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
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface AddSupplierMaterialDialogProps {
    supplierId: number;
    onSuccess: () => void;
}

export default function AddSupplierMaterialDialog({
    supplierId,
    onSuccess,
}: AddSupplierMaterialDialogProps) {

    const [open, setOpen] = useState(false);
    const [materials, setMaterials] = useState<RawMaterialResponse[]>([]);
    const [formData, setFormData] = useState<Omit<SupplierMaterialRequest, "supplierId">>({
        rawMaterialId: 0,
        unitPrice: 0,
        currency: "LKR",
        leadTimeDays: undefined,
        isPreferred: false,
    });
    const [loading, setLoading] = useState(false);
    const [materialsLoading, setMaterialsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setFormData({
                rawMaterialId: 0,
                unitPrice: 0,
                currency: "LKR",
                leadTimeDays: undefined,
                isPreferred: false,
            });
            setError(null);
            setMaterialsLoading(true);
            try {
                const response = await rawMaterialService.getActiveRawMaterials();
                setMaterials(response.data);
            } catch {
                setError("Failed to load materials");
            } finally {
                setMaterialsLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.rawMaterialId) {
            setError("Please select a raw material");
            return;
        }
        if (!formData.unitPrice || formData.unitPrice <= 0) {
            setError("Unit price must be greater than 0");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await supplierMaterialService.addSupplierMaterial({
                supplierId,
                ...formData,
            });
            setOpen(false);
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Failed to add material"
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
                size="sm"
                onClick={() => handleOpenChange(true)}
                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                <Plus size={14} />
                Add Material
            </Button>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Add Material
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Link a raw material this supplier provides.
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
                        <Label className="text-text-primary">Raw Material</Label>
                        <Select
                            disabled={materialsLoading}
                            onValueChange={(value) => setFormData({
                                ...formData,
                                rawMaterialId: parseInt(value),
                            })}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder={
                                    materialsLoading ? "Loading..." : "Select material"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {materials.map((mat) => (
                                    <SelectItem key={mat.id} value={String(mat.id)}>
                                        {mat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Unit Price</Label>
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={formData.unitPrice || ""}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    unitPrice: parseFloat(e.target.value) || 0,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Currency</Label>
                            <Select
                                value={formData.currency}
                                onValueChange={(value) => setFormData({
                                    ...formData,
                                    currency: value,
                                })}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LKR">LKR</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Lead Time (days){" "}
                            <span className="text-text-muted font-normal">
                                (optional)
                            </span>
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.leadTimeDays || ""}
                            onChange={(e) => setFormData({
                                ...formData,
                                leadTimeDays: e.target.value
                                    ? parseInt(e.target.value) : undefined,
                            })}
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    <div className="flex items-center justify-between
                                    rounded-lg border border-cream-200 px-4 py-3">
                        <div>
                            <Label className="text-text-primary">Preferred</Label>
                            <p className="text-xs text-text-muted mt-0.5">
                                Mark as preferred supplier for this material
                            </p>
                        </div>
                        <Switch
                            checked={formData.isPreferred}
                            onCheckedChange={(checked) => setFormData({
                                ...formData,
                                isPreferred: checked,
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
                            {loading ? "Adding..." : "Add Material"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}