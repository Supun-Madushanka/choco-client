"use client";

import { useState } from "react";
import { WarehouseResponse, WarehouseRequest } from "@/types/warehouse";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { warehouseService } from "@/services/warehouse-service";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
    warehouse: WarehouseResponse | null;
    onRefresh: () => void;
}

export default function WarehouseDetailsCard({ warehouse, onRefresh }: Props) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<WarehouseRequest>({
        name: "",
        location: "",
        latitude: 0,
        longitude: 0,
        capacity: 0,
        description: "",
        isActive: true,
    });

    if (!warehouse) {
        return (
            <div className="border rounded-lg p-6 text-center text-muted-foreground">
                Select a warehouse from map
            </div>
        );
    }

    const handleEditOpen = () => {
        setForm({
            name: warehouse.name,
            location: warehouse.location,
            latitude: warehouse.latitude,
            longitude: warehouse.longitude,
            capacity: warehouse.capacity,
            description: warehouse.description,
            isActive: warehouse.isActive,
        });
        setError(null);
        setEditOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setError("Warehouse name is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await warehouseService.updateWarehouse(warehouse.id, form);
            setEditOpen(false);
            onRefresh();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } };
                };
                setError(
                    axiosError.response?.data?.message ||
                        "Failed to update warehouse"
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await warehouseService.deleteWarehouse(warehouse.id);
            setDeleteOpen(false);
            onRefresh();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="border rounded-lg p-4 space-y-3">

                <div className="flex justify-between items-center">
                    <h2 className="font-semibold">{warehouse.name}</h2>
                    <Badge
                        className={
                            warehouse.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }
                    >
                        {warehouse.isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                    {warehouse.location}
                </p>

                <div className="text-sm space-y-1">
                    <p>Capacity: {warehouse.capacity}</p>
                    <p>Lat: {warehouse.latitude}</p>
                    <p>Lng: {warehouse.longitude}</p>
                </div>

                <p className="text-sm text-muted-foreground">
                    {warehouse.description}
                </p>

                <div className="flex gap-2 pt-2">
                    <Button variant="default" onClick={handleEditOpen}>
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setDeleteOpen(true)}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-text-primary">
                            Edit Warehouse
                        </DialogTitle>
                        <DialogDescription className="text-text-muted">
                            Update the warehouse details.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">

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
                                    step="any"
                                    value={form.latitude}
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
                                    step="any"
                                    value={form.longitude}
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
                                value={form.capacity}
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
                                value={form.description}
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
                                onClick={() => setEditOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gold-500 hover:bg-gold-400 text-white"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>

                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Warehouse</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-text-primary">
                                {warehouse.name}
                            </span>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={deleting}
                            onClick={handleDelete}
                            className="bg-error hover:bg-error/90"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}