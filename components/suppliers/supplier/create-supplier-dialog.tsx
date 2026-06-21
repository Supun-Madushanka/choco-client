"use client";

import { useState } from "react";
import { supplierService } from "@/services/supplier-service";
import { SupplierRequest, SupplierType } from "@/types/supplier";
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

interface CreateSupplierDialogProps {
    onSuccess: () => void;
}

const initialFormData: SupplierRequest = {
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "",
    supplierType: "LOCAL",
};

export default function CreateSupplierDialog({
    onSuccess,
}: CreateSupplierDialogProps) {

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<SupplierRequest>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextCode, setNextCode] = useState<string | null>(null);

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setFormData(initialFormData);
            setError(null);
            try {
                const response = await supplierService.getNextSupplierCode();
                setNextCode(response.data);
            } catch {
                setNextCode(null);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            await supplierService.createSupplier({
                ...formData,
                contactPerson: formData.contactPerson || undefined,
                phone: formData.phone || undefined,
                email: formData.email || undefined,
                address: formData.address || undefined,
                city: formData.city || undefined,
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
                    "Failed to create supplier"
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
                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                <Plus size={16} />
                Add Supplier
            </Button>

            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Add Supplier
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        {nextCode
                            ? `New supplier code: ${nextCode}`
                            : "Add a new supplier."}
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
                            placeholder="e.g. Ceylon Cocoa Co."
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                setError(null);
                            }}
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Contact Person</Label>
                            <Input
                                placeholder="e.g. John Doe"
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
                                placeholder="e.g. +94 77 123 4567"
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
                            placeholder="e.g. user@example.com"
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
                                placeholder="e.g. Colombo"
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
                                placeholder="e.g. Sri Lanka"
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
                            placeholder="e.g. 123 Main St, Colombo"
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
                            onClick={() => setOpen(false)}
                            disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                            {loading ? "Creating..." : "Add Supplier"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}