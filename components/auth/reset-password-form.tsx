"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth-service";

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
                <div className="inline-flex items-center justify-center
                                w-16 h-16 bg-success-light rounded-full">
                    <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                    Password Reset Successfully!
                </h3>
                <p className="text-text-muted text-sm">
                    Your password has been updated.
                    You can now login with your new password.
                </p>
                <button
                    onClick={() => router.push("/login")}
                    className="w-full bg-gold-500 hover:bg-gold-400
                               text-white font-medium py-2.5 px-4
                               rounded-btn transition-all duration-200
                               text-sm shadow-sm">
                    Back to Login
                </button>
            </div>
        );
    }

    return (
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
                <label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-text-primary">
                    New Password
                </label>
                <div className="relative">
                    <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Min. 8 characters"
                        required
                        className="w-full px-4 py-2.5 rounded-btn border
                                   border-cream-200 bg-white text-text-primary
                                   placeholder:text-text-muted text-sm
                                   focus:outline-none focus:ring-2
                                   focus:ring-gold-500 focus:border-transparent
                                   transition-all duration-200 pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-text-muted hover:text-text-primary
                                   transition-colors">
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
                <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-text-primary">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter new password"
                        required
                        className="w-full px-4 py-2.5 rounded-btn border
                                   border-cream-200 bg-white text-text-primary
                                   placeholder:text-text-muted text-sm
                                   focus:outline-none focus:ring-2
                                   focus:ring-gold-500 focus:border-transparent
                                   transition-all duration-200 pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(
                            !showConfirmPassword
                        )}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-text-muted hover:text-text-primary
                                   transition-colors">
                        {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-gold-500 hover:bg-gold-400
                           disabled:bg-gold-300 disabled:cursor-not-allowed
                           text-white font-medium py-2.5 px-4
                           rounded-btn transition-all duration-200
                           text-sm shadow-sm">
                {loading ? "Resetting..." : "Reset Password"}
            </button>

        </form>
    );
}