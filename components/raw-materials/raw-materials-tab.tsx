"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Warehouse, Leaf } from "lucide-react";
import WarehousesTab from "./warehouses/warehouse-tab";
import MaterialsTab from "./materials/materials-tab";

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

        </TabsList>

        <TabsContent value="warehouses">
            <WarehousesTab />
        </TabsContent>

        <TabsContent value="raw-materials">
            <MaterialsTab />
        </TabsContent>

    </Tabs>
  )
}
