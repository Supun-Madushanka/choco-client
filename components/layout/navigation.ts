import {
    LayoutDashboard,
    Users,
    UserCog,
    Leaf,
    Handshake,
    Factory,
    Package,
    ShoppingCart,
    Wallet,
    BarChart3,
    Settings,
    LucideIcon,
    ClipboardCheck,
} from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export interface NavGroup {
    group: string;
    items: NavItem[];
}

export const allNavItems: NavGroup[] = [
    {
        group: "General",
        items: [
            {
                label: "Overview",
                href: "/dashboard/overview",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        group: "My Workspace",
        items: [
            {
                label: "My Attendance",
                href: "/dashboard/attendance",
                icon: ClipboardCheck,
            },
        ],
    },
    {
        group: "People",
        items: [
            {
                label: "HR Management",
                href: "/dashboard/hr",
                icon: UserCog,
            },
            {
                label: "User Management",
                href: "/dashboard/users",
                icon: Users,
            },
        ],
    },
    {
        group: "Operations",
        items: [
            {
                label: "Production",
                href: "/dashboard/production",
                icon: Factory,
            },
            {
                label: "Raw Materials",
                href: "/dashboard/raw-materials",
                icon: Leaf,
            },
            {
                label: "Suppliers",
                href: "/dashboard/suppliers",
                icon: Handshake,
            },
            {
                label: "Inventory",
                href: "/dashboard/inventory",
                icon: Package,
            },
            {
                label: "Sales & Orders",
                href: "/dashboard/sales",
                icon: ShoppingCart,
            },
        ],
    },
    {
        group: "Finance",
        items: [
            {
                label: "Finance",
                href: "/dashboard/finance",
                icon: Wallet,
            },
        ],
    },
    {
        group: "Analytics",
        items: [
            {
                label: "Reports",
                href: "/dashboard/reports",
                icon: BarChart3,
            },
        ],
    },
    {
        group: "System",
        items: [
            {
                label: "Settings",
                href: "/dashboard/settings",
                icon: Settings,
            },
            {
                label: "Admin Settings",
                href: "/dashboard/admin-settings",
                icon: Settings,
            }
        ],
    },
];

export const roleNavItems: Record<string, string[]> = {
    SUPER_ADMIN: [
        "/dashboard/overview",
        "/dashboard/users",
        "/dashboard/hr",
        "/dashboard/raw-materials",
        "/dashboard/suppliers",
        "/dashboard/production",
        "/dashboard/inventory",
        "/dashboard/sales",
        "/dashboard/finance",
        "/dashboard/reports",
        "/dashboard/settings",
        "/dashboard/attendance",
    ],
    HR_MANAGER: [
        "/dashboard/hr",
        "/dashboard/reports",
        "/dashboard/users",
        "/dashboard/attendance",
    ],
    // HR_OFFICER: [
    //     "/dashboard/hr",
    //     "/dashboard/reports",
    // ],
    PRODUCTION_MANAGER: [
        "/dashboard/production",
        "/dashboard/inventory",
        "/dashboard/raw-materials",
        "/dashboard/reports",
        "/dashboard/attendance",
    ],
    // PRODUCTION_SUPERVISOR: [
    //     "/dashboard/production",
    //     "/dashboard/inventory",
    // ],
    // PRODUCTION_OPERATOR: [
    //     "/dashboard/production",
    // ],
    // WAREHOUSE_MANAGER: [
    //     "/dashboard/inventory",
    //     "/dashboard/raw-materials",
    //     "/dashboard/reports",
    // ],
    // WAREHOUSE_SUPERVISOR: [
    //     "/dashboard/inventory",
    //     "/dashboard/raw-materials",
    // ],
    // WAREHOUSE_STAFF: [
    //     "/dashboard/inventory",
    //     "/dashboard/raw-materials",
    // ],
    // FINANCE_MANAGER: [
    //     "/dashboard/finance",
    //     "/dashboard/reports",
    // ],
    // FINANCE_OFFICER: [
    //     "/dashboard/finance",
    //     "/dashboard/reports",
    // ],
    // SALES_MANAGER: [
    //     "/dashboard/sales",
    //     "/dashboard/finance",
    //     "/dashboard/reports",
    // ],
    // SALES_OFFICER: [
    //     "/dashboard/sales",
    // ],
    // PROCUREMENT_MANAGER: [
    //     "/dashboard/suppliers",
    //     "/dashboard/raw-materials",
    //     "/dashboard/reports",
    // ],
    // PROCUREMENT_OFFICER: [
    //     "/dashboard/suppliers",
    //     "/dashboard/raw-materials",
    // ],
    // QC_MANAGER: [
    //     "/dashboard/production",
    //     "/dashboard/reports",
    // ],
    // QC_CONTROLLER: [
    //     "/dashboard/production",
    // ],
};

export const getNavItemsForRole = (role: string): NavGroup[] => {
    const allowedRoutes = roleNavItems[role] || [];
    return allNavItems
        .map((group) => ({
            ...group,
            items: group.items.filter((item) =>
                allowedRoutes.includes(item.href)
            ),
        }))
        .filter((group) => group.items.length > 0);
};