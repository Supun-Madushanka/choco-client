"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { LoginRequest } from "@/types/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GiChocolateBar } from "react-icons/gi";
import { Alert, AlertDescription } from "../ui/alert";

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
         <Card className="w-full max-w-md border-0 shadow-2xl bg-background/95 backdrop-blur">
            <CardContent className="p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl mb-4">
                        <GiChocolateBar className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Ceylon Chocolate
                    </h1>

                    <p className="text-sm text-muted-foreground mt-1">
                        Factory Management System
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Error Message */}
                    {error && (
                        <Alert variant="destructive" className="mb-5 border-destructive bg-destructive/10 text-destructive shadow-sm">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@ceylonchocolate.lk"
                                required
                                className="h-12 pl-10"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        
                        <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="h-12 pl-10 pr-10"
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

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 text-base"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>

                </form>
            </CardContent>
        </Card>
    );
}