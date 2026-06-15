"use client";

import { useState, useEffect } from "react";
import { employeeService } from "@/services/employee-service";
import { departmentService } from "@/services/department-service";
import { userService } from "@/services/user-service";
import {
    CreateEmployeeRequest,
    Gender,
    EmploymentType,
} from "@/types/employee";
import { DepartmentResponse } from "@/types/department";
import { UserResponse } from "@/types/user";
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

interface CreateEmployeeDialogProps {
    onSuccess: () => void;
}

const initialFormData: CreateEmployeeRequest = {
    userId: 0,
    departmentId: 0,
    employeeNo: "",
    fullName: "",
    phone: "",
    nic: "",
    address: "",
    dateOfBirth: "",
    gender: undefined,
    joinedDate: "",
    employmentType: "PERMANENT",
};

export default function CreateEmployeeDialog({
    onSuccess,
}: CreateEmployeeDialogProps) {

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CreateEmployeeRequest>(initialFormData);
    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [unlinkedUsers, setUnlinkedUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [numberLoading, setNumberLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setFormData(initialFormData);
            setError(null);
            await fetchOptions();
        }
    };

    const fetchOptions = async () => {
        setOptionsLoading(true);
        try {
            const [deptRes, userRes] = await Promise.all([
                departmentService.getAllDepartments(),
                userService.getUsersWithoutEmployeeProfile(),
            ]);
            setDepartments(deptRes.data);
            setUnlinkedUsers(userRes.data);
        } catch {
            setError("Failed to load form options");
        } finally {
            setOptionsLoading(false);
        }
    };

    const handleDepartmentChange = async (departmentId: number) => {
        setFormData({ ...formData, departmentId, employeeNo: "" });
        setNumberLoading(true);
        try {
            const response = await employeeService.getNextEmployeeNumber(departmentId);
            setFormData((prev) => ({
                ...prev,
                departmentId,
                employeeNo: response.data,
            }));
        } catch {
            setError("Failed to generate employee number");
        } finally {
            setNumberLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.userId) {
            setError("Please select a user account to link");
            return;
        }
        if (!formData.departmentId) {
            setError("Please select a department");
            return;
        }
        if (!formData.employeeNo.trim()) {
            setError("Employee number is required");
            return;
        }
        if (!formData.fullName.trim()) {
            setError("Full name is required");
            return;
        }
        if (!formData.joinedDate) {
            setError("Joined date is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await employeeService.createEmployee({
                ...formData,
                phone: formData.phone || undefined,
                nic: formData.nic || undefined,
                address: formData.address || undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
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
                    "Failed to create employee"
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
                Add Employee
            </Button>

            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-text-primary">
                        Add New Employee
                    </DialogTitle>
                    <DialogDescription className="text-text-muted">
                        Link a user account and add their HR profile details.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {error && (
                        <div className="bg-error-light border border-error/20
                                        text-error rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Link User Account */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Link User Account
                        </Label>
                        <Select
                            disabled={optionsLoading}
                            onValueChange={(value) => setFormData({
                                ...formData,
                                userId: parseInt(value),
                            })}>
                            <SelectTrigger className="border-cream-200 focus:ring-gold-500">
                                <SelectValue
                                    placeholder={
                                        optionsLoading
                                            ? "Loading users..."
                                            : unlinkedUsers.length === 0
                                            ? "No unlinked users available"
                                            : "Select user account"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {unlinkedUsers.map((user) => (
                                    <SelectItem key={user.userId} value={String(user.userId)}>
                                        {user.fullName} - {user.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-text-muted">
                            Only users without an existing employee profile are shown
                        </p>
                    </div>

                    {/* Department */}
                    <div className="space-y-1.5">
                        <Label className="text-text-primary">
                            Department
                        </Label>
                        <Select
                            disabled={optionsLoading}
                            onValueChange={(value) =>
                                handleDepartmentChange(parseInt(value))
                            }>
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
                                placeholder={numberLoading ? "Generating..." : "e.g. PRD-001"}
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
                                placeholder="Full name"
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
                                placeholder="+94 77 123 4567"
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
                                placeholder="200012345678"
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
                            placeholder="Street, City, Province"
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

                    {/* Joined Date + Employment Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-text-primary">
                                Joined Date
                            </Label>
                            <Input
                                type="date"
                                value={formData.joinedDate}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    joinedDate: e.target.value,
                                })}
                                className="border-cream-200 focus-visible:ring-gold-500"
                            />
                        </div>
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
                            {loading ? "Creating..." : "Add Employee"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}