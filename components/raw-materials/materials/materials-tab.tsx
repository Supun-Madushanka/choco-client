"use client";

import { useState, useEffect, useCallback } from "react";
import { rawMaterialService } from "@/services/raw-material-service";
import { rawMaterialCategoryService } from "@/services/raw-material-category-service";
import { warehouseStockService } from "@/services/warehouse-stock-service";
import { RawMaterialResponse } from "@/types/raw-material";
import { RawMaterialCategoryResponse } from "@/types/raw-material-category";
import MaterialsTable from "./materials-table";
import CreateMaterialDialog from "./create-material-dialog";
import ManageCategoriesDialog from "./manage-categories-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function MaterialsTab() {

    const [materials, setMaterials] = useState<RawMaterialResponse[]>([]);
    const [categories, setCategories] =
        useState<RawMaterialCategoryResponse[]>([]);
    const [stockByMaterial, setStockByMaterial] =
        useState<Record<number, number>>({});
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [materialsRes, categoriesRes, stockRes] = await Promise.all([
                selectedCategory === "all"
                    ? rawMaterialService.getAllRawMaterials()
                    : rawMaterialService.getByCategory(parseInt(selectedCategory)),
                rawMaterialCategoryService.getAllCategories(),
                warehouseStockService.getAllStock(),
            ]);

            setMaterials(materialsRes.data);
            setCategories(categoriesRes.data);

            // Sum stock per raw material across all warehouses
            const stockMap: Record<number, number> = {};
            stockRes.data.forEach((stock) => {
                stockMap[stock.rawMaterialId] =
                    (stockMap[stock.rawMaterialId] || 0) + stock.quantity;
            });
            setStockByMaterial(stockMap);
        } catch {
            console.error("Failed to fetch raw materials data");
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Raw Materials
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({materials.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage raw material catalog and stock levels
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-2 w-full lg:w-auto">
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}>
                        <SelectTrigger className="border-cream-200
                                                   focus:ring-gold-500 w-full lg:w-44">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={String(cat.id)}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                
                    <ManageCategoriesDialog onChange={fetchAll} />
                    <CreateMaterialDialog onSuccess={fetchAll} />
                    
                </div>
            </div>

            <MaterialsTable
                materials={materials}
                stockByMaterial={stockByMaterial}
                loading={loading}
                onRefresh={fetchAll}
            />
        </div>
    );
}