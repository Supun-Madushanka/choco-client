"use client";

import { useState } from "react";
import { maintenanceLogService } from "@/services/maintenance-log-service";
import { MaintenanceLogRequest } from "@/types/maintenance-log";
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

interface AddMaintenanceLogDialogProps {
    machineId: number;
    onSuccess: () => void;
}

export default function AddMaintenanceLogDialog({
    machineId,
    onSuccess,
}: AddMaintenanceLogDialogProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<MaintenanceLogRequest>({
        machineId,
        maintenanceType: "",
        description: "",
        maintenanceDate: new Date().toISOString().split("T")[0],
        nextMaintenanceDate: "",
        cost: 0,
    });

    const resetForm = () => {
        setForm({
            machineId,
            maintenanceType: "",
            description: "",
            maintenanceDate: new Date().toISOString().split("T")[0],
            nextMaintenanceDate: "",
            cost: 0,
        });
        setError(null);
    };

    const handleSubmit = async () => {
        if (!form.maintenanceType) {
            setError("Maintenance type is required");
            return;
        }
        if (!form.description.trim()) {
            setError("Description is required");
            return;
        }
        if (!form.maintenanceDate) {
            setError("Maintenance date is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await maintenanceLogService.createLog({
                machineId,
                maintenanceType: form.maintenanceType,
                description: form.description.trim(),
                maintenanceDate: form.maintenanceDate,
                nextMaintenanceDate: form.nextMaintenanceDate || undefined,
                cost: form.cost || 0,
            });
            setOpen(false);
            resetForm();
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(axiosError.response?.data?.message || "Failed to create log");
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
            resetForm();
        }}>
            <Button
                size="sm"
                onClick={() => setOpen(true)}
                className="bg-gold-500 hover:bg-gold-400 text-white gap-2">
                <Plus size={14} />
                Add Log
            </Button>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Add Maintenance Log
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Record a maintenance activity for this machine
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
                            Maintenance Type <span className="text-error">*</span>
                        </Label>
                        <Select
                            value={form.maintenanceType}
                            onValueChange={(v) =>
                                setForm((prev) => ({ ...prev, maintenanceType: v }))
                            }>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                                <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                                <SelectItem value="EMERGENCY">Emergency</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Description <span className="text-error">*</span>
                        </Label>
                        <Textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="Describe the maintenance activity..."
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Maintenance Date <span className="text-error">*</span>
                            </Label>
                            <Input
                                type="date"
                                value={form.maintenanceDate}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        maintenanceDate: e.target.value,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">Next Maintenance Date</Label>
                            <Input
                                type="date"
                                value={form.nextMaintenanceDate}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        nextMaintenanceDate: e.target.value,
                                    }))
                                }
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-text-primary">Cost (LKR)</Label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.cost || ""}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    cost: parseFloat(e.target.value) || 0,
                                }))
                            }
                            placeholder="0.00"
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 border-cream-200"
                        onClick={() => {
                            setOpen(false);
                            resetForm();
                        }}
                        disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-gold-500 hover:bg-gold-400 text-white">
                        {loading ? "Saving..." : "Save Log"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}