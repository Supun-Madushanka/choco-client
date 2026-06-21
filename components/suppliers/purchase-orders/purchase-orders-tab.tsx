"use client";

import { useState, useEffect } from "react";
import { purchaseOrderService } from "@/services/purchase-order-service";
import { PurchaseOrderResponse } from "@/types/purchase-order";
import PurchaseOrdersTable from "./purchase-orders-table";
import CreatePurchaseOrderDialog from "./create-purchase-order-dialog";

export default function PurchaseOrdersTab() {

    const [orders, setOrders] = useState<PurchaseOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await purchaseOrderService.getAllPurchaseOrders();
            setOrders(response.data);
        } catch {
            console.error("Failed to fetch purchase orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center
                            lg:justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Purchase Orders
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({orders.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage purchase orders to suppliers
                    </p>
                </div>

                <CreatePurchaseOrderDialog onSuccess={fetchOrders} />
            </div>

            <PurchaseOrdersTable
                orders={orders}
                loading={loading}
            />
        </div>
    );
}