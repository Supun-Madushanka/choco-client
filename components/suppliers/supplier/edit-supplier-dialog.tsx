"use client";

import { useState, useEffect } from "react";
import { supplierService } from "@/services/supplier-service";
import { SupplierRequest, SupplierResponse, SupplierStatus, SupplierType } from "@/types/supplier";
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

interface EditSupplierDialogProps {
    supplier: SupplierResponse | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditSupplierDialog({
    supplier,
    open,
    onClose,
    onSuccess,
}: EditSupplierDialogProps) {

    const [formData, setFormData] = useState<SupplierRequest>({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        country: "",
        supplierType: "LOCAL",
        status: "ACTIVE",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name,
                contactPerson: supplier.contactPerson || "",
                phone: supplier.phone || "",
                email: supplier.email || "",
                address: supplier.address || "",
                city: supplier.city || "",
                country: supplier.country,
                supplierType: supplier.supplierType,
                status: supplier.status,
            });
            setError(null);
        }
    }, [supplier]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!supplier) return;

        if (!formData.name.trim()) {
            setError("Supplier name is required");
            return;
        }
        if (!formData.country.trim()) {
            setError("Country is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await supplierService.updateSupplier(supplier.id, {
                ...formData,
                contactPerson: formData.contactPerson || undefined,
                phone: formData.phone || undefined,
                email: formData.email || undefined,
                address: formData.address || undefined,
                city: formData.city || undefined,
            });
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Failed to update supplier"
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Edit Supplier
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        {supplier?.code} - Update supplier details.
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
                        <Label className="text-text-primary">Supplier Name</Label>
                        <Input
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
                            <Label className="text-text-primary">Supplier Type</Label>
                            <Select
                                value={formData.supplierType}
                                onValueChange={(value) => setFormData({
                                    ...formData,
                                    supplierType: value as SupplierType,
                                })}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOCAL">Local</SelectItem>
                                    <SelectItem value="INTERNATIONAL">International</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({
                                    ...formData,
                                    status: value as SupplierStatus,
                                })}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Contact Person</Label>
                            <Input
                                value={formData.contactPerson}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    contactPerson: e.target.value,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Phone</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Email</Label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({
                                ...formData,
                                email: e.target.value,
                            })}
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">City</Label>
                            <Input
                                value={formData.city}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    city: e.target.value,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Country</Label>
                            <Input
                                value={formData.country}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        country: e.target.value,
                                    });
                                    setError(null);
                                }}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Address</Label>
                        <Textarea
                            value={formData.address}
                            onChange={(e) => setFormData({
                                ...formData,
                                address: e.target.value,
                            })}
                            rows={2}
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-cream-200"
                            onClick={onClose}
                            disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}