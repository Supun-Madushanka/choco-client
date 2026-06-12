"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth-service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token.");
        }
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await authService.resetPassword(
                token,
                formData.newPassword,
                formData.confirmPassword
            );
            setSuccess(true);

        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: {
                        data?: { message?: string }
                    }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Something went wrong. Please try again."
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Success state
    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                    Password Reset Successfully!
                </h3>
                <p className="text-muted-foreground text-sm">
                    Your password has been updated.
                    You can now login with your new password.
                </p>
                <Button
                    onClick={() => router.push("/login")}
                    className="w-full">
                    Back to Login
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <h2 className="text-md font-semibold text-foreground">
                    Reset Password
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                    Enter your new password below
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Error Message */}
                {error && (
                    <div className="bg-error-light border border-error
                                    text-error rounded-btn px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                {/* New Password */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="newPassword">
                        New Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Min. 8 characters"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPassword ? (
                                <EyeOff size={18} />
                                    ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="confirmPassword">
                        Confirm Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter new password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(
                                !showConfirmPassword
                            )}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showConfirmPassword ? (
                                <EyeOff size={18} />
                                    ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={loading || !token}
                    className="w-full">
                    {loading ? "Resetting..." : "Reset Password"}
                </Button>

            </form>
        </>
    );
}