"use client";

import { useState, useEffect } from "react";
import { grnService } from "@/services/grn-service";
import { purchaseOrderService } from "@/services/purchase-order-service";
import { warehouseService } from "@/services/warehouse-service";
import { PurchaseOrderResponse } from "@/types/purchase-order";
import { GrnItemCreateRequest } from "@/types/grn";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, PackagePlus } from "lucide-react";
import { WarehouseResponse } from "@/types/warehouse";

interface CreateGrnDialogProps {
    onSuccess: () => void;
}

export default function CreateGrnDialog({ onSuccess }: CreateGrnDialogProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [orderedPOs, setOrderedPOs] = useState<PurchaseOrderResponse[]>([]);
    const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
    const [selectedPO, setSelectedPO] = useState<PurchaseOrderResponse | null>(null);

    const [form, setForm] = useState({
        purchaseOrderId: "",
        warehouseId: "",
        receivedDate: new Date().toISOString().split("T")[0],
        notes: "",
    });

    const [items, setItems] = useState<GrnItemCreateRequest[]>([]);

    useEffect(() => {
        if (open) {
            fetchData();
            resetForm();
        }
    }, [open]);

    const fetchData = async () => {
        try {
            const [poRes, whRes] = await Promise.all([
                purchaseOrderService.getByStatus("ORDERED"),
                warehouseService.getAllWarehouses(),
            ]);
            setOrderedPOs(poRes.data);
            setWarehouses(whRes.data);
        } catch {
            setError("Failed to load data");
        }
    };

    const resetForm = () => {
        setForm({
            purchaseOrderId: "",
            warehouseId: "",
            receivedDate: new Date().toISOString().split("T")[0],
            notes: "",
        });
        setItems([]);
        setSelectedPO(null);
        setError(null);
    };

    const handlePOSelect = (poId: string) => {
        const po = orderedPOs.find((p) => p.id === parseInt(poId));
        setSelectedPO(po || null);
        setForm((prev) => ({ ...prev, purchaseOrderId: poId }));

        if (po) {
            setItems(
                po.items.map((item) => ({
                    rawMaterialId: item.rawMaterialId,
                    orderedQuantity: item.quantity,
                    receivedQuantity: item.quantity,
                }))
            );
        } else {
            setItems([]);
        }
    };

    const updateItemReceivedQty = (index: number, value: string) => {
        const updated = [...items];
        updated[index].receivedQuantity = parseFloat(value) || 0;
        setItems(updated);
    };

    const handleSubmit = async () => {
        if (!form.purchaseOrderId || !form.warehouseId || !form.receivedDate) {
            setError("Please fill all required fields");
            return;
        }
        if (items.length === 0) {
            setError("No items to receive");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await grnService.createGrn({
                purchaseOrderId: parseInt(form.purchaseOrderId),
                warehouseId: parseInt(form.warehouseId),
                receivedDate: form.receivedDate,
                notes: form.notes || undefined,
                items,
            });
            setOpen(false);
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to create GRN");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                onClick={() => setOpen(true)}
                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                <Plus size={16} />
                New GRN
            </Button>

            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary flex items-center gap-2">
                        <PackagePlus size={18} />
                        Create Goods Received Note
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Record goods received against an ordered purchase order
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* PO Selection */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Purchase Order <span className="text-error">*</span>
                        </Label>
                        <Select
                            value={form.purchaseOrderId}
                            onValueChange={handlePOSelect}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder="Select an ordered PO" />
                            </SelectTrigger>
                            <SelectContent>
                                {orderedPOs.map((po) => (
                                    <SelectItem key={po.id} value={po.id.toString()}>
                                        {po.poNumber} - {po.supplierName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Warehouse */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Warehouse <span className="text-error">*</span>
                        </Label>
                        <Select
                            value={form.warehouseId}
                            onValueChange={(v) =>
                                setForm((prev) => ({ ...prev, warehouseId: v }))
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

                    {/* Received Date */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Received Date <span className="text-error">*</span>
                        </Label>
                        <Input
                            type="date"
                            value={form.receivedDate}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    receivedDate: e.target.value,
                                }))
                            }
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    {/* Items */}
                    {selectedPO && items.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-text-primary">Items</Label>
                            <div className="border border-cream-200 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-cream-50">
                                        <tr>
                                            <th className="text-left px-3 py-2 text-text-secondary font-medium">
                                                Material
                                            </th>
                                            <th className="text-left px-3 py-2 text-text-secondary font-medium">
                                                Ordered
                                            </th>
                                            <th className="text-left px-3 py-2 text-text-secondary font-medium">
                                                Received Qty
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPO.items.map((poItem, index) => (
                                            <tr
                                                key={poItem.rawMaterialId}
                                                className="border-t border-cream-200">
                                                <td className="px-3 py-2 text-text-primary font-medium">
                                                    {poItem.rawMaterialName}
                                                    <span className="text-text-muted ml-1 text-xs">
                                                        ({poItem.unit})
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-text-secondary">
                                                    {poItem.quantity.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={items[index]?.receivedQuantity || ""}
                                                        onChange={(e) =>
                                                            updateItemReceivedQty(index, e.target.value)
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

                    {/* Notes */}
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

                <div className="flex gap-2 pt-2">
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
                        {loading ? "Creating..." : "Create GRN"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}