"use client";

import { useEffect, useState } from "react";
import { warehouseService } from "@/services/warehouse-service";
import { WarehouseResponse } from "@/types/warehouse";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/auth-store";
import CreateWarehouseDialog from "./create-warehouse-dialog";
import WarehouseDetailsCard from "./warehouse-details-card";

const WarehouseMap = dynamic(() => import("./warehouse-map"), {
    ssr: false,
});

export default function WarehousesTab() {

    const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
    const [selected, setSelected] = useState<WarehouseResponse | null>(null);
    const { user } = useAuthStore();

    const isSuperAdmin = user?.role === "SUPER_ADMIN";

    const fetchWarehouses = async () => {
        const res = await warehouseService.getAllWarehouses();
        setWarehouses(res.data);

        if (selected) {
            const updated = res.data.find((w) => w.id === selected.id);
            setSelected(updated ?? null);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">Warehouses
                    <span className="ml-2 text-text-muted font-normal text-sm">
                        ({warehouses.length})
                    </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage warehouse locations
                    </p>
                </div>

                {isSuperAdmin && (
                    <CreateWarehouseDialog onSuccess={fetchWarehouses} />
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                <div className="lg:col-span-2 h-125 rounded-lg border overflow-hidden">
                    <WarehouseMap
                        warehouses={warehouses}
                        selected={selected}
                        onSelect={setSelected}
                    />
                </div>

                <WarehouseDetailsCard
                    warehouse={selected}
                    onRefresh={fetchWarehouses}
                />
            </div>
        </div>
    );
}