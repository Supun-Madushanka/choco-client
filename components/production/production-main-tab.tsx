"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tags } from "lucide-react";
import CategoriesTab from "./categories/categories-tab";

export default function ProductionMainTab() {
  return (
    <Tabs defaultValue="categories" className="w-full space-y-4">

      <TabsList className="grid grid-cols-6 w-full">

        <TabsTrigger value="categories" className="gap-2">
            <Tags size={16} />
          Categories
        </TabsTrigger>

      </TabsList>

      <TabsContent value="categories">
        <CategoriesTab />
      </TabsContent>
      
    </Tabs>
  )
}
