"use client";

import { useState, useEffect } from "react";
import { employeeService } from "@/services/employee-service";
import { departmentService } from "@/services/department-service";
import {
    UpdateEmployeeRequest,
    EmployeeResponse,
    Gender,
    EmploymentType,
} from "@/types/employee";
import { DepartmentResponse } from "@/types/department";
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

interface EditEmployeeDialogProps {
    employee: EmployeeResponse | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditEmployeeDialog({
    employee,
    open,
    onClose,
    onSuccess,
}: EditEmployeeDialogProps) {

    const [formData, setFormData] = useState<UpdateEmployeeRequest>({
        departmentId: 0,
        employeeNo: "",
        fullName: "",
        phone: "",
        nic: "",
        address: "",
        dateOfBirth: "",
        gender: undefined,
        employmentType: "PERMANENT",
    });
    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (employee) {
            setFormData({
                departmentId: employee.departmentId,
                employeeNo: employee.employeeNo,
                fullName: employee.fullName,
                phone: employee.phone || "",
                nic: employee.nic || "",
                address: employee.address || "",
                dateOfBirth: employee.dateOfBirth || "",
                gender: employee.gender || undefined,
                employmentType: employee.employmentType,
            });
            setError(null);
            fetchDepartments();
        }
    }, [employee]);

    const fetchDepartments = async () => {
        setOptionsLoading(true);
        try {
            const response = await departmentService.getAllDepartments();
            setDepartments(response.data);
        } catch {
            setError("Failed to load departments");
        } finally {
            setOptionsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!employee) return;

        if (!formData.employeeNo.trim()) {
            setError("Employee number is required");
            return;
        }
        if (!formData.fullName.trim()) {
            setError("Full name is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await employeeService.updateEmployee(employee.id, {
                ...formData,
                phone: formData.phone || undefined,
                nic: formData.nic || undefined,
                address: formData.address || undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
            });
            onSuccess();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Failed to update employee"
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
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Edit Employee
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Update {employee?.fullName}&apos;s profile details.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Linked account info */}
                    <div className="bg-cream-50 border border-cream-200
                                    rounded-lg px-4 py-3">
                        <p className="text-xs text-text-muted">
                            Linked Account
                        </p>
                        <p className="text-sm font-medium text-text-primary mt-0.5">
                            {employee?.userEmail || "No account linked"}
                        </p>
                    </div>

                    {/* Department */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Department
                        </Label>
                        <Select
                            disabled={optionsLoading}
                            value={String(formData.departmentId)}
                            onValueChange={(value) => setFormData({
                                ...formData,
                                departmentId: parseInt(value),
                            })}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={String(dept.id)}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-text-muted">
                            Changing department may require updating the employee number
                        </p>
                    </div>

                    {/* Employee No + Full Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Employee No
                            </Label>
                            <Input
                                value={formData.employeeNo}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    employeeNo: e.target.value,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500 font-mono"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Full Name
                            </Label>
                            <Input
                                value={formData.fullName}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    fullName: e.target.value,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    {/* Phone + NIC */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Phone
                            </Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                NIC
                            </Label>
                            <Input
                                value={formData.nic}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    nic: e.target.value,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Address
                        </Label>
                        <Textarea
                            value={formData.address}
                            onChange={(e) => setFormData({
                                ...formData,
                                address: e.target.value,
                            })}
                            className="border-cream-200 focus-visible:ring-gold-500 resize-none"
                            rows={2}
                        />
                    </div>

                    {/* DOB + Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Date of Birth
                            </Label>
                            <Input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    dateOfBirth: e.target.value,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Gender
                            </Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(value) => setFormData({
                                    ...formData,
                                    gender: value as Gender,
                                })}>
                                <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Employment Type */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Employment Type
                        </Label>
                        <Select
                            value={formData.employmentType}
                            onValueChange={(value) => setFormData({
                                ...formData,
                                employmentType: value as EmploymentType,
                            })}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PERMANENT">Permanent</SelectItem>
                                <SelectItem value="CONTRACT">Contract</SelectItem>
                                <SelectItem value="PROBATION">Probation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Actions */}
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