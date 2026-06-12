import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Settings,
} from "lucide-react";

export const SIDEBAR_MENU = {
  SUPER_ADMIN: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      href: "/users",
      icon: Users,
    },
    {
      label: "Roles",
      href: "/roles",
      icon: ShieldCheck,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],

  HR_MANAGER: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
  ],
};