import { Suspense } from "react";
import AcceptInvitationForm from "@/components/auth/accept-invitation-form";

export default function AcceptInvitationPage() {
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
                        Complete Registration
                    </h2>
                    <p className="text-text-muted text-sm mb-6">
                        You have been invited to join Ceylon Chocolate
                        Factory Management System. Please complete
                        your registration below.
                    </p>
                    <Suspense fallback={
                        <div className="text-center text-text-muted text-sm">
                            Loading...
                        </div>
                    }>
                        <AcceptInvitationForm />
                    </Suspense>
                </div>

            </div>
        </main>
    );
}