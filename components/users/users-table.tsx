"use client";

import { useState } from "react";
import { UserResponse } from "@/types/user";
import { userService } from "@/services/user-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    MoreHorizontal,
    UserCheck,
    UserX,
    Shield,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { format } from "date-fns";

interface UsersTableProps {
    users: UserResponse[];
    loading: boolean;
    onRefresh: () => void;
}

export default function UsersTable({
    users,
    loading,
    onRefresh,
}: UsersTableProps) {

    const { user: currentUser } = useAuthStore();
    const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

    const [actionLoading, setActionLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: "activate" | "deactivate" | null;
        userId: number | null;
        userName: string;
    }>({
        open: false,
        type: null,
        userId: null,
        userName: "",
    });

    const handleActivate = async (userId: number) => {
        setActionLoading(true);
        try {
            await userService.activateUser(userId);
            onRefresh();
        } catch {
            console.error("Failed to activate user");
        } finally {
            setActionLoading(false);
            setConfirmDialog({
                open: false,
                type: null,
                userId: null,
                userName: "",
            });
        }
    };

    const handleDeactivate = async (userId: number) => {
        setActionLoading(true);
        try {
            await userService.deactivateUser(userId);
            onRefresh();
        } catch {
            console.error("Failed to deactivate user");
        } finally {
            setActionLoading(false);
            setConfirmDialog({
                open: false,
                type: null,
                userId: null,
                userName: "",
            });
        }
    };

    const getRoleBadgeClass = (level: string) => {
        switch (level) {
            case "TOP":
                return "bg-purple-50 text-purple-700 border-purple-200";
            case "MANAGER":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "STAFF":
                return "bg-cream-100 text-text-secondary border-cream-200";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-card border border-cream-200
                            shadow-card overflow-hidden">
                <div className="p-4 border-b border-cream-200">
                    <Skeleton className="h-5 w-32" />
                </div>
                <div className="divide-y divide-cream-200">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4">
                            <Skeleton className="w-9 h-9 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-card border border-cream-200
                            shadow-card overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between
                                px-5 py-4 border-b border-cream-200">
                    <p className="text-sm font-semibold text-text-primary">
                        All Users
                        <span className="ml-2 text-text-muted font-normal">
                            ({users.length})
                        </span>
                    </p>
                </div>

                {/* Table — scrollable on mobile */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-cream-50 hover:bg-cream-50">
                                <TableHead className="text-text-secondary font-medium">
                                    User
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium hidden md:table-cell">
                                    Role
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium">
                                    Status
                                </TableHead>
                                <TableHead className="text-text-secondary font-medium hidden lg:table-cell">
                                    Last Login
                                </TableHead>
                                {isSuperAdmin && (
                                    <TableHead className="text-text-secondary font-medium w-12">
                                        
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-12 text-text-muted">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow
                                        key={user.userId}
                                        className="hover:bg-cream-50 transition-colors">

                                        {/* User */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-9 h-9 shrink-0">
                                                    <AvatarFallback
                                                        className="bg-chocolate-900
                                                                   text-white text-sm
                                                                   font-semibold">
                                                        {user.fullName
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium
                                                                  text-text-primary truncate">
                                                        {user.fullName}
                                                    </p>
                                                    <p className="text-xs text-text-muted truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Role */}
                                        <TableCell className="hidden md:table-cell">
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getRoleBadgeClass(user.roleLevel)}`}>
                                                <Shield size={10} className="mr-1" />
                                                {user.roleDisplayName}
                                            </Badge>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${
                                                    user.isActive
                                                        ? "bg-success-light text-success border-success/20"
                                                        : "bg-error-light text-error border-error/20"
                                                }`}>
                                                {user.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>

                                        {/* Last Login */}
                                        <TableCell className="hidden lg:table-cell text-sm text-text-muted">
                                            {user.lastLoginAt
                                                ? format(
                                                    new Date(user.lastLoginAt),
                                                    "dd MMM yyyy, HH:mm"
                                                )
                                                : "Never"}
                                        </TableCell>

                                        {/* Actions */}
                                        {isSuperAdmin && (
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-text-muted">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        {user.isActive ? (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setConfirmDialog({
                                                                        open: true,
                                                                        type: "deactivate",
                                                                        userId: user.userId,
                                                                        userName: user.fullName,
                                                                    })
                                                                }
                                                                className="gap-2 cursor-pointer text-error focus:text-error focus:bg-error-light">
                                                                <UserX size={14} />
                                                                Deactivate
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setConfirmDialog({
                                                                        open: true,
                                                                        type: "activate",
                                                                        userId: user.userId,
                                                                        userName: user.fullName,
                                                                    })
                                                                }
                                                                className="gap-2 cursor-pointer text-success focus:text-success focus:bg-success-light">
                                                                <UserCheck size={14} />
                                                                Activate
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Confirm Dialog */}
            <AlertDialog
                open={confirmDialog.open}
                onOpenChange={(open) =>
                    setConfirmDialog((prev) => ({ ...prev, open }))
                }>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmDialog.type === "deactivate"
                                ? "Deactivate User"
                                : "Activate User"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog.type === "deactivate"
                                ? `Are you sure you want to deactivate ${confirmDialog.userName}? They will not be able to login.`
                                : `Are you sure you want to activate ${confirmDialog.userName}? They will be able to login again.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={actionLoading}
                            onClick={() => {
                                if (confirmDialog.userId) {
                                    confirmDialog.type === "deactivate"
                                        ? handleDeactivate(confirmDialog.userId)
                                        : handleActivate(confirmDialog.userId);
                                }
                            }}
                            className={
                                confirmDialog.type === "deactivate"
                                    ? "bg-error hover:bg-error/90"
                                    : "bg-success hover:bg-success/90"
                            }>
                            {actionLoading
                                ? "Processing..."
                                : confirmDialog.type === "deactivate"
                                ? "Deactivate"
                                : "Activate"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}