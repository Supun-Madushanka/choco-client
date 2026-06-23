"use client";

import { useState, useEffect } from "react";
import { bomService } from "@/services/bom-service";
import { rawMaterialService } from "@/services/raw-material-service";
import { BillOfMaterialRequest, Unit } from "@/types/bill-of-material";
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
import { Plus } from "lucide-react";
import { RawMaterialResponse } from "@/types/raw-material";

const UNITS: Unit[] = [
    "KG", "G", "L", "ML", "PIECES", "BOXES", "BAGS", "PACKETS",
];

interface AddBomItemDialogProps {
    productId: number;
    onSuccess: () => void;
}

export default function AddBomItemDialog({
    productId,
    onSuccess,
}: AddBomItemDialogProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rawMaterials, setRawMaterials] = useState<RawMaterialResponse[]>([]);

    const [form, setForm] = useState<BillOfMaterialRequest>({
        productId,
        rawMaterialId: 0,
        quantityRequired: 0,
        unit: "KG",
        notes: "",
    });

    useEffect(() => {
        if (open) {
            fetchRawMaterials();
            resetForm();
        }
    }, [open]);

    const fetchRawMaterials = async () => {
        try {
            const response = await rawMaterialService.getAllRawMaterials();
            setRawMaterials(response.data);
        } catch {
            console.error("Failed to fetch raw materials");
        }
    };

    const resetForm = () => {
        setForm({
            productId,
            rawMaterialId: 0,
            quantityRequired: 0,
            unit: "KG",
            notes: "",
        });
        setError(null);
    };

    const handleRawMaterialSelect = (id: string) => {
        const rm = rawMaterials.find((r) => r.id === parseInt(id));
        setForm((prev) => ({
            ...prev,
            rawMaterialId: parseInt(id),
            unit: rm?.unit || "KG",
        }));
    };

    const handleSubmit = async () => {
        if (!form.rawMaterialId) {
            setError("Raw material is required");
            return;
        }
        if (!form.quantityRequired || form.quantityRequired <= 0) {
            setError("Quantity must be greater than 0");
            return;
        }
        if (!form.unit) {
            setError("Unit is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await bomService.addBomItem({
                productId,
                rawMaterialId: form.rawMaterialId,
                quantityRequired: form.quantityRequired,
                unit: form.unit,
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
                setError(axiosError.response?.data?.message || "Failed to add BOM item");
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
                onClick={() => setOpen(true)}
                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                <Plus size={14} />
                Add Material
            </Button>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Add BOM Item
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Add a raw material to this product's recipe
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
                            Raw Material <span className="text-error">*</span>
                        </Label>
                        <Select
                            value={form.rawMaterialId ? form.rawMaterialId.toString() : ""}
                            onValueChange={handleRawMaterialSelect}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder="Select raw material" />
                            </SelectTrigger>
                            <SelectContent>
                                {rawMaterials.map((rm) => (
                                    <SelectItem key={rm.id} value={rm.id.toString()}>
                                        {rm.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Quantity <span className="text-error">*</span>
                            </Label>
                            <Input
                                type="number"
                                min="0.0001"
                                step="0.0001"
                                value={form.quantityRequired || ""}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        quantityRequired: parseFloat(e.target.value) || 0,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
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
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNITS.map((u) => (
                                        <SelectItem key={u} value={u}>{u}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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
                            rows={2}
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
                        {loading ? "Adding..." : "Add"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}