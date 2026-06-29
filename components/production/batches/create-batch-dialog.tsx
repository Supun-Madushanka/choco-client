"use client";

import { useState, useEffect } from "react";
import { productionBatchService } from "@/services/production-batch-service";
import { warehouseService } from "@/services/warehouse-service";
import { ProductionBatchCreateRequest } from "@/types/production-batch";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface Warehouse {
    id: number;
    name: string;
}

interface CreateBatchDialogProps {
    productionOrderId: number;
    onSuccess: () => void;
}

export default function CreateBatchDialog({
    productionOrderId,
    onSuccess,
}: CreateBatchDialogProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    const [form, setForm] = useState<ProductionBatchCreateRequest>({
        productionOrderId,
        warehouseId: 0,
        notes: "",
    });

    const resetForm = () => {
        setForm({
            productionOrderId,
            warehouseId: 0,
            notes: "",
        });
        setError(null);
    };

    const handleOpen = async () => {
        resetForm();
        try {
            const response = await warehouseService.getAllWarehouses();
            setWarehouses(response.data);
        } catch {
            console.error("Failed to fetch warehouses");
        }
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.warehouseId) {
            setError("Warehouse is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await productionBatchService.createBatch({
                productionOrderId,
                warehouseId: form.warehouseId,
                notes: form.notes?.trim() || undefined,
            });
            setOpen(false);
            resetForm();
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to create batch");
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
                <Plus size={14} />
                New Batch
            </Button>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Create Production Batch
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Start a new production batch for this order
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
                            Warehouse <span className="text-error">*</span>
                        </Label>
                        <Select
                            value={form.warehouseId ? form.warehouseId.toString() : ""}
                            onValueChange={(v) =>
                                setForm((prev) => ({ ...prev, warehouseId: parseInt(v) }))
                            }>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder="Select warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map((wh) => (
                                    <SelectItem key={wh.id} value={wh.id.toString()}>
                                        {wh.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Notes</Label>
                        <Textarea
                            value={form.notes}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, notes: e.target.value }))
                            }
                            placeholder="Optional notes..."
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
                        {loading ? "Creating..." : "Create Batch"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}