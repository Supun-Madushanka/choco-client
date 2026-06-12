export interface NavItem {
    label: string;
    href: string;
    icon: string;
}

export interface NavGroup {
    group: string;
    items: NavItem[];
}

// All navigation items
export const allNavItems: NavGroup[] = [
    {
        group: "General",
        items: [
            {
                label: "Overview",
                href: "/dashboard/overview",
                icon: "📊",
            },
        ],
    },
    {
        group: "People",
        items: [
            {
                label: "User Management",
                href: "/dashboard/users",
                icon: "👥",
            },
            {
                label: "HR Management",
                href: "/dashboard/hr",
                icon: "👨‍💼",
            },
        ],
    },
    {
        group: "Operations",
        items: [
            {
                label: "Raw Materials",
                href: "/dashboard/raw-materials",
                icon: "🌿",
            },
            {
                label: "Suppliers",
                href: "/dashboard/suppliers",
                icon: "🤝",
            },
            {
                label: "Production",
                href: "/dashboard/production",
                icon: "🏭",
            },
            {
                label: "Inventory",
                href: "/dashboard/inventory",
                icon: "📦",
            },
            {
                label: "Sales & Orders",
                href: "/dashboard/sales",
                icon: "🛒",
            },
        ],
    },
    {
        group: "Finance",
        items: [
            {
                label: "Finance",
                href: "/dashboard/finance",
                icon: "💰",
            },
        ],
    },
    {
        group: "Analytics",
        items: [
            {
                label: "Reports",
                href: "/dashboard/reports",
                icon: "📈",
            },
        ],
    },
    {
        group: "System",
        items: [
            {
                label: "Settings",
                href: "/dashboard/settings",
                icon: "⚙️",
            },
        ],
    },
];

// Nav items per role
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
    ],
    HR_MANAGER: [
        "/dashboard/hr",
        "/dashboard/reports",
    ],
    HR_OFFICER: [
        "/dashboard/hr",
        "/dashboard/reports",
    ],
    PRODUCTION_MANAGER: [
        "/dashboard/production",
        "/dashboard/inventory",
        "/dashboard/raw-materials",
        "/dashboard/reports",
    ],
    PRODUCTION_SUPERVISOR: [
        "/dashboard/production",
        "/dashboard/inventory",
    ],
    PRODUCTION_OPERATOR: [
        "/dashboard/production",
    ],
    WAREHOUSE_MANAGER: [
        "/dashboard/inventory",
        "/dashboard/raw-materials",
        "/dashboard/reports",
    ],
    WAREHOUSE_SUPERVISOR: [
        "/dashboard/inventory",
        "/dashboard/raw-materials",
    ],
    WAREHOUSE_STAFF: [
        "/dashboard/inventory",
        "/dashboard/raw-materials",
    ],
    FINANCE_MANAGER: [
        "/dashboard/finance",
        "/dashboard/reports",
    ],
    FINANCE_OFFICER: [
        "/dashboard/finance",
        "/dashboard/reports",
    ],
    SALES_MANAGER: [
        "/dashboard/sales",
        "/dashboard/finance",
        "/dashboard/reports",
    ],
    SALES_OFFICER: [
        "/dashboard/sales",
    ],
    PROCUREMENT_MANAGER: [
        "/dashboard/suppliers",
        "/dashboard/raw-materials",
        "/dashboard/reports",
    ],
    PROCUREMENT_OFFICER: [
        "/dashboard/suppliers",
        "/dashboard/raw-materials",
    ],
    QC_MANAGER: [
        "/dashboard/production",
        "/dashboard/reports",
    ],
    QC_CONTROLLER: [
        "/dashboard/production",
    ],
};

// Helper — get nav items for a role
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