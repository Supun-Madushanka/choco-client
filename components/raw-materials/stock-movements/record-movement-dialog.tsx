"use client";

import { useState, useEffect } from "react";
import { stockMovementService } from "@/services/stock-movement-service";
import { warehouseService } from "@/services/warehouse-service";
import { rawMaterialService } from "@/services/raw-material-service";
import { MovementType, StockMovementRequest } from "@/types/stock-movement";
import { WarehouseResponse } from "@/types/warehouse";
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
import { Plus } from "lucide-react";

interface RecordMovementDialogProps {
    onSuccess: () => void;
}

const initialFormData: StockMovementRequest = {
    warehouseId: 0,
    rawMaterialId: 0,
    movementType: "ADJUSTMENT",
    quantity: 0,
    note: "",
};

export default function RecordMovementDialog({
    onSuccess,
}: RecordMovementDialogProps) {

    const [open, setOpen] = useState(false);
    const [formData, setFormData] =
        useState<StockMovementRequest>(initialFormData);
    const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
    const [materials, setMaterials] = useState<RawMaterialResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setFormData(initialFormData);
            setError(null);
            fetchOptions();
        }
    };

    const fetchOptions = async () => {
        setOptionsLoading(true);
        try {
            const [warehousesRes, materialsRes] = await Promise.all([
                warehouseService.getActiveWarehouses(),
                rawMaterialService.getActiveRawMaterials(),
            ]);
            setWarehouses(warehousesRes.data);
            setMaterials(materialsRes.data);
        } catch {
            setError("Failed to load form options");
        } finally {
            setOptionsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.warehouseId) {
            setError("Please select a warehouse");
            return;
        }
        if (!formData.rawMaterialId) {
            setError("Please select a raw material");
            return;
        }
        if (!formData.quantity || formData.quantity <= 0) {
            setError("Quantity must be greater than 0");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await stockMovementService.recordMovement({
                ...formData,
                note: formData.note || undefined,
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
                    "Failed to record stock movement"
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const selectedMaterial = materials.find(
        (m) => m.id === formData.rawMaterialId
    );

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <Button
                onClick={() => handleOpenChange(true)}
                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                <Plus size={16} />
                Record Movement
            </Button>

            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Record Stock Movement
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Manually record a stock adjustment, addition, or removal.
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
                        <Label className="text-text-primary">Warehouse</Label>
                        <Select
                            disabled={optionsLoading}
                            onValueChange={(value) => setFormData({
                                ...formData,
                                warehouseId: parseInt(value),
                            })}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder={
                                    optionsLoading ? "Loading..." : "Select warehouse"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map((wh) => (
                                    <SelectItem key={wh.id} value={String(wh.id)}>
                                        {wh.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Raw Material</Label>
                        <Select
                            disabled={optionsLoading}
                            onValueChange={(value) => setFormData({
                                ...formData,
                                rawMaterialId: parseInt(value),
                            })}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder={
                                    optionsLoading ? "Loading..." : "Select material"
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
                            <Label className="text-text-primary">Type</Label>
                            <Select
                                value={formData.movementType}
                                onValueChange={(value) => setFormData({
                                    ...formData,
                                    movementType: value as MovementType,
                                })}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                                    <SelectItem value="IN">Stock In</SelectItem>
                                    <SelectItem value="OUT">Stock Out</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Quantity{" "}
                                {selectedMaterial && (
                                    <span className="text-text-muted font-normal">
                                        ({selectedMaterial.unit})
                                    </span>
                                )}
                            </Label>
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={formData.quantity || ""}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    quantity: parseFloat(e.target.value) || 0,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    {formData.movementType === "ADJUSTMENT" && (
                        <p className="text-xs text-text-muted bg-cream-50
                                      border border-cream-200 rounded-lg px-3 py-2">
                            Adjustment sets the stock to this exact quantity -
                            it does not add or subtract.
                        </p>
                    )}

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Note{" "}
                            <span className="text-text-muted font-normal">
                                (optional)
                            </span>
                        </Label>
                        <Textarea
                            value={formData.note}
                            onChange={(e) => setFormData({
                                ...formData,
                                note: e.target.value,
                            })}
                            placeholder="Reason for this movement..."
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                            rows={2}
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
                            {loading ? "Recording..." : "Record Movement"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}