"use client";

import { useState, useEffect, useCallback } from "react";
import { stockMovementService } from "@/services/stock-movement-service";
import { warehouseService } from "@/services/warehouse-service";
import { rawMaterialService } from "@/services/raw-material-service";
import { StockMovementResponse } from "@/types/stock-movement";
import { WarehouseResponse } from "@/types/warehouse";
import { RawMaterialResponse } from "@/types/raw-material";
import StockMovementsTable from "./stock-movements-table";
import RecordMovementDialog from "./record-movement-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function StockMovementsTab() {

    const [movements, setMovements] = useState<StockMovementResponse[]>([]);
    const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
    const [materials, setMaterials] = useState<RawMaterialResponse[]>([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
    const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [warehousesRes, materialsRes] = await Promise.all([
                    warehouseService.getAllWarehouses(),
                    rawMaterialService.getAllRawMaterials(),
                ]);
                setWarehouses(warehousesRes.data);
                setMaterials(materialsRes.data);
            } catch {
                console.error("Failed to load filter options");
            }
        };
        fetchOptions();
    }, []);

    const fetchMovements = useCallback(async () => {
        setLoading(true);
        try {
            let response;
            if (selectedWarehouse !== "all") {
                response = await stockMovementService
                    .getByWarehouse(parseInt(selectedWarehouse));
            } else if (selectedMaterial !== "all") {
                response = await stockMovementService
                    .getByRawMaterial(parseInt(selectedMaterial));
            } else {
                response = await stockMovementService.getAllMovements();
            }
            setMovements(response.data);
        } catch {
            console.error("Failed to fetch stock movements");
        } finally {
            setLoading(false);
        }
    }, [selectedWarehouse, selectedMaterial]);

    useEffect(() => {
        fetchMovements();
    }, [fetchMovements]);

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center
                            lg:justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Stock Movements
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({movements.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Track stock movement history across warehouses
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-2 w-full lg:w-auto">
                    <Select
                        value={selectedWarehouse}
                        onValueChange={(value) => {
                            setSelectedWarehouse(value);
                            setSelectedMaterial("all");
                        }}>
                        <SelectTrigger className="border-cream-200
                                                   focus:ring-gold-500 w-full lg:w-44">
                            <SelectValue placeholder="All Warehouses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Warehouses</SelectItem>
                            {warehouses.map((wh) => (
                                <SelectItem key={wh.id} value={String(wh.id)}>
                                    {wh.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedMaterial}
                        onValueChange={(value) => {
                            setSelectedMaterial(value);
                            setSelectedWarehouse("all");
                        }}>
                        <SelectTrigger className="border-cream-200
                                                   focus:ring-gold-500 w-full lg:w-44">
                            <SelectValue placeholder="All Materials" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Materials</SelectItem>
                            {materials.map((mat) => (
                                <SelectItem key={mat.id} value={String(mat.id)}>
                                    {mat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <RecordMovementDialog onSuccess={fetchMovements} />
                </div>
            </div>

            <StockMovementsTable
                movements={movements}
                loading={loading}
            />
        </div>
    );
}