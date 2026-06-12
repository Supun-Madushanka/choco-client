"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { LoginRequest } from "@/types/auth";

export default function LoginForm() {
    const router = useRouter();
    const { setAuth } = useAuthStore();

    const [formData, setFormData] = useState<LoginRequest>({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Step 1 — Login
            const loginResponse = await authService.login(formData);

            if (!loginResponse.success) {
                setError(loginResponse.message);
                return;
            }

            const { accessToken, refreshToken } = loginResponse.data;

            // Set token first so axios interceptor can use it
            localStorage.setItem("accessToken", accessToken);

            // Step 2 — Get user details
            const meResponse = await authService.getMe();

            // Step 3 — Save to store
            setAuth(meResponse.data, accessToken, refreshToken);

            // Step 4 — Redirect based on role
            const role = loginResponse.data.role;
            redirectByRole(role);

        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: {
                        data?: { message?: string }
                    }
                };
                setError(
                    axiosError.response?.data?.message ||
                    "Invalid email or password"
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const redirectByRole = (role: string) => {
        const dashboards: Record<string, string> = {
            SUPER_ADMIN:           "/dashboard/overview",
            HR_MANAGER:            "/dashboard/hr",
            PRODUCTION_MANAGER:    "/dashboard/production",
            WAREHOUSE_MANAGER:     "/dashboard/warehouse",
            FINANCE_MANAGER:       "/dashboard/finance",
            SALES_MANAGER:         "/dashboard/sales",
            PROCUREMENT_MANAGER:   "/dashboard/procurement",
            QC_MANAGER:            "/dashboard/quality",
            HR_OFFICER:            "/dashboard/hr",
            PRODUCTION_SUPERVISOR: "/dashboard/production",
            PRODUCTION_OPERATOR:   "/dashboard/production",
            WAREHOUSE_SUPERVISOR:  "/dashboard/warehouse",
            WAREHOUSE_STAFF:       "/dashboard/warehouse",
            FINANCE_OFFICER:       "/dashboard/finance",
            SALES_OFFICER:         "/dashboard/sales",
            PROCUREMENT_OFFICER:   "/dashboard/procurement",
            QC_CONTROLLER:         "/dashboard/quality",
        };

        router.push(dashboards[role] || "/dashboard/overview");
    };

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
                    value={formData.email}
                    onChange={handleChange}
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

            {/* Password */}
            <div className="space-y-1.5">
                <label
                    htmlFor="password"
                    className="text-sm font-medium text-text-primary">
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
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

            {/* Forgot Password */}
            <div className="flex justify-end">
                <a
                    href="/forgot-password"
                    className="text-sm text-gold-500 hover:text-gold-400
                               font-medium transition-colors">
                    Forgot password?
                </a>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold-500 hover:bg-gold-400
                           disabled:bg-gold-300 disabled:cursor-not-allowed
                           text-white font-medium py-2.5 px-4
                           rounded-btn transition-all duration-200
                           text-sm shadow-sm">
                {loading ? "Signing in..." : "Sign In"}
            </button>

        </form>
    );
}