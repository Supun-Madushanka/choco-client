"use client";

import { useState, useEffect } from "react";
import { supplierMaterialService } from "@/services/supplier-material-service";
import { SupplierMaterialRequest, SupplierMaterialResponse } from "@/types/supplier-material";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
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

import { Pencil } from "lucide-react";

interface Props {
    material: SupplierMaterialResponse;
    onSuccess: () => void;
}

export default function UpdateSupplierMaterialDialog({
    material,
    onSuccess,
}: Props) {

    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState<SupplierMaterialRequest>({
        supplierId: material.supplierId,
        rawMaterialId: material.rawMaterialId,
        unitPrice: material.unitPrice,
        currency: material.currency,
        leadTimeDays: material.leadTimeDays ?? undefined,
        isPreferred: material.isPreferred,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setFormData({
                supplierId: material.supplierId,
                rawMaterialId: material.rawMaterialId,
                unitPrice: material.unitPrice,
                currency: material.currency,
                leadTimeDays: material.leadTimeDays ?? undefined,
                isPreferred: material.isPreferred,
            });

            setError(null);
        }
    }, [open, material]);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await supplierMaterialService.updateSupplierMaterial(
                material.id,
                formData
            );
            setOpen(false);
            onSuccess();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ??
                "Failed to update material"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                >
                    <Pencil size={14} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>
                        Update Material
                    </DialogTitle>
                    <DialogDescription>
                        Update supplier material details.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {error && (
                        <div
                            className="
                            bg-error-light
                            border border-error/20
                            text-error
                            rounded-lg
                            px-4 py-3
                            text-sm"
                        >
                            {error}
                        </div>
                    )}

                    {/* Raw material read only */}
                    <div className="space-y-1.5">
                        <Label>
                            Raw Material
                        </Label>
                        <Input
                            disabled
                            value={material.rawMaterialName}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>
                                Unit Price
                            </Label>
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={formData.unitPrice}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        unitPrice:
                                            parseFloat(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>
                                Currency
                            </Label>
                            <Select
                                value={formData.currency}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        currency: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LKR">
                                        LKR
                                    </SelectItem>
                                    <SelectItem value="USD">
                                        USD
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label>
                            Lead Time (days)
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.leadTimeDays || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    leadTimeDays:
                                        e.target.value
                                            ? parseInt(e.target.value)
                                            : undefined,
                                })
                            }
                        />
                    </div>
                    <div
                        className="
                        flex items-center justify-between
                        border rounded-lg
                        px-4 py-3"
                    >
                        <div>
                            <Label>
                                Preferred
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Mark as preferred supplier
                            </p>
                        </div>

                        <Switch
                            checked={formData.isPreferred}
                            onCheckedChange={(checked) =>
                                setFormData({
                                    ...formData,
                                    isPreferred: checked,
                                })
                            }
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading
                                ? "Updating..."
                                : "Update Material"}

                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}