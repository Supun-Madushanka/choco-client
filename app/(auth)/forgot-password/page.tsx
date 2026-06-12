import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { GiChocolateBar } from "react-icons/gi";

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-xl">
                    <CardHeader>
                        {/* Logo & Title */}
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
                    </CardHeader>

                    <CardContent>
                        <ForgotPasswordForm />
                    </CardContent>
                </Card>

                {/* Back to login */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="text-primary hover:underline"
                    >
                        Sign in
                    </Link>
                </p>

            </div>
        </main>
    );
}