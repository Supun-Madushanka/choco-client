"use client";

import { MachineResponse } from "@/types/machine";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface MachineHeaderProps {
    machine: MachineResponse;
}

export default function MachineHeader({ machine }: MachineHeaderProps) {

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

    return (
        <Card className="border-cream-200 shadow-card mb-4">
            <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start
                                sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg font-bold text-text-primary">
                                {machine.name}
                            </h2>
                            <Badge
                                variant="outline"
                                className={`text-xs ${getStatusBadgeClass(machine.status)}`}>
                                {machine.status}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge
                                variant="outline"
                                className="text-xs font-mono border-cream-200 text-text-secondary">
                                {machine.code}
                            </Badge>
                            {machine.model && (
                                <span className="text-sm text-text-muted">
                                    {machine.model}
                                </span>
                            )}
                        </div>

                        {machine.serialNo && (
                            <p className="text-sm text-text-secondary mt-1">
                                Serial No: <span className="font-mono">{machine.serialNo}</span>
                            </p>
                        )}

                        {machine.purchaseDate && (
                            <p className="text-sm text-text-muted mt-0.5">
                                Purchased:{" "}
                                {format(new Date(machine.purchaseDate), "dd MMM yyyy")}
                            </p>
                        )}
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                        {machine.lastMaintenance && (
                            <div>
                                <p className="text-xs text-text-muted">Last Maintenance</p>
                                <p className="text-sm font-medium text-text-primary">
                                    {format(new Date(machine.lastMaintenance), "dd MMM yyyy")}
                                </p>
                            </div>
                        )}
                        {machine.nextMaintenance && (
                            <div>
                                <p className="text-xs text-text-muted">Next Maintenance</p>
                                <p className="text-sm font-medium text-text-primary">
                                    {format(new Date(machine.nextMaintenance), "dd MMM yyyy")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}