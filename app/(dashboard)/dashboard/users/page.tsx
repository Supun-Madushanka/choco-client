"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/user-service";
import { UserResponse } from "@/types/user";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import UserStatsCards from "@/components/users/user-stats-cards";
import UsersTable from "@/components/users/users-table";
import InviteUserDialog from "@/components/users/invite-user-dialog";
import { useAuthStore } from "@/store/auth-store";

export default function UsersPage() {

    const { user } = useAuthStore();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteOpen, setInviteOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers();
            setUsers(response.data);
        } catch {
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const isSuperAdmin = user?.role === "SUPER_ADMIN";

    return (
        <div>
            <PageHeader
                title="User Management"
                description="Manage all system users and invitations"
                action={
                    isSuperAdmin && (
                        <Button
                            onClick={() => setInviteOpen(true)}
                            className="bg-primary hover:bg-primary/80 gap-2"
                        >
                            <UserPlus size={16} />
                            Invite User
                        </Button>
                    )
                }
            />

            {/* Stats */}
            <UserStatsCards users={users} loading={loading} />

            {/* Table */}
            <UsersTable
                users={users}
                loading={loading}
                onRefresh={fetchUsers}
            />

            {/* Invite Dialog */}
            <InviteUserDialog
                open={inviteOpen}
                onClose={() => setInviteOpen(false)}
                onSuccess={() => {
                    setInviteOpen(false);
                    fetchUsers();
                }}
            />
        </div>
    );
}