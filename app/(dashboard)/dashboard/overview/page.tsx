import PageHeader from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Factory,
    ShoppingCart,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Package,
    Wallet,
} from "lucide-react";

// Stat card data
const stats = [
    {
        title: "Total Employees",
        value: "248",
        change: "+12 this month",
        trend: "up",
        icon: Users,
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Today's Production",
        value: "1,240 kg",
        change: "+8% vs yesterday",
        trend: "up",
        icon: Factory,
        color: "bg-amber-50 text-amber-600",
    },
    {
        title: "Pending Orders",
        value: "34",
        change: "12 need approval",
        trend: "neutral",
        icon: ShoppingCart,
        color: "bg-purple-50 text-purple-600",
    },
    {
        title: "Low Stock Alerts",
        value: "7",
        change: "3 critical",
        trend: "down",
        icon: AlertTriangle,
        color: "bg-red-50 text-red-600",
    },
    {
        title: "Monthly Revenue",
        value: "LKR 4.2M",
        change: "+18% vs last month",
        trend: "up",
        icon: Wallet,
        color: "bg-green-50 text-green-600",
    },
    {
        title: "Finished Stock",
        value: "8,420 pcs",
        change: "Across 3 warehouses",
        trend: "neutral",
        icon: Package,
        color: "bg-indigo-50 text-indigo-600",
    },
];

// Recent orders data
const recentOrders = [
    {
        id: "SO-001",
        customer: "Keells Super",
        amount: "LKR 245,000",
        status: "APPROVED",
        date: "Today",
    },
    {
        id: "SO-002",
        customer: "Cargills Food City",
        amount: "LKR 182,000",
        status: "PROCESSING",
        date: "Today",
    },
    {
        id: "SO-003",
        customer: "Dubai Sweets LLC",
        amount: "USD 3,200",
        status: "PENDING_APPROVAL",
        date: "Yesterday",
    },
    {
        id: "SO-004",
        customer: "Singapore Treats",
        amount: "USD 5,800",
        status: "SHIPPED",
        date: "Yesterday",
    },
    {
        id: "SO-005",
        customer: "Arpico Supercentre",
        amount: "LKR 98,000",
        status: "DELIVERED",
        date: "2 days ago",
    },
];

// Production batches
const productionBatches = [
    {
        batch: "BAT-2026-001",
        product: "Dark Chocolate Bar",
        quantity: "500 kg",
        status: "IN_PROGRESS",
    },
    {
        batch: "BAT-2026-002",
        product: "Milk Chocolate Bar",
        quantity: "300 kg",
        status: "QC_PENDING",
    },
    {
        batch: "BAT-2026-003",
        product: "White Chocolate Bar",
        quantity: "200 kg",
        status: "STOCKED",
    },
    {
        batch: "BAT-2026-004",
        product: "Truffle Box",
        quantity: "150 pcs",
        status: "QC_DONE",
    },
];

const getOrderStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
        PENDING_APPROVAL: {
            label: "Pending",
            className: "bg-warning-light text-warning border-warning/20",
        },
        APPROVED: {
            label: "Approved",
            className: "bg-info-light text-info border-info/20",
        },
        PROCESSING: {
            label: "Processing",
            className: "bg-purple-50 text-purple-600 border-purple-200",
        },
        SHIPPED: {
            label: "Shipped",
            className: "bg-blue-50 text-blue-600 border-blue-200",
        },
        DELIVERED: {
            label: "Delivered",
            className: "bg-success-light text-success border-success/20",
        },
    };
    return map[status] || {
        label: status,
        className: "bg-cream-100 text-text-secondary",
    };
};

const getBatchStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
        IN_PROGRESS: {
            label: "In Progress",
            className: "bg-blue-50 text-blue-600 border-blue-200",
        },
        QC_PENDING: {
            label: "QC Pending",
            className: "bg-warning-light text-warning border-warning/20",
        },
        QC_DONE: {
            label: "QC Done",
            className: "bg-purple-50 text-purple-600 border-purple-200",
        },
        STOCKED: {
            label: "Stocked",
            className: "bg-success-light text-success border-success/20",
        },
    };
    return map[status] || {
        label: status,
        className: "bg-cream-100 text-text-secondary",
    };
};

export default function OverviewPage() {
    return (
        <div>
            <PageHeader
                title="Dashboard Overview"
                description="Welcome back! Here's what's happening today."
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="border-cream-200 shadow-card">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-text-muted mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-text-primary">
                                            {stat.value}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1.5">
                                            {stat.trend === "up" && (
                                                <TrendingUp size={13} className="text-success" />
                                            )}
                                            {stat.trend === "down" && (
                                                <TrendingDown size={13} className="text-error" />
                                            )}
                                            <p className={`text-xs ${
                                                stat.trend === "up"
                                                    ? "text-success"
                                                    : stat.trend === "down"
                                                    ? "text-error"
                                                    : "text-text-muted"
                                            }`}>
                                                {stat.change}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                                        <Icon size={20} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Recent Orders */}
                <Card className="border-cream-200 shadow-card">
                    <CardHeader className="pb-3 border-b border-cream-200">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-text-primary">
                                Recent Orders
                            </CardTitle>
                            <Badge
                                variant="outline"
                                className="text-xs text-text-muted border-cream-200">
                                Last 2 days
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-cream-200">
                            {recentOrders.map((order) => {
                                const badge = getOrderStatusBadge(order.status);
                                return (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between px-5 py-3.5 hover:bg-cream-50 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">
                                                {order.customer}
                                            </p>
                                            <p className="text-xs text-text-muted mt-0.5">
                                                {order.id} · {order.date}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-text-primary">
                                                {order.amount}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs mt-1 ${badge.className}`}>
                                                {badge.label}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Production Batches */}
                <Card className="border-cream-200 shadow-card">
                    <CardHeader className="pb-3 border-b border-cream-200">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-text-primary">
                                Production Batches
                            </CardTitle>
                            <Badge
                                variant="outline"
                                className="text-xs text-text-muted border-cream-200">
                                Active
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-cream-200">
                            {productionBatches.map((batch) => {
                                const badge = getBatchStatusBadge(batch.status);
                                return (
                                    <div
                                        key={batch.batch}
                                        className="flex items-center justify-between px-5 py-3.5 hover:bg-cream-50 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">
                                                {batch.product}
                                            </p>
                                            <p className="text-xs text-text-muted mt-0.5">
                                                {batch.batch} · {batch.quantity}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${badge.className}`}>
                                            {badge.label}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}