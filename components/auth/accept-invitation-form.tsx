"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userService } from "@/services/user-service";

export default function AcceptInvitationForm() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [roleDisplayName, setRoleDisplayName] = useState<string>("");
    const [formData, setFormData] = useState({
        fullName: "",
        password: "",
        confirmPassword: "",
        phone: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Validate token on mount
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setError("Invalid or missing invitation token.");
                setValidating(false);
                return;
            }

            try {
                const response = await userService.validateInvitationToken(token);
                setRoleDisplayName(response.data.roleDisplayName);
            } catch {
                setError("This invitation link is invalid or has expired.");
            } finally {
                setValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError("Invalid or missing invitation token.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await userService.acceptInvitation({
                token,
                fullName: formData.fullName,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                phone: formData.phone || undefined,
            });

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

    // Loading state
    if (validating) {
        return (
            <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4
                                border-gold-500 border-t-transparent
                                rounded-full animate-spin mb-4">
                </div>
                <p className="text-text-muted text-sm">
                    Validating your invitation...
                </p>
            </div>
        );
    }

    // Invalid token state
    if (error && !formData.fullName) {
        return (
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center
                                w-16 h-16 bg-error-light rounded-full">
                    <span className="text-3xl">❌</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                    Invalid Invitation
                </h3>
                <p className="text-text-muted text-sm">{error}</p>
                <a
                    href="/login"
                    className="inline-block w-full bg-gold-500
                               hover:bg-gold-400 text-white font-medium
                               py-2.5 px-4 rounded-btn transition-all
                               duration-200 text-sm text-center">
                    Back to Login
                </a>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center
                                w-16 h-16 bg-success-light rounded-full">
                    <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                    Registration Complete!
                </h3>
                <p className="text-text-muted text-sm">
                    Your account has been created successfully.
                    You can now login with your credentials.
                </p>
                <button
                    onClick={() => router.push("/login")}
                    className="w-full bg-gold-500 hover:bg-gold-400
                               text-white font-medium py-2.5 px-4
                               rounded-btn transition-all duration-200
                               text-sm shadow-sm">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Role Badge */}
            {roleDisplayName && (
                <div className="bg-cream-100 border border-cream-200
                                rounded-btn px-4 py-3">
                    <p className="text-sm text-text-secondary">
                        You are being registered as:
                    </p>
                    <p className="text-sm font-semibold text-chocolate-900 mt-0.5">
                        {roleDisplayName}
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-error-light border border-error
                                text-error rounded-btn px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
                <label
                    htmlFor="fullName"
                    className="text-sm font-medium text-text-primary">
                    Full Name <span className="text-error">*</span>
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-2.5 rounded-btn border
                               border-cream-200 bg-white text-text-primary
                               placeholder:text-text-muted text-sm
                               focus:outline-none focus:ring-2
                               focus:ring-gold-500 focus:border-transparent
                               transition-all duration-200"
                />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
                <label
                    htmlFor="phone"
                    className="text-sm font-medium text-text-primary">
                    Phone{" "}
                    <span className="text-text-muted font-normal">
                        (optional)
                    </span>
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    className="w-full px-4 py-2.5 rounded-btn border
                               border-cream-200 bg-white text-text-primary
                               placeholder:text-text-muted text-sm
                               focus:outline-none focus:ring-2
                               focus:ring-gold-500 focus:border-transparent
                               transition-all duration-200"
                />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <label
                    htmlFor="password"
                    className="text-sm font-medium text-text-primary">
                    Password <span className="text-error">*</span>
                </label>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
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
                    Confirm Password <span className="text-error">*</span>
                </label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
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
                disabled={loading}
                className="w-full bg-gold-500 hover:bg-gold-400
                           disabled:bg-gold-300 disabled:cursor-not-allowed
                           text-white font-medium py-2.5 px-4
                           rounded-btn transition-all duration-200
                           text-sm shadow-sm">
                {loading ? "Creating account..." : "Complete Registration"}
            </button>

        </form>
    );
}