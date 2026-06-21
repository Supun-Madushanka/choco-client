"use client";

import { useState, useEffect } from "react";
import { supplierService } from "@/services/supplier-service";
import { SupplierResponse } from "@/types/supplier";
import SuppliersTable from "./suppliers-table";
import CreateSupplierDialog from "./create-supplier-dialog";

export default function SuppliersTab() {

    const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const response = await supplierService.getAllSuppliers();
            setSuppliers(response.data);
        } catch {
            console.error("Failed to fetch suppliers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center
                            lg:justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-base font-semibold text-text-primary">
                        Suppliers
                        <span className="ml-2 text-text-muted font-normal text-sm">
                            ({suppliers.length})
                        </span>
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage suppliers and their materials
                    </p>
                </div>

                <CreateSupplierDialog onSuccess={fetchSuppliers} />
            </div>

            <SuppliersTable
                suppliers={suppliers}
                loading={loading}
                onRefresh={fetchSuppliers}
            />
        </div>
    );
}