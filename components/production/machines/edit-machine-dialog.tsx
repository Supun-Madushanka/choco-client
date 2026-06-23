"use client";

import { useState, useEffect } from "react";
import { machineService } from "@/services/machine-service";
import { MachineResponse, MachineRequest } from "@/types/machine";
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

interface EditMachineDialogProps {
    machine: MachineResponse | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditMachineDialog({
    machine,
    open,
    onClose,
    onSuccess,
}: EditMachineDialogProps) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<MachineRequest>({
        name: "",
        model: "",
        serialNo: "",
        purchaseDate: "",
        lastMaintenance: "",
        nextMaintenance: "",
        status: "OPERATIONAL",
    });

    useEffect(() => {
        if (open && machine) {
            setForm({
                name: machine.name,
                model: machine.model || "",
                serialNo: machine.serialNo || "",
                purchaseDate: machine.purchaseDate || "",
                lastMaintenance: machine.lastMaintenance || "",
                nextMaintenance: machine.nextMaintenance || "",
                status: machine.status,
            });
            setError(null);
        }
    }, [open, machine]);

    const handleSubmit = async () => {
        if (!machine) return;
        if (!form.name.trim()) {
            setError("Machine name is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await machineService.updateMachine(machine.id, {
                name: form.name.trim(),
                model: form.model?.trim() || undefined,
                serialNo: form.serialNo?.trim() || undefined,
                purchaseDate: form.purchaseDate || undefined,
                lastMaintenance: form.lastMaintenance || undefined,
                nextMaintenance: form.nextMaintenance || undefined,
                status: form.status,
            });
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to update machine");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Edit Machine
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Update machine details
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
                            Name <span className="text-error">*</span>
                        </Label>
                        <Input
                            value={form.name}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Model</Label>
                            <Input
                                value={form.model}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, model: e.target.value }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Serial No</Label>
                            <Input
                                value={form.serialNo}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, serialNo: e.target.value }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Status</Label>
                        <Select
                            value={form.status}
                            onValueChange={(v) =>
                                setForm((prev) => ({ ...prev, status: v }))
                            }>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OPERATIONAL">Operational</SelectItem>
                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                <SelectItem value="BREAKDOWN">Breakdown</SelectItem>
                                <SelectItem value="RETIRED">Retired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Purchase Date</Label>
                        <Input
                            type="date"
                            value={form.purchaseDate}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, purchaseDate: e.target.value }))
                            }
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Last Maintenance</Label>
                            <Input
                                type="date"
                                value={form.lastMaintenance}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        lastMaintenance: e.target.value,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Next Maintenance</Label>
                            <Input
                                type="date"
                                value={form.nextMaintenance}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        nextMaintenance: e.target.value,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 border-cream-200"
                        onClick={onClose}
                        disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}