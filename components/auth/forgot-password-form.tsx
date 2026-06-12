"use client";

import { useState } from "react";
import { authService } from "@/services/auth-service";

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
                <div className="inline-flex items-center justify-center
                                w-16 h-16 bg-success-light rounded-full">
                    <span className="text-3xl">📧</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                    Check your email!
                </h3>
                <p className="text-text-muted text-sm">
                    If your email is registered you will receive
                    a password reset link shortly.
                </p>
                <a
                    href="/login"
                    className="inline-block w-full bg-gold-500
                               hover:bg-gold-400 text-white font-medium
                               py-2.5 px-4 rounded-btn transition-all
                               duration-200 text-sm text-center mt-4">
                    Back to Login
                </a>
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

            {/* Email */}
            <div className="space-y-1.5">
                <label
                    htmlFor="email"
                    className="text-sm font-medium text-text-primary">
                    Email Address
                </label>
                <input
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
                    className="w-full px-4 py-2.5 rounded-btn border
                               border-cream-200 bg-white text-text-primary
                               placeholder:text-text-muted text-sm
                               focus:outline-none focus:ring-2
                               focus:ring-gold-500 focus:border-transparent
                               transition-all duration-200"
                />
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
                {loading ? "Sending..." : "Send Reset Link"}
            </button>

        </form>
    );
}