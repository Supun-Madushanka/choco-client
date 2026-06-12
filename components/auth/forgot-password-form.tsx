"use client";

import { useState } from "react";
import { authService } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordForm() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authService.forgotPassword(email);
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
                <div className="text-5xl">📧</div>

                <h3 className="text-lg font-semibold">
                    Check your email!
                </h3>

                <p className="text-sm text-muted-foreground">
                    If your email is registered, you will receive a password
                    reset link shortly.
                </p>

                <Button asChild className="w-full">
                    <Link href="/login">
                    Back to Login
                    </Link>
                </Button>
            </div>
            );
        }

    return (
        <>
            <div className="mb-6">
                <h2 className="text-ml font-semibold text-foreground">
                Forgot Password
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                Enter your email address and we'll send you a link to
                reset your password.
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

                {/* Email */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="email"
                    >
                        Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError(null);
                        }}
                        placeholder="you@ceylonchocolate.lk"
                        required
                    />
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </Button>

            </form>
        </>
    );
}