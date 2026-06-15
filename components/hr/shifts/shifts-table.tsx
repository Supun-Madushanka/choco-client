"use client";

import { useState } from "react";
import { ShiftResponse } from "@/types/shift";
import { shiftService } from "@/services/shift-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, Pencil, Trash2, Clock } from "lucide-react";
import EditShiftDialog from "./edit-shift-dialog";
import { Card, CardContent } from "@/components/ui/card";

interface ShiftsTableProps {
    shifts: ShiftResponse[];
    loading: boolean;
    onRefresh: () => void;
    canManage: boolean;
}

export default function ShiftsTable({
    shifts,
    loading,
    onRefresh,
    canManage,
}: ShiftsTableProps) {

    const [editShift, setEditShift] = useState<ShiftResponse | null>(null);
    const [deleteShift, setDeleteShift] = useState<ShiftResponse | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteShift) return;
        setDeleting(true);
        try {
            await shiftService.deleteShift(Number(deleteShift.id));
            onRefresh();
        } catch {
            console.error("Failed to delete shift");
        } finally {
            setDeleting(false);
            setDeleteShift(null);
        }
    };

    const getTypeBadgeClass = (type: string) => {
        switch (type) {
            case "FIXED":
                return "bg-blue-50 text-blue-600 border-blue-200";
            case "FLEXIBLE":
                return "bg-purple-50 text-purple-600 border-purple-200";
            case "ROTATING":
                return "bg-warning-light text-warning border-warning/20";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    // Format "08:00:00" → "08:00 AM"
    const formatTime = (time: string) => {
        const [hour, minute] = time.split(":");
        const date = new Date();
        date.setHours(parseInt(hour), parseInt(minute));
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-card border border-cream-200
                            shadow-card overflow-hidden">
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Name
                                </TableHead>
                                <TableHead>
                                    Time
                                </TableHead>
                                <TableHead>
                                    Type
                                </TableHead>
                                <TableHead>
                                    Description
                                </TableHead>
                                <TableHead>
                                    Status
                                </TableHead>
                                {canManage && (
                                    <TableHead>
                                        Actions
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shifts.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-5">
                                        No shifts found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                shifts.map((shift) => (
                                    <TableRow
                                        key={shift.id}
                                    >

                                        <TableCell>
                                                {shift.name}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-1.5
                                                            text-sm text-text-primary">
                                                <Clock size={13} className="text-text-primary" />
                                                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getTypeBadgeClass(shift.type)}`}>
                                                {shift.type}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                                {shift.description || "—"}
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${
                                                    shift.isActive
                                                        ? "bg-success-light text-success border-success/20"
                                                        : "bg-cream-100 text-text-muted border-cream-200"
                                                }`}>
                                                {shift.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>

                                        {canManage && (
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
                                                <DropdownMenuContent align="end" className="w-36">
                                                    <DropdownMenuItem
                                                        onClick={() => setEditShift(shift)}
                                                        className="gap-2 cursor-pointer">
                                                        <Pencil size={14} />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => setDeleteShift(shift)}
                                                        className="gap-2 cursor-pointer text-error
                                                                   focus:text-error focus:bg-error-light">
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>

            {/* Edit Dialog */}
            <EditShiftDialog
                shift={editShift}
                open={!!editShift}
                onClose={() => setEditShift(null)}
                onSuccess={() => {
                    setEditShift(null);
                    onRefresh();
                }}
            />

            {/* Delete Confirm */}
            <AlertDialog
                open={!!deleteShift}
                onOpenChange={(open) => !open && setDeleteShift(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Shift</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-text-primary">
                                {deleteShift?.name}
                            </span>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={deleting}
                            onClick={handleDelete}
                            className="bg-error hover:bg-error/90">
                            {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}