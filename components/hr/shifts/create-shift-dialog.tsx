"use client";

import { useState } from "react";
import { shiftService } from "@/services/shift-service";
import { ShiftRequest, ShiftType } from "@/types/shift";
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
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface CreateShiftDialogProps {
    onSuccess: () => void;
}

const initialFormData: ShiftRequest = {
    name: "",
    startTime: "08:00",
    endTime: "17:00",
    type: "FIXED",
    description: "",
    isActive: true,
};

export default function CreateShiftDialog({
    onSuccess,
}: CreateShiftDialogProps) {

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<ShiftRequest>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setFormData(initialFormData);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError("Shift name is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Append seconds for backend LocalTime
            await shiftService.createShift({
                ...formData,
                startTime: `${formData.startTime}:00`,
                endTime: `${formData.endTime}:00`,
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
                    "Failed to create shift"
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
                Create Shift
            </Button>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Create Shift
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Add a new work shift for employees.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Shift Name
                        </Label>
                        <Input
                            placeholder="e.g. Morning Shift"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                setError(null);
                            }}
                            className="border-cream-200 focus-visible:ring-gold-500"
                        />
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Start Time
                            </Label>
                            <Input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    startTime: e.target.value,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                End Time
                            </Label>
                            <Input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    endTime: e.target.value,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    {/* Type */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Shift Type
                        </Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({
                                ...formData,
                                type: value as ShiftType,
                            })}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FIXED">Fixed</SelectItem>
                                <SelectItem value="FLEXIBLE">Flexible</SelectItem>
                                <SelectItem value="ROTATING">Rotating</SelectItem>
                            </SelectContent>
                        </Select>
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
                            placeholder="Brief description of this shift..."
                            value={formData.description}
                            onChange={(e) => setFormData({
                                ...formData,
                                description: e.target.value,
                            })}
                            className="border-cream-200 focus-visible:ring-gold-500
                                       resize-none"
                            rows={2}
                        />
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center justify-between
                                    rounded-lg border border-cream-200 px-4 py-3">
                        <div>
                            <Label className="text-text-primary">
                                Active Shift
                            </Label>
                            <p className="text-xs text-text-muted mt-0.5">
                                Inactive shifts can&apos;t be assigned to employees
                            </p>
                        </div>
                        <Switch
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({
                                ...formData,
                                isActive: checked,
                            })}
                        />
                    </div>

                    {/* Actions */}
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
                            {loading ? "Creating..." : "Create Shift"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}