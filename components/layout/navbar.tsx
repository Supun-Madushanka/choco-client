"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth-service";

export default function Navbar() {

    const router = useRouter();
    const { user, clearAuth } = useAuthStore();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await authService.logout();
        } catch {
            // Even if logout API fails, clear local state
        } finally {
            clearAuth();
            router.push("/login");
        }
    };

    return (
        <header className="fixed top-0 left-[260px] right-0 h-16
                           bg-white border-b border-cream-200
                           flex items-center justify-between
                           px-6 z-30">

            {/* Left — Page will inject title here later */}
            <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gold-500 rounded-full"/>
                <h1 className="text-base font-semibold text-text-primary">
                    Ceylon Chocolate Factory
                </h1>
            </div>

            {/* Right — User menu */}
            <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 hover:bg-cream-50
                               px-3 py-2 rounded-btn transition-colors">

                    {/* Avatar */}
                    <div className="w-8 h-8 bg-chocolate-900 rounded-full
                                    flex items-center justify-center
                                    text-white text-sm font-semibold">
                        {user?.fullName?.charAt(0).toUpperCase()}
                    </div>

                    {/* Name & Role */}
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-medium text-text-primary
                                      leading-tight">
                            {user?.fullName}
                        </p>
                        <p className="text-xs text-text-muted leading-tight">
                            {user?.roleDisplayName}
                        </p>
                    </div>

                    {/* Chevron */}
                    <span className={`text-text-muted text-xs transition-transform
                                     duration-200
                                     ${dropdownOpen ? "rotate-180" : ""}`}>
                        ▼
                    </span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setDropdownOpen(false)}
                        />

                        {/* Menu */}
                        <div className="absolute right-0 top-full mt-2
                                        w-48 bg-white rounded-card
                                        shadow-card border border-cream-200
                                        z-20 overflow-hidden">

                            {/* User info */}
                            <div className="px-4 py-3 border-b border-cream-200">
                                <p className="text-sm font-medium
                                              text-text-primary truncate">
                                    {user?.fullName}
                                </p>
                                <p className="text-xs text-text-muted truncate">
                                    {user?.email}
                                </p>
                            </div>

                            {/* Menu items */}
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        router.push("/dashboard/profile");
                                    }}
                                    className="w-full flex items-center gap-3
                                               px-4 py-2.5 text-sm
                                               text-text-primary
                                               hover:bg-cream-50
                                               transition-colors">
                                    <span>👤</span>
                                    <span>My Profile</span>
                                </button>

                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        router.push(
                                            "/dashboard/change-password"
                                        );
                                    }}
                                    className="w-full flex items-center gap-3
                                               px-4 py-2.5 text-sm
                                               text-text-primary
                                               hover:bg-cream-50
                                               transition-colors">
                                    <span>🔐</span>
                                    <span>Change Password</span>
                                </button>

                                <div className="border-t border-cream-200 mt-1 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="w-full flex items-center
                                                   gap-3 px-4 py-2.5 text-sm
                                                   text-error
                                                   hover:bg-error-light
                                                   transition-colors
                                                   disabled:opacity-50">
                                        <span>🚪</span>
                                        <span>
                                            {loggingOut
                                                ? "Logging out..."
                                                : "Logout"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}