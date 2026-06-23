"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Handshake, ShoppingCart, Package, ClipboardCheck } from "lucide-react";
import SuppliersTab from "./supplier/suppliers-tab";  
import PurchaseOrdersTab from "./purchase-orders/purchase-orders-tab";
import GRNTab from "./grn/grn-tab";  

export default function SuppliersMainTab() {
  return (
    <Tabs defaultValue="suppliers" className="w-full space-y-4">

        <TabsList className="grid grid-cols-6 w-full">

            <TabsTrigger value="suppliers" className="gap-2">
                <Handshake size={16} />
                Suppliers
            </TabsTrigger>

            <TabsTrigger value="purchase-orders" className="gap-2">
                <ShoppingCart size={16} />
                Purchase Orders
            </TabsTrigger>

            <TabsTrigger value="grn" className="gap-2">
                <ClipboardCheck size={16} />
                GRN
            </TabsTrigger>

        </TabsList>

        <TabsContent value="suppliers">
            <SuppliersTab />
        </TabsContent>

        <TabsContent value="purchase-orders">
            <PurchaseOrdersTab />
        </TabsContent>

        <TabsContent value="grn">
            <GRNTab />
        </TabsContent>

    </Tabs>
  )
}
