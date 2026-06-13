"use client";

import { useState } from "react";
import { authService } from "@/services/auth-service";
import PageHeader from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Eye, EyeOff, Check } from "lucide-react";

export default function ChangePasswordPage() {

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("New password must be at least 8 characters.");
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError("New password must be different from current password.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await authService.changePassword(
                formData.currentPassword,
                formData.newPassword,
                formData.confirmPassword
            );

            setSuccess(true);
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setTimeout(() => setSuccess(false), 4000);

        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: { data?: { message?: string } }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Failed to change password"
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        {
            id: "currentPassword",
            label: "Current Password",
            showKey: "current" as const,
            placeholder: "Enter current password",
        },
        {
            id: "newPassword",
            label: "New Password",
            showKey: "new" as const,
            placeholder: "Min. 8 characters",
        },
        {
            id: "confirmPassword",
            label: "Confirm New Password",
            showKey: "confirm" as const,
            placeholder: "Re-enter new password",
        },
    ];

    return (
        <div>
            <PageHeader
                title="Change Password"
                description="Update your account password"
            />

            <div className="max-w-md mx-auto mt-6">
                <Card className="border-cream-200 shadow-card">
                    <CardHeader className="pb-3 border-b border-cream-200">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gold-500/10 rounded-lg
                                            flex items-center justify-center">
                                <KeyRound size={18} className="text-gold-500" />
                            </div>
                            <CardTitle className="text-base font-semibold
                                                   text-text-primary">
                                Update Password
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5">
                        <form onSubmit={handleSubmit} className="space-y-4">

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
                                                text-success rounded-lg px-4 py-3 text-sm
                                                flex items-center gap-2">
                                    <Check size={15} />
                                    Password changed successfully!
                                </div>
                            )}

                            {/* Fields */}
                            {fields.map((field) => (
                                <div key={field.id} className="space-y-1.5">
                                    <Label className="text-text-primary">
                                        {field.label}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id={field.id}
                                            name={field.id}
                                            type={show[field.showKey] ? "text" : "password"}
                                            value={formData[field.id as keyof typeof formData]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            required
                                            className="border-cream-200
                                                       focus-visible:ring-gold-500 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShow({
                                                ...show,
                                                [field.showKey]: !show[field.showKey],
                                            })}
                                            className="absolute right-3 top-1/2
                                                       -translate-y-1/2 text-text-muted
                                                       hover:text-text-primary transition-colors">
                                            {show[field.showKey]
                                                ? <EyeOff size={15} />
                                                : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Password requirements */}
                            <div className="bg-cream-50 rounded-lg px-4 py-3
                                            border border-cream-200">
                                <p className="text-xs text-text-muted font-medium mb-1">
                                    Password requirements:
                                </p>
                                <ul className="text-xs text-text-muted space-y-0.5">
                                    <li className={`flex items-center gap-1.5 ${
                                        formData.newPassword.length >= 8
                                            ? "text-success"
                                            : ""
                                    }`}>
                                        <Check size={11} />
                                        At least 8 characters
                                    </li>
                                    <li className={`flex items-center gap-1.5 ${
                                        formData.newPassword !== formData.currentPassword &&
                                        formData.newPassword.length > 0
                                            ? "text-success"
                                            : ""
                                    }`}>
                                        <Check size={11} />
                                        Different from current password
                                    </li>
                                    <li className={`flex items-center gap-1.5 ${
                                        formData.newPassword === formData.confirmPassword &&
                                        formData.confirmPassword.length > 0
                                            ? "text-success"
                                            : ""
                                    }`}>
                                        <Check size={11} />
                                        Passwords match
                                    </li>
                                </ul>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gold-500 hover:bg-gold-400
                                           text-white">
                                {loading ? "Changing..." : "Change Password"}
                            </Button>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}