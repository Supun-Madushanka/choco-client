"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth-service";
import PageHeader from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Mail,
    Phone,
    Shield,
    Clock,
    Calendar,
    Pencil,
    X,
    Check,
} from "lucide-react";
import { format } from "date-fns";

export default function ProfilePage() {

    const { user, updateUser } = useAuthStore();

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        phone: user?.phone || "",
    });

    const handleEdit = () => {
        setFormData({
            fullName: user?.fullName || "",
            phone: user?.phone || "",
        });
        setEditing(true);
        setError(null);
        setSuccess(false);
    };

    const handleCancel = () => {
        setEditing(false);
        setError(null);
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await authService.updateProfile(
                formData.fullName,
                formData.phone
            );

            // Update store with new user data
            updateUser(response.data);
            setEditing(false);
            setSuccess(true);

            setTimeout(() => setSuccess(false), 3000);

        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Failed to update profile"
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadgeClass = (level: string) => {
        switch (level) {
            case "TOP":
                return "bg-purple-50 text-purple-700 border-purple-200";
            case "MANAGER":
                return "bg-blue-50 text-blue-700 border-blue-200";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    return (
        <div>
            <PageHeader
                title="My Profile"
                description="View and manage your profile information"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left — Profile Card */}
                <Card className="border-cream-200 shadow-card lg:col-span-1 h-fit">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">

                            {/* Avatar */}
                            <Avatar className="w-20 h-20 mb-4">
                                <AvatarFallback className="bg-chocolate-900
                                                            text-white text-2xl
                                                            font-bold">
                                    {user?.fullName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            {/* Name */}
                            <h2 className="text-lg font-bold text-text-primary">
                                {user?.fullName}
                            </h2>

                            {/* Role Badge */}
                            <Badge
                                variant="outline"
                                className={`mt-2 text-xs ${getRoleBadgeClass(user?.roleLevel || "")}`}>
                                <Shield size={10} className="mr-1" />
                                {user?.roleDisplayName}
                            </Badge>

                            {/* Status */}
                            <Badge
                                variant="outline"
                                className="mt-2 text-xs bg-success-light
                                           text-success border-success/20">
                                Active
                            </Badge>

                            <Separator className="my-4 w-full" />

                            {/* Info Items */}
                            <div className="w-full space-y-3 text-left">
                                <div className="flex items-center gap-3">
                                    <Mail size={15} className="text-text-muted shrink-0" />
                                    <p className="text-sm text-text-secondary truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={15} className="text-text-muted shrink-0" />
                                    <p className="text-sm text-text-secondary">
                                        {user?.phone || "Not provided"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar size={15} className="text-text-muted shrink-0" />
                                    <p className="text-sm text-text-secondary">
                                        {user?.createdAt
                                            ? format(new Date(user.createdAt), "dd MMM yyyy")
                                            : "—"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock size={15} className="text-text-muted shrink-0" />
                                    <p className="text-sm text-text-secondary">
                                        {user?.lastLoginAt
                                            ? format(new Date(user.lastLoginAt), "dd MMM yyyy, HH:mm")
                                            : "Never"}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Right — Edit Form */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Personal Information */}
                    <Card className="border-cream-200 shadow-card">
                        <CardHeader className="pb-3 border-b border-cream-200">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold text-text-primary">
                                    Personal Information
                                </CardTitle>
                                {!editing ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEdit}
                                        className="gap-2 border-cream-200
                                                   text-text-secondary
                                                   hover:text-text-primary">
                                        <Pencil size={14} />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCancel}
                                            disabled={loading}
                                            className="gap-2 border-cream-200">
                                            <X size={14} />
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="gap-2 bg-gold-500
                                                       hover:bg-gold-400 text-white">
                                            <Check size={14} />
                                            {loading ? "Saving..." : "Save"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">

                            {/* Error */}
                            {error && (
                                <div className="bg-error-light border border-error/20
                                                text-error rounded-lg px-4 py-3 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Success */}
                            {success && (
                                <div className="bg-success-light border border-success/20
                                                text-success rounded-lg px-4 py-3 text-sm">
                                    Profile updated successfully!
                                </div>
                            )}

                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <Label className="text-text-primary">
                                    Full Name
                                </Label>
                                {editing ? (
                                    <Input
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            fullName: e.target.value,
                                        })}
                                        className="border-cream-200
                                                   focus-visible:ring-gold-500"
                                    />
                                ) : (
                                    <p className="text-sm text-text-primary
                                                  py-2">
                                        {user?.fullName}
                                    </p>
                                )}
                            </div>

                            {/* Email — always read only */}
                            <div className="space-y-1.5">
                                <Label className="text-text-primary">
                                    Email Address
                                </Label>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-text-secondary py-2">
                                        {user?.email}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className="text-xs text-text-muted
                                                   border-cream-200">
                                        Cannot change
                                    </Badge>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <Label className="text-text-primary">
                                    Phone Number
                                </Label>
                                {editing ? (
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })}
                                        placeholder="+94 77 123 4567"
                                        className="border-cream-200
                                                   focus-visible:ring-gold-500"
                                    />
                                ) : (
                                    <p className="text-sm text-text-primary py-2">
                                        {user?.phone || (
                                            <span className="text-text-muted">
                                                Not provided
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>

                        </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card className="border-cream-200 shadow-card">
                        <CardHeader className="pb-3 border-b border-cream-200">
                            <CardTitle className="text-base font-semibold text-text-primary">
                                Account Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div className="space-y-1">
                                    <p className="text-xs text-text-muted">Role</p>
                                    <p className="text-sm font-medium text-text-primary">
                                        {user?.roleDisplayName}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-text-muted">Level</p>
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${getRoleBadgeClass(user?.roleLevel || "")}`}>
                                        {user?.roleLevel}
                                    </Badge>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-text-muted">Status</p>
                                    <Badge
                                        variant="outline"
                                        className="text-xs bg-success-light
                                                   text-success border-success/20">
                                        Active
                                    </Badge>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-text-muted">Member Since</p>
                                    <p className="text-sm font-medium text-text-primary">
                                        {user?.createdAt
                                            ? format(new Date(user.createdAt), "dd MMM yyyy")
                                            : "—"}
                                    </p>
                                </div>

                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}