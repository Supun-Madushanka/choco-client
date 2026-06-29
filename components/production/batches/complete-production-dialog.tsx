"use client";

import { useState, useEffect } from "react";
import { productionBatchService } from "@/services/production-batch-service";
import { bomService } from "@/services/bom-service";
import { ProductionBatchResponse, BatchConsumptionItemRequest } from "@/types/production-batch";
import { BillOfMaterialResponse } from "@/types/bill-of-material";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PackageCheck } from "lucide-react";

interface CompleteProductionDialogProps {
    batch: ProductionBatchResponse;
    productId: number;
    onSuccess: () => void;
}

export default function CompleteProductionDialog({
    batch,
    productId,
    onSuccess,
}: CompleteProductionDialogProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bomItems, setBomItems] = useState<BillOfMaterialResponse[]>([]);

    const [form, setForm] = useState({
        quantityProduced: 0,
        quantityRejected: 0,
        productionDate: new Date().toISOString().split("T")[0],
        expiryDate: "",
    });

    const [consumptions, setConsumptions] = useState<BatchConsumptionItemRequest[]>([]);

    const resetForm = () => {
        setForm({
            quantityProduced: 0,
            quantityRejected: 0,
            productionDate: new Date().toISOString().split("T")[0],
            expiryDate: "",
        });
        setError(null);
    };

    const handleOpen = async () => {
        resetForm();
        try {
            const response = await bomService.getByProduct(productId);
            setBomItems(response.data);
            setConsumptions(
                response.data.map((item) => ({
                    rawMaterialId: item.rawMaterialId,
                    quantityConsumed: item.quantityRequired,
                }))
            );
        } catch {
            console.error("Failed to fetch BOM");
            setConsumptions([]);
        }
        setOpen(true);
    };

    const updateConsumption = (index: number, value: string) => {
        const updated = [...consumptions];
        updated[index].quantityConsumed = parseFloat(value) || 0;
        setConsumptions(updated);
    };

    const handleSubmit = async () => {
        if (!form.quantityProduced || form.quantityProduced <= 0) {
            setError("Quantity produced must be greater than 0");
            return;
        }
        if (!form.productionDate) {
            setError("Production date is required");
            return;
        }
        if (consumptions.length === 0) {
            setError("At least one consumption item is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await productionBatchService.completeProduction(batch.id, {
                quantityProduced: form.quantityProduced,
                quantityRejected: form.quantityRejected || 0,
                productionDate: form.productionDate,
                expiryDate: form.expiryDate || undefined,
                consumptions,
            });
            setOpen(false);
            resetForm();
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to complete production");
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
                size="sm"
                onClick={handleOpen}
                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                <PackageCheck size={14} />
                Complete Production
            </Button>

            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Complete Production
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        {batch.batchNumber} - {batch.productName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Quantities */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Qty Produced <span className="text-error">*</span>
                            </Label>
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.quantityProduced || ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        quantityProduced: parseFloat(e.target.value) || 0,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Qty Rejected</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.quantityRejected || ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        quantityRejected: parseFloat(e.target.value) || 0,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Production Date <span className="text-error">*</span>
                            </Label>
                            <Input
                                type="date"
                                value={form.productionDate}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        productionDate: e.target.value,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Expiry Date</Label>
                            <Input
                                type="date"
                                value={form.expiryDate}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        expiryDate: e.target.value,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    {/* Raw Material Consumptions */}
                    {consumptions.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-text-primary">
                                Raw Material Consumption
                            </Label>
                            <div className="border border-cream-200 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-cream-50">
                                        <tr>
                                            <th className="text-left px-3 py-2 text-text-secondary font-medium">
                                                Material
                                            </th>
                                            <th className="text-left px-3 py-2 text-text-secondary font-medium">
                                                BOM Qty
                                            </th>
                                            <th className="text-left px-3 py-2 text-text-secondary font-medium">
                                                Consumed
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bomItems.map((bomItem, index) => (
                                            <tr
                                                key={bomItem.rawMaterialId}
                                                className="border-t border-cream-200">
                                                <td className="px-3 py-2 text-text-primary font-medium">
                                                    {bomItem.rawMaterialName}
                                                    <span className="text-text-muted ml-1 text-xs">
                                                        ({bomItem.unit})
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-text-secondary">
                                                    {bomItem.quantityRequired.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={consumptions[index]?.quantityConsumed || ""}
                                                        onChange={(e) =>
                                                            updateConsumption(index, e.target.value)
                                                        }
                                                        className="h-8 w-28 border-cream-200
                                                                   focus-visible:ring-gold-500"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

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
                        {loading ? "Saving..." : "Complete Production"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}