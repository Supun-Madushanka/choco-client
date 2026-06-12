"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { getNavItemsForRole } from "@/components/layout/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { GiChocolateBar } from "react-icons/gi";

interface SidebarProps {
    onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {

    const pathname = usePathname();
    const { user } = useAuthStore();
    const navGroups = getNavItemsForRole(user?.role || "");

    return (
        <aside className="h-full w-65 bg-chocolate-900 flex flex-col">

            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5">
                <div className="bg-secondary-foreground p-3 rounded-xl">
                    <GiChocolateBar className="h-7 w-7 text-primary" />
                </div>
                <div>
                    <p className="text-white font-semibold text-sm leading-tight">
                        Ceylon Chocolate
                    </p>
                    <p className="text-white text-xs leading-tight">
                        Factory Management
                    </p>
                </div>
            </div>

            <Separator className="bg-chocolate-800" />

            {/* User Info */}
            {/* <div className="flex items-center gap-3 px-6 py-4">
                <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarFallback className="bg-gold-500 text-white text-sm font-semibold">
                        {user?.fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                        {user?.fullName}
                    </p>
                    <p className="text-cream-200 text-xs mt-0.5 truncate">
                        {user?.roleDisplayName}
                    </p>
                </div>
            </div> */}

            {/* <Separator className="bg-chocolate-800" /> */}

            {/* Navigation */}
            <ScrollArea className="flex-1 py-4 h-0">
                <nav className="px-3">
                    {navGroups.map((group) => (
                        <div key={group.group} className="mb-5">
                            <p className="text-xs font-semibold uppercase
                                          tracking-wider text-cream-200/60
                                          px-3 mb-1.5">
                                {group.group}
                            </p>
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const isActive = pathname.startsWith(item.href);
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5",
                                                "rounded-lg text-sm transition-all duration-200",
                                                isActive
                                                    ? "bg-gold-500 text-white font-medium shadow-sm"
                                                    : "text-cream-200 hover:bg-chocolate-800 hover:text-white"
                                            )}>
                                            <Icon size={17} className="shrink-0" />
                                            <span>{item.label}</span>
                                            {isActive && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </ScrollArea>

            <Separator className="bg-chocolate-800" />

            {/* Bottom */}
            <div className="px-6 py-4">
                <p className="text-cream-200/50 text-xs">Version 1.0.0</p>
            </div>

        </aside>
    );
}