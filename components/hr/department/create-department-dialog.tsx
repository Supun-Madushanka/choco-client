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
import { Plus } from "lucide-react";
import {
    DepartmentRequest,
} from "@/types/department";
import {
    departmentService,
} from "@/services/department-service";

interface CreateDepartmentDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateDepartmentDialog({
    open,
    onClose,
    onSuccess,
}: CreateDepartmentDialogProps) {

    const [formData, setFormData] = useState<DepartmentRequest>({
            name: "",
            description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const reset = () => {
        setFormData({
            name: "",
            description: "",
        });
        setError(null);
        setSuccess(false);
    };

    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open]);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError(
                "Department name is required"
            );
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res =await departmentService.createDepartment(formData);
            if (!res.success) {
                setError(
                    res.message ||
                    "Failed to create department"
                );
                return;
            }
            setSuccess(true);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onClose}
        >
            <DialogContent
                className="sm:max-w-md"
            >
                <DialogHeader>
                    <DialogTitle>
                        Create Department
                    </DialogTitle>
                    <DialogDescription>
                        Add a new department
                        to the organization.
                    </DialogDescription>
                </DialogHeader>
                {success ? (
                    <div
                        className="
                            text-center
                            py-6
                            space-y-4
                        "
                    >
                        <div
                            className="
                                w-14 h-14
                                rounded-full
                                bg-success-light
                                flex
                                items-center
                                justify-center
                                mx-auto
                            "
                        >
                            <Plus
                                className="
                                    text-success
                                "
                            />
                        </div>
                        <p
                            className="
                                font-semibold
                            "
                        >
                            Department Created
                        </p>
                        <div
                            className="
                                flex gap-2
                            "
                        >
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    reset();
                                }}
                            >
                                Create Another
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    reset();
                                    onSuccess();
                                }}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="
                            space-y-4
                        "
                    >
                        {error && (
                            <div
                                className="
                                    bg-red-50
                                    text-red-600
                                    text-sm
                                    rounded-lg
                                    p-3
                                "
                            >
                                {error}
                            </div>
                        )}

                        <div
                            className="
                                space-y-1.5
                            "
                        >
                            <Label>
                                Department Name
                            </Label>
                            <Input
                                value={
                                    formData.name
                                }
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        name:
                                        e.target.value,
                                    });
                                    setError(null);
                                }}
                                placeholder="
                                    e.g.
                                    Human Resources
                                "
                            />
                        </div>
                        <div
                            className="
                                space-y-1.5
                            "
                        >
                            <Label>
                                Description
                            </Label>
                            <Textarea
                                value={
                                    formData.description
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description:
                                        e.target.value,
                                    })
                                }
                                placeholder="
                                    Enter description
                                "
                            />
                        </div>

                        <div
                            className="
                                flex gap-2
                                pt-2
                            "
                        >
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
                                {
                                    loading
                                    ?
                                    "Creating..."
                                    :
                                    "Create"
                                }
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}