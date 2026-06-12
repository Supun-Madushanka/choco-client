"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Factory } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { SIDEBAR_MENU } from "@/lib/sidebar-config";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);

  const role =
    user?.role as keyof typeof SIDEBAR_MENU;

  const menuItems = role
    ? SIDEBAR_MENU[role] ?? []
    : [];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <Factory className="h-6 w-6" />

          <div>
            <h2 className="font-bold">
              Ceylon Chocolate
            </h2>

            <p className="text-xs text-sidebar-foreground/70">
              Management System
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <Icon />

                        <span>
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2 text-sm">
          <p className="font-medium">
            {user?.fullName}
          </p>

          <p className="text-sidebar-foreground/70">
            {user?.roleDisplayName}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}