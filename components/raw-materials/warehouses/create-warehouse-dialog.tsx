"use client";

import { useState } from "react";
import { warehouseService } from "@/services/warehouse-service";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export default function CreateWarehouseDialog({
    onSuccess,
}: {
    onSuccess: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        location: "",
        latitude: 0,
        longitude: 0,
        capacity: 0,
        description: "",
        isActive: true,
    });

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setForm({
                name: "",
                location: "",
                latitude: 0,
                longitude: 0,
                capacity: 0,
                description: "",
                isActive: true,
            });
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setError("Warehouse name is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await warehouseService.createWarehouse(form);
            setOpen(false);
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } };
                };
                setError(
                    axiosError.response?.data?.message ||
                        "Failed to create warehouse"
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
                className="bg-gold-500 hover:bg-gold-400 text-white gap-2"
            >
                <Plus size={16} />
                Create Warehouse
            </Button>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Create Warehouse
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Add a new warehouse location.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {error && (
                        <div className="bg-error-light border border-error/20 text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Warehouse Name
                        </Label>
                        <Input
                            placeholder="e.g. Colombo Main Warehouse"
                            value={form.name}
                            onChange={(e) => {
                                setForm({ ...form, name: e.target.value });
                                setError(null);
                            }}
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Location</Label>
                        <Input
                            placeholder="e.g. Colombo 03, Sri Lanka"
                            value={form.location}
                            onChange={(e) =>
                                setForm({ ...form, location: e.target.value })
                            }
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Latitude</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 6.9271"
                                step="any"
                                onChange={(e) =>
                                    setForm({ ...form, latitude: Number(e.target.value) })
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Longitude</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 79.8612"
                                step="any"
                                onChange={(e) =>
                                    setForm({ ...form, longitude: Number(e.target.value) })
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    {/* Capacity */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Capacity</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 1000"
                            onChange={(e) =>
                                setForm({ ...form, capacity: Number(e.target.value) })
                            }
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Description{" "}
                            <span className="text-text-muted font-normal">
                                (optional)
                            </span>
                        </Label>
                        <Textarea
                            placeholder="Brief description of this warehouse..."
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                            rows={2}
                        />
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center justify-between rounded-lg border border-cream-200 px-4 py-3">
                        <div>
                            <Label className="text-text-primary">
                                Active Warehouse
                            </Label>
                            <p className="text-xs text-text-muted mt-0.5">
                                Inactive warehouses won't appear in assignments
                            </p>
                        </div>
                        <Switch
                            checked={form.isActive}
                            onCheckedChange={(v) =>
                                setForm({ ...form, isActive: v })
                            }
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-cream-200"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gold-500 hover:bg-gold-400 text-white"
                        >
                            {loading ? "Creating..." : "Create Warehouse"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}