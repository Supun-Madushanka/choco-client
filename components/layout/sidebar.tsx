"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { getNavItemsForRole } from "@/components/layout/navigation";

export default function Sidebar() {

    const pathname = usePathname();
    const { user } = useAuthStore();

    const navGroups = getNavItemsForRole(user?.role || "");

    return (
        <aside className="fixed top-0 left-0 h-screen w-[260px]
                          bg-chocolate-900 flex flex-col z-40">

            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5
                            border-b border-chocolate-800">
                <div className="w-9 h-9 bg-gold-500 rounded-lg
                                flex items-center justify-center
                                text-lg flex-shrink-0">
                    🍫
                </div>
                <div>
                    <p className="text-white font-semibold text-sm leading-tight">
                        Ceylon Chocolate
                    </p>
                    <p className="text-cream-200 text-xs leading-tight">
                        Factory
                    </p>
                </div>
            </div>

            {/* User Info */}
            <div className="px-6 py-4 border-b border-chocolate-800">
                <p className="text-white text-sm font-medium truncate">
                    {user?.fullName}
                </p>
                <p className="text-cream-200 text-xs mt-0.5 truncate">
                    {user?.roleDisplayName}
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                {navGroups.map((group) => (
                    <div key={group.group} className="mb-6">

                        {/* Group Label */}
                        <p className="text-xs font-semibold uppercase
                                      tracking-wider text-cream-200
                                      px-3 mb-2">
                            {group.group}
                        </p>

                        {/* Items */}
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = pathname
                                    .startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3
                                                   px-3 py-2.5 rounded-btn
                                                   text-sm transition-all
                                                   duration-200 group
                                                   ${isActive
                                                ? "bg-gold-500 text-white font-medium"
                                                : "text-cream-200 hover:bg-chocolate-800 hover:text-white"
                                            }`}>
                                        <span className="text-base">
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>

                                        {/* Active indicator */}
                                        {isActive && (
                                            <span className="ml-auto w-1.5
                                                            h-1.5 rounded-full
                                                            bg-white">
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom — Version */}
            <div className="px-6 py-4 border-t border-chocolate-800">
                <p className="text-cream-200 text-xs">
                    Version 1.0.0
                </p>
            </div>

        </aside>
    );
}