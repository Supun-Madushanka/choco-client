"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth-service";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { User, KeyRound, LogOut, ChevronDown, Menu } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function Navbar() {

    const router = useRouter();
    const { user, clearAuth } = useAuthStore();
    const [loggingOut, setLoggingOut] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await authService.logout();
        } catch {
            // clear anyway
        } finally {
            clearAuth();
            router.push("/login");
        }
    };

    return (
        <header className="fixed top-0 left-0 md:left-65 right-0
                           h-16 bg-white border-b border-cream-200
                           flex items-center justify-between px-4 md:px-6 z-30">

            {/* Left */}
            <div className="flex items-center gap-3">

                {/* Mobile hamburger */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-foreground">
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-65 max-w-65">
                        <VisuallyHidden>
                            <SheetTitle>Navigation Menu</SheetTitle>
                        </VisuallyHidden>
                        <Sidebar onClose={() => setMobileOpen(false)} />
                    </SheetContent>
                </Sheet>

                <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full hidden md:block" />
                    <h1 className="text-sm md:text-base font-semibold text-foreground">
                        Ceylon Chocolate Factory
                    </h1>
                </div>
            </div>

            {/* Right */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 md:gap-3 px-2 md:px-3 h-10">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-chocolate-900 text-white text-sm font-semibold">
                                {user?.fullName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-medium text-foreground leading-tight">
                                {user?.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground leading-tight">
                                {user?.roleDisplayName}
                            </p>
                        </div>
                        <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="pb-2">
                        <p className="text-sm font-medium text-foreground truncate">
                            {user?.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground font-normal truncate mt-0.5">
                            {user?.email}
                        </p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => router.push("/dashboard/profile")}
                        className="gap-3 cursor-pointer">
                        <User size={15} className="text-text-muted" />
                        <span>My Profile</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => router.push("/dashboard/change-password")}
                        className="gap-3 cursor-pointer">
                        <KeyRound size={15} className="text-text-muted" />
                        <span>Change Password</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="gap-3 cursor-pointer text-error focus:text-error focus:bg-error-light">
                        <LogOut size={15} />
                        <span>{loggingOut ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

        </header>
    );
}