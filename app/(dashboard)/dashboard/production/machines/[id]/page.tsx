"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { machineService } from "@/services/machine-service";
import { MachineResponse } from "@/types/machine";
import PageHeader from "@/components/common/page-header";
import MachineHeader from "@/components/production/machines/detail/machine-header";
import MaintenanceLogsSection from "@/components/production/machines/detail/maintenance-logs-section";
import { Skeleton } from "@/components/ui/skeleton";

export default function MachineDetailPage() {

    const params = useParams();
    const id = Number(params.id);

    const [machine, setMachine] = useState<MachineResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMachine = useCallback(async () => {
        setLoading(true);
        try {
            const response = await machineService.getMachineById(id);
            setMachine(response.data);
        } catch {
            console.error("Failed to fetch machine");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchMachine();
    }, [fetchMachine]);

    if (loading || !machine) {
        return (
            <div>
                <PageHeader title="Machine" />
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title={machine.name}
                description="Machine details and maintenance history"
            />
            <MachineHeader machine={machine} />
            <MaintenanceLogsSection machineId={machine.id} />
        </div>
    );
}