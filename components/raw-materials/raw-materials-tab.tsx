"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Warehouse } from "lucide-react";
import WarehousesTab from "./warehouses/warehouse-tab";

export default function RawMaterialsTab() {
  return (
    <Tabs defaultValue="warehouses" className="w-full space-y-4">

        <TabsList className="grid grid-cols-6 w-full">

            <TabsTrigger value="warehouses" className="gap-2">
                <Warehouse size={16} />
                Warehouses
            </TabsTrigger>

        </TabsList>

        <TabsContent value="warehouses">
            <WarehousesTab />
        </TabsContent>

    </Tabs>
  )
}
