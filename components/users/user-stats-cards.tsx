import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserX } from "lucide-react";
import { UserResponse } from "@/types/user";

interface UserStatsCardsProps {
    users: UserResponse[];
    loading: boolean;
}

export default function UserStatsCards({
    users,
    loading,
}: UserStatsCardsProps) {

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive).length;
    const inactiveUsers = users.filter((u) => !u.isActive).length;

    const stats = [
        {
            title: "Total Users",
            value: totalUsers,
            icon: Users,
            color: "bg-blue-50 text-blue-600",
        },
        {
            title: "Active Users",
            value: activeUsers,
            icon: UserCheck,
            color: "bg-success-light text-success",
        },
        {
            title: "Inactive Users",
            value: inactiveUsers,
            icon: UserX,
            color: "bg-error-light text-error",
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-cream-200">
                        <CardContent className="p-5">
                            <Skeleton className="h-4 w-24 mb-3" />
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card
                        key={stat.title}
                        className="border-cream-200 shadow-card">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-text-muted mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-text-primary">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`w-11 h-11 rounded-xl
                                                flex items-center justify-center
                                                ${stat.color}`}>
                                    <Icon size={20} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}