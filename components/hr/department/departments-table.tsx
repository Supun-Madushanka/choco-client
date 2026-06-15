"use client";

import { DepartmentResponse } from "@/types/department";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Building2,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
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

interface DepartmentsTableProps {
    departments: DepartmentResponse[];
    loading: boolean;
    onDelete: (id: number) => void;
    onEdit: (department: DepartmentResponse) => void;
    canManage: boolean;
}

export default function DepartmentsTable({
    departments,
    loading,
    onDelete,
    onEdit,
    canManage
}: DepartmentsTableProps) {

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        departmentId: number | null;
        departmentName: string;
    }>({
        open: false,
        departmentId: null,
        departmentName: "",
    });

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton
                        key={i}
                        className="h-14 w-full"
                    />
                ))}
            </div>
        );
    }

    if (departments.length === 0) {
        return (
            <div
                className="
                    border border-border
                    rounded-lg
                    py-12
                    text-center
                    bg-background
                "
            >
                <Building2
                    size={40}
                    className="
                        mx-auto
                        mb-4
                        text-muted-foreground
                    "
                />
                <h3 className="font-semibold">
                    No departments found
                </h3>
                <p className="text-sm text-muted-foreground">
                    Create your first department.
                </p>
            </div>
        );
    }

    return (

        <div
            className="
                rounded-lg
                border
                overflow-hidden
            "
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Name
                        </TableHead>
                        <TableHead>
                            Description
                        </TableHead>
                        <TableHead>
                            Created At
                        </TableHead>
                        {canManage && (
                            <TableHead className="w-12">
                                Actions
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {departments.map((department) => (
                        <TableRow
                            key={department.id}
                        >
                            <TableCell
                                className="font-medium"
                            >
                                {department.name}
                            </TableCell>
                            <TableCell>
                                {department.description}
                            </TableCell>
                            <TableCell>
                                {
                                    format(
                                        new Date(
                                            department.createdAt
                                        ),
                                        "dd MMM yyyy"
                                    )
                                }
                            </TableCell>
                        {canManage && (
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        asChild
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <MoreHorizontal
                                                size={16}
                                            />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                    >
                                        <DropdownMenuItem
                                            className="gap-2"
                                             onClick={() => onEdit(department)}
                                        >
                                            <Pencil
                                                size={14}
                                            />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="
                                                gap-2
                                                text-destructive
                                            "
                                            onClick={() =>
                                                setDeleteDialog({
                                                    open: true,
                                                    departmentId: department.id,
                                                    departmentName: department.name,
                                                })
                                            }
                                        >
                                            <Trash2
                                                size={14}
                                            />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <AlertDialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    setDeleteDialog(prev => ({
                        ...prev,
                        open,
                    }))
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Department
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete
                            <span className="font-semibold">
                                {" "}
                                {deleteDialog.departmentName}
                            </span>
                            ?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteDialog.departmentId) {
                                    onDelete(deleteDialog.departmentId);
                                }
                            }}
                            className="
                                bg-destructive
                                hover:bg-destructive/90
                            "
                        >
                                Delete   
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}