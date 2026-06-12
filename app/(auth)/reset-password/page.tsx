import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-chocolate-900 rounded-2xl mb-4">
                        <span className="text-3xl">🍫</span>
                    </div>
                    <h1 className="text-2xl font-bold text-chocolate-900">
                        Ceylon Chocolate Factory
                    </h1>
                    <p className="text-text-muted mt-1 text-sm">
                        Management System
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-card shadow-card p-8">
                    <h2 className="text-xl font-semibold text-text-primary mb-2">
                        Reset Password
                    </h2>
                    <p className="text-text-muted text-sm mb-6">
                        Enter your new password below.
                    </p>
                    <Suspense fallback={
                        <div className="text-center text-text-muted text-sm">
                            Loading...
                        </div>
                    }>
                        <ResetPasswordForm />
                    </Suspense>
                </div>

                {/* Back to login */}
                <p className="text-center text-text-muted text-sm mt-6">
                    Remember your password?{" "}
                    <a
                        href="/login"
                        className="text-gold-500 hover:text-gold-400
                                   font-medium transition-colors">
                        Sign in
                    </a>
                </p>

            </div>
        </main>
    );
}