"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DepartmentRequest, DepartmentResponse } from "@/types/department";
import { departmentService } from "@/services/department-service";

interface EditDepartmentDialogProps {
    open: boolean;
    department: DepartmentResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditDepartmentDialog({
    open,
    department,
    onClose,
    onSuccess,
}: EditDepartmentDialogProps) {

    const [formData, setFormData] = useState<DepartmentRequest>({
        name: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // fill form when dialog opens
    useEffect(() => {
        if (department && open) {
            setFormData({
                name: department.name,
                description: department.description,
            });
            setError(null);
        }
    }, [department, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!department) return;
        if (!formData.name.trim()) {
            setError("Department name is required");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const res = await departmentService.updateDepartment(
                department.id,
                formData
            );
            if (!res.success) {
                setError(res.message || "Update failed");
                return;
            }
            onSuccess();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">

                <DialogHeader>
                    <DialogTitle>Edit Department</DialogTitle>
                    <DialogDescription>
                        Update department details
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label>Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Description</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}