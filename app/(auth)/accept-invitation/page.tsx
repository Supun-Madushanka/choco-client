import { Suspense } from "react";
import AcceptInvitationForm from "@/components/auth/accept-invitation-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { GiChocolateBar } from "react-icons/gi";

export default function AcceptInvitationPage() {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <Card>
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
                        <Suspense fallback={
                            <div className="text-center text-text-muted text-sm">
                                Loading...
                            </div>
                        }>
                            <AcceptInvitationForm />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}