"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tags, Cog, Package } from "lucide-react";
import CategoriesTab from "./categories/categories-tab";
import MachinesTab from "./machines/machines-tab";
import ProductsTab from "./products/products-tab";

export default function ProductionMainTab() {
  return (
    <Tabs defaultValue="categories" className="w-full space-y-4">

      <TabsList className="grid grid-cols-6 w-full">

        <TabsTrigger value="categories" className="gap-2">
            <Tags size={16} />
          Categories
        </TabsTrigger>

        <TabsTrigger value="machines" className="gap-2">
            <Cog size={16} />
          Machines
        </TabsTrigger>

        <TabsTrigger value="products" className="gap-2">
            <Package size={16} />
          Products
        </TabsTrigger>

      </TabsList>

      <TabsContent value="categories">
        <CategoriesTab />
      </TabsContent>

      <TabsContent value="machines">
        <MachinesTab />
      </TabsContent>

      <TabsContent value="products">
        <ProductsTab />
      </TabsContent>
      
    </Tabs>
  )
}
