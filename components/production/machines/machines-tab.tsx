"use client";

import { useState, useEffect } from "react";
import { machineService } from "@/services/machine-service";
import { MachineResponse } from "@/types/machine";
import MachinesTable from "./machines-table";
import CreateMachineDialog from "./create-machine-dialog";

export default function MachinesTab() {

    const [machines, setMachines] = useState<MachineResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMachines = async () => {
        setLoading(true);
        try {
            const response = await machineService.getAllMachines();
            setMachines(response.data);
        } catch {
            console.error("Failed to fetch machines");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center
                            lg:justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Machines
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({machines.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage factory machines and equipment
                    </p>
                </div>
                <CreateMachineDialog onSuccess={fetchMachines} />
            </div>

            <MachinesTable
                machines={machines}
                loading={loading}
                onRefresh={fetchMachines}
            />
        </div>
    );
}