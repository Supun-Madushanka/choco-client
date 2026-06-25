"use client";

import { useState } from "react";
import { MachineResponse } from "@/types/machine";
import { machineService } from "@/services/machine-service";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import EditMachineDialog from "./edit-machine-dialog";
import { useRouter } from "next/navigation";

interface MachinesTableProps {
    machines: MachineResponse[];
    loading: boolean;
    onRefresh: () => void;
}

export default function MachinesTable({
    machines,
    loading,
    onRefresh,
}: MachinesTableProps) {

    const [editMachine, setEditMachine] = useState<MachineResponse | null>(null);
    const [deleteMachine, setDeleteMachine] = useState<MachineResponse | null>(null);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!deleteMachine) return;
        setDeleting(true);
        try {
            await machineService.deleteMachine(deleteMachine.id);
            onRefresh();
        } catch {
            console.error("Failed to delete machine");
        } finally {
            setDeleting(false);
            setDeleteMachine(null);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "OPERATIONAL":
                return "bg-success-light text-success border-success/20";
            case "MAINTENANCE":
                return "bg-warning-light text-warning border-warning/20";
            case "BREAKDOWN":
                return "bg-error-light text-error border-error/20";
            case "RETIRED":
                return "bg-cream-100 text-text-muted border-cream-200";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-card border border-cream-200
                            shadow-card overflow-hidden">
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
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
                                <TableHead>Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Model</TableHead>
                                <TableHead>Serial No</TableHead>
                                <TableHead>Purchase Date</TableHead>
                                <TableHead>Last Maintenance</TableHead>
                                <TableHead>Next Maintenance</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {machines.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="text-center py-6 text-text-muted">
                                        No machines found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                machines.map((machine) => (
                                    <TableRow
                                        key={machine.id}
                                        onClick={() => router.push(`/dashboard/production/machines/${machine.id}`)}
                                        className="hover:bg-cream-50 transition-colors cursor-pointer">

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-xs font-mono
                                                           border-cream-200 text-text-secondary">
                                                {machine.code}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm font-medium text-text-primary">
                                                {machine.name}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {machine.model || "-"}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary">
                                                {machine.serialNo || "-"}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary whitespace-nowrap">
                                                {machine.purchaseDate}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary whitespace-nowrap">
                                                {machine.lastMaintenance
                                                    ? format(new Date(machine.lastMaintenance), "dd MMM yyyy")
                                                    : "-"}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm text-text-secondary whitespace-nowrap">
                                                {machine.nextMaintenance
                                                    ? format(new Date(machine.nextMaintenance), "dd MMM yyyy")
                                                    : "-"}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getStatusBadgeClass(machine.status)}`}>
                                                {machine.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-text-muted">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem
                                                        onClick={() => setEditMachine(machine)}
                                                        className="gap-2 cursor-pointer">
                                                        <Pencil size={14} />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => setDeleteMachine(machine)}
                                                        className="gap-2 cursor-pointer text-error
                                                                   focus:text-error focus:bg-error-light">
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <EditMachineDialog
                machine={editMachine}
                open={!!editMachine}
                onClose={() => setEditMachine(null)}
                onSuccess={() => {
                    setEditMachine(null);
                    onRefresh();
                }}
            />

            <AlertDialog
                open={!!deleteMachine}
                onOpenChange={(open) => !open && setDeleteMachine(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Machine</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-text-primary">
                                {deleteMachine?.name}
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