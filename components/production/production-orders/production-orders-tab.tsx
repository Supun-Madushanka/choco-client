"use client";

import { useState, useEffect } from "react";
import { productionOrderService } from "@/services/production-order-service";
import { ProductionOrderResponse } from "@/types/production-order";
import ProductionOrdersTable from "./production-orders-table";
import CreateProductionOrderDialog from "./create-production-order-dialog";

export default function ProductionOrdersTab() {

    const [orders, setOrders] = useState<ProductionOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await productionOrderService.getAllOrders();
            setOrders(response.data);
        } catch {
            console.error("Failed to fetch production orders");
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
                        Production Orders
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({orders.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage and track production orders
                    </p>
                </div>
                <CreateProductionOrderDialog onSuccess={fetchOrders} />
            </div>

            <ProductionOrdersTable
                orders={orders}
                loading={loading}
                onRefresh={fetchOrders}
            />
        </div>
    );
}