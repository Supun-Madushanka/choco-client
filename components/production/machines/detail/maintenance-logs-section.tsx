"use client";

import { useState, useEffect } from "react";
import { maintenanceLogService } from "@/services/maintenance-log-service";
import { MaintenanceLogResponse } from "@/types/maintenance-log";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import AddMaintenanceLogDialog from "./add-maintenance-log-dialog";

interface MaintenanceLogsSectionProps {
    machineId: number;
}

export default function MaintenanceLogsSection({
    machineId,
}: MaintenanceLogsSectionProps) {

    const [logs, setLogs] = useState<MaintenanceLogResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await maintenanceLogService.getLogsByMachine(machineId);
            setLogs(response.data);
        } catch {
            console.error("Failed to fetch maintenance logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [machineId]);

    const getTypeBadgeClass = (type: string) => {
        switch (type) {
            case "PREVENTIVE":
                return "bg-info-light text-info border-info/20";
            case "CORRECTIVE":
                return "bg-warning-light text-warning border-warning/20";
            case "EMERGENCY":
                return "bg-error-light text-error border-error/20";
            default:
                return "bg-cream-100 text-text-secondary border-cream-200";
        }
    };

    return (
        <Card className="border-cream-200 shadow-card">
            <CardHeader className="pb-3 border-b border-cream-200">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-text-primary">
                        Maintenance Logs
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({logs.length})
                        </span>
                    </CardTitle>
                    <AddMaintenanceLogDialog
                        machineId={machineId}
                        onSuccess={fetchLogs}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-text-secondary font-medium">
                                        Type
                                    </TableHead>
                                    <TableHead className="text-text-secondary font-medium">
                                        Description
                                    </TableHead>
                                    <TableHead className="text-text-secondary font-medium">
                                        Maintenance Date
                                    </TableHead>
                                    <TableHead className="text-text-secondary font-medium">
                                        Next Maintenance
                                    </TableHead>
                                    <TableHead className="text-text-secondary font-medium">
                                        Cost
                                    </TableHead>
                                    <TableHead className="text-text-secondary font-medium">
                                        Performed By
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-6 text-text-muted">
                                            No maintenance logs found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow
                                            key={log.id}
                                            className="hover:bg-cream-50">

                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getTypeBadgeClass(log.maintenanceType)}`}>
                                                    {log.maintenanceType}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <p className="text-sm text-text-secondary max-w-xs truncate">
                                                    {log.description}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                <p className="text-sm text-text-secondary whitespace-nowrap">
                                                    {format(new Date(log.maintenanceDate), "dd MMM yyyy")}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                <p className="text-sm text-text-secondary whitespace-nowrap">
                                                    {log.nextMaintenanceDate
                                                        ? format(new Date(log.nextMaintenanceDate), "dd MMM yyyy")
                                                        : "—"}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                <p className="text-sm text-text-secondary">
                                                    LKR {log.cost.toLocaleString()}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                <p className="text-sm text-text-secondary">
                                                    {log.performedByName}
                                                </p>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}