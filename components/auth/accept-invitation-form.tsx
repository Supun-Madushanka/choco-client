"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userService } from "@/services/user-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

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
                <p className="text-muted-foreground text-sm">
                    Validating your invitation...
                </p>
            </div>
        );
    }

    // Invalid token state
    if (error && !formData.fullName) {
        return (
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-error-light rounded-full">
                    <XCircle className="h-8 w-8 text-error" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                    Invalid Invitation
                </h3>
                <p className="text-muted-foreground text-sm">{error}</p>
                <Button asChild className="w-full">
                    <Link href="/login">
                        Back to Login
                    </Link>
                </Button>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                    Registration Complete!
                </h3>
                <p className="text-muted-foreground text-sm">
                    Your account has been created successfully.
                    You can now login with your credentials.
                </p>
                <Button
                    onClick={() => router.push("/login")}
                    className="w-full"
                >
                    Go to Login
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <h2 className="text-md font-semibold text-foreground">
                    Complete Registration
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                    You have been invited to join Ceylon Chocolate Factory
                    Management System. Please complete your registration below.
                </p>
                </div>
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Role Badge */}
                {roleDisplayName && (
                    <div className="bg-background border border-cream-200
                                    rounded-btn px-4 py-3">
                        <p className="text-sm text-secondary-foreground">
                            You are being registered as:
                        </p>
                        <p className="text-sm font-semibold text-secondary-foreground mt-0.5">
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
                    <Label htmlFor="fullName">Full Name
                        <span className="text-error">*</span>
                    </Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                    />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="phone">
                        Phone{" "}
                        <span className="text-text-muted font-normal">
                            (optional)
                        </span>
                    </Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+94 77 123 4567"
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="password">
                        Password <span className="text-error">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
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
                        Confirm Password <span className="text-error">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
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
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Creating account..." : "Complete Registration"}
                </Button>

            </form>
        </>
    );
}