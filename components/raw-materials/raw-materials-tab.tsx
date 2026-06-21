"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Warehouse, Leaf, SlidersHorizontal } from "lucide-react";
import WarehousesTab from "./warehouses/warehouse-tab";
import MaterialsTab from "./materials/materials-tab";
import StockMovementsTab from "./stock-movements/stock-movements-tab";

export default function RawMaterialsTab() {
  return (
    <Tabs defaultValue="warehouses" className="w-full space-y-4">

        <TabsList className="grid grid-cols-6 w-full">

            <TabsTrigger value="warehouses" className="gap-2">
                <Warehouse size={16} />
                Warehouses
            </TabsTrigger>

            <TabsTrigger value="raw-materials" className="gap-2">
                <Leaf size={16} />
                Raw Materials
            </TabsTrigger>

            <TabsTrigger value="stock-movements" className="gap-2">
                <SlidersHorizontal size={16} />
                Stock Movements
            </TabsTrigger>

        </TabsList>

        <TabsContent value="warehouses">
            <WarehousesTab />
        </TabsContent>

        <TabsContent value="raw-materials">
            <MaterialsTab />
        </TabsContent>

        <TabsContent value="stock-movements">
            <StockMovementsTab />
        </TabsContent>

    </Tabs>
  )
}
